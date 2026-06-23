import { describe, it, expect } from "vitest";
// @ts-ignore — pure JS benchmark lib, no types needed for the test.
import { classifyClip, summarize } from "../../bench/vad/lib/metrics.mjs";

/**
 * #420 item 3 — pins the VAD-quality benchmark's metric aggregation: false-reject
 * rate (clipped real speech), false-accept rate (non-speech opening a segment), and
 * latency averaging. This is the part that turns raw detections into the numbers a
 * threshold decision rests on, so it must be exactly right independent of the model.
 */

describe("#420 classifyClip", () => {
  it("speech with a detection is a true-accept; with none, a false-reject", () => {
    expect(classifyClip("speech", 2)).toBe("true-accept");
    expect(classifyClip("speech", 0)).toBe("false-reject");
  });
  it("non-speech with a detection is a false-accept; with none, a true-reject", () => {
    expect(classifyClip("nonspeech", 1)).toBe("false-accept");
    expect(classifyClip("nonspeech", 0)).toBe("true-reject");
  });
});

describe("#420 summarize", () => {
  const records = [
    // balanced / gated
    { preset: "balanced", mode: "gated", label: "speech", detectedCount: 1, onsetLatencyMs: 100, tailLatencyMs: 300 },
    { preset: "balanced", mode: "gated", label: "speech", detectedCount: 0 }, // clipped real speech
    { preset: "balanced", mode: "gated", label: "nonspeech", detectedCount: 0 },
    { preset: "balanced", mode: "gated", label: "nonspeech", detectedCount: 1 }, // false accept
  ];

  it("computes false-reject and false-accept rates per (preset, mode)", () => {
    const [s] = summarize(records);
    expect(s.preset).toBe("balanced");
    expect(s.mode).toBe("gated");
    expect(s.speechTotal).toBe(2);
    expect(s.falseRejects).toBe(1);
    expect(s.falseRejectRate).toBeCloseTo(0.5, 5);
    expect(s.nonspeechTotal).toBe(2);
    expect(s.falseAccepts).toBe(1);
    expect(s.falseAcceptRate).toBeCloseTo(0.5, 5);
  });

  it("averages latency only over detected speech clips", () => {
    const [s] = summarize(records);
    // only the one detected speech clip contributes (the clipped one does not).
    expect(s.meanOnsetLatencyMs).toBeCloseTo(100, 5);
    expect(s.meanTailLatencyMs).toBeCloseTo(300, 5);
  });

  it("separates modes and presets into distinct rows", () => {
    const rows = summarize([
      { preset: "highSensitivity", mode: "raw", label: "nonspeech", detectedCount: 1 },
      { preset: "highSensitivity", mode: "gated", label: "nonspeech", detectedCount: 0 },
    ]);
    expect(rows).toHaveLength(2);
    const raw = rows.find((r) => r.mode === "raw")!;
    const gated = rows.find((r) => r.mode === "gated")!;
    // The gate's whole job: drop the non-speech the raw VAD accepted.
    expect(raw.falseAcceptRate).toBe(1);
    expect(gated.falseAcceptRate).toBe(0);
  });

  it("yields null rates (not NaN) for an empty class", () => {
    const [s] = summarize([
      { preset: "none", mode: "gated", label: "speech", detectedCount: 1, onsetLatencyMs: 50 },
    ]);
    expect(s.falseRejectRate).toBe(0);
    expect(s.falseAcceptRate).toBeNull(); // no non-speech clips
    expect(s.meanTailLatencyMs).toBeNull(); // none supplied
  });
});
