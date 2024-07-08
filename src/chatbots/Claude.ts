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
    return "#saypi-prompt-controls-container button:last-of-type:not(:has(~ * button))";
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
  readonly PROMPT_CHARACTER_LIMIT = 200000; // max prompt length is the same as context window length, 200k tokens

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
    const placeholder = this.promptElement.querySelector(
      "p[data-placeholder]"
    ) as HTMLParagraphElement;
    placeholder?.setAttribute("data-placeholder", text);
  }

  /**
   * Get the placeholder text for the prompt element, which is displayed when the prompt is empty
   * @returns placeholder text or empty string if the prompt is not empty
   */
  getPlaceholderText(): string {
    const placeholder = this.promptElement.querySelector(
      "p[data-placeholder]"
    ) as HTMLParagraphElement;
    return placeholder?.getAttribute("data-placeholder") || "";
  }

  /**
   * Clear the prompt element
   */
  clear(): void {
    const promptParagraphs = this.promptElement.querySelectorAll(
      "p[!data-placeholder]"
    );
    promptParagraphs.forEach((p) => {
      p.remove();
    });
  }
}

export { ClaudeChatbot };
