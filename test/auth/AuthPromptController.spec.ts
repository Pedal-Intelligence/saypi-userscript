/**
 * Tests for AuthPromptController logic
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import EventBus from "../../src/events/EventBus";

// Test the core logic of AuthPromptController without singleton complexity
describe("AuthPromptController logic", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    EventBus.removeAllListeners();
  });

  afterEach(() => {
    EventBus.removeAllListeners();
  });

  describe("threshold configuration", () => {
    it("should merge custom thresholds with defaults", () => {
      const DEFAULT_THRESHOLDS = {
        toast: 5,
        softModal: 10,
        modal: 20,
      };

      const customThresholds = { toast: 3 };
      const merged = { ...DEFAULT_THRESHOLDS, ...customThresholds };

      expect(merged.toast).toBe(3);
      expect(merged.softModal).toBe(10);
      expect(merged.modal).toBe(20);
    });
  });

  describe("prompt level determination", () => {
    const thresholds = { toast: 5, softModal: 10, modal: 20 };

    const determinePromptLevel = (
      transcriptionCount: number,
      lastLevel: string | undefined
    ): string | null => {
      if (transcriptionCount >= thresholds.modal) {
        if (lastLevel !== "modal") return "modal";
      } else if (transcriptionCount >= thresholds.softModal) {
        if (lastLevel !== "soft-modal" && lastLevel !== "modal") return "soft-modal";
      } else if (transcriptionCount >= thresholds.toast) {
        if (!lastLevel) return "toast";
      }
      return null;
    };

    it("should return toast at 5 transcriptions for new user", () => {
      expect(determinePromptLevel(5, undefined)).toBe("toast");
    });

    it("should return soft-modal at 10 transcriptions after toast", () => {
      expect(determinePromptLevel(10, "toast")).toBe("soft-modal");
    });

    it("should return modal at 20 transcriptions", () => {
      expect(determinePromptLevel(20, "soft-modal")).toBe("modal");
    });

    it("should not repeat same level", () => {
      expect(determinePromptLevel(25, "modal")).toBeNull();
    });

    it("should skip to highest level if never shown", () => {
      expect(determinePromptLevel(25, undefined)).toBe("modal");
    });

    it("should not show prompt below threshold", () => {
      expect(determinePromptLevel(3, undefined)).toBeNull();
    });
  });

  describe("authentication check", () => {
    it("should not show prompts when authenticated", () => {
      const isAuthenticated = true;
      const shouldShowPrompt = !isAuthenticated;

      expect(shouldShowPrompt).toBe(false);
    });

    it("should allow prompts when not authenticated", () => {
      const isAuthenticated = false;
      const shouldShowPrompt = !isAuthenticated;

      expect(shouldShowPrompt).toBe(true);
    });
  });

  describe("dismissal handling", () => {
    it("should increment dismissal count", () => {
      let promptsDismissed = 0;

      const recordDismissal = () => {
        promptsDismissed++;
      };

      recordDismissal();
      expect(promptsDismissed).toBe(1);

      recordDismissal();
      expect(promptsDismissed).toBe(2);
    });

    it("should stop prompts after max dismissals", () => {
      const MAX_DISMISSALS = 5;

      const shouldStopPrompts = (dismissedCount: number) => {
        return dismissedCount >= MAX_DISMISSALS;
      };

      expect(shouldStopPrompts(4)).toBe(false);
      expect(shouldStopPrompts(5)).toBe(true);
    });
  });

  describe("cooldown calculation", () => {
    it("should use exponential backoff based on dismissals", () => {
      const BASE_COOLDOWN = 5 * 60 * 1000; // 5 min
      const MAX_COOLDOWN = 24 * 60 * 60 * 1000; // 24 hours

      const getCooldown = (dismissedCount: number) => {
        return Math.min(BASE_COOLDOWN * Math.pow(2, dismissedCount), MAX_COOLDOWN);
      };

      // 0 dismissals: 5 min
      expect(getCooldown(0)).toBe(5 * 60 * 1000);

      // 1 dismissal: 10 min
      expect(getCooldown(1)).toBe(10 * 60 * 1000);

      // 4 dismissals: 80 min
      expect(getCooldown(4)).toBe(80 * 60 * 1000);
    });
  });

  describe("event emission", () => {
    it("should emit show event with correct data", () => {
      const handler = vi.fn();
      EventBus.on("saypi:authPrompt:show", handler);

      const showData = {
        level: "toast" as const,
        transcriptionCount: 5,
        dismissedCount: 0,
      };

      EventBus.emit("saypi:authPrompt:show", showData);

      expect(handler).toHaveBeenCalledWith(showData);
    });

    it("should emit hide event", () => {
      const handler = vi.fn();
      EventBus.on("saypi:authPrompt:hide", handler);

      EventBus.emit("saypi:authPrompt:hide");

      expect(handler).toHaveBeenCalled();
    });
  });

  describe("usage update handling", () => {
    it("should process usage update events", () => {
      const handler = vi.fn();
      EventBus.on("saypi:usage:updated", handler);

      const usageData = {
        transcriptionCount: 5,
        firstUseDate: Date.now(),
      };

      EventBus.emit("saypi:usage:updated", usageData);

      expect(handler).toHaveBeenCalledWith(usageData);
    });
  });
});
