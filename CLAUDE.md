# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

`jq .scripts package.json` lists every script. These are the ones with non-obvious behaviour:

- `npm run dev` - WXT dev server (Chrome/Edge MV3) with live reload (`predev` runs env validation + ONNX copy first)
- `npm run dev:firefox` - Firefox MV2 dev session (`wxt --browser firefox --mv2`; opens a temporary private profile)
- `npm run build` - Production build via `wxt build` (`prebuild` validates env + i18n and copies ONNX; WXT generates the manifest)
- `npm test` - Type-check + run all tests (`tsc --noEmit`, then Jest + Vitest)
- `npm run typecheck` - Type-check only (`tsc --noEmit`); needs the generated `.wxt/` dir (run `npm run dev`/`build` once, or `wxt prepare`, to create it)
- `npm run start` - Static file server (`node server.js`) for `public/` assets; not the WXT dev server (use `npm run dev`)

### Environment Setup
- Copy `.env.example` to `.env` for development and `.env.production.example` to `.env.production` for builds, updating values as needed
- Firefox builds require `jq` utility

## Architecture Overview

### Extension Type
This is a browser extension built with **WXT** that enhances voice interactions with AI chatbots (Pi.ai, Claude.ai, ChatGPT). It targets Chrome/Edge (Manifest V3) and Firefox (Manifest V2).

### Browser Compatibility

For browser and feature compatibility across the chatbot sites — including which combinations lose TTS to CSP or a missing offscreen API — see [Browser Compatibility Matrix](doc/BROWSER_COMPATIBILITY.md).

### Key Components

#### Entry Points
WXT discovers entry points in **`entrypoints/`**; each is a thin shim that imports the real logic from `src/`.
- **entrypoints/saypi.content.ts → src/saypi.index.js** - Main content script that bootstraps the extension on chatbot sites
- **entrypoints/saypi-universal.content.ts** - Content script for universal dictation on all other sites
- **entrypoints/background.ts → src/svc/background.ts** - Service worker handling extension lifecycle, auth, and message routing
- **entrypoints/offscreen/ → src/offscreen/** - Single offscreen document for audio/VAD processing under strict CSP (Chrome/Edge only)
- **entrypoints/settings/** - Extension settings page UI: each tab is a Preact `*Panel.tsx` paired with an imperative controller (`index.ts`) that wires it by `id`; shared popup styles/helpers in `src/popup/`. See the **UI Component Layer** pattern below.

#### Core Systems — the non-obvious parts

The layout is discoverable (`src/chatbots/`, `src/audio/`, `src/vad/`, `src/tts/`, `src/dom/`). These are the things `ls` won't tell you:

- **State machines** live in `src/state-machines/` (**not** `src/audio/`): `AudioInputMachine.ts`, `AudioOutputMachine.ts`, `AudioRetryMachine.ts`, plus `ConversationMachine.ts`, `DictationMachine.ts`, and others. These are **XState v5** — **read [src/state-machines/README.md](src/state-machines/README.md) before authoring/wiring/testing a machine** (the `createTestActor` test seam, `setup().createMachine()`, `assign`-not-mutate, object-only events).
- **`ChatHistoryManager.ts` exports `ChatHistorySpeechManager`** — filename and class name don't match.
- **`DOMObserver` lives in `src/chatbots/bootstrap.ts`**, not `src/dom/`. It uses progressive search with backoff, because host SPAs load content late.
- **Dictation transcription** uses a dual-phase approach (live streaming + refinement) — see [doc/DUAL_PHASE_TRANSCRIPTION.md](doc/DUAL_PHASE_TRANSCRIPTION.md).
- **Offscreen documents exist to bypass the host page's CSP** — that is the entire reason for `src/offscreen/` and `OffscreenAudioBridge.js`, and why audio/VAD are Chrome/Edge-only.
- **Auth** handles both direct JWT tokens (`JwtManager.ts`, with refresh) and a cookie-based fallback; the background script monitors auth cookies and broadcasts status. Firefox needs its own path because it can't access those cookies the same way.
- **Messaging**: `OffscreenManager` routes VAD events **port-based** and audio **message-based**, deliberately separated to prevent cross-contamination.

### Build System

- **WXT** (Vite/Rollup under the hood) builds the extension — there is **no Webpack**. `wxt build` produces the per-target output; `wxt --browser chrome` runs the dev server. Config: `wxt.config.ts`.
- **Entry points** are defined in `entrypoints/`; the **manifest is generated** by WXT from `wxt.config.ts`, with per-target permissions (Chrome adds `offscreen`/`audio`/`identity`; Firefox MV2 omits `offscreen`).
- **Code splitting / minification** are handled by Vite/Rollup; minification keeps non-binary files under Firefox AMO's 5MB limit.

#### Build Output

`wxt build` emits to **`.output/<target>/`** (git-ignored) — e.g. `.output/chrome-mv3/` (MV3) and `.output/firefox-mv2/` (MV2). Store-submission packaging + the whole founder-run release flow is the **release runbook** — see **Releasing** below.

#### Releasing / publishing to the web stores

**To cut, ship, or publish a release (Chrome Web Store, Edge Add-ons, Firefox AMO): START at [doc/release/README.md](doc/release/README.md)** — the `release-extension` runbook backed by `scripts/release.mjs` (npm `release:*` aliases). It is **founder-gated**: autonomously, agents run only the read-only steps (`plan`/`packet`) and draft copy. When the founder directs a release in-session, the settled split (v1.13.0/v1.14.0) is that the **founder runs only `release:build`** (the one step that loads `.env.production`) and the agent runs the rest, with a separate go-ahead for `tag`/`finalize` — details and the agent-session gotchas are in the runbook. Per `AGENTS.md`, **never load `.env.production`** and never submit without explicit founder authorization.

> `public/` is the static-asset **source** dir (ONNX/WASM/icons), **not** build output. To inspect actual artifacts, run a build and list `.output/`. Never hand-edit `.output/`, `dist/`, `.wxt/`, or generated files in `public/`.

**Binary assets (not counted toward AMO's 5MB non-binary limit):**
- 4 WASM files - See [src/vad/README.md](src/vad/README.md) for why all 4 are required
- 3 ONNX models - Silero VAD models for speech detection

### Testing

#### Choosing a test layer (prove it at the lowest layer that can)

Reach for the cheapest layer that can actually catch the bug:

- **Layer 0 — type-check** (`tsc --noEmit`, run first by `npm test` via the `typecheck` script). The whole TS surface (`src`, `entrypoints`, `test`, `scripts`, `wxt.config.ts`) must be error-free; a type regression fails the **required** gate before Jest/Vitest even run. CI generates the WXT-typed `.wxt/` (via `wxt prepare`) before type-checking — see `.github/workflows/test.yaml`.
- **Layers 1–2 — unit / contract** (`npm test`; Jest + Vitest, JSDOM). Pure logic, XState machines, and `src/chatbots/` adapter contract tests against recorded DOM fixtures. The **required** merge gate (type-check + both runners). Default for any change with extractable logic. Can't catch real-browser or cross-context behavior.
- **Layer 3 — headless E2E** (`npm run e2e:build && npm run test:e2e`; Playwright + real headless Chrome). Use when a change touches content-script **bootstrap/decoration**, the **offscreen ↔ service-worker ↔ VAD/STT** wiring, CSP, or anything needing a *real browser* but verifiable against a DOM you control. Fast, deterministic, **hermetic**, a **required** CI check, and it **can drive the mic** via fake audio. Can't: real-host DOM fidelity, real auth, real network. See **[e2e/README.md](e2e/README.md)**.
- **Real-host layers — 3.5, 4, Layer 4 (CDP), and the sweeps.** On-demand, **never** CI, each with its own Cloudflare and headed-browser constraints. **Invoke the `choose-test-layer` skill** before reaching for one — it carries which layer actually works per host, the synthetic-voice-turn recipe, and the sweep harnesses.

Rule of thumb: if a controlled DOM can reproduce it, it belongs in Layer 3 (repeatable, in CI); reserve the real-host loops for what only the real host can show.

**How much care does the change deserve?** The test layer tells you *how to prove* a change; **[doc/codebase-caution-map.md](doc/codebase-caution-map.md)** tells you *how much reasoning effort, review depth, and real-host verification to spend* on it. It maps where a subtly-wrong edit is **quiet-and-costly** — passes `tsc` and the tests but breaks a real host, one browser, auth, billing/speech-cache hashing, i18n keys, or a shipped release — and carries a "looks-mechanical-is-a-trap" catalog plus the highest-leverage refactor candidates. Read it before a change in the reserve zone (host-DOM, cross-context, auth, manifest/release, i18n-key, hashed/billed text).

#### Test-Driven Development (TDD) Requirements

**Fail-First TDD Protocol (MANDATORY for bug fixes)**
When fixing bugs, follow this strict protocol:

1. **Reproduce**: Add a failing test that captures the incorrect behavior
2. **Prove failure**: Run the test and confirm it fails for the expected reason
3. **Implement**: Apply the smallest, safest change that satisfies the test
4. **Verify**: Ensure the new test passes and related tests still pass
5. **Document**: Update relevant docs and include rationale in PR description

### Key Patterns

1. **State Machines** - XState **v5** for complex UI/audio flows; conventions + the `createTestActor` test seam are in [src/state-machines/README.md](src/state-machines/README.md)
2. **UI Component Layer (Preact)** - SayPi-owned UI (settings tabs/header, notices, auth prompts) is built as **light-DOM Preact `.tsx`** components mounted via the `src/ui/preact/mount.ts` registry (`mountInto`/`unmountFrom`). Host-injected widgets (call button, voice menus) stay imperative — extract pure logic into testable modules instead of rewriting (e.g. `src/buttons/callButtonGeometry.ts`). **Read [doc/preact-component-conventions.md](doc/preact-component-conventions.md) before touching any UI** — it carries the render-vs-registry rule, the host-specific Tailwind rule, and the add-a-tab / add-a-notice recipes.

### Development Notes

- **Concurrent agents:** this repo is maintained autonomously by multiple Claude sessions at once. Isolate every change in its own git worktree under the gitignored `.worktrees/` directory (not the shared `main` checkout, not an out-of-repo location), and never touch another agent's worktree or branch. The canonical rule lives in `AGENTS.md` (Hard guardrails).
