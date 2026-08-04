# Voice-sample fixtures

Three real preview clips, served by the mock API at
`https://api.saypi.ai/voices/<id>/sample` so the **Voices** settings tab can do
the one thing it exists to do inside the Layer 3 harness: fetch a clip, decode
it, measure it, draw it and play it.

## Why real clips and not synthesised tones

The rail's whole design rests on measurement (`doc/voices-audition-room.md` §4:
*every mark must be measured*). Rows are ordered by median F0 read out of the
decoded audio, the soundprint is drawn from the same pass, and the per-clip
level match comes from its voiced RMS. A sine tone has none of that: it decodes
to one pitch with no span, no pauses and no loudness contour, so a rail built on
tones would order "correctly" for reasons that have nothing to do with the code
under test.

With real clips the **ordering assertion is end-to-end**: the deepest clip is
measured deepest in the browser's own `OfflineAudioContext`, and the rail must
put it first. Three clips were chosen at the extremes and the middle of the live
catalog's pitch range, so the order is unambiguous — an octave and a half
separates the ends, an order of magnitude more than any estimator noise.

## Files

| File | Voice it was rendered as | Provider | Duration | Measured median F0 | Speech span |
| --- | --- | --- | --- | --- | --- |
| `onyx.mp3` | Onyx (`onyx`) | OpenAI | 2.71 s | **91 Hz** — the catalog's deepest | 1.17 s |
| `alloy.mp3` | Alloy (`alloy`) | OpenAI | 1.66 s | **132 Hz** — mid | 1.34 s |
| `addison.mp3` | Addison (`eR40ATw9ArzDf9h3v7t7`) | ElevenLabs | 1.11 s | **259 Hz** — the catalog's brightest | 0.77 s |

~52 KB in total. They are **binary**, so they do not count against Firefox AMO's
5 MB non-binary limit, and they are small enough that the print pass (fetch →
`decodeAudioData` → DSP) finishes well inside a test's budget.

The pitch figures above were produced by this repo's own extractor — decode to
8 kHz mono, then `extractVoicePrint` from `src/tts/voicePrint.ts` — so they are
the same numbers the browser computes at runtime, not a third-party estimate.
Each sits within a quarter of a semitone of the corresponding build-time seed in
`src/tts/VoicePitch.ts` (92.2 / 134.5 / 260.2 Hz), which is what
`SEED_AGREEMENT_SEMITONES` calls agreement: a seeded voice keeps its seed and the
rail never re-sorts under the reader.

Verify:

```bash
ffprobe -hide_banner e2e/fixtures/voices/onyx.mp3   # expect: mp3, 44100 Hz, 1 channel
```

## Provenance

Downloaded from the live, credential-free preview endpoint
(`https://api.saypi.ai/voices/<id>/sample`) on 2026-07-31 — the same public
clips every user of the Voices tab already hears, and the same three the DSP
fixtures in `test/fixtures/voiceprints/` were decoded from. They are SayPi's own
product assets, rendered by its TTS providers for exactly this purpose, and are
kept here verbatim so the harness measures what production measures.

Refresh them the same way if the server ever re-renders a clip (and re-run the
measurement above — a re-rendered clip can move a voice, which is precisely the
case `SEED_OVERRIDE_SEMITONES` exists for):

```bash
curl -sSo e2e/fixtures/voices/onyx.mp3    https://api.saypi.ai/voices/onyx/sample
curl -sSo e2e/fixtures/voices/alloy.mp3   https://api.saypi.ai/voices/alloy/sample
curl -sSo e2e/fixtures/voices/addison.mp3 https://api.saypi.ai/voices/eR40ATw9ArzDf9h3v7t7/sample
```

## How they reach the browser

`e2e/support/voice-catalog.ts` maps each mock voice to one of these three files
and advertises a `sample_url` on `api.saypi.ai`, which
`--host-resolver-rules` points at the mock API server (`e2e/support/mock-servers.ts`).
Nothing leaves the machine. More than one mock voice may share a clip — that is
deliberate, and the catalog comment explains what each pairing buys.
