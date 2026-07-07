# Layer 3 — headless end-to-end harness

This directory holds the **Layer 3** test harness: a headless-Chromium,
Playwright-driven suite that loads the *real* built extension into a *real*
browser and drives it against *local mock* servers and a *fake* microphone. It
sits above the unit/integration tests (Jest + Vitest, Layer 1/2) and below the
real-host loops: the agent-launched **Layer 3.5** (real hosts, founder-seeded auth,
see [doc/layer35-real-host-loop.md](../doc/layer35-real-host-loop.md)) and the
live-host **Layer 4** dev-verify loop (see [doc/autonomous-dev-loop.md](../doc/autonomous-dev-loop.md)).

It proves the bits unit tests can't: that the bundled content script actually
decorates a chatbot page, and that a spoken clip travels the full voice-input
pipeline (fake mic → VAD → STT → prompt) end to end.

> **Firefox:** this harness is Chromium-only (Playwright cannot load Firefox
> extensions). The Firefox MV2 build has its own separate, **advisory** smoke
> lane — see [e2e-firefox/README.md](../e2e-firefox/README.md) (#527).

> **Status: REQUIRED.** The CI job ([.github/workflows/e2e.yaml](../.github/workflows/e2e.yaml))
> runs on every PR and push to `main` and is a **required** status check — a red
> E2E run blocks merge. It is still **not** part of the `npm test` aggregate (it
> stays a separate workflow). Promoted from advisory to required on 2026-06-20
> after the suite proved stable on CI runners (five consecutive first-attempt-green
> runs across distinct, non-docs-only PRs: #289, #294, #295, #328, #335).

## Run it locally

```bash
npm run e2e:build     # build the static dev extension into .output/chrome-mv3-dev
npm run test:e2e      # launch headless Chromium + run the Playwright specs
```

`e2e:build` must run first (or after any source change): the specs load the
**already-built** extension from `.output/chrome-mv3-dev/` — they do not build it
for you. `global-setup` fails fast with a clear message if that build is missing
or is not a static development-mode build.

### Debugging

```bash
# Headed + Playwright Inspector (step through, see the browser):
PWDEBUG=1 npm run test:e2e

# Run a single spec:
npx playwright test --config e2e/playwright.config.ts e2e/specs/dictation-stt.e2e.ts

# Verbose extension logs in the build (already on via VITE_DEBUG_LOGS in e2e-build):
#   page console errors are echoed to the test log by the dictation spec.

# After a failure, open the trace (CI uploads test-results/ + playwright-report/):
npx playwright show-trace test-results/**/trace.zip
```

Retries are `0` locally and `2` on CI. Every failed attempt — including a
first-attempt failure with zero retries — leaves diagnosable evidence in
`test-results/` at the repo root: screenshots (`screenshot: "only-on-failure"`)
and a trace (`trace: "retain-on-failure"`, recorded per attempt and kept only
when the attempt fails, so green runs pay ~nothing and write nothing). CI adds
an HTML reporter so the `playwright-report/` upload in the failure-artifact
step is a browsable report, not an empty directory (#463). `workers: 1` /
`fullyParallel: false` — the harness binds mock servers and a fake-mic device
per run, so the specs run serially.

## Settings page (Preact migration)

The settings UI (`entrypoints/settings/**`) was migrated from imperative HTML
strings to Preact components. Two specs cover it — they load the real
`settings.html` over `chrome-extension://<id>/…`, so the *full* bootstrap runs
with the extension runtime live (`browser.runtime.getURL`, chunk loading, the
Preact mounts, and the imperative controllers that wire them by id). That's the
thing a static file server can't show and unit tests can't reach: a page that
mounts but renders wrong (e.g. the PR4f header that lost a CSS utility) or a
panel left empty by a chunk/import break.

- **`specs/settings.e2e.ts` — REQUIRED (in the CI gate).** Asserts the header
  mounts, every tab panel renders content on selection, and there are **no
  uncaught page errors**. Robust and deterministic: it keys on DOM presence, not
  pixels, and treats network 404s (the hermetic env has no auth/status backend)
  as expected — only `pageerror` (a thrown mount/controller) fails it. It seeds
  `chrome.storage.local` with a consent decision so the General tab renders its
  steady state rather than the first-run consent gate (whose hero overlays the
  sidebar).

- **`specs/settings.visual.ts` — ON-DEMAND (NOT in the CI gate).** Pixel
  baselines per tab via `toHaveScreenshot`, with auth/quota/status regions
  masked. Run via its own config (`playwright.visual.config.ts`, `testMatch:
  **/*.visual.ts`) so the default `npm run test:e2e` never picks it up:

  ```bash
  npm run test:e2e:visual          # compare against committed baselines
  npm run test:e2e:visual:update   # regenerate after an intended UI change
  ```

  Baselines (`specs/settings.visual.ts-snapshots/*.png`) are **committed** and
  **platform-specific** (Playwright suffixes them `-<platform>`, e.g.
  `-darwin`). That platform-specificity is exactly why this is a local
  pre-flight tool, not a cross-platform CI check — a baseline captured on macOS
  would spuriously fail the Linux CI runner. Regenerate baselines on the same
  platform you'll compare on, and eyeball the new PNGs before committing.

## Architecture

```
  npm run e2e:build
        │  wxt build -b chrome -m development  ->  .output/chrome-mv3-dev/
        ▼
  Playwright globalSetup (e2e/support/global-setup.ts)
        │  1. assertDevManifest()  — refuse a `wxt dev` / production build
        │  2. startMockServers()   — two self-signed HTTPS servers on ephemeral ports
        │  3. export SAYPI_E2E_PI_PORT / SAYPI_E2E_API_PORT
        ▼
  context fixture (e2e/fixtures/extension.ts + launch-args.ts)
        │  chromium.launchPersistentContext with:
        │    --load-extension / --disable-extensions-except  -> the dev build
        │    --host-resolver-rules  MAP pi.ai/claude.ai/api|www|app.saypi.ai/google-analytics.com
        │                           -> 127.0.0.1:<port>, then MAP * ~NOTFOUND (fail closed)
        │    --ignore-certificate-errors / --allow-insecure-localhost
        │    --use-fake-device-for-media-stream / --use-fake-ui-for-media-stream
        │    --use-file-for-fake-audio-capture=<speech-16k-mono.wav>
        │    --headless=new
        ▼
  Specs
     decoration.e2e.ts   page.goto(https://pi.ai/talk) -> #saypi-callButton appears
     dictation-stt.e2e.ts fake mic (WAV) -> getUserMedia -> offscreen Silero-v5 VAD
                          -> onSpeechEnd -> SW POSTs /transcribe (mock echoes a
                          transcript) -> draft written into #saypi-prompt.value
     mock-isolation.e2e.ts a fresh test observes ZERO mock /transcribe state —
                          guards the per-test reset the context fixture performs,
                          so no spec's hits/content-type assertion can be
                          satisfied by another spec's traffic (#462)
     tooltip-contrast.e2e.ts page.goto(https://claude.ai/new) -> body.claude ->
                          the real built CSS renders .saypi-tooltip as an opaque
                          dark pill (guards the host-CSS-var contrast bug)
     sw-recycle.e2e.ts    force an idle MV3 service-worker recycle (CDP
                          Target.closeTarget) -> assert NO "VAD disconnected"
                          alarm + voice input self-heals on next call (#307)
     offscreen-shutdown.e2e.ts force the offscreen idle auto-shutdown -> assert
                          the document closes but the live content-script port
                          survives (so VAD_SPEECH_END stays routable) (#308)
```

The pivotal trick is **`--host-resolver-rules`**: the extension is built with the
*real* public hostnames (`pi.ai`, `api.saypi.ai`, …) so the bundle's URLs are
genuine, and Chrome transparently redirects those hostnames to the local mock
servers at DNS-resolution time. The mocks present self-signed TLS, which Chrome
accepts because the browser is launched with `--ignore-certificate-errors`
(Node-side fetches opt out via `NODE_TLS_REJECT_UNAUTHORIZED=0`). Nothing leaves
the machine — the run is hermetic, even GA beacons are absorbed by the mock API's
catch-all. The redirect list **fails closed**: the explicit `MAP`s
(`pi.ai`, `api`/`www`/`app.saypi.ai`, `google-analytics.com`) are followed by a
trailing `MAP * ~NOTFOUND` sinkhole, so any host *not* explicitly mapped resolves
to nothing — a future spec that reaches for an unmapped endpoint errors loudly
instead of silently calling the real internet.

### Files

| Path | Role |
| --- | --- |
| `playwright.config.ts` | serial runner, global setup/teardown, CI retries/trace |
| `fixtures/extension.ts` | `test`/`expect` fixture: resets the mock API's transcribe state (per-test isolation, #462), launches the context, exposes `serviceWorker`/`extensionId` |
| `fixtures/launch-args.ts` | pure builder for the Chrome launch args (unit-testable) |
| `fixtures/audio/` | the fake-mic WAV clip + its [README](fixtures/audio/README.md) |
| `support/global-setup.ts` | build guard + start mock servers + export ports |
| `support/global-teardown.ts` | close mock servers |
| `support/mock-servers.ts` | self-signed HTTPS page server (Host-routed Pi/Claude pages) + saypi-api (`/transcribe`, hit/content-type diagnostics + per-test reset route, GA catch-all) |
| `support/mock-pi-page.html` | minimal Pi.ai-shaped DOM the content script decorates |
| `support/mock-claude-page.html` | minimal claude.ai stand-in (defines no `--black`) for the host-CSS contrast spec |
| `support/transcribe-response.ts` | the STT contract: shape of the `/transcribe` response |
| `support/manifest-guard.ts` | `assertDevManifest()` — refuses a non-static / production build |
| `support/check-servers.mjs` | standalone sanity check for the mock servers |
| `support/dictation.ts` | shared drive-a-turn helpers (`seedAutoSubmitFalse`, `openDecoratedPiPage`, `getTranscribeHits`) used by the dictation + lifecycle specs |
| `support/lifecycle.ts` | MV3 lifecycle drivers (`evictServiceWorker`, `reacquireServiceWorker`, `isWorkerDead`, `triggerOffscreenShutdown`, `hasOffscreenDocument`, `getConnectedTabCount`) — see the section below |
| `support/lifecycle-targets.ts` | pure CDP-target predicates (`isExtensionServiceWorkerTarget`, `pickExtensionServiceWorkerTarget`); unit-tested in the **required** gate (`test/e2e/lifecycle-targets.spec.ts`) |
| `specs/*.e2e.ts` | the tests |

## The dual-env gotcha (read this before editing launch/build config)

There are **two separate environment channels** and they reach different layers.
Mixing them up is the single most confusing failure mode here:

- **`.env*` files → `import.meta.env` (the bundle).** `e2e:build` writes
  `.env.development.local` with the *public, non-secret* dev URLs
  (`VITE_API_SERVER_URL=https://api.saypi.ai`, etc.) so the compiled content
  script calls the real hostnames — which `--host-resolver-rules` then redirects.
  These are **build-time** values baked into the bundle by WXT/Vite. **Never put
  a secret here.** GA_* are deliberately omitted: telemetry fails soft (#292), so
  building GA-less makes `decoration.e2e.ts` a regression guard — bootstrap must
  still decorate the page with no analytics config.
- **Shell / process env vars → the harness runtime.** `SAYPI_E2E_PI_PORT` and
  `SAYPI_E2E_API_PORT` are exported by `global-setup` *after* the mock servers
  bind ephemeral ports, and consumed by `launch-args.ts` to build
  `--host-resolver-rules`. `CI=true` flips retries/reporter. These never enter
  the bundle.

In short: **`.env` files configure what the extension *thinks* it's talking to;
shell vars configure where the harness *actually* points it.** A value that needs
to be in the compiled bundle goes in the `.env.development.local` written by
`e2e:build`; a value that only the test process needs goes in shell/process env.

## Refreshing fixtures and the STT contract

### Fake-mic WAV

The deterministic speech clip lives at `fixtures/audio/speech-16k-mono.wav`.
Regeneration (macOS `say` + `ffmpeg`), format spec, and the reasons it must be
*real* 16 kHz mono speech (Silero-v5 won't fire on a tone) are documented in
[fixtures/audio/README.md](fixtures/audio/README.md). The clip is self-generated
and license-clean. If you change the spoken text or format, update that README's
spec table and the transcript expectation in the spec.

### STT response contract

`support/transcribe-response.ts` (`buildTranscribeResponse` + `DEFAULT_TRANSCRIPT`)
defines the **minimal valid `/transcribe` response** the client's
`TranscriptionModule` parses: a non-empty `text` and an echoed `sequenceNumber`.
The mock API in `mock-servers.ts` uses it; the dictation spec asserts the prompt
ends up containing `DEFAULT_TRANSCRIPT`.

If the real saypi-api `/transcribe` response shape changes, update
`transcribe-response.ts` to match — that's the one place the contract is encoded,
and it has its own unit coverage (Task 3) so a drift is caught at Layer 1 too.
Keep it minimal: only the fields the client genuinely reads belong here.

## Driving the MV3 lifecycle (`support/lifecycle.ts`) — the #307/#308 nets

`sw-recycle.e2e.ts` (#307) and `offscreen-shutdown.e2e.ts` (#308) exercise the
**service-worker / offscreen-document / content-script-port lifecycle** where both
of those bugs lived — the layer that was previously only reachable with hand-rolled
`chrome.runtime` port mocks (L1). `support/lifecycle.ts` is the reusable capability;
future lifecycle specs should build on it. Both events are driven by **explicit,
deterministic triggers — never a wall-clock idle wait** (the single biggest flake
trap here), and these specs are the most timing-sensitive in the suite, so they were
intentionally kept out of the e2e→required stability-bar count (that bar has since
been reached and e2e is now a required check).

Four facts make this work (each verified live against the bundled Chromium):

- **SW recycle = CDP `Target.closeTarget`, not idle waiting.** An attached
  debugger/CDP client (Playwright always is one) *suppresses* MV3 idle suspension,
  so a natural 30s idle wait would never fire. `evictServiceWorker()` opens a CDP
  session on the page, finds the `service_worker` target whose URL carries the
  extension id, and closes it. The worker re-spawns on the **next** extension event
  (the self-heal call-button click supplies it).
- **A re-spawned extension SW REVIVES the same Playwright `Worker` handle** and emits
  **no** new `serviceworker` event. So `reacquireServiceWorker()` polls for the first
  *live* worker (via `isWorkerDead()`) rather than waiting for an event — covering both
  the revived-handle and the rare brand-new-handle cases.
- **The offscreen document is a `background_page` CDP target** that Playwright surfaces
  in neither `context.pages()` nor `context.backgroundPages()`, and the real
  `OFFSCREEN_AUTO_SHUTDOWN` message is hard-gated on `sender.url === offscreen.html`
  (un-forgeable). So `triggerOffscreenShutdown()` invokes the exact method the handler
  calls (`offscreenManager.closeOffscreenDocument()`) through a **DEV-only** hook
  exposed on the service worker (`__saypiOffscreenTestHooks`, gated on
  `import.meta.env.DEV` so it is dead-code-eliminated from production builds — the same
  pattern as the #312 build-stamp). The bug lived in `closeOffscreenDocument` (it cleared
  `portMap`), not in the handler routing, so this is a faithful reproduction.
- **The #308 net asserts the invariant, not a literal second utterance.** The mock runs
  one *continuous* VAD session (the looping mic streams utterances within a single
  offscreen session) with no assistant turn to make the conversation stop and re-arm VAD;
  once the offscreen doc is force-closed mid-call, nothing re-arms it, and the only
  deterministic re-arm available (toggling the call) ends the call → reconnects the port →
  repopulates `portMap` → **masks** the bug. So the spec asserts the exact invariant
  directly — the document closes **and** the live port survives (`getConnectedTabCount`
  stays > 0) — which *is* "the next VAD_SPEECH_END still routes to the tab", since routing
  is `portMap.get(tabId)`. Both nets are proven fail-first by reverting the corresponding
  production fix.

## Local-vs-CI risk split

This harness deliberately exercises a slice that *cannot* be covered by unit
tests, but it also carries risk that unit tests don't:

- **What only this layer can catch:** the real WXT bundle actually loading as an
  MV3 extension, the content script decorating a live DOM, `getUserMedia` →
  offscreen VAD → SW `/transcribe` plumbing working across the
  content/SW/offscreen boundaries, and the host-resolver/TLS redirect wiring.
- **Local risk (your machine):** needs Playwright's Chromium installed
  (`npx playwright install chromium`); the WAV regeneration tooling (`say`,
  `ffmpeg`) is macOS-flavoured; ephemeral-port binding and self-signed TLS can
  collide with aggressive local firewalls/VPNs.
- **CI risk (now a required check):** headless Chromium + fake-audio + WASM-VAD
  on shared Ubuntu runners is inherently timing-sensitive — the VAD's
  speech-end detection and the SW upload race can flake under load. CI runs with
  2 retries and uploads failure artifacts (per-attempt screenshots + traces in
  `test-results/`, plus the HTML report in `playwright-report/`). The suite
  earned promotion to a
  **required** check (2026-06-20) after a stable green streak on CI runners; it
  remains a separate workflow rather than part of the `npm test` aggregate. If
  it starts flaking under load, fix the flake — don't silently demote it.

When this suite is red, first reproduce locally with `npm run e2e:build &&
npm run test:e2e`; if it's green locally but red on CI, suspect timing/flake and
inspect the uploaded Playwright trace before changing any test.
