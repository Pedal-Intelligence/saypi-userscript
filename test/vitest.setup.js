// setup file for vitest - applied before testing *.spec.ts files
import { vi } from "vitest";

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
