/**
 * Test utilities and mocks for settings UI tests
 */
import { vi } from 'vitest';

/**
 * Mock chrome.storage.local with in-memory storage
 */
export function createMockStorage() {
  let storage: Record<string, any> = {};

  return {
    get: vi.fn((keys: string | string[], callback?: (result: any) => void) => {
      const keysArray = Array.isArray(keys) ? keys : [keys];
      const result: Record<string, any> = {};

      keysArray.forEach((key) => {
        if (key in storage) {
          result[key] = storage[key];
        }
      });

      if (callback) callback(result);
      return Promise.resolve(result);
    }),

    set: vi.fn((items: Record<string, any>, callback?: () => void) => {
      storage = { ...storage, ...items };
      if (callback) callback();
      return Promise.resolve();
    }),

    remove: vi.fn((keys: string | string[], callback?: () => void) => {
      const keysArray = Array.isArray(keys) ? keys : [keys];
      keysArray.forEach((key) => delete storage[key]);
      if (callback) callback();
      return Promise.resolve();
    }),

    clear: vi.fn((callback?: () => void) => {
      storage = {};
      if (callback) callback();
      return Promise.resolve();
    }),

    // Test helpers
    _getState: () => storage,
    _setState: (newState: Record<string, any>) => { storage = newState; },
    _reset: () => { storage = {}; }
  };
}

/**
 * Mock chrome.tabs for message sending tests
 */
export function createMockTabs() {
  return {
    query: vi.fn((queryInfo: any, callback?: (tabs: any[]) => void) => {
      const mockTabs = [{ id: 123, active: true, currentWindow: true }];
      if (callback) callback(mockTabs);
      return Promise.resolve(mockTabs);
    }),

    sendMessage: vi.fn((tabId: number, message: any, callback?: (response: any) => void) => {
      if (callback) callback({ success: true });
      return Promise.resolve({ success: true });
    })
  };
}

/**
 * Mock chrome.i18n for translation tests
 */
export function createMockI18n() {
  const messages: Record<string, string> = {
    'aboutSayPiHeading': 'About SayPi',
    'aboutSayPiDescription': 'Voice assistant for Pi.ai',
    'soundEffects': 'Sound Effects',
    'shareData': 'Share Analytics',
    'analyticsConsent': 'Analytics Consent',
    'interruptionsFirefoxDisabled': 'Interruptions not available in Firefox',
    'submit_mode_agent_description': 'Test mode description for {{nickname}}',
    'submit_mode_auto_description': 'Auto submit description',
    'submit_mode_off_description': 'Off mode description'
  };

  return {
    getMessage: vi.fn((messageName: string, substitutions?: string[]) => {
      let message = messages[messageName] || messageName;
      if (substitutions && substitutions.length > 0) {
        // Replace {{nickname}} placeholder with first substitution
        message = message.replace('{{nickname}}', substitutions[0]);
      }
      return message;
    })
  };
}

/**
 * Mock chrome runtime
 */
export function createMockRuntime() {
  return {
    lastError: null,
    sendMessage: vi.fn(),
    onMessage: {
      addListener: vi.fn(),
      removeListener: vi.fn()
    }
  };
}

/**
 * Setup complete chrome mock for tests
 * Note: This returns the global chrome mock set up in test/vitest.setup.js
 * We don't create new mocks because wxt/browser needs to use the same instance
 */
export function setupChromeMock() {
  const chrome = (global as any).chrome;

  if (!chrome) {
    throw new Error('Global chrome mock not found. Ensure vitest.setup.js is loaded.');
  }

  return {
    storage: chrome.storage.local,
    tabs: chrome.tabs,
    i18n: chrome.i18n,
    runtime: chrome.runtime,
    cleanup: () => {
      // Reset storage state
      chrome.storage.local.clear();
      vi.clearAllMocks();
    }
  };
}

/**
 * Create a test DOM container
 */
export function createTestContainer(html = ''): HTMLElement {
  const container = document.createElement('div');
  container.innerHTML = html;
  document.body.appendChild(container);
  return container;
}

/**
 * Cleanup test DOM
 */
export function cleanupTestContainer(container: HTMLElement): void {
  if (container.parentNode) {
    container.parentNode.removeChild(container);
  }
}

/**
 * Mock navigator.userAgent
 */
export function mockUserAgent(userAgent: string) {
  Object.defineProperty(global.navigator, 'userAgent', {
    value: userAgent,
    writable: true,
    configurable: true
  });
}

/**
 * Restore navigator.userAgent
 */
export function restoreUserAgent() {
  Object.defineProperty(global.navigator, 'userAgent', {
    value: 'Mozilla/5.0',
    writable: true,
    configurable: true
  });
}

/**
 * Setup location mock for tests that use location.reload()
 */
export function setupLocationMock() {
  const mockLocation = {
    reload: vi.fn(),
    href: 'http://localhost',
    origin: 'http://localhost',
    protocol: 'http:',
    host: 'localhost',
    hostname: 'localhost',
    port: '',
    pathname: '/',
    search: '',
    hash: ''
  };

  Object.defineProperty(global, 'location', {
    value: mockLocation,
    writable: true,
    configurable: true
  });

  return mockLocation;
}
