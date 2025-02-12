# Authentication Guide for Browser Extensions

This guide explains how to implement authentication in your browser extension to work with the Say, Pi API.

## Configuration

```typescript
interface SayPiConfig {
  apiBaseUrl: string;
  refreshInterval?: number; // milliseconds, default: 840000 (14 minutes)
}

const DEFAULT_CONFIG: SayPiConfig = {
  apiBaseUrl: 'https://www.saypi.ai',
  refreshInterval: 840000 // Refresh token 1 minute before expiry
};
```

## Authentication Flow

1. **Initial Authentication**
   ```typescript
   // 1. Direct user to login page
   function redirectToLogin() {
     const loginUrl = `${config.apiBaseUrl}/auth/login`;
     // Store return URL for after login
     browser.tabs.create({ url: loginUrl });
   }
   ```

2. **Capture Session Token**
   - After successful login, the SaaS application sets a session cookie
   - Your extension needs permission to read cookies for the SaaS domain:
   ```json
   {
     "permissions": [
       "cookies",
       "*://*.saypi.ai/*"
     ]
   }
   ```

3. **Exchange Session for JWT**
   ```typescript
   async function getJwtToken(sessionToken: string): Promise<{
     token: string;
     expiresIn: string;
   }> {
     const response = await fetch(`${config.apiBaseUrl}/api/auth/refresh`, {
       method: 'POST',
       headers: {
         'Cookie': `auth_session=${sessionToken}`
       }
     });

     if (!response.ok) {
       throw new Error('Failed to get JWT token');
     }

     return response.json();
   }
   ```

4. **Store and Use JWT**
   ```typescript
   interface JwtManager {
     token: string | null;
     expiresAt: number | null;
   
     async initialize() {
       const sessionToken = await getCookie('auth_session');
       if (sessionToken) {
         await this.refreshToken(sessionToken);
       }
     }

     async refreshToken(sessionToken: string) {
       const { token, expiresIn } = await getJwtToken(sessionToken);
       this.token = token;
       this.expiresAt = Date.now() + ms(expiresIn);
       
       // Schedule next refresh
       setTimeout(() => {
         this.refreshToken(sessionToken);
       }, config.refreshInterval);
     }

     getAuthHeader(): string {
       return `Bearer ${this.token}`;
     }
   }
   ```

5. **Making Authenticated API Calls**
   ```typescript
   async function callApi(endpoint: string, options: RequestInit = {}) {
     if (!jwtManager.token) {
       throw new Error('Not authenticated');
     }

     const response = await fetch(`${config.apiBaseUrl}/api/${endpoint}`, {
       ...options,
       headers: {
         ...options.headers,
         'Authorization': jwtManager.getAuthHeader()
       }
     });

     if (response.status === 401) {
       // Token expired or invalid
       await jwtManager.initialize();
       return callApi(endpoint, options); // Retry once
     }

     return response;
   }
   ```

## JWT Contents

The JWT contains user entitlements that your extension should respect:

```typescript
{
  userId: string;
  teamId: string;
  planId: string;
  ttsQuotaRemaining: number;
  ttsQuotaMonthly: number;
  name: string; // User's display name
  avatarUrl: string | null; // Optional URL to user's avatar image
  iat: number; // Issued at timestamp
  exp: number; // Expiration timestamp
}
```

## Error Handling

Handle these common scenarios:

```typescript
async function handleAuthError(error: Error) {
  switch (error.name) {
    case 'TokenExpiredError':
      await jwtManager.initialize();
      break;
    case 'NoSubscriptionError':
      redirectToPlans();
      break;
    case 'InvalidSessionError':
      redirectToLogin();
      break;
    default:
      console.error('Authentication error:', error);
  }
}
```

## Best Practices

1. **Security**
   - Store tokens securely using browser.storage.local
   - Clear tokens on logout
   - Never expose tokens to web page content

2. **Token Refresh**
   - Implement automatic refresh before expiration
   - Default token lifetime is 15 minutes
   - Refresh 1 minute before expiration

3. **Rate Limiting**
   - Respect quota limits in JWT claims
   - Implement backoff for failed requests
   - Cache successful responses when appropriate

4. **Testing**
   - Test against a development environment
   - Verify token refresh flow
   - Test error scenarios
   - Validate quota enforcement

## Development Setup

For testing against a local environment:

```typescript
const devConfig: SayPiConfig = {
  apiBaseUrl: 'http://localhost:3000',
  refreshInterval: 840000
};
```

## Support

For implementation issues:
1. Check error response details
2. Verify JWT claims structure
3. Contact info@saypi.ai for additional help
