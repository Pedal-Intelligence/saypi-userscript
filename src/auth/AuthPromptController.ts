/**
 * AuthPromptController - Decides when and what authentication prompts to show
 *
 * Progressive prompting strategy:
 * - After 5 transcriptions: Toast notification (non-blocking)
 * - After 10 transcriptions: Soft modal (dismissible)
 * - After 20 transcriptions: Modal with value proposition
 *
 * Respects:
 * - User dismissals (backs off after repeated dismissals)
 * - Cooldown periods between prompts
 * - Authentication state (no prompts for authenticated users)
 */

import EventBus from "../events/EventBus";
import { logger } from "../LoggingModule";
import { UsageTracker, getUsageTracker } from "./UsageTracker";

// Cross-browser runtime API
const browserAPI = typeof browser !== "undefined" ? browser : chrome;

/**
 * Prompt levels from least to most intrusive
 */
export type PromptLevel = "toast" | "soft-modal" | "modal";

/**
 * Prompt configuration thresholds
 */
export interface PromptThresholds {
  /** Transcriptions before showing toast */
  toast: number;
  /** Transcriptions before showing soft modal */
  softModal: number;
  /** Transcriptions before showing full modal */
  modal: number;
}

/**
 * Default thresholds - can be overridden via config
 */
const DEFAULT_THRESHOLDS: PromptThresholds = {
  toast: 5,
  softModal: 10,
  modal: 20,
};

/**
 * Cooldown between prompts (in milliseconds)
 * Increases with each dismissal
 */
const BASE_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes
const MAX_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Maximum dismissals before stopping prompts entirely
 */
const MAX_DISMISSALS = 5;

/**
 * AuthPromptController singleton
 */
export class AuthPromptController {
  private static instance: AuthPromptController;
  private usageTracker: UsageTracker;
  private thresholds: PromptThresholds;
  private isInitialized: boolean = false;
  private isListening: boolean = false;
  private cachedAuthStatus: boolean | null = null;

  private constructor(thresholds?: Partial<PromptThresholds>) {
    this.usageTracker = getUsageTracker();
    this.thresholds = { ...DEFAULT_THRESHOLDS, ...thresholds };
    logger.debug("[AuthPromptController] Created with thresholds:", this.thresholds);
  }

  public static getInstance(thresholds?: Partial<PromptThresholds>): AuthPromptController {
    if (!AuthPromptController.instance) {
      AuthPromptController.instance = new AuthPromptController(thresholds);
    }
    return AuthPromptController.instance;
  }

  /**
   * Initialize the controller
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      logger.debug("[AuthPromptController] Already initialized");
      return;
    }

    // Initialize usage tracker first
    await this.usageTracker.initialize();

    // Check initial auth status
    await this.refreshAuthStatus();

    // Set up event listeners
    this.setupEventListeners();

    this.isInitialized = true;
    logger.debug("[AuthPromptController] Initialized");
  }

  /**
   * Set up event listeners for usage updates and auth changes
   */
  private setupEventListeners(): void {
    if (this.isListening) {
      return;
    }

    // Listen for usage updates from UsageTracker
    EventBus.on("saypi:usage:updated", this.handleUsageUpdate);

    // Listen for auth status changes
    browserAPI.runtime.onMessage.addListener(this.handleMessage);

    this.isListening = true;
    logger.debug("[AuthPromptController] Event listeners set up");
  }

  /**
   * Handle messages from background script (auth status changes)
   */
  private handleMessage = (
    message: { type: string; isAuthenticated?: boolean },
    _sender: chrome.runtime.MessageSender,
    _sendResponse: (response?: unknown) => void
  ): boolean | void => {
    if (message.type === "AUTH_STATUS_CHANGED") {
      logger.debug("[AuthPromptController] Auth status changed:", message.isAuthenticated);
      this.cachedAuthStatus = message.isAuthenticated ?? false;

      // If user just authenticated, hide any visible prompts
      if (this.cachedAuthStatus) {
        EventBus.emit("saypi:authPrompt:hide");
      }
    }
  };

  /**
   * Refresh auth status from background script
   */
  private async refreshAuthStatus(): Promise<boolean> {
    try {
      const response = await browserAPI.runtime.sendMessage({ type: "GET_AUTH_STATUS" });
      this.cachedAuthStatus = response?.isAuthenticated ?? false;
      logger.debug("[AuthPromptController] Auth status refreshed:", this.cachedAuthStatus);
      return this.cachedAuthStatus;
    } catch (error) {
      logger.debug("[AuthPromptController] Failed to get auth status:", error);
      this.cachedAuthStatus = false;
      return false;
    }
  }

  /**
   * Handle usage update events from UsageTracker
   */
  private handleUsageUpdate = async (data: {
    transcriptionCount: number;
    firstUseDate: number;
  }): Promise<void> => {
    logger.debug("[AuthPromptController] Usage update:", data);

    // Don't prompt if user is authenticated
    if (this.cachedAuthStatus) {
      logger.debug("[AuthPromptController] User is authenticated, skipping prompt check");
      return;
    }

    // Refresh auth status in case it changed
    const isAuthenticated = await this.refreshAuthStatus();
    if (isAuthenticated) {
      logger.debug("[AuthPromptController] User is now authenticated, skipping prompt");
      return;
    }

    // Check if we should show a prompt
    const promptLevel = this.determinePromptLevel(data.transcriptionCount);
    if (promptLevel) {
      await this.maybeShowPrompt(promptLevel, data.transcriptionCount);
    }
  };

  /**
   * Determine what prompt level to show based on transcription count
   */
  private determinePromptLevel(transcriptionCount: number): PromptLevel | null {
    const stats = this.usageTracker.getStats();
    const lastLevel = stats.lastPromptLevel as PromptLevel | undefined;

    // Check thresholds in order from most to least intrusive
    // Only upgrade if we've crossed a new threshold
    if (transcriptionCount >= this.thresholds.modal) {
      if (lastLevel !== "modal") {
        return "modal";
      }
    } else if (transcriptionCount >= this.thresholds.softModal) {
      if (lastLevel !== "soft-modal" && lastLevel !== "modal") {
        return "soft-modal";
      }
    } else if (transcriptionCount >= this.thresholds.toast) {
      if (!lastLevel) {
        return "toast";
      }
    }

    return null;
  }

  /**
   * Show a prompt if cooldown has passed and user hasn't dismissed too many times
   */
  private async maybeShowPrompt(
    level: PromptLevel,
    transcriptionCount: number
  ): Promise<void> {
    const stats = this.usageTracker.getStats();

    // Check if user has dismissed too many times
    if (stats.promptsDismissed >= MAX_DISMISSALS) {
      logger.debug(
        `[AuthPromptController] User dismissed ${stats.promptsDismissed} times, not showing more prompts`
      );
      return;
    }

    // Calculate cooldown based on number of dismissals
    const cooldown = Math.min(
      BASE_COOLDOWN_MS * Math.pow(2, stats.promptsDismissed),
      MAX_COOLDOWN_MS
    );

    // Check if cooldown has passed
    if (!this.usageTracker.hasPromptCooldownPassed(cooldown)) {
      logger.debug("[AuthPromptController] Cooldown not passed, skipping prompt");
      return;
    }

    // Emit event to show the prompt
    logger.debug(`[AuthPromptController] Showing ${level} prompt`);
    EventBus.emit("saypi:authPrompt:show", {
      level,
      transcriptionCount,
      dismissedCount: stats.promptsDismissed,
    });

    // Record that we showed a prompt
    await this.usageTracker.recordPromptShown(level);
  }

  /**
   * Called when user dismisses a prompt
   */
  public async handlePromptDismissed(): Promise<void> {
    await this.usageTracker.recordPromptDismissed();
    EventBus.emit("saypi:authPrompt:hide");
    logger.debug("[AuthPromptController] Prompt dismissed");
  }

  /**
   * Called when user clicks sign in from a prompt
   */
  public handleSignInClicked(): void {
    // Open the extension's settings page which has sign-in
    const settingsUrl = browserAPI.runtime.getURL("settings.html");
    browserAPI.tabs.create({ url: settingsUrl });

    // Hide the prompt
    EventBus.emit("saypi:authPrompt:hide");
    logger.debug("[AuthPromptController] Sign in clicked, opening settings");
  }

  /**
   * Check if prompts are enabled (not maxed out on dismissals)
   */
  public arePromptsEnabled(): boolean {
    const stats = this.usageTracker.getStats();
    return stats.promptsDismissed < MAX_DISMISSALS;
  }

  /**
   * Get current thresholds
   */
  public getThresholds(): PromptThresholds {
    return { ...this.thresholds };
  }

  /**
   * Update thresholds (for A/B testing or configuration)
   */
  public setThresholds(thresholds: Partial<PromptThresholds>): void {
    this.thresholds = { ...this.thresholds, ...thresholds };
    logger.debug("[AuthPromptController] Thresholds updated:", this.thresholds);
  }

  /**
   * Force show a specific prompt level (for testing)
   */
  public async forceShowPrompt(level: PromptLevel): Promise<void> {
    const stats = this.usageTracker.getStats();
    EventBus.emit("saypi:authPrompt:show", {
      level,
      transcriptionCount: stats.transcriptionCount,
      dismissedCount: stats.promptsDismissed,
    });
    await this.usageTracker.recordPromptShown(level);
  }

  /**
   * Reset the controller state (for testing)
   */
  public async reset(): Promise<void> {
    await this.usageTracker.resetStats();
    this.cachedAuthStatus = null;
    logger.debug("[AuthPromptController] Reset");
  }

  /**
   * Clean up event listeners
   */
  public cleanup(): void {
    if (this.isListening) {
      EventBus.off("saypi:usage:updated", this.handleUsageUpdate);
      browserAPI.runtime.onMessage.removeListener(this.handleMessage);
      this.isListening = false;
    }
    this.usageTracker.cleanup();
    this.isInitialized = false;
    logger.debug("[AuthPromptController] Cleaned up");
  }
}

// Export singleton instance getter
export const getAuthPromptController = (
  thresholds?: Partial<PromptThresholds>
): AuthPromptController => AuthPromptController.getInstance(thresholds);
