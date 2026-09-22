// Pure metrics for the #655 fragmentation benchmark (unit-tested in
// test/bench/vad-fragmentation.spec.ts). Kept free of ONNX / fs so they can be tested on
// hand-built segments.

/** Share of uploaded clips at or under 1 / 2 / 3 s, plus median, the server's buckets. */
export function summarizeClips(clipMs) {
  const n = clipMs.length;
  if (!n) return { clips: 0, le1: 0, le2: 0, le3: 0, medianMs: 0 };
  const sorted = [...clipMs].sort((a, b) => a - b);
  const le = (t) => clipMs.filter((x) => x <= t).length / n;
  return { clips: n, le1: le(1000), le2: le(2000), le3: le(3000), medianMs: sorted[Math.floor(n / 2)] };
}

export const SHORT_SPEECH_MS = 600;

/**
 * Attribute VAD segments to ground-truth speech units on one speaker's channel.
 *
 * @param segs  segments from segmentProbs (frame indices)
 * @param frameMs  frame length in ms
 * @param words  this speaker's words [{start,end}] in seconds, sorted by start
 * @param acts   dialogue acts [{start,end}] (one "thought")
 * @param turns  turns [{start,end}] (consecutive acts with short gaps)
 *
 * A segment counts as this speaker's own speech only if it contains the midpoint of at
 * least one of their words — headset channels also pick up other people faintly, and
 * those crosstalk segments are not the thing being measured.
 *
 * Returns the own-speech clip lengths, how many segments each act / turn was cut into,
 * and for every SHORT fragment whether it was a mid-turn cut (the same turn continues
 * after it) or a genuine turn end, with the gap to the next speech onset.
 *
 * "Short" is judged on the speech span, not the clip: the uploaded clip includes the
 * silence tail, so comparing clip lengths across tail settings is rigged (a 0.4 s "yes"
 * is a 0.8 s clip at a 320 ms tail and a 1.2 s clip at 768 ms). SHORT_SPEECH_MS = 600 ms
 * is what the server's "≤ 1 s" bucket holds under the shipped 320 ms tail + 64 ms pad.
 */
export function attributeSegmentsToUnits(segs, frameMs, words, acts, turns) {
  const f2s = (f) => (f * frameMs) / 1000;
  const own = segs
    .map((s) => ({
      ...s,
      clipStartS: f2s(s.clipStartFrame),
      speechStartS: f2s(s.speechStartFrame),
      speechEndS: f2s(s.lastSpeechFrame + 1),
      clipEndS: f2s(s.endFrame + 1),
    }))
    .filter((s) => words.some((w) => {
      const mid = (w.start + w.end) / 2;
      return mid >= s.clipStartS && mid <= s.clipEndS;
    }));

  const overlaps = (s, u) => s.speechStartS < u.end && s.speechEndS > u.start;
  const countFor = (units) => units.map((u) => own.filter((s) => overlaps(s, u)).length);

  const subSecond = [];
  own.forEach((s, i) => {
    if (Math.round((s.speechEndS - s.speechStartS) * 1000) > SHORT_SPEECH_MS) return;
    const next = own[i + 1];
    const gapMs = next ? Math.round((next.speechStartS - s.speechEndS) * 1000) : null;
    const turn = turns.find((u) => overlaps(s, u));
    // A cut: the speaker's turn is still going after this clip ended, and the next clip
    // belongs to the same turn.
    const kind = turn && next && overlaps(next, turn) ? "cut" : "turn-end";
    subSecond.push({ kind, gapMs, clipMs: s.clipMs });
  });

  return {
    clipMs: own.map((s) => s.clipMs),
    speechMs: own.map((s) => Math.round((s.speechEndS - s.speechStartS) * 1000)),
    actSegCounts: countFor(acts),
    turnSegCounts: countFor(turns),
    subSecond,
  };
}

/**
 * Adaptive hold: simulate a client that, when the VAD closes a SHORT segment (speech span
 * ≤ `maxHeldSpeechMs`), waits up to `holdMs` more before uploading it; if speech restarts
 * within that window the two segments are joined into one upload (repeatedly, so a run of
 * fragments collapses). Long segments upload as soon as the VAD closes them, so only short
 * clips pay the extra wait.
 *
 * Input segments are frame-indexed (from segmentProbs). Returns the resulting uploads with
 * `clipMs` and `heldMs` (extra latency that upload paid before being sent).
 */
export function coalesceShortSegments(segs, frameMs, { maxHeldSpeechMs, holdMs }) {
  const out = [];
  let cur = null;
  const speechMs = (s) => (s.lastSpeechFrame + 1 - s.speechStartFrame) * frameMs;
  for (const s of segs) {
    if (cur) {
      const gapMs = (s.speechStartFrame - cur.endFrame) * frameMs;
      if (gapMs <= holdMs) {
        // Speech resumed inside the hold window: extend the held upload to cover it.
        cur = {
          ...cur,
          endFrame: s.endFrame,
          lastSpeechFrame: s.lastSpeechFrame,
          clipMs: (s.endFrame - cur.clipStartFrame + 1) * frameMs,
        };
        if (speechMs(cur) > maxHeldSpeechMs) {
          out.push({ ...cur, heldMs: 0 });
          cur = null;
        }
        continue;
      }
      out.push({ ...cur, heldMs: holdMs });
      cur = null;
    }
    if (speechMs(s) <= maxHeldSpeechMs) cur = { ...s };
    else out.push({ ...s, heldMs: 0 });
  }
  if (cur) out.push({ ...cur, heldMs: holdMs });
  return out;
}

/** Bucket the gap from a sub-second clip's end of speech to the next speech onset. */
export function gapHistogram(subSecond) {
  const buckets = [
    ["<500ms", 0, 500],
    ["500ms–1s", 500, 1000],
    ["1–2s", 1000, 2000],
    ["2–5s", 2000, 5000],
    ["≥5s / none", 5000, Infinity],
  ];
  const out = {};
  for (const [label, lo, hi] of buckets) {
    out[label] = subSecond.filter((x) => {
      const g = x.gapMs ?? Infinity;
      return g >= lo && (g < hi || hi === Infinity);
    }).length;
  }
  return out;
}
