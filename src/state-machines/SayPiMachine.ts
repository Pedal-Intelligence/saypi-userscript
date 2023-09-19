import { buttonModule } from "../ButtonModule";
import { createMachine, Typestate, assign } from "xstate";
import AnimationModule from "../AnimationModule";
import { isSafari, isMobileView } from "../UserAgentModule";
import { uploadAudio, setPromptText } from "../TranscriptionModule";
import EventBus from "../EventBus";

type SayPiEvent =
  | { type: "saypi:userSpeaking" }
  | { type: "saypi:userStoppedSpeaking"; duration: number; blob?: Blob }
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
  | { type: "saypi:submit" }
  | { type: "saypi:call" }
  | { type: "saypi:hangup" };

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

/* external actions */
const clearTranscripts = assign({
  transcriptions: () => [],
});

export const machine = createMachine<SayPiContext, SayPiEvent, SayPiTypestate>(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5SwIYE8AKBLAdFgdigMYAuWAbmAMSpoAOWCxZ5KJYA2gAwC6iodAPawsZQfn4gAHogCMADgBMAVhwBOLgDZFAFk1qA7IrWbNAGhBpEi2bJxcHWxV1kOAzDsUGAvt4u1sHDAAJ2DBYNgqKVgSNjAcFAAzdmCACldHAEoadECQsIjuPiQQIRExCRKZBAVZVQ1tPUNjUwsrGrdFe0dleX1lNR0uZR8-EADcABssGLB8Aigc+kZURJRgrAAhScEiAGtIIsky0SxxSWrlRTa5OrsdWU15HQ1bTS43ZV9-XKmZ9nm+EWtAYCAYAGU6GAUHsFkcSicKhdENobjUMupHkY1MZlK4+t9xr8cNNZoCoDhgmAiOEIAscABXWAhSHQ2FApagpkskiCOhQiCsmFw3jHYSnc5VaxqeTyHAGD46NwmIydHQGNHyZSaHBuPV62TqtRuVyaQkTEn-Ob0qk04J0oE4fCCEhC9nA9Bc5nBABiBBmAAtIG6RcUBOKkVKEMphqoVPJZLodPIDOqdGiRqp9Uq1K5ZHqrubiaSATbqbT6c7XVDhRyQYxucEQ0D4eHymdKqBqooVDquFq1NqDG5nvm0QZNHGXmpDJPOiZZEXMH8yfSafhKMEyI6SMEUPhYEQNgAjBacxi7-eHk+HUUIiMd5EINzaOVcQaKBMGPoucyWRAGAYWbaimeIGLIRgpkugQltajrrpu24UpeB5Hlgp51p6F57qhN4+igWCTLeYalA+kpdogMZATg8aJjoyapqmaKGG4OAPJoBgzlqE7gYo0ErqW8HiIh9Iode6FnvWCBiWhx6QAAogAtnQJBoK2pHtuR0iUVw1G0UmKZpmirjKKo7GTimnTKDovT8Zaq5CRuIRIQkRBEAyikMpMbBnupiKPlG9FXPY2hAeBJrOPImoPDgjz6FomgjsYNh2bB5I4Ahzn0rADLHopohIVQflkZ22kIHoPY4PIXDJsMPYDOm-4IJxrGmKYnjJio35uHZVKwEI+AOhSEI1u655glg4K8vywajaGYqaaV1R1NoOCaMmngJjOJl-u0Gj1HF6ryCOhocb1cADUNOAjWyklYQgjbNlAxWLU+dTBetzyfrI23DLtKIuGxyidOB76yl1539eIV03bWHrLBNfrzLAQaCnNLZ3m2EpLXIpldJ9m0-bmf3MdqbFYhxpl6OxkOXfSOwoEN42w+6L3Y0+OKqODfR6g8eKKG4aKJQYNEfI89GKOtvR8WMFp9XTjrHjs+yQONVKM2pmMaezUbi2tugyoY76DHOaLsfK04PAmIwPEBtPQ-SSu7AcEDjQy+BO-sbORhR0aDN0Dj5m4Ti20Lbgi84JrrZ4UtKHZBDMBQ1BSSz833q9uvXE1ia+GMzoQHAkgTAtOu+wAtC+aJl9RMYOM4tic1i8eEKQSclz7ZUpsZIwi7mpjGy+mg-XZ+ThPA6el2V1nGaYXR99qNW5hBi6y8So8RDgMl4QRREQO3AW+64WftBB-t9xV8gzlHow-MuQShGPOD5UQ8kP8E+9actXDH3IJhcOTUshgmmGP2VKVpyQfxxjUTiah1Ah30NiVoTURw6jisdY6HEl4eDAQ5CktoKxAkgW9Z4vd4HNBMP9P2Is2panVHqfQZ1V53zSmWO0V1HroygEQqMugh7yg+M4GwNghhRSahOOUx0PCeEliZXSODBJ4PLPaSsLonrcMPpfeoZDEGUOxGtUwYVDQKE8D1JhMFwFrmEllQhE8O7VDVF0UCyZBicWskqIW357DHReJowcSgzRmIEnBCkmUtyiRwuJDCXDbEHzKvOf+TjL5GjcYLMRuYcC9E+PmOuQ8RjyOCRlKxYTHTEHcp5bySF1FxMHKoJwKZjrgUArpcck4MneJ+h4WwJodD5PSqElyOU8oFQWFU6o6oIJVQ0IBIYplcyNXaBOA6mDwLGjBj0wJlILoOxsVjOxlF5nWGePKWuyohhAQXPbQa9JU47O1ns9EiYMnfkeC+VMeoNRNV6GZYGulZThz-vIS5V0GZDVGQBEY8pL6-IaC4DwGYtRAyskod5DgAm30CPLbZFJPYuzBTUb+GYXj8ODn4uimTc7eCAA */
    id: "sayPi",
    initial: "inactive",
    context: { transcriptions: [] },
    states: {
      inactive: {
        description: "Idle state, not listening or speaking. Privacy mode.",
        on: {
          "saypi:call": {
            target: "listening.recording",
            description: `Enable the VAD microphone.
Aka "call" Pi.
Starts active listening.`,
            actions: ["callStarted", "startRecording"],
          },

          "saypi:piSpeaking": "responding.piSpeaking",
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
                ],

                exit: [
                  {
                    type: "stopAnimation",
                    params: {
                      animation: "userSpeaking",
                    },
                  },
                ],

                on: {
                  "saypi:userStoppedSpeaking": [
                    {
                      target: [
                        "#sayPi.listening.recording.notSpeaking",
                        "#sayPi.listening.converting.transcribing",
                      ],
                      cond: "hasAudio",
                    },
                    {
                      target: "#sayPi.listening.recording.notSpeaking",
                      cond: "hasNoAudio",
                    },
                  ],
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

            on: {
              "saypi:hangup": {
                target: "#sayPi.inactive",
                description: `Disable the VAD microphone.
    Aka "call" Pi.
    Stops active listening.`,
                actions: ["stopRecording", "releaseMicrophone", "callEnded"],
              },
            },
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
                always: {
                  target: "submitting",
                  description: `Submit combined transcript to Pi.`,
                  cond: "submissionConditionsMet",
                },
              },

              submitting: {
                description: `Submitting prompt to Pi.`,
                always: "accumulating",
                entry: "setTranscriptAsPrompt",
                exit: clearTranscripts,
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

      acquireMicrophone: (context, event) => {
        // warmup the microphone on idle in mobile view,
        // since there's no mouseover event to trigger it
        if (isMobileView()) {
          EventBus.emit("audio:setupRecording");
        }
      },

      startRecording: (context, event) => {
        EventBus.emit("audio:startRecording");
      },

      stopRecording: (context, event) => {
        EventBus.emit("audio:stopRecording");
      },

      showNotification: (context, event, { action }) => {
        const icon = action.params.icon;
        const message = action.params.message;
        buttonModule.showNotification({ icon, message });
      },

      dismissNotification: () => {
        buttonModule.dismissNotification();
      },

      combineTranscripts: assign((context) => {
        const transcript = context.transcriptions.join(" ");
        if (transcript.length > 0) {
          return {
            transcriptions: [transcript],
          };
        }
        return {};
      }),

      setTranscriptAsPrompt: (SayPiContext) => {
        const prompt = SayPiContext.transcriptions[0];
        setPromptText(prompt);
      },

      callStarted: () => {
        buttonModule.callActive();
      },
      callEnded: () => {
        buttonModule.callInactive();
      },
    },
    services: {},
    guards: {
      isSafari: (context, event) => {
        return isSafari();
      },
      hasAudio: (context: SayPiContext, event: SayPiEvent) => {
        if (event.type === "saypi:userStoppedSpeaking") {
          return event.blob !== undefined && event.duration > 0;
        }
        return false;
      },
      hasNoAudio: (context: SayPiContext, event: SayPiEvent) => {
        if (event.type === "saypi:userStoppedSpeaking") {
          return (
            event.blob === undefined ||
            event.blob.size === 0 ||
            event.duration === 0
          );
        }
        return false;
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
