/**
 * CompatibilityNotificationUI - UI component for displaying compatibility warnings
 *
 * Displays dismissible compatibility notices below the prompt field, following
 * the same pattern as AgentModeNoticeModule.
 *
 * Features:
 * - Dismissible notices stored in localStorage
 * - Positioned below prompt field (like agent mode notice)
 * - Uses Lucide info icon
 * - Keyed by browser+chatbot+feature combination
 * - Persists across page reloads
 */

import EventBus from "../events/EventBus";
import getMessage from "../i18n";
import { logger } from "../LoggingModule";
import { IconModule } from "../icons/IconModule";
import { ChatbotService } from "../chatbots/ChatbotService";
import type { Chatbot } from "../chatbots/Chatbot";
import type { CompatibilityIssue } from "./BrowserCompatibilityModule";

/**
 * Compatibility Notification UI
 * Shows dismissible notices for browser/chatbot compatibility issues
 */
export class CompatibilityNotificationUI {
  private static instance: CompatibilityNotificationUI;
  private isInitialized: boolean = false;
  private currentNotice: HTMLElement | null = null;
  private dismissedState: Map<string, boolean> = new Map();
  private readonly storageKey = "saypi-compat-notice-dismissed";
  private cachedChatbot: Chatbot | null = null;

  private constructor() {
    this.loadDismissedState();
    logger.debug("[CompatibilityNotificationUI] Created");
  }

  public static getInstance(): CompatibilityNotificationUI {
    if (!CompatibilityNotificationUI.instance) {
      CompatibilityNotificationUI.instance = new CompatibilityNotificationUI();
    }
    return CompatibilityNotificationUI.instance;
  }

  /**
   * Load dismissed state from localStorage
   */
  private loadDismissedState(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.dismissedState = new Map(Object.entries(parsed));
      }
    } catch (error) {
      logger.debug("Failed to load compatibility notice dismissed state:", error);
    }
  }

  /**
   * Save dismissed state to localStorage
   */
  private saveDismissedState(): void {
    try {
      const obj = Object.fromEntries(this.dismissedState);
      localStorage.setItem(this.storageKey, JSON.stringify(obj));
    } catch (error) {
      logger.debug("Failed to save compatibility notice dismissed state:", error);
    }
  }

  /**
   * Initialize the UI component and start listening for compatibility events
   * Should be called once during extension initialization
   */
  public initialize(): void {
    if (this.isInitialized) {
      logger.debug("[CompatibilityNotificationUI] Already initialized");
      return;
    }

    logger.debug("[CompatibilityNotificationUI] Initializing event listeners");

    // Listen for compatibility issues
    EventBus.on('compatibility:issue', (issue: CompatibilityIssue) => {
      this.handleCompatibilityIssue(issue);
    });

    this.isInitialized = true;
  }

  /**
   * Get cached chatbot instance
   */
  private async getChatbot(): Promise<Chatbot> {
    if (!this.cachedChatbot) {
      this.cachedChatbot = await ChatbotService.getChatbot();
    }
    return this.cachedChatbot;
  }

  /**
   * Generate unique key for this compatibility issue
   * Format: {feature}:{browserName}:{chatbotType}
   */
  private getIssueKey(issue: CompatibilityIssue): string {
    return `${issue.feature}:${issue.browserName}:${issue.chatbotType}`;
  }

  /**
   * Handle a compatibility issue by showing appropriate notification
   */
  private async handleCompatibilityIssue(issue: CompatibilityIssue): Promise<void> {
    logger.debug(`[CompatibilityNotificationUI] Handling ${issue.feature} compatibility issue`, issue);

    const issueKey = this.getIssueKey(issue);

    // Check if already dismissed
    if (this.dismissedState.get(issueKey)) {
      logger.debug(`[CompatibilityNotificationUI] Notice already dismissed for ${issueKey}`);
      return;
    }

    // Skip if notice already shown
    if (this.currentNotice && document.contains(this.currentNotice)) {
      logger.debug("[CompatibilityNotificationUI] Notice already visible");
      return;
    }

    switch (issue.feature) {
      case 'tts':
        await this.showTTSUnavailableNotice(issue);
        break;
      case 'vad':
      case 'stt':
        // Could add VAD/STT notifications here in the future
        logger.debug(`[CompatibilityNotificationUI] No UI handler for ${issue.feature} issues yet`);
        break;
      default:
        logger.warn(`[CompatibilityNotificationUI] Unknown feature: ${issue.feature}`);
    }
  }

  /**
   * Show TTS unavailability notice (dismissible, persistent)
   */
  private async showTTSUnavailableNotice(issue: CompatibilityIssue): Promise<void> {
    await this.hideNotice(); // Remove any existing notice

    const notice = document.createElement("div");
    notice.className = "saypi-compat-notice";
    notice.setAttribute("data-issue-key", this.getIssueKey(issue));

    // Notice content
    const content = document.createElement("div");
    content.className = "saypi-compat-notice-content";

    // Icon (Lucide info)
    const iconContainer = document.createElement("div");
    iconContainer.className = "saypi-compat-notice-icon";

    try {
      const infoIcon = IconModule.info.cloneNode(true) as SVGElement;
      infoIcon.setAttribute("class", "saypi-compat-notice-info-icon");
      infoIcon.setAttribute("width", "20");
      infoIcon.setAttribute("height", "20");
      iconContainer.appendChild(infoIcon);
    } catch (error) {
      logger.warn("Failed to load info icon for compat notice", error);
      iconContainer.innerHTML = "ℹ️";
    }

    content.appendChild(iconContainer);

    // Text content
    const textContainer = document.createElement("div");
    textContainer.className = "saypi-compat-notice-text";

    const message = getMessage('ttsUnavailableBrowserChatbot', [
      issue.browserName,
      issue.chatbotName
    ]);
    textContainer.textContent = message;

    content.appendChild(textContainer);

    // Close button
    const closeButton = document.createElement("button");
    closeButton.className = "saypi-compat-notice-close";
    closeButton.setAttribute("aria-label", getMessage("dismissNotice") || "Dismiss");
    closeButton.innerHTML = "×";
    closeButton.addEventListener("click", () => this.dismissNotice(issue));

    content.appendChild(closeButton);
    notice.appendChild(content);

    // Inject into DOM
    await this.injectNotice(notice);
    this.currentNotice = notice;

    // Show with animation
    setTimeout(() => notice.classList.add("visible"), 50);

    logger.debug(
      `[CompatibilityNotificationUI] Showed TTS unavailable notice for ${issue.browserName} + ${issue.chatbotName}`
    );
  }

  /**
   * Inject notice into appropriate location (below prompt field)
   */
  private async injectNotice(notice: HTMLElement): Promise<void> {
    const chatbot = await this.getChatbot();
    const chatbotId = chatbot.getID();
    const injectionPoint = this.findInjectionPoint(chatbotId);

    if (injectionPoint) {
      // Insert after the injection point (same as AgentModeNoticeModule)
      injectionPoint.insertAdjacentElement("afterend", notice);
    } else {
      logger.warn("Could not find injection point for compatibility notice on", chatbotId);
      // Fallback: append to body
      document.body.appendChild(notice);
    }
  }

  /**
   * Find injection point for notice (below prompt field)
   * Same logic as AgentModeNoticeModule
   */
  private findInjectionPoint(chatbotId: string): HTMLElement | null {
    // Primary approach: Use universal #saypi-chat-ancestor if available
    const chatAncestor = document.querySelector("#saypi-chat-ancestor") as HTMLElement;
    if (chatAncestor) {
      return chatAncestor;
    }

    // Fallback to chatbot-specific selectors
    switch (chatbotId) {
      case "chatgpt":
        return document.querySelector('form[data-type="unified-composer"]') as HTMLElement;

      case "claude":
        return document.querySelector("fieldset.w-full") as HTMLElement;

      case "pi":
        return document.querySelector("#saypi-prompt-controls-container")?.parentElement as HTMLElement ||
               document.querySelector(".saypi-prompt-container") as HTMLElement;

      default:
        // Generic fallback
        return document.querySelector("#saypi-prompt-controls-container")?.parentElement as HTMLElement ||
               document.querySelector(".saypi-prompt-container") as HTMLElement ||
               document.querySelector('form[data-type="unified-composer"]') as HTMLElement;
    }
  }

  /**
   * Dismiss the notice and save state
   */
  private dismissNotice(issue: CompatibilityIssue): void {
    const issueKey = this.getIssueKey(issue);

    // Mark as dismissed
    this.dismissedState.set(issueKey, true);
    this.saveDismissedState();

    logger.debug(`[CompatibilityNotificationUI] Dismissed notice for ${issueKey}`);

    // Hide the notice
    this.hideNotice().catch(error => {
      logger.debug('Failed to hide compatibility notice:', error);
    });
  }

  /**
   * Hide the current notice with animation
   */
  private hideNotice(): Promise<void> {
    if (this.currentNotice) {
      this.currentNotice.classList.remove("visible");

      // Remove from DOM after animation
      return new Promise(resolve => {
        setTimeout(() => {
          if (this.currentNotice && this.currentNotice.parentNode) {
            this.currentNotice.parentNode.removeChild(this.currentNotice);
          }
          this.currentNotice = null;
          resolve();
        }, 300);
      });
    }
    return Promise.resolve();
  }

  /**
   * Reset dismissed state (useful for testing)
   */
  public resetDismissedState(issueKey?: string): void {
    if (issueKey) {
      this.dismissedState.delete(issueKey);
    } else {
      this.dismissedState.clear();
    }
    this.saveDismissedState();
  }

  /**
   * Manually trigger notice display (useful for testing)
   */
  public async forceShowNotice(issue: CompatibilityIssue): Promise<void> {
    const issueKey = this.getIssueKey(issue);
    this.resetDismissedState(issueKey);
    await this.handleCompatibilityIssue(issue);
  }
}
