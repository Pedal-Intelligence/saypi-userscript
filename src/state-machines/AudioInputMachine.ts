import { MicVAD, RealTimeVADOptions } from "@ricky0123/vad-web";
import { config } from "../ConfigModule";
import { setupInterceptors } from "../RequestInterceptor";
import { convertToWavBlob } from "../AudioEncoder";
import { createMachine } from "xstate";

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
    console.log("VAD misfire. Audio was not speech.");
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
    id: "audioInput",
    initial: "released",
    context: {
      waitingToStop: false,
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
      },
      acquired: {
        description: "Microphone acquired and ready to start recording.",
        initial: "idle",
        states: {
          idle: {
            on: {
              start: {
                target: "recording",
                actions: {
                  type: "startRecording",
                },
                cond: "microphoneAcquired",
              },
            },
          },
          recording: {
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
            on: {
              stop: {
                target: "stopped",
              },
              dataAvailable: {
                target: "stopped",
                actions: {
                  type: "sendData",
                },
              },
            },
          },
          stopped: {
            entry: {
              type: "notifyStopped",
            },
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

        EventBus.emit("saypi:userSpeaking");
      },

      prepareStop: (context, event) => {
        if (microphone && microphone.listening === true) {
          context.waitingToStop = true;
        }
      },

      notifyStopped: (context, event) => {
        var recordingStopTime = Date.now();
        var recordingDuration = recordingStopTime - context.recordingStartTime;

        EventBus.emit("saypi:userFinishedSpeaking", {
          durationRecording: recordingDuration,
        });
      },

      sendData: (
        context,
        event: { type: "dataAvailable"; blob: Blob; duration: number }
      ) => {
        const { blob, duration } = event;
        const sizeInKb = (blob.size / 1024).toFixed(2); // Convert to kilobytes and keep 2 decimal places

        console.log(`Sending ${sizeInKb}kb of audio data to server`);

        if (context.waitingToStop === true) {
          microphone?.pause();
          context.waitingToStop = false;
        }

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
    },
    delays: {},
  }
);
