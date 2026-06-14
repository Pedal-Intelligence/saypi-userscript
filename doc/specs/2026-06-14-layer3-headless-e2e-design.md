# Headless E2E harness against a mock chat page (Layer 3) — design

- **Date:** 2026-06-14
- **Status:** Approved by founder (spine approved 2026-06-14; mechanism details verified by research)
- **Author:** Autonomous engineering session (Claude)
- **Sub-project:** Layer 3 of the testability plan in `doc/autonomous-bootstrap.md`. Follows Layer 4
  (`doc/specs/2026-06-13-autonomous-dev-loop-layer4-design.md`), which is shipped (PR #287).

## Why

Layer 4 (the real-site dev-verify loop) gives high-fidelity confidence against the genuine chat
hosts, but it is bound to the founder's browser, cannot drive the microphone, and is explicitly
**not CI** — it is a spot-check, not a per-PR gate. The mandate's Layer 3 fills the complementary
gap: a **headless, hermetic, per-PR** end-to-end layer that loads the real built extension against
a chat page we control, drives it (including the mic) with no human in the loop, and runs on every
PR. It is the layer that lets the autonomous loop catch the cross-context bugs — offscreen-document
lifecycle, MV3 service-worker messaging, CSP, real WASM-VAD — that JSDOM unit tests structurally
cannot, *without* depending on a flaky third-party site.

The two layers are deliberately complementary, not substitutes. Layer 3 tests the extension's own
machinery against a DOM we own (fast, deterministic, CI). Layer 4 tests integration with the real
hosts, where the DOM is a moving target and where things most often actually break.

## Approach (founder-approved)

1. **Engine:** real headless Chrome driven by **Playwright** (`@playwright/test`), loading the
   *built* extension — the highest fidelity short of a real site.
2. **First sub-project:** a walking skeleton that ends at the marquee path. Slice (a): the harness
   loads the extension, serves a mock Pi page, and asserts SayPi decorates it. Slice (b): a
   fake-audio mic → real offscreen WASM-VAD → mock STT → the transcript lands in the prompt.
3. **CI posture:** the Layer 3 job lands as a **separate, advisory** workflow (runs on every PR,
   visible, *not* a required merge blocker) until it proves stable; promotion to a required check
   is a later, founder-signed gate change. The existing required `npm test` gate is unchanged.
4. **Scope of this slice:** Chrome MV3 + a mock **Pi** page + a local mock saypi-api only. Firefox
   MV2, Claude/ChatGPT mock pages, and the TTS path are explicit follow-ons.

## How it works

The harness builds a static, development-mode extension, launches Playwright-bundled Chromium in
the new headless mode with the extension side-loaded, redirects the real hostnames to local mock
HTTPS servers at the DNS layer, feeds a real speech clip as a fake microphone, and asserts on the
extension's observable effects in the page DOM.

```
e2e:build (copy-onnx + wxt build -m development)  ─▶  .output/chrome-mv3-dev/  (static manifest)
   │
   ├─ manifest-shape guard (fail fast on a wrong/stale/prod build)
   │
Playwright global-setup: mint self-signed cert; start mock Pi HTTPS server + mock saypi-api HTTPS server
   │
chromium.launchPersistentContext(channel:'chromium', args:[ load-extension, host-resolver-rules,
   ignore-certificate-errors, fake-audio trio, headless=new ])
   │
page.goto('https://pi.ai/talk')  ── pi.ai resolves to the local mock; content script matches https://pi.ai/* ──▶ detects "pi"
   │
slice (a): mock mounts prompt subtree post-load ─▶ DOMObserver decorates ─▶ assert #saypi-callButton etc.
slice (b): fake mic ─▶ offscreen getUserMedia ─▶ real Silero-v5 WASM ─▶ VAD_SPEECH_END ─▶ SW fetch POST
           https://api.saypi.ai/transcribe (→ mock) ─▶ {text} ─▶ assert #saypi-prompt.value contains text
```

### The eight load-bearing facts (verified against the live repo and WXT/Playwright internals)

These are the corrections that make the difference between a harness that works and one that
silently no-ops. Each is verified, not assumed.

1. **Build with `-m development`, never bare `wxt build`.** A bare `wxt build` resolves
   `mode='production'` and loads `.env.production` (forbidden). `wxt build -b chrome -m development`
   forces development mode, whose env-file set provably *cannot* include `.env.production`
   (`node_modules/wxt/dist/core/utils/env.mjs`). The harness asserts the mode and refuses a bare
   build.
2. **`copy-onnx` must run explicitly.** Calling `wxt build` directly skips the npm `prebuild` hook,
   so `node copy-onnx-files.js` must run first or the 4 git-ignored `ort-wasm*.wasm` files are
   absent and VAD never loads. The `e2e:build` script chains both.
3. **Output dir is `.output/chrome-mv3-dev/`** (development mode appends `-dev`), not
   `.output/chrome-mv3/`. The harness loads the `-dev` dir.
4. **The `wxt dev` *server* output is not loadable.** It omits static `content_scripts` (registers
   them at runtime via `chrome.scripting`) and bakes `localhost:3001` into the CSP. `wxt build
   -m development` produces a *static* manifest with `content_scripts` matching `https://pi.ai/*`
   and a clean CSP. Because both write to the same `-dev` dir, a stale dev-server build is a
   foot-gun — the manifest-shape guard catches it (asserts `content_scripts` present and CSP has no
   `localhost:3001`).
5. **`channel:'chromium'` + new headless are required.** Extensions do not load under the old
   headless shell or under `channel:'chrome'`/`'msedge'` (Google removed the side-load flags). Use
   Playwright's bundled Chromium via `channel:'chromium'` and `launchPersistentContext` (stateless
   contexts cannot load extensions).
6. **Keep the real saypi hostnames; redirect at the DNS layer.** STT/TTS requests originate in the
   MV3 *service worker*, governed by `host_permissions` (`https://api.saypi.ai/*`,
   `https://www.saypi.ai/*` — the env defaults). A SW fetch is permitted by the requested *host*,
   not the resolved IP, so `--host-resolver-rules "MAP api.saypi.ai 127.0.0.1:<port>, MAP pi.ai
   127.0.0.1:<port>, ..."` redirects without any manifest/permission change. Rewriting the URLs to
   `localhost` via `.env` would break it — `.env`-file values reach `import.meta.env` (src) but
   **not** `host_permissions` (computed from `process.env` at config-module load, before WXT's
   `loadEnv`). So **no manifest/permission/match-pattern change is needed or made** — keeping us out
   of the guardrail-3 review domain.
7. **TLS: SNI stays `pi.ai`, so `--ignore-certificate-errors` is mandatory.** `--host-resolver-rules`
   only changes DNS; the TLS ClientHello SNI and HTTP Host header still say `pi.ai`/`api.saypi.ai`,
   so Chrome validates the local self-signed cert against the real hostname and rejects it unless
   the browser-wide flag is set. (Playwright's `ignoreHTTPSErrors` covers only Playwright's own
   requests, not page navigations or SW fetches.) With the flag set, the mock may present any
   self-signed cert.
8. **Pi decoration is mutation-driven, and `autoSubmit` must be off.**
   - `DOMObserver.observeDOM()` does *no* initial scan; it only decorates nodes **added after** the
     observer attaches. The mock must mount the prompt subtree **post-load** (or the test injects it
     via `page.evaluate` after navigation — preferred, deterministic), and the `<textarea>` must be
     a **descendant** of the added node (`getPromptInput` uses `querySelector`, which excludes the
     node itself).
   - The shipped default `autoSubmit=true` writes the draft to the textarea *placeholder* and
     auto-submits (clearing the input). The harness seeds the extension's `autoSubmit` preference to
     `false` (via `serviceWorker.evaluate(() => chrome.storage.local.set(...))`) so the transcript
     is typed into `#saypi-prompt.value` and persists for assertion. (The exact storage key is
     verified from `PreferenceModule` during implementation.)

### The STT mock contract

The mock saypi-api answers the one endpoint the first slice exercises:

```
POST https://api.saypi.ai/transcribe?app=web&language=en      (issued by the MV3 service worker)
  Content-Type: multipart/form-data   (fields: audio[file audio.wav], duration, sequenceNumber,
                                        messages "[]", acceptsMerge "true", + optional usage metadata)
  Authorization: Bearer <jwt>         (only if authenticated; accept-any, never 401/403)
  → 200 application/json  { "text": "<canned transcript>", "sequenceNumber": <echo request value> }
```

`text` must be non-empty; `sequenceNumber` should echo the request's value. `/merge` is not called
for a single utterance (optionally stubbed as a no-op). Responses are derived from the real API
contract and are refreshable, exactly like the Layer 2 DOM fixtures — they are a recorded contract,
not a frozen one. Latency must stay under the client's 10 s `AbortController` timeout.

### The fake-audio fixture

`--use-file-for-fake-audio-capture=<clip>.wav` feeds a real speech clip to the offscreen
`getUserMedia`, where the real `@ricky0123/vad-web` Silero-v5 model scores it. A synthetic tone will
**not** trigger the speech model — the fixture is a short (~3 s) real-speech WAV (RIFF/WAVE, 16-bit
PCM, mono, 16 kHz) with leading/trailing silence so the `balanced` preset (posThreshold 0.4,
minSpeechFrames 3, redemptionFrames ~320 ms) reliably fires `onSpeechStart`/`onSpeechEnd`. It is
self-generated (macOS `say` → `ffmpeg`), license-clean, < 200 KB, committed with a sibling README
documenting the spec and regeneration command (deterministic, so CI need not synthesize it).

## Components (deliverables, one PR)

A new top-level `e2e/` tree, kept separate from `test/` so neither Jest (`**/*.test.js`) nor Vitest
(`**/*.spec.ts`) picks up the Playwright specs (named `*.e2e.ts`; `e2e/**` also excluded in Vitest
config as belt-and-suspenders).

- **`e2e/playwright.config.ts`** — single Chromium project, `workers:1`, `fullyParallel:false`
  (one offscreen doc + shared fake device → serial), `retries:2` on CI, global-setup hook.
- **`e2e/fixtures/launch-args.ts`** — *pure* builder: `(extDir, ports, wavPath) → string[]` of
  Chrome args. Unit-tested in Vitest (runs in the existing required gate).
- **`e2e/fixtures/extension.ts`** — Playwright fixture: `launchPersistentContext({channel:'chromium',
  args})`, resolves `extensionId` from the service worker, exposes `context`/`page`/`serviceWorker`.
- **`e2e/support/manifest-guard.ts`** — *pure* assertion over a parsed manifest (content_scripts
  match `pi.ai`; CSP has `wasm-unsafe-eval` and no `localhost:3001`). Unit-tested; run in
  global-setup against the built manifest to fail fast on a wrong/stale/prod build.
- **`e2e/support/mock-pi-page.html`** + **`e2e/support/mock-pi-server.ts`** — minimal mock Pi page
  served over local HTTPS; prompt subtree mounted post-load (or injected from the test).
- **`e2e/support/mock-api-server.ts`** — local HTTPS server: `POST /transcribe` → canned response
  (pure response-shaping fn unit-tested); optional `/merge` no-op.
- **`e2e/support/global-setup.ts`** — mints a self-signed cert (`selfsigned`, no openssl dep), starts
  both mock servers, runs the manifest guard.
- **`e2e/fixtures/audio/speech-16k-mono.wav`** + **README** — the fake-mic fixture + provenance.
- **`e2e/specs/decoration.e2e.ts`** — slice (a): extension loads, Pi detected, SayPi decorates.
- **`e2e/specs/dictation-stt.e2e.ts`** — slice (b): fake audio → VAD → mock STT → transcript.
- **`package.json`** — add `@playwright/test` + `selfsigned` devDeps; add scripts `e2e:build`
  (`node copy-onnx-files.js && wxt build -b chrome -m development`) and `test:e2e`
  (`playwright test`). **The `test` aggregate is unchanged** (advisory, not in the required gate).
- **`.github/workflows/e2e.yaml`** — a **new, separate, non-required** workflow: Ubuntu, Node 22,
  install, `npx playwright install --with-deps chromium`, `e2e:build`, `test:e2e`. Advisory.
- **Docs** — `e2e/README.md` (how to run/debug locally, refresh fixtures, the dual-env gotcha) plus
  end-of-PR updates marking Layer 3 shipped in `AGENTS.md` and `doc/autonomous-bootstrap.md`.

## Testing and acceptance

- **Unit tests (Vitest, existing required gate):** the pure helpers — `launch-args` builder,
  `manifest-guard`, and the mock-api response-shaping function — are built fail-first via TDD and
  run in `npm test`. This is real per-PR coverage even before the advisory e2e job is trusted.
- **E2E specs (advisory job):** slice (a) decoration green is the gate before slice (b); slice (b)
  is the end-to-end marquee path. An intermediate localizer (the mock records that `/transcribe`
  was hit) distinguishes "VAD didn't fire" from "transcript plumbing broke".
- **Acceptance:** `npm test` stays green; `e2e:build` produces a guard-passing static dev manifest;
  the decoration spec passes locally; the e2e workflow runs (advisory) on the PR. Honest reporting
  of which e2e specs passed locally vs. are pending first CI execution (see risks).

## Risks and mitigations

| Risk | Where validated | Mitigation |
| --- | --- | --- |
| Bare `wxt build` loads `.env.production` | local | Hard-code `-m development`; guard refuses a bare build. |
| Stale `wxt dev` output loaded instead of static build | local | `e2e:build` always rebuilds; manifest-shape guard asserts static `content_scripts` + no `localhost:3001`. |
| Extension won't load headless | local + **CI** | `channel:'chromium'` + new headless + `launchPersistentContext`; **headless-Linux load is the top CI-only unknown**. |
| Self-signed cert rejected (SNI = real host) | local | `--ignore-certificate-errors` browser-wide; `selfsigned` cert minted in global-setup. |
| Mock prompt never decorated (mutation-driven) | local | Mount prompt post-load as a nested descendant / inject via `page.evaluate`. |
| Transcript auto-submitted away | local | Seed `autoSubmit=false` in extension storage before navigation. |
| Fake audio doesn't trigger Silero headless on Linux | **CI** | Real speech WAV + silence padding; intermediate VAD-fired localizer; **flagged as the top CI-only risk**. |
| WASM/ONNX cold-start timing on CI | **CI** | Generous timeouts (15–30 s) + `retries:2`. |
| New advisory job flaking blocks unrelated PRs | n/a | Advisory (non-required) until proven; promotion is a later founder-signed gate change. |
| Playwright specs picked up by Jest/Vitest | local | `*.e2e.ts` naming + `e2e/**` Vitest exclude; `test` aggregate untouched. |

## Production-boundary safety (founder's permanent guardrail)

- The harness **never** loads `.env.production`: it builds with `-m development` and guards against a
  bare build. No production artifact is produced or submitted.
- Hermetic: `--host-resolver-rules` sends every real host to local mocks, so there is zero real
  network and zero secret. The mock api accepts-any auth (auth is separately unit-tested and is a
  guardrail-3 domain this slice deliberately does not touch).
- **No manifest, permission, or content-script match-pattern change** — host redirection is at the
  browser's DNS layer, keeping production injection scope identical and this PR out of the
  multi-lens-+-founder-sign-off domain. It is additive test/CI infrastructure (normal gate).

## Out of scope (deferred to follow-on sub-projects)

- Firefox MV2 (no offscreen document; extension loads via a different path).
- Claude and ChatGPT mock pages (each has its own detection + selectors).
- The TTS playback path (offscreen audio element), the dual-phase transcription refinement path, and
  the `/merge` multi-utterance path.
- Promotion of the e2e job to a required merge check (a later, founder-signed gate change).
