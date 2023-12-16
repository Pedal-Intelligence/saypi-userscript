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
import AudioControlsModule from "../AudioControlsModule";
import { requestWakeLock, releaseWakeLock } from "../WakeLockModule";

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
  | { type: "saypi:hangup" }
  | { type: "saypi:visible" };

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
const audioControls = new AudioControlsModule();

export const machine = createMachine<SayPiContext, SayPiEvent, SayPiTypestate>(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5SwIYE8AKBLAdFgdigMYAuWAbmAMSpoAOWCRKANiwNoAMAuoqHQHtYWMgPx8QAD0QAWAMwycARhkAOGQHYtnDQE4ArEoBsRgDQg0szrpwaZu3QCY5co6t1HHqjQF8f52mw8QlIKaloGBAYAZTowFABrAiguXiQQQWFRcXTpBH1Hc0sER105ThxSj05vJVU6oxk-APQg5jZokhQAJzJ8KBp0SPaWACV4iDRUiUyRLDEJPJlHRRV1LQ0dA2MzC0R9A5wHY8N9a31G5pBA3BHOnr6BiMYACxR+gFc6afTZ7MXZPpVmpNNo9IYTEVEPUcGdOPCNPpdEoDKpPFcbjg7l1eslBvRGCMAGIoLAsSA-fhCOYLXKA4HrMHbSF7BDGOQ4ewOTxGfQaJQ1GT6DGtW6sFj3XH9KiSWBdEhgHAoABmCu6AApHPD4QBKfFtcWSx6UjLU-50hAyK3KEEbLYQ3bFRyNI7HFHqVSOfnC-zXUU4FhYOVgfB455RLAAFReBCS-RNf3mOVAeSUciBOG8cP0aM0ByhCFUqn0sM8aiMdicujRIswuEDwdD0vDMTiiWSCbNSYBbPTiiz8JzjUR+gLqnTOE4Zd0dmLZyFtaCDYVTaeQ0Y5CDWAARuTO1luxbyuVlKpOEoLkZ4QpnAWHI5JxfecskQLvIv60GV8kcN0wEQBG6CAw3XBA3k+b4eBmLtaRTWRGhsXQpzPThDDkDRiwLZw6lsK8kSvMsgQ-AMvxDH8-wAoCf3wAQSFieI4zXAkEA+WAwG6IkCCDF5IHo9t4yg34YOTKR4NKI5kMHNMMNHVlHCBDRJw0cptiBZE5GI5cyP6X9-0A4CdJoui20Y-FIlY9i+MY-caREvJnHsWF4S8VCVMwuTXBLEwKwFLwzmUzTSNXXTKIMqAcAs7orJA5jIs6AQ6DiCBooEtIqQPWDRJKNMKnqZ0ZCMJQMI0MssIKowcG8z1iycL0i0CxtyL0qidLikyYvMtiopIBKkpSlIlDS00MrsxBHByzMlHywritKuSZGMZQTDRZ15JqEqGu-HSAPwSgpXC4giA+ABbD4WBQR4qAgMRFQIcgBASRVjvYmAAHk6DIY6vywIgbPNOCSmWJRKj5GanC0K0CyKlFM0RKb4WLEr319TEtOCna9seJUiCO07zsu9jukAnA6Hx5VAOOnBnu6N6PqwL65R+v7DwBlZxqOeS+TyowFEaKGeU5caHFfcbDE27Twox9iscOk6zoujrGBIbp3lgIhuh3ClBPS2ye2cCdjhkxFebqKHNFUI43HHfkMNcdxxfRsRMZ-WW8YV5tQOV1X1c1kkyS1obE0yvIXCcJytB5j1nA0KGNC1TldHsFZNDcRwvQdn8pf27Hcfly7wy9-A1Y17dIAAUWOj6pm14bdaPOQw-8kq5Cj9D+Zwhw1DsawnFBDPtqd6WXZxuX8bxWV5UVFU1XVWAPm3BnhDEAARMBzrQPVUaCzPB+z12847Gug9GkoMMUY4zzTorPFvVkUWtLm04OZwkQKfvJd3rG54XkRLuZ4PEDlCMDYfyV5xxei5FDdwikdCemsJsQq6gfQtDrCRRqA9dpDx0oXYuO5FYIBwT7UuEB-4nxRIYSccglDUKtNbOwMgoFplPPYdQ5YXCInfliT+P5CEl3wbw32pJyQkKPsJHsocHxN0jmoaOUN9CuFdF3ZONRkS6E4VnLGAjtz8JVkXIh5dK4kGroHMR9dG46Gbq3GOd9vAVDhOUZYSC5BeE4YTQC9wSCsRwG47osAZRygulPVU7F1Rwk4Jvf0aMfw+I8V4nxsBSE9mWOJDCyJPDOJ0AtWSxRjA4QWsAnQZxiyeWIn+WAgh8BhTMowNqDFD4mJGj2ahGZ5JnxyuoROqgypqEqFaROyJ6iuFKXACpVTwzgSgF8RJFpqEKBBm08oHS1BYTcMDfCBVkTOk9M4YZ5SxBhRJlGGM+BTItiwP1aZAMCqKSTlqIsF5nELTKs42wfT5JomrC4XZoyfytjqR7ZiMQeqJV4u1VK0FGkzIvIoVp6h2n2GWfNasrz7AXjWAcHQ3z9m-POWCpikQgW9VBf8gaDS64A2oSseZcLFkIq6XJM8ID7CeD5AoJEnANIo39GUn5Ok-n8XxYwBgnFQywB4slPFlyso0JhVzBatLOlYTUr0s4FY1DFmfH4X0NEIBwAkDcCF5KsoAFpHSIFNZObUVrrWYq5agggxAyCUENf9LKqqKhITjuNHmHKsxYTtkcYw44nBAPkMRbEDxkgupZllZYd4OTHA8HUIq1ZfLv2jQAtkBRFJ5TzCsRGLgobWA9UG6h9yOU7LtUubeOkKL6SjUJSFFKcwllzYifNrK5BYSDSi9wnB5B8iKpwutLVwpGX6hmk+nMSzUOUoYJCNQXDZLGg3CqaTxw+oKMLYdzUDm1IFZOppPMORtoKGoTt-qrwoqcP2-kRZULqO4f0Q9My+Stqmnm89yku13wbsDAq3hE6NAvKhVQj7MF7xHm7R4L7WZekUhfa+V55IVkYRbZxnorTyTKGiMDVbPzoI-hBr+88vokBg42o1IdjCKCRAobmC1m5QJMNejlOgVj9scOB522DdG4O0c+yjrrUzpMmisdtX7C13whktC81Zjbpg8K47oRNuoXVYrBrK6FvDhzykLe+UMMOciDVQ3mnp5HKdU7E2AOAaLdGOqwTTIdxwW38nplEBm5LjUUIx887DNBNHw2gra4UYnyjiSpwC8AhMxucxONzU19OJzNle-J44XB2zfkFqJOkwvqZs-EnAWiwB+2EU5wBRYOQJavqohhd9eQPnyUhbkN80yWfceFgrkXfFUx+mXbr5WEAt3HLpxLHnks2KKoG4BhUKz9rPHhlBQQeXYsEzrYT+w6tOmMDYBFIb5IFXWliypOLoyxgbet2LiBfL+rPIopCRYX6Lb9KglbJ2+W4pJYNkwqwswFRcLyHmZUpudzKONdMApfBaqAA */
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
              {
                type: "activateAudioOutput",
              },
              {
                type: "requestWakeLock",
              }
            ],
            description:
              'VAD microphone is ready.\nStart it recording.',
          },
          "saypi:hangup": {
            target: "inactive",
            description: "Call was cancelled before it started.",
          },
          "saypi:callFailed": {
            target: "inactive",
            description:
              "VAD microphone failed to start.\nAudio device not available.",
          },
        },
        after: {
          "20000": {
            target: "inactive",
            description: "Call failed to start after 20 seconds. Is the microphone available?",
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
                    type: "callHasEnded",
                  },
                  {
                    type: "releaseWakeLock",
                  }
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
                    target: "#sayPi.listening.errorStatus.errors.transcribeFailed",
                    description:
                      "Out of sequence error response from the /transcribe API",
                  },
                  "saypi:transcribedEmpty": {
                    target: "#sayPi.listening.errorStatus.errors.micError",
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
                    target: "#sayPi.listening.errorStatus.errors.transcribeFailed",
                    description:
                      "Received an error response from the /transcribe API",
                  },
                  "saypi:transcribedEmpty": {
                    target: "#sayPi.listening.errorStatus.errors.micError",
                    description:
                      "Received an empty response from the /transcribe API (no speech detected)",
                  },
                },
              },
            },
          },

          errorStatus: {
            description: `Handles non-fatal errors during recording and transcription.`,
            initial: "normal",
            states: {
              normal: {
                description: "The system is not exhibiting any errors.",
              },
              errors: {
                description: `Non-fatal transcription or recording errors.`,
                entry: {
                  type: "callHasErrors",
                },
                exit: {
                  type: "callHasNoErrors",
                },
                after: {
                  "5000": [
                    {
                      target: "#sayPi.listening.errorStatus.normal",
                      actions: [],
                      description: "Reset to the normal state and clear errors.",
                    },
                  ],
                },
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
                type: "parallel",
              },
            },
          }
        },
        on: {
          "saypi:piThinking": {
            target: "#sayPi.responding.piThinking",
            actions: [
              {
                type: "acknowledgeUserInput",
              },
            ],
          },
          "saypi:piSpeaking": {
            target: "#sayPi.responding.piSpeaking",
          },
          "saypi:visible": {
            actions: {
              type: "requestWakeLock",
            }
          }
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
          "saypi:hangup": {
            target: "#sayPi.inactive",
            actions: [
              {
                type: "callHasEnded",
              },
              {
                type: "releaseWakeLock",
              },
              {
                type: "stopRecording",
              }
            ],
            description:
              'End call while Pi is speaking.',
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
      }
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
        EventBus.emit("audio:tearDownRecording");
      },

      showNotification: (context, event, { action }) => {
        const icon = action.params.icon;
        const message = action.params.message;
        buttonModule.showNotification({ icon, message });
      },

      dismissNotification: () => {
        buttonModule.dismissNotification();
      },

      acknowledgeUserInput: () => {
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
      callHasEnded: () => {
        visualNotifications.listeningStopped();
        buttonModule.callInactive();
        audibleNotifications.callEnded();
      },
      callHasErrors: () => {
        buttonModule.callError();
      },
      callHasNoErrors: () => {
        buttonModule.callActive();
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
      activateAudioOutput: () => {
        audioControls.activateAudioOutput(true);
      },
      requestWakeLock: () => {
        requestWakeLock();
      },
      releaseWakeLock: () => {
        releaseWakeLock();
      }
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

