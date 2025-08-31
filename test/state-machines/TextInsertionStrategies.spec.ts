import { describe, it, expect, beforeEach } from 'vitest';

// Import the actual strategy classes from the shared module
import {
  TextInsertionStrategy,
  SlateEditorStrategy,
  QuillEditorStrategy,
  ProseMirrorEditorStrategy
} from '../../src/text-insertion/TextInsertionStrategy';
import { TextInsertionManager } from '../../src/text-insertion/TextInsertionManager';

describe('TextInsertionStrategies', () => {
  let slateStrategy: SlateEditorStrategy;
  let quillStrategy: QuillEditorStrategy;
  let proseMirrorStrategy: ProseMirrorEditorStrategy;
  let textInsertionManager: TextInsertionManager;

  beforeEach(() => {
    slateStrategy = new SlateEditorStrategy();
    quillStrategy = new QuillEditorStrategy();
    proseMirrorStrategy = new ProseMirrorEditorStrategy();
    textInsertionManager = TextInsertionManager.getInstance();
  });

  describe('QuillEditorStrategy', () => {
    it('should match LinkedIn Quill editor HTML', () => {
      // Create the LinkedIn Quill editor HTML from the user's example
      const quillEditor = document.createElement('div');
      quillEditor.className = 'ql-editor ql-blank';
      quillEditor.setAttribute('data-gramm', 'false');
      quillEditor.contentEditable = 'true';
      quillEditor.setAttribute('aria-placeholder', 'Share your thoughts…');
      quillEditor.setAttribute('aria-label', 'Text editor for creating content');
      quillEditor.setAttribute('role', 'textbox');
      quillEditor.setAttribute('aria-multiline', 'true');
      quillEditor.setAttribute('aria-describedby', 'ember880-text-editor-placeholder');
      quillEditor.setAttribute('data-test-ql-editor-contenteditable', 'true');
      quillEditor.setAttribute('data-artdeco-is-focused', 'true');
      quillEditor.setAttribute('data-has-recording-div', 'true');
      quillEditor.innerHTML = '<p><br></p>';
      
      expect(quillStrategy.canHandle(quillEditor)).toBe(true);
    });

    it('should match standard Quill editor patterns', () => {
      // Test basic ql-editor class
      const basicQuill = document.createElement('div');
      basicQuill.className = 'ql-editor';
      basicQuill.contentEditable = 'true';
      expect(quillStrategy.canHandle(basicQuill)).toBe(true);

      // Test ql-container wrapper
      const container = document.createElement('div');
      container.className = 'ql-container';
      const nestedEditor = document.createElement('div');
      nestedEditor.contentEditable = 'true';
      container.appendChild(nestedEditor);
      expect(quillStrategy.canHandle(nestedEditor)).toBe(true);

      // Test generic quill class pattern
      const genericQuill = document.createElement('div');
      genericQuill.className = 'my-quill-editor';
      genericQuill.contentEditable = 'true';
      const wrapper = document.createElement('div');
      wrapper.appendChild(genericQuill);
      expect(quillStrategy.canHandle(genericQuill)).toBe(true);
    });

    it('should not match non-Quill contenteditable elements', () => {
      const genericDiv = document.createElement('div');
      genericDiv.contentEditable = 'true';
      expect(quillStrategy.canHandle(genericDiv)).toBe(false);

      const regularTextarea = document.createElement('textarea');
      expect(quillStrategy.canHandle(regularTextarea)).toBe(false);
    });
  });

  describe('SlateEditorStrategy', () => {
    it('should NOT match LinkedIn Quill editor HTML after fix', () => {
      // Create the same LinkedIn Quill editor HTML
      const quillEditor = document.createElement('div');
      quillEditor.className = 'ql-editor ql-blank';
      quillEditor.setAttribute('data-gramm', 'false');
      quillEditor.setAttribute('contenteditable', 'true');
      quillEditor.contentEditable = 'true'; // Set both attribute and property for JSDOM
      quillEditor.setAttribute('aria-placeholder', 'Share your thoughts…');
      quillEditor.setAttribute('aria-label', 'Text editor for creating content');
      quillEditor.setAttribute('role', 'textbox');
      quillEditor.setAttribute('aria-multiline', 'true');
      quillEditor.setAttribute('aria-describedby', 'ember880-text-editor-placeholder');
      quillEditor.setAttribute('data-test-ql-editor-contenteditable', 'true');
      quillEditor.setAttribute('data-artdeco-is-focused', 'true');
      quillEditor.setAttribute('data-has-recording-div', 'true');
      quillEditor.innerHTML = '<p><br></p>';
      
      // After removing the overly broad role="textbox" + contenteditable matcher,
      // Slate strategy should NOT match Quill editors anymore
      expect(slateStrategy.canHandle(quillEditor)).toBe(false); // Fixed!
    });

    it('should match actual Slate editor patterns', () => {
      // Test data-slate-editor attribute
      const slateEditor = document.createElement('div');
      slateEditor.contentEditable = 'true';
      slateEditor.setAttribute('data-slate-editor', 'true');
      expect(slateStrategy.canHandle(slateEditor)).toBe(true);

      // Test data-slate attribute
      const slateEditor2 = document.createElement('div');
      slateEditor2.contentEditable = 'true';
      slateEditor2.setAttribute('data-slate', 'true');
      expect(slateStrategy.canHandle(slateEditor2)).toBe(true);

      // Test slate-editor class
      const slateEditor3 = document.createElement('div');
      slateEditor3.contentEditable = 'true';
      slateEditor3.className = 'slate-editor';
      expect(slateStrategy.canHandle(slateEditor3)).toBe(true);
    });

    it('should not match generic contenteditable elements', () => {
      const genericDiv = document.createElement('div');
      genericDiv.setAttribute('contenteditable', 'true');
      genericDiv.contentEditable = 'true';
      genericDiv.setAttribute('role', 'textbox');
      // Without Slate-specific indicators, this should not match
      // After the fix, it correctly does not match
      expect(slateStrategy.canHandle(genericDiv)).toBe(false); // Fixed!
    });
  });

  describe('ProseMirrorEditorStrategy', () => {
    it('should match ChatGPT ProseMirror editor', () => {
      // Create ChatGPT's unified composer structure
      const composerContainer = document.createElement('div');
      composerContainer.setAttribute('data-type', 'unified-composer');
      
      const proseMirrorEditor = document.createElement('div');
      proseMirrorEditor.className = 'ProseMirror';
      proseMirrorEditor.contentEditable = 'true';
      proseMirrorEditor.id = 'prompt-textarea';
      proseMirrorEditor.setAttribute('role', 'textbox');
      proseMirrorEditor.setAttribute('aria-multiline', 'true');
      proseMirrorEditor.setAttribute('data-placeholder', 'Ask anything');
      
      composerContainer.appendChild(proseMirrorEditor);
      document.body.appendChild(composerContainer);
      
      expect(proseMirrorStrategy.canHandle(proseMirrorEditor)).toBe(true);
      
      // Clean up
      document.body.removeChild(composerContainer);
    });

    it('should match generic ProseMirror editors', () => {
      // Test basic ProseMirror class
      const basicProseMirror = document.createElement('div');
      basicProseMirror.className = 'ProseMirror';
      basicProseMirror.contentEditable = 'true';
      expect(proseMirrorStrategy.canHandle(basicProseMirror)).toBe(true);

      // Test pm-editor class
      const pmEditor = document.createElement('div');
      pmEditor.className = 'pm-editor';
      pmEditor.contentEditable = 'true';
      expect(proseMirrorStrategy.canHandle(pmEditor)).toBe(true);

      // Test prosemirror-editor class
      const proseMirrorEditorClass = document.createElement('div');
      proseMirrorEditorClass.className = 'prosemirror-editor';
      proseMirrorEditorClass.contentEditable = 'true';
      expect(proseMirrorStrategy.canHandle(proseMirrorEditorClass)).toBe(true);

      // Test data-prosemirror attribute
      const dataProseMirror = document.createElement('div');
      dataProseMirror.setAttribute('data-prosemirror', 'true');
      dataProseMirror.contentEditable = 'true';
      expect(proseMirrorStrategy.canHandle(dataProseMirror)).toBe(true);
    });

    it('should not match non-ProseMirror contenteditable elements', () => {
      const genericDiv = document.createElement('div');
      genericDiv.contentEditable = 'true';
      expect(proseMirrorStrategy.canHandle(genericDiv)).toBe(false);

      const quillEditor = document.createElement('div');
      quillEditor.className = 'ql-editor';
      quillEditor.contentEditable = 'true';
      expect(proseMirrorStrategy.canHandle(quillEditor)).toBe(false);

      const regularTextarea = document.createElement('textarea');
      expect(proseMirrorStrategy.canHandle(regularTextarea)).toBe(false);
    });

    it('should handle text insertion with proper event dispatch', () => {
      const proseMirrorEditor = document.createElement('div');
      proseMirrorEditor.className = 'ProseMirror';
      proseMirrorEditor.contentEditable = 'true';
      
      // Mock the dispatchEvent method to track calls
      const dispatchedEvents: Event[] = [];
      proseMirrorEditor.dispatchEvent = (event: Event) => {
        dispatchedEvents.push(event);
        return true;
      };

      // Mock focus method
      proseMirrorEditor.focus = () => {};

      const testText = 'Hello, ProseMirror!';
      proseMirrorStrategy.insertText(proseMirrorEditor, testText, false);

      // Should dispatch at least one event (input event is always dispatched)
      expect(dispatchedEvents.length).toBeGreaterThan(0);
      
      // The last event should be an input event
      const lastEvent = dispatchedEvents[dispatchedEvents.length - 1];
      expect(lastEvent.type).toBe('input');
      expect(lastEvent.bubbles).toBe(true);
    });
  });

  describe('TextInsertionManager', () => {
    it('should select the correct strategy for different editor types', () => {
      // Test ProseMirror selection
      const proseMirrorEditor = document.createElement('div');
      proseMirrorEditor.className = 'ProseMirror';
      proseMirrorEditor.contentEditable = 'true';
      
      const proseMirrorStrategyMatch = textInsertionManager.getStrategyForTarget(proseMirrorEditor);
      expect(proseMirrorStrategyMatch).toBeInstanceOf(ProseMirrorEditorStrategy);

      // Test Quill selection
      const quillEditor = document.createElement('div');
      quillEditor.className = 'ql-editor';
      quillEditor.contentEditable = 'true';
      
      const quillStrategyMatch = textInsertionManager.getStrategyForTarget(quillEditor);
      expect(quillStrategyMatch).toBeInstanceOf(QuillEditorStrategy);

      // Test Slate selection
      const slateEditor = document.createElement('div');
      slateEditor.contentEditable = 'true';
      slateEditor.setAttribute('data-slate-editor', 'true');
      
      const slateStrategyMatch = textInsertionManager.getStrategyForTarget(slateEditor);
      expect(slateStrategyMatch).toBeInstanceOf(SlateEditorStrategy);
    });

    it('should respect strategy priority order', () => {
      // Create an element that could match multiple strategies
      // ProseMirror should take priority over generic ContentEditable
      const ambiguousEditor = document.createElement('div');
      ambiguousEditor.className = 'ProseMirror some-other-class';
      ambiguousEditor.contentEditable = 'true';
      
      const selectedStrategy = textInsertionManager.getStrategyForTarget(ambiguousEditor);
      expect(selectedStrategy).toBeInstanceOf(ProseMirrorEditorStrategy);
    });

    it('should successfully insert text using the manager', () => {
      const proseMirrorEditor = document.createElement('div');
      proseMirrorEditor.className = 'ProseMirror';
      proseMirrorEditor.contentEditable = 'true';
      
      // Mock methods
      proseMirrorEditor.focus = () => {};
      proseMirrorEditor.dispatchEvent = () => true;

      const testText = 'Manager test text';
      const success = textInsertionManager.insertText(proseMirrorEditor, testText, true);
      
      expect(success).toBe(true);
    });
  });

  describe('Strategy Priority', () => {
    it('should have clean separation between Quill, Slate, and ProseMirror strategies', () => {
      // Test Quill editor
      const quillEditor = document.createElement('div');
      quillEditor.className = 'ql-editor';
      quillEditor.setAttribute('contenteditable', 'true');
      quillEditor.contentEditable = 'true';
      quillEditor.setAttribute('role', 'textbox');
      quillEditor.innerHTML = '<p><br></p>';
      
      expect(quillStrategy.canHandle(quillEditor)).toBe(true);
      expect(slateStrategy.canHandle(quillEditor)).toBe(false);
      expect(proseMirrorStrategy.canHandle(quillEditor)).toBe(false);

      // Test ProseMirror editor
      const proseMirrorEditor = document.createElement('div');
      proseMirrorEditor.className = 'ProseMirror';
      proseMirrorEditor.contentEditable = 'true';
      
      expect(proseMirrorStrategy.canHandle(proseMirrorEditor)).toBe(true);
      expect(quillStrategy.canHandle(proseMirrorEditor)).toBe(false);
      expect(slateStrategy.canHandle(proseMirrorEditor)).toBe(false);

      // Test Slate editor
      const slateEditor = document.createElement('div');
      slateEditor.contentEditable = 'true';
      slateEditor.setAttribute('data-slate-editor', 'true');
      
      expect(slateStrategy.canHandle(slateEditor)).toBe(true);
      expect(quillStrategy.canHandle(slateEditor)).toBe(false);
      expect(proseMirrorStrategy.canHandle(slateEditor)).toBe(false);
    });

    it('should prioritize more specific strategies in the manager', () => {
      const strategies = [quillStrategy, slateStrategy, proseMirrorStrategy];
      
      // ProseMirror editor should match ProseMirror strategy
      const proseMirrorEditor = document.createElement('div');
      proseMirrorEditor.className = 'ProseMirror';
      proseMirrorEditor.contentEditable = 'true';
      
      const matchingStrategy = strategies.find(s => s.canHandle(proseMirrorEditor));
      expect(matchingStrategy).toBe(proseMirrorStrategy);
    });
  });
});