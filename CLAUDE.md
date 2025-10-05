# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

- `npm run dev` - Development build with watch mode (runs manifest update first)
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
- **No minification** to maintain code readability for extension store review

### Testing

- **Jest** for JavaScript modules and integration tests
- **Vitest** for TypeScript/ESM modules
- **JSDOM** test environment for DOM manipulation testing
- Mock implementations for Chrome extension APIs

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
