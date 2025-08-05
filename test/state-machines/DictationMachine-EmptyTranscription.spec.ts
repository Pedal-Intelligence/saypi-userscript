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

describe('DictationMachine - Empty Transcription Bug Documentation', () => {
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

  it('should document the root cause and fix for the empty transcription bug', () => {
    console.log('=== EMPTY TRANSCRIPTION BUG DOCUMENTATION ===');
    console.log('');
    console.log('ROOT CAUSE:');
    console.log('- TranscriptionModule sends saypi:transcribedEmpty to StateMachineService.actor');
    console.log('- BUT does not emit saypi:transcribedEmpty on EventBus');
    console.log('- UniversalDictationModule listens on EventBus, so never receives the event');
    console.log('- DictationMachine stays stuck in transcribing state');
    console.log('- User sees blue icon indefinitely');
    console.log('');
    console.log('FIX:');
    console.log('- Added EventBus.emit("saypi:transcribedEmpty") in TranscriptionModule.ts');
    console.log('- Now both StateMachineService.actor AND EventBus receive the event');
    console.log('- UniversalDictationModule receives event and forwards to DictationMachine');
    console.log('- DictationMachine transitions from transcribing → ready');
    console.log('- Icon changes from blue → green, user can continue dictating');
    console.log('');
    console.log('VERIFICATION:');
    
    // Demonstrate the fix works in the state machine
    service.send({ type: 'saypi:startDictation', targetElement: inputElement });
    service.send('saypi:callReady');
    service.send('saypi:userSpeaking');
    
    const audioBlob = new Blob(['audio data'], { type: 'audio/wav' });
    service.send({
      type: 'saypi:userStoppedSpeaking',
      duration: 1000,
      blob: audioBlob,
      frames: new Float32Array([0.1])
    });

    let state = service.state.value;
    console.log('- Before empty transcription:', state);
    expect(state).toEqual({ listening: { recording: 'notSpeaking', converting: 'transcribing' } });
    
    service.send('saypi:transcribedEmpty');
    
    state = service.state.value;
    console.log('- After empty transcription:', state);
    expect(state).toEqual({ listening: { recording: 'notSpeaking', converting: 'ready' } });
    
    // User can continue speaking
    service.send('saypi:userSpeaking');
    state = service.state.value;
    console.log('- User speaks again:', state);
    expect(state).toEqual({ listening: { recording: 'userSpeaking', converting: 'ready' } });
    
    console.log('✅ State machine correctly handles empty transcription');
    console.log('✅ User can continue dictating after empty transcription');
    console.log('=== END DOCUMENTATION ===');
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