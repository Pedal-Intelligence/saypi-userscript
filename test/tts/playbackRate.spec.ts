import { describe, it, expect } from "vitest";
import {
  DEFAULT_TTS_PLAYBACK_RATE,
  TTS_PLAYBACK_RATES,
  resolveTtsPlaybackRate,
} from "../../src/tts/playbackRate";

/**
 * #96 — the allowed playback speeds live in ONE place. Everything else (the
 * settings slider, the preference module, both playback paths) resolves through
 * `resolveTtsPlaybackRate`, so a stored value can never reach an <audio>
 * element unvalidated.
 */
describe("TTS_PLAYBACK_RATES (#96)", () => {
  it("is ascending, unique, and includes the 1.0x default", () => {
    const sorted = [...TTS_PLAYBACK_RATES].sort((a, b) => a - b);
    expect([...TTS_PLAYBACK_RATES]).toEqual(sorted);
    expect(new Set(TTS_PLAYBACK_RATES).size).toBe(TTS_PLAYBACK_RATES.length);
    expect(TTS_PLAYBACK_RATES).toContain(DEFAULT_TTS_PLAYBACK_RATE);
    expect(DEFAULT_TTS_PLAYBACK_RATE).toBe(1);
  });

  it("offers 10% increments across a usable range (issue #96 requirement 2)", () => {
    expect(TTS_PLAYBACK_RATES[0]).toBe(0.5);
    expect(TTS_PLAYBACK_RATES[TTS_PLAYBACK_RATES.length - 1]).toBe(2);
    for (let i = 1; i < TTS_PLAYBACK_RATES.length; i++) {
      expect(TTS_PLAYBACK_RATES[i] - TTS_PLAYBACK_RATES[i - 1]).toBeCloseTo(0.1, 10);
    }
    // The examples the issue names are all offered.
    for (const rate of [0.7, 0.8, 0.9, 1.0, 1.1, 1.2]) {
      expect(TTS_PLAYBACK_RATES).toContain(rate);
    }
  });
});

describe("resolveTtsPlaybackRate", () => {
  it("returns a supported step unchanged", () => {
    for (const rate of TTS_PLAYBACK_RATES) {
      expect(resolveTtsPlaybackRate(rate)).toBe(rate);
    }
  });

  it("falls back to the default for anything that isn't a number", () => {
    for (const junk of [undefined, null, NaN, "fast", "", {}, [], true, false]) {
      expect(resolveTtsPlaybackRate(junk)).toBe(DEFAULT_TTS_PLAYBACK_RATE);
    }
  });

  it("accepts numeric strings (a range input's .value is a string)", () => {
    expect(resolveTtsPlaybackRate("1.5")).toBe(1.5);
    expect(resolveTtsPlaybackRate("0.5")).toBe(0.5);
  });

  it("clamps out-of-range values into the supported range", () => {
    expect(resolveTtsPlaybackRate(0.1)).toBe(TTS_PLAYBACK_RATES[0]);
    expect(resolveTtsPlaybackRate(16)).toBe(
      TTS_PLAYBACK_RATES[TTS_PLAYBACK_RATES.length - 1],
    );
    expect(resolveTtsPlaybackRate(-1)).toBe(TTS_PLAYBACK_RATES[0]);
    expect(resolveTtsPlaybackRate(0)).toBe(TTS_PLAYBACK_RATES[0]);
    expect(resolveTtsPlaybackRate(Infinity)).toBe(DEFAULT_TTS_PLAYBACK_RATE);
  });

  it("snaps between-step values — and float dust — to the nearest step", () => {
    expect(resolveTtsPlaybackRate(1.23)).toBe(1.2);
    expect(resolveTtsPlaybackRate(1.26)).toBe(1.3);
    // 0.5 + 7 * 0.1 in IEEE-754 doubles; must not leak to playbackRate as-is.
    expect(resolveTtsPlaybackRate(0.5 + 7 * 0.1)).toBe(1.2);
    expect(Number.isInteger(resolveTtsPlaybackRate(1.23) * 10)).toBe(true);
  });
});
