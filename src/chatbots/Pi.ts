import { AssistantResponse, MessageControls, UserMessage } from "../dom/MessageElements";
import EventBus from "../events/EventBus";
import { UserPreferenceModule } from "../prefs/PreferenceModule";
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
import { PiVoiceMenu, VoiceSelector } from "../tts/VoiceMenu";
import { UserPrompt } from "./Chatbot";
import { AbstractChatbot, AbstractUserPrompt } from "./AbstractChatbots";

class PiAIChatbot extends AbstractChatbot {
  getName(): string {
    return "Pi";
  }

  getID(): string {
    return "pi";
  }

  getVoiceMenu(
    preferences: UserPreferenceModule,
    element: HTMLElement
  ): VoiceSelector {
    return new PiVoiceMenu(this, preferences, element);
  }

  getPrompt(element: HTMLElement): UserPrompt {
    return new PiPrompt(element);
  }

  getPromptInput(searchRoot: Element): HTMLElement {
    return searchRoot.querySelector(
      this.getPromptTextInputSelector()
    ) as HTMLElement;
  }

  getPromptContainer(prompt: HTMLElement): HTMLElement {
    return prompt.parentElement as HTMLElement;
  }

  getPromptControlsContainer(promptContainer: HTMLElement): HTMLElement {
    return promptContainer.parentElement as HTMLElement;
  }

  getPromptTextInputSelector(): string {
    return "textarea[enterkeyhint]";
  }

  getPromptSubmitButtonSelector(): string {
    return "#saypi-prompt-controls-container button.rounded-full.transition-colors.duration-300"; // falls back to use JS instead if unsuccessful (see bootstrap.ts)
  }

  getAudioControls(searchRoot: Element): HTMLElement {
    return searchRoot.querySelector(this.getAudioControlsSelector()) as HTMLElement;
  }

  getAudioControlsSelector(): string {
    return "audio + div";
  }

  getAudioOutputButtonSelector(): string {
    // audio button is the last button element in the audio controls container
    return ".saypi-audio-controls > div > div.relative.flex.items-center.justify-end.self-end.p-2 > button";
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

  getChatHistory(searchRoot: HTMLElement): HTMLElement {
    return searchRoot.querySelector(this.getChatHistorySelector()) as HTMLElement;
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

  getUserPromptSelector(): string {
    return "div.flex.justify-end.break-anywhere";
  }

  getUserMessageContentSelector(): string {
    return "div.max-w-full";
  }

  getAssistantResponseContentSelector(): string {
    return "div.w-full";
  }

  getAssistantResponse(element: HTMLElement): AssistantResponse {
    return super.getAssistantResponse(element);
  }

  protected createAssistantResponse(element: HTMLElement): AssistantResponse {
    return new PiResponse(element);
  }

  getUserMessage(element: HTMLElement): UserMessage {
    return new UserMessage(element, this);
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

  getContextWindowCapacityCharacters(): number {
    return 500; // Pi has a 4k character limit
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
  hiddenTextQueue: Queue<String> = new Queue();
  additionalDelay: number = 0;
  lastContentChange: number = Date.now();
  
  constructor(element: HTMLElement, options?: InputStreamOptions) {
    super(element, options);
    EventBus.on("saypi:tts:text:delay", this.handleDelayEvent);
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
   * Handle a mutation event on the element
   * @param mutation - The mutation record
   */
  handleMutationEvent = (mutation: MutationRecord) => {
    if (this.closed()) {
      // console.debug(
      //   `Skipping change event on ${mutation.target} because the stream has already been completed`
      // );
      return;
    }

    this.updateLastContentChange();

    // Check for node additions which might be spans or text
    if (mutation.type === "childList") {
      for (let i = 0; i < mutation.addedNodes.length; i++) {
        const node = mutation.addedNodes[i];
        
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as HTMLElement;
          
          // Check for new spans that might be hidden
          if (element.tagName === "SPAN") {
            const isHidden = this.isSpanHidden(element as HTMLSpanElement);
            if (isHidden) {
              if (this.hiddenTextQueue.isEmpty()) {
                EventBus.emit("saypi:llm:first-token", {text: element.textContent || "", time: Date.now()});
              }
              this.hiddenTextQueue.enqueue(element.textContent || "");
            }
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
  };

  // clean up the event listener when the stream is closed
  complete(reason: Completion): void {
    super.complete(reason);
    EventBus.off("saypi:tts:text:delay", this.handleDelayEvent);
  }
}

class PiPrompt extends AbstractUserPrompt {
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
