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
import TranscriptionErrorManager from "../error-management/TranscriptionErrorManager";

type SayPiTranscribedEvent = {
  type: "saypi:transcribed";
  text: string;
  sequenceNumber: number;
  pFinishedSpeaking?: number;
  tempo?: number;
  merged?: number[];
  responseAnalysis?: {
    shouldRespond: boolean;
  };
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

type SayPiUserPreferenceChangedEvent = {
  type: "userPreferenceChanged";
  discretionaryMode?: boolean;
  voiceId?: string;
  audioProvider?: string;
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
  | { type: "saypi:interrupt" }
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
  | { type: "saypi:piStoppedWriting" }
  | SayPiUserPreferenceChangedEvent;

interface SayPiContext {
  transcriptions: Record<number, string>;
  isTranscribing: boolean; // duplicate of state.matches("listening.converting.transcribing")
  lastState: "inactive" | "listening";
  userIsSpeaking: boolean; // duplicate of state.matches("listening.recording.userSpeaking")
  timeUserStoppedSpeaking: number;
  defaultPlaceholderText: string;
  sessionId?: string;
  shouldRespond?: boolean; // should Pi respond the next time the user finishes speaking?
  isMaintainanceMessage?: boolean; // is the current message a maintainance message?
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

function isContextWindowApproachingCapacity(transcriptions: Record<number, string>): boolean {
  // Calculate total length of all transcriptions
  const totalLength = Object.values(transcriptions).reduce((sum, text) => sum + text.length, 0);
  // Consider capacity approaching if total length exceeds 90% of the context window
  const CAPACITY_THRESHOLD = chatbot.getContextWindowCapacityCharacters() * 0.9;
  return totalLength > CAPACITY_THRESHOLD;
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
userPreferences.getDiscretionaryMode().then((discretionaryModeEnabled) => {
  const cachedValue = userPreferences.getCachedDiscretionaryMode();
  if (cachedValue !== discretionaryModeEnabled) {
    console.warn("Cache is not ready yet. Wait a moment before querying preferences.");
  }
});

function shouldAlwaysRespond(): boolean {
  const discretionaryModeEnabled = userPreferences.getCachedDiscretionaryMode();
  console.debug("Assigning default shouldRespond to", !discretionaryModeEnabled);
  return !discretionaryModeEnabled;
}

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

// Define a constant for the timeout (in milliseconds) for the user stopped speaking event
const USER_STOPPED_TIMEOUT_MS = 10000;

const machine = createMachine<SayPiContext, SayPiEvent, SayPiTypestate>(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5SwIYE8AKBLAxAV1jACcMiwAzYsAOwGMwBhACxWpggG0AGAXUVAAOAe1hYALliHV+IAB6IuAGhBoFAXzXLUmLADos1FLQkA3MDm0CsCAUSEBbAWIBKYFBDTc+SEMNESpGXkEAGYAdgAOAE5dMKiwrhCAFgAmADYAVgikjIzlVQQARkKUrl0IiOSoiOLqwviNLXRsfUNjLDMLdCsEWhQAG36vGT9xSWkfYKiU-MQopJiUrLCUsNyliK4wxpBtFoMjU3NLaysAZQE3AGsDKGGfUYCJ0GCk4ozYqLSojMSQjJKeRUiEKyRC5RCaTChQi0K4GTC4R2ez0fUGZzEKCIEjYXTQPTR-Vc7k8vBGIjGgUmiBySV0hSS2SyFSScTiQIKjI+SSSaRSqyihTShS4SUhyOaqIG-QxWJxUDxPRYbDwAnuggpTyCiAiM2BRS4P10v1h-0RaTSXEKGQlOl0hNl2NuiushIAYigsP1IOrfJrxtqEDy6QymRVsmyfrMilFwRkQlFEwDRTUE7aWg7MU7cbJYJixGBdChyAWiAAKUpcKsASjxGeljvlvseAepQYyIcZOXDrPiUf1yTKiZCgNWmUyNs0u0lun6WDzNGdJxsWAAKkwDDc2M3-VSXogQpDwWyq1lvmkkvDo4eMml6RUocVYVCkum9HOF9Ql91TlgLtdbh3fxW33UJ-mPeJTwic9Lw5A8SjCXQ3l+FYfhSSpKjfWd5wLL9cWXEx5ywAAjb0gMpZ45BBC0ImNM8akyflshCaNrXSWJoi+MIEiWQEsI-XDv3xawUDwCBJF6KRqDAYwfTJB5d0o4IhV5XQE15GDYziVixTKQ8X3U8JeUKficMXfCfwQUTxKEBAyFoKSZLEcitTbFTEMYnJRSrIVkmveNEMhBjqi83lTM-ISekIWBRCkKyYqwKBpM4eSNWAvcqKKC86QWfkeUfaD4mvHkh2tQoEjCS9QWtcLBLYXR7KEIhxIs4SEGVKBVRckDMpvCCEnhQqLyvfVK3BEJ4XWBMEyWV8pxRbCIvqxrmtuXRqCEMR-xQLcFWXAhiDdAx5yYSBtt27qMuCPrPgGs8vlg6N+VFXQLQWf4Ig7XUQlq8yoAamSmpa-6Nq2y4dsi6wDqIc7ANSv10qUkE-l0FIhQFVYrUtCInsNO9piieFvlKdJtnmmcBL+gGHNW+rodh1qenpsQhAES4IAZu54ZbK6dQZY10MiRkRTenHRvqRCCZU35knjNJfrw-6VuB3R6fB3aXQQZnWfZzmOEKbw0oowMajpDJBeyGouFFp6GUQ1JBRFaEYUteXybtSnFftKQzGzf6jFoPB7DwfoUHlHAICkQsDBMIQrkLexiBgAB5JwsHsHCsFoS6kYNLIkLCTIFmKVIlj1Ap0KFCE0gqBIR1WCIFbWhzqF9+Ui1oQPg9D8PiDsIhdAEHvyCa+xdETogU7TjO8yznPAxFDIYgZHIEWSa0qxY0aVnGypvi4TZWRSVkm-qlu27WgOg5DsPIYQMQiFYWBaCIEi5MNhHjbbeJwTR2FKkqomKEYQnoIg+LGUUjIJqWlZD9d2LRPbNx9sQduV9u630ZtYB+T8X5vw9F6d+5JEaBjRuxBM2QJy-GqFvCuw1dCCgWITSqKQvhwKaB7MyXtz4oMvp3a+Pc77YOoM-V+xFIAAFFHBiFJB-HmudSF3nIbyXIVDKhPU2HeN4CxIigjRhaMm7CEGcKQa3Hh9U0E33DrmfMhZiyljLCUKsXBawLUQWfZBfsO5d0sXDWRilAxKH1FwU+-1uGeIsQInMeYw62JLMQMssA8DERnrFagAARMAoc0AuIpsY9xpjwl8PQU2bm-i3JvEQn-RES86hcDRteTe9JMh-FBJECak5DHvjyaEjx7dEnJPEOHeebZ9L9SgjBEaBQRzcXoQyQmpRCZZBCd7Ap7chEiJIoIx+wjcFiJSn44hbZ4x0iqWsQ8ADRTqKroeCqiRoJWzmp0xadUemrLWus3ZWycGiLAPg70+yiFf1Asc1GMJuLxhCBcpIT15gnMJqCGawp4QGOnBwparyL71Q+aIr5OyfkQEkU4GRgLXLAuSKC2EZzIXhEuQOOpd4WFVlWAsXU6EOmoqMei3QfcmqyjEAQblRB+6wBwNYmJRY4nll+DWOsXSuU8phvmAVCrYDDNAiwlI4IoR9iTAiTYNDEBLDiEhOZsIuKavFPAvQZBYDCGoMDTWHUuqlMOaBN41pPjfBlv8QErFrS0UvHXfkDI+TlSwjau1Dr9qEBhurXxJKeqvBuUhaY3ZzbRH+HBUIYpwSGiPtjTVCxw1wEjWtKw65Nx33OHG7cLqgWZVZHU+h2RpgHz-pCBp3xYjC0TPlaojcrUA1tVIFW5aNzUA1suKwAB1V+JSDn1teDxZtuU20wg7QOY+KRUaMjRo7NGYpi3DvtWWv8Na9qWXOCzNmZ1z1qsynya8FRt38kLvENGkJUiPI5daktI7T2c01lenWt6ALbgNgm3mQZ3iep+H8AESw-VbHoVsRI3YLyCjdk8iN-76rVrAxetqVgjpflgKdDmd662ksyuba8sZt0rHBSKeEmqOxHtLXhs9BHNZqwI-e4I8YjSfUTDUBE0JcjXnSLRBhsYJrWh9d+haOGT2ccA8uAwpYiCqmclRxNiAl6sl0HU3UuRRObHLgeJF9IJroX7YifK7HcP-XwxDTBCANN920-rBd1HgihsKMaNIkIFksITFmzNZRQTGbs8kMKg7lOjqwLOsYbmXMXV01BgKelIQFuthhyTMITWMjiPycISz4t-pU85pLc6q1-mvezZL87IO5xWE+kcsQxxilLqKeYjmqu6AAO6enlG6Jq2BVxCAxKzNTl76sgYo3xjLudAkFGCRV49KthspagGNkga4pvXsA2KgsEr7HSpyXaBLa1tujfGwd6bAg9bLYCdGdb2HKsq2hgASWoJp7Td9tY3sW65rmPm9MICy2pHLba8sLGvAmO89zg2lBbQOj7m21o-b+55tObmge6zvRBhSrrMq6mvFCJHpCIysjiP8DQU4NoQDgDIFELXAwAFoV7Rg5wsMo0rDRLxWMfC8KKFoHHaGYdnIy1gBdSPUdGw5yogP1AhcakJKrWxhNorCmY5S3Gl26izQY0ZGYVyhTIQpoghMN5lDnXweeXlzU4pe6bsjFGWcrA3JPF2Gq7emuIQW96y5VwUbXtEqyMeMiw2knvAa0xBptTmtvlKatopUZIuo1jMltuhekcQrdIu4lCOPNMvsxuTz73z8FEIB9YcHgEofDWGm3ZHn1obqjcWWWE+UKfEC87FgUDnsJjROKCrGX4Klu+9N4d4yJUA+8IEFB8P++r7NgINQgFhHrGUHxCEayoJlB1uIxWY-6-SM5iF71XiH5UvjlBKMVnk3EhRpBhebV6zSGQJgL9BafbysVtkNliJvcjZq8Ywm8t9pgV9OIER3JExlkFU+UCBF9j4ag1IQpwg2kVgs0mIYgtFEwSgWEOwGhj9ulBV+5kDYB1pR4BhUD1gMDmJuIAFEMBxypuQN4D4W9zZEChVeUlVqCVV6CWFGCxRmDwhWCK55cisfhuIaVoh2VXFyCkCBCKCmpqDsU8FPR-l6CZklEsCWDcDhRwRkI-gRx3VFNcl5U+DFUw5lUbDqCM5aBxEbDdDApMDxCcCnpmDZlfhSg65pl+tgZF8B8edNVa8nFC5KgqwndLCrtPtT0K0J1QDP5wCc17ZU0sh00J9wtqp6FqheJDRphgEgiANz1F8sgm1cpohUNnp+wplBZrNRRERNhqh4xSjOMmsUi5FAxtEAtN4JoVhYR-Drx6gygWV+QgtUghYsMf0h0ON-pbtbg9sJtDsZtyib8oNVsDwEhaIosakShPoFg4iWhrs6YY1ft-s8cF9Njc5GRohXpD5GVrRRcEd0DYtERDwShEwtgGc1AgA */
    context: {
      transcriptions: {},
      isTranscribing: false,
      lastState: "inactive",
      userIsSpeaking: false,
      timeUserStoppedSpeaking: 0,
      defaultPlaceholderText: "",
      shouldRespond: shouldAlwaysRespond(),
      isMaintainanceMessage: false,
    },
    id: "sayPi",
    initial: "inactive",
    states: {
      inactive: {
        description: "Idle state, not listening or speaking. Privacy mode.",
        entry: [
          {
            type: "callNotStarted",
          },
        ],
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
          }
        ],
        exit: [
          {
            type: "clearPrompt",
          },
          {
            type: "updatePreferences",
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
          assign({ 
            timeUserStoppedSpeaking: 0  // Reset when starting fresh listening session
          }),
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
                  assign({ 
                    userIsSpeaking: true,
                    timeUserStoppedSpeaking: 0  // Reset when new speech begins (aggressive, as this speech could be invalidated later with stopSpeaking - no audio)
                  }),
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
                  assign({ timeUserStoppedSpeaking: 0 })  // Clear on call end
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
                    description: "Submit combined transcript to Pi after waiting for user to stop speaking.",
                  },
                  [USER_STOPPED_TIMEOUT_MS]: { // Uses the constant as the delay duration
                    target: "submitting",
                    cond: "submissionConditionsMet",
                    description: "Submit combined transcript to Pi after a prolonged period of user not speaking.",
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
                    actions: {
                      type: "recordTranscriptionFailure"
                    }
                  },
                  "saypi:transcribedEmpty": {
                    target: "#sayPi.listening.errorStatus.errors.micError",
                    description:
                      "Out of sequence empty response from the /transcribe API",
                    actions: {
                      type: "recordTranscriptionFailure"
                    }
                  },
                },
              },
              submitting: {
                description: "Submitting prompt to Pi.",
                entry: [
                  {
                    type: "setMaintainanceFlag",
                  },
                  {
                    type: "mergeAndSubmitTranscript",
                  },
                  {
                    type: "notifySentMessage",
                  },
                  {
                    type: "setMaintainanceFlag",
                  }
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
                    actions: {
                      type: "recordTranscriptionFailure"
                    }
                  },
                  "saypi:transcribedEmpty": {
                    target: [
                      "accumulating",
                      "#sayPi.listening.errorStatus.errors.micError",
                    ],
                    description:
                      "Received an empty response from the /transcribe API (no speech detected)",
                    actions: {
                      type: "recordTranscriptionFailure"
                    }
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
                      type: "showOrSuppressAudioInputErrorHint",
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
        entry: [
          {
            type: "disableCallButton",
          },
          {
            type: "suppressResponseEarlyWhenMaintainance",
          },
        ],
        exit: [
          {
            type: "enableCallButton",
          },
          {
            type: "clearMaintainanceFlag",
          }
        ],
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
              "saypi:interrupt": [
                {
                  target: "waitingForPiToStopSpeaking",
                  description: `The user has forced an interruption, i.e. tapped to interrupt Pi, during a call.`,
                  actions: "pauseAudio",
                  cond: "wasListening",
                },
                {
                  target: "#sayPi.inactive",
                  description: `The user forced an interruption, i.e. tapped to interrupt Pi, outside of a call.`,
                  actions: "pauseAudio",
                },
              ],
            },
            entry: [
              {
                type: "callInterruptibleIfListening",
              },
              {
                type: "startAnimation",
                params: {
                  animation: "piSpeaking",
                },
              },
              {
                type: "speakingPrompt",
              },
              {
                type: "pauseRecordingIfInterruptionsNotAllowed",
              },
              {
                type: "suppressSpokenResponseWhenMaintainance",
              },
              {
                type: "notifyPiSpeaking",
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
              {
                type: "resumeRecording",
              },
              {
                type: "callContinues",
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
                actions: {
                  type: "suppressWrittenResponseWhenMaintainance",
                },
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
          waitingForPiToStopSpeaking: {
            on: {
              "saypi:piStoppedSpeaking": {
                target: "userInterrupting",
              },
            },
            after: {
              500: {
                target: "userInterrupting",
                description: "Fallback transition after 500ms if piStoppedSpeaking event does not fire.",
              },
            },
            description: "Interrupt requested. Waiting for Pi to stop speaking before recording.",
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
            entry: [
              {
                type: "interruptingPiPrompt",
              },
              {
                type: "startAnimation",
                params: {
                  animation: "glow",
                },
              },
            ],
            exit: [
              {
                type: "clearPrompt",
              },
              {
                type: "stopAnimation",
                params: {
                  animation: "glow",
                },
              },
            ],
            description:
              "The user is speaking during Pi's response, and may wish to interrupt.",
          },
        },
      },
    },
    on: {
      "userPreferenceChanged": {
        actions: assign({
          shouldRespond: (context, event: SayPiUserPreferenceChangedEvent) => {
            // Update shouldRespond based on discretionary mode if it was changed
            console.debug("userPreferenceChanged", event);
            if (event.discretionaryMode !== undefined) {
              return !event.discretionaryMode; // shouldRespond is true when discretionary mode is false
            }
            return context.shouldRespond; // keep existing value if discretionary mode wasn't changed
          }
        })
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
        const shouldRespondToThis = event.responseAnalysis?.shouldRespond;
        console.debug(`Partial transcript [${sequenceNumber}]: ${transcription} [${shouldRespondToThis ? "respond" : "don\'t respond"}]`);
        
        if (transcription && transcription.trim() !== "") {
          SayPiContext.transcriptions[sequenceNumber] = transcription;
          TranscriptionErrorManager.recordAttempt(true); // Record success
        } else {
          // This case should ideally be handled by saypi:transcribedEmpty if the API guarantees it,
          // but as a fallback, we can record a failure here if text is empty.
          // However, the primary failure recording for empty will be on the saypi:transcribedEmpty event transition.
        }

        if (event.merged) {
          event.merged.forEach((mergedSequenceNumber) => {
            delete SayPiContext.transcriptions[mergedSequenceNumber];
          });
        }
        SayPiContext.shouldRespond = shouldRespondToThis ?? shouldAlwaysRespond();
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

      pauseRecording: (context, event) => {
        EventBus.emit("audio:input:stop");
      },

      pauseRecordingIfInterruptionsNotAllowed: (context, event) => {
        const handsFreeInterrupt =
          userPreferences.getCachedAllowInterruptions();
        if (!handsFreeInterrupt) {
          EventBus.emit("audio:input:stop");
        }
      },

      resumeRecording: (context: SayPiContext, event) => {
        if (context.lastState === "listening") {
          // only resume recording if we were already listening
          EventBus.emit("audio:startRecording");
        }
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
        chatbot.getNickname().then(nickname => {
          const normalMode = shouldAlwaysRespond();
          const message = getMessage(normalMode ? "assistantIsListening" : "assistantIsListeningAttentively", nickname);
          if (message) {
            getPromptOrNull()?.setMessage(message);
          }
        });
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
        chatbot.getNickname().then(nickname => {
          const message = getMessage("assistantIsThinking", nickname);
          if (message) {
            getPromptOrNull()?.setMessage(message);
          }
        });
      },
      writingPrompt: () => {
        chatbot.getNickname().then(nickname => {
          const message = getMessage("assistantIsWriting", nickname);
          if (message) {
            getPromptOrNull()?.setMessage(message);
          }
        });
      },
      speakingPrompt: (context: SayPiContext) => {
        const handsFreeInterrupt =
          userPreferences.getCachedAllowInterruptions();
        
        chatbot.getNickname().then(nickname => {
          const message = handsFreeInterrupt
            ? getMessage("assistantIsSpeaking", nickname)
            : getMessage(
                "assistantIsSpeakingWithManualInterrupt",
                nickname
              );
          if (message) {
            getPromptOrNull()?.setMessage(message);
          }
        });
      },
      interruptingPiPrompt: () => {
        chatbot.getNickname().then(nickname => {
          const message = getMessage(
            "userStartedInterrupting",
            nickname
          );
          if (message) {
            getPromptOrNull()?.setMessage(message);
          }
        });
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
        if (text) getPromptOrNull()?.setFinal(text, context.isMaintainanceMessage);
      },

      callIsStarting: () => {
        // buttonModule.callStarting();
      },
      callFailedToStart: () => {
        // buttonModule.callInactive();
        audibleNotifications.callFailed();
      },
      callNotStarted: () => {
        //if (buttonModule) {
          // buttonModule may not be available on initial load
          // buttonModule.callInactive();
        //}
      },
      callHasStarted: () => {
        // buttonModule.callActive();
        audibleNotifications.callStarted();
        EventBus.emit("session:started");
      },
      callInterruptible: () => {
        // buttonModule.callInterruptible();
      },
      callInterruptibleIfListening: (context: SayPiContext) => {
        if (context.lastState === "listening") {
          // buttonModule.callInterruptible();
        }
      },
      callContinues: () => {
        // buttonModule.callActive();
      },
      callHasEnded: () => {
        visualNotifications.listeningStopped();
        // buttonModule.callInactive();
        audibleNotifications.callEnded();
        EventBus.emit("session:ended");
      },
      callHasErrors: () => {
        // buttonModule.callError();
      },
      callHasNoErrors: () => {
        // buttonModule.callActive();
      },
      disableCallButton: () => {
        // buttonModule.disableCallButton();
      },
      enableCallButton: () => {
        // buttonModule.enableCallButton();
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
      notifyPiSpeaking: () => {
        EventBus.emit("saypi:piSpeaking");
      },
      clearPendingTranscriptionsAction: () => {
        // discard in-flight transcriptions. Called after a successful submission
        clearPendingTranscriptions();
      },
      clearTranscriptsAction: assign({
        transcriptions: () => ({}),
        shouldRespond: () => shouldAlwaysRespond(), // reset response trigger for next message
      }),
      updatePreferences: assign({ shouldRespond: () => shouldAlwaysRespond() }),
      setMaintainanceFlag: assign((context: SayPiContext, event) => {
        const timeoutReached = isTimeoutReached(context);
        const mustRespond = mustRespondToMessage(context);
        const shouldRespond = shouldAlwaysRespond() || context.shouldRespond;
        const shouldSetFlag = mustRespond && !shouldRespond;
        console.debug(shouldSetFlag 
          ? `Setting maintainance flag due to ${timeoutReached ? "timeout reached" : "context window approaching capacity"}`
          : "Clearing maintainance flag since below context window capacity and timeout threshold"
        );
        return { 
          isMaintainanceMessage: shouldSetFlag 
        };
      }),
      suppressResponseEarlyWhenMaintainance: (context: SayPiContext, event) => {
        if (context.isMaintainanceMessage) {
          // these actions can be performed early, before the message is fully written
          EventBus.emit("saypi:tts:skipCurrent");
          console.debug("Skipping speech generation due to this being a maintainance message");
        }
      },
      suppressWrittenResponseWhenMaintainance: (context: SayPiContext, event) => {
        if (context.isMaintainanceMessage) {
          EventBus.emit("saypi:ui:hide-message");
          console.debug("Hiding message due to this being a maintainance message");
        }
      },
      suppressSpokenResponseWhenMaintainance: (context: SayPiContext, event) => {
        if (context.isMaintainanceMessage) {
          EventBus.emit("saypi:ui:hide-message"); // send again to ensure the message is hidden
          EventBus.emit("audio:skipCurrent");
          console.debug("Skipping speech due to this being a maintainance message");
        }
      },
      clearMaintainanceFlag: (SayPiContext, event) => {
        assign({ isMaintainanceMessage: () => false });
      },
      pauseAudio: () => {
        EventBus.emit("audio:output:pause");
      },
      resumeAudio: () => {
        EventBus.emit("audio:output:resume");
      },
      recordTranscriptionFailure: (context, event) => {
        TranscriptionErrorManager.recordAttempt(false);
      },
      showOrSuppressAudioInputErrorHint: (context, event) => {
        if (TranscriptionErrorManager.shouldShowUserHint()) {
          textualNotifications.showNotification(getMessage("audioInputError", "Say, Pi"), "microphone-muted");
        } else {
          // Optionally, log that the hint was suppressed, or do nothing.
          console.debug("Transcription failure hint suppressed due to low error rate.");
        }
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
        const mustRespond = mustRespondToMessage(context);
        const ready = readyToSubmit(state, context);
        const timeSinceStoppedSpeaking = Date.now() - context.timeUserStoppedSpeaking;

        /* start debug logging */
        const criteria = [];
        if (isTimeoutReached(context)) {
          criteria.push("timeout reached");
        }
        if (context.shouldRespond) {
          criteria.push("response trigger");
        }
        if (isContextWindowApproachingCapacity(context.transcriptions)) {
          criteria.push("context window approaching capacity");
        }
        let reason = criteria.length > 0 ? criteria.join(", ") : "no thresholds met";
        if (mustRespond) {
          reason = reason + (ready ? " and ready to submit" : " but not ready to submit");
          console.debug(`Submission needed because ${reason}`);
        } else {
          if (context.timeUserStoppedSpeaking > 0) {
            reason = reason + ` (time since stopped speaking: ${timeSinceStoppedSpeaking / 1000} seconds)`;
          }
          console.debug(`Submission not needed because ${reason}`, context);
        }
        /* end debug logging */

        return mustRespond && autoSubmitEnabled && ready;
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
      interruptionsNotAllowed: (context: SayPiContext) => {
        const allowInterrupt = userPreferences.getCachedAllowInterruptions();
        return !allowInterrupt;
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

        if (finalDelay > 0) {
          console.info(
            "Waiting for",
            (finalDelay / 1000).toFixed(1),
            "seconds before submitting"
          );
        }

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

function isTimeoutReached(context: SayPiContext): boolean {
  // If timeUserStoppedSpeaking hasn't been updated yet, there's no timeout.
  if (context.timeUserStoppedSpeaking === 0) {
    return false;
  }
  const timeSinceStoppedSpeaking = Date.now() - context.timeUserStoppedSpeaking;
  return timeSinceStoppedSpeaking > USER_STOPPED_TIMEOUT_MS;
}

function mustRespondToMessage(context: SayPiContext): boolean {
  const timeoutReached = isTimeoutReached(context);
  if (timeoutReached) {
    const timeSinceStoppedSpeaking = Date.now() - context.timeUserStoppedSpeaking;
    console.info("Must respond due to timeout - user stopped speaking", timeSinceStoppedSpeaking/1000, "seconds ago");
  }
  return context.shouldRespond || isContextWindowApproachingCapacity(context.transcriptions) || timeoutReached;
}

export function createSayPiMachine(bot: Chatbot) {
  chatbot = bot;
  return machine;
}
