import { describe, it, expect, vi } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  pitchOf,
  SEED_AGREEMENT_SEMITONES,
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

describe("pitchOf — the seed holds the order, the measurement breaks ties in it", () => {
  it("uses the seed until a print exists", () => {
    expect(pitchOf({ id: "onyx" }, null)).toBe(92.2);
    expect(pitchOf({ id: "onyx" }, { medF0: 0 })).toBe(92.2);
  });

  it("KEEPS the seed when the measurement agrees with it, so nothing reorders", () => {
    // The load-bearing case, and the one "measured always wins" gets wrong.
    // The seed and the measurement come from the same clip and the same
    // estimator, so they never disagree by more than noise — but never agree
    // exactly either, and the catalog is full of pairs 1–2 Hz apart. Fractions
    // of a semitone are enough to flip a near-tie, which is a visible reorder
    // under the reader ~2 s after the tab opens, on every fresh profile.
    expect(pitchOf({ id: "onyx" }, { medF0: 91 })).toBe(92.2); // 0.23 st
    expect(pitchOf({ id: "onyx" }, { medF0: 96.4 })).toBe(92.2); // 0.77 st
    expect(pitchOf({ id: "sage" }, { medF0: 186 })).toBe(183.9); // 0.20 st
  });

  it("lets the measurement win once it is more than a semitone out", () => {
    // A genuinely re-rendered clip still moves its voice — once.
    expect(pitchOf({ id: "onyx" }, { medF0: 100 })).toBe(100); // 1.4 st
  });

  it("keeps the seed against an estimate more than a fifth away (design §12)", () => {
    // An octave error is 12 semitones out. A silently misplaced voice is
    // confusing and invisible, so the seed wins and says so once.
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(pitchOf({ id: "onyx" }, { medF0: 184.4 })).toBe(92.2); // 12 st
    expect(warn).toHaveBeenCalledTimes(1);
    // …and only once per voice per session.
    expect(pitchOf({ id: "onyx" }, { medF0: 184.4 })).toBe(92.2);
    expect(warn).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });

  it("takes an unseeded voice's own measurement, whatever it says", () => {
    // Nothing to disagree with: this voice was added after the release, and
    // its audio is the only thing that knows where it belongs.
    expect(pitchOf({ id: "brand-new" }, { medF0: 70 })).toBe(70);
    expect(pitchOf({ id: "brand-new" }, { medF0: 300 })).toBe(300);
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
  const fixtures = [
    ["onyx", "onyx"],
    ["sage", "sage"],
    ["eR40ATw9ArzDf9h3v7t7", "addison"],
  ] as const;

  it("agrees with the measured pitch of every fixture clip", () => {
    for (const [id, fixture] of fixtures) {
      const seeded = seedPitchFor({ id })!.hz;
      const measured = measure(fixture);
      expect(
        Math.abs(12 * Math.log2(measured / seeded)),
        `${id}: seeded ${seeded} Hz vs measured ${measured} Hz`
      ).toBeLessThan(SEED_AGREEMENT_SEMITONES);
    }
  });

  it("resolves to the SEED, so the print landing cannot move a row", () => {
    // The stronger statement, and the one the reader experiences: agreement
    // within the band is not enough on its own — pitchOf has to actually
    // return the seeded value, or a 0.2-semitone drift still flips a near-tie.
    // Measured today: onyx 91 vs 92.2, sage 186 vs 183.9, addison 259 vs
    // 260.2. Sage is the live example — 186 Hz measured is EXACTLY Ballad's
    // seeded 186.0, so "measured wins" ties them and the alphabetical
    // tiebreak swaps the two rows.
    for (const [id, fixture] of fixtures) {
      const seeded = seedPitchFor({ id })!.hz;
      expect(pitchOf({ id }, { medF0: measure(fixture) }), id).toBe(seeded);
    }
  });
});
