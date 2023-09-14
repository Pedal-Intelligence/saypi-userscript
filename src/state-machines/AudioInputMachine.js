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

let audioMimeType = "audio/webm;codecs=opus";
const threshold = 1000; // 1000 ms = 1 second, about the length of "Hey, Pi"

let microphone;

async function setupRecording(callback) {
  if (microphone) {
    return;
  }

  try {
    console.log("Requesting audio stream...");
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        echoCancellation: true,
        autoGainControl: true,
        noiseSuppression: true,
      },
    });
    console.log("Setting up microphone...");
    microphone = await MicVAD.new({
      workletURL: fullWorkletURL,
      stream,
      positiveSpeechThreshold: 0.8,
      minSpeechFrames: 5,
      preSpeechPadFrames: 10,
      onFrameProcessed: (probs) => {
        //const indicatorColor = interpolateInferno(probs.isSpeech / 2);
        //document.body.style.setProperty("--indicator-color", indicatorColor);
      },
      onSpeechStart: () => {
        console.log("Speech started");
      },
      onSpeechEnd: (rawAudioData) => {
        console.log("Speech ended");
        const startTime = new Date().getTime();
        const audioBlob = convertToWavBlob(rawAudioData);
        const endTime = new Date().getTime();
        const audioEncodingDurationMillis = endTime - startTime;
        console.log(
          "Transcoded audio samples to " +
            audioBlob.type +
            " in " +
            audioEncodingDurationMillis +
            "ms"
        );
        audioMimeType = audioBlob.type;
        EventBus.emit("audio:dataavailable", { blob: audioBlob });

        /* const wavBuffer = utils.encodeWAV(arr);
      const base64 = utils.arrayBufferToBase64(wavBuffer);
      const url = `data:audio/wav;base64,${base64}`;
      const el = addAudio(url);
      const speechList = document.getElementById("playlist");
      speechList.prepend(el); */
      },
      onVADMisfire: () => {
        console.log("VAD misfire");
      },
    });
    if (typeof callback === "function") {
      callback();
    }
    console.log("Microphone ready!", microphone);
  } catch (err) {
    console.error("VAD failed to load", err);
  }
}

function tearDownRecording() {
  if (microphone) {
    console.log("Tearing down microphone...");
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
            entry: [
              {
                type: log(
                  (context, event) =>
                    `chunks: ${context.audioDataChunks.length}, event: ${event.type}`,
                  "Recording stopped."
                ),
              },
              {
                type: "sendData",
                params: {},
                cond: "hasData",
              },
            ],

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
        if (microphone && microphone.listening === false) {
          console.log("Starting microphone...");
          microphone.start();
        } else {
          console.log("Microphone not ready or already started", microphone);
        }

        EventBus.emit("saypi:userSpeaking");
      },

      stopRecording: (context, event) => {
        if (microphone && microphone.listening === true) {
          console.log("Stopping microphone...");
          microphone.pause();

          // Record the stop time and calculate the duration
          var stopTime = Date.now();
          var duration = stopTime - context.startTime;

          EventBus.emit("saypi:userStoppedSpeaking", { duration: duration });
        } else {
          console.log("Microphone not ready or already stopped", microphone);
        }
      },

      addData: (context, event) => {
        // Add the new data to the array
        const audioBlob = event.blob;
        console.log(
          "Adding audio data to array",
          audioBlob.type,
          audioBlob.size
        );
        audioBlob.arrayBuffer().then((buffer) => {
          context.audioDataChunks.push(buffer);
        });
      },

      sendData: (context, event) => {
        console.log("Sending data to server", context.audioDataChunks.length);
        // Create a Blob from the audio data chunks
        var audioBlob = new Blob(context.audioDataChunks, {
          type: audioMimeType,
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
