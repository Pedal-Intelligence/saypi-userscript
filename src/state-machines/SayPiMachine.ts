import { buttonModule } from "../ButtonModule.js";
import { createMachine, Typestate, assign } from "xstate";
import AnimationModule from "../AnimationModule.js";
import { isMobileView } from "../UserAgentModule.js";
import {
  uploadAudioWithRetry,
  setPromptText,
  isTranscriptionPending,
  clearPendingTranscriptions,
  mergeTranscripts,
} from "../TranscriptionModule";
import EventBus from "../EventBus";

type SayPiTranscribedEvent = {
  type: "saypi:transcribed";
  text: string;
  sequenceNumber: number;
  pFinishedSpeaking?: number;
  tempo?: number;
};

type SayPiSpeechStoppedEvent = {
  type: "saypi:userStoppedSpeaking";
  duration: number;
  blob?: Blob;
};

type SayPiEvent =
  | { type: "saypi:userSpeaking" }
  | SayPiSpeechStoppedEvent
  | { type: "saypi:userFinishedSpeaking" }
  | SayPiTranscribedEvent
  | { type: "saypi:transcribeFailed" }
  | { type: "saypi:transcribedEmpty" }
  | { type: "saypi:piSpeaking" }
  | { type: "saypi:piStoppedSpeaking" }
  | { type: "saypi:piFinishedSpeaking" }
  | { type: "saypi:submit" }
  | { type: "saypi:call" }
  | { type: "saypi:hangup" };

interface SayPiContext {
  transcriptions: Record<number, string>;
  lastState: "inactive" | "listening";
  timeUserStoppedSpeaking: number;
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
      };
    };
  };
};

interface SayPiTypestate extends Typestate<SayPiContext> {
  value: "listening" | "inactive" | "errors" | "responding";
  context: SayPiContext;
}

/* helper functions */
export function calculateDelay(
  timeUserStoppedSpeaking: number,
  probabilityFinished: number,
  tempo: number,
  maxDelay: number
): number {
  // Get the current time (in milliseconds)
  const currentTime = new Date().getTime();

  // Calculate the time elapsed since the user stopped speaking (in milliseconds)
  const timeElapsed = currentTime - timeUserStoppedSpeaking;

  // We invert the tempo because a faster speech (tempo approaching 1) should reduce the delay
  let tempoFactor = 1 - tempo;

  // Calculate the combined probability factor
  let combinedProbability = probabilityFinished * tempoFactor;

  // The combined factor influences the initial delay
  const initialDelay = combinedProbability * maxDelay;

  // Calculate the final delay after accounting for the time already elapsed
  const finalDelay = Math.max(initialDelay - timeElapsed, 0);
  return finalDelay;
}

/* external actions */
const clearTranscripts = assign({
  transcriptions: () => ({}),
});

export const machine = createMachine<SayPiContext, SayPiEvent, SayPiTypestate>(
  {
    context: {
      transcriptions: {},
      lastState: "inactive",
      timeUserStoppedSpeaking: 0,
    },
    id: "sayPi",
    initial: "inactive",
    states: {
      inactive: {
        description: "Idle state, not listening or speaking. Privacy mode.",
        exit: assign({ lastState: "inactive" }),
        on: {
          "saypi:call": {
            target: "#sayPi.listening.recording",
            actions: [
              {
                type: "callStarted",
              },
              {
                type: "startRecording",
              },
            ],
            description:
              'Enable the VAD microphone.\nAka "call" Pi.\nStarts active listening.',
          },
          "saypi:piSpeaking": {
            target: "#sayPi.responding.piSpeaking",
          },
        },
      },
      errors: {
        description: "Error parent state.",
        after: {
          "10000": [
            {
              target: "#sayPi.listening",
              actions: [],
              description: "Reset to the idle state and clear errors.",
            },
            {
              internal: false,
            },
          ],
        },
        initial: "transcribeFailed",
        states: {
          transcribeFailed: {
            description: "The /transcribe API responded with an error.",
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
            type: "final",
          },
          micError: {
            description: "No audio input detected",
            entry: {
              type: "showNotification",
              params: {
                icon: "muted-microphone",
              },
            },
            exit: {
              type: "dismissNotification",
            },
            type: "final",
          },
        },
      },
      listening: {
        description:
          "Actively listening for user input. Simultaneously recording and transcribing user speech. Gentle pulsing animation.",
        entry: [
          {
            type: "stopAllAnimations",
          },
          {
            type: "acquireMicrophone",
          },
        ],
        exit: assign({ lastState: "listening" }),
        states: {
          recording: {
            description:
              "Microphone is on and VAD is actively listening for user speech.",
            initial: "notSpeaking",
            states: {
              notSpeaking: {
                description:
                  "Microphone is recording but no speech is detected.",
                on: {
                  "saypi:userFinishedSpeaking": {
                    target: "#sayPi.inactive",
                  },
                  "saypi:userSpeaking": {
                    target: "userSpeaking",
                  },
                },
              },
              userSpeaking: {
                description:
                  "User is speaking and being recorded by the microphone.\nWaveform animation.",
                entry: {
                  type: "startAnimation",
                  params: {
                    animation: "userSpeaking",
                  },
                },
                exit: {
                  type: "stopAnimation",
                  params: {
                    animation: "userSpeaking",
                  },
                },
                on: {
                  "saypi:userStoppedSpeaking": [
                    {
                      target: [
                        "notSpeaking",
                        "#sayPi.listening.converting.transcribing",
                      ],
                      cond: "hasAudio",
                      actions: [
                        assign({
                          timeUserStoppedSpeaking: () => new Date().getTime(),
                        }),
                        {
                          type: "transcribeAudio",
                        },
                      ],
                    },
                    {
                      target: "notSpeaking",
                      cond: "hasNoAudio",
                    },
                  ],
                },
              },
            },
            on: {
              "saypi:hangup": {
                target: "#sayPi.inactive",
                actions: [
                  {
                    type: "stopRecording",
                  },
                  {
                    type: "releaseMicrophone",
                  },
                  {
                    type: "callEnded",
                  },
                ],
                description:
                  'Disable the VAD microphone.\n    Aka "call" Pi.\n    Stops active listening.',
              },
            },
          },
          converting: {
            initial: "accumulating",
            states: {
              accumulating: {
                description:
                  "Accumulating and assembling audio transcriptions into a cohesive prompt.\nSubmits a prompt when a threshold is reached.",
                after: {
                  submissionDelay: {
                    target: "submitting",
                    cond: "submissionConditionsMet",
                    description: "Submit combined transcript to Pi.",
                  },
                },
                on: {
                  "saypi:transcribed": {
                    target: "accumulating",
                    actions: {
                      type: "handleTranscriptionResponse",
                    },
                    description:
                      "Transcribed speech to text (out of sequence response).",
                  },
                  "saypi:transcribeFailed": {
                    target: "#sayPi.errors.transcribeFailed",
                    description:
                      "Out of sequence error response from the /transcribe API",
                  },
                  "saypi:transcribedEmpty": {
                    target: "#sayPi.errors.micError",
                    description:
                      "Out of sequence empty response from the /transcribe API",
                  },
                },
              },
              submitting: {
                description: "Submitting prompt to Pi.",
                entry: {
                  type: "mergeAndSubmitTranscript",
                },
                exit: [clearTranscripts, clearPendingTranscriptions],
                always: {
                  target: "accumulating",
                },
              },
              transcribing: {
                description:
                  "Transcribing audio to text.\nCard flip animation.",
                entry: {
                  type: "startAnimation",
                  params: {
                    animation: "transcribing",
                  },
                },
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
            },
          },
        },
        on: {
          "saypi:piSpeaking": {
            target: "#sayPi.responding.piSpeaking",
          },
        },
        type: "parallel",
      },
      responding: {
        description:
          "Pi is responding. Synthesised speech is playing or waiting to play.",
        entry: {
          type: "disableCallButton",
        },
        exit: {
          type: "enableCallButton",
        },
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
              "saypi:piStoppedSpeaking": [
                {
                  target: "#sayPi.listening",
                  cond: "wasListening",
                },
                {
                  target: "#sayPi.inactive",
                  cond: "wasInactive",
                },
              ],
              "saypi:userSpeaking": {
                target: "#sayPi.listening.recording.userSpeaking",
              },
              "saypi:piFinishedSpeaking": {
                target: "#sayPi.listening",
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
        context: SayPiContext,
        event: SayPiSpeechStoppedEvent
      ) => {
        const audioBlob = event.blob;
        if (audioBlob) {
          uploadAudioWithRetry(
            audioBlob,
            event.duration,
            context.transcriptions
          );
        }
      },

      handleTranscriptionResponse: (
        SayPiContext,
        event: SayPiTranscribedEvent
      ) => {
        console.log("handleTranscriptionResponse", event);
        const transcription = event.text;
        const sequenceNumber = event.sequenceNumber;
        SayPiContext.transcriptions[sequenceNumber] = transcription;
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

      mergeAndSubmitTranscript: (context) => {
        const prompt = mergeTranscripts(context.transcriptions).trim();
        if (prompt) setPromptText(prompt);
      },

      callStarted: () => {
        buttonModule.callActive();
      },
      callEnded: () => {
        buttonModule.callInactive();
      },
      disableCallButton: () => {
        buttonModule.disableCallButton();
      },
      enableCallButton: () => {
        buttonModule.enableCallButton();
      },
    },
    services: {},
    guards: {
      hasAudio: (context: SayPiContext, event: SayPiEvent) => {
        if (event.type === "saypi:userStoppedSpeaking") {
          event = event as SayPiSpeechStoppedEvent;
          return event.blob !== undefined && event.duration > 0;
        }
        return false;
      },
      hasNoAudio: (context: SayPiContext, event: SayPiEvent) => {
        if (event.type === "saypi:userStoppedSpeaking") {
          event = event as SayPiSpeechStoppedEvent;
          return (
            event.blob === undefined ||
            event.blob.size === 0 ||
            event.duration === 0
          );
        }
        return false;
      },
      submissionConditionsMet: (
        context: SayPiContext,
        event: SayPiEvent,
        meta
      ) => {
        const { state } = meta;
        const allowedState = !(
          state.matches("listening.recording.userSpeaking") ||
          state.matches("listening.converting.transcribing")
        );
        const empty = Object.keys(context.transcriptions).length === 0;
        const pending = isTranscriptionPending();
        const ready = allowedState && !empty && !pending;
        return ready;
      },
      wasListening: (context: SayPiContext) => {
        return context.lastState === "listening";
      },
      wasInactive: (context: SayPiContext) => {
        return context.lastState === "inactive";
      },
    },
    delays: {
      submissionDelay: (context: SayPiContext, event: SayPiEvent) => {
        // check if the event is a transcription event
        if (event.type !== "saypi:transcribed") {
          return 0;
        } else {
          event = event as SayPiTranscribedEvent;
        }

        const maxDelay = 10000; // 10 seconds in milliseconds

        // Calculate the initial delay based on pFinishedSpeaking
        let probabilityFinished = 1;
        if (event.pFinishedSpeaking !== undefined) {
          probabilityFinished = event.pFinishedSpeaking;
        }

        // Incorporate the tempo into the delay, defaulting to 0.5 (average tempo) if undefined
        let tempo = event.tempo !== undefined ? event.tempo : 0.5;

        const finalDelay = calculateDelay(
          context.timeUserStoppedSpeaking,
          probabilityFinished,
          tempo,
          maxDelay
        );

        console.log(
          "Waiting for",
          (finalDelay / 1000).toFixed(1),
          "seconds before submitting"
        );

        return finalDelay;
      },
    },
  }
);
