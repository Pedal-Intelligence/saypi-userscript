import { buttonModule } from "../ButtonModule.js";
import {
  createMachine,
  Typestate,
  assign,
  log,
  DoneInvokeEvent,
  State,
} from "xstate";
import AnimationModule from "../AnimationModule.js";
import {
  AudibleNotificationsModule,
  TextualNotificationsModule,
  VisualNotificationsModule,
} from "../NotificationsModule";
import {
  uploadAudioWithRetry,
  isTranscriptionPending,
  clearPendingTranscriptions,
} from "../TranscriptionModule";
import { TranscriptMergeService } from "../TranscriptMergeService";
import { config } from "../ConfigModule";
import EventBus from "../events/EventBus.js";
import { calculateDelay } from "../TimerModule";
import AudioControlsModule from "../audio/AudioControlsModule";
import { requestWakeLock, releaseWakeLock } from "../WakeLockModule";
import { UserPreferenceModule } from "../prefs/PreferenceModule";
import getMessage from "../i18n";
import { Chatbot, UserPrompt } from "../chatbots/Chatbot";
import { ImmersionStateChecker } from "../ImmersionServiceLite";

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

type SayPiAudioConnectedEvent = {
  type: "saypi:audio:connected";
  deviceId: string;
  deviceLabel: string;
};
type SayPiAudioReconnectEvent = {
  type: "saypi:audio:reconnect";
  deviceId: string;
  deviceLabel: string;
};
type SayPiSessionAssignedEvent = {
  type: "saypi:session:assigned";
  session_id: string;
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
  | { type: "saypi:visible" }
  | SayPiAudioConnectedEvent
  | SayPiAudioReconnectEvent
  | SayPiSessionAssignedEvent
  | { type: "saypi:piWriting" }
  | { type: "saypi:piStoppedWriting" };

interface SayPiContext {
  transcriptions: Record<number, string>;
  isTranscribing: boolean; // duplicate of state.matches("listening.converting.transcribing")
  lastState: "inactive" | "listening";
  userIsSpeaking: boolean; // duplicate of state.matches("listening.recording.userSpeaking")
  timeUserStoppedSpeaking: number;
  defaultPlaceholderText: string;
  sessionId?: string;
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
        piWriting: {};
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

// most recent enforced delay while waiting for additional user input
// captured here for analytics events
var lastSubmissionDelay = 0;

const apiServerUrl = config.apiServerUrl;
if (apiServerUrl === undefined) {
  throw new Error(
    "Configuration error: apiServerUrl is not defined. Please check your environment variables."
  );
}

const audibleNotifications = AudibleNotificationsModule.getInstance();
const textualNotifications = new TextualNotificationsModule();
const visualNotifications = new VisualNotificationsModule();
const audioControls = new AudioControlsModule();
const userPreferences = UserPreferenceModule.getInstance();

let mergeService: TranscriptMergeService;
userPreferences.getLanguage().then((language) => {
  mergeService = new TranscriptMergeService(apiServerUrl, language);
});

let chatbot: Chatbot;
function getPromptOrNull(): UserPrompt | null {
  if (!chatbot) {
    console.error("Chatbot not initialized when requested by state machine.");
  }
  const promptElement = document.getElementById("saypi-prompt");
  if (chatbot && promptElement) {
    return chatbot.getPrompt(promptElement);
  }
  console.warn("Prompt element not found when requested by state machine.");
  return null;
}
function getChatbotDefaultPlaceholder(): string {
  if (!chatbot) {
    console.error("Chatbot not initialized when requested by state machine.");
  }
  const promptElement = document.getElementById("saypi-prompt");
  if (chatbot && promptElement) {
    return chatbot.getPrompt(promptElement).getDefaultPlaceholderText();
  }
  console.warn("Prompt element not found when requested by state machine.");
  return "";
}
const machine = createMachine<SayPiContext, SayPiEvent, SayPiTypestate>(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5SwIYE8AKBLAdFgdigMYAuWAbmAMSpoAOWCRKANiwNoAMAuoqHQHtYWMgPx8QAD0QBOAEwAaEGkQAOAKwycc9apkA2AMw71AdgAspuQF9rS2tjyFSFarQYIGAZTpgUAawIoLl4kEEFhUXEw6QRzAEY5OW14+NN9OVNOXXVFZUREw0McTnN1M05VQ3NOU1NVW3t0R2Y2LxIUACcyfCgadA9WlgAlPwg0EIkIkSwxCVjzOXMcePNVRfMMzjl4w1N1JRU4jRxzTcMzUxkL-XLzRpAHXCH2rp6+90YACxRegFc6JMwtMovM1HkjvFONkcOpKjJODdNmYbHZHs1nqwWK9ukF+vRGEMAGIoLAsSBA-hCGZzGKIczVFZrDZbHZ7A75BDxa6wwwyfllHbyTQPJ44F4dXG9KiSWAdEhgHAoABmCs6AAo5NDoQBKfEtLE496U8LU0F0uKM1brJas3b7Q6IaqcHD8wyJOQyRbVGqGUUYnAsLBysD4PGfTxYAAqXwIgV6JpBs2ioFiRVMxU2qTkGkMVU2pkdCDZyXqboS9ShiP9mFwQZDYelEe8vgCQUTZuTYIQRSqp302dz+f0hc5WtUyRzMgnqisGeraLF9YVjY+A0Y5GDWAARuSO5Euxb4iPinzsrsfbp4kXVu7XfE4boGfsEn7FwHl6Hw+uECg-hBZiYMR8DAUgKR4KZO1pVMClueJtDkW4Jx0Ko9hkG8inUfstU4fR+XiPQzhrRxP1XfEPD-ACBAQTpQOA0CSH3GkUykWDclOdZ1GPGR1EFC4i0w1RtE0Y8igZIxNmIutgxXb8CQQWA4GEMRf1gYQoBAiAmPNGCuX0cwtGMRZVFUTgCJM7YBMQ+DTIHVI9CuWcpMDGSv16HBaKIAROgApsfx+f5AQg4EoJYtM9kzOyc3UPNqhHDCLmw6E8JkAivWc0igg8uifKy-ABBIHw-HjNd5L+RTOiJAhgy+SAirbBNgqpA9oNYntYv7QcYuHUcji1O8yysYx0jhSwMtc1dsq83L3PywrWxK8jGHKsBOnqkrtMPXSHJwfRZzWGKvTSVRr05bl6hwMsB3qHQsgscaGyyzzvN8qAcBWtaFrkjwPvaAQ6F8CB1vbJrTRasLEBHLRtWhXJuNMwwiy1K5Lr0Gc50MbZ7nfWsXMe9znpmt7fq+vyyoqv6Abq0ngniUJmuY7soZKGG4bwhGke2LQpyGzJbmyB7ZPcrz8EoKU3uIIg-gAWz+FgUHeKgIDERUCHIAR-EVaXVpgAB5OgyGlmSsCITbWtiKE1lOdJjH5Xi5EMeKx3KYp9G2IwzLOSxsaaXHMuFsQxfeJUiCl2X5cV1bOm8nA6Aj5VvOlnBtc6PWDawI25RNs2Ia5UotFWb1sjMvQeKRzYXVWHjLFMbkDAFnGSImrKRaDrLJZluWFe+xgSE6X5YCITod3A+mwcZi0DGKHZ1mMPCDJkDMkfdZI8LsixUquH30T95uA9F1bg478Pu7Jjw+4HoeR5JMlR8g8Hux2TYSgyLNSgzTYkaMfQcEx3RHeuHUE628lx7zeq3Q+7dQ6dwjj3BAF98CD2HtuSAABRaWBsJigyTObRAT8f64VtJbD++gkYZlMDgWyZlrhGAuILNy4DA6QPcsfLuitZTykVCqNU6pYB-G3JnZS+AAAiYB5ZoD1KA-GjCD7ixDmHNhIMx44NzqsRIKROJVFrrOTISNyjwSsJkT2novSL3oZNCBci+ECJEIrHO3ZuI-ysPpC48hPT6VUHosyu0+TGEwmyeI5iW5MLkQgpBO44FhKvigrS2DQrdi4ssGeWQTIoSyBCPBBllgaCWFkPYWoeJBP3m3dyUTkGRP7og6JYAb7klico+JFpEkaJSROXQ6Sv5JEodkUyZl9EMnUEUmRJS3plIiWfXulTwkxPQZg+xTTVgtMqG02clkxxZGyT0icuxyhehAR+MBOAo7eVeCQcqRzOjR06LAGUcoFZcNVKtdUcJdT6mktIi5VzTnnOOdc+ZulPQMl-gyDQCRSgVg5H1LiLpTK6GuNULI2R9DOVorAQQ+BXpLQQAFKAAJ-ltQSF0nYaQMhZByBkhAqh9A-xoVOExtkGiN1wKi9FmKIwk2Kko++E9dIMitgiO6awRyWFIWdW4FCkhwn0rsHQ50UVwFZVlBgMY4xwJbJyxqDSH5NO2FhAipQqX8gyJoG8Zxki8XUFsaopkyjyrRWIV6scsDAwmZGSmgMXXBDidq3SuQBL7CwsYUSZkrhejfL7RwLKHVKudTTLF3gSD-Q9TTdgdNuU6QJR6FIJKjHkqLCdH+4kDq3BHGYGQdrFXuXVQ1UqHgGBVTDLAWqQMU3ep5W1KwAleJaFSuUco6QCy8QrdGqtsaNW1uWhTVtWr22xEfC6PJ+FERu2nKankpR7Z8lSpwdKTLsr2oxVlD6ABJfAapOgAkVuyimiaqYtvHfiuduqVg2sNQYHQ6ExValdNOMo3JqV8kWMOw97kT1nqjpeuBv1b3JofWmkKPq2oZAEm7F0CQYqaBqHUJYb40T5QgHACQTx01bTagAWlFUcCw2hqV4WMKZL0+l9m4wIMQMglASO4J7AOzqIq1g5idkcPQ8FHZu2RJa9I-JnISjeEETjudFg3gHJdalT4RxmXzoyiN7yhZQHk92KlprFmOwnGUKw2x3RDKmi9OTCHZ0FGqDeKwWgqWmVSENYaVnCaOrmp6-TR4oSnlKBJC4ZRhScyhCUPkOSGR5k2Mivd-s3reaPVO8d-ndIEQpedYornsgfvrvUKzlj3gZbarsT9fVJUrAMGULiiE+mmGKyEo+0CT6lbsxm2ICIsIzzKO6Xiegihf3Ykiz2ewTwJe03jXT4oWtZWsUbEgHWGZdYKFcGyHp3SYxqNyculrYTlH2sYcFeZmuyODmM7ctnVukYtrOPRbtulltEqsbYVnfnfPgJ1u7eC4TwUIVqGKNs8JIySDC3CO2HYDlqB9y5Jz5TnPyp0aWrAyuxFuskQH2QJsAIElCH+sL33V0SMxpuHzPuI9gJ87y33btcZ0AZF+4Pgff0q3gi4yRbKJF4msfY6w4dfKpzT65OArs1NJHU9Hf3F7M6B7j0HzszjPdMROWjDJBcI4Vj8+HoujZEFQbr6XxZNAUOx6zvH6zIt-x4kYBEgGyfMoVSOvTP2uMMmhK6WotQhUWHSDeB808eJVB0JDvJwHHXKtjPgEqxuK7LDdsa5CiJdAYX0pdW3DtdkiqmzvSNzuQNvWrbHt3udecUKKCOE6UIJx1BvFxH+ajyjQkXgyJYEfUurVPeeyDvQ493FhEsJIeZMh6CUzCb2pdzju0GbYawQA */
    context: {
      transcriptions: {},
      isTranscribing: false,
      lastState: "inactive",
      userIsSpeaking: false,
      timeUserStoppedSpeaking: 0,
      defaultPlaceholderText: getChatbotDefaultPlaceholder(),
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
          },
          {
            type: "callStartingPrompt",
          },
        ],
        exit: [
          {
            type: "clearPrompt",
          },
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
              },
            ],
            description: "VAD microphone is ready.\nStart it recording.",
          },
          "saypi:hangup": {
            target: "inactive",
            description: "Call was cancelled before it started.",
            actions: [
              {
                type: "callFailedToStart",
              },
            ],
          },
          "saypi:callFailed": {
            target: "inactive",
            description:
              "VAD microphone failed to start.\nAudio device not available.",
            actions: [
              {
                type: "callFailedToStart",
              },
            ],
          },
        },
        after: {
          "20000": {
            target: "inactive",
            description:
              "Call failed to start after 20 seconds. Is the microphone available?",
            actions: [
              {
                type: "callFailedToStart",
              },
            ],
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
        exit: [
          {
            type: "clearTranscriptsAction",
          },
          {
            type: "clearPendingTranscriptionsAction",
          },
          {
            type: "clearPrompt",
          },
          assign({ lastState: "listening" }),
        ],
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
              {
                type: "listenPrompt",
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
                type: "clearPrompt",
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
                entry: [
                  {
                    type: "startAnimation",
                    params: {
                      animation: "userSpeaking",
                    },
                  },
                  assign({ userIsSpeaking: true }),
                  {
                    type: "cancelCountdownAnimation",
                  },
                ],
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
                    target:
                      "#sayPi.listening.errorStatus.errors.transcribeFailed",
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
                entry: [
                  {
                    type: "mergeAndSubmitTranscript",
                  },
                  {
                    type: "notifySentMessage",
                  },
                ],
                exit: ["acknowledgeUserInput"],
                always: "#sayPi.responding.piThinking",
              },
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
                  assign({ isTranscribing: true }),
                ],
                exit: [
                  {
                    type: "stopAnimation",
                    params: {
                      animation: "transcribing",
                    },
                  },
                  assign({ isTranscribing: false }),
                ],
                on: {
                  "saypi:transcribed": {
                    target: "accumulating",
                    actions: {
                      type: "handleTranscriptionResponse",
                    },
                    description: "Successfully transcribed user audio to text.",
                  },
                  "saypi:transcribeFailed": {
                    target: [
                      "accumulating",
                      "#sayPi.listening.errorStatus.errors.transcribeFailed",
                    ],
                    description:
                      "Received an error response from the /transcribe API",
                  },
                  "saypi:transcribedEmpty": {
                    target: [
                      "accumulating",
                      "#sayPi.listening.errorStatus.errors.micError",
                    ],
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
                      description:
                        "Reset to the normal state and clear errors.",
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
                        message: getMessage("audioInputError", "Say, Pi"),
                        icon: "microphone-muted",
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
          },
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
            },
          },
          "saypi:audio:connected": {
            actions: {
              type: "notifyAudioConnected",
            },
          },
          "saypi:audio:reconnect": {
            actions: [
              {
                type: "notifyAudioReconnecting",
              },
              {
                type: "reconnectAudio",
              },
            ],
          },
          "saypi:session:assigned": {
            actions: assign({
              sessionId: (context, event: SayPiSessionAssignedEvent) =>
                event.session_id,
            }),
          },
        },
        type: "parallel",
      },

      responding: {
        initial: "piThinking",
        on: {
          "saypi:hangup": {
            target: "inactive",
            actions: [
              {
                type: "callHasEnded",
              },
              {
                type: "releaseWakeLock",
              },
              {
                type: "stopRecording",
              },
            ],
            description: "End call while Pi is speaking.",
          },
          "saypi:userSpeaking": {
            target: "#sayPi.responding.userInterrupting",
            cond: {
              type: "interruptionsAllowed",
            },
          },
        },
        entry: {
          type: "disableCallButton",
        },
        exit: {
          type: "enableCallButton",
        },
        description:
          "Pi is responding. Text is being generated or synthesised speech is playing or waiting to play.",
        states: {
          piThinking: {
            on: {
              "saypi:piSpeaking": {
                target: "piSpeaking",
              },
              "saypi:piWriting": {
                target: "piWriting",
              },
            },
            entry: [
              {
                type: "startAnimation",
                params: {
                  animation: "piThinking",
                },
              },
              {
                type: "thinkingPrompt",
              },
            ],
            exit: [
              {
                type: "stopAnimation",
                params: {
                  animation: "piThinking",
                },
              },
              {
                type: "clearPrompt",
              },
            ],
            description:
              "Pi is contemplating its response.\nThinking animation.",
          },
          piSpeaking: {
            on: {
              "saypi:piStoppedSpeaking": [
                {
                  target: "#sayPi.listening",
                  cond: {
                    type: "wasListening",
                  },
                },
                {
                  target: "#sayPi.inactive",
                  cond: {
                    type: "wasInactive",
                  },
                },
              ],
              "saypi:piFinishedSpeaking": {
                target: "#sayPi.listening",
              },
              "saypi:userSpeaking": {
                target: "userInterrupting",
                cond: {
                  type: "interruptionsAllowed",
                },
                actions: {
                  type: "pauseAudio",
                },
                description:
                  "The user starting speaking while Pi was speaking.",
              },
            },
            entry: [
              {
                type: "startAnimation",
                params: {
                  animation: "piSpeaking",
                },
              },
              {
                type: "speakingPrompt",
              },
            ],
            exit: [
              {
                type: "stopAnimation",
                params: {
                  animation: "piSpeaking",
                },
              },
              {
                type: "clearPrompt",
              },
            ],
            description:
              "Pi's synthesised speech audio is playing.\nPlayful animation.",
          },
          piWriting: {
            on: {
              "saypi:piSpeaking": {
                target: "piSpeaking",
              },
              "saypi:piStoppedWriting": {
                target: "#sayPi.listening",
              },
            },
            entry: {
              type: "writingPrompt",
            },
            exit: {
              type: "clearPrompt",
            },
            description: "Pi's text response is being streamed to the page.",
          },
          userInterrupting: {
            on: {
              "saypi:userStoppedSpeaking": [
                {
                  target: "piSpeaking",
                  actions: {
                    type: "resumeAudio",
                  },
                  cond: {
                    type: "hasNoAudio",
                  },
                  description: "User speech cancelled (i.e. was non-speech).",
                },
                {
                  target: [
                    "#sayPi.listening.converting.transcribing",
                    "#sayPi.listening.recording.notSpeaking",
                  ],
                  cond: {
                    type: "hasAudio",
                  },
                  actions: [
                    assign({
                      userIsSpeaking: false,
                      timeUserStoppedSpeaking: () => new Date().getTime(),
                    }),
                    {
                      type: "transcribeAudio",
                    },
                  ],
                  description: "User has spoken.",
                },
              ],
            },
            entry: {
              type: "interruptingPiPrompt",
            },
            exit: {
              type: "clearPrompt",
            },
            description:
              "The user is speaking during Pi's response, and may wish to interrupt.",
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
            context.transcriptions,
            context.sessionId
          );
          EventBus.emit("session:transcribing", {
            audio_duration_seconds: event.duration / 1000,
            speech_end_time: Date.now(), // bit hacky, as it assumes the audio is transcribed immediately
            speech_start_time: Date.now() - event.duration,
          });
        }
      },

      handleTranscriptionResponse: (
        SayPiContext,
        event: SayPiTranscribedEvent
      ) => {
        const transcription = event.text;
        const sequenceNumber = event.sequenceNumber;
        console.log(`Partial transcript, ${sequenceNumber}: ${transcription}`);
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
        if (ImmersionStateChecker.isViewImmersive()) {
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

      reconnectAudio: (context, event) => {
        EventBus.emit("audio:input:reconnect");
      },

      dismissNotification: () => {
        textualNotifications.hideNotification();
      },

      showNotification: (context, event, { action }) => {
        const icon = action.params.icon;
        const message = action.params.message;
        textualNotifications.showNotification(message, icon);
      },

      notifyAudioConnected: (context, event: SayPiAudioConnectedEvent) => {
        const deviceId = event.deviceId;
        const deviceLabel = event.deviceLabel;
        const message = getMessage("audioConnected", deviceLabel);
        textualNotifications.showNotification(message, "microphone");
      },

      notifyAudioReconnecting: (context, event: SayPiAudioReconnectEvent) => {
        const deviceId = event.deviceId;
        const deviceLabel = event.deviceLabel;
        const message = getMessage("audioReconnecting", deviceLabel);
        textualNotifications.showNotification(message, "microphone-switch");
      },

      acknowledgeUserInput: () => {
        visualNotifications.listeningStopped();
        audibleNotifications.listeningStopped();
      },

      listenPrompt: () => {
        const message = getMessage("assistantIsListening", chatbot.getName());
        if (message) {
          getPromptOrNull()?.setMessage(message);
        }
      },
      callStartingPrompt: () => {
        const message = getMessage("callStarting");
        if (message) {
          const initialText = getPromptOrNull()?.getDraft();
          assign({ defaultPlaceholderText: initialText });
          getPromptOrNull()?.setMessage(message);
        }
      },
      thinkingPrompt: () => {
        const message = getMessage("assistantIsThinking", chatbot.getName());
        if (message) {
          getPromptOrNull()?.setMessage(message);
        }
      },
      writingPrompt: () => {
        const message = getMessage("assistantIsWriting", chatbot.getName());
        if (message) {
          getPromptOrNull()?.setMessage(message);
        }
      },
      speakingPrompt: () => {
        const message = getMessage("assistantIsSpeaking", chatbot.getName());
        if (message) {
          getPromptOrNull()?.setMessage(message);
        }
      },
      interruptingPiPrompt: () => {
        const message = getMessage(
          "userStartedInterrupting",
          chatbot.getName()
        );
        if (message) {
          getPromptOrNull()?.setMessage(message);
        }
      },
      clearPrompt: (context: SayPiContext) => {
        getPromptOrNull()?.setMessage(context.defaultPlaceholderText);
      },
      draftPrompt: (context: SayPiContext) => {
        const text = mergeService
          .mergeTranscriptsLocal(context.transcriptions)
          .trim();
        if (text) getPromptOrNull()?.setDraft(text);
      },

      mergeAndSubmitTranscript: (context: SayPiContext) => {
        const text = mergeService
          .mergeTranscriptsLocal(context.transcriptions)
          .trim();
        if (text) getPromptOrNull()?.setFinal(text);
      },

      callIsStarting: () => {
        buttonModule.callStarting();
      },
      callFailedToStart: () => {
        buttonModule.callInactive();
        audibleNotifications.callFailed();
      },
      callHasStarted: () => {
        buttonModule.callActive();
        audibleNotifications.callStarted();
        EventBus.emit("session:started");
      },
      callHasEnded: () => {
        visualNotifications.listeningStopped();
        buttonModule.callInactive();
        audibleNotifications.callEnded();
        EventBus.emit("session:ended");
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
      },
      notifySentMessage: (context: SayPiContext, event: SayPiEvent) => {
        const delay_ms = Date.now() - context.timeUserStoppedSpeaking;
        const submission_delay_ms = lastSubmissionDelay;
        EventBus.emit("session:message-sent", {
          delay_ms: delay_ms,
          wait_time_ms: submission_delay_ms,
        });
      },
      clearPendingTranscriptionsAction: () => {
        // discard in-flight transcriptions. Called after a successful submission
        clearPendingTranscriptions();
      },
      clearTranscriptsAction: assign({
        transcriptions: () => ({}),
      }),
      pauseAudio: () => {
        EventBus.emit("audio:output:pause");
      },
      resumeAudio: () => {
        EventBus.emit("audio:output:resume");
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
        const autoSubmitEnabled = userPreferences.getCachedAutoSubmit();
        return autoSubmitEnabled && readyToSubmit(state, context);
      },
      wasListening: (context: SayPiContext) => {
        return context.lastState === "listening";
      },
      wasInactive: (context: SayPiContext) => {
        return context.lastState === "inactive";
      },
      interruptionsAllowed: (context: SayPiContext) => {
        const allowInterrupt = userPreferences.getCachedAllowInterruptions();
        return allowInterrupt;
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

        const maxDelay = 7000; // 7 second max submission delay (lowered from 8s in v1.6.0)

        // Calculate the initial delay based on pFinishedSpeaking
        let probabilityFinished = 1;
        if (event.pFinishedSpeaking !== undefined) {
          probabilityFinished = event.pFinishedSpeaking;
        }

        // Incorporate the tempo into the delay, defaulting to 1 (fast tempo) if undefined
        // This allows us to adjust the delay based on the user's speaking speed, or to ignore it as a factor if it's not provided
        let tempo = event.tempo !== undefined ? event.tempo : 1;

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

        // Capture the delay for analytics events
        lastSubmissionDelay = finalDelay;

        return finalDelay;
      },
    },
  }
);
function readyToSubmitOnAllowedState(
  allowedState: boolean,
  context: SayPiContext
): boolean {
  const empty = Object.keys(context.transcriptions).length === 0;
  const pending = isTranscriptionPending();
  const ready = allowedState && !empty && !pending;
  return ready;
}
function provisionallyReadyToSubmit(context: SayPiContext): boolean {
  const allowedState = !(context.userIsSpeaking || context.isTranscribing); // we don't have access to the state, so we read from a copy in the context (!DRY)
  return readyToSubmitOnAllowedState(allowedState, context);
}
function readyToSubmit(
  state: State<SayPiContext, SayPiEvent, any, any, any>,
  context: SayPiContext
): boolean {
  const allowedState = !(
    state.matches("listening.recording.userSpeaking") ||
    state.matches("listening.converting.transcribing")
  );
  return readyToSubmitOnAllowedState(allowedState, context);
}

export function createSayPiMachine(bot: Chatbot) {
  chatbot = bot;
  return machine;
}
