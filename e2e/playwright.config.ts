import { defineConfig } from "@playwright/test";
import { resolve } from "node:path";

export default defineConfig({
  testDir: resolve(import.meta.dirname, "specs"),
  testMatch: "**/*.e2e.ts",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 2 : 0,
  timeout: 60_000,
  globalSetup: resolve(import.meta.dirname, "support/global-setup.ts"),
  globalTeardown: resolve(import.meta.dirname, "support/global-teardown.ts"),
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: { trace: "on-first-retry" },
});
