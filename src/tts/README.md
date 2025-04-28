# Text to Speech Module

This module provides text-to-speech capabilities for the application.

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