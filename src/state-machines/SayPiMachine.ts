import { buttonModule } from "../ButtonModule";
import { createMachine, Typestate } from "xstate";
import AnimationModule from "../AnimationModule";
import { isSafari, isMobileView } from "../UserAgentModule";
import { uploadAudio, setPromptText } from "../TranscriptionModule";
import EventBus from "../EventBus";

type SayPiEvent =
  | { type: "saypi:userSpeaking" }
  | { type: "saypi:userStoppedSpeaking"; duration: number; blob: Blob }
  | { type: "saypi:userFinishedSpeaking" }
  | { type: "saypi:transcribed"; text: string }
  | { type: "saypi:transcribeFailed" }
  | { type: "saypi:transcribedEmpty" }
  | { type: "saypi:safariBlocked" }
  | { type: "saypi:piSpeaking" }
  | { type: "saypi:piStoppedSpeaking" }
  | { type: "saypi:piFinishedSpeaking" }
  | { type: "saypi:ready" }
  | { type: "saypi:unblock" }
  | { type: "saypi:submit" };

interface SayPiContext {
  transcriptions: string[];
}

// Define the state schema
type SayPiStateSchema = {
  states: {
    inactive: {};
    errors: {
      states: {
        transcribeFailed: {};
        micError: {};
      };
    };
    listening: {
      states: {
        recording: {
          states: {
            userSpeaking: {};
            notSpeaking: {};
          };
        };
        converting: {
          states: {
            transcribing: {};
            accumulating: {};
            submitting: {};
          };
        };
      };
    };
    responding: {
      states: {
        piSpeaking: {};
        loading: {};
        blocked: {};
      };
    };
  };
};

interface SayPiTypestate extends Typestate<SayPiContext> {
  value: "listening" | "inactive" | "errors" | "responding";
  context: SayPiContext;
}

export const machine = createMachine<SayPiContext, SayPiEvent, SayPiTypestate>(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5SwIYE8AKBLAdFgdigMYAuWAbmAMSpoAOWCArrGAE4DKdYKA1gVADaABgC6iUHQD2sLGSn4JIAB6IArMIAsAJhzCAjGoAcANgCcJ89qMAaEGkRmjuzWbdnhwy0bWbNAX387WmwcdjYpNlgqZVgSFBIwHBQAM0S2AAp9T08AShp0UPDI2BFxJBBpWXlFCtUEDQBmXQNjc0szazsHBCN9HFd3S019AHYTQ0bA4MLcABssOLB8AQL6RlQUlDYsACE5qSJeSDKlKrksBSV6k21uxH1s3W0NYUbG701hNRNpkBD5otEit8FA1gwEAwuDx+KDThVzjVruo7vYHoZdKNBhN9JpRmY-Go-gCcAsliCoDg2GAiJEIAIcCx2NC+KtaBCmZwSFI6NwICzYUIxGcZBcrnVENoLEYcKM3vpbqMNH1RvcEJojGYcC9PO9RtpRuMPsTZqSgcsGdTaWx6aCcPgpCQBWz0BzWGwAGIERYAC0gzrhwoRoqREoa3xahlMFistjRCDMzT0OVuxlGjUM+hNmEB5MtNLpDIdTu4rNB4MYnIDQvKkhDl1qoHq2m0Hz0PkNBLUHy0apMbde+jMj2ERh7RmzoTJwIZtPwlDYZDtJDYKHwsCIOwARi71ggV2uN9uTkG69UG8iEOO9Inxjqx2o1GqvjKDY1fPptMJRkOzFjJ7mM52nOC5LpSB7rpuWA7uW7KMBBR7QWAHooFgcwnrWlT1uKTbqG8kZtDGnRxj0ahuDgg7vOYhL4gBZp5sBCigQyCFQTBYJwfuq6QceEAAKIALZ0CQaDwmeYqNioeFqAR0YdF08YmH0FGeNkjQavo6naHR04Wox87sGByREEQTACUwcwJLuEKwEwW4CXIYlYeeOFSeqOijHoipfn4Cp+M+Gbaq8ZgyeY6afnR1KwNI+C2pSUKloKFaQlgHDcry-qJQITmIheYaGDJOAmBqUrCB4WjNCYaoycIOBju+uKVZ4riRXAMVxTgCUwtZlbutWOXYZJ9QFboxXOB45WaJVz5yjg7zvqYRiaMVJhka10UKB1XVlhxrqMAwXorLAfr8llgaYblrnDY+o0lRNzXTfGag-nN7y+UY3y+AEQT-KaUXtQyBwoHFyXbYKA0uUNjgvHVzhYviZXmI0JHqI0tVKsILyGMVXyNKM60A3aW4HEckDJdSwOiaezkSZeflFTq3ZKViIVPvGGa1VKP4-EY+pSn4+M-SS-2bQyxOHMcEDJUw+Di0cEO02GZGaMmngmIjX7IyjDRo7KGhYz8fhvILP0OhAcBKACIqQ5emhqgAtL8QumgQxBkJQ1uK7hOtDjguJGB9xhDmR+hqp0jRBWrXYvA+dHFFEnuht7vhfnohjpjoSmfqq8ZTZz+sB++2jmKOcdsBEUQ4Kxx4oWhkCJ3lyfLTKrQZ8XfQGtVtyR-oAdfkqxffTMOZhOXJQ4A5RB8WPbAN1d6jN2nz1aVnnfxvqnkY1ompKW+2nOyPukUnPUMIGM+I4B4tyNUavM5z05GvAYSqDAHbw6eaFJUgWNoCCfdNw0vl4bQN9+x3zVM0FWw4TDjA1N+HQakP4MUpFaQsdoqxnSgP-MM2hfKykxgSL8q0QFTWfD8S+CpnBTR8M4TGUwD5Tk-vma0HVizVmwd7XuSogHXymrfQ0fZrAUTHHiD6q1DTLSQUBSkIFDJ-2DDbMMzQWx1Qxj+TQGh+ytggY8VWo59ZKnGF4KRekZFMTkcubiiF2IcLcs0WavMNDqM0c0Roz5cEqU8ONP88pBbD0YcgnAsjFwMmIKZcylkwK2PqI0RMagvLF2VvidWvgIFOE8VoMYyM-AwJMV-YJRlbL2TkFEhRXs3J4nMH7AwPhlQGHfGzHoOh4k6i8K4HesTHwE1FqCaJC81RjFfH+c+BUYFygnAw3AItYoMjBvI8SSc3KPE-BRUYH0nBLWsFKKqudfCvXfG8McS1DndJmXaIGcU+kIEMbKAOf5iqGmNjsppF8cjWEmP3KipyOpy0llcp4z4pqR1bKInQIwTb+CAA */
    id: "sayPi",
    initial: "listening",
    context: { transcriptions: [] },
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
                description:
                  "Transcribing audio to text.\nCard flip animation.",
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
Submits a prompt when a threshold is reached.`,
                entry: "combineTranscripts",
                on: {
                  "saypi:submit": {
                    target: "submitting",
                    description: `Submit combined transcript to Pi.`,
                    cond: "submissionConditionsMet",
                  },
                },
              },

              submitting: {
                description: `Submitting prompt to Pi.`,
              },
            },
          },
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

      transcribeAudio: (
        context,
        event: {
          type: "saypi:userStoppedSpeaking";
          duration: number;
          blob: Blob;
        }
      ) => {
        console.log("transcribeAudio", event);
        const audioBlob = event.blob;
        uploadAudio(audioBlob, event.duration);
      },

      handleTranscriptionResponse: (
        SayPiContext,
        event: { type: "saypi:transcribed"; text: string }
      ) => {
        console.log("handleTranscriptionResponse", event);
        const transcription = event.text;
        SayPiContext.transcriptions.push(transcription);
      },

      showPlayButton: (context, event) => {
        buttonModule.showPlayButton();
      },

      hidePlayButton: (context, event) => {
        buttonModule.hidePlayButton();
      },

      activateTalkButton: (context, event) => {
        const talkButton = document.getElementById("saypi-talkButton");
        if (!talkButton) {
          return;
        }
        talkButton.classList.add("active"); // Add the active class (for Firefox on Android)
      },

      deactivateTalkButton: (context, event) => {
        const talkButton = document.getElementById("saypi-talkButton");
        if (!talkButton) {
          return;
        }
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

      dismissNotification: () => {
        buttonModule.dismissNotification();
      },
      combineTranscripts: (SayPiContext) => {
        const prompt = SayPiContext.transcriptions.join(" ");
        if (prompt.length > 0) {
          setPromptText(prompt);
        }
      },
    },
    services: {},
    guards: {
      isSafari: (context, event) => {
        return isSafari();
      },
      submissionConditionsMet: (SayPiContext, event, meta) => {
        const { state } = meta;
        const allowedState = !(
          state.matches("listening.recording.userSpeaking") ||
          state.matches("listening.converting.transcribing")
        );
        const transcriptsMerged = SayPiContext.transcriptions.length == 1;
        return allowedState && transcriptsMerged;
      },
    },
    delays: {},
  }
);
