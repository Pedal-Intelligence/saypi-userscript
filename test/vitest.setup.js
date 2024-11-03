// setup file for vitest - applied before testing *.spec.ts files
import { vi } from "vitest";
import { JSDOM } from 'jsdom';

// JSDOM Setup
const dom = new JSDOM('<!DOCTYPE html>', {
  url: 'http://localhost',
  pretendToBeVisual: true
});

Object.defineProperties(global, {
  document: { value: dom.window.document },
  window: { value: dom.window },
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
