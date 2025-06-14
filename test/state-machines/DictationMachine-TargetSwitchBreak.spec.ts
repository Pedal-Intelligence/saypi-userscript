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

// Mock EventBus
vi.spyOn(EventBus, 'emit');

// Import the machine after mocks are set up
import { createDictationMachine } from '../../src/state-machines/DictationMachine';
import * as TranscriptionModule from '../../src/TranscriptionModule';

describe('DictationMachine - Target Switch Audio Breaking', () => {
  let service: any;
  let inputElement1: HTMLInputElement;
  let inputElement2: HTMLInputElement;

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
  });

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset mocks with incrementing sequence numbers
    let uploadSequence = 0;
    vi.mocked(TranscriptionModule.uploadAudioWithRetry).mockImplementation(() => {
      uploadSequence++;
      return Promise.resolve(uploadSequence);
    });
    
    let currentSeq = 0;
    vi.mocked(TranscriptionModule.getCurrentSequenceNumber).mockImplementation(() => {
      currentSeq++;
      return currentSeq;
    });
    vi.mocked(EventBus.emit).mockClear();
    
    // Reset HTML elements
    inputElement1.value = '';
    inputElement2.value = '';
    
    // Create fresh machine for each test
    const machine = createDictationMachine();
    service = interpret(machine);
  });

  afterEach(() => {
    if (service) {
      service.stop();
    }
  });

  describe('Target Switch During Speech', () => {
    beforeEach(() => {
      service.start();
      service.send('saypi:startDictation', { targetElement: inputElement1 });
      service.send('saypi:callReady');
      service.send('saypi:userSpeaking');
    });

    it('should record target switch during speech', () => {
      const switchTimestamp = Date.now();
      
      service.send('saypi:switchTarget', { targetElement: inputElement2 });
      
      // Check that the target switch was recorded in the array structure
      expect(service.state.context.targetSwitchesDuringSpeech).toBeDefined();
      expect(service.state.context.targetSwitchesDuringSpeech!.length).toBe(1);
      const recorded = service.state.context.targetSwitchesDuringSpeech![0];
      expect(recorded.target).toBe(inputElement2);
      expect(recorded.timestamp).toBeGreaterThanOrEqual(switchTimestamp);
      // speechStartTarget should hold the element active when speech began
      expect(service.state.context.speechStartTarget).toBe(inputElement1);
    });

    it('should not trigger any artificial events when target switches during speech', () => {
      service.send('saypi:switchTarget', { targetElement: inputElement2 });
      
      // Verify that no artificial speech break events were emitted
      expect(EventBus.emit).not.toHaveBeenCalledWith('saypi:requestArtificialSpeechBreak', expect.any(Object));
      expect(EventBus.emit).not.toHaveBeenCalledWith('saypi:splitAudioAtTimestamp', expect.any(Object));
    });

    it('should process split audio when target switch occurred during speech', async () => {
      // Get the speech start time that was recorded by the machine
      const speechStartTime = service.state.context.timeUserStartedSpeaking;
      
      // Record a target switch 500ms after speech started
      const switchTime = speechStartTime + 500;
      // Mock Date.now to return the switch time when recordTargetSwitchDuringSpeech runs
      const originalDateNow = Date.now;
      Date.now = vi.fn().mockReturnValue(switchTime);
      
      service.send('saypi:switchTarget', { targetElement: inputElement2 });
      
      // Restore Date.now
      Date.now = originalDateNow;
      
      // Then simulate audio stopping with audio buffer
      const audioBlob = new Blob(['audio data'], { type: 'audio/wav' });
      // 2 seconds of 16kHz audio: 2 * 16000 samples = 32000 Float32 values
      const audioFrames = new Float32Array(32000);
      const captureTime = speechStartTime + 2000; // Audio ended 2 seconds after speech started
      service.send('saypi:userStoppedSpeaking', {
        duration: 2000,
        blob: audioBlob,
        frames: audioFrames,
        captureTimestamp: captureTime,
        clientReceiveTimestamp: captureTime + 47,
      });
      
      // Wait for async operations to complete (including the 100ms delay)
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Verify that uploadAudioWithRetry was called twice (for split audio)
      expect(TranscriptionModule.uploadAudioWithRetry).toHaveBeenCalledTimes(2);
      
      // Verify that target switch info was cleared
      expect(service.state.context.targetSwitchesDuringSpeech).toBeUndefined();
    });

    it('should process normal audio when no target switch occurred', () => {
      // Don't send a target switch, just stop speaking
      const audioBlob = new Blob(['audio data'], { type: 'audio/wav' });
      service.send('saypi:userStoppedSpeaking', {
        duration: 1000,
        blob: audioBlob,
        captureTimestamp: Date.now(),
        clientReceiveTimestamp: Date.now(),
      });
      
      // Verify that normal transcription was triggered
      expect(TranscriptionModule.uploadAudioWithRetry).toHaveBeenCalledWith(
        audioBlob,
        1000,
        {}, // empty transcriptions for first time
        undefined, // no session ID
        3,
        expect.any(Number),
        expect.any(Number)
      );
      
      // Verify that only one upload was called (normal processing)
      expect(TranscriptionModule.uploadAudioWithRetry).toHaveBeenCalledTimes(1);
    });

    it('should handle switchTarget during speech - records switch AND switches target', () => {
      // Switch target during speech
      service.send('saypi:switchTarget', { targetElement: inputElement2 });
      
      // Verify that the target switch was recorded (for potential audio splitting)
      expect(service.state.context.targetSwitchesDuringSpeech).toBeDefined();
      expect(service.state.context.targetSwitchesDuringSpeech!.length).toBe(1);
      expect(service.state.context.targetSwitchesDuringSpeech![0].target).toBe(inputElement2);
      
      // Verify that the target was ALSO switched immediately (global handler)
      expect(service.state.context.targetElement).toBe(inputElement2);
      
      // Verify that global transcriptions were cleared but target mappings preserved
      expect(service.state.context.transcriptions).toEqual({});
      expect(service.state.context.accumulatedText).toBe('');
    });
  });

  describe('Target Switch Not During Speech', () => {
    beforeEach(() => {
      service.start();
      service.send('saypi:startDictation', { targetElement: inputElement1 });
      service.send('saypi:callReady');
      // Note: NOT sending 'saypi:userSpeaking' here
    });

    it('should handle normal target switches when not speaking', () => {
      service.send('saypi:switchTarget', { targetElement: inputElement2 });
      
      // Verify normal target switch behavior (not recording target switch during speech)
      expect(service.state.context.targetSwitchesDuringSpeech).toBeUndefined();
      expect(service.state.context.targetElement).toBe(inputElement2);
      
      // Should NOT trigger any special events
      expect(EventBus.emit).not.toHaveBeenCalledWith('saypi:requestArtificialSpeechBreak', expect.any(Object));
    });
  });

  describe('Edge Cases', () => {
    beforeEach(() => {
      service.start();
      service.send('saypi:startDictation', { targetElement: inputElement1 });
      service.send('saypi:callReady');
      service.send('saypi:userSpeaking');
    });

    it('should handle multiple rapid target switches during speech', () => {
      const inputElement3 = document.createElement('input');
      inputElement3.id = 'bio-input';
      
      // First switch
      service.send('saypi:switchTarget', { targetElement: inputElement2 });
      const firstLength = service.state.context.targetSwitchesDuringSpeech?.length ?? 0;
      
      // Second switch (should overwrite the first)
      service.send('saypi:switchTarget', { targetElement: inputElement3 });
      
      // There should now be two recorded switches
      expect(service.state.context.targetSwitchesDuringSpeech!.length).toBe(firstLength + 1);
      // Latest entry should reference the third input
      const lastEntry = service.state.context.targetSwitchesDuringSpeech![service.state.context.targetSwitchesDuringSpeech!.length - 1];
      expect(lastEntry.target).toBe(inputElement3);
      // speechStartTarget remains the original target
      expect(service.state.context.speechStartTarget).toBe(inputElement1);
    });

    it('should handle audio stopping without blob when target switch occurred', () => {
      // Record a target switch
      service.send('saypi:switchTarget', { targetElement: inputElement2 });
      
      // Then simulate audio stopping without blob (VAD misfire)
      service.send('saypi:userStoppedSpeaking', {
        duration: 0,
        blob: undefined,
      });
      
      // Should handle the case gracefully and clear target switch info
      expect(service.state.context.targetSwitchesDuringSpeech).toBeUndefined();
    });
  });
});