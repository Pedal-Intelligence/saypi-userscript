#!/usr/bin/env node
// Regenerate the synthetic VAD-benchmark seed corpus into bench/vad/corpus/.
//
// Positives (speech) are macOS `say` voices at 16 kHz mono PCM16 (no ffmpeg needed),
// including deliberately QUIET variants — the soft-speech false-reject case #420 cares
// about. Negatives (non-speech) are deterministically synthesised in pure Node so the
// committed corpus is byte-reproducible. The output WAVs are committed, so RUNNING the
// benchmark needs no tools; only REGENERATING does (macOS `say`).
//
// This is a SEED corpus: synthetic confirmations + generated noise approximate, but do
// not replace, real recordings (esp. music / real ambient). Expand it with real labelled
// audio before trusting the absolute false-accept/false-reject numbers. (#420 item 3)
//
// Usage: node bench/vad/generate-corpus.mjs
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { decodeWav, encodeWavPcm16 } from "./lib/wav.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const corpusDir = resolve(here, "corpus");
const SR = 16000;

// Deterministic PRNG (mulberry32) so regenerated noise is byte-identical.
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const silence = (ms) => new Float32Array(Math.round((ms / 1000) * SR));

function appendSilence(samples, ms) {
  const tail = silence(ms);
  const out = new Float32Array(samples.length + tail.length);
  out.set(samples, 0);
  return out;
}

function scale(samples, gain) {
  const out = new Float32Array(samples.length);
  for (let i = 0; i < samples.length; i++) out[i] = samples[i] * gain;
  return out;
}

function whiteNoise(ms, gain, seed) {
  const rng = mulberry32(seed);
  const out = silence(ms);
  for (let i = 0; i < out.length; i++) out[i] = (rng() * 2 - 1) * gain;
  return out;
}

function pinkish(ms, gain, seed) {
  // Cheap 1-pole low-passed white noise — a rough "pink-ish" hiss, no DSP deps.
  const rng = mulberry32(seed);
  const out = silence(ms);
  let prev = 0;
  for (let i = 0; i < out.length; i++) {
    const w = rng() * 2 - 1;
    prev = 0.97 * prev + 0.03 * w;
    out[i] = prev * gain * 6;
  }
  return out;
}

function tone(ms, hz, gain) {
  const out = silence(ms);
  for (let i = 0; i < out.length; i++) out[i] = Math.sin((2 * Math.PI * hz * i) / SR) * gain;
  return out;
}

function sayToSamples(phrase) {
  const tmp = resolve(corpusDir, "_tmp_say.wav");
  execFileSync("say", ["-o", tmp, "--data-format=LEI16@16000", phrase]);
  const { samples, sampleRate } = decodeWav(readFileSync(tmp));
  rmSync(tmp);
  if (sampleRate !== SR) throw new Error(`say produced ${sampleRate} Hz, expected ${SR}`);
  return samples;
}

function write(name, samples, entry) {
  const file = `${name}.wav`;
  writeFileSync(resolve(corpusDir, file), encodeWavPcm16(samples, SR));
  return { file, ...entry };
}

mkdirSync(corpusDir, { recursive: true });
const manifest = [];

// --- Positives: spoken confirmations (the short utterances #420 must NOT clip) ---
const phrases = [
  ["yes", "yes"],
  ["no", "no"],
  ["okay", "okay"],
  ["stop", "stop"],
  ["thank-you", "thank you"],
  ["sentence", "what time is it in Tokyo right now"],
];
for (const [name, phrase] of phrases) {
  const speech = sayToSamples(phrase);
  const speechMs = Math.round((speech.length / SR) * 1000);
  const padded = appendSilence(speech, 600); // trailing silence → clean end-of-speech
  manifest.push(
    write(`speech_${name}`, padded, {
      label: "speech",
      speechStartMs: 0,
      speechEndMs: speechMs,
      note: `say "${phrase}"`,
    })
  );
}

// Quiet variants — soft speech that may peak only just above the opening threshold.
for (const [name, phrase, gain] of [
  ["yes", "yes", 0.18],
  ["thank-you", "thank you", 0.15],
]) {
  const speech = scale(sayToSamples(phrase), gain);
  const speechMs = Math.round((speech.length / SR) * 1000);
  manifest.push(
    write(`speech_quiet_${name}`, appendSilence(speech, 600), {
      label: "speech",
      speechStartMs: 0,
      speechEndMs: speechMs,
      note: `say "${phrase}" @ gain ${gain} (quiet)`,
    })
  );
}

// --- Negatives: non-speech that must NOT open (or, if it does, must be gated out) ---
manifest.push(write("nonspeech_silence", silence(2000), { label: "nonspeech", note: "digital silence" }));
manifest.push(write("nonspeech_white_low", whiteNoise(2000, 0.05, 1), { label: "nonspeech", note: "white noise, low" }));
manifest.push(write("nonspeech_white_mod", whiteNoise(2000, 0.2, 2), { label: "nonspeech", note: "white noise, moderate" }));
manifest.push(write("nonspeech_pink", pinkish(2000, 0.15, 3), { label: "nonspeech", note: "pink-ish hiss" }));
manifest.push(write("nonspeech_tone", tone(2000, 440, 0.3), { label: "nonspeech", note: "440 Hz tone" }));
manifest.push(write("nonspeech_hum", tone(2000, 60, 0.12), { label: "nonspeech", note: "60 Hz hum" }));

writeFileSync(
  resolve(corpusDir, "manifest.json"),
  JSON.stringify(
    {
      sampleRate: SR,
      generatedBy: "bench/vad/generate-corpus.mjs",
      note: "SEED corpus: synthetic say-voiced positives + generated negatives. Not a substitute for real labelled audio (esp. music/ambient). See bench/vad/README.md.",
      clips: manifest,
    },
    null,
    2
  ) + "\n"
);

console.log(`Wrote ${manifest.length} clips + manifest.json to bench/vad/corpus/`);
