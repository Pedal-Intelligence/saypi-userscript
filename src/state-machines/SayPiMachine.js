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
    /** @xstate-layout N4IgpgJg5mDOIC5SwIYE8AKBLAdFgdigMYAuWAbmAMSpoAOWCArrGAE4DKdYKA1gVADaABgC6iUHQD2sLGSn4JIAB6IALAFZhAZhzCAbACYAHAHZDATgCM+7Ru0AaEGkQX9FnIZ1rzV7Wu1tY20AXxCnWmwcdjYpNlgqZVgSFBIwHBQAMzS2AAorYULhAEoadCiYuNgRcSQQaVl5RTrVBDU1C10DE3NrW3snFwRjQxwrKwsLM0K1Q3H9DTCI8twAGyxksHwBMvpGVEyUNiwAIVWpIl5IGqUGuSwFJVajQcQC42McC3sNKzU-wzafTtJYgSJrDZpbb4KC7BgIBhcHj8GE3Op3JpPRAaQyvBDjbSmHCaQLGYR+UymfQfUHgnDrTbQqA4IgKShsMgwnAkNgofCwIjHABGO1o8J5fIFwuuYluMnujxaiCBBj0nWMHUs2gsan0pjxamEGhwpi0wjJVkp1j+tJW9MhWwELLZ7E5zIl-MFWBFMLhjA9Uu9YAAYigsKsZbVJPLMUq2h0ukYzJYbHZHM5sWZPDo5uZzdorCNbZgIYynaz8Oy3dzeZ7haL0OLa4GhZAAKIAWzoJDQaOjjQezVArXanT0Sd6qYGGYQ+j12e0JkMRlMOiCxaiDKhTrYYFZbAgTpY7CRfAbe2YrE4JCkdG4EFPKKEsvRMcHWIQlmpJp0a+MCz+DR9RnNR-xNZdzCAwsqTUDdS23Lld33Q8uXwKQSEfc94WPNhgwIDYAAtIEw1EX37BUhxUdRfkTHoU36dMhmsT5V1JYxxhGf8rDg+0y0Qvc4hQ5k0Iw7gz19MVGBwkjnyjeo30VYdEEMQF9D0YwNH-AIrHscw1DxIxdC8AsFgsclDNMHjd1gaR8CEnBETEp8-QRLAOBvO9iKcgQ+3kgdFKo-ENBxHBgRGIxqXJKY8S0Il7GBaxDW+QwfFCcIwTtazbPsxzkSwqSrxk3yMXfOMdJCsLl2XC1opAoC9CBDQ9XGVcVNMWD0rpLKFBytzvIkxtGAYPDtlgIiH362S5X8yjWnK0ZKoimrjBizSGoWU1ZmCykrLgbKnXOFAhJc3LxKm18Zo-CxDGND5DBg75zTcCwYstYl7C8dxCULYJdpsnqnSFc5LkgFzdyO3syL8iiPxsNRQpStwtJ0ixV30mdLCJIpCk6OxzEsP79q5IGLiuCAXKYfAScuYqFNm7EdT0Io5g+VG-CsV6iRJT7OlMH60vStCIDgJRwWmmG43RoYAFpjSCGZvmpdphCpbjOrtAhiDIShxdjJS2lMMkxm+Q2zJU9iVpnMyPG+fwVO0QozEmHjKniXXSv10CNA8bpnomDR-kY9QbC+ewJgd3pNGMF22FieIa0lL1W1DcNIHdgKRzMrGjD975A5i0DQ8XTR3CtG11ZLaJY6qHAOywIg22rth0-ptos-HL9rDzvw8T5+HuYDikmqNHit0dGEW9hq0vgMGwqXaw3bDxAphDGLxCho66dQsUeHSZZ1K1dJ0AyTgRJ7jRdvzMUDgRUlWzP0A0vC+KlmsJaw5kMXe+OZJDBLPi6Et9aFnujPfQc89Q+H-EHBABYrChQmB-YwuNw4dWWJXMe+8-4HiPIVSa599YpX+D+B24xUYBwLJbIY7RdDgKmBpBYthkEam-ghX+AkcGoXQjJAhgVoLGgfhAhe0CDI6U8P+ew-hLTBXNITAGE9AF60CgHZeCwmaFEauYBYKU5F2SdKdJ8vC5rjFGEBMkKlbCrnAVLdQxCdALBJHzS0mhdH2UOkJIxiBTRElNhvSk7VOiPxAmo1iKUrCAnJEuNBGVK7dT0cTYGZNPH4mELiEClgi46VNO8NW6DNx73LC6DkADyJKNaIuZ+18tJ31MA-PEBYPA3RmIg2pDDWHj2ZBWKsTpiBECYB2JgqxUglOhmU5UnR4HdDnJjAo4SDTjBfnOdqhpwH3TVmEIAA */
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
                    target: "#sayPi.listening.converting.transcribing",
                  },
                },
              },

              notSpeaking: {
                description:
                  "Microphone is recording but no speech is detected.",
                on: {
                  "saypi:userFinishedSpeaking": "#sayPi.inactive",
                  "saypi:userSpeaking": "userSpeaking",
                },
              },
            },

            description: `Microphone is on and VAD is actively listending for user speech.`,
          },

          converting: {
            initial: "accumulating",

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
                    target: "accumulating",
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

              accumulating: {
                description: `Accumulating and assembling audio transcriptions into a cohesive prompt.
Submits a prompt when a threshold is reached.`
              }
            }
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
