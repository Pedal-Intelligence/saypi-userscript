import { describe, it, expect } from "vitest";
// @ts-ignore — pure JS benchmark lib, no types needed for the test.
import { summarizeClips, attributeSegmentsToUnits, gapHistogram, coalesceShortSegments } from "../../bench/vad/lib/fragmentation.mjs";

/**
 * #655 — pins the fragmentation benchmark's attribution logic: which VAD segments belong
 * to the speaker, how many clips each spoken thought became, and whether a sub-second
 * clip was a mid-turn cut or a genuine short turn. These decide the numbers a VAD-tail
 * change rests on, so they must be right independent of the model.
 */

const FRAME_MS = 100; // round numbers: frame f spans [f/10, (f+1)/10) seconds

/** A segment whose speech spans [startS, endS), with a 0.1 s pad and 0.3 s tail. */
function seg(startS: number, endS: number) {
  const speechStartFrame = Math.round(startS * 10);
  const lastSpeechFrame = Math.round(endS * 10) - 1;
  const endFrame = lastSpeechFrame + 3;
  const clipStartFrame = speechStartFrame - 1;
  return {
    clipStartFrame,
    speechStartFrame,
    lastSpeechFrame,
    endFrame,
    clipMs: (endFrame - clipStartFrame + 1) * FRAME_MS,
    speechFrames: 0,
    peakProb: 0.9,
  };
}
const word = (start: number, end: number) => ({ start, end });

describe("#655 summarizeClips", () => {
  it("reports the server's ≤1/2/3 s buckets and the median", () => {
    const s = summarizeClips([500, 1000, 1500, 2500, 4000]);
    expect(s.clips).toBe(5);
    expect(s.le1).toBeCloseTo(0.4);
    expect(s.le2).toBeCloseTo(0.6);
    expect(s.le3).toBeCloseTo(0.8);
    expect(s.medianMs).toBe(1500);
  });
  it("is all-zero for no clips rather than NaN", () => {
    expect(summarizeClips([])).toEqual({ clips: 0, le1: 0, le2: 0, le3: 0, medianMs: 0 });
  });
});

describe("#655 attributeSegmentsToUnits", () => {
  // One turn, "so I was … thinking about it", with a pause from 1.6 s to 2.4 s.
  const words = [word(1.0, 1.2), word(1.2, 1.4), word(1.4, 1.6), word(2.4, 3.0), word(3.0, 3.6)];
  const act = { start: 1.0, end: 3.6 };
  const turn = { start: 1.0, end: 3.6 };

  it("counts a thought cut at a pause as two clips and the first as a mid-turn cut", () => {
    const r = attributeSegmentsToUnits([seg(1.0, 1.6), seg(2.4, 3.6)], FRAME_MS, words, [act], [turn]);
    expect(r.actSegCounts).toEqual([2]);
    expect(r.turnSegCounts).toEqual([2]);
    expect(r.subSecond).toHaveLength(1); // 0.6 s of speech: a short fragment
    expect(r.subSecond[0]).toMatchObject({ kind: "cut", gapMs: 800, clipMs: 1000 });
  });

  it("counts the same thought held in one clip as one", () => {
    const r = attributeSegmentsToUnits([seg(1.0, 3.6)], FRAME_MS, words, [act], [turn]);
    expect(r.actSegCounts).toEqual([1]);
    expect(r.subSecond).toHaveLength(0);
  });

  it("calls a short clip at the end of its turn a genuine short turn", () => {
    const yes = [word(10.0, 10.4)];
    const r = attributeSegmentsToUnits(
      [seg(10.0, 10.4), seg(20.0, 21.0)],
      FRAME_MS,
      [...yes, word(20.0, 21.0)],
      [{ start: 10.0, end: 10.4 }],
      [{ start: 10.0, end: 10.4 }, { start: 20.0, end: 21.0 }]
    );
    expect(r.subSecond[0]).toMatchObject({ kind: "turn-end", gapMs: 9600 });
  });

  it("ignores crosstalk segments that contain none of the speaker's words", () => {
    const r = attributeSegmentsToUnits([seg(5.0, 5.5), seg(1.0, 3.6)], FRAME_MS, words, [act], [turn]);
    expect(r.clipMs).toHaveLength(1);
  });
});

describe("#655 gapHistogram", () => {
  it("buckets gaps and treats a missing next onset as ≥5s", () => {
    const h = gapHistogram([{ gapMs: 200 }, { gapMs: 700 }, { gapMs: 1500 }, { gapMs: 3000 }, { gapMs: null }]);
    expect(h).toEqual({ "<500ms": 1, "500ms–1s": 1, "1–2s": 1, "2–5s": 1, "≥5s / none": 1 });
  });
});

describe("#655 coalesceShortSegments (adaptive hold)", () => {
  const opts = { maxHeldSpeechMs: 1000, holdMs: 500 };

  it("joins a short fragment with speech that resumes inside the hold window", () => {
    // 0.6 s "so I was", VAD closes at frame 18; speech resumes at 2.1 s (300 ms later).
    const out = coalesceShortSegments([seg(1.0, 1.6), seg(2.1, 3.6)], FRAME_MS, opts);
    expect(out).toHaveLength(1);
    expect(out[0]).toMatchObject({ speechStartFrame: 10, lastSpeechFrame: 35, heldMs: 0 });
    expect(out[0].clipMs).toBe(seg(1.0, 3.6).clipMs);
  });

  it("uploads a genuine short turn after the hold, paying the hold as latency", () => {
    const out = coalesceShortSegments([seg(1.0, 1.4), seg(9.0, 12.0)], FRAME_MS, opts);
    expect(out).toHaveLength(2);
    expect(out[0].heldMs).toBe(500);
    expect(out[1].heldMs).toBe(0);
  });

  it("never holds a long segment", () => {
    const out = coalesceShortSegments([seg(1.0, 3.0), seg(3.5, 3.9)], FRAME_MS, opts);
    expect(out.map((s: any) => s.heldMs)).toEqual([0, 500]);
  });

  it("collapses a run of fragments, releasing once the joined speech is long", () => {
    const out = coalesceShortSegments(
      [seg(1.0, 1.3), seg(1.8, 2.1), seg(2.6, 2.9), seg(3.4, 3.7)],
      FRAME_MS,
      opts
    );
    // 1.0–2.1 s is 1.1 s of speech span (> 1 s), so it is released as soon as the second
    // fragment closes, with no hold; the next two fragments join the same way.
    expect(out).toHaveLength(2);
    expect(out[0]).toMatchObject({ speechStartFrame: 10, lastSpeechFrame: 20, heldMs: 0 });
    expect(out[1]).toMatchObject({ speechStartFrame: 26, lastSpeechFrame: 36, heldMs: 0 });
  });
});
