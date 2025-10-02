# TTS Streaming API `totalChunks` Parameter

## Overview

The `totalChunks` parameter is an optional but recommended addition to the TTS streaming API that improves how the server synchronizes end-of-stream events. Including the parameter when you send the end marker eliminates race conditions and minimizes latency when closing streams.

**When to use**: Add `totalChunks` to the final PUT request in a stream to tell the server exactly how many chunks were sent.

---

## Quick Start

### Before (works, but can have race conditions)

```javascript
// Send chunks
await fetch('/speak/{uuid}/stream', {
  method: 'PUT',
  body: JSON.stringify({
    text: "Hello world",
    sequenceNumber: 1
  })
});

// Send end marker
await fetch('/speak/{uuid}/stream', {
  method: 'PUT',
  body: JSON.stringify({
    text: "",
    sequenceNumber: 2
  })
});
```

### After (recommended — eliminates race conditions)

```javascript
// Send chunks
await fetch('/speak/{uuid}/stream', {
  method: 'PUT',
  body: JSON.stringify({
    text: "Hello world",
    sequenceNumber: 1
  })
});

// Send end marker WITH totalChunks
await fetch('/speak/{uuid}/stream', {
  method: 'PUT',
  body: JSON.stringify({
    text: "",
    sequenceNumber: 2,
    totalChunks: 2  // ← NEW: "This is chunk 2 of 2"
  })
});
```

---

## API Reference

### `PUT /speak/{uuid}/stream`

Updates a TTS stream with new text or closes the stream.

**Headers**
- `Content-Type: application/json`
- `Authorization: Bearer {token}`

**Body Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `text` | string | Yes | Text to synthesize. Empty string `""` marks end-of-stream. |
| `sequenceNumber` | integer | Yes | Sequential chunk number (1, 2, 3, ...). Must increment for each chunk. |
| `totalChunks` | integer | No | Total number of chunks in the stream. Include when sending the end marker for optimized synchronization. |

**Example Request (end marker with `totalChunks`)**

```json
PUT /speak/abc-123/stream
Content-Type: application/json

{
  "text": "",
  "sequenceNumber": 5,
  "totalChunks": 5
}
```

**Response**

```json
HTTP/1.1 200 OK

{
  "message": "End of input stream"
}
```

---

## How It Works

### Without `totalChunks` (backward compatible)

When you omit the parameter, the server waits 500ms after receiving the end marker before closing the stream to ensure prior chunks have been processed.

```
You: PUT seq=3 (final chunk) → Server: adds to queue
You: PUT seq=4 (end marker)  → Server: waits 500ms, then closes stream
```

Result: Works reliably but adds a 500ms delay to every stream completion.

### With `totalChunks` (optimized)

Adding the parameter allows the server to synchronize intelligently. It only waits until all preceding chunks have been processed.

```
You: PUT seq=3 (final chunk) → Server: adds to queue
You: PUT seq=4, totalChunks=4 → Server: checks if seq 1-3 processed
                               ↓ Already done? Add end marker immediately
                               ↓ Still processing? Poll every 50ms until ready
```

Result: Near-zero latency when previous chunks are done, or a minimal wait (typically 50–100ms) if work is still in flight.

---

## Implementation Guide

### JavaScript / TypeScript

```typescript
class TTSStreamClient {
  private sequenceNumber = 0;

  async sendChunk(uuid: string, text: string): Promise<void> {
    this.sequenceNumber++;

    const response = await fetch(`/speak/${uuid}/stream`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        text,
        sequenceNumber: this.sequenceNumber
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to send chunk: ${response.statusText}`);
    }
  }

  async closeStream(uuid: string): Promise<void> {
    this.sequenceNumber++;

    const response = await fetch(`/speak/${uuid}/stream`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        text: "",
        sequenceNumber: this.sequenceNumber,
        totalChunks: this.sequenceNumber
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to close stream: ${response.statusText}`);
    }

    this.sequenceNumber = 0;
  }
}

// Usage
const client = new TTSStreamClient(apiKey);
await createStream(uuid);
await client.sendChunk(uuid, "First chunk");
await client.sendChunk(uuid, "Second chunk");
await client.sendChunk(uuid, "Third chunk");
await client.closeStream(uuid);
```

### Python

```python
import httpx

class TTSStreamClient:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.sequence_number = 0

    async def send_chunk(self, uuid: str, text: str):
        self.sequence_number += 1

        async with httpx.AsyncClient() as client:
            response = await client.put(
                f"/speak/{uuid}/stream",
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {self.api_key}"
                },
                json={
                    "text": text,
                    "sequenceNumber": self.sequence_number
                }
            )
            response.raise_for_status()

    async def close_stream(self, uuid: str):
        self.sequence_number += 1

        async with httpx.AsyncClient() as client:
            response = await client.put(
                f"/speak/{uuid}/stream",
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {self.api_key}"
                },
                json={
                    "text": "",
                    "sequenceNumber": self.sequence_number,
                    "totalChunks": self.sequence_number
                }
            )
            response.raise_for_status()

        self.sequence_number = 0

# Usage
client = TTSStreamClient(api_key="your-key")
await create_stream(uuid)
await client.send_chunk(uuid, "First chunk")
await client.send_chunk(uuid, "Second chunk")
await client.send_chunk(uuid, "Third chunk")
await client.close_stream(uuid)
```

---

## Benefits

### Performance

| Scenario | Without `totalChunks` | With `totalChunks` |
|----------|----------------------|-------------------|
| Chunks already processed | 500ms delay | ~0ms (immediate) |
| Chunks still processing | 500ms delay | 50–100ms (minimal wait) |
| Slow processing | 500ms delay | Up to 5s (then timeout) |

### Reliability

- ✅ Eliminates race conditions — server knows exactly what to wait for
- ✅ Explicit synchronization — no fixed delays required
- ✅ Graceful degradation — falls back to delay if value missing or invalid
- ✅ Backward compatible — existing clients continue to work

---

## Edge Cases

### Invalid `totalChunks`

If the server receives an invalid value (for example a string or negative number), it logs a warning, falls back to the 500ms delay, and continues processing. The stream still completes successfully.

### Mismatched `totalChunks`

If `totalChunks` is greater than the final `sequenceNumber`, the server waits (up to 5 seconds) for the missing chunks. If they never arrive it times out, adds the end marker anyway, and the stream still finishes.

### First Chunk Is the End Marker

Sending the end marker as the first chunk (sequence 1) with `totalChunks: 1` closes the stream immediately. This is valid but produces no audio output.

---

## Migration Checklist

1. Track `sequenceNumber` for each stream and increment it with every chunk.
2. Include `totalChunks` when you send the final empty-text chunk.
3. Reset your `sequenceNumber` counter after the stream closes.

---

## Testing Tips

### Verify Smart Synchronization

```bash
# 1. Create stream
POST /speak/test-123/stream?voice_id=xxx&lang=en&app=test

# 2. Send chunks with small delays
PUT /speak/test-123/stream
{"text": "Chunk 1", "sequenceNumber": 1}

sleep 0.1

PUT /speak/test-123/stream
{"text": "Chunk 2", "sequenceNumber": 2}

sleep 0.1

# 3. Send end marker with totalChunks
PUT /speak/test-123/stream
{"text": "", "sequenceNumber": 3, "totalChunks": 3}
```

Expected: Response returns within ~50ms once prior chunks are processed.

### Verify Fallback Mode

```bash
PUT /speak/test-123/stream
{"text": "", "sequenceNumber": 3}
```

Expected: Works correctly but includes the 500ms fallback delay.

---

## Troubleshooting

- **TTS audio cuts off early** → Ensure the final request includes `totalChunks` so the server waits for all chunks.
- **Long delay before completion** → Likely missing `totalChunks`. Add it for optimized completion.
- **Server timeout warnings** → Investigate slow processing (Redis latency, ElevenLabs delays). The server continues after 5 seconds even if chunks are late.

---

## FAQ

- **Is `totalChunks` required?** No. Without it the server uses the 500ms fallback delay.
- **What if the value is wrong?** The server waits up to 5 seconds, then completes anyway.
- **Should I send it on non-final chunks?** No. It is only used when `text === ""` (the end marker).
- **Does this break older clients?** No. The feature is fully backward compatible.
- **How much faster is it?** Typically 400–500ms faster (0–100ms vs. 500ms delay).

---

## Summary

Add `totalChunks` to your end marker request for faster, race-free completion:

```diff
  {
    "text": "",
    "sequenceNumber": 4,
+   "totalChunks": 4
  }
```

This small change provides explicit synchronization, removes race conditions, and keeps legacy clients working without modification.
