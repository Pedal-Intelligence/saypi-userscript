#!/usr/bin/env node
// Fetch a small, license-clean REAL labelled corpus into bench/vad/corpus-real/ so the
// benchmark can run on real recordings instead of the synthetic seed (#420 item 3/4).
//
// The fetched audio is git-ignored (no third-party bytes committed); only this script +
// the generated manifest/ATTRIBUTION are tracked. Selection is DETERMINISTIC (sorted,
// fixed counts), so anyone who runs it gets the same clips → the same FRR/FAR numbers.
//
//   Positives — Google Speech Commands v2 (CC-BY-4.0): real short confirmations
//     (yes/no/stop/go/up/down/on/off) from thousands of varied speakers/mics — the
//     short-and-sometimes-soft regime the synthetic `say` corpus could not stress.
//   Negatives — MUSAN noise, free-sound subset (US Public Domain): real ambient noise,
//     already 16 kHz mono PCM16; plus generated digital silence.
//   Music — intentionally NOT fetched yet: no license-clean *per-file* source without the
//     11 GB MUSAN tarball. A clear follow-up (see bench/vad/README.md).
//
// Usage: npm run bench:vad:fetch-real   [-- --force]
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, basename } from "node:path";
import { decodeWav, encodeWavPcm16 } from "./lib/wav.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, "corpus-real");
const tmpDir = resolve(here, ".fetch-tmp");
const SR = 16000;
const force = process.argv.includes("--force");

const SC_WORDS = ["yes", "no", "stop", "go", "up", "down", "on", "off"];
const SC_PER_WORD = 4; // 8 words × 4 distinct speakers = 32 real speech positives
const SC_CANDIDATES = 14; // over-select per word, then drop silent/corrupt source clips
const MIN_PEAK_AMP = 0.02; // a real word peaks far above this; ~0 = silent/corrupt clip
const SC_URL = "https://storage.googleapis.com/download.tensorflow.org/data/speech_commands_v0.02.tar.gz";
const MUSAN_NOISE_COUNT = 14;
const MUSAN_API = "https://huggingface.co/api/datasets/bilguun/musan-noise/tree/main/noise/free-sound";
const MUSAN_RESOLVE = "https://huggingface.co/datasets/bilguun/musan-noise/resolve/main/noise/free-sound";

if (existsSync(resolve(outDir, "manifest.json")) && !force) {
  console.log("corpus-real/ already populated; pass --force to refetch. Skipping.");
  process.exit(0);
}

if (force) rmSync(outDir, { recursive: true, force: true }); // avoid orphan clips if counts changed
mkdirSync(outDir, { recursive: true });
mkdirSync(tmpDir, { recursive: true });
const manifest = [];
const curl = (args) => execFileSync("curl", ["-sS", "-L", "--fail", ...args], { maxBuffer: 1 << 30 });

// --- Positives: Google Speech Commands v2 (CC-BY-4.0) ---
console.log("Downloading Google Speech Commands v2 (~2.4 GB; cached in .fetch-tmp)…");
const scTar = resolve(tmpDir, "speech_commands_v0.02.tar.gz");
if (!existsSync(scTar)) curl(["-o", scTar, SC_URL]);

console.log("Listing archive + selecting a deterministic subset…");
const listing = execFileSync("tar", ["-tzf", scTar], { maxBuffer: 1 << 30 }).toString().split("\n");
const picks = [];
for (const word of SC_WORDS) {
  // Archive entries are prefixed "./" (e.g. ./yes/<speakerHash>_nohash_<n>.wav). Match on
  // the normalised path but keep the ORIGINAL member name for `tar -x`.
  const wordFiles = listing
    .filter((p) => p.replace(/^\.\//, "").startsWith(`${word}/`) && p.endsWith(".wav"))
    .sort();
  const bySpeaker = new Map();
  for (const f of wordFiles) {
    const speaker = basename(f).split("_")[0]; // distinct speakers
    if (!bySpeaker.has(speaker)) bySpeaker.set(speaker, f);
  }
  [...bySpeaker.values()].slice(0, SC_CANDIDATES).forEach((f) => picks.push({ word, member: f }));
}
if (picks.length === 0) throw new Error("No Speech Commands clips selected — archive layout changed?");
execFileSync("tar", ["-xzf", scTar, "-C", tmpDir, ...picks.map((p) => p.member)]);

// Energy-filter: Speech Commands contains some silent/truncated recordings; counting
// those as "speech" would inflate the false-reject rate with corpus noise rather than
// VAD behaviour. Keep the first SC_PER_WORD per word whose peak amplitude clears
// MIN_PEAK_AMP (quiet real speech still clears it; digital-silent clips don't). Note
// boundaries are intentionally OMITTED — we have no frame-level word onset/offset, so
// latency is not reported for real clips (the synthetic corpus is where latency lives).
const keptPerWord = new Map();
let speechIdx = 0;
let skippedSilent = 0;
for (const { word, member } of picks) {
  if ((keptPerWord.get(word) ?? 0) >= SC_PER_WORD) continue;
  const { samples, sampleRate } = decodeWav(readFileSync(resolve(tmpDir, member)));
  let maxAbs = 0;
  for (let i = 0; i < samples.length; i++) maxAbs = Math.max(maxAbs, Math.abs(samples[i]));
  if (maxAbs < MIN_PEAK_AMP) {
    skippedSilent++;
    continue;
  }
  keptPerWord.set(word, (keptPerWord.get(word) ?? 0) + 1);
  const name = `speech_sc_${word}_${String(speechIdx++).padStart(2, "0")}.wav`;
  // Re-encode to a clean canonical 16k mono PCM16 header (drops any extra chunks).
  writeFileSync(resolve(outDir, name), encodeWavPcm16(samples, sampleRate));
  manifest.push({
    file: name,
    label: "speech",
    source: "Google Speech Commands v2",
    license: "CC-BY-4.0",
    attribution: "https://www.tensorflow.org/datasets/catalog/speech_commands",
    note: `word "${word}", ${basename(member)}`,
  });
}
console.log(`Kept ${speechIdx} speech clips (skipped ${skippedSilent} silent/corrupt source clips).`);

// --- Negatives: MUSAN free-sound noise (US Public Domain) ---
console.log("Fetching MUSAN free-sound noise (public domain)…");
const noiseTree = JSON.parse(curl([MUSAN_API]).toString());
const noiseWavs = noiseTree
  .filter((x) => x.type === "file" && x.path.endsWith(".wav"))
  .map((x) => x.path)
  .sort()
  .slice(0, MUSAN_NOISE_COUNT);
noiseWavs.forEach((path, i) => {
  const dest = resolve(tmpDir, basename(path));
  curl(["-o", dest, `${MUSAN_RESOLVE}/${basename(path)}`]);
  const { samples, sampleRate } = decodeWav(readFileSync(dest));
  const name = `nonspeech_musan_${String(i).padStart(2, "0")}.wav`;
  writeFileSync(resolve(outDir, name), encodeWavPcm16(samples, sampleRate));
  manifest.push({
    file: name,
    label: "nonspeech",
    source: "MUSAN (free-sound noise subset)",
    license: "US Public Domain",
    attribution: "https://www.openslr.org/17/ — Snyder, Chen, Povey (2015), arXiv:1510.08484",
    note: `real ambient noise, ${basename(path)}`,
  });
});

// --- Negatives: digital silence (control) ---
for (const ms of [1500, 2500]) {
  const name = `nonspeech_silence_${ms}.wav`;
  writeFileSync(resolve(outDir, name), encodeWavPcm16(new Float32Array(Math.round((ms / 1000) * SR)), SR));
  manifest.push({ file: name, label: "nonspeech", source: "generated", license: "n/a", note: `${ms}ms digital silence` });
}

writeFileSync(
  resolve(outDir, "manifest.json"),
  JSON.stringify(
    {
      sampleRate: SR,
      generatedBy: "bench/vad/fetch-real-corpus.mjs",
      note: "REAL corpus (git-ignored audio). Positives: Google Speech Commands v2 (CC-BY-4.0). Negatives: MUSAN free-sound noise (US Public Domain) + digital silence. Music pending (see README).",
      clips: manifest,
    },
    null,
    2
  ) + "\n"
);

// Drop the 2.4 GB tarball + extracted tree; keep only the curated corpus.
rmSync(tmpDir, { recursive: true, force: true });
console.log(`Wrote ${manifest.length} real clips + manifest.json to bench/vad/corpus-real/`);
console.log("Run: npm run bench:vad -- corpus-real");
