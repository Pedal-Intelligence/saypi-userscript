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
    /** @xstate-layout N4IgpgJg5mDOIC5SwIYE8AKBDAxgawDsIAbMAYwFcA7KAQQBswBhCuqgZVJqgG0AGALoAXflGTU87EAA9EAWgCcAZgBsksQE4ArAHZJnYwA4FUgDQgAnokl6Ak1IC+nszBhIuvVOgDu+EmIychwCwqISUjK+8sGKKhDqmjr6SCYm5lZ2Dm7oAHTobKkEeGjY+MQkABbY+EQAfOhUtBVVNdwgNWK19cERjc2tkG0OXd04fWjAVJUYIRgJSSlpGtkKebqI+WnJ7QVLrXE6rLEOG1ISNlabO2bd+IOUICB9w9TYAAphE1Mz11Y8wIIwAAFQJfgAShczhdrrdrqo7qxHqk8N1evpVvpCjsZKl7JsOv0Mb0FG00U4caFsQSOFBiDdrtcAGLpUKhJZJVbIxzojYmUyba7mfaWEyHVKHMzI-kZVlQ9lwgSC4UPZ6i6XPV7vBAAMU0UjIqGqGj26S6OnWuMJxNM3XJJ2Jth6Bi21m2Ot29U0YkYdCgeGwIBCqRJADEIGKXuLVT8fn9Ea7YUqOqjEhiuWlEMTYyZKUl9NsDB0kxZto4BRaVYKHiLfn8-qD-kCJW9JQW4UXixa1Ky7N1TAYKI5KcdsRYqf0seoknsiSY7I7YzaKzCRWDni9ZY2G1DY-Gkym02j5+iOLPvmCG7Gm636I3O82K63K6jjBYSf3uqsJPoFFz8cxrMszL7Gej7BGWH5Vq+b6Hp+P5-v+gFAP+xYAU2cHvk+bawQ6YieGe3xJocGycm6-K6JsyEnOSjKrPygKYkKGLhNe97PsGGHPo6OEYTBuH-s+VZdnB3w9hBeHgQRJGdkdOFZPO1zotcrIrLWCGHDcN5ZL0Xa4ahoGkuG1qmladrMdGnG8dx-EZlhAl-lxKEIdyNzLhJNyGP0Nm6KkxhfJsGyUc4VH0T8BFGaZjFcT+Wl8bpAm9t2p7DiSc5kmiWJhY5k5ItcrKYn5Jg3HZ8w6A5DKJEZUWrjFsUJUls5Lkx0nXvOqxJGlNzSrVUjyUCTWYk4l5ZP5yEhTlKGFUFJXHjR553hytwomcHTuUVGIrGVzgEsNRmlQ5FH5RNWEzTmRZzURSl4URlY9qSZ2rrlUh2dShKwvyxxJDODlbnOAVhbFK1LWtm0bcRImHbJ8m-dpZWaNplzOPsVhEtONYnecK6xQlWWPdlOX7VGvafslVUA89-aMb1LJks16FVjJg5-GsrLOEYJ26NkNlfKu8Nw4js7ZdZz52qCbJnBDl5ORcGL8qYHy7ES7F6gKzgJDGo1YyA02EzNC1LY+uME5xqMnctexXXyHwUr0xzeV1fI3OSgGsltFN4+TNMFYzBdM4tLO5WzfN9rNZPjYYhwUvUlz6YZNjOGUHWUrGqzsdzgsI-jB2baNxPCXJJP7I7xO2NdqxWKjGLrEBhzJBXdcc17o3jSTUtGfJ7NTVzjvOmkEZDj4OiYg5FgIqcXm3P5dI7j0HJXIfSLJTdNULQLdnR35OyJgLB7VbNdW7ePFe0Gzqs7iNUJ6j3zJ6XRKj2EOTC23sDY+l8i48xXu2W9WJmHyNnTY8ojJRWTMvOw55jjGGSkWUCkjI+V-knKafFzr3ypn2NmA5V73WHq3HuUjUZrxJF8FeJIGRLhZOMFw-U24JF2I3a6zclHTQAofeWu9W6K3fs-de7dHbb3ZhrKR-NaQM1JEzce3Q4ymAmKsSI8oxC+gOF5DYqj+GWKthYlaZg6E4wZitDBuCcH4I5oQ1BO8+EYK3jgr61D3E3A8SiFR5wfKnVyOzZO5g6rHTJBTZx-CLrOMsVQ1avD5r8IwYImeGUJLaEfD3d8Dju4aIHqSRBZM7jOAcJYHybN3jOGJH6IksSG5B3qkzOqb9X7vxUZ3TRS4tJKi5JOHJFcvyGV9jyOIZJOi7HGIkz0vjKYZLATPbOyCxmjJOOyFkiQeQ+wkh2FIgwC5rBOJJKoS4dAM0IbzBG38F7cNevLBWz87YqyVu2OZ-4pAtNJI0gujhpiJGvLYvJhkSQKk2O9EFu9+kJMqhCjei8tpMKziwjW4zQFawOr1eI1yJn6k2RsJ6JxdgSVWGcaQdgdAZD0CHbpeKAWeOLOcvW5zLnX3nqrBZiKgUaJ5KPNF5s6Qok2H5dyaM7rLAaOzKcjQ3BHWwSw8BNdoHb3PrvXeB8Y5HL-h4rYpxjjmHqUyDKfLHKGMaHfOq0K77+OAQEs5nDJV1NMRvfeDi9kdL1NkUYTj6iZtVvZBhZT8GMozpI1Jmc07TJZrM7h1KFm4u1vvJOaTVhzOOVYruP5JjJHJKkLI7kqHrD8oeJNZCq45rIR3K59zLZLIts9QEGQlw-NUdnIUvJj7FqJE0A4MwoJhOhGNQcZT6iG1zjdJ1XjNkFJiIKrkaTSSZAgDEIKlTSnRBcOEMaZxdgGRgdWzp2tBnhKheO9F070mq05Jis5DLdW4lJBcIp1j9Rxq-KkZDQ7-3Xp1rOzxC7l2rxXWuqpG6t1rOHRS1eTKdmxrGGcUw2HBXOVMC5flOydBShWFcWVLavTIYfpetdALV27pOYR-x5y11AsuSi66BdoOfLlDsQZ9hUhgMZWcc5yHWYKvZqx0xEH93xLhW29d67Fl7oI7nLeMZXheBwvG2xJhzjy2YjsZl7LHJYOPAazVTjj3Efg5cxjd7fEPoyU+15yCe1YuOOSLjNxzgrFtjsBr4rdAw48w4lQNXCOsao8+2j3amOON7UJ9j3FEPGRI5pxjvGSZ8cE1+xzwmX3ib-WJ3WKGdPad07p-Tan1NEYoaZ8zln8nme1H3OejlrB9gnEywY5g4KBfGOzW6SzWYPXZsKnHJGx5KZXRI39TCZX+I8qJ9d9zPNuf8yJ1zpKoSed0PcAl8Xp2SLi7StdAGnlKzgaSTOdxzqiG7uS0wXz01pcPZl1GjxnD5G-F5ZosEV6wv2Y8LZHUbjFHa71z1wPgdQ8TtdrdPcLlzaK3qr2aQ3BHA8sJJIhHiIJpbV0ldhKElQdq9Bxja9aNw-u9LO7xGKVQ9VkO4I1JGLaOSO5aciGlxJOeJ6oOYjGNAaTr0y1vGYepjm9rrAEAA */
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