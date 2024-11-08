import { MicVAD, RealTimeVADOptions } from "@ricky0123/vad-web";
import { setupInterceptors } from "../RequestInterceptor";
import { convertToWavBlob } from "../audio/AudioEncoder";
import { createMachine, assign } from "xstate";
import EventBus from "../events/EventBus.js";
import { debounce } from "lodash";
import { getResourceUrl } from "../ResourceModule";
import { customModelFetcher } from "../vad/custom-model-fetcher";
import { isFirefox } from "../UserAgentModule";
import { AudioCapabilityDetector } from "../audio/AudioCapabilities";
import getMessage from "../i18n";

const fullWorkletURL: string = isFirefox()
  ? getResourceUrl("vad.worklet.bundle.js")
  : getResourceUrl("vad.worklet.bundle.min.js");
let listening: boolean = false;
let stream: MediaStream;

// Assuming EventBus is a property of Window and is of type any
// You might want to provide a more specific type if available
declare global {
  interface Window {
    EventBus: any;
  }
}

let audioMimeType: string = "audio/wav";
let speechStartTime: number = 0;
const threshold: number = 1000; // 1000 ms = 1 second, about the length of "Hey, Pi"

setupInterceptors();

// Variable to hold the microphone instance. Now has a specific type.
let microphone: MicVAD | null = null;

let previousDeviceIds: string[] = [];
let previousDefaultDevice: MediaDeviceInfo | null = null;

async function monitorAudioInputDevices() {
  if (microphone === null) {
    // No microphone instance, so nothing to monitor
    return;
  }

  const devices = await navigator.mediaDevices.enumerateDevices();
  const audioInputDevices = devices.filter(
    (device) => device.kind === "audioinput"
  );

  // Get the current default device
  const defaultDevice = audioInputDevices.find(
    (device) => device.deviceId === "default"
  );

  // Check if the default device has changed
  if (
    defaultDevice &&
    (!previousDefaultDevice ||
      defaultDevice.label !== previousDefaultDevice.label)
  ) {
    console.log(
      `The default audio input device has changed: ${defaultDevice.label}`
    );
    const firstTime = previousDefaultDevice === null;
    previousDefaultDevice = defaultDevice;
    if (!firstTime) {
      const deviceId = defaultDevice.deviceId;
      const deviceLabel = defaultDevice.label;
      EventBus.emit("saypi:audio:reconnect", { deviceId, deviceLabel }); // instruct saypi to switch to the new default device
    }
  }

  const currentDeviceIds = audioInputDevices.map((device) => device.deviceId);

  const addedDevices = currentDeviceIds.filter(
    (id) => !previousDeviceIds.includes(id)
  );
  const removedDevices = previousDeviceIds.filter(
    (id) => !currentDeviceIds.includes(id)
  );

  if (microphone) {
    const track = stream.getTracks()[0];
    const settings = track.getSettings();
    const deviceId = settings.deviceId;
    const deviceLabel = audioInputDevices.find(
      (device) => device.deviceId === deviceId
    )?.label;

    if (deviceId && addedDevices.includes(deviceId)) {
      console.log(
        `The audio input device used by MicVAD has been added: ${deviceId} (${deviceLabel}))`
      );
      EventBus.emit("saypi:audio:connected", { deviceId, deviceLabel });
    }

    if (deviceId && removedDevices.includes(deviceId)) {
      console.log("The audio input device used by MicVAD has been removed.");
    }
  }

  addedDevices.forEach((id) => {
    const label = audioInputDevices.find(
      (device) => device.deviceId === id
    )?.label;
    console.log(`An audio input device has been added: ${id} (${label})`);
  });
  removedDevices.forEach((id) => {
    const label = audioInputDevices.find(
      (device) => device.deviceId === id
    )?.label;
    console.log(`An audio input device has been removed: ${id} (${label})`);
  });

  previousDeviceIds = currentDeviceIds;
}

// Call the function every 5 seconds
setInterval(monitorAudioInputDevices, 5000);

// Define the callbacks manually if they are not exported
interface MyRealTimeVADCallbacks {
  onSpeechStart?: () => any;
  onSpeechEnd?: (audio: Float32Array) => any;
  onVADMisfire?: () => any;
}

const debouncedOnFrameProcessed = debounce(
  (probabilities: { isSpeech: number; notSpeech: number }) => {
    EventBus.emit("audio:frame", probabilities);
  },
  1000 / 60
); // 1000ms / 60 frames per second

/**
 * At min speech frames of 3, vad will start to detect speech after around 1 word
 * At min speech frames of 5, vad will start to detect speech after around 2 words
 * At min speech frames of 10, vad will start to detect speech after around 4 words
 **/

// Options for MicVAD
const micVADOptions: Partial<RealTimeVADOptions> & MyRealTimeVADCallbacks = {
  workletURL: fullWorkletURL,
  positiveSpeechThreshold: 0.8,
  minSpeechFrames: 3,
  preSpeechPadFrames: 10,
  onSpeechStart: () => {
    console.debug("User speech started");
    speechStartTime = Date.now();
    EventBus.emit("saypi:userSpeaking");
  },
  onSpeechEnd: (rawAudioData: Float32Array) => {
    console.debug("User speech ended");
    const speechStopTime = Date.now();
    const speechDuration = speechStopTime - speechStartTime;
    const audioBlob = convertToWavBlob(rawAudioData);
    EventBus.emit("audio:dataavailable", {
      blob: audioBlob,
      duration: speechDuration,
    });
  },
  onVADMisfire: () => {
    console.debug("Cancelled. Audio was not speech.");
    EventBus.emit("saypi:userStoppedSpeaking", { duration: 0 });
  },
  onFrameProcessed(probabilities: { isSpeech: number; notSpeech: number }) {
    debouncedOnFrameProcessed(probabilities);
  },
};

const firefoxMicVADOptions: Partial<RealTimeVADOptions> &
  MyRealTimeVADCallbacks = {
  ...micVADOptions,
  workletOptions: {},
  ortConfig: (ort: any) => {
    ort.env.wasm.wasmPaths = chrome.runtime.getURL("public/");
  },
  modelFetcher: customModelFetcher,
};

async function checkAudioCapabilities() {
  const detector = new AudioCapabilityDetector();
  const thresholds = {
    minimumEchoQuality: 0.5,
    preferredEchoQuality: 0.75,
  };
  const config = await detector.configureAudioFeatures(thresholds);

  if (config.enableInterruptions) {
    console.debug("The interrupt feature can be enabled", config);
  }

  if (config.showQualityWarning) {
    console.warn(
      "Echo cancellation quality is low. Consider disabling the interrupt feature."
    );
    const actualScore =
      config.audioQualityDetails.echoCancellationQuality
        ?.echoCancellationQuality;
    console.debug(
      `Echo cancellation test score of ${actualScore?.toFixed(
        2
      )} is lower than the preferred quality of ${
        thresholds.preferredEchoQuality
      }`
    );
  }
}

async function setupRecording(completion_callback?: () => void): Promise<void> {
  if (microphone) {
    return;
  }

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        echoCancellation: true, // critical for interruptions
        autoGainControl: true,
        noiseSuppression: true,
      },
    });

    const partialVADOptions = {
      ...(isFirefox() ? firefoxMicVADOptions : micVADOptions),
      stream,
    };

    console.debug("Permission granted for microphone access");
    microphone = await MicVAD.new(partialVADOptions);
    console.debug("VAD microphone loaded");

    if (typeof completion_callback === "function") {
      completion_callback();
    }
  } catch (err) {
    console.error("VAD microphone failed to load.", err);
    throw err; // reject the promise
  }
}

function tearDownRecording(): void {
  console.log("Entered tearDownRecording()");
  if (microphone) {
    console.log(
      "microphone exists, so pausing mic, and setting listening to false, and stopping all tracks!"
    );
    microphone.pause();
    listening = false;
    stream.getTracks().forEach((track) => track.stop());
    microphone.destroy(); //added by JAC
  } else {
    console.log("microphone does not exist!");
  }
  microphone = null;
}

interface AudioInputContext {
  waitingToStop: boolean;
  waitingToStart: boolean;
  recordingStartTime: number;
}

type AudioInputEvent =
  | { type: "acquire" }
  | { type: "release" }
  | { type: "start" }
  | { type: "stopRequested" }
  | { type: "dataAvailable"; blob: Blob; duration: number }
  | { type: "stop" }
  | { type: "error.platform"; data: any };

export const audioInputMachine = createMachine<
  AudioInputContext,
  AudioInputEvent
>(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QEMCuECWB7AkgOwAdUAXAOgCcwAbMZWSAYmQGMBHVDSgbQAYBdRKAJZYGYtjyCQAD0QBGAOwBmUgBYAnJvUAOVXvUKATADYANCACeiJYYCspY7eM9jruatsHDAX2-m0mLiEJKQs7JwYeFAMEFh4YKSRAG5YANYJAdj4RGRhHOSRUAjJWMzI4nG8fFVSwqIVkkgyiLaG5lYIcnI82g4KtqoKxqrGCiOGqr7+6FnBuWz5hQxg5ORY5KQEVOUAZusAtqEzQTmhCxFRxXgpZQ1VNU11YhJSsp3Kalo6ehpGZpaIQw2UiGHhKHhAwwKZQeIxTECZE4hPIXaKwYjIcjEB5CETPOKvQFyZykOTaJS6Yyg0YQ-4dMkKUjqWzgpSqJS2MHqVQmeGI7LI86UCAMSg0OhgHEgJ4NQmdYwqDRaXT6P7tRDaOSfTSOAzaXS2TV844C+bhYWJCA0BjozHY-i1PGyppvVQ9EGOZzaEzqUFkpTqzpyNkg-VjbTGOQsnitY2BU1nc2QS3WlHcB2PJ0vF2IDQqHjqYMstnGQtDQNyCaMnS2Aa1jmF9lx2anNPJjBWsAMKUy7OgV3ukxOHo+v3kis9XqGfXe7QskwKGPNpFm-LJyjMdaYKI24hYAgAJTA7DgxEgPazBJzCG0CnUfVB-U8E2MmorwdUof1SmZdijqm0ZcEzbCAKDATdyG3aIIHKZAAEEkmQDBtgAIxoC96j7ZoEFLQxSDnZlfVfH9K1sQMdXwjllF9TRQUAvwERNOZEzXUCCDAPAoIAZT3Ahd33DD8Uaft5A8YwmVLCENG6XRK0DfV7zdL0jDZTVySA5iQM2DjuN4mJYIQpDUPQjNcUwq8RM6MSJPUKTCx6VQ5IBBADC1JTSNs9QlDJDTWyFZN2M4woeP3BhpFtM9Qh2M9yAACk5HgeAASiYJi-KTNidOC3jBOdSz3CcGy7Jkxy2mcroTFIbzDBq-oRxcSYGP5TT-MyoKohCvjwoxSLkGilZ4sS5LUvjFqMu09qoE6rg5AETNzOE7CuiUFQvF9HonE5VQJ3ZUgwW0blWShRRfMFcb0X3diRVyrC3mJHkQR9NkRk1AD5McpkYy8TVi0jU7V04ddwK3JYLoIG6LOwiNxKhTRDVsStS31Csaq1BRK0S5kfwO9RjF8Bi8CwCA4CkZqckdBa5QAWjpRAab2oaVuhA6Ebcf6wPFegIApoS5R5QNvM-MEKpMSNErJPGmrSs7FiiHm8uwn97xo0YvPcdk5GZQNp0UlxuihQxNZ5BR2ZA+XbsBSNSCGJwgXJJw7zkQNRnsWznErIxYWGU3WpTMBzcht5wXvG2qQpDlVad8rK1W4N0aUfoJaXKXRvS1iwIgqCA8Wt5XDwoaXAmdkJghCcdC-bQeCGRd+gVH3xsC3T92zuVuhZUk7Bqtk72hYky-sFkwycGwEqUev07Bq6W+vRRBiqj31rdTxb3IrzSFrQtdB0ZlIzkfHvCAA */
    id: "audioInput",
    initial: "released",
    context: {
      waitingToStop: false,
      waitingToStart: false,
      recordingStartTime: 0,
    },
    states: {
      released: {
        on: {
          acquire: {
            target: "acquiring",
          },
        },
      },
      acquiring: {
        description:
          "Acquiring the microphone. Waits until asynchronous call has completed.",
        invoke: {
          src: "acquireMicrophone",
          onDone: {
            target: "acquired",
          },
          onError: {
            target: "released",
            actions: {
              type: "logMicrophoneAcquisitionError",
            },
          },
        },
        on: {
          start: {
            actions: assign({ waitingToStart: true }),
            internal: true,
          },
        },
      },
      acquired: {
        description: "Microphone acquired and ready to start recording.",
        initial: "idle",
        entry: [
          {
            type: "notifyMicrophoneAcquired",
          },
        ],
        states: {
          idle: {
            on: {
              start: {
                target: "recording",
                cond: "microphoneAcquired",
              },
              acquire: {
                description: `When receiving a request to acquire a microphone (setup recording) that is already acquired, trigger notifications.`,
                actions: {
                  type: "notifyMicrophoneAcquired",
                },
              },
            },
            always: {
              target: "recording",
              cond: "pendingStart",
            },
          },

          recording: {
            entry: ["startRecording", assign({ waitingToStart: false })],
            on: {
              stopRequested: {
                target: "pendingStop",
                description: "Stop gracefully.",
              },

              stop: {
                target: "#audioInput.acquired.stopped",
                description: "Stop immediately",
                actions: ["prepareStop", "stopIfWaiting"],
              },

              dataAvailable: {
                actions: {
                  type: "sendData",
                },
                internal: true,
              },
            },
          },

          pendingStop: {
            description:
              "Waiting for the media recording device to stop recording.",
            entry: {
              type: "prepareStop",
            },
            after: {
              "5000": [
                {
                  target: "#audioInput.acquired.stopped",
                  actions: ["stopIfWaiting"],
                  description: "Stop eventually",
                },
                {
                  internal: false,
                },
              ],
            },
            on: {
              stop: {
                target: "stopped",
                description: "Stop immediately",
              },
              dataAvailable: {
                target: "stopped",
                actions: ["stopIfWaiting", "sendData"],
                description: "Stop after final audio data collected",
              },
            },
          },

          stopped: {
            entry: assign({ waitingToStop: false }),
            always: {
              target: "idle",
            },
          },
        },
        on: {
          release: {
            target: "released",
            actions: {
              type: "releaseMicrophone",
            },
          },
        },
      },
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
  },
  {
    actions: {
      startRecording: (context, event) => {
        context.recordingStartTime = Date.now();

        // Start recording
        if (microphone && listening === false) {
          microphone.start();
          listening = true;
        }
      },

      prepareStop: (context, event) => {
        if (microphone && listening === true) {
          context.waitingToStop = true;
        }
      },

      sendData: (
        context,
        event: { type: "dataAvailable"; blob: Blob; duration: number }
      ) => {
        const { blob, duration } = event;
        const sizeInKb = (blob.size / 1024).toFixed(2); // Convert to kilobytes and keep 2 decimal places
        console.log(`Uploading ${sizeInKb}kb of audio data`);

        // Use the duration directly from the event
        const speechDuration = duration;

        if (Number(sizeInKb) > 0) {
          // Upload the audio to the server for transcription
          EventBus.emit("saypi:userStoppedSpeaking", {
            duration: speechDuration,
            blob,
          });
        }
      },

      stopIfWaiting: (SayPiContext) => {
        if (SayPiContext.waitingToStop === true) {
          if (microphone) {
            microphone.pause();
            listening = false;
          }
        }
      },

      notifyMicrophoneAcquired: (context, event) => {
        monitorAudioInputDevices();
        EventBus.emit("saypi:callReady");
      },

      releaseMicrophone: (context, event) => {
        tearDownRecording();
      },

      logMicrophoneAcquisitionError: (
        context,
        event: {
          type: "error.platform";
          data: any;
        }
      ) => {
        let messageKey = "microphoneErrorUnknown";
        let detail = "";

        if (isOverconstrainedError(event.data)) {
          messageKey = "microphoneErrorConstraints";
        } else if (event.data instanceof DOMException) {
          switch (event.data.name) {
            case "NotAllowedError":
              messageKey = "microphoneErrorPermissionDenied";
              break;
            case "NotFoundError":
              messageKey = "microphoneErrorNotFound";
              break;
            case "NotReadableError":
              messageKey = "microphoneErrorInUse";
              break;
            default:
              messageKey = "microphoneErrorUnexpected";
              detail = event.data.message;
          }
        } else if (event.data instanceof Error) {
          messageKey = "microphoneErrorGeneric";
          detail = event.data.message;
        }

        const message = getMessage(messageKey, detail);

        console.error(`Microphone error: ${message}`, event.data);

        EventBus.emit("saypi:ui:show-notification", {
          message: message,
          type: "text",
          seconds: 20,
          icon: "microphone-muted",
        });
      },
    },
    services: {
      acquireMicrophone: (context, event) => {
        return new Promise<void>((resolve, reject) => {
          setupRecording(() => {
            // called when setupRecording completes - whether successful or not
            if (microphone) {
              resolve();
            } else {
              reject(
                new Error(
                  "Failed to acquire microphone resource for unknown reason."
                )
              );
            }
          }).catch((err) => {
            // called if setupRecording throws an error - reject the promise
            reject(err);
          });
        });
      },
    },
    guards: {
      microphoneAcquired: (context, event) => {
        return microphone !== null;
      },
      pendingStart: (context, event) => {
        return context.waitingToStart === true;
      },
    },
    delays: {},
  }
);
interface OverconstrainedError extends DOMException {
  constraint: string;
  message: string;
}
function isOverconstrainedError(error: any): error is OverconstrainedError {
  return (
    error instanceof DOMException &&
    (error.name === "OverconstrainedError" ||
      error.name === "ConstraintNotSatisfiedError")
  );
}
