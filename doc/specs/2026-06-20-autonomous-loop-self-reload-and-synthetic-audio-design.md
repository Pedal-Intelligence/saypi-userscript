# Removing the two human-in-the-loop bottlenecks from the Layer 4 dev-verify loop

**Status:** Design approved (2026-06-20), pending spec review.
**Author:** autonomous engineering loop (with founder direction).
**Related:** `doc/autonomous-dev-loop.md` (Layer 4), `e2e/README.md` (Layer 3),
`doc/specs/2026-06-13-autonomous-dev-loop-layer4-design.md`,
`doc/specs/2026-06-14-layer3-headless-e2e-design.md`.

## Problem

The Layer 4 dev-verify loop lets the agent verify extension changes against the
*real* chat hosts (pi.ai, Claude, ChatGPT), but two steps still require a human:

1. **Extension reload.** Some changes (e.g. `wxt.config.ts`, or a slept MV3
   service worker that lost its hot-reload socket) need the founder to click
   reload on the unpacked card at `chrome://extensions`. The agent cannot reach
   that page: the MCP `navigate` tool forces an `https://` prefix, and the
   `computer` tool only sees the page viewport, never browser chrome.
2. **Voice input.** Any path that needs *speaking* during a call (VAD → STT) has
   no audio: the founder's running Chrome was not launched with fake-audio flags,
   and the offscreen document that opens the mic is unreachable from the MCP.

Both bottlenecks share a root cause: **Layer 4 borrows the founder's
already-running Chrome through the Claude-in-Chrome MCP.** The agent therefore
cannot choose the browser's launch flags and cannot reach browser-level UI.

Layer 3 (headless Playwright) already escaped both — it launches the extension
with `--load-extension` (self-reloadable, no `chrome://extensions`) and feeds a
fake mic with `--use-file-for-fake-audio-capture` — but only against *local mock*
hosts, so it cannot verify against the real host DOM, real auth, or real network.

## Goals

- Let the agent reload the extension without the founder, for the common cases.
- Let the agent drive a full voice turn (speech → VAD → STT → prompt) without a
  human speaking, in the real authenticated browser.
- Provide a fully agent-driven, real-host verify loop that needs no founder per
  run (after a one-time setup) and no Claude-in-Chrome MCP.
- Keep all of it dead-code-eliminated from production builds.

## Non-goals

- Replacing the founder's occasional real-host spot-check entirely. Some
  fidelity (real `getUserMedia`, real device-permission prompts, truly wedged
  service workers) still benefits from a human now and then; we shrink the need,
  we do not claim to delete it.
- Making the real-host loop a *required* CI gate. Real hosts are flaky and
  rate-limited; Layer 3.5 stays an on-demand, agent-runnable spot-check.
- Changing production runtime behavior. Every hook here is `import.meta.env.DEV`.

## Shared principle: dev-only hooks, prod-stripped

All new code paths are gated behind `import.meta.env.DEV`, mirroring the existing
`__saypiOffscreenTestHooks` (`src/svc/background.ts:156`) and the build-stamp
(`src/saypi.index.js:37`). A production build contains none of it. This is the
same discipline that already lets Layer 3 drive the MV3 lifecycle deterministically.

---

## Unit 1 — In-extension synthetic audio source

**Solves:** "a human must speak into the mic," in the *real authenticated* browser.

### Mechanism

The VAD library is created at `src/offscreen/vad_handler.ts:264` via
`MicVAD.new(mergedOptions)`. The `@ricky0123/vad-web` (v0.0.24) options type is a
union: `RealTimeVADOptionsWithStream` accepts `stream: MediaStream`, and when a
`stream` is supplied the library uses it **instead of** calling `getUserMedia`
(`node_modules/@ricky0123/vad-web/dist/real-time-vad.d.ts`). That is the clean,
library-supported injection point — no monkey-patching.

When the synthetic source is armed (DEV only):

1. The offscreen document fetches a bundled WAV (reuse the deterministic clip
   `e2e/fixtures/audio/speech-16k-mono.wav`; see its README for why it must be
   real 16 kHz mono speech — Silero-v5 will not fire on a tone).
2. `AudioContext.decodeAudioData` → `AudioBufferSourceNode` →
   `MediaStreamAudioDestinationNode`. The destination's `.stream` is a real
   `MediaStream` carrying the clip's audio.
3. `initializeVAD` passes that stream as `mergedOptions.stream`, so
   `MicVAD.new({ ..., stream })` consumes it. VAD → `onSpeechEnd` → STT POST →
   draft-into-prompt all run unchanged.

The `AudioBufferSourceNode` can loop (continuous VAD session) or play once
(single turn); the arming call selects which.

### Arming it

Add a DEV-only method to the offscreen test-hooks surface, e.g.
`__saypiOffscreenTestHooks.feedSyntheticSpeech({ clip?, loop? })`, reachable the
same way the #308 net reaches `closeOffscreenDocument()` — through the service
worker. From the Layer 4 MCP loop the agent triggers it via the content script
(see Unit 2's main-world↔isolated-world bridge, reused here). From Layer 3.5 the
Playwright harness calls it directly on the service worker.

State sequencing: arming must take effect for the *next* `initializeVAD`, so the
hook sets a module-level "use synthetic stream" latch (and an optional clip id)
that `initializeVAD` reads. If a VAD instance already exists it is destroyed and
re-created so the synthetic stream takes hold.

### Fidelity boundary (documented, not hidden)

This bypasses the real `getUserMedia` call and the device-permission path. Those
rarely change, and they remain covered by: (a) Layer 3's flag-based path, which
uses the *real* `getUserMedia` against Chrome's fake device, and (b) occasional
founder spot-checks. Everything downstream of the stream — resampling, the Silero
worklet, endpointing, STT upload, draft insertion — is exercised faithfully.

### Tests (TDD)

- **Layer 1/2 (required gate):** unit-test the synthetic-source factory — given a
  decoded `AudioBuffer`, it returns a live `MediaStream` with one audio track;
  the latch makes `initializeVAD` choose the synthetic stream over the mic path
  (mock `MicVAD.new`, assert it received a `stream`). Assert the DEV gate: with
  `import.meta.env.DEV` false the hook is absent.
- **Layer 3 (advisory):** a new spec that arms the synthetic source via the
  service-worker hook (rather than the launch-flag WAV) and asserts the same
  end-to-end outcome as `dictation-stt.e2e.ts` — proving the in-extension source
  drives the full pipeline in a real browser.

---

## Unit 2 — In-extension dev self-reload hook

**Solves:** "a human must reload from `chrome://extensions`," for the common cases.

### Mechanism

`chrome.runtime.reload()` re-reads an unpacked extension from disk — Chrome
treats an unpacked reload as an update, firing `onInstalled` with reason
`update`. So the extension can reload *itself* and pick up on-disk changes. The
agent cannot call it directly: the MCP `javascript_tool` runs in the page **main
world**, which has no `chrome.runtime`. We bridge worlds:

1. A DEV-only listener in the content script (isolated world) for
   `window.addEventListener('saypi:dev-reload', ...)`. Main world and isolated
   world share the same DOM `EventTarget`, so a `CustomEvent` dispatched from the
   page is heard by the content script.
2. On the event, the content script calls
   `chrome.runtime.sendMessage({ type: '__saypi_dev_reload' })`. Sending a
   message **wakes a slept service worker.**
3. A DEV-only handler in the SW calls `chrome.runtime.reload()`.

The agent fires it from the MCP: `javascript_tool` →
`window.dispatchEvent(new CustomEvent('saypi:dev-reload'))`, then waits for the
content script to re-stamp `<html data-saypi-build>` and reloads the test tab.

### Honest boundary

This recovers: config-only changes (`wxt.config.ts`), routine "just reload it"
needs, and a *slept* SW that a message wakes. It does **not** guarantee recovery
of a truly *wedged* SW that will not wake, or a reload that fails for other
reasons. The founder fallback (one click on the unpacked card) stays documented
and intact — it just becomes rare rather than per-session. The hook reports
success/failure back over the message channel so the agent can fall back loudly
instead of silently assuming a stale build (cross-check remains
`<html data-saypi-build>` vs `git rev-parse --short HEAD`).

### Tests (TDD)

- **Layer 1/2 (required gate):** unit-test the message handler calls
  `chrome.runtime.reload()` (mock `chrome.runtime`); unit-test the content-script
  bridge relays the DOM event to `sendMessage`; assert both are absent when
  `import.meta.env.DEV` is false.
- **Layer 3 (advisory):** drive the self-reload against the bundled dev build and
  assert the extension re-initializes (e.g. the content script re-decorates the
  page / re-stamps the build). Note: Layer 3.5 mostly removes the *need* for this
  (Playwright relaunches the context itself), so this hook's primary consumer is
  the Layer 4 MCP loop.

---

## Unit 3 — Layer 3.5: agent-launched real-host loop

**Solves:** both bottlenecks, with zero founder per-run involvement, at real-host
fidelity — an autonomous real-host spot-check the agent runs unattended.

### Mechanism

A new Playwright launch mode that reuses the Layer 3 plumbing
(`e2e/fixtures/launch-args.ts`, `e2e/fixtures/extension.ts`) with these deltas:

- **Real DNS.** Drop `--host-resolver-rules` (no mock redirect). The browser
  talks to the real pi.ai / Claude / ChatGPT and the real saypi-api.
- **No mock servers.** `global-setup` skips `startMockServers()` in this mode.
- **`--load-extension`** unchanged — the agent reloads by relaunching the
  context (or via Unit 2's hook), never touching `chrome://extensions`.
- **Mic** supplied by **Unit 1's synthetic source** (one mic mechanism across all
  layers), armed on the service worker after launch. Chrome's
  `--use-file-for-fake-audio-capture` remains a fallback.
- **Real auth** via a **founder-seeded persistent profile** (below).

This is structurally Layer 3's launcher pointed at the real internet with real
credentials. It is the agent's own browser (not the founder's, not the MCP), so
the agent has full control: launch flags, reloads, relaunch, fake audio.

### Auth: founder-seeded persistent profile

`chromium.launchPersistentContext(userDataDir, ...)` against a profile directory
that lives **outside the repo and is git-ignored** (e.g.
`~/.config/saypi-e2e-profile/`, path overridable by env var). One-time setup: the
founder launches that profile once and logs into the target host(s); the agent
reuses the stored session across runs. This mirrors the Layer 4 autonomy win
("one founder action per session" → "one founder action, ever") and is the
recommended choice over cookie/`storageState` injection, which is more fragile
across token rotation. Setup is documented; if the stored session expires, the
loop fails loudly with a "re-seed the profile" message rather than silently
running unauthenticated.

### Boundaries (kept)

- **Advisory, not required CI.** Real hosts are flaky and rate-limited; a red run
  may be the host, not us. Promotion to a required gate would need founder
  sign-off and a stable streak — same bar as Layer 3.
- **Real-host DOM drifts.** This loop is for confirming behavior against the live
  host, not a frozen contract. Fixtures captured here still feed Layers 2/3.
- **Secrets.** The profile dir may contain real session cookies — it stays out of
  the repo and out of any artifact upload.

### Tests / verification

Layer 3.5 *is* a verification harness, so "tests" here means: it can launch,
load the extension, reach an authenticated real-host page, arm synthetic speech,
and observe a completed voice turn (draft text in the prompt) — run on demand.
The pure launch-arg builder delta (real-DNS mode) gets unit coverage in the
required gate, like the existing `launch-args` unit tests.

---

## Sequencing

Two sub-projects, each with its own plan → implement cycle:

1. **Sub-project A — in-extension hooks (Units 1 + 2).** Small, in-repo, fully
   TDD-able at Layers 1–3, and it upgrades the *current* MCP Layer 4 loop
   immediately. Unit 1 is the higher-value half (the mic bottleneck is the harder
   one to solve any other way). **Lands first.**
2. **Sub-project B — Layer 3.5 (Unit 3).** Builds on Unit 1's synthetic source,
   is larger, and carries the persistent-profile/auth work. **Lands second.**

This spec covers the whole system so the units are designed to compose (Unit 1 is
shared infrastructure); implementation proceeds A then B.

## Risks & mitigations

| Risk | Mitigation |
| --- | --- |
| `MicVAD.new({ stream })` behaves differently from the mic path | Layer 3 spec asserts identical end-to-end outcome; fall back to overriding `getUserMedia` in the offscreen doc (we own it) if the `stream` option regresses. |
| Self-reload can't recover a wedged SW | Documented as best-effort; founder one-click fallback retained; hook reports failure so the agent doesn't trust a stale build. |
| `chrome.runtime.reload()` doesn't pick up changes / disrupts content scripts | Verified behavior (unpacked reload = update); agent always re-checks `data-saypi-build` vs HEAD after reload. |
| Real-host auth session expires | Loud "re-seed the profile" failure; profile dir documented and git-ignored. |
| DEV hooks leak into production | `import.meta.env.DEV` gate with a unit test asserting absence in prod builds, per existing pattern. |

## Open questions (resolved during brainstorming)

- Deliverable: spec **then implement** (A first).
- Direction: **both** in-extension hooks and Layer 3.5.
- Auth: **founder-seeded persistent profile.**
- Spec location: `doc/specs/`.
