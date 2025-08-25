# CSP Bypass Implementation

This document describes the implementation of API request routing through the background service worker to bypass Content Security Policy (CSP) restrictions on host pages.

## Problem Statement

Some host pages (e.g., `gemini.google.com`) enforce restrictive Content Security Policy (`connect-src`) that blocks network requests initiated from the page realm to `https://api.saypi.ai` and `https://www.saypi.ai`. This breaks critical extension functionality including:

- Audio transcription uploads
- Authentication token refresh
- Voice synthesis requests

## Solution Overview

The solution routes SayPi API requests through the extension's background service worker, which operates in its own context and is not subject to the host page's CSP restrictions.

## Architecture

### 1. ApiRequestSerializer (`src/utils/ApiRequestSerializer.ts`)

Handles serialization and deserialization of API requests for transmission between content scripts and the background service worker via structured clone.

**Key Features:**
- Serializes `FormData` and `Blob` objects that cannot be directly passed through `chrome.runtime.sendMessage`
- Converts binary data to `ArrayBuffer` for structured clone compatibility
- Provides utilities to detect when requests should be routed via background

**API:**
- `serializeApiRequest(url, options)` - Converts fetch request to serializable format
- `deserializeApiRequest(serialized)` - Reconstructs fetch request in background
- `shouldRouteViaBackground(url)` - Determines if URL should be proxied

### 2. Background API Handler (`src/svc/background.ts`)

Extends the existing background service worker with an `API_REQUEST` message handler.

**Key Features:**
- Deserializes API requests from content scripts
- Adds JWT authorization headers for SayPi domains using `JwtManager`
- Handles 401/403 responses with automatic token refresh and retry
- Returns normalized response data to content scripts
- Integrates with existing message routing architecture

**Message Flow:**
```
Content Script → API_REQUEST message → Background Worker → fetch() → Response → Content Script
```

### 3. Updated ApiClient (`src/ApiClient.ts`)

Modified the main `callApi` function to intelligently route requests.

**Routing Logic:**
1. Check if URL is a SayPi domain (`shouldRouteViaBackground`)
2. If yes, attempt to route via background service worker
3. If background routing fails, fall back to direct fetch
4. For non-SayPi URLs, use direct fetch

**Backward Compatibility:**
- Maintains existing `callApi` interface
- Preserves all authentication and retry logic
- Falls back gracefully when background routing unavailable

## Implementation Details

### FormData/Blob Handling

Challenge: `FormData` and `Blob` objects cannot be transmitted via `chrome.runtime.sendMessage` due to structured clone limitations.

Solution: 
- Convert `Blob` objects to `ArrayBuffer` + MIME type
- Serialize `FormData` entries individually, handling mixed content types
- Reconstruct objects in background service worker

```typescript
interface SerializedBlob {
  type: 'Blob';
  data: ArrayBuffer;
  mimeType: string;
}

interface SerializedFormData {
  type: 'FormData';
  entries: Array<[string, string | SerializedBlob]>;
}
```

### Authentication Integration

The background handler integrates seamlessly with the existing JWT authentication system:

1. Adds `Authorization` header for SayPi API requests
2. Handles 401/403 responses by calling `jwtManager.refresh(true)`
3. Retries request once with refreshed token
4. Maintains auth state across content script/background boundary

### Error Handling

Comprehensive error handling ensures reliability:

- Network errors propagated to content script
- CSP failures trigger background routing
- Background unavailability falls back to direct fetch
- Maintains error context and types

## Testing

### Unit Tests

**ApiRequestSerializer Tests** (`test/utils/ApiRequestSerializer.spec.ts`):
- FormData/Blob serialization round-trips
- URL routing detection
- Edge cases and error conditions

**Background Handler Tests** (`test/BackgroundApiHandler.spec.ts`):
- Authentication header injection
- 401/403 retry flows
- Error propagation

### Integration Testing

Created `test-csp-bypass.html` for manual verification:
- Direct fetch test (should fail due to CSP)
- Extension API test (should succeed via background)
- FormData upload test (tests serialization)

## Deployment Notes

### Manifest Requirements

The extension already has necessary permissions:
- `host_permissions` for `https://api.saypi.ai/*` and `https://www.saypi.ai/*`
- `offscreen` permission for background document access

### Browser Compatibility

- **Chrome 88+**: Full support via background service worker
- **Firefox**: Falls back to direct fetch (CSP permitting)
- **Safari**: Falls back to direct fetch (CSP permitting)

### Performance Considerations

- Message passing adds ~10-20ms latency vs direct fetch
- FormData serialization adds minimal overhead for typical audio files
- Background service worker reuses existing JWT management

## Security Considerations

- Only SayPi domains are routed through background
- Authentication headers only added to appropriate domains
- Maintains CORS compliance
- No credential leakage to unauthorized domains

## Future Enhancements

1. **Retry Logic**: Could add exponential backoff for network failures
2. **Caching**: Could implement response caching in background for repeated requests
3. **Metrics**: Could track CSP bypass usage for telemetry
4. **Optimizations**: Could batch multiple requests for efficiency

## Troubleshooting

**Common Issues:**

1. **CSP still blocking**: Verify extension permissions and host_permissions in manifest
2. **Auth failures**: Check JWT token validity and refresh logic
3. **FormData issues**: Verify Blob serialization in browser dev tools
4. **Background unavailable**: Extension service worker may be inactive

**Debug Tools:**

1. Chrome DevTools → Extensions → Service Worker console
2. Content script console for routing decisions
3. Network tab to verify request origins
4. Test page included for manual verification