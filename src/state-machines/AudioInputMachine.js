import { createMachine, actions } from "xstate";
const { log } = actions;
import { MicVAD } from "@ricky0123/vad-web";
import { config } from "../ConfigModule";
import { setupInterceptors } from "../RequestInterceptor";
import { convertToWavBlob } from "../AudioEncoder";

/* set URLs for VAD resources */
setupInterceptors();
const fullWorkletURL = `${config.appServerUrl}/vad.worklet.bundle.min.js`;

const EventBus = window.EventBus;

let audioMimeType = "audio/wav";
let speechStartTime = 0;
const threshold = 1000; // 1000 ms = 1 second, about the length of "Hey, Pi"

let microphone;

async function setupRecording(callback) {
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
      workletURL: fullWorkletURL,
      stream,
      positiveSpeechThreshold: 0.8,
      minSpeechFrames: 5,
      preSpeechPadFrames: 10,
      onSpeechStart: () => {
        console.log("Speech started");
        speechStartTime = Date.now();
      },
      onSpeechEnd: (rawAudioData) => {
        console.log("Speech ended");

        const audioBlob = convertToWavBlob(rawAudioData);
        EventBus.emit("audio:dataavailable", { blob: audioBlob });
      },
      onVADMisfire: () => {
        console.log("VAD misfire. Audio was not speech.");
      },
    });
    if (typeof callback === "function") {
      callback();
    }
  } catch (err) {
    console.error("VAD failed to load", err);
  }
}

function tearDownRecording() {
  if (microphone) {
    microphone.pause();
  }
  microphone = null;
}

export const audioInputMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QEMCuECWB7AkgOwAdUAXAOgCcwAbMZWSAYmQGMBHVDSgbQAYBdRKAJZYGYtjyCQAD0QBGAGwBmUgFYANCACeiJXIAcpBQHYAnAtP6l+gCw2lAJgU2Avi81pMuQiVIt2nBh4UAwQWHhgpEEAblgA1pGe2PhEZP4c5EFQCDFYzMji4bx8xVLCooWSSDKIqg6aOgj6xnJqCqo8qtbKpjwODm4e6Mk+aWwZWQxg5ORY5KQEVAUAZnMAtn7D3ql+44HBOXix+ZXFpdXlYhJSsghyxioa2oj9qqT97Q-Wdo4KgyBJba+dKcRiUGh0MDnIQiK7hG7yB5qBqIfStDo8HhyHj6Wz2Jxyf6AlLAvaUCBRCA0BiwYjIcjEaEgS6VBEIGxyFSWezGJ6NfTmUhyVQKRSmbFKZQtIlbEljALkihgZhzTDBGnELAEABKYHYcGIkCZLOu1VuJgUaiUvQUDj5iHFrRsAo6DnsFmMnRlXjluwVkCVKvIapCEAKyAAgtFkBglgAjGjG2Gss21Bw8NT6VSmJS8lFNO2kGwOcw8BQKHiS3OE9wA2WjP0ZAMEMB4EMAZU1BA1WqTFVNoFucjkOaMdvzphspiFjgeikrUprQx9DZBipbbayna1oXDUZj8cT-DKyYHNQQk5UVnTenHzwLb1MJYr5YX1e9Ix2a4DtK1LYgDB9nCVSDvII4qLa9oIJ6bz3OYSjOjYXTGKKbi1ngWAQHAUjEqMJ79vCqYIAAtAo+bEY+phUbyPDFs4T6obWuE7OCtD0BA+HAWyxb5sONhGFiqhfHivxLnWK5fmSWScSmoHsumRiIbmUH9NOw6WH0qiqNiVFKB+QLyk2HEXKehFyQ4+gOEWtjKfmQkqHBr6CdpSiqPpvrfhSGBUmAMlnrcShKBmSl5ve4rTsoDhzhWVbSkx9aSf6FKUEGIZ+WZ55dJaJgGKFjQMaQuJRXoMWLu5q5ks2rYdl26UgeetjTlRDi5VBT7GKQ1jFfOsVicxpJJaQv4EP+dVsnIJatBZE2epOWZOG1E2kC0Fb6AoVi5mWaEuEAA */
    context: {
      waitingToStop: false,
    },
    id: "audioInput",
    initial: "released",
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
            actions: "logError",
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
                  cond: "microphoneAcquired",
                },
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
                  params: {},
                },
                internal: true,
              },
            },
          },
          pendingStop: {
            description:
              "Waiting for the media recording device to stop recording.",
            on: {
              stop: {
                target: "stopped",
              },
              dataAvailable: {
                target: "stopped",
                actions: {
                  type: "sendData",
                  params: {},
                },
              },
            },
            entry: "prepareStop",
          },
          stopped: {
            entry: "notifyStopped",
            always: "idle",
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

      sendData: (context, event) => {
        const audioBlob = event.blob;
        const sizeInKb = (audioBlob.byteLength / 1024).toFixed(2); // Convert to kilobytes and keep 2 decimal places
        console.log(`Sending ${sizeInKb}kb of audio data to server`);

        if (context.waitingToStop === true) {
          microphone.pause();
          context.waitingToStop = false;
        }

        // Get the stop time and calculate the duration
        var speechStopTime = Date.now();
        var speechDuration = speechStopTime - speechStartTime;

        // If the duration is greater than the threshold, upload the audio for transcription
        if (sizeInKb > 0) {
          // Upload the audio to the server for transcription
          EventBus.emit("saypi:userStoppedSpeaking", {
            duration: speechDuration,
            blob: audioBlob,
          });
        }
      },

      releaseMicrophone: (context, event) => {
        tearDownRecording();
      },

      logError: (context, event) => {
        console.error("Error acquiring microphone: ", event.data);
      },
    },
    services: {
      acquireMicrophone: (context, event, { send }) => {
        return new Promise((resolve, reject) => {
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
      hasData: (context, event) => {
        return context.audioDataChunks.length > 0;
      },
    },
    delays: {},
  }
);
