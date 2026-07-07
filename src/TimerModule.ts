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
 * Calculate the delay before submitting a message to the chatbot.
 *
 * The wait is patience, spent where the endpointing model says the user may NOT
 * be finished: `maxDelay · (1 − pFinishedSpeaking) · (1 − tempo)`, floored at
 * MIN_INITIAL_DELAY_MS, minus the time already elapsed since the user stopped
 * speaking. A low score ("probably mid-sentence") holds the turn open; a high
 * score submits promptly. (#521 — the original formula was proportional to p,
 * which spent the patience exactly where it was least needed.)
 *
 * @param timeUserStoppedSpeaking - The time the user stopped speaking (ms epoch).
 * @param probabilityFinished - P(user has finished their turn), in [0, 1].
 *   Absent means no signal: treated as 0 → maximum patience.
 * @param tempo - Speech tempo in [0, 1]; faster speech shortens the wait
 *   (a fast speaker who hasn't resumed is likely done). Absent means neutral (0).
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
  const tempoFactor = 1 - clamp01(tempo ?? 0);

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
