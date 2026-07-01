# Text to Speech Module

This module provides text-to-speech capabilities for the application.

## Audio engines (providers)

The extension **never calls a TTS vendor directly**. Every engine — ElevenLabs,
OpenAI, 60dB, and the Pi value‑tier voices — is proxied by the SayPi backend
(`api.saypi.ai`). The content script only speaks SayPi's own contract
(`/voices`, `/speak/{uuid}/stream`, `/transcribe`), so all engines share one
unified voice menu, one billing model, and one audio pipeline.

Each voice the server returns carries a `powered_by` string. `SpeechModel.ts`
(`audioProviders.retrieveProviderByEngine`) maps it to the domain that actually
streams the audio:

| `powered_by` | Streamed from | Audio provider |
| --- | --- | --- |
| `ElevenLabs` | api.saypi.ai | SayPi |
| `OpenAI` | api.saypi.ai | SayPi |
| `60dB` | api.saypi.ai | SayPi |
| `inflection.ai` | pi.ai | Pi |
| *(anything else)* | api.saypi.ai (assumed) | SayPi (logs a warning) |

> **Adding an engine** is therefore a one‑line `case` here plus a logo asset at
> `public/icons/logos/<powered_by lowercased>.svg` (the voice menu builds the
> logo path from `powered_by`, see `TTSControlsModule.createTtsLogo`). The
> `powered_by` literal is the single coupling between client and backend: the
> routing `switch` matches it **case‑sensitively** and the logo filename is its
> lowercase form.

### 60dB

60dB (`api.60db.ai`) is wired on the **client** (routing `case "60dB"`, logo
`public/icons/logos/60db.svg`, regression test in
`test/tts/AudioProviders.spec.ts`). It is fully active only once the
**api.saypi.ai backend** proxies 60dB behind `/voices`, `/speak`, and
`/transcribe`. The end‑to‑end contract (voice‑field mapping, the 60dB WebSocket
`create_context → send_text → flush/close` lifecycle, and STT routing) is
specified in [`doc/60db-integration.md`](../../doc/60db-integration.md).

## Handling Failed Utterances

The TTS service can now handle expected failures (like insufficient credits) by returning a `FailedSpeechUtterance` object instead of throwing an error. Here's an example of how to handle this in a UI component:

```typescript
import { isFailedUtterance } from "./SpeechModel";
import { SpeechFailureReason } from "./SpeechFailureReason";

// Example function to handle speech streaming
function handleStreamedSpeech(streamedSpeech: StreamedSpeech) {
  const { utterance } = streamedSpeech;
  
  // Check if the utterance is a failed utterance
  if (isFailedUtterance(utterance)) {
    // Check the reason for the failure
    switch (utterance.reason) {
      case SpeechFailureReason.InsufficientCredit:
        ui.showCreditPrompt("You don't have enough credits to generate speech. Would you like to purchase more?");
        break;
      case SpeechFailureReason.RateLimited:
        ui.showRateLimitMessage("You've exceeded the rate limit for speech generation. Please try again later.");
        break;
      default:
        ui.showGenericError("Unable to generate speech at this time.");
    }
    return;
  }
  
  // Normal speech playback logic for successful utterances
  playAudio(utterance.uri);
}
```

This approach:
1. Keeps the control flow clean - 429 responses are not exceptions, so you don't need try/catch blocks for normal logic
2. Makes the code more maintainable - new failure reasons can be added easily by updating the enum
3. Provides type safety - the `kind` tag makes exhaustive switch statements possible
4. Avoids silent failures - every StreamedSpeech contains a concrete utterance object

## Extending with new failure reasons

To add a new failure reason:

1. Add the reason to the `SpeechFailureReason` enum
2. Update the TTS service to return the new reason when appropriate
3. Update UI handlers to display appropriate messages for the new reason 