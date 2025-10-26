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
import { convertToWavBlob } from "../audio/AudioEncoder";
import { TextInsertionManager } from "../text-insertion/TextInsertionManager";
import { calculateDelay } from "../TimerModule";

/**
 * Normalizes ellipses and whitespace in transcription text.
 * Converts Unicode ellipsis (…) and triple dots (...) to spaces,
 * then collapses consecutive spaces/tabs into single spaces.
 */
function normalizeTranscriptionText(text: string): string {
  return text
    .replace(/\u2026/g, " ")      // "…" → space
    .replace(/\.{3}/g, " ")       // "..." → space
    .replace(/[ \t]{2,}/g, " ")   // collapse runs of spaces/tabs
    .trim();
}

export type DictationTranscribedEvent = {
  type: "saypi:transcribed";
  text: string;
  sequenceNumber: number;
  pFinishedSpeaking?: number;
  tempo?: number;
  merged?: number[];
};

export type DictationSpeechStoppedEvent = {
  type: "saypi:userStoppedSpeaking";
  duration: number;
  blob?: Blob;
  frames?: Float32Array;
  captureTimestamp?: number;
  clientReceiveTimestamp?: number;
  handlerTimestamp?: number;
};

export type DictationAudioConnectedEvent = {
  type: "saypi:audio:connected";
  deviceId: string;
  deviceLabel: string;
};

export type DictationSessionAssignedEvent = {
  type: "saypi:session:assigned";
  session_id: string;
};

type DictationStartEvent = {
  type: "saypi:startDictation";
  targetElement?: HTMLElement;
};

type DictationManualEditEvent = {
  type: "saypi:manualEdit";
  targetElement: HTMLElement;
  newContent: string;
  oldContent: string;
};

type DictationRefineTranscriptionEvent = {
  type: "saypi:refineTranscription";
  targetElement: HTMLElement;
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
  | DictationSessionAssignedEvent
  | DictationManualEditEvent
  | DictationRefineTranscriptionEvent;

interface AudioSegment {
  blob: Blob;
  frames: Float32Array;
  duration: number;
  sequenceNumber: number;
  captureTimestamp?: number;
}

interface DictationContext {
  transcriptions: Record<number, string>; // Global transcriptions for backwards compatibility
  transcriptionsByTarget: Record<string, Record<number, string>>; // Transcriptions grouped by target element ID
  initialTextByTarget: Record<string, string>; // Pre-existing text in each target when dictation started
  isTranscribing: boolean;
  userIsSpeaking: boolean;
  timeUserStoppedSpeaking: number;
  timeUserStartedSpeaking: number; // Track when current speech started
  timeLastTranscriptionReceived: number; // Track when last transcription was received (for endpoint timing)
  sessionId?: string;
  targetElement?: HTMLElement; // The input field being dictated to
  accumulatedText: string; // Text accumulated during this dictation session
  transcriptionTargets: Record<number, HTMLElement>; // Map sequence numbers to their originating target elements
  provisionalTranscriptionTarget?: { sequenceNumber: number; element: HTMLElement }; // Provisional target before audio upload
  /**
   * Chronological list of target switches that occurred while the user was speaking.
   * Each entry records the timestamp at which the switch happened (based on Date.now())
   * and the new active target that the user had focused at that instant.
   * This allows the recorder to later split the continuous audio buffer into
   * multiple segments – one for each target element.
   */
  targetSwitchesDuringSpeech?: { timestamp: number; target: HTMLElement }[];
  /**
   * The element that was active when the current speech segment started. Needed so
   * that we always know which target the very first portion of audio belongs to.
   */
  speechStartTarget?: HTMLElement;

  // Phase 2 audio buffering - grouped by target element ID
  audioSegmentsByTarget: Record<string, AudioSegment[]>;

  // Phase 2 state tracking - per target
  refinementPendingForTargets: Set<string>; // target IDs awaiting refinement
  activeRefinementSequences: Map<string, number>; // targetId -> sequence number
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
            refining: {};
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

/**
 * Smart join that doesn't add spaces when segments already start with whitespace
 */
/**
 * Smart join two text segments with appropriate spacing logic
 */
function smartJoinTwoTexts(firstText: string, secondText: string): string {
  if (!firstText) return secondText;
  if (!secondText) return firstText;
  
  // Check if we need to add a space between segments
  const firstEndsWithWhitespace = firstText.match(/\s$/);
  const secondStartsWithWhitespace = secondText.match(/^\s/);
  
  if (firstEndsWithWhitespace || secondStartsWithWhitespace) {
    // Don't add space if first text ends with whitespace OR second text starts with whitespace
    return firstText + secondText;
  } else {
    // Add space if neither condition is met
    return firstText + " " + secondText;
  }
}

function smartJoinTranscriptions(transcriptions: Record<number, string>): string {
  const sortedKeys = Object.keys(transcriptions)
    .map(Number)
    .sort((a, b) => a - b);
 

  let result = "";
  for (let i = 0; i < sortedKeys.length; i++) {
    const segment = transcriptions[sortedKeys[i]];
    
    if (i === 0) {
      // First segment - always add as-is
      result += segment;
    } else {
      // Check if we need to add a space between segments
      const previousSegmentEndsWithWhitespace = result.match(/\s$/);
      const currentSegmentStartsWithWhitespace = segment.match(/^\s/);
      
      if (previousSegmentEndsWithWhitespace || currentSegmentStartsWithWhitespace) {
        // Don't add space if previous segment ends with whitespace OR current segment starts with whitespace
        result += segment;
      } else {
        // Add space only if neither condition is met
        result += " " + segment;
      }
    }
  }
  
  return result;
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

/**
 * Extract contextual information about an input element for transcription API
 */
function getInputContext(element: HTMLElement): { inputType: string | null; inputLabel: string | null } {
  let inputType: string | null = null;
  let inputLabel: string | null = null;

  // Get input type
  if (element instanceof HTMLInputElement) {
    inputType = element.type || 'text';
  } else if (element instanceof HTMLTextAreaElement) {
    inputType = 'textarea';
  } else if (element.contentEditable === 'true') {
    inputType = 'contenteditable';
  }

  // Try to find associated label
  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) {
    // Method 1: Check for <label for="id"> where id matches element.id
    if (element.id) {
      const associatedLabel = document.querySelector(`label[for="${element.id}"]`);
      if (associatedLabel && associatedLabel.textContent) {
        inputLabel = associatedLabel.textContent.trim();
      }
    }

    // Method 2: Check if element is nested inside a <label>
    if (!inputLabel) {
      const parentLabel = element.closest('label');
      if (parentLabel && parentLabel.textContent) {
        // Extract label text, excluding the input's value
        const labelText = parentLabel.textContent.trim();
        const inputValue = element instanceof HTMLInputElement ? element.value : '';
        if (inputValue && labelText.includes(inputValue)) {
          inputLabel = labelText.replace(inputValue, '').trim();
        } else {
          inputLabel = labelText;
        }
      }
    }

    // Method 3: Check aria-label attribute
    if (!inputLabel) {
      const ariaLabel = element.getAttribute('aria-label');
      if (ariaLabel) {
        inputLabel = ariaLabel.trim();
      }
    }

    // Method 4: Check aria-labelledby attribute
    if (!inputLabel) {
      const ariaLabelledBy = element.getAttribute('aria-labelledby');
      if (ariaLabelledBy) {
        const labelElement = document.getElementById(ariaLabelledBy);
        if (labelElement && labelElement.textContent) {
          inputLabel = labelElement.textContent.trim();
        }
      }
    }

    // Method 5: Check title attribute
    if (!inputLabel) {
      const title = element.getAttribute('title');
      if (title) {
        inputLabel = title.trim();
      }
    }

    // Method 6: Check placeholder as fallback (less ideal but still contextual)
    if (!inputLabel) {
      const placeholder = element.getAttribute('placeholder');
      if (placeholder) {
        inputLabel = placeholder.trim();
      }
    }

    // Method 7: Look for nearby text that might be a label (within same container)
    if (!inputLabel) {
      const container = element.parentElement;
      if (container) {
        // Look for text nodes or elements that might serve as labels
        const textNodes: string[] = [];
        
        // Check for preceding text elements
        let prevSibling = element.previousElementSibling;
        while (prevSibling && textNodes.length < 2) {
          if (prevSibling.textContent && prevSibling.textContent.trim()) {
            const text = prevSibling.textContent.trim();
            // Skip if it looks like another input's value or common UI text
            if (text.length > 0 && text.length < 100 && !text.match(/^(submit|send|search|go|ok)$/i)) {
              textNodes.unshift(text);
            }
          }
          prevSibling = prevSibling.previousElementSibling;
        }
        
        if (textNodes.length > 0) {
          inputLabel = textNodes.join(' ').trim();
        }
      }
    }
  }

  return { inputType, inputLabel };
}

function getTranscriptionsForTarget(context: DictationContext, targetElement: HTMLElement): Record<number, string> {
  const targetId = getTargetElementId(targetElement);
  return context.transcriptionsByTarget[targetId] || {};
}

function mapTargetForSequence(
  context: DictationContext,
  expectedSequenceNumber: number,
  defaultTarget: HTMLElement
): HTMLElement {
  let finalTarget = defaultTarget;

  if (context.provisionalTranscriptionTarget) {
    const provisional = context.provisionalTranscriptionTarget;
    if (provisional.sequenceNumber === expectedSequenceNumber) {
      finalTarget = provisional.element;
      console.debug(
        `Confirmed provisional transcription target for sequence ${expectedSequenceNumber}:`,
        provisional.element
      );
    } else {
      console.warn(
        `Sequence number mismatch: provisional ${provisional.sequenceNumber} vs expected ${expectedSequenceNumber}`
      );
      finalTarget = provisional.element;
    }
    // Clear the provisional reference once handled
    context.provisionalTranscriptionTarget = undefined;
  }

  context.transcriptionTargets[expectedSequenceNumber] = finalTarget;
  return finalTarget;
}

// Maximum audio buffer length per target in milliseconds (120 seconds = 2 minutes)
// This prevents unbounded memory growth if user leaves hot-mic on
const MAX_AUDIO_BUFFER_DURATION_MS = 120000;

// Maximum delay for refinement endpoint detection (5 seconds)
// Shorter than ConversationMachine's 7s to account for faster p50 transcription time (~2s)
const REFINEMENT_MAX_DELAY_MS = 5000;

/**
 * Store an audio segment in the context for later refinement.
 * Buffers accumulate the full dictation session up to MAX_AUDIO_BUFFER_DURATION_MS
 * to provide maximum context for Phase 2 refinement.
 *
 * @param context - The dictation context
 * @param targetElement - The target element this audio belongs to
 * @param blob - The audio blob
 * @param frames - The raw audio frames (Float32Array)
 * @param duration - Duration in milliseconds
 * @param sequenceNumber - Sequence number of this segment
 * @param captureTimestamp - When the audio was captured
 */
function storeAudioSegment(
  context: DictationContext,
  targetElement: HTMLElement,
  blob: Blob,
  frames: Float32Array,
  duration: number,
  sequenceNumber: number,
  captureTimestamp?: number
): void {
  const targetId = getTargetElementId(targetElement);

  // Initialize array for this target if it doesn't exist
  if (!context.audioSegmentsByTarget[targetId]) {
    context.audioSegmentsByTarget[targetId] = [];
  }

  const segments = context.audioSegmentsByTarget[targetId];

  // Calculate total duration including the new segment
  const currentTotalDuration = segments.reduce((sum, seg) => sum + seg.duration, 0);
  const newTotalDuration = currentTotalDuration + duration;

  // If adding this segment would exceed the max buffer duration, trim old segments
  if (newTotalDuration > MAX_AUDIO_BUFFER_DURATION_MS) {
    let excessDuration = newTotalDuration - MAX_AUDIO_BUFFER_DURATION_MS;
    let segmentsToRemove = 0;

    // Remove oldest segments until we're under the limit
    for (let i = 0; i < segments.length && excessDuration > 0; i++) {
      excessDuration -= segments[i].duration;
      segmentsToRemove++;
    }

    if (segmentsToRemove > 0) {
      const removed = segments.splice(0, segmentsToRemove);
      console.debug(
        `Trimmed ${segmentsToRemove} old audio segments for target ${targetId} to stay under ${MAX_AUDIO_BUFFER_DURATION_MS}ms limit. ` +
        `Removed ${removed.reduce((sum, seg) => sum + seg.duration, 0)}ms of audio.`
      );
    }
  }

  // Store the new segment
  segments.push({
    blob,
    frames,
    duration,
    sequenceNumber,
    captureTimestamp,
  });

  // Mark this target as pending refinement
  context.refinementPendingForTargets.add(targetId);

  const totalDuration = segments.reduce((sum, seg) => sum + seg.duration, 0);
  console.debug(
    `Stored audio segment ${sequenceNumber} for target ${targetId}. Total: ${segments.length} segments, ${(totalDuration / 1000).toFixed(1)}s of audio`
  );
}

/**
 * Clear audio buffers for a specific target element.
 * @param context - The dictation context
 * @param targetId - The target element ID to clear buffers for
 */
function clearAudioForTarget(context: DictationContext, targetId: string): void {
  delete context.audioSegmentsByTarget[targetId];
  context.refinementPendingForTargets.delete(targetId);
  context.activeRefinementSequences.delete(targetId);
  console.debug(`Cleared audio buffers for target ${targetId}`);
}

/**
 * Clear all audio buffers.
 * @param context - The dictation context
 */
function clearAllAudioBuffers(context: DictationContext): void {
  context.audioSegmentsByTarget = {};
  context.refinementPendingForTargets.clear();
  context.activeRefinementSequences.clear();
  console.debug('Cleared all audio buffers');
}

/**
 * Common helper for preparing and uploading an audio segment.
 */
function uploadAudioSegment(
  context: DictationContext,
  audioBlob: Blob,
  duration: number,
  targetElement: HTMLElement,
  sessionId?: string,
  maxRetries: number = 3,
  captureTimestamp?: number,
  clientReceiveTimestamp?: number,
  frames?: Float32Array
) {
  const expectedSequenceNumber = getCurrentSequenceNumber() + 1;
  const finalTarget = mapTargetForSequence(
    context,
    expectedSequenceNumber,
    targetElement
  );

  const targetTranscriptions = getTranscriptionsForTarget(
    context,
    finalTarget
  );
  console.debug(
    `Sending ${Object.keys(targetTranscriptions).length} target-specific transcriptions as context for ${getTargetElementId(
      finalTarget
    )}`
  );

  // Extract input context for dictation mode
  const { inputType, inputLabel } = getInputContext(finalTarget);
  console.debug(`Input context for transcription: type="${inputType}", label="${inputLabel}"`);

  // Store audio segment for Phase 2 refinement if frames are available
  if (frames) {
    storeAudioSegment(
      context,
      finalTarget,
      audioBlob,
      frames,
      duration,
      expectedSequenceNumber,
      captureTimestamp
    );
  }

  uploadAudioWithRetry(
    audioBlob,
    duration,
    targetTranscriptions,
    sessionId,
    maxRetries,
    captureTimestamp,
    clientReceiveTimestamp,
    inputType || undefined,
    inputLabel || undefined
  ).then((sequenceNum) => {
    console.debug(`Sent transcription ${sequenceNum} to target`, finalTarget);
    if (sequenceNum !== expectedSequenceNumber) {
      console.warn(
        `Sequence number mismatch: expected ${expectedSequenceNumber} but got ${sequenceNum}`
      );
    }
  });
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

// Helper function to position cursor at the end of contentEditable element
function positionCursorAtEnd(element: HTMLElement): void {
  const selection = window.getSelection();
  if (!selection) return;
  
  // Create a range that selects the end of the element's content
  const range = document.createRange();
  
  // Move to the end of the element's content
  if (element.childNodes.length > 0) {
    // If there are child nodes, position after the last one
    const lastNode = element.childNodes[element.childNodes.length - 1];
    if (lastNode.nodeType === Node.TEXT_NODE) {
      // If last node is text, position at the end of that text
      range.setStart(lastNode, lastNode.textContent?.length || 0);
      range.setEnd(lastNode, lastNode.textContent?.length || 0);
    } else {
      // If last node is not text, position after it
      range.setStartAfter(lastNode);
      range.setEndAfter(lastNode);
    }
  } else {
    // If no child nodes, position inside the element
    range.setStart(element, 0);
    range.setEnd(element, 0);
  }
  
  // Apply the range to the selection
  selection.removeAllRanges();
  selection.addRange(range);
}

// Text insertion strategies are now imported from the shared module
// Use TextInsertionManager for consistent text insertion across the app

// Create a singleton instance of the text insertion manager
const textInsertionManager = TextInsertionManager.getInstance();

// Helper function to set text in a specific target element
function setTextInTarget(text: string, targetElement?: HTMLElement, replaceAll: boolean = false) {
  const target = targetElement || getTargetElement();
  if (!target) return;

  

  // Helper to emit our content-updated event consistently
  const emitContentUpdated = (content: string) => {
    EventBus.emit("dictation:contentUpdated", {
      targetElement: target,
      content,
      source: "dictation",
    });
  };

  // Mark this element as being updated programmatically by dictation.
  // Input listeners can use this to avoid treating these changes as manual edits.
  try {
    (target as any).__dictationUpdateInProgress = true;
  } catch (_) {
    // ignore if property cannot be set
  }

  // Get the appropriate strategy for this target element using the shared TextInsertionManager
  const success = textInsertionManager.insertText(target, text, replaceAll);
  
  if (success) {
    
    // Check what actually ended up in the target after insertion
    const finalValue = (target as any).value || (target as any).textContent || (target as any).innerText || '';
    
    
    emitContentUpdated(text);
    // Clear the programmatic update flag on the next tick
    setTimeout(() => {
      try {
        delete (target as any).__dictationUpdateInProgress;
      } catch (_) {
        /* no-op */
      }
    }, 0);
  } else {
    // Fallback: directly set value/textContent if no strategy is available
    if ((target as any).value !== undefined) {
      (target as any).value = text;
    } else if ((target as any).textContent !== undefined) {
      (target as any).textContent = text;
    }
    emitContentUpdated(text);
    // Clear the programmatic update flag on the next tick
    setTimeout(() => {
      try {
        delete (target as any).__dictationUpdateInProgress;
      } catch (_) {
        /* no-op */
      }
    }, 0);
  }
}

/**
 * Retrieve the current textual content from a target element.
 *
 * - For <input> and <textarea> elements, returns the `.value` property.
 * - For `contenteditable` elements, returns the `textContent`.
 * - Returns an empty string if the element is undefined or not a supported type.
 */
function getTextInTarget(targetElement?: HTMLElement): string {
  if (!targetElement) return "";

  if (
    targetElement instanceof HTMLInputElement ||
    targetElement instanceof HTMLTextAreaElement
  ) {
    return targetElement.value || "";
  }

  if (targetElement.contentEditable === "true") {
    // For contenteditable elements, convert <br> tags back to \n characters
    // so the system can work with logical newlines consistently (same logic as UniversalDictationModule.getElementContent)
    const innerHTML = targetElement.innerHTML || '';
    
    // Handle contenteditable paragraph spacing quirk BEFORE general br conversion:
    // When user presses Enter once, browser creates <br><br> as temporary paragraph spacing
    // This should be normalized to a single newline since the second <br> gets replaced 
    // when user continues typing (it's just a placeholder)
    let normalizedHTML = innerHTML
      .replace(/<br\s*\/?>\s*<br\s*\/?>/gi, '\n'); // Convert <br><br> pairs to single \n
    
    // Convert remaining single <br> tags to \n (these represent intentional single line breaks)
    let contentWithNewlines = normalizedHTML
      .replace(/<br\s*\/?>/gi, '\n')  // Match remaining <br>, <br/>, <br />
      .replace(/<div>/gi, '\n')       // <div> elements often represent line breaks too
      .replace(/<\/div>/gi, '')       // Remove closing div tags
      .replace(/<[^>]*>/g, '')        // Remove any other HTML tags
      .replace(/&nbsp;/g, ' ')        // Convert non-breaking spaces
      .replace(/&lt;/g, '<')          // Decode common HTML entities
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&');       // Decode & last to avoid double-decoding
    
    return contentWithNewlines;
  }

  return "";
}

/**
 * Ensure the per-target transcription bucket exists and return it.
 */
function getOrCreateTargetBucket(
  context: DictationContext,
  targetId: string
): Record<number, string> {
  if (!context.transcriptionsByTarget[targetId]) {
    context.transcriptionsByTarget[targetId] = {};
  }
  return context.transcriptionsByTarget[targetId];
}

/**
 * Remove sequences that the server indicates were merged.
 */
function removeMergedSequencesFromContext(
  context: DictationContext,
  mergedSequences: number[]
) {
  if (mergedSequences.length === 0) return;

  mergedSequences.forEach((seq) => {
    delete context.transcriptions[seq];
    const mergedTarget = context.transcriptionTargets[seq];
    if (mergedTarget) {
      const mergedTargetId = getTargetElementId(mergedTarget);
      delete context.transcriptionsByTarget[mergedTargetId]?.[seq];
    }
  });

  console.debug(
    `Removed server-merged sequences [${mergedSequences.join(", ")}] from context`
  );
}

/**
 * Update transcriptionsByTarget based on manual edits to preserve user changes.
 * This function tries to match the new content against existing transcriptions
 * and updates the transcription records to reflect the manual changes.
 */
function updateTranscriptionsForManualEdit(
  context: DictationContext,
  targetElement: HTMLElement,
  newContent: string,
  oldContent: string
): void {
  const targetId = getTargetElementId(targetElement);
  const targetTranscriptions = context.transcriptionsByTarget[targetId];
  
  if (!targetTranscriptions || Object.keys(targetTranscriptions).length === 0) {
    console.debug("No transcriptions found for manually edited target:", targetId);
    return;
  }

  // Get the current merged content from transcriptions
  const currentTranscribedContent = smartJoinTranscriptions(targetTranscriptions);
  
  // Only proceed if the old content matches what we expect from transcriptions
  // This ensures we're updating the right content
  if (oldContent !== currentTranscribedContent) {
    console.debug("Old content doesn't match transcribed content, skipping update", {
      oldContent,
      currentTranscribedContent,
      targetId
    });
    return;
  }

  // If the user cleared the content, delete the associated transcription(s)
  if (newContent.trim() === "") {
    const transcriptionKeys = Object.keys(targetTranscriptions).map(k => parseInt(k, 10));

    if (transcriptionKeys.length === 1) {
      // Only one sequence – remove it completely
      const seq = transcriptionKeys[0];
      delete targetTranscriptions[seq];
      delete context.transcriptions[seq];
    } else if (transcriptionKeys.length > 1) {
      // Multiple sequences – assume the user cleared the *last* chunk
      const sortedKeys = transcriptionKeys.sort((a, b) => a - b);
      const lastKey = sortedKeys[sortedKeys.length - 1];
      delete targetTranscriptions[lastKey];
      delete context.transcriptions[lastKey];
    }

    // If the bucket is now empty, remove it for neatness
    if (Object.keys(targetTranscriptions).length === 0) {
      delete context.transcriptionsByTarget[targetId];
    }

    console.debug("Cleared transcription entry due to manual deletion for target:", targetId);
    return;
  }

  // Simple approach: if we have exactly one transcription, replace it entirely
  const transcriptionKeys = Object.keys(targetTranscriptions).map(k => parseInt(k, 10));
  
  if (transcriptionKeys.length === 1) {
    // Single transcription - replace it entirely
    const sequenceNumber = transcriptionKeys[0];
    targetTranscriptions[sequenceNumber] = newContent;
    console.debug(`Updated single transcription [${sequenceNumber}] for target ${targetId}:`, {
      from: oldContent,
      to: newContent
    });
  } else if (transcriptionKeys.length > 1) {
    // Multiple transcriptions - try to map changes to the last transcription
    // This is a simple heuristic: assume the edit was made to the most recent part
    const sortedKeys = transcriptionKeys.sort((a, b) => a - b);
    const lastKey = sortedKeys[sortedKeys.length - 1];
    
    // Calculate what the content would be without the last transcription
    const transcriptionsWithoutLast: Record<number, string> = {};
    sortedKeys.slice(0, -1).forEach(key => {
      transcriptionsWithoutLast[key] = targetTranscriptions[key];
    });
    const contentWithoutLast = smartJoinTranscriptions(transcriptionsWithoutLast);
    
    // If newContent starts with contentWithoutLast, update the last transcription
    if (newContent.startsWith(contentWithoutLast)) {
      let remainder = newContent.substring(contentWithoutLast.length);
      
      
      
      // Handle spacing: if remainder starts with a single space (from automatic joining),
      // but now contains special formatting like newlines, preserve the formatting.
      // Otherwise, trim leading/trailing spaces as before for normal text edits.
      if (remainder.startsWith(" ") && remainder.includes("\n")) {
        // Contains newlines - this is likely formatting, so preserve leading space-to-newline transitions
        const beforeTrim = remainder;
        remainder = remainder.substring(1); // Remove the single joining space
        
      } else if (remainder.startsWith(" ") && !remainder.includes("\n")) {
        // Normal text edit - trim leading space from joining
        const beforeTrim = remainder;
        remainder = remainder.substring(1);
        
      }
      // Note: We preserve other whitespace like tabs, multiple spaces, trailing spaces
      
      if (remainder !== "") {
        targetTranscriptions[lastKey] = remainder;
        
      }
    } else {
      // Content changed significantly - replace the last transcription with the entire new content
      // and clear all other transcriptions
      sortedKeys.slice(0, -1).forEach(key => {
        delete targetTranscriptions[key];
        delete context.transcriptions[key];
      });
      targetTranscriptions[lastKey] = newContent;
      console.debug(`Replaced all transcriptions with single updated transcription [${lastKey}] for target ${targetId}:`, {
        to: newContent
      });
    }
  }

  // Also update the global transcriptions for backward compatibility
  Object.keys(targetTranscriptions).forEach(key => {
    const sequenceNumber = parseInt(key, 10);
    context.transcriptions[sequenceNumber] = targetTranscriptions[sequenceNumber];
  });
}

/**
 * Produce the final merged text for a target, preferring server-merged text when available.
 */
function computeFinalText(
  targetTranscriptions: Record<number, string>,
  mergedSequences: number[],
  serverText: string,
  initialText: string = "",
  isUsingStoredInitialText: boolean = false
): string {
  if (mergedSequences.length > 0) {
    console.debug("Using server-merged text directly.");

    // Create a copy of target transcriptions, removing the merged sequences
    // The server-merged content is already in targetTranscriptions at the correct sequence number
    const workingTranscriptions = { ...targetTranscriptions };
    
    // Remove the sequences that were merged by the server
    mergedSequences.forEach(seq => {
      delete workingTranscriptions[seq];
    });
    
    // Now merge all remaining transcriptions in sequence order using the same logic as local merge
    const finalMergedText = mergeService
      ? mergeService.mergeTranscriptsLocal(workingTranscriptions)
      : smartJoinTranscriptions(workingTranscriptions);
    
    return finalMergedText.trim();
  }
  // Local merge
  const mergedTranscript = mergeService
    ? mergeService.mergeTranscriptsLocal(targetTranscriptions)
    : smartJoinTranscriptions(targetTranscriptions);

  // Check if we're dealing with manually edited content that should be preserved
  // First check: exact match or the merged transcript contains the initial text
  const exactOrContainsMatch = initialText && (mergedTranscript === initialText || mergedTranscript.includes(initialText.trim()));
  
  // Second check: if initialText is much longer than expected from just merging transcriptions,
  // it likely contains manual edits (especially newlines or repeated content)
  const transcriptionCount = Object.keys(targetTranscriptions).length;
  const expectedApproximateLength = Object.values(targetTranscriptions).join(' ').length;
  const actualLength = initialText?.length || 0;
  const hasSignificantLengthDifference = actualLength > expectedApproximateLength * 1.2; // 20% tolerance
  
  // Third check: contains newlines which are often from manual edits
  // But exclude newlines that are from pre-existing text (not actual manual edits)
  const hasNewlines = initialText?.includes('\n') && !isUsingStoredInitialText;
  
  // Fourth check: if there's only one transcription and it matches the entire initial text,
  // this likely means a significant manual edit consolidated everything
  const singleTranscriptionMatches = transcriptionCount === 1 && 
    initialText && Object.values(targetTranscriptions)[0] === initialText;
  
  
  
  // If any of these conditions indicate manual edits, handle appropriately
  if (exactOrContainsMatch || hasSignificantLengthDifference || hasNewlines || singleTranscriptionMatches) {
    
    
    // If the merged transcript already contains the initial text, don't combine again
    if (exactOrContainsMatch) {
      
      return mergedTranscript;
    } else {
      // For other manual edit cases, combine initial text with merged transcript
      const combinedManualEditResult = smartJoinTwoTexts(initialText, mergedTranscript);
      
      return combinedManualEditResult;
    }
  }

  // Only proceed with regex stripping if we're confident this is not manually edited content
  
  
  for (const mergedText of Object.values(targetTranscriptions)) {
    const escaped = mergedText.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    const regex = new RegExp(`\\s*${escaped}\\s*`, "g");
    const beforeReplace = initialText;
    initialText = initialText.replace(regex, " ");
    
    
  }
  
  

  // Tidy whitespace
  const beforeWhitespaceTidy = initialText;
  initialText = initialText
    .replace(/[ \t]{2,}/g, " ")   // collapse only spaces/tabs, keep newlines
    .replace(/[ \t]+$/, "");      // trim trailing spaces/tabs but keep final newline
  
  
  
  const normalisedMerged = mergedTranscript.trimStart();
  

  const needsSpace = initialText !== "" && !initialText.endsWith(" ") && !initialText.endsWith("\n");
  const result = (needsSpace ? initialText + " " : initialText) + normalisedMerged;
  const finalResult = result.replace(/[ \t]{2,}/g, " ");
  
  
  
  return finalResult;
}

const machine = createMachine<DictationContext, DictationEvent, DictationTypestate>(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QQJYGMAuBDDKD2AdgMSxYCeADigrHLPgQlrPVAZANoAMAuoqBTz1chfiAAeiAIxcpAJgB0AdgAscuSoBs2gBwBOOQFYANCDLS5AX0unUmHAwUoIAGzAlyVGtgBOGACLo2CIE3HxIIILCDGKSCFIqUkoKOppKcgYqhnqaCabm8TqKeoYAzFIVpVlcsjrWtkEOhAqwvrgEUB6U1GhYLi4ASmBYEGRhYlEoIbGIhkr5iHJSmgqGZfIqXGVKFXP1IHbBjq1YfigdXV6teBSB9iHjEZPTEXEJSSlpGRrZuSoLCFKmkMCk2miM6SSaxUen2hyaBBabXOnVI3QQvX6ADEsCg3BBHgIhFMYq9pKU9MlUulMr88mZELlFFJDOD5BSuKUlJo6jYDo0QkjTu1OuIThgwAosAAzCU+AAUMhqXAAlER4YKTmcOoTIsSXqA3psqV9aTl6QUVCpkmCfiodDolFwlIY4QLHC4UK0wAQUZdqNdbu7CLrnqTDdI1CaaT9zf8GfEuBoFDy5EUWVI9HpylY+RqPV6Jb6OgofGA0HgfKgLmirhgbncjiHeBN9eGJJHnZ8Y1k4wCpFyuKt9FxNFzNKPcm77gXvcWoKXy5XqwuCHgMABlCjDADWftr1AArrQfFjzl6ABaQLe7lGhtuiMnxCnR769v79wxGUElUqjmoDnoo7Tk2iKenOKKLhWVaQWum7blge41p4R4njeiF3i2TwPgQMwIC6ijOpyOicjCSayP2A4gnoRRFJyqjaIYvINDOzTgUWkFltBK4KMeYA+OhSGoihCB8QJ9YUNuECCZh4REtEj4RggZSlAopRFEoTpMS6QJSP2chAgoNFplwlIGF+3IgQiCjsT6nFLjBJZiTJyHos5ElSS5UAcFIcl6gpuFPipakaVpjplLklGpKCtEslwOilL8ShWYKtnzgoFYEAAbvxIpSmgaCHgAtoeLgOK5XgYD4WAELAaA+CgABGnBYfJJKKR2+FVEZSQJako6lAZ8YFKoijWpSsiGFw9oJclebBmBhZ2SWmU5dqC5YAVxWleVwnolVNV1Q1zU4niLV+WGHVGly3ZvnSw2IHoagprRpSDfamk6K682sYtEErYQa15ZthUlWVIr+ggB21fVTWQAAokVFAYGMrX+e1gVKQkN3UndfYJv1L1plalLckYzH8r9NlLelq25ZBIPbeDfpisEkoynK8pTTUar5mxNOQXT635aDO0iveAV4WkAIGeoRm-uo2jLFRKWzhxAPZfTJbQ0dTX7iJOuw81BJo5dmOdYNKxMUx2hKFm1qGA9CBpEOX4TdkahqFIqv8-9C5C3lhvHfr+3VTDx1gKd+ISxjeGW8ONtpPbLpO3bOgxcT2RTWs00+396v+4DWsLkHesVdQpfG4jyOoxdOFx3IVtfakSdPSnAIOkO9pplU6hJJy3s-aBCj8T4lawAoleR7i+JEKzODs7K-Hyn+PPqgtI8+GPPgT1PUfna2ktPppMtbMUv4VDySUqHnm-bxPRXoPDW+VnP4qL5zq+quvVOj+PCiPzQM-beMcDSdUdP2SkqksxlBqDsTkSxeR8jXBAOAYg+bmzNnhAAtOoAEJRQTrFljCHIShUi32cG4Q+scnxZGSFmLMwIyjvhdKfdSCgtjxRKAOB0jtb5ahFNQsBcRBwKCGolWoStUgy2WKsDIXxHTAmzKUW+aUURCPbHERuAI3p6A4fIp6WxNLciqKogWJYuLLnUdhI+Sk7b9hqNA166QvoGTMX7KCViSxwS8hoq6j05gvRdAkcEtROSUTSGIwaOgkgGW5DoLI7iC6eMcguZyCEhJ+PNm8OQ8wEwVASS9bIuis7yE0Ek5ahdNbrSyXhVQAImKqSTJSXq1p1JzRYsPNRGsgYMy2mDXatTj4fGtglAyVRnR4IJi6UE0TEiGAHLIN6FTaZF2FpXaxbVhEWDkACMmGcEpZh2CZDplNh5-x3kMrGmkQS4zmPbJY8UAT2mgaOIwVFyg5lORgu+-894z0gFczqUgiiqTuXbJ6jydB7JBUZN5pl5DvIpj8i5D8n4vx8ECt4oLbr3MhTIaFCZcjUTeSCyEZNynWEsEAA */
    context: {
      transcriptions: {},
      transcriptionsByTarget: {},
      initialTextByTarget: {},
      isTranscribing: false,
      userIsSpeaking: false,
      timeUserStoppedSpeaking: 0,
      timeUserStartedSpeaking: 0,
      timeLastTranscriptionReceived: 0,
      accumulatedText: "",
      transcriptionTargets: {},
      provisionalTranscriptionTarget: undefined,
      targetSwitchesDuringSpeech: undefined,
      speechStartTarget: undefined,
      audioSegmentsByTarget: {},
      refinementPendingForTargets: new Set<string>(),
      activeRefinementSequences: new Map<string, number>(),
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
                initialTextByTarget: (context, event: DictationStartEvent) => {
                  if (event.targetElement) {
                    const targetId = getTargetElementId(event.targetElement);
                    const initialText = getTextInTarget(event.targetElement);
                    
                    // For contenteditable elements, distinguish between DOM formatting whitespace vs user-entered content
                    let cleanedInitialText = initialText;
                    if (event.targetElement.contentEditable === "true" && initialText.trim() === "") {
                      // Check if this is just DOM formatting whitespace (spaces, tabs, newlines without <br> tags)
                      // vs user-entered whitespace (which would contain <br> tags or other HTML)
                      const innerHTML = event.targetElement.innerHTML || '';
                      const hasUserEnteredContent = innerHTML.includes('<br') || innerHTML.includes('<div') || innerHTML.includes('&nbsp;');
                      
                      if (!hasUserEnteredContent) {
                        // This is just DOM formatting whitespace, treat as empty
                        cleanedInitialText = "";
                      }
                      // Otherwise preserve the whitespace as it represents user-entered content
                    }
                      
                    const updated = { ...context.initialTextByTarget };
                    updated[targetId] = cleanedInitialText;
                    console.log(`Captured initial text for target ${targetId} on start:`, JSON.stringify(cleanedInitialText));
                    return updated;
                  }
                  return context.initialTextByTarget;
                },
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
                    timeUserStoppedSpeaking: 0,
                    timeUserStartedSpeaking: () => Date.now(),
                    speechStartTarget: (context) => context.targetElement,
                  }),
                  {
                    type: "recordProvisionalTranscriptionTarget",
                  },
                ],
                exit: [
                  assign({ userIsSpeaking: false }),
                ],
                on: {
                  "saypi:switchTarget": {
                    actions: [
                      {
                        type: "recordTargetSwitchDuringSpeech",
                      },
                      {
                        type: "switchTargetElement",
                      },
                    ],
                    description: "Record target switch timing during speech and switch target",
                  },
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
                          type: "handleAudioStopped",
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
                        {
                          type: "clearTargetSwitchInfo",
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
                after: {
                  refinementDelay: {
                    target: "refining",
                    cond: "refinementConditionsMet",
                    description: "Trigger refinement after endpoint detected",
                  },
                },
                on: {
                  "saypi:transcribed": {
                    target: "accumulating",
                    actions: {
                      type: "handleTranscriptionResponse",
                    },
                    description: "Additional transcriptions received.",
                  },
                  "saypi:refineTranscription": {
                    target: "refining",
                    description: "Explicit refinement request (e.g., from field blur)",
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
              refining: {
                description: "Performing contextual refinement with full audio context.",
                entry: [
                  {
                    type: "performContextualRefinement",
                  },
                ],
                on: {
                  "saypi:transcribed": {
                    target: "accumulating",
                    actions: {
                      type: "handleTranscriptionResponse",
                    },
                    description: "Refinement transcription received.",
                  },
                  "saypi:transcribeFailed": {
                    target: "accumulating",
                    description: "Refinement failed, continue with Phase 1 text",
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
                target: "#dictation.listening.recording.notSpeaking",
                description: "Return to listening after showing error briefly.",
              },
            },
          },
          micError: {
            description: "Microphone error or no audio input detected",
            after: {
              "3000": {
                target: "#dictation.listening.recording.notSpeaking",
                description: "Return to listening after showing error briefly.",
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
      "saypi:manualEdit": {
        target: "idle",
        actions: "handleManualEdit",
        description: "Manual edit detected - terminate dictation for predictable behavior"
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
        // Update the timestamp for endpoint detection
        context.timeLastTranscriptionReceived = Date.now();

        let transcription = event.text;
        const sequenceNumber = event.sequenceNumber;
        const mergedSequences = event.merged || [];

        // Check if this is a refinement response
        let isRefinement = false;
        let refinedTargetId: string | undefined;

        for (const [targetId, refinementSeq] of context.activeRefinementSequences.entries()) {
          if (refinementSeq === sequenceNumber) {
            isRefinement = true;
            refinedTargetId = targetId;
            break;
          }
        }

        if (isRefinement && refinedTargetId) {
          console.debug(
            `[DictationMachine] Received refinement transcription [${sequenceNumber}] for target ${refinedTargetId}: ${transcription}`
          );

          // Get the target element from the ID
          const targetElement = context.transcriptionTargets[sequenceNumber];
          if (!targetElement) {
            console.warn(`[DictationMachine] No target element found for refinement sequence ${sequenceNumber}`);
            // Clean up
            context.activeRefinementSequences.delete(refinedTargetId);
            clearAudioForTarget(context, refinedTargetId);
            return;
          }

          // Normalize the refined transcription
          transcription = normalizeTranscriptionText(transcription);

          // Replace all Phase 1 transcriptions for this target with the refined result
          const targetTranscriptions = context.transcriptionsByTarget[refinedTargetId] || {};

          // Clear old interim transcriptions from both global and target-specific storage
          Object.keys(targetTranscriptions).forEach(key => {
            const seq = parseInt(key, 10);
            delete context.transcriptions[seq];
            delete context.transcriptionTargets[seq]; // Clean up target mapping too
          });

          // Store the refined transcription
          context.transcriptions[sequenceNumber] = transcription;
          context.transcriptionsByTarget[refinedTargetId] = {
            [sequenceNumber]: transcription
          };

          // Get initial text for this target
          const initialText = context.initialTextByTarget[refinedTargetId] || "";

          // Set the final refined text using smart joining to handle whitespace correctly
          const finalText = smartJoinTwoTexts(initialText, transcription);
          setTextInTarget(finalText, targetElement, true); // Replace all content

          // Update accumulated text if this is the current target
          if (targetElement === context.targetElement) {
            context.accumulatedText = finalText;
          }

          // Clean up refinement state and audio buffers
          context.activeRefinementSequences.delete(refinedTargetId);
          clearAudioForTarget(context, refinedTargetId);

          // Emit refinement complete event
          EventBus.emit("dictation:refined", {
            targetElement,
            targetId: refinedTargetId,
            sequenceNumber,
            refinedText: transcription,
            finalText
          });

          console.debug(
            `[DictationMachine] Refinement complete for target ${refinedTargetId}. Final text: ${finalText}`
          );

          // Don't continue with normal Phase 1 processing
          return;
        }
        // ---- NORMALISE ELLIPSES ----
        // Convert any ellipsis—either the single Unicode "…" character or the
        // three-dot sequence "..." — into a single space so downstream merging
        // sees consistent whitespace. Then collapse *spaces or tabs* (but not
        // line breaks) and trim the string.
        const originalTranscription = transcription;
        transcription = normalizeTranscriptionText(transcription);

        console.debug(
          `Dictation transcript [${sequenceNumber}]: ${transcription}` +
          `${mergedSequences.length > 0 ? ` (merged: [${mergedSequences.join(', ')}])` : ''}` +
          `${originalTranscription !== transcription ? ` | original: "${originalTranscription}"` : ''}`
        );

        if (transcription && transcription.trim() !== "") {
          // Determine the target element for this sequence
          const originatingTarget = context.transcriptionTargets[sequenceNumber];

          if (!originatingTarget) {
            console.warn(`No originating target found for sequence ${sequenceNumber}, skipping transcription response`);
            return;
          }

          const targetId = getTargetElementId(originatingTarget);
          
          // CRITICAL FIX: Check if field was externally cleared BEFORE adding new transcription
          // This detects when chat platforms clear fields programmatically
          const currentFieldContent = getTextInTarget(originatingTarget);
          const existingTargetTranscriptions = context.transcriptionsByTarget[targetId];
          
          if (existingTargetTranscriptions && Object.keys(existingTargetTranscriptions).length > 0) {
            // We have previous transcriptions for this target
            const previousMergedContent = smartJoinTranscriptions(existingTargetTranscriptions);
            
            // Check if field content is empty or doesn't match what we expect
            // This indicates external clearing (e.g., chat platform clearing after submission)
            if (currentFieldContent.trim() === "" && previousMergedContent.trim() !== "") {
              console.debug(`Detected external field clearing for target ${targetId}, resetting transcription state`);
              
              // Clear all previous transcriptions for this target
              Object.keys(existingTargetTranscriptions).forEach(key => {
                const seq = parseInt(key, 10);
                delete context.transcriptions[seq];
              });
              delete context.transcriptionsByTarget[targetId];
              
              // Clear initial text for this target since field was cleared
              delete context.initialTextByTarget[targetId];
              
              // Reset accumulated text if this is the current target
              if (originatingTarget === context.targetElement) {
                context.accumulatedText = "";
              }
            }
          }

          // Initialize target-specific transcriptions if not exists
          const targetTranscriptions = getOrCreateTargetBucket(context, targetId);

          // Add the new (potentially merged) transcription to both global and target-specific storage
          context.transcriptions[sequenceNumber] = transcription;
          targetTranscriptions[sequenceNumber] = transcription;
          TranscriptionErrorManager.recordAttempt(true);

          // Use stored initial text if it exists and is non-empty, otherwise get current field content
          // This prevents text duplication when there's pre-existing text, while maintaining 
          // existing behavior for fields that started empty
          const storedInitialText = context.initialTextByTarget[targetId];
          const initialText = storedInitialText !== undefined ? storedInitialText : currentFieldContent;
          const isUsingStoredInitialText = storedInitialText !== undefined;

          // Get target-specific transcriptions for merging
          const finalText = computeFinalText(
            targetTranscriptions,
            mergedSequences,
            transcription,
            initialText,
            isUsingStoredInitialText
          );
          console.debug(
            `Merged text for target ${targetId}: ${finalText}`
          );

          // computeFinalText already includes initial text, so use finalText directly
          
          
          setTextInTarget(finalText, originatingTarget, true); // true = replace all content

          // Finally, handle server-side merging if present, after those sequences have been referenced in composing the final text
          if (mergedSequences.length > 0) {
            removeMergedSequencesFromContext(context, mergedSequences);
            console.debug(`Removed server-merged sequences [${mergedSequences.join(', ')}] from context`);
          }

          // Update accumulated text only if this is the current target
          if (originatingTarget === context.targetElement) {
            if (mergedSequences.length > 0) {
              // Rebuild accumulated text from remaining transcriptions for current target
              context.accumulatedText = smartJoinTranscriptions(targetTranscriptions);
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
        timeUserStartedSpeaking: 0,
        timeLastTranscriptionReceived: 0,
        targetElement: () => undefined,
        accumulatedText: "",
        transcriptionTargets: () => ({}),
        provisionalTranscriptionTarget: () => undefined,
        targetSwitchesDuringSpeech: () => undefined,
        speechStartTarget: () => undefined,
        audioSegmentsByTarget: () => ({}),
        refinementPendingForTargets: () => new Set<string>(),
        activeRefinementSequences: () => new Map<string, number>(),
      }),

      finalizeDictation: (context: DictationContext) => {
        // Generate final merged text from current target's transcriptions
        let finalText = context.accumulatedText;

        if (context.targetElement) {
          const targetTranscriptions = getTranscriptionsForTarget(context, context.targetElement);
          finalText = computeFinalText(targetTranscriptions, [], finalText, "", false);
        }

        // Clear all audio buffers when dictation is finalized
        clearAllAudioBuffers(context);

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
        
        // Capture the pre-existing text in the new target element
        const targetId = getTargetElementId(event.targetElement);
        const initialText = getTextInTarget(event.targetElement);
        
        // For contenteditable elements, distinguish between DOM formatting whitespace vs user-entered content
        let cleanedInitialText = initialText;
        if (event.targetElement.contentEditable === "true" && initialText.trim() === "") {
          // Check if this is just DOM formatting whitespace (spaces, tabs, newlines without <br> tags)
          // vs user-entered whitespace (which would contain <br> tags or other HTML)
          const innerHTML = event.targetElement.innerHTML || '';
          const hasUserEnteredContent = innerHTML.includes('<br') || innerHTML.includes('<div') || innerHTML.includes('&nbsp;');
          
          if (!hasUserEnteredContent) {
            // This is just DOM formatting whitespace, treat as empty
            cleanedInitialText = "";
          }
          // Otherwise preserve the whitespace as it represents user-entered content
        }
          
        context.initialTextByTarget[targetId] = cleanedInitialText;
        
        console.log(`Captured initial text for target ${targetId}:`, JSON.stringify(cleanedInitialText));
        
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

      recordTargetSwitchDuringSpeech: (
        context: DictationContext,
        event: { type: "saypi:switchTarget"; targetElement: HTMLElement }
      ) => {
        // Lazily initialise the array if this is the first switch for this speech
        if (!context.targetSwitchesDuringSpeech) {
          context.targetSwitchesDuringSpeech = [];
        }

        context.targetSwitchesDuringSpeech.push({
          timestamp: Date.now(),
          target: event.targetElement,
        });

        console.debug(
          "Recorded target switch during speech (#%d)",
          context.targetSwitchesDuringSpeech.length,
          {
            timestamp: context.targetSwitchesDuringSpeech.at(-1)?.timestamp,
            newTarget: event.targetElement,
          }
        );
      },

      handleAudioStopped: (
        context: DictationContext,
        event: DictationSpeechStoppedEvent
      ) => {
        // If there's no audio blob, nothing to process
        if (!event.blob) {
          return;
        }

        const SAMPLE_RATE = 16000;
        const MAX_RETRIES = 3;

        // Utility for processing (and optionally delaying) a single audio segment
        const processSegment = (
          audioData: Float32Array,
          targetElement: HTMLElement,
          offsetMs: number = 0
        ) => {
          if (audioData.length === 0) return;

          const blob = convertToWavBlob(audioData);
          const duration = (audioData.length / SAMPLE_RATE) * 1000;
          const captureTs = event.captureTimestamp
            ? event.captureTimestamp + offsetMs
            : undefined;
          const clientReceiveTs = event.clientReceiveTimestamp
            ? event.clientReceiveTimestamp + offsetMs
            : undefined;

          uploadAudioSegment(
            context,
            blob,
            duration,
            targetElement,
            context.sessionId,
            MAX_RETRIES,
            captureTs,
            clientReceiveTs,
            audioData  // Pass frames for buffering
          );
        };

        // If there were one or more target switches during the speech, split the audio accordingly
        if (context.targetSwitchesDuringSpeech && context.targetSwitchesDuringSpeech.length > 0 && event.frames) {
          const switches = [...context.targetSwitchesDuringSpeech].sort((a, b) => a.timestamp - b.timestamp);

          const audioStartTs = (event.captureTimestamp || Date.now()) - event.duration;

          const raw = new Float32Array(event.frames);

          let prevOffset = 0; // in samples
          let prevTarget: HTMLElement | undefined = context.speechStartTarget || context.targetElement;

          switches.forEach((sw, idx) => {
            const splitTimeMs = sw.timestamp - audioStartTs;

            // Ignore switch events that are out of audio bounds
            if (splitTimeMs <= 0 || splitTimeMs >= event.duration) {
              return;
            }

            const splitOffset = Math.floor((splitTimeMs / 1000) * SAMPLE_RATE); // in samples

            // Segment before this switch
            const segmentBefore = raw.slice(prevOffset, splitOffset);
            processSegment(segmentBefore, prevTarget as HTMLElement, (prevOffset / SAMPLE_RATE) * 1000);

            // Update trackers for next loop iteration
            prevOffset = splitOffset;
            prevTarget = sw.target;
          });

          // Process the remaining segment after the last switch
          if (prevTarget) {
            const segmentAfter = raw.slice(prevOffset);
            processSegment(segmentAfter, prevTarget, (prevOffset / SAMPLE_RATE) * 1000);
          }

          console.debug(
            `Processed speech with ${switches.length} switch(es) into ${switches.length + 1} segment(s).`
          );

          // Clear switch tracking for next speech
          context.targetSwitchesDuringSpeech = undefined;
          context.speechStartTarget = undefined;
          return;
        }

        // Fallback – no switches recorded; treat as single segment
        if (context.targetElement) {
          uploadAudioSegment(
            context,
            event.blob,
            event.duration,
            context.targetElement,
            context.sessionId,
            MAX_RETRIES,
            event.captureTimestamp,
            event.clientReceiveTimestamp,
            event.frames  // Pass frames for buffering
          );
        } else {
          console.warn("No target element set for transcription");
        }
      },

      clearTargetSwitchInfo: (
        context: DictationContext
      ) => {
        // Clear any accumulated switch info (used when VAD misfire occurs)
        if (context.targetSwitchesDuringSpeech && context.targetSwitchesDuringSpeech.length > 0) {
          console.debug("Clearing target switch info due to audio processing failure");
          context.targetSwitchesDuringSpeech = undefined;
        }
      },

      handleManualEdit: (
        context: DictationContext,
        event: DictationManualEditEvent
      ) => {
        console.debug("Manual edit detected, terminating dictation", {
          targetElement: event.targetElement,
          newContent: event.newContent,
          oldContent: event.oldContent
        });

        // SIMPLIFIED APPROACH: Terminate dictation on manual edit
        // This is cleaner and more predictable than trying to reconcile changes
        
        // Clear transcription state for the edited target
        const targetId = getTargetElementId(event.targetElement);
        const targetTranscriptions = context.transcriptionsByTarget[targetId];
        
        if (targetTranscriptions) {
          // Clear transcriptions for this target from global context
          // but preserve transcriptions for other targets
          Object.keys(targetTranscriptions).forEach(key => {
            const seq = parseInt(key, 10);
            // Only delete from global if this sequence belongs to the edited target
            if (context.transcriptionTargets[seq] === event.targetElement) {
              delete context.transcriptions[seq];
            }
          });
          delete context.transcriptionsByTarget[targetId];
        }
        
        // Clear initial text for this target
        delete context.initialTextByTarget[targetId];

        // Reset accumulated text if this is the current target
        if (event.targetElement === context.targetElement) {
          context.accumulatedText = "";
        }

        // Clear audio buffers and refinement state for this target
        // This prevents stale audio (up to 120s) from being refined later
        clearAudioForTarget(context, targetId);

        // Emit event to notify that dictation was terminated due to manual edit
        EventBus.emit("dictation:terminatedByManualEdit", {
          targetElement: event.targetElement,
          reason: "manual-edit"
        });

        // Stop recording and cleanup
        EventBus.emit("audio:stopRecording");
        EventBus.emit("audio:tearDownRecording");
      },

      performContextualRefinement: (
        context: DictationContext,
        event: DictationEvent
      ) => {
        console.debug("[DictationMachine] performContextualRefinement triggered");

        // Determine which target(s) to refine
        let targetsToRefine: HTMLElement[] = [];

        if (event.type === "saypi:refineTranscription") {
          // Explicit refinement request for a specific target
          targetsToRefine = [(event as DictationRefineTranscriptionEvent).targetElement];
        } else {
          // Endpoint-triggered: refine ALL pending targets (not just current one)
          // This handles the case where user switched targets mid-dictation
          for (const targetId of context.refinementPendingForTargets) {
            // Find the target element by looking through transcription targets
            const targetElement = Object.values(context.transcriptionTargets).find(
              el => getTargetElementId(el) === targetId
            );

            if (targetElement) {
              targetsToRefine.push(targetElement);
            } else {
              console.warn(`[DictationMachine] No element found for pending refinement target ${targetId}`);
              context.refinementPendingForTargets.delete(targetId);
            }
          }
        }

        if (targetsToRefine.length === 0) {
          console.debug("[DictationMachine] No targets to refine");
          return;
        }

        // Process each target
        for (const targetElement of targetsToRefine) {
          const targetId = getTargetElementId(targetElement);
          const segments = context.audioSegmentsByTarget[targetId];

          if (!segments || segments.length === 0) {
            console.debug(`[DictationMachine] No audio segments to refine for target ${targetId}`);
            // Clear the pending flag even if no segments (cleanup)
            context.refinementPendingForTargets.delete(targetId);
            continue;
          }

        console.debug(
          `[DictationMachine] Starting refinement for target ${targetId} with ${segments.length} segments`
        );

        // Concatenate all audio segments
        const totalDuration = segments.reduce((sum, seg) => sum + seg.duration, 0);
        const totalFrames = segments.reduce((sum, seg) => sum + seg.frames.length, 0);

        // Combine all frames into a single Float32Array
        const combinedFrames = new Float32Array(totalFrames);
        let offset = 0;
        for (const segment of segments) {
          combinedFrames.set(segment.frames, offset);
          offset += segment.frames.length;
        }

        // Convert combined frames to WAV blob
        const combinedBlob = convertToWavBlob(combinedFrames);

        console.debug(
          `[DictationMachine] Concatenated ${segments.length} segments: ${totalDuration}ms, ${totalFrames} frames, ${combinedBlob.size} bytes`
        );

        // Get the earliest capture timestamp
        const earliestCaptureTimestamp = segments.reduce(
          (earliest, seg) =>
            seg.captureTimestamp && (!earliest || seg.captureTimestamp < earliest)
              ? seg.captureTimestamp
              : earliest,
          undefined as number | undefined
        );

        // Upload the combined audio for refinement
        // Pass empty precedingTranscripts because the context is in the audio itself
        uploadAudioWithRetry(
          combinedBlob,
          totalDuration,
          {}, // Empty precedingTranscripts - context is in the audio
          context.sessionId,
          3, // max retries
          earliestCaptureTimestamp,
          undefined, // clientReceiveTimestamp
          getInputContext(targetElement).inputType || undefined,
          getInputContext(targetElement).inputLabel || undefined
        ).then((sequenceNum) => {
          console.debug(
            `[DictationMachine] Refinement transcription sent with sequence ${sequenceNum} for target ${targetId}`
          );

          // Map the refinement sequence to the target element so the response can be routed correctly
          context.transcriptionTargets[sequenceNum] = targetElement;

          // Track this as an active refinement
          context.activeRefinementSequences.set(targetId, sequenceNum);

          // Clear the pending flag
          context.refinementPendingForTargets.delete(targetId);

          // Note: Audio segments will be cleared when refinement response is received
        }).catch((error) => {
          console.error("[DictationMachine] Refinement transcription failed:", error);
          // Clean up on failure
          clearAudioForTarget(context, targetId);
        });
        } // end for loop over targetsToRefine
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
      refinementConditionsMet: (context: DictationContext) => {
        // Check if we have pending refinements and not currently transcribing
        return context.refinementPendingForTargets.size > 0 && !context.isTranscribing;
      },
    },
    delays: {
      refinementDelay: (context: DictationContext, event: DictationEvent) => {
        // Only calculate delay for transcription events
        if (event.type !== "saypi:transcribed") {
          return 0;
        }

        const transcriptionEvent = event as DictationTranscribedEvent;

        // Use configured max delay for dictation endpoint detection
        const maxDelay = REFINEMENT_MAX_DELAY_MS;

        // Use pFinishedSpeaking from API, default to 1 if not provided
        let probabilityFinished = transcriptionEvent.pFinishedSpeaking ?? 1;

        // Use tempo from API, default to 0 if not provided (neutral)
        let tempo = transcriptionEvent.tempo ?? 0;
        // Clamp tempo to [0, 1]
        tempo = Math.max(0, Math.min(1, tempo));

        const scheduledAt = Date.now();
        const timeElapsed = scheduledAt - context.timeLastTranscriptionReceived;
        const finalDelay = calculateDelay(
          context.timeLastTranscriptionReceived,
          probabilityFinished,
          tempo,
          maxDelay
        );

        console.debug(
          "[DictationMachine] refinementDelay:",
          JSON.stringify({
            seq: transcriptionEvent.sequenceNumber,
            pFinished: probabilityFinished,
            tempo,
            maxDelay,
            timeElapsed,
            finalDelay,
            scheduledAt
          })
        );

        return finalDelay;
      },
    },
  }
);

export function createDictationMachine(targetElement?: HTMLElement) {
  targetInputElement = targetElement || null;
  return machine;
}

export { machine as DictationMachine };