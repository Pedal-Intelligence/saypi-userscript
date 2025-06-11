import {
  createMachine,
  Typestate,
  assign,
  log,
  DoneInvokeEvent,
  State,
} from "xstate";
import {
  uploadAudioWithRetry,
  isTranscriptionPending,
  clearPendingTranscriptions,
} from "../TranscriptionModule";
import { config } from "../ConfigModule";
import EventBus from "../events/EventBus.js";
import { UserPreferenceModule } from "../prefs/PreferenceModule";
import TranscriptionErrorManager from "../error-management/TranscriptionErrorManager";

type DictationTranscribedEvent = {
  type: "saypi:transcribed";
  text: string;
  sequenceNumber: number;
  pFinishedSpeaking?: number;
  tempo?: number;
  merged?: number[];
};

type DictationSpeechStoppedEvent = {
  type: "saypi:userStoppedSpeaking";
  duration: number;
  blob?: Blob;
  captureTimestamp?: number;
  clientReceiveTimestamp?: number;
  handlerTimestamp?: number;
};

type DictationAudioConnectedEvent = {
  type: "saypi:audio:connected";
  deviceId: string;
  deviceLabel: string;
};

type DictationSessionAssignedEvent = {
  type: "saypi:session:assigned";
  session_id: string;
};

type DictationStartEvent = {
  type: "saypi:startDictation";
  targetElement?: HTMLElement;
};

type DictationEvent =
  | { type: "saypi:userSpeaking" }
  | DictationSpeechStoppedEvent
  | { type: "saypi:userFinishedSpeaking" }
  | DictationTranscribedEvent
  | { type: "saypi:transcribeFailed" }
  | { type: "saypi:transcribedEmpty" }
  | DictationStartEvent
  | { type: "saypi:stopDictation" }
  | { type: "saypi:callReady" }
  | { type: "saypi:callFailed" }
  | { type: "saypi:visible" }
  | DictationAudioConnectedEvent
  | DictationSessionAssignedEvent;

interface DictationContext {
  transcriptions: Record<number, string>;
  isTranscribing: boolean;
  userIsSpeaking: boolean;
  timeUserStoppedSpeaking: number;
  sessionId?: string;
  targetElement?: HTMLElement; // The input field being dictated to
  accumulatedText: string; // Text accumulated during this dictation session
}

// Define the state schema
type DictationStateSchema = {
  states: {
    idle: {};
    errors: {
      states: {
        transcribeFailed: {};
        micError: {};
      };
    };
    starting: {};
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
          };
        };
      };
    };
  };
};

interface DictationTypestate extends Typestate<DictationContext> {
  value: "idle" | "starting" | "listening" | "errors";
  context: DictationContext;
}

function getHighestKey(transcriptions: Record<number, string>): number {
  const highestKey = Object.keys(transcriptions).reduce(
    (max, key) => Math.max(max, parseInt(key, 10)),
    -1
  );
  return highestKey;
}

const apiServerUrl = config.apiServerUrl;
if (apiServerUrl === undefined) {
  throw new Error(
    "Configuration error: apiServerUrl is not defined. Please check your environment variables."
  );
}

const userPreferences = UserPreferenceModule.getInstance();

let targetInputElement: HTMLElement | null = null;

// Helper function to get the target element
function getTargetElement(): HTMLElement | null {
  return targetInputElement;
}

// Helper function to set text in the target element
function setTextInTarget(text: string) {
  const target = getTargetElement();
  if (!target) return;

  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
    // For input and textarea elements
    const currentValue = target.value;
    const newValue = currentValue + text;
    target.value = newValue;
    
    // Dispatch input event for framework compatibility
    target.dispatchEvent(new Event('input', { bubbles: true }));
  } else if (target.contentEditable === 'true') {
    // For contenteditable elements
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(text));
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      // Fallback: append to end
      target.textContent = (target.textContent || '') + text;
    }
    
    // Dispatch input event for framework compatibility
    target.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

// Define a constant for the timeout (in milliseconds) for the user stopped speaking event
const USER_STOPPED_TIMEOUT_MS = 5000; // Shorter timeout for dictation

const machine = createMachine<DictationContext, DictationEvent, DictationTypestate>(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QQJYGMAuBDDKD2AdgMSxYCeADigrHLPgQlrPVAZANoAMAuoqBTz1chfiAAeiAIxcpAJgB0AdgAscuSoBs2gBwBOOQFYANCDLS5AX0unUmHAwUoIAGzAlyVGtgBOGACLo2CIE3HxIIILCDGKSCFIqUkoKOppKcgYqhnqaCabm8TqKeoYAzFIVpVlcsjrWtkEOhAqwvrgEUB6U1GhYLi4ASmBYEGRhYlEoIbGIhkr5iHJSmgqGZfIqXGVKFXP1IHbBjq1YfigdXV6teBSB9iHjEZPTEXEJSSlpGRrZuSoLCFKmkMCk2miM6SSaxUen2hyaBBabXOnVI3QQvX6ADEsCg3BBHgIhFMYq9pKU9MlUulMr88mZELlFFJDOD5BSuKUlJo6jYDo0QkjTu1OuIThgwAosAAzCU+AAUMhqXAAlER4YKTmcOoTIsSXqA3psqV9aTl6QUVCpkmCfiodDolFwlIY4QLHC4UK0wAQUZdqNdbu7CLrnqTDdI1CaaT9zf8GfEuBoFDy5EUWVI9HpylY+RqPV6Jb6OgofGA0HgfKgLmirhgbncjiHeBN9eGJJHnZ8Y1k4wCpFyuKt9FxNFzNKPcm77gXvcWoKXy5XqwuCHgMABlCjDADWftr1AArrQfFjzl6ABaQLe7lGhtuiMnxCnR769v79wxGUElUqjmoDnoo7Tk2iKenOKKLhWVaQWum7blge41p4R4njeiF3i2TwPgQMwIC6ijOpyOicjCSayP2A4gnoRRFJyqjaIYvINDOzTgUWkFltBK4KMeYA+OhSGoihCB8QJ9YUNuECCZh4REtEj4RggZSlAopRFEoTpMS6QJSP2chAgoNFplwlIGF+3IgQiCjsT6nFLjBJZiTJyHos5ElSS5UAcFIcl6gpuFPipakaVpjplLklGpKCtEslwOilL8ShWYKtnzgoFYEAAbvxIpSmgaCHgAtoeLgOK5XgYD4WAELAaA+CgABGnBYfJJKKR2+FVEZSQJako6lAZ8YFKoijWpSsiGFw9oJclebBmBhZ2SWmU5dqC5YAVxWleVwnolVNV1Q1zU4niLV+WGHVGly3ZvnSw2IHoagprRpSDfamk6K682sYtEErYQa15ZthUlWVIr+ggB21fVTWQAAokVFAYGMrX+e1gVKQkN3UndfYJv1L1plalLckYzH8r9NlLelq25ZBIPbeDfpisEkoynK8pTTUar5mxNOQXT635aDO0iveAV4WkAIGeoRm-uo2jLFRKWzhxAPZfTJbQ0dTX7iJOuw81BJo5dmOdYNKxMUx2hKFm1qGA9CBpEOX4TdkahqFIqv8-9C5C3lhvHfr+3VTDx1gKd+ISxjeGW8ONtpPbLpO3bOgxcT2RTWs00+396v+4DWsLkHesVdQpfG4jyOoxdOFx3IVtfakSdPSnAIOkO9pplU6hJJy3s-aBCj8T4lawAoleR7i+JEKzODs7K-Hyn+PPqgtI8+GPPgT1PUfna2ktPppMtbMUv4VDySUqHnm-bxPRXoPDW+VnP4qL5zq+quvVOj+PCiPzQM-beMcDSdUdP2SkqksxlBqDsTkSxeR8jXBAOAYg+bmzNnhAAtOoAEJRQTrFljCHIShUi32cG4Q+scnxZGSFmLMwIyjvhdKfdSCgtjxRKAOB0jtb5ahFNQsBcRBwKCGolWoStUgy2WKsDIXxHTAmzKUW+aUURCPbHERuAI3p6A4fIp6WxNLciqKogWJYuLLnUdhI+Sk7b9hqNA166QvoGTMX7KCViSxwS8hoq6j05gvRdAkcEtROSUTSGIwaOgkgGW5DoLI7iC6eMcguZyCEhJ+PNm8OQ8wEwVASS9bIuis7yE0Ek5ahdNbrSyXhVQAImKqSTJSXq1p1JzRYsPNRGsgYMy2mDXatTj4fGtglAyVRnR4IJi6UE0TEiGAHLIN6FTaZF2FpXaxbVhEWDkACMmGcEpZh2CZDplNh5-x3kMrGmkQS4zmPbJY8UAT2mgaOIwVFyg5lORgu+-894z0gFczqUgiiqTuXbJ6jydB7JBUZN5pl5DvIpj8i5D8n4vx8ECt4oLbr3MhTIaFCZcjUTeSCyEZNynWEsEAA */
    context: {
      transcriptions: {},
      isTranscribing: false,
      userIsSpeaking: false,
      timeUserStoppedSpeaking: 0,
      accumulatedText: "",
    },
    id: "dictation",
    initial: "idle",
    states: {
      idle: {
        description: "Idle state, not listening. Ready to start dictation.",
        entry: [
          {
            type: "resetDictationState",
          },
        ],
        on: {
          "saypi:startDictation": {
            target: "starting",
            description: "Start dictation for the focused input field",
            actions: [
              assign({
                targetElement: (context, event: DictationStartEvent) => event.targetElement,
                accumulatedText: "",
              }),
            ],
          },
        },
      },

      starting: {
        description: "Dictation is starting. Waiting for microphone to be acquired.",
        entry: [
          {
            type: "setupRecording",
          },
        ],
        on: {
          "saypi:callReady": {
            target: "listening.recording",
            actions: [
              {
                type: "startRecording",
              },
            ],
            description: "VAD microphone is ready. Start recording.",
          },
          "saypi:stopDictation": {
            target: "idle",
            description: "Dictation was cancelled before it started.",
          },
          "saypi:callFailed": {
            target: "errors.micError",
            description: "VAD microphone failed to start. Audio device not available.",
          },
        },
        after: {
          "10000": {
            target: "errors.micError",
            description: "Dictation failed to start after 10 seconds.",
          },
        },
      },

      listening: {
        description: "Actively listening for user input and transcribing speech.",
        entry: [
          {
            type: "acquireMicrophone",
          },
          assign({ 
            timeUserStoppedSpeaking: 0
          }),
        ],
        exit: [
          {
            type: "clearTranscriptsAction",
          },
          {
            type: "clearPendingTranscriptionsAction",
          },
        ],
        states: {
          recording: {
            description: "Microphone is on and VAD is actively listening for user speech.",
            initial: "notSpeaking",
            states: {
              notSpeaking: {
                description: "Microphone is recording but no speech is detected.",
                on: {
                  "saypi:userFinishedSpeaking": {
                    target: "#dictation.idle",
                  },
                  "saypi:userSpeaking": {
                    target: "userSpeaking",
                  },
                },
              },
              userSpeaking: {
                description: "User is speaking and being recorded by the microphone.",
                entry: [
                  assign({ 
                    userIsSpeaking: true,
                    timeUserStoppedSpeaking: 0
                  }),
                ],
                exit: [
                  assign({ userIsSpeaking: false }),
                ],
                on: {
                  "saypi:userStoppedSpeaking": [
                    {
                      target: [
                        "notSpeaking",
                        "#dictation.listening.converting.transcribing",
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
              "saypi:stopDictation": {
                target: "#dictation.idle",
                actions: [
                  {
                    type: "stopRecording",
                  },
                  {
                    type: "finalizeDictation",
                  },
                ],
                description: "Stop dictation and return to idle state.",
              },
            },
          },

          converting: {
            initial: "accumulating",
            states: {
              accumulating: {
                description: "Accumulating transcriptions and streaming to target field.",
                after: {
                  [USER_STOPPED_TIMEOUT_MS]: {
                    target: "#dictation.idle",
                    description: "Auto-stop dictation after user stops speaking for a while.",
                    actions: [
                      {
                        type: "finalizeDictation",
                      },
                    ],
                  },
                },
                on: {
                  "saypi:transcribed": {
                    target: "accumulating",
                    actions: {
                      type: "handleTranscriptionResponse",
                    },
                    description: "Transcribed speech to text. Stream to target field.",
                  },
                  "saypi:transcribeFailed": {
                    target: "#dictation.errors.transcribeFailed",
                    description: "Error response from the /transcribe API",
                  },
                  "saypi:transcribedEmpty": {
                    target: "#dictation.errors.micError",
                    description: "Empty response from the /transcribe API",
                  },
                },
              },
              transcribing: {
                description: "Transcribing audio to text.",
                entry: [
                  assign({ isTranscribing: true }),
                ],
                exit: [
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
                      "#dictation.errors.transcribeFailed",
                    ],
                    description: "Received an error response from the /transcribe API",
                  },
                  "saypi:transcribedEmpty": {
                    target: [
                      "accumulating", 
                      "#dictation.errors.micError",
                    ],
                    description: "Received an empty response from the /transcribe API",
                  },
                },
              },
            },
          },
        },
        on: {
          "saypi:stopDictation": {
            target: "idle",
            actions: [
              {
                type: "stopRecording",
              },
              {
                type: "finalizeDictation",
              },
            ],
            description: "Stop dictation manually.",
          },
        },
        type: "parallel",
      },

      errors: {
        description: "Error states for dictation failures.",
        states: {
          transcribeFailed: {
            description: "The /transcribe API responded with an error.",
            after: {
              "3000": {
                target: "#dictation.idle",
                description: "Return to idle after showing error briefly.",
              },
            },
          },
          micError: {
            description: "Microphone error or no audio input detected",
            after: {
              "3000": {
                target: "#dictation.idle",
                description: "Return to idle after showing error briefly.",
              },
            },
          },
        },
      },
    },
    on: {
      "saypi:session:assigned": {
        actions: assign({
          sessionId: (context, event: DictationSessionAssignedEvent) =>
            event.session_id,
        }),
      },
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
  },
  {
    actions: {
      setupRecording: (context, event) => {
        EventBus.emit("audio:setupRecording");
      },

      startRecording: (context, event) => {
        EventBus.emit("audio:startRecording");
      },

      stopRecording: (context, event) => {
        EventBus.emit("audio:stopRecording");
        EventBus.emit("audio:tearDownRecording");
      },

      acquireMicrophone: (context, event) => {
        // Setup microphone for dictation
        EventBus.emit("audio:setupRecording");
      },

      transcribeAudio: (
        context: DictationContext,
        event: DictationSpeechStoppedEvent
      ) => {
        const audioBlob = event.blob;
        if (audioBlob) {
          uploadAudioWithRetry(
            audioBlob,
            event.duration,
            context.transcriptions,
            context.sessionId,
            3, // default maxRetries
            event.captureTimestamp,
            event.clientReceiveTimestamp
          );
        }
      },

      handleTranscriptionResponse: (
        context: DictationContext,
        event: DictationTranscribedEvent
      ) => {
        const transcription = event.text;
        const sequenceNumber = event.sequenceNumber;
        
        console.debug(`Dictation transcript [${sequenceNumber}]: ${transcription}`);
        
        if (transcription && transcription.trim() !== "") {
          context.transcriptions[sequenceNumber] = transcription;
          TranscriptionErrorManager.recordAttempt(true);
          
          // Stream text to target field immediately
          setTextInTarget(transcription);
          
          // Update accumulated text
          context.accumulatedText += transcription;
        }

        if (event.merged) {
          event.merged.forEach((mergedSequenceNumber) => {
            delete context.transcriptions[mergedSequenceNumber];
          });
        }
      },

      clearPendingTranscriptionsAction: () => {
        clearPendingTranscriptions();
      },

      clearTranscriptsAction: assign({
        transcriptions: () => ({}),
      }),

      resetDictationState: assign({
        transcriptions: () => ({}),
        isTranscribing: false,
        userIsSpeaking: false,
        timeUserStoppedSpeaking: 0,
        targetElement: () => undefined,
        accumulatedText: "",
      }),

      finalizeDictation: (context: DictationContext) => {
        // Emit event that dictation is complete
        EventBus.emit("dictation:complete", {
          targetElement: context.targetElement,
          text: context.accumulatedText,
        });
        
        console.log("Dictation completed:", context.accumulatedText);
      },
    },
    services: {},
    guards: {
      hasAudio: (context: DictationContext, event: DictationEvent) => {
        if (event.type === "saypi:userStoppedSpeaking") {
          event = event as DictationSpeechStoppedEvent;
          return event.blob !== undefined && event.duration > 0;
        }
        return false;
      },
      hasNoAudio: (context: DictationContext, event: DictationEvent) => {
        if (event.type === "saypi:userStoppedSpeaking") {
          event = event as DictationSpeechStoppedEvent;
          return (
            event.blob === undefined ||
            event.blob.size === 0 ||
            event.duration === 0
          );
        }
        return false;
      },
    },
    delays: {},
  }
);

export function createDictationMachine(targetElement?: HTMLElement) {
  targetInputElement = targetElement || null;
  return machine;
}

export { machine as DictationMachine };