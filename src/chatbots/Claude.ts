import { Observation } from "../dom/Observation";
import { Chatbot, UserPrompt } from "./Chatbot";

class ClaudeChatbot implements Chatbot {
  getName(): string {
    return "Claude";
  }

  getPrompt(element: HTMLElement): UserPrompt {
    return new ClaudePrompt(element);
  }
  getPromptTextInputSelector(): string {
    return "div[enterkeyhint]";
  }

  getPromptSubmitButtonSelector(): string {
    return "#saypi-prompt-controls-container button.bg-accent-main-100:last-of-type:not(:has(~ * button))";
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
    return "/chat";
  }

  isChatablePath(path: string): boolean {
    // routes on which Claude can chat
    return path.includes("/new") || path.includes("/chat");
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

  getDiscoveryPanelSelector(): string {
    // note: depends on the side panel having already been identified
    return "#saypi-side-panel + div";
  }

  getExtraCallButtonClasses(): string[] {
    return ["rounded-full"];
  }
}

class ClaudePrompt extends UserPrompt {
  private promptElement: HTMLDivElement = this.element as HTMLDivElement;
  private placeholderManager: PlaceholderManager;
  readonly PROMPT_CHARACTER_LIMIT = 200000; // max prompt length is the same as context window length, 200k tokens

  constructor(element: HTMLElement) {
    super(element);
    const observation = this.findAndDecorateCustomPlaceholderElement(element);
    this.placeholderManager = new PlaceholderManager(
      element,
      observation.target as HTMLElement,
      this.getDefaultPlaceholderText()
    );
  }

  findAndDecorateCustomPlaceholderElement(prompt: HTMLElement): Observation {
    const existing = prompt.parentElement?.querySelector(
      "p.custom-placeholder"
    );
    if (existing) {
      return Observation.foundAlreadyDecorated("claude-placeholder", existing);
    } else {
      const placeholder = document.createElement("p");
      placeholder.classList.add("custom-placeholder", "text-text-500");
      placeholder.id = "claude-placeholder";
      // add placeholder element as a sibling to the prompt element
      prompt.insertAdjacentElement("afterend", placeholder);
      return new Observation(placeholder, placeholder.id, true, true, true);
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
      "p[!data-placeholder]"
    );
    promptParagraphs.forEach((p) => {
      p.remove();
    });
  }
}

class PlaceholderManager {
  private input: HTMLElement;
  private placeholder: HTMLElement;
  private placeholderText: string;
  private inputHandler: EventListener;

  constructor(
    inputElement: HTMLElement,
    placeholderElement: HTMLElement,
    initialPlaceholder: string
  ) {
    this.input = inputElement;
    this.placeholder = placeholderElement;
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

  updatePlaceholderVisibility() {
    if (this.input.textContent?.trim() === "") {
      this.placeholder.style.display = "block";
      this.hideClaudePlaceholder();
    } else {
      this.placeholder.style.display = "none";
      this.showClaudePlaceholder();
    }
  }

  setPlaceholder(newPlaceholder: string) {
    this.placeholderText = newPlaceholder;
    this.placeholder.textContent = this.placeholderText;
    this.updatePlaceholderVisibility();
  }

  getPlaceholder() {
    return this.placeholderText;
  }

  private getClaudePlaceholder(): HTMLParagraphElement | null {
    return this.input.querySelector("p[data-placeholder]");
  }
  private showClaudePlaceholder() {
    const placeholder = this.getClaudePlaceholder();
    if (placeholder) {
      placeholder.style.display = "block";
    }
  }
  private hideClaudePlaceholder() {
    const placeholder = this.getClaudePlaceholder();
    if (placeholder) {
      placeholder.style.display = "none";
    }
  }
}

export { ClaudeChatbot };
