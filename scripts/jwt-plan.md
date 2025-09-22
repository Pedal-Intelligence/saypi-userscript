────────────────────────────  
1. Configuration & Environment Variables [DONE]  
────────────────────────────  
• We already have a ConfigModule (ConfigModule.js) that loads environment variables like APP_SERVER_URL and API_SERVER_URL.  
• Add a new environment variable (e.g., process.env.AUTH_SERVER_URL) to point to the server handling JWT authentication (distinct from the speech API server).  
• Also add any additional environment variables for session lifetime (e.g., AUTH_SESSION_LIFETIME or similar) so that JWT refresh/expiration intervals can be configured externally.  

────────────────────────────  
2. Login Flow & UI Integration (Popup) [DONE]  
────────────────────────────  
• Rather than automatically redirecting the user to log in, add a new "Profile" or "Sign In" section at the top of popup.html.  
  – This section should display the user's current authentication status and offer a "Sign In" (or "Log In") button if the user is not authenticated.  
• When a user clicks the "Sign In" button, invoke a function (redirectToLogin) that:
  – Constructs the login URL using the new AUTH_SERVER_URL (e.g., AUTH_SERVER_URL + '/auth/login')  
  – Opens a new browser tab for the login flow  
  – Saves a return URL so that, once authenticated, the extension can resume its workflow  
• If a user never initiates this login, the extension should continue to allow API calls as "unauthenticated" (see API requirements below).

────────────────────────────  
3. JWT Exchange, Storage & Refresh  [DONE]
────────────────────────────  
• After login, when the session cookie (e.g., auth_session) is set on the AUTH_SERVER_URL domain, use a getCookie function to read it.  
• Implement a getJwtToken function that uses the session cookie in a POST request to AUTH_SERVER_URL (e.g., '/api/auth/refresh') to exchange it for a JWT and expiration info.  
• Create a JwtManager module that:
  – Stores the JWT token and its expiration timestamp
  – Has an initialize() method that checks for the session cookie, exchanges it for a JWT (if available), and sets up automatic token refresh after an interval (configurable via environment variables so that sessions are long-lived)  
  – Provides a getAuthHeader() method that returns the Authorization header value ("Bearer token"), but only if a JWT exists  
• The JwtManager should be initialized in the background script, not the popup. Because they execute in different contexts, the popup cannot access the JwtManager, so uses its own logic to parse the JWT from the cookie.

────────────────────────────  
3.5 Showing User Quota, Concluding Multilingual Voices Beta [DONE]
────────────────────────────  
* With the release of this update, the Multilingual Voices beta will be complete.
* Move TTS settings out of beta, replacing the "Beta Active" section with a "Quota" section that displays the user's quota and remaining usage.
* For users without TTS credits, the "Multilingual voices" section should be replaced with a "Upgrade" section that displays a button to upgrade to a paid plan.

────────────────────────────  
3.6 Quotas, Claims & Entitlements [DONE]
────────────────────────────
We plan to leverage the JWT token returned from the authentication server to include user-specific quota and entitlement details. Below is our proposed approach:

1. JWT Token Claims: 
   • The JWT token obtained during the authentication (see auth.md and auth-refresh.md) will include claims representing the user's quotas (e.g., quota_total, quota_remaining) and other entitlements.

2. Enhancing JwtManager:
   • Update the JwtManager module to decode the JWT token and extract quota and entitlement claims.
   • Add a new method (e.g., getQuotaDetails) that returns these values in a structured format.

3. Integrating with the Popup UI:
   • Modify the quota display component in popup.html (and its associated script in status-tts.js) to check for the presence of a valid JWT token.
   • If authenticated and the JWT token contains quota details, use them to populate the quota progress bar and upgrade prompt in the extension settings.
   • If the token is missing or lacks quota information, revert to the current behavior using the generic TTS status endpoint from the API server.

4. Token Refresh and Updates:
   • Ensure that the token refresh process (outlined in auth-refresh.md) updates the quota claims, so the extension always displays current user-specific data.

5. Fallback and Error Handling:
   • When quota claims are absent or error occurs during decoding, gracefully fall back to default quota values retrieved from the API server.

This approach aligns quota-related UI elements directly with the authenticated state of the user, ensuring that the quotas reflect the actual entitlements specified by the authentication server.

────────────────────────────  
3.7 Showing User Profile [DONE]
────────────────────────────
• Display the user's profile information (e.g., name, userId, avatar) in the popup.html when the user is authenticated.
* KISS: In this initial release, we will only display the name, so that the user can quickly verify that the extension is working at a glance.
** E.g. "Hi, [name]!" or "Signed in as [name]"
* data should be fetched from the JWT token (see auth.md for jwt contents)
* userId and name are required fields in the JWT token, avatar is optional

────────────────────────────  
3.8 Detailed Profile Display [SKIPPED]
────────────────────────────
* Display additional user profile information in the popup.html when the user is authenticated.
* Feature the user's name, userId, and avatar.
* if avatar is not available, display a generic circular icon with the user's initials
* name, userId, and avatar should be displayed in a top corner of the popup.html


────────────────────────────  
4. Making API Requests (Authenticated & Unauthenticated) [DONE]
────────────────────────────  
• Implement a generic callApi() function that will:
  – Check whether a JWT token is available in the JwtManager  
  – If a token exists, attach it in the Authorization header  
  – If no token is found, proceed with the API call without an Authorization header (since some endpoints allow unauthenticated calls)  
  – Upon receiving a 401 from the API, do not automatically prevent use or force a login gesture—simply return the response error so that the UI or business logic can decide what to do (for instance, prompt the user to sign in or show a restricted functionality message)  

────────────────────────────  
5. Manifest (v3) Considerations  [DONE]
────────────────────────────  
• Update manifest.json to ensure the extension can access session cookies for authentication:
  – Add the "cookies" permission so that the extension is allowed to read the auth_session cookie. For example:
  "permissions": ["storage", "cookies"],
  – Expand host_permissions to include the auth server's domain (for example, "https://www.saypi.ai/*" if that's where AUTH_SERVER_URL points). This is crucial because using cookies across domains requires explicit host permissions in manifest v3.  
• Verify that content scripts/background scripts have access to the required cookies and that proper cross-origin requests are allowed given the header additions.

────────────────────────────  
6. Error Handling & Fallbacks  
────────────────────────────  
• Within the JwtManager, build error handlers (e.g., handleAuthError) that will:
  – On errors like TokenExpiredError, trigger a token refresh (or prompt the user via the profile section if needed)
  – On errors like InvalidSessionError, advise the user to sign in (but do not auto-redirect, since login should be user-initiated)  
• Keep logging and error handling robust to help diagnose if non-authenticated API calls are allowed but then denied by the API, so that UI feedback can be appropriate.

────────────────────────────  
7. Long-Lived Sessions  
────────────────────────────  
• Rely on the configurable environment variable (e.g., AUTH_SESSION_LIFETIME) to set how often tokens are refreshed and how long the session remains valid—aiming to reduce the frequency of reauthentication for the user.

────────────────────────────  
Summary  
────────────────────────────  
• Introduce an AUTH_SERVER_URL environment variable in the ConfigModule alongside the existing API and app server URLs.  
• Integrate a profile/sign-in section at the top of popup.html, allowing users to log in when they choose rather than automatically.  
• Update manifest.json to include "cookies" in permissions and the appropriate host permissions for the auth domain, ensuring that session cookies can be accessed.  
• Ensure that the JWT manager handles token retrieval and refresh based on a long-lived session model while API calls gracefully allow unauthenticated requests (acting based on API response errors rather than preemptively blocking requests).  

This plan balances the user experience—allowing the extension to work with or without a logged-in state—while providing robust JWT-based authentication when the user opts in via the extension settings.
