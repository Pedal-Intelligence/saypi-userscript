import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { interpret } from 'xstate';
import EventBus from '../src/events/EventBus.js';

// Mock dependencies
vi.mock('../src/TranscriptionModule', () => ({
  uploadAudioWithRetry: vi.fn(() => Promise.resolve(1)),
  isTranscriptionPending: vi.fn(() => false),
  clearPendingTranscriptions: vi.fn(),
  getCurrentSequenceNumber: vi.fn(() => 1),
}));

vi.mock('../src/ConfigModule', () => ({
  config: {
    apiServerUrl: 'http://localhost:3000',
  },
}));

vi.mock('../src/prefs/PreferenceModule', () => ({
  UserPreferenceModule: {
    getInstance: () => ({
      getLanguage: vi.fn(() => Promise.resolve('en')),
    }),
  },
}));

vi.mock('../src/error-management/TranscriptionErrorManager', () => ({
  default: {
    recordAttempt: vi.fn(),
  },
}));

vi.mock('../src/TranscriptMergeService', () => ({
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
import { createDictationMachine } from '../src/state-machines/DictationMachine';
import * as TranscriptionModule from '../src/TranscriptionModule';

describe('Universal Dictation State Accumulation Bug', () => {
  let service: any;
  let chatInputElement: HTMLInputElement;
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset TranscriptionModule mocks
    let sequenceCounter = 0;
    vi.mocked(TranscriptionModule.getCurrentSequenceNumber).mockImplementation(() => sequenceCounter);
    vi.mocked(TranscriptionModule.uploadAudioWithRetry).mockImplementation(() => {
      sequenceCounter++;
      return Promise.resolve(sequenceCounter);
    });
    
    // Create a chat input element (simulating ChatGPT, Character.AI, etc.)
    chatInputElement = document.createElement('input');
    chatInputElement.id = 'chat-input';
    chatInputElement.type = 'text';
    chatInputElement.placeholder = 'Message ChatGPT...';
    chatInputElement.value = '';
    document.body.appendChild(chatInputElement);
    
    // Create fresh machine for each test
    const machine = createDictationMachine(chatInputElement);
    service = interpret(machine);
  });

  afterEach(() => {
    if (service) {
      service.stop();
    }
    document.body.innerHTML = '';
  });

  it('should demonstrate the state accumulation bug', async () => {
    // Start the dictation machine
    service.start();
    
    // Simulate starting dictation
    service.send({ type: 'saypi:startDictation', targetElement: chatInputElement });
    service.send({ type: 'saypi:callReady' });
    
    // Set up first transcription target mapping
    service.state.context.transcriptionTargets[1] = chatInputElement;
    
    // Simulate transcription response for first session
    service.send({
      type: 'saypi:transcribed',
      text: 'Hello, how are you?',
      sequenceNumber: 1,
    });
    
    // Check that the input field contains the first dictation
    expect(chatInputElement.value).toBe('Hello, how are you?');
    const targetId = 'chat-input'; // Corrected target ID based on actual implementation
    expect(service.state.context.transcriptionsByTarget).toHaveProperty(targetId);
    
    // Simulate the chat platform submitting the message and clearing the input
    // This is what happens in real chat platforms after message submission
    // NOTE: This clearing does NOT trigger a manual edit event, which is the bug
    chatInputElement.value = '';
    // Do NOT dispatch input event - this simulates external clearing without manual edit detection
    
    // Set up second transcription target mapping (same element, different sequence)
    service.state.context.transcriptionTargets[2] = chatInputElement;
    
    // Simulate transcription response for second session
    service.send({
      type: 'saypi:transcribed',
      text: "What's the weather like?",
      sequenceNumber: 2,
    });
    
    // BUG FIX: After implementing the fix, this should only contain the new content
    // instead of accumulating previous transcriptions
    console.log('Current input value:', chatInputElement.value);
    console.log('Current transcriptions:', service.state.context.transcriptionsByTarget);
    
    // With the fix, this should now pass - field should only have the new content
    expect(chatInputElement.value).toBe("What's the weather like?");
    
    // And the transcription state should only contain the current session
    expect(service.state.context.transcriptionsByTarget[targetId]).toEqual({
      2: "What's the weather like?"
    });
  });

  it('should clear transcription state when field value changes from non-empty to empty', async () => {
    // Start the dictation machine
    service.start();
    
    // Simulate starting dictation
    service.send({ type: 'saypi:startDictation', targetElement: chatInputElement });
    service.send({ type: 'saypi:callReady' });
    
    // Set up transcription target mapping
    service.state.context.transcriptionTargets[1] = chatInputElement;
    
    // Simulate transcription response
    service.send({
      type: 'saypi:transcribed',
      text: 'Hello world',
      sequenceNumber: 1,
    });
    
    // Verify initial state
    expect(chatInputElement.value).toBe('Hello world');
    expect(Object.keys(service.state.context.transcriptionsByTarget)).toHaveLength(1);
    
    // Simulate external clearing (e.g., chat platform clearing input after submission)
    chatInputElement.value = '';
    
    // Send manual edit event to simulate field clearing detection
    service.send({
      type: 'saypi:manualEdit',
      targetElement: chatInputElement,
      newContent: '',
      oldContent: 'Hello world'
    });
    
    // Check that transcription state is cleared
    const targetId = 'chat-input'; // Corrected target ID
    
    // Transcriptions for this target should be cleared
    expect(service.state.context.transcriptionsByTarget[targetId]).toBeUndefined();
    
    // Global transcriptions should also be cleared
    expect(Object.keys(service.state.context.transcriptions)).toHaveLength(0);
  });

  it('should handle edge case: empty transcriptions should not trigger clearing', async () => {
    // Start the dictation machine
    service.start();
    
    // Simulate starting dictation
    service.send({ type: 'saypi:startDictation', targetElement: chatInputElement });
    service.send({ type: 'saypi:callReady' });
    
    // Simulate receiving an empty transcription (should not trigger clearing logic)
    service.state.context.transcriptionTargets[1] = chatInputElement;
    service.send({
      type: 'saypi:transcribed',
      text: '', // Empty transcription
      sequenceNumber: 1,
    });
    
    // Field should remain empty and no clearing should occur
    expect(chatInputElement.value).toBe('');
    
    // Now send a real transcription
    service.state.context.transcriptionTargets[2] = chatInputElement;
    service.send({
      type: 'saypi:transcribed',
      text: 'Real transcription',
      sequenceNumber: 2,
    });
    
    // Should contain only the real transcription
    expect(chatInputElement.value).toBe('Real transcription');
  });

  it('should handle multiple field clearings correctly', async () => {
    // Start the dictation machine
    service.start();
    
    // Simulate starting dictation
    service.send({ type: 'saypi:startDictation', targetElement: chatInputElement });
    service.send({ type: 'saypi:callReady' });
    
    // First session
    service.state.context.transcriptionTargets[1] = chatInputElement;
    service.send({
      type: 'saypi:transcribed',
      text: 'First message',
      sequenceNumber: 1,
    });
    expect(chatInputElement.value).toBe('First message');
    
    // External clear (simulate chat platform clearing)
    chatInputElement.value = '';
    
    // Second session
    service.state.context.transcriptionTargets[2] = chatInputElement;
    service.send({
      type: 'saypi:transcribed',
      text: 'Second message',
      sequenceNumber: 2,
    });
    expect(chatInputElement.value).toBe('Second message');
    
    // Another external clear
    chatInputElement.value = '';
    
    // Third session
    service.state.context.transcriptionTargets[3] = chatInputElement;
    service.send({
      type: 'saypi:transcribed',
      text: 'Third message',
      sequenceNumber: 3,
    });
    expect(chatInputElement.value).toBe('Third message');
    
    // Verify final state only contains the last transcription
    expect(service.state.context.transcriptionsByTarget['chat-input']).toEqual({
      3: 'Third message'
    });
  });
});

describe('Universal Dictation State Accumulation Bug - ContentEditable Elements', () => {
  let service: any;
  let contentEditableElement: HTMLDivElement;
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset TranscriptionModule mocks
    let sequenceCounter = 0;
    vi.mocked(TranscriptionModule.getCurrentSequenceNumber).mockImplementation(() => sequenceCounter);
    vi.mocked(TranscriptionModule.uploadAudioWithRetry).mockImplementation(() => {
      sequenceCounter++;
      return Promise.resolve(sequenceCounter);
    });
    
    // Create a content-editable element (simulating chat platforms that use divs)
    contentEditableElement = document.createElement('div');
    contentEditableElement.id = 'chat-editable';
    contentEditableElement.contentEditable = 'true';
    contentEditableElement.textContent = '';
    contentEditableElement.style.minHeight = '20px';
    document.body.appendChild(contentEditableElement);
    
    // Create fresh machine for each test
    const machine = createDictationMachine(contentEditableElement);
    service = interpret(machine);
  });

  afterEach(() => {
    if (service) {
      service.stop();
    }
    document.body.innerHTML = '';
  });

  it('should detect external field clearing in contentEditable elements', async () => {
    console.log('Testing contentEditable field clearing detection...');
    
    // Start the dictation machine
    service.start();
    
    // Simulate starting dictation
    service.send({ type: 'saypi:startDictation', targetElement: contentEditableElement });
    service.send({ type: 'saypi:callReady' });
    
    // First transcription session
    service.state.context.transcriptionTargets[1] = contentEditableElement;
    service.send({
      type: 'saypi:transcribed',
      text: 'Hello from contentEditable',
      sequenceNumber: 1,
    });
    
    expect(contentEditableElement.textContent).toBe('Hello from contentEditable');
    expect(service.state.context.transcriptionsByTarget['chat-editable']).toEqual({
      1: 'Hello from contentEditable'
    });
    
    // Simulate external clearing (like what chat platforms do)
    // This is the key test - clearing textContent instead of value
    contentEditableElement.textContent = '';
    
    // Second session - should detect clearing and start fresh
    service.state.context.transcriptionTargets[2] = contentEditableElement;
    service.send({
      type: 'saypi:transcribed',
      text: 'New message',
      sequenceNumber: 2,
    });
    
    // Should only contain new content, not accumulated
    expect(contentEditableElement.textContent).toBe('New message');
    expect(service.state.context.transcriptionsByTarget['chat-editable']).toEqual({
      2: 'New message'
    });
  });

  it('should handle contentEditable with HTML content before clearing', async () => {
    console.log('Testing contentEditable with HTML content...');
    
    service.start();
    service.send({ type: 'saypi:startDictation', targetElement: contentEditableElement });
    service.send({ type: 'saypi:callReady' });
    
    // First transcription
    service.state.context.transcriptionTargets[1] = contentEditableElement;
    service.send({
      type: 'saypi:transcribed',
      text: 'Content with formatting',
      sequenceNumber: 1,
    });
    
    expect(contentEditableElement.textContent).toBe('Content with formatting');
    
    // Simulate platform adding HTML formatting, then clearing
    contentEditableElement.innerHTML = '<p><br></p>'; // Some platforms do this
    expect(contentEditableElement.textContent).toBe(''); // textContent should be empty
    
    // Second transcription should detect clearing
    service.state.context.transcriptionTargets[2] = contentEditableElement;
    service.send({
      type: 'saypi:transcribed',
      text: 'Fresh start',
      sequenceNumber: 2,
    });
    
    expect(contentEditableElement.textContent).toBe('Fresh start');
    expect(service.state.context.transcriptionsByTarget['chat-editable']).toEqual({
      2: 'Fresh start'
    });
  });

  it('should work with mixed input and contentEditable elements', async () => {
    console.log('Testing mixed element types...');
    
    // Create an input element too
    const inputElement = document.createElement('input');
    inputElement.id = 'mixed-input';
    inputElement.type = 'text';
    document.body.appendChild(inputElement);
    
    service.start();
    
    // Test contentEditable first
    service.send({ type: 'saypi:startDictation', targetElement: contentEditableElement });
    service.send({ type: 'saypi:callReady' });
    
    service.state.context.transcriptionTargets[1] = contentEditableElement;
    service.send({
      type: 'saypi:transcribed',
      text: 'ContentEditable text',
      sequenceNumber: 1,
    });
    
    expect(contentEditableElement.textContent).toBe('ContentEditable text');
    
    // Switch to input element
    service.send({ type: 'saypi:switchTarget', targetElement: inputElement });
    
    service.state.context.transcriptionTargets[2] = inputElement;
    service.send({
      type: 'saypi:transcribed',
      text: 'Input text',
      sequenceNumber: 2,
    });
    
    expect(inputElement.value).toBe('Input text');
    
    // Clear both externally
    contentEditableElement.textContent = '';
    inputElement.value = '';
    
    // Back to contentEditable - should detect clearing
    service.send({ type: 'saypi:switchTarget', targetElement: contentEditableElement });
    service.state.context.transcriptionTargets[3] = contentEditableElement;
    service.send({
      type: 'saypi:transcribed',
      text: 'Fresh contentEditable',
      sequenceNumber: 3,
    });
    
    expect(contentEditableElement.textContent).toBe('Fresh contentEditable');
    expect(service.state.context.transcriptionsByTarget['chat-editable']).toEqual({
      3: 'Fresh contentEditable'
    });
  });
});