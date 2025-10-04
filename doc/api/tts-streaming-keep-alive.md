# Client Requirement: Keep-Alive for TTS Streaming During LLM Tool Use

**Document Type:** Client-Side API Integration Guide
**Priority:** Medium
**Affected Component:** TTS Streaming Client
**Target Team:** Client Application Developers

---

## Problem Statement

When LLMs use tools (e.g., web search, code execution), they enter an extended pause where no text tokens are generated for speech synthesis. These pauses can last 20-120+ seconds, during which:

1. **No text chunks are sent** to the TTS API
2. **Server-side stream timeout** (20 seconds) terminates the stream
3. **Audio playback ends prematurely**, even though the LLM will resume generating text later

**Example timeline from production logs:**

```
16:39:14 - Last text chunk: "Let me search for current population data..."
16:39:14 to 16:41+ - No chunks (LLM performing web search)
[Server would timeout and close stream at 16:39:34 without keep-alive]
```

This creates a disjointed user experience where audio stops mid-conversation, forcing manual stream restart.

---

## Solution Overview

**New API Feature: Keep-Alive Signals**

The TTS streaming API now supports **keep-alive requests** that:
- Reset the server-side 20-second timeout counter
- Trigger immediate buffer flush (speak any pending text)
- Keep the audio stream connection alive during extended LLM pauses
- Don't consume sequence numbers or add chunks to the queue

---

## API Specification

### Keep-Alive Request

**Endpoint:** `PUT /speak/{uuid}/stream`
**Authentication:** Required (JWT token)
**Quota:** Checked (counts as minimal TTS usage)

**Request Body:**
```json
{
  "keepAlive": true
}
```

**Response (200 OK):**
```json
{
  "status": "keepalive",
  "uuid": "f8733dcc-1067-443a-8e63-b56357293f95"
}
```

### Key Properties

1. **No sequence number required** - Keep-alive is not a text chunk
2. **No text parameter needed** - Optional parameters are ignored
3. **Idempotent** - Multiple keep-alives are safe
4. **Fast** - Typically completes in <50ms

---

## Implementation Guide

### When to Send Keep-Alive

**Primary trigger: LLM tool use detection**

Send keep-alive when your client detects that the LLM is using a tool and not generating speech-worthy tokens.

**Detection strategies:**

#### Strategy 1: Explicit Tool Use Detection (Recommended)

```typescript
class LLMStreamHandler {
  private ttsStreamId: string | null = null;
  private keepAliveInterval: NodeJS.Timeout | null = null;

  handleLLMStreamEvent(event: StreamEvent) {
    if (event.type === 'tool_use_start') {
      this.startKeepAlive();
    } else if (event.type === 'tool_use_end') {
      this.stopKeepAlive();
    } else if (event.type === 'text') {
      // Normal text chunk - send to TTS
      this.sendTextChunk(event.text);
    }
  }

  private startKeepAlive() {
    if (!this.ttsStreamId || this.keepAliveInterval) return;

    // Send immediate keep-alive
    this.sendKeepAlive();

    // Then every 10-15 seconds
    this.keepAliveInterval = setInterval(() => {
      this.sendKeepAlive();
    }, 12000); // 12 seconds
  }

  private stopKeepAlive() {
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = null;
    }
  }

  private async sendKeepAlive() {
    if (!this.ttsStreamId) return;

    try {
      const response = await fetch(`/speak/${this.ttsStreamId}/stream`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.jwtToken}`
        },
        body: JSON.stringify({ keepAlive: true })
      });

      if (!response.ok) {
        console.error('Keep-alive failed:', response.status);
      } else {
        console.debug('[TTS] Keep-alive sent successfully');
      }
    } catch (error) {
      console.error('Keep-alive error:', error);
    }
  }
}
```

#### Strategy 2: Inactivity Detection (Fallback)

If your LLM stream doesn't expose tool-use events:

```typescript
class TTSStreamManager {
  private lastChunkTime: number = 0;
  private inactivityCheckInterval: NodeJS.Timeout | null = null;

  sendTextChunk(text: string) {
    this.lastChunkTime = Date.now();
    // ... send to TTS API
  }

  startInactivityMonitoring() {
    this.inactivityCheckInterval = setInterval(() => {
      const inactiveDuration = Date.now() - this.lastChunkTime;

      // If >10 seconds since last chunk, send keep-alive
      if (inactiveDuration > 10000 && inactiveDuration < 60000) {
        this.sendKeepAlive();
      }
    }, 5000); // Check every 5 seconds
  }
}
```

---

## Recommended Keep-Alive Frequency

**Guideline:** Send keep-alive every **10-15 seconds** during tool use

**Rationale:**
- Server timeout is 20 seconds
- 10-15s interval provides safety margin
- Avoids excessive API calls

**Example timing:**
```
T=0s   - LLM starts tool use → Send keep-alive immediately
T=12s  - Still in tool use → Send keep-alive
T=24s  - Still in tool use → Send keep-alive
T=30s  - LLM finishes tool, resumes text → Stop keep-alive
```

---

## Error Handling

### Keep-Alive Request Failures

```typescript
async sendKeepAlive(): Promise<boolean> {
  try {
    const response = await fetch(`/speak/${this.ttsStreamId}/stream`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.jwtToken}`
      },
      body: JSON.stringify({ keepAlive: true })
    });

    if (response.status === 401) {
      console.error('Keep-alive unauthorized - JWT may be expired');
      return false;
    }

    if (response.status === 429) {
      console.warn('Keep-alive rate limited - quota exceeded');
      return false;
    }

    if (!response.ok) {
      console.error(`Keep-alive failed with status ${response.status}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Keep-alive network error:', error);
    // Don't throw - keep-alive failure shouldn't crash the app
    return false;
  }
}
```

### Timeout Despite Keep-Alive

If the stream times out despite keep-alive signals:

1. **Check keep-alive frequency** - Should be every 10-15s
2. **Verify authentication** - JWT must be valid
3. **Check server logs** - Look for keep-alive processing confirmation
4. **Consider stream restart** - For very long operations (>5 minutes), restarting the stream may be necessary

---

## Complete Implementation Example

### TypeScript/JavaScript

```typescript
interface TTSStreamConfig {
  apiBaseUrl: string;
  jwtToken: string;
  keepAliveInterval?: number; // milliseconds, default 12000
}

class TTSStreamWithKeepAlive {
  private config: TTSStreamConfig;
  private streamId: string | null = null;
  private sequenceNumber: number = 0;
  private keepAliveTimer: NodeJS.Timeout | null = null;

  constructor(config: TTSStreamConfig) {
    this.config = {
      keepAliveInterval: 12000,
      ...config
    };
  }

  async createStream(voiceId: string, language: string): Promise<string> {
    const uuid = crypto.randomUUID();

    const response = await fetch(
      `${this.config.apiBaseUrl}/speak/${uuid}/stream?voice_id=${voiceId}&lang=${language}&app=your-app`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.jwtToken}`
        },
        body: JSON.stringify({
          text: ' ', // Start-of-stream marker
          sequenceNumber: 0
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to create stream: ${response.status}`);
    }

    this.streamId = uuid;
    this.sequenceNumber = 0;
    return uuid;
  }

  async sendTextChunk(text: string): Promise<void> {
    if (!this.streamId) {
      throw new Error('Stream not created');
    }

    this.sequenceNumber++;

    const response = await fetch(
      `${this.config.apiBaseUrl}/speak/${this.streamId}/stream`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.jwtToken}`
        },
        body: JSON.stringify({
          text: text,
          sequenceNumber: this.sequenceNumber
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to send chunk: ${response.status}`);
    }
  }

  startKeepAlive(): void {
    if (this.keepAliveTimer) {
      console.warn('Keep-alive already running');
      return;
    }

    console.log('[TTS] Starting keep-alive timer');

    // Send immediately
    this.sendKeepAlive();

    // Then periodically
    this.keepAliveTimer = setInterval(() => {
      this.sendKeepAlive();
    }, this.config.keepAliveInterval);
  }

  stopKeepAlive(): void {
    if (this.keepAliveTimer) {
      clearInterval(this.keepAliveTimer);
      this.keepAliveTimer = null;
      console.log('[TTS] Stopped keep-alive timer');
    }
  }

  private async sendKeepAlive(): Promise<void> {
    if (!this.streamId) return;

    try {
      const response = await fetch(
        `${this.config.apiBaseUrl}/speak/${this.streamId}/stream`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.jwtToken}`
          },
          body: JSON.stringify({ keepAlive: true })
        }
      );

      if (response.ok) {
        console.debug('[TTS] Keep-alive acknowledged');
      } else {
        console.error(`[TTS] Keep-alive failed: ${response.status}`);
      }
    } catch (error) {
      console.error('[TTS] Keep-alive error:', error);
    }
  }

  async endStream(): Promise<void> {
    if (!this.streamId) return;

    // Stop keep-alive first
    this.stopKeepAlive();

    this.sequenceNumber++;

    const response = await fetch(
      `${this.config.apiBaseUrl}/speak/${this.streamId}/stream`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.jwtToken}`
        },
        body: JSON.stringify({
          text: '', // End-of-stream marker
          sequenceNumber: this.sequenceNumber,
          totalChunks: this.sequenceNumber
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to end stream: ${response.status}`);
    }

    this.streamId = null;
    this.sequenceNumber = 0;
  }
}

// Usage example
const tts = new TTSStreamWithKeepAlive({
  apiBaseUrl: 'https://api.saypi.ai',
  jwtToken: 'your-jwt-token'
});

// Create stream
const streamId = await tts.createStream('voice-id', 'en-US');

// Send text chunks normally
await tts.sendTextChunk('Hello, this is the first chunk.');

// When LLM starts using a tool
tts.startKeepAlive();

// ... LLM performs tool use for 30+ seconds ...

// When LLM finishes tool use and resumes text
tts.stopKeepAlive();
await tts.sendTextChunk('Here are the search results...');

// End stream
await tts.endStream();
```

### Python

```python
import asyncio
import httpx
import uuid
from typing import Optional


class TTSStreamWithKeepAlive:
    def __init__(self, api_base_url: str, jwt_token: str, keep_alive_interval: int = 12):
        self.api_base_url = api_base_url
        self.jwt_token = jwt_token
        self.keep_alive_interval = keep_alive_interval  # seconds
        self.stream_id: Optional[str] = None
        self.sequence_number = 0
        self.keep_alive_task: Optional[asyncio.Task] = None

    async def create_stream(self, voice_id: str, language: str) -> str:
        """Create a new TTS stream."""
        stream_uuid = str(uuid.uuid4())

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.api_base_url}/speak/{stream_uuid}/stream",
                params={"voice_id": voice_id, "lang": language, "app": "your-app"},
                json={"text": " ", "sequenceNumber": 0},
                headers={"Authorization": f"Bearer {self.jwt_token}"}
            )
            response.raise_for_status()

        self.stream_id = stream_uuid
        self.sequence_number = 0
        return stream_uuid

    async def send_text_chunk(self, text: str):
        """Send a text chunk to the TTS stream."""
        if not self.stream_id:
            raise ValueError("Stream not created")

        self.sequence_number += 1

        async with httpx.AsyncClient() as client:
            response = await client.put(
                f"{self.api_base_url}/speak/{self.stream_id}/stream",
                json={"text": text, "sequenceNumber": self.sequence_number},
                headers={"Authorization": f"Bearer {self.jwt_token}"}
            )
            response.raise_for_status()

    def start_keep_alive(self):
        """Start sending periodic keep-alive signals."""
        if self.keep_alive_task and not self.keep_alive_task.done():
            print("Keep-alive already running")
            return

        print("[TTS] Starting keep-alive")
        self.keep_alive_task = asyncio.create_task(self._keep_alive_loop())

    def stop_keep_alive(self):
        """Stop sending keep-alive signals."""
        if self.keep_alive_task and not self.keep_alive_task.done():
            self.keep_alive_task.cancel()
            print("[TTS] Stopped keep-alive")

    async def _keep_alive_loop(self):
        """Internal loop for sending keep-alive signals."""
        try:
            while True:
                await self._send_keep_alive()
                await asyncio.sleep(self.keep_alive_interval)
        except asyncio.CancelledError:
            pass

    async def _send_keep_alive(self):
        """Send a single keep-alive signal."""
        if not self.stream_id:
            return

        try:
            async with httpx.AsyncClient() as client:
                response = await client.put(
                    f"{self.api_base_url}/speak/{self.stream_id}/stream",
                    json={"keepAlive": True},
                    headers={"Authorization": f"Bearer {self.jwt_token}"}
                )

                if response.status_code == 200:
                    print("[TTS] Keep-alive acknowledged")
                else:
                    print(f"[TTS] Keep-alive failed: {response.status_code}")
        except Exception as e:
            print(f"[TTS] Keep-alive error: {e}")

    async def end_stream(self):
        """End the TTS stream."""
        if not self.stream_id:
            return

        # Stop keep-alive first
        self.stop_keep_alive()

        self.sequence_number += 1

        async with httpx.AsyncClient() as client:
            response = await client.put(
                f"{self.api_base_url}/speak/{self.stream_id}/stream",
                json={
                    "text": "",
                    "sequenceNumber": self.sequence_number,
                    "totalChunks": self.sequence_number
                },
                headers={"Authorization": f"Bearer {self.jwt_token}"}
            )
            response.raise_for_status()

        self.stream_id = None
        self.sequence_number = 0


# Usage example
async def main():
    tts = TTSStreamWithKeepAlive(
        api_base_url="https://api.saypi.ai",
        jwt_token="your-jwt-token",
        keep_alive_interval=12  # seconds
    )

    # Create stream
    stream_id = await tts.create_stream("voice-id", "en-US")

    # Send text chunk
    await tts.send_text_chunk("Hello, this is the first chunk.")

    # Start keep-alive during LLM tool use
    tts.start_keep_alive()

    # Simulate long tool use
    await asyncio.sleep(30)

    # Stop keep-alive and continue
    tts.stop_keep_alive()
    await tts.send_text_chunk("Here are the results...")

    # End stream
    await tts.end_stream()


if __name__ == "__main__":
    asyncio.run(main())
```

---

## Testing

### Manual Testing

1. **Create a TTS stream** with initial text chunk
2. **Wait 15 seconds** without sending new chunks
3. **Send keep-alive** signal
4. **Wait another 15 seconds**
5. **Send final chunk and end marker**
6. **Verify** audio plays continuously without gaps

### Automated Testing

```typescript
describe('TTS Keep-Alive', () => {
  it('should prevent timeout during long pauses', async () => {
    const tts = new TTSStreamWithKeepAlive(config);
    const streamId = await tts.createStream('voice-id', 'en-US');

    // Send first chunk
    await tts.sendTextChunk('Starting...');

    // Start keep-alive
    tts.startKeepAlive();

    // Simulate 30 second pause
    await new Promise(resolve => setTimeout(resolve, 30000));

    // Stop keep-alive and finish
    tts.stopKeepAlive();
    await tts.sendTextChunk('...finished!');
    await tts.endStream();

    // Stream should complete successfully
    expect(streamId).toBeTruthy();
  });
});
```

---

## FAQ

**Q: Do I need to send keep-alive for every stream?**
A: No, only when you anticipate pauses >10 seconds (e.g., LLM tool use).

**Q: What happens if I forget to send keep-alive?**
A: The stream will timeout after 20 seconds of inactivity and close. You'll need to create a new stream.

**Q: Can I send keep-alive too frequently?**
A: Technically yes, but it's inefficient. Recommended interval is 10-15 seconds.

**Q: Does keep-alive count toward my quota?**
A: Minimally - it checks quota but consumes negligible resources.

**Q: What if keep-alive fails (network error)?**
A: Log the error but don't throw. The next keep-alive may succeed. If multiple fail, consider the stream dead and restart.

**Q: Can I mix keep-alive with normal text chunks?**
A: Yes! Keep-alive doesn't affect normal chunk sending. It's an independent signal.

**Q: What happens if I send keep-alive on a non-existent stream?**
A: The API will return a 404 or similar error. Handle this gracefully in your client.

---

## Related Documentation

- **TTS_RACE_CONDITION_FIX.md** - Server-side chunk sequencing with `totalChunks` parameter
- **CLIENT_REQ_TEXT_DEDUPLICATION.md** - Client-side text deduplication for LLM streaming
- **CLIENT_REQ_AUDIO_BUFFERING.md** - Client-side audio buffering for smooth playback

---

## Support

For questions or issues with keep-alive implementation, contact the Say, Pi API backend team or file an issue in the API repository.
