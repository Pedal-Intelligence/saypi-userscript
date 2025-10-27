# Dual-Phase Contextual Transcription for Dictation

This document describes the two-phase transcription system used in dictation mode to balance real-time responsiveness with high accuracy.

## Overview

In dictation mode, each dictation target (form field or input element) receives transcriptions through two distinct phases:

1. **Phase 1 (Live Streaming)**: Fast, incremental transcription of speech as it's captured
2. **Phase 2 (Refinement)**: High-accuracy re-transcription of accumulated audio with full context

## Phase 1: Live Streaming

### Purpose
Provide immediate visual feedback to the user as they speak, creating a responsive real-time experience.

### Characteristics
- **Speed**: Low-latency transcription (typically < 1 second from speech to display)
- **Accuracy**: Lower accuracy due to limited audio and contextual information
- **Audio**: Short bursts (typically 1-3 seconds per segment)
- **Context Sent**: Each request includes:
  - Text transcripts of preceding segments (for continuity)
  - Target field's label and input type (for domain context)
  - Sequence number (for ordering and intelligent merging)

### Sequence Tracking
Each live segment is assigned an **incremental sequence number** (positive integers starting from 1). This allows:
- **Ordering**: Segments can be stitched together in the correct order even if responses arrive out-of-sequence
- **Merging**: The API server can merge consecutive segments intelligently using their sequence numbers
- **Target Mapping**: Each sequence number is associated with the specific input element it was dictated to

### Implementation
See [DictationMachine.ts:1246-1303](../src/state-machines/DictationMachine.ts#L1246-L1303) for the `userSpeaking` state handling, and [TranscriptionModule.ts:203-309](../src/TranscriptionModule.ts#L203-L309) for the `uploadAudioWithRetry` function that sends live segments.

---

## Phase 2: Refinement

### Purpose
Re-transcribe accumulated audio with maximum context to achieve significantly higher accuracy.

### Characteristics
- **Speed**: Higher latency (3-10 seconds depending on accumulated audio length)
- **Accuracy**: Significantly higher accuracy due to full audio context
- **Audio**: All unrefined audio captured for this target since last refinement
- **Context Sent**:
  - **Complete audio only** (no text transcripts, no sequence numbers)
  - This is a standalone transcription request to the stateless `/transcribe` API
  - The audio itself contains all necessary context

### Request Tracking
Refinement requests use **UUID-based tracking** (not sequence numbers):
- Each refinement gets a unique `requestId` (UUID v4)
- Tracked separately via `context.pendingRefinements` Map
- No global sequence counter involvement
- Responses are handled synchronously in Promise callbacks (not via event bus)

### Refinement Triggers
A refinement request is sent when **ALL** of the following conditions are met:

1. **Minimum segments**: Two or more unrefined live segments have accumulated in the target field's buffer, AND
2. **Endpoint detection**: One of these events occurs:
   - **EOS (End-of-Speech)**: The app and transcription API implicitly determine the user has probably finished speaking
   - **Field Switch**: User tabs or clicks to a different target field
   - **Session End**: User ends the dictation session ("hang up")

### Refinement Targets
The refinement response:
- **Replaces** all previously transcribed text from live segments in that target field
- **Preserves** any pre-existing text that was in the field before the dictation session started
- Only affects the specific target field that was active when the refined audio was captured

### Multiple Refinement Passes
**Important**: A given dictation target may receive **multiple refinement passes** before field switch or session end.

**Why?** Because EOS is an implicit prediction:
- If EOS is detected but the user resumes speaking (false positive), another EOS event will eventually occur
- Each EOS event triggers a refinement request (if ≥2 unrefined segments exist)
- Each successive refinement includes **more audio** than the previous one
- Each refinement still **replaces all prior live segment transcripts** (and may also replace a previous refinement)

**Example Timeline:**
```
User dictates → EOS detected → Refinement #1 (segments 1-3)
User resumes → EOS detected → Refinement #2 (segments 1-6, includes previous + new)
User switches field → End of refinements for this target
```

### Audio Buffering
- Audio segments are buffered per target in `context.audioSegmentsByTarget`
- Maximum buffer size: **120 seconds** (2 minutes) per target to prevent unbounded memory growth
- When limit is reached, oldest segments are automatically trimmed
- Buffers persist across multiple EOS events (enabling multiple refinement passes)
- Buffers are cleared when:
  - User switches to a different target field
  - Dictation session ends
  - Manual edit is detected (triggers session termination)

### Implementation
See:
- [DictationMachine.ts:1943-2063](../src/state-machines/DictationMachine.ts#L1943-L2063) for `performContextualRefinement` action
- [DictationMachine.ts:375-450](../src/state-machines/DictationMachine.ts#L375-L450) for `handleRefinementComplete` function
- [TranscriptionModule.ts:329-403](../src/TranscriptionModule.ts#L329-L403) for `uploadAudioForRefinement` function

---

## Endpoint Detection

### EOS (End-of-Speech) Detection
The system uses a **probability-based endpoint detection** mechanism:

- After each transcription, the API returns `pFinishedSpeaking` (probability user finished speaking) and `tempo` (speech pace)
- A dynamic delay is calculated using these signals (see [DictationMachine.ts:2104-2146](../src/state-machines/DictationMachine.ts#L2104-L2146))
- Maximum delay for dictation: **8 seconds** (`REFINEMENT_MAX_DELAY_MS`)
  - Longer than prompt-based interactions (no AI waiting for input)
  - Reduces premature refinement from brief pauses during continuous dictation

### State Machine Integration
The refinement trigger is managed by XState:
- State: `listening.converting.accumulating` ([DictationMachine.ts:1346-1377](../src/state-machines/DictationMachine.ts#L1346-L1377))
- After `refinementDelay` timeout, transitions to `refining` state if `refinementConditionsMet` guard passes
- Guard checks: `context.refinementPendingForTargets.size > 0 && !context.isTranscribing`

---

## Data Structures

### Context Fields

```typescript
// Phase 1 (Live Streaming) - per sequence number
transcriptions: Record<number, string>           // Global transcriptions (all targets)
transcriptionsByTarget: Record<string, Record<number, string>> // Grouped by target ID
transcriptionTargets: Record<number, HTMLElement> // Maps sequence → target element
provisionalTranscriptionTarget?: {               // Pre-upload target mapping
  sequenceNumber: number;
  element: HTMLElement;
}

// Phase 2 (Refinement) - per target ID
audioSegmentsByTarget: Record<string, AudioSegment[]>  // Audio buffers by target
refinementPendingForTargets: Set<string>               // Target IDs awaiting refinement
pendingRefinements: Map<string, {                      // UUID → metadata
  targetId: string;
  targetElement: HTMLElement;
  segmentCount: number;
  timestamp: number;
}>
```

### AudioSegment Structure
```typescript
interface AudioSegment {
  blob: Blob;              // WAV audio blob
  frames: Float32Array;    // Raw PCM audio data (for concatenation)
  duration: number;        // Milliseconds
  sequenceNumber: number;  // Original Phase 1 sequence number
  captureTimestamp?: number; // When captured by VAD
}
```

---

## Key Distinctions

| Aspect | Phase 1 (Live) | Phase 2 (Refinement) |
|--------|---------------|---------------------|
| **Purpose** | Real-time feedback | High accuracy |
| **Audio Length** | 1-3 seconds | Up to 120 seconds |
| **Context** | Preceding transcripts + field metadata | Audio only |
| **Tracking** | Sequence numbers (integers) | Request IDs (UUIDs) |
| **API Fields** | `sequenceNumber`, `messages`, `inputType`, `inputLabel` | `requestId` only |
| **Response Route** | Event bus → state machine | Promise callback → direct handler |
| **Frequency** | After each VAD segment | After EOS/field switch/session end |
| **Multiple Passes** | One per segment | Potentially multiple per target |

---

## Error Handling

### Phase 1 Failures
- Retry logic with exponential backoff (up to 3 attempts)
- On terminal failure, emit `saypi:transcribeFailed` event
- State machine transitions to error state, then returns to listening after 3 seconds

### Phase 2 Failures
- Same retry logic (up to 3 attempts)
- On terminal failure:
  - Emit `saypi:refinement:failed` event
  - Clean up refinement metadata
  - **Audio buffers are preserved** (may retry on next EOS)
  - Phase 1 transcripts remain visible to user (graceful degradation)

---

## Example Flow

```
1. User starts dictating into Field A
   → [Phase 1] Segment 1 → "Hello" (seq 1)
   → [Phase 1] Segment 2 → "world" (seq 2)

2. Brief pause (EOS detected)
   → [Phase 2] Refinement #1 (segments 1-2) → "Hello, world!"
   → Replaces "Hello world" with "Hello, world!"

3. User resumes dictating
   → [Phase 1] Segment 3 → "how are" (seq 3)
   → [Phase 1] Segment 4 → "you" (seq 4)

4. Another pause (EOS detected)
   → [Phase 2] Refinement #2 (segments 1-4) → "Hello, world! How are you?"
   → Replaces entire field text

5. User tabs to Field B
   → Final refinement for Field A completes (if needed)
   → Capture initial text for Field B
   → Continue with new Phase 1 segments
```

---

## Related Files

### Core Implementation
- [src/state-machines/DictationMachine.ts](../src/state-machines/DictationMachine.ts) - State machine orchestration
- [src/TranscriptionModule.ts](../src/TranscriptionModule.ts) - Upload logic for both phases
- [src/audio/AudioSegmentPersistence.ts](../src/audio/AudioSegmentPersistence.ts) - Audio segment storage utilities

### Supporting Modules
- [src/TranscriptMergeService.ts](../src/TranscriptMergeService.ts) - Local transcript merging
- [src/text-insertion/TextInsertionManager.ts](../src/text-insertion/TextInsertionManager.ts) - DOM text insertion
- [src/TimerModule.ts](../src/TimerModule.ts) - Endpoint delay calculation

---

## Configuration

### Constants (DictationMachine.ts)
- `MAX_AUDIO_BUFFER_DURATION_MS = 120000` - Maximum audio buffer per target (2 minutes)
- `REFINEMENT_MAX_DELAY_MS = 8000` - Maximum delay for EOS detection (8 seconds)

### User Preferences
- `transcriptionMode` - STT model preference (passed to both Phase 1 and Phase 2)
- `removeFillerWords` - Filter filler words (applied in both phases)
- `keepSegments` - Debug option to save audio files to disk

---

## Testing Considerations

When testing dual-phase transcription:

1. **Phase 1 Accuracy**: Test with short phrases to verify live streaming responsiveness
2. **Phase 2 Accuracy**: Test with longer utterances and verify refinement improves accuracy
3. **Multiple Refinements**: Test false-positive EOS scenarios (brief pauses mid-sentence)
4. **Field Switching**: Verify refinements complete for previous field when switching
5. **Buffer Limits**: Test 120-second limit with extended dictation
6. **Error Recovery**: Test network failures during each phase
7. **Manual Edits**: Verify manual edits terminate dictation and clear buffers

### Mock Requirements
- Mock Chrome extension APIs (`chrome.runtime.sendMessage`)
- Mock EventBus for Phase 1 events
- Mock TranscriptionModule functions for API responses
- Use JSDOM for DOM manipulation testing

---

## Performance Notes

### Memory Management
- Audio buffers automatically trim when exceeding 120s per target
- Refinement metadata cleaned up after completion/failure
- Phase 1 transcripts cleared when replaced by Phase 2

### Network Optimization
- Phase 1: Many small requests (optimized for latency)
- Phase 2: Fewer large requests (optimized for accuracy)
- No duplicate audio uploads (Phase 2 uses buffered segments)

### User Experience
- Live streaming provides immediate feedback (no "dead air")
- Refinements improve accuracy without user intervention
- Multiple refinement passes handle natural speech pauses
- Pre-existing text preserved across refinements

---

## Future Enhancements

Potential improvements to the dual-phase system:

1. **Incremental Refinement**: Only re-transcribe new segments since last refinement
2. **Adaptive Buffering**: Adjust 120s limit based on available memory
3. **Confidence Scoring**: Display visual indicators for Phase 1 vs Phase 2 text
4. **Smart EOS**: Improve endpoint detection using linguistic features
5. **Batch Refinement**: Refine multiple targets in a single request
