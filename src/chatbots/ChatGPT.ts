import { AssistantResponse, MessageControls, UserMessage } from "../dom/MessageElements";
import { Observation } from "../dom/Observation";
import EventBus from "../events/EventBus";
import { UserPreferenceModule } from "../prefs/PreferenceModule";
import {
  AddedText,
  ChangedText,
  ElementTextStream,
  InputStreamOptions,
} from "../tts/InputStream";
import { TextInsertionManager } from "../text-insertion/TextInsertionManager";
import { TTSControlsModule } from "../tts/TTSControlsModule";
import { VoiceSelector } from "../tts/VoiceMenu";
import { AbstractChatbot, AbstractUserPrompt } from "./AbstractChatbots";
import { UserPrompt } from "./Chatbot";
import { findControlsContainerInComposer, findPromptInputInComposer, getScopedSubmitSelector } from "./chatgpt/ComposerSelectors";
import { getAssistantContentSelector, getAssistantResponseSelectorScopedToThread } from "./chatgpt/MessageSelectors";
import { findThreadRoot } from "./chatgpt/HistorySelectors";
// import { ChatGPTVoiceMenu } from "./ChatGPTVoiceMenu"; // TODO: Phase 3

class ChatGPTChatbot extends AbstractChatbot {
  private promptCache: Map<HTMLElement, ChatGPTPrompt> = new Map();

  getName(): string {
    return "ChatGPT";
  }

  getID(): string {
    return "chatgpt";
  }

  getVoiceMenu(
    preferences: UserPreferenceModule,
    element: HTMLElement
  ): VoiceSelector {
    // TODO: Phase 3 - return new ChatGPTVoiceMenu(this, preferences, element);
    // For Phase 1, return null to indicate no voice menu
    return null as any;
  }

  getPrompt(element: HTMLElement): UserPrompt {
    if (!this.promptCache.has(element)) {
      this.promptCache.set(element, new ChatGPTPrompt(element));
    }
    return this.promptCache.get(element) as ChatGPTPrompt;
  }

  /**
   * Get the prompt input editor element (ProseMirror)
   * @param searchRoot Search is optimised to start in the search root element, but will fall back to the document if not found
   * @returns The prompt input element, or null if not found
   */
  getPromptInput(searchRoot: Element): HTMLElement {
    return (findPromptInputInComposer(searchRoot) || undefined) as unknown as HTMLElement;
  }

  getPromptContainer(prompt: HTMLElement): HTMLElement {
    // Find the composer container (CONFIRMED: uses .composer-parent)
    return prompt.closest('.composer-parent') as HTMLElement ||
           prompt.closest('.relative') as HTMLElement ||
           prompt.parentElement as HTMLElement;
  }

  getPromptControlsContainer(promptContainer: HTMLElement): HTMLElement {
    return (findControlsContainerInComposer(promptContainer) || promptContainer) as HTMLElement;
  }

  getPromptTextInputSelector(): string {
    return '#prompt-textarea.ProseMirror[contenteditable="true"]';
  }

  getPromptSubmitButtonSelector(): string {
    return getScopedSubmitSelector();
  }

  getAudioControls(searchRoot: Element): HTMLElement {
    // ChatGPT doesn't have existing audio controls in Phase 1
    // We'll add our own call button
    return null as any;
  }

  getAudioControlsSelector(): string {
    return "";
  }

  getAudioOutputButtonSelector(): string {
    return "";
  }

  getControlPanelSelector(): string {
    return '.composer-parent';
  }

  getSidePanelSelector(): string {
    return 'nav[aria-label="Chat history"]';
  }

  getChatPath(): string {
    return "/";
  }

  isChatablePath(path: string): boolean {
    // Support chatgpt.com, chat.com and their subpaths
    const host = window.location.hostname;
    const supportedHosts = ['chatgpt.com', 'chat.com', 'chat.openai.com'];
    
    if (!supportedHosts.some(h => host.includes(h))) {
      return false;
    }

    // Chat paths: /, /c/*, /g/*, etc.
    return path === "/" || 
           path.startsWith("/c/") || 
           path.startsWith("/g/") ||
           path.startsWith("/share/");
  }

  getVoiceMenuSelector(): string {
    return ""; // No voice menu in Phase 1
  }

  getVoiceSettingsSelector(): string {
    return ""; // No voice settings in Phase 1
  }

  getChatHistory(searchRoot: HTMLElement): HTMLElement {
    // Only return a concrete history root when it's available; otherwise defer setup
    const thread = findThreadRoot(searchRoot) as HTMLElement | null;
    return (thread as HTMLElement) || (null as unknown as HTMLElement);
  }

  getChatHistorySelector(): string {
    // Prefer explicit thread id when available
    return '#thread';
  }

  getPastChatHistorySelector(): string {
    return this.getChatHistorySelector();
  }

  getRecentChatHistorySelector(): string {
    return this.getChatHistorySelector();
  }

  getDiscoveryPanelSelector(): string {
    return "";
  }

  getAssistantResponseSelector(): string {
    // Prefer content blocks scoped to the thread root when present, with global fallback
    return getAssistantResponseSelectorScopedToThread();
  }

  getAssistantResponseContentSelector(): string {
    return getAssistantContentSelector();
  }

  getUserPromptSelector(): string {
    return '[data-message-author-role="user"]';
  }

  getUserMessageContentSelector(): string {
    return '[data-message-author-role="user"] .whitespace-pre-wrap';
  }

  getExtraCallButtonClasses(): string[] {
    return ["chatgpt-call-button"];
  }

  getContextWindowCapacityCharacters(): number {
    // Safe high value as specified in PRD
    return 100000;
  }

  protected createAssistantResponse(element: HTMLElement, includeInitialText?: boolean): AssistantResponse {
    return new ChatGPTResponse(element, includeInitialText);
  }

  getUserMessage(element: HTMLElement): UserMessage {
    return new ChatGPTUserMessage(element);
  }
}

class ChatGPTPrompt extends AbstractUserPrompt {
  readonly PROMPT_CHARACTER_LIMIT = 32000; // Reasonable limit for ChatGPT

  constructor(element: HTMLElement) {
    super(element);
  }

  getText(): string {
    // For ProseMirror, get the text content
    return this.element.textContent || "";
  }

  setText(text: string): void {
    // Use the shared TextInsertionManager for consistent text insertion
    const textInsertionManager = TextInsertionManager.getInstance();
    
    // Focus the element first
    this.element.focus();
    
    // Insert text using the shared manager (replaceAll = true to clear existing content)
    const success = textInsertionManager.insertText(this.element, text, true);
    
    if (!success) {
      // Fallback: direct text insertion with input events
      this.element.textContent = text;
      
      // Trigger input events for ProseMirror
      const inputEvent = new Event('input', { bubbles: true });
      this.element.dispatchEvent(inputEvent);
    }
  }

  /**
   * Override draft behavior for ChatGPT: always type into the editor so the user sees live text
   * even when auto-submit is enabled. Using placeholder-only breaks submit flows on ProseMirror.
   */
  setDraft(transcript: string): void {
    this.preferences.getAutoSubmit().then((_autoSubmit) => {
      // Regardless of autoSubmit, we prefer showing actual text in the composer for ChatGPT
      this.setPlaceholderText("");

      // Use TextInsertionManager to replace current content with the latest transcript + a trailing space
      const textInsertionManager = TextInsertionManager.getInstance();
      this.element.focus();
      const success = textInsertionManager.insertText(this.element, `${transcript} `, true);
      if (!success) {
        // Fallback: direct text insertion with input event to notify ProseMirror
        this.element.textContent = `${transcript} `;
        const inputEvent = new Event('input', { bubbles: true });
        this.element.dispatchEvent(inputEvent);
      }
    });
  }

  getPlaceholderText(): string {
    return this.element.getAttribute('data-placeholder') || 
           this.element.getAttribute('placeholder') || "";
  }

  setPlaceholderText(text: string): void {
    // For ProseMirror, we might need to use a different approach
    if (this.element.setAttribute) {
      this.element.setAttribute('data-placeholder', text);
      this.element.setAttribute('placeholder', text);
    }
  }

  getDefaultPlaceholderText(): string {
    return "Ask anything"; // CONFIRMED from actual DOM
  }

}

class ChatGPTResponse extends AssistantResponse {
  constructor(element: HTMLElement, includeInitialText?: boolean) {
    super(element, includeInitialText);
  }

  get contentSelector(): string {
    return ".markdown, .prose, [data-message-id]";
  }

  createTextStream(content: HTMLElement, options?: InputStreamOptions): ElementTextStream {
    // TODO: Phase 3 - implement streaming parser similar to PiTextStream/ClaudeTextBlockCapture
    // For Phase 1, we just need basic response detection using a simple text block capture
    return new ChatGPTTextBlockCapture(content, options);
  }

  decorateControls(): MessageControls {
    return new ChatGPTMessageControls(this, this.ttsControlsModule);
  }
}

class ChatGPTUserMessage extends UserMessage {
  constructor(element: HTMLElement) {
    super(element, new ChatGPTChatbot());
  }

  getText(): string {
    const contentElement = this.element.querySelector('.whitespace-pre-wrap');
    return contentElement?.textContent || this.element.textContent || "";
  }
}

class ChatGPTMessageControls extends MessageControls {
  constructor(message: AssistantResponse, ttsControls: TTSControlsModule) {
    super(message, ttsControls);
  }

  protected getExtraControlClasses(): string[] {
    return ["chatgpt-controls"];
  }

  getHoverMenuSelector(): string {
    return "div.flex.items-center.justify-end, .message-controls";
  }

  getReadAloudButton(): HTMLButtonElement | null {
    // Look for native read aloud button - this will be used in Phase 2
    return this.message.element.querySelector('button[aria-label*="Read aloud"], button[title*="Read aloud"]') as HTMLButtonElement;
  }

  getCopyButton(): HTMLButtonElement | null {
    return this.message.element.querySelector('button[aria-label*="Copy"], button[title*="Copy"]') as HTMLButtonElement;
  }
}

/**
 * A ChatGPTTextBlockCapture is a simplified ElementTextStream that captures ChatGPT's response
 * as a single block of text, rather than as individual paragraphs or list items.
 * This is similar to ClaudeTextBlockCapture but adapted for ChatGPT's DOM structure.
 */
class ChatGPTTextBlockCapture extends ElementTextStream {
  handleMutationEvent(mutation: MutationRecord): void {
    // For Phase 1, simple capture - no sophisticated streaming needed
    // TODO: Phase 3 - implement proper streaming with first-token detection
    this.emitCurrentText();
  }

  constructor(element: HTMLElement, options?: InputStreamOptions) {
    super(element, options);
  }

  private emitCurrentText(): void {
    const text = this.element.textContent || "";
    if (text.trim()) {
      this.next({
        text: text,
        changed: true,
        changedFrom: null
      });
    }
  }

  protected registerObserver(): void {
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        this.handleMutationEvent(mutation);
      });
    });

    this.observer.observe(this.element, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }
}

export default ChatGPTChatbot;
