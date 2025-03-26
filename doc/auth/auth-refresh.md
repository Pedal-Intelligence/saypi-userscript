# Browser Extension Authentication: Session Token and JWT Refresh

This guide explains how the JWT refresh endpoint works and highlights an important detail regarding how the session token is provided in different environments.

## Background

In the Say, Pi SaaS API, the refresh endpoint (`apps/web/server/api/auth/refresh.post.ts`) expects a session token on `event.context.sessionToken`. In the unit tests (see [refresh.spec.ts](apps/web/server/api/auth/refresh.spec.ts)), the session token is set explicitly in the test event:

```typescript
event.context.sessionToken = 'test-token';
```

However, when an actual client (such as a browser extension) makes a request, **the session token must be provided by the client**—typically via a session cookie.

## What Happens in Production

When a user logs in through the SaaS application, the server sets a session cookie (with the name defined by `config.auth.sessionCookieName`). A middleware (or an earlier part of request processing) is responsible for reading this cookie and populating `event.context.sessionToken` before the refresh handler is executed.

If the session token is **not** passed in the cookie or otherwise attached to the context, the handler will respond with a 401 error:

```typescript
if (!event.context.sessionToken) {
  throw createError({
    status: 401,
    message: 'Unauthorized - No session token',
  });
}
```

## Instructions for Extension Developers

When integrating with the Say, Pi API from your browser extension, keep the following in mind:

1. **Include the Session Token:**
   - Ensure that the session token (typically stored in a cookie named according to `config.auth.sessionCookieName`) is sent along with the HTTP request to the refresh endpoint.
   - When using the `fetch` API, set `credentials: 'include'` so that cookies are automatically included:
     ```typescript
     const response = await fetch(`${config.apiBaseUrl}/api/auth/refresh`, {
       method: 'POST',
       credentials: 'include',  // Ensures the session cookie is sent
       headers: {
         "Content-Type": "application/json",
       },
     });
     ```
   
2. **Cookie Permissions:**
   - In your extension's manifest, include permissions to access cookies for the SaaS domain:
     ```json
     {
       "permissions": [
         "cookies",
         "*://www.saypi.ai/*"
       ]
     }
     ```
   - This allows your extension to read or ensure that cookies are set properly.

3. **Environment Configuration:**
   - By default, the SaaS application is deployed at `https://www.saypi.ai`. However, you may be testing against a different endpoint locally or in staging. Make sure to provide a configurable parameter (e.g., `apiBaseUrl`) in your extension so that you can switch endpoints as needed:
     ```typescript
     interface SayPiConfig {
       apiBaseUrl: string;
       refreshInterval?: number; // milliseconds, default: 840000 (14 minutes)
     }

     const DEFAULT_CONFIG: SayPiConfig = {
       apiBaseUrl: 'https://www.saypi.ai',
       refreshInterval: 840000 // Refresh 1 minute before a typical 15-minute expiry
     };
     ```

4. **Handling the Refresh Flow:**
   - Call the refresh endpoint to obtain a new JWT before the current token expires. A sample flow:
     ```typescript
     async function getJwtToken(): Promise<{ token: string; expiresIn: string }> {
       const response = await fetch(`${config.apiBaseUrl}/api/auth/refresh`, {
         method: 'POST',
         credentials: 'include'
       });
       
       if (!response.ok) {
         throw new Error('Failed to refresh token');
       }
       
       return response.json();
     }
     ```
   - Store the JWT securely within your extension and use it in the `Authorization` header for subsequent API calls.

5. **Troubleshooting:**
   - If you receive a `401 Unauthorized - No session token` error, verify the following:
     - The client is sending the session cookie (check the network tab for the cookie header).
     - The cookie name matches what the SAS application expects.
     - Your extension’s network requests are configured with `credentials: 'include'`.

## Summary

- **Unit Testing vs. Real Client:** In unit tests, `event.context.sessionToken` is set manually. In production, your extension must ensure that the session cookie is sent along with the HTTP request so that server-side middleware can populate `event.context.sessionToken`.
- **Ensure Proper Cookie Handling:** Use `credentials: 'include'` and proper permissions in your extension manifest.
- **Configurable Endpoints:** Use a configurable `apiBaseUrl` to switch between production (`https://www.saypi.ai`) and development/test environments.

By following these steps, you can authenticate your browser extension with the Say, Pi API and manage JWT token refreshes reliably.

For further details on JWT usage and endpoint responses, refer to:
- [JWT Authentication Documentation](docs/api/auth-jwt.md)
- [Core Authentication Overview](docs/api/auth.md)