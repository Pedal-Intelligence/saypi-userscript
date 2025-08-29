### Client Integration Guide: Sending Usage Metadata to SayPi API for Enhanced Analytics

This guide explains the changes required in API clients (notably the SayPi browser extension) to pass additional usage metadata to the SayPi API, enabling full anonymous vs. authenticated analytics as specified in [PRD_usage_endpoint_changes.md](mdc:scripts/PRD_usage_endpoint_changes.md).

## Why this change
- Anonymous usage was previously invisible, obscuring:
  - Overall load: total STT seconds and TTS characters
  - “People” metrics: active anonymous installs vs. authenticated users
  - Diversity: app, language, country, browser, device
- By enriching your existing calls to the SayPi API with a few additional parameters, the API server can report analytics to the SaaS usage service with proper attribution and linking.

## What you need to do (high level)
- Continue calling the same SayPi API endpoints for STT and TTS.
- Include a stable per-install client identifier (clientId) in all requests (anonymous and authenticated).
- Include app, language, and version when known.
- When authenticated, include the Authorization Bearer token as you do today; this lets the server send teamId while still including clientId to link installs after sign-in.
- No direct calls to the SaaS usage endpoint are required by clients.

## Identifiers, auth, and fields to send
- Authorization header (when signed in)
  - Continue sending the JWT as `Authorization: Bearer <token>`.
  - The API server derives `teamId` from the JWT for quota and billing.
- clientId (always send)
  - A stable, per-install RAW UUIDv4 that persists across browser restarts and extension updates.
  - Do NOT hash or otherwise transform this value. Send the raw UUID.
  - Not user-specific; do not reset on login/logout. Resets only on uninstall.
  - See “Client ID requirements” below for full details and code.
- app (recommended)
  - Source app identifier, e.g., "pi", "claude", "web". Prefer lowercase.
- language (recommended when known)
  - BCP‑47 locale used for the request, e.g., "en-US".
- version (recommended)
  - App/extension version string, e.g., "1.4.0".

Note: User-Agent is sent automatically by the browser. Do not attempt to override it. CF-IPCountry is a server/edge header; you do not need to send it from the extension.

## Endpoints and parameters

### Speech-to-Text (STT)
Endpoint: POST `/transcribe` (multipart/form-data with an audio file)

- Existing fields: `audio` file and other functional inputs you already send
- Additional/recommended fields (form fields):
  - `clientId`: string (RAW UUIDv4) — required for anonymous usage; recommended to always send
  - `app`: string (e.g., "pi")
  - `language`: string (e.g., "en-US")
  - `version`: string (e.g., "1.4.0")

Anonymous example (no Authorization header; include clientId):
```bash
curl -X POST https://<saypi-api>/transcribe \
  -H 'Content-Type: multipart/form-data' \
  -F 'audio=@/path/to/audio.wav' \
  -F 'clientId=6c46f0f3-5a94-4b70-b3b4-76d6f6331c5d' \
  -F 'app=pi' \
  -F 'language=en-US' \
  -F 'version=1.4.0'
```

Authenticated example (include Authorization; still send clientId to allow linking):
```bash
curl -X POST https://<saypi-api>/transcribe \
  -H 'Authorization: Bearer <JWT>' \
  -H 'Content-Type: multipart/form-data' \
  -F 'audio=@/path/to/audio.wav' \
  -F 'clientId=6c46f0f3-5a94-4b70-b3b4-76d6f6331c5d' \
  -F 'app=pi' \
  -F 'language=en-US' \
  -F 'version=1.4.0'
```

JS example (browser/extension):
```javascript
const form = new FormData();
form.append('audio', fileBlob, 'audio.wav');
form.append('clientId', clientId);          // raw UUIDv4
form.append('app', 'pi');                   // lowercase
form.append('language', 'en-US');           // BCP-47
form.append('version', extensionVersion);   // e.g. browser.runtime.getManifest().version

const headers = {};
if (jwt) headers['Authorization'] = `Bearer ${jwt}`;

await fetch(`${API_BASE}/transcribe`, { method: 'POST', headers, body: form });
```

What happens server-side
- Anonymous: server reports usage with clientId (no teamId) for analytics; no quotas updated.
- Authenticated: server reports usage with teamId (from JWT) and also clientId when provided to link installs; quotas updated appropriately.
- Amount for STT is computed by the server from audio duration.

### Text-to-Speech (TTS) — non-streaming
Endpoint: POST `/speak/{uuid}` (JSON)

- Body fields (in addition to required TTS parameters):
  - `clientId`: string (RAW UUIDv4)
  - `app`: string
  - `version`: string
  - `lang`: string (language code used by TTS)

Authenticated example:
```bash
curl -X POST https://<saypi-api>/speak/abcd-1234 \
  -H 'Authorization: Bearer <JWT>' \
  -H 'Content-Type: application/json' \
  -d '{
    "text": "Hello!", 
    "voice": "test_voice_id", 
    "lang": "en",
    "app": "pi",
    "clientId": "6c46f0f3-5a94-4b70-b3b4-76d6f6331c5d",
    "version": "1.4.0"
  }'
```

JS example:
```javascript
const body = {
  text: "Hello!",
  voice: "test_voice_id",
  lang: "en",
  app: "pi",
  clientId, // raw UUIDv4
  version: extensionVersion
};

await fetch(`${API_BASE}/speak/${uuid}`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${jwt}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(body),
});
```

Notes
- TTS endpoints require authentication in most flows; always include `Authorization` and `clientId`.
- Amount for TTS is calculated by the server as number of characters synthesized.

### Text-to-Speech (TTS) — streaming
- If you use the streaming endpoints, continue to authenticate. Include `app` on GET stream calls when you have it.
- `clientId` is not part of the streaming GET URL today; focus on including it in non-streaming creation calls you make and STT calls. You do not need to force streaming metadata parity if it complicates your client significantly.

## Client ID requirements (must read)
- What it is
  - A stable, per-install RAW UUIDv4 string (e.g., `"6c46f0f3-5a94-4b70-b3b4-76d6f6331c5d"`).
  - Identifies an installation of your client (browser extension), not a user.
- What it is NOT
  - Not a user ID, email, IP, or any PII.
  - Not a device fingerprint or hardware identifier.
  - Not hashed, not encrypted, not transformed — send the raw UUID.
  - Not ephemeral; do not rotate between sessions or sign-ins.
- Lifetime and storage
  - Generate once on first run, persist in extension storage (e.g., `chrome.storage.local`) or `localStorage`.
  - Recreate only when the extension is reinstalled or user explicitly resets.
  - Ensure it survives updates and browser restarts.
- Generation (TypeScript example)
```typescript
function getOrCreateClientId(): string {
  const key = 'saypi_client_id';
  // Prefer extension storage if available
  const existing = localStorage.getItem(key);
  if (existing && isUuidV4(existing)) return existing;

  const uuid = crypto.randomUUID(); // modern browsers
  // If crypto.randomUUID isn't available, generate using crypto.getRandomValues
  localStorage.setItem(key, uuid);
  return uuid;
}

function isUuidV4(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}
```

Chrome extension (storage) example:
```typescript
async function getOrCreateClientId(): Promise<string> {
  const key = 'saypi_client_id';
  const stored = await chrome.storage.local.get(key);
  if (stored[key] && isUuidV4(stored[key])) return stored[key];

  const uuid = crypto.randomUUID();
  await chrome.storage.local.set({ [key]: uuid });
  return uuid;
}
```

Transmission
- Include `clientId` in:
  - STT `/transcribe` as a form field
  - TTS `/speak/{uuid}` in JSON payload
- Always include it — both for anonymous and authenticated requests.

Common pitfalls to avoid
- Do not hash the clientId before sending; the server performs hashing for analytics.
- Do not tie clientId to specific users or sessions; it should outlive sign-ins and sign-outs.
- Do not rotate clientId periodically; only reset on uninstall or explicit user reset.

## Acceptance criteria (for client changes)
- Anonymous tracking
  - Without Authorization, requests include `clientId`. The server records anonymous usage; no quotas are changed.
- Authenticated tracking with linking
  - With Authorization, requests still include `clientId`. The server updates quotas for the team and links the install to the team for attribution.
- Enrichments
  - `app` is provided (prefer lowercase).
  - `language` and `version` are provided when known.
- Backward compatibility
  - Existing calls continue to work without new fields; analytics will just be less detailed.

## FAQ
- Do I need to send User-Agent or CF-IPCountry?
  - No. User-Agent is sent automatically by the browser. CF-IPCountry is a server/edge header and not available to extensions.
- Do I need to send teamId?
  - No. Include the Authorization header (Bearer JWT). The server extracts teamId and still uses your clientId to link installs after login.
- Does this change my quota or billing behavior?
  - No. Authenticated usage continues to count against team quotas; anonymous usage does not. Your job is to provide metadata so the server can report accurately.

By implementing the above changes, your client will fully support enhanced usage analytics while preserving user privacy and maintaining current behavior for quota and entitlement.