# #414 Phase 2 — Opus `/transcribe` upload (design)

**Status:** implemented on `fix/414-opus-upload`; needs founder sign-off + Layer-4 real-host confirmation before merge.
**Builds on:** Phase 1 (#417, merged) — 16-bit PCM WAV upload, which becomes the fallback here.

## Goal
Cut the `/transcribe` upload further by sending **WebM/Opus @ 24 kbps** instead of WAV. Opus is ~8–11× smaller than the 16-bit PCM WAV baseline (~21× vs the original 32-bit float), pushing the p90 upload sub-second even on poor uplinks. Speech-transparent for the 16 kHz mono samples the VAD produces; the ASR is Whisper-family, trained on compressed audio.

## Key decision: native WebCodecs, **not** WASM (no offscreen move)
The issue (and the initial framing) assumed Opus needs a libopus **WASM** encoder, which — because host-page CSP blocks content-script WASM — would force encoding into the **offscreen document** and change the offscreen↔content audio bridge.

That assumption is wrong. The browser-native **WebCodecs `AudioEncoder`** encodes Opus with **zero WASM**. WebCodecs is a native API, *not* gated by `wasm-unsafe-eval` CSP, so it runs **in the content script** — exactly where encoding happens today. Result:
- **No offscreen change, no bridge contract change, no WASM asset to ship.**
- The only dependency is a tiny **MIT** WebM muxer (`webm-muxer`, ~15–25 KB minified) to wrap the encoder's Opus chunks into a container. (We rejected `mediabunny` — 9.8 MB unpacked, MPL-2.0 — as too heavy/uncertain against AMO's 5 MB non-binary limit.)

## Container & params
- **WebM/Opus**, `audio/webm`. Matches the server's known-good fixture (`sample_audio.webm`) and the **existing default upload filename** (`audio.webm`) — so `TranscriptionForm.ts` / `TranscriptionModule.ts` need **no change** (they already default to `audio.webm` for non-wav/mp4 blobs).
- **24 kbps, mono, 16 kHz.** Opus resamples to 48 kHz internally; 16 kHz in is fully supported and transparent.

## Progressive enhancement (Key Pattern #4)
`encodeAudioForUpload(frames): Promise<Blob>`:
1. If WebCodecs Opus is available **and** `isConfigSupported({codec:'opus',…})` (probed once, cached) → encode to WebM/Opus.
2. Otherwise, or on **any** encode error → fall back to `convertToWavBlob` (the merged 16-bit PCM WAV).

So Firefox <130 / contexts without WebCodecs / any failure degrade to the Phase-1 PCM win — never a broken upload. Duration is unchanged (always sample-count-derived, never byte-derived).

## Where the encode runs: the network boundary, NOT the audio pipeline
The obvious place to encode is the post-VAD call sites (`AudioInputMachine`/
`DictationMachine`, where `convertToWavBlob` is called). **That approach was
prototyped and rejected** — it breaks the voice turn. The audio pipeline emits
`saypi:userStoppedSpeaking` **twice**: first raw (frames, no blob), then
re-emitted *synchronously nested* with the WAV blob inside `AudioInputMachine`'s
`sendData` (see its own TODO). `CallButton.handleUserStoppedSpeaking` and the
ConversationMachine rely on that second, blob-bearing emission landing in the
**same synchronous tick**. Inserting an `await` (Opus encode) anywhere between the
two emissions lets the raw event reach `CallButton` first, which cancels the
segment ("No audio data, cancelling capture") before the blob arrives — and no
upload happens. Verified at Layer 3: the in-pipeline `await` broke even the
baseline synthetic-turn spec.

So the encode happens at the **one async place that's already async and can't
disturb pipeline timing: FormData construction, right before the POST.** There
are exactly two `formData.append("audio", …)` sites and they cover every upload
path (conversation, dictation Phase 1, refinement Phase 2).

## Modules
- **`src/audio/OpusEncoder.ts`** (new) — `isOpusUploadSupported()` (cached WebCodecs probe) + `encodeToOpusWebM(frames): Promise<Blob>` (WebCodecs `AudioEncoder` → `webm-muxer`).
- **`src/audio/WavEncoder.ts`** — add `decodePcm16Wav(buffer)`: decode our 16-bit PCM WAV back to Float32 (returns `null` for any other layout). Lets the boundary transcode work from just the WAV blob, with no re-plumbing of the event pipeline.
- **`src/audio/AudioEncoder.ts`** — add `transcodeForUpload(blob)`: if it's an `audio/wav` blob and WebCodecs Opus is supported, decode → `encodeToOpusWebM` → WebM/Opus; otherwise (non-WAV, unsupported, or any error) return the blob **unchanged**. Keep `convertToWavBlob`/`convertToWavBuffer` (the pipeline's encoder, untouched).
- **`src/TranscriptionForm.ts` + `src/TranscriptionModule.ts`** — call `await transcodeForUpload(audioBlob)` before computing the filename + `append`. WebM/Opus → the existing default `audio.webm` filename (no other change).

The WAV→Float32→Opus round-trip wastes a cheap synchronous WAV encode, but buys
**zero** changes to the fragile synchronous event pipeline — the right trade.

## Verification
- **Layer 1 (Vitest/JSDOM) — green:** capability probe (false when `AudioEncoder` absent; true+cached when mocked supported; throwing probe → false); `transcodeForUpload` → `audio/webm` when supported (passing the decoded samples), original blob when unsupported / non-WAV / on encode error; `decodePcm16Wav` round-trips 16-bit PCM and rejects float/non-RIFF bytes. The whole `npm test` gate stays green (1415 Vitest + Jest + typecheck) — note `transcodeForUpload` is a no-op in JSDOM (no WebCodecs), so it can't perturb existing upload-path tests.
- **Layer 3 (headless Chrome — real WebCodecs) — green:** new `e2e/specs/opus-upload.e2e.ts` drives the synthetic voice turn and asserts the mock `/transcribe` received `audio/webm` (Opus actually ran) **and** the transcript landed; environment-adaptive (asserts `audio/wav` where Opus is unsupported). The full 12-spec e2e suite passes, incl. the baseline synthetic + dictation turns (proving the pipeline timing is untouched). The mock server was extended to expose the uploaded audio Content-Type.
- **Layer 4 (real host, founder-gated) — PENDING:** confirm pi.ai/claude.ai/chatgpt.com transcribe the Opus upload correctly with no accuracy regression. Bundle: `webm-muxer` measured at **27 KB min / 7.5 KB gzip** — negligible vs AMO's 5 MB non-binary limit.

## Risks
- WebCodecs `AudioEncoder` availability in a **content-script isolated world** on real hosts — mitigated by the PCM fallback; confirmed at Layer 4.
- Firefox MV2 native WebCodecs Opus is uncertain (130+ only, extension-context exposure unverified) → falls back to PCM there, consistent with the existing degraded-on-Firefox model.
- Bundle: `webm-muxer` measured against the Firefox AMO 5 MB non-binary limit in the build step.
