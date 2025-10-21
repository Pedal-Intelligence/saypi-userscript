# Dictation Mode Text Merging Strategy - PRD

## Overview

The dictation mode text merging strategy defines how Say, Pi's universal dictation feature handles the complex task of combining user-spoken transcriptions with pre-existing text in input fields across the web. This system must intelligently merge real-time speech transcriptions while preserving existing content, handling out-of-order responses, supporting manual edits, and maintaining consistency across different input element types.

**Problem**: Current dictation implementations in the codebase have fragmented text merging logic that can lead to duplicate content, lost user edits, incorrect ordering of transcriptions, and inconsistent behavior across different field types.

**Solution**: A comprehensive, well-defined text merging strategy that handles all edge cases predictably and provides a foundation for reliable dictation across any web input field.

**Target Users**: All Say, Pi users utilizing the universal dictation feature, including accessibility users, professionals, and anyone preferring voice input over typing.

## Core Features

### Sequential Transcript Ordering
- **What**: Ensures transcriptions are merged in the order they were spoken, regardless of when server responses arrive
- **Why**: Network latency and parallel processing can cause responses to arrive out-of-order, leading to jumbled text
- **How**: Use sequence numbers to track temporal order and reorder transcriptions before merging

### Initial Text Preservation
- **What**: Retains any pre-existing content in target fields when dictation begins
- **Why**: Users often want to add to existing text rather than replace it entirely
- **How**: Capture and store initial field content per target element, merge intelligently with new transcriptions

### Smart Text Joining
- **What**: Combines text segments with appropriate spacing and formatting
- **Why**: Simple concatenation leads to missing spaces or double spaces, poor readability
- **How**: Analyze segment boundaries for existing whitespace, handle newlines, normalize ellipsis

### Multi-Target Support
- **What**: Handles dictation switching between different input fields during a single speech session
- **Why**: Users may change focus while speaking, requiring different parts of speech to go to different fields
- **How**: Track target switches with timestamps, segment audio accordingly, maintain separate transcription contexts

### Manual Edit Detection & Handling
- **What**: Detects when users manually edit field content during dictation and responds appropriately
- **Why**: Manual edits should be preserved and not overwritten by subsequent transcriptions
- **How**: Monitor content changes, distinguish programmatic vs manual updates, terminate or adapt dictation state

## User Experience

### User Personas
1. **Professional Writer**: Needs seamless addition to existing drafts without losing formatting or content
2. **Accessibility User**: Relies on consistent, predictable behavior when switching between form fields
3. **Multitasker**: May pause to edit text manually, then resume dictation in the same or different fields

### Key User Flows

1. **Adding to Existing Content**:
   - User focuses field with existing text
   - Starts dictation
   - Speaks additional content
   - New text appears seamlessly appended with proper spacing

2. **Multi-Field Dictation**:
   - User starts dictation in field A
   - While speaking, switches focus to field B
   - Earlier speech appears in field A, later speech in field B
   - Each field maintains its own content context

3. **Manual Edit During Dictation**:
   - User starts dictation
   - Manually edits the field mid-session
   - System detects edit and either adapts or terminates dictation cleanly
   - No loss of user edits or transcription progress

### UI/UX Considerations
- Invisible operation - text merging happens seamlessly without user awareness
- Predictable behavior - same operations produce same results across field types
- Graceful degradation - fallback strategies for complex scenarios
- Real-time feedback - users see text appear as they speak

## Technical Architecture

### System Components

#### Core Merging Engine
- `TranscriptMergeService`: Handles local and server-side transcript merging
- `DictationMachine`: State machine managing dictation lifecycle and text updates
- Smart joining algorithms with whitespace intelligence

#### Text Insertion Strategies
- `InputTextareaStrategy`: Standard form inputs using `.value` property
- `LexicalEditorStrategy`: Meta's Lexical editor framework support
- `SlateEditorStrategy`: Slate.js rich text editor support  
- `QuillEditorStrategy`: Quill.js editor with HTML structure preservation
- `ContentEditableStrategy`: Generic contenteditable with HTML/text conversion

#### State Management
- Per-target transcription tracking (`transcriptionsByTarget`)
- Initial text storage (`initialTextByTarget`)
- Sequence number mapping to target elements
- Manual edit detection and history tracking

### Data Models

```typescript
interface DictationContext {
  transcriptions: Record<number, string>; // Global transcriptions
  transcriptionsByTarget: Record<string, Record<number, string>>; // Per-target transcriptions
  initialTextByTarget: Record<string, string>; // Pre-existing content
  transcriptionTargets: Record<number, HTMLElement>; // Sequence to element mapping
  targetSwitchesDuringSpeech?: Array<{timestamp: number, target: HTMLElement}>;
}

interface TranscriptionResponse {
  text: string;
  sequenceNumber: number;
  merged?: number[]; // Server-merged sequence numbers
}
```

### APIs and Integrations

#### Internal APIs
- `uploadAudioWithRetry()`: Transcription API with retry logic
- `computeFinalText()`: Core merging algorithm
- `setTextInTarget()`: Cross-platform text insertion
- `getTextInTarget()`: Cross-platform content extraction

#### External APIs
- Whisper transcription service with merge support
- VAD (Voice Activity Detection) for audio segmentation
- Browser extension APIs for content script injection

## Development Roadmap

### Phase 1: Core Merging Logic (Foundation)
**Scope**: Implement reliable text merging for standard input elements

**Components**:
- Smart text joining with whitespace intelligence
- Sequential ordering using sequence numbers
- Initial text preservation and storage
- Basic manual edit detection
- Standard input/textarea support

**Deliverables**:
- `computeFinalText()` function with comprehensive test coverage
- `TranscriptMergeService` with local merging capability
- Basic text insertion strategies for form elements

### Phase 2: Multi-Target Support (Expansion)
**Scope**: Enable dictation across multiple fields with context preservation

**Components**:
- Target switching detection and audio segmentation
- Per-target transcription context management
- Cross-target state isolation
- Provisional transcription target mapping

**Deliverables**:
- Target switching logic in `DictationMachine`
- Audio segmentation based on target switch timestamps
- Separate transcription buckets per target element

### Phase 3: Rich Text Editor Support (Compatibility)
**Scope**: Support major rich text editors and contenteditable elements

**Components**:
- Lexical, Slate, Quill-specific insertion strategies
- HTML-to-text conversion for contenteditable elements
- Newline preservation and formatting handling
- Framework-specific event dispatching

**Deliverables**:
- Complete strategy pattern implementation
- Rich text editor detection and handling
- Cross-platform text insertion with proper events

### Phase 4: Advanced Manual Edit Handling (Robustness)
**Scope**: Sophisticated manual edit detection and state synchronization

**Components**:
- Real-time content monitoring and diff detection
- Transcription state updates based on manual edits
- Smart continuation after manual edits
- Content validation and external change detection

**Deliverables**:
- Advanced manual edit detection algorithms
- State synchronization logic
- Comprehensive error handling and recovery

## Logical Dependency Chain

### Foundation Layer (Phase 1)
1. **Smart Text Joining**: Core algorithm for combining text segments
2. **Sequence Ordering**: Temporal ordering system using sequence numbers
3. **Initial Text Handling**: Storage and preservation of pre-existing content
4. **Basic Insertion Strategies**: Standard form input support

### Expansion Layer (Phase 2) 
*Depends on: Foundation Layer*
1. **Target Detection**: Identify and track target element changes
2. **Audio Segmentation**: Split audio based on target switches
3. **Context Isolation**: Separate transcription state per target
4. **Cross-Target Coordination**: Manage multiple active transcription contexts

### Compatibility Layer (Phase 3)
*Depends on: Foundation + Expansion Layers*
1. **Editor Detection**: Identify rich text editor frameworks
2. **Strategy Implementation**: Editor-specific text insertion logic
3. **Event Handling**: Proper input event dispatching for framework compatibility
4. **HTML Processing**: Convert between HTML and plain text for contenteditable

### Robustness Layer (Phase 4)
*Depends on: All Previous Layers*
1. **Change Detection**: Monitor for manual content modifications
2. **State Synchronization**: Update internal state based on external changes
3. **Error Recovery**: Handle inconsistent states and external interference
4. **Validation**: Ensure content integrity and proper merging

## Risks and Mitigations

### Technical Challenges

**Risk**: Complex state management with multiple concurrent transcriptions
- *Mitigation*: Clear separation of concerns, per-target state isolation, comprehensive testing of race conditions

**Risk**: Browser compatibility issues with different text insertion methods
- *Mitigation*: Strategy pattern with fallbacks, progressive enhancement, extensive cross-browser testing

**Risk**: Performance impact from real-time content monitoring
- *Mitigation*: Efficient diffing algorithms, debounced event handling, lazy initialization

### MVP Definition

**Risk**: Feature creep leading to over-complex initial implementation
- *Mitigation*: Start with Phase 1 (standard inputs only), validate with users, iterate based on actual usage patterns

**Risk**: Edge cases causing user data loss or poor experience
- *Mitigation*: Conservative approach prioritizing data preservation, comprehensive error handling, user-facing feedback

### Resource Constraints

**Risk**: Extensive testing requirements across platforms and editors
- *Mitigation*: Automated test suites, focus on most common use cases initially, community beta testing

**Risk**: Maintenance burden of supporting multiple editor types
- *Mitigation*: Well-defined interfaces, strategy pattern for extensibility, clear documentation

## Appendix

### Research Findings

#### Current Implementation Analysis
- `DictationMachine.ts`: 2100+ lines with complex merging logic spread throughout
- `TranscriptMergeService.ts`: Basic local merging with smart joining
- `UniversalDictationModule.ts`: Manual edit detection but limited handling
- Multiple insertion strategies but inconsistent behavior

#### Key Technical Insights
- Server-side merging reduces client complexity but requires fallback logic
- Contenteditable elements require HTML-aware processing for newlines
- Manual edit detection is critical for user experience but complex to implement correctly
- Multi-target support requires careful audio/transcription segmentation

#### Performance Considerations
- Real-time merging must complete in <100ms to avoid user-perceived lag
- Content monitoring should be debounced to avoid excessive CPU usage
- Memory management important for long dictation sessions with many targets

### Technical Specifications

#### Text Joining Algorithm
```typescript
function smartJoinTwoTexts(firstText: string, secondText: string): string {
  if (!firstText) return secondText;
  if (!secondText) return firstText;
  
  const firstEndsWithWhitespace = firstText.match(/\s$/);
  const secondStartsWithWhitespace = secondText.match(/^\s/);
  
  if (firstEndsWithWhitespace || secondStartsWithWhitespace) {
    return firstText + secondText;
  } else {
    return firstText + " " + secondText;
  }
}
```

#### Sequence Ordering Logic
- Sequences numbered incrementally (1, 2, 3, ...)
- Server responses may arrive out-of-order (3, 1, 2)
- Client sorts by sequence number before merging
- Missing sequences handled with timeout/retry logic

#### Target Element Identification
```typescript
function getTargetElementId(element: HTMLElement): string {
  if (element.id) return element.id;
  
  const tagName = element.tagName.toLowerCase();
  const className = element.className || '';
  const name = element.getAttribute('name') || '';
  const placeholder = element.getAttribute('placeholder') || '';
  
  return `${tagName}-${className}-${name}-${placeholder}`.replace(/\s+/g, '-');
}
```