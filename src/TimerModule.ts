/**
 * Minimum initial delay (measured from when the user stopped speaking) before an
 * auto-submit, even when the endpointing model is certain the user has finished.
 * Guards against an overconfident score cutting the user off when transcription
 * returns unusually fast; in the typical case transcription latency already
 * exceeds this, so it adds no perceptible latency. Empirical knob — tune against
 * the server-side endpointing eval (see #519/#521).
 */
export const MIN_INITIAL_DELAY_MS = 500;

/**
 * The most that speech tempo can discount the endpointing wait: a tempo of 1.0
 * (fastest) scales the patience by `1 − TEMPO_WEIGHT`, so at 0.5 tempo can at most
 * halve the wait and never erase it. Tempo is derived from words-per-minute over
 * the clip, and on a clip too short for a stable rate (a few words in under ~2 s)
 * one word more or less swings it from 0 to 1. Fleet data showed about one short
 * clip in five arriving with tempo pinned at 1.0, so a straight `(1 − tempo)`
 * multiplier let that noise override the endpointing model outright (#656).
 */
export const TEMPO_WEIGHT = 0.5;

/**
 * Calculate the delay before submitting a message to the chatbot.
 *
 * The wait is patience, spent where the endpointing model says the user may NOT
 * be finished: `maxDelay · (1 − pFinishedSpeaking) · (1 − TEMPO_WEIGHT · tempo)`,
 * floored at MIN_INITIAL_DELAY_MS, minus the time already elapsed since the user
 * stopped speaking. A low score ("probably mid-sentence") holds the turn open; a
 * high score submits promptly. (#521 — the original formula was proportional to p,
 * which spent the patience exactly where it was least needed.)
 *
 * Tempo is a bounded discount, not a second veto: only pFinishedSpeaking can take
 * the wait down to the floor. A clip too short for a stable words-per-minute rate
 * must not override the endpointing model — under the old `(1 − tempo)` factor a
 * p = 0.03 fragment with tempo saturated at 1.0 submitted on the 500 ms floor and
 * cut the user off mid-sentence (#656).
 *
 * @param timeUserStoppedSpeaking - The time the user stopped speaking (ms epoch).
 * @param probabilityFinished - P(user has finished their turn), in [0, 1].
 *   Absent means no signal: treated as 0 → maximum patience.
 * @param tempo - Speech tempo in [0, 1]; faster speech shortens the wait by up to
 *   TEMPO_WEIGHT (a fast speaker who hasn't resumed is likely done). Absent means
 *   neutral (0), which is how the server marks clips too short to measure.
 * @param maxDelay - The maximum delay.
 * @returns The remaining delay in milliseconds.
 */
export function calculateDelay(
  timeUserStoppedSpeaking: number,
  probabilityFinished: number | undefined,
  tempo: number | undefined,
  maxDelay: number
): number {
  const currentTime = new Date().getTime();

  // Time elapsed since the user stopped speaking (in milliseconds)
  const timeElapsed = currentTime - timeUserStoppedSpeaking;

  const pFinished = clamp01(probabilityFinished ?? 0);
  const tempoFactor = 1 - TEMPO_WEIGHT * clamp01(tempo ?? 0);

  // Patience is proportional to how UNfinished the model thinks the user is
  const initialDelay = Math.max(
    maxDelay * (1 - pFinished) * tempoFactor,
    MIN_INITIAL_DELAY_MS
  );

  // Account for the time already elapsed (e.g. transcription latency)
  const finalDelay = Math.max(initialDelay - timeElapsed, 0);
  return finalDelay;
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}
