import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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

describe('DictationMachine Manual Edit Termination', () => {
  let service: any;
  let inputElement: HTMLInputElement;
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Create an input element
    inputElement = document.createElement('input');
    inputElement.id = 'test-input';
    inputElement.type = 'text';
    inputElement.value = '';
    document.body.appendChild(inputElement);
    
    // Create fresh machine for each test
    const machine = createDictationMachine(inputElement);
    service = interpret(machine);
  });

  afterEach(() => {
    if (service) {
      service.stop();
    }
    document.body.innerHTML = '';
  });

  it('should terminate dictation when manual edit is detected', async () => {
    // Start the dictation machine
    service.start();
    
    // Simulate starting dictation
    service.send({ type: 'saypi:startDictation', targetElement: inputElement });
    service.send({ type: 'saypi:callReady' });
    
    // Verify we're in listening state
    expect(service.state.value).toEqual(expect.objectContaining({ listening: expect.any(Object) }));
    
    // Set up transcription target mapping
    service.state.context.transcriptionTargets[1] = inputElement;
    
    // Simulate transcription response
    service.send({
      type: 'saypi:transcribed',
      text: 'Hello world',
      sequenceNumber: 1,
    });
    
    // Verify the input contains the transcription
    expect(inputElement.value).toBe('Hello world');
    expect(service.state.context.transcriptionsByTarget['test-input']).toEqual({
      1: 'Hello world'
    });
    
    // Simulate manual edit
    inputElement.value = 'Hello world, edited!';
    service.send({
      type: 'saypi:manualEdit',
      targetElement: inputElement,
      newContent: 'Hello world, edited!',
      oldContent: 'Hello world'
    });
    
    // Verify dictation was terminated
    expect(service.state.value).toBe('idle');
    
    // Verify transcription state was cleared
    expect(service.state.context.transcriptionsByTarget['test-input']).toBeUndefined();
    expect(service.state.context.transcriptions).toEqual({});
    expect(service.state.context.accumulatedText).toBe('');
    
    // Verify termination event was emitted
    expect(EventBus.emit).toHaveBeenCalledWith('dictation:terminatedByManualEdit', {
      targetElement: inputElement,
      reason: 'manual-edit'
    });
    
    // Verify recording was stopped
    expect(EventBus.emit).toHaveBeenCalledWith('audio:stopRecording');
    expect(EventBus.emit).toHaveBeenCalledWith('audio:tearDownRecording');
  });

  it('should clear all transcriptions for the edited target', async () => {
    // Start the dictation machine
    service.start();
    
    // Simulate starting dictation
    service.send({ type: 'saypi:startDictation', targetElement: inputElement });
    service.send({ type: 'saypi:callReady' });
    
    // Add multiple transcriptions
    service.state.context.transcriptionTargets[1] = inputElement;
    service.state.context.transcriptionTargets[2] = inputElement;
    service.state.context.transcriptionTargets[3] = inputElement;
    
    service.send({
      type: 'saypi:transcribed',
      text: 'First part',
      sequenceNumber: 1,
    });
    
    service.send({
      type: 'saypi:transcribed',
      text: 'Second part',
      sequenceNumber: 2,
    });
    
    service.send({
      type: 'saypi:transcribed',
      text: 'Third part',
      sequenceNumber: 3,
    });
    
    // Verify all transcriptions are present
    expect(service.state.context.transcriptionsByTarget['test-input']).toEqual({
      1: 'First part',
      2: 'Second part',
      3: 'Third part'
    });
    
    // Simulate manual edit
    service.send({
      type: 'saypi:manualEdit',
      targetElement: inputElement,
      newContent: 'Manually edited',
      oldContent: inputElement.value
    });
    
    // Verify all transcriptions were cleared
    expect(service.state.context.transcriptionsByTarget['test-input']).toBeUndefined();
    expect(service.state.context.transcriptions).toEqual({});
    expect(service.state.context.initialTextByTarget['test-input']).toBeUndefined();
  });

  it('should handle manual edit when no transcriptions exist', async () => {
    // Start the dictation machine
    service.start();
    
    // Simulate starting dictation
    service.send({ type: 'saypi:startDictation', targetElement: inputElement });
    service.send({ type: 'saypi:callReady' });
    
    // Simulate manual edit without any transcriptions
    service.send({
      type: 'saypi:manualEdit',
      targetElement: inputElement,
      newContent: 'Typed manually',
      oldContent: ''
    });
    
    // Should transition to idle without errors
    expect(service.state.value).toBe('idle');
    
    // Verify termination event was still emitted
    expect(EventBus.emit).toHaveBeenCalledWith('dictation:terminatedByManualEdit', {
      targetElement: inputElement,
      reason: 'manual-edit'
    });
  });

  it('should handle manual edit during different states', async () => {
    // Start the dictation machine
    service.start();
    
    // Test manual edit during starting state
    service.send({ type: 'saypi:startDictation', targetElement: inputElement });
    expect(service.state.value).toBe('starting');
    
    service.send({
      type: 'saypi:manualEdit',
      targetElement: inputElement,
      newContent: 'Edit during starting',
      oldContent: ''
    });
    
    // Should transition to idle
    expect(service.state.value).toBe('idle');
    
    // Start again and move to listening state
    service.send({ type: 'saypi:startDictation', targetElement: inputElement });
    service.send({ type: 'saypi:callReady' });
    expect(service.state.value).toEqual(expect.objectContaining({ listening: expect.any(Object) }));
    
    // Test manual edit during listening state
    service.send({
      type: 'saypi:manualEdit',
      targetElement: inputElement,
      newContent: 'Edit during listening',
      oldContent: ''
    });
    
    // Should transition to idle
    expect(service.state.value).toBe('idle');
  });

  it('should terminate entire dictation session on manual edit', async () => {
    // Create a second input element
    const secondInput = document.createElement('input');
    secondInput.id = 'second-input';
    secondInput.type = 'text';
    document.body.appendChild(secondInput);
    
    // Start the dictation machine
    service.start();
    
    // Simulate starting dictation
    service.send({ type: 'saypi:startDictation', targetElement: inputElement });
    service.send({ type: 'saypi:callReady' });
    
    // Add transcriptions for both targets
    service.state.context.transcriptionTargets[1] = inputElement;
    service.state.context.transcriptionTargets[2] = secondInput;
    
    service.send({
      type: 'saypi:transcribed',
      text: 'First input text',
      sequenceNumber: 1,
    });
    
    // Switch target
    service.send({ type: 'saypi:switchTarget', targetElement: secondInput });
    
    service.send({
      type: 'saypi:transcribed',
      text: 'Second input text',
      sequenceNumber: 2,
    });
    
    // Verify both transcriptions exist
    expect(service.state.context.transcriptionsByTarget['test-input']).toBeDefined();
    expect(service.state.context.transcriptionsByTarget['second-input']).toBeDefined();
    
    // Simulate manual edit on first input
    service.send({
      type: 'saypi:manualEdit',
      targetElement: inputElement,
      newContent: 'Edited first',
      oldContent: 'First input text'
    });
    
    // SIMPLIFIED BEHAVIOR: Manual edit terminates entire dictation session
    // This is cleaner and more predictable than trying to maintain partial state
    expect(service.state.value).toBe('idle');
    
    // The edited target's transcriptions should be cleared
    expect(service.state.context.transcriptionsByTarget['test-input']).toBeUndefined();
    
    // In the simplified approach, when dictation is terminated, 
    // the session ends completely. Other targets' transcriptions may be preserved
    // in the context but the dictation session itself is terminated.
    // This prevents confusing state management issues.
  });
});
