/**
 * #420 — Put the Silero VAD's own per-frame speech probability to work.
 *
 * The VAD scores every 32 ms frame with a speech probability (`isSpeech`, 0..1).
 * Historically SayPi forwarded only the *last* frame's score (noisy) and dropped it
 * before any gate could use it. This module turns that signal into a per-segment
 * summary (peak / mean / speech-frame count) and a conservative admission gate that
 * stops near-threshold non-speech from reaching the server — the cheapest place to
 * cut the "Thank you"/"you" silence hallucinations the ASR backend produces on
 * non-speech clips.
 *
 * The gate floor is anchored to the active preset's OWN opening threshold plus a small
 * margin (not a fixed absolute value). The VAD admits a segment as soon as enough
 * frames clear that preset threshold, so anchoring there guarantees the gate never
 * rejects a segment far above the bar the VAD itself used — a quiet utterance on the
 * trigger-happy `highSensitivity` preset (which opens at 0.35) is kept, while a
 * barely-opened blip that never climbed past its own threshold is dropped.
 *
 * Both VAD clients (offscreen `vad_handler.ts`, in-page `OnscreenVADClient.ts`) share
 * this logic so the gate behaves identically on Chrome/Edge and Firefox/mobile.
 */

/** A 16 kHz Silero v5 frame is 512 samples = 32 ms. Exposed for ms↔frame reasoning. */
export const VAD_FRAME_MS = 32;

/** Silero v5's own default positive ("this is speech") threshold; the fallback bar. */
export const SILERO_V5_DEFAULT_POSITIVE_THRESHOLD = 0.5;

export interface SegmentSpeechStats {
  /** Highest per-frame speech probability across the segment (0..1). The most robust signal. */
  peakSpeechProb: number;
  /** Mean per-frame speech probability across the segment's frames (0 when the segment is empty). */
  meanSpeechProb: number;
  /**
   * Number of frames whose probability cleared the active positiveSpeechThreshold,
   * matching how vad-web tallies speech frames. This is the *actual* speech length,
   * distinct from the redemption/pre-roll-padded blob length.
   */
  speechFrameCount: number;
  /** Total frames accumulated for the segment (speech frames + the redemption tail). */
  frameCount: number;
  /** The positiveSpeechThreshold the segment was scored against (the active preset's bar). */
  positiveSpeechThreshold: number;
}

export interface SegmentAdmissionConfig {
  /**
   * How far ABOVE the active preset's positiveSpeechThreshold a segment's peak must
   * reach to be admitted. The floor is `positiveSpeechThreshold + minPeakMarginOverThreshold`,
   * so the gate is always relative to the bar the VAD used — it can never reject a
   * segment that confidently cleared its own preset, only the barely-opened ones.
   */
  minPeakMarginOverThreshold: number;
  /**
   * Optional extra floor on `speechFrameCount`. 0 disables it — the default — so a
   * short-but-loud utterance ("yes"/"no"/"stop") is never clipped on duration alone.
   * Reserved for calibration once the VAD-quality benchmark (#420 item 3) exists.
   */
  minSpeechFrames: number;
}

/**
 * Conservative defaults, intentionally chosen to favour NOT clipping real short/quiet
 * speech over catching every non-speech blip. The peak floor sits just 0.05 above each
 * preset's own opening bar; the duration floor is off. To be calibrated against a
 * labelled corpus (#420 item 3).
 */
export const DEFAULT_ADMISSION_CONFIG: SegmentAdmissionConfig = {
  minPeakMarginOverThreshold: 0.05,
  minSpeechFrames: 0,
};

export type SegmentAdmissionReason =
  | "admitted"
  | "low-peak-confidence"
  | "too-few-speech-frames";

export interface SegmentAdmissionDecision {
  admit: boolean;
  reason: SegmentAdmissionReason;
}

const toFiniteProb = (value: number): number =>
  Number.isFinite(value) ? value : 0;

/** The effective peak floor for a segment: its preset threshold + the configured margin. */
export function admissionPeakFloor(
  stats: SegmentSpeechStats,
  config: SegmentAdmissionConfig = DEFAULT_ADMISSION_CONFIG
): number {
  return stats.positiveSpeechThreshold + config.minPeakMarginOverThreshold;
}

/**
 * Decide whether a finished speech segment should be uploaded. Pure: same stats +
 * config always yield the same decision, so it is trivially unit-testable and the
 * floor lives in one reviewable place.
 */
export function admitSegment(
  stats: SegmentSpeechStats,
  config: SegmentAdmissionConfig = DEFAULT_ADMISSION_CONFIG
): SegmentAdmissionDecision {
  if (toFiniteProb(stats.peakSpeechProb) < admissionPeakFloor(stats, config)) {
    return { admit: false, reason: "low-peak-confidence" };
  }
  if (config.minSpeechFrames > 0 && stats.speechFrameCount < config.minSpeechFrames) {
    return { admit: false, reason: "too-few-speech-frames" };
  }
  return { admit: true, reason: "admitted" };
}

/**
 * Accumulates a single segment's speech-probability stats from the VAD's per-frame
 * callbacks. The vad-web pipeline fires `onFrameProcessed` for EVERY frame and fires
 * `onSpeechStart` *after* the frame that crossed the threshold — so callers:
 *   1. `observe(prob)` on every `onFrameProcessed`,
 *   2. `beginSegment()` on `onSpeechStart` (seeds the segment with that triggering frame),
 *   3. `endSegment()` on `onSpeechEnd` to read the summary,
 *   4. `reset()` on `onVADMisfire`, and defensively when the VAD is stopped/destroyed.
 * Mutable by design (one instance per client, hot path), but free of any DOM/Chrome
 * coupling so it tests as a plain object.
 */
export class SegmentStatsTracker {
  private positiveSpeechThreshold: number;
  private speaking = false;
  private lastFrameProb = 0;
  private peak = 0;
  private sum = 0;
  private frames = 0;
  private speechFrames = 0;

  constructor(positiveSpeechThreshold: number = SILERO_V5_DEFAULT_POSITIVE_THRESHOLD) {
    this.positiveSpeechThreshold = positiveSpeechThreshold;
  }

  /** Re-point at the active preset's threshold (the preset is chosen after construction). */
  setPositiveSpeechThreshold(threshold: number): void {
    if (Number.isFinite(threshold)) {
      this.positiveSpeechThreshold = threshold;
    }
  }

  /** Open a segment, seeding it with the most-recently-observed (triggering) frame. */
  beginSegment(): void {
    this.peak = 0;
    this.sum = 0;
    this.frames = 0;
    this.speechFrames = 0;
    this.speaking = true;
    this.accumulate(this.lastFrameProb);
  }

  /** Record one frame. Always tracked for seeding; only accumulated while in a segment. */
  observe(speechProb: number): void {
    const prob = toFiniteProb(speechProb);
    this.lastFrameProb = prob;
    if (this.speaking) {
      this.accumulate(prob);
    }
  }

  /** Close the segment and return its summary. */
  endSegment(): SegmentSpeechStats {
    const stats: SegmentSpeechStats = {
      peakSpeechProb: this.peak,
      meanSpeechProb: this.frames > 0 ? this.sum / this.frames : 0,
      speechFrameCount: this.speechFrames,
      frameCount: this.frames,
      positiveSpeechThreshold: this.positiveSpeechThreshold,
    };
    this.speaking = false;
    return stats;
  }

  /** Drop the in-progress segment (a library misfire, or a stop/destroy) without emitting stats. */
  reset(): void {
    this.speaking = false;
    this.peak = 0;
    this.sum = 0;
    this.frames = 0;
    this.speechFrames = 0;
  }

  private accumulate(prob: number): void {
    this.peak = Math.max(this.peak, prob);
    this.sum += prob;
    this.frames += 1;
    if (prob >= this.positiveSpeechThreshold) {
      this.speechFrames += 1;
    }
  }
}
