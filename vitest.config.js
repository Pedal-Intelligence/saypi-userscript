export default {
  test: {
    include: ["**/*.spec.ts"],
    globals: true,
    setupFiles: ["test/vitest.setup.js"],
  },
  testTimeout: 10000,
};
