# `/status.json` Endpoint Documentation

## Overview
Lightweight status endpoint designed for browser extension and web app consumption. Provides real-time operational status without exposing sensitive internal metrics.

## Endpoint Details
- **URL**: `https://api.saypi.ai/status.json`
- **Method**: `GET`
- **Auth**: None required
- **Cache**: `Cache-Control: public, max-age=30`
- **Size**: Always ≤5KB
- **Response Time**: p99 <50ms

## Response Schema

```json
{
  "version": 1,
  "overall": "operational",
  "since": "2024-10-11T09:10:00Z",
  "components": [
    {"name": "API", "status": "operational"},
    {"name": "Speech-to-Text", "status": "operational"},
    {"name": "Text-to-Speech", "status": "operational"},
    {"name": "Storage", "status": "operational"}
  ],
  "incidents": []
}
```

## Field Definitions

### `overall` Status Values
- `"operational"` - All systems functioning normally
- `"degraded"` - Minor issues, service still available
- `"partial_outage"` - Some features unavailable
- `"outage"` - Major service disruption

### `since`
ISO 8601 timestamp indicating when current status began (earliest active incident or current time if operational).

### `components`
Fixed array of 4 service components, each with:
- `name`: Component identifier
- `status`: Same values as `overall` status

### `incidents` (Optional)
Array of active incidents from Better Stack:
```json
{
  "id": "bsk_20250923_xyz",
  "status": "investigating|identified|monitoring|resolved",
  "title": "Brief incident description",
  "started_at": "2025-09-23T19:20:00Z",
  "updated_at": "2025-09-23T20:00:00Z",
  "severity": "minor|major|critical"
}
```

## Usage Recommendations

### Browser Extension Implementation
```javascript
async function getSystemStatus() {
  try {
    const response = await fetch('https://api.saypi.ai/status.json', {
      headers: { 'Accept': 'application/json' },
      cache: 'no-cache'  // Respect server cache headers
    });

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.warn('Status check failed:', error);
    return null;
  }
}

// Poll every 60 seconds (server caches for 30s)
setInterval(getSystemStatus, 60000);
```

### Status Interpretation
- **Green/Operational**: `overall === "operational"`
- **Yellow/Degraded**: `overall === "degraded"`
- **Red/Issues**: `overall === "partial_outage"` or `overall === "outage"`
- **Show incidents**: When `incidents.length > 0`, display active incidents to user

### Component-Level Display
Each component maps to user-facing features:
- **API**: Core transcription/TTS requests
- **Speech-to-Text**: Audio transcription functionality
- **Text-to-Speech**: Voice synthesis
- **Storage**: Audio file handling

### Error Handling
- **Network failure**: Assume operational, show cached status
- **Non-200 response**: Treat as degraded service
- **Invalid JSON**: Log error, use fallback status

## Update Frequency
- Server refreshes status every 20 seconds internally
- Clients should poll every 30-60 seconds
- Server cache reduces load while keeping data fresh
- Incidents update within 60 seconds of Better Stack changes

## Integration Notes
- No authentication required - safe for client-side use
- CORS enabled for browser requests
- Consistent schema (version field allows future changes)
- Always returns 200 OK with status data (never 503 for degraded states)