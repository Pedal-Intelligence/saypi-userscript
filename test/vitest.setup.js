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
  DOMParser: { value: dom.window.DOMParser },
  SVGElement: { value: dom.window.SVGElement },
});

const mockStorage = (() => {
  let storage = {};

  return {
    get: (keys, callback) => {
      const result = {};
      keys.forEach((key) => {
        result[key] = storage[key];
      });
      callback(result);
    },
    set: (items, callback) => {
      storage = { ...storage, ...items };
      callback();
    },
    clear: () => {
      storage = {};
    },
  };
})();

global.chrome = {
  storage: {
    local: {
      get: vi.fn((keys, callback) => mockStorage.get(keys, callback)),
      set: vi.fn((items, callback) => mockStorage.set(items, callback)),
    },
  },
  runtime: {
    lastError: null,
  },
};

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
