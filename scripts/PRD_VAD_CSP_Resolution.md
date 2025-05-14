# PRD: Resolve VAD Initialization Failure on Sites with Strict CSP

**Version:** 1.0
**Date:** 2024-08-16
**Author:** AI Assistant (Gemini) & User

## 1. Introduction

This document outlines the problem, causes, effects, success criteria, and proposed solution for an issue where the Voice Activity Detection (VAD) feature in the SayPi browser extension fails to initialize on certain websites, notably `claude.ai`.

## 2. Problem Statement

The SayPi browser extension's VAD functionality, which relies on `@ricky0123/vad-web` and `onnxruntime-web` for WebAssembly-based audio processing, fails to start when the extension is active on websites with restrictive Content Security Policies (CSPs) and that are not cross-origin isolated. This results in users being unable to use voice input on these sites. The issue has been observed to affect previously working versions of the extension on `claude.ai`, suggesting a change in the site's environment. Recent attempts to update the VAD library and adjust its configuration have not resolved the core problem on these restrictive sites.

## 3. Goals

*   Restore VAD functionality on `claude.ai` and other similarly configured websites.
*   Ensure the solution is robust against common strict CSPs and cross-origin isolation policies encountered on modern web pages.
*   Maintain acceptable VAD performance.

## 4. Current Situation & Analysis

### 4.1. Technical Components Involved:
*   **SayPi Browser Extension:** Injects content scripts into host pages.
*   **`@ricky0123/vad-web` (v0.0.24):** JavaScript library for VAD.
*   **`onnxruntime-web`:** WebAssembly runtime used by `vad-web` to execute the Silero VAD model (`.onnx` file).
*   **Content Security Policy (CSP):** A security feature used by websites to control resource loading and script execution.
*   **Cross-Origin Isolation (COOP/COEP headers):** Security feature required for unrestricted use of `SharedArrayBuffer`, which is often used by threaded WebAssembly.

### 4.2. Root Causes Identified:

1.  **Restrictive Host Page CSP:**
    *   Websites like `claude.ai` implement a strict CSP (e.g., `script-src 'strict-dynamic' 'nonce-...'`) that does not include `'unsafe-eval'` or `'wasm-unsafe-eval'`.
    *   The browser enforces this CSP, preventing `onnxruntime-web` from compiling and instantiating its WebAssembly modules, as these operations are often treated as `eval`-like. This leads to errors like `CompileError: WebAssembly.instantiateStreaming()` and `Aborted(CompileError: WebAssembly.instantiate(): )`.

2.  **Lack of Cross-Origin Isolation on Host Page:**
    *   Websites like `claude.ai` are not cross-origin isolated because they do not serve the required `Cross-Origin-Embedder-Policy: require-corp` (COEP) header (along with an appropriate `Cross-Origin-Opener-Policy` (COOP)).
    *   This restricts the use of `SharedArrayBuffer`, which the threaded version of `onnxruntime-web` (`ort-wasm-simd-threaded.wasm`) attempts to use. While newer versions of ONNX runtime can detect this and fall back to single-threaded mode, the CSP issue (1) often blocks WASM initialization before this fallback can effectively occur.

### 4.3. Effects:
*   The VAD fails to initialize, logging errors such as "VAD microphone failed to load. Error: no available backend found. ERR: [wasm] RuntimeError: Aborted(CompileError: WebAssembly.instantiate(): )".
*   Users cannot use voice input features of the SayPi extension on affected websites.
*   The issue occurs even if the necessary `.onnx` and `.wasm` files are correctly bundled with the extension and served locally (e.g., via `RequestInterceptor.js`). The problem is not file availability but the permission to execute/compile WebAssembly in the host page's context.

### 4.4. Current VAD Package Version:
*   `@ricky0123/vad-web`: v0.0.24 (after recent update attempt). The issue persisted.

## 5. Success Criteria

*   The VAD feature initializes and functions correctly when the SayPi extension is used on `claude.ai`.
*   The solution should be generally applicable to other websites with similar strict CSPs and lack of cross-origin isolation.
*   The extension remains stable and performant.
*   The solution should adhere to Manifest V3 best practices if significant architectural changes are needed.

## 6. Proposed Solution

Based on research and troubleshooting, the most robust solution is to **relocate the VAD processing (including `onnxruntime-web` execution) from the content script (running in the host page's context) to an environment where the extension controls the CSP.**

For a Manifest V3 extension, this means utilizing an **Offscreen Document**:
1.  **Create an Offscreen Document:** Define an HTML file within the extension (e.g., `vad_offscreen.html`).
2.  **Permissive CSP for Offscreen Document:** In the `manifest.json`, declare this offscreen document and associate it with a CSP that allows WebAssembly execution, e.g., `script-src 'self' 'wasm-unsafe-eval'; object-src 'self'`.
3.  **Move VAD Logic:** Instantiate and run `MicVAD` and `onnxruntime-web` within this offscreen document.
4.  **Communication:** Use message passing (e.g., `chrome.runtime.sendMessage`, `port.postMessage`) to communicate between the content script (running on `claude.ai`) and the offscreen document.
    *   Content script sends audio data chunks (or commands to start/stop mic access managed by the offscreen doc) to the offscreen document.
    *   Offscreen document performs VAD and sends speech start/end events back to the content script.

This approach isolates the WebAssembly execution from the host page's restrictive CSP and `SharedArrayBuffer` limitations.

## 7. Out of Scope for this PRD (Future Considerations)

*   Alternative VAD libraries (e.g., WebRTC VAD, Picovoice Cobra), unless the proposed solution with the current library proves unworkable even in an offscreen document.
*   Requesting `claude.ai` or other websites to change their CSP/COOP/COEP headers.

## 8. Risks & Mitigation

*   **Complexity:** Implementing message passing and managing the lifecycle of an offscreen document adds complexity.
    *   **Mitigation:** Follow Chrome extension best practices for offscreen documents and ensure robust error handling.
*   **Performance:** Message passing overhead could introduce latency.
    *   **Mitigation:** Optimize message payloads. Audio data can be transferred efficiently. The VAD processing itself should be efficient enough in a single-threaded offscreen context.

## 9. Next Steps

Proceed with implementing the proposed solution:
1.  Create an offscreen HTML document.
2.  Update `manifest.json` to declare the offscreen document, its purpose (`AUDIO_PLAYBACK` might be relevant if mic access is handled there, or a custom reason), and a suitable CSP.
3.  Refactor VAD initialization and audio processing logic into scripts that run in the offscreen document.
4.  Implement message passing between the content script and the offscreen document. 