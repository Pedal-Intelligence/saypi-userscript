# OAuth 2.1 + PKCE Authentication Spec for SayPi Extension

## Implementation Status

| Item | Status | Notes |
|------|--------|-------|
| Authorization endpoint (`/api/oauth/authorize`) | ✅ Done | PR #67 |
| Token endpoint (`/api/oauth/token`) | ✅ Done | PR #67 |
| Refresh token endpoint | ✅ Done | PR #67 |
| Double URL encoding fix | ✅ Done | PR #67 |
| Social OAuth redirectTo preservation | ✅ Done | PRs #69, #70 |
| Password login redirect | ✅ Done | PR #74 |
| Extension PKCE implementation | ✅ Done | `OAuthService.ts`, `PKCEManager.ts` |
| Chrome redirect URI registered | ✅ Done | `chromiumapp.org` |
| Sign-out race condition fix | ✅ Done | `JwtManager.ts` |
| Firefox PKCE support | ✅ Done | Tab-based PKCE via `TabBasedPKCEAuth.ts` |
| Refresh token rotation | ❓ Untested | Needs verification |

---

## Summary

The SayPi browser extension needs OAuth 2.1 with PKCE (Proof Key for Code Exchange) support to securely authenticate users without storing secrets in client-side code.

## Why PKCE?

Browser extensions are "public clients" - they cannot securely store client secrets because:
- Extension code is visible to users and other extensions
- Any secret embedded in the extension is extractable
- Traditional OAuth client secrets provide no security benefit

**PKCE solves this** by using a cryptographic challenge/response that proves the client completing the auth flow is the same one that started it, without requiring a stored secret.

### Security Benefits
- Prevents authorization code interception attacks
- Industry standard for mobile apps and browser extensions (RFC 7636, OAuth 2.1)
- Recommended by Google, Microsoft, and Okta for public clients

## Critical: Chrome Identity API Integration

### How Browser Extension OAuth Works

Chrome (and other Chromium browsers) provides a special `identity.launchWebAuthFlow()` API for extension OAuth. This works differently from regular web OAuth:

1. **Extension calls `launchWebAuthFlow()`** with an authorization URL
2. **Chrome opens a popup window** (not a tab) showing that URL
3. **User authenticates** in the popup
4. **Server redirects to `https://<extension-id>.chromiumapp.org/?code=...`**
5. **Chrome intercepts this redirect** (the `chromiumapp.org` domain is special)
6. **Chrome closes the popup** and returns the final URL to the extension

**Key point**: The popup window is isolated. The user must complete the entire flow within it, ending with a redirect to `chromiumapp.org`. If the flow doesn't end with that redirect, Chrome reports "The user did not approve access."

### Current Problem

> **Note:** All issues in this section have been resolved. Kept for historical reference.

When the extension calls `/api/oauth/authorize`, the server redirects to `/auth/login` because the user isn't authenticated. This is correct behavior, but there were several issues that have since been fixed:

#### Issue 1: Double URL Encoding ✅ FIXED (PR #67)

The redirect URL previously looked like:
```
/auth/login?redirect=https://www.saypi.ai/api/oauth/authorize?response_type=code%26client_id=saypi-extension%26redirect_uri=https%253A%252F%252Fxxx.chromiumapp.org%252F
```

Notice `https%253A%252F%252F` - this is **double-encoded**:
- `%25` is an encoded `%` sign
- So `%253A` decodes to `%3A`, not to `:`

**Why this breaks things**: After login, when the user is redirected back to `/api/oauth/authorize`, the `redirect_uri` parameter will be corrupted. The server will see `https%3A%2F%2Fxxx.chromiumapp.org` as a literal string instead of `https://xxx.chromiumapp.org`.

**Fix**: When building the login redirect URL, URL-encode the entire `redirect` parameter value **once**, not twice. Most web frameworks handle this automatically if you use their URL builder utilities rather than manual string concatenation.

#### Issue 2: Flow Must Complete to chromiumapp.org ✅ FIXED (PR #67)

After the user logs in at `/auth/login`, they must eventually be redirected to:
```
https://<extension-id>.chromiumapp.org/?code=AUTHORIZATION_CODE&state=STATE
```

Chrome is watching for this specific redirect. When it sees it, it:
1. Intercepts the navigation (the browser never actually loads `chromiumapp.org`)
2. Closes the popup window
3. Returns the full URL to the extension

If the flow ends anywhere else (e.g., stays on a "success" page), Chrome times out and reports failure.

#### Issue 3: Social OAuth Callbacks Ignore redirectTo ✅ FIXED (PRs #69, #70)

**Status**: Fixed. Social OAuth now preserves `redirectTo` through the provider round-trip.

When users click "Continue with Google" or "Continue with GitHub", the OAuth callback handlers in `packages/auth/lib/oauth.ts` **hardcode the redirect destination**:

```typescript
// packages/auth/lib/oauth.ts lines 126-131 and 163-168
return new Response(null, {
  status: 302,
  headers: {
    Location: "/app",  // ← HARDCODED! Ignores redirectTo
  },
});
```

**The broken flow**:
1. Extension → `/api/oauth/authorize?redirect_uri=chromiumapp.org...`
2. Server → `/auth/login?redirectTo=/api/oauth/authorize?...`
3. User clicks "Continue with Google"
4. `/api/oauth/google` → Google → `/api/oauth/google/callback`
5. **Callback redirects to `/app`** (hardcoded, ignores `redirectTo`)
6. Chrome never sees `chromiumapp.org`, times out with "user did not approve"

**Why this breaks extension auth**: The `redirectTo` parameter is lost during the Google/GitHub OAuth round-trip. After social login completes, the user is sent to the dashboard instead of back to `/api/oauth/authorize` to complete the PKCE flow.

**Fix required**: The social OAuth handlers need to preserve `redirectTo` through the OAuth provider round-trip:

1. **In `createOauthRedirectHandler`** (before redirecting to Google/GitHub):
   - Read `redirectTo` from the incoming request query string
   - Store it in a cookie (e.g., `oauth_redirect_to`) alongside the existing `state` and `code_verifier` cookies

2. **In `createOauthCallbackHandler`** (after successful auth):
   - Read the `oauth_redirect_to` cookie
   - If present, redirect there instead of `/app`
   - Clear the cookie after use

**Example fix** for `createOauthCallbackHandler`:

```typescript
// After setting session cookie, before redirecting:
const redirectTo = cookies.oauth_redirect_to ?? "/app";

// Clear the redirect cookie
setCookie(event, "oauth_redirect_to", "", { maxAge: 0, path: "/" });

return new Response(null, {
  status: 302,
  headers: {
    Location: redirectTo,
  },
});
```

**Note**: This affects ALL social OAuth providers (Google, GitHub, etc.) since they share the same handler factory in `packages/auth/lib/oauth.ts`.

#### Issue 4: Password Login Redirect ✅ FIXED (PR #74)

When users logged in with username/password via tRPC (`auth.loginWithPassword`), the redirect to `/api/oauth/authorize` resulted in a 404 error. The fix ensured proper redirect handling after password-based authentication.

### Required Server Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Chrome Extension                                                             │
│                                                                              │
│  1. Generate PKCE code_verifier and code_challenge                          │
│  2. Call launchWebAuthFlow() with:                                          │
│     https://www.saypi.ai/api/oauth/authorize                                │
│       ?response_type=code                                                   │
│       &client_id=saypi-extension                                            │
│       &redirect_uri=https://xxx.chromiumapp.org/                            │
│       &code_challenge=BASE64URL_HASH                                        │
│       &code_challenge_method=S256                                           │
│       &state=RANDOM_STATE                                                   │
│       &scope=openid%20profile                                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Server: /api/oauth/authorize                                                 │
│                                                                              │
│  3. Validate request parameters (client_id, redirect_uri, etc.)             │
│  4. Store PKCE code_challenge in session/temp storage                       │
│  5. If user NOT authenticated:                                              │
│     → Redirect to /auth/login?redirect=<ORIGINAL_AUTHORIZE_URL>             │
│       (URL-encode the redirect parameter ONCE, preserving all params)       │
│  6. If user IS authenticated:                                               │
│     → Generate authorization code                                           │
│     → Redirect to: redirect_uri?code=AUTH_CODE&state=STATE                  │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                          (if not authenticated)
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Server: /auth/login                                                          │
│                                                                              │
│  7. Show login form (Google OAuth, GitHub, Magic Link, etc.)                │
│  8. User authenticates                                                       │
│  9. After successful auth, redirect to the `redirect` parameter             │
│     → This goes back to /api/oauth/authorize (step 5-6 above)               │
│     → User is now authenticated, so step 6 executes                         │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Final Redirect (CRITICAL)                                                    │
│                                                                              │
│  10. Server redirects to:                                                    │
│      https://xxx.chromiumapp.org/?code=AUTH_CODE&state=ORIGINAL_STATE       │
│                                                                              │
│  11. Chrome intercepts this, closes popup, returns URL to extension         │
│  12. Extension extracts code, exchanges for tokens at /api/oauth/token      │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Registered Redirect URIs

The server must whitelist these redirect URI patterns for `client_id=saypi-extension`:

| Environment | Redirect URI | Status |
|-------------|--------------|--------|
| Chrome (published) | `https://pepnjahikiccmajdphdcgeemmedjdgij.chromiumapp.org/` | ✅ Registered |
| Chrome (development) | May vary - extension ID changes in dev mode | ⚠️ Not registered |
| Firefox | `https://gecko@saypi.ai.extensions.allizom.org/` | ⚠️ Needs registration |

**Firefox PKCE Implementation**: Firefox uses tab-based PKCE authentication via `TabBasedPKCEAuth.ts`:
1. Opens authorization URL in a new browser tab
2. Monitors tab URL changes via `browser.tabs.onUpdated`
3. Detects redirect to `extensions.allizom.org`
4. Extracts authorization code and exchanges for tokens
5. Closes the auth tab

**Server requirement**: Register the Firefox redirect URI to enable PKCE authentication.

### Testing the Fix

After implementing:

1. Clear browser cookies/session for saypi.ai
2. Load extension, click Sign In
3. Chrome should open a popup with the login page
4. Complete login (Google OAuth, etc.)
5. Popup should **automatically close**
6. Extension should show "Signed in"

If the popup doesn't close automatically, check:
- Is the final redirect going to `chromiumapp.org`?
- Are the URL parameters properly encoded (not double-encoded)?
- Is the `redirect_uri` whitelist configured correctly?

---

## What's Needed

### 1. Authorization Endpoint Enhancement

**Endpoint**: `GET /api/oauth/authorize`

**Purpose**: Standard OAuth 2.1 authorization endpoint with PKCE support.

**Required parameters**:

| Parameter | Required | Description |
|-----------|----------|-------------|
| `response_type` | Yes | Must be `code` |
| `client_id` | Yes | `saypi-extension` |
| `redirect_uri` | Yes | Extension's registered redirect URL (e.g., `https://xxx.chromiumapp.org/`) |
| `code_challenge` | Yes | Base64URL-encoded SHA256 hash of code_verifier |
| `code_challenge_method` | Yes | Must be `S256` |
| `state` | Yes | CSRF protection token (opaque string, return unchanged) |
| `scope` | Optional | `openid profile` |

**Required behavior**:

1. **Validate parameters**: Check `client_id` is known, `redirect_uri` is whitelisted
2. **Store PKCE challenge**: Associate `code_challenge` with this authorization session (e.g., in server session or temp storage)
3. **If user not authenticated**: Redirect to login, preserving all OAuth params in the redirect URL
4. **If user authenticated**: Generate authorization code and redirect to `redirect_uri?code=CODE&state=STATE`

**Important**: When redirecting to login, the full authorize URL must be preserved so the flow can resume after login.

### 2. Token Exchange Endpoint

**Endpoint**: `POST /api/oauth/token`

**Content-Type**: `application/x-www-form-urlencoded`

Exchange authorization code for tokens, validating PKCE:

| Parameter | Required | Description |
|-----------|----------|-------------|
| `grant_type` | Yes | `authorization_code` |
| `code` | Yes | Authorization code from callback |
| `code_verifier` | Yes | Original random string (43-128 chars) |
| `redirect_uri` | Yes | Must match original request |
| `client_id` | Yes | `saypi-extension` |

**Validation**: Server computes `SHA256(code_verifier)` and compares to stored `code_challenge`. If they match, issue tokens.

**Response** (success):
```json
{
  "access_token": "eyJ...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "...",
  "scope": "openid profile"
}
```

### 3. Refresh Token Endpoint

**Endpoint**: `POST /api/oauth/token` (same endpoint, different grant_type)

| Parameter | Required | Description |
|-----------|----------|-------------|
| `grant_type` | Yes | `refresh_token` |
| `refresh_token` | Yes | Current refresh token |
| `client_id` | Yes | `saypi-extension` |

**Important**: Implement refresh token rotation - issue a new refresh token and invalidate the old one on each use.

### 4. Redirect URI Registration

Register these redirect URIs for `client_id=saypi-extension`:

| Browser | Redirect URI Pattern |
|---------|---------------------|
| Chrome | `https://<extension-id>.chromiumapp.org/` |
| Firefox | `https://<addon-id>.extensions.allizom.org/` |

The exact extension IDs will be provided once the extension is published.

## Acceptance Criteria

### Must Have

1. **PKCE validation works correctly**
   - Valid `code_verifier` → tokens issued
   - Invalid/missing `code_verifier` → 400 error
   - Mismatched `code_challenge` → 400 error

2. **Standard error responses**
   - `invalid_grant` for expired/invalid codes
   - `invalid_request` for missing parameters
   - `unauthorized_client` for unregistered redirect URIs

3. **Refresh tokens work**
   - Can exchange refresh token for new access token
   - Old refresh token is invalidated after use (rotation)

4. **Redirect URIs are validated**
   - Only registered URIs accepted
   - Exact match required (no wildcards)

### Nice to Have

1. **Token introspection endpoint** for debugging
2. **Configurable token lifetimes** per client
3. **Audit logging** of auth events

## What the Extension Will Do

For context, here's the flow from the extension's side:

1. Generate random `code_verifier` (43-128 character string)
2. Compute `code_challenge = base64url(sha256(code_verifier))`
3. Open auth URL with `code_challenge` and `state`
4. User authenticates with OAuth provider
5. Receive authorization `code` at redirect URI
6. Exchange `code` + `code_verifier` for tokens
7. Store tokens securely in extension storage
8. Use refresh token to renew access before expiry

## Timeline Considerations

**Completed milestones**:
1. ✅ Add PKCE parameters to authorization flow (PR #67)
2. ✅ Implement token endpoint with PKCE validation (PR #67)
3. ✅ Add refresh token rotation (PR #67)
4. ✅ Register Chrome extension redirect URI
5. ✅ Extension team integrates and tests (Chrome)

**Remaining work**:
- Register Firefox redirect URI (if Firefox PKCE support desired)
- Verify refresh token rotation works correctly

## Questions for SaaS Team

1. What's the preferred token lifetime for access tokens? (suggest: 1 hour)
2. What's the preferred lifetime for refresh tokens? (suggest: 30 days)
3. Are there existing OAuth libraries in use that support PKCE?
4. Any concerns about refresh token rotation for mobile clients?

## References

- [RFC 7636 - PKCE](https://tools.ietf.org/html/rfc7636)
- [OAuth 2.1 Draft](https://oauth.net/2.1/)
- [Chrome Identity API](https://developer.chrome.com/docs/extensions/reference/identity/)
- [Firefox Identity API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/identity)
