# Fake-mic audio fixture

This directory holds the deterministic audio clip that Chromium plays back into
the page's microphone during the Layer 3 headless E2E run. The harness launches
Chromium with `--use-fake-device-for-media-stream` plus
`--use-file-for-fake-audio-capture=<this file>`, so `getUserMedia()` returns this
clip instead of a real mic. The clip drives the real offscreen WASM-VAD
(Silero-v5) → mock STT path that the dictation spec asserts on.

This single file is the **fallback** capture clip for the launch-flag path. The
primary path — the in-extension synthetic source armed by `saypi:dev-feed-speech`
— now draws at random from a **pool** of clips in `public/audio/synthetic-speech/`
(see [Pool & regeneration](#pool--regeneration) below), so the transcript varies
run-to-run. `speech-16k-mono.wav` here is a mirror of pool clip `01.wav`.

## File

- `speech-16k-mono.wav`

### Spec

| Property        | Value                                          |
| --------------- | ---------------------------------------------- |
| Container       | RIFF / WAVE                                     |
| Encoding        | 16-bit PCM (`pcm_s16le`, Microsoft PCM)         |
| Channels        | Mono (1 channel)                                |
| Sample rate     | 16 kHz (16000 Hz)                               |
| Content         | ~5-7 s of real speech + 0.5 s trailing silence   |
| Size            | < 256 KB                                         |

The format is dictated by Chromium's fake-audio-capture requirement (it expects a
plain RIFF/WAVE PCM file) and by the VAD model's preferred input (16 kHz mono).
The 0.5 s of trailing silence gives the VAD a clear speech-then-silence edge so it
emits an `onSpeechEnd` segment rather than getting cut off at end-of-file.

## Why real speech, not a tone

The offscreen VAD uses the **Silero-v5** speech-detection model, which classifies
frames as *speech* vs *non-speech*. A sine tone or noise burst is loud but is
**not** speech, so Silero would never fire `onSpeechEnd` and no segment would be
captured. A genuine spoken utterance is required for the VAD path to trigger and
hand a segment to the (mock) STT backend.

## Provenance & license

Self-generated on macOS via the built-in `say` synthesizer (a spread of voices —
Samantha / Daniel / Karen / Moira), then transcoded with `ffmpeg`. No third-party
recording is used, so the clips are license-clean and safe to commit. The phrases
are assistant-agnostic (they play on pi.ai, claude.ai *and* chatgpt.com, so they
must not bake in a host name) and shaped as greeting + observation + question —
e.g. clip `01`:

> "Hello there. This is a quick test of the voice activity detection. Can you hear me clearly?"

The full phrase list lives in `scripts/generate-synthetic-speech.mjs`.

## Pool & regeneration

The primary in-extension source draws at random from a **pool** of clips in
`public/audio/synthetic-speech/` (`01.wav`..`NN.wav`) so the transcript submitted
to the assistant varies run-to-run. Clip `01.wav` is mirrored to this fixture
(`speech-16k-mono.wav`) and to `public/audio/synthetic-speech.wav` for the
single-file fallback paths. The runtime picker is
`src/offscreen/syntheticSpeechPool.ts`; its on-disk test guards file/list drift.

Regenerate the whole pool (macOS + `ffmpeg` required) from the repo root:

```bash
node scripts/generate-synthetic-speech.mjs
```

The script bakes each phrase with `-map_metadata -1` / `+bitexact` so output is
reproducible (no embedded ffmpeg version string or creation time) — re-running
doesn't churn the repo unless a phrase changes.

### Verify

```bash
ffprobe -hide_banner public/audio/synthetic-speech/01.wav   # expect: pcm_s16le, 16000 Hz, 1 channels, s16
file public/audio/synthetic-speech/01.wav                    # expect: RIFF ... WAVE audio, Microsoft PCM, 16 bit, mono 16000 Hz
```
