# Dictation Mode Text Merging Solution - Design Document

## Executive Summary

This design document outlines improvements to Say, Pi's dictation mode text merging system, building upon the existing implementation to address outstanding issues with manual edit handling, text duplication, and state synchronization. The solution maintains backward compatibility while introducing a more robust architecture for tracking and merging text across multiple input fields.

## Current State Analysis

### What's Working Well
- **Sequential transcript ordering** using sequence numbers
- **Multi-target support** with audio segmentation for target switches
- **Rich text editor strategies** (Lexical, Slate, Quill, ContentEditable)
- **Smart text joining** with whitespace intelligence
- **Initial text preservation** per target element

### Outstanding Issues
1. **Manual Edit Detection Gaps**: Current system detects edits but doesn't fully reconcile them with transcription state
2. **External Field Clearing**: When chat platforms clear fields programmatically, state becomes inconsistent
3. **Newline Handling**: Complex edge cases with contenteditable elements and manual formatting
4. **State Synchronization**: Transcription state can drift from actual field content
5. **Merge Conflict Resolution**: When manual edits conflict with incoming transcriptions

## Proposed Architecture

### Core Design Principles
1. **Single Source of Truth**: Field content is always authoritative
2. **Optimistic Updates**: Apply transcriptions immediately, reconcile conflicts later
3. **Immutable History**: Keep full transcription history for debugging and recovery
4. **Event-Driven Synchronization**: Use events to maintain consistency across components

### Component Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   DictationController                    │
│  (Orchestrates all dictation operations)                 │
└────────────┬────────────────────────────┬───────────────┘
             │                            │
    ┌────────▼──────────┐       ┌────────▼──────────┐
    │  ContentTracker   │       │ TranscriptManager  │
    │ (Monitors fields) │       │  (Manages merging) │
    └────────┬──────────┘       └────────┬──────────┘
             │                            │
    ┌────────▼────────────────────────────▼──────────┐
    │              StateReconciler                    │
    │    (Resolves conflicts & maintains truth)       │
    └─────────────────────────────────────────────────┘
```

## Detailed Component Design

### 1. ContentTracker

**Purpose**: Monitor field content changes and detect manual edits with high fidelity.

**Key Responsibilities**:
- Track content mutations using MutationObserver for contenteditable
- Debounce rapid changes to avoid false positives
- Distinguish between programmatic and user-initiated changes
- Maintain content snapshots for diff generation

**Data Structure**:
```typescript
interface ContentSnapshot {
  elementId: string;
  content: string;
  timestamp: number;
  source: 'dictation' | 'manual' | 'external';
  checksum: string; // For quick comparison
}

interface ContentHistory {
  [elementId: string]: ContentSnapshot[];
}
```

**Key Methods**:
- `trackElement(element: HTMLElement)`: Begin monitoring
- `getContentDiff(elementId: string, fromTime: number)`: Get changes since timestamp
- `markDictationUpdate(elementId: string)`: Flag next change as dictation-sourced
- `detectChangeSource(mutation: MutationRecord)`: Determine change origin

### 2. TranscriptManager

**Purpose**: Enhanced transcript management with conflict resolution and intelligent merging.

**Key Responsibilities**:
- Maintain transcription history with full metadata
- Implement merge strategies for different conflict scenarios
- Handle server-side merge responses
- Support undo/redo operations

**Data Structure**:
```typescript
interface TranscriptEntry {
  sequenceNumber: number;
  text: string;
  timestamp: number;
  targetElementId: string;
  mergedFrom?: number[]; // Server-merged sequences
  status: 'pending' | 'confirmed' | 'merged' | 'superseded';
  checksum: string;
}

interface MergeStrategy {
  name: string;
  canHandle(context: MergeContext): boolean;
  merge(existing: string, incoming: string, context: MergeContext): string;
}

interface MergeContext {
  hasManualEdit: boolean;
  editPosition?: number; // Character position of edit
  editType?: 'insertion' | 'deletion' | 'replacement';
  timestamp: number;
}
```

**Key Methods**:
- `addTranscript(entry: TranscriptEntry)`: Add new transcription
- `mergeWithStrategy(targetId: string, strategy: MergeStrategy)`: Apply merge strategy
- `resolveConflict(targetId: string, resolution: 'keep' | 'overwrite' | 'merge')`: Handle conflicts
- `getTranscriptHistory(targetId: string, limit?: number)`: Retrieve history

### 3. StateReconciler

**Purpose**: Maintain consistency between transcription state and actual field content.

**Key Responsibilities**:
- Periodic reconciliation checks
- Conflict detection and resolution
- State recovery after errors
- Emit synchronization events

**Data Structure**:
```typescript
interface ReconciliationResult {
  targetId: string;
  discrepancyFound: boolean;
  resolution: 'auto' | 'manual' | 'deferred';
  details: {
    expected: string;
    actual: string;
    diff: TextDiff[];
  };
}

interface TextDiff {
  type: 'addition' | 'deletion' | 'unchanged';
  content: string;
  position: number;
}
```

**Key Methods**:
- `reconcile(targetId: string)`: Check and fix inconsistencies
- `scheduleReconciliation(targetId: string, delayMs: number)`: Deferred check
- `forceSync(targetId: string)`: Immediate synchronization
- `generateRecoveryPlan(targetId: string)`: Create recovery strategy

## Manual Edit Handling Strategy

### Detection Phase
1. **Content Monitoring**: Use both `input` events and MutationObserver
2. **Source Attribution**: Track whether changes come from dictation or user
3. **Timing Analysis**: Use timestamps to correlate changes with transcription events

### Processing Phase
1. **Diff Generation**: Create detailed diff between old and new content
2. **Edit Classification**: Determine edit type and location
3. **Context Preservation**: Save edit context for merge decisions

### Resolution Phase
1. **Conflict Detection**: Identify if edit conflicts with pending transcriptions
2. **Strategy Selection**: Choose appropriate merge strategy
3. **Application**: Apply resolution and update state

### Merge Strategies

#### 1. Append Strategy (Default)
- **When**: Manual edit is at the end of content
- **Action**: Append new transcriptions after edit
- **Preserves**: User's additions

#### 2. Insert Strategy
- **When**: Manual edit is in the middle of content
- **Action**: Insert transcriptions at original position
- **Preserves**: User's structural changes

#### 3. Replace Strategy
- **When**: User selected and replaced text
- **Action**: Skip transcriptions that would overwrite
- **Preserves**: User's replacements

#### 4. Rebase Strategy
- **When**: Complex edits throughout text
- **Action**: Replay transcriptions on top of edited base
- **Preserves**: Both edits and transcriptions

## Implementation Plan

### Phase 1: Enhanced Detection (Week 1)
1. Implement ContentTracker with MutationObserver
2. Add source attribution to all content changes
3. Create comprehensive test suite for detection
4. Deploy behind feature flag for testing

### Phase 2: Smart Merging (Week 2)
1. Implement TranscriptManager with strategy pattern
2. Create merge strategies for common scenarios
3. Add conflict detection logic
4. Test with real-world usage patterns

### Phase 3: State Reconciliation (Week 3)
1. Implement StateReconciler with periodic checks
2. Add recovery mechanisms for inconsistent states
3. Create debugging tools for state inspection
4. Performance optimization for large texts

### Phase 4: Polish & Edge Cases (Week 4)
1. Handle contenteditable quirks (double BR, DIV wrapping)
2. Optimize for specific platforms (LinkedIn, Gmail)
3. Add telemetry for merge success rates
4. Documentation and knowledge transfer

## Migration Strategy

### Backward Compatibility
- Maintain existing API surface
- Gradual migration using feature flags
- Fallback to legacy merging if new system fails

### Data Migration
```typescript
// Adapter to convert old format to new
class LegacyDataAdapter {
  static convertTranscriptions(
    old: Record<number, string>
  ): TranscriptEntry[] {
    return Object.entries(old).map(([seq, text]) => ({
      sequenceNumber: parseInt(seq),
      text,
      timestamp: Date.now(),
      targetElementId: 'legacy',
      status: 'confirmed',
      checksum: generateChecksum(text)
    }));
  }
}
```

## Testing Strategy

### Unit Tests
- ContentTracker: Mock DOM mutations
- TranscriptManager: Test all merge strategies
- StateReconciler: Test conflict scenarios

### Integration Tests
- Multi-target dictation flows
- Manual edit during transcription
- External field clearing
- Platform-specific behaviors

### Performance Tests
- Large text handling (10,000+ characters)
- Rapid transcription updates
- Multiple concurrent targets

## Monitoring & Telemetry

### Key Metrics
- Manual edit detection accuracy
- Merge conflict frequency
- State reconciliation success rate
- Performance impact on transcription

### Event Tracking
```typescript
// Track key operations for analysis
EventBus.emit("dictation:merge", {
  strategy: "rebase",
  success: true,
  duration: 23,
  textLength: 1500,
  conflictsResolved: 2
});
```

## Risk Mitigation

### Technical Risks
1. **Performance Degradation**
   - Mitigation: Implement throttling and debouncing
   - Fallback: Disable advanced features on slow devices

2. **Platform Incompatibility**
   - Mitigation: Extensive cross-browser testing
   - Fallback: Platform-specific strategies

3. **State Corruption**
   - Mitigation: Immutable state updates
   - Fallback: State reset mechanism

### User Experience Risks
1. **Unexpected Text Changes**
   - Mitigation: Visual indicators for pending merges
   - Fallback: Undo functionality

2. **Lost User Edits**
   - Mitigation: Always preserve user input
   - Fallback: Edit history recovery

## Success Criteria

### Functional Requirements
- ✅ Zero data loss for manual edits
- ✅ Correct merge in 99% of cases
- ✅ Recovery from inconsistent states
- ✅ Support for all major editors

### Performance Requirements
- ✅ Merge completion < 50ms
- ✅ Detection latency < 10ms
- ✅ Memory overhead < 10MB
- ✅ CPU usage < 5% during dictation

### Quality Requirements
- ✅ Test coverage > 90%
- ✅ Zero critical bugs in production
- ✅ User satisfaction > 95%

## Appendix: Implementation Notes

### Critical Code Sections to Refactor

1. **DictationMachine.ts**
   - Extract merge logic to TranscriptManager
   - Simplify state machine to use new components
   - Add reconciliation checkpoints

2. **UniversalDictationModule.ts**
   - Integrate ContentTracker for monitoring
   - Use StateReconciler for consistency
   - Enhance manual edit event handling

3. **TranscriptMergeService.ts**
   - Extend with strategy pattern
   - Add conflict detection
   - Implement advanced merge algorithms

### API Changes

```typescript
// New event for merge conflicts
EventBus.emit("dictation:mergeConflict", {
  targetElement: HTMLElement,
  conflict: MergeConflict,
  suggestedResolution: MergeStrategy
});

// Enhanced manual edit event
EventBus.emit("dictation:manualEdit", {
  targetElement: HTMLElement,
  edit: EditOperation,
  context: EditContext
});
```

### Debug Interface

```typescript
// Expose for debugging in development
window.__sayPiDictation = {
  getState: (elementId: string) => StateReconciler.getState(elementId),
  getHistory: (elementId: string) => TranscriptManager.getHistory(elementId),
  forceReconcile: (elementId: string) => StateReconciler.reconcile(elementId),
  exportDiagnostics: () => generateDiagnosticReport()
};
```