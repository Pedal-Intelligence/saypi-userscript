# Varied, assistant-correct synthetic voice messages

**Date:** 2026-06-24
**Status:** Approved (brainstorming → implementation)

## Problem

The Layer-4 synthetic voice turn feeds a single committed WAV
(`public/audio/synthetic-speech.wav`) into the real mic. Its baked speech —
*"Hello SayPi, this is a test of voice activity detection"* — is what the **real
STT transcribes and submits to the assistant**. Two flaws:

1. **Wrong addressee.** "Say, Pi" is the voice-input layer (this extension). The
   human in a turn is speaking to the *assistant* (Pi / Claude / ChatGPT), not to
   the input plumbing. The line reads like the user greeting their microphone.
2. **No variety.** The same sentence every run — fine for a smoke test, dull for
   anyone reading the transcripts, and unrealistic.

## Constraints

- The audio is **pre-baked, committed WAV**. CI runners (Linux) can't synthesize
  speech (`say` is macOS-only), so variety = *more committed files chosen at
  runtime*, not on-the-fly generation.
- **Assistant-agnostic** phrasing: the same pool plays on pi.ai, claude.ai and
  chatgpt.com, so it must not bake in a host-specific name (naming "Pi" on Claude
  is the same flavour of error as today's "Say Pi").
- **Hermetic CI determinism is preserved for free**: the Layer-3 transcript is
  *mocked* (`DEFAULT_TRANSCRIPT`, decoupled from audio content). The VAD only needs
  the clip to *be speech*, so random clip selection cannot change any assertion.

## Architecture — three small pieces

### 1. Phrase pool + generator (source of truth)

`scripts/generate-synthetic-speech.mjs` holds an ordered array of full
utterances, each authored as *greeting + observation + question*,
assistant-agnostic and deliberately playful/varied. Each entry may name a macOS
`say` voice (Samantha / Daniel / Karen / Moira) so the pool sounds like different
people testing; unavailable voices fall back to the default.

It bakes one deterministic 16 kHz / mono / PCM WAV per phrase (the existing
bit-exact `ffmpeg` recipe + 0.5 s trailing silence) into
`public/audio/synthetic-speech/NN.wav`, and refreshes the single canonical
`public/audio/synthetic-speech.wav` **and** `e2e/fixtures/audio/speech-16k-mono.wav`
(both = phrase 01) so the fake-audio-capture *fallback* path is untouched.

One command — `node scripts/generate-synthetic-speech.mjs` — replaces the manual
README steps. macOS-only; never runs in CI (WAVs are committed).

### 2. Pure picker module

`src/offscreen/syntheticSpeechPool.ts` exports the pool size and
`pickSyntheticSpeechClip(rng = Math.random): string` returning
`audio/synthetic-speech/NN.wav`. No SW/browser deps → unit-testable.

### 3. Runtime selection

`armSyntheticSpeech` (`src/svc/background.ts`) calls `pickSyntheticSpeechClip()`
instead of the hard-coded path. Every consumer — the Layer-3 `feedSyntheticSpeech`
SW hook, the Layer-4 `dev-feed-speech` page bridge, and `layer4cdp` — routes
through this one function, so they all get variety with no further change.

## Testing

- Unit test for `pickSyntheticSpeechClip`: returns valid pool paths and honours an
  injected RNG (covers each index).
- On-disk existence test: every filename the picker can return exists under
  `public/audio/synthetic-speech/` — guards file/list drift.
- The `say`-based generator is not CI-tested (macOS-only).

## Out of scope (YAGNI)

- Runtime audio mixing of greeting/observation/question parts.
- Host-aware assistant naming.
- Randomizing the fake-audio-capture fallback flag (it stays at phrase 01).
