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

    it('should terminate dictation when manual edit is detected during out-of-order transcription', () => {
      // SIMPLIFIED BEHAVIOR: Manual edits terminate dictation
      // This provides predictable behavior even with out-of-order responses
      
      const nurseryRhymeSegments = [
        { sequenceNumber: 1, text: "Mary had a" },
        { sequenceNumber: 2, text: "little lump" },
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

      // Phase 2: User manually edits - this now terminates dictation
      simulateUserEdit(inputElement1, 'Mary had a little lamb', 'Mary had a little lump');
      
      // Verify dictation was terminated
      expect(service.state.value).toBe('idle');
      expect(service.state.context.transcriptionsByTarget['name-input']).toBeUndefined();
      
      // The manually edited content remains in the field
      expect(inputElement1.value).toBe('Mary had a little lamb');
      
      // Any further transcriptions would not be processed since dictation is terminated
      // This is the simplified, predictable behavior
    });

    it('should terminate dictation on first manual edit during out-of-order responses', () => {
      // SIMPLIFIED BEHAVIOR: First manual edit terminates dictation
      
      const segments = [
        { sequenceNumber: 1, text: "Jack and Jill" },
        { sequenceNumber: 2, text: "went up the hell" },
        { sequenceNumber: 3, text: "to fitch a" },
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

      // Phase 2: First manual correction terminates dictation
      simulateUserEdit(inputElement1, 'Jack and Jill went up the hill', 'Jack and Jill went up the hell');

      // Verify dictation was terminated
      expect(service.state.value).toBe('idle');
      expect(service.state.context.transcriptionsByTarget['name-input']).toBeUndefined();
      
      // User would need to restart dictation for further transcriptions
      // This is the simplified, predictable behavior
    });

    it('should terminate dictation when manual edit occurs with server merging', () => {
      // SIMPLIFIED BEHAVIOR: Manual edit terminates dictation regardless of server merging
      
      const segments = [
        { sequenceNumber: 1, text: "Hickory dickory" },
        { sequenceNumber: 2, text: "duck" },
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

      // Phase 2: Manual correction terminates dictation
      simulateUserEdit(inputElement1, 'Hickory dickory dock', 'Hickory dickory duck');

      // Verify dictation was terminated
      expect(service.state.value).toBe('idle');
      expect(service.state.context.transcriptionsByTarget['name-input']).toBeUndefined();
      
      // Any subsequent transcriptions would require a new dictation session
    });

    it('should terminate dictation when newline characters are manually added', () => {
      // SIMPLIFIED BEHAVIOR: Any manual edit, including formatting, terminates dictation
      
      const segments = [
        { sequenceNumber: 1, text: "Dear Sir," },
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

      // Phase 2: User manually edits to add formatting - this terminates dictation
      const manuallyFormattedContent = "Dear Sir,\n\nHow are you";
      simulateUserEdit(textareaElement, manuallyFormattedContent, "Dear Sir, How are you");

      // Verify dictation was terminated
      expect(service.state.value).toBe('idle');
      expect(service.state.context.transcriptionsByTarget['letter-textarea']).toBeUndefined();
      
      // The manually edited content remains in the field
      expect(textareaElement.value).toBe("Dear Sir,\n\nHow are you");
      
      // User would need to restart dictation to continue
      // This is the simplified, predictable behavior
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

    it('should preserve pre-existing text and append dictation at cursor position', () => {
      // Test that dictation appends to existing text instead of replacing it entirely
      // This addresses the issue where dictation overwrites user's pre-typed content
      
      // Setup textarea with pre-existing content
      const textareaElement = document.createElement('textarea');
      textareaElement.id = 'story-textarea';
      textareaElement.name = 'story';
      textareaElement.value = 'Incy Wincy Spider\n\nThe wincy wincy spider climbed up the spout again.\n\n';
      
      // Simulate cursor position at the end of existing text
      textareaElement.selectionStart = textareaElement.value.length;
      textareaElement.selectionEnd = textareaElement.value.length;
      
      // Switch dictation target to the textarea
      service.send('saypi:switchTarget', { targetElement: textareaElement });
      
      // User starts dictating new content
      service.state.context.transcriptionTargets[1] = textareaElement;
      
      service.send('saypi:transcribed', {
        text: 'Jack and Jill.',
        sequenceNumber: 1,
      });

      // FAILING TEST: Currently this will fail because the system replaces all content
      // Expected: Pre-existing text should be preserved and dictation appended
      const expectedContent = 'Incy Wincy Spider\n\nThe wincy wincy spider climbed up the spout again.\n\nJack and Jill.';
      expect(textareaElement.value).toBe(expectedContent);
      
      // Verify that the original text was not lost
      expect(textareaElement.value).toContain('Incy Wincy Spider');
      expect(textareaElement.value).toContain('climbed up the spout again');
      expect(textareaElement.value).toContain('Jack and Jill.');
    });

    it('should preserve pre-existing text in contenteditable elements and append dictation', () => {
      // Test pre-existing text preservation for contenteditable elements
      
      // Setup contenteditable div with pre-existing content including <br> tags
      const contentEditableElement = document.createElement('div');
      contentEditableElement.contentEditable = 'true';
      contentEditableElement.id = 'notes-contenteditable';
      contentEditableElement.innerHTML = 'Meeting Notes:<br><br>- Review quarterly results<br>- Discuss budget<br><br>';
      
      // Switch dictation target to the contenteditable element
      service.send('saypi:switchTarget', { targetElement: contentEditableElement });
      
      service.state.context.transcriptionTargets[1] = contentEditableElement;
      
      service.send('saypi:transcribed', {
        text: 'Action items:\nSchedule follow-up meeting',
        sequenceNumber: 1,
      });

      // Expected behavior is to append, not replace
      const expectedHTML = 'Meeting Notes:<br>- Review quarterly results<br>- Discuss budget<br>Action items:<br>Schedule follow-up meeting';
      expect(contentEditableElement.innerHTML).toBe(expectedHTML);
      
      // Verify original content is preserved
      expect(contentEditableElement.innerHTML).toContain('Meeting Notes:');
      expect(contentEditableElement.innerHTML).toContain('Review quarterly results');
      expect(contentEditableElement.innerHTML).toContain('Action items:');
    });

    it('should not treat whitespace-only contenteditable elements as having initial text', () => {
      // Test that empty contenteditable elements with whitespace don't get unwanted line breaks
      
      // Setup contenteditable div with whitespace (like HTML formatting)
      const contentEditableElement = document.createElement('div');
      contentEditableElement.contentEditable = 'true';
      contentEditableElement.id = 'empty-contenteditable';
      contentEditableElement.innerHTML = '\n        '; // Whitespace from HTML formatting
      
      // Switch dictation target to the contenteditable element
      service.send('saypi:switchTarget', { targetElement: contentEditableElement });
      
      service.state.context.transcriptionTargets[1] = contentEditableElement;
      
      service.send('saypi:transcribed', {
        text: 'Hello world.',
        sequenceNumber: 1,
      });

      // Should not have any leading <br> tags or whitespace
      expect(contentEditableElement.innerHTML).toBe('Hello world.');
      
      // Verify no whitespace was preserved
      expect(contentEditableElement.innerHTML).not.toContain('<br>');
      expect(contentEditableElement.textContent).toBe('Hello world.');
    });

    it('should preserve user-entered newlines in contenteditable elements', () => {
      // Test that user-entered newlines (represented as <br> tags) are preserved
      
      // Setup contenteditable div with user-entered newlines  
      const contentEditableElement = document.createElement('div');
      contentEditableElement.contentEditable = 'true';
      contentEditableElement.id = 'user-newlines-contenteditable';
      contentEditableElement.innerHTML = 'Line 1<br><br>Line 2<br>'; // User entered newlines
      
      // Switch dictation target to the contenteditable element
      service.send('saypi:switchTarget', { targetElement: contentEditableElement });
      
      service.state.context.transcriptionTargets[1] = contentEditableElement;
      
      service.send('saypi:transcribed', {
        text: 'Line 3',
        sequenceNumber: 1,
      });

      // Should preserve the user-entered newlines AND append new content
      // Note: <br><br> gets normalized to single <br> per contenteditable paragraph spacing rules
      const expectedHTML = 'Line 1<br>Line 2<br>Line 3';
      expect(contentEditableElement.innerHTML).toBe(expectedHTML);
      
      // Verify original user content and newlines were preserved
      expect(contentEditableElement.innerHTML).toContain('Line 1<br>');
      expect(contentEditableElement.innerHTML).toContain('Line 2<br>');
      expect(contentEditableElement.innerHTML).toContain('Line 3');
    });

    it('should use smart spacing when joining initial text with dictation', () => {
      // Test that initial text and dictation are joined with appropriate spacing
      
      // Case 1: Initial text without trailing space + dictation without leading space -> add space
      const textareaElement1 = document.createElement('textarea');
      textareaElement1.id = 'spacing-test-1';
      textareaElement1.value = 'Hello'; // No trailing space
      
      service.send('saypi:switchTarget', { targetElement: textareaElement1 });
      service.state.context.transcriptionTargets[1] = textareaElement1;
      
      service.send('saypi:transcribed', {
        text: 'world', // No leading space
        sequenceNumber: 1,
      });

      expect(textareaElement1.value).toBe('Hello world'); // Should add space
      
      // Case 2: Initial text with trailing space + dictation without leading space -> no additional space
      const textareaElement2 = document.createElement('textarea');
      textareaElement2.id = 'spacing-test-2';
      textareaElement2.value = 'Hello '; // Trailing space
      
      service.send('saypi:switchTarget', { targetElement: textareaElement2 });
      service.state.context.transcriptionTargets[2] = textareaElement2;
      
      service.send('saypi:transcribed', {
        text: 'world', // No leading space
        sequenceNumber: 2,
      });

      expect(textareaElement2.value).toBe('Hello world'); // Should not add extra space
      
      // Case 3: Initial text without trailing space + dictation with leading space -> no additional space
      const textareaElement3 = document.createElement('textarea');
      textareaElement3.id = 'spacing-test-3';
      textareaElement3.value = 'Hello'; // No trailing space
      
      service.send('saypi:switchTarget', { targetElement: textareaElement3 });
      service.state.context.transcriptionTargets[3] = textareaElement3;
      
      service.send('saypi:transcribed', {
        text: ' world', // Leading space
        sequenceNumber: 3,
      });

      expect(textareaElement3.value).toBe('Hello world'); // Should not add extra space
    });
    
    it('should handle pre-existing text with multiple transcripts without duplication', () => {
      // Reset machine to idle state first
      service.send('saypi:stopDictation');
      
      // Create a textarea element with pre-existing content (including newlines)
      const textareaElement = document.createElement('textarea');
      textareaElement.id = 'bio';
      textareaElement.value = 'On The Dangers of Fetching Water\n'; // Pre-existing text with newline
      
      // Start dictation on this element
      service.send('saypi:startDictation', { targetElement: textareaElement });
      
      // Verify the initial text was captured correctly
      const targetId = 'bio';
      expect(service.state.context.initialTextByTarget[targetId]).toBe('On The Dangers of Fetching Water\n');
      
      // Transition to listening state (needed for transcript processing)
      service.send('saypi:callReady');
      
      // Setup transcription targets for both segments
      service.state.context.transcriptionTargets[7] = textareaElement;
      service.state.context.transcriptionTargets[8] = textareaElement;
      
      // First transcript arrives
      service.send('saypi:transcribed', {
        text: 'Jack and Jill went up the hill to fetch a pail of water.',
        sequenceNumber: 7,
      });
      
      // Should have combined pre-existing text with first transcript
      expect(textareaElement.value).toBe('On The Dangers of Fetching Water\nJack and Jill went up the hill to fetch a pail of water.');
      
      // Second transcript arrives
      service.send('saypi:transcribed', {
        text: 'Jack fell down and broke his crown.',
        sequenceNumber: 8,
      });
      
      // Should add second transcript without duplicating previous content
      // Expected: "On The Dangers of Fetching Water\nJack and Jill went up the hill to fetch a pail of water. Jack fell down and broke his crown."
      // Bug would produce: "On The Dangers of Fetching Water\nJack and Jill went up the hill to fetch a pail of water. Jack and Jill went up the hill to fetch a pail of water. Jack fell down and broke his crown."
      expect(textareaElement.value).toBe('On The Dangers of Fetching Water\nJack and Jill went up the hill to fetch a pail of water. Jack fell down and broke his crown.');
    });
    
    it('should not trigger manual edit detection for pre-existing newlines', () => {
      // Reset machine to idle state first
      service.send('saypi:stopDictation');
      
      // Create a textarea element with pre-existing content (with newlines)
      const textareaElement = document.createElement('textarea');
      textareaElement.id = 'memo';
      textareaElement.value = 'Meeting Notes:\n\n'; // Pre-existing text with multiple newlines
      
      // Start dictation on this element
      service.send('saypi:startDictation', { targetElement: textareaElement });
      
      // Verify the initial text was captured correctly
      expect(service.state.context.initialTextByTarget['memo']).toBe('Meeting Notes:\n\n');
      
      // Transition to listening state (needed for transcript processing)
      service.send('saypi:callReady');
      
      // Setup transcription target
      service.state.context.transcriptionTargets[10] = textareaElement;
      
      // First transcript arrives - this should NOT trigger manual edit detection
      // even though the initial text has newlines, because they're pre-existing
      service.send('saypi:transcribed', {
        text: 'Today we discussed the new project.',
        sequenceNumber: 10,
      });
      
      // Should have combined pre-existing text with first transcript using normal merging logic
      // (not manual edit logic), which means proper spacing
      expect(textareaElement.value).toBe('Meeting Notes:\n\nToday we discussed the new project.');
      
      // Add another transcript to verify the merging continues to work correctly
      service.state.context.transcriptionTargets[11] = textareaElement;
      
      service.send('saypi:transcribed', {
        text: 'Also need to assign team members.',
        sequenceNumber: 11,
      });
      
      // Should append the second transcript with proper spacing
      expect(textareaElement.value).toBe('Meeting Notes:\n\nToday we discussed the new project. Also need to assign team members.');
    });
  });
});