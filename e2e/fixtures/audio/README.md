# Fake-mic audio fixture

This directory holds the deterministic audio clip that Chromium plays back into
the page's microphone during the Layer 3 headless E2E run. The harness launches
Chromium with `--use-fake-device-for-media-stream` plus
`--use-file-for-fake-audio-capture=<this file>`, so `getUserMedia()` returns this
clip instead of a real mic. The clip drives the real offscreen WASM-VAD
(Silero-v5) → mock STT path that the dictation spec asserts on.

## File

- `speech-16k-mono.wav`

### Spec

| Property        | Value                                          |
| --------------- | ---------------------------------------------- |
| Container       | RIFF / WAVE                                     |
| Encoding        | 16-bit PCM (`pcm_s16le`, Microsoft PCM)         |
| Channels        | Mono (1 channel)                                |
| Sample rate     | 16 kHz (16000 Hz)                               |
| Content         | ~3 s of real speech + 0.5 s trailing silence    |
| Size            | < 200 KB (~132 KB)                              |

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

Self-generated on macOS via the built-in `say` synthesizer
(`say -v Samantha`), then transcoded with `ffmpeg`. No third-party recording is
used, so the clip is license-clean and safe to commit to the repository. The
spoken text is:

> "Hello SayPi, this is a test of voice activity detection."

## Regeneration

Both `say` (macOS) and `ffmpeg` must be available. From the repository root:

```bash
say -v Samantha -o /tmp/saypi-speech.aiff "Hello SayPi, this is a test of voice activity detection."
ffmpeg -hide_banner -loglevel error -y -i /tmp/saypi-speech.aiff \
  -ac 1 -ar 16000 -c:a pcm_s16le -af "apad=pad_dur=0.5" \
  -map_metadata -1 -flags +bitexact -fflags +bitexact \
  e2e/fixtures/audio/speech-16k-mono.wav
rm /tmp/saypi-speech.aiff
```

The `-map_metadata -1` / `+bitexact` flags strip encoder/timestamp metadata so the
output is reproducible (no embedded ffmpeg version string or creation time).

### Verify

```bash
ffprobe -hide_banner e2e/fixtures/audio/speech-16k-mono.wav   # expect: pcm_s16le, 16000 Hz, 1 channels, s16
file e2e/fixtures/audio/speech-16k-mono.wav                    # expect: RIFF ... WAVE audio, Microsoft PCM, 16 bit, mono 16000 Hz
ls -l e2e/fixtures/audio/speech-16k-mono.wav                   # expect: < 200 KB
```
