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
      // Smart joining: don't add spaces if either the previous segment ends with whitespace or the current segment starts with whitespace
      const sortedKeys = Object.keys(transcripts)
        .map(Number)
        .sort((a, b) => a - b);

      let result = "";
      for (let i = 0; i < sortedKeys.length; i++) {
        const segment = transcripts[sortedKeys[i]];
        
        if (i === 0) {
          // First segment - always add as-is
          result += segment;
        } else {
          // Check if we need to add a space between segments
          const previousSegmentEndsWithWhitespace = result.match(/\s$/);
          const currentSegmentStartsWithWhitespace = segment.match(/^\s/);
          
          if (previousSegmentEndsWithWhitespace || currentSegmentStartsWithWhitespace) {
            // Don't add space if previous segment ends with whitespace OR current segment starts with whitespace
            result += segment;
          } else {
            // Add space only if neither condition is met
            result += " " + segment;
          }
        }
      }
      
      return result;
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

  // Helper function to simulate realistic user input with manual edit detection
  const simulateUserEdit = (element: HTMLInputElement | HTMLTextAreaElement, newContent: string, expectation?: string) => {
    const oldContent = element.value;
    
    // Verify the current content matches expectation if provided
    if (expectation !== undefined) {
      expect(oldContent).toBe(expectation);
    }
    
    // Simulate user typing (DOM changes first, as it would in real usage)
    element.value = newContent;
    element.dispatchEvent(new Event('input', { bubbles: true }));
    
    // Verify DOM was updated
    expect(element.value).toBe(newContent);
    
    // Simulate the UniversalDictationModule detecting this change and notifying the state machine
    service.send('saypi:manualEdit', {
      targetElement: element,
      newContent: newContent,
      oldContent: oldContent
    });
    
    // Verify element still shows the corrected content after state machine processing
    expect(element.value).toBe(newContent);
    
    return { oldContent, newContent };
  };

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

    it('should preserve manual edits during out-of-order transcription completion', () => {
      // Test manual editing during dictation with out-of-order responses
      // Scenario: User dictates "Mary had a little lump" -> edits to "lamb" -> continues dictating
      
      const nurseryRhymeSegments = [
        { sequenceNumber: 1, text: "Mary had a" },
        { sequenceNumber: 2, text: "little lump" }, // Will be manually corrected to "little lamb"
        { sequenceNumber: 3, text: "its fleece was" },
        { sequenceNumber: 4, text: "white as snow" }
      ];

      // Setup transcription targets for all segments
      nurseryRhymeSegments.forEach(segment => {
        service.state.context.transcriptionTargets[segment.sequenceNumber] = inputElement1;
      });

      // Phase 1: First two segments arrive in order (simulating initial dictation)
      service.send('saypi:transcribed', {
        text: nurseryRhymeSegments[0].text,
        sequenceNumber: nurseryRhymeSegments[0].sequenceNumber,
      });
      
      service.send('saypi:transcribed', {
        text: nurseryRhymeSegments[1].text,
        sequenceNumber: nurseryRhymeSegments[1].sequenceNumber,
      });

      // Verify initial transcription
      expect(inputElement1.value).toBe("Mary had a little lump");
      expect(service.state.context.transcriptionsByTarget['name-input']).toEqual({
        1: "Mary had a",
        2: "little lump"
      });

      // Phase 2: User manually edits the text field to correct "lump" to "lamb"
      // Simulate realistic user typing and change detection
      simulateUserEdit(inputElement1, 'Mary had a little lamb', 'Mary had a little lump');
      expect(service.state.context.transcriptionsByTarget['name-input']).toEqual({
        1: "Mary had a",
        2: "little lamb"  // Should be updated by manual edit
      });

      // Phase 3: Remaining segments arrive out of order (4 then 3)
      // This simulates the user continuing to dictate after the manual correction
      
      // Segment 4 arrives first
      service.send('saypi:transcribed', {
        text: nurseryRhymeSegments[3].text,
        sequenceNumber: nurseryRhymeSegments[3].sequenceNumber,
      });

      // Should preserve manual edit and add new segment in correct order
      expect(inputElement1.value).toBe("Mary had a little lamb white as snow");
      expect(service.state.context.transcriptionsByTarget['name-input']).toEqual({
        1: "Mary had a",
        2: "little lamb",  // Manual edit preserved
        4: "white as snow"
      });

      // Segment 3 arrives last (out of order)
      service.send('saypi:transcribed', {
        text: nurseryRhymeSegments[2].text,
        sequenceNumber: nurseryRhymeSegments[2].sequenceNumber,
      });

      // Final verification - manual edit should be preserved in final result
      expect(inputElement1.value).toBe("Mary had a little lamb its fleece was white as snow");
      expect(service.state.context.transcriptionsByTarget['name-input']).toEqual({
        1: "Mary had a",
        2: "little lamb",    // Manual correction preserved
        3: "its fleece was",
        4: "white as snow"
      });

      // Verify accumulated text matches
      expect(service.state.context.accumulatedText).toBe("Mary had a little lamb its fleece was white as snow");
    });

    it('should handle multiple manual edits with out-of-order responses', () => {
      // Test scenario with multiple corrections during out-of-order completion
      
      const segments = [
        { sequenceNumber: 1, text: "Jack and Jill" },
        { sequenceNumber: 2, text: "went up the hell" }, // Will be corrected to "hill"
        { sequenceNumber: 3, text: "to fitch a" },       // Will be corrected to "fetch a"
        { sequenceNumber: 4, text: "pail of water" }
      ];

      // Setup targets
      segments.forEach(segment => {
        service.state.context.transcriptionTargets[segment.sequenceNumber] = inputElement1;
      });

      // Phase 1: Segments 1 and 2 arrive in order
      service.send('saypi:transcribed', {
        text: segments[0].text,
        sequenceNumber: segments[0].sequenceNumber,
      });
      
      service.send('saypi:transcribed', {
        text: segments[1].text,
        sequenceNumber: segments[1].sequenceNumber,
      });

      expect(inputElement1.value).toBe("Jack and Jill went up the hell");

      // Phase 2: First manual correction - "hell" to "hill"
      // Simulate realistic user typing and change detection
      simulateUserEdit(inputElement1, 'Jack and Jill went up the hill', 'Jack and Jill went up the hell');

      // Phase 3: Segment 4 arrives out of order (before segment 3)
      service.send('saypi:transcribed', {
        text: segments[3].text,
        sequenceNumber: segments[3].sequenceNumber,
      });

      expect(inputElement1.value).toBe("Jack and Jill went up the hill pail of water");

      // Phase 4: Segment 3 arrives
      service.send('saypi:transcribed', {
        text: segments[2].text,
        sequenceNumber: segments[2].sequenceNumber,
      });

      expect(inputElement1.value).toBe("Jack and Jill went up the hill to fitch a pail of water");

      // Phase 5: Second manual correction - "fitch a" to "fetch a"  
      // Simulate realistic user typing and change detection for second correction
      simulateUserEdit(inputElement1, 'Jack and Jill went up the hill to fetch a pail of water', 'Jack and Jill went up the hill to fitch a pail of water');

      // Final verification - both manual corrections should be preserved
      expect(inputElement1.value).toBe("Jack and Jill went up the hill to fetch a pail of water");
      
      // After the second manual edit, the significant change consolidates all transcriptions
      // into a single entry (this is the intended behavior for major content changes)
      expect(service.state.context.transcriptionsByTarget['name-input']).toEqual({
        4: "Jack and Jill went up the hill to fetch a pail of water"  // Consolidated after second edit
      });
    });

    it('should handle manual edits with server-side merging and out-of-order responses', () => {
      // Complex scenario: manual edit + server merging + out-of-order completion
      
      const segments = [
        { sequenceNumber: 1, text: "Hickory dickory" },
        { sequenceNumber: 2, text: "duck" },              // Will be corrected to "dock"
        { sequenceNumber: 3, text: "the mouse ran" },
        { sequenceNumber: 4, text: "up the clock" }
      ];

      // Setup targets
      segments.forEach(segment => {
        service.state.context.transcriptionTargets[segment.sequenceNumber] = inputElement1;
      });

      // Phase 1: First two segments arrive
      service.send('saypi:transcribed', {
        text: segments[0].text,
        sequenceNumber: segments[0].sequenceNumber,
      });
      
      service.send('saypi:transcribed', {
        text: segments[1].text,
        sequenceNumber: segments[1].sequenceNumber,
      });

      expect(inputElement1.value).toBe("Hickory dickory duck");

      // Phase 2: Manual correction - "duck" to "dock"
      // Simulate realistic user typing and change detection
      simulateUserEdit(inputElement1, 'Hickory dickory dock', 'Hickory dickory duck');

      // Phase 3: Segment 4 arrives out of order
      service.send('saypi:transcribed', {
        text: segments[3].text,
        sequenceNumber: segments[3].sequenceNumber,
      });

      expect(inputElement1.value).toBe("Hickory dickory dock up the clock");

      // Phase 4: Segment 3 arrives with server-side merging
      // Server merges corrected segments 1 and 2 with segment 3
      service.send('saypi:transcribed', {
        text: "Hickory dickory dock the mouse ran",
        sequenceNumber: 3,
        merged: [1, 2], // Server merged corrected content of segments 1 and 2
      });

      // Final verification - server should preserve the manual correction
      expect(inputElement1.value).toBe("Hickory dickory dock the mouse ran up the clock");
      
      // Check that merged sequences were handled correctly
      const targetTranscriptions = service.state.context.transcriptionsByTarget['name-input'];
      expect(targetTranscriptions[1]).toBeUndefined(); // merged
      expect(targetTranscriptions[2]).toBeUndefined(); // merged
      expect(targetTranscriptions[3]).toBe("Hickory dickory dock the mouse ran"); // Contains corrected text
      expect(targetTranscriptions[4]).toBe("up the clock");
    });

    it('should handle manual edits containing newline characters', () => {
      // Test newline insertion during manual editing with out-of-order transcriptions
      // Scenario: User dictates "Dear Sir," -> "How are you" -> manually edits to add line breaks for proper formatting
      
      const segments = [
        { sequenceNumber: 1, text: "Dear Sir," }, // Comma is part of original transcription
        { sequenceNumber: 2, text: "How are you" },
        { sequenceNumber: 3, text: "today?" }
      ];

      // Setup targets (use textarea for realistic multi-line editing)
      const textareaElement = document.createElement('textarea');
      textareaElement.id = 'letter-textarea';
      textareaElement.name = 'letter';
      textareaElement.placeholder = 'Write your letter';

      segments.forEach(segment => {
        service.state.context.transcriptionTargets[segment.sequenceNumber] = textareaElement;
      });

      // Switch dictation target to the textarea
      service.send('saypi:switchTarget', { targetElement: textareaElement });

      // Phase 1: First two segments arrive in order
      service.send('saypi:transcribed', {
        text: segments[0].text,
        sequenceNumber: segments[0].sequenceNumber,
      });
      
      service.send('saypi:transcribed', {
        text: segments[1].text,
        sequenceNumber: segments[1].sequenceNumber,
      });

      expect(textareaElement.value).toBe("Dear Sir, How are you");

      // Phase 2: User manually edits to add proper letter formatting with newlines
      // Simulates user pressing Enter to add line breaks for proper spacing
      const manuallyFormattedContent = "Dear Sir,\n\nHow are you";
      simulateUserEdit(textareaElement, manuallyFormattedContent, "Dear Sir, How are you");

      // Verify the newline characters are preserved in the DOM element
      expect(textareaElement.value).toBe("Dear Sir,\n\nHow are you");

      // Phase 3: Third segment arrives after manual editing (out of order scenario)
      service.send('saypi:transcribed', {
        text: segments[2].text,
        sequenceNumber: segments[2].sequenceNumber,
      });

      // Final verification - newlines should be preserved and new content properly merged
      // The new transcription should be appended with proper spacing
      expect(textareaElement.value).toBe("Dear Sir,\n\nHow are you today?");
      
      // Verify internal transcription state correctly handles newlines
      const targetTranscriptions = service.state.context.transcriptionsByTarget['letter-textarea'];
      expect(targetTranscriptions[1]).toBe("Dear Sir,");
      expect(targetTranscriptions[2]).toBe("\n\nHow are you"); // Should preserve newlines in transcription state
      expect(targetTranscriptions[3]).toBe("today?");

      // Verify accumulated text maintains newline formatting
      expect(service.state.context.accumulatedText).toBe("Dear Sir,\n\nHow are you today?");
    });

    it('should convert newlines to <br> tags in contenteditable elements during transcription', () => {
      // Test that ContentEditableStrategy properly converts \n to <br> tags for visual line breaks
      // This test validates the core requirement: newline support for contenteditable elements
      
      // Setup contenteditable div element
      const contentEditableElement = document.createElement('div');
      contentEditableElement.contentEditable = 'true';
      contentEditableElement.id = 'letter-contenteditable';
      contentEditableElement.className = 'contenteditable-field';
      
      // Switch dictation target to the contenteditable element
      service.send('saypi:switchTarget', { targetElement: contentEditableElement });

      // Test that when text with newlines is inserted, it gets converted to <br> tags
      service.state.context.transcriptionTargets[1] = contentEditableElement;
      
      // Send a transcription that contains newlines
      service.send('saypi:transcribed', {
        text: "Dear Sir,\n\nHow are you today?",
        sequenceNumber: 1,
      });

      // ✅ CORE REQUIREMENT VALIDATED: Verify that newlines were converted to <br> tags for proper display
      expect(contentEditableElement.innerHTML).toContain('<br>');
      expect(contentEditableElement.innerHTML).toBe("Dear Sir,<br><br>How are you today?");
      
      // This test confirms that ContentEditableStrategy successfully converts \n to <br> tags,
      // which resolves the original issue where newlines weren't being preserved in contenteditable elements
    });
  });
});