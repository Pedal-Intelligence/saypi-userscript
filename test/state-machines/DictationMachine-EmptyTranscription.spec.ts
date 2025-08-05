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

  it('should demonstrate the exact bug: icon stays blue after empty transcription', () => {
    console.log('=== REPRODUCING THE EMPTY TRANSCRIPTION BUG ===');
    
    // 1. Start dictation (icon becomes black/white -> green)
    service.send({ type: 'saypi:startDictation', targetElement: inputElement });
    console.log('1. Started dictation, state:', service.state.value);

    // 2. Microphone ready (icon becomes green)
    service.send('saypi:callReady');
    console.log('2. Microphone ready, state:', service.state.value);

    // 3. User starts speaking (icon stays green)
    service.send('saypi:userSpeaking');
    let state = service.state.value;
    console.log('3. User speaking, state:', state);
    expect(getIconColorForState(state)).toBe('#66bb6a'); // Green

    // 4. User stops speaking with audio (icon becomes blue)
    const audioBlob = new Blob(['audio data'], { type: 'audio/wav' });
    service.send({
      type: 'saypi:userStoppedSpeaking',
      duration: 1000,
      blob: audioBlob,
      frames: new Float32Array([0.1, 0.2, 0.3])
    });

    state = service.state.value;
    console.log('4. User stopped speaking, transcribing, state:', state);
    expect(getIconColorForState(state)).toBe('#42a5f5'); // Blue

    // 5. THIS IS THE BUG: Empty transcription received
    console.log('5. CRITICAL: Sending empty transcription...');
    service.send('saypi:transcribedEmpty');

    state = service.state.value;
    console.log('   After empty transcription, state:', state);
    
    // EXPECTED ISSUE: The problem says "icon stays blue indefinitely"  
    // This suggests the machine might stay in transcribing state or 
    // the icon color logic has a bug for the 'ready' state
    
    // Current behavior - let's see what actually happens
    const iconColor = getIconColorForState(state);
    console.log('   Icon color is:', iconColor);
    
    // According to my test helper, this should be green, but the problem 
    // description says it stays blue. This suggests either:
    // 1. My helper function is wrong, OR
    // 2. The issue is in how UniversalDictationModule handles the state, OR  
    // 3. The machine doesn't transition to 'ready' in the real scenario
    
    console.log('=== ANALYSIS ===');
    console.log('Expected issue: Icon should stay blue (transcribing)');
    console.log('Actual behavior: Icon color is', iconColor);
    console.log('Machine state:', state);
    
    // The test shows the machine transitions correctly to 'ready' state
    // and the icon logic produces green. This suggests the real issue
    // might be elsewhere.
    
    console.log('=== END BUG REPRODUCTION ===');
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