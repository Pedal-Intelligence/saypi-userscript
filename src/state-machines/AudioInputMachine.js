import { createMachine } from "xstate";
import { MicVAD } from "@ricky0123/vad-web";
import { config } from "../ConfigModule";
import { setupInterceptors } from "../RequestInterceptor";

/* set URLs for VAD resources */
setupInterceptors();
const fullWorkletURL = `${config.appServerUrl}/vad.worklet.bundle.min.js`;

const EventBus = window.EventBus;

let audioMimeType = "audio/webm;codecs=opus";
const threshold = 1000; // 1000 ms = 1 second, about the length of "Hey, Pi"

let microphone;

async function setupRecording(callback) {
  if (microphone) {
    return;
  }

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        console.log("Permission granted", stream);
      })
      .catch((err) => {
        console.error("Permission denied", err);
      });
  }

  console.log("Setting up microphone for recording...");
  MicVAD.new({
    workletURL: fullWorkletURL,
    onSpeechEnd: (audio) => {
      EventBus.emit("audio:dataavailable", { data: audio });
    },
  })
    .then((mic) => {
      console.log("Microphone ready for recording", mic);
      microphone = mic;
      if (typeof callback === "function") {
        callback();
      }
    })
    .catch((error) => {
      console.error("Failed to create MicVAD:", error);
    });
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
      audioDataChunks: [],
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
                actions: {
                  type: "stopRecording",
                },
              },
              dataAvailable: {
                actions: {
                  type: "addData",
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
                actions: {
                  type: "addData",
                  params: {},
                },
                internal: true,
              },
            },
          },
          stopped: {
            entry: {
              type: "sendData",
              params: {},
              cond: "hasData",
            },

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
        // Clear the array for the next recording
        context.audioDataChunks = [];
        context.startTime = Date.now();

        // Start recording
        microphone.start();

        EventBus.emit("saypi:userSpeaking");
      },

      stopRecording: (context, event) => {
        if (microphone) {
          microphone.pause();

          // Record the stop time and calculate the duration
          var stopTime = Date.now();
          var duration = stopTime - context.startTime;

          EventBus.emit("saypi:userStoppedSpeaking", { duration: duration });
        }
      },

      addData: (context, event) => {
        // Add the new data to the array
        context.audioDataChunks.push(event.data);
      },

      sendData: (context, event) => {
        // Create a Blob from the audio data chunks
        var audioBlob = new Blob(context.audioDataChunks, {
          type: mediaRecorder.mimeType,
        });

        // Get the stop time and calculate the duration
        var stopTime = Date.now();
        var duration = stopTime - context.startTime;

        // If the duration is greater than the threshold, upload the audio for transcription
        if (duration >= threshold) {
          // Upload the audio to the server for transcription
          EventBus.emit("saypi:userFinishedSpeaking", {
            duration: duration,
            blob: audioBlob,
          });
        } else {
          console.log(
            "Recording was too short, not uploading for transcription"
          );
        }
      },

      releaseMicrophone: (context, event) => {
        tearDownRecording();
      },

      logError: (context, event) => {
        console.error("Error acquiring MediaRecorder: ", event.data);
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
