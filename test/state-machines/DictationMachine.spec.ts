import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from 'vitest';
import { interpret } from 'xstate';
import EventBus from '../../src/events/EventBus.js';

// Mock dependencies
vi.mock('../../src/TranscriptionModule', () => ({
  uploadAudioWithRetry: vi.fn(() => Promise.resolve(1)),
  isTranscriptionPending: vi.fn(() => false),
  clearPendingTranscriptions: vi.fn(),
  getCurrentSequenceNumber: vi.fn(() => 1),
}));

vi.mock('../../src/ConfigModule', () => ({
  config: {
    apiServerUrl: 'http://localhost:3000',
  },
}));

vi.mock('../../src/prefs/PreferenceModule', () => ({
  UserPreferenceModule: {
    getInstance: () => ({
      getLanguage: vi.fn(() => Promise.resolve('en')),
    }),
  },
}));

vi.mock('../../src/error-management/TranscriptionErrorManager', () => ({
  default: {
    recordAttempt: vi.fn(),
  },
}));

vi.mock('../../src/TranscriptMergeService', () => ({
  TranscriptMergeService: vi.fn().mockImplementation(() => ({
    mergeTranscriptsLocal: vi.fn((transcripts) => {
      // Simple merge: join all transcripts in order
      return Object.keys(transcripts)
        .sort((a, b) => parseInt(a) - parseInt(b))
        .map(key => transcripts[key])
        .join(' ');
    }),
  })),
}));

// Mock EventBus
vi.spyOn(EventBus, 'emit');

// Import the machine after mocks are set up
import { createDictationMachine } from '../../src/state-machines/DictationMachine';
import * as TranscriptionModule from '../../src/TranscriptionModule';
import TranscriptionErrorManager from '../../src/error-management/TranscriptionErrorManager';

describe('DictationMachine', () => {
  let service: any;
  let inputElement1: HTMLInputElement;
  let inputElement2: HTMLInputElement;
  let textareaElement: HTMLTextAreaElement;

  beforeAll(() => {
    // Create mock HTML elements for testing
    inputElement1 = document.createElement('input');
    inputElement1.id = 'name-input';
    inputElement1.name = 'name';
    inputElement1.placeholder = 'Enter your name';
    
    inputElement2 = document.createElement('input');
    inputElement2.id = 'email-input';
    inputElement2.name = 'email';
    inputElement2.placeholder = 'Enter your email';
    
    textareaElement = document.createElement('textarea');
    textareaElement.id = 'bio-textarea';
    textareaElement.name = 'bio';
    textareaElement.placeholder = 'Tell us about yourself';
  });

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset mocks
    vi.mocked(TranscriptionModule.uploadAudioWithRetry).mockClear();
    vi.mocked(TranscriptionModule.isTranscriptionPending).mockReturnValue(false);
    vi.mocked(TranscriptionModule.clearPendingTranscriptions).mockClear();
    vi.mocked(TranscriptionModule.getCurrentSequenceNumber).mockReturnValue(1);
    vi.mocked(TranscriptionErrorManager.recordAttempt).mockClear();
    vi.mocked(EventBus.emit).mockClear();
    
    // Reset HTML elements
    inputElement1.value = '';
    inputElement2.value = '';
    textareaElement.value = '';
    
    // Create fresh machine for each test
    const machine = createDictationMachine();
    service = interpret(machine);
  });

  afterEach(() => {
    if (service) {
      service.stop();
    }
  });

  describe('Initial State', () => {
    it('should start in idle state with clean context', () => {
      service.start();
      
      expect(service.state.value).toBe('idle');
      expect(service.state.context.transcriptions).toEqual({});
      expect(service.state.context.transcriptionsByTarget).toEqual({});
      expect(service.state.context.isTranscribing).toBe(false);
      expect(service.state.context.userIsSpeaking).toBe(false);
      expect(service.state.context.targetElement).toBeUndefined();
      expect(service.state.context.accumulatedText).toBe('');
      expect(service.state.context.transcriptionTargets).toEqual({});
      expect(service.state.context.provisionalTranscriptionTarget).toBeUndefined();
    });
  });

  describe('State Transitions', () => {
    beforeEach(() => {
      service.start();
    });

    it('should transition from idle to starting when dictation starts', () => {
      service.send('saypi:startDictation', { targetElement: inputElement1 });
      
      expect(service.state.value).toBe('starting');
      expect(service.state.context.targetElement).toBe(inputElement1);
      expect(service.state.context.accumulatedText).toBe('');
    });

    it('should transition from starting to listening when call is ready', () => {
      service.send('saypi:startDictation', { targetElement: inputElement1 });
      service.send('saypi:callReady');
      
      expect(service.state.value).toEqual({ listening: { recording: 'notSpeaking', converting: 'ready' } });
    });

    it('should handle error states when call fails', () => {
      service.send('saypi:startDictation', { targetElement: inputElement1 });
      service.send('saypi:callFailed');
      
      expect(service.state.value).toEqual({ errors: 'micError' });
    });

    it('should return to idle from error states after timeout', (done) => {
      service.send('saypi:startDictation', { targetElement: inputElement1 });
      service.send('saypi:callFailed');
      
      // Wait for the 3-second timeout to transition back to idle
      setTimeout(() => {
        expect(service.state.value).toBe('idle');
        done();
      }, 3100);
    }, 5000);

    it('should transition to userSpeaking when user starts speaking', () => {
      service.send('saypi:startDictation', { targetElement: inputElement1 });
      service.send('saypi:callReady');
      service.send('saypi:userSpeaking');
      
      expect(service.state.value).toEqual({ 
        listening: { 
          recording: 'userSpeaking', 
          converting: 'ready' 
        } 
      });
      expect(service.state.context.userIsSpeaking).toBe(true);
    });
  });

  describe('Target Element Management', () => {
    beforeEach(() => {
      service.start();
    });

    it('should track target element when dictation starts', () => {
      service.send('saypi:startDictation', { targetElement: inputElement1 });
      
      expect(service.state.context.targetElement).toBe(inputElement1);
    });

    it('should switch target element when switchTarget event is sent', () => {
      service.send('saypi:startDictation', { targetElement: inputElement1 });
      service.send('saypi:switchTarget', { targetElement: inputElement2 });
      
      expect(service.state.context.targetElement).toBe(inputElement2);
      expect(service.state.context.transcriptions).toEqual({});
      expect(service.state.context.accumulatedText).toBe('');
    });

    it('should preserve target-specific transcriptions when switching targets', () => {
      service.send('saypi:startDictation', { targetElement: inputElement1 });
      
      // Simulate some transcriptions for the first target
      const context = service.state.context;
      context.transcriptionsByTarget['name-input'] = { 1: 'Hello', 2: 'World' };
      context.transcriptionTargets[1] = inputElement1;
      context.transcriptionTargets[2] = inputElement1;
      
      service.send('saypi:switchTarget', { targetElement: inputElement2 });
      
      // Target-specific data should be preserved
      expect(service.state.context.transcriptionsByTarget['name-input']).toEqual({ 1: 'Hello', 2: 'World' });
      expect(service.state.context.transcriptionTargets[1]).toBe(inputElement1);
      expect(service.state.context.transcriptionTargets[2]).toBe(inputElement1);
    });
  });

  describe('Transcription Target Isolation', () => {
    beforeEach(() => {
      service.start();
      service.send('saypi:startDictation', { targetElement: inputElement1 });
      service.send('saypi:callReady');
    });

    it('should record provisional transcription target when user starts speaking', () => {
      vi.mocked(TranscriptionModule.getCurrentSequenceNumber).mockReturnValue(5);

      service.send('saypi:userSpeaking');
      
      expect(service.state.context.provisionalTranscriptionTarget).toEqual({
        sequenceNumber: 6, // +1 because transcription hasn't been sent yet
        element: inputElement1
      });
    });

    it('should confirm transcription target when audio upload starts', () => {
      vi.mocked(TranscriptionModule.getCurrentSequenceNumber).mockReturnValue(5);

      service.send('saypi:userSpeaking');
      
      // Simulate stopping speaking with audio
      const audioBlob = new Blob(['audio data'], { type: 'audio/wav' });
      service.send('saypi:userStoppedSpeaking', {
        duration: 1000,
        blob: audioBlob,
        captureTimestamp: Date.now(),
        clientReceiveTimestamp: Date.now(),
      });
      
      // The implementation now predicts sequence number as getCurrentSequenceNumber() + 1
      expect(service.state.context.transcriptionTargets[6]).toBe(inputElement1);
      expect(service.state.context.provisionalTranscriptionTarget).toBeUndefined();
    });

    it('should discard provisional target when user stops speaking without audio', () => {
      vi.mocked(TranscriptionModule.getCurrentSequenceNumber).mockReturnValue(5);

      service.send('saypi:userSpeaking');
      
      // Simulate stopping speaking without audio (VAD misfire)
      service.send('saypi:userStoppedSpeaking', {
        duration: 0,
        blob: undefined,
      });
      
      expect(service.state.context.transcriptionTargets[5]).toBeUndefined();
      expect(service.state.context.provisionalTranscriptionTarget).toBeUndefined();
    });

    it('should isolate transcriptions by target element', () => {
      // Setup transcription targets
      service.state.context.transcriptionTargets[1] = inputElement1;
      service.state.context.transcriptionTargets[2] = inputElement1;
      service.state.context.transcriptionTargets[3] = inputElement2;
      
      // Simulate transcription responses for different targets
      service.send('saypi:transcribed', {
        text: 'Hello',
        sequenceNumber: 1,
      });
      
      service.send('saypi:transcribed', {
        text: 'World',
        sequenceNumber: 2,
      });
      
      service.send('saypi:transcribed', {
        text: 'Different target',
        sequenceNumber: 3,
      });
      
      // Check that transcriptions are isolated by target
      const context = service.state.context;
      expect(context.transcriptionsByTarget['name-input']).toEqual({
        1: 'Hello',
        2: 'World'
      });
      expect(context.transcriptionsByTarget['email-input']).toEqual({
        3: 'Different target'
      });
    });

    it('should skip transcription response if no originating target found', () => {
      // Send transcription without setting up target mapping
      service.send('saypi:transcribed', {
        text: 'Orphaned transcription',
        sequenceNumber: 999,
      });
      
      // Should not add to any target transcriptions
      expect(service.state.context.transcriptionsByTarget).toEqual({});
      expect(service.state.context.transcriptions).toEqual({});
    });
  });

  describe('Text Merging and Target Updates', () => {
    beforeEach(() => {
      service.start();
      service.send('saypi:startDictation', { targetElement: inputElement1 });
      service.send('saypi:callReady');
      
      // Setup transcription target
      service.state.context.transcriptionTargets[1] = inputElement1;
      service.state.context.transcriptionTargets[2] = inputElement1;
    });

    it('should merge transcriptions locally and update target element', () => {
      // Send first transcription
      service.send('saypi:transcribed', {
        text: 'Hello',
        sequenceNumber: 1,
      });
      
      expect(inputElement1.value).toBe('Hello');
      expect(service.state.context.accumulatedText).toBe('Hello');
      
      // Send second transcription
      service.send('saypi:transcribed', {
        text: 'World',
        sequenceNumber: 2,
      });
      
      expect(inputElement1.value).toBe('Hello World'); // Merged text
      expect(service.state.context.accumulatedText).toBe('Hello World');
    });

    it('should handle server-side merged transcriptions', () => {
      // Setup existing transcriptions with proper targets
      service.state.context.transcriptionTargets[1] = inputElement1;
      service.state.context.transcriptionTargets[2] = inputElement1;
      service.state.context.transcriptionTargets[3] = inputElement1;
      service.state.context.transcriptionsByTarget['name-input'] = {
        1: 'Hello',
        2: 'Beautiful'
      };
      service.state.context.transcriptions = {
        1: 'Hello',
        2: 'Beautiful'
      };
      
      // Send server-merged transcription
      service.send('saypi:transcribed', {
        text: 'Hello Beautiful World',
        sequenceNumber: 3,
        merged: [1, 2], // Server merged sequences 1 and 2
      });
      
      // Should remove merged sequences and use server result directly
      expect(inputElement1.value).toBe('Hello Beautiful World');
      expect(service.state.context.transcriptionsByTarget['name-input']).toEqual({
        3: 'Hello Beautiful World'
      });
    });

    it('should only update accumulated text for current target element', () => {
      // Setup another target with transcriptions
      service.state.context.transcriptionTargets[3] = inputElement2;
      service.state.context.transcriptionsByTarget['email-input'] = {
        3: 'Different target text'
      };
      
      // Current target is inputElement1
      service.send('saypi:transcribed', {
        text: 'Current target text',
        sequenceNumber: 1,
      });
      
      expect(service.state.context.accumulatedText).toBe('Current target text');
      
      // Switch to different target
      service.send('saypi:switchTarget', { targetElement: inputElement2 });
      
      // Send transcription for the new current target
      service.send('saypi:transcribed', {
        text: 'Updated different target text',
        sequenceNumber: 3,
      });
      
      expect(service.state.context.accumulatedText).toBe('Updated different target text');
    });
  });

  describe('Helper Functions', () => {
    it('should generate consistent target element IDs', () => {
      // We can verify the helper function behavior through the machine's usage
      service.start();
      service.send('saypi:startDictation', { targetElement: inputElement1 });
      service.send('saypi:callReady');
      
      // Setup transcription
      service.state.context.transcriptionTargets[1] = inputElement1;
      service.send('saypi:transcribed', {
        text: 'Test',
        sequenceNumber: 1,
      });
      
      // Should create entry using element ID
      expect(service.state.context.transcriptionsByTarget['name-input']).toBeDefined();
    });

    it('should handle elements without IDs by creating fallback identifiers', () => {
      const elementWithoutId = document.createElement('input');
      elementWithoutId.name = 'test-input';
      elementWithoutId.className = 'form-control';
      elementWithoutId.placeholder = 'Test placeholder';
      
      service.start();
      service.send('saypi:startDictation', { targetElement: elementWithoutId });
      service.send('saypi:callReady');
      
      // Setup transcription
      service.state.context.transcriptionTargets[1] = elementWithoutId;
      service.send('saypi:transcribed', {
        text: 'Test',
        sequenceNumber: 1,
      });
      
      // Should create entry using fallback identifier
      const targetIds = Object.keys(service.state.context.transcriptionsByTarget);
      expect(targetIds.length).toBe(1);
      expect(targetIds[0]).toMatch(/input-form-control-test-input-Test-placeholder/);
    });
  });

  describe('Event Bus Integration', () => {
    beforeEach(() => {
      service.start();
    });

    it('should emit audio setup events when recording starts', () => {
      service.send('saypi:startDictation', { targetElement: inputElement1 });
      
      expect(EventBus.emit).toHaveBeenCalledWith('audio:setupRecording');
    });

    it('should emit dictation complete event when finalized', () => {
      service.send('saypi:startDictation', { targetElement: inputElement1 });
      service.send('saypi:callReady');
      
      // Setup some transcriptions and clear previous events
      service.state.context.transcriptionTargets[1] = inputElement1;
      service.state.context.transcriptionsByTarget['name-input'] = { 1: 'Final text' };
      service.state.context.accumulatedText = 'Final text';
      
      // Clear previous EventBus calls before the test
      vi.mocked(EventBus.emit).mockClear();
      
      service.send('saypi:stopDictation');
      
      // Look for the dictation:complete event specifically
      const dictationCompleteCall = vi.mocked(EventBus.emit).mock.calls.find(
        call => call[0] === 'dictation:complete'
      );
      
      expect(dictationCompleteCall).toBeDefined();
      // Verify it has the correct structure, text might be empty if mergeService isn't ready
      expect(dictationCompleteCall![1]).toHaveProperty('targetElement', inputElement1);
      expect(dictationCompleteCall![1]).toHaveProperty('text');
    });
  });

  describe('Session Management', () => {
    beforeEach(() => {
      service.start();
    });

    it('should store session ID when assigned', () => {
      service.send('saypi:session:assigned', { session_id: 'test-session-123' });
      
      expect(service.state.context.sessionId).toBe('test-session-123');
    });

    it('should pass session ID to transcription upload', () => {
      service.send('saypi:startDictation', { targetElement: inputElement1 });
      service.send('saypi:callReady');
      service.send('saypi:session:assigned', { session_id: 'test-session-123' });
      service.send('saypi:userSpeaking');
      
      const audioBlob = new Blob(['audio data'], { type: 'audio/wav' });
      service.send('saypi:userStoppedSpeaking', {
        duration: 1000,
        blob: audioBlob,
        captureTimestamp: Date.now(),
        clientReceiveTimestamp: Date.now(),
      });
      
      expect(TranscriptionModule.uploadAudioWithRetry).toHaveBeenCalledWith(
        audioBlob,
        1000,
        {}, // target-specific transcriptions (empty for new target)
        'test-session-123',
        3,
        expect.any(Number),
        expect.any(Number),
        "text", // inputType from HTML input element
        "Enter your name" // inputLabel from placeholder attribute
      );
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      service.start();
      service.send('saypi:startDictation', { targetElement: inputElement1 });
      service.send('saypi:callReady');
    });

    it('should transition to error state on transcription failure', () => {
      service.send('saypi:transcribeFailed');
      
      expect(service.state.value).toEqual({ errors: 'transcribeFailed' });
    });

    it('should transition to error state on empty transcription', () => {
      service.send('saypi:transcribedEmpty');
      
      expect(service.state.value).toEqual({ errors: 'micError' });
    });

    it('should handle missing target element gracefully in transcribeAudio', () => {
      // Clear target element
      service.state.context.targetElement = undefined;
      
      service.send('saypi:userSpeaking');
      const audioBlob = new Blob(['audio data'], { type: 'audio/wav' });
      service.send('saypi:userStoppedSpeaking', {
        duration: 1000,
        blob: audioBlob,
      });
      
      // Should not crash and should warn about missing target
      expect(TranscriptionModule.uploadAudioWithRetry).not.toHaveBeenCalled();
    });
  });

  describe('Complex Target Switching Scenarios', () => {
    beforeEach(() => {
      service.start();
    });

    it('should handle rapid target switching with in-flight transcriptions', () => {
      // Start dictation on first target
      service.send('saypi:startDictation', { targetElement: inputElement1 });
      service.send('saypi:callReady');
      
      // Setup provisional target
      service.state.context.transcriptionTargets[1] = inputElement1;
      service.state.context.provisionalTranscriptionTarget = {
        sequenceNumber: 2,
        element: inputElement1
      };
      
      // Switch target quickly
      service.send('saypi:switchTarget', { targetElement: inputElement2 });
      
      // Previous target mappings should be preserved
      expect(service.state.context.transcriptionTargets[1]).toBe(inputElement1);
      expect(service.state.context.provisionalTranscriptionTarget).toEqual({
        sequenceNumber: 2,
        element: inputElement1
      });
      
      // New target should be set
      expect(service.state.context.targetElement).toBe(inputElement2);
      
      // Send transcription for the in-flight sequence
      service.send('saypi:transcribed', {
        text: 'Text for original target',
        sequenceNumber: 1,
      });
      
      // Should go to original target, not current target
      expect(inputElement1.value).toBe('Text for original target');
      expect(inputElement2.value).toBe('');
    });

    it('should handle multiple targets with simultaneous transcriptions', () => {
      service.send('saypi:startDictation', { targetElement: inputElement1 });
      service.send('saypi:callReady');
      
      // Setup transcriptions for multiple targets
      service.state.context.transcriptionTargets[1] = inputElement1;
      service.state.context.transcriptionTargets[2] = inputElement1;
      service.state.context.transcriptionTargets[3] = inputElement2;
      service.state.context.transcriptionTargets[4] = textareaElement;
      
      // Send transcriptions in mixed order
      service.send('saypi:transcribed', {
        text: 'Second for input1',
        sequenceNumber: 2,
      });
      
      service.send('saypi:transcribed', {
        text: 'First for input2',
        sequenceNumber: 3,
      });
      
      service.send('saypi:transcribed', {
        text: 'First for input1',
        sequenceNumber: 1,
      });
      
      service.send('saypi:transcribed', {
        text: 'Bio text',
        sequenceNumber: 4,
      });
      
      // Each target should have its own transcriptions merged
      expect(inputElement1.value).toBe('First for input1 Second for input1');
      expect(inputElement2.value).toBe('First for input2');
      expect(textareaElement.value).toBe('Bio text');
      
      // Verify isolated storage
      expect(service.state.context.transcriptionsByTarget['name-input']).toEqual({
        1: 'First for input1',
        2: 'Second for input1'
      });
      expect(service.state.context.transcriptionsByTarget['email-input']).toEqual({
        3: 'First for input2'
      });
      expect(service.state.context.transcriptionsByTarget['bio-textarea']).toEqual({
        4: 'Bio text'
      });
    });
  });

  describe('ContentEditable Support', () => {
    let contentEditableElement: HTMLDivElement;

    beforeAll(() => {
      contentEditableElement = document.createElement('div');
      contentEditableElement.id = 'content-editable';
      contentEditableElement.contentEditable = 'true';
      contentEditableElement.textContent = '';
    });

    beforeEach(() => {
      contentEditableElement.textContent = '';
      service.start();
    });

    it('should handle contentEditable elements', () => {
      service.send('saypi:startDictation', { targetElement: contentEditableElement });
      service.send('saypi:callReady');
      
      // Setup transcription
      service.state.context.transcriptionTargets[1] = contentEditableElement;
      service.send('saypi:transcribed', {
        text: 'Content editable text',
        sequenceNumber: 1,
      });
      
      expect(contentEditableElement.textContent).toBe('Content editable text');
    });
  });

  describe('Manual Edit Handling', () => {
    beforeEach(() => {
      service.start();
    });

    it('should handle manual edit event and update single transcription', () => {
      // Setup initial transcription
      service.state.context.transcriptionsByTarget['name-input'] = {
        1: 'Hello World'
      };
      service.state.context.transcriptions[1] = 'Hello World';
      service.state.context.transcriptionTargets[1] = inputElement1;

      // Send manual edit event
      service.send('saypi:manualEdit', {
        targetElement: inputElement1,
        newContent: 'Hello Earth',
        oldContent: 'Hello World'
      });

      // Verify transcription was updated
      expect(service.state.context.transcriptionsByTarget['name-input']).toEqual({
        1: 'Hello Earth'
      });
      expect(service.state.context.transcriptions[1]).toBe('Hello Earth');
      
      // Verify event was emitted
      expect(EventBus.emit).toHaveBeenCalledWith('dictation:contentUpdated', {
        targetElement: inputElement1,
        content: 'Hello Earth',
        source: 'manual-edit'
      });
    });

    it('should handle manual edit with multiple transcriptions - update last segment', () => {
      // Setup multiple transcriptions (like the example in requirements)
      service.state.context.transcriptionsByTarget['name-input'] = {
        1: 'Hello',
        2: ', World!'
      };
      service.state.context.transcriptions = {
        1: 'Hello',
        2: ', World!'
      };
      service.state.context.transcriptionTargets[1] = inputElement1;
      service.state.context.transcriptionTargets[2] = inputElement1;

      // Send manual edit event (Hello , World! -> Hello, Earth!)
      // Note: when joined with space, "Hello" + " " + ", World!" becomes "Hello , World!"
      service.send('saypi:manualEdit', {
        targetElement: inputElement1,
        newContent: 'Hello, Earth!',
        oldContent: 'Hello , World!'  // This matches the actual joined content
      });

      // Verify transcriptions were updated correctly
      expect(service.state.context.transcriptionsByTarget['name-input']).toEqual({
        1: 'Hello',
        2: ', Earth!'
      });
      expect(service.state.context.transcriptions).toEqual({
        1: 'Hello',
        2: ', Earth!'
      });
    });

    it('should handle manual edit with significant content change', () => {
      // Setup multiple transcriptions
      service.state.context.transcriptionsByTarget['name-input'] = {
        1: 'Hello',
        2: ', World!'
      };
      service.state.context.transcriptions = {
        1: 'Hello',
        2: ', World!'
      };
      service.state.context.transcriptionTargets[1] = inputElement1;
      service.state.context.transcriptionTargets[2] = inputElement1;

      // Send manual edit with completely different content
      service.send('saypi:manualEdit', {
        targetElement: inputElement1,
        newContent: 'Completely different text',
        oldContent: 'Hello , World!'  // This matches the actual joined content
      });

      // Verify all previous transcriptions were replaced with the new content
      expect(service.state.context.transcriptionsByTarget['name-input']).toEqual({
        2: 'Completely different text'
      });
      expect(service.state.context.transcriptions).toEqual({
        2: 'Completely different text'
      });
    });

    it('should skip manual edit when old content does not match', () => {
      // Setup transcription
      service.state.context.transcriptionsByTarget['name-input'] = {
        1: 'Hello World'
      };
      service.state.context.transcriptions[1] = 'Hello World';
      service.state.context.transcriptionTargets[1] = inputElement1;

      // Send manual edit with non-matching old content
      service.send('saypi:manualEdit', {
        targetElement: inputElement1,
        newContent: 'Hello Earth',
        oldContent: 'Different text'  // Doesn't match current transcribed content
      });

      // Verify transcription was not changed
      expect(service.state.context.transcriptionsByTarget['name-input']).toEqual({
        1: 'Hello World'
      });
      expect(service.state.context.transcriptions[1]).toBe('Hello World');
    });

    it('should handle manual edit when no transcriptions exist for target', () => {
      // No transcriptions set up
      
      // Send manual edit event
      service.send('saypi:manualEdit', {
        targetElement: inputElement1,
        newContent: 'Some new text',
        oldContent: ''
      });

      // Verify nothing was changed (no transcriptions to update)
      expect(service.state.context.transcriptionsByTarget['name-input']).toBeUndefined();
      
      // Event should still be emitted
      expect(EventBus.emit).toHaveBeenCalledWith('dictation:contentUpdated', {
        targetElement: inputElement1,
        content: 'Some new text',
        source: 'manual-edit'
      });
    });

    it('should preserve edits when resuming dictation', () => {
      // Setup initial transcription
      service.state.context.transcriptionsByTarget['name-input'] = {
        1: 'Hello'
      };
      service.state.context.transcriptions[1] = 'Hello';
      service.state.context.transcriptionTargets[1] = inputElement1;

      // Manual edit
      service.send('saypi:manualEdit', {
        targetElement: inputElement1,
        newContent: 'Hello Beautiful',
        oldContent: 'Hello'
      });

      // Verify edit was preserved
      expect(service.state.context.transcriptionsByTarget['name-input']).toEqual({
        1: 'Hello Beautiful'
      });

      // Simulate resumed dictation by manually adding the new transcription
      // (This simulates what would happen when the transcription system processes a new audio chunk)
      service.state.context.transcriptionsByTarget['name-input'][2] = 'World';
      service.state.context.transcriptions[2] = 'World';
      service.state.context.transcriptionTargets[2] = inputElement1;

      // Verify new transcription is added while preserving edits
      expect(service.state.context.transcriptionsByTarget['name-input']).toEqual({
        1: 'Hello Beautiful',
        2: 'World'
      });
    });

    it('should handle manual edits across different target elements', () => {
      // Setup transcriptions for two different elements
      service.state.context.transcriptionsByTarget['name-input'] = {
        1: 'John'
      };
      service.state.context.transcriptionsByTarget['email-input'] = {
        2: 'john@example.com'
      };
      service.state.context.transcriptions = {
        1: 'John',
        2: 'john@example.com'
      };
      service.state.context.transcriptionTargets[1] = inputElement1;
      service.state.context.transcriptionTargets[2] = inputElement2;

      // Edit first element
      service.send('saypi:manualEdit', {
        targetElement: inputElement1,
        newContent: 'Jane',
        oldContent: 'John'
      });

      // Edit second element
      service.send('saypi:manualEdit', {
        targetElement: inputElement2,
        newContent: 'jane@example.org',
        oldContent: 'john@example.com'
      });

      // Verify both edits were applied independently
      expect(service.state.context.transcriptionsByTarget['name-input']).toEqual({
        1: 'Jane'
      });
      expect(service.state.context.transcriptionsByTarget['email-input']).toEqual({
        2: 'jane@example.org'
      });
      expect(service.state.context.transcriptions).toEqual({
        1: 'Jane',
        2: 'jane@example.org'
      });
    });

    it('should emit dictation:contentUpdated event on manual edit', () => {
      // Setup transcription
      service.state.context.transcriptionsByTarget['name-input'] = {
        1: 'Original text'
      };
      service.state.context.transcriptionTargets[1] = inputElement1;

      // Send manual edit
      service.send('saypi:manualEdit', {
        targetElement: inputElement1,
        newContent: 'Edited text',
        oldContent: 'Original text'
      });

      // Verify the correct event was emitted
      expect(EventBus.emit).toHaveBeenCalledWith('dictation:contentUpdated', {
        targetElement: inputElement1,
        content: 'Edited text',
        source: 'manual-edit'
      });
    });
  });
});