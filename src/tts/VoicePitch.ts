/**
 * Ordering hint only. Measured 2026-07-31 from the live sample clips with a
 * relative voicing gate; superseded by the live measurement the moment a
 * voice's print is cached. A voice absent here is placed at 155 Hz (the
 * reference line) until its print resolves.
 *
 * Why a build-time table exists at all (design §7): the rail sorts ascending
 * by median F0, which is measured from decoded audio — so a naive
 * implementation paints in server order and then re-sorts under the reader's
 * cursor. Two numbers per voice removes the reorder entirely: known voices
 * sort instantly from the seed, and the live measurement agrees with it. Only
 * a voice the server added *since the last extension release* can move, and it
 * moves once, within 2.5 s, on one visit ever.
 */
export const VOICE_PITCH_SEED: Record<string, { hz: number; span: number }> = {
  onyx: { hz: 92.2, span: 1.37 },
  echo: { hz: 94.7, span: 1.47 },
  ash: { hz: 98.8, span: 1.66 },
  "1SM7GgM6IMuvQlz2BwM3": { hz: 114.3, span: 0.47 }, // Mark
  DTKMou8ccj1ZaWGBiotd: { hz: 119.4, span: 0.75 }, // Jamahal
  gs0tAILXbY5DNrJrsM6F: { hz: 121.2, span: 0.57 }, // Jeff
  fable: { hz: 133.9, span: 1.45 },
  alloy: { hz: 134.5, span: 1.34 },
  c6SfcYrb2t09NHXiT80T: { hz: 140.4, span: 1.12 }, // Jarnathan
  shimmer: { hz: 157.6, span: 1.57 },
  cedar: { hz: 160.0, span: 1.12 },
  vBKc2FfBKJfcZNyEt1n6: { hz: 161.6, span: 0.65 }, // Finn
  nova: { hz: 161.6, span: 1.19 },
  aMSt68OGf4xUZAnLpTU8: { hz: 175.8, span: 1.73 }, // Juniper
  "56AoDkrOh6qfVPDXZ7Pt": { hz: 181.8, span: 0.76 }, // Cassidy
  sage: { hz: 183.9, span: 1.76 },
  ballad: { hz: 186.0, span: 1.97 },
  coral: { hz: 192.8, span: 1.53 },
  g6xIsTj2HwM6VR4iXFCw: { hz: 197.5, span: 0.77 }, // Jessica
  marin: { hz: 203.8, span: 1.63 },
  lcMyyd2HUfFzxdCaC4Ta: { hz: 225.4, span: 0.76 }, // Lucy
  eR40ATw9ArzDf9h3v7t7: { hz: 260.2, span: 0.75 }, // Addison
};

/**
 * Where a voice sits when nothing is known about it: the reference line, the
 * one y every row's print is registered against. An unmeasured voice is
 * therefore *neutral* on the pitch axis rather than deep or bright, and it
 * moves exactly once, when its own audio says where it belongs.
 */
export const SEED_PLACEHOLDER_HZ = 155;

// Ids are matched case-insensitively, because a display name may be the id
// (OpenAI) or an opaque mixed-case UUID (ElevenLabs) and nothing guarantees a
// caller preserved the case the catalog used.
const BY_LOWER_ID = new Map(
  Object.entries(VOICE_PITCH_SEED).map(([id, seed]) => [id.toLowerCase(), seed])
);

/** The seeded pitch/span for a voice, or null when it was added after this release. */
export function seedPitchFor(voice: {
  id?: string | null;
}): { hz: number; span: number } | null {
  const id = String(voice?.id ?? "").toLowerCase();
  return BY_LOWER_ID.get(id) ?? null;
}

/**
 * How far a live measurement may sit from the seed and still be treated as
 * AGREEING with it, in semitones.
 *
 * This is what actually delivers §7's promise that no user ever sees a
 * reorder, and the naive "measured wins" rule does not. The seed was measured
 * from the same clips with the same estimator, so the disagreement is never
 * more than estimator noise — but it is never exactly zero either (this repo's
 * own voicingFloor change moved Onyx 92.2 → 91 Hz, and its fixture span 1.37 →
 * 1.16 s), and the catalog is full of pairs one or two Hz apart: Shimmer 157.6
 * / Cedar 160.0, Finn 161.6 / Nova 161.6, Sage 183.9 / Ballad 186.0. A
 * sub-Hz disagreement is enough to flip a near-tie, so with "measured wins"
 * three adjacent pairs swap under the reader ~2 s after the tab opens, on
 * every fresh profile, at exactly the moment they start reading.
 *
 * A semitone is 5.95 % — an order of magnitude more than the noise and an
 * order of magnitude less than a real voice change. Inside it the seed is
 * kept, so the order painted at 120 ms is the order that stays. Outside it the
 * measurement wins: a re-rendered clip that genuinely moved a voice still
 * moves it, once.
 */
export const SEED_AGREEMENT_SEMITONES = 1;
/**
 * …and the other end of the same band (design §12): a measurement more than a
 * perfect fifth from the seed is not a voice that changed, it is an estimate
 * that broke — an octave error is exactly 12 semitones away. Prefer the seed
 * and say so once, because a silently misplaced voice is confusing and
 * invisible.
 */
export const SEED_OVERRIDE_SEMITONES = 7;

const semitonesApart = (a: number, b: number): number =>
  Math.abs(12 * Math.log2(a / b));

/** One line per voice per session — a warning nobody can act on twice. */
const warned = new Set<string>();

/**
 * The pitch to sort a voice by.
 *
 * Measured print → build-time seed → the reference line, with the seed held
 * against the measurement in both directions: kept when they agree (so the
 * rail never re-sorts under the reader) and kept when they disagree wildly (so
 * one bad estimate cannot misplace a voice).
 */
export function pitchOf(
  voice: { id?: string | null },
  measured?: { medF0: number } | null
): number {
  const seed = seedPitchFor(voice)?.hz;
  const hz = measured && measured.medF0 > 0 ? measured.medF0 : 0;
  if (!hz) return seed ?? SEED_PLACEHOLDER_HZ;
  // No seed: this voice was added after the release, and its own audio is the
  // only thing that knows where it belongs. It moves once, on one visit ever.
  if (seed === undefined) return hz;
  const apart = semitonesApart(hz, seed);
  if (apart <= SEED_AGREEMENT_SEMITONES) return seed;
  if (apart >= SEED_OVERRIDE_SEMITONES) {
    const id = String(voice?.id ?? "");
    if (!warned.has(id)) {
      warned.add(id);
      console.warn(
        `Voice "${id}" measured ${hz} Hz against a seeded ${seed} Hz (${apart.toFixed(1)} semitones apart); keeping the seed. Suspect an octave error or a re-rendered sample clip.`
      );
    }
    return seed;
  }
  return hz;
}
