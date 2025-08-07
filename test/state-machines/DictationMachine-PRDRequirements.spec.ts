import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { interpret } from 'xstate';
import EventBus from '../../src/events/EventBus.js';

// Mock dependencies
vi.mock('../../src/TranscriptionModule', () => ({
  uploadAudioWithRetry: vi.fn(() => Promise.resolve(1)),
  isTranscriptionPending: vi.fn(() => false),
  clearPendingTranscriptions: vi.fn(),
  getCurrentSequenceNumber: vi.fn(() => 0),
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

// Import the machine and helper functions after mocks are set up
import { createDictationMachine } from '../../src/state-machines/DictationMachine';
import * as TranscriptionModule from '../../src/TranscriptionModule';

describe('PRD Requirements - Dictation Text Merging', () => {
  let service: any;
  let inputElement: HTMLInputElement;
  let sequenceCounter = 0;
  
  beforeEach(() => {
    vi.clearAllMocks();
    sequenceCounter = 0;
    
    // Mock sequence number generation
    vi.mocked(TranscriptionModule.getCurrentSequenceNumber).mockImplementation(() => sequenceCounter);
    vi.mocked(TranscriptionModule.uploadAudioWithRetry).mockImplementation(() => {
      sequenceCounter++;
      return Promise.resolve(sequenceCounter);
    });
    
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

  describe('Sequential Transcript Ordering', () => {
    it('should maintain correct order even when responses arrive out of order', async () => {
      service.start();
      service.send({ type: 'saypi:startDictation', targetElement: inputElement });
      service.send({ type: 'saypi:callReady' });
      
      // Set up target mappings for multiple sequences
      service.state.context.transcriptionTargets[1] = inputElement;
      service.state.context.transcriptionTargets[2] = inputElement;
      service.state.context.transcriptionTargets[3] = inputElement;
      
      // Send transcriptions out of order
      service.send({
        type: 'saypi:transcribed',
        text: 'Third',
        sequenceNumber: 3,
      });
      
      service.send({
        type: 'saypi:transcribed',
        text: 'First',
        sequenceNumber: 1,
      });
      
      service.send({
        type: 'saypi:transcribed',
        text: 'Second',
        sequenceNumber: 2,
      });
      
      // Verify they're merged in the correct order
      expect(inputElement.value).toBe('First Second Third');
    });
  });

  describe('Initial Text Preservation', () => {
    it('should preserve pre-existing content when dictation begins', async () => {
      // Start with existing content
      inputElement.value = 'Existing text';
      
      service.start();
      service.send({ type: 'saypi:startDictation', targetElement: inputElement });
      service.send({ type: 'saypi:callReady' });
      
      // Verify initial text is captured
      expect(service.state.context.initialTextByTarget['test-input']).toBe('Existing text');
      
      // Add transcription
      service.state.context.transcriptionTargets[1] = inputElement;
      service.send({
        type: 'saypi:transcribed',
        text: 'new dictation',
        sequenceNumber: 1,
      });
      
      // Verify existing text is preserved and new text is appended
      expect(inputElement.value).toBe('Existing text new dictation');
    });
  });

  describe('Smart Text Joining', () => {
    it('should join text segments with appropriate spacing', async () => {
      service.start();
      service.send({ type: 'saypi:startDictation', targetElement: inputElement });
      service.send({ type: 'saypi:callReady' });
      
      service.state.context.transcriptionTargets[1] = inputElement;
      service.state.context.transcriptionTargets[2] = inputElement;
      
      // Test various joining scenarios
      service.send({
        type: 'saypi:transcribed',
        text: 'Hello',
        sequenceNumber: 1,
      });
      
      service.send({
        type: 'saypi:transcribed',
        text: 'world',
        sequenceNumber: 2,
      });
      
      // Should add space between segments
      expect(inputElement.value).toBe('Hello world');
    });
    
    it('should not add double spaces when segments already have spacing', async () => {
      service.start();
      service.send({ type: 'saypi:startDictation', targetElement: inputElement });
      service.send({ type: 'saypi:callReady' });
      
      service.state.context.transcriptionTargets[1] = inputElement;
      service.state.context.transcriptionTargets[2] = inputElement;
      
      service.send({
        type: 'saypi:transcribed',
        text: 'Hello ',  // Trailing space
        sequenceNumber: 1,
      });
      
      service.send({
        type: 'saypi:transcribed',
        text: 'world',
        sequenceNumber: 2,
      });
      
      // Should not add extra space
      expect(inputElement.value).toBe('Hello world');
    });
    
    it('should normalize ellipsis characters', async () => {
      service.start();
      service.send({ type: 'saypi:startDictation', targetElement: inputElement });
      service.send({ type: 'saypi:callReady' });
      
      service.state.context.transcriptionTargets[1] = inputElement;
      
      service.send({
        type: 'saypi:transcribed',
        text: 'Wait… let me think...',  // Unicode ellipsis and three dots
        sequenceNumber: 1,
      });
      
      // Ellipses should be normalized to spaces
      expect(inputElement.value).toBe('Wait let me think');
    });
  });

  describe('Multi-Target Support', () => {
    it('should handle dictation switching between different input fields', async () => {
      // Create second input
      const secondInput = document.createElement('input');
      secondInput.id = 'second-input';
      secondInput.type = 'text';
      document.body.appendChild(secondInput);
      
      service.start();
      service.send({ type: 'saypi:startDictation', targetElement: inputElement });
      service.send({ type: 'saypi:callReady' });
      
      // First target
      service.state.context.transcriptionTargets[1] = inputElement;
      service.send({
        type: 'saypi:transcribed',
        text: 'First field text',
        sequenceNumber: 1,
      });
      
      // Switch to second target
      service.send({ type: 'saypi:switchTarget', targetElement: secondInput });
      
      service.state.context.transcriptionTargets[2] = secondInput;
      service.send({
        type: 'saypi:transcribed',
        text: 'Second field text',
        sequenceNumber: 2,
      });
      
      // Verify each field has its own content
      expect(inputElement.value).toBe('First field text');
      expect(secondInput.value).toBe('Second field text');
      
      // Verify separate transcription contexts
      expect(service.state.context.transcriptionsByTarget['test-input']).toEqual({
        1: 'First field text'
      });
      expect(service.state.context.transcriptionsByTarget['second-input']).toEqual({
        2: 'Second field text'
      });
    });
  });

  describe('Manual Edit Detection & Handling', () => {
    it('should terminate dictation when manual edit is detected', async () => {
      service.start();
      service.send({ type: 'saypi:startDictation', targetElement: inputElement });
      service.send({ type: 'saypi:callReady' });
      
      service.state.context.transcriptionTargets[1] = inputElement;
      service.send({
        type: 'saypi:transcribed',
        text: 'Dictated text',
        sequenceNumber: 1,
      });
      
      expect(inputElement.value).toBe('Dictated text');
      
      // Simulate manual edit
      inputElement.value = 'Manually edited text';
      service.send({
        type: 'saypi:manualEdit',
        targetElement: inputElement,
        newContent: 'Manually edited text',
        oldContent: 'Dictated text'
      });
      
      // Verify dictation is terminated
      expect(service.state.value).toBe('idle');
      
      // Verify termination event was emitted
      expect(EventBus.emit).toHaveBeenCalledWith('dictation:terminatedByManualEdit', {
        targetElement: inputElement,
        reason: 'manual-edit'
      });
      
      // Verify transcription state is cleared
      expect(service.state.context.transcriptionsByTarget['test-input']).toBeUndefined();
    });
  });

  describe('External Field Clearing Detection', () => {
    it('should detect and handle when fields are cleared externally (chat platform issue)', async () => {
      service.start();
      service.send({ type: 'saypi:startDictation', targetElement: inputElement });
      service.send({ type: 'saypi:callReady' });
      
      // First message
      service.state.context.transcriptionTargets[1] = inputElement;
      service.send({
        type: 'saypi:transcribed',
        text: 'First message to chat',
        sequenceNumber: 1,
      });
      
      expect(inputElement.value).toBe('First message to chat');
      
      // Simulate chat platform clearing the field (external clear)
      inputElement.value = '';
      
      // Second message should detect the clearing and start fresh
      service.state.context.transcriptionTargets[2] = inputElement;
      service.send({
        type: 'saypi:transcribed',
        text: 'Second message to chat',
        sequenceNumber: 2,
      });
      
      // Should only contain the second message, not accumulated
      expect(inputElement.value).toBe('Second message to chat');
      
      // Verify state was properly reset
      expect(service.state.context.transcriptionsByTarget['test-input']).toEqual({
        2: 'Second message to chat'
      });
    });
  });

  describe('ContentEditable Support', () => {
    it('should work with contenteditable elements', async () => {
      // Create contenteditable div
      const editableDiv = document.createElement('div');
      editableDiv.id = 'editable-div';
      editableDiv.contentEditable = 'true';
      document.body.appendChild(editableDiv);
      
      const machine = createDictationMachine(editableDiv);
      const editableService = interpret(machine);
      editableService.start();
      
      editableService.send({ type: 'saypi:startDictation', targetElement: editableDiv });
      editableService.send({ type: 'saypi:callReady' });
      
      editableService.state.context.transcriptionTargets[1] = editableDiv;
      editableService.send({
        type: 'saypi:transcribed',
        text: 'ContentEditable text',
        sequenceNumber: 1,
      });
      
      expect(editableDiv.textContent).toBe('ContentEditable text');
      
      editableService.stop();
    });
  });

  describe('Server-side Merging Support', () => {
    it('should handle server-merged transcriptions', async () => {
      service.start();
      service.send({ type: 'saypi:startDictation', targetElement: inputElement });
      service.send({ type: 'saypi:callReady' });
      
      // Set up multiple sequences that will be merged
      service.state.context.transcriptionTargets[1] = inputElement;
      service.state.context.transcriptionTargets[2] = inputElement;
      service.state.context.transcriptionTargets[3] = inputElement;
      
      // First two transcriptions
      service.send({
        type: 'saypi:transcribed',
        text: 'Part one',
        sequenceNumber: 1,
      });
      
      service.send({
        type: 'saypi:transcribed',
        text: 'Part two',
        sequenceNumber: 2,
      });
      
      // Server sends merged result
      service.send({
        type: 'saypi:transcribed',
        text: 'Part one Part two Part three',
        sequenceNumber: 3,
        merged: [1, 2]  // Server merged sequences 1 and 2 into 3
      });
      
      // Should use the server-merged result
      expect(inputElement.value).toBe('Part one Part two Part three');
      
      // Verify merged sequences were removed from context
      expect(service.state.context.transcriptions[1]).toBeUndefined();
      expect(service.state.context.transcriptions[2]).toBeUndefined();
      expect(service.state.context.transcriptions[3]).toBe('Part one Part two Part three');
    });
  });

  describe('Error Recovery', () => {
    it('should handle transcription failures gracefully', async () => {
      service.start();
      service.send({ type: 'saypi:startDictation', targetElement: inputElement });
      service.send({ type: 'saypi:callReady' });
      
      // Simulate transcription failure
      service.send({ type: 'saypi:transcribeFailed' });
      
      // Should transition to error state
      expect(service.state.value).toEqual({ errors: 'transcribeFailed' });
      
      // Should recover to idle after timeout (simulated by advancing time)
      // In real usage, this would happen after 3 seconds
    });
    
    it('should handle empty transcriptions', async () => {
      service.start();
      service.send({ type: 'saypi:startDictation', targetElement: inputElement });
      service.send({ type: 'saypi:callReady' });
      
      service.state.context.transcriptionTargets[1] = inputElement;
      
      // Send empty transcription
      service.send({
        type: 'saypi:transcribed',
        text: '',
        sequenceNumber: 1,
      });
      
      // Should not crash or produce errors
      expect(inputElement.value).toBe('');
      
      // Send non-empty transcription
      service.state.context.transcriptionTargets[2] = inputElement;
      service.send({
        type: 'saypi:transcribed',
        text: 'Valid text',
        sequenceNumber: 2,
      });
      
      // Should handle valid text normally
      expect(inputElement.value).toBe('Valid text');
    });
  });
});
