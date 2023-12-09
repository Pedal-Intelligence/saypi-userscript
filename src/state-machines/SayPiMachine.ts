import { buttonModule } from "../ButtonModule.js";
import { createMachine, Typestate, assign, log, DoneInvokeEvent, State } from "xstate";
import AnimationModule from "../AnimationModule.js";
import { AudibleNotificationsModule, VisualNotificationsModule } from "../NotificationsModule";
import { isMobileView } from "../UserAgentModule.js";
import {
  uploadAudioWithRetry,
  setDraftPrompt,
  setFinalPrompt,
  isTranscriptionPending,
  clearPendingTranscriptions,
} from "../TranscriptionModule";
import { TranscriptMergeService } from "../TranscriptMergeService";
import { config } from "../ConfigModule";
import EventBus from "../EventBus";
import { calculateDelay } from "../TimerModule";

type SayPiTranscribedEvent = {
  type: "saypi:transcribed";
  text: string;
  sequenceNumber: number;
  pFinishedSpeaking?: number;
  tempo?: number;
  merged?: number[];
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
  | { type: "saypi:piThinking" }
  | { type: "saypi:piSpeaking" }
  | { type: "saypi:piStoppedSpeaking" }
  | { type: "saypi:piFinishedSpeaking" }
  | { type: "saypi:submit" }
  | { type: "saypi:call" }
  | { type: "saypi:callReady" }
  | { type: "saypi:callFailed" }
  | { type: "saypi:hangup" };

interface SayPiContext {
  transcriptions: Record<number, string>;
  isTranscribing: boolean; // duplicate of state.matches("listening.converting.transcribing")
  lastState: "inactive" | "listening";
  userIsSpeaking: boolean; // duplicate of state.matches("listening.recording.userSpeaking")
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
    callStarting: {};
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
        piThinking: {};
        piSpeaking: {};
      };
    };
  };
};

interface SayPiTypestate extends Typestate<SayPiContext> {
  value: "listening" | "inactive" | "callStarting" | "errors" | "responding";
  context: SayPiContext;
}

function getHighestKey(transcriptions: Record<number, string>): number {
  // Find the highest existing key in the transcriptions
  const highestKey = Object.keys(transcriptions).reduce(
    (max, key) => Math.max(max, parseInt(key, 10)),
    -1
  );
  return highestKey;
}
// time at which the user's prompt is scheduled to be submitted
// used to judge whether there's time for another remote operation (i.e. merge request)
var nextSubmissionTime = Date.now();

const apiServerUrl = config.apiServerUrl;
if (apiServerUrl === undefined) {
  throw new Error(
    "Configuration error: apiServerUrl is not defined. Please check your environment variables."
  );
}
const mergeService = new TranscriptMergeService(
  apiServerUrl,
  navigator.language
);

/* external actions */
const clearTranscripts = assign({
  transcriptions: () => ({}),
});

const audibleNotifications = new AudibleNotificationsModule();
const visualNotifications = new VisualNotificationsModule();

export const machine = createMachine<SayPiContext, SayPiEvent, SayPiTypestate>(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5SwIYE8AKBLAdFgdigMYAuWAbmAMSpoAOWCRKANiwNoAMAuoqHQHtYWMgPx8QAD0QBGACwBOABw4lMgEwBWADQg0shQHZOOGZzmaAbBYDMSuRbkBfJ7trY8hUhWq0GCBgBlOjAUAGsCKC5eJBBBYVFxWOkETXVdfQR1GxtNHE0zNVt7Cxc3dA8wACcqgSrYKklYEhQSMBwUADM2qoAKM05BgEoaCtxq2vroiXiRLDEJFJtDTRt8zkM1LQzZJRtLU3MrYodNZ1cQd3GauoamlraO7ur+weHRzGvJ2HYZGP4hHMFslEHYFHIcJYrNs9IgFMpIZwFNYZEpDApOOpDDIypcxjgWFhmmB8JEPv4GAAVAAWBAi+CiPBmgMSi0QaR2CDUOEU8MsGLk6ks2MM6lxVwJRLapIZ5MYQRC4Ui01is1ZIIQlnSsIQMhsMhw8L5AqFIrFFwlhOJMqgOCqYCIdQgZL8jGpKAZAFc6CqAQl5klQEtloZ1psNDodfItThDJYlFrjHZTubyp9JdbInaHU6s-gBCRgqF6VA5QhPbBqgAxAhE6mQItKhm+uIsgNshA5QyhzQbLaRzIySzWUzqJSDdScZOOcX4q3SrP2x1VZ0MnD5wuKktlivVRslltq9sa7JI-Kc+QKPL8vbyVYlM6z9PzkmLnMrrO7qr7l3ofxfwISAEOgQggH9myZVU22BINEEnDFVAjC9NGRSFlH1E4ZwtOcpVfNcl1zNcAK3X96EYACgJAhsSObP5mX9GCpDgpETH7ZC5AOGR0LvadH2w59cJtHBHXwSgqjINdiCIT0AFtPRYVoyQgMR2gIcgBDCdoZOqGAAHk6DIGSpSwIhD2gwMmKyZYDS0cMYUyJRskNTgoSHNEMSFBQnw8F8hJEsSJNtKTZPkxTZQmOocDoBSSE6OoZJwbSqj0gysCM5oTLMhiLJSbJsUNWy2J1QwbBMWwbAUVF0UxflvNwXys386pAo6IhpLkmLSP8Egqg9WAiCqLAACNICyoEcrgsdLE5TQ9hwN4hXjarPLqjMFzXJrxKzYKOrC0tXQQHq+oG4awCrFAsBYUbIL9caOy7Hs+yQnVKryGrSqUM4rAUZZVoajaxAC7a2pCzrZQOo78H6waRogABRGSDLQMb1VgzsQzDIqHL1fIhQ+r7+V+-ifMExrAea4H2tCwLGmaVp2i6HpelgT0hvS4QxAAETABS0BGS1SYB0SKckkHdsClHjzRrFcgvcwVEsJEUXcmqvOJ+rBdtTaWpZtmRBpyXGKWTguMx57B0GA0zGROQqo82r1bWvCtfJra10h6Hhq6xgPZO2HDYm3UMQNKdzbhGRQ3UIdbaxDR9kxP7NeE12Wt9mHvcO3qob9s6LquiAA-uuxHrsgdEAcA5exqpaPMMRPMyFoH3azz2hoztPTvhxGSGRm7W2yovuzN+zZC4iE0ksfGLEJyxVvtWBBHwVd9r-cjK2-GjGX+fu7o1GR94hQqw9SQUcC0E2tGWdRT3ONMPHnxfl6irAaTpDOFWLZU+6PI3y+FHkFBRzRGXVICIq4RivjfOecBH5Zg-k2FeZEAhYEAsBUC4Et70V3mjfe8gz6aFLshSqZ84xyAqveU4s9HYPzEE-eB24DpBEougzevxt4-0DtbQ+BCsaTTwXGTgRQKGlGoTA2hcCUGbzLAwGspJYD1jAqw7+5kOz73MPgwhUYUSxlIeQ3iVCLj5ggHACQVwsGo0snITkABaA4bx7EOMGHXR2BBiBkEoOYqWlllizWHiAriCFxxxiUFeXit88TpgivUTxv9OzojyL2TRmQChrEVjbO2mJsSrSibAHAHcRrnUupAGJgdkxrESbwzUFhETpJVrHbJNx6iJRMnDRpJT7r2HKU9EeXJ96HFqctLJjt-pQHaXvOQQ9Km2UNEafk5hTQR3rutW0BEPwMjGTgr6iEekaFFDoyegiCY-SoXfDWDcVnvifhuDBGzLJaBkHkfe2JgHISFIaOQt5MJ8VOU7ISqyn7EU-usqCA894oTWJUy8JhuzWD0Q+cJAtznJ2Fm7UZILsGWQeVobZIDFAJIWnITEVd9RLOdsipuQUxbU0iLc3K18lCckAeoHAuQBn2zVj8kZ5KRa2l1kZEggVaWggPvkH6KxGXGH2VPb6+xSV+RTlmfJNL0UWJSA8kqOLORohUFxdQRg0hx0VqmCJ98xFL2VbdVV7IrE6hyHkdQvI5mCmFBHTQ0CF7iLXFSWk+ASxCt1JiGaHFYy9ggaKKBoiPXmq9ZIoFaLLVeJSFCCEVUQFnAOCsC+qxw2lXOC4IAA */
    context: {
      transcriptions: {},
      isTranscribing: false,
      lastState: "inactive",
      userIsSpeaking: false,
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
            target: "#sayPi.callStarting",
            description:
              'Place a "call" to Pi.\nAttempts to start the microphone and begin active listening.',
          },
          "saypi:piSpeaking": {
            target: "#sayPi.responding.piSpeaking",
          },
        },
      },
      errors: {
        description: "Error parent state.",
        after: {
          "5000": [
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
      callStarting: {
        description: "Call is starting. Waiting for microphone to be acquired.",
        entry: [
          {
            type: "callIsStarting",
          },
          {
            type: "setupRecording",
          }
        ],
        on: {
          "saypi:callReady": {
            target: "#sayPi.listening.recording",
            actions: [
              {
                type: "callHasStarted",
              },
              {
                type: "startRecording",
              },
            ],
            description:
              'VAD microphone is ready.\nStart it recording.',
          },
          "saypi:callFailed": {
            target: "#sayPi.errors.micError",
            description:
              "VAD microphone failed to start.\nAudio device not available.",
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
            entry: [
              {
                type: "startAnimation",
                params: {
                  animation: "glow",
                },
              },
            ],
            exit: [
              {
                type: "stopAnimation",
                params: {
                  animation: "glow",
                },
              },
              {
                type: "notifyRecordingStopped",
              },
            ],
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
                entry: [{
                  type: "startAnimation",
                  params: {
                    animation: "userSpeaking",
                  },
                },
              assign({ userIsSpeaking: true }),
              {
                type: "cancelCountdownAnimation",
              }],
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
                          userIsSpeaking: false,
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
                entry: {
                  type: "draftPrompt",
                },
                invoke: {
                  id: "mergeOptimistic",
                  src: (context: SayPiContext, event: SayPiEvent) => {
                    // Check if there are two or more transcripts to merge
                    if (Object.keys(context.transcriptions).length > 1) {
                      // This function should return a Promise that resolves with the merged transcript string
                      return mergeService.mergeTranscriptsRemote(
                        context.transcriptions,
                        nextSubmissionTime
                      );
                    } else {
                      // If there's one or no transcripts to merge, return a resolved Promise with the existing transcript string or an empty string
                      const existingTranscriptKeys = Object.keys(
                        context.transcriptions
                      );
                      if (existingTranscriptKeys.length === 1) {
                        const key = existingTranscriptKeys[0];
                        return Promise.resolve(
                          context.transcriptions[Number(key)]
                        );
                      } else {
                        return Promise.resolve(""); // No transcripts to merge
                      }
                    }
                  },

                  onDone: {
                    target: "accumulating",
                    internal: true,
                    actions: [
                      assign({
                        transcriptions: (
                          context: SayPiContext,
                          event: DoneInvokeEvent<string>
                        ) => {
                          // If the event.data is empty, just return the current context.transcriptions
                          if (!event.data) {
                            return context.transcriptions;
                          }

                          // Use the highest key for the merged transcript
                          const nextKey = getHighestKey(context.transcriptions);
                          const originalKeys = Object.keys(
                            context.transcriptions
                          );
                          if (originalKeys.length > 1) {
                            console.log(
                              `Merge accepted: ${originalKeys} into ${nextKey} - ${event.data}`
                            );
                          }
                          return { [nextKey]: event.data };
                        },
                      }),
                    ],
                  },

                  onError: {
                    actions: log(
                      "Merge request did not complete, and will be ignored"
                    ),
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
                entry: [{
                  type: "startAnimation",
                  params: {
                    animation: "transcribing",
                  },
                },
              assign({ isTranscribing: true })],
                exit: [{
                  type: "stopAnimation",
                  params: {
                    animation: "transcribing",
                  },
                },
                assign({ isTranscribing: false })],
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
          "saypi:piThinking": {
            target: "#sayPi.responding.piThinking",
          },
          "saypi:piSpeaking": {
            target: "#sayPi.responding.piSpeaking",
          },
        },
        type: "parallel",
      },
      responding: {
        description:
          "Pi is responding. Text is being generated or synthesised speech is playing or waiting to play.",
        entry: {
          type: "disableCallButton",
        },
        exit: {
          type: "enableCallButton",
        },
        initial: "piSpeaking",
        on: {
          "saypi:userSpeaking": {
            target: "#sayPi.listening.recording.userSpeaking",
          },
        },
        states: {
          piThinking: {
            description: "Pi is contemplating its response.\nThinking animation.",
            entry: {
              type: "startAnimation",
              params: {
                animation: "piThinking",
              },
            },
            exit: {
              type: "stopAnimation",
              params: {
                animation: "piThinking",
              },
            },
            on: {
              "saypi:piSpeaking": {
                target: "#sayPi.responding.piSpeaking",
              },
            },
          },
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
        if (event.merged) {
          event.merged.forEach((mergedSequenceNumber) => {
            delete SayPiContext.transcriptions[mergedSequenceNumber];
          });
        }
      },

      acquireMicrophone: (context, event) => {
        // warmup the microphone on idle in mobile view,
        // since there's no mouseover event to trigger it
        if (isMobileView()) {
          EventBus.emit("audio:setupRecording");
        }
      },

      setupRecording: (context, event) => {
        // differs from acquireMicrophone in that it's user-initiated
        EventBus.emit("audio:setupRecording");
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

      notifyRecordingStopped: () => {
        visualNotifications.listeningStopped();
        audibleNotifications.listeningStopped();
      },

      draftPrompt: (context: SayPiContext) => {
        const prompt = mergeService
          .mergeTranscriptsLocal(context.transcriptions)
          .trim();
        if (prompt) setDraftPrompt(prompt);
      },

      mergeAndSubmitTranscript: (context: SayPiContext) => {
        const prompt = mergeService
          .mergeTranscriptsLocal(context.transcriptions)
          .trim();
        if (prompt) setFinalPrompt(prompt);
      },

      callIsStarting: () => {
        buttonModule.callStarting();
      },

      callHasStarted: () => {
        buttonModule.callActive();
        audibleNotifications.callStarted();
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
      cancelCountdownAnimation: () => {
        visualNotifications.listeningStopped();
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
        return readyToSubmit(state, context);
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

        // ideally we would use the current state to determine if we're ready to submit,
        // but we don't have access to the state here, so we'll use the provisional readyToSubmit
        const ready = provisionallyReadyToSubmit(context);
        if (finalDelay > 0 && ready) {
          visualNotifications.listeningTimeRemaining(finalDelay / 1000);
        }

        // Get the current time (in milliseconds)
        const currentTime = new Date().getTime();
        nextSubmissionTime = currentTime + finalDelay;

        return finalDelay;
      },
    },
  }
);
function readyToSubmitOnAllowedState(allowedState: boolean, context: SayPiContext): boolean {
  const empty = Object.keys(context.transcriptions).length === 0;
  const pending = isTranscriptionPending();
  const ready = allowedState && !empty && !pending;
  return ready;
}
function provisionallyReadyToSubmit(context: SayPiContext): boolean {
  const allowedState = !(context.userIsSpeaking || context.isTranscribing); // we don't have access to the state, so we read from a copy in the context (!DRY)
  console.log("provisionallyReadyToSubmit", allowedState, context);
  return readyToSubmitOnAllowedState(allowedState, context);
}
function readyToSubmit(state: State<SayPiContext, SayPiEvent, any, any, any>, context: SayPiContext): boolean {
  const allowedState = !(
    state.matches("listening.recording.userSpeaking") ||
    state.matches("listening.converting.transcribing")
  );
  return readyToSubmitOnAllowedState(allowedState, context);
}

