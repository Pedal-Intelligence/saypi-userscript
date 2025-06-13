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
  getCurrentSequenceNumber,
} from "../TranscriptionModule";
import { config } from "../ConfigModule";
import EventBus from "../events/EventBus.js";
import { UserPreferenceModule } from "../prefs/PreferenceModule";
import TranscriptionErrorManager from "../error-management/TranscriptionErrorManager";
import { TranscriptMergeService } from "../TranscriptMergeService";

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
  | { type: "saypi:switchTarget"; targetElement: HTMLElement }
  | { type: "saypi:callReady" }
  | { type: "saypi:callFailed" }
  | { type: "saypi:visible" }
  | DictationAudioConnectedEvent
  | DictationSessionAssignedEvent;

interface DictationContext {
  transcriptions: Record<number, string>; // Global transcriptions for backwards compatibility
  transcriptionsByTarget: Record<string, Record<number, string>>; // Transcriptions grouped by target element ID
  isTranscribing: boolean;
  userIsSpeaking: boolean;
  timeUserStoppedSpeaking: number;
  sessionId?: string;
  targetElement?: HTMLElement; // The input field being dictated to
  accumulatedText: string; // Text accumulated during this dictation session
  transcriptionTargets: Record<number, HTMLElement>; // Map sequence numbers to their originating target elements
  provisionalTranscriptionTarget?: { sequenceNumber: number; element: HTMLElement }; // Provisional target before audio upload
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

function getTargetElementId(element: HTMLElement): string {
  // Generate a unique identifier for the target element
  if (element.id) {
    return element.id;
  }
  // Fallback: use a combination of tag name and attributes to create unique ID
  const tagName = element.tagName.toLowerCase();
  const className = element.className || '';
  const name = element.getAttribute('name') || '';
  const placeholder = element.getAttribute('placeholder') || '';
  return `${tagName}-${className}-${name}-${placeholder}`.replace(/\s+/g, '-');
}

function getTranscriptionsForTarget(context: DictationContext, targetElement: HTMLElement): Record<number, string> {
  const targetId = getTargetElementId(targetElement);
  return context.transcriptionsByTarget[targetId] || {};
}

const apiServerUrl = config.apiServerUrl;
if (apiServerUrl === undefined) {
  throw new Error(
    "Configuration error: apiServerUrl is not defined. Please check your environment variables."
  );
}

const userPreferences = UserPreferenceModule.getInstance();

let mergeService: TranscriptMergeService;
userPreferences.getLanguage().then((language) => {
  mergeService = new TranscriptMergeService(apiServerUrl, language);
});

let targetInputElement: HTMLElement | null = null;

// Helper function to get the target element
function getTargetElement(): HTMLElement | null {
  return targetInputElement;
}

// Helper function to set text in a specific target element
function setTextInTarget(text: string, targetElement?: HTMLElement, replaceAll: boolean = false) {
  const target = targetElement || getTargetElement();
  if (!target) return;

  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
    // For input and textarea elements
    if (replaceAll) {
      target.value = text;
    } else {
      const currentValue = target.value;
      const newValue = currentValue + text;
      target.value = newValue;
    }
    
    // Dispatch input event for framework compatibility
    target.dispatchEvent(new Event('input', { bubbles: true }));
  } else if (target.contentEditable === 'true') {
    // For contenteditable elements
    if (replaceAll) {
      target.textContent = text;
    } else {
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
    }
    
    // Dispatch input event for framework compatibility
    target.dispatchEvent(new Event('input', { bubbles: true }));
  }
}


const machine = createMachine<DictationContext, DictationEvent, DictationTypestate>(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QQJYGMAuBDDKD2AdgMSxYCeADigrHLPgQlrPVAZANoAMAuoqBTz1chfiAAeiAIxcpAJgB0AdgAscuSoBs2gBwBOOQFYANCDLS5AX0unUmHAwUoIAGzAlyVGtgBOGACLo2CIE3HxIIILCDGKSCFIqUkoKOppKcgYqhnqaCabm8TqKeoYAzFIVpVlcsjrWtkEOhAqwvrgEUB6U1GhYLi4ASmBYEGRhYlEoIbGIhkr5iHJSmgqGZfIqXGVKFXP1IHbBjq1YfigdXV6teBSB9iHjEZPTEXEJSSlpGRrZuSoLCFKmkMCk2miM6SSaxUen2hyaBBabXOnVI3QQvX6ADEsCg3BBHgIhFMYq9pKU9MlUulMr88mZELlFFJDOD5BSuKUlJo6jYDo0QkjTu1OuIThgwAosAAzCU+AAUMhqXAAlER4YKTmcOoTIsSXqA3psqV9aTl6QUVCpkmCfiodDolFwlIY4QLHC4UK0wAQUZdqNdbu7CLrnqTDdI1CaaT9zf8GfEuBoFDy5EUWVI9HpylY+RqPV6Jb6OgofGA0HgfKgLmirhgbncjiHeBN9eGJJHnZ8Y1k4wCpFyuKt9FxNFzNKPcm77gXvcWoKXy5XqwuCHgMABlCjDADWftr1AArrQfFjzl6ABaQLe7lGhtuiMnxCnR769v79wxGUElUqjmoDnoo7Tk2iKenOKKLhWVaQWum7blge41p4R4njeiF3i2TwPgQMwIC6ijOpyOicjCSayP2A4gnoRRFJyqjaIYvINDOzTgUWkFltBK4KMeYA+OhSGoihCB8QJ9YUNuECCZh4REtEj4RggZSlAopRFEoTpMS6QJSP2chAgoNFplwlIGF+3IgQiCjsT6nFLjBJZiTJyHos5ElSS5UAcFIcl6gpuFPipakaVpjplLklGpKCtEslwOilL8ShWYKtnzgoFYEAAbvxIpSmgaCHgAtoeLgOK5XgYD4WAELAaA+CgABGnBYfJJKKR2+FVEZSQJako6lAZ8YFKoijWpSsiGFw9oJclebBmBhZ2SWmU5dqC5YAVxWleVwnolVNV1Q1zU4niLV+WGHVGly3ZvnSw2IHoagprRpSDfamk6K682sYtEErYQa15ZthUlWVIr+ggB21fVTWQAAokVFAYGMrX+e1gVKQkN3UndfYJv1L1plalLckYzH8r9NlLelq25ZBIPbeDfpisEkoynK8pTTUar5mxNOQXT635aDO0iveAV4WkAIGeoRm-uo2jLFRKWzhxAPZfTJbQ0dTX7iJOuw81BJo5dmOdYNKxMUx2hKFm1qGA9CBpEOX4TdkahqFIqv8-9C5C3lhvHfr+3VTDx1gKd+ISxjeGW8ONtpPbLpO3bOgxcT2RTWs00+396v+4DWsLkHesVdQpfG4jyOoxdOFx3IVtfakSdPSnAIOkO9pplU6hJJy3s-aBCj8T4lawAoleR7i+JEKzODs7K-Hyn+PPqgtI8+GPPgT1PUfna2ktPppMtbMUv4VDySUqHnm-bxPRXoPDW+VnP4qL5zq+quvVOj+PCiPzQM-beMcDSdUdP2SkqksxlBqDsTkSxeR8jXBAOAYg+bmzNnhAAtOoAEJRQTrFljCHIShUi32cG4Q+scnxZGSFmLMwIyjvhdKfdSCgtjxRKAOB0jtb5ahFNQsBcRBwKCGolWoStUgy2WKsDIXxHTAmzKUW+aUURCPbHERuAI3p6A4fIp6WxNLciqKogWJYuLLnUdhI+Sk7b9hqNA166QvoGTMX7KCViSxwS8hoq6j05gvRdAkcEtROSUTSGIwaOgkgGW5DoLI7iC6eMcguZyCEhJ+PNm8OQ8wEwVASS9bIuis7yE0Ek5ahdNbrSyXhVQAImKqSTJSXq1p1JzRYsPNRGsgYMy2mDXatTj4fGtglAyVRnR4IJi6UE0TEiGAHLIN6FTaZF2FpXaxbVhEWDkACMmGcEpZh2CZDplNh5-x3kMrGmkQS4zmPbJY8UAT2mgaOIwVFyg5lORgu+-894z0gFczqUgiiqTuXbJ6jydB7JBUZN5pl5DvIpj8i5D8n4vx8ECt4oLbr3MhTIaFCZcjUTeSCyEZNynWEsEAA */
    context: {
      transcriptions: {},
      transcriptionsByTarget: {},
      isTranscribing: false,
      userIsSpeaking: false,
      timeUserStoppedSpeaking: 0,
      accumulatedText: "",
      transcriptionTargets: {},
      provisionalTranscriptionTarget: undefined,
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
                  {
                    type: "recordProvisionalTranscriptionTarget",
                  },
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
                        {
                          type: "confirmTranscriptionTarget",
                        },
                      ],
                    },
                    {
                      target: "notSpeaking",
                      cond: "hasNoAudio",
                      actions: [
                        {
                          type: "discardProvisionalTranscriptionTarget",
                        },
                      ],
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
            initial: "ready",
            states: {
              ready: {
                description: "Ready to process transcriptions, but no timeout yet.",
                on: {
                  "saypi:transcribed": {
                    target: "accumulating",
                    actions: {
                      type: "handleTranscriptionResponse",
                    },
                    description: "First transcription received. Start accumulating.",
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
              accumulating: {
                description: "Accumulating transcriptions and streaming to target field.",
                on: {
                  "saypi:transcribed": {
                    target: "accumulating",
                    actions: {
                      type: "handleTranscriptionResponse",
                    },
                    description: "Additional transcriptions received.",
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
                    target: "ready",
                    description: "Transcription failed, return to ready state",
                  },
                  "saypi:transcribedEmpty": {
                    target: "ready",
                    description: "Empty transcription, return to ready state",
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
      "saypi:switchTarget": {
        actions: "switchTargetElement",
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

        // Get transcriptions for the current target element only
        if (!context.targetElement) {
          console.warn('No target element set for transcription');
          return;
        }

        const targetTranscriptions = getTranscriptionsForTarget(context, context.targetElement);
        console.debug(`Sending ${Object.keys(targetTranscriptions).length} target-specific transcriptions as context for ${getTargetElementId(context.targetElement)}`);

        if (audioBlob) {
          uploadAudioWithRetry(
            audioBlob,
            event.duration,
            targetTranscriptions,
            context.sessionId,
            3, // default maxRetries
            event.captureTimestamp,
            event.clientReceiveTimestamp
          );
        }
      },

      recordProvisionalTranscriptionTarget: (
        context: DictationContext,
        event: any
      ) => {
        // Provisionally record which target element this transcription will originate from
        // We use +1 because the transcription request hasn't been sent yet
        const provisionalSequenceNum = getCurrentSequenceNumber() + 1;
        if (context.targetElement) {
          context.provisionalTranscriptionTarget = {
            sequenceNumber: provisionalSequenceNum,
            element: context.targetElement
          };
          console.debug(`Provisionally recorded transcription target for sequence ${provisionalSequenceNum}:`, context.targetElement);
        }
      },

      confirmTranscriptionTarget: (
        context: DictationContext,
        event: DictationSpeechStoppedEvent
      ) => {
        // Confirm the provisional target when audio upload starts
        // Now the sequence number should match what we provisionally recorded
        const currentSequenceNum = getCurrentSequenceNumber();
        
        if (context.provisionalTranscriptionTarget) {
          // Verify the sequence numbers match (they should if our timing is correct)
          if (context.provisionalTranscriptionTarget.sequenceNumber === currentSequenceNum) {
            context.transcriptionTargets[currentSequenceNum] = context.provisionalTranscriptionTarget.element;
            console.debug(`Confirmed transcription target for sequence ${currentSequenceNum}:`, context.provisionalTranscriptionTarget.element);
          } else {
            console.warn(`Sequence number mismatch: provisional ${context.provisionalTranscriptionTarget.sequenceNumber} vs current ${currentSequenceNum}`);
            // Use the provisional target anyway, but with the current sequence number
            context.transcriptionTargets[currentSequenceNum] = context.provisionalTranscriptionTarget.element;
          }
          
          // Clear the provisional target
          context.provisionalTranscriptionTarget = undefined;
        } else {
          // Fallback: record current target if no provisional target exists
          if (context.targetElement) {
            context.transcriptionTargets[currentSequenceNum] = context.targetElement;
            console.debug(`Fallback: recorded transcription target for sequence ${currentSequenceNum}:`, context.targetElement);
          }
        }
      },

      discardProvisionalTranscriptionTarget: (
        context: DictationContext,
        event: any
      ) => {
        // Discard provisional target on VAD misfire (user stopped speaking without audio)
        if (context.provisionalTranscriptionTarget) {
          console.debug(`Discarding provisional transcription target for sequence ${context.provisionalTranscriptionTarget.sequenceNumber} due to VAD misfire`);
          context.provisionalTranscriptionTarget = undefined;
        }
      },

      handleTranscriptionResponse: (
        context: DictationContext,
        event: DictationTranscribedEvent
      ) => {
        const transcription = event.text;
        const sequenceNumber = event.sequenceNumber;
        const mergedSequences = event.merged || [];
        
        console.debug(`Dictation transcript [${sequenceNumber}]: ${transcription}${mergedSequences.length > 0 ? ` (merged: [${mergedSequences.join(', ')}])` : ''}`);
        
        if (transcription && transcription.trim() !== "") {
          // Determine the target element for this sequence
          const originatingTarget = context.transcriptionTargets[sequenceNumber];
          
          if (!originatingTarget) {
            console.warn(`No originating target found for sequence ${sequenceNumber}, skipping transcription response`);
            return;
          }
          
          const targetId = getTargetElementId(originatingTarget);
          
          // Initialize target-specific transcriptions if not exists
          if (!context.transcriptionsByTarget[targetId]) {
            context.transcriptionsByTarget[targetId] = {};
          }
          
          // First, handle server-side merging if present
          if (mergedSequences.length > 0) {
            // Remove the sequences that were merged server-side from both global and target-specific storage
            mergedSequences.forEach((mergedSeq) => {
              delete context.transcriptions[mergedSeq];
              const mergedTarget = context.transcriptionTargets[mergedSeq];
              if (mergedTarget) {
                const mergedTargetId = getTargetElementId(mergedTarget);
                delete context.transcriptionsByTarget[mergedTargetId]?.[mergedSeq];
              }
            });
            console.debug(`Removed server-merged sequences [${mergedSequences.join(', ')}] from context`);
          }
          
          // Add the new (potentially merged) transcription to both global and target-specific storage
          context.transcriptions[sequenceNumber] = transcription;
          context.transcriptionsByTarget[targetId][sequenceNumber] = transcription;
          TranscriptionErrorManager.recordAttempt(true);
          
          // Get target-specific transcriptions for merging
          const targetTranscriptions = context.transcriptionsByTarget[targetId];
          let finalText: string;
          
          if (mergedSequences.length > 0) {
            // Server already merged - use the response text directly
            finalText = transcription;
            console.debug(`Using server-merged text directly for target ${targetId}: ${finalText}`);
          } else {
            // Merge transcripts for this target using local logic
            finalText = mergeService ? 
              mergeService.mergeTranscriptsLocal(targetTranscriptions) : 
              Object.values(targetTranscriptions).join(" ");
            
            console.debug(`Local merge result for target ${targetId} sequences [${Object.keys(targetTranscriptions).join(', ')}]: ${finalText}`);
          }
          
          // Replace all text in the target with the final result
          setTextInTarget(finalText, originatingTarget, true); // true = replace all content
          
          // Update accumulated text only if this is the current target
          if (originatingTarget === context.targetElement) {
            if (mergedSequences.length > 0) {
              // Rebuild accumulated text from remaining transcriptions for current target
              context.accumulatedText = Object.values(targetTranscriptions).join(" ");
            } else {
              context.accumulatedText = finalText;
            }
          }
        }
      },

      clearPendingTranscriptionsAction: () => {
        clearPendingTranscriptions();
      },

      clearTranscriptsAction: assign({
        transcriptions: () => ({}),
        transcriptionsByTarget: () => ({}),
        transcriptionTargets: () => ({}),
      }),

      resetDictationState: assign({
        transcriptions: () => ({}),
        transcriptionsByTarget: () => ({}),
        isTranscribing: false,
        userIsSpeaking: false,
        timeUserStoppedSpeaking: 0,
        targetElement: () => undefined,
        accumulatedText: "",
        transcriptionTargets: () => ({}),
        provisionalTranscriptionTarget: () => undefined,
      }),

      finalizeDictation: (context: DictationContext) => {
        // Generate final merged text from current target's transcriptions
        let finalText = context.accumulatedText;
        
        if (context.targetElement) {
          const targetTranscriptions = getTranscriptionsForTarget(context, context.targetElement);
          finalText = mergeService ? 
            mergeService.mergeTranscriptsLocal(targetTranscriptions) : 
            Object.values(targetTranscriptions).join(" ");
        }
        
        // Emit event that dictation is complete
        EventBus.emit("dictation:complete", {
          targetElement: context.targetElement,
          text: finalText,
        });
        
        console.log("Dictation completed for target:", context.targetElement, "with text:", finalText);
      },

      switchTargetElement: (context: DictationContext, event: any) => {
        // Update the module-level targetInputElement to point to the new target
        targetInputElement = event.targetElement;
        
        // Also update the context for consistency
        context.targetElement = event.targetElement;
        
        // Clear only global transcriptions, preserve target-specific mappings
        // This allows in-flight transcriptions to complete for their original targets
        context.transcriptions = {};
        context.accumulatedText = "";
        
        // NOTE: Do NOT clear transcriptionTargets, transcriptionsByTarget, or provisionalTranscriptionTarget here
        // In-flight transcriptions (both confirmed and provisional) need their target mappings preserved
        // These should only be cleared when the dictation session actually ends
        
        console.log("Dictation target element switched to:", event.targetElement);
        console.log("Cleared global transcriptions context, preserved target-specific mappings");
      },
    },
    services: {},
    guards: {
      hasAudio: (_, event: DictationEvent) => {
        if (event.type === "saypi:userStoppedSpeaking") {
          event = event as DictationSpeechStoppedEvent;
          return event.blob !== undefined && event.duration > 0;
        }
        return false;
      },
      hasNoAudio: (_, event: DictationEvent) => {
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