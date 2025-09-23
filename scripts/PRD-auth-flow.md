# SayPi Extension Authentication Flow PRD (Consolidated Revamp)

## Document Information
- **Version**: 3.0 (Consolidated PRD + Addendum)  
- **Date**: September 2025  
- **Status**: Finalized Product Requirements  
- **Supersedes**: Original Authentication Flow PRD v1.0 and Addendum v2.0  

## 1. Problem Statement

The current authentication flow for the SayPi browser extension feels disjointed and unreliable. Users initiate sign-in from the extension’s settings UI, are bounced through multiple tabs or windows, and often return to an unchanged settings view that still claims they are unauthenticated until they manually reload the page. This erodes user trust, obscures the success state, and leaves room for session inconsistencies and errors.

After completing the OAuth sign-in in a separate tab, the extension’s settings page remains in an **unauthenticated** state (showing "Not signed in" with a Sign In button) because it has not been updated. This lack of immediate feedback causes users to think the sign-in failed, prompting confusion and frustration.

Only after the user manually refreshes or reopens the settings page does it update to show the **signed-in** state (displaying the user’s name, usage quota, and a Sign Out option). This gap in feedback is a critical UX flaw: users do not see any confirmation of success and may abandon the process or attempt it repeatedly, undermining confidence in the extension’s reliability.

## 2. Background & Context

- **Entry Points**: Users typically open the extension’s settings UI from a chatbot host (e.g. via a "Voice Settings" button in Claude) or by clicking the browser extension’s action icon.  
- **Current Auth Mechanism**: Auth relies on a session cookie (`auth_session`) set on **www.saypi.ai** after web login. The extension’s background service worker detects this cookie and exchanges it for a JWT.  
- **MV3 Context**: The settings UI is a React-based extension page. “Sign In” opens the OAuth login flow in a new tab/window. After login, the background gets the token but the UI does not auto-update.  
- **Recent Changes**: Firefox-specific fix ensured refresh works, but UI update issue remains.  
- **Technical Limits**: Mobile browsers (Chrome Android, Firefox Android) impose constraints on identity APIs.  

## 3. Impact Assessment

- **User Confusion** → Users assume sign-in failed.  
- **Support Load** → Increased tickets on “login not working.”  
- **Trust & Conversion** → Current ~30% completion, missed opportunities.  
- **Mobile Friction** → Worse experience on Android.  
- **Security Perception** → Reliance on cookie exchange undermines trust.  

## 4. Goals & Desired Outcomes

1. **Seamless Sign-In UX** – Clear feedback at each step.  
2. **Immediate State Sync** – All extension surfaces update instantly.  
3. **Best-Practice OAuth 2.1** – Secure, PKCE-based, with refresh support.  
4. **Strong Security Posture** – Proper token storage, logout, revocation.  
5. **Higher Conversion** – Raise sign-in completion to **70%+**.  

### Acceptance Criteria
- UI updates within ~2s of auth completion.  
- Visible progress indicators.  
- Works on Chrome/Chromium & Firefox (desktop + Android).  
- Logout clears state instantly.  
- Error messages are actionable.  
- Unauthenticated mode allowed with limits.  
- Silent refresh keeps users signed in.  

## 5. Motivations & Non-Goals

**Motivations**: smoother onboarding, less brittle code, better premium funnel.  
**Non-Goals**: redesigning whole settings UI, changing identity provider, adding payments.  

## 6. Users & Stakeholders
- **End Users**  
- **Support & Success**  
- **Engineering**  
- **Product & Design**  
- **Security (consultative)**  

## 7. Requirements

### Functional
- Unified sign-in flow.  
- Real-time auth state broadcast.  
- Reactive UI updates.  
- Multiple providers (Google, GitHub, email).  
- Return-to-origin context.  
- Progressive auth prompts.  
- Silent refresh.  

### Security
- OAuth 2.1 + PKCE.  
- No plaintext cookies/creds.  
- Secure token storage.  
- State/nonce validation.  
- Explicit logout.  
- Token refresh & rotation.  
- Minimal permissions.  

### UX
- Progress indicators.  
- Auto-close & return to context.  
- Clear error handling.  
- Accessibility (focus, screen readers).  
- Trust indicators (logos, privacy notes).  

## 8. Progressive Authentication Strategy

- **Free Tier** – allow limited (e.g. 5 transcriptions).  
- **Engaged User** – show progressive prompts:  
  - After 5 uses → toast.  
  - After 10 uses → soft modal.  
- **Premium Features** – require sign-in (hard gate).  

Prompts integrate contextual entry points in settings and chatbot overlays.  

## 9. Design Options

- **Option A: Identity API + PKCE (Recommended)**  
- **Option B: Tab + Messaging (Fallback)**  
- **Option C: Embedded WebView (Rejected)**  

## 10. Recommended Approach

- Use **Option A** where available, fallback to **Option B** otherwise.  
- Centralized **Auth Controller** in background script.  
- Real-time UI updates with optimistic feedback.  
- Return-to-context focus after login.  
- Progressive prompts integrated.  
- Deprecate cookie exchange fallback.  

## 11. OAuth Implementation

- Use Authorization Code + PKCE with identity APIs.  
- State validation mandatory.  
- Token exchange via backend.  
- Store tokens securely (`session` + encrypted `local`).  
- Broadcast auth events to UIs.  
- Silent refresh using alarms + refresh token rotation.  

## 12. Mobile Considerations

- **Chrome Android** → Custom Tabs + scheme intercept.  
- **Firefox Android** → Tab + `webRequest` intercept.  
- Detect capabilities and choose strategy.  
- Graceful fallback if unsupported.  

## 13. State Management

- **AuthStateManager** singleton in background.  
- Pub/sub pattern across contexts via runtime messages + storage.  
- UIs subscribe: settings, overlays, toolbar, etc.  

## 14. Error Recovery

- Classified errors → retry vs user action vs fallback.  
- Auto-retry transient errors with backoff.  
- Graceful degradation.  
- Friendly user messages.  

## 15. Analytics & Experimentation

- Track prompts, auth start/completion, time-to-auth, refresh success/failure, feature adoption.  
- A/B test:  
  - Prompt timing (3 vs 5 vs 10).  
  - CTA text variants.  
  - Provider order.  

## 16. Implementation Phases

1. **Core Identity API**  
2. **State Broadcasting**  
3. **Progressive Prompts**  
4. **Mobile Optimization**  
5. **Silent Refresh**  

## 17. Success Metrics

- Sign-in conversion: **70%+** of engaged users.  
- Auth completion: **>85%** of attempts.  
- P90 time-to-auth <15s.  
- Silent refresh success >99%.  
- Return-user continuity: <5% forced reauth in 30d.  
- Mobile parity: within 10% of desktop.  

## 18. Testing

- **Unit**: AuthStateManager, token utils, error handlers.  
- **Integration**: Full flows, token refresh, state broadcast, mobile fallbacks.  
- **E2E**: New user journey, premium gating, logout/login, cross-device.  

## 19. Rollout Strategy

- Internal alpha (5%) → Beta (20%) → GA (100%).  
- Rollback if auth success <60% or errors >5%.  

## 20. Security & Privacy

- HTTPS only.  
- PKCE, state required.  
- Encrypted token storage.  
- Token revocation.  
- No passwords in extension.  
- Minimal PII, privacy-first.  
- Telemetry opt-out respected.  

## 21. Documentation

- **Dev Docs**: auth flow, state manager, error map, platform notes.  
- **User Docs**: why sign in, privacy, troubleshooting, account mgmt.  

## Appendix A: OAuth 2.1 Checklist
- ✅ PKCE mandatory  
- ✅ Refresh token rotation  
- ✅ No implicit grant  
- ✅ Exact redirect URIs  
- ✅ State validation  

## Appendix B: Browser API Matrix

| Feature                       | Chrome Desktop | Chrome Android | Firefox Desktop | Firefox Android |
|-------------------------------|----------------|----------------|----------------|----------------|
| Identity API                  | ✅              | ❌             | ✅              | ❌             |
| Custom Tabs                   | N/A            | ✅             | N/A            | ⚠️ partial     |
| Alarms                        | ✅              | ✅             | ✅              | ✅             |
| Storage (session/local)       | ✅              | ✅             | ✅              | ✅             |
| WebRequest intercept          | ✅              | N/A            | ✅              | ✅             |

## Appendix C: Error Codes

| Code     | Message                                | Action                    |
|----------|----------------------------------------|---------------------------|
| AUTH_001 | “Connection timeout. Retrying…”        | Auto-retry                |
| AUTH_002 | “Session expired, please sign in.”     | Prompt reauth             |
| AUTH_003 | “Browser not supported for sign-in.”   | Show notice               |
| AUTH_004 | “Premium feature – Sign in to continue.” | Show modal, require login |

---
