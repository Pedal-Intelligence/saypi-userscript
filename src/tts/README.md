# Text to Speech Module

This module provides text-to-speech capabilities for the application.

## Resolving a saved voice

A failed catalog request is not evidence that a saved voice was removed. Even
a successful catalog omission or a by-ID 404 can mean that the API temporarily
disabled that provider. Preference lookup therefore preserves the saved ID when
it cannot resolve it (#604); explicit set/unset actions own changes to the choice.
This also prevents a delayed lookup from overwriting newer choices.

`getVoice` returns null while the voice is unavailable, while `hasVoice` remains
true because the choice is still saved. Callers must distinguish that state from
an explicit native-voice/voice-off choice. While signed in, an unresolved remote
choice retains SayPi as the selected provider, keeping host audio suppressed;
synthesis returns a silent placeholder until that voice resolves. Keeping
provider ownership stable lets recovered speech pass the existing output guard
without a new provider event. While signed out, a remote choice falls back to
the host's native provider (Pi or ChatGPT, otherwise none), whether the voice
resolved or is unavailable, since SayPi cannot synthesize without authentication.
Auth is checked after the preference reads, including a sign-out during lookup.
The saved choice survives both states. Native Pi IDs resolve locally and remain
usable without the API. Settings can use the
two preference reads to explain unavailability honestly.

A missing ID can trigger a host-scoped refresh once the last successful catalog
response is at least 60 seconds old. Concurrent lookups share that refresh, and
successful empty catalogs observe the same cooldown. This bounds repeated
lookups from message decoration and speech creation while allowing a disabled
provider to recover on later demand. Auth/account changes invalidate the cache
and cooldown immediately. Valid cached choices incur no extra request, and
there is no background polling or by-ID probe. Failed requests do not populate
the cache; the next caller may retry them.

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
