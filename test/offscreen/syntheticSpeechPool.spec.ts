import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import {
  SYNTHETIC_SPEECH_CLIPS,
  pickSyntheticSpeechClip,
} from "../../src/offscreen/syntheticSpeechPool";

describe("syntheticSpeechPool", () => {
  it("exposes a non-trivial pool of extension-relative WAV paths", () => {
    expect(SYNTHETIC_SPEECH_CLIPS.length).toBeGreaterThan(1);
    for (const clip of SYNTHETIC_SPEECH_CLIPS) {
      expect(clip).toMatch(/^audio\/synthetic-speech\/\d{2}\.wav$/);
    }
    // No duplicates.
    expect(new Set(SYNTHETIC_SPEECH_CLIPS).size).toBe(SYNTHETIC_SPEECH_CLIPS.length);
  });

  it("pickSyntheticSpeechClip only ever returns a pool member", () => {
    for (let i = 0; i < 50; i++) {
      expect(SYNTHETIC_SPEECH_CLIPS).toContain(pickSyntheticSpeechClip());
    }
  });

  it("honours an injected RNG to address every clip deterministically", () => {
    SYNTHETIC_SPEECH_CLIPS.forEach((clip, index) => {
      // rng returns a value in [0,1); map index -> mid-bucket so flooring lands on it.
      const rng = () => (index + 0.5) / SYNTHETIC_SPEECH_CLIPS.length;
      expect(pickSyntheticSpeechClip(rng)).toBe(clip);
    });
  });

  it("stays within bounds for the rng edges (0 and ~1)", () => {
    expect(pickSyntheticSpeechClip(() => 0)).toBe(SYNTHETIC_SPEECH_CLIPS[0]);
    expect(pickSyntheticSpeechClip(() => 0.999999)).toBe(
      SYNTHETIC_SPEECH_CLIPS[SYNTHETIC_SPEECH_CLIPS.length - 1],
    );
  });

  it("every pool clip exists on disk under public/ (guards file/list drift)", () => {
    const publicDir = resolve(import.meta.dirname, "../../public");
    for (const clip of SYNTHETIC_SPEECH_CLIPS) {
      expect(existsSync(resolve(publicDir, clip))).toBe(true);
    }
  });
});
