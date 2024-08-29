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
  | { type: "saypi:promptReady" }
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
  // TODO assign the default placeholder text on "saypi:ui:content-loaded" event
  // 1. EventModule handles "saypi:ui:content-loaded" event (checkmark)
  // 2. Sends "saypi:prompt-ready" event to the state machine (checkmark)
  // 3. State machine assigns the default placeholder text to the context, as an internal state transition from "inactive" to "inactive" (checkmark)
  return "";
}
const machine = createMachine<SayPiContext, SayPiEvent, SayPiTypestate>(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5SwIYE8AKBLAdFgdigMYAuWAbmAMSpoAOWCdATgPYC2dJASmChGgDaABgC6iUHVawsZVvgkgAHogAsAJgCMAZhzDhADm0BWTaoPqDANgDsxgDQg0idcPXqcZzceP6AnDaq2uqqAL6hjrTYeISkFNS0DAhEKAA2qSLiSCBSMnIK2SoIfuqOzggGxn446sYGflbBPoE26uGR6NEExGSUNOhJDADKdHwA1gRQmYq5sljyikWqmu41mpo2Vuo2wnXGpU6IK9q6wqrNhtqqwjY2Bu0gUbgp6UMkKMxk+FD99IwvqV4-CEYhm0jmC0KahCnnMGlUWzcOjsZTUlRwqgRJlufhMVh8YQij06zzSqTeHy+P0SjAAFihvgBXOjTbKzfKLRAWVEITT6Yw4Xz1YR4hHGVoPJ44AEUz6TX5JAEAMRQWFSkFZknBHKhCCCqlhBnhiK02hRh15uMF2j8tvOWhKVUlJOlZNlVKoSlg7xIYBwKAAZr7mAAKVz6YQASl+0Rl7zl301OW18wKoCWV0NxtcpvN5Suwhwtu0K3Ufg0V2u2mdmFwqSw3rA+HlNKYWAAKrSCBNE6C2SnIenECcbLoEetLMZtEYETYeaaPHdi8s7nyRTXovXG83vgrGMNRige1M+1q8qnOQgTkYMVYJ5Vp1dbPPDB5LH4LAZWqP10SpVvfR3akBkYcgGywAAjdUk3ZC9dU0WxdBtXYdErOpNB5MwSyLbxdiNM1jGWas-xdACmxbECEBQRkIHmZJ5HwMBSA1U9k3PQdlCOfFNBqdR8QsWojDNPxMJOAUEXDKxbU0epMQ3OsG0Aii-iomi6OYJiGKYkgYIHNNON5fEPDhUwpMI-YTB5MSDBqKoEJOIJGgReScDIoC9wQWA4BkeQqNgGQoEYiBdPY-SigQ1RqmCDQDAMYQZNitwrL4ni4rvdZ6hsD8bBctzJhwDSiFYZhaN3Vt6SZFlWNgjiihHMd0snR9Z1Ekxb0k6TZNyxTyO+ArNJK-L8FYEgRnGZSkkZLzmCVAgG1pSAxqPSYQohMLh0fW97ynGdnwtVxsKXVpgk2XxVBykja1cnqgP6orBr64bRsPY8PKmsBmCW49Vp1IcKgCHArC-cwp3LDYDAwi1NACGylzvO5ah2QJuu3fLCuK0qoBwd7PpeibGBxt5WDoUYIC+lbqr0y9bGqCN+S0KS4u0F8spwJdP2-bQ3EJDorryvr0YerHCbxsrKMJkhidJ8nE00LIzzW6nWbp3YGY-EUXzLGpMvUE78V2FGlL6or8EoBMseIIhGXYRlUhQD0IHkP0CHIVgxj9dgPpgAB5LgsHYRSsCIH64L+vlzAxTZgltQjdb28painQG3EaeLMXOnniT5m78pNs2qX9IgrZtu2PQ+thmBwOhS4DYr2BwT3mB9v2A+9IOQ9qo4zmqMwK12eL6j8Bx9oRQszCH86bGhhoDcuzcc+N+R8-yy3rdt+38YQEhmAZWAiGYSCWPltjFd1BpdC0fC+PLW1R3nEsPCk9LAj8DZy0N3qsbzj6C9XkuN7Fipbeu996HxVGqI+YJQqXi0AiPQWxxxnFHAiecjQrA4C5nUbQUkzSrkzv+BeX8l4-xXkXNepdN7APwHvA+EFIAAFFOAkBBMfGq60ECwPQcIBBd4kFPnnKOGwOA0rxVxI0EwH9brf3NoXYu68PReh9H6QMwYQywEZBBVuPl8AABEwB2zQNGAhqNF6mxIX1P+8iKasKpvBZYb4ZLnCMFPL82x5w+B4q0bYacyw3wurzeeJiiFmJkeozRsgPQd3YQhBobM+JBCqO4Bo5h3HxUBjaYIYlTSaEkbnYhMiqE0MgpQne1DQF0OCpTaBupTAGkvjsWKgkdgHATpFA0lQQg7DNK4IeuTTHLz6oU8pJSQG0LAOA9UlSbHVL+rUtYX5DAWDqM01Bqw4p1H0N4WpEi54KSCdKfJBchm0JGWUsZEBGFcBYVA0+syzDzIaUshZLSXA7HaXhCwOgfDlnwaRQhOBy7FQpCQKaALmAV1gJ6b09tlFBg+iGXw+gjF-P2YCz6PpQVotgFEmB5YkJBEqMsM4K5h4J1MIWdZ9QHI7F2FYFyGlYBSHwJjDyFUoDMhxbqexDiNhbB2HsF5FQrDoLEe+XxaV7i7P6oy+QLLWwi3Gr2aZtyDL6hsn4G4NxzC2HOlYTC+IhHuF8FYIitRob+KztEBlTLMZVw7F2fAr1WwHkVSeZVv0DK+FqJ4OK2rbRbCqJhTEHhzKIiuL64w9K4A2vygwTs3ZN4MAAOoHypJy2Z3D0F3muEjA6dRRLlkFOcMN5gziRqlda2VsasAy2AipYYksSaLVFm6m5Hqij7CsnYAUwR7LxSyniqNMrmXVtrR5BtUtm2usEHLNtodVWljWLy7xAqeQQ3QY5EG+JbDij8EOmNfUXXLUAYMLAs1mywAWmTFt6aDKtCsoRaor8fDNBNTu35V1K0jsPTWltb1pq1tvR2-ubMRTSRFFYYQH4g1WjLRWcD78K3RqrT+lNcwT37l-dOqpKrygyRuLCLZ-hAjRUcBmKKQQ7D7pQ1jZNqbE01sbaTNDaacPtrUDaDBlHSVHDsD3ZYPhiNBBCNR79wtpoAEl8DBmYMyD08qANMance1t-YZmercAKfDfqGi1BElDRERYPznGhsKm0GhRO2pxlJmTcnN4S0nde6ds61MqqKFsKykHCwCZMOWG4rQgjhCJMNCAcBFBPDnZ3BAABaBoPJAg1GFV5k4NpcRUald0OIlBIvsLNCaraurzCWHjlyV+GDhVnHxMYWwUk91SrjJSSYOXLwaH1Z44VdRZzxW7pKgJeyjZQGa7qawQb7nYKZraSoGr9h9KxoLTGQ2w5XEwq0ao1g4pTdqBkulUr+ZzYGrap6tbFsGXWCKDBlWrgmHOI6F8fI9A2g6UEacCIdt9euvs+b+UFUqZO+FbkUMAi6HW6rKoM87izYOSEqkf2jg2nnEazwM8h4im4SKD9gSBtQ4GRbMh-8YeufY8UXY8zzglkIlS5m+0jJ6Gq2nPLo43uWv65-bH5isZhIDiQAnCsidv1SqWEsXNrjQ3nMWwUPhgbBGJdOSH0ijmlKKRBJrhP53-bnPtOnwjdhZXsmYNwkO0XAqmrDjhvgeLcPcLsPL2D9MJyt9rxJTkjC2EN+CoFGLYA4GGswdgaRTeIw8Jb1wU4o5SSsnydB6zdMTxWBjlnt0jee7BRCgPj74FW9D2gu3LgTAeGj7aVw9Q+JM+MVjpP9tMXu+YF745YDVSTLTwDYP1uw857N5iR3N8LBJcC7t-5FeQVe6xQ3IO9Dq9N6ES3rPtuBH3cwUPRoGrzPx+lQewbquovRZSVDbwF9F9TaMFBgIlnq3xsdSr3nau1CQYNJBgNAkRT5qhtgg0WVqu62+bq0vLov22qPceKboROdBgtgquHyBYLcJhKZIRoJlBiRiJkhsOv-lgCxpfifETsIJhHFEIl4HAQEMJqvn-t9pJtJuXHZt8KbucIRIKCEO4NONsPUPqiThnIPFiCnOWuEEAA */
    context: {
      transcriptions: {},
      isTranscribing: false,
      lastState: "inactive",
      userIsSpeaking: false,
      timeUserStoppedSpeaking: 0,
      defaultPlaceholderText: "",
    },
    id: "sayPi",
    initial: "inactive",
    states: {
      inactive: {
        description: "Idle state, not listening or speaking. Privacy mode.",
        exit: assign({
          lastState: "inactive",
        }),
        on: {
          "saypi:promptReady": {
            target: "inactive",
            internal: true,
            actions: [
              assign({
                defaultPlaceholderText: (context, event) =>
                  getChatbotDefaultPlaceholder(),
              }),
            ],
            description: `Update the context when the prompt area has been loaded in the UI.`,
          },
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
