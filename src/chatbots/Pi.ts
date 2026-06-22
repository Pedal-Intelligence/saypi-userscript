import { AssistantResponse, UserMessage } from "../dom/MessageElements";
import { UserPreferenceModule } from "../prefs/PreferenceModule";
import { SpeechSynthesisVoiceRemote } from "../tts/SpeechModel";
import { PiSpeechSourceParser } from "../tts/SpeechSourceParsers";
import { VoiceSelector } from "../tts/VoiceMenu";
import { UserPrompt, SidebarConfig } from "./Chatbot";
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
    // Match both new chat and existing chat textarea prompt elements
    // - Existing chats: textarea with enterkeyhint attribute
    // - New chats: textarea with non-empty placeholder (no enterkeyhint)
    // See doc/dom/pi/prompt-selectors.md for details
    return "textarea[enterkeyhint], textarea[placeholder]:not([placeholder=''])";
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
    // Voice on/off button is the first button inside Pi's audio controls.
    // Pi moved the buttons into an `inline-flex` wrapper and the row container
    // dropped `items-center` (now `z-10`), so match the wrapper generically.
    return ".saypi-audio-controls > div > div.relative.flex.justify-end.self-end > div > button";
  }

  getControlPanelSelector(): string {
    return ".flex.items-center.grow";
  }

  getSidebarSelector(): string {
    // Pi.ai redesigned the sidebar (verified live 2026-06-20): it is now a
    // <nav data-testid="side-navbar" aria-label="Side menu"> (was a <div>) whose
    // colour tokens changed too — `h-screen`→`h-[100dvh]`, `border-neutral-300`→
    // `border-divider-stroke`, `bg-neutral-50`→`bg-background-alt` — so the old
    // class-literal selector matched 0 and the settings button was never added (#350).
    //
    // Anchor primarily on the stable `data-testid="side-navbar"`. Fall back to a
    // tag-agnostic STRUCTURAL match (`z-[999]` + a bordered flex column) that survives
    // both the colour-token churn and the tag change, in case the test id is dropped.
    // (getSidebarConfig's inner header/menu anchors are unchanged and still resolve.)
    return 'nav[data-testid="side-navbar"], [class~="z-[999]"][class~="flex-col"][class~="overflow-hidden"][class~="border-r"]';
  }

  getChatPath(): string {
    return "/talk";
  }

  isChatablePath(path: string): boolean {
    // true for talk, discover, threads, and profile voice settings (but not account settings)
    return path.startsWith("/talk") || path.startsWith("/discover") || path.startsWith("/threads") || path.startsWith("/profile") && !path.endsWith("/account");
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
    // Direct-child combinator (`>`): the 2nd DIRECT child of the chat history
    // container. Without `>`, the descendant combinator matches the first nested
    // 2nd-child anywhere (e.g. an icon SVG element), not the container (#309).
    return "#saypi-chat-history > :nth-child(2)";
  }

  getRecentChatHistorySelector(): string {
    // Direct-child combinator (`>`): the 3rd DIRECT child (the present/recent
    // container holding the most-recent turn). The old descendant form
    // ("#saypi-chat-history :nth-child(3)") matched an action-bar icon's
    // <circle> SVG instead, so the recent container was never observed and the
    // most-recent message went undecorated (#309).
    return "#saypi-chat-history > :nth-child(3)";
  }

  getDiscoveryPanelSelector(): string {
    // note: depends on the sidebar having already been identified
    return "#saypi-sidebar + div, #saypi-side-panel + div";
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

  supportsFocusMode(): boolean {
    return true;
  }

  getSidebarConfig(sidebar: HTMLElement): SidebarConfig | null {
    // Pi.ai's sidebar structure (Oct 2025):
    // div.sidebar (root, found by getSidebarSelector)
    //   └── div.header (first child, contains pt-* pb-* classes)
    //       └── div.menu (flex flex-col items-start - contains nav buttons)
    //
    // We need to add our buttons to div.menu, using Pi's menu-style buttons

    // Find the header (first child with pt-* pb-* padding classes)
    const header = sidebar.querySelector('div[class*="pt-"][class*="pb-"]');
    if (!header) {
      console.warn('Pi sidebar: Could not find header element');
      return null;
    }

    // Find the menu container within header
    const menu = header.querySelector('div.flex.flex-col.items-start');
    if (!menu) {
      console.warn('Pi sidebar: Could not find menu container');
      return null;
    }

    // Mark the sidebar for styling
    sidebar.id = "saypi-sidebar";
    sidebar.classList.add("saypi-sidebar", "saypi-control-panel");
    sidebar.classList.add("saypi-side-panel"); // legacy class for transition

    return {
      buttonContainer: menu as HTMLElement,
      buttonStyle: 'menu',  // Use menu-style buttons to match Pi's sidebar
      // Group SayPi's Focus + Voice settings at the TOP of the menu. Pi streams its
      // nav items in after the <nav> mounts, so an index like 2 ("after Discover")
      // was non-deterministic — when decoration ran before the native items rendered
      // the buttons landed at the top anyway, and interleaved the native group on
      // fresh loads. Position 0 pins them above the native items consistently.
      insertPosition: 0
    };
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
