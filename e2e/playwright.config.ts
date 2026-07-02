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
  // CI adds an HTML report (playwright-report/) so the failure-artifact upload
  // in .github/workflows/e2e.yaml has a browsable report — with github+list
  // alone that directory was never written and the upload was empty (#463).
  reporter: process.env.CI
    ? [["github"], ["list"], ["html", { open: "never" }]]
    : "list",
  use: {
    // Failure evidence must exist on the FIRST attempt: retries are 0 locally,
    // so the old "on-first-retry" trace never fired and a local failure left
    // nothing diagnosable (#463). "retain-on-failure" records every attempt and
    // keeps the trace only when the attempt fails (final failure included);
    // passing runs discard it, keeping green-run overhead negligible.
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
});
