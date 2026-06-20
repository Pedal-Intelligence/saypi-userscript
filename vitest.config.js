import { fileURLToPath } from "node:url";
import { defineConfig, configDefaults } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("./src", import.meta.url)),
      "~/": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "preact",
  },
  test: {
    include: ["**/*.spec.ts", "**/*.spec.tsx"],
    exclude: [...configDefaults.exclude, "e2e/**"],
    globals: true,
    setupFiles: ["test/vitest.setup.js"],
  },
  testTimeout: 10000,
});
