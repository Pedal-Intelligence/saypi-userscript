# Voice Activity Detection (VAD)

This directory holds SayPi's voice activity detection: the Silero VAD model, run in the
browser by ONNX Runtime (WebAssembly) through `@ricky0123/vad-web`.

## What ships

| File | Size | What it is |
|---|---|---|
| `silero_vad_v6.onnx` | 2.3 MB | Silero VAD v6, the speech-detection model (committed in `public/`) |
| `ort-wasm-simd-threaded.wasm` | 14 MB | ONNX Runtime's WebAssembly engine (copied from `node_modules` at build time) |
| `ort-wasm-simd-threaded.mjs` | 24 KB | Its JavaScript glue, loaded with `import()` (copied likewise) |
| `vad.worklet.bundle.min.js` | 2 KB | vad-web's audio worklet (added by `wxt.config.ts`) |

All of them are served from the extension root (WXT copies `public/` there). They can't come
from a CDN: MV3 forbids remote code, and the host page's CSP would block it anyway.
`copy-onnx-files.js` copies the two ORT files, and fails the build if either is missing.

### Why one WASM file (it used to be four)

Up to onnxruntime-web 1.18 the package shipped four WASM builds (plain, SIMD, threaded,
SIMD+threaded, about 37 MB together) and picked one at runtime. From 1.19 on, ORT ships a
single `ort-wasm-simd-threaded.wasm` for the CPU backend, which runs single-threaded when
`env.wasm.numThreads = 1`. We always set that, because MV3's CSP forbids the blob-backed worker
that threading needs. It requires WebAssembly SIMD, which every browser we support has
(Chrome/Edge 91+, Firefox 89+). The other `ort-wasm-simd-threaded.*` variants in the package
(asyncify, JSEP/WebGPU, JSPI) are for backends we don't use and are not copied.

## The model, and how it's fed

Every preset runs **Silero v6** (`VADConfigs.ts`). v6 has the same inputs as v5 (512-sample
frames at 16 kHz, a `[2,1,128]` state tensor), and each frame must be prefixed with the last 64
samples of the previous one. vad-web 0.0.24 skipped that context window, so until #655 we ran
v5 on degraded input. Fixing it and moving to v6, at unchanged thresholds, took clipped short
words from 8% to 0% and noise/music false-accepts from 41% to 15% on our benchmark corpus. See
`bench/vad/README.md` for the numbers and how to reproduce them.

## Architecture

- `OffscreenVADClient.ts` — Chrome/Edge: talks to the VAD running in the offscreen document
  (`src/offscreen/vad_handler.ts`), which escapes the host page's CSP.
- `OnscreenVADClient.ts` — Firefox and other browsers without offscreen documents: runs the VAD
  in the content script itself.
- `VADClientInterface.ts` — the interface both implement.
- `micStreamLifecycle.ts` — both clients open the mic themselves and hold it open across
  pause/resume, as vad-web 0.0.24 did (0.0.27+ would reopen it every assistant turn).
- `VADConfigs.ts` — presets and `selectVADPreset`. `segmentAdmission.ts` — the #420 gate.

### Firefox specifics (in-page VAD)

- **Audio processor:** vad-web's AudioWorklet can't run from a Firefox content script
  (`addModule` aborts, and frames arrive as cross-realm ArrayBuffers). The in-page client
  therefore asks for `processorType: "ScriptProcessor"` on Firefox, which is what vad-web 0.0.24
  silently fell back to there all along.
- **Model bytes:** `RequestInterceptor.js` copies the fetched model into a same-realm
  ArrayBuffer so ORT's `instanceof` check passes. Its file list must name the model we load.
- **Asset paths must be right on their own:** ORT loads its `.mjs` glue with `import()`, which
  RequestInterceptor's fetch rewrite can't redirect.

`npm run test:e2e:firefox` starts the in-page VAD in a real headless Firefox with a fake mic, so
a regression in any of these fails CI.

## Dependencies

- `@ricky0123/vad-web` — the MicVAD wrapper, frame processor and Silero model wrappers.
- `onnxruntime-web` — pinned to the version vad-web resolves, so npm keeps a single copy.
