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
import getMessage from "../i18n";
import { AbstractChatbot, AbstractUserPrompt } from "./AbstractChatbots";
import { UserPrompt } from "./Chatbot";
import { findControlsContainerInComposer, findPromptInputInComposer, getScopedSubmitSelector } from "./chatgpt/ComposerSelectors";
import { getAssistantContentSelector, getAssistantResponseSelectorScopedToThread } from "./chatgpt/MessageSelectors";
import { findThreadRoot } from "./chatgpt/HistorySelectors";

/**
 * Phase flags for ChatGPT integration. These are breadcrumbs to make it
 * straightforward to re‑introduce additional UI (e.g., a control panel)
 * in later phases without hunting through multiple files.
 *
 * Phase 1: enableControlPanel = false
 * Phase 3+: set to true and choose a proper container selector below.
 */
export const CHATGPT_FEATURES = {
  enableControlPanel: false,
};
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
    // Phase 1: no SayPi control panel on ChatGPT.
    // To re‑enable in Phase 3+, flip CHATGPT_FEATURES.enableControlPanel to true
    // and return a stable container selector here. Candidates observed:
    //  - '.composer-parent' (composer wrapper)
    //  - '#thread-bottom-container' (thread footer wrapper)
    // Be sure to remove the cleanup guard in bootstrap.decoratePrompt as well.
    if (CHATGPT_FEATURES.enableControlPanel) {
      return '.composer-parent';
    }
    return '';
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
    // Prefer the container whose direct children are conversation <article/>s
    const thread = findThreadRoot(searchRoot) as HTMLElement | null;
    const scope: ParentNode = (thread as ParentNode) || (searchRoot as ParentNode) || document;
    const firstTurn = (scope as Element | Document).querySelector?.(
      'article[data-testid^="conversation-turn"], article[data-testid^="conversation-turn-"]'
    ) as HTMLElement | null;
    if (firstTurn && firstTurn.parentElement) {
      return firstTurn.parentElement as HTMLElement;
    }
    // No valid message list yet; defer setup so we don't tag the wrong node
    return null as unknown as HTMLElement;
  }

  getChatHistorySelector(): string {
    // Target the container whose direct children are turn <article/> nodes
    // Scopes under #thread when present but also works globally as a fallback
    const listByArticles = 'div:has(> article[data-testid^="conversation-turn"])';
    return ['#thread ' + listByArticles, listByArticles].join(', ');
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
    // Match the turn container itself to avoid confusing user content blocks
    // e.g., <article data-testid="conversation-turn-32" data-turn="assistant">
    const sel = 'article[data-turn="assistant"]';
    return ['#thread ' + sel, sel].join(', ');
  }

  getAssistantResponseContentSelector(): string {
    return getAssistantContentSelector();
  }

  getUserPromptSelector(): string {
    // Match the user turn container to avoid misclassification
    return 'article[data-turn="user"]';
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

  simulateFormSubmit(): boolean {
    // Try to find ChatGPT submit button using proper selectors
    const chatgptSubmitButton = this.findChatGPTSubmitButton();
    if (chatgptSubmitButton) {
      chatgptSubmitButton.click();
      console.debug("Sending message to ChatGPT at", Date.now());
      return true;
    }

    // Fallback to keyboard event for ChatGPT
    const textarea = document.getElementById("saypi-prompt");
    if (textarea) {
      const enterEvent = new KeyboardEvent("keydown", {
        bubbles: true,
        key: "Enter",
        keyCode: 13,
        which: 13,
      });
      textarea.dispatchEvent(enterEvent);
      console.debug("Dispatched Enter keydown event to ChatGPT at", Date.now());
      return true;
    }
    
    console.error("Cannot simulate submit for ChatGPT: No submit button or textarea found.");
    return false;
  }

  /**
   * Find ChatGPT's submit button using various selectors
   * @returns {HTMLElement|null} The submit button element or null if not found
   */
  private findChatGPTSubmitButton(): HTMLElement | null {
    // ChatGPT submit button selectors in order of preference
    const selectors = [
      'form[data-type="unified-composer"] button[type="submit"]',
      'form[data-type="unified-composer"] [data-testid="send-button"]',
      'form[data-type="unified-composer"] button[aria-label*="Send" i]',
      'form[data-type="unified-composer"] button[title*="Send" i]',
      // Fallback selectors for cases where the form might not be found
      'button[data-testid="send-button"]',
      'button[aria-label*="Send" i]:not([aria-label*="Stop" i])',
      'button[title*="Send" i]:not([title*="Stop" i])'
    ];

    for (const selector of selectors) {
      try {
        const button = document.querySelector(selector) as HTMLElement;
        if (button && !(button as HTMLButtonElement).disabled) {
          return button;
        }
      } catch (e) {
        // Continue to next selector if this one fails
        console.debug("Failed to query selector:", selector, e);
      }
    }

    return null;
  }

  protected createAssistantResponse(element: HTMLElement, includeInitialText?: boolean): AssistantResponse {
    // Normalize to the full assistant turn container when selectors match inner content
    const container = (element.closest('[data-message-author-role="assistant"]') ||
      element.closest('article[data-testid^="conversation-turn-"]') ||
      element.closest('article[data-testid^="conversation-turn"]') ||
      element) as HTMLElement;
    return new ChatGPTResponse(container, includeInitialText);
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
   * For ChatGPT's ProseMirror composer, always insert live text instead of using placeholder-only drafts.
   * This ensures the user sees text and downstream submit logic operates on real content.
   */
  setDraft(transcript: string): void {
    this.setPlaceholderText("");
    // Reuse setText to perform a replace-all insert with a trailing space
    this.setText(`${transcript} `);
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
    // i18n: default placeholder in ChatGPT composer
    return getMessage("chatgpt_placeholder_default");
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
    // Phase 2: auto-activate ChatGPT's native Read Aloud when it appears
    this.autoClickNativeReadAloudWhenAvailable();
    // Resilient attach: poll briefly for the native action bar and attach
    // our controls even if the initial mutation timing was missed.
    this.scheduleLazyAttach();
  }

  protected getExtraControlClasses(): string[] {
    return ["chatgpt-controls"];
  }

  getActionBarSelector(): string {
    // Robust selector set for ChatGPT action bar.
    // - include the wrapper divs AND the buttons themselves so watchForActionBar can trigger
    return [
      // Direct match of wrapper that holds action buttons
      'div:has(> button[data-testid="voice-play-turn-action-button"])',
      'div:has(> button[data-testid="copy-turn-action-button"])',
      'div:has(> button[aria-label*="Copy" i])',
      'div:has(> button[title*="Copy" i])',
      // Buttons (used only for watcher trigger; final container resolved in findHoverMenu override)
      'button[data-testid="voice-play-turn-action-button"]',
      'button[data-testid="copy-turn-action-button"]',
      'button[aria-label*="Copy" i]',
      'button[title*="Copy" i]',
      // Fallback legacy
      'div.flex.items-center.justify-end',
      '.message-controls'
    ].join(', ');
  }

  getReadAloudButton(): HTMLButtonElement | null {
    // Prefer stable data-testid; fall back to aria/ title contains
    const byTestId = this.message.element.querySelector(
      'button[data-testid="voice-play-turn-action-button"]'
    ) as HTMLButtonElement | null;
    if (byTestId) return byTestId;
    return this.message.element.querySelector(
      'button[aria-label*="Read aloud" i], button[title*="Read aloud" i]'
    ) as HTMLButtonElement | null;
  }

  getCopyButton(): HTMLButtonElement | null {
    return this.message.element.querySelector('button[aria-label*="Copy"], button[title*="Copy"]') as HTMLButtonElement;
  }

  private readAloudObserver: MutationObserver | null = null;

  /**
   * Checks if we recently experienced a route change.
   * Used to determine if auto-click behavior should be more aggressive for new messages.
   */
  private isRecentRouteChange(): boolean {
    try {
      // Lazy access to DOMObserver to avoid circular import issues
      const domObserver = (globalThis as any).DOMObserver || (window as any).DOMObserver;
      return domObserver?.isRecentRouteChange?.() || false;
    } catch (_) {
      return false;
    }
  }

  /**
   * Checks if a voice call is currently active by examining the conversation state.
   * Uses lazy access to StateMachineService to avoid circular import issues.
   * @returns true if the conversation is in listening or responding state
   */
  private isCallActive(): boolean {
    try {
      // Lazy import to avoid module initialization ordering issues
      const svc = (globalThis as any).StateMachineService || (window as any).StateMachineService;
      const actor = svc?.conversationActor;
      const state = actor?.getSnapshot?.() || actor?.state;
      if (!state) return false;
      return state.matches?.('listening') || state.matches?.('responding');
    } catch (_) {
      return false;
    }
  }

  // Prefer stable resolution through the known native buttons
  public override findActionBar(): HTMLElement | null {
    const existing = super.findActionBar();
    if (existing) return existing;
    const btn = this.getReadAloudButton() || this.getCopyButton();
    if (btn && btn.parentElement) {
      const wrapper = btn.parentElement as HTMLElement; // immediate parent is the flexible action bar wrapper
      wrapper.classList.add('message-action-bar');
      return wrapper;
    }
    // Fallback to selector lookup
    const sel = this.getActionBarSelector();
    const found = this.message.element.querySelector(sel) as HTMLElement | null;
    if (found) {
      found.classList.add('message-action-bar');
    }
    return found;
  }

  /**
   * ChatGPT already renders a native action bar with Copy / Read‑aloud, so
   * we do not inject any extra buttons. We simply locate and store the
   * wrapper so the rest of the machinery (e.g., observers) can reference it.
   */
  protected override async decorateControls(message: AssistantResponse): Promise<void> {
    return new Promise((resolve) => {
      const establish = () => {
        let wrapper = this.findActionBar();
        if (!wrapper) {
          const sel = this.getActionBarSelector();
          wrapper = message.element.querySelector(sel) as HTMLElement | null;
        }
        if (wrapper) {
          wrapper.classList.add('message-action-bar');
          this.actionBar = wrapper;
        }
        // Do not create .saypi-tts-controls; ChatGPT has native controls
        resolve();
      };
      establish();
    });
  }

  // If the wrapper existed before our observer started, we might miss it.
  // Do a short, bounded retry to attach controls.
  private scheduleLazyAttach(): void {
    const maxTries = 50; // ~5s at 100ms each
    let tries = 0;
    const tryAttach = () => {
      // If already attached, stop
      if (this.message.element.querySelector('.saypi-tts-controls')) return;

      const wrapper = this.findActionBar();
      if (wrapper) {
        // Re-run the normal decorator path which will append our controls
        this.decorateControls(this.message);
        return;
      }
      if (++tries < maxTries) {
        setTimeout(tryAttach, 100);
      }
    };
    setTimeout(tryAttach, 0);
  }

  /**
   * Auto-click ChatGPT's native Read Aloud for the most recent, newly
   * generated assistant response. Avoids older messages by only triggering
   * when the button is created after our controls are initialized, UNLESS
   * we're in a recent route change scenario where the button may have appeared
   * before observers were ready.
   */
  private autoClickNativeReadAloudWhenAvailable(): void {
    // If the button already exists, check if we should still auto-click
    const existing = this.getReadAloudButton();
    const isRecentRoute = this.isRecentRouteChange();
    
    if (existing && !isRecentRoute) {
      // Button exists and we're not in a route change scenario - likely an older message
      return;
    }
    
    if (existing && isRecentRoute && this.message.isLastMessage()) {
      // Button exists, we're in route change scenario, and this is the last message
      // Auto-click immediately since this is likely the first response after route change
      const prefs = UserPreferenceModule.getInstance();
      const enabled = prefs.getCachedAutoReadAloudChatGPT();
      if (enabled && this.isCallActive() && !(existing as any)._saypiClicked) {
        (existing as any)._saypiClicked = true;
        try {
          setTimeout(() => existing.click(), 0);
        } catch (e) {
          console.warn('Say, Pi auto read‑aloud click failed:', e);
        }
      }
      return;
    }

    // Observe the message subtree for the button appearing after streaming ends
    this.readAloudObserver = new MutationObserver(() => {
      const btn = this.getReadAloudButton();
      if (!btn) return;
      if (!this.message.isLastMessage()) return; // ensure it's the newest turn
      // Respect user preference and only autoplay during a voice call
      const prefs = UserPreferenceModule.getInstance();
      const enabled = prefs.getCachedAutoReadAloudChatGPT();
      if (!enabled) return;
      if (!this.isCallActive()) return;
      if ((btn as any)._saypiClicked) return; // idempotent guard
      (btn as any)._saypiClicked = true;
      try {
        // Click on a microtask to allow any handlers to attach first
        setTimeout(() => btn.click(), 0);
      } catch (e) {
        console.warn('Say, Pi auto read‑aloud click failed:', e);
      } finally {
        this.readAloudObserver?.disconnect();
        this.readAloudObserver = null;
      }
    });

    this.readAloudObserver.observe(this.message.element, {
      childList: true,
      subtree: true,
    });
  }

  public override teardown(): void {
    try {
      this.readAloudObserver?.disconnect();
      this.readAloudObserver = null;
    } catch {}
    super.teardown();
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
