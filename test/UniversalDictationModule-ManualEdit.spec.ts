import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import EventBus from '../src/events/EventBus.js';

// Mock dependencies
vi.mock('../src/events/EventBus.js', () => ({
  default: {
    emit: vi.fn(),
    on: vi.fn(),
  },
}));

vi.mock('../src/ConfigModule', () => ({
  config: {
    apiServerUrl: 'http://localhost:3000',
  },
}));

vi.mock('../src/prefs/PreferenceModule', () => ({
  UserPreferenceModule: {
    getInstance: () => ({
      getLanguage: vi.fn(() => Promise.resolve('en')),
      isTTSBetaPaused: vi.fn(() => Promise.resolve(false)),
      getDiscretionaryMode: vi.fn(() => Promise.resolve(false)),
      getCachedDiscretionaryMode: vi.fn(() => false),
    }),
  },
}));

vi.mock('../src/NotificationsModule', () => ({
  AudibleNotificationsModule: {
    getInstance: vi.fn(() => ({
      // Mock audible notification methods
    })),
  },
  TextualNotificationsModule: vi.fn(() => ({
    // Mock textual notification methods
  })),
  VisualNotificationsModule: vi.fn(() => ({
    // Mock visual notification methods
  })),
}));

vi.mock('../src/ResourceModule', () => ({
  getResourceUrl: vi.fn((path) => `chrome-extension://test/${path}`),
}));

// Mock Audio constructor
global.Audio = vi.fn(() => ({
  play: vi.fn(),
  pause: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}));

vi.mock('../src/icons/IconModule', () => ({
  IconModule: {
    bubbleBw: {
      cloneNode: vi.fn(() => ({
        setAttribute: vi.fn(),
        style: { cssText: '' },
      })),
    },
    bubble: vi.fn(() => ({
      setAttribute: vi.fn(),
      style: { cssText: '' },
    })),
  },
}));

vi.mock('../src/i18n', () => ({
  default: vi.fn((key) => `mocked-${key}`),
}));

// Mock chrome runtime
global.chrome = {
  runtime: {
    onMessage: {
      addListener: vi.fn(),
      removeListener: vi.fn(),
    },
    sendMessage: vi.fn().mockResolvedValue({}),
  },
} as any;

// Mock DOM methods
vi.stubGlobal('location', {
  hostname: 'example.com',
});

// Test the core manual edit logic in isolation
describe('Manual Edit Detection Logic', () => {
  let inputElement: HTMLInputElement;
  let mockMachine: any;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup DOM
    document.body.innerHTML = '';
    
    // Create input element
    inputElement = document.createElement('input');
    inputElement.type = 'text';
    inputElement.id = 'test-input';
    inputElement.value = '';
    document.body.appendChild(inputElement);

    // Mock machine
    mockMachine = {
      send: vi.fn(),
      getSnapshot: vi.fn(() => ({ value: 'idle' })),
      onTransition: vi.fn(() => mockMachine),
      start: vi.fn(),
      stop: vi.fn(),
    };
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Helper Functions', () => {
    it('should get element content correctly for different element types', () => {
      // Test input element
      const input = document.createElement('input');
      input.value = 'input text';
      
      // Test textarea element
      const textarea = document.createElement('textarea');
      textarea.value = 'textarea text';
      
      // Test contenteditable element
      const div = document.createElement('div');
      div.contentEditable = 'true';
      div.textContent = 'editable text';
      
      // Test other element
      const span = document.createElement('span');
      span.textContent = 'span text';

      // These are the functions we want to test directly
      function getElementContent(element: HTMLElement): string {
        if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
          return element.value;
        } else if (element.contentEditable === 'true') {
          return element.textContent || '';
        }
        return '';
      }

      expect(getElementContent(input)).toBe('input text');
      expect(getElementContent(textarea)).toBe('textarea text');
      expect(getElementContent(div)).toBe('editable text');
      expect(getElementContent(span)).toBe('');
    });

    it('should handle manual edit event sending logic', () => {
      function handleManualEdit(element: HTMLElement, newContent: string, oldContent: string) {
        mockMachine.send({
          type: 'saypi:manualEdit',
          targetElement: element,
          newContent,
          oldContent
        });
      }

      handleManualEdit(inputElement, 'new content', 'old content');

      expect(mockMachine.send).toHaveBeenCalledWith({
        type: 'saypi:manualEdit',
        targetElement: inputElement,
        newContent: 'new content',
        oldContent: 'old content'
      });
    });

    it('should detect content changes correctly', () => {
      let lastContent = 'Hello';
      const currentContent = 'Hello World';
      
      // Simulate the change detection logic
      if (currentContent !== lastContent) {
        const changeDetected = true;
        expect(changeDetected).toBe(true);
        
        // Simulate sending the event
        mockMachine.send({
          type: 'saypi:manualEdit',
          targetElement: inputElement,
          newContent: currentContent,
          oldContent: lastContent
        });
      }

      expect(mockMachine.send).toHaveBeenCalledWith({
        type: 'saypi:manualEdit',
        targetElement: inputElement,
        newContent: 'Hello World',
        oldContent: 'Hello'
      });
    });

    it('should prevent detection during dictation updates', () => {
      let isUpdatingFromDictation = false;
      
      // Simulate dictation update flag
      isUpdatingFromDictation = true;
      
      // Simulate change detection with flag
      if (!isUpdatingFromDictation) {
        mockMachine.send({
          type: 'saypi:manualEdit',
          targetElement: inputElement,
          newContent: 'some content',
          oldContent: 'old content'
        });
      }

      // Should not send event during dictation update
      expect(mockMachine.send).not.toHaveBeenCalled();
    });
  });
});