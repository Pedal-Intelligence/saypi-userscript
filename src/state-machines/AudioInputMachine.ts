import { MicVAD, RealTimeVADOptions } from "@ricky0123/vad-web";
import { setupInterceptors } from "../RequestInterceptor";
import { convertToWavBlob } from "../audio/AudioEncoder";
import { createMachine, assign } from "xstate";
import EventBus from "../events/EventBus.js";
import { debounce } from "lodash";
import { getResourceUrl } from "../ResourceModule";
import { customModelFetcher } from "../vad/custom-model-fetcher";
import { isFirefox, isSafari } from "../UserAgentModule";
import { AudioCapabilityDetector } from "../audio/AudioCapabilities";
import getMessage from "../i18n";
import { OffscreenVADClient } from '../vad/OffscreenVADClient';

const fullWorkletURL: string = isFirefox() || isSafari()
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

// Instantiate the VAD client
const vadClient = new OffscreenVADClient();

async function monitorAudioInputDevices() {
  // if (microphone === null) { // `microphone` is no longer in this scope
  //   // No microphone instance, so nothing to monitor
  //   return;
  // }

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

  // The following block referenced 'microphone' and 'stream' which are no longer in this scope.
  // It was intended to be removed or fully commented out by previous refactoring.
  // Ensuring it is fully removed now.

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
  model: "v5", // specifying a model key triggers loading the silero_vad_v5.onnx model
  ortConfig: (ort: any) => {
    console.log("[AudioInputMachine] Setting ortConfig for VAD...");
    ort.env.wasm.wasmPaths = chrome.runtime.getURL("public/");
    ort.env.wasm.numThreads = 1; // single threading for improved compatibility
    ort.env.wasm.simd = true; // always true in Silero VAD v5
  },
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
};

// Safari-specific options
const safariMicVADOptions: Partial<RealTimeVADOptions> & MyRealTimeVADCallbacks = {
  ...micVADOptions, 
  workletOptions: {},
  ortConfig: (ort: any) => {
    if (micVADOptions.ortConfig) {
        micVADOptions.ortConfig(ort);
    }
  },
};

async function checkAudioCapabilities() {
  const detector = new AudioCapabilityDetector();
  const thresholds = {
    minimumEchoQuality: 0.5,
    preferredEchoQuality: 0.75,
  };
  const config = await detector.configureAudioFeatures(thresholds);

  // Check WebAssembly capabilities
  const { webAssembly } = config.audioQualityDetails;
  
  // Required memory for ONNX model (approximately 32MB)
  const requiredPages = 512; // 32MB = 512 pages * 64KB
  
  if (!webAssembly.memory.initial) {
    throw new Error(getMessage("webAssemblyMemoryUnavailable"));
  }
  
  if (webAssembly.memory.maximumSize < requiredPages) {
    throw new Error(getMessage("webAssemblyInsufficientMemory", 
      `Required: ${requiredPages * 64}KB, Available: ${webAssembly.memory.maximumSize * 64}KB`));
  }

  if (!webAssembly.memory.growth) {
    console.warn("WebAssembly memory growth is not supported. VAD may be unstable.");
  }

  if (!webAssembly.simd) {
    console.warn("WebAssembly SIMD is not supported. VAD may not function optimally.");
  }

  if (!webAssembly.threads) {
    console.info("WebAssembly Threading is not supported, but probably won't affect performance.");
  }

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

  return config;
}

// Helper function to communicate with the background script for permission
async function checkAndRequestMicrophonePermissionViaBackground(): Promise<boolean> {
  return new Promise((resolve) => {
    const requestId = `mic-perm-check-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    const listener = (message: any) => {
      if (message.type === 'MICROPHONE_PERMISSION_RESPONSE' && message.requestId === requestId) {
        chrome.runtime.onMessage.removeListener(listener);
        console.log(`[AudioInputMachine] Received MICROPHONE_PERMISSION_RESPONSE: granted=${message.granted}`);
        resolve(message.granted);
      }
    };
    chrome.runtime.onMessage.addListener(listener);

    console.log("[AudioInputMachine] Sending CHECK_AND_REQUEST_MICROPHONE_PERMISSION to background.");
    chrome.runtime.sendMessage({
      type: 'CHECK_AND_REQUEST_MICROPHONE_PERMISSION',
      requestId: requestId,
    }, response => {
      if (chrome.runtime.lastError) {
        console.error("[AudioInputMachine] Error sending CHECK_AND_REQUEST_MICROPHONE_PERMISSION:", chrome.runtime.lastError.message);
        chrome.runtime.onMessage.removeListener(listener);
        resolve(false);
      } else if (response && response.status === 'error_before_prompt') {
        console.error("[AudioInputMachine] Background script reported error before prompting:", response.error);
        chrome.runtime.onMessage.removeListener(listener);
        resolve(false);
      }
    });
  });
}

async function setupRecording(completion_callback?: (success: boolean, error?: string) => void): Promise<void> {
  try {
    console.log("[AudioInputMachine] Requesting microphone permission check and prompt (if needed) from background...");
    const permissionGranted = await checkAndRequestMicrophonePermissionViaBackground();

    if (!permissionGranted) {
      const errorMsg = getMessage("microphonePermissionDeniedError") || "Microphone permission was not granted. Please ensure you've allowed access in the prompt and in extension settings.";
      console.error("[AudioInputMachine] Microphone permission not granted after prompt flow.");
      EventBus.emit("saypi:ui:show-notification", {
        message: errorMsg,
        type: "text",
        seconds: 20,
        icon: "microphone-muted",
      });
      completion_callback?.(false, errorMsg);
      return;
    }

    console.log("[AudioInputMachine] Microphone permission is granted. Proceeding with VAD initialization via client...");
    const result = await vadClient.initialize({ /* pass any specific options if needed */ });
    
    if (result.success) {
      console.log("[AudioInputMachine] VAD initialized successfully via offscreen. Mode:", result.mode);
      completion_callback?.(true);
    } else {
      console.error("[AudioInputMachine] VAD initialization failed via offscreen:", result.error);
      const errorMessage = result.error || getMessage("microphoneErrorUnexpected");
      EventBus.emit("saypi:ui:show-notification", {
        message: errorMessage,
        type: "text",
        seconds: 20,
        icon: "microphone-muted",
      });
      completion_callback?.(false, errorMessage);
    }
  } catch (err: any) {
    console.error("[AudioInputMachine] Error in setupRecording:", err);
    const finalErrorMessage = err.message || getMessage("microphoneErrorUnexpected");
    EventBus.emit("saypi:ui:show-notification", {
        message: finalErrorMessage,
        type: "text",
        seconds: 20,
        icon: "microphone-muted",
      });
    completion_callback?.(false, finalErrorMessage);
  }
}

function tearDownRecording(): void {
  console.log("[AudioInputMachine] Tearing down recording via VAD client...");
  vadClient.destroy();
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
      startRecording: async (context, event) => {
        context.recordingStartTime = Date.now();
        console.log("[AudioInputMachine] Requesting VAD start via client...");
        const result = await vadClient.start();
        if (!result.success) {
          console.error("[AudioInputMachine] Failed to start VAD via client:", result.error);
          // Optionally send an error event to the machine or show notification
           EventBus.emit("saypi:ui:show-notification", {
            message: result.error || "Failed to start recording",
            type: "text",
            seconds: 10,
            icon: "microphone-muted",
          });
        }
      },

      prepareStop: async (context, event) => {
        // If there's an explicit action needed before onSpeechEnd, send a stop request here.
        // Otherwise, onSpeechEnd from the offscreen VAD will trigger dataAvailable.
        console.log("[AudioInputMachine] Requesting VAD stop via client (prepareStop)...");
        context.waitingToStop = true; // Still useful for local state if needed
        const result = await vadClient.stop(); // This tells the offscreen VAD to stop listening
        if (!result.success) {
          console.error("[AudioInputMachine] Failed to stop VAD via client:", result.error);
        }
      },

      sendData: (
        context,
        event: { type: "dataAvailable"; blob: Blob; duration: number }
      ) => {
        const { blob, duration } = event;
        const sizeInKb = (blob.size / 1024).toFixed(2); // Convert to kilobytes and keep 2 decimal places
        console.debug(`Uploading ${sizeInKb}kb of audio data`);

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
        // This action might become less relevant as stop is handled by prepareStop/vadClient.stop()
        // and speech end is an event from the offscreen document.
        // However, if we maintain waitingToStop for UI or other logic, it can stay.
        if (SayPiContext.waitingToStop === true) {
            console.log("[AudioInputMachine] stopIfWaiting: VAD stop was already requested.");
            // No direct mic.pause() here, already handled by vadClient.stop() in prepareStop
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
          setupRecording((success, error) => {
            if (success) {
              resolve();
            } else {
              reject(new Error(error || "Failed to acquire microphone resource via offscreen VAD."));
            }
          }).catch((err) => {
            reject(err);
          });
        });
      },
    },
    guards: {
      microphoneAcquired: (context, event) => {
        // This guard needs to change. It can't check `microphone !== null`.
        // It should reflect whether the offscreen VAD client reported successful initialization.
        // For now, let's assume true after an acquire attempt, or manage state based on onInitialized callback.
        // This needs a robust way to track client state.
        // Placeholder: return true; Will need better state tracking.
        return true; // TODO: Reflect actual initialized state of OffscreenVADClient
      },
      pendingStart: (context, event) => {
        return context.waitingToStart === true;
      },
    },
    delays: {},
  }
);

// Setup VAD event listeners from the client
vadClient.on('onSpeechStart', () => {
  console.debug("[AudioInputMachine] User speech started (event from VAD client).");
  // speechStartTime is now managed in offscreen, but we can mirror if needed or rely on duration from onSpeechEnd
  EventBus.emit("saypi:userSpeaking");
});

vadClient.on('onSpeechEnd', (data: { duration: number; /* blob?: Blob */ }) => {
  console.debug("[AudioInputMachine] User speech ended (event from VAD client). Duration:", data.duration);
  // const audioBlob = convertToWavBlob(rawAudioData); // rawAudioData not available here directly
  // The blob is not currently sent from offscreen. If it were, it would be in `data.blob`.
  // For now, we rely on the `data.duration`.
  // If a blob is needed here, the offscreen and client communication needs to support it.
  EventBus.emit("audio:dataavailable", {
    // blob: data.blob, // If blob were sent
    duration: data.duration,
  });
});

vadClient.on('onVADMisfire', () => {
  console.debug("[AudioInputMachine] VAD Misfire (event from VAD client).");
  EventBus.emit("saypi:userStoppedSpeaking", { duration: 0 });
});

vadClient.on('onError', (error: string) => {
  console.error("[AudioInputMachine] VAD Error (event from VAD client):", error);
  EventBus.emit("saypi:ui:show-notification", {
    message: error || "VAD processing error.",
    type: "text",
    seconds: 15,
    icon: "microphone-muted",
  });
  // TODO: Potentially transition the state machine to an error state.
});

vadClient.on('onFrameProcessed', (probabilities: { isSpeech: number; notSpeech: number }) => {
  // This is where the original onFrameProcessed logic was.
  // Debounce if necessary, though debouncing might be better in the offscreen doc if events are too frequent.
  EventBus.emit("audio:frame", probabilities);
});

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

export { setupRecording };
