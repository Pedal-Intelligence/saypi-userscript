// Pure aggregation for the VAD-quality benchmark — no I/O, no model. Turns per-clip
// detection outcomes into the four numbers #420 cares about: false-reject rate
// (clipped real speech), false-accept rate (non-speech that opened a segment), and
// speech-onset / tail latency. Kept pure so it is unit-testable without the model.

/**
 * Classify one clip's outcome in one mode (raw VAD, or gated by the #420 admission
 * gate). `detectedCount` is the number of segments that survived in that mode.
 *   speech    + detected>0 -> "true-accept"   ; +0 -> "false-reject"
 *   nonspeech + detected>0 -> "false-accept"  ; +0 -> "true-reject"
 */
export function classifyClip(label, detectedCount) {
  const detected = detectedCount > 0;
  if (label === "speech") return detected ? "true-accept" : "false-reject";
  if (label === "nonspeech") return detected ? "false-accept" : "true-reject";
  throw new Error(`Unknown label: ${label}`);
}

const mean = (xs) =>
  xs.length === 0 ? null : xs.reduce((a, b) => a + b, 0) / xs.length;

/**
 * Aggregate a flat list of per-(preset, mode, clip) records into a summary keyed by
 * `${preset}::${mode}`. Each record:
 *   { preset, mode, label, detectedCount, onsetLatencyMs?, tailLatencyMs? }
 * onset/tail latency are averaged only over speech clips that were detected.
 */
export function summarize(records) {
  const groups = new Map();
  for (const r of records) {
    const key = `${r.preset}::${r.mode}`;
    if (!groups.has(key)) {
      groups.set(key, {
        preset: r.preset,
        mode: r.mode,
        speechTotal: 0,
        falseRejects: 0,
        nonspeechTotal: 0,
        falseAccepts: 0,
        _onsets: [],
        _tails: [],
      });
    }
    const g = groups.get(key);
    const outcome = classifyClip(r.label, r.detectedCount);
    if (r.label === "speech") {
      g.speechTotal++;
      if (outcome === "false-reject") g.falseRejects++;
      else {
        if (typeof r.onsetLatencyMs === "number") g._onsets.push(r.onsetLatencyMs);
        if (typeof r.tailLatencyMs === "number") g._tails.push(r.tailLatencyMs);
      }
    } else {
      g.nonspeechTotal++;
      if (outcome === "false-accept") g.falseAccepts++;
    }
  }

  return [...groups.values()].map((g) => ({
    preset: g.preset,
    mode: g.mode,
    speechTotal: g.speechTotal,
    falseRejects: g.falseRejects,
    falseRejectRate: g.speechTotal === 0 ? null : g.falseRejects / g.speechTotal,
    nonspeechTotal: g.nonspeechTotal,
    falseAccepts: g.falseAccepts,
    falseAcceptRate:
      g.nonspeechTotal === 0 ? null : g.falseAccepts / g.nonspeechTotal,
    meanOnsetLatencyMs: mean(g._onsets),
    meanTailLatencyMs: mean(g._tails),
  }));
}
