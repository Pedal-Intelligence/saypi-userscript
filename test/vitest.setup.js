// setup file for vitest - applied before testing *.spec.ts files
import { vi } from "vitest";
import { JSDOM } from "jsdom";

// JSDOM Setup
const dom = new JSDOM("<!DOCTYPE html>", {
  url: "http://localhost",
  pretendToBeVisual: true,
});

Object.defineProperties(global, {
  document: { value: dom.window.document },
  window: { value: dom.window },
  navigator: {
    value: {
      userAgent: "Mozilla/5.0",
      platform: "Win32",
      ...dom.window.navigator
    },
    writable: true,
    configurable: true
  },
  MutationObserver: { value: dom.window.MutationObserver },
  Node: { value: dom.window.Node },
  NodeList: { value: dom.window.NodeList },
  Element: { value: dom.window.Element },
  HTMLElement: { value: dom.window.HTMLElement },
  HTMLInputElement: { value: dom.window.HTMLInputElement },
  HTMLTextAreaElement: { value: dom.window.HTMLTextAreaElement },
  HTMLDivElement: { value: dom.window.HTMLDivElement },
  DOMParser: { value: dom.window.DOMParser },
  SVGElement: { value: dom.window.SVGElement },
  Event: { value: dom.window.Event },
  Blob: { value: dom.window.Blob },
  Audio: { value: dom.window.Audio || vi.fn() },
  FormData: { value: dom.window.FormData, writable: true, configurable: true },
});

// Ensure tests can override these globals when needed
Object.defineProperty(global, 'FormData', { value: dom.window.FormData, writable: true, configurable: true });

const mockStorage = (() => {
  let storage = {};

  return {
    get: (keys, callback) => {
      const result = {};
      // Ensure keys is always an array, as chrome.storage.get expects an array or object
      const keysArray = Array.isArray(keys) ? keys : (typeof keys === 'string' ? [keys] : Object.keys(keys || {}));
      keysArray.forEach((key) => {
        result[key] = storage[key];
      });
      if (typeof callback === 'function') {
        callback(result);
      }
      return Promise.resolve(result);
    },
    set: (items, callback) => {
      storage = { ...storage, ...items };
      if (typeof callback === 'function') {
        callback();
      }
      return Promise.resolve();
    },
    remove: (keysToRemove, callback) => {
      const keysArray = Array.isArray(keysToRemove) ? keysToRemove : [keysToRemove];
      keysArray.forEach(key => {
        delete storage[key];
      });
      if (typeof callback === 'function') {
        callback();
      }
      return Promise.resolve();
    },
    clear: (callback) => {
      storage = {};
      if (typeof callback === 'function') {
        callback();
      }
      return Promise.resolve();
    },
    // Helper to inspect or preload storage for tests
    _getState: () => storage,
    _setState: (newState) => { storage = newState; }
  };
})();

const chromeMock = {
  storage: {
    local: {
      get: vi.fn((keys, callback) => mockStorage.get(keys, callback)),
      set: vi.fn((items, callback) => mockStorage.set(items, callback)),
      remove: vi.fn((keys, callback) => mockStorage.remove(keys, callback)),
      clear: vi.fn((callback) => mockStorage.clear(callback)),
      // Expose test helpers
      _getState: () => mockStorage._getState(),
      _setState: (newState) => mockStorage._setState(newState),
      _reset: () => mockStorage.clear()
    },
    sync: { // Add sync mock
      get: vi.fn((keys, callback) => mockStorage.get(keys, callback)),
      set: vi.fn((items, callback) => mockStorage.set(items, callback)),
      remove: vi.fn((keys, callback) => mockStorage.remove(keys, callback)),
      clear: vi.fn((callback) => mockStorage.clear(callback)),
    },
    onChanged: { // Mock onChanged as well if needed for listener tests
      addListener: vi.fn(),
      removeListener: vi.fn(),
      hasListener: vi.fn(),
    }
  },
  runtime: {
    lastError: null, // You can set this in tests to simulate errors
    onMessage: {
      addListener: vi.fn(),
      removeListener: vi.fn(),
      hasListener: vi.fn(),
    },
    sendMessage: vi.fn(),
    getURL: vi.fn(path => `chrome-extension://mockextensionid/${path}`), // Mock getURL
    getManifest: vi.fn(() => ({ manifest_version: 3, name: "Test Extension", version: "1.0" })), // Mock getManifest
  },
  tabs: {
    query: vi.fn((queryInfo, callback) => {
      const mockTabs = [{ id: 123, active: true, currentWindow: true }];
      if (callback) callback(mockTabs);
      return Promise.resolve(mockTabs);
    }),
    sendMessage: vi.fn((tabId, message, callback) => {
      if (callback) callback({ success: true });
      return Promise.resolve({ success: true });
    })
  },
  // Mock other chrome APIs if UserPreferenceModule or its dependencies use them directly
  // For example, if i18n is used directly:
  i18n: {
    getMessage: vi.fn((messageName, substitutions) => {
      const messages = {
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
      let message = messages[messageName] || messageName;
      if (substitutions && substitutions.length > 0) {
        message = message.replace('{{nickname}}', substitutions[0]);
      }
      return message;
    })
  }
};

global.chrome = chromeMock;

// Mock wxt/browser to return the same chrome mock
vi.mock('wxt/browser', () => ({
  browser: chromeMock
}));

// Mock SVG imports because webpack rawloader is not available in the test environment
vi.mock("../src/icons/copy.svg", () => ({
  default: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>'
}));

vi.mock("../src/icons/copied.svg", () => ({
  default: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>'
}));

vi.mock("../src/icons/volume-mid.svg", () => ({
  default: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>'
}));

vi.mock("../src/icons/regenerate.svg", () => ({
  default: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/></svg>'
}));

// Add mocks for theme icons
vi.mock("../src/icons/mode-night.svg", () => ({
  default: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7z"/></svg>'
}));

vi.mock("../src/icons/mode-day.svg", () => ({
  default: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zm-2 5.79V18h-3.52L12 20.48 9.52 18H6v-3.52L3.52 12 6 9.52V6h3.52L12 3.52 14.48 6H18v3.52L20.48 12 18 14.48z"/></svg>'
}));

vi.mock("../src/icons/rectangles.svg", () => ({
  default: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="2" ry="2"/></svg>'
}));

vi.mock("../src/icons/rectangles-moonlight.svg", () => ({
  default: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="2" ry="2"/></svg>'
}));

vi.mock("../src/icons/exit.svg", () => ({
  default: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm9 4-1.41 1.41L14.17 10H8v4h6.17l-1.58 1.59L14 17l4-4-4-4z"/></svg>'
}));

vi.mock("../src/icons/stopwatch.svg", () => ({
  default: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 2c5.519 0 10 4.481 10 10s-4.481 10-10 10-10-4.481-10-10 4.481-10 10-10zm1 5v5h4v2h-6v-7h2z"/></svg>'
}));
