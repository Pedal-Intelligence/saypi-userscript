/**
 * AuthPromptUI - UI components for progressive authentication prompts
 *
 * Displays toast and modal prompts encouraging users to sign in.
 * Follows the same patterns as AgentModeNoticeModule and CompatibilityNotificationUI.
 *
 * Features:
 * - Toast: Non-blocking notification in corner
 * - Soft Modal: Dismissible overlay, less intrusive
 * - Modal: Full modal with value proposition
 * - Dark mode support
 * - Mobile responsive
 * - Accessibility support
 */

import EventBus from "../events/EventBus";
import { logger } from "../LoggingModule";
import getMessage from "../i18n";
import { IconModule } from "../icons/IconModule";
import { ChatbotService } from "../chatbots/ChatbotService";
import type { Chatbot } from "../chatbots/Chatbot";
import type { PromptLevel } from "./AuthPromptController";
import { getAuthPromptController } from "./AuthPromptController";
import { h } from "preact";
import { mountInto, unmountFrom } from "../ui/preact/mount";
import { AuthToastContent } from "./AuthToastContent";
import { AuthModalContent } from "./AuthModalContent";

/**
 * Event data for showing auth prompts
 */
interface AuthPromptShowEvent {
  level: PromptLevel;
  transcriptionCount: number;
  dismissedCount: number;
}

/**
 * AuthPromptUI singleton for managing auth prompt display
 */
export class AuthPromptUI {
  private static instance: AuthPromptUI;
  private currentPrompt: HTMLElement | null = null;
  private currentOverlay: HTMLElement | null = null;
  private isInitialized: boolean = false;
  private cachedChatbot: Chatbot | null = null;

  private constructor() {
    logger.debug("[AuthPromptUI] Created");
  }

  public static getInstance(): AuthPromptUI {
    if (!AuthPromptUI.instance) {
      AuthPromptUI.instance = new AuthPromptUI();
    }
    return AuthPromptUI.instance;
  }

  /**
   * Initialize the UI component and start listening for prompt events
   */
  public initialize(): void {
    if (this.isInitialized) {
      logger.debug("[AuthPromptUI] Already initialized");
      return;
    }

    // Listen for show/hide events from AuthPromptController
    EventBus.on("saypi:authPrompt:show", this.handleShowPrompt);
    EventBus.on("saypi:authPrompt:hide", this.handleHidePrompt);

    this.isInitialized = true;
    logger.debug("[AuthPromptUI] Initialized");
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
   * Handle show prompt event
   */
  private handleShowPrompt = async (event: AuthPromptShowEvent): Promise<void> => {
    logger.debug("[AuthPromptUI] Show prompt:", event);

    // Hide any existing prompt first
    await this.hidePrompt();

    switch (event.level) {
      case "toast":
        await this.showToast(event);
        break;
      case "soft-modal":
        await this.showSoftModal(event);
        break;
      case "modal":
        await this.showModal(event);
        break;
    }
  };

  /**
   * Handle hide prompt event
   */
  private handleHidePrompt = async (): Promise<void> => {
    await this.hidePrompt();
  };

  /**
   * Show a toast notification (non-blocking, bottom corner)
   */
  private async showToast(event: AuthPromptShowEvent): Promise<void> {
    const toast = document.createElement("div");
    toast.className = "saypi-auth-prompt saypi-auth-toast";
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "polite");

    mountInto(
      toast,
      h(AuthToastContent, {
        iconSvg: this.brandIconSvg(24),
        text:
          getMessage("authPromptToast") ||
          "Sign in to track your voice usage and sync settings",
        signInLabel: getMessage("signIn") || "Sign In",
        dismissLabel: getMessage("dismissNotice") || "Dismiss",
        onSignIn: () => this.handleSignIn(),
        onDismiss: () => this.handleDismiss(),
      }),
    );

    document.body.appendChild(toast);
    this.currentPrompt = toast;

    // Show with animation
    requestAnimationFrame(() => {
      toast.classList.add("visible");
    });

    // Auto-dismiss after 20 seconds
    setTimeout(() => {
      if (this.currentPrompt === toast) {
        this.hidePrompt();
      }
    }, 20000);

    logger.debug("[AuthPromptUI] Toast shown");
  }

  /**
   * Show a soft modal (dismissible overlay, less intrusive)
   */
  private async showSoftModal(event: AuthPromptShowEvent): Promise<void> {
    // Create overlay
    const overlay = document.createElement("div");
    overlay.className = "saypi-auth-overlay saypi-auth-overlay-soft";
    overlay.addEventListener("click", () => this.handleDismiss());

    // Create modal
    const modal = document.createElement("div");
    modal.className = "saypi-auth-prompt saypi-auth-modal saypi-auth-modal-soft";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "saypi-auth-title");
    modal.addEventListener("click", (e) => e.stopPropagation());

    mountInto(modal, this.modalContentVnode(event, "soft"));

    document.body.appendChild(overlay);
    document.body.appendChild(modal);

    this.currentOverlay = overlay;
    this.currentPrompt = modal;

    // Show with animation
    requestAnimationFrame(() => {
      overlay.classList.add("visible");
      modal.classList.add("visible");
    });

    logger.debug("[AuthPromptUI] Soft modal shown");
  }

  /**
   * Show a full modal with value proposition
   */
  private async showModal(event: AuthPromptShowEvent): Promise<void> {
    // Create overlay
    const overlay = document.createElement("div");
    overlay.className = "saypi-auth-overlay";
    overlay.addEventListener("click", () => this.handleDismiss());

    // Create modal
    const modal = document.createElement("div");
    modal.className = "saypi-auth-prompt saypi-auth-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "saypi-auth-title");
    modal.addEventListener("click", (e) => e.stopPropagation());

    mountInto(modal, this.modalContentVnode(event, "full"));

    document.body.appendChild(overlay);
    document.body.appendChild(modal);

    this.currentOverlay = overlay;
    this.currentPrompt = modal;

    // Show with animation
    requestAnimationFrame(() => {
      overlay.classList.add("visible");
      modal.classList.add("visible");
    });

    // Trap focus in modal
    this.trapFocus(modal);

    logger.debug("[AuthPromptUI] Modal shown");
  }

  /**
   * Build the SayPi brand icon as raw SVG at the given size (or null on failure).
   */
  private brandIconSvg(size: number): string | null {
    try {
      const icon = IconModule.bubbleBw.cloneNode(true) as SVGElement;
      icon.setAttribute("width", String(size));
      icon.setAttribute("height", String(size));
      return icon.outerHTML;
    } catch {
      return null;
    }
  }

  /**
   * Build the modal content vnode for the given variant. Faithful to the prior
   * createModalContent (same title / description / benefits / button labels).
   */
  private modalContentVnode(
    event: AuthPromptShowEvent,
    variant: "soft" | "full",
  ) {
    const description =
      variant === "full"
        ? getMessage("authPromptModalFull") ||
          "You've used SayPi for " +
            event.transcriptionCount +
            " voice messages! Sign in to unlock usage tracking, sync your settings across devices, and get personalized voice features."
        : getMessage("authPromptModalSoft") ||
          "Sign in to track your voice usage and sync your settings across all your devices.";

    const benefits =
      variant === "full"
        ? [
            getMessage("authBenefitLimits") ||
              "Higher usage limits with free account",
            getMessage("authBenefitTTS") ||
              "Text-to-speech voices (paid plans)",
            getMessage("authBenefitPremium") ||
              "Premium features & chatbot support",
          ]
        : [];

    return h(AuthModalContent, {
      variant,
      iconSvg: this.brandIconSvg(56),
      title: getMessage("authPromptTitle") || "Unlock More Voice Features",
      description,
      benefits,
      signInLabel: getMessage("signIn") || "Sign In",
      laterLabel: getMessage("maybeLater") || "Maybe Later",
      dismissLabel: getMessage("dismissNotice") || "Dismiss",
      onSignIn: () => this.handleSignIn(),
      onDismiss: () => this.handleDismiss(),
    });
  }

  /**
   * Handle sign in button click
   */
  private handleSignIn(): void {
    getAuthPromptController().handleSignInClicked();
  }

  /**
   * Handle dismiss (close button or overlay click)
   */
  private async handleDismiss(): Promise<void> {
    await getAuthPromptController().handlePromptDismissed();
  }

  /**
   * Hide the current prompt with animation
   */
  private async hidePrompt(): Promise<void> {
    const promptToRemove = this.currentPrompt;
    const overlayToRemove = this.currentOverlay;

    if (!promptToRemove && !overlayToRemove) {
      return;
    }

    // Start hide animation
    if (promptToRemove) {
      promptToRemove.classList.remove("visible");
    }
    if (overlayToRemove) {
      overlayToRemove.classList.remove("visible");
    }

    // Remove from DOM after animation
    await new Promise<void>(resolve => {
      setTimeout(() => {
        if (promptToRemove) {
          unmountFrom(promptToRemove);
        }
        if (promptToRemove?.parentNode) {
          promptToRemove.parentNode.removeChild(promptToRemove);
        }
        if (overlayToRemove?.parentNode) {
          overlayToRemove.parentNode.removeChild(overlayToRemove);
        }
        resolve();
      }, 300);
    });

    this.currentPrompt = null;
    this.currentOverlay = null;

    logger.debug("[AuthPromptUI] Prompt hidden");
  }

  /**
   * Trap focus within modal for accessibility
   */
  private trapFocus(modal: HTMLElement): void {
    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element
    firstElement.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      } else if (e.key === "Escape") {
        this.handleDismiss();
      }
    };

    modal.addEventListener("keydown", handleKeyDown);

    // Clean up when modal is removed
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.removedNodes.length > 0) {
          mutation.removedNodes.forEach((node) => {
            if (node === modal) {
              modal.removeEventListener("keydown", handleKeyDown);
              observer.disconnect();
            }
          });
        }
      });
    });

    if (modal.parentNode) {
      observer.observe(modal.parentNode, { childList: true });
    }
  }

  /**
   * Force show a prompt (for testing)
   */
  public async forceShow(level: PromptLevel): Promise<void> {
    await this.handleShowPrompt({
      level,
      transcriptionCount: 10,
      dismissedCount: 0,
    });
  }

  /**
   * Clean up event listeners
   */
  public cleanup(): void {
    EventBus.off("saypi:authPrompt:show", this.handleShowPrompt);
    EventBus.off("saypi:authPrompt:hide", this.handleHidePrompt);
    this.hidePrompt();
    this.isInitialized = false;
    logger.debug("[AuthPromptUI] Cleaned up");
  }
}

// Export singleton getter
export const getAuthPromptUI = (): AuthPromptUI => AuthPromptUI.getInstance();
