---
title: Route API requests through background to bypass host-page CSP
status: draft
owner: platform
lastUpdated: 2025-08-24
---

## Overview

Some hosts (e.g., `gemini.google.com`) enforce restrictive Content Security Policies (CSP), especially `connect-src`, which block network requests initiated from the host page realm to third-party origins like `https://api.saypi.ai` and `https://www.saypi.ai`. When SayPi runs as a content script and any of our logic executes in or is affected by the page realm, outgoing requests can be blocked, yielding console errors and broken features (e.g., transcription uploads, auth refresh).

This PRD proposes routing content-script API requests through the extension background service worker so that requests originate from the extension origin, which is not governed by the page’s CSP. This is a standard extension architecture pattern and improves security by centralizing credentialed requests.

## Goals

- Ensure all SayPi feature API calls succeed on CSP-restrictive pages by originating from the background service worker.
- Minimize changes to existing feature modules (e.g., `TranscriptionModule.ts`, TTS, VAD telemetry) by providing a simple request bridge.
- Preserve authentication behavior (JWT bearer tokens; cookie-based refresh when needed) and maintain compatibility with Chrome and Firefox (desktop and Android where applicable).
- Provide robust error handling, timeouts, and observability.

## Non-Goals

- Implementing streaming/SSE in this iteration (we’ll define the interface but can defer full streaming support if not needed immediately).
- Moving business logic to the background; only the network request should move.

## Background & Constraints

- Content scripts are generally isolated from page CSP, but any execution in the page realm (e.g., injected scripts) or frameworks that pick up the page’s `fetch`/XHR can be blocked by `connect-src`.
- The background service worker is event-driven and not bound by the page CSP but remains subject to standard browser CORS.
- CORS: servers must allow the extension origin (no `*` with credentials). Our servers must include `Access-Control-Allow-Origin` for the extension origins and allow necessary headers (e.g., `Authorization`).

## High-Level Design

1. Content scripts call a single request helper (bridge) instead of using `fetch` directly for cross-origin SayPi endpoints.
2. The helper sends a message to the background (via `chrome.runtime.sendMessage` for request/response or a `Port` for long-lived/streamed flows).
3. The background reconstructs the request (headers, `FormData`/`Blob` body), adds auth headers via `JwtManager`, performs `fetch`, and returns a normalized response payload to the sender.
4. The helper resolves with `{ ok, status, headers, body }`, where `body` may be JSON, text, or ArrayBuffer depending on `responseType` requested.

### Message Contract (v1)

- Request message (content script ➜ background):
  - `type: "API_REQUEST"`
  - `method: "GET" | "POST" | ...`
  - `url: string` (absolute)
  - `headers?: Record<string,string>`
  - `bodyType?: "json" | "formData" | "blob" | "text"`
  - `body?: any` (JSON-serializable; `Blob` allowed via structured clone)
  - `requiresAuth?: boolean` (default true for SayPi endpoints)
  - `responseType?: "json" | "text" | "arrayBuffer"` (default `json`)
  - `timeoutMs?: number` (default 10000)

- Response message (background ➜ content script):
  - `type: "API_RESPONSE"`
  - `ok: boolean`
  - `status: number`
  - `headers: Record<string,string>` (lower-cased keys)
  - `body?: any` (per `responseType`)
  - `error?: string`

### Auth Handling

- Background uses `JwtManager` to attach `Authorization: Bearer <token>`.
- If a 401/403 is received, background attempts `jwtManager.refresh(true)` and retries once.
- For Firefox, cookie-based refresh path is retained (already implemented in `JwtManager` and `background.ts`).

### Error Handling & Timeouts

- Background enforces a per-request timeout (default 10s) using `AbortController`.
- Network failures return a consistent `{ ok: false, status: 0, error }` shape.
- Content script callers keep existing retry/backoff logic where present (e.g., in `TranscriptionModule.uploadAudioWithRetry`).

### Streaming (Future)

- For SSE/chunked responses, switch to a `Port` and forward chunks as `API_STREAM_DATA` events; close with `API_STREAM_END`. Not required for MVP.

## API Surface Changes

- Introduce `requestViaBackground(input: RequestDescriptor): Promise<ApiBridgeResponse>` in a new utility module used by `ApiClient`.
- Update `ApiClient.callApi` to delegate to background for cross-origin SayPi endpoints (optionally always). Preserve current interface for call sites.

## Security & Privacy

- Centralize token usage in background; content scripts do not need to read or inject tokens into requests.
- Avoid logging bodies containing audio or PII. Sanitize logs in both content and background (large arrays, binary payloads).

## Performance

- The structured-clone of `Blob` payloads incurs a copy; audio segments are small and acceptable. If needed, chunk uploads can be considered later.
- The background service worker may suspend between events; requests wake it as needed.

## Browser Compatibility

- Chrome: supported.
- Firefox desktop/Android: supported, provided server CORS allows `moz-extension://` origin where needed with credentials.

## Telemetry & Observability

- Emit timing markers in content script before/after bridge call.
- Background logs request metadata (method, URL host, status, duration) without sensitive payloads.

## Rollout Plan

1. Implement bridge and background handler.
2. Migrate high-impact flows first: transcription upload, auth refresh, TTS fetch.
3. Test on CSP-restrictive hosts (Gemini); verify no CSP violations occur.
4. Roll out to remaining API calls.

## Risks & Mitigations

- CORS misconfiguration: validate server responses in dev and staging; add explicit `Access-Control-Allow-Origin` for extension origins when credentials are used.
- Large payload latency: keep segments small; monitor timings; consider chunking if needed.
- Service worker lifetime: use reasonable timeouts; avoid long-running open connections initially.

## Implementation Outline (MVP)

1. Background: add `API_REQUEST` handler that:
   - Validates URL is allowed by `host_permissions`.
   - Builds headers with `JwtManager` if `requiresAuth`.
   - Reconstructs request body (`FormData` for uploads, JSON for standard calls).
   - Performs `fetch` with `AbortController` and returns normalized response.
2. Content: add `requestViaBackground(...)` utility and adapt `ApiClient.callApi` to use it for SayPi endpoints.
3. Keep existing retry logic in `TranscriptionModule.uploadAudioWithRetry`.

## Automated Test Plan

### Unit Tests (Jest/Vitest)

- Background handler
  - Mocks: `fetch`, `JwtManager.getAuthHeader`, `JwtManager.refresh`.
  - Cases:
    - Attaches auth header when `requiresAuth`.
    - Retries once on 401/403 and succeeds.
    - Times out via `AbortController` and returns `{ ok:false, status:0 }`.
    - Handles `responseType` variants: `json`, `text`, `arrayBuffer`.
    - Properly reconstructs `FormData` from descriptors (including `Blob`).

- Bridge utility (`requestViaBackground`)
  - Sends well-formed messages, handles success and error payloads.
  - Propagates timeouts and normalizes errors.

### Integration Tests

- Adapt `TranscriptionModule.uploadAudioWithRetry` to call `ApiClient.callApi` ➜ background and verify:
  - On success, response JSON is parsed and events are emitted as before.
  - On network failure, existing retry/backoff path is followed.

### Browser Automation (Manual + Scripted Where Possible)

- Load the unpacked extension and navigate to a CSP-restrictive page (e.g., `gemini.google.com`).
- Initiate a transcription request and verify:
  - No console CSP violations for `connect-src` to SayPi domains.
  - Background logs show the request and a successful response.
  - Feature behavior (transcription result) remains correct.

### Regression Tests

- Non-CSP pages (pi.ai, claude.ai) continue to function.
- Firefox desktop/mobile: auth refresh via background still works; no CSP blocks observed.

## Acceptance Criteria

- From a CSP-restrictive page, transcription upload and auth refresh succeed without CSP errors.
- All migrated API calls go through background; security-sensitive headers are only set in the background.
- Unit and integration tests pass; manual tests on targeted hosts confirm behavior.


