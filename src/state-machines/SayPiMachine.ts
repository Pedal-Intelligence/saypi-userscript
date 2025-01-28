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
  | { type: "saypi:interrupt" }
  | { type: "saypi:submit" }
  | { type: "saypi:promptReady" }
  | { type: "saypi:call" }
  | { type: "saypi:momentaryListen" }
  | { type: "saypi:momentaryPause" }
  | { type: "saypi:momentaryStop" }
  | { type: "saypi:momentarySubmitTranscriptions" }
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
  isMomentaryEnabled: boolean;
  isMomentaryActive: boolean;
  hasUserSpoken: boolean;
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
    momentaryPaused: {};
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
    /** @xstate-layout N4IgpgJg5mDOIC5SwIYE8AKBLAdFgdigMYAuWAbmAMSpoAOWCdATgPYC2dJASmChGgDaABgC6iUHVawsZVvgkgAHogDMAdgAcAThzrt64aoAsAJgBsAVk3HLlgDQg0iAIwvTwnJs0ntmt34uBgC+wY602HiEpBTUtAwIRCgANski4kggUjJyCpkqCNqmjs6Fxrqm1uqm6naVmsLqoeHokQTEZJQ06AkMAMp0fADWBFDpitmyWPKKBcZulnra5tqWRqqW7g5OriaqXqrm6i6ax8KW6hrNIBG4Sal9JCjMZPhQ3fSM98m8-EJiE2kUxm+UQtmMOBcxhs1m8xn0+m2pWhi2MxnMphq2hc5hcwmMh2utxw30ez1e73ijAAFig3gBXOjjTKTXKzRCaYo7BB41Y4NanDaXczmYQuSxE1p3FLJMkvUYfBLfABiKCwyUgzMkQLZoIQaIhUJh3hsCNWJVc2n2llU2jtm3x-ltksw0oeT3lbyoSlgTxIYBwKAAZv7mAAKDzCKMASg+kVJHopWqyOumeVAc0shuhthN8IM5u5Jk8dtUWxqVisErCNylOGSWF9YHwCqpTCwABVqQQRm9k6y0+yEKpDvsEVHrCtzMZzhbhxtzJDvEc3KcjsYXZEG02W162-1Bihe2MASzUyCM2oNmODBPNFOZ0i1O51Dh5mtqqtTD4fJvcNv-V3SkekYchGywAAjDV+3PdNlFcEVNH5Sd-CsTEbFUOdxQsPQdGWdRDEqLY-3rRtANbECEBQekIGmRJ5HwMBSE1U9tRyQc9RxdEcFtdEHytfQsIJTwR3XXiNHRFwSIA5sKM+KiaLo5gmIYpiSBg9iL3gnlp1fNDbHxKMcRMOdr1fQ5UL8Az0WksjZL3SjYDgGR5Co2AZCgRiIA04E4IKLiIXKTE0RXe8DFMtES3FFxDHUGcXDLasWldUid1GHBlKIVhmFohz5NpBkmVYlNNL8q8bSWQxzjC6dZ25SN9lUc46ltW1Kg3GtiRkoCMpUnK5ISdgOGbD00AAGTs-AfN1S8eUsO031MZZ7w0TF8XUOdTEit8mrRHxhFFeFVFstK3l6rL+rO-BWBIAZhgGxh6Sc5hlQIRtqUgO6j1GaaONmkcKvHaqHzq0o1ohEVyg2TQs05Y7Orrbr0sy7LcqgHBrtuw9j0VR7nq+49fq0gptEaHBzFOaFv3vFENvq6LyenbwPHMVRMW0E7yLOlHLvRp6wGYAmHoQfnBZIVg6EGCAhb7YqB2JxAKaQu07ThCw-GWTbKlMRnyh0adp3FJLaxSpHub6tGcFFmXgPk63xclz7sZ+lwMjY3yhyVnAVb8Gx1f1rXhB1rirWsWHMWNrrJvSob2BG540F4C60dxhBY-j5hMGopyibKhBatMoJ9hFNYoVtfQTnMTn7PR9P8FGpPUeFuvRowbOwEEV3AVKz2Z1MtmkKWoyCQLSvq56luE8b3nU8nzO2-5wRTDdkqPb1Aui2hczLCIkeK-vceY+G+up4t9LMZt1Pred2WV-lvP0MXLZNrxTwtrLGpCNhQ+zrnrP+YgLPY+o1HgS1zkOLMxhC5WkZqXPe2ID4I1NtHX+wCE4LycoAtsf8Jo7nAXqSB-d5pLGHuXBBVckFbhQejLK+BKCenRsQIg9J2D0mSCgCkVAIDyADAQcgrAhgBjjswGAAB5LgWB2BkSwEQfBs08TWDfOoKw5Q3BmG1ptVCBwlaGA-loH+ND5D0IpIGIgzDWHsM4QLNgzAcB0EsUGbK7AcDCLERIqRvoZFyO0go3QUJbAXBMOKKMmF6rVEaj4FYwgGjwi2k0Sh-5qEkiMQLExTCWFsI4cLEgzA6SwCIMwSCLE76wSHAYfYpgThaAknaI4dMwYXEWFafE0ImqHUuAY5JdDUnpXSRYrJeUEg5LyQUopqp1TFO7mvWalScK2hsFWNYfhQlg1qt7KEdpGhmGWPDZKVDTqGO6Qw0x5jMmcLbMM-A+TCkQUgAAUU4CQf4JSe56lmYueZ6I7BLJ8Jog6b4NlaASpUkU8S9mJIOV04xvSzEZMsQqH0foAzBlDGGWA9IIIeJcvgAAImAdhaBYxR0hbQ6FZ0+lnJ+nLUpnF5ivkqYKeagQg4uFMiEyEVh1gJWqecTppKelnXRZi2QnDvEFFEjeKqk5liPkLgRdZ5Qg7CFJtYPlKTjmXOuZBbJuSrmjNud5alrzZo2ghAygiNpVA+EMFA+qWiRyxSMPefw+I1VHJMZq-VOqRk3LAOMjUhqXnTO0qanA5ragjmtfiTa2g0RhtJglNquJzhgpNvsrmhyyXo09Tc71erfUQAeVwZ5UyZohpMGGqpEarUaGjUWIOi4h5Bzin4dCkdEZJOsdlMkJAno4C7cwWA3pfQcORSGAWYY1gxjjBCjN-bmA2J7X2gdsAxVqCMjgMUZYNjKtxFoTadgkLRJxFmBKNo7SpuJMpWAUh8ApzbAVKAjI136gWEsFYawAbP25AsJCM5dGYihBiGKJFr23vvZRa+91b6lr+tpAkGg3xFFzDvHQGwnzDgQ5u2N1RRRw3KKBuA4H0oMC7D2YWB5oMniDWWuYhFvY2CKNEhlhw2UrD0NCIIsb0S+0Ize+QltSPdnwDjfcWAADqhSkxGuDXRoODGgrMZOKxosW0dZbU5EENwlSCR8eI2dSj31BmMH6A7KWNsX0YlMszMNFYDCVMOGYDq4Ler8bvSRrAl8xOgMdtLG+Ywu5nmNfBt9+gP3rE2JULCeJXyk10bmac2IKEubAwJjzXnKIMFei2WAH0-NUZfTvUyVodbVAta-HeGxnNptwKl9zBnPP+avvjfzhXbSLBhqrcUBEjamQsMrDZI4xQ2k2NVq9RG0sNYy-JAgoZmCMnUjJ2jiB5rwk3d+So1hxQNC5KUQ4eJIRNW-L7S4IU9OTfRoZ0TlFZvWIW53GjcGCjAZcPyVmGJlVLXa6ZOwngEpBx0N4U7NkEmuf05diTUmKONYK0tp7K3a08UOHhlmiW+snABVvIopgNCqtB3VwTkOpjGfbD5qWknifUdgwrBA1RrNlj0BWAk6j8SxvO-V9GAB3NUFJlTZWwB2VgPnpu9E82Zp2sPHtaT24YJ+R3AeChCo4AoNoj1AsqOzy23PKd8+YALoXDtL6ItHYGcd4Yp1ErrAT9K2vef887AbiWFm4c09V5u9XGHDiKP+8doHJgQcpYmxzq2z0ACS9c7sSJJ-bCW5nWsu7zjaQwSORTMYOmjostpFzOsAx4RjmhNfpVFuHubC3hYx98xZwL7tlsIE5KZI42fZmmnhPoDYoQazXQgHARQtxqd5wALT+Kwv8wyUIjCJYwu2lK7QYiUH70OXHr2zBaYxKWGK9TXA1EaocOKB0TjlEvXWBM5JRgL71GYOcK-N1aY-FYHEOgDHn9mgPzWP7HNhoJERMUAOpKg7NujDzGjM-j4miFhKTKVl-ueisLGkYJ0kAefDdDbCAf5G4I1PiBTKzNUB4PCC-JyAqqWBGpcIgi5gAedE3GdFBkZlACgZaLtogDpouHFGWMosouUOUMljVqlHOn-NPMAUFrJq4A0MIFhEcLoMwZULhniH-qQUkrwWfFdEgf5rQTyDYJoOAexu-C+F-N4J0vIcnEXi1lRioQfuofTNCJ-nojoQXv-nIWgvPO3BACoQPtCP3EEAClOg0EUDvG6lmiYeUJtNCH+ktM6vFloGNh2iSuqmkrCv0hSCodiIsAyg0BoCYI0isgwYkfGlGD4JIT4DIVwWQfysckKlIiQPEQIbXjFMsF4O4FvGiD1iKDGjvLAmKPAmPLYVEe6ulDmtqm8CYeFPVN4WGnhBcFxPoBzJ0XOgOkuvAJUfDggJtkhJcBvktFtO4DUFrBTJupyMqmYA6HFNPumjXPOoun6H2tdMwOwCkCoRYEtHoCwZ+OsZiJvsOOKBCMeuuBYAdCQYUZ2gut2ucbAKcdlHMTXgsd8UwY8WsfMC8YEVGDsUEDjiPDYBEcgpCjMUCSCYOjgL0bcv6pALcSog8aschhsa8ZUEUIiTAVTN+HAVMScZiRwsugCTiVIkQHcqyUSVmCSQRDCeSZtLUK+FtpgacEaCOIXv0fMTTi4WYWDDDIPK0uKKzGgdOJKRDmRiJmftKXnAhq+EFChsduhoXAzqrN-naBYAROqXYjDtQSodYPJkFDoI0EHB4IWHtt+K+P9kdF4TDLslwdbg1hThUeCTTofq9iEk1NUKcB4K8WWKTEhpyBYCYDUAstabbqMLrvrsLsoTqUOCIUWLLodgDidv7pweNm5pbMXhHgumXlKaGbqd4LoBTPiEPMqbgZnv4DxA0SOB-JsvEqEEAA */
    context: {
      transcriptions: {},
      isTranscribing: false,
      isMomentaryEnabled: false,
      isMomentaryActive: false,
      lastState: "inactive",
      userIsSpeaking: false,
      timeUserStoppedSpeaking: 0,
      defaultPlaceholderText: "",
      hasUserSpoken: false,
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
          },
          assign({ isMomentaryEnabled: false }),
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
                  assign({ 
                    userIsSpeaking: true,
                    hasUserSpoken: true,
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
                ],
                description:
                  'Disable the VAD microphone.\n    Aka "call" Pi.\n    Stops active listening.',
              },
              "saypi:momentaryListen": {
                actions: [
                  assign({
                    isMomentaryEnabled: true,
                    isMomentaryActive: true,
                    hasUserSpoken: false,
                  }),
                  {
                    type: "momentaryHasStarted",
                  },
                ],
                description:
                  'Enable Momentary Mode. Now recording will only stop if the user releases the button.',
              },
              "saypi:momentaryPause": [
                {
                  actions: [
                    assign({
                      isMomentaryActive: false,
                    }),
                  ]
                },
                {
                  target: "#sayPi.listening.converting.submitting",
                  cond: "readyToSubmitFromMomentary",
                  actions: [
                    {
                      type: "momentaryHasPaused",
                    },
                  ],
                },
              ],
              "saypi:momentaryStop": {
                actions: [
                  assign({
                    isMomentaryActive: false,
                    isMomentaryEnabled: false,
                  }),
                  {
                    type: "momentaryHasStopped",
                  },
                ], 
                description:
                  'Enable Momentary Mode. Now recording will only stop if the user releases the button.',
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
                  "saypi:momentaryPause": {
                    actions: [
                      assign({
                        isMomentaryActive: false,
                      }),
                      {
                        type: "momentaryHasPaused",
                      },
                      {                    
                        type: "stopAnimation",
                        params: {
                          animation: "glow",
                        },
                      },
                    ],
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
                  "saypi:momentaryPause": {
                    actions: [
                      assign({
                        isMomentaryActive: false,
                      }),
                      {
                        type: "momentaryHasPaused",
                      },
                      {                    
                        type: "stopAnimation",
                        params: {
                          animation: "glow",
                        },
                      },
                    ],
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

      momentaryPaused: {
        // this state obviates the modification of the user_interrupting state for when momentary mode is enabled
        description: "In momentary mode and the button has been released, so the microphone is ignoring input",    
        entry:[
          {
            type: "pauseAudio",
          },  
          {
            type: "momentaryReturnsToPaused",
          }, 
        ],       
        on: {             
          "saypi:momentaryListen": {
          actions: [
              assign({ isMomentaryActive: true }), 
              {
                type: "momentaryHasStarted"
              },
            ], 
            target: "#sayPi.listening.recording",
            description: 'Returning to the standard recording mode.',
          },
          "saypi:momentaryStop": {
            actions: [
              assign({ isMomentaryEnabled: false }), 
              {
                type: "momentaryHasStopped"
              },
            ], 
            target: "#sayPi.listening.recording",
            description: 'Returning to the standard recording mode.',
          },          
        },
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
                  target: "#sayPi.momentaryPaused",
                  cond:
                    {
                      type: "isMomentaryEnabled",
                    },
                },
                {
                  target: "#sayPi.listening",
                  cond:
                    {
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
              "saypi:piFinishedSpeaking": [
                {
                  cond: "isMomentaryEnabled",
                  target: "#sayPi.momentaryPaused",
                },  
                {
                  target: "#sayPi.listening",
                  cond: "isMomentaryDisabled"
                },
              ],
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
                  target: "#sayPi.momentaryPaused",
                  description: `The user has forced an interruption while momentary mode was enabled, i.e. tapped to interrupt Pi, during a call.`,
                  actions: "pauseAudio",
                  cond: "wasListeningWithMomentary",
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
              "saypi:piStoppedSpeaking":[ 
                {
                  cond: "isMomentaryEnabled",
                  actions: "momentaryHasPaused",
                  target: "#sayPi.momentaryPaused",
                }, 
                {
                  target: "userInterrupting",
                  cond: "isMomentaryDisabled"
                },
            ]},
            after: {
              500: [
                {
                  cond: "isMomentaryEnabled",
                  actions: "momentaryHasPaused",
                  target: "#sayPi.momentaryPaused",
                },  
                {
                  target: "userInterrupting",
                  cond: "isMomentaryDisabled",
                  description: "Fallback transition after 500ms if piStoppedSpeaking event does not fire.",
                },
              ]
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
              "saypi:momentaryListen" : [
                {
                  actions: [ 
                    assign({
                      isMomentaryEnabled: true,
                      isMomentaryActive: true,
                    }), 
                    {
                      type: "momentaryHasStarted"
                    },
                  ], 
                  target: "#sayPi.listening.recording",
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

      speakingPrompt: (context: SayPiContext) => {
        const handsFreeInterrupt =
          userPreferences.getCachedAllowInterruptions();
        const message = handsFreeInterrupt
          ? getMessage("assistantIsSpeaking", chatbot.getName())
          : getMessage(
              "assistantIsSpeakingWithManualInterrupt",
              chatbot.getName()
            );
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

      callNotStarted: () => {
        if (buttonModule) {
          // buttonModule may not be available on initial load
          buttonModule.callInactive();
        }
      },

      callHasStarted: () => {
        buttonModule.callActive();
        audibleNotifications.callStarted();
        EventBus.emit("session:started");
      },

      callInterruptible: () => {
        buttonModule.callInterruptible();
      },

      callInterruptibleIfListening: (context: SayPiContext) => {
        if (context.lastState === "listening") {
          buttonModule.callInterruptible();
        }
      },

      callContinues: () => {
        buttonModule.callActive();
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

      clearPendingTranscriptionsAction: (context: SayPiContext) => {
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

      momentaryHasStarted: () => {
        buttonModule.callMomentary();
        AnimationModule.startAnimation("glow");
        EventBus.emit("audio:input:reconnect");
      },

      momentaryHasPaused: (context: SayPiContext,) => {
        buttonModule.pauseMomentary();
        AnimationModule.stopAnimation("glow");
        AnimationModule.stopAnimation("userSpeaking");
        EventBus.emit(context.hasUserSpoken ? "audio:stopRecording" : "audio:quickStopRecording");
      },

      momentaryReturnsToPaused: () => {
        AnimationModule.stopAnimation("glow");
        buttonModule.pauseMomentary();
      },

      momentaryHasStopped: () => {
        buttonModule.callActive();
        AnimationModule.startAnimation("glow");
        EventBus.emit("audio:input:reconnect");
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
        return autoSubmitEnabled && readyToSubmit(state, context) && !context.isMomentaryActive;
      },

      wasListening: (context: SayPiContext) => {
        return context.lastState === "listening" && !context.isMomentaryEnabled;
      },

      wasInactive: (context: SayPiContext) => {
        return context.lastState === "inactive";
      },

      interruptionsAllowed: (context: SayPiContext) => {
        const allowInterrupt = userPreferences.getCachedAllowInterruptions();
        return allowInterrupt;
      },   

      isMomentaryEnabled: (context: SayPiContext) => {
        return context.isMomentaryEnabled;
      },  

      isMomentaryDisabled: (context: SayPiContext) => {
        return !context.isMomentaryEnabled;
      },   

      readyToSubmitFromMomentary: (context: SayPiContext) => {
        return readyToSubmitOnAllowedState(true, context);
      },   

      wasListeningWithMomentary: (context: SayPiContext) => {
        return context.lastState === "listening" && context.isMomentaryEnabled;
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
      momentarySubmissionDelay: (context: SayPiContext, event: SayPiEvent) => {
        return 100;
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
  console.log("Entered readyToSubmitOnAllowedState() empty: " + empty + " any pending: " + pending + " is ready: " + ready);
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
