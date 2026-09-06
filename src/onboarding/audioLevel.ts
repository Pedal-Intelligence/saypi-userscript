/**
 * Pure audio-level math for the onboarding "try it yourself" mic meter (#437).
 *
 * Kept free of Web Audio / DOM so it can be unit-tested; the page wires an
 * AnalyserNode's time-domain samples into `computeRms` and feeds the result
 * through `rmsToMeterPercent` to drive the meter bar.
 */

/** Root-mean-square of a block of normalized (-1..1) audio samples; 0 for empty. */
export function computeRms(samples: ArrayLike<number>): number {
  const n = samples.length;
  if (n === 0) return 0;
  let sumSquares = 0;
  for (let i = 0; i < n; i++) {
    const s = samples[i];
    sumSquares += s * s;
  }
  return Math.sqrt(sumSquares / n);
}

/**
 * The RMS at or above which we can honestly say we heard something (#615).
 *
 * A muted or disconnected source reads exactly 0; a live microphone in a quiet
 * room sits in the thousandths even with the browser's noise suppression on.
 * 0.01 — a fortieth of `rmsToMeterPercent`'s full-scale — clears that floor
 * while staying under a whisper, so quiet-mode users are not told they were
 * inaudible.
 */
export const AUDIBLE_RMS = 0.01;

/** Whether a measured level is loud enough to count as heard input. */
export function isAudible(rms: number): boolean {
  return rms >= AUDIBLE_RMS;
}

export interface MeterScale {
  /** RMS at or above which the meter is full (default 0.4 — comfortable speech). */
  ceil?: number;
}

/**
 * Maps an RMS value to a 0..100 meter percentage, clamped. Linear from 0 up to
 * `ceil`, then pinned at 100.
 */
export function rmsToMeterPercent(rms: number, scale: MeterScale = {}): number {
  const ceil = scale.ceil ?? 0.4;
  if (!(rms > 0) || ceil <= 0) return 0;
  const pct = (rms / ceil) * 100;
  return Math.min(100, Math.max(0, pct));
}
