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
 * The pitch to sort a voice by, most trustworthy source first:
 * measured print → build-time seed → the reference line.
 */
export function pitchOf(
  voice: { id?: string | null },
  measured?: { medF0: number } | null
): number {
  if (measured && measured.medF0 > 0) return measured.medF0;
  return seedPitchFor(voice)?.hz ?? SEED_PLACEHOLDER_HZ;
}
