import { defineConfig } from "@playwright/test";
import base from "./playwright.config";

/**
 * On-demand visual-regression config for the settings page.
 *
 * Deliberately a SEPARATE config from the default e2e run: it matches only
 * `**\/*.visual.ts`, so `npm run test:e2e` (the required CI gate, which matches
 * `**\/*.e2e.ts`) never runs it. Pixel baselines are inherently
 * platform-specific — Playwright names them `-<platform>` — so this is a local
 * pre-flight tool run on the developer's machine against committed baselines,
 * NOT a cross-platform CI check. See e2e/README.md.
 *
 * Inherits the base globalSetup/teardown (the mock servers + port env vars the
 * extension fixture reads) so the harness is identical to the rest of Layer 3.
 */
export default defineConfig({
  ...base,
  testMatch: "**/*.visual.ts",
});
