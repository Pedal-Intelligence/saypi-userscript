/**
 * TTS playback speed (#96).
 *
 * Users asked to be able to slow the assistant down, or speed it up, in ~10%
 * steps. The allowed speeds live here and nowhere else: the settings slider,
 * the stored preference and both playback paths (in-page and offscreen) all
 * resolve through `resolveTtsPlaybackRate`, so a hand-edited or corrupted
 * stored value can never reach an <audio> element unvalidated.
 */

/** Every speed the UI offers, ascending. 10% steps across a usable range. */
export const TTS_PLAYBACK_RATES = [
  0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0,
] as const;

/** Normal speed — what playback uses unless the user chose otherwise. */
export const DEFAULT_TTS_PLAYBACK_RATE = 1;

export const MIN_TTS_PLAYBACK_RATE = TTS_PLAYBACK_RATES[0];
export const MAX_TTS_PLAYBACK_RATE =
  TTS_PLAYBACK_RATES[TTS_PLAYBACK_RATES.length - 1];
/** The slider's step; the increments the issue asked for. */
export const TTS_PLAYBACK_RATE_STEP = 0.1;

/**
 * Normalise a stored/entered speed to one of the supported steps.
 *
 * Anything that isn't a number (or a numeric string — a range input's `.value`
 * is a string) falls back to normal speed; anything out of range clamps into
 * it; anything between steps — including IEEE-754 dust like 1.2000000000000002
 * — snaps to the nearest step, so the value that reaches `playbackRate` is
 * always one we offer.
 */
export function resolveTtsPlaybackRate(preference: unknown): number {
  const requested =
    typeof preference === "number"
      ? preference
      : typeof preference === "string" && preference.trim() !== ""
        ? Number(preference)
        : Number.NaN;

  if (!Number.isFinite(requested)) {
    return DEFAULT_TTS_PLAYBACK_RATE;
  }

  let nearest: number = DEFAULT_TTS_PLAYBACK_RATE;
  let smallestDistance = Number.POSITIVE_INFINITY;
  for (const rate of TTS_PLAYBACK_RATES) {
    const distance = Math.abs(rate - requested);
    if (distance < smallestDistance) {
      smallestDistance = distance;
      nearest = rate;
    }
  }
  return nearest;
}
