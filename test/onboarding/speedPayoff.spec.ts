import { describe, it, expect } from "vitest";
import {
  TYPING_WPM,
  SPEAKING_WPM,
  wordsSpoken,
  minutesSavedVsTyping,
  displayMinutesSaved,
  decidePostWin,
} from "../../src/onboarding/speedPayoff";

// Contract from saypi-saas#202: compute on-device with the SAME formula the
// mid-trial value-mirror email uses, so both surfaces show the same number.
describe("speed-payoff formula (#437, saypi-saas#202 contract)", () => {
  it("uses the agreed WPM constants", () => {
    expect(TYPING_WPM).toBe(40);
    expect(SPEAKING_WPM).toBe(150);
  });

  it("wordsSpoken = sttSeconds * SPEAKING_WPM / 60", () => {
    expect(wordsSpoken(60)).toBeCloseTo(150, 6); // 1 minute of speech ≈ 150 words
    expect(wordsSpoken(24)).toBeCloseTo(60, 6);
    expect(wordsSpoken(0)).toBe(0);
  });

  it("minutesSaved = wordsSpoken * (1/TYPING_WPM - 1/SPEAKING_WPM)", () => {
    // 150 words * (0.025 - 0.0066667) = 150 * 0.0183333 = 2.75
    expect(minutesSavedVsTyping(60)).toBeCloseTo(2.75, 4);
    expect(minutesSavedVsTyping(0)).toBe(0);
  });

  it("never returns negative for zero/garbage input", () => {
    expect(wordsSpoken(-5)).toBe(0);
    expect(minutesSavedVsTyping(-5)).toBe(0);
  });

  describe("displayMinutesSaved (rounded whole minutes; suppressed below 1)", () => {
    it("rounds to a whole minute when at least one minute is saved", () => {
      expect(displayMinutesSaved(60)).toBe(3); // 2.75 → 3
    });

    it("suppresses (null) when under a minute is saved", () => {
      expect(displayMinutesSaved(10)).toBeNull(); // ~0.46 min
      expect(displayMinutesSaved(0)).toBeNull();
    });

    it("shows 1 right at the threshold", () => {
      // ~22s of speech ≈ just over a minute saved
      expect(displayMinutesSaved(22)).toBe(1);
    });
  });

  describe("decidePostWin (one-time, after the first exchange)", () => {
    it("shows after the first exchange with the minutes saved", () => {
      const d = decidePostWin({ postWinShown: false, interactionCount: 1, sttSeconds: 60 });
      expect(d.show).toBe(true);
      expect(d.minutesSaved).toBe(3);
    });

    it("does not show before any exchange", () => {
      expect(decidePostWin({ postWinShown: false, interactionCount: 0, sttSeconds: 60 }).show).toBe(false);
    });

    it("does not show again once shown", () => {
      expect(decidePostWin({ postWinShown: true, interactionCount: 5, sttSeconds: 600 }).show).toBe(false);
    });

    it("still shows (headline only) when under a minute was saved", () => {
      const d = decidePostWin({ postWinShown: false, interactionCount: 1, sttSeconds: 5 });
      expect(d.show).toBe(true);
      expect(d.minutesSaved).toBeNull();
    });
  });
});
