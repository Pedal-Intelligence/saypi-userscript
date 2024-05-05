process.env.GA_MEASUREMENT_ID = "mock-measurement-id";
process.env.GA_API_SECRET = "mock-api-secret";
process.env.GA_ENDPOINT = "https://www.google-analytics.com/mp/collect";

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
