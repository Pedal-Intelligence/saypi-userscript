# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

- `npm run dev` - WXT dev server with live reload for Chromium targets (runs manifest update first)
- `npm run dev:firefox` - Firefox MV2 dev session (`wxt --browser firefox --mv2`; opens a temporary private profile)
- `npm run build` - Production build (validates locale files, copies ONNX files, updates manifest)
- `npm run build:firefox` - Build and package for Firefox
- `npm test` - Run all tests (Jest + Vitest)
- `npm run test:jest` - Run Jest tests only
- `npm run test:vitest` - Run Vitest tests only  
- `npm run test:vitest:watch` - Run Vitest in watch mode
- `npm run copy-onnx` - Copy ONNX model files from dependencies
- `npm run start` - Start development server
- `npm run validate:env` - Validate local `.env` files (runs automatically before dev/build)

### Environment Setup
- Requires Node.js >=22.0.0 and npm >=10.0.0
- Copy `.env.example` to `.env` for development and `.env.production.example` to `.env.production` for builds, updating values as needed
- Firefox builds require `jq` utility
- Extension uses ESM modules with TypeScript transpilation

## Architecture Overview

### Extension Type
This is a Chrome/Firefox extension (manifest v3) that enhances voice interactions with AI chatbots (Pi.ai and Claude.ai).

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
- **src/saypi.index.js** - Main content script entry point that bootstraps the extension
- **src/svc/background.ts** - Service worker handling extension lifecycle, auth, and message routing
- **src/offscreen/** - Offscreen documents for audio processing under strict CSP

#### Core Systems

1. **Chatbot Abstraction** (`src/chatbots/`)
   - `ChatbotService` - Detects and manages different chatbot implementations
   - `Chatbot.ts` - Abstract base class for chatbot-specific DOM manipulation
   - `Claude.ts`, `Pi.ts` - Chatbot-specific implementations with DOM selectors and UI integration

2. **Audio Pipeline** (`src/audio/`)
   - `AudioModule.js` - Main audio coordination and state management
   - `OffscreenAudioBridge.js` - Communication bridge between content script and offscreen audio processing
   - `AudioInputMachine.ts`, `AudioOutputMachine.ts` - State machines for audio input/output flow

3. **Voice Activity Detection** (`src/vad/`)
   - `OffscreenVADClient.ts` - Content script client for VAD communication
   - Uses @ricky0123/vad-web for real-time voice detection
   - Offscreen document handles VAD processing to bypass CSP restrictions

4. **Text-to-Speech** (`src/tts/`)
   - `TextToSpeechService.ts` - Core TTS management
   - `ChatHistoryManager.ts` - Manages TTS for chat messages
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

- **Webpack** bundles TypeScript/JavaScript with multiple entry points
- **Environment-specific configs** injected via webpack DefinePlugin
- **Asset copying** for ONNX models, WASM files, and extension resources
- **Minification enabled** in production builds to meet Firefox AMO 5MB file limit
- **Code splitting** separates vendor libraries and enables on-demand loading

#### Build Output

The webpack build produces the following files in `/public`:

**Core bundles (8 files):**
- `saypi.user.js` (450KB) - Main content script entry point
- `background.js` (45KB) - Service worker
- `common.bundle.js` (63KB) - Shared code across entry points
- `vendor-onnx.bundle.js` (534KB) - ONNX runtime for ML inference
- `vendor-xstate.bundle.js` (63KB) - XState state machine library
- `vendor-vad.bundle.js` (18KB) - Voice Activity Detection library
- `vendor-rxjs.bundle.js` (10KB) - RxJS reactive programming
- `vendors.bundle.js` (29KB) - Other vendor libraries

**Dynamic chunks (loaded on-demand):**
- `793.js` (131KB) - AIChatModule (loads for Pi.ai, Claude.ai, ChatGPT)
- `239.js` (33KB) - Supporting modules
- `208.js`, `301.js`, `411.js`, `763.js` (126B each) - Tiny async chunks

**Other resources:**
- `lucide.min.js` (362KB) - Icon library for popup UI
- `vad.worklet.bundle.min.js` (2.6KB) - Audio worklet processor
- Offscreen scripts: `audio_handler.js`, `media_coordinator.js`, `media_offscreen.js`, `vad_handler.js`

**Binary assets (not counted toward AMO 5MB limit):**
- 4 WASM files (37MB total) - See [src/vad/README.md](src/vad/README.md) for why all 4 are required
- 3 ONNX models (5MB total) - Silero VAD models for speech detection

**Total package:** ~50MB (JavaScript: 1.8MB, well under Firefox AMO's 5MB non-binary file limit)

### Testing

- **Jest** for JavaScript modules and integration tests
- **Vitest** for TypeScript/ESM modules
- **JSDOM** test environment for DOM manipulation testing
- Mock implementations for Chrome extension APIs

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
