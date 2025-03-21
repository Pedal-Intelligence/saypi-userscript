import { AssistantResponse, MessageControls } from "../dom/MessageElements";
import EventBus from "../events/EventBus";
import {
  AddedText,
  ChangedText,
  Completion,
  ElementTextStream,
  InputStreamOptions,
} from "../tts/InputStream";
import { SpeechSynthesisVoiceRemote } from "../tts/SpeechModel";
import { PiSpeechSourceParser } from "../tts/SpeechSourceParsers";
import { TTSControlsModule } from "../tts/TTSControlsModule";
import { Chatbot, UserPrompt } from "./Chatbot";

class PiAIChatbot implements Chatbot {
  getName(): string {
    return "Pi";
  }

  getPrompt(element: HTMLElement): UserPrompt {
    return new PiPrompt(element);
  }

  getPromptTextInputSelector(): string {
    return "textarea[enterkeyhint]";
  }

  getPromptSubmitButtonSelector(): string {
    return "#saypi-prompt-controls-container button.rounded-full.transition-colors.duration-300"; // falls back to use JS instead if unsuccessful (see bootstrap.ts)
  }

  getAudioControlsSelector(): string {
    return "audio + div";
  }

  getAudioOutputButtonSelector(): string {
    // audio button is the last button element in the audio controls container
    return "#saypi-audio-controls > div > div.relative.flex.items-center.justify-end.self-end.p-2 > button";
  }

  getControlPanelSelector(): string {
    return ".flex.items-center.grow";
  }

  getSidePanelSelector(): string {
    return "div.hidden.w-22.flex-col.items-center.gap-1.border-r";
  }

  getChatPath(): string {
    return "/discover";
  }

  isChatablePath(path: string): boolean {
    // true if path starts with /talk or /discover
    return path.includes("/talk") || path.includes("/discover");
  }

  getVoiceMenuSelector(): string {
    return "div.t-action-m";
  }

  getVoiceSettingsSelector(): string {
    return "div.mx-auto.w-full.px-6.py-10 > div.grid.grid-cols-2.gap-4";
  }

  getChatHistorySelector(): string {
    return "div.t-body-chat";
  }

  getPastChatHistorySelector(): string {
    return "#saypi-chat-history :nth-child(2)"; // second child of the chat history container
  }

  getRecentChatHistorySelector(): string {
    return "#saypi-chat-history :nth-child(3)"; // third child of the chat history container
  }

  getDiscoveryPanelSelector(): string {
    // note: depends on the side panel having already been identified
    return "#saypi-side-panel + div";
  }

  getAssistantResponseSelector(): string {
    return "div.break-anywhere:not(.justify-end)";
  }

  getAssistantResponseContentSelector(): string {
    return "div.w-full";
  }

  getAssistantResponse(element: HTMLElement): AssistantResponse {
    return new PiResponse(element);
  }

  getExtraCallButtonClasses(): string[] {
    return [
      "fixed",
      "rounded-full",
      "bg-cream-550",
      "enabled:hover:bg-cream-650",
      "m-2",
    ];
  }

  /**
   * Returns an array of extra voices available on the Pi chatbot, that not everyone has access to, depending on when the account was created
   * @returns {SpeechSynthesisVoiceRemote[]} - an array of extra voices available on the Pi chatbot, that not everyone has access to
   */
  getExtraVoices(): SpeechSynthesisVoiceRemote[] {
    const parser = new PiSpeechSourceParser();
    return [parser.getVoice("voice7"), parser.getVoice("voice8")];
  }

  /**
   * Returns the URL of the voice introduction audio file for the given voice id
   * @param voiceId - the id of the voice to get the introduction for, e.g. "voice1"
   * @returns {string} - the URL of the voice introduction audio file, e.g. "https://pi.ai/public/media/voice-previews/voice-1.mp3"
   */
  getVoiceIntroductionUrl(voiceId: string): string {
    return `https://pi.ai/public/media/voice-previews/voice-${voiceId.slice(
      -1
    )}.mp3`;
  }
}

class PiResponse extends AssistantResponse {
  constructor(element: HTMLElement, includeInitialText?: boolean) {
    super(element, includeInitialText);
  }

  get contentSelector(): string {
    return "div.w-full";
  }

  createTextStream(
    content: HTMLElement,
    options?: InputStreamOptions
  ): ElementTextStream {
    return new PiTextStream(content, options);
  }

  decorateControls(): MessageControls {
    return new PiMessageControls(this, this.ttsControlsModule);
  }
}

class PiMessageControls extends MessageControls {
  constructor(message: AssistantResponse, ttsControls: TTSControlsModule) {
    super(message, ttsControls);
  }

  protected getExtraControlClasses(): string[] {
    return ["pt-4", "text-neutral-500", "text-sm"];
  }

  getHoverMenuSelector(): string {
    return "div[style]:last-of-type"; // last div child of the message element (usually the second child)
  }
}

class PiTextStream extends ElementTextStream {
  // Increase the style change completion timeout for better stability
  static STYLE_CHANGE_COMPLETION_TIMEOUT = 500;
  
  // Increase the maximum time to wait for hidden spans to become visible
  static MAX_WAIT_FOR_SPANS = 3500;
  
  // Significantly increase the stability period to ensure the stream is truly complete
  static STABILITY_PERIOD = 3000;
  
  // Add a larger buffer for content changes at the end
  static COMPLETION_BUFFER = 500;
  
  // Track the last paragraph and spans
  lastParagraphAdded: HTMLDivElement;
  hiddenSpans: Set<HTMLSpanElement> = new Set();
  visibleSpans: Set<HTMLSpanElement> = new Set();
  hiddenTextQueue: Queue<String> = new Queue();
  
  // Track the state of the stream
  stillChanging: boolean;
  lastStyleMutation: number = 0;
  additionalDelay: number = 0;
  lastContentChange: number = Date.now();
  
  // Track content for emission
  textNodesAdded: boolean = false;
  firstTextTime: number | null = null;
  lastNewSpanTime: number = 0;
  
  constructor(element: HTMLElement, options?: InputStreamOptions) {
    super(element, options);

    this.lastParagraphAdded = this.element.querySelectorAll("div")?.item(0);
    this.stillChanging = false;
    this.lastContentChange = Date.now();

    // Find any existing hidden spans (that might have been added before we started observing)
    this.findExistingHiddenSpans();

    EventBus.on("saypi:tts:text:delay", this.handleDelayEvent);
    
    // Start a periodic check for completion
    this.startPeriodicCompletionCheck();
  }
  
  // Find any spans that are already in the DOM but hidden
  private findExistingHiddenSpans(): void {
    const spans = this.element.querySelectorAll("span");
    spans.forEach(span => {
      const isHidden = this.isSpanHidden(span);
      if (isHidden) {
        this.hiddenSpans.add(span);
      } else {
        this.visibleSpans.add(span);
      }
    });
    
    if (this.hiddenSpans.size > 0 || this.visibleSpans.size > 0) {
      this.lastNewSpanTime = Date.now();
      console.debug(`Found ${this.hiddenSpans.size} hidden spans and ${this.visibleSpans.size} visible spans already in the DOM`);
    }
  }

  // Helper to check if a span is hidden
  private isSpanHidden(span: HTMLSpanElement): boolean {
    try {
      // First check inline style which is more reliable in test environments
      if (span.style.display === "none" || span.style.opacity === "0") {
        return true;
      }
      
      // Fall back to computed style for browser environment
      if (typeof window !== 'undefined' && window.getComputedStyle) {
        const style = window.getComputedStyle(span);
        return style.display === "none" || parseFloat(style.opacity) === 0;
      }
      
      return false;
    } catch (e) {
      console.error("Error checking if span is hidden", e);
      return false;
    }
  }

  // Start a periodic check for completion
  private startPeriodicCompletionCheck(): void {
    const interval = setInterval(() => {
      if (this.closed()) {
        clearInterval(interval);
        return;
      }
      
      this.checkForCompletion();
    }, 250); // Check every 250ms
    
    // Clean up the interval when the stream is completed
    this.getStream().subscribe({
      complete: () => clearInterval(interval)
    });
  }

  // override
  // visible for testing
  calculateStreamTimeout(): number {
    // Use a moderate timeout that's less than default but not too aggressive
    const baseDelay = Math.min(super.calculateStreamTimeout(), 4500);
    const additionalDelay = this.additionalDelay || 0;
    const totalTimeout = baseDelay + additionalDelay;
    return totalTimeout;
  }

  /**
   * Extend the stream timeout when a delay event is received.
   */
  handleDelayEvent = () => {
    const delay = 1500;
    this.additionalDelay += delay;
    console.debug(
      `Received delay event. Adding ${delay}ms to timeout. Total additional delay: ${this.additionalDelay}ms`
    );
    this.resetStreamTimeout();
  };

  /**
   * Update the last content change timestamp
   */
  private updateLastContentChange(): void {
    this.lastContentChange = Date.now();
  }

  /**
   * Check if we should consider the stream complete based on style transitions
   */
  checkForCompletion(): void {
    const now = Date.now();
    
    // If this is the first time we're checking and text has been added, record the time
    if (this.textNodesAdded && this.firstTextTime === null) {
      this.firstTextTime = now;
    }
    
    // Get the time since various events occurred
    const timeSinceLastStyleChange = now - this.lastStyleMutation;
    const timeSinceLastNewSpan = now - this.lastNewSpanTime;
    const timeSinceLastContentChange = now - this.lastContentChange;
    
    // If we have no more hidden spans and we've seen text added, check stability
    if (this.hiddenSpans.size === 0 && this.textNodesAdded) {
      // But wait for a stability period to make sure nothing else changes
      if (timeSinceLastStyleChange > (PiTextStream.STYLE_CHANGE_COMPLETION_TIMEOUT + PiTextStream.COMPLETION_BUFFER) && 
          timeSinceLastContentChange > (PiTextStream.STABILITY_PERIOD + PiTextStream.COMPLETION_BUFFER)) {
        console.debug(`Stream completion detected - all spans visible and no changes for ${timeSinceLastStyleChange}ms, content stable for ${timeSinceLastContentChange}ms`);
        this.complete({ type: "eod", time: now });
      }
    } 
    // If we've seen text being added but still have hidden spans, check if we should time out
    else if (this.textNodesAdded && this.hiddenSpans.size > 0) {
      // If it's been too long since we've seen a new span, we should complete 
      // BUT only if content has been stable for a while
      if (timeSinceLastNewSpan > (PiTextStream.MAX_WAIT_FOR_SPANS + PiTextStream.COMPLETION_BUFFER) && 
          timeSinceLastContentChange > (PiTextStream.STABILITY_PERIOD + PiTextStream.COMPLETION_BUFFER)) {
        console.debug(`Stream timeout - waited ${timeSinceLastNewSpan}ms for hidden spans to become visible (${this.hiddenSpans.size} spans still hidden), content stable for ${timeSinceLastContentChange}ms`);
        this.complete({ type: "eod", time: now });
      }
      
      // If we've been seeing text for a long time but still have hidden spans, we should complete
      // BUT only if content has been stable for a while
      if (this.firstTextTime !== null) {
        const timeSinceFirstText = now - this.firstTextTime;
        if (timeSinceFirstText > (2 * PiTextStream.MAX_WAIT_FOR_SPANS + PiTextStream.COMPLETION_BUFFER) && 
            timeSinceLastContentChange > (PiTextStream.STABILITY_PERIOD + PiTextStream.COMPLETION_BUFFER)) {
          console.debug(`Stream timeout - waited ${timeSinceFirstText}ms since first text, ${this.hiddenSpans.size} spans still hidden, content stable for ${timeSinceLastContentChange}ms`);
          this.complete({ type: "eod", time: now });
        }
      }
    }
  }

  handleMutationEvent = (mutation: MutationRecord) => {
    if (this.closed()) {
      console.debug(
        `Skipping change event on ${mutation.target} because the stream has already been completed`,
        mutation
      );
      return;
    }

    this.stillChanging = true;
    this.updateLastContentChange();

    // Check for style mutations which indicate the progressive reveal
    if (mutation.type === "attributes" && mutation.attributeName === "style") {
      const span = mutation.target as HTMLElement;
      if (span.tagName === "SPAN") {
        const isHidden = this.isSpanHidden(span as HTMLSpanElement);
        const wasHidden = this.hiddenSpans.has(span as HTMLSpanElement);
        
        // Record the style transition
        this.lastStyleMutation = Date.now();
        
        if (wasHidden && !isHidden) {
          // The span has transitioned from hidden to visible
          this.hiddenSpans.delete(span as HTMLSpanElement);
          this.visibleSpans.add(span as HTMLSpanElement);
          console.debug(`Span transitioned to visible: ${span.textContent}`);
          
          // Check if this might be the last span
          this.checkForCompletion();
        } else if (!wasHidden && isHidden) {
          // The span has transitioned from visible to hidden (unusual)
          this.visibleSpans.delete(span as HTMLSpanElement);
          this.hiddenSpans.add(span as HTMLSpanElement);
        }
      }
    }
    // Check for node additions which might be spans or text
    else if (mutation.type === "childList") {
      for (let i = 0; i < mutation.addedNodes.length; i++) {
        const node = mutation.addedNodes[i];
        
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as HTMLElement;
          
          // Check for new spans that might be hidden
          if (element.tagName === "SPAN") {
            this.lastNewSpanTime = Date.now();
            const isHidden = this.isSpanHidden(element as HTMLSpanElement);
            if (isHidden) {
              this.hiddenSpans.add(element as HTMLSpanElement);
              console.debug(`Hidden span added: ${element.textContent}`);
              this.hiddenTextQueue.enqueue(element.textContent || "");
              EventBus.emit("saypi:llm:first-token", {text: element.textContent || "", time: Date.now()});
            } else {
              this.visibleSpans.add(element as HTMLSpanElement);
              console.debug(`Visible span added: ${element.textContent}`);
            }
          } 
          // Check for new paragraphs
          else if (element.tagName === "DIV") {
            this.lastParagraphAdded = element as HTMLDivElement;
            console.debug(`New paragraph added`);
            
            // Check for any spans in this new paragraph that might be hidden
            const spans = element.querySelectorAll("span");
            if (spans.length > 0) {
              this.lastNewSpanTime = Date.now();
            }
            
            spans.forEach(span => {
              const isHidden = this.isSpanHidden(span);
              if (isHidden) {
                this.hiddenSpans.add(span);
              } else {
                this.visibleSpans.add(span);
              }
            });
          }
        } 
        // Check for new text nodes
        else if (node.nodeType === Node.TEXT_NODE) {
          const textNode = node as Text;
          const content = textNode.textContent || "";

          const head = this.hiddenTextQueue.peek();
          if (head) {
            if (head.trim() === content.trim()) {
              this.hiddenTextQueue.dequeue();
            }
          }

          this.next(new AddedText(content || ""));
          this.textNodesAdded = true;
          
          // If this is the first text we've seen, record the time
          if (this.firstTextTime === null) {
            this.firstTextTime = Date.now();
          }
          
          console.debug(`Text node added: "${content}"`);

          if (this.hiddenTextQueue.isEmpty()) {
            console.debug("Stream completion detected - all hidden text has been added");
            this.complete({ type: "eod", time: Date.now() });
          }
        }
      }
    } 
    // Check for text content changes
    else if (mutation.type === "characterData") {
      const textNode = mutation.target as Text;
      const content = textNode.textContent || "";
      const oldValue = mutation.oldValue || "";
      
      // Only emit if we've seen this text before
      const alreadyEmitted = this.emittedValues.some(
        (value) => value.text === oldValue
      );
      
      if (alreadyEmitted) {
        this.next(new ChangedText(content, oldValue));
        console.debug(`Text changed from "${oldValue}" to "${content}"`);
      } else {
        console.debug(
          `Skipping change event for "${content}" because the old value "${oldValue}" was not emitted`
        );
      }
    }

    this.stillChanging = false;
  };

  // clean up the event listener when the stream is closed
  complete(reason: Completion): void {
    super.complete(reason);
    EventBus.off("saypi:tts:text:delay", this.handleDelayEvent);
  }
}

class PiPrompt extends UserPrompt {
  private textArea: HTMLTextAreaElement = this.element as HTMLTextAreaElement;
  readonly PROMPT_CHARACTER_LIMIT = 4000;

  setText(text: string): void {
    this.setNativeValue(this.textArea, text);
    this.scrollToBottom(this.textArea);
  }
  getText(): string {
    return this.textArea.value;
  }
  setPlaceholderText(text: string): void {
    this.textArea.placeholder = text;
    this.scrollToBottom(this.textArea);
  }
  getPlaceholderText(): string {
    return this.textArea.placeholder;
  }
  getDefaultPlaceholderText(): string {
    return this.textArea.placeholder;
  }

  setNativeValue(element: HTMLTextAreaElement, value: string) {
    let lastValue = element.value;
    element.value = value;
    let event = new InputEvent("input", { bubbles: true });
    // React 15
    (event as any).simulated = true; // React internal flag
    // React 16-17
    let tracker = (element as any)._valueTracker; // React internal state
    if (tracker) {
      tracker.setValue(lastValue);
    }
    element.dispatchEvent(event);
  }

  scrollToBottom(textarea: HTMLTextAreaElement) {
    // Define the height range for the textarea
    const maxHeight = 455;
    const minHeight = 32;

    // Reset the height to get the correct scrollHeight
    textarea.style.height = `${minHeight}px`; // (initial height) aka 2rem

    // Set the height of the textarea, up to the maximum height
    if (textarea.scrollHeight > maxHeight) {
      textarea.style.height = `${maxHeight}px`;
      textarea.style.overflowY = "scroll"; // Enable vertical scrollbar
    } else {
      const newHeight = Math.max(minHeight, textarea.scrollHeight);
      textarea.style.height = `${newHeight}px`;
      textarea.style.overflowY = "hidden"; // Hide vertical scrollbar
    }

    // Scroll to the bottom
    textarea.scrollTop = textarea.scrollHeight;
  }
}

class Queue<T> {
  private items: T[] = [];
  
  // Add an element to the tail
  enqueue(item: T): void {
    this.items.push(item);
  }
  
  // Remove and return the element at the head
  dequeue(): T | undefined {
    return this.items.shift();
  }
  
  // Look at the head element without removing it
  peek(): T | undefined {
    return this.items[0];
  }
  
  // Get the current size of the queue
  get size(): number {
    return this.items.length;
  }
  
  // Check if the queue is empty
  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

export { PiAIChatbot, PiResponse, PiTextStream, PiPrompt };
