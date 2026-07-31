import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  pitchOf,
  seedPitchFor,
  SEED_PLACEHOLDER_HZ,
  VOICE_PITCH_SEED,
} from "../../src/tts/VoicePitch";
import { extractVoicePrint, PRINT_SAMPLE_RATE } from "../../src/tts/voicePrint";

const FIXTURES = fileURLToPath(new URL("../fixtures/voiceprints/", import.meta.url));

function measure(name: string): number {
  const bytes = readFileSync(`${FIXTURES}${name}-8k-mono.pcm`);
  const pcm = new Float32Array(bytes.length / 2);
  for (let i = 0; i < pcm.length; i++) pcm[i] = bytes.readInt16LE(i * 2) / 32768;
  return extractVoicePrint(pcm, PRINT_SAMPLE_RATE).medF0;
}

describe("VOICE_PITCH_SEED", () => {
  it("is written in the order it sorts in — deepest to brightest", () => {
    // The table is also documentation: reading it top to bottom should be
    // reading the rail top to bottom.
    const hz = Object.values(VOICE_PITCH_SEED).map((seed) => seed.hz);
    expect(hz).toEqual([...hz].sort((a, b) => a - b));
  });

  it("covers the whole speaking band the axis draws", () => {
    for (const [id, seed] of Object.entries(VOICE_PITCH_SEED)) {
      expect(seed.hz, id).toBeGreaterThan(80);
      expect(seed.hz, id).toBeLessThan(288);
      expect(seed.span, id).toBeGreaterThan(0);
      expect(seed.span, id).toBeLessThan(3);
    }
  });

  it("resolves ids case-insensitively, opaque UUIDs included", () => {
    expect(seedPitchFor({ id: "onyx" })?.hz).toBe(92.2);
    expect(seedPitchFor({ id: "ONYX" })?.hz).toBe(92.2);
    expect(seedPitchFor({ id: "eR40ATw9ArzDf9h3v7t7" })?.hz).toBe(260.2);
    expect(seedPitchFor({ id: "er40atw9arzdf9h3v7t7" })?.hz).toBe(260.2);
  });

  it("has nothing to say about a voice added after this release", () => {
    expect(seedPitchFor({ id: "brand-new-voice" })).toBeNull();
    expect(seedPitchFor({})).toBeNull();
  });
});

describe("pitchOf — measured beats seeded beats the reference line", () => {
  it("prefers the live measurement once a print exists", () => {
    expect(pitchOf({ id: "onyx" }, { medF0: 96.4 })).toBe(96.4);
  });

  it("uses the seed until then, so nothing reorders under the reader", () => {
    expect(pitchOf({ id: "onyx" }, null)).toBe(92.2);
    expect(pitchOf({ id: "onyx" }, { medF0: 0 })).toBe(92.2);
  });

  it("places an unknown, unmeasured voice on the reference line", () => {
    // Neutral, not deep and not bright — and it moves exactly once, when its
    // own audio says where it belongs.
    expect(pitchOf({ id: "mystery" })).toBe(SEED_PLACEHOLDER_HZ);
  });
});

/**
 * The seed is only honest if the shipped extractor agrees with it. If these
 * drift apart, voices visibly reorder on first visit — the exact defect the
 * table exists to prevent.
 */
describe("the seed against the shipped extractor", () => {
  it("agrees with the measured pitch of every fixture clip", () => {
    for (const [id, fixture] of [
      ["onyx", "onyx"],
      ["sage", "sage"],
      ["eR40ATw9ArzDf9h3v7t7", "addison"],
    ] as const) {
      const seeded = seedPitchFor({ id })!.hz;
      const measured = measure(fixture);
      // Within a semitone and a half — far inside the gaps between neighbours
      // in the table, so the ORDER never changes when the print lands.
      expect(
        Math.abs(12 * Math.log2(measured / seeded)),
        `${id}: seeded ${seeded} Hz vs measured ${measured} Hz`
      ).toBeLessThan(1.5);
    }
  });
});
