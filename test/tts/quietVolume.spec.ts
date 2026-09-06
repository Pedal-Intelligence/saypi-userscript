import { describe, it, expect } from "vitest";
import {
  DEFAULT_TTS_VOLUME,
  QUIET_TTS_VOLUME_FACTOR,
  resolveTtsVolume,
} from "../../src/tts/quietVolume";

/**
 * #117 generalises the #437 quiet-mode volume into one resolver: the user's
 * chosen level (0–100) times quiet mode's factor, mapped onto the media
 * element's 0–1 scale. Quiet mode keeps working exactly as it did — it now
 * halves whatever level the user picked, rather than a hardcoded full volume.
 */
describe("resolveTtsVolume (#117 / #437)", () => {
  it("plays at full volume by default", () => {
    expect(resolveTtsVolume({})).toBe(1);
    expect(DEFAULT_TTS_VOLUME).toBe(100);
  });

  it("preserves #437's behaviour byte-for-byte at the default level", () => {
    expect(resolveTtsVolume({ quietMode: false })).toBe(1);
    expect(resolveTtsVolume({ quietMode: true })).toBe(QUIET_TTS_VOLUME_FACTOR);
    expect(resolveTtsVolume({ volume: DEFAULT_TTS_VOLUME, quietMode: true })).toBe(
      QUIET_TTS_VOLUME_FACTOR,
    );
  });

  it("maps the 0-100 preference onto the media element's 0-1 scale", () => {
    expect(resolveTtsVolume({ volume: 50 })).toBe(0.5);
    expect(resolveTtsVolume({ volume: 25 })).toBe(0.25);
    expect(resolveTtsVolume({ volume: 100 })).toBe(1);
  });

  it("mutes at 0 — a chosen zero is a level, not an unset value", () => {
    expect(resolveTtsVolume({ volume: 0 })).toBe(0);
    expect(resolveTtsVolume({ volume: 0, quietMode: true })).toBe(0);
  });

  it("applies quiet mode RELATIVE to the chosen level", () => {
    expect(resolveTtsVolume({ volume: 60, quietMode: true })).toBeCloseTo(0.3, 10);
    expect(resolveTtsVolume({ volume: 20, quietMode: true })).toBeCloseTo(0.1, 10);
  });

  it("clamps out-of-range levels into 0..1", () => {
    expect(resolveTtsVolume({ volume: 150 })).toBe(1);
    expect(resolveTtsVolume({ volume: -20 })).toBe(0);
  });

  it("falls back to the default level for a corrupt stored value", () => {
    for (const junk of [undefined, null, NaN, "loud", {}, [], true] as any[]) {
      expect(resolveTtsVolume({ volume: junk })).toBe(1);
    }
  });

  it("accepts numeric strings (a range input's .value is a string)", () => {
    expect(resolveTtsVolume({ volume: "40" as any })).toBeCloseTo(0.4, 10);
  });

  it("keeps quiet mode's factor a genuine attenuation", () => {
    expect(QUIET_TTS_VOLUME_FACTOR).toBeGreaterThan(0);
    expect(QUIET_TTS_VOLUME_FACTOR).toBeLessThan(1);
  });
});
