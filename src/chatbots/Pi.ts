import { AssistantResponse, MessageControls, UserMessage } from "../dom/MessageElements";
import { UserPreferenceModule } from "../prefs/PreferenceModule";
import { SpeechSynthesisVoiceRemote } from "../tts/SpeechModel";
import { PiSpeechSourceParser } from "../tts/SpeechSourceParsers";
import { TTSControlsModule } from "../tts/TTSControlsModule";
import { VoiceSelector } from "../tts/VoiceMenu";
import { UserPrompt } from "./Chatbot";
import { AbstractChatbot, AbstractUserPrompt } from "./AbstractChatbots";
import { PiVoiceMenu } from "./PiVoiceMenu";
import { PiResponse } from "./pi/PiResponse";

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
    // Pi.ai has different DOM structures for input vs textarea prompts:
    // - Textarea: buttons are siblings to .saypi-prompt-container (return parent)
    // - Input: buttons are children of .saypi-prompt-container (return container itself)
    const promptElement = promptContainer.querySelector('#saypi-prompt');
    if (promptElement && promptElement.tagName.toLowerCase() === 'input') {
      // Input element: buttons should be inside the prompt container
      return promptContainer;
    }
    // Textarea element: buttons should be siblings to prompt container
    return promptContainer.parentElement as HTMLElement;
  }

  getPromptTextInputSelector(): string {
    // Match both new chat (input) and existing chat (textarea) prompt elements
    // See doc/dom/pi/prompt-selectors.md for details
    return "textarea[enterkeyhint], input[type='text'][placeholder]";
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
    return "/talk";
  }

  isChatablePath(path: string): boolean {
    // true if path starts with /talk or /discover
    return path.startsWith("/talk") || path.startsWith("/discover") || path.startsWith("/threads") || path.startsWith("/profile");
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

  protected createAssistantResponse(element: HTMLElement, includeInitialText?: boolean, isStreaming?: boolean): AssistantResponse {
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

  simulateFormSubmit(): boolean {
    // Pi.ai uses the standard SayPi submit button, so fallback to keyboard events
    const textarea = document.getElementById("saypi-prompt");
    if (textarea) {
      const enterEvent = new KeyboardEvent("keydown", {
        bubbles: true,
        key: "Enter",
        keyCode: 13,
        which: 13,
      });
      textarea.dispatchEvent(enterEvent);
      console.debug("Dispatched Enter keydown event to Pi at", Date.now());
      return true;
    }
    
    console.error("Cannot simulate submit for Pi: No textarea found.");
    return false;
  }
}


class PiPrompt extends AbstractUserPrompt {
  // Support both textarea (existing chats) and input (new chats)
  private inputElement: HTMLTextAreaElement | HTMLInputElement = this.element as HTMLTextAreaElement | HTMLInputElement;
  readonly PROMPT_CHARACTER_LIMIT = 4000;

  setText(text: string): void {
    this.setNativeValue(this.inputElement, text);
    if (this.isTextArea(this.inputElement)) {
      this.scrollToBottom(this.inputElement);
    }
  }
  getText(): string {
    return this.inputElement.value;
  }
  setPlaceholderText(text: string): void {
    this.inputElement.placeholder = text;
    if (this.isTextArea(this.inputElement)) {
      this.scrollToBottom(this.inputElement);
    }
  }
  getPlaceholderText(): string {
    return this.inputElement.placeholder;
  }
  getDefaultPlaceholderText(): string {
    return this.inputElement.placeholder;
  }

  private isTextArea(element: HTMLTextAreaElement | HTMLInputElement): element is HTMLTextAreaElement {
    return element.tagName.toLowerCase() === 'textarea';
  }

  setNativeValue(element: HTMLTextAreaElement | HTMLInputElement, value: string) {
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

export { PiAIChatbot, PiPrompt };
