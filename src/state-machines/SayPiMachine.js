import { buttonModule } from "../ButtonModule";
import { createMachine } from "xstate";
import AnimationModule from "../AnimationModule";
import { isSafari, isMobileView } from "../UserAgentModule";
import {
  uploadAudio,
  handleTranscriptionResponse,
} from "../TranscriptionModule";
import EventBus from "../EventBus";

export const machine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5SwIYE8AKBLAdFgdigMYAuWAbmAMSpoAOWCArrGAE4DKdYKA1gVADaABgC6iUHQD2sLGSn4JIAB6IAzAA4AnABYcWgGwBGAEwa1AdgMndFgKwAaEGkRa1JnCZPWTRtWq07HS0AXxCnWmwcdjYpNlgqZVgSFBIwHBQAMzS2AAojYULhAEoadCiYuNgRcSQQaVl5RTrVBE0NPUNTcysbHXsnFwQNIxw7IsK7ApM1Ow07MIjy3AAbLGSwfAEy+kZUTJQ2LAAhFakiXkgapQa5LAUlVutBxAKp-Ss1IysLQO+1RYgSKrdZpLb4KA7BgIBhcHj8CHXOq3JqPRB2EwvBBGaY4frWAz2HFGDS-QHAnBrDbgqA4NhgIhxCACHAsdhwvjbWjQtmcEhSOjcCAchFCMQ3GR3B4tRAzUn6YQGHR2YwmHTKoJYixGLQ4eamFUYnQmOx2Czk5aU0GbFn0xlsZkQ1msTjcTkQqGMEhsFD4WBEI4AIwESMkktRMraOrsOAsFkslh0BjsgQMWIxHnxOksao0HSVFswIOptoZTJZ+CkJBFXPQPJdADECOsABaQGuI8XI8P3ZqgVoBYSdVU9ay2RzORAGDQGHBGbPCNTCONqQmFqJUsEs72+-1B2u7BA7v0BrCBq5dsONXtoqOBWPxx9JlMqrHuDT6LRfpeP8YmdfFluTrHnuZ4HtCIGnueDYoFgKwXrUV5Sn2KjqHmw7dJYY79BOQyzGoOBKl8ASEiYi7WABVolsBPonvuHrcl6tGgeeEAAKIALZ0CQaChvUPbSv2aEdPoI5YX0AyTgg2YxkRwgpsEQTBN8lH0rA0j4I6tKwm6oqejCWAcPygrtrpIaXvx16Cah2Kmh4SrzIqhRaGYphYoSFgfMmagahYXjmKpcAaVpOA6fC4GMLyHZiohlnIbeRh2YROiOQYzmuZiUnWJ5+I+SScY2DqgXqQoIVhe6kKMQZTZbLAbbCmZnaxSiN6RolGLJal6UjJlQx+R++JqolOiKv4xXBSyZwoFp+nlaKfEtdZrQuTGeYmL8bhaOhRjufK2hLou3yksmoThEClpqRNTqBmcFyQPp9LTbxFmLShrRGEqhEmsI62-OMpj+FiSY5SNH12doX7quNpUsjd5yXBA+lMPgcMXAtAlveiug4BM2oWPJZizLtnn7YUXwWMdKaUZuNpOna5ZOpW1aNZVdaRS60Xo1ZmMICa2NaD8eYqqY3zuZ9AsGLMcbzDopjmoClYQHASjAhK3O3joWIALSzhMq6KkNyYUWdFIEMQZCUGr8WRrLfk47oOIzkEwgdO5cY4AES6+FYBikTolGVPEVsRkJ0kmh4XTuJHaU7VJJJ6J7Q6rsquhePLSxFtEbCxPEOCQUGYAwXBkDB61ocLsIol+DYxj67HeEfR7bhDsq8Y+caAfZ1UOAcVgRBsV3bCl0tiAV1XUe1zHQMjHqbjDQp85y9T1o0sPPPfPzo0zPj2oE1iOI5V+uhfL4BiBFYy-UbS9MOiyUUs2vCXaJXWhb5Yy5vL16Lu1mcyy+YUMTaWhpjSOkZZb6MyrNFR+kYzCFDGLoIcJJDC+HWu5bMnhvCy1PkmEYBhL5AVpPnMCEIYGh1mF4WMxp1T+WzKmN87g9TCAFsENUf8frQ00gIMhNlNRSX8DGdUwgPpJmESmewnCyqGQft2dWbUcQeDNBob2xofyJXcjiPEVh1TzlXJYOYkjJpSGmtw2R1tQ72E8hTV+Z9tAdB1BYdyq45zGi2sqd87h-ZAMzpdGG11boIx4e9H67l4Gew+ltPM84LBeIzhuFepZ7RaSCa8DoEc3470-kDJMWilSBDMCMY0F8wghCAA */
    id: "sayPi",
    initial: "listening",
    states: {
      inactive: {
        description: "Idle state, not listening or speaking. Privacy mode.",
        on: {
          "saypi:userSpeaking": "listening",
        },
      },

      errors: {
        description: "Error parent state.",

        after: {
          10000: {
            target: "listening",
            actions: [],
            description: "Reset to the idle state and clear errors.",
          },
        },

        initial: "transcribeFailed",

        states: {
          transcribeFailed: {
            description: "The /transcribe API responded with an error.",
            type: "final",
            entry: {
              type: "startAnimation",
              params: {
                animation: "error",
              },
            },

            exit: {
              type: "stopAnimation",
              params: {
                animation: "error",
              },
            },
          },

          micError: {
            type: "final",
            description: `No audio input detected`,
            entry: {
              type: "showNotification",
              params: { icon: "muted-microphone" },
            },
            exit: {
              type: "dismissNotification",
              params: {},
            },
          },
        },
      },

      listening: {
        states: {
          transcribing: {
            description: "Transcribing audio to text.\nCard flip animation.",
            entry: [
              {
                type: "startAnimation",
                params: {
                  animation: "transcribing",
                },
              },
              {
                type: "transcribeAudio",
                params: {},
              },
            ],
            exit: {
              type: "stopAnimation",
              params: {
                animation: "transcribing",
              },
            },
            on: {
              "saypi:transcribed": {
                target: "recording.notSpeaking",
                actions: {
                  type: "handleTranscriptionResponse",
                  params: {},
                },
                description: "Successfully transcribed user audio to text.",
              },

              "saypi:transcribeFailed": {
                target: "#sayPi.errors.transcribeFailed",
                description:
                  "Received an error response from the /transcribe API",
              },

              "saypi:transcribedEmpty": {
                target: "#sayPi.errors.micError",
                description:
                  "Received an empty response from the /transcribe API (no speech detected)",
              },
            },
          },

          recording: {
            initial: "notSpeaking",

            states: {
              userSpeaking: {
                description:
                  "User is speaking and being recorded by the microphone.\nWaveform animation.",

                entry: [
                  {
                    type: "startAnimation",
                    params: {
                      animation: "userSpeaking",
                    },
                  },
                  "activateTalkButton",
                ],

                exit: [
                  {
                    type: "stopAnimation",
                    params: {
                      animation: "userSpeaking",
                    },
                  },
                  "deactivateTalkButton",
                ],

                on: {
                  "saypi:userStoppedSpeaking": {
                    target: "transcribing",
                    cond: "longEnoughForUpload",
                  },
                  "saypi:userStoppedSpeaking": {
                    target: "notSpeaking",
                    cond: "tooShortForUpload",
                  },
                  "saypi:transcribing": {
                    target: "#sayPi.listening.transcribing",
                  },
                },
              },

              notSpeaking: {
                description: "Microphone is recording but no speech is detected.",
                on: {
                  "saypi:userFinishedSpeaking": "#sayPi.inactive",
                  "saypi:userSpeaking": "userSpeaking"
                },
              }
            },

            description: `Microphone is on and VAD is actively listending for user speech.`
          }
        },
        entry: ["stopAllAnimations", "acquireMicrophone"],
        on: {
          "saypi:safariBlocked": {
            target: "#sayPi.responding.blocked",
            cond: "isSafari",
          },
          "saypi:piSpeaking": {
            target: "#sayPi.responding.piSpeaking",
          },
        },
        description: `Actively listening for user input. Simultaneously recording and transcribing user speech. Gentle pulsing animation.`,
        type: "parallel",
      },

      responding: {
        description: `Pi is responding. Synthesised speech is playing or waiting to play.`,
        initial: "piSpeaking",

        states: {
          piSpeaking: {
            description:
              "Pi's synthesised speech audio is playing.\nPlayful animation.",
            entry: {
              type: "startAnimation",
              params: {
                animation: "piSpeaking",
              },
            },
            exit: {
              type: "stopAnimation",
              params: {
                animation: "piSpeaking",
              },
            },
            on: {
              "saypi:piStoppedSpeaking": {
                target: "#sayPi.listening",
              },
              "saypi:userSpeaking": {
                target: "#sayPi.listening.recording.userSpeaking",
              },
              "saypi:piFinishedSpeaking": {
                target: "#sayPi.listening",
              },
            },
          },

          loading: {
            description: "Pi's audio is loading.",
            entry: {
              type: "startAnimation",
              params: {
                animation: "loading",
              },
            },
            exit: {
              type: "stopAnimation",
              params: {
                animation: "loading",
              },
            },
            on: {
              "saypi:piSpeaking": {
                target: "piSpeaking",
              },
            },
          },

          blocked: {
            description:
              "Blocking action on Safari.\nUser must press play to hear Pi's response.\nBounce animation.",
            entry: [
              {
                type: "startAnimation",
                params: {
                  animation: "paused",
                },
              },
              "showPlayButton",
            ],
            exit: [
              {
                type: "stopAnimation",
                params: {
                  animation: "paused",
                },
              },
              "hidePlayButton",
            ],
            on: {
              "saypi:ready": {
                target: "blocked",
                internal: true,
                description: `Enough audio has been buffered to start playback.`,
                actions: "showPlayButton",
              },

              "saypi:unblock": {
                target: "loading",
              },
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
      stopAllAnimations: (context, event) => {
        AnimationModule.stopAllAnimations();
      },

      startAnimation: (context, event, { action }) => {
        AnimationModule.startAnimation(action.params.animation);
      },

      stopAnimation: (context, event, { action }) => {
        AnimationModule.stopAnimation(action.params.animation);
      },

      transcribeAudio: (context, event) => {
        console.log("transcribeAudio", event);
        const audioBlob = event.blob;
        uploadAudio(audioBlob, event.duration);
      },

      handleTranscriptionResponse: (context, event) => {
        console.log("handleTranscriptionResponse", event);
        const transcription = event.text;
        handleTranscriptionResponse(transcription);
      },

      showPlayButton: (context, event) => {
        buttonModule.showPlayButton();
      },

      hidePlayButton: (context, event) => {
        buttonModule.hidePlayButton();
      },

      activateTalkButton: (context, event) => {
        const talkButton = document.getElementById("saypi-talkButton");
        talkButton.classList.add("active"); // Add the active class (for Firefox on Android)
      },

      deactivateTalkButton: (context, event) => {
        const talkButton = document.getElementById("saypi-talkButton");
        talkButton.classList.remove("active"); // Remove the active class (for Firefox on Android)
      },

      acquireMicrophone: (context, event) => {
        // warmup the microphone on idle in mobile view,
        // since there's no mouseover event to trigger it
        if (isMobileView()) {
          EventBus.emit("audio:setupRecording");
        }
      },

      showNotification: (context, event, { action }) => {
        const icon = action.params.icon;
        const message = action.params.message;
        buttonModule.showNotification({ icon, message });
      },

      dismissNotification: (context, event) => {
        buttonModule.dismissNotification();
      },
    },
    services: {},
    guards: {
      tooShortForUpload: (context, event) => {
        return event.duration < 1000;
      },

      longEnoughForUpload: (context, event) => {
        return event.duration >= 1000;
      },

      isSafari: (context, event) => {
        return isSafari();
      },
    },
    delays: {},
  }
);
