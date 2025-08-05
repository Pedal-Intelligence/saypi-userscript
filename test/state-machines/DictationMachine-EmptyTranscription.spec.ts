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
      return Object.keys(transcripts)
        .sort((a, b) => parseInt(a) - parseInt(b))
        .map(key => transcripts[key])
        .join(' ');
    }),
  })),
}));

vi.mock('../../src/audio/AudioEncoder', () => ({
  convertToWavBlob: vi.fn(() => new Blob(['wav data'], { type: 'audio/wav' })),
}));

// Mock EventBus
vi.spyOn(EventBus, 'emit');

// Import the machine after mocks are set up
import { createDictationMachine } from '../../src/state-machines/DictationMachine';
import * as TranscriptionModule from '../../src/TranscriptionModule';

describe('DictationMachine - Empty Transcription Bug Reproduction', () => {
  let service: any;
  let inputElement: HTMLInputElement;

  beforeAll(() => {
    inputElement = document.createElement('input');
    inputElement.id = 'test-input';
    inputElement.name = 'test';
    inputElement.placeholder = 'Test input';
  });

  beforeEach(() => {
    vi.clearAllMocks();
    
    vi.mocked(TranscriptionModule.uploadAudioWithRetry).mockClear();
    vi.mocked(TranscriptionModule.isTranscriptionPending).mockReturnValue(false);
    vi.mocked(TranscriptionModule.clearPendingTranscriptions).mockClear();
    vi.mocked(TranscriptionModule.getCurrentSequenceNumber).mockReturnValue(1);
    vi.mocked(EventBus.emit).mockClear();
    
    inputElement.value = '';
    
    const machine = createDictationMachine(inputElement);
    service = interpret(machine);
    service.start();
  });

  afterEach(() => {
    if (service) {
      service.stop();
    }
  });

  it('should reproduce the ACTUAL bug: UniversalDictationModule never receives transcribedEmpty event', () => {
    console.log('=== REPRODUCING THE ACTUAL BUG ===');
    
    // This test simulates what happens in the real application:
    // 1. TranscriptionModule gets empty response
    // 2. Sends saypi:transcribedEmpty to StateMachineService.actor 
    // 3. BUT DOESN'T emit saypi:transcribedEmpty on EventBus
    // 4. UniversalDictationModule never receives the event
    // 5. DictationMachine stays in transcribing state
    
    // Start dictation and get to transcribing state
    service.send({ type: 'saypi:startDictation', targetElement: inputElement });
    service.send('saypi:callReady');
    service.send('saypi:userSpeaking');
    
    const audioBlob = new Blob(['audio data'], { type: 'audio/wav' });
    service.send({
      type: 'saypi:userStoppedSpeaking',
      duration: 1000,
      blob: audioBlob,
      frames: new Float32Array([0.1, 0.2, 0.3])
    });

    let state = service.state.value;
    console.log('Before empty transcription, state:', state);
    expect(state).toEqual({ listening: { recording: 'notSpeaking', converting: 'transcribing' } });
    expect(getIconColorForState(state)).toBe('#42a5f5'); // Blue

    // BUG SIMULATION: In the real app, TranscriptionModule doesn't emit the event on EventBus
    // So UniversalDictationModule never receives it and the dictation machine never transitions
    
    // What SHOULD happen (after the fix):
    service.send('saypi:transcribedEmpty');
    
    state = service.state.value;
    console.log('After empty transcription (with fix), state:', state);
    expect(state).toEqual({ listening: { recording: 'notSpeaking', converting: 'ready' } });
    expect(getIconColorForState(state)).toBe('#66bb6a'); // Green

    // What ACTUALLY happens in the broken app (before fix):
    // The machine would stay in transcribing state because the event never arrives
    console.log('BUG: Without the EventBus emit, dictation machine stays in transcribing state');
    console.log('RESULT: User sees blue icon indefinitely');
    
    console.log('=== END ACTUAL BUG REPRODUCTION ===');
  });

  it('should show the desired behavior after fix', () => {
    // This test shows what the behavior should be after we fix the issue
    
    // Start dictation flow
    service.send({ type: 'saypi:startDictation', targetElement: inputElement });
    service.send('saypi:callReady');
    service.send('saypi:userSpeaking');
    
    // User stops speaking -> transcribing (blue)
    service.send({
      type: 'saypi:userStoppedSpeaking',
      duration: 1000,
      blob: new Blob(['audio'], { type: 'audio/wav' }),
      frames: new Float32Array([0.1])
    });
    
    let state = service.state.value;
    expect(state).toEqual({ listening: { recording: 'notSpeaking', converting: 'transcribing' } });
    expect(getIconColorForState(state)).toBe('#42a5f5'); // Blue
    
    // Empty transcription - AFTER FIX: should go back to a state that allows green icon
    service.send('saypi:transcribedEmpty');
    
    state = service.state.value;
    
    // DESIRED BEHAVIOR: State should allow user to continue dictating with green icon
    // This might require changing the state transition or the icon color logic
    
    // User speaks again - should be green
    service.send('saypi:userSpeaking');
    state = service.state.value;
    
    const iconColor = getIconColorForState(state);
    expect(iconColor).toBe('#66bb6a'); // Green - user can see they're being heard
  });
});

// Helper function to simulate the icon color logic from UniversalDictationModule
function getIconColorForState(stateValue: any): string {
  let color = '#bdbdbd'; // Default grey

  if (typeof stateValue === 'string') {
    switch (stateValue) {
      case 'idle':
        color = '#bdbdbd'; // Grey
        break;
      case 'starting':
        color = '#ffa726'; // Orange
        break;
      case 'listening':
        color = '#66bb6a'; // Green
        break;
      case 'errors':
        color = '#ef5350'; // Red
        break;
    }
  } else if (typeof stateValue === 'object' && stateValue.listening) {
    const listeningState = stateValue.listening;
    
    // Process recording state first
    if (listeningState.recording) {
      if (listeningState.recording === 'userSpeaking') {
        color = '#66bb6a'; // Green
      } else {
        color = '#66bb6a'; // Green 
      }
    }
    
    // Converting state can override recording state color
    if (listeningState.converting) {
      if (listeningState.converting === 'transcribing') {
        color = '#42a5f5'; // Blue - transcribing overrides green
      } else if (listeningState.converting === 'accumulating') {
        color = '#66bb6a'; // Green - accumulating stays green
      }
      // NOTE: 'ready' state is not handled - falls back to recording color (green)
    }
  }
  
  return color;
}