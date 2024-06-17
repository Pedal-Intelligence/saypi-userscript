export default {
  test: {
    include: ["**/*.spec.ts"],
    globals: true,
    environment: "jsdom",
    setupFiles: ["test/vitest.setup.js"],
  },
  testTimeout: 10000,
};
