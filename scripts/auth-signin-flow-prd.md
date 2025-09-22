# SayPi Extension Authentication Flow PRD

## 1. Problem Statement

The current authentication flow for the SayPi browser extension feels disjointed and unreliable. Users initiate sign-in from the settings UI, are bounced through multiple tabs/windows, and often return to an unchanged settings view that still claims they are unauthenticated until they manually reload the page. This erodes trust, obscures the success state, and leaves room for session inconsistencies.

## 2. Background & Context

- Entry points: users usually open the settings UI from a chatbot host (e.g., Claude) via the embedded "Voice settings" affordance or the browser action icon.
- Authentication relies on a session cookie (`auth_session`) set on `www.saypi.ai`, which the background service worker exchanges for a JWT.
- The settings UI runs as an extension page (MV3). After the user finishes OAuth/login in a new tab, the login tab closes, but the settings page does not react to the new JWT. Users must reload manually to see a signed-in state.
- Firefox recently required a fix to avoid background self-messaging; while token refresh now succeeds, the UX shortcomings persist across browsers.

## 3. Impact Assessment

- **User confusion**: No post-login confirmation; users assume sign-in failed.
- **Support load**: Increased tickets/feedback about “stuck” sign-in.
- **Trust & conversion**: Friction at the moment of upgrade/purchase (quota gating) reduces likelihood of adoption of premium features.
- **Security perception**: Inconsistent state raises concern that credentials were mishandled.

## 4. Goals & Desired Outcomes

1. Deliver a seamless, single-flow sign-in experience that clearly communicates progress and success/failure.
2. Immediately reflect authenticated state across the extension (settings, popups, content scripts) without manual reloads.
3. Align implementation with OAuth best practices for browser extensions (Chrome, Chromium variants, Firefox desktop/mobile).
4. Maintain or improve current security posture—no exposure of session cookies, eliminate fragile fallbacks, support explicit logout.

### Acceptance Criteria

- After authentication completes, the settings UI updates within two seconds to show the signed-in user info, without requiring manual reloads.
- In-flight state (spinners/progress) is visible while the background worker acquires/refreshes tokens.
- The flow works on Chrome/Chromium (desktop + mobile) and Firefox (desktop + mobile), using sanctioned identity APIs where available.
- Sign-out fully clears tokens and cookies and reverts UI state immediately.
- Error conditions (denied consent, network failure, expired session) surface clear guidance and retry paths.

## 5. Motivations & Non-Goals

**Motivations**

- Improve onboarding/trust for first-time users landing via chatbot integrations.
- Reduce engineering debt from custom cookie transport logic.
- Support future entitlements/plan upgrades tied to reliable auth state.

**Non-Goals**

- Redesigning the broader settings UI beyond auth entry points.
- Changing backend authentication providers or account management flows.

## 6. Users & Stakeholders

- **End users**: Individuals installing the extension for voice features.
- **Support & Success**: Need lower friction and fewer troubleshooting steps.
- **Engineering**: Background service worker, popup team, backend auth service owners.
- **Product/Design**: Responsible for cross-surface experience consistency.

## 7. Requirements

### Functional

1. Provide a cohesive sign-in entry point (modal or dedicated extension surface) that does not leave orphaned tabs.
2. Background worker must broadcast auth state changes to all extension views/content scripts.
3. Settings UI listens for auth updates (runtime messaging or storage listeners) and re-renders automatically.
4. Support SSO providers (Google, GitHub) and magic link/password flows.
5. Persist a return-to-chat mechanism so users can resume their origin context post-login.

### Security

1. Prefer Authorization Code + PKCE via `chrome.identity.launchWebAuthFlow` / `browser.identity.launchWebAuthFlow` with extension redirect URIs.
2. Store tokens in extension storage only (no session cookie values). Remove fallback that posts `auth_session` in a JSON body.
3. Validate `state`/`nonce` on OAuth callback; reject unexpected origins.
4. Support explicit logout by revoking tokens (if backend supports) and clearing storage quickly.

### UX

1. Show in-flight progress (e.g., spinner, message) when the auth process is ongoing.
2. Auto-close or route back to the originating tab after successful login, with a toast/notification confirming success.
3. Provide actionable error UI with retry and “contact support” paths.
4. Maintain accessibility standards (keyboard focus, screen-reader announcements).

## 8. Design Options

### Option A – OAuth via Extension Identity API (Recommended)

- Use `launchWebAuthFlow` (Chrome/Chromium) and `browser.identity.launchWebAuthFlow` (Firefox) with PKCE.
- Flow occurs in a controlled popup (modal) managed by the browser; upon redirect to extension URL with code, background exchanges code for tokens via backend endpoint.
- Background stores JWT + refresh token (if used) and broadcasts success.
- Settings UI receives `AUTH_STATUS_UPDATED` message, hides loader, and displays user info.
- Pros: Aligned with OAuth best practices, minimizes custom tab handling, robust state validation, works on mobile variants supporting identity API.
- Cons: Requires backend support for Authorization Code + PKCE; need to ensure redirect URIs whitelisted; some mobile browsers may have partial support.

### Option B – Embedded Auth Tab with Messaging Improvements

- Keep current new-tab flow but inject post-auth redirect page that `chrome.runtime.sendMessage` back to extension and closes itself.
- Settings UI listens for the message and updates UI.
- Pros: Lower engineering effort; reuses existing backend endpoints.
- Cons: Tab-jumping persists; more brittle on mobile; still relies on cookie transport; less secure than code+PKCE.

### Option C – In-Extension Hosted Login (IFrame / WebView)

- Embed login form inside extension page through a webview or iFrame.
- Pros: Single surface experience.
- Cons: OAuth providers often block embedding; significant CSP challenges; security risk.

## 9. Recommended Approach

Adopt **Option A** while providing temporary fallback from Option B during rollout:

1. Implement Authorization Code + PKCE flow across browsers via identity APIs.
2. Introduce a unified auth controller in the background service worker handling:
   - initiating login
   - exchanging authorization code for JWT/access tokens
   - storing tokens securely
   - broadcasting auth status updates (`AUTH_STATUS_UPDATED`, `AUTH_ERROR`).
3. Update settings UI (and other surfaces) to:
   - show an optimistic loading state once login begins
   - listen for auth status broadcasts and re-render automatically
   - provide success/failure toasts.
4. Implement return-flow tracking: remember originating tab and focus it after authentication completes.
5. Phase out JSON body cookie fallback once identity flow is live; keep telemetry to ensure parity before removal.

## 10. Implementation Notes (Non-Binding)

- Create a shared `AuthState` module exporting `subscribe(getJwtManager)` style updates for any UI.
- Use `chrome.storage.onChanged` as a redundancy for auth broadcasts.
- Provide instrumentation: log auth start/completion/error events with context (browser, identity API support).
- On Firefox mobile (limited identity API), detect capability; if missing, fall back to enhanced Option B while scheduling follow-up work.

## 11. Risks & Mitigations

- **Backend readiness**: Authorization code exchange endpoint may not exist. Mitigate by coordinating with backend team; design API contract early.
- **Identity API parity**: Some Chromium-based mobile browsers might not expose the API. Mitigate with capability checks and fallback flow.
- **User confusion during transition**: Communicate in release notes; provide inline hints if user sees old flow during rollout.
- **Token storage**: Ensure migration handles existing persisted JWTs gracefully; provide logout/reset instructions if migration fails.

## 12. Open Questions

1. Will backend provide refresh tokens, or do we keep short-lived JWTs with silent re-auth via identity API refresh?
2. Should we expose a mini auth status component inside chatbot overlays to encourage sign-in without opening the full settings tab?
3. What telemetry thresholds (success rate, time-to-auth) define “done” for the UX revamp?

