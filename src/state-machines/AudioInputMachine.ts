import { setupInterceptors } from "../RequestInterceptor";
import { convertToWavBlob } from "../audio/AudioEncoder";
import { createMachine, assign } from "xstate";
import EventBus from "../events/EventBus.js";
import { AudioCapabilityDetector } from "../audio/AudioCapabilities";
import getMessage from "../i18n";
import { OffscreenVADClient } from '../vad/OffscreenVADClient';
import { OnscreenVADClient } from '../vad/OnscreenVADClient';
import { VADClientInterface } from '../vad/VADClientInterface';
import { logger } from "../LoggingModule";
import { likelySupportsOffscreen, getBrowserInfo } from "../UserAgentModule";

setupInterceptors();

/**
 * Logs processing delays based on threshold values
 * @param captureTimestamp - When the audio was originally captured
 * @param receiveTimestamp - When the client received the data
 * @param description - Description of what's being measured
 */
function logProcessingDelay(captureTimestamp: number, receiveTimestamp: number, description: string = "processing"): void {
  const delay = receiveTimestamp - captureTimestamp;
  
  if (delay > 500) {
    logger.warn(`[AudioInputMachine] High ${description} delay: ${delay}ms from capture to client receipt`);
  } else if (delay > 200) {
    logger.info(`[AudioInputMachine] Elevated ${description} delay: ${delay}ms from capture to client receipt`);
  }
}

let previousDeviceIds: string[] = [];
let previousDefaultDevice: MediaDeviceInfo | null = null;

// VAD client instance - will be either OffscreenVADClient or OnscreenVADClient
let vadClient: VADClientInterface | null = null;

// Initialize the appropriate VAD client based on browser support
function initializeVADClient() {
  const useOffscreenVAD = likelySupportsOffscreen();
  const browserInfo = getBrowserInfo();
  
  if (useOffscreenVAD) {
    logger.debug(`[AudioInputMachine] Browser supports offscreen documents - using OffscreenVADClient`, browserInfo);
    vadClient = new OffscreenVADClient();
  } else {
    logger.debug(`[AudioInputMachine] Browser does not support offscreen documents - using OnscreenVADClient`, browserInfo);
    vadClient = new OnscreenVADClient();
  }
  
  // Setup event listeners for the selected client
  setupVADEventListeners();
}

// Setup VAD event listeners (works with both client types)
function setupVADEventListeners() {
  if (!vadClient) {
    logger.debug("[AudioInputMachine] No VAD client available - skipping event listener setup");
    return;
  }

  logger.debug("[AudioInputMachine] Setting up VAD event listeners");

  vadClient.on('onSpeechStart', () => {
    console.debug("[AudioInputMachine] User speech started (event from VAD client).");
    EventBus.emit("saypi:userSpeaking");
  });

  vadClient.on('onSpeechEnd', (data: { 
    duration: number; 
    audioBuffer: ArrayBuffer; 
    captureTimestamp: number; 
    clientReceiveTimestamp: number 
  }) => {
    console.debug(`[AudioInputMachine] User speech ended. Duration: ${data.duration}ms`);
    
    // Log processing delays only if they exceed thresholds
    logProcessingDelay(data.captureTimestamp, data.clientReceiveTimestamp);
    
    EventBus.emit("saypi:userStoppedSpeaking", {
      audioBuffer: data.audioBuffer,
      duration: data.duration,
      captureTimestamp: data.captureTimestamp,
      clientReceiveTimestamp: data.clientReceiveTimestamp
    });
  });

  vadClient.on('onVADMisfire', () => {
    console.debug("[AudioInputMachine] VAD misfire detected.");
    EventBus.emit("saypi:vadMisfire");
  });

  vadClient.on('onFrameProcessed', (probabilities: { isSpeech: number; notSpeech: number }) => {
    EventBus.emit("saypi:vadFrameProcessed", probabilities);
  });
}

// Initialize the appropriate VAD client based on browser support
initializeVADClient();

// Event listeners for audio data and VAD events
EventBus.on("saypi:userStoppedSpeaking", (data: { 
  audioBuffer: ArrayBuffer; 
  duration: number; 
  captureTimestamp: number; 
  clientReceiveTimestamp: number 
}) => {
  console.debug("[AudioInputMachine] Received userStoppedSpeaking event. Duration:", data.duration);
  
  // Reconstruct Float32Array from audio buffer
  const audioData = new Float32Array(data.audioBuffer);
  const frameCount = audioData.length;
  const frameRate = 16000;
  const duration = frameCount / frameRate;
  const handlerTimestamp = Date.now();
  
  // Only log basic information about speech data at debug level
  console.debug(
    `[AudioInputMachine] Speech duration: ${data.duration}ms, Frame count: ${frameCount}, Frame rate: ${frameRate}, Duration: ${duration}s`
  );
  
  if (frameCount === 0) {
    console.warn("[AudioInputMachine] No audio data available. Skipping emission of audio:dataavailable event.");
    return;
  }
  
  // Convert to WAV Blob for transcription
  const audioBlob = convertToWavBlob(audioData);
  console.debug(`Reconstructed Blob size: ${audioBlob.size} bytes`);
  
  // Emit both blob and duration for transcription
  EventBus.emit("audio:dataavailable", {
    frames: audioData, // raw frames for splitting, if needed
    blob: audioBlob, // WAV blob for transcription
    duration: data.duration,
    captureTimestamp: data.captureTimestamp,
    clientReceiveTimestamp: data.clientReceiveTimestamp,
    handlerTimestamp: handlerTimestamp
  });
});

EventBus.on("saypi:vadMisfire", () => {
  console.debug("[AudioInputMachine] VAD Misfire detected.");
  EventBus.emit("saypi:userStoppedSpeaking", { 
    audioBuffer: new ArrayBuffer(0),
    duration: 0,
    captureTimestamp: Date.now(),
    clientReceiveTimestamp: Date.now()
  });
});

EventBus.on("saypi:vadFrameProcessed", (probabilities: { isSpeech: number; notSpeech: number }) => {
  // This event is debounced in the VAD clients, so don't expect to receive every single frame
  EventBus.emit("audio:frame", probabilities);
});

async function monitorAudioInputDevices() {
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
    if (!vadClient) {
      const errorMsg = "VAD client not available - this should not happen";
      console.error("[AudioInputMachine]", errorMsg);
      EventBus.emit("saypi:ui:show-notification", {
        message: "Voice recording not available",
        type: "text",
        seconds: 10,
        icon: "microphone-muted",
      });
      completion_callback?.(false, errorMsg);
      return;
    }

    // Check if we're using offscreen VAD - only request extension permissions in that case
    const isOffscreenVAD = vadClient instanceof OffscreenVADClient;
    
    if (isOffscreenVAD) {
      console.log("[AudioInputMachine] Using OffscreenVADClient - requesting extension microphone permission check and prompt (if needed) from background...");
      const permissionGranted = await checkAndRequestMicrophonePermissionViaBackground();

      if (!permissionGranted) {
        const errorMsg = getMessage("microphonePermissionDeniedError") || "Microphone permission was not granted. Please ensure you've allowed access in the prompt and in extension settings.";
        console.error("[AudioInputMachine] Microphone permission not granted after prompt flow.");
        EventBus.emit("saypi:ui:show-notification", {
          message: errorMsg,
          type: "text",
          seconds: 10,
          icon: "microphone-muted",
        });
        completion_callback?.(false, errorMsg);
        return;
      }

      console.log("[AudioInputMachine] Extension microphone permission granted. Proceeding with VAD setup...");
    } else {
      console.log("[AudioInputMachine] Using OnscreenVADClient - skipping extension permission check (host site permissions will be requested during VAD initialization)...");
    }

    // Initialize the VAD client (works for both offscreen and onscreen)
    console.log("[AudioInputMachine] Initializing VAD client...");
    const initResult = await vadClient.initialize();
    
    if (!initResult.success) {
      const errorMsg = initResult.error || "Failed to initialize VAD";
      const detailedErrorMsg = initResult.errorLong || errorMsg; // Use detailed version for logging and callback
      console.error("[AudioInputMachine] VAD initialization failed:", detailedErrorMsg);
      
      // Use short error message for notification (if available), otherwise fall back to detailed
      const notificationMessage = initResult.error ? errorMsg : "Failed to initialize voice detection";
      
      EventBus.emit("saypi:ui:show-notification", {
        message: notificationMessage,
        type: "text",
        seconds: 10,
        icon: "microphone-muted",
      });
      completion_callback?.(false, errorMsg);
      return;
    }

    console.log(`[AudioInputMachine] VAD initialized successfully in ${initResult.mode} mode`);
    completion_callback?.(true);

  } catch (error: any) {
    const errorMsg = error.message || "Unknown error during recording setup";
    console.error("[AudioInputMachine] Error in setupRecording:", error);
    EventBus.emit("saypi:ui:show-notification", {
      message: "Failed to set up voice recording",
      type: "text",
      seconds: 10,
      icon: "microphone-muted",
    });
    completion_callback?.(false, errorMsg);
  }
}

function tearDownRecording(): void {
  console.log("[AudioInputMachine] Tearing down recording...");
  
  // Clean up VAD client if it exists (works for both offscreen and onscreen)
  if (vadClient) {
    console.log("[AudioInputMachine] Destroying VAD client...");
    vadClient.destroy();
  }
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
  | { type: "dataAvailable"; blob: Blob; duration: number; captureTimestamp?: number; clientReceiveTimestamp?: number; handlerTimestamp?: number }
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
        
        if (!vadClient) {
          console.error("[AudioInputMachine] VAD client not available - cannot start recording");
          EventBus.emit("saypi:ui:show-notification", {
            message: "Voice recording not available",
            type: "text",
            seconds: 10,
            icon: "microphone-muted",
          });
          return;
        }
        
        console.log("[AudioInputMachine] Starting VAD client...");
        const result = await vadClient.start();
        
        if (!result.success) {
          console.error("[AudioInputMachine] Failed to start VAD:", result.error);
          EventBus.emit("saypi:ui:show-notification", {
            message: "Failed to start voice recording",
            type: "text",
            seconds: 10,
            icon: "microphone-muted",
          });
          return;
        }
        
        console.log("[AudioInputMachine] VAD started successfully");
      },
      
      stopRecording: async (context, event) => {
        if (!vadClient) {
          console.error("[AudioInputMachine] VAD client not available - cannot stop recording");
          return;
        }
        
        console.log("[AudioInputMachine] Stopping VAD client...");
        const result = await vadClient.stop();
        
        if (!result.success) {
          console.error("[AudioInputMachine] Failed to stop VAD:", result.error);
          return;
        }
        
        console.log("[AudioInputMachine] VAD stopped successfully");
      },

      prepareStop: async (context, event) => {
        // If there's an explicit action needed before onSpeechEnd, send a stop request here.
        // Otherwise, onSpeechEnd from the offscreen VAD will trigger dataAvailable.
        console.log("[AudioInputMachine] Requesting VAD stop via client (prepareStop)...");
        context.waitingToStop = true; // Still useful for local state if needed
        if (!vadClient) {
          console.warn("[AudioInputMachine] VAD client not available - cannot stop recording");
          return;
        }
        const result = await vadClient.stop(); // This tells the offscreen VAD to stop listening
        if (!result.success) {
          console.error("[AudioInputMachine] Failed to stop VAD via client:", result.error);
        }
      },

      sendData: (
        context,
        event: { type: "dataAvailable"; frames: Float32Array; blob: Blob; duration: number; captureTimestamp?: number; clientReceiveTimestamp?: number; handlerTimestamp?: number }
      ) => {
        const { frames, blob, duration, captureTimestamp, clientReceiveTimestamp, handlerTimestamp } = event;
        const sizeInKb = (blob.size / 1024).toFixed(2); // Convert to kilobytes and keep 2 decimal places
        console.debug(`Uploading ${sizeInKb}kb of audio data`);

        // Use the duration directly from the event
        const speechDuration = duration;

        if (Number(sizeInKb) > 0) {
          // Upload the audio to the server for transcription
          //
          // TODO: the VAD emits `saypi:userStoppedSpeaking` events with raw frames when the user stops speaking.
          // These are converted to `audio:dataavailable` events by the audio input machine, which transforms the raw frames into a WAV blob,
          // and sends them through the audio module back to itself (this function - `sendData`),
          // where they are then converted back to `saypi:userStoppedSpeaking` events again, but with the WAV blob,
          // and forwared to the dictation or conversation machines.
          // This results in the dictation or conversation machines receiving `saypi:userStoppedSpeaking` events twice - 
          // once with the raw frames only, and once with the WAV blob.
          EventBus.emit("saypi:userStoppedSpeaking", {
            duration: speechDuration,
            frames,
            blob,
            captureTimestamp,
            clientReceiveTimestamp,
            handlerTimestamp
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
        // This guard now checks if the offscreen VAD client reported successful initialization
        return true; // Since initialization happens in setupRecording which resolves only on success
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

export { setupRecording };
