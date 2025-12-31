/**
 * UsageTracker - Anonymous usage tracking for progressive authentication prompts
 *
 * Tracks transcription count and usage stats without identifying the user.
 * Data is stored locally and used to determine when to show auth prompts.
 *
 * Features:
 * - Tracks transcription count across sessions
 * - Stores first use date for engagement analysis
 * - Tracks prompt interactions (shown, dismissed)
 * - Uses browser.storage.local for persistence
 * - Resets only on extension uninstall
 */

import EventBus from "../events/EventBus";
import { logger } from "../LoggingModule";

// Cross-browser storage API
const browserAPI = typeof browser !== "undefined" ? browser : chrome;

/**
 * Usage statistics stored in browser.storage.local
 */
export interface UsageStats {
  /** Total number of completed transcriptions */
  transcriptionCount: number;
  /** Timestamp of first transcription (ms since epoch) */
  firstUseDate: number;
  /** Timestamp of last auth prompt shown (ms since epoch) */
  lastPromptShown: number;
  /** Number of times user dismissed an auth prompt */
  promptsDismissed: number;
  /** Prompt level that was last shown (e.g., 'toast', 'soft-modal', 'modal') */
  lastPromptLevel?: string;
}

/**
 * Default initial stats for new users
 */
const DEFAULT_STATS: UsageStats = {
  transcriptionCount: 0,
  firstUseDate: 0,
  lastPromptShown: 0,
  promptsDismissed: 0,
  lastPromptLevel: undefined,
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
   */
  private async loadStats(): Promise<void> {
    try {
      const result = await browserAPI.storage.local.get(STORAGE_KEY);
      if (result[STORAGE_KEY]) {
        this.stats = { ...DEFAULT_STATS, ...result[STORAGE_KEY] };
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
   * Set up event listeners for transcription completions
   */
  private setupEventListeners(): void {
    if (this.isListening) {
      return;
    }

    // Listen for completed transcriptions
    EventBus.on("saypi:transcription:completed", this.handleTranscriptionCompleted);
    this.isListening = true;

    logger.debug("[UsageTracker] Event listeners set up");
  }

  /**
   * Handle a completed transcription event
   */
  private handleTranscriptionCompleted = async (): Promise<void> => {
    this.stats.transcriptionCount++;

    // Set first use date if this is the first transcription
    if (this.stats.firstUseDate === 0) {
      this.stats.firstUseDate = Date.now();
    }

    await this.saveStats();

    logger.debug(
      `[UsageTracker] Transcription completed. Total count: ${this.stats.transcriptionCount}`
    );

    // Emit event for AuthPromptController to react to
    EventBus.emit("saypi:usage:updated", {
      transcriptionCount: this.stats.transcriptionCount,
      firstUseDate: this.stats.firstUseDate,
    });
  };

  /**
   * Get current usage stats
   */
  public getStats(): UsageStats {
    return { ...this.stats };
  }

  /**
   * Get the current transcription count
   */
  public getTranscriptionCount(): number {
    return this.stats.transcriptionCount;
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
      EventBus.off("saypi:transcription:completed", this.handleTranscriptionCompleted);
      this.isListening = false;
    }
    this.isInitialized = false;
    logger.debug("[UsageTracker] Cleaned up");
  }
}

// Export singleton instance getter
export const getUsageTracker = (): UsageTracker => UsageTracker.getInstance();
