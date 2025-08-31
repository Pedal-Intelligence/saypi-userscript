/**
 * Text insertion strategies for different types of editors and input fields.
 * Used by both dictation mode and conversation mode to ensure consistent text handling
 * across different platforms and editor types.
 */

export interface TextInsertionStrategy {
  canHandle(target: HTMLElement): boolean;
  insertText(target: HTMLElement, text: string, replaceAll: boolean): void;
}

/**
 * Utility function to position cursor at the end of a contenteditable element
 */
export function positionCursorAtEnd(element: HTMLElement): void {
  const selection = window.getSelection();
  if (!selection) return;

  const range = document.createRange();
  
  // Find the last text node or position after the last element
  const childNodes = Array.from(element.childNodes);
  if (childNodes.length > 0) {
    const lastNode = childNodes[childNodes.length - 1];
    if (lastNode.nodeType === Node.TEXT_NODE && lastNode.textContent) {
      // Last node is a text node, position after its content
      range.setStart(lastNode, lastNode.textContent.length);
      range.setEnd(lastNode, lastNode.textContent.length);
    } else {
      // If last node is not text, position after it
      range.setStartAfter(lastNode);
      range.setEndAfter(lastNode);
    }
  } else {
    // If no child nodes, position inside the element
    range.setStart(element, 0);
    range.setEnd(element, 0);
  }
  
  // Apply the range to the selection
  selection.removeAllRanges();
  selection.addRange(range);
}

export class InputTextareaStrategy implements TextInsertionStrategy {
  canHandle(target: HTMLElement): boolean {
    return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;
  }

  insertText(target: HTMLElement, text: string, replaceAll: boolean): void {
    const inputTarget = target as HTMLInputElement | HTMLTextAreaElement;
    
    if (replaceAll) {
      inputTarget.value = text;
    } else {
      inputTarget.value = inputTarget.value + text;
    }

    // Dispatch input event for framework compatibility
    inputTarget.dispatchEvent(new Event("input", { bubbles: true }));
  }
}

export class LexicalEditorStrategy implements TextInsertionStrategy {
  canHandle(target: HTMLElement): boolean {
    return target.contentEditable === "true" && this.isLexicalEditor(target);
  }

  private isLexicalEditor(el: HTMLElement): boolean {
    return (
      el.getAttribute("data-lexical-editor") === "true" ||
      !!el.closest('[data-lexical-editor="true"]')
    );
  }

  insertText(target: HTMLElement, text: string, replaceAll: boolean): void {
    target.focus();

    // Select all text if we are replacing everything
    if (replaceAll) {
      document.execCommand("selectAll");
    }

    // Attempt programmatic insertion that Lexical will recognise.
    // Try the modern beforeinput/input pathway with InputEvent.
    this.tryNativeInsert(target, text);
  }

  private tryNativeInsert(target: HTMLElement, text: string): boolean {
    try {
      const before = new InputEvent("beforeinput", {
        bubbles: true,
        cancelable: true,
        inputType: "insertText",
        data: text,
        composed: true,
      });

      const defaultPrevented = !target.dispatchEvent(before);
      if (!defaultPrevented) {
        const input = new InputEvent("input", {
          bubbles: true,
          cancelable: false,
          inputType: "insertText",
          data: text,
          composed: true,
        });
        target.dispatchEvent(input);
      }
      return !defaultPrevented;
    } catch {
      return false;
    }
  }
}

export class SlateEditorStrategy implements TextInsertionStrategy {
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
    target.focus();

    // Handle placeholder clearing for Slate editors
    this.clearPlaceholderIfPresent(target);

    // Select all text if we are replacing everything
    if (replaceAll) {
      document.execCommand("selectAll");
    }

    // Try the modern beforeinput/input pathway first (similar to Lexical strategy)
    if (!this.tryNativeInsert(target, text)) {
      // Fallback to direct DOM manipulation if events don't work
      this.fallbackInsert(target, text, replaceAll);
    }
  }

  private clearPlaceholderIfPresent(target: HTMLElement): void {
    // Common patterns for Slate placeholders
    const placeholderSelectors = [
      '[data-slate-placeholder="true"]',
      '[data-slate-placeholder]',
      '.slate-placeholder',
      '[contenteditable="false"][data-slate-zero-width]'
    ];

    for (const selector of placeholderSelectors) {
      const placeholder = target.querySelector(selector);
      if (placeholder && placeholder.textContent) {
        // Hide or remove placeholder element
        (placeholder as HTMLElement).style.display = 'none';
        // Also try removing the attribute that might control visibility
        placeholder.removeAttribute('data-slate-placeholder');
      }
    }

    // Also check if the target itself has placeholder-like content
    if (target.getAttribute('data-placeholder') || target.classList.contains('placeholder')) {
      target.removeAttribute('data-placeholder');
      target.classList.remove('placeholder');
    }
  }

  private tryNativeInsert(target: HTMLElement, text: string): boolean {
    try {
      const before = new InputEvent("beforeinput", {
        bubbles: true,
        cancelable: true,
        inputType: "insertText",
        data: text,
        composed: true,
      });

      const defaultPrevented = !target.dispatchEvent(before);
      if (!defaultPrevented) {
        const input = new InputEvent("input", {
          bubbles: true,
          cancelable: false,
          inputType: "insertText",
          data: text,
          composed: true,
        });
        target.dispatchEvent(input);
      }
      return !defaultPrevented;
    } catch {
      return false;
    }
  }

  private fallbackInsert(target: HTMLElement, text: string, replaceAll: boolean): void {
    if (replaceAll) {
      target.textContent = text;
      positionCursorAtEnd(target);
    } else {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(text));
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        // Fallback: append to end
        target.textContent = (target.textContent || "") + text;
        positionCursorAtEnd(target);
      }
    }

    // Dispatch input event for framework compatibility
    target.dispatchEvent(new Event("input", { bubbles: true }));
  }
}

export class QuillEditorStrategy implements TextInsertionStrategy {
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
    target.focus();

    // Handle placeholder clearing for Quill editors
    this.clearPlaceholderIfPresent(target);

    // Select all text if we are replacing everything
    if (replaceAll) {
      document.execCommand("selectAll");
    }

    // For Quill, use execCommand('insertText') which actually works
    // This is the recommended approach per Quill documentation
    if (!this.tryExecCommandInsert(target, text)) {
      // Fallback to direct DOM manipulation - Quill syncs its model to DOM changes
      this.fallbackDOMInsert(target, text, replaceAll);
    }
  }

  private clearPlaceholderIfPresent(target: HTMLElement): void {
    // Clear Quill placeholder attributes (recommended by research)
    if (target.getAttribute('data-placeholder')) {
      target.removeAttribute('data-placeholder');
    }

    // Clear empty Quill content that might serve as placeholder
    // Quill uses <p><br></p> as empty state
    if (target.innerHTML === '<p><br></p>' || target.innerHTML === '<p></p>') {
      target.innerHTML = '';
    }
  }

  private tryExecCommandInsert(target: HTMLElement, text: string): boolean {
    try {
      // Check if text contains newlines - execCommand('insertText') strips them
      if (text.includes('\n')) {
        // Use insertHTML for multi-line text to preserve paragraphs
        const paragraphs = text.split('\n').map(line => `<p>${line || '<br>'}</p>`).join('');
        const success = document.execCommand('insertHTML', false, paragraphs);
        return success;
      } else {
        // Use execCommand('insertText') - this is what actually works with Quill
        // According to research: "using document.execCommand('insertText', false, 'your text') 
        // on a focused Quill editor will insert text at the cursor and trigger the usual input events"
        const success = document.execCommand('insertText', false, text);
        
        // execCommand returns true if the command was supported and executed
        return success;
      }
    } catch (error) {
      console.debug('execCommand insert failed:', error);
      return false;
    }
  }

  private fallbackDOMInsert(target: HTMLElement, text: string, replaceAll: boolean): void {
    // Direct DOM manipulation - Quill syncs its model to DOM changes
    // Per research: "directly manipulating the Quill editor's DOM is a viable way to insert content"
    
    // Handle multi-line text by creating proper paragraph structure
    const createParagraphsHTML = (text: string): string => {
      return text.split('\n').map(line => `<p>${line || '<br>'}</p>`).join('');
    };
    
    if (replaceAll) {
      // Replace all content with properly formatted Quill structure
      if (text.includes('\n')) {
        target.innerHTML = createParagraphsHTML(text);
      } else {
        target.innerHTML = `<p>${text}</p>`;
      }
    } else {
      // For append mode, check if we have existing content
      if (target.innerHTML === '' || target.innerHTML === '<p><br></p>') {
        // Empty editor - set initial content
        if (text.includes('\n')) {
          target.innerHTML = createParagraphsHTML(text);
        } else {
          target.innerHTML = `<p>${text}</p>`;
        }
      } else {
        // Has content - append new paragraphs
        if (text.includes('\n')) {
          target.insertAdjacentHTML('beforeend', createParagraphsHTML(text));
        } else {
          const lastP = target.querySelector('p:last-child');
          if (lastP && lastP.innerHTML !== '<br>') {
            // Append to existing paragraph
            lastP.textContent = (lastP.textContent || '') + text;
          } else {
            // Create new paragraph
            const newP = document.createElement('p');
            newP.textContent = text;
            target.appendChild(newP);
          }
        }
      }
    }

    // Position cursor at the end
    positionCursorAtEnd(target);

    // Dispatch input event so Quill's model syncs and LinkedIn's UI updates
    // Per research: this ensures "LinkedIn's scripts may listen for focus or input events"
    target.dispatchEvent(new Event("input", { bubbles: true }));
  }
}

/**
 * ProseMirror Editor Strategy for ChatGPT, OpenAI, and other ProseMirror-based editors
 */
export class ProseMirrorEditorStrategy implements TextInsertionStrategy {
  canHandle(target: HTMLElement): boolean {
    return target.contentEditable === "true" && this.isProseMirrorEditor(target);
  }

  private isProseMirrorEditor(el: HTMLElement): boolean {
    // ChatGPT and OpenAI specific patterns
    if (
      el.id === "prompt-textarea" ||
      el.closest('[data-type="unified-composer"]') ||
      el.classList.contains("ProseMirror")
    ) {
      return true;
    }

    // General ProseMirror indicators
    return (
      el.classList.contains("ProseMirror") ||
      !!el.closest('.ProseMirror') ||
      // ProseMirror often has specific data attributes
      el.hasAttribute("data-prosemirror") ||
      !!el.closest('[data-prosemirror]') ||
      el.hasAttribute("data-pm-editor") ||
      !!el.closest('[data-pm-editor]') ||
      // Some implementations use prosemirror class prefix
      !!el.closest('[class*="prosemirror"]') ||
      // Check for ProseMirror wrapper classes
      !!el.closest('.prosemirror-editor') ||
      !!el.closest('.pm-editor')
    );
  }

  insertText(target: HTMLElement, text: string, replaceAll: boolean): void {
    target.focus();

    // Clear placeholder if present
    this.clearPlaceholderIfPresent(target);

    // Select all text if we are replacing everything
    if (replaceAll) {
      // Try modern selection API first
      if (this.selectAllContent(target)) {
        // Selection successful, now insert
        this.insertTextAtSelection(target, text);
      } else {
        // Fallback: clear content directly
        target.textContent = "";
        this.insertTextAtSelection(target, text);
      }
    } else {
      this.insertTextAtSelection(target, text);
    }
  }

  private clearPlaceholderIfPresent(target: HTMLElement): void {
    // Clear common placeholder patterns
    if (target.hasAttribute('data-placeholder')) {
      target.removeAttribute('data-placeholder');
    }
    
    if (target.hasAttribute('placeholder')) {
      target.removeAttribute('placeholder');
    }

    // Clear ChatGPT-specific placeholder styling
    target.classList.remove('placeholder');
    
    // Remove empty state indicators
    if (target.getAttribute('aria-placeholder')) {
      target.removeAttribute('aria-placeholder');
    }
  }

  private selectAllContent(target: HTMLElement): boolean {
    try {
      const selection = window.getSelection();
      if (!selection) return false;

      const range = document.createRange();
      range.selectNodeContents(target);
      selection.removeAllRanges();
      selection.addRange(range);
      return true;
    } catch {
      return false;
    }
  }

  private insertTextAtSelection(target: HTMLElement, text: string): void {
    // Strategy 1: Try modern execCommand('insertText')
    if (this.tryExecCommandInsert(target, text)) {
      return;
    }

    // Strategy 2: Try modern beforeinput/input events
    if (this.tryNativeInsert(target, text)) {
      return;
    }

    // Strategy 3: Fallback to direct DOM manipulation
    this.fallbackInsert(target, text);
  }

  private tryExecCommandInsert(target: HTMLElement, text: string): boolean {
    try {
      // execCommand('insertText') is deprecated but still works reliably in many cases
      if (document.queryCommandSupported && document.queryCommandSupported('insertText')) {
        const success = document.execCommand('insertText', false, text);
        if (success) {
          // Trigger input event for ProseMirror to update its model
          target.dispatchEvent(new Event('input', { bubbles: true }));
          return true;
        }
      }
      return false;
    } catch {
      return false;
    }
  }

  private tryNativeInsert(target: HTMLElement, text: string): boolean {
    try {
      // Use modern Input Events (preferred by ProseMirror)
      const beforeInput = new InputEvent("beforeinput", {
        bubbles: true,
        cancelable: true,
        inputType: "insertText",
        data: text,
        composed: true,
      });

      const defaultPrevented = !target.dispatchEvent(beforeInput);
      if (!defaultPrevented) {
        const inputEvent = new InputEvent("input", {
          bubbles: true,
          cancelable: false,
          inputType: "insertText",
          data: text,
          composed: true,
        });
        target.dispatchEvent(inputEvent);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  private fallbackInsert(target: HTMLElement, text: string): void {
    const selection = window.getSelection();
    
    if (selection && selection.rangeCount > 0) {
      // Insert at current selection
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(text));
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      // No selection - append to end
      if (target.textContent) {
        target.textContent = target.textContent + text;
      } else {
        target.textContent = text;
      }
      // Position cursor at end
      positionCursorAtEnd(target);
    }

    // Always dispatch input event for framework compatibility
    target.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

export class ContentEditableStrategy implements TextInsertionStrategy {
  canHandle(target: HTMLElement): boolean {
    // Generic contenteditable fallback - should be last in priority order
    return target.contentEditable === "true";
  }

  insertText(target: HTMLElement, text: string, replaceAll: boolean): void {
    target.focus();

    if (replaceAll) {
      target.textContent = text;
    } else {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(text));
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        target.textContent = (target.textContent || "") + text;
      }
    }

    positionCursorAtEnd(target);
    target.dispatchEvent(new Event("input", { bubbles: true }));
  }
}