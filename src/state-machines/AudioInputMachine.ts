import { MicVAD, RealTimeVADOptions } from "@ricky0123/vad-web";
import { config } from "../ConfigModule";
import { setupInterceptors } from "../RequestInterceptor";
import { convertToWavBlob } from "../AudioEncoder";
import { createMachine, assign } from "xstate";
import EventBus from "../EventBus.js";
import { debounce } from "lodash";

// Assuming config.appServerUrl is of type string.
const fullWorkletURL: string = `${config.appServerUrl}/vad.worklet.bundle.min.js`;

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

async function monitorAudioInputDevices() {
  if (microphone === null) {
    // No microphone instance, so nothing to monitor
    return;
  }

  const devices = await navigator.mediaDevices.enumerateDevices();
  const audioInputDevices = devices.filter(
    (device) => device.kind === "audioinput"
  );
  const currentDeviceIds = audioInputDevices.map((device) => device.deviceId);

  const addedDevices = currentDeviceIds.filter(
    (id) => !previousDeviceIds.includes(id)
  );
  const removedDevices = previousDeviceIds.filter(
    (id) => !currentDeviceIds.includes(id)
  );

  const stream = microphone.stream;
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

// Options for MicVAD
const micVADOptions: Partial<RealTimeVADOptions> & MyRealTimeVADCallbacks = {
  workletURL: fullWorkletURL,
  positiveSpeechThreshold: 0.8,
  minSpeechFrames: 5,
  preSpeechPadFrames: 10,
  onSpeechStart: () => {
    console.log("Speech started");
    speechStartTime = Date.now();
    EventBus.emit("saypi:userSpeaking");
  },
  onSpeechEnd: (rawAudioData: Float32Array) => {
    console.log("Speech ended");
    const speechStopTime = Date.now();
    const speechDuration = speechStopTime - speechStartTime;
    const audioBlob = convertToWavBlob(rawAudioData);
    EventBus.emit("audio:dataavailable", {
      blob: audioBlob,
      duration: speechDuration,
    });
  },
  onVADMisfire: () => {
    console.log("Cancelled. Audio was not speech.");
    EventBus.emit("saypi:userStoppedSpeaking", { duration: 0 });
  },
  onFrameProcessed(probabilities: { isSpeech: number; notSpeech: number }) {
    debouncedOnFrameProcessed(probabilities);
  },
};

// The callback type can be more specific based on your usage
async function setupRecording(callback?: () => void): Promise<void> {
  if (microphone) {
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        echoCancellation: true,
        autoGainControl: true,
        noiseSuppression: true,
      },
    });

    microphone = await MicVAD.new({
      ...micVADOptions,
      stream,
    });

    if (typeof callback === "function") {
      callback();
    }
  } catch (err) {
    console.error("VAD failed to load", err);
    console.error(
      `Application server at ${config.appServerUrl} may be unavailable. Please make sure it is running.`
    );
  }
}

function tearDownRecording(): void {
  if (microphone) {
    microphone.pause();
    microphone.stream.getTracks().forEach((track) => track.stop());
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
    /** @xstate-layout N4IgpgJg5mDOIC5QEMCuECWB7AkgOwAdUAXAOgCcwAbMZWSAYmQGMBHVDSgbQAYBdRKAJZYGYtjyCQAD0QBGAOwBmUgBYAnJvUAOVXvUKATADYANCACeiJYYCspY7eM9jruatsHDAX2-m0mLiEJKQs7JwYeFAMEFh4YKSRAG5YANYJAdj4RGRhHOSRUAjJWMzI4nG8fFVSwqIVkkgyiLaG5lYIcnI82g4KtqoKxqrGCiOGqr7+6FnBuWz5hQxg5ORY5KQEVOUAZusAtqEzQTmhCxFRxXgpZQ1VNU11YhJSsp3Kalo6ehpGZpaIQw2UiGHhKHhAwwKZQeIxTECZE4hPIXaKwYjIcjEB5CETPOKvQFyZykOTaJS6Yyg0YQ-4dMkKUjqWzgpSqJS2MHqVQmeGI7LI86UCAMSg0OhgHEgJ4NQmdYwqDRaXT6P7tRDaOSfTSOAzaXS2TV844C+bhYWJCA0BjozHY-i1PGyppvVQ9EGOZzaEzqUFkpTqzpyNkg-VjbTGOQsnitY2BU1nc2QS3WlHcB2PJ0vF2IDQqHjqYMstnGQtDQNyCaMnS2Aa1jmF9lx2anNPJjBWsAMKUy7OgV3ukxOHo+v3kis9XqGfXe7QskwKGPNpFm-LJyjMdaYKI24hYAgAJTA7DgxEgPazBJzCG0CnUfVB-U8E2MmorwdUof1SmZdijqm0ZcEzbCAKDATdyG3aIIHKZAAEEkmQDBtgAIxoC96j7ZoEFLQxSDnZlfVfH9K1sQMdXwjllF9TRQUAvwERNOZEzXUCCDAPAoIAZT3Ahd33DD8Uaft5A8YwmVLCENG6XRK0DfV7zdL0jDZTVySA5iQM2DjuN4mJYIQpDUPQjNcUwq8RM6MSJPUKTCx6VQ5IBBADC1JTSNs9QlDJDTWyFZN2M4woeP3BhpFtM9Qh2M9yAACk5HgeAASiYJi-KTNidOC3jBOdSz3CcGy7Jkxy2mcroTFIbzDBq-oRxcSYGP5TT-MyoKohCvjwoxSLkGilZ4sS5LUvjFqMu09qoE6rg5AETNzOE7CuiUFQvF9HonE5VQJ3ZUgwW0blWShRRfMFcb0X3diRVyrC3mJHkQR9NkRk1AD5McpkYy8TVi0jXwGLwLAIDgKRmpyR0FrlABaOlEBhvahvJBQuiMIweVsU6yDFWh6AgCGhLlHlA28z8wQqkxI0SsljExljUXxvLsJ-e8aNGLz3HZORmUDadFJcbooUMLmeQUWmQIZ27AUjUghicIFyScO85EDUZ7FszxbC5nhiW5GmmrSs7WJTMAJYspmCxlz15Y5NnlfKytVuDZGlH6aml310b0qNjct0KU3FreVw8KGlwJnZCYIQnHQv20HghkXfoFTF1qJt0-d-blboWVJOwarZO9oWJKP7BZMMnBsBKlGT87eKujPr0UQYqsrO9QTdTxb3IrzSFrQtdB0ZlIzkf7vCAA */
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
              type: "logError",
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
        if (microphone && microphone.listening === false) {
          microphone.start();
        }
      },

      prepareStop: (context, event) => {
        if (microphone && microphone.listening === true) {
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
          microphone?.pause();
        }
      },

      notifyMicrophoneAcquired: (context, event) => {
        monitorAudioInputDevices();
        EventBus.emit("saypi:callReady");
      },

      releaseMicrophone: (context, event) => {
        tearDownRecording();
      },

      logError: (context, event: { type: "error.platform"; data: any }) => {
        console.error("Error acquiring microphone: ", event.data);
      },
    },
    services: {
      acquireMicrophone: (context, event) => {
        return new Promise<void>((resolve, reject) => {
          setupRecording(() => {
            if (microphone) {
              resolve();
            } else {
              reject(new Error("Failed to acquire microphone resource."));
            }
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
