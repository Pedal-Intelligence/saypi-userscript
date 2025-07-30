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
  frames?: Float32Array;
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

type DictationManualEditEvent = {
  type: "saypi:manualEdit";
  targetElement: HTMLElement;
  newContent: string;
  oldContent: string;
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
  | DictationManualEditEvent;

interface DictationContext {
  transcriptions: Record<number, string>; // Global transcriptions for backwards compatibility
  transcriptionsByTarget: Record<string, Record<number, string>>; // Transcriptions grouped by target element ID
  isTranscribing: boolean;
  userIsSpeaking: boolean;
  timeUserStoppedSpeaking: number;
  timeUserStartedSpeaking: number; // Track when current speech started
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
  clientReceiveTimestamp?: number
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

// Text insertion strategies for different element types
interface TextInsertionStrategy {
  canHandle(target: HTMLElement): boolean;
  insertText(target: HTMLElement, text: string, replaceAll: boolean): void;
}

class InputTextareaStrategy implements TextInsertionStrategy {
  canHandle(target: HTMLElement): boolean {
    return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;
  }

  insertText(target: HTMLElement, text: string, replaceAll: boolean): void {
    const inputTarget = target as HTMLInputElement | HTMLTextAreaElement;
    
    if (replaceAll) {
      inputTarget.value = text;
    } else {
      inputTarget.value = inputTarget.value + text;
    }

    // Dispatch input event for framework compatibility
    inputTarget.dispatchEvent(new Event("input", { bubbles: true }));
  }
}

class LexicalEditorStrategy implements TextInsertionStrategy {
  canHandle(target: HTMLElement): boolean {
    return target.contentEditable === "true" && this.isLexicalEditor(target);
  }

  private isLexicalEditor(el: HTMLElement): boolean {
    return (
      el.getAttribute("data-lexical-editor") === "true" ||
      !!el.closest('[data-lexical-editor="true"]')
    );
  }

  insertText(target: HTMLElement, text: string, replaceAll: boolean): void {
    target.focus();

    // Select all text if we are replacing everything
    if (replaceAll) {
      document.execCommand("selectAll");
    }

    // Attempt programmatic insertion that Lexical will recognise.
    // Try the modern beforeinput/input pathway with InputEvent.
    this.tryNativeInsert(target, text);
  }

  private tryNativeInsert(target: HTMLElement, text: string): boolean {
    try {
      const before = new InputEvent("beforeinput", {
        bubbles: true,
        cancelable: true,
        inputType: "insertText",
        data: text,
        composed: true,
      });

      const defaultPrevented = !target.dispatchEvent(before);
      if (!defaultPrevented) {
        const input = new InputEvent("input", {
          bubbles: true,
          cancelable: false,
          inputType: "insertText",
          data: text,
          composed: true,
        });
        target.dispatchEvent(input);
      }
      return !defaultPrevented;
    } catch {
      return false;
    }
  }
}

class SlateEditorStrategy implements TextInsertionStrategy {
  canHandle(target: HTMLElement): boolean {
    return target.contentEditable === "true" && this.isSlateEditor(target);
  }

  private isSlateEditor(el: HTMLElement): boolean {
    // Check for common Slate.js indicators
    return (
      el.getAttribute("data-slate-editor") === "true" ||
      !!el.closest('[data-slate-editor="true"]') ||
      el.getAttribute("data-slate") === "true" ||
      !!el.closest('[data-slate="true"]') ||
      // Check for Slate-specific data attributes or classes
      el.hasAttribute("data-slate-node") ||
      !!el.closest('[data-slate-node]') ||
      el.classList.contains("slate-editor") ||
      !!el.closest('.slate-editor') ||
      // Check for common Slate wrapper patterns
      !!el.closest('[role="textbox"][contenteditable="true"]')
    );
  }

  insertText(target: HTMLElement, text: string, replaceAll: boolean): void {
    target.focus();

    // Handle placeholder clearing for Slate editors
    this.clearPlaceholderIfPresent(target);

    // Select all text if we are replacing everything
    if (replaceAll) {
      document.execCommand("selectAll");
    }

    // Try the modern beforeinput/input pathway first (similar to Lexical strategy)
    if (!this.tryNativeInsert(target, text)) {
      // Fallback to direct DOM manipulation if events don't work
      this.fallbackInsert(target, text, replaceAll);
    }
  }

  private clearPlaceholderIfPresent(target: HTMLElement): void {
    // Common patterns for Slate placeholders
    const placeholderSelectors = [
      '[data-slate-placeholder="true"]',
      '[data-slate-placeholder]',
      '.slate-placeholder',
      '[contenteditable="false"][data-slate-zero-width]'
    ];

    for (const selector of placeholderSelectors) {
      const placeholder = target.querySelector(selector);
      if (placeholder && placeholder.textContent) {
        // Hide or remove placeholder element
        (placeholder as HTMLElement).style.display = 'none';
        // Also try removing the attribute that might control visibility
        placeholder.removeAttribute('data-slate-placeholder');
      }
    }

    // Also check if the target itself has placeholder-like content
    if (target.getAttribute('data-placeholder') || target.classList.contains('placeholder')) {
      target.removeAttribute('data-placeholder');
      target.classList.remove('placeholder');
    }
  }

  private tryNativeInsert(target: HTMLElement, text: string): boolean {
    try {
      const before = new InputEvent("beforeinput", {
        bubbles: true,
        cancelable: true,
        inputType: "insertText",
        data: text,
        composed: true,
      });

      const defaultPrevented = !target.dispatchEvent(before);
      if (!defaultPrevented) {
        const input = new InputEvent("input", {
          bubbles: true,
          cancelable: false,
          inputType: "insertText",
          data: text,
          composed: true,
        });
        target.dispatchEvent(input);
      }
      return !defaultPrevented;
    } catch {
      return false;
    }
  }

  private fallbackInsert(target: HTMLElement, text: string, replaceAll: boolean): void {
    if (replaceAll) {
      target.textContent = text;
      positionCursorAtEnd(target);
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
        target.textContent = (target.textContent || "") + text;
        positionCursorAtEnd(target);
      }
    }

    // Dispatch input event for framework compatibility
    target.dispatchEvent(new Event("input", { bubbles: true }));
  }
}

class ContentEditableStrategy implements TextInsertionStrategy {
  canHandle(target: HTMLElement): boolean {
    return target.contentEditable === "true";
  }

  insertText(target: HTMLElement, text: string, replaceAll: boolean): void {
    if (replaceAll) {
      target.textContent = text;
      // Position cursor at the end after replacing all content
      positionCursorAtEnd(target);
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
        target.textContent = (target.textContent || "") + text;
        // Position cursor at the end after appending
        positionCursorAtEnd(target);
      }
    }

    // Dispatch input event for framework compatibility
    target.dispatchEvent(new Event("input", { bubbles: true }));
  }
}

class TextInsertionStrategySelector {
  private strategies: TextInsertionStrategy[] = [
    new InputTextareaStrategy(),
    new LexicalEditorStrategy(),
    new SlateEditorStrategy(),
    new ContentEditableStrategy(),
  ];

  getStrategy(target: HTMLElement): TextInsertionStrategy | null {
    // Order matters: LexicalEditorStrategy should be checked before ContentEditableStrategy
    // since Lexical editors are also contenteditable
    for (const strategy of this.strategies) {
      if (strategy.canHandle(target)) {
        return strategy;
      }
    }
    return null;
  }
}

// Create a singleton instance of the strategy selector
const strategySelector = new TextInsertionStrategySelector();

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

  // Get the appropriate strategy for this target element
  const strategy = strategySelector.getStrategy(target);
  
  if (strategy) {
    strategy.insertText(target, text, replaceAll);
    emitContentUpdated(text);
  } else {
    console.warn("No text insertion strategy found for target element", target);
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
    return targetElement.textContent || "";
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
  const currentTranscribedContent = Object.values(targetTranscriptions).join(" ");
  
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
    const contentWithoutLast = sortedKeys
      .slice(0, -1)
      .map(key => targetTranscriptions[key])
      .join(" ");
    
    // If newContent starts with contentWithoutLast, update the last transcription
    if (newContent.startsWith(contentWithoutLast)) {
      const remainder = newContent.substring(contentWithoutLast.length).trim();
      if (remainder) {
        targetTranscriptions[lastKey] = remainder;
        console.debug(`Updated last transcription [${lastKey}] for target ${targetId}:`, {
          from: targetTranscriptions[lastKey],
          to: remainder
        });
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
  initialText: string = ""
): string {
  if (mergedSequences.length > 0) {
    console.debug("Using server-merged text directly.");

    // Remove any earlier versions of the merged sequences from the prefix
    const mergedTexts = mergedSequences.map(seq => targetTranscriptions[seq]);
    if (mergedTexts === undefined) {
      console.warn("Merged text is undefined, skipping");
      return serverText.trimStart();
    }
    for (const mergedText of mergedTexts) {
      // Remove the text itself *and* any surplus whitespace around it
      const escaped = mergedText.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
      const regex = new RegExp(`\\s*${escaped}\\s*`, "g");
      initialText = initialText.replace(regex, " ");
    }

    // Normalise whitespace on both parts
    initialText = initialText
      .replace(/[ \t]{2,}/g, " ")   // collapse only spaces/tabs, keep newlines
      .replace(/[ \t]+$/, "");      // trim trailing spaces/tabs but keep final newline
    const normalisedServer = serverText.trimStart();

    const needsSpace = initialText !== "" && !initialText.endsWith(" ");
    const result = (needsSpace ? initialText + " " : initialText) + normalisedServer;
    return result.replace(/[ \t]{2,}/g, " ");
  }
  // Local merge
  const mergedTranscript = mergeService
    ? mergeService.mergeTranscriptsLocal(targetTranscriptions)
    : Object.values(targetTranscriptions).join(" ");

  // Strip old individual transcripts (and surrounding whitespace) from the prefix
  for (const mergedText of Object.values(targetTranscriptions)) {
    const escaped = mergedText.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    const regex = new RegExp(`\\s*${escaped}\\s*`, "g");
    initialText = initialText.replace(regex, " ");
  }

  // Tidy whitespace
  initialText = initialText
    .replace(/[ \t]{2,}/g, " ")   // collapse only spaces/tabs, keep newlines
    .replace(/[ \t]+$/, "");      // trim trailing spaces/tabs but keep final newline
  const normalisedMerged = mergedTranscript.trimStart();

  const needsSpace = initialText !== "" && !initialText.endsWith(" ");
  const result = (needsSpace ? initialText + " " : initialText) + normalisedMerged;
  return result.replace(/[ \t]{2,}/g, " ");
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
      timeUserStartedSpeaking: 0,
      accumulatedText: "",
      transcriptionTargets: {},
      provisionalTranscriptionTarget: undefined,
      targetSwitchesDuringSpeech: undefined,
      speechStartTarget: undefined,
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
      "saypi:manualEdit": {
        actions: "handleManualEdit",
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
        let transcription = event.text;
        const sequenceNumber = event.sequenceNumber;
        const mergedSequences = event.merged || [];
        // ---- NORMALISE ELLIPSES ----
        // Convert any ellipsis—either the single Unicode “…” character or the
        // three-dot sequence “...” — into a single space so downstream merging
        // sees consistent whitespace. Then collapse *spaces or tabs* (but not
        // line breaks) and trim the string.
        const originalTranscription = transcription;
        transcription = transcription
          .replace(/\u2026/g, " ")   // “…” → space
          .replace(/\.{3}/g, " ")    // "..." → space
          .replace(/[ \t]{2,}/g, " ")   // collapse runs of spaces/tabs but keep line-breaks
          .trim();

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

          // Initialize target-specific transcriptions if not exists
          const targetTranscriptions = getOrCreateTargetBucket(context, targetId);

          // Add the new (potentially merged) transcription to both global and target-specific storage
          context.transcriptions[sequenceNumber] = transcription;
          targetTranscriptions[sequenceNumber] = transcription;
          TranscriptionErrorManager.recordAttempt(true);

          const initialText = getTextInTarget(originatingTarget);

          // CRITICAL FIX: Check if field was externally cleared
          // If the field is empty but we have existing transcriptions for this target,
          // AND there's at least one transcription that would have produced non-empty content,
          // it means external code (like a chat platform) cleared the field without
          // triggering manual edit detection. Clear the transcription state.
          const hasExistingTranscriptions = Object.keys(targetTranscriptions).length > 0;
          const hasNonEmptyTranscriptions = hasExistingTranscriptions && 
            Object.values(targetTranscriptions).some(text => text.trim() !== "");
          
          if (initialText.trim() === "" && hasNonEmptyTranscriptions) {
            console.debug(`Detected external field clearing for target ${targetId}, clearing transcription state`);
            
            // Clear transcriptions for this target
            Object.keys(targetTranscriptions).forEach(key => {
              const seq = parseInt(key, 10);
              delete context.transcriptions[seq];
              delete targetTranscriptions[seq];
            });
            
            // Clear the transcription bucket if it's now empty
            if (Object.keys(targetTranscriptions).length === 0) {
              delete context.transcriptionsByTarget[targetId];
            }
            
            // Reinitialize the bucket for the new transcription
            const cleanTargetTranscriptions = getOrCreateTargetBucket(context, targetId);
            cleanTargetTranscriptions[sequenceNumber] = transcription;
            context.transcriptions[sequenceNumber] = transcription;
            
            // Set the text directly without merging since we cleared the state
            setTextInTarget(transcription, originatingTarget, true);
            
            // Update accumulated text only if this is the current target
            if (originatingTarget === context.targetElement) {
              context.accumulatedText = transcription;
            }
            
            console.debug(`Reset transcription state for target ${targetId}, new content: "${transcription}"`);
            return; // Skip the normal merging logic
          }

          // Get target-specific transcriptions for merging
          const finalText = computeFinalText(
            targetTranscriptions,
            mergedSequences,
            transcription,
            initialText
          );
          console.debug(
            `Merged text for target ${targetId}: ${finalText}`
          );

          // Replace all text in the target with the final result
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
        timeUserStartedSpeaking: 0,
        targetElement: () => undefined,
        accumulatedText: "",
        transcriptionTargets: () => ({}),
        provisionalTranscriptionTarget: () => undefined,
        targetSwitchesDuringSpeech: () => undefined,
        speechStartTarget: () => undefined,
      }),

      finalizeDictation: (context: DictationContext) => {
        // Generate final merged text from current target's transcriptions
        let finalText = context.accumulatedText;
        
        if (context.targetElement) {
          const targetTranscriptions = getTranscriptionsForTarget(context, context.targetElement);
          finalText = computeFinalText(targetTranscriptions, [], finalText);
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
            clientReceiveTs
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
            event.clientReceiveTimestamp
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
        console.debug("Processing manual edit event", {
          targetElement: event.targetElement,
          newContent: event.newContent,
          oldContent: event.oldContent
        });

        // Update transcriptions to reflect the manual edit
        updateTranscriptionsForManualEdit(
          context,
          event.targetElement,
          event.newContent,
          event.oldContent
        );

        // Emit event to notify other components that dictation content was updated
        EventBus.emit("dictation:contentUpdated", {
          targetElement: event.targetElement,
          content: event.newContent,
          source: "manual-edit"
        });
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