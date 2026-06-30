/**
 * UsageTracker - Anonymous usage tracking for progressive authentication prompts
 *
 * Tracks voice interaction count and usage stats without identifying the user.
 * Data is stored locally and used to determine when to show auth prompts.
 *
 * Features:
 * - Tracks voice interaction count across sessions (conversation turns + dictation completions)
 * - Stores first use date for engagement analysis
 * - Tracks prompt interactions (shown, dismissed)
 * - Uses browser.storage.local for persistence
 * - Resets only on extension uninstall
 *
 * Note: We track high-level interactions (conversation turns, dictation completions)
 * rather than individual transcription requests, since a single user message
 * may require many transcription segments.
 */

import EventBus from "../events/EventBus";
import { logger } from "../LoggingModule";

// Cross-browser storage API
const browserAPI = typeof browser !== "undefined" ? browser : chrome;

/**
 * Usage statistics stored in browser.storage.local
 */
export interface UsageStats {
  /** Total number of voice interactions (conversation turns + dictation completions) */
  interactionCount: number;
  /** @deprecated Use interactionCount instead - kept for backwards compatibility */
  transcriptionCount: number;
  /** Timestamp of first interaction (ms since epoch) */
  firstUseDate: number;
  /** Timestamp of last auth prompt shown (ms since epoch) */
  lastPromptShown: number;
  /** Number of times user dismissed an auth prompt */
  promptsDismissed: number;
  /** Prompt level that was last shown (e.g., 'toast', 'soft-modal', 'modal') */
  lastPromptLevel?: string;
  /** Cumulative seconds of speech transcribed (drives the speed-payoff value-mirror) — #437 */
  sttSeconds: number;
  /** Whether the one-time post-win speed-payoff notice has been shown — #437 */
  postWinShown: boolean;
  /** Whether the one-time post-win micro-survey has been shown — #437 */
  surveyShown: boolean;
}

/**
 * Default initial stats for new users
 */
const DEFAULT_STATS: UsageStats = {
  interactionCount: 0,
  transcriptionCount: 0, // deprecated, kept for backwards compatibility
  firstUseDate: 0,
  lastPromptShown: 0,
  promptsDismissed: 0,
  lastPromptLevel: undefined,
  sttSeconds: 0,
  postWinShown: false,
  surveyShown: false,
};

const STORAGE_KEY = "saypi-usage-stats";

/**
 * UsageTracker singleton for tracking anonymous usage
 */
export class UsageTracker {
  private static instance: UsageTracker;
  private stats: UsageStats = { ...DEFAULT_STATS };
  private isInitialized: boolean = false;
  private isListening: boolean = false;

  private constructor() {
    logger.debug("[UsageTracker] Created");
  }

  public static getInstance(): UsageTracker {
    if (!UsageTracker.instance) {
      UsageTracker.instance = new UsageTracker();
    }
    return UsageTracker.instance;
  }

  /**
   * Initialize the tracker by loading stats from storage and setting up event listeners
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      logger.debug("[UsageTracker] Already initialized");
      return;
    }

    await this.loadStats();
    this.setupEventListeners();
    this.isInitialized = true;

    logger.debug("[UsageTracker] Initialized with stats:", this.stats);
  }

  /**
   * Load stats from browser storage
   * Handles migration from old format (transcriptionCount only) to new format (interactionCount)
   */
  private async loadStats(): Promise<void> {
    try {
      const result = await browserAPI.storage.local.get(STORAGE_KEY);
      if (result[STORAGE_KEY]) {
        const loadedStats = { ...DEFAULT_STATS, ...result[STORAGE_KEY] };

        // Migration: if interactionCount is 0 but transcriptionCount exists, use transcriptionCount
        // This handles upgrading from old format where only transcriptionCount was tracked
        if (loadedStats.interactionCount === 0 && loadedStats.transcriptionCount > 0) {
          // Old data used transcriptionCount for raw transcription requests
          // Since we're changing to track interactions (messages/dictations),
          // we'll start fresh rather than carry over inflated counts
          logger.debug(
            `[UsageTracker] Migration: resetting count (was ${loadedStats.transcriptionCount} transcriptions)`
          );
          loadedStats.interactionCount = 0;
          loadedStats.transcriptionCount = 0;
        }

        this.stats = loadedStats;
      }
    } catch (error) {
      logger.error("[UsageTracker] Failed to load stats:", error);
    }
  }

  /**
   * Save stats to browser storage
   */
  private async saveStats(): Promise<void> {
    try {
      await browserAPI.storage.local.set({ [STORAGE_KEY]: this.stats });
    } catch (error) {
      logger.error("[UsageTracker] Failed to save stats:", error);
    }
  }

  /**
   * Set up event listeners for voice interactions
   * We track conversation turns (messages sent) and dictation completions
   * rather than individual transcription segments
   */
  private setupEventListeners(): void {
    if (this.isListening) {
      return;
    }

    // Listen for conversation turn completions (message submitted to chatbot)
    EventBus.on("session:message-sent", this.handleInteractionCompleted);

    // Listen for dictation completions (user finished dictating to a field)
    EventBus.on("dictation:complete", this.handleInteractionCompleted);

    // Accumulate transcribed speech seconds for the speed-payoff value-mirror (#437)
    EventBus.on("session:transcribing", this.handleTranscribing);

    this.isListening = true;

    logger.debug("[UsageTracker] Event listeners set up for voice interactions");
  }

  /**
   * Handle a completed voice interaction (conversation turn or dictation)
   */
  private handleInteractionCompleted = async (): Promise<void> => {
    this.stats.interactionCount++;
    // Also update deprecated field for backwards compatibility
    this.stats.transcriptionCount = this.stats.interactionCount;

    // Set first use date if this is the first interaction
    if (this.stats.firstUseDate === 0) {
      this.stats.firstUseDate = Date.now();
    }

    await this.saveStats();

    logger.debug(
      `[UsageTracker] Voice interaction completed. Total count: ${this.stats.interactionCount}`
    );

    // Emit event for AuthPromptController to react to
    EventBus.emit("saypi:usage:updated", {
      transcriptionCount: this.stats.interactionCount, // Use interactionCount for compatibility
      firstUseDate: this.stats.firstUseDate,
    });
  };

  /**
   * Accumulate transcribed-speech seconds (#437). Fires per speech segment via
   * `session:transcribing`, before the turn is submitted, so by the time the
   * post-win notice is gated the seconds already include the first exchange.
   */
  private handleTranscribing = async (detail?: { audio_duration_seconds?: number }): Promise<void> => {
    const seconds = detail?.audio_duration_seconds;
    if (typeof seconds !== "number" || !isFinite(seconds) || seconds <= 0) {
      return;
    }
    this.stats.sttSeconds += seconds;
    await this.saveStats();
  };

  /**
   * Get current usage stats
   */
  public getStats(): UsageStats {
    return { ...this.stats };
  }

  /**
   * Get the current voice interaction count
   */
  public getInteractionCount(): number {
    return this.stats.interactionCount;
  }

  /**
   * @deprecated Use getInteractionCount instead
   */
  public getTranscriptionCount(): number {
    return this.stats.interactionCount;
  }

  /**
   * Record that a prompt was shown
   * @param level The prompt level (e.g., 'toast', 'soft-modal', 'modal')
   */
  public async recordPromptShown(level: string): Promise<void> {
    this.stats.lastPromptShown = Date.now();
    this.stats.lastPromptLevel = level;
    await this.saveStats();

    logger.debug(`[UsageTracker] Recorded prompt shown: ${level}`);
  }

  /**
   * Record that the one-time post-win speed-payoff notice has been shown (#437),
   * so it never appears again.
   */
  public async markPostWinShown(): Promise<void> {
    if (this.stats.postWinShown) return;
    this.stats.postWinShown = true;
    await this.saveStats();
    logger.debug("[UsageTracker] Recorded post-win notice shown");
  }

  /**
   * Record that the one-time post-win micro-survey has been shown (#437), so it
   * never appears again.
   */
  public async markSurveyShown(): Promise<void> {
    if (this.stats.surveyShown) return;
    this.stats.surveyShown = true;
    await this.saveStats();
    logger.debug("[UsageTracker] Recorded post-win survey shown");
  }

  /**
   * Record that a prompt was dismissed
   */
  public async recordPromptDismissed(): Promise<void> {
    this.stats.promptsDismissed++;
    await this.saveStats();

    logger.debug(
      `[UsageTracker] Recorded prompt dismissed. Total dismissed: ${this.stats.promptsDismissed}`
    );
  }

  /**
   * Check if enough time has passed since the last prompt
   * @param cooldownMs Minimum time between prompts in milliseconds
   */
  public hasPromptCooldownPassed(cooldownMs: number): boolean {
    if (this.stats.lastPromptShown === 0) {
      return true;
    }
    return Date.now() - this.stats.lastPromptShown > cooldownMs;
  }

  /**
   * Get time since first use in days
   */
  public getDaysSinceFirstUse(): number {
    if (this.stats.firstUseDate === 0) {
      return 0;
    }
    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.floor((Date.now() - this.stats.firstUseDate) / msPerDay);
  }

  /**
   * Reset all stats (useful for testing)
   */
  public async resetStats(): Promise<void> {
    this.stats = { ...DEFAULT_STATS };
    await this.saveStats();
    logger.debug("[UsageTracker] Stats reset");
  }

  /**
   * Clean up event listeners
   */
  public cleanup(): void {
    if (this.isListening) {
      EventBus.off("session:message-sent", this.handleInteractionCompleted);
      EventBus.off("dictation:complete", this.handleInteractionCompleted);
      EventBus.off("session:transcribing", this.handleTranscribing);
      this.isListening = false;
    }
    this.isInitialized = false;
    logger.debug("[UsageTracker] Cleaned up");
  }
}

// Export singleton instance getter
export const getUsageTracker = (): UsageTracker => UsageTracker.getInstance();
