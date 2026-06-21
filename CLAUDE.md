# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

- `npm run dev` - WXT dev server (Chrome/Edge MV3) with live reload (`predev` runs env validation + ONNX copy first)
- `npm run dev:firefox` - Firefox MV2 dev session (`wxt --browser firefox --mv2`; opens a temporary private profile)
- `npm run build` - Production build via `wxt build` (`prebuild` validates env + i18n and copies ONNX; WXT generates the manifest)
- `npm run build:firefox` - Build and package for Firefox
- `npm test` - Type-check + run all tests (`tsc --noEmit`, then Jest + Vitest)
- `npm run typecheck` - Type-check only (`tsc --noEmit`); needs the generated `.wxt/` dir (run `npm run dev`/`build` once, or `wxt prepare`, to create it)
- `npm run test:jest` - Run Jest tests only
- `npm run test:vitest` - Run Vitest tests only  
- `npm run test:vitest:watch` - Run Vitest in watch mode
- `npm run copy-onnx` - Copy ONNX model files from dependencies
- `npm run start` - Static file server (`node server.js`) for `public/` assets; not the WXT dev server (use `npm run dev`)
- `npm run validate:env` - Validate local `.env` files (runs automatically before dev/build)

### Environment Setup
- Requires Node.js >=22.0.0 and npm >=10.0.0
- Copy `.env.example` to `.env` for development and `.env.production.example` to `.env.production` for builds, updating values as needed
- Firefox builds require `jq` utility
- Extension uses ESM modules with TypeScript transpilation

## Architecture Overview

### Extension Type
This is a browser extension built with **WXT** that enhances voice interactions with AI chatbots (Pi.ai, Claude.ai, ChatGPT). It targets Chrome/Edge (Manifest V3) and Firefox (Manifest V2).

### Browser Compatibility

For detailed browser and feature compatibility across different chatbot sites, see [Browser Compatibility Matrix](doc/BROWSER_COMPATIBILITY.md).

**Quick Summary:**
- **TTS (Text-to-Speech)**: Requires Chrome/Edge desktop on CSP-restrictive sites (Claude.ai, ChatGPT). Works on all browsers with Pi.ai.
- **VAD/STT (Voice Input)**: Works on most modern browsers (with known Kiwi + Claude issues)
- **Full features**: Chrome/Edge desktop across all sites

**Common scenarios:**
- Firefox/Safari on Claude.ai → Voice input ✅, TTS ❌ (CSP blocks audio)
- Mobile browsers on Claude.ai → Voice input ✅, TTS ❌ (no offscreen API)
- Chrome/Edge desktop → Everything works ✅

### Key Components

#### Entry Points
WXT discovers entry points in **`entrypoints/`**; each is a thin shim that imports the real logic from `src/`.
- **entrypoints/saypi.content.ts → src/saypi.index.js** - Main content script that bootstraps the extension on chatbot sites
- **entrypoints/saypi-universal.content.ts** - Content script for universal dictation on all other sites
- **entrypoints/background.ts → src/svc/background.ts** - Service worker handling extension lifecycle, auth, and message routing
- **entrypoints/offscreen/ → src/offscreen/** - Single offscreen document for audio/VAD processing under strict CSP (Chrome/Edge only)
- **entrypoints/settings/** - Extension settings page UI: each tab is a Preact `*Panel.tsx` paired with an imperative controller (`index.ts`) that wires it by `id`; shared popup styles/helpers in `src/popup/`. See the **UI Component Layer** pattern below.

#### Core Systems

1. **Chatbot Abstraction** (`src/chatbots/`)
   - `ChatbotService` - Detects and manages different chatbot implementations
   - `Chatbot.ts` - Abstract base class for chatbot-specific DOM manipulation
   - `Claude.ts`, `Pi.ts` - Chatbot-specific implementations with DOM selectors and UI integration

2. **Audio Pipeline** (`src/audio/`)
   - `AudioModule.js` - Main audio coordination and state management (interprets the audio XState actors)
   - `OffscreenAudioBridge.js` - Communication bridge between content script and offscreen audio processing
   - **State machines** live in `src/state-machines/` (not `src/audio/`): `AudioInputMachine.ts`, `AudioOutputMachine.ts`, `AudioRetryMachine.ts`, plus `ConversationMachine.ts`, `DictationMachine.ts`, and others. These are **XState v5** — **read [src/state-machines/README.md](src/state-machines/README.md) before authoring/wiring/testing a machine** (the `createTestActor` test seam, `setup().createMachine()`, `assign`-not-mutate, object-only events).
   - **Dictation transcription**: Uses dual-phase approach (live streaming + refinement) - see [doc/DUAL_PHASE_TRANSCRIPTION.md](doc/DUAL_PHASE_TRANSCRIPTION.md)

3. **Voice Activity Detection** (`src/vad/`)
   - `OffscreenVADClient.ts` - Content script client for VAD communication
   - Uses @ricky0123/vad-web for real-time voice detection
   - Offscreen document handles VAD processing to bypass CSP restrictions

4. **Text-to-Speech** (`src/tts/`)
   - `TextToSpeechService.ts` - Core TTS management
   - `ChatHistoryManager.ts` (exports `ChatHistorySpeechManager`) - Manages TTS for chat messages
   - `VoiceMenuUIManager.ts` - Voice selection UI components

5. **DOM Management** (`src/dom/`)
   - `DOMObserver` (`src/chatbots/bootstrap.ts`) - Monitors DOM changes and decorates UI elements
   - `Observation.ts` - Pattern for tracking found/decorated DOM elements
   - Progressive search with backoff for dynamic content

6. **Authentication** 
   - `JwtManager.ts` - JWT token management with refresh logic
   - Background script handles auth cookie monitoring and status broadcasting
   - Firefox-specific authentication handling due to cookie access limitations

### Communication Architecture

1. **Background ↔ Content Script**
   - Direct messaging via `chrome.runtime.sendMessage()` for auth, quota, permissions
   - Port-based communication for VAD events via `OffscreenVADClient`

2. **Background ↔ Offscreen Documents**
   - `OffscreenManager` routes messages between content scripts and offscreen documents
   - Separate routing for VAD (port-based) vs audio (message-based) to prevent cross-contamination

3. **Content Script Architecture**
   - Event-driven via `EventBus` for internal coordination
   - State machines (XState) manage complex audio/UI flows
   - Modular system with dependency injection patterns

### Build System

- **WXT** (Vite/Rollup under the hood) builds the extension — there is **no Webpack**. `wxt build` produces the per-target output; `wxt --browser chrome` runs the dev server. Config: `wxt.config.ts`.
- **Entry points** are defined in `entrypoints/`; the **manifest is generated** by WXT from `wxt.config.ts`, with per-target permissions (Chrome adds `offscreen`/`audio`/`identity`; Firefox MV2 omits `offscreen`).
- **Environment values** are injected via WXT/`import.meta.env`, validated by `scripts/validate-env.js` (runs before dev/build).
- **Asset copying** for ONNX models and VAD WASM (`npm run copy-onnx`) lands in `public/` (WXT's static `publicDir`) and is copied verbatim.
- **Code splitting / minification** are handled by Vite/Rollup; minification keeps non-binary files under Firefox AMO's 5MB limit.

#### Build Output

`wxt build` emits to **`.output/<target>/`** (git-ignored) — e.g. `.output/chrome-mv3/` (MV3) and `.output/firefox-mv2/` (MV2). Each contains the generated `manifest.json`, `background.js`, `content-scripts/` (`saypi.js`, `saypi-universal.js`), hashed `chunks/`, and the HTML pages (`offscreen.html`, `settings.html`, `permissions.html`). Store-submission packaging (zipping the per-target `.output/` dir) is part of the founder-run release step.

> `public/` is the static-asset **source** dir (ONNX/WASM/icons), **not** build output. To inspect actual artifacts, run a build and list `.output/`. Never hand-edit `.output/`, `dist/`, `.wxt/`, or generated files in `public/`.

**Binary assets (not counted toward AMO's 5MB non-binary limit):**
- 4 WASM files - See [src/vad/README.md](src/vad/README.md) for why all 4 are required
- 3 ONNX models - Silero VAD models for speech detection

### Testing

- **Jest** for JavaScript modules and integration tests
- **Vitest** for TypeScript/ESM modules
- **JSDOM** test environment for DOM manipulation testing
- Mock implementations for Chrome extension APIs

#### Choosing a test layer (prove it at the lowest layer that can)

The testability net has four layers — reach for the cheapest one that can actually catch the bug:

- **Layer 0 — type-check** (`tsc --noEmit`, run first by `npm test` via the `typecheck` script). The whole TS surface (`src`, `entrypoints`, `test`, `scripts`, `wxt.config.ts`) must be error-free; a type regression fails the **required** gate before Jest/Vitest even run. CI generates the WXT-typed `.wxt/` (via `wxt prepare`) before type-checking — see `.github/workflows/test.yaml`.
- **Layers 1–2 — unit / contract** (`npm test`; Jest + Vitest, JSDOM). Pure logic, XState machines, and `src/chatbots/` adapter contract tests against recorded DOM fixtures. The **required** merge gate (type-check + both runners). Default for any change with extractable logic. Can't catch real-browser or cross-context behavior.
- **Layer 3 — headless E2E** (`npm run e2e:build && npm run test:e2e`; Playwright + real headless Chrome). Use when a change touches content-script **bootstrap/decoration**, the **offscreen ↔ service-worker ↔ VAD/STT** wiring, CSP, or anything needing a *real browser* but verifiable against a DOM you control. Fast, deterministic, **hermetic**, a **required** CI check, and it **can drive the mic** via fake audio. Can't: real-host DOM fidelity, real auth, real network. See **[e2e/README.md](e2e/README.md)**.
- **Layer 3.5 — agent-launched bundled-Chromium loop** (`npm run layer35:verify`; Playwright `launchPersistentContext`). ⚠️ **Cloudflare-fragile against real hosts — pi.ai/claude.ai/chatgpt.com ALL serve "Just a moment…" to headless bundled Chromium** (the earlier "pi.ai is Cloudflare-free" claim was wrong — only ever confirmed *headed*). Treat Layer 3.5 as hermetic-mock-grade; for real-host turns use **Layer 4 (CDP)** instead (real Chrome, headed — works for every host incl. pi.ai). See **[doc/layer35-real-host-loop.md](doc/layer35-real-host-loop.md)**.
- **Layer 4 — real-site spot-check** (`node scripts/dev-rig.mjs` + Claude-in-Chrome). Use when you need fidelity to the *actual* pi.ai/Claude/ChatGPT DOM (which drifts and is **not** an API contract) or to confirm a fix on the live host. On-demand, **not** CI; needs the founder's browser. Mic-gated and reload-gated paths now have DEV-only in-extension hooks (`saypi:dev-feed-speech`, `saypi:dev-reload`) so most turns are hands-off — incl. **Claude/ChatGPT** (real browser is already past Cloudflare; recipe in the dev-loop doc). Reach for it **after** Layer 3 is green, for real-host confirmation. See **[doc/autonomous-dev-loop.md](doc/autonomous-dev-loop.md)** (details below).
- **Layer 4 (CDP) — agent-launched real-host loop, HEADED** (`npm run layer4cdp:verify`). Spawns the founder's **real Chrome** directly + attaches over CDP, so it loads the extension AND passes Cloudflare for **pi.ai, claude.ai, and chatgpt.com** with no per-run founder/MCP — **verified working headed (2026-06-20)**. The robust real-host path (use it for pi.ai too). Headless is Cloudflare-blocked, so it's a visible window, not silent cron. One-time setup: `layer4cdp:seed <url>` (login) + enable Developer mode & Load unpacked in the dedicated profile; `layer4cdp:diagnose <url>` confirms usable. On-demand, **not** CI. See **[doc/layer4-cdp-real-host-loop.md](doc/layer4-cdp-real-host-loop.md)**.
- **E2E host sweep — periodic real-host defect hunt** (`npm run e2e-host-sweep`). A Layer-4 (CDP) sweep that drives a synthetic voice turn on **all three hosts** and captures rich evidence (every console message, network failures, per-host selector diagnostics, auth/voice state, screenshots) for a defect hunt — the thorough counterpart to `layer4cdp verify` (console-errors-only). Honors the analysis discipline (screenshot-corroborate findings, attribute to SayPi only, dedup vs open+closed issues, report a healthy host clean-with-evidence). Backs the `/e2e-host-sweep` skill. On-demand, **not** CI. See **[doc/e2e-host-sweep.md](doc/e2e-host-sweep.md)**.

Rule of thumb: if a controlled DOM can reproduce it, it belongs in Layer 3 (repeatable, in CI); reserve the real-host loops for what only the real host can show.

#### Driving a synthetic voice turn (no mic, any host) — START HERE for voice work

To exercise the voice path (VAD → STT → transcript) **without a microphone**, DEV
builds expose two page events. The full primitive:

```js
window.dispatchEvent(new CustomEvent("saypi:dev-feed-speech", { detail: { loop: true } })); // arm synthetic mic
document.querySelector("#saypi-callButton").click();                                          // start the call
// transcript lands in the composer: pi.ai → #saypi-prompt.value ; Claude/ChatGPT → contenteditable .textContent
window.dispatchEvent(new CustomEvent("saypi:dev-reload"));                                     // reload ext (no chrome://extensions)
```

Getting a page in front of those events: **hermetic/CI** → Layer 3 (copy
`e2e/specs/synthetic-audio-stt.e2e.ts`); **real host, one command** →
`node scripts/layer4cdp.mjs verify <url>` (claude.ai / chatgpt.com / pi.ai — does the
whole turn); **interactive** → fire the events via the Claude-in-Chrome `javascript_tool`.
**Real hosts require Layer 4 (CDP)'s headed real Chrome (Cloudflare blocks headless).**
**Full guide: [doc/synthetic-voice-turn.md](doc/synthetic-voice-turn.md).**

#### Real-site verification (Layer 4 dev-verify loop)

To verify a change in a real browser against the live hosts (pi.ai/Claude/ChatGPT),
use the autonomous dev-verify loop instead of a manual build: start the rig with
`node scripts/dev-rig.mjs` (one owned `wxt dev` on `:3001` that hot-reloads a
manually-loaded dev extension), then iterate edit → tab-reload-via-MCP → assert.
**See [doc/autonomous-dev-loop.md](doc/autonomous-dev-loop.md)** for the autonomy
model (per-edit hands-off; the founder reloads the extension once per session after
a rig (re)start — the agent can't reach `chrome://extensions`) and the full routine.

#### Test-Driven Development (TDD) Requirements

**Fail-First TDD Protocol (MANDATORY for bug fixes)**
When fixing bugs, follow this strict protocol:

1. **Reproduce**: Add a failing test that captures the incorrect behavior
2. **Prove failure**: Run the test and confirm it fails for the expected reason
3. **Implement**: Apply the smallest, safest change that satisfies the test
4. **Verify**: Ensure the new test passes and related tests still pass
5. **Document**: Update relevant docs and include rationale in PR description

**Writing Tests**
- **Mock External APIs**: Use Jest/Vitest mocks for Chrome extension APIs
- **Async Tests**: Use `async/await` for async test functions
- **Test Isolation**: Each test should be independent
- **Fixtures**: Use setup/teardown for common test configuration
- **Fail-First**: Write the test BEFORE the fix to capture the bug

**Test Commands**
```bash
npm test                    # Run all tests (Jest + Vitest)
npm run test:jest          # Run Jest tests only
npm run test:vitest        # Run Vitest tests only
npm run test:vitest:watch  # Run Vitest in watch mode
```

**Extension-Specific Testing Considerations**
- Mock Web Audio API for audio input/output testing
- Test VAD (Voice Activity Detection) with mock audio streams
- Use JSDOM for DOM querying and chatbot integration testing
- Test XState state machine transitions and state persistence
- Verify cross-browser compatibility (Firefox vs Chrome, MV2 vs MV3)

### Key Patterns

1. **Singleton Services** - Many core services use getInstance() pattern
2. **Observer Pattern** - DOM observation with decoration tracking
3. **State Machines** - XState **v5** for complex UI/audio flows; conventions + the `createTestActor` test seam are in [src/state-machines/README.md](src/state-machines/README.md)
4. **Progressive Enhancement** - Graceful degradation when features unavailable
5. **Cross-browser Compatibility** - Firefox/Chrome-specific handling where needed
6. **UI Component Layer (Preact)** - SayPi-owned UI (settings tabs/header, notices, auth prompts) is built as **light-DOM Preact `.tsx`** components mounted via the `src/ui/preact/mount.ts` registry (`mountInto`/`unmountFrom`). Host-injected widgets (call button, voice menus) stay imperative — extract pure logic into testable modules instead of rewriting (e.g. `src/buttons/callButtonGeometry.ts`). **Read [doc/preact-component-conventions.md](doc/preact-component-conventions.md) before touching any UI** — it carries the render-vs-registry rule, the host-specific Tailwind rule, and the add-a-tab / add-a-notice recipes.

### Development Notes

- Extension supports both Pi.ai and Claude.ai with chatbot-specific implementations
- Offscreen documents required for audio processing due to host page CSP restrictions
- Authentication system handles both direct JWT tokens and cookie-based fallback
- Progressive search patterns handle dynamic content loading in modern SPAs
- **Concurrent agents:** this repo is maintained autonomously by multiple Claude sessions at once. Isolate every change in its own git worktree under the gitignored `.worktrees/` directory (not the shared `main` checkout, not an out-of-repo location), and never touch another agent's worktree or branch. The canonical rule lives in `AGENTS.md` (Hard guardrails).
