import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createTestActor } from './state-machines/support/testActor';
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

/**
 * Drive one real speech turn so the machine registers `transcriptionTargets[seq]`
 * the way production does, instead of mutating the (frozen-on-v5) snapshot context.
 *
 * The recording flow is: saypi:userSpeaking -> saypi:userStoppedSpeaking (with audio).
 * `handleAudioStopped` calls `uploadAudioSegment`, which assigns
 * `transcriptionTargets[getCurrentSequenceNumber() + 1] = <active target>`.
 *
 * Because the mocked `getCurrentSequenceNumber()` starts at 0 and the mocked
 * `uploadAudioWithRetry()` increments it on each turn, successive turns register
 * sequence numbers 1, 2, 3, ... — exactly the numbers the assertions below expect.
 *
 * The active target is `context.targetElement` (set by startDictation / switchTarget),
 * so each turn maps the current target. A non-empty `blob` and positive `duration`
 * are required to pass the machine's `hasAudio` guard. `frames` is intentionally
 * omitted to keep the fallback (single-segment) path and avoid Phase-2 buffering.
 */
const driveSpeechTurn = (svc: any) => {
  svc.send({ type: 'saypi:userSpeaking' });
  svc.send({
    type: 'saypi:userStoppedSpeaking',
    duration: 1000,
    blob: new Blob(['x'], { type: 'audio/wav' }),
  });
};

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
    service = createTestActor(machine);
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

    // Register the first transcription target by driving a real speech turn
    // (maps transcriptionTargets[1] -> chatInputElement) instead of mutating the snapshot.
    driveSpeechTurn(service);

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

    // Register the second transcription target via another real speech turn
    // (same element, maps transcriptionTargets[2] -> chatInputElement).
    driveSpeechTurn(service);

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

    // Register the transcription target via a real speech turn (maps transcriptionTargets[1]).
    driveSpeechTurn(service);

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
    // Register transcriptionTargets[1] via a real speech turn first.
    driveSpeechTurn(service);
    service.send({
      type: 'saypi:transcribed',
      text: '', // Empty transcription
      sequenceNumber: 1,
    });

    // Field should remain empty and no clearing should occur
    expect(chatInputElement.value).toBe('');

    // Now send a real transcription (register transcriptionTargets[2] via another turn).
    driveSpeechTurn(service);
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
    
    // First session (register transcriptionTargets[1] via a real speech turn)
    driveSpeechTurn(service);
    service.send({
      type: 'saypi:transcribed',
      text: 'First message',
      sequenceNumber: 1,
    });
    expect(chatInputElement.value).toBe('First message');

    // External clear (simulate chat platform clearing)
    chatInputElement.value = '';

    // Second session (register transcriptionTargets[2])
    driveSpeechTurn(service);
    service.send({
      type: 'saypi:transcribed',
      text: 'Second message',
      sequenceNumber: 2,
    });
    expect(chatInputElement.value).toBe('Second message');

    // Another external clear
    chatInputElement.value = '';

    // Third session (register transcriptionTargets[3])
    driveSpeechTurn(service);
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

    // Driving the real recording flow runs the machine's getInputContext(), which does
    // an `instanceof HTMLSelectElement` check. The shared JSDOM setup promotes
    // HTMLInputElement/HTMLTextAreaElement/HTMLDivElement to globals but not
    // HTMLSelectElement, so for the input-element tests the `instanceof` short-circuits
    // before reaching it — but for a contentEditable target it is evaluated and throws
    // a ReferenceError. Promote it here (from the JSDOM window) so the event-driven
    // setup can register transcription targets for contentEditable elements too.
    if (typeof (globalThis as any).HTMLSelectElement === 'undefined') {
      (globalThis as any).HTMLSelectElement = (window as any).HTMLSelectElement;
    }

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
    service = createTestActor(machine);
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
    
    // First transcription session (register transcriptionTargets[1] via a real speech turn)
    driveSpeechTurn(service);
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

    // Second session - should detect clearing and start fresh (register transcriptionTargets[2])
    driveSpeechTurn(service);
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
    
    // First transcription (register transcriptionTargets[1] via a real speech turn)
    driveSpeechTurn(service);
    service.send({
      type: 'saypi:transcribed',
      text: 'Content with formatting',
      sequenceNumber: 1,
    });

    expect(contentEditableElement.textContent).toBe('Content with formatting');

    // Simulate platform adding HTML formatting, then clearing
    contentEditableElement.innerHTML = '<p><br></p>'; // Some platforms do this
    expect(contentEditableElement.textContent).toBe(''); // textContent should be empty

    // Second transcription should detect clearing (register transcriptionTargets[2])
    driveSpeechTurn(service);
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
    
    // Register transcriptionTargets[1] -> contentEditableElement via a real speech turn
    // (the active target is the contentEditable from startDictation).
    driveSpeechTurn(service);
    service.send({
      type: 'saypi:transcribed',
      text: 'ContentEditable text',
      sequenceNumber: 1,
    });

    expect(contentEditableElement.textContent).toBe('ContentEditable text');

    // Switch to input element - the active target becomes inputElement, so the next
    // speech turn maps transcriptionTargets[2] -> inputElement.
    service.send({ type: 'saypi:switchTarget', targetElement: inputElement });

    driveSpeechTurn(service);
    service.send({
      type: 'saypi:transcribed',
      text: 'Input text',
      sequenceNumber: 2,
    });

    expect(inputElement.value).toBe('Input text');

    // Clear both externally
    contentEditableElement.textContent = '';
    inputElement.value = '';

    // Back to contentEditable - should detect clearing (register transcriptionTargets[3]).
    service.send({ type: 'saypi:switchTarget', targetElement: contentEditableElement });
    driveSpeechTurn(service);
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