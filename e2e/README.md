# Layer 3 — headless end-to-end harness

This directory holds the **Layer 3** test harness: a headless-Chromium,
Playwright-driven suite that loads the *real* built extension into a *real*
browser and drives it against *local mock* servers and a *fake* microphone. It
sits above the unit/integration tests (Jest + Vitest, Layer 1/2) and below the
live-host dev-verify loop (Layer 4, see [doc/autonomous-dev-loop.md](../doc/autonomous-dev-loop.md)).

It proves the bits unit tests can't: that the bundled content script actually
decorates a chatbot page, and that a spoken clip travels the full voice-input
pipeline (fake mic → VAD → STT → prompt) end to end.

> **Status: ADVISORY.** The CI job ([.github/workflows/e2e.yaml](../.github/workflows/e2e.yaml))
> runs on every PR and push to `main` but is **not** a required merge check and is
> **not** part of the `npm test` aggregate. Treat a red E2E run as a signal to
> investigate, not as a merge blocker. Promotion to a required check is a
> deliberate, founder-signed gate change once the suite has proven stable on CI
> runners.

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

Retries are `0` locally and `2` on CI; a Playwright trace is captured
`on-first-retry`. `workers: 1` / `fullyParallel: false` — the harness binds
mock servers and a fake-mic device per run, so the specs run serially.

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
     tooltip-contrast.e2e.ts page.goto(https://claude.ai/new) -> body.claude ->
                          the real built CSS renders .saypi-tooltip as an opaque
                          dark pill (guards the host-CSS-var contrast bug)
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
| `fixtures/extension.ts` | `test`/`expect` fixture: launches the context, exposes `serviceWorker`/`extensionId` |
| `fixtures/launch-args.ts` | pure builder for the Chrome launch args (unit-testable) |
| `fixtures/audio/` | the fake-mic WAV clip + its [README](fixtures/audio/README.md) |
| `support/global-setup.ts` | build guard + start mock servers + export ports |
| `support/global-teardown.ts` | close mock servers |
| `support/mock-servers.ts` | self-signed HTTPS page server (Host-routed Pi/Claude pages) + saypi-api (`/transcribe`, `/merge`, GA catch-all) |
| `support/mock-pi-page.html` | minimal Pi.ai-shaped DOM the content script decorates |
| `support/mock-claude-page.html` | minimal claude.ai stand-in (defines no `--black`) for the host-CSS contrast spec |
| `support/transcribe-response.ts` | the STT contract: shape of the `/transcribe` response |
| `support/manifest-guard.ts` | `assertDevManifest()` — refuses a non-static / production build |
| `support/check-servers.mjs` | standalone sanity check for the mock servers |
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
- **CI risk (why it stays advisory):** headless Chromium + fake-audio + WASM-VAD
  on shared Ubuntu runners is inherently timing-sensitive — the VAD's
  speech-end detection and the SW upload race can flake under load. CI runs with
  2 retries and uploads the trace on failure, but until the suite shows a stable
  green streak on CI runners it stays **advisory** rather than required. Promote
  it only with founder sign-off, not by quietly adding it to required checks or
  the `test` aggregate.

When this suite is red, first reproduce locally with `npm run e2e:build &&
npm run test:e2e`; if it's green locally but red on CI, suspect timing/flake and
inspect the uploaded Playwright trace before changing any test.
