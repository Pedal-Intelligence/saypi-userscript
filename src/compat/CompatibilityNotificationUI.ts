/**
 * CompatibilityNotificationUI - UI component for displaying compatibility warnings
 *
 * Listens for compatibility events from BrowserCompatibilityModule and shows
 * user-friendly notifications.
 *
 * This module is purely UI-focused and has no knowledge of how compatibility
 * checks are performed.
 */

import EventBus from "../events/EventBus";
import { TextualNotificationsModule } from "../NotificationsModule";
import getMessage from "../i18n";
import { logger } from "../LoggingModule";
import { IconModule } from "../icons/IconModule";
import type { CompatibilityIssue } from "./BrowserCompatibilityModule";

/**
 * Compatibility Notification UI
 * Listens for compatibility events and shows appropriate notifications
 */
export class CompatibilityNotificationUI {
  private static instance: CompatibilityNotificationUI;
  private notifications: TextualNotificationsModule;
  private isInitialized: boolean = false;

  private constructor() {
    this.notifications = new TextualNotificationsModule();
    logger.debug("[CompatibilityNotificationUI] Created");
  }

  public static getInstance(): CompatibilityNotificationUI {
    if (!CompatibilityNotificationUI.instance) {
      CompatibilityNotificationUI.instance = new CompatibilityNotificationUI();
    }
    return CompatibilityNotificationUI.instance;
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
   * Handle a compatibility issue by showing appropriate notification
   */
  private handleCompatibilityIssue(issue: CompatibilityIssue): void {
    logger.debug(`[CompatibilityNotificationUI] Handling ${issue.feature} compatibility issue`, issue);

    switch (issue.feature) {
      case 'tts':
        this.showTTSUnavailableNotification(issue);
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
   * Show TTS unavailability notification with Lucide info icon
   */
  private showTTSUnavailableNotification(issue: CompatibilityIssue): void {
    const message = getMessage('ttsUnavailableBrowserChatbot', [
      issue.browserName,
      issue.chatbotName
    ]);

    // Use custom notification with embedded IconModule icon
    this.showNotificationWithIcon(message, IconModule.info, 30);

    logger.debug(
      `[CompatibilityNotificationUI] Showed TTS unavailable notification for ${issue.browserName} + ${issue.chatbotName}`
    );
  }

  /**
   * Show notification with embedded SVG icon from IconModule
   * @param message - Notification message text
   * @param icon - SVG element from IconModule
   * @param seconds - Auto-dismiss timeout in seconds
   */
  private showNotificationWithIcon(message: string, icon: SVGElement, seconds: number): void {
    // Initialize notification element
    const notificationElement = this.getOrCreateNotificationElement();

    // Clear previous notification
    this.hideNotification(notificationElement);

    // Show new notification
    notificationElement.classList.add('active');

    // Clone and add icon
    const iconClone = icon.cloneNode(true) as SVGElement;
    iconClone.classList.add('icon');
    notificationElement.appendChild(iconClone);

    // Add message content
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('content');

    const messageSpan = document.createElement('span');
    messageSpan.classList.add('message');
    messageSpan.textContent = message;
    contentDiv.appendChild(messageSpan);

    notificationElement.appendChild(contentDiv);

    // Auto-dismiss after timeout
    setTimeout(() => {
      this.hideNotification(notificationElement);
    }, seconds * 1000);
  }

  /**
   * Get or create the notification DOM element
   */
  private getOrCreateNotificationElement(): HTMLElement {
    let element = document.getElementById('saypi-notification') as HTMLElement | null;

    if (!element || !document.body.contains(element)) {
      element = document.createElement('p');
      element.id = 'saypi-notification';
      element.classList.add('text-notification');
      document.body.appendChild(element);

      // Hide notification when clicked
      element.addEventListener('click', () => {
        this.hideNotification(element!);
      });
    }

    return element;
  }

  /**
   * Hide notification and clear content
   */
  private hideNotification(element: HTMLElement): void {
    element.classList.remove('active');

    // Remove all child elements
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }
}
