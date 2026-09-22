#!/usr/bin/env node
// Fragmentation benchmark (#655). How often does the VAD cut one spoken thought into
// several uploads, how short are the resulting clips, and what does a longer silence tail
// cost in end-of-turn latency?
//
// Corpora (fetched by `npm run bench:vad:fetch-segmentation`, git-ignored):
//   - AMI meeting corpus, headset channels + manual word timings + dialogue acts
//     (CC-BY-4.0): spontaneous conversational speech with real hesitations. Ground truth
//     for "one thought" = a dialogue act; for "one turn" = the speaker's consecutive
//     dialogue acts with no gap longer than TURN_GAP_S.
//   - LibriSpeech test-clean (CC-BY-4.0): read speech; each utterance is one continuous
//     span, so every extra segment is a cut. A lower bound on chopping (readers pause less
//     mid-sentence than people thinking aloud).
//   - Synthetic pause sweep (macOS `say` with [[slnc N]]): the pause length at which each
//     config starts splitting two phrases.
//
// Run: npm run bench:vad:segmentation [-- --model <path-to-onnx>] [--label v6]
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join, basename } from "node:path";
// @ts-ignore — pure JS lib
import { decodeWav } from "./lib/wav.mjs";
import {
  loadSileroModel,
  computeFrameProbs,
  segmentProbs,
  FRAME_MS,
  type SegmenterConfig,
  type Segment,
} from "./lib/segmenter.ts";
// @ts-ignore — pure JS lib
import { summarizeClips, attributeSegmentsToUnits, gapHistogram, coalesceShortSegments } from "./lib/fragmentation.mjs";
import { VAD_CONFIGS } from "../../src/vad/VADConfigs.ts";

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const argVal = (name: string) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const dataDir = resolve(argVal("--data") ?? join(here, "corpus-segmentation"));
const modelPath = argVal("--model");
// --context feeds each frame with the previous 64 samples, as upstream Silero does and as
// vad-web ≥0.0.31 does (0.0.24, what ships today, does not — see withSileroContext).
const withContext = args.includes("--context");
const modelLabel =
  (argVal("--label") ?? (modelPath ? basename(modelPath, ".onnx") : "silero_v5")) + (withContext ? "+ctx" : "");
const cacheDir = join(dataDir, ".probs", modelLabel);
mkdirSync(cacheDir, { recursive: true });

const TURN_GAP_S = 1.5;

const shipped = (name: "balanced" | "highSensitivity"): SegmenterConfig => {
  const c = VAD_CONFIGS[name] as any;
  return {
    positiveSpeechThreshold: c.positiveSpeechThreshold,
    negativeSpeechThreshold: c.negativeSpeechThreshold,
    redemptionFrames: c.redemptionFrames,
    minSpeechFrames: c.minSpeechFrames,
    preSpeechPadFrames: c.preSpeechPadFrames,
  };
};
const balanced = shipped("balanced");
const withR = (r: number, extra: Partial<SegmenterConfig> = {}): SegmenterConfig => ({ ...balanced, redemptionFrames: r, ...extra });

type Policy = { name: string; config: SegmenterConfig; hold?: { maxHeldSpeechMs: number; holdMs: number } };
export const CONFIGS: Policy[] = [
  { name: "balanced (shipped, 320ms)", config: balanced },
  { name: "quiet mode (highSens, 384ms)", config: shipped("highSensitivity") },
  { name: "balanced neg0.15", config: withR(10, { negativeSpeechThreshold: 0.15 }) },
  { name: "tail 448ms (r14)", config: withR(14) },
  { name: "tail 512ms (r16)", config: withR(16) },
  { name: "tail 640ms (r20)", config: withR(20) },
  { name: "tail 768ms (r24)", config: withR(24) },
  { name: "tail 960ms (r30)", config: withR(30) },
  // Silero's own thresholds at the same tail. (Its default minSpeechFrames 9 = 288 ms is left
  // out on purpose: that drops real one-word turns as misfires, which reads as "fewer short
  // fragments" when it is really lost speech — the #420 FRR finding.)
  { name: "0.5/0.35 thresholds, 768ms", config: withR(24, { positiveSpeechThreshold: 0.5, negativeSpeechThreshold: 0.35 }) },
  // Adaptive hold on top of the shipped 320 ms tail: only short segments wait longer.
  { name: "hold ≤700ms speech +448ms", config: balanced, hold: { maxHeldSpeechMs: 700, holdMs: 448 } },
  { name: "hold ≤1s speech +448ms", config: balanced, hold: { maxHeldSpeechMs: 1000, holdMs: 448 } },
  { name: "hold ≤1.5s speech +640ms", config: balanced, hold: { maxHeldSpeechMs: 1500, holdMs: 640 } },
  { name: "tail 448 + hold ≤1s +448ms", config: withR(14), hold: { maxHeldSpeechMs: 1000, holdMs: 448 } },
];

/** Uploads under a policy, each with `heldMs` = extra wait vs the shipped 320 ms tail. */
async function uploadsFor(probs: Float32Array, p: Policy): Promise<Array<Segment & { heldMs: number }>> {
  const segs = await segmentProbs(probs, p.config);
  const tailExtra = (p.config.redemptionFrames - balanced.redemptionFrames) * FRAME_MS;
  const out = p.hold ? coalesceShortSegments(segs, FRAME_MS, p.hold) : segs.map((s) => ({ ...s, heldMs: 0 }));
  return out.map((s: any) => ({ ...s, heldMs: s.heldMs + tailExtra }));
}

let model: any;
async function probsFor(key: string, load: () => { samples: Float32Array; sampleRate: number }): Promise<Float32Array> {
  const path = join(cacheDir, key.replace(/[\/]/g, "_") + ".f32");
  if (existsSync(path)) {
    const buf = readFileSync(path);
    return new Float32Array(buf.buffer, buf.byteOffset, buf.byteLength / 4);
  }
  model ??= await loadSileroModel(modelPath, { withContext });
  const { samples, sampleRate } = load();
  const probs = await computeFrameProbs(model, samples, sampleRate);
  writeFileSync(path, Buffer.from(probs.buffer));
  return probs;
}

function loadAudioAny(path: string): { samples: Float32Array; sampleRate: number } {
  if (path.endsWith(".wav")) return decodeWav(readFileSync(path));
  // FLAC (LibriSpeech) → raw 16 kHz PCM16 via ffmpeg on stdout (a streamed WAV header has
  // no valid length, so take headerless samples instead).
  const raw = execFileSync("ffmpeg", ["-v", "error", "-i", path, "-ac", "1", "-ar", "16000", "-f", "s16le", "-"], {
    maxBuffer: 1 << 28,
  });
  const pcm = new Int16Array(raw.buffer, raw.byteOffset, raw.byteLength >> 1);
  return { samples: Float32Array.from(pcm, (v) => v / 32768), sampleRate: 16000 };
}

const latencyStats = (xs: number[]) => {
  const n = xs.length || 1;
  return { meanMs: xs.reduce((a, b) => a + b, 0) / n, delayedShare: xs.filter((x) => x > 0).length / n };
};
const latency = (xs: number[]) => {
  const l = latencyStats(xs);
  return `${Math.round(l.meanMs)}ms avg (${pct(l.delayedShare).trim()} of turns)`;
};
const pct = (x: number) => `${(x * 100).toFixed(0)}%`.padStart(4);
const num = (x: number, d = 2) => x.toFixed(d).padStart(5);

// ---------------------------------------------------------------- AMI (spontaneous)
interface Word { start: number; end: number; id: string }
function parseAmiWords(xml: string): Map<string, Word> {
  const words = new Map<string, Word>();
  const re = /<w nite:id="([^"]+)" starttime="([\d.]+)" endtime="([\d.]+)"(?![^>]*punc="true")[^>]*>/g;
  let m;
  while ((m = re.exec(xml))) words.set(m[1], { id: m[1], start: +m[2], end: +m[3] });
  return words;
}
function parseAmiDialogueActs(xml: string, words: Map<string, Word>, allIds: string[]) {
  const acts: Array<{ start: number; end: number; nWords: number }> = [];
  const re = /href="[^#]+#id\(([^)]+)\)(?:\.\.id\(([^)]+)\))?"/g;
  let m;
  const index = new Map(allIds.map((id, i) => [id, i]));
  while ((m = re.exec(xml))) {
    if (!m[1].includes(".words")) continue;
    const a = index.get(m[1]);
    const b = index.get(m[2] ?? m[1]);
    if (a === undefined || b === undefined) continue;
    const ws = allIds.slice(a, b + 1).map((id) => words.get(id)).filter(Boolean) as Word[];
    if (!ws.length) continue;
    acts.push({ start: ws[0].start, end: ws[ws.length - 1].end, nWords: ws.length });
  }
  return acts.sort((x, y) => x.start - y.start);
}

async function runAmi() {
  const amiDir = join(dataDir, "ami");
  if (!existsSync(amiDir)) return null;
  const meetingsXml = readFileSync(join(amiDir, "ann/corpusResources/meetings.xml"), "utf8");
  const channels = readdirSync(amiDir).filter((f) => /\.Headset-\d\.wav$/.test(f)).sort();
  const perConfig = new Map<string, any[]>();
  const units = { acts: 0, turns: 0, words: 0 };

  for (const file of channels) {
    const [, meeting, ch] = file.match(/^(\w+)\.Headset-(\d)\.wav$/)!;
    const agent = new RegExp(`<speaker[^>]*channel="${ch}"[^>]*nxt_agent="(\\w)"`).exec(
      meetingsXml.slice(meetingsXml.indexOf(`observation="${meeting}"`))
    )![1];
    const wordsXml = readFileSync(join(amiDir, `ann/words/${meeting}.${agent}.words.xml`), "utf8");
    const allIds = [...wordsXml.matchAll(/<w nite:id="([^"]+)"/g)].map((m) => m[1]);
    const words = parseAmiWords(wordsXml);
    const acts = parseAmiDialogueActs(
      readFileSync(join(amiDir, `ann/dialogueActs/${meeting}.${agent}.dialog-act.xml`), "utf8"),
      words,
      allIds
    );
    // Turns: consecutive acts of this speaker with gaps < TURN_GAP_S.
    const turns: Array<{ start: number; end: number; nWords: number }> = [];
    for (const a of acts) {
      const last = turns[turns.length - 1];
      if (last && a.start - last.end < TURN_GAP_S) {
        last.end = Math.max(last.end, a.end);
        last.nWords += a.nWords;
      } else turns.push({ ...a });
    }
    // (AMI word times abut — pauses are absorbed into word durations — so they mark which
    // speaker owns a stretch of audio, not where the silences are.)
    const wl = [...words.values()].sort((a, b) => a.start - b.start);
    units.acts += acts.length;
    units.turns += turns.length;
    units.words += words.size;

    const probs = await probsFor(`ami_${meeting}_${ch}`, () => loadAudioAny(join(amiDir, file)));
    for (const policy of CONFIGS) {
      const segs = await uploadsFor(probs, policy);
      const attributed = attributeSegmentsToUnits(segs, FRAME_MS, wl, acts, turns);
      // Extra latency paid by each turn's FINAL upload (what delays the reply).
      attributed.turnEndHeldMs = turns
        .map((t) => segs.filter((s) => s.speechStartFrame * FRAME_MS / 1000 < t.end && (s.lastSpeechFrame + 1) * FRAME_MS / 1000 > t.start))
        .filter((ss) => ss.length)
        .map((ss) => ss[ss.length - 1].heldMs);
      if (!perConfig.has(policy.name)) perConfig.set(policy.name, []);
      perConfig.get(policy.name)!.push(attributed);
    }
  }
  return { perConfig, units, channels: channels.length };
}

// ---------------------------------------------------------------- LibriSpeech (read)
async function runLibri() {
  const root = join(dataDir, "LibriSpeech/test-clean");
  if (!existsSync(root)) return null;
  const files: string[] = [];
  for (const spk of readdirSync(root).sort())
    for (const ch of readdirSync(join(root, spk)).sort())
      for (const f of readdirSync(join(root, spk, ch)).sort()) if (f.endsWith(".flac")) files.push(join(root, spk, ch, f));
  const perConfig = new Map<string, { segsPerUtt: number[]; clipMs: number[]; endHeldMs: number[] }>();
  let done = 0;
  for (const f of files) {
    const probs = await probsFor(`libri_${basename(f, ".flac")}`, () => loadAudioAny(f));
    for (const policy of CONFIGS) {
      const segs = await uploadsFor(probs, policy);
      if (!perConfig.has(policy.name)) perConfig.set(policy.name, { segsPerUtt: [], clipMs: [], endHeldMs: [] });
      const r = perConfig.get(policy.name)!;
      r.segsPerUtt.push(segs.length);
      r.clipMs.push(...segs.map((s) => s.clipMs));
      if (segs.length) r.endHeldMs.push(segs[segs.length - 1].heldMs);
    }
    if (++done % 250 === 0) process.stderr.write(`  libri ${done}/${files.length}\n`);
  }
  return { perConfig, utterances: files.length };
}

// ---------------------------------------------------------------- synthetic pause sweep
async function runPauseSweep() {
  const dir = join(dataDir, "pauses");
  mkdirSync(dir, { recursive: true });
  const PAUSES = [150, 200, 250, 300, 350, 400, 450, 500, 600, 700, 800, 1000];
  const PHRASES = [
    ["So I was thinking", "about going to Dublin next week"],
    ["The thing is", "I don't really know what to say"],
    ["Can you tell me", "how long it takes to get there"],
  ];
  const VOICES = ["Samantha", "Daniel", "Karen"];
  const results = new Map<string, Map<number, number>>(); // config → pause → split count
  let trials = 0;
  for (const voice of VOICES)
    for (const [a, b] of PHRASES)
      for (const p of PAUSES) {
        const key = `pause_${voice}_${a.replace(/\W+/g, "-")}_${p}`;
        const wav = join(dir, key + ".wav");
        if (!existsSync(wav)) {
          try {
            execFileSync("say", ["-v", voice, "-o", wav, "--data-format=LEI16@16000", `[[slnc 400]] ${a} [[slnc ${p}]] ${b} [[slnc 1500]]`]);
          } catch {
            continue; // not macOS / voice missing — the sweep is optional
          }
        }
        const probs = await probsFor(key, () => loadAudioAny(wav));
        trials++;
        for (const policy of CONFIGS) {
          const name = policy.name;
          const segs = await uploadsFor(probs, policy);
          if (!results.has(name)) results.set(name, new Map());
          const m = results.get(name)!;
          m.set(p, (m.get(p) ?? 0) + (segs.length > 1 ? 1 : 0));
        }
      }
  return { results, PAUSES, perPause: VOICES.length * PHRASES.length, trials };
}

async function main() {
  const report: any = { model: modelLabel, frameMs: FRAME_MS, configs: CONFIGS };

  const sweep = await runPauseSweep();
  if (sweep.trials) {
    process.stdout.write(`\n=== Pause sweep (synthetic 'say', ${sweep.perPause} phrase×voice pairs per pause) — share split into 2+ clips\n`);
    process.stdout.write("  config".padEnd(32) + sweep.PAUSES.map((p) => `${p}`.padStart(6)).join("") + "\n");
    for (const { name } of CONFIGS) {
      const m = sweep.results.get(name)!;
      process.stdout.write("  " + name.padEnd(30) + sweep.PAUSES.map((p) => pct((m.get(p) ?? 0) / sweep.perPause).padStart(6)).join("") + "\n");
    }
    report.pauseSweep = Object.fromEntries([...sweep.results].map(([k, v]) => [k, Object.fromEntries(v)]));
  }

  const libri = await runLibri();
  if (libri) {
    process.stdout.write(`\n=== LibriSpeech test-clean (read speech, ${libri.utterances} utterances; each should be ONE clip)\n`);
    process.stdout.write("  config".padEnd(32) + "clips/utt  split   ≤1s    ≤2s    ≤3s  +end latency\n");
    report.libri = {};
    for (const { name } of CONFIGS) {
      const r = libri.perConfig.get(name)!;
      const s = summarizeClips(r.clipMs);
      const split = r.segsPerUtt.filter((n) => n > 1).length / r.segsPerUtt.length;
      const mean = r.segsPerUtt.reduce((a, b) => a + b, 0) / r.segsPerUtt.length;
      process.stdout.write(
        "  " + name.padEnd(30) + `${num(mean)}    ${pct(split)}  ${pct(s.le1)}  ${pct(s.le2)}  ${pct(s.le3)}  ${latency(r.endHeldMs)}\n`
      );
      report.libri[name] = { meanClipsPerUtterance: mean, splitRate: split, ...s, endLatency: latencyStats(r.endHeldMs) };
    }
  }

  const ami = await runAmi();
  if (ami) {
    process.stdout.write(
      `\n=== AMI (spontaneous meeting speech, ${ami.channels} headset channels, ${ami.units.turns} turns, ${ami.units.acts} dialogue acts)\n`
    );
    process.stdout.write(
      "  config".padEnd(32) + "clip≤1s speech≤0.6s  acts-split turns-split clips/turn  short:cut genuine  +end latency\n"
    );
    report.ami = {};
    for (const { name } of CONFIGS) {
      const rows = ami.perConfig.get(name)!;
      const merged = {
        clipMs: rows.flatMap((r: any) => r.clipMs),
        speechMs: rows.flatMap((r: any) => r.speechMs),
        actSegCounts: rows.flatMap((r: any) => r.actSegCounts),
        turnSegCounts: rows.flatMap((r: any) => r.turnSegCounts),
        subSecond: rows.flatMap((r: any) => r.subSecond),
        turnEndHeldMs: rows.flatMap((r: any) => r.turnEndHeldMs),
      };
      const s = summarizeClips(merged.clipMs);
      const shortSpeech = merged.speechMs.filter((x: number) => x <= 600).length / merged.speechMs.length;
      const multi = merged.actSegCounts.filter((n: number) => n > 0);
      const actsSplit = multi.filter((n: number) => n > 1).length / multi.length;
      const tMulti = merged.turnSegCounts.filter((n: number) => n > 0);
      const turnsSplit = tMulti.filter((n: number) => n > 1).length / tMulti.length;
      const clipsPerTurn = tMulti.reduce((a: number, b: number) => a + b, 0) / tMulti.length;
      const cut = merged.subSecond.filter((x: any) => x.kind === "cut").length;
      const genuine = merged.subSecond.filter((x: any) => x.kind === "turn-end").length;
      process.stdout.write(
        "  " + name.padEnd(30) + ` ${pct(s.le1)}      ${pct(shortSpeech)}         ${pct(actsSplit)}       ${pct(turnsSplit)}     ${num(clipsPerTurn)}      ${`${cut}`.padStart(5)}   ${`${genuine}`.padStart(5)}  ${latency(merged.turnEndHeldMs)}\n`
      );
      report.ami[name] = {
        ...s,
        shortSpeechShare: shortSpeech,
        dialogueActsSplitRate: actsSplit,
        turnsSplitRate: turnsSplit,
        clipsPerTurn,
        endLatency: latencyStats(merged.turnEndHeldMs),
        subSecond: { cut, turnEnd: genuine, gapToNextOnsetMs: gapHistogram(merged.subSecond) },
      };
    }
  }

  const out = join(here, `report.segmentation.${modelLabel}.json`);
  writeFileSync(out, JSON.stringify(report, null, 2) + "\n");
  process.stdout.write(`\nWrote ${out}\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
