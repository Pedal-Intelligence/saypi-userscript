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
    // `.worktrees/**`: sibling agents work in git worktrees under there (AGENTS.md),
    // and without this a run from the shared checkout collects THEIR specs and
    // reports their failures as yours (#566).
    exclude: [...configDefaults.exclude, "e2e/**", ".worktrees/**"],
    globals: true,
    setupFiles: ["test/vitest.setup.js"],
  },
  testTimeout: 10000,
});
