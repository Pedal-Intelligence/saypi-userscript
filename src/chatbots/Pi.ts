import { AssistantResponse, MessageControls } from "../dom/MessageElements";
import EventBus from "../events/EventBus";
import { UserPreferenceModule } from "../prefs/PreferenceModule";
import {
  AddedText,
  ChangedText,
  Completion,
  ElementTextStream,
  InputStreamOptions,
} from "../tts/InputStream";
import { TTSControlsModule } from "../tts/TTSControlsModule";
import { PiVoiceMenu, VoiceSelector } from "../tts/VoiceMenu";
import { Chatbot, UserPrompt } from "./Chatbot";

class PiAIChatbot implements Chatbot {
  getName(): string {
    return "Pi";
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
  static DATA_TIMEOUT = 1000;
  static DEFAULT_ADDITIONAL_TIMEOUT = 0;
  // Timeout values above base for different languages - derived from empirical testing on pi.ai
  static LANGUAGE_TIMEOUTS: { [key: string]: number } = {
    en: 0,
    ar: 3000,
    de: 250,
    es: 250,
    fr: 1500,
    hi: 1500,
    it: 0,
    nl: 0,
    pl: 750,
    pt: 1000,
    ja: 1000,
    ko: 1250,
    ru: 2500,
    uk: 2250,
    zh: 0,
    bg: 1500,
    hr: 250,
    cs: 750,
    da: 1500,
    tl: 250,
    fi: 250,
    el: 1250,
    id: 0,
    ms: 1000,
    ro: 750,
    sk: 1000,
    sv: 1250,
    ta: 500,
    tr: 750,
  };
  lastParagraphAdded: HTMLDivElement;
  spansAdded: number;
  spansRemoved: number;
  spansReplaced: number;
  stillChanging: boolean;
  additionalDelay: number = 0;

  constructor(element: HTMLElement, options?: InputStreamOptions) {
    super(element, options);

    this.lastParagraphAdded = this.element.querySelectorAll("div")?.item(0);
    this.spansAdded = 0;
    this.spansRemoved = 0;
    this.spansReplaced = 0;
    this.stillChanging = false;
    this.additionalDelay = 0;

    EventBus.on("saypi:tts:text:delay", this.handleDelayEvent);
  }

  // override
  // visible for testing
  calculateStreamTimeout(): number {
    const baseDelay = super.calculateStreamTimeout();
    const additionalDelay = this.additionalDelay || 0; // default to 0 if additionalDelay is undefined or NaN
    const totalTimeout = baseDelay + additionalDelay;
    return totalTimeout;
  }

  /**
   * The data timeout is the time to wait after the last change event before
   * considering the stream to be complete.
   * This differs from the stream timeout, which is the time to wait after the
   * start of the stream before considering it to be complete.
   */
  calculateDataTimeout(text: string, lang: string): number {
    // Extract the base language code (e.g., 'en' from 'en-US')
    const baseLanguage = lang.split("-")[0];

    const additionalTimeout =
      PiTextStream.LANGUAGE_TIMEOUTS[baseLanguage] ??
      PiTextStream.DEFAULT_ADDITIONAL_TIMEOUT;
    const totalTime = PiTextStream.DATA_TIMEOUT + additionalTimeout;
    console.debug(
      `Timeout for "${text}" in ${lang} (base: ${baseLanguage}) is ${totalTime}ms (${PiTextStream.DATA_TIMEOUT} + ${additionalTimeout})`
    );
    return totalTime;
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

  handleMutationEvent = (mutation: MutationRecord) => {
    if (this.closed()) {
      console.debug(
        `Skipping change event on ${mutation.target} because the stream has already been completed`,
        mutation
      );
      return;
    }

    if (mutation.type === "childList") {
      for (let i = 0; i < mutation.removedNodes.length; i++) {
        const node = mutation.removedNodes[i];
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as HTMLElement;
          if (element.tagName === "SPAN") {
            this.spansRemoved++;
          }
        }
      }
      for (let i = 0; i < mutation.addedNodes.length; i++) {
        this.stillChanging = true;
        const node = mutation.addedNodes[i];
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as HTMLElement;
          if (element.tagName === "SPAN") {
            this.spansAdded++;
          } else if (element.tagName === "DIV") {
            const paragraph = element as HTMLDivElement;
            this.lastParagraphAdded = paragraph;
          }
        } else if (node.nodeType === Node.TEXT_NODE) {
          const textNode = node as Text;
          const content = textNode.textContent || "";
          this.next(new AddedText(content || ""));
          this.spansReplaced++;
          // we're finished when the paragraph has no more preliminary content
          const paragraph = textNode.parentElement;
          const spansRemaining =
            paragraph?.querySelectorAll("span")?.length || 0;
          const isFinalParagraph = paragraph === this.lastParagraphAdded;

          if (
            this.spansReplaced >= this.spansRemoved &&
            this.spansReplaced >= this.spansAdded &&
            spansRemaining === 0 &&
            isFinalParagraph
          ) {
            this.stillChanging = false;
            // complete soon if not still changing
            const startTime = Date.now();
            const additionsRemaining = mutation.addedNodes.length - i - 1;
            console.debug(
              `Possible end of stream detected on ${content}, ${additionsRemaining} additions remaining.`
            );
            setTimeout(() => {
              if (!this.stillChanging) {
                const timeElapsed = Date.now() - startTime;
                const lastContent = this.emittedValues.slice(-1)[0]?.text;
                console.debug(
                  `end of stream confirmed as "${lastContent}", +${timeElapsed}ms after last change event`
                );
                this.complete({ type: "eod", time: Date.now() });
              }
            }, this.calculateDataTimeout(content, this.languageGuess));
          }
        }
      }
    } else if (mutation.type === "characterData") {
      const textNode = mutation.target as Text;
      const content = textNode.textContent;
      // text node content changed from "${mutation.oldValue}" to "${content}"`
      // emit a change event only if the old value is present in the already emitted values
      const oldValue = mutation.oldValue || "";
      const alreadyEmitted = this.emittedValues.some(
        (value) => value.text === oldValue
      );
      if (alreadyEmitted) {
        this.stillChanging = true;
        this.next(new ChangedText(content || "", oldValue));
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

export { PiAIChatbot, PiResponse, PiTextStream, PiPrompt };
