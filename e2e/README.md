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

## Specs

Every file in `e2e/specs/`. "Gate" is the merge posture: **Required** specs run in
the `npm run test:e2e` suite that the e2e workflow gates merges on; **On-demand**
specs are matched only by their own config and never run in CI.

| Spec | What it proves | Gate |
| --- | --- | --- |
| `chat-adjacent-dictation.e2e.ts` | `hey.pi.ai` — where pi.ai bounces logged-out visitors — gets *universal dictation*, not the chat call button: the real manifest decides which script injects, and the dictation button lands on a real field (#559) | Required |
| `decoration.e2e.ts` | The bundled content script detects Pi on the mock page and injects `#saypi-callButton`. Doubles as the GA-less bootstrap guard (telemetry must fail soft, #292) and proves the `__SAYPI_BUILD_STAMP__` Vite define really replaced the token in a real build (#312) | Required |
| `dictation-stt.e2e.ts` | The full voice-input path against the local mocks: fake mic → `getUserMedia` → offscreen Silero-v5 VAD → `onSpeechEnd` → SW POSTs `/transcribe` → transcript drafted into `#saypi-prompt` | Required |
| `mock-isolation.e2e.ts` | The per-test mock reset holds: a fresh test observes **zero** `/transcribe` state, so no spec's hit-count assertion can be satisfied by an earlier spec's traffic (#462) | Required |
| `offscreen-shutdown.e2e.ts` | An idle offscreen auto-shutdown closes the document but keeps the live content-script port, so the next `VAD_SPEECH_END` stays routable (#308) | Required |
| `onboarding.e2e.ts` | The welcome page works fully offline: local artwork and Poppins load with the context offline and zero external requests, the environment radio writes `quietMode` to storage, the microphone test runs, and the narrow viewport doesn't overflow | Required |
| `opus-upload.e2e.ts` | A synthetic voice turn uploads **WebM/Opus** when this Chromium supports WebCodecs Opus encoding, and falls back to 16-bit PCM WAV when it doesn't — either way a transcript must land, so the encode can never break the upload (#414 / #417) | Required |
| `pi-action-buttons.e2e.ts` | Against the **real built CSS**: SayPi's redundant copy button is hidden now that pi.ai ships its own, and the telemetry button is visually seamless with pi.ai's native action-bar buttons (size, radius, padding, colour, icon size) | Required |
| `pi-audio-ownership.e2e.ts` | An open Pi conversation follows a voice chosen in a *different* extension document: host muting, simultaneous native players, SPA navigation, ownership surviving a reload, and native playback resuming when the override is cleared | Required |
| `pi-call-button.e2e.ts` | Against the **real built CSS**: the call button carries no vertical margin (so it doesn't inflate Pi's composer by 16px) and the active-call button keeps its visible grey disc while disabled | Required |
| `pi-native-restore.e2e.ts` | The Settings custom→native→custom round trip against real media: an inherited muted, paused Pi reply resumes without a page reload, with auto-read initially on *and* off | Required |
| `pi-voice-settings.e2e.ts` | The real content script on Pi's mock settings route: a stored SayPi voice reads correctly in light and dark, "Change voice" opens the catalog without committing, and a native Pi card runs Pi's own handler *and* clears the SayPi override in real `chrome.storage.local` | Required |
| `settings-layout.e2e.ts` | Settings layout stability: the header stays anchored across tab switches with real (non-overlay) scrollbars — the ~7px shunt of #582/#583 — and no tab overflows horizontally at 390/735/736px, including the longer `de` and `el` catalogs | Required |
| `settings-opens-in-tab.e2e.ts` | The `openPopup` runtime message opens settings as a normal browser **tab** (not a popup window), dedupes to the already-open tab, and `options_ui` is registered in the manifest | Required |
| `settings.e2e.ts` | The Preact settings page bootstraps for real: the header mounts, every tab panel renders content on selection, the Voices rail draws every voice the mock catalog serves, and nothing throws a `pageerror` | Required |
| `settings.visual.ts` | Pixel baselines per settings tab via `toHaveScreenshot`, auth/quota/status regions masked. Platform-specific committed baselines — a local pre-flight tool, deliberately **not** a cross-platform CI check | On-demand |
| `sw-recycle.e2e.ts` | An idle MV3 service-worker recycle (forced via CDP `Target.closeTarget`) raises **no** "VAD service disconnected" alarm and voice input self-heals on the next call (#307) | Required |
| `synthetic-audio-stt.e2e.ts` | The **in-extension** synthetic audio source drives the whole pipeline with no microphone: `saypi:dev-feed-speech` → offscreen latch → WAV decoded to a `MediaStream` → VAD → mock STT → transcript. This is the spec to copy for a mic-less voice turn (`doc/synthetic-voice-turn.md`) | Required |
| `telemetry-gate.e2e.ts` | Against the **real built CSS**: the telemetry button stays hidden on the most-recent message until that voice turn actually recorded metrics (gated on `body.saypi-recent-telemetry`), so a greeting never shows it | Required |
| `tooltip-contrast.e2e.ts` | Against the **real built CSS**: `.saypi-tooltip` renders as an opaque dark pill on the claude.ai mock host, which defines no `--black` — the undefined-`var()`-computes-to-`transparent` bug | Required |
| `voices-rail.e2e.ts` | What the Voices audition room *does*: DOM focus landing on the rail, `Space` alone sounding a voice (asserted on the heard counter), the arming rule in both directions, rows ordered by measured pitch on a shared reference line, wrapping at 320px, inflated-copy locales, and `Play all` walking the queue | Required |
| `voices-release.e2e.ts` | The release-candidate voice journey under **normal** autoplay policy: a saved native choice survives reopening, keyboard preview doesn't commit, `Enter` commits only its host, switch-back compares without committing, and an open studio refreshes an external choice | Required |

## Settings page (Preact migration)

The settings UI (`entrypoints/settings/**`) was migrated from imperative HTML
strings to Preact components. Six specs cover it (`settings`, `settings-layout`,
`settings-opens-in-tab`, `voices-rail`, `voices-release`, and the on-demand
`settings.visual`) — they load the real
`settings.html` over `chrome-extension://<id>/…`, so the *full* bootstrap runs
with the extension runtime live (`browser.runtime.getURL`, chunk loading, the
Preact mounts, and the imperative controllers that wire them by id). That's the
thing a static file server can't show and unit tests can't reach: a page that
mounts but renders wrong (e.g. the PR4f header that lost a CSS utility) or a
panel left empty by a chunk/import break.

Those specs are inventoried in the table above; two things about them don't fit
in a table cell:

- **`voices-rail.e2e.ts` cannot prove sticky autoplay activation.**
  `launch-args.ts` passes `--autoplay-policy=no-user-gesture-required` to every
  Layer-3 Chrome, so chained playback is licensed there regardless. See the
  spec's header comment. `voices-release.e2e.ts` is the one that opts *out* of
  that bypass, and first requires a gestureless ordinary-page negative control
  to fail, so its positive result establishes normal-policy behaviour.

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
        │    --host-resolver-rules  MAP pi.ai/hey.pi.ai/claude.ai/api|www|app.saypi.ai/google-analytics.com
        │                           -> 127.0.0.1:<port>, then MAP * ~NOTFOUND (fail closed)
        │    --ignore-certificate-errors / --allow-insecure-localhost
        │    --use-fake-device-for-media-stream / --use-fake-ui-for-media-stream
        │    --use-file-for-fake-audio-capture=<speech-16k-mono.wav>
        │    --headless=new
        ▼
  Specs (e2e/specs/*.e2e.ts — every one inventoried in "Specs" above)
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
to nothing. Note the `MAP`s are **exact-host**, not domain-wide: `MAP pi.ai`
does not cover `hey.pi.ai`, which is why the chat-adjacent host has its own
entry. A future spec that reaches for an unmapped endpoint errors loudly
instead of silently calling the real internet.

### Files

| Path | Role |
| --- | --- |
| `playwright.config.ts` | serial runner, global setup/teardown, CI retries/trace |
| `fixtures/extension.ts` | `test`/`expect` fixture: resets the mock API's transcribe state (per-test isolation, #462), launches the context, exposes `serviceWorker`/`extensionId` |
| `fixtures/launch-args.ts` | pure builder for the Chrome launch args (unit-testable) |
| `fixtures/audio/` | the fake-mic WAV clip + its [README](fixtures/audio/README.md) |
| `fixtures/voices/` | three real voice-preview MP3s the mock API serves as `sample_url`s + their [README](fixtures/voices/README.md) |
| `support/global-setup.ts` | build guard + start mock servers + export ports |
| `support/global-teardown.ts` | close mock servers |
| `support/mock-servers.ts` | self-signed HTTPS page server (Host-routed Pi/Claude pages) + saypi-api (`/transcribe`, hit/content-type diagnostics + per-test reset route, `/voices` catalog + `/voices/<id>/sample` clips, GA catch-all) |
| `support/voice-catalog.ts` | the `GET /voices` fixture: a seven-voice catalog shaped to exercise the Voices rail (both tiers, a duplicate-named pair, a clipless voice, measurable pitch spread) |
| `support/mock-pi-page.html` | minimal Pi.ai-shaped DOM the content script decorates |
| `support/mock-pi-voice-settings.html` | route-specific Pi native voice grid for `/profile/settings`, with light/dark host colors and a persistent native selection handler |
| `support/mock-claude-page.html` | minimal claude.ai stand-in (defines no `--black`) for the host-CSS contrast spec |
| `support/mock-hey-pi-page.html` | Pi's logged-out marketing splash stand-in — an ordinary form field, no composer — for the chat-adjacent dictation spec (#559) |
| `support/transcribe-response.ts` | the STT contract: shape of the `/transcribe` response |
| `support/manifest-guard.ts` | `assertDevManifest()` — refuses a non-static / production build |
| `support/check-servers.mjs` | standalone sanity check for the mock servers |
| `support/dictation.ts` | shared drive-a-turn helpers (`seedAutoSubmitFalse`, `openDecoratedPiPage`, `getTranscribeHits`) used by the dictation + lifecycle specs |
| `support/voices.ts` | drive-the-rail helpers: `openVoicesRail` (waits out catalog → prints → pitch re-sort, never sleeps) and a MutationObserver-backed **play log**, which is how a spec proves a voice did *not* sound |
| `support/lifecycle.ts` | MV3 lifecycle drivers (`evictServiceWorker`, `reacquireServiceWorker`, `isWorkerDead`, `triggerOffscreenShutdown`, `hasOffscreenDocument`, `getConnectedTabCount`) — see the section below |
| `support/lifecycle-targets.ts` | pure CDP-target predicates (`isExtensionServiceWorkerTarget`, `pickExtensionServiceWorkerTarget`); unit-tested in the **required** gate (`test/e2e/lifecycle-targets.spec.ts`) |
| `specs/*.e2e.ts`, `specs/*.visual.ts` | the tests — see [Specs](#specs) for the full inventory |

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

