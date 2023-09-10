import { createMachine } from "xstate";

const EventBus = window.EventBus;

let audioMimeType = "audio/webm;codecs=opus";
const threshold = 1000; // 1000 ms = 1 second, about the length of "Hey, Pi"

// Declare a global variable for the mediaRecorder
var mediaRecorder;

function setupRecording(callback) {
  if (mediaRecorder) {
    return;
  }

  // Get a stream from the user's microphone
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(function (stream) {
      if (!MediaRecorder.isTypeSupported(audioMimeType)) {
        // use MP4 for Safari
        audioMimeType = "audio/mp4";
      }
      // Create a new MediaRecorder object using the stream and specifying the MIME type
      var options = { mimeType: audioMimeType };
      mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorder.addEventListener("dataavailable", (event) => {
        console.log("Data is available from media recorder", event);
        EventBus.emit("audio:dataavailable", {
          data: event.data,
        });
      });
      mediaRecorder.addEventListener("stop", () => {
        EventBus.emit("audio:input:stop");
      });
      console.log("MediaRecorder has been setup.");
    })
    .then(function () {
      // Invoke the callback function
      if (typeof callback === "function") {
        callback();
      }
    })
    .catch(function (err) {
      console.error("Error getting audio stream: " + err);
    });
}

function tearDownRecording() {
  // Check if the MediaRecorder is set up
  if (!mediaRecorder) {
    return;
  }

  // Stop any ongoing recording
  if (mediaRecorder.state === "recording") {
    mediaRecorder.stop();
  }

  // Clear the MediaRecorder variable
  mediaRecorder = null;
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
          src: "acquireMediaRecorder",
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
                  cond: "mediaRecorderAcquired",
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
            description: "Waiting for the MediaRecorder to stop recording.",
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
              type: "releaseMediaRecorder",
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
        console.log("Starting recording");
        // Clear the array for the next recording
        context.audioDataChunks = [];
        context.startTime = Date.now();

        // Start recording
        mediaRecorder.start();

        EventBus.emit("saypi:userSpeaking");
      },

      stopRecording: (context, event) => {
        // TODO: do I need this state check?
        if (mediaRecorder && mediaRecorder.state === "recording") {
          // Stop recording
          mediaRecorder.stop();

          // Record the stop time and calculate the duration
          var stopTime = Date.now();
          var duration = stopTime - context.startTime;

          EventBus.emit("saypi:userStoppedSpeaking", { duration: duration });
        }
      },

      addData: (context, event) => {
        // Add the new data to the array
        console.log("Adding audio data to array", event);
        const chunks = context.audioDataChunks.push(event.data);
        console.log("Audio data chunks: " + chunks);
      },

      sendData: (context, event) => {
        console.log(
          "Sending audio data to server for transcription. Number of chunks: " +
            context.audioDataChunks.length
        );
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

      releaseMediaRecorder: (context, event) => {
        tearDownRecording();
      },

      logError: (context, event) => {
        console.error("Error acquiring MediaRecorder: ", event.data);
      },
    },
    services: {
      acquireMediaRecorder: (context, event, { send }) => {
        return new Promise((resolve, reject) => {
          setupRecording(() => {
            if (mediaRecorder) {
              resolve();
            } else {
              reject(new Error("Failed to acquire MediaRecorder"));
            }
          });
        });
      },
    },
    guards: {
      mediaRecorderAcquired: (context, event) => {
        return mediaRecorder !== null;
      },
      hasData: (context, event) => {
        return context.audioDataChunks.length > 0;
      },
    },
    delays: {},
  }
);
