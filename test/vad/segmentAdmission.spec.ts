import { describe, it, expect } from "vitest";
import {
  SegmentStatsTracker,
  admitSegment,
  admissionPeakFloor,
  DEFAULT_ADMISSION_CONFIG,
  type SegmentSpeechStats,
} from "../../src/vad/segmentAdmission";

/**
 * #420 — The Silero VAD computes a per-frame speech probability that, until now, we
 * put on the wire and then dropped before any gate could see it. This pins two pure
 * pieces that put that signal to work:
 *
 *  - SegmentStatsTracker: accumulates a segment's peak / mean speech probability and
 *    its speech-frame count (frames clearing the active positiveSpeechThreshold), so a
 *    near-threshold non-speech blip can be told apart from a confident utterance.
 *  - admitSegment: the conservative admission gate. Its floor is anchored to the active
 *    preset's OWN opening threshold plus a small margin — NOT a fixed absolute value —
 *    so it can never reject far above the bar the VAD itself used to admit the segment.
 *    That keeps a quiet utterance on the trigger-happy `highSensitivity` preset from
 *    being clipped, while still dropping the barely-opened blips that hallucinate.
 */

describe("#420 SegmentStatsTracker (per-segment speech-probability accumulation)", () => {
  it("captures peak, mean, speech-frame count, total frame count and the active threshold", () => {
    const tracker = new SegmentStatsTracker(0.4); // positiveSpeechThreshold
    // Triggering frame arrives BEFORE onSpeechStart in the real pipeline.
    tracker.observe(0.6);
    tracker.beginSegment(); // seeds the segment with the triggering frame (0.6)
    tracker.observe(0.9);
    tracker.observe(0.2); // redemption-tail frame, below the threshold
    const stats = tracker.endSegment();

    expect(stats.peakSpeechProb).toBeCloseTo(0.9, 5);
    expect(stats.frameCount).toBe(3); // 0.6 (seed) + 0.9 + 0.2
    expect(stats.meanSpeechProb).toBeCloseTo((0.6 + 0.9 + 0.2) / 3, 5);
    expect(stats.speechFrameCount).toBe(2); // 0.6 and 0.9 clear 0.4; 0.2 does not
    expect(stats.positiveSpeechThreshold).toBe(0.4); // the bar it was scored against
  });

  it("ignores frames observed while NOT in a segment (between utterances)", () => {
    const tracker = new SegmentStatsTracker(0.4);
    tracker.observe(0.95); // stray frame before any segment opens
    tracker.observe(0.1);
    tracker.beginSegment(); // seeds with the most recent frame (0.1)
    tracker.observe(0.8);
    const stats = tracker.endSegment();

    expect(stats.frameCount).toBe(2); // 0.1 (seed) + 0.8 — NOT the stray 0.95
    expect(stats.peakSpeechProb).toBeCloseTo(0.8, 5);
  });

  it("reports zeroed stats for an empty/never-started segment", () => {
    const tracker = new SegmentStatsTracker(0.5);
    const stats = tracker.endSegment();
    expect(stats).toEqual<SegmentSpeechStats>({
      peakSpeechProb: 0,
      meanSpeechProb: 0,
      speechFrameCount: 0,
      frameCount: 0,
      positiveSpeechThreshold: 0.5,
    });
  });

  it("counts speech frames against the configured positiveSpeechThreshold (inclusive at the bar)", () => {
    const tracker = new SegmentStatsTracker(0.5);
    tracker.beginSegment();
    tracker.observe(0.5); // exactly at the bar counts as speech (>=)
    tracker.observe(0.49); // just under does not
    const stats = tracker.endSegment();
    // frame 0 is the seed (lastFrameProb defaults to 0, below 0.5)
    expect(stats.speechFrameCount).toBe(1);
  });

  it("resets cleanly so a misfire (or a stop) does not bleed into the next segment", () => {
    const tracker = new SegmentStatsTracker(0.4);
    tracker.observe(0.9);
    tracker.beginSegment();
    tracker.observe(0.9);
    tracker.reset(); // e.g. a library misfire, or a mid-utterance stop

    tracker.observe(0.2);
    tracker.beginSegment();
    tracker.observe(0.3);
    const stats = tracker.endSegment();
    expect(stats.peakSpeechProb).toBeCloseTo(0.3, 5); // not the prior 0.9
    expect(stats.frameCount).toBe(2);
  });

  it("can be re-pointed at a new positiveSpeechThreshold (preset chosen after construction)", () => {
    const tracker = new SegmentStatsTracker();
    tracker.setPositiveSpeechThreshold(0.6);
    tracker.beginSegment();
    tracker.observe(0.55); // below the new bar
    tracker.observe(0.7); // above it
    const stats = tracker.endSegment();
    expect(stats.speechFrameCount).toBe(1);
    expect(stats.positiveSpeechThreshold).toBe(0.6);
  });

  it("treats non-finite probabilities as 0 (robustness against bad frames)", () => {
    const tracker = new SegmentStatsTracker(0.4);
    tracker.beginSegment();
    tracker.observe(Number.NaN);
    tracker.observe(0.8);
    const stats = tracker.endSegment();
    expect(stats.peakSpeechProb).toBeCloseTo(0.8, 5);
    expect(Number.isFinite(stats.meanSpeechProb)).toBe(true);
  });
});

describe("#420 admitSegment (preset-relative admission gate)", () => {
  const stats = (overrides: Partial<SegmentSpeechStats>): SegmentSpeechStats => ({
    peakSpeechProb: 0.9,
    meanSpeechProb: 0.6,
    speechFrameCount: 5,
    frameCount: 8,
    positiveSpeechThreshold: 0.4, // balanced preset
    ...overrides,
  });

  it("defaults to a small margin over the preset threshold and no duration floor", () => {
    expect(DEFAULT_ADMISSION_CONFIG.minPeakMarginOverThreshold).toBe(0.05);
    expect(DEFAULT_ADMISSION_CONFIG.minSpeechFrames).toBe(0);
  });

  it("computes the peak floor as preset threshold + margin", () => {
    expect(admissionPeakFloor(stats({ positiveSpeechThreshold: 0.35 }))).toBeCloseTo(0.4, 5);
    expect(admissionPeakFloor(stats({ positiveSpeechThreshold: 0.4 }))).toBeCloseTo(0.45, 5);
  });

  it("admits a confident segment", () => {
    expect(admitSegment(stats({ peakSpeechProb: 0.92 }))).toEqual({
      admit: true,
      reason: "admitted",
    });
  });

  it("admits a short-but-loud utterance (peak high, very few frames) — the safety guarantee", () => {
    expect(
      admitSegment(stats({ peakSpeechProb: 0.95, speechFrameCount: 2, frameCount: 3 }))
    ).toEqual({ admit: true, reason: "admitted" });
  });

  it("admits a QUIET sustained utterance on highSensitivity (peak above its own 0.35 bar)", () => {
    // The reviewer's case: highSensitivity opens at 0.35; a quiet word peaks ~0.45,
    // which the VAD admits. Floor = 0.35 + 0.05 = 0.40, so the gate must NOT clip it.
    expect(
      admitSegment(stats({ positiveSpeechThreshold: 0.35, peakSpeechProb: 0.45 })).admit
    ).toBe(true);
  });

  it("rejects a barely-opened blip that never climbed past its own threshold + margin", () => {
    // Opened at 0.35 but peaked only 0.38 — below the 0.40 floor. Prime non-speech.
    expect(
      admitSegment(stats({ positiveSpeechThreshold: 0.35, peakSpeechProb: 0.38 }))
    ).toEqual({ admit: false, reason: "low-peak-confidence" });
  });

  it("admits a segment peaking exactly at the floor (inclusive)", () => {
    // balanced floor = 0.45; a peak of exactly 0.45 is admitted.
    expect(admitSegment(stats({ positiveSpeechThreshold: 0.4, peakSpeechProb: 0.45 })).admit).toBe(true);
  });

  it("applies the duration floor only when configured (>0)", () => {
    const cfg = { minPeakMarginOverThreshold: 0.05, minSpeechFrames: 4 };
    expect(admitSegment(stats({ peakSpeechProb: 0.9, speechFrameCount: 3 }), cfg)).toEqual({
      admit: false,
      reason: "too-few-speech-frames",
    });
    expect(admitSegment(stats({ peakSpeechProb: 0.9, speechFrameCount: 4 }), cfg).admit).toBe(true);
  });

  it("never clips on duration alone under the default config (duration floor disabled)", () => {
    expect(admitSegment(stats({ peakSpeechProb: 0.9, speechFrameCount: 1 })).admit).toBe(true);
  });
});
