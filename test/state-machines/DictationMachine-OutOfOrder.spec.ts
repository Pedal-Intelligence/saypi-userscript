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

describe('DictationMachine - Out-of-Order Transcription Handling', () => {
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
    
    // Create fresh machine for each test
    const machine = createDictationMachine();
    service = interpret(machine);
  });

  afterEach(() => {
    if (service) {
      service.stop();
    }
  });

  describe('Nursery Rhyme Out-of-Order Tests', () => {
    beforeEach(() => {
      service.start();
      service.send('saypi:startDictation', { targetElement: inputElement1 });
      service.send('saypi:callReady');
    });

    it('should handle out-of-order transcription responses for longer dictation (nursery rhyme)', () => {
      // Simulate dictating "Mary, Mary, quite contrary, How does your garden grow?"
      // with multiple transcription requests that arrive out of order
      
      const nurseryRhymeSegments = [
        { sequenceNumber: 1, text: "Mary, Mary," },
        { sequenceNumber: 2, text: "quite contrary," },
        { sequenceNumber: 3, text: "How does your" },
        { sequenceNumber: 4, text: "garden grow?" }
      ];

      // Setup transcription targets for all segments
      nurseryRhymeSegments.forEach(segment => {
        service.state.context.transcriptionTargets[segment.sequenceNumber] = inputElement1;
      });

      // Send transcriptions out of order: 2, 4, 1, 3
      // This simulates server responses arriving at different times
      
      // Second segment arrives first
      service.send('saypi:transcribed', {
        text: nurseryRhymeSegments[1].text,
        sequenceNumber: nurseryRhymeSegments[1].sequenceNumber,
      });
      
      // Check that only the second segment is shown for now
      expect(inputElement1.value).toBe("quite contrary,");
      expect(service.state.context.transcriptionsByTarget['name-input']).toEqual({
        2: "quite contrary,"
      });

      // Fourth segment arrives second
      service.send('saypi:transcribed', {
        text: nurseryRhymeSegments[3].text,
        sequenceNumber: nurseryRhymeSegments[3].sequenceNumber,
      });
      
      // Now we have segments 2 and 4, should be merged in sequence order 
      expect(inputElement1.value).toBe("quite contrary, garden grow?");
      expect(service.state.context.transcriptionsByTarget['name-input']).toEqual({
        2: "quite contrary,",
        4: "garden grow?"
      });

      // First segment arrives third (out of order)
      service.send('saypi:transcribed', {
        text: nurseryRhymeSegments[0].text,
        sequenceNumber: nurseryRhymeSegments[0].sequenceNumber,
      });
      
      // Now we have segments 1, 2, and 4 - should be merged in correct order
      expect(inputElement1.value).toBe("Mary, Mary, quite contrary, garden grow?");
      expect(service.state.context.transcriptionsByTarget['name-input']).toEqual({
        1: "Mary, Mary,",
        2: "quite contrary,",
        4: "garden grow?"
      });

      // Third segment arrives last (completes the sequence)
      service.send('saypi:transcribed', {
        text: nurseryRhymeSegments[2].text,
        sequenceNumber: nurseryRhymeSegments[2].sequenceNumber,
      });
      
      // Final check - all segments should be merged in correct order
      expect(inputElement1.value).toBe("Mary, Mary, quite contrary, How does your garden grow?");
      expect(service.state.context.transcriptionsByTarget['name-input']).toEqual({
        1: "Mary, Mary,",
        2: "quite contrary,",
        3: "How does your",
        4: "garden grow?"
      });

      // Verify accumulated text is correct (for current target)
      expect(service.state.context.accumulatedText).toBe("Mary, Mary, quite contrary, How does your garden grow?");
    });

    it('should handle server-side merging with out-of-order responses', () => {
      // Test server-side merging by simulating a realistic scenario
      
      const nurseryRhymeSegments = [
        { sequenceNumber: 1, text: "Twinkle, twinkle," },
        { sequenceNumber: 2, text: "little star," },
        { sequenceNumber: 3, text: "How I wonder" },
        { sequenceNumber: 4, text: "what you are." }
      ];

      // Setup transcription targets for all segments
      nurseryRhymeSegments.forEach(segment => {
        service.state.context.transcriptionTargets[segment.sequenceNumber] = inputElement1;
      });

      // First, segments 1 and 2 arrive in order and get transcribed normally
      service.send('saypi:transcribed', {
        text: nurseryRhymeSegments[0].text,
        sequenceNumber: nurseryRhymeSegments[0].sequenceNumber,
      });
      
      service.send('saypi:transcribed', {
        text: nurseryRhymeSegments[1].text,
        sequenceNumber: nurseryRhymeSegments[1].sequenceNumber,
      });

      // Check intermediate state after first two segments
      expect(inputElement1.value).toBe("Twinkle, twinkle, little star,");

      // Now segment 4 arrives out of order
      service.send('saypi:transcribed', {
        text: nurseryRhymeSegments[3].text,
        sequenceNumber: nurseryRhymeSegments[3].sequenceNumber,
      });

      // Should show all segments in correct order
      expect(inputElement1.value).toBe("Twinkle, twinkle, little star, what you are.");

      // Now segment 3 arrives with server-side merged content
      // Server merges sequences 1, 2, and 3 together
      service.send('saypi:transcribed', {
        text: "Twinkle, twinkle, little star, How I wonder",
        sequenceNumber: 3,
        merged: [1, 2], // Server merged sequences 1 and 2 into sequence 3
      });

      // INTENDED BEHAVIOR: The final text should be the complete nursery rhyme in correct order
      // "Twinkle, twinkle, little star, How I wonder what you are."
      expect(inputElement1.value).toBe("Twinkle, twinkle, little star, How I wonder what you are.");
      
      // Check that merged sequences were removed from transcription state
      const targetTranscriptions = service.state.context.transcriptionsByTarget['name-input'];
      expect(targetTranscriptions[1]).toBeUndefined(); // merged
      expect(targetTranscriptions[2]).toBeUndefined(); // merged  
      expect(targetTranscriptions[3]).toBe("Twinkle, twinkle, little star, How I wonder");
      expect(targetTranscriptions[4]).toBe("what you are.");
      
      // Verify merged sequences were removed from global context too
      expect(service.state.context.transcriptions[1]).toBeUndefined();
      expect(service.state.context.transcriptions[2]).toBeUndefined();
      expect(service.state.context.transcriptions[3]).toBe("Twinkle, twinkle, little star, How I wonder");
      expect(service.state.context.transcriptions[4]).toBe("what you are.");
    });

    it('should handle complex out-of-order scenario with target switching', () => {
      // Test that out-of-order responses are routed to their correct target elements
      // even when the user has switched targets
      
      // Setup targets for different segments
      service.state.context.transcriptionTargets[1] = inputElement1; // "Humpty Dumpty"
      service.state.context.transcriptionTargets[2] = inputElement1; // "sat on a wall"
      service.state.context.transcriptionTargets[3] = inputElement2; // "Humpty Dumpty" (different target)
      service.state.context.transcriptionTargets[4] = inputElement2; // "had a great fall"

      // Switch current target to second input
      service.send('saypi:switchTarget', { targetElement: inputElement2 });

      // Responses arrive out of order: 3, 1, 4, 2
      
      // Segment 3 (for inputElement2) arrives first
      service.send('saypi:transcribed', {
        text: "Humpty Dumpty",
        sequenceNumber: 3,
      });
      
      expect(inputElement1.value).toBe("");
      expect(inputElement2.value).toBe("Humpty Dumpty");

      // Segment 1 (for inputElement1) arrives second
      service.send('saypi:transcribed', {
        text: "Humpty Dumpty",
        sequenceNumber: 1,
      });
      
      expect(inputElement1.value).toBe("Humpty Dumpty");
      expect(inputElement2.value).toBe("Humpty Dumpty");

      // Segment 4 (for inputElement2) arrives third
      service.send('saypi:transcribed', {
        text: "had a great fall",
        sequenceNumber: 4,
      });
      
      expect(inputElement1.value).toBe("Humpty Dumpty");
      expect(inputElement2.value).toBe("Humpty Dumpty had a great fall");

      // Segment 2 (for inputElement1) arrives last
      service.send('saypi:transcribed', {
        text: "sat on a wall",
        sequenceNumber: 2,
      });
      
      // Final verification
      expect(inputElement1.value).toBe("Humpty Dumpty sat on a wall");
      expect(inputElement2.value).toBe("Humpty Dumpty had a great fall");

      // Verify isolated storage
      expect(service.state.context.transcriptionsByTarget['name-input']).toEqual({
        1: "Humpty Dumpty",
        2: "sat on a wall"
      });
      expect(service.state.context.transcriptionsByTarget['email-input']).toEqual({
        3: "Humpty Dumpty",
        4: "had a great fall"
      });

      // Accumulated text should be for current target (inputElement2)
      expect(service.state.context.accumulatedText).toBe("Humpty Dumpty had a great fall");
    });

    it('should preserve correct order even with significant delays between responses', () => {
      // Test extreme out-of-order scenario where responses are very delayed
      
      const rhymeSegments = [
        { sequenceNumber: 1, text: "Old MacDonald" },
        { sequenceNumber: 2, text: "had a farm," },
        { sequenceNumber: 3, text: "E-I-E-I-O." },
        { sequenceNumber: 4, text: "And on that farm" },
        { sequenceNumber: 5, text: "he had a cow," },
        { sequenceNumber: 6, text: "E-I-E-I-O." }
      ];

      // Setup all targets
      rhymeSegments.forEach(segment => {
        service.state.context.transcriptionTargets[segment.sequenceNumber] = inputElement1;
      });

      // Responses arrive in completely scrambled order: 5, 1, 6, 2, 4, 3
      const arrivalOrder = [5, 1, 6, 2, 4, 3];
      
      arrivalOrder.forEach((sequenceNumber) => {
        const segment = rhymeSegments.find(s => s.sequenceNumber === sequenceNumber);
        if (!segment) throw new Error(`Segment ${sequenceNumber} not found`);
        
        service.send('saypi:transcribed', {
          text: segment.text,
          sequenceNumber: segment.sequenceNumber,
        });

        // Check that text is always rebuilt in correct sequence order
        const targetTranscriptions = service.state.context.transcriptionsByTarget['name-input'];
        const expectedSegments = rhymeSegments
          .filter(s => targetTranscriptions[s.sequenceNumber])
          .sort((a, b) => a.sequenceNumber - b.sequenceNumber)
          .map(s => s.text);
        
        const expectedText = expectedSegments.join(' ');
        expect(inputElement1.value).toBe(expectedText);
      });

      // Final verification - complete nursery rhyme in correct order
      expect(inputElement1.value).toBe("Old MacDonald had a farm, E-I-E-I-O. And on that farm he had a cow, E-I-E-I-O.");
      
      // Verify all segments are stored
      expect(Object.keys(service.state.context.transcriptionsByTarget['name-input']).length).toBe(6);
    });
  });
});