import { AssistantResponse, MessageControls } from "../dom/MessageElements";
import { Observation } from "../dom/Observation";
import { UserPreferenceModule } from "../prefs/PreferenceModule";
import {
  AddedText,
  ChangedText,
  ElementTextStream,
  InputStreamOptions,
} from "../tts/InputStream";
import { TTSControlsModule } from "../tts/TTSControlsModule";
import { VoiceSelector } from "../tts/VoiceMenu";
import { Chatbot, UserPrompt } from "./Chatbot";
import { ClaudeVoiceMenu } from "./ClaudeVoiceMenu";

class ClaudeChatbot implements Chatbot {
  private promptCache: Map<HTMLElement, ClaudePrompt> = new Map();

  getName(): string {
    return "Claude";
  }

  getID(): string {
    return "claude";
  }

  getVoiceMenu(
    preferences: UserPreferenceModule,
    element: HTMLElement
  ): VoiceSelector {
    return new ClaudeVoiceMenu(this, preferences, element);
  }

  getPrompt(element: HTMLElement): UserPrompt {
    if (!this.promptCache.has(element)) {
      this.promptCache.set(element, new ClaudePrompt(element));
    }
    return this.promptCache.get(element) as ClaudePrompt;
  }

  getPromptTextInputSelector(): string {
    return "div[enterkeyhint]";
  }

  getPromptSubmitButtonSelector(): string {
    return "#saypi-prompt-controls-container button.bg-accent-main-100:last-of-type:not(:has(~ * button))";
  }

  getAudioControlsSelector(): string {
    return "#saypi-prompt-ancestor div.min-h-4.flex-1.items-center"; // for Claude, the audio controls are in the prompt editor
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
    return "/chat";
  }

  isChatablePath(path: string): boolean {
    // routes on which Claude can chat
    return (
      path.includes("/new") ||
      path.includes("/chat") ||
      path.includes("/project")
    );
  }

  getVoiceMenuSelector(): string {
    return ".voice-menu"; // we define our own voice menu for Claude
  }

  getVoiceSettingsSelector(): string {
    return "div.mx-auto.w-full.px-6.py-10 > div.grid.grid-cols-2.gap-4";
  }

  getChatHistorySelector(): string {
    return ".flex-1.flex.flex-col.gap-3.px-4.max-w-3xl.mx-auto.w-full.pt-1";
  }

  getPastChatHistorySelector(): string {
    return "#saypi-chat-history"; // identical to chat history
  }

  getRecentChatHistorySelector(): string {
    return "#saypi-chat-history"; // identical to chat history
  }

  getDiscoveryPanelSelector(): string {
    // note: depends on the side panel having already been identified
    return "#saypi-side-panel + div";
  }

  getAssistantResponseSelector(): string {
    return 'div[data-is-streaming]:has(div[class*="font-claude-message"])';
  }

  getAssistantResponseContentSelector(): string {
    return "div[class*='font-claude-message']";
  }

  getAssistantResponse(
    element: HTMLElement,
    includeInitialText?: boolean
  ): AssistantResponse {
    return new ClaudeResponse(element, includeInitialText);
  }

  getExtraCallButtonClasses(): string[] {
    return ["claude-call-button"];
  }

  getContextWindowCapacityCharacters(): number {
    return 200000; // Claude has a 200k token limit
  }
}

class ClaudeResponse extends AssistantResponse {
  constructor(element: HTMLElement, includeInitialText?: boolean) {
    super(element, includeInitialText);
  }

  get contentSelector(): string {
    return "div[class*='font-claude-message']";
  }

  createTextStream(
    content: HTMLElement,
    options: InputStreamOptions
  ): ElementTextStream {
    return new ClaudeTextBlockCapture(content, options);
  }

  decorateControls(): MessageControls {
    return new ClaudeMessageControls(this, this.ttsControlsModule);
  }
}

class ClaudeMessageControls extends MessageControls {
  constructor(message: AssistantResponse, ttsControls: TTSControlsModule) {
    super(message, ttsControls);
  }

  protected getExtraControlClasses(): string[] {
    return ["text-xs"];
  }

  getHoverMenuSelector(): string {
    return "div.flex.items-stretch";
  }
}

/**
 * A ClaudeTextBlockCapture is a simplified ElementTextStream that captures Claude's response
 * as a single block of text, rather than as individual paragraphs or list items.
 * This approach is slower than the ClaudeTextStream, but is more reliable and straightforward.
 */
class ClaudeTextBlockCapture extends ElementTextStream {
  handleMutationEvent(mutation: MutationRecord): void {
    // no-op
  }
  constructor(
    element: HTMLElement,
    options: InputStreamOptions = { includeInitialText: false }
  ) {
    super(element, options);

    const messageElement = element.parentElement;
    if (messageElement && messageElement.hasAttribute("data-is-streaming")) {
      const messageObserver = new MutationObserver((mutations) => {
        const isStreaming = messageElement.getAttribute("data-is-streaming");
        const streamingInProgress = isStreaming === "true";
        if (streamingInProgress) {
          console.log("Claude is streaming...");
        }
        mutations.forEach((mutation) => {
          const streamingChanged =
            mutation.attributeName === "data-is-streaming";
          const streamingStarted = streamingChanged && isStreaming === "true";
          const streamingStopped = streamingChanged && isStreaming === "false";
          if (streamingStarted) {
            console.log("Claude started streaming...");
          } else if (streamingStopped) {
            const text = this.getNestedText(element);
            this.subject.next(new AddedText(text));
            this.subject.complete();
          }
        });
      });
      messageObserver.observe(messageElement, {
        childList: false,
        subtree: false,
        characterData: false,
        attributes: true,
      });
    }
  }

  getNestedText(node: HTMLElement): string {
    return node.textContent ?? node.innerText ?? "";
  }
}

class ClaudeTextStream extends ElementTextStream {
  private lastContentBlock: HTMLElement | null = null; // this will be a "block" element, like a paragraph or list item
  private blockElements = [
    "P",
    "OL",
    "UL",
    "DIV",
    "H1",
    "H2",
    "H3",
    "H4",
    "H5",
    "H6",
  ];
  constructor(
    element: HTMLElement,
    options: InputStreamOptions = { includeInitialText: true }
  ) {
    super(element, options);

    const messageElement = element.parentElement;
    if (messageElement && messageElement.hasAttribute("data-is-streaming")) {
      const messageObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === "data-is-streaming") {
            const isStreaming =
              messageElement.getAttribute("data-is-streaming");
            if (isStreaming === "false") {
              const finalParagraph = this.element.querySelector("p:last-child");
              const text = this.getNestedText(finalParagraph as HTMLElement);
              console.log("Claude says: ", text);
              this.subject.next(new AddedText(text));
              this.subject.complete();
            }
          }
        });
      });
      messageObserver.observe(messageElement, {
        childList: false,
        subtree: false,
        characterData: false,
        attributes: true,
      });
    }

    throw new Error("Text stream not implemented. Use block capture instead."); // use the block capture approach instead, for now
  }

  getNestedText(node: HTMLElement): string {
    return node.textContent ?? node.innerText ?? "";
  }

  handleMutationEvent(mutation: MutationRecord): void {
    // auto generated method stub
    if (mutation.type === "childList") {
      const addedNodes = Array.from(mutation.addedNodes) as HTMLElement[];

      for (const node of addedNodes) {
        if (
          node.nodeType === Node.ELEMENT_NODE &&
          this.blockElements.includes(node.tagName)
        ) {
          if (node.tagName === "OL" || node.tagName === "UL") {
            const lastListItem = node.querySelector(
              "li:last-child"
            ) as HTMLElement;
            if (lastListItem && lastListItem.tagName === "LI") {
              const listItemText = this.getNestedText(lastListItem);
              console.log("Claude says: ", listItemText);
              this.subject.next(new AddedText(listItemText));
              this.lastContentBlock = null; // prevent the final list item from being emitted twice
            }
          } else {
            this.lastContentBlock = node as HTMLElement;
          }
        } else if (
          node.nodeType === Node.TEXT_NODE &&
          node.textContent === "\n" &&
          this.lastContentBlock
        ) {
          // paragraph separator reached, emit the text of the last paragraph
          const text = this.getNestedText(this.lastContentBlock);
          console.log("Claude says: ", text);
          this.subject.next(new AddedText(text));
          // this approach omits the final paragraph of the stream, since it is not followed by a paragraph separator
        }
      }
    }
  }
}

function findAndDecorateCustomPlaceholderElement(
  prompt: HTMLElement
): Observation {
  const existing = prompt.parentElement?.querySelector("#claude-placeholder");
  if (existing) {
    return Observation.foundAlreadyDecorated("claude-placeholder", existing);
  } else {
    // find and copy the existing placeholder element
    const originalPlaceholder = prompt.querySelector("p[data-placeholder]");
    const placeholder = originalPlaceholder
      ? (originalPlaceholder.cloneNode(true) as HTMLElement)
      : document.createElement("p");
    placeholder.classList.add("custom-placeholder");
    placeholder.id = "claude-placeholder";
    // add custom placeholder element as a sibling to the prompt element (sic)
    prompt.insertAdjacentElement("afterend", placeholder);
    return new Observation(placeholder, placeholder.id, true, true, true);
  }
}

class ClaudePrompt extends UserPrompt {
  private promptElement: HTMLDivElement;
  private placeholderManager!: PlaceholderManager; // initialized from the constructor
  readonly PROMPT_CHARACTER_LIMIT = 200000; // max prompt length is the same as context window length, 200k tokens

  constructor(element: HTMLElement) {
    super(element);
    this.promptElement = element as HTMLDivElement;
    this.initializePlaceholderManager(this.promptElement);
  }

  /**
   * Initialize the placeholder manager for the prompt element
   * This method is self-healing, in that it will reinitialize the placeholder manager
   * if the custom placeholder element is removed from the DOM for any reason.
   */
  initializePlaceholderManager(promptElement: HTMLElement): void {
    const observation = findAndDecorateCustomPlaceholderElement(promptElement);
    if (!observation.found) {
      console.error(
        "Failed to find or decorate the custom placeholder element for Claude's prompt."
      );
      return;
    }

    // Create new placeholder manager
    this.placeholderManager = new PlaceholderManager(
      promptElement,
      observation.target as HTMLElement,
      this.getDefaultPlaceholderText()
    );
    console.debug("Placeholder manager initialized");

    // Add mutation observer to detect when target is removed
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          const removedNodes = Array.from(mutation.removedNodes);
          if (removedNodes.includes(observation.target as Node)) {
            console.debug(
              "Custom placeholder element removed, reinitializing..."
            );
            // Target was removed, reinitialize
            observer.disconnect();
            this.initializePlaceholderManager(promptElement);
          }
        }
      });
    });

    // Observe the parent element for child removals (can be null if removed from DOM)
    const promptContainer = promptElement.parentElement
      ? promptElement.parentElement
      : document.getElementsByClassName("saypi-prompt-container")[0];
    if (promptContainer) {
      observer.observe(promptContainer as Node, {
        childList: true,
        subtree: false,
      });
    } else {
      console.error(
        "Prompt element parent element not found, cannot observe for placeholder removals."
      );
    }
  }

  setText(text: string): void {
    this.promptElement.innerText = text;
  }
  getText(): string {
    return this.promptElement.innerText;
  }

  /**
   * Set the placeholder text for the prompt element, which is displayed when the prompt is empty
   * @param text
   */
  setPlaceholderText(text: string): void {
    this.placeholderManager.setPlaceholder(text);
  }

  /**
   * Get the placeholder text for the prompt element, which is displayed when the prompt is empty
   * @returns placeholder text or empty string if the prompt is not empty
   */
  getPlaceholderText(): string {
    const placeholder = this.promptElement.querySelector(
      "p[data-placeholder]"
    ) as HTMLParagraphElement;
    return (
      this.placeholderManager.getPlaceholder() ||
      placeholder?.getAttribute("data-placeholder") ||
      ""
    );
  }

  getDefaultPlaceholderText(): string {
    const placeholder = this.promptElement.querySelector(
      "p[data-placeholder]"
    ) as HTMLParagraphElement;
    return placeholder?.getAttribute("data-placeholder") || "Talk to Claude...";
  }

  /**
   * Clear the prompt element
   */
  clear(): void {
    this.placeholderManager.setPlaceholder("");
    const promptParagraphs = this.promptElement.querySelectorAll(
      "p:not([data-placeholder])"
    );
    promptParagraphs.forEach((p) => {
      p.remove();
    });
  }
}

class PlaceholderManager {
  private input: HTMLElement;
  private customPlaceholder: HTMLElement | null;
  private placeholderText: string;
  private inputHandler: EventListener;

  constructor(
    inputElement: HTMLElement,
    placeholderElement: HTMLElement,
    initialPlaceholder: string
  ) {
    this.input = inputElement;
    this.customPlaceholder = placeholderElement;
    this.placeholderText = initialPlaceholder;
    this.inputHandler = this.handleInput.bind(this);
    this.initializePlaceholder();
  }

  initializePlaceholder() {
    this.setPlaceholder(this.placeholderText);
    this.input.addEventListener("input", this.inputHandler);
    this.updatePlaceholderVisibility();
  }

  handleInput() {
    this.updatePlaceholderVisibility();
  }

  isPromptEmpty() {
    return this.input.textContent === "";
  }

  promptEmptied() {
    this.showCustomPlaceholder();
    this.hideStandardPlaceholder();
  }

  promptFilled() {
    this.hideCustomPlaceholder();
  }

  updatePlaceholderVisibility() {
    if (this.isPromptEmpty()) {
      this.promptEmptied();
    } else {
      this.promptFilled();
    }
  }

  setPlaceholder(newPlaceholder: string) {
    this.placeholderText = newPlaceholder;
    // only set the placeholder text if the prompt is empty
    if (this.isPromptEmpty()) {
      this.getOrCreateCustomPlaceholder().textContent = this.placeholderText;
      this.updatePlaceholderVisibility();
    }
  }

  getPlaceholder() {
    return this.placeholderText;
  }

  /**
   * Get Claude's own placeholder element, which is hidden when the prompt is not empty
   */
  protected getStandardPlaceholder(): HTMLParagraphElement | null {
    return this.input.querySelector("p[data-placeholder]");
  }
  private showStandardPlaceholder() {
    const placeholder = this.getStandardPlaceholder();
    if (placeholder) {
      placeholder.style.visibility = "visible";
    }
  }
  private hideStandardPlaceholder() {
    const placeholder = this.getStandardPlaceholder();
    if (placeholder) {
      placeholder.style.visibility = "hidden";
    }
  }

  private getOrCreateCustomPlaceholder(): HTMLElement {
    if (this.customPlaceholder) {
      return this.customPlaceholder;
    }
    const placeholder = findAndDecorateCustomPlaceholderElement(this.input);
    if (placeholder.found) {
      this.customPlaceholder = placeholder.target as HTMLElement;
      return this.customPlaceholder;
    }
    throw new Error(
      "Failed to find or create the custom placeholder element. Ensure the prompt is empty."
    );
  }

  private showCustomPlaceholder() {
    this.customPlaceholder = this.getOrCreateCustomPlaceholder();
  }

  private hideCustomPlaceholder() {
    if (this.customPlaceholder) {
      // remove the custom placeholder element from the DOM
      this.customPlaceholder.parentNode?.removeChild(this.customPlaceholder);
      this.customPlaceholder = null;
    }
  }
}

export { ClaudeChatbot, ClaudePrompt };
