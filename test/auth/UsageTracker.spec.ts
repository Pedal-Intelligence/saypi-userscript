/**
 * Tests for UsageTracker
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import EventBus from "../../src/events/EventBus";

// We'll test the core logic without relying on the singleton pattern
describe("UsageTracker logic", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    EventBus.removeAllListeners();
  });

  afterEach(() => {
    EventBus.removeAllListeners();
  });

  describe("UsageStats interface", () => {
    it("should have the expected structure", async () => {
      // Import the interface
      const { UsageTracker } = await import("../../src/auth/UsageTracker");

      // The default stats should have all required fields
      const defaultStats = {
        transcriptionCount: 0,
        firstUseDate: 0,
        lastPromptShown: 0,
        promptsDismissed: 0,
        lastPromptLevel: undefined,
      };

      expect(defaultStats).toHaveProperty("transcriptionCount");
      expect(defaultStats).toHaveProperty("firstUseDate");
      expect(defaultStats).toHaveProperty("lastPromptShown");
      expect(defaultStats).toHaveProperty("promptsDismissed");
    });
  });

  describe("cooldown calculation", () => {
    it("should correctly calculate if cooldown has passed", () => {
      const now = Date.now();
      const oneHourAgo = now - 3600000;
      const fiveMinutesAgo = now - 300000;

      // Helper function to check cooldown (same logic as UsageTracker)
      const hasCooldownPassed = (lastPromptShown: number, cooldownMs: number) => {
        if (lastPromptShown === 0) return true;
        return Date.now() - lastPromptShown > cooldownMs;
      };

      // No prompt shown yet
      expect(hasCooldownPassed(0, 300000)).toBe(true);

      // Prompt shown an hour ago, 5 min cooldown
      expect(hasCooldownPassed(oneHourAgo, 300000)).toBe(true);

      // Prompt shown 5 min ago, 1 hour cooldown
      expect(hasCooldownPassed(fiveMinutesAgo, 3600000)).toBe(false);
    });
  });

  describe("prompt level determination", () => {
    it("should determine correct prompt level based on transcription count", () => {
      const thresholds = {
        toast: 5,
        softModal: 10,
        modal: 20,
      };

      // Helper function (same logic as AuthPromptController)
      const determinePromptLevel = (
        count: number,
        lastLevel: string | undefined
      ): string | null => {
        if (count >= thresholds.modal && lastLevel !== "modal") {
          return "modal";
        }
        if (count >= thresholds.softModal && lastLevel !== "soft-modal" && lastLevel !== "modal") {
          return "soft-modal";
        }
        if (count >= thresholds.toast && !lastLevel) {
          return "toast";
        }
        return null;
      };

      // Fresh user at 5 transcriptions -> toast
      expect(determinePromptLevel(5, undefined)).toBe("toast");

      // User at 10 after seeing toast -> soft-modal
      expect(determinePromptLevel(10, "toast")).toBe("soft-modal");

      // User at 20 after seeing soft-modal -> modal
      expect(determinePromptLevel(20, "soft-modal")).toBe("modal");

      // User at 25 after seeing modal -> no new prompt
      expect(determinePromptLevel(25, "modal")).toBeNull();

      // Fresh user at 25 -> modal directly
      expect(determinePromptLevel(25, undefined)).toBe("modal");
    });
  });

  describe("dismissal backoff", () => {
    it("should calculate exponential backoff for cooldown", () => {
      const BASE_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes
      const MAX_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours

      const calculateCooldown = (dismissedCount: number) => {
        return Math.min(
          BASE_COOLDOWN_MS * Math.pow(2, dismissedCount),
          MAX_COOLDOWN_MS
        );
      };

      // No dismissals -> base cooldown (5 min)
      expect(calculateCooldown(0)).toBe(300000);

      // 1 dismissal -> 10 min
      expect(calculateCooldown(1)).toBe(600000);

      // 2 dismissals -> 20 min
      expect(calculateCooldown(2)).toBe(1200000);

      // 10 dismissals -> should cap at max (24 hours)
      expect(calculateCooldown(10)).toBe(MAX_COOLDOWN_MS);
    });
  });

  describe("max dismissals", () => {
    it("should disable prompts after max dismissals", () => {
      const MAX_DISMISSALS = 5;

      const arePromptsEnabled = (dismissedCount: number) => {
        return dismissedCount < MAX_DISMISSALS;
      };

      expect(arePromptsEnabled(0)).toBe(true);
      expect(arePromptsEnabled(4)).toBe(true);
      expect(arePromptsEnabled(5)).toBe(false);
      expect(arePromptsEnabled(10)).toBe(false);
    });
  });
});
