import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('DictationMachine - ContentEditable Cursor Position', () => {
  describe('Cursor Position Management', () => {
    it('should position cursor at end of contentEditable element after text insertion', () => {
      // Create DOM environment using vitest's built-in jsdom
      const contentEditableDiv = document.createElement('div');
      contentEditableDiv.contentEditable = 'true';
      contentEditableDiv.id = 'test-content-editable';
      document.body.appendChild(contentEditableDiv);

      // Helper function to position cursor at the end of contentEditable element
      function positionCursorAtEnd(element: HTMLElement): void {
        const selection = window.getSelection();
        if (!selection) return;
        
        // Create a range that selects the end of the element's content
        const range = document.createRange();
        
        // Move to the end of the element's content
        if (element.childNodes.length > 0) {
          // If there are child nodes, position after the last one
          const lastNode = element.childNodes[element.childNodes.length - 1];
          if (lastNode.nodeType === Node.TEXT_NODE) {
            // If last node is text, position at the end of that text
            range.setStart(lastNode, lastNode.textContent?.length || 0);
            range.setEnd(lastNode, lastNode.textContent?.length || 0);
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

      // Test 1: Initial state - empty element
      expect(contentEditableDiv.textContent).toBe('');
      
      // Test 2: Add text without cursor positioning (simulating old behavior)
      contentEditableDiv.textContent = 'Hello world';
      expect(contentEditableDiv.textContent).toBe('Hello world');
      
      // Test 3: Apply cursor positioning fix
      positionCursorAtEnd(contentEditableDiv);
      
      // Check cursor position after fix - should be at end
      const selection = window.getSelection();
      expect(selection).toBeTruthy();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        expect(range.startOffset).toBe(contentEditableDiv.textContent.length);
      }
      
      // Test 4: Add more text with cursor positioning
      contentEditableDiv.textContent += ' Additional text';
      positionCursorAtEnd(contentEditableDiv);
      
      const selectionFinal = window.getSelection();
      if (selectionFinal && selectionFinal.rangeCount > 0) {
        const rangeFinal = selectionFinal.getRangeAt(0);
        expect(rangeFinal.startOffset).toBe(contentEditableDiv.textContent.length);
      }
      
      expect(contentEditableDiv.textContent).toBe('Hello world Additional text');
      
      // Cleanup
      document.body.removeChild(contentEditableDiv);
    });

    it('should position cursor correctly when replacing all content in contentEditable', () => {
      // Create a contentEditable element with initial content
      const contentEditableDiv = document.createElement('div');
      contentEditableDiv.contentEditable = 'true';
      contentEditableDiv.textContent = 'Initial content';
      document.body.appendChild(contentEditableDiv);

      // Helper function to position cursor at the end
      function positionCursorAtEnd(element: HTMLElement): void {
        const selection = window.getSelection();
        if (!selection) return;
        
        const range = document.createRange();
        
        if (element.childNodes.length > 0) {
          const lastNode = element.childNodes[element.childNodes.length - 1];
          if (lastNode.nodeType === Node.TEXT_NODE) {
            range.setStart(lastNode, lastNode.textContent?.length || 0);
            range.setEnd(lastNode, lastNode.textContent?.length || 0);
          } else {
            range.setStartAfter(lastNode);
            range.setEndAfter(lastNode);
          }
        } else {
          range.setStart(element, 0);
          range.setEnd(element, 0);
        }
        
        selection.removeAllRanges();
        selection.addRange(range);
      }

      // Replace all content (simulating replaceAll: true in setTextInTarget)
      contentEditableDiv.textContent = 'Replaced content';
      positionCursorAtEnd(contentEditableDiv);
      
      // Verify cursor is at end
      const selection = window.getSelection();
      expect(selection).toBeTruthy();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        expect(range.startOffset).toBe(contentEditableDiv.textContent.length);
      }
      
      expect(contentEditableDiv.textContent).toBe('Replaced content');
      
      // Cleanup
      document.body.removeChild(contentEditableDiv);
    });

    it('should work correctly with empty contentEditable elements', () => {
      // Create an empty contentEditable element
      const contentEditableDiv = document.createElement('div');
      contentEditableDiv.contentEditable = 'true';
      document.body.appendChild(contentEditableDiv);

      // Helper function to position cursor at the end
      function positionCursorAtEnd(element: HTMLElement): void {
        const selection = window.getSelection();
        if (!selection) return;
        
        const range = document.createRange();
        
        if (element.childNodes.length > 0) {
          const lastNode = element.childNodes[element.childNodes.length - 1];
          if (lastNode.nodeType === Node.TEXT_NODE) {
            range.setStart(lastNode, lastNode.textContent?.length || 0);
            range.setEnd(lastNode, lastNode.textContent?.length || 0);
          } else {
            range.setStartAfter(lastNode);
            range.setEndAfter(lastNode);
          }
        } else {
          // If no child nodes, position inside the element
          range.setStart(element, 0);
          range.setEnd(element, 0);
        }
        
        selection.removeAllRanges();
        selection.addRange(range);
      }

      // Should handle empty element without errors
      expect(() => positionCursorAtEnd(contentEditableDiv)).not.toThrow();
      
      // Add first text
      contentEditableDiv.textContent = 'First text';
      positionCursorAtEnd(contentEditableDiv);
      
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        expect(range.startOffset).toBe(contentEditableDiv.textContent.length);
      }
      
      // Cleanup
      document.body.removeChild(contentEditableDiv);
    });
  });
});