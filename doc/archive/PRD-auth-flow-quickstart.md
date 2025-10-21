# SayPi Extension Auth Flow – Developer Quick-Start

This doc distills the full PRD into actionable implementation steps.

---

## Core Goals
- Smooth OAuth2.1 sign-in with **Authorization Code + PKCE**.
- Real-time auth state sync across extension (no manual reloads).
- Support Chrome/Chromium + Firefox (desktop + Android).
- Guest mode (limited free use) + progressive prompts to convert.
- Strong security: no cookies, secure token storage, refresh rotation.

---

## Implementation Steps

### 1. Auth Flow
- Use `chrome.identity.launchWebAuthFlow` (Chrome/Edge/etc.) or `browser.identity.launchWebAuthFlow` (Firefox).
- Mobile:
  - Chrome Android → use Custom Tabs + intercept scheme redirect.
  - Firefox Android → open tab, catch redirect via `webRequest.onBeforeRequest`.
- Backend: add PKCE code exchange endpoint (returns JWT + refresh token).

### 2. Token Management
- Store tokens in:
  - `chrome.storage.session` (active runtime).
  - Encrypted backup in `chrome.storage.local` (persistence).
- Schedule silent refresh with `chrome.alarms` (refresh before expiry).
- Implement refresh token rotation.  
- On logout: clear storage + revoke tokens.

### 3. Auth State Manager
- Create `AuthStateManager` singleton in background.
- On startup → rehydrate tokens from storage.
- Broadcast updates via:
  - `chrome.runtime.sendMessage`.
  - `chrome.tabs.sendMessage` (to content scripts).
  - Update `chrome.storage` (so `storage.onChanged` can sync).
- Payload includes `{ status, user, tokenExpiry }`.

### 4. UI Updates
- Settings & overlays subscribe to `AUTH_EVENT`.
- Show spinner during login.
- On success: show user info, unlock premium toggles.
- On failure: show friendly error + retry option.
- On logout: reset immediately.

### 5. Progressive Prompts
- Free tier: allow 5 free interactions.
- After 5 uses: toast → “Sign in to save settings.”
- After 10 uses: modal → “Sign in to unlock unlimited voice.”
- Premium feature click → require sign-in (hard gate).
- A/B test CTA text + timing.

### 6. Error Handling
- Map error codes:
  - Timeout → auto-retry.
  - Session expired → reauth prompt.
  - Unsupported browser → message.
  - Premium gate → sign-in modal.

### 7. Telemetry
- Log funnel events: promptShown → authStarted → authCompleted.
- Track:
  - Time-to-auth.
  - Refresh success/failure.
  - Conversion %.
- A/B test variants.

---

## Acceptance Criteria
- UI updates ≤2s post-login.
- P90 auth flow <15s.
- Conversion >70% of engaged users.
- Silent refresh success >99%.
- <5% forced reauth in 30d.

---

## Rollout
1. Implement identity flow (desktop).
2. Add AuthStateManager + broadcasting.
3. Integrate progressive prompts.
4. Add mobile flows.
5. Enable silent refresh.
6. A/B test + refine.

---
