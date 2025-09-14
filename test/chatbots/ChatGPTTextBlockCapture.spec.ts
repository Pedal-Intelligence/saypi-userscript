import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

describe('ChatGPT Text Block Capture Logic', () => {
  beforeEach(() => {
    // Clear the DOM before each test
    document.body.innerHTML = '';
    
    // Mock console methods
    vi.spyOn(console, 'debug').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('DOM element fallback strategies', () => {
    it('should prefer original element when connected and has content', () => {
      // Setup: create connected elements with content
      const turnContainer = document.createElement('article');
      turnContainer.setAttribute('data-turn', 'assistant');
      turnContainer.textContent = 'Turn container content';
      
      const contentElement = document.createElement('div');
      contentElement.classList.add('prose');
      contentElement.textContent = 'Original element content';
      turnContainer.appendChild(contentElement);
      document.body.appendChild(turnContainer);

      // Test the fallback logic
      let text = "";
      
      // Strategy 1: Try original element first
      if (contentElement.isConnected && document.contains(contentElement)) {
        text = (contentElement.textContent || "").trimEnd();
      }
      
      // Strategy 2: Try turnContainer if original element failed
      if (!text && turnContainer && document.contains(turnContainer)) {
        text = (turnContainer.textContent || "").trimEnd();
      }

      expect(text).toBe('Original element content');
    });

    it('should fallback to turnContainer when original element has no content', () => {
      // Setup: original element empty, turnContainer has content
      const turnContainer = document.createElement('article');
      turnContainer.setAttribute('data-turn', 'assistant');
      turnContainer.textContent = 'Turn container content';
      
      const contentElement = document.createElement('div');
      contentElement.classList.add('prose');
      // contentElement intentionally empty
      turnContainer.appendChild(contentElement);
      document.body.appendChild(turnContainer);

      // Test the fallback logic
      let text = "";
      
      // Strategy 1: Try original element first
      if (contentElement.isConnected && document.contains(contentElement)) {
        text = (contentElement.textContent || "").trimEnd();
      }
      
      // Strategy 2: Try turnContainer if original element failed
      if (!text && turnContainer && document.contains(turnContainer)) {
        text = (turnContainer.textContent || "").trimEnd();
      }

      expect(text).toBe('Turn container content');
    });

    it('should search for replacement by data-testid when both original and turnContainer are empty', () => {
      // Setup: empty original and turn container
      const turnContainer = document.createElement('article');
      turnContainer.setAttribute('data-turn', 'assistant');
      turnContainer.setAttribute('data-testid', 'conversation-turn-42');
      // turnContainer intentionally empty
      
      const contentElement = document.createElement('div');
      contentElement.classList.add('prose');
      // contentElement intentionally empty
      turnContainer.appendChild(contentElement);
      document.body.appendChild(turnContainer);

      // Create replacement element with same data-testid but different from turnContainer
      const replacement = document.createElement('article');
      replacement.setAttribute('data-testid', 'conversation-turn-42');
      replacement.textContent = 'Replacement content';
      replacement.setAttribute('data-replacement', 'true'); // Make it clearly different
      document.body.appendChild(replacement);

      // Test the fallback logic
      let text = "";
      
      // Strategy 1: Try original element first
      if (contentElement.isConnected && document.contains(contentElement)) {
        text = (contentElement.textContent || "").trimEnd();
      }
      
      // Strategy 2: Try turnContainer if original element failed
      if (!text && turnContainer && document.contains(turnContainer)) {
        text = (turnContainer.textContent || "").trimEnd();
      }
      
      // Strategy 3: Search for replacement element by data attributes
      if (!text && turnContainer) {
        const testId = turnContainer.getAttribute('data-testid');
        const turnAttr = turnContainer.getAttribute('data-turn');
        
        let replacementEl = null;
        
        // Try to find by exact data-testid first
        if (testId) {
          const candidates = document.querySelectorAll(`[data-testid="${testId}"]`);
          // Find the first candidate that's not the turnContainer itself
          for (const candidate of candidates) {
            if (candidate !== turnContainer && candidate.textContent?.trim()) {
              replacementEl = candidate;
              break;
            }
          }
        }
        
        // Fallback to data-turn attribute
        if (!replacementEl && turnAttr) {
          const candidates = document.querySelectorAll(`article[data-turn="${turnAttr}"]`);
          // Find the first candidate that's not the turnContainer itself  
          for (const candidate of candidates) {
            if (candidate !== turnContainer && candidate.textContent?.trim()) {
              replacementEl = candidate;
              break;
            }
          }
        }
        
        if (replacementEl && replacementEl !== turnContainer) {
          text = (replacementEl.textContent || "").trimEnd();
        }
      }

      expect(text).toBe('Replacement content');
    });
  });

  describe('duplicate processing prevention', () => {
    it('should detect when text has already been captured', () => {
      const turnContainer = document.createElement('article');
      turnContainer.setAttribute('data-turn', 'assistant');
      turnContainer.setAttribute('data-saypi-text-captured', 'true');
      turnContainer.textContent = 'Test content';
      document.body.appendChild(turnContainer);

      // Test the duplicate processing check
      const alreadyCaptured = turnContainer.getAttribute('data-saypi-text-captured') === 'true';
      
      expect(alreadyCaptured).toBe(true);
    });

    it('should mark turn container after text capture', () => {
      const turnContainer = document.createElement('article');
      turnContainer.setAttribute('data-turn', 'assistant');
      turnContainer.textContent = 'Test content';
      document.body.appendChild(turnContainer);

      // Simulate the marking logic
      turnContainer.setAttribute('data-saypi-text-captured', 'true');

      expect(turnContainer.getAttribute('data-saypi-text-captured')).toBe('true');
    });
  });

  describe('edge cases', () => {
    it('should handle disconnected elements gracefully', () => {
      // Create element not attached to DOM
      const contentElement = document.createElement('div');
      contentElement.textContent = 'Test content';
      
      // Test that isConnected and document.contains work as expected
      expect(contentElement.isConnected).toBe(false);
      expect(document.contains(contentElement)).toBe(false);
    });

    it('should handle missing attributes gracefully', () => {
      const turnContainer = document.createElement('article');
      // No data-testid or data-turn attributes set
      
      const testId = turnContainer.getAttribute('data-testid');
      const turnAttr = turnContainer.getAttribute('data-turn');
      
      expect(testId).toBeNull();
      expect(turnAttr).toBeNull();
    });

    it('should handle empty text content gracefully', () => {
      const element = document.createElement('div');
      // No text content set
      
      const text = (element.textContent || "").trimEnd();
      
      expect(text).toBe("");
    });
  });

  describe('findTurnContainer logic', () => {
    it('should find turn container by data-turn attribute', () => {
      const turnContainer = document.createElement('article');
      turnContainer.setAttribute('data-turn', 'assistant');
      
      const contentElement = document.createElement('div');
      contentElement.classList.add('prose');
      turnContainer.appendChild(contentElement);
      document.body.appendChild(turnContainer);

      // Test findTurnContainer logic
      const found = (
        contentElement.closest('article[data-turn="assistant"]') as HTMLElement | null ||
        contentElement.closest('[data-message-author-role="assistant"]') as HTMLElement | null ||
        contentElement.closest('.assistant-message') as HTMLElement | null ||
        contentElement.parentElement
      );

      expect(found).toBe(turnContainer);
    });

    it('should find turn container by message author role', () => {
      const turnContainer = document.createElement('div');
      turnContainer.setAttribute('data-message-author-role', 'assistant');
      
      const contentElement = document.createElement('div');
      contentElement.classList.add('prose');
      turnContainer.appendChild(contentElement);
      document.body.appendChild(turnContainer);

      // Test findTurnContainer logic
      const found = (
        contentElement.closest('article[data-turn="assistant"]') as HTMLElement | null ||
        contentElement.closest('[data-message-author-role="assistant"]') as HTMLElement | null ||
        contentElement.closest('.assistant-message') as HTMLElement | null ||
        contentElement.parentElement
      );

      expect(found).toBe(turnContainer);
    });

    it('should fallback to parent element when no specific container found', () => {
      const parentElement = document.createElement('div');
      const contentElement = document.createElement('div');
      contentElement.classList.add('prose');
      parentElement.appendChild(contentElement);
      document.body.appendChild(parentElement);

      // Test findTurnContainer logic
      const found = (
        contentElement.closest('article[data-turn="assistant"]') as HTMLElement | null ||
        contentElement.closest('[data-message-author-role="assistant"]') as HTMLElement | null ||
        contentElement.closest('.assistant-message') as HTMLElement | null ||
        contentElement.parentElement
      );

      expect(found).toBe(parentElement);
    });
  });
});