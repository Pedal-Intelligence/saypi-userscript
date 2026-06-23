#!/usr/bin/env node
// VAD-quality benchmark CLI (#420 item 3). Replays the labelled seed corpus through
// the real Silero v5 model + each SayPi preset, and reports the four numbers that a
// threshold decision rests on — false-reject rate (clipped real speech), false-accept
// rate (non-speech opening a segment), and speech-onset / tail latency — for BOTH the
// raw VAD and the #420 admission gate, so the gate's effect on the trade-off is visible.
//
// Run: npm run bench:vad   (node --experimental-strip-types --no-warnings bench/vad/run.ts)
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
// @ts-ignore — pure JS libs
import { decodeWav } from "./lib/wav.mjs";
// @ts-ignore
import { summarize } from "./lib/metrics.mjs";
import { loadV5Model, runClip, RUNNER_FRAME_MS } from "./lib/runner.ts";

const here = dirname(fileURLToPath(import.meta.url));
const corpusDir = resolve(here, "corpus");
const PRESETS = ["highSensitivity", "balanced", "conservative", "none"];

const fmtPct = (x: number | null) => (x === null ? "  —  " : `${(x * 100).toFixed(0)}%`.padStart(5));
const fmtMs = (x: number | null) => (x === null ? "  —  " : `${Math.round(x)}ms`.padStart(6));

async function main() {
  const manifest = JSON.parse(readFileSync(resolve(corpusDir, "manifest.json"), "utf8"));
  const clips: Array<{ file: string; label: string; speechStartMs?: number; speechEndMs?: number; note?: string }> =
    manifest.clips;

  process.stdout.write(`Loading Silero v5 model…\n`);
  const model = await loadV5Model();

  const records: any[] = [];
  const perClip: any[] = [];

  for (const clip of clips) {
    const { samples, sampleRate } = decodeWav(readFileSync(resolve(corpusDir, clip.file)));
    for (const preset of PRESETS) {
      const { segments } = await runClip(model, samples, sampleRate, preset);
      const admitted = segments.filter((s) => s.admitted);

      for (const [mode, segs] of [["raw", segments], ["gated", admitted]] as const) {
        const first = segs[0];
        const isSpeech = clip.label === "speech";
        records.push({
          preset,
          mode,
          label: clip.label,
          detectedCount: segs.length,
          onsetLatencyMs:
            isSpeech && first ? first.startMs - (clip.speechStartMs ?? 0) : undefined,
          tailLatencyMs:
            isSpeech && first ? first.endMs - (clip.speechEndMs ?? 0) : undefined,
        });
      }

      perClip.push({
        file: clip.file,
        label: clip.label,
        preset,
        rawSegments: segments.length,
        admittedSegments: admitted.length,
        peakSpeechProb: segments.length ? Math.max(...segments.map((s) => s.peakSpeechProb)) : 0,
      });
    }
  }

  const summary = summarize(records);

  // --- Pretty table: one block per preset, raw vs gated ---
  process.stdout.write(
    `\nVAD-quality benchmark — ${clips.length} clips ` +
      `(${clips.filter((c) => c.label === "speech").length} speech / ` +
      `${clips.filter((c) => c.label === "nonspeech").length} non-speech), frame=${RUNNER_FRAME_MS}ms\n` +
      `FRR = clipped real speech (lower better). FAR = non-speech that opened a segment (lower better).\n\n`
  );
  const header = "  preset            mode    FRR    FAR   onset    tail";
  process.stdout.write(header + "\n" + "  " + "-".repeat(header.length - 2) + "\n");
  for (const preset of PRESETS) {
    for (const mode of ["raw", "gated"]) {
      const r = summary.find((s: any) => s.preset === preset && s.mode === mode);
      if (!r) continue;
      process.stdout.write(
        `  ${preset.padEnd(16)}  ${mode.padEnd(5)} ` +
          ` ${fmtPct(r.falseRejectRate)}  ${fmtPct(r.falseAcceptRate)} ` +
          ` ${fmtMs(r.meanOnsetLatencyMs)} ${fmtMs(r.meanTailLatencyMs)}\n`
      );
    }
  }

  // --- Machine-readable report (git-ignored artifact) ---
  const reportPath = resolve(here, "report.json");
  writeFileSync(
    reportPath,
    JSON.stringify({ corpus: manifest.note, frameMs: RUNNER_FRAME_MS, summary, perClip }, null, 2) + "\n"
  );
  process.stdout.write(`\nWrote machine-readable report to ${reportPath}\n`);

  // --- Highlight the gate's effect (the #420 headline) ---
  process.stdout.write(`\nGate effect (raw → gated false-accept rate):\n`);
  for (const preset of PRESETS) {
    const raw = summary.find((s: any) => s.preset === preset && s.mode === "raw");
    const gated = summary.find((s: any) => s.preset === preset && s.mode === "gated");
    if (raw && gated && raw.falseAcceptRate !== null) {
      const rawFrr = raw.falseRejectRate, gatedFrr = gated.falseRejectRate;
      const frrNote = rawFrr !== gatedFrr ? ` (FRR ${fmtPct(rawFrr).trim()}→${fmtPct(gatedFrr).trim()})` : "";
      process.stdout.write(
        `  ${preset.padEnd(16)}  FAR ${fmtPct(raw.falseAcceptRate).trim()} → ${fmtPct(gated.falseAcceptRate).trim()}${frrNote}\n`
      );
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
