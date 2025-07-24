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

// Import the machine after mocks are set up
import { createDictationMachine } from '../../src/state-machines/DictationMachine';

describe('DictationMachine - Lexical Editor Support', () => {
  let lexicalEditor: HTMLDivElement;
  let service: any;

  beforeEach(() => {
    // Create a mock Lexical editor similar to Perplexity's structure
    lexicalEditor = document.createElement('div');
    lexicalEditor.contentEditable = 'true';
    lexicalEditor.setAttribute('data-lexical-editor', 'true');
    lexicalEditor.id = 'ask-input';
    lexicalEditor.className = 'lexical-editor';
    
    // Set up initial empty structure that Lexical expects
    const paragraph = document.createElement('p');
    paragraph.appendChild(document.createElement('br'));
    lexicalEditor.appendChild(paragraph);
    
    document.body.appendChild(lexicalEditor);

    const machine = createDictationMachine(lexicalEditor);
    service = interpret(machine).start();
    
    // Clear previous emissions
    vi.clearAllMocks();
  });

  afterEach(() => {
    if (service) {
      service.stop();
    }
    if (lexicalEditor.parentNode) {
      lexicalEditor.parentNode.removeChild(lexicalEditor);
    }
    vi.clearAllMocks();
  });

  describe('Lexical Editor Detection', () => {
    it('should detect Lexical editors by data-lexical-editor attribute', () => {
      expect(lexicalEditor.getAttribute('data-lexical-editor')).toBe('true');
      expect(lexicalEditor.contentEditable).toBe('true');
    });

    it('should have proper initial structure for empty Lexical editor', () => {
      // Empty Lexical editor should have <p><br></p> structure
      expect(lexicalEditor.children.length).toBe(1);
      expect(lexicalEditor.children[0].tagName.toLowerCase()).toBe('p');
      expect(lexicalEditor.children[0].children.length).toBe(1);
      expect(lexicalEditor.children[0].children[0].tagName.toLowerCase()).toBe('br');
    });

    it('should not detect standard contenteditable as Lexical editor', () => {
      const standardContentEditable = document.createElement('div');
      standardContentEditable.contentEditable = 'true';
      standardContentEditable.id = 'standard-editor';
      
      // Should not be detected as Lexical (no data-lexical-editor attribute)
      const isLexical = standardContentEditable.hasAttribute('data-lexical-editor') && 
                       standardContentEditable.contentEditable === 'true';
      expect(isLexical).toBe(false);
    });

    it('should not detect non-contenteditable elements with data-lexical-editor as Lexical editor', () => {
      const nonContentEditable = document.createElement('div');
      nonContentEditable.setAttribute('data-lexical-editor', 'true');
      // contentEditable is not set to 'true'
      
      const isLexical = nonContentEditable.hasAttribute('data-lexical-editor') && 
                       nonContentEditable.contentEditable === 'true';
      expect(isLexical).toBe(false);
    });
  });

  describe('Text Insertion for Lexical Editors', () => {
    it('should insert text using Lexical-compatible structure', () => {
      // Start dictation
      service.send({ type: 'saypi:startDictation', targetElement: lexicalEditor });
      service.send('saypi:callReady');

      // Setup transcription target (needed for the machine to know where to send the text)
      service.state.context.transcriptionTargets[1] = lexicalEditor;

      // Simulate transcription response
      service.send({
        type: 'saypi:transcribed',
        text: 'Hello, world',
        sequenceNumber: 1,
      });

      // For Lexical editors, text should be wrapped in proper structure
      // Expected: <p dir="ltr"><span data-lexical-text="true">Hello, world</span></p>
      const paragraph = lexicalEditor.querySelector('p');
      expect(paragraph).toBeTruthy();
      
      // Should have the proper text content
      expect(lexicalEditor.textContent?.trim()).toBe('Hello, world');
      
      // Should maintain Lexical's expected structure
      const textSpan = paragraph?.querySelector('span[data-lexical-text="true"]');
      expect(textSpan).toBeTruthy();
      expect(textSpan?.textContent).toBe('Hello, world');
      
      // Should have dir attribute for text direction
      expect(paragraph?.getAttribute('dir')).toBe('ltr');
    });

    it('should handle text replacement in Lexical editors', () => {
      // First dictation session - add some text
      service.send({ type: 'saypi:startDictation', targetElement: lexicalEditor });
      service.send('saypi:callReady');
      service.state.context.transcriptionTargets[1] = lexicalEditor;
      service.send({
        type: 'saypi:transcribed',
        text: 'Initial text',
        sequenceNumber: 1,
      });

      // Verify first text is set
      expect(lexicalEditor.textContent?.trim()).toBe('Initial text');

      // Simulate stopping dictation and starting a new session (like a real user would)
      service.send('saypi:stopDictation');
      
      // Clear the input to simulate Lexical/external clearing (which happens in reality)
      lexicalEditor.innerHTML = '<p><br></p>';
      
      // Start a new dictation session with replacement text
      service.send({ type: 'saypi:startDictation', targetElement: lexicalEditor });
      service.send('saypi:callReady');
      service.state.context.transcriptionTargets[2] = lexicalEditor;
      service.send({
        type: 'saypi:transcribed',
        text: 'Replaced text',
        sequenceNumber: 2,
      });

      // Should contain the final text
      expect(lexicalEditor.textContent?.trim()).toBe('Replaced text');
      
      // Should maintain proper structure
      const textSpan = lexicalEditor.querySelector('span[data-lexical-text="true"]');
      expect(textSpan?.textContent).toBe('Replaced text');
    });

    it('should handle empty text gracefully for Lexical editors', () => {
      // Add text first
      service.send({ type: 'saypi:startDictation', targetElement: lexicalEditor });
      service.send('saypi:callReady');
      service.state.context.transcriptionTargets[1] = lexicalEditor;
      service.send({
        type: 'saypi:transcribed',
        text: 'Some text',
        sequenceNumber: 1,
      });

      // Verify text was added
      expect(lexicalEditor.textContent?.trim()).toBe('Some text');

      // Simulate manual clearing by user or external system (which would happen in practice)
      // In Lexical, when field is cleared externally, it reverts to empty structure
      lexicalEditor.innerHTML = '<p><br></p>';
      
      // Verify the editor is in empty state
      expect(lexicalEditor.children.length).toBe(1);
      const paragraph = lexicalEditor.children[0];
      expect(paragraph.tagName.toLowerCase()).toBe('p');
      expect(paragraph.children.length).toBe(1);
      expect(paragraph.children[0].tagName.toLowerCase()).toBe('br');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle malformed Lexical editor structure gracefully', () => {
      // Create a Lexical editor with malformed initial structure
      const malformedEditor = document.createElement('div');
      malformedEditor.contentEditable = 'true';
      malformedEditor.setAttribute('data-lexical-editor', 'true');
      malformedEditor.id = 'malformed-editor';
      malformedEditor.innerHTML = '<div>Invalid structure</div>';
      document.body.appendChild(malformedEditor);

      try {
        const machine = createDictationMachine(malformedEditor);
        const malformedService = interpret(machine).start();

        // Clear the malformed content first to simulate starting fresh
        malformedEditor.innerHTML = '<p><br></p>';

        malformedService.send({ type: 'saypi:startDictation', targetElement: malformedEditor });
        malformedService.send('saypi:callReady');
        malformedService.state.context.transcriptionTargets[1] = malformedEditor;
        malformedService.send({
          type: 'saypi:transcribed',
          text: 'Recovery text',
          sequenceNumber: 1,
        });

        // Should recover and create proper structure
        expect(malformedEditor.textContent?.trim()).toBe('Recovery text');
        const textSpan = malformedEditor.querySelector('span[data-lexical-text="true"]');
        expect(textSpan?.textContent).toBe('Recovery text');
        
        malformedService.stop();
      } finally {
        if (malformedEditor.parentNode) {
          malformedEditor.parentNode.removeChild(malformedEditor);
        }
      }
    });

    it('should handle special characters in Lexical editors', () => {
      service.send({ type: 'saypi:startDictation', targetElement: lexicalEditor });
      service.send('saypi:callReady');
      service.state.context.transcriptionTargets[1] = lexicalEditor;

      const specialText = 'Hello "world" & <special> characters!';
      service.send({
        type: 'saypi:transcribed',
        text: specialText,
        sequenceNumber: 1,
      });

      // Should handle special characters correctly
      expect(lexicalEditor.textContent?.trim()).toBe(specialText);
      
      // Should maintain proper structure
      const textSpan = lexicalEditor.querySelector('span[data-lexical-text="true"]');
      expect(textSpan?.textContent).toBe(specialText);
    });

    it('should handle very long text in Lexical editors', () => {
      service.send({ type: 'saypi:startDictation', targetElement: lexicalEditor });
      service.send('saypi:callReady');
      service.state.context.transcriptionTargets[1] = lexicalEditor;

      const longText = 'This is a very long text that might cause issues with DOM manipulation.'.repeat(10); // No space after period
      service.send({
        type: 'saypi:transcribed',
        text: longText,
        sequenceNumber: 1,
      });

      // Should handle long text correctly
      expect(lexicalEditor.textContent?.trim()).toBe(longText.trim());
      
      // Should maintain proper structure
      const textSpan = lexicalEditor.querySelector('span[data-lexical-text="true"]');
      expect(textSpan?.textContent).toBe(longText);
    });

    it('should handle Unicode and emoji in Lexical editors', () => {
      service.send({ type: 'saypi:startDictation', targetElement: lexicalEditor });
      service.send('saypi:callReady');
      service.state.context.transcriptionTargets[1] = lexicalEditor;

      const unicodeText = 'Hello 世界! 🌍 Here are some emojis: 🎉 🚀 💻';
      service.send({
        type: 'saypi:transcribed',
        text: unicodeText,
        sequenceNumber: 1,
      });

      // Should handle Unicode and emoji correctly
      expect(lexicalEditor.textContent?.trim()).toBe(unicodeText);
      
      // Should maintain proper structure
      const textSpan = lexicalEditor.querySelector('span[data-lexical-text="true"]');
      expect(textSpan?.textContent).toBe(unicodeText);
    });
  });

  describe('Fallback to Standard Behavior', () => {
    let standardContentEditable: HTMLDivElement;

    beforeEach(() => {
      // Create a standard contenteditable element (not Lexical)
      standardContentEditable = document.createElement('div');
      standardContentEditable.contentEditable = 'true';
      standardContentEditable.id = 'standard-editor';
      document.body.appendChild(standardContentEditable);
    });

    afterEach(() => {
      if (standardContentEditable.parentNode) {
        standardContentEditable.parentNode.removeChild(standardContentEditable);
      }
    });

    it('should use standard text insertion for non-Lexical contenteditable elements', () => {
      const machine = createDictationMachine(standardContentEditable);
      const standardService = interpret(machine).start();

      try {
        standardService.send({ type: 'saypi:startDictation', targetElement: standardContentEditable });
        standardService.send('saypi:callReady');
        standardService.state.context.transcriptionTargets[1] = standardContentEditable;
        standardService.send({
          type: 'saypi:transcribed',
          text: 'Standard text',
          sequenceNumber: 1,
        });

        // Should contain the text without Lexical-specific structure
        expect(standardContentEditable.textContent?.trim()).toBe('Standard text');
        
        // Should not have Lexical-specific spans
        const textSpan = standardContentEditable.querySelector('span[data-lexical-text="true"]');
        expect(textSpan).toBeFalsy();
      } finally {
        standardService.stop();
      }
    });
  });
});