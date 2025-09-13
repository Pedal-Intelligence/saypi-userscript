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
import { logger } from "../LoggingModule";
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

  // Use ChatGPT's bubble presentation instead of generic pill
  protected useMaintenancePill(): boolean { return false; }

  get contentSelector(): string {
    // Keep in sync with chatgpt/MessageSelectors.getAssistantContentSelector
    return ".markdown, .prose, [data-message-id]";
  }

  createTextStream(content: HTMLElement, options?: InputStreamOptions): ElementTextStream {
    // For now, capture a single final block of text when the response
    // finishes streaming (detected by appearance of the action bar).
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
      // New: collapsed actions (ellipsis) – match generically by menu trigger
      'div:has(> button[aria-haspopup="menu"])',
      // Buttons (used only for watcher trigger; final container resolved in findHoverMenu override)
      'button[data-testid="voice-play-turn-action-button"]',
      'button[data-testid="copy-turn-action-button"]',
      'button[aria-label*="Copy" i]',
      'button[title*="Copy" i]',
      'button[aria-haspopup="menu"]',
      // Include Replay label variant seen after exiting Voice Mode
      'button[aria-label*="Replay" i]',
      'button[title*="Replay" i]',
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
      'button[aria-label*="Read aloud" i], button[title*="Read aloud" i], button[aria-label*="Replay" i], button[title*="Replay" i]'
    ) as HTMLButtonElement | null;
  }

  getCopyButton(): HTMLButtonElement | null {
    return this.message.element.querySelector('button[aria-label*="Copy"], button[title*="Copy"]') as HTMLButtonElement;
  }

  /**
   * Locate the ellipsis trigger that now hides ChatGPT's extra actions
   * (including Read Aloud) in a dropdown.
   */
  private getActionMenuTriggers(): HTMLButtonElement[] {
    const scope = (this.findActionBar() || this.message.element) as Element;
    if (!scope) return [];
    return Array.from(scope.querySelectorAll('button[aria-haspopup="menu"]')) as HTMLButtonElement[];
  }

  private getMoreActionsButton(): HTMLButtonElement | null {
    const triggers = this.getActionMenuTriggers();
    if (!triggers.length) return null;
    // Heuristic: the ellipsis trigger typically appears last in the action bar
    return triggers[triggers.length - 1] as HTMLButtonElement;
  }

  /**
   * Fire a resilient, user-like activation sequence on a button. Some Radix
   * menus only open on pointer events, others respond to keyboard. We do both.
   * Any errors are logged for diagnosis but do not throw.
   */
  private synthesizeUserClick(target: HTMLElement): void {
    try {
      try { target.focus({ preventScroll: true } as any); } catch {}
      const mouse: MouseEventInit & any = { bubbles: true, cancelable: true, composed: true, button: 0, detail: 1, view: window };
      const pointer: any = { bubbles: true, cancelable: true, composed: true, pointerId: 1, pointerType: 'mouse', isPrimary: true };
      try { target.dispatchEvent(new (window as any).PointerEvent('pointerdown', pointer)); } catch {}
      try { target.dispatchEvent(new MouseEvent('mousedown', mouse)); } catch {}
      try { target.dispatchEvent(new (window as any).PointerEvent('pointerup', pointer)); } catch {}
      try { target.dispatchEvent(new MouseEvent('mouseup', mouse)); } catch {}
      try { target.dispatchEvent(new MouseEvent('click', mouse)); } catch {}
      // Also invoke the native click() method for environments/tests that spy on it
      try { (target as any).click?.(); } catch {}
      // Keyboard fallbacks
      try { target.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' })); } catch {}
      try { target.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'Enter' })); } catch {}
      try { target.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: ' ' })); } catch {}
      try { target.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: ' ' })); } catch {}
    } catch (e) {
      console.debug('Say, Pi: synthetic click failed on menu trigger:', e);
    }
  }

  private isMenuOpen(trigger: HTMLElement): boolean {
    const expanded = trigger.getAttribute('aria-expanded');
    const state = trigger.getAttribute('data-state');
    return expanded === 'true' || state === 'open';
  }

  /**
   * Find the "Read aloud" menu item inside any open dropdown menu. We search
   * nearby menus first, then fall back to a global search. Uses robust text/
   * aria matching instead of brittle data-testid values.
   */
  private findReadAloudMenuItemNear(trigger: HTMLElement): HTMLElement | null {
    const inMenu = (el: Element) => !!(el as HTMLElement).closest('[role="menu"], [data-radix-menu-content], [data-radix-dropdown-menu-content]');
    const candidates = Array.from(
      document.querySelectorAll<HTMLElement>('[data-testid="voice-play-turn-action-button"]')
    ).filter(inMenu);

    if (!candidates.length) return null;

    // Prefer the candidate closest to the trigger (portals can render elsewhere)
    const tRect = trigger.getBoundingClientRect();
    candidates.sort((a, b) => {
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      const distA = Math.hypot(ar.left - tRect.left, ar.top - tRect.top);
      const distB = Math.hypot(br.left - tRect.left, br.top - tRect.top);
      if (distA !== distB) return distA - distB;
      // Tie-break: prefer the later-in-DOM candidate (likely the newer menu)
      const pos = a.compareDocumentPosition(b);
      if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1; // a after b => a first
      if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1;  // a before b => b first
      return 0;
    });

    return candidates[0] || null;
  }

  /**
   * Relocate the discovered "Read aloud" menu item from the Radix popper
   * into the message action bar, then activate it. This avoids brittle
   * dismissal/focus interactions tied to the dropdown. If relocation fails
   * for any reason, falls back to a direct click in-place.
   */
  private relocateMenuItemToActionBarAndClick(
    item: HTMLElement,
    trigger: HTMLElement
  ): void {
    try {
      const bar = (this.findActionBar() || trigger.parentElement || this.message.element) as HTMLElement;
      if (!bar) {
        // As a last resort, click in place
        item.click();
        // Defer hiding until after activation so we don't interfere
        setTimeout(() => this.hideOpenRadixPopperContent(), 50);
        return;
      }

      // Container to safely hold the relocated element without affecting layout
      const holder = document.createElement('span');
      holder.className = 'saypi-relocated-voice-action';

      // Move the menu item under the action bar and trigger it
      bar.appendChild(holder);
      holder.appendChild(item);

      // Activate on a microtask so any event handlers attach first
      setTimeout(() => {
        try {
          item.click();
        } finally {
          // Defer popper hiding slightly to avoid interfering with activation
          setTimeout(() => this.hideOpenRadixPopperContent(), 50);
          // Clean up shortly after. The Radix menu will likely unmount on its own,
          // but we remove our temporary holder regardless.
          setTimeout(() => {
            try { holder.remove(); } catch {}
          }, 50);
        }
      }, 0);
    } catch (e) {
      try { item.click(); } catch {}
      console.debug('Say, Pi: relocation click fallback due to error:', e);
    }
  }

  /**
   * Opens the ellipsis dropdown (if needed) and attempts to click the Read
   * Aloud menu item. This method respects the same gating conditions as the
   * direct-button path and is idempotent.
   */
  private tryOpenMoreActionsAndClickReadAloud(): void {
    // Guardrails consistent with direct click flow
    if (!this.message.isLastMessage()) return;
    const prefs = UserPreferenceModule.getInstance();
    if (!prefs.getCachedAutoReadAloudChatGPT()) return;
    if (!this.isCallActive()) return;
    // Idempotent: un-shield any previously shielded menus before proceeding
    try { this.sweepShieldAttributes(null); } catch {}

    const triggers = this.getActionMenuTriggers();
    if (!triggers.length) return;

    const tryTrigger = (index: number) => {
      if (index < 0) return;
      const trigger = triggers[index];
      if (!this.isMenuOpen(trigger) && !(trigger as any)._saypiMenuOpened) {
        (trigger as any)._saypiMenuOpened = true;
        try {
          this.synthesizeUserClick(trigger);
        } catch (e) {
          console.debug('Say, Pi: error opening more-actions menu:', e);
        }
      }

      let attempts = 0;
      const maxAttempts = 10; // per trigger
      const tick = () => {
        const openMenu = document.querySelector('[data-radix-menu-content][data-state="open"], [data-radix-dropdown-menu-content][data-state="open"], [role="menu"][data-state="open"]');
        if (!openMenu && !this.isMenuOpen(trigger) && attempts === 0) {
          try { this.synthesizeUserClick(trigger); } catch {}
        }
        const item = this.findReadAloudMenuItemNear(trigger);
        if (item) {
          if ((item as any)._saypiClicked) return;
          (item as any)._saypiClicked = true;
          // Keep the menu open and insulate its outside-dismiss handlers,
          // then activate the item with a short, robust sequence + retries.
          const wrapper = this.getOpenMenuWrapperFor(item as HTMLElement)
            || this.getClosestOpenMenuWrapperTo(trigger)
            || (openMenu as HTMLElement | null);
          if (wrapper) {
            this.enableOutsideDismissShield(wrapper, trigger);
          }
          // Ensure the inner menu reflects shield attribute as well (test env)
          try {
            let menuEl = (item.closest('[data-radix-menu-content],[data-radix-dropdown-menu-content],[role="menu"]') as HTMLElement | null);
            if (!menuEl) {
              const all = Array.from(document.querySelectorAll<HTMLElement>('[data-radix-menu-content][data-state="open"], [data-radix-dropdown-menu-content][data-state="open"], [role="menu"][data-state="open"]'));
              if (all.length) menuEl = all[all.length - 1];
            }
            if (menuEl && menuEl.getAttribute('data-saypi-shielded') !== 'true') {
              menuEl.setAttribute('data-saypi-shielded', 'true');
            }
          } catch {}
          this.activateReadAloudWithRetries(trigger, item as HTMLElement, wrapper || undefined);
          // Stop the observer attempts; ongoing shield manages menu lifetime
          this.readAloudObserver?.disconnect();
          this.readAloudObserver = null;
          return;
        }
        if (++attempts < maxAttempts) {
          setTimeout(tick, 100);
        } else {
          // Try previous trigger (the ellipsis is typically the last one)
          tryTrigger(index - 1);
        }
      };
      setTimeout(tick, 0);
    };

    // Start from the last trigger (likely the ellipsis)
    tryTrigger(triggers.length - 1);
  }

  /**
   * Clicks the Read Aloud item with a slight deferral and verifies that the
   * dropdown remains open briefly (a strong heuristic that playback engaged).
   * If the menu closes immediately (failure heuristic), it reopens and tries
   * again up to a small bound.
   */
  private activateReadAloudWithRetries(
    trigger: HTMLElement,
    item: HTMLElement,
    wrapper?: HTMLElement,
    attempt: number = 0
  ): void {
    const maxAttempts = 3;
    const openCheckDelay = 220; // ms: allow ChatGPT to spin up audio
    const verifyStableDelay = 500; // ms: ensure menu stability beyond initial click
    const preClickDelay = 40; // ms: let menu settle before select
    const playbackCheckDelay = 1200; // ms: observe a media play/playing event

    const isWrapperOpen = (w?: HTMLElement | null) => {
      if (!w) return false;
      const menu = w.querySelector('[data-radix-menu-content],[data-radix-dropdown-menu-content],[role="menu"]') as HTMLElement | null;
      const openAttr = menu?.getAttribute('data-state') || w.getAttribute('data-state');
      return openAttr === 'open';
    };

    const reopenAndRetry = () => {
      if (attempt + 1 >= maxAttempts) return;
      logger.debug("[ChatGPT] ReadAloud: reopen and retry", { attempt: attempt + 1 });
      try { this.synthesizeUserClick(trigger); } catch {}
      // Wait a tick for portal to re-mount, then locate and click again
      setTimeout(() => {
        const again = this.findReadAloudMenuItemNear(trigger) as HTMLElement | null;
        const newWrapper = this.getOpenMenuWrapperFor(again || item) || undefined;
        if (newWrapper) {
          this.enableOutsideDismissShield(newWrapper, trigger);
        }
        if (again) {
          this.activateReadAloudWithRetries(trigger, again, newWrapper, attempt + 1);
        }
      }, 160);
    };

    logger.debug("[ChatGPT] ReadAloud: attempt", { attempt, preClickDelay });
    try { item.focus?.({ preventScroll: true } as any); } catch {}
    setTimeout(() => {
      // Attach ephemeral media listeners to detect playback start
      let mediaStarted = false;
      const onMedia = (e: Event) => {
        try {
          const t = e.target as any;
          const tag = (t?.tagName || '').toLowerCase();
          if (tag === 'audio' || tag === 'video') {
            mediaStarted = true;
          }
        } catch {}
      };
      try {
        document.addEventListener('play', onMedia, { capture: true } as any);
        document.addEventListener('playing', onMedia, { capture: true } as any);
      } catch {}
      try {
        logger.debug("[ChatGPT] ReadAloud: clicking item", { attempt });
        item.click();
      } catch (e) {
        logger.debug("[ChatGPT] ReadAloud: click threw", { attempt, e });
      }
      // Verify shortly after: menu should remain open
      setTimeout(() => {
        const stillOpen1 = isWrapperOpen(wrapper || this.getOpenMenuWrapperFor(item));
        logger.debug("[ChatGPT] ReadAloud: post-click check", { attempt, stillOpen: stillOpen1, openCheckDelay });
        if (!stillOpen1) {
          try {
            document.removeEventListener('play', onMedia as any, { capture: true } as any);
            document.removeEventListener('playing', onMedia as any, { capture: true } as any);
          } catch {}
          reopenAndRetry();
          return;
        }
        // Verify it remains open a bit longer; if it closes by then, treat as failure
        setTimeout(() => {
          const stillOpen2 = isWrapperOpen(wrapper || this.getOpenMenuWrapperFor(item));
          logger.debug("[ChatGPT] ReadAloud: stability check", { attempt, stillOpen: stillOpen2, verifyStableDelay });
          if (!stillOpen2) {
            try {
              document.removeEventListener('play', onMedia as any, { capture: true } as any);
              document.removeEventListener('playing', onMedia as any, { capture: true } as any);
            } catch {}
            reopenAndRetry();
            return;
          }
          // Final media-start verification; retry if no media event fired
          const remaining = Math.max(playbackCheckDelay - verifyStableDelay, 0);
          setTimeout(() => {
            logger.debug("[ChatGPT] ReadAloud: media-start", { attempt, mediaStarted, playbackCheckDelay });
            try {
              document.removeEventListener('play', onMedia as any, { capture: true } as any);
              document.removeEventListener('playing', onMedia as any, { capture: true } as any);
            } catch {}
            if (!mediaStarted) {
              reopenAndRetry();
              return;
            }
            // Keep a hint of focus for keyboard access
            try { item.focus?.({ preventScroll: true } as any); } catch {}
          }, remaining);
        }, verifyStableDelay - openCheckDelay);
      }, openCheckDelay);
    }, preClickDelay);
  }

  // Close stale open Radix popper portals except the current one
  private closeOtherOpenMenus(exceptWrapper?: HTMLElement): void {
    const wrappers = Array.from(
      document.querySelectorAll<HTMLElement>('[data-radix-popper-content-wrapper]')
    );
    wrappers.forEach((w) => {
      if (exceptWrapper && w === exceptWrapper) return;
      const menu = w.querySelector('[data-radix-menu-content],[data-radix-dropdown-menu-content],[role="menu"]') as HTMLElement | null;
      const state = menu?.getAttribute('data-state') || w.getAttribute('data-state');
      if (state === 'open') {
        logger.debug('[ChatGPT] ReadAloud: closing stale menu');
        // If our outside-dismiss shield is attached to this wrapper, clean it up first
        try {
          if (this.outsideShieldWrapper && this.outsideShieldWrapper === w) {
            try { this.outsideShieldCleanup?.(); } finally {
              this.outsideShieldCleanup = null;
              this.outsideShieldWrapper = null;
            }
          }
        } catch {}
        try { menu?.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' })); } catch {}
        try { w.removeAttribute('data-saypi-shielded'); } catch {}
      }
    });
  }

  private readAloudObserver: MutationObserver | null = null;
  private popperCleanupFns: Array<() => void> = [];
  private outsideShieldCleanup: (() => void) | null = null;
  private outsideShieldWatch: number | null = null;
  private outsideShieldTrigger: HTMLElement | null = null;
  private outsideShieldWrapper: HTMLElement | null = null;
  private outsideShieldEventHandlers: Array<{event: string, handler: (...args: any[]) => void}> = [];

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

  /**
   * True if the conversation is currently in the "responding.piSpeaking" state,
   * i.e., assistant audio should be playing.
   */
  private isPiSpeaking(): boolean {
    try {
      const svc = (globalThis as any).StateMachineService || (window as any).StateMachineService;
      const actor = svc?.conversationActor;
      const state = actor?.getSnapshot?.() || actor?.state;
      return !!state?.matches?.('responding.piSpeaking');
    } catch {
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
   * when the button is created after our controls are initialized.
   */
  private autoClickNativeReadAloudWhenAvailable(): void {
    // If the button already exists, it's likely an older message: don't autoplay
    const existing = this.getReadAloudButton();
    if (existing) {
      return;
    }

    // Observe the message subtree for the button appearing after streaming ends
    this.readAloudObserver = new MutationObserver(() => {
      const btn = this.getReadAloudButton();
      if (!btn) {
        // While the action bar/menu is not present or the button is hidden
        // under the ellipsis, keep trying to open the menu and activate it.
        this.tryOpenMoreActionsAndClickReadAloud();
        return;
      }
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

    // No single-shot attempt here; we now invoke the dropdown fallback from
    // the mutation observer until activation succeeds.
  }

  public override teardown(): void {
    try {
      this.readAloudObserver?.disconnect();
      this.readAloudObserver = null;
    } catch {}
    try {
      // Unhide any popper content we hid
      this.popperCleanupFns.forEach((fn) => {
        try { fn(); } catch {}
      });
      this.popperCleanupFns = [];
    } catch {}
    try {
      this.outsideShieldCleanup?.();
      this.outsideShieldCleanup = null;
      if (this.outsideShieldWatch) { clearInterval(this.outsideShieldWatch); this.outsideShieldWatch = null; }
      // Remove event handlers registered during shield
      try {
        this.outsideShieldEventHandlers.forEach(({event, handler}) => {
          try { EventBus.off(event, handler); } catch {}
        });
      } finally {
        this.outsideShieldEventHandlers = [];
      }
    } catch {}
    super.teardown();
  }

  /**
   * Visually hide any open Radix popper content (dropdown menu) without
   * changing its open/closed state. Adds a data attribute that our CSS
   * targets to set visibility: hidden; opacity: 0; pointer-events: none.
   * Automatically removes the attribute when the menu closes or unmounts.
   */
  private hideOpenRadixPopperContent(): void {
    const wrappers = Array.from(
      document.querySelectorAll<HTMLElement>('[data-radix-popper-content-wrapper]')
    );

    wrappers.forEach((wrapper) => {
      // Find inner menu/content node with an open state
      const menu = (wrapper.querySelector(
        '[data-radix-menu-content],[data-radix-dropdown-menu-content],[role="menu"]'
      ) as HTMLElement | null);
      if (!menu) return;

      const state = menu.getAttribute('data-state') || wrapper.getAttribute('data-state');
      if (state !== 'open') return;

      if ((wrapper as any)._saypiHidden) return; // idempotent
      (wrapper as any)._saypiHidden = true;

      wrapper.setAttribute('data-saypi-hidden', 'true');
      menu.setAttribute('data-saypi-hidden', 'true');

      const cleanup = () => {
        try { wrapper.removeAttribute('data-saypi-hidden'); } catch {}
        try { menu.removeAttribute('data-saypi-hidden'); } catch {}
        try { (wrapper as any)._saypiHidden = false; } catch {}
      };

      // Observe for the menu closing or unmounting to auto‑cleanup
      const obs = new MutationObserver(() => {
        const cur = menu.getAttribute('data-state') || wrapper.getAttribute('data-state');
        if (cur !== 'open' || !document.contains(menu)) {
          try { obs.disconnect(); } catch {}
          cleanup();
        }
      });
      try {
        obs.observe(menu, { attributes: true, attributeFilter: ['data-state'] });
      } catch {}
      try {
        obs.observe(wrapper, { attributes: true, attributeFilter: ['data-state', 'style'] });
      } catch {}

      this.popperCleanupFns.push(() => {
        try { obs.disconnect(); } catch {}
        cleanup();
      });
    });
  }

  private getOpenMenuWrapperFor(el: HTMLElement): HTMLElement | null {
    const menu = (el.closest('[data-radix-menu-content],[data-radix-dropdown-menu-content],[role="menu"]') as HTMLElement | null);
    const wrapper = (menu?.closest('[data-radix-popper-content-wrapper]') as HTMLElement | null) || null;
    // If no wrapper exists (e.g., tests or non-wrapped menu), return the menu itself
    return wrapper || menu || null;
  }

  // Choose the open menu closest to a trigger as a robust fallback.
  private getClosestOpenMenuWrapperTo(trigger: HTMLElement): HTMLElement | null {
    const openMenus = Array.from(document.querySelectorAll<HTMLElement>(
      '[data-radix-menu-content][data-state="open"], [data-radix-dropdown-menu-content][data-state="open"], [role="menu"][data-state="open"]'
    ));
    if (!openMenus.length) return null;
    const tRect = trigger.getBoundingClientRect();
    let nearest: HTMLElement | null = null;
    let bestDist = Number.POSITIVE_INFINITY;
    let bestIdx = -1;
    openMenus.forEach((el, idx) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const tx = tRect.left + tRect.width / 2;
      const ty = tRect.top + tRect.height / 2;
      const d = Math.hypot(cx - tx, cy - ty);
      if (d < bestDist || (d === bestDist && idx > bestIdx)) {
        nearest = el;
        bestDist = d;
        bestIdx = idx;
      }
    });
    if (!nearest) return null;
    const nearestEl = nearest as HTMLElement;
    const wrapper = (nearestEl.closest('[data-radix-popper-content-wrapper]') as HTMLElement | null) || null;
    return wrapper || nearest;
  }

  // Remove shield attribute from any other open menus/wrappers to avoid ghosts
  private sweepShieldAttributes(except?: HTMLElement | null): void {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-saypi-shielded="true"]'));
    nodes.forEach((n) => {
      if (except && n === except) return;
      try { n.removeAttribute('data-saypi-shielded'); } catch {}
    });
  }

  /**
   * Prevent Radix dropdown from reacting to outside clicks/ESC while voice is playing,
   * without blocking normal page interaction. We stop propagation early at window
   * capture for a narrow set of events and re-dispatch a synthetic clone at the
   * original target so app listeners still run as usual. The Radix document-level
   * capture listeners do not see the event, so the menu remains open.
   */
  private enableOutsideDismissShield(wrapper: HTMLElement, trigger?: HTMLElement): void {
    // If an existing shield is attached to a different wrapper, tear it down
    if (this.outsideShieldCleanup && this.outsideShieldWrapper && this.outsideShieldWrapper !== wrapper) {
      try { this.outsideShieldCleanup(); } catch {}
      this.outsideShieldCleanup = null;
      this.outsideShieldWrapper = null;
    }
    if (this.outsideShieldCleanup) return; // already active on same wrapper

    const isInside = (node: EventTarget | null) => !!(node && wrapper.contains(node as Node));
    this.outsideShieldTrigger = trigger || this.outsideShieldTrigger;
    // Idempotent clean sweep: un-shield any other menus before marking this one
    try { this.sweepShieldAttributes(wrapper); } catch {}
    try { wrapper.setAttribute('data-saypi-shielded', 'true'); } catch {}
    try {
      const menuSel = '[data-radix-menu-content],[data-radix-dropdown-menu-content],[role="menu"]';
      const inner = (wrapper.matches?.(menuSel) ? wrapper : wrapper.querySelector(menuSel)) as HTMLElement | null;
      inner?.setAttribute('data-saypi-shielded', 'true');
    } catch {}
    try { this.blurTrigger(trigger); } catch {}

    // Reposition the menu to the bottom-right to avoid covering controls
    try { this.repositionMenuToBottomRight(wrapper); } catch {}

    const cloneAndRedispatch = (e: Event) => {
      const t = e.target as Element | null;
      if (!t) return;
      // Only clone for pointerdown/focusin; ESC we just swallow
      if (e.type === 'pointerdown') {
        const src = e as PointerEvent;
        const clone = new (window as any).PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: src.cancelable,
          composed: true,
          pointerId: src.pointerId,
          pointerType: src.pointerType,
          isPrimary: src.isPrimary,
          button: src.button,
          buttons: src.buttons,
          clientX: src.clientX,
          clientY: src.clientY,
          altKey: src.altKey,
          ctrlKey: src.ctrlKey,
          metaKey: src.metaKey,
          shiftKey: src.shiftKey,
        });
        // Dispatch on a microtask to avoid interfering with current turn
        setTimeout(() => { try { t.dispatchEvent(clone); } catch {} }, 0);
      } else if (e.type === 'focusin') {
        let clone: Event;
        try {
          clone = new FocusEvent('focusin', { bubbles: true, composed: true });
        } catch {
          clone = new Event('focusin', { bubbles: true } as any);
        }
        setTimeout(() => { try { t.dispatchEvent(clone); } catch {} }, 0);
      }
    };

    const onPointerDown = (e: Event) => {
      if (!isInside(e.target)) {
        // Let default actions proceed, but block Radix's outside handlers
        try { (e as any).stopImmediatePropagation?.(); } catch {}
        try { e.stopPropagation(); } catch {}
        cloneAndRedispatch(e);
      }
    };
    const onFocusIn = (e: Event) => {
      if (!isInside(e.target)) {
        try { (e as any).stopImmediatePropagation?.(); } catch {}
        try { e.stopPropagation(); } catch {}
        cloneAndRedispatch(e);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        try { (e as any).stopImmediatePropagation?.(); } catch {}
        try { e.stopPropagation(); } catch {}
        // Do not preventDefault to avoid breaking user Esc flows elsewhere
      }
    };

    window.addEventListener('pointerdown', onPointerDown, { capture: true });
    window.addEventListener('focusin', onFocusIn as any, { capture: true } as any);
    window.addEventListener('keydown', onKeyDown as any, { capture: true } as any);

    // Do not tie shield lifecycle to conversation events; allow dropdown lifecycle to govern.

    // Auto-disable when menu actually closes or element unmounts
    const obs = new MutationObserver(() => {
      const state = (wrapper.querySelector('[data-radix-menu-content],[data-radix-dropdown-menu-content],[role="menu"]') as HTMLElement | null)?.getAttribute('data-state') || wrapper.getAttribute('data-state');
      if (state !== 'open' || !document.contains(wrapper)) {
        cleanup();
      }
    });
    try { obs.observe(wrapper, { attributes: true, subtree: true, attributeFilter: ['data-state'] }); } catch {}

    // Avoid polling conversation state; allow the menu's lifecycle to govern.

    const cleanup = () => {
      try { window.removeEventListener('pointerdown', onPointerDown as any, { capture: true } as any); } catch {}
      try { window.removeEventListener('focusin', onFocusIn as any, { capture: true } as any); } catch {}
      try { window.removeEventListener('keydown', onKeyDown as any, { capture: true } as any); } catch {}
      try { obs.disconnect(); } catch {}
      // Remove event bus listeners
      try {
        this.outsideShieldEventHandlers.forEach(({event, handler}) => {
          try { EventBus.off(event, handler); } catch {}
        });
      } finally {
        this.outsideShieldEventHandlers = [];
      }
      try { wrapper.removeAttribute('data-saypi-shielded'); } catch {}
      try {
        const menuSel = '[data-radix-menu-content],[data-radix-dropdown-menu-content],[role="menu"]';
        const inner = (wrapper.matches?.(menuSel) ? wrapper : wrapper.querySelector(menuSel)) as HTMLElement | null;
        inner?.removeAttribute('data-saypi-shielded');
      } catch {}
      try { this.restoreMenuPosition(wrapper); } catch {}
      if (this.outsideShieldWatch) { clearInterval(this.outsideShieldWatch); this.outsideShieldWatch = null; }
      // Do not force-close the menu; allow ChatGPT to close it at the end of playback
      try { this.blurTrigger(this.outsideShieldTrigger); } catch {}
      this.outsideShieldCleanup = null;
      this.outsideShieldWrapper = null;
    };

    this.outsideShieldCleanup = cleanup;
    this.outsideShieldWrapper = wrapper;
  }

  private gentlyCloseMenu(wrapper: HTMLElement, trigger?: HTMLElement | null): void {
    try {
      const menu = wrapper.querySelector('[data-radix-menu-content],[data-radix-dropdown-menu-content],[role="menu"]') as HTMLElement | null;
      const isOpen = !!menu && (menu.getAttribute('data-state') === 'open' || wrapper.getAttribute('data-state') === 'open');
      if (!isOpen) return;
      // Prefer sending Escape so Radix performs a normal close
      if (menu) {
        try { menu.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' })); } catch {}
      }
      // If still open shortly after, toggle via trigger as a fallback
      setTimeout(() => {
        const stillOpen = menu && (menu.getAttribute('data-state') === 'open' || wrapper.getAttribute('data-state') === 'open');
        if (stillOpen && trigger) {
          try { this.synthesizeUserClick(trigger); } catch {}
        }
        try { this.blurTrigger(trigger || undefined); } catch {}
      }, 40);
    } catch {}
  }

  private blurTrigger(trigger?: HTMLElement | null): void {
    try { trigger && trigger.blur?.(); } catch {}
  }

  // Move the open Radix popper to the bottom-right corner with a small margin.
  // Records the previous inline transform to restore later.
  private repositionMenuToBottomRight(wrapper: HTMLElement): void {
    const menu = wrapper.querySelector('[data-radix-menu-content],[data-radix-dropdown-menu-content],[role="menu"]') as HTMLElement | null;
    const rect = (menu || wrapper).getBoundingClientRect();
    const margin = 24; // px
    const x = Math.max(margin, window.innerWidth - rect.width - margin);
    const y = Math.max(margin, window.innerHeight - rect.height - margin);
    // Save prior transform if not already saved
    const prev = (wrapper as any)._saypiPrevTransform ?? wrapper.style.transform;
    (wrapper as any)._saypiPrevTransform = prev;
    // Apply translate and keep a subtle minimize scale that matches CSS animation
    wrapper.style.transform = `translate(${x}px, ${y}px) scale(0.965)`;
  }

  private restoreMenuPosition(wrapper: HTMLElement): void {
    const prev = (wrapper as any)._saypiPrevTransform;
    if (typeof prev === 'string') {
      wrapper.style.transform = prev;
    } else {
      // Clear transform if nothing was saved
      wrapper.style.removeProperty('transform');
    }
    try { delete (wrapper as any)._saypiPrevTransform; } catch {}
  }
}

/**
 * A ChatGPTTextBlockCapture is a simplified ElementTextStream that captures ChatGPT's response
 * as a single block of text, rather than as individual paragraphs or list items.
 * This is similar to ClaudeTextBlockCapture but adapted for ChatGPT's DOM structure.
 */
class ChatGPTTextBlockCapture extends ElementTextStream {
  private turnContainer: HTMLElement | null = null;
  private barObserver: MutationObserver | null = null;
  private streamingStarted = false;
  private firstTokenEmitted = false;

  constructor(element: HTMLElement, options?: InputStreamOptions) {
    super(element, options);
    // Find the assistant turn container that owns this content
    this.turnContainer = this.findTurnContainer(element);

    // If the action bar is already present, emit immediately
    if (this.actionBarPresent()) {
      this.emitFinalAndClose();
    } else {
      // Otherwise, watch for the action bar to appear as the signal that
      // streaming has finished.
      this.registerActionBarObserver();
    }
  }

  // Minimal, robust signal for ChatGPT: the action bar appears only once
  // the message has finished streaming.
  private actionBarPresent(): boolean {
    const scope = this.turnContainer || this.element.parentElement || this.element;
    if (!scope) return false;
    const sel = [
      '.message-action-bar',
      'button[data-testid="copy-turn-action-button"]',
      'button[data-testid="voice-play-turn-action-button"]',
      'button[aria-haspopup="menu"]',
      'button[aria-label*="Copy" i]',
      'button[title*="Copy" i]'
    ].join(', ');
    return !!scope.querySelector(sel);
  }

  private findTurnContainer(start: HTMLElement): HTMLElement | null {
    return (
      start.closest('article[data-turn="assistant"]') as HTMLElement | null ||
      start.closest('[data-message-author-role="assistant"]') as HTMLElement | null ||
      start.closest('.assistant-message') as HTMLElement | null ||
      start.parentElement
    );
  }

  private emitFinalAndClose(): void {
    if (this.closed()) return;
    
    // Prevent multiple calls or post-disconnect emissions
    if (!this.barObserver) return;
    
    const text = (this.element.textContent || "").trimEnd();
    if (text) {
      // Emit the whole response as one block
      this.next(new AddedText(text));
    }
    this.complete({ type: "eod", time: Date.now() });
    this.disconnectBarObserver();
  }

  private registerActionBarObserver(): void {
    if (!this.turnContainer) return;
    // Initial quick check in case it raced in
    if (this.actionBarPresent()) {
      this.emitFinalAndClose();
      return;
    }

    this.barObserver = new MutationObserver(() => {
      if (this.closed()) {
        this.disconnectBarObserver();
        return;
      }
      if (this.actionBarPresent()) {
        this.emitFinalAndClose();
      }
    });
    this.barObserver.observe(this.turnContainer, {
      childList: true,
      subtree: true,
      attributes: true,
    });
  }

  private disconnectBarObserver(): void {
    try {
      this.barObserver?.disconnect();
    } catch {}
    this.barObserver = null;
  }

  // Override disconnect to ensure barObserver is also cleaned up
  override disconnect(): void {
    this.disconnectBarObserver();
    super.disconnect();
  }

  // While streaming, we only use mutations to detect the first token arrival
  // for telemetry. We intentionally do not emit partial text.
  handleMutationEvent(_mutation: MutationRecord): void {
    if (this.closed()) return;
    if (!this.streamingStarted) {
      const txt = (this.element.textContent || '').trim();
      if (txt) {
        this.streamingStarted = true;
        if (!this.firstTokenEmitted) {
          try {
            EventBus.emit("saypi:llm:first-token", { text: txt, time: Date.now() });
          } catch {}
          this.firstTokenEmitted = true;
        }
      }
    }
    // Completion is driven by action bar appearance only.
  }

  protected registerObserver(): void {
    // Observe content for text mutations (to mark first‑token only)
    this.observer = new MutationObserver((mutations) => {
      for (const m of mutations) this.handleMutationEvent(m);
    });
    this.observer.observe(this.element, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }
}

export default ChatGPTChatbot;
