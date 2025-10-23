import { AssistantResponse, MessageControls } from "../../dom/MessageElements";
import EventBus from "../../events/EventBus";
import { UserPreferenceModule } from "../../prefs/PreferenceModule";
import { logger } from "../../LoggingModule";
import { ElementTextStream, InputStreamOptions, AddedText } from "../../tts/InputStream";
import { TTSControlsModule } from "../../tts/TTSControlsModule";

export class ChatGPTResponse extends AssistantResponse {
  constructor(element: HTMLElement, includeInitialText?: boolean, isStreaming?: boolean) {
    super(element, includeInitialText);
    // Mark streaming messages as unread for auto-read aloud functionality
    if (isStreaming) {
      element.setAttribute('data-saypi-unread', 'true');
    }
  }

  protected useMaintenancePill(): boolean { return false; }

  get contentSelector(): string {
    return ".markdown, .prose, [data-message-id]";
  }

  createTextStream(content: HTMLElement, options?: InputStreamOptions): ElementTextStream {
    return new ChatGPTTextBlockCapture(content, options);
  }

  decorateControls(): MessageControls {
    return new ChatGPTMessageControls(this, this.ttsControlsModule);
  }

  override get messageId(): string {
    if (this._messageId) {
      return this._messageId;
    }

    const turnId = this.element.getAttribute("data-turn-id")?.trim();
    if (turnId) {
      this._messageId = turnId;
      if (this.element.dataset.saypiMessageId !== turnId) {
        this.element.dataset.saypiMessageId = turnId;
      }
      return this._messageId;
    }

    logger.warn("[ChatGPTResponse] Missing data-turn-id on assistant message", this.element);
    return super.messageId;
  }
}

export class ChatGPTMessageControls extends MessageControls {
  private readAloudObserver: MutationObserver | null = null;
  constructor(message: AssistantResponse, ttsControls: TTSControlsModule) {
    super(message, ttsControls);
    // Proactively clear previous shields only when a newer turn exists
    try {
      const count = document.querySelectorAll('.assistant-message').length;
      if (count > 1) {
        this.sweepShieldAttributes(null);
      }
    } catch {}

    EventBus.on('saypi:tts:skipCurrent', () => {
      const messageId = message.element.getAttribute('data-testid');
      logger.debug('[ChatGPTMessageControls] saypi:tts:skipCurrent event received on message', messageId);
      if (message.isLastMessage()) {
        logger.debug('[ChatGPTMessageControls] Setting [data-skip-tts="true"] on message', messageId);
        message.element.setAttribute('data-skip-tts', 'true');
      }
    });

    this.autoClickNativeReadAloudWhenAvailable();
    this.scheduleLazyAttach();
  }

  private skipReadAloud(): boolean {
    const messageId = this.message.element.getAttribute('data-testid');
    const skipTTS = this.message.element.getAttribute('data-skip-tts');
    const alreadyReadAloud = this.message.element.getAttribute('data-saypi-read-aloud-clicked');
    const result = skipTTS === 'true' || alreadyReadAloud === 'true';
    logger.debug('[ChatGPTMessageControls] skipReadAloud: ', messageId, result);
    return result;
  }

  protected getExtraControlClasses(): string[] { return ["chatgpt-controls"]; }

  getActionBarSelector(): string {
    return [
      'div:has(> button[data-testid="voice-play-turn-action-button"])',
      'div:has(> button[data-testid="copy-turn-action-button"])',
      'div:has(> button[aria-label*="Copy" i])',
      'div:has(> button[title*="Copy" i])',
      'div:has(> button[aria-haspopup="menu"]):not(.ms-4)',
    ].join(', ');
  }

  getReadAloudButton(): HTMLButtonElement | null {
    const byTestId = this.message.element.querySelector(
      'button[data-testid="voice-play-turn-action-button"]'
    ) as HTMLButtonElement | null;
    if (byTestId) return byTestId;
    return this.message.element.querySelector(
      'button[aria-label*="Read aloud" i], button[title*="Read aloud" i], button[aria-label*="Replay" i], button[title*="Replay" i]'
    ) as HTMLButtonElement | null;
  }

  getCopyButton(): HTMLButtonElement | null {
    return this.message.element.querySelector('button[data-testid="copy-turn-action-button"], button[aria-label*="Copy"], button[title*="Copy"]') as HTMLButtonElement;
  }

  private getActionMenuTriggers(): HTMLButtonElement[] {
    const scope = (this.findActionBar() || this.message.element) as Element;
    if (!scope) return [];
    const all = Array.from(scope.querySelectorAll('button[aria-haspopup="menu"]')) as HTMLButtonElement[];
    if (!all.length) return [];

    const ordered = all.filter(btn => this.isOverflowMenuTrigger(btn));
    const secondary = all.filter(btn => !this.isOverflowMenuTrigger(btn) && !this.isContextualRetryTrigger(btn));

    return [...ordered, ...secondary];
  }

  private getTriggerAccessibleName(trigger: HTMLElement): string {
    const aria = trigger.getAttribute('aria-label');
    if (aria) {
      return aria.toLowerCase();
    }
    const labelledBy = trigger.getAttribute('aria-labelledby');
    if (labelledBy) {
      const labelEl = document.getElementById(labelledBy);
      const labelText = labelEl?.textContent?.trim();
      if (labelText) {
        return labelText.toLowerCase();
      }
    }
    const title = trigger.getAttribute('title');
    if (title) {
      return title.toLowerCase();
    }
    const text = (trigger.textContent || '').trim();
    return text.toLowerCase();
  }

  private isOverflowMenuTrigger(trigger: HTMLButtonElement): boolean {
    if (trigger.dataset?.testid === 'turn-more-menu' || trigger.dataset?.testid === 'more-actions-trigger') {
      return true;
    }
    const name = this.getTriggerAccessibleName(trigger);
    if (!name) return false;
    if (name.includes('more actions') || name.includes('more options') || name.includes('more menu')) {
      return true;
    }
    if (name === 'more' || name === 'menu' || name.includes('overflow')) {
      return true;
    }
    return false;
  }

  private isContextualRetryTrigger(trigger: HTMLButtonElement): boolean {
    const name = this.getTriggerAccessibleName(trigger);
    if (!name) return false;
    const banned = [
      'try again',
      'regenerate',
      'retry response',
      'modify response',
      'edit response',
      'ask to change response',
    ];
    if (name.includes('switch') && name.includes('model')) {
      return true;
    }
    return banned.some(term => name.includes(term));
  }

  private getMoreActionsButton(): HTMLButtonElement | null {
    const triggers = this.getActionMenuTriggers();
    if (!triggers.length) return null;
    return triggers[triggers.length - 1];
  }

  protected override async decorateControls(message: AssistantResponse): Promise<void> {
    await super.decorateControls(message);
    try { this.addHoverReopenListener(); } catch {}
    // Try a one-shot direct click on a microtask; idempotent guard prevents duplicates
    setTimeout(() => { try { this.tryClickNativeReadAloud(); } catch {} }, 0);
  }

  private addHoverReopenListener(): void {
    const bar = this.findActionBar();
    if (!bar) return;
    if ((bar as any)._saypiReopenHoverBound) return;
    (bar as any)._saypiReopenHoverBound = true;
    bar.addEventListener('mouseenter', () => this.tryClickNativeReadAloud());
  }

  private tryClickNativeReadAloud(): void {
    if (!this.message.isLastMessage()) return;
    const prefs = UserPreferenceModule.getInstance();
    if (!prefs.getCachedAutoReadAloudChatGPT()) return;
    if (!this.isCallActive()) return;
    if (this.skipReadAloud()) { logger.debug('[ChatGPT] Skipping read aloud for maintenance message'); return; }
    // Only auto-click for new/streaming messages marked with data-saypi-unread
    if (this.message.element.getAttribute('data-saypi-unread') !== 'true') {
      const messageId = this.message.element.getAttribute('data-testid');
      logger.debug('[ChatGPT] Skipping auto-click for already-read message', messageId);
      return;
    }

    const direct = this.getReadAloudButton();
    if (direct && !direct.disabled) {
      if ((direct as any)._saypiClicked) return;
      (direct as any)._saypiClicked = true;
      // Clear the unread flag since we're now reading it
      try { this.message.element.removeAttribute('data-saypi-unread'); } catch {}
      try { direct.click(); } catch {}
      return;
    }

    this.tryOpenMoreActionsAndClickReadAloud();
  }

  /** Check if voice call is active by reading Conversation state */
  private isCallActive(): boolean {
    try {
      const svc = (globalThis as any).StateMachineService || (window as any).StateMachineService;
      const actor = svc?.conversationActor;
      const state = actor?.getSnapshot?.() || actor?.state;
      if (!state) return false;
      return state.matches?.('listening') || state.matches?.('responding');
    } catch (_) {
      return false;
    }
  }

  /** Maintenance message check to mirror in-host behavior */
  private isMaintenanceMessage(): boolean {
    return this.message.element.classList.contains('maintenance-message');
  }

  /**
   * Auto-click native Read Aloud for the newest assistant turn once available.
   * Mirrors the in-file implementation used pre-refactor so tests remain valid.
   */
  private autoClickNativeReadAloudWhenAvailable(): void {
    const existing = this.getReadAloudButton();
    if (existing) {
      return; // likely an older message
    }

    this.readAloudObserver = new MutationObserver(() => {
      // short-circuit if button doesn't need to be clicked
      if (!this.message.isLastMessage()) return;
      const prefs = UserPreferenceModule.getInstance();
      const enabled = prefs.getCachedAutoReadAloudChatGPT();
      if (!enabled) return;
      if (!this.isCallActive()) return;
      if (this.skipReadAloud()) return;
      // Only auto-click for new/streaming messages marked with data-saypi-unread
      if (this.message.element.getAttribute('data-saypi-unread') !== 'true') return;
      const btn = this.getReadAloudButton();
      if ((btn && (btn as any)._saypiClicked)) return;
      // button does need to be clicked, so open more actions and click read aloud
      if (!btn) {
        this.tryOpenMoreActionsAndClickReadAloud();
        return;
      }
      (btn as any)._saypiClicked = true;
      try {
        // Clear the unread flag since we're now reading it
        try { this.message.element.removeAttribute('data-saypi-unread'); } catch {}
        setTimeout(() => {
          if (this.isMaintenanceMessage()) {
            logger.debug('[ChatGPT] Skipping read aloud for maintenance message (late check)');
            return;
          }
          btn.click();
        }, 0);
      } catch (e) {
        console.warn('Say, Pi auto read‑aloud click failed:', e);
      } finally {
        this.readAloudObserver?.disconnect();
        this.readAloudObserver = null;
      }
    });

    this.readAloudObserver.observe(this.message.element, { childList: true, subtree: true });
  }

  public override teardown(): void {
    try { this.readAloudObserver?.disconnect(); } catch {}
    this.readAloudObserver = null;
    super.teardown();
  }

  private tryOpenMoreActionsAndClickReadAloud(): void {
    try { this.sweepShieldAttributes(null); } catch {}
    if (!this.message.isLastMessage()) return;
    const prefs = UserPreferenceModule.getInstance();
    if (!prefs.getCachedAutoReadAloudChatGPT()) return;
    if (!this.isCallActive()) return;
    if (this.skipReadAloud()) { logger.debug('[ChatGPT] Skipping read aloud for maintenance message (late check)'); return; }
    // Only auto-click for new/streaming messages marked with data-saypi-unread
    if (this.message.element.getAttribute('data-saypi-unread') !== 'true') {
      const messageId = this.message.element.getAttribute('data-testid');
      logger.debug('[ChatGPT] Skipping auto-click for already-read message (late check)', messageId);
      return;
    }

    const triggers = this.getActionMenuTriggers();
    if (!triggers.length) return;

    const tryTrigger = (index: number) => {
      if (index >= triggers.length) return;
      const trigger = triggers[index];
      if (this.isContextualRetryTrigger(trigger)) {
        tryTrigger(index + 1);
        return;
      }
      if (!this.isMenuOpen(trigger) && !(trigger as any)._saypiMenuOpened) {
        (trigger as any)._saypiMenuOpened = true;
        try { this.synthesizeUserClick(trigger); } catch {}
      }

      let attempts = 0;
      const maxAttempts = 10; // per trigger
      const attemptInterval = 25;
      const menuRenderDelay = 75;
      let awaitingInitialRender = true;
      const tick = () => {
        const openMenu = document.querySelector('[data-radix-menu-content][data-state="open"], [data-radix-dropdown-menu-content][data-state="open"], [role="menu"][data-state="open"]');
        if (!openMenu && !this.isMenuOpen(trigger) && attempts === 0) {
          try { this.synthesizeUserClick(trigger); } catch {}
        }

        if (awaitingInitialRender) {
          awaitingInitialRender = false;
          setTimeout(tick, menuRenderDelay);
          return;
        }

        const candidate = this.findReadAloudMenuItemNear(trigger);
        if (candidate) {
          const itemEl = candidate as HTMLElement;
          // Identify the current menu element for selective cleanup
          const currentMenu = (itemEl.closest('[role="menu"]') as HTMLElement | null) || null;
          if (this.shouldSkipReadAloudMenuActivation(itemEl)) {
            this.clearShieldFromOtherMenus(currentMenu);
            return;
          }
          // Shield and activate in-place to preserve focus on the menu item
          try {
            const wrapper = this.getOpenMenuWrapperFor(candidate as HTMLElement) || this.getClosestOpenMenuWrapperTo(trigger);
            if (wrapper) {
              this.enableOutsideDismissShield(wrapper, trigger);
            }
          } catch {}
          // Focus and click the item in-place
          this.clickAndRecordReadAloudButton(itemEl);
          // Ensure only the current menu remains shielded
          this.clearShieldFromOtherMenus(currentMenu);
          return; // success
        }

        if (++attempts < maxAttempts) {
          setTimeout(tick, attemptInterval);
        } else {
          tryTrigger(index + 1);
        }
      };
      tick();
    };

    tryTrigger(0);
  }

  private findReadAloudMenuItemNear(trigger: HTMLElement): HTMLElement | null {
    const inMenu = (el: Element) => !!(el as HTMLElement).closest('[role="menu"], [data-radix-menu-content], [data-radix-dropdown-menu-content]');
    const candidates = Array.from(
      document.querySelectorAll<HTMLElement>('[data-testid="voice-play-turn-action-button"]')
    ).filter(inMenu);
    if (!candidates.length) return null;
    const tRect = trigger.getBoundingClientRect();
    candidates.sort((a, b) => {
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      const distA = Math.hypot(ar.left - tRect.left, ar.top - tRect.top);
      const distB = Math.hypot(br.left - tRect.left, br.top - tRect.top);
      if (distA !== distB) return distA - distB;
      const pos = a.compareDocumentPosition(b);
      if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
      if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1;
      return 0;
    });
    return candidates[0] || null;
  }

  private shouldSkipReadAloudMenuActivation(item: HTMLElement | null): boolean {
    if (!item) return false;
    if (item.getAttribute('data-saypi-read-aloud-clicked') === 'true') {
      return true;
    }
    const ariaLabel = item.getAttribute('aria-label');
    if (!ariaLabel) {
      return false;
    }
    const normalized = ariaLabel.trim().toLowerCase();
    if (!normalized) {
      return false;
    }
    if (normalized === 'loading' || normalized.includes('loading')) {
      return true;
    }
    if (normalized === 'stop' || normalized.includes('stop')) {
      return true;
    }
    return false;
  }

  private clickAndRecordReadAloudButton(readAloudButton: HTMLElement): void {
    try { readAloudButton.focus?.(); } catch {}
    try { readAloudButton.setAttribute('data-saypi-read-aloud-clicked', 'true'); } catch {}
    try { (readAloudButton as any)._saypiClicked = true; } catch {}
    try { this.message.element.setAttribute('data-saypi-read-aloud-clicked', 'true'); } catch {}
    // Clear the unread flag since we're now reading it
    try { this.message.element.removeAttribute('data-saypi-unread'); } catch {}
    try { readAloudButton.click?.(); } catch {}
  }

  private clearShieldFromOtherMenus(currentMenu: HTMLElement | null): void {
    try {
      const menus = Array.from(document.querySelectorAll<HTMLElement>('[role="menu"][data-saypi-shielded="true"]'));
      menus.forEach(m => {
        if (!currentMenu || m !== currentMenu) {
          try { m.removeAttribute('data-saypi-shielded'); } catch {}
        }
      });
    } catch {}
  }

  private relocateMenuItemToActionBarAndClick(item: HTMLElement, trigger: HTMLElement): void {
    try {
      const bar = (this.findActionBar() || trigger.parentElement || this.message.element) as HTMLElement;
      if (!bar) {
        try { item.click(); } catch {}
        setTimeout(() => this.hideOpenRadixPopperContent(), 50);
        return;
      }
      const holder = document.createElement('span');
      holder.className = 'saypi-relocated-voice-action';
      bar.appendChild(holder);
      holder.appendChild(item);
      try { (item as HTMLElement).focus?.(); } catch {}
      setTimeout(() => {
        try {
          item.click();
          // Nudge focus back to the item for environments that blur on click
          setTimeout(() => { try { (item as HTMLElement).focus?.(); } catch {} }, 10);
        } finally {
          setTimeout(() => this.hideOpenRadixPopperContent(), 50);
          setTimeout(() => { try { holder.remove(); } catch {} }, 50);
        }
      }, 0);
    } catch (e) {
      try { item.click(); } catch {}
      console.debug('Say, Pi: relocation click fallback due to error:', e);
    }
  }

  private isMenuOpen(trigger: HTMLElement): boolean {
    const expanded = trigger.getAttribute('aria-expanded');
    const state = trigger.getAttribute('data-state');
    return expanded === 'true' || state === 'open';
  }

  private synthesizeUserClick(target: HTMLElement): void {
    try {
      target.focus?.();
      try { target.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })); } catch {}
      try { target.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })); } catch {}
      try { target.click(); } catch {}
      try { target.dispatchEvent(new MouseEvent('mouseup', { bubbles: true })); } catch {}
      try { target.dispatchEvent(new PointerEvent('pointerup', { bubbles: true })); } catch {}
      try { target.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: ' ' })); } catch {}
    } catch (e) {
      console.debug('Say, Pi: synthetic click failed on menu trigger:', e);
    }
  }

  private hideOpenRadixPopperContent(): void {
    const sel = '[data-radix-menu-content][data-state="open"], [data-radix-dropdown-menu-content][data-state="open"], [role="menu"][data-state="open"]';
    const open = document.querySelector(sel) as HTMLElement | null;
    if (open) this.hideRadixPopperContent(open);
  }

  private hideRadixPopperContent(popper: HTMLElement): void {
    try {
      (popper.style as any).opacity = '0';
      (popper.style as any).pointerEvents = 'none';
      popper.setAttribute('aria-hidden', 'true');
    } catch {}
  }

  private getOpenMenuWrapperFor(el: HTMLElement): HTMLElement | null {
    const menu = (el.closest('[data-radix-menu-content],[data-radix-dropdown-menu-content],[role="menu"]') as HTMLElement | null);
    const wrapper = (menu?.closest('[data-radix-popper-content-wrapper]') as HTMLElement | null) || null;
    // If no wrapper exists (tests), return the menu itself
    return wrapper || menu || null;
  }

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
    const wrapper = (((nearest as HTMLElement).closest('[data-radix-popper-content-wrapper]') as HTMLElement | null) || null);
    return wrapper || nearest;
  }

  private enableOutsideDismissShield(wrapper: HTMLElement, trigger?: HTMLElement): void {
    // Clear any previous shields then mark this wrapper and its inner menu
    try { this.sweepShieldAttributes(null); } catch {}
    try { wrapper.setAttribute('data-saypi-shielded', 'true'); } catch {}
    try {
      const inner = (wrapper.matches?.('[data-radix-menu-content],[data-radix-dropdown-menu-content],[role="menu"]')
        ? wrapper
        : wrapper.querySelector('[data-radix-menu-content],[data-radix-dropdown-menu-content],[role="menu"]')) as HTMLElement | null;
      inner?.setAttribute('data-saypi-shielded', 'true');
    } catch {}
    try { this.repositionMenuToBottomRight(wrapper); } catch {}
    this.outsideShieldCleanup = () => {
      try { wrapper.removeAttribute('data-saypi-shielded'); } catch {}
      try {
        const inner = wrapper.querySelector('[data-radix-menu-content],[data-radix-dropdown-menu-content],[role="menu"]') as HTMLElement | null;
        inner?.removeAttribute('data-saypi-shielded');
      } catch {}
    };
  }

  private scheduleLazyAttach(): void {
    const limit = Date.now() + 8000;
    const timer = setInterval(() => {
      if (Date.now() > limit) { clearInterval(timer); return; }
      const bar = this.findActionBar();
      if (bar) { clearInterval(timer); }
    }, 200);
  }

  // The shielding / positioning helpers are kept in case of dropdown interference
  private outsideShieldEventHandlers: Array<{event: string, handler: (...args: any[]) => void}> = [];
  private outsideShieldCleanup: (() => void) | null = null;
  private outsideShieldWatch: any = null;
  private outsideShieldTrigger: HTMLElement | null = null;
  private outsideShieldWrapper: HTMLElement | null = null;

  private sweepShieldAttributes(ancestor: HTMLElement | null): void {
    const sel = '[data-saypi-shielded]';
    const nodes = Array.from((ancestor || document).querySelectorAll(sel));
    for (const n of nodes) { try { n.removeAttribute('data-saypi-shielded'); } catch {} }
  }

  private gentlyCloseMenu(wrapper: HTMLElement, trigger?: HTMLElement | null): void {
    try {
      const menu = wrapper.querySelector('[data-radix-menu-content],[data-radix-dropdown-menu-content],[role="menu"]') as HTMLElement | null;
      const isOpen = !!menu && (menu.getAttribute('data-state') === 'open' || wrapper.getAttribute('data-state') === 'open');
      if (!isOpen) return;
      if (menu) { try { menu.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' })); } catch {} }
      setTimeout(() => {
        const stillOpen = menu && (menu.getAttribute('data-state') === 'open' || wrapper.getAttribute('data-state') === 'open');
        if (stillOpen && trigger) { try { this.synthesizeUserClick(trigger); } catch {} }
        try { this.blurTrigger(trigger || undefined); } catch {}
      }, 40);
    } catch {}
  }

  private blurTrigger(trigger?: HTMLElement | null): void { try { trigger && trigger.blur?.(); } catch {} }

  private repositionMenuToBottomRight(wrapper: HTMLElement): void {
    const menu = wrapper.querySelector('[data-radix-menu-content],[data-radix-dropdown-menu-content],[role="menu"]') as HTMLElement | null;
    const rect = (menu || wrapper).getBoundingClientRect();
    const margin = 24;
    const x = Math.max(margin, window.innerWidth - rect.width - margin);
    const y = Math.max(margin, window.innerHeight - rect.height - margin);
    const prev = (wrapper as any)._saypiPrevTransform ?? wrapper.style.transform;
    (wrapper as any)._saypiPrevTransform = prev;
    wrapper.style.transform = `translate(${x}px, ${y}px) scale(0.965)`;
  }

  private restoreMenuPosition(wrapper: HTMLElement): void {
    const prev = (wrapper as any)._saypiPrevTransform;
    if (typeof prev === 'string') { wrapper.style.transform = prev; }
    else { try { wrapper.style.removeProperty('transform'); } catch {} }
    try { delete (wrapper as any)._saypiPrevTransform; } catch {}
  }
}

export class ChatGPTTextBlockCapture extends ElementTextStream {
  private turnContainer: HTMLElement | null = null;
  private barObserver: MutationObserver | null = null;
  private streamingStarted = false;
  private firstTokenEmitted = false;

  // ElementTextStream requires a per-mutation handler; block-capture doesn't need it
  // because it listens for action-bar completion instead.
  handleMutationEvent(_mutation: MutationRecord): void {
    // no-op
  }

  constructor(element: HTMLElement, options?: InputStreamOptions) {
    super(element, options);
    this.turnContainer = this.findTurnContainer(element);

    if (this.turnContainer?.getAttribute('data-saypi-text-captured') === 'true') {
      const text = (this.turnContainer.textContent || "").trimEnd();
      if (text) { this.next(new AddedText(text)); }
      this.complete({ type: "eod", time: Date.now() });
      return;
    }

    if (this.actionBarPresent()) {
      this.emitFinalAndClose();
    } else {
      this.registerActionBarObserver();
    }
  }

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

    let text = "";
    if (this.element.isConnected && document.contains(this.element)) {
      text = (this.element.textContent || "").trimEnd();
    }
    if (!text && this.turnContainer && document.contains(this.turnContainer)) {
      text = (this.turnContainer.textContent || "").trimEnd();
    }
    if (!text && this.turnContainer) {
      const testId = this.turnContainer.getAttribute('data-testid');
      const turnAttr = this.turnContainer.getAttribute('data-turn');
      let replacement: Element | null = null;
      if (testId) {
        replacement = document.querySelector(`[data-testid="${testId}"]`);
      }
      if (!replacement && turnAttr) {
        replacement = document.querySelector(`article[data-turn="${turnAttr}"]`);
      }
      if (replacement && replacement !== this.turnContainer) {
        text = (replacement.textContent || "").trimEnd();
      }
    }

    if (text) {
      this.next(new AddedText(text));
    }
    this.complete({ type: "eod", time: Date.now() });
    this.disconnectBarObserver();

    if (this.turnContainer) {
      this.turnContainer.setAttribute('data-saypi-text-captured', 'true');
    }
  }

  private registerActionBarObserver(): void {
    if (!this.turnContainer) return;
    if (this.actionBarPresent()) { this.emitFinalAndClose(); return; }
    this.barObserver = new MutationObserver(() => {
      if (this.closed()) { this.disconnectBarObserver(); return; }
      if (this.actionBarPresent()) { this.emitFinalAndClose(); }
    });
    this.barObserver.observe(this.turnContainer, { childList: true, subtree: true, attributes: true });
  }

  private disconnectBarObserver(): void {
    try { this.barObserver?.disconnect(); } catch {}
    this.barObserver = null;
  }
}
