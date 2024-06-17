import { TextEncoder, TextDecoder } from "util";

// Mock environment variables
process.env.GA_MEASUREMENT_ID = "mock-measurement-id";
process.env.GA_API_SECRET = "mock-api-secret";
process.env.GA_ENDPOINT = "https://www.google-analytics.com/mp/collect";

// text-encoding is not supported in JSDOM, so we need to polyfill it
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock `chrome` APIs for Jest
if (typeof chrome === "undefined") {
  const storage = {};
  global.chrome = {
    storage: {
      sync: {
        get: (keys, callback) => {
          // Mock implementation with in-memory storage
          return storage[keys];
        },
        set: (items, callback) => {
          // Mock implementation with in-memory storage
          storage = { ...storage, ...items };
          return callback();
        },
      },
    },
    runtime: {
      onMessage: {
        addListener: () => {},
      },
    },
  };
}
