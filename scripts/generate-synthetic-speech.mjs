#!/usr/bin/env node
// Regenerate the pool of synthetic-speech clips used to drive a voice TURN with no
// human at the mic (Layer 3 hermetic E2E + Layer 4 real-host loops). Each phrase is
// baked to a deterministic 16 kHz / mono / 16-bit PCM WAV — the format Chromium's
// fake-audio-capture wants and the Silero-v5 VAD prefers — with 0.5 s of trailing
// silence so the VAD sees a clean speech→silence edge and fires `onSpeechEnd`.
//
// macOS-only (uses the built-in `say` synthesizer) + ffmpeg. Never runs in CI — the
// WAVs are committed. Output is bit-exact reproducible (`-map_metadata -1`,
// `+bitexact`) so re-running doesn't churn the repo unless a phrase changes.
//
// Run from the repo root:  node scripts/generate-synthetic-speech.mjs
//
// IMPORTANT: keep the phrase COUNT in lock-step with `SYNTHETIC_SPEECH_CLIPS` in
// src/offscreen/syntheticSpeechPool.ts (the on-disk test guards drift).
//
// Phrase design: each line is assistant-AGNOSTIC (it plays on pi.ai, claude.ai AND
// chatgpt.com, so it must not bake in a host name) and shaped as
// greeting + observation + question. The human is talking to the *assistant* — not
// to "Say, Pi", which is this extension's voice-input layer. Have a little fun.

import { execFileSync } from "node:child_process";
import { mkdirSync, copyFileSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const poolDir = join(repoRoot, "public", "audio", "synthetic-speech");
const canonicalPublic = join(repoRoot, "public", "audio", "synthetic-speech.wav");
const canonicalFixture = join(repoRoot, "e2e", "fixtures", "audio", "speech-16k-mono.wav");

// A spread of macOS voices so the pool sounds like different people kicking the
// tyres — different accents, different energy. Any voice missing on this machine
// falls back to the default rather than failing the whole run.
const DEFAULT_VOICE = "Samantha"; // en_US

/** @type {{ text: string, voice?: string }[]} */
const PHRASES = [
  // 01 — also mirrored to the single-file fallbacks; keep it the "straightest" one.
  {
    text: "Hello there. This is a quick test of the voice activity detection. Can you hear me clearly?",
    voice: "Samantha",
  },
  {
    text: "Hey! I'm talking to my computer like that's a perfectly normal thing to do on a weekday. Are you getting all of this?",
    voice: "Daniel",
  },
  {
    text: "Good morning. The coffee hasn't fully kicked in yet, so bear with me. What should we get into today?",
    voice: "Karen",
  },
  {
    text: "Oh, hi. I genuinely could not tell if this microphone was on. Is my voice coming through alright?",
    voice: "Moira",
  },
  {
    text: "Well, hello. I promise I'm a real human and not a clever recording, mostly. Did you catch every word of that?",
    voice: "Samantha",
  },
  {
    text: "Hey there. It's pouring rain outside, so I'm staying in and bothering you instead. What can you help me with?",
    voice: "Daniel",
  },
  {
    text: "Hi! Testing, testing, one two three. We are go for launch, I think. Are we connected and ready to roll?",
    voice: "Karen",
  },
  {
    text: "Greetings, friend. I'm putting this whole voice setup through its paces. How does my diction sound to you?",
    voice: "Moira",
  },
];

function have(cmd, args) {
  try {
    execFileSync(cmd, args, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function voiceAvailable(voice) {
  // `say -v '?'` lists installed voices; check the name appears as a word start.
  try {
    const list = execFileSync("say", ["-v", "?"], { encoding: "utf8" });
    return new RegExp(`^${voice}\\b`, "m").test(list);
  } catch {
    return false;
  }
}

function bake({ text, voice }, outPath) {
  const chosen = voice && voiceAvailable(voice) ? voice : DEFAULT_VOICE;
  if (voice && chosen !== voice) {
    console.warn(`  voice "${voice}" unavailable → falling back to ${DEFAULT_VOICE}`);
  }
  const aiff = join(poolDir, "_tmp.aiff");
  execFileSync("say", ["-v", chosen, "-o", aiff, text]);
  execFileSync("ffmpeg", [
    "-hide_banner",
    "-loglevel",
    "error",
    "-y",
    "-i",
    aiff,
    "-ac",
    "1",
    "-ar",
    "16000",
    "-c:a",
    "pcm_s16le",
    "-af",
    "apad=pad_dur=0.5",
    "-map_metadata",
    "-1",
    "-flags",
    "+bitexact",
    "-fflags",
    "+bitexact",
    outPath,
  ]);
  rmSync(aiff, { force: true });
}

function main() {
  if (!have("say", ["-v", "?"]) || !have("ffmpeg", ["-version"])) {
    console.error("This script needs macOS `say` and `ffmpeg`. Aborting.");
    process.exit(1);
  }
  mkdirSync(poolDir, { recursive: true });

  PHRASES.forEach((phrase, i) => {
    const name = String(i + 1).padStart(2, "0") + ".wav";
    const out = join(poolDir, name);
    console.log(`Baking ${name}: "${phrase.text}"`);
    bake(phrase, out);
  });

  // Phrase 01 doubles as the canonical single-file fallback (fake-audio-capture
  // launch flag + the e2e fixture), so those paths keep working unchanged.
  const first = join(poolDir, "01.wav");
  copyFileSync(first, canonicalPublic);
  copyFileSync(first, canonicalFixture);
  console.log(`\nDone: ${PHRASES.length} clips in public/audio/synthetic-speech/`);
  console.log("Mirrored 01.wav → public/audio/synthetic-speech.wav + e2e fixture.");
}

main();
