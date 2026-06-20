# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

- `npm run dev` - WXT dev server (Chrome/Edge MV3) with live reload (`predev` runs env validation + ONNX copy first)
- `npm run dev:firefox` - Firefox MV2 dev session (`wxt --browser firefox --mv2`; opens a temporary private profile)
- `npm run build` - Production build via `wxt build` (`prebuild` validates env + i18n and copies ONNX; WXT generates the manifest)
- `npm run build:firefox` - Build and package for Firefox
- `npm test` - Run all tests (Jest + Vitest)
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
- **entrypoints/settings/** - Extension settings page UI (shared styles/helpers in `src/popup/`)

#### Core Systems

1. **Chatbot Abstraction** (`src/chatbots/`)
   - `ChatbotService` - Detects and manages different chatbot implementations
   - `Chatbot.ts` - Abstract base class for chatbot-specific DOM manipulation
   - `Claude.ts`, `Pi.ts` - Chatbot-specific implementations with DOM selectors and UI integration

2. **Audio Pipeline** (`src/audio/`)
   - `AudioModule.js` - Main audio coordination and state management (interprets the audio XState actors)
   - `OffscreenAudioBridge.js` - Communication bridge between content script and offscreen audio processing
   - **State machines** live in `src/state-machines/` (not `src/audio/`): `AudioInputMachine.ts`, `AudioOutputMachine.ts`, `AudioRetryMachine.ts`, plus `ConversationMachine.ts`, `DictationMachine.ts`, and others
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

- **Layers 1–2 — unit / contract** (`npm test`; Jest + Vitest, JSDOM). Pure logic, XState machines, and `src/chatbots/` adapter contract tests against recorded DOM fixtures. The **required** merge gate. Default for any change with extractable logic. Can't catch real-browser or cross-context behavior.
- **Layer 3 — headless E2E** (`npm run e2e:build && npm run test:e2e`; Playwright + real headless Chrome). Use when a change touches content-script **bootstrap/decoration**, the **offscreen ↔ service-worker ↔ VAD/STT** wiring, CSP, or anything needing a *real browser* but verifiable against a DOM you control. Fast, deterministic, **hermetic**, a **required** CI check, and it **can drive the mic** via fake audio. Can't: real-host DOM fidelity, real auth, real network. See **[e2e/README.md](e2e/README.md)**.
- **Layer 3.5 — agent-launched real-host loop** (`npm run layer35:verify`; Playwright `launchPersistentContext` against the *real* hosts). Use to confirm a change against live pi.ai/Claude/ChatGPT **without the founder** — the agent owns the browser, so it self-reloads by relaunch and feeds the in-extension synthetic mic. Needs a one-time founder login (`npm run layer35:seed`) into a git-ignored persistent profile. On-demand, **not** CI (hits the real internet). See **[doc/layer35-real-host-loop.md](doc/layer35-real-host-loop.md)**.
- **Layer 4 — real-site spot-check** (`node scripts/dev-rig.mjs` + Claude-in-Chrome). Use when you need fidelity to the *actual* pi.ai/Claude/ChatGPT DOM (which drifts and is **not** an API contract) or to confirm a fix on the live host. On-demand, **not** CI; needs the founder's browser. Mic-gated and reload-gated paths now have DEV-only in-extension hooks (`saypi:dev-feed-speech`, `saypi:dev-reload`) so most turns are hands-off. Reach for it **after** Layer 3 is green, for real-host confirmation. See **[doc/autonomous-dev-loop.md](doc/autonomous-dev-loop.md)** (details below).

Rule of thumb: if a controlled DOM can reproduce it, it belongs in Layer 3 (repeatable, in CI); reserve Layer 4 for what only the real host can show.

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
3. **State Machines** - XState for managing complex UI/audio flows
4. **Progressive Enhancement** - Graceful degradation when features unavailable
5. **Cross-browser Compatibility** - Firefox/Chrome-specific handling where needed

### Development Notes

- Extension supports both Pi.ai and Claude.ai with chatbot-specific implementations
- Offscreen documents required for audio processing due to host page CSP restrictions
- Authentication system handles both direct JWT tokens and cookie-based fallback
- Progressive search patterns handle dynamic content loading in modern SPAs
