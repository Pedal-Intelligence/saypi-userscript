import { MicVAD, RealTimeVADOptions } from "@ricky0123/vad-web";
import { config } from "../ConfigModule";
import { setupInterceptors } from "../RequestInterceptor";
import { convertToWavBlob } from "../AudioEncoder";
import { createMachine, assign } from "xstate";

// Assuming config.appServerUrl is of type string.
const fullWorkletURL: string = `${config.appServerUrl}/vad.worklet.bundle.min.js`;

// Assuming EventBus is a property of Window and is of type any
// You might want to provide a more specific type if available
declare global {
  interface Window {
    EventBus: any;
  }
}

const EventBus = window.EventBus;

let audioMimeType: string = "audio/wav";
let speechStartTime: number = 0;
const threshold: number = 1000; // 1000 ms = 1 second, about the length of "Hey, Pi"

setupInterceptors();

// Variable to hold the microphone instance. Now has a specific type.
let microphone: MicVAD | null = null;

// Define the callbacks manually if they are not exported
interface MyRealTimeVADCallbacks {
  onSpeechStart?: () => any;
  onSpeechEnd?: (audio: Float32Array) => any;
  onVADMisfire?: () => any;
}

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
    /** @xstate-layout N4IgpgJg5mDOIC5QEMCuECWB7AkgOwAdUAXAOgCcwAbMZWSAYmQGMBHVDSgbQAYBdRKAJZYGYtjyCQAD0QBGAGwBmUgFYeG1UoCc2gCxKA7HJ4KANCACeiJXIAcpBYe0K7bpasMHtqgL6+LNExcQhJSFnZODDwoBggsPDBSaIA3LABrJKDsfCIyCI5yaKgEVKxmZHEE3j4aqWFRKskkGURVACYLawQ7PVVSRVMeOyU9bSVlbX9A9BzQ-LZC4oYwcnIsclICKkqAMw2AW3DZkLzwxaiY0rw0iqaaupaGsQkpWQQ5QxV1TR19IxM5isiHa7X6oIUqlUCn0Ll0X2mIGypzCBU4jEoNDoYEeQhELwSb3kXzUGh4Wl0BmMpi6iDsclIY102h4RnaPG0inaiORuVRF0oEGSEBoDFgxGQ5GIuJAzyaRI+7U+Ax4clUIyhhlZI1pPV6pCUoPGekMhjsTjVPJOfIWkUFFDAzA2mBiYuIWAIACUwOw4MRIDK5a8Wu85O1tIYDXZ2nYOcNFM5dVr+p84WbVLp2n0rcEbec7ZAHU7yC7YhBKsgAIIpZAYHYAIxogfx8pD8j0kNIGrsLjcYbkSl1sYcvWUCnHenspqmASR1vm+cKhYIYDwpYAyu6CG6Pc3GsHQO9jA4FBzw5ytXYvtpddpQVGY4bPAZ2gpubPeQu0faV2vipuPTiCtq1rBsm34eoWwPVoEGPRwz10T5hmvIcwVIO84X0ORORMOQczmM5v0LcUPRXCAGD3AlmkPeRtTUNVVHsOQ9A0dpDCBboWQcZwfA0AxFFjPDETwLAIDgKRPzySD90JNsEAAWg4xBFPwlEyExWh6AgaSqIVPROmBD5mPghiFCQwEfFUvNv2KHTWxohA-nQ88eGMJwOWcVRdSNAZsNNJQhjVewrK-AVIDs6D3lfBl2KhP5OUhYZdU8FRUxhbDVEnS0P3nQiwqFDARTACLZIcuQBxUU9mIUPpXK0Nxb1c0geKZZwtSwkK8oLIVKGLUsSuomDmPpZz7HZFiJjYvRbxMUhz1aiMOUnTr+W6rZVw3LcBoVALtGayEKUQxK7CHLQBkNNrVR4I09BW20lyFEiCDI7a5KvPboXaCY7EYmNMoM7o3D0ObdHUAKs3VWx-H8IA */
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
        states: {
          idle: {
            on: {
              start: {
                target: "recording",
                cond: "microphoneAcquired",
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
