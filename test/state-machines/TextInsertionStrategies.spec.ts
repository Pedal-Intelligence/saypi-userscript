import { describe, it, expect, beforeEach } from 'vitest';

// Import the strategy classes - we'll need to extract them from DictationMachine
// For now, we'll mock them to test the concept
interface TextInsertionStrategy {
  canHandle(target: HTMLElement): boolean;
  insertText(target: HTMLElement, text: string, replaceAll: boolean): void;
}

class SlateEditorStrategy implements TextInsertionStrategy {
  canHandle(target: HTMLElement): boolean {
    return target.contentEditable === "true" && this.isSlateEditor(target);
  }

  private isSlateEditor(el: HTMLElement): boolean {
    // Check for common Slate.js indicators
    return (
      el.getAttribute("data-slate-editor") === "true" ||
      !!el.closest('[data-slate-editor="true"]') ||
      el.getAttribute("data-slate") === "true" ||
      !!el.closest('[data-slate="true"]') ||
      // Check for Slate-specific data attributes or classes
      el.hasAttribute("data-slate-node") ||
      !!el.closest('[data-slate-node]') ||
      el.classList.contains("slate-editor") ||
      !!el.closest('.slate-editor')
      // Removed overly broad role="textbox" + contenteditable matcher to avoid conflicts with Quill
    );
  }

  insertText(target: HTMLElement, text: string, replaceAll: boolean): void {
    // Mock implementation
  }
}

class QuillEditorStrategy implements TextInsertionStrategy {
  canHandle(target: HTMLElement): boolean {
    return target.contentEditable === "true" && this.isQuillEditor(target);
  }

  private isQuillEditor(el: HTMLElement): boolean {
    // Check for Quill-specific indicators
    return (
      el.classList.contains("ql-editor") ||
      !!el.closest('.ql-editor') ||
      !!el.closest('.ql-container') ||
      // Check for common Quill wrapper patterns used by platforms like LinkedIn
      !!el.closest('[class*="quill"]') ||
      // LinkedIn uses Quill with specific patterns
      (el.getAttribute("role") === "textbox" && 
       el.contentEditable === "true" && 
       el.hasAttribute("data-placeholder"))
    );
  }

  insertText(target: HTMLElement, text: string, replaceAll: boolean): void {
    // Mock implementation
  }
}

describe('TextInsertionStrategies', () => {
  let slateStrategy: SlateEditorStrategy;
  let quillStrategy: QuillEditorStrategy;

  beforeEach(() => {
    slateStrategy = new SlateEditorStrategy();
    quillStrategy = new QuillEditorStrategy();
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

  describe('Strategy Priority', () => {
    it('should have clean separation between Quill and Slate strategies', () => {
      const editor = document.createElement('div');
      editor.className = 'ql-editor';
      editor.setAttribute('contenteditable', 'true');
      editor.contentEditable = 'true';
      editor.setAttribute('role', 'textbox');
      editor.innerHTML = '<p><br></p>';
      
      // After the fix: only Quill strategy should match Quill editors
      expect(quillStrategy.canHandle(editor)).toBe(true);
      expect(slateStrategy.canHandle(editor)).toBe(false); // Fixed!
      
      // In a strategy selector, only Quill would match
      const strategies = [quillStrategy, slateStrategy];
      const matchingStrategy = strategies.find(s => s.canHandle(editor));
      expect(matchingStrategy).toBe(quillStrategy);
    });
  });
});