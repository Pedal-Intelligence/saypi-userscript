import { test, expect } from "../fixtures/extension";

// This spec also guards #292: the e2e build ships NO GA_* config
// (scripts/e2e-build.mjs), so a passing decoration here proves content-script
// bootstrap survives absent telemetry config (analytics fails soft, not fatal).
// If the SessionAnalyticsMachine module-load throw is ever reintroduced, the
// bootstrap aborts before decoration and this spec goes red.
// NOTE: this guard relies on SessionAnalyticsMachine being *eagerly* imported on
// the bootstrap path (CallButton → StateMachineService → SessionAnalyticsMachine).
// If that import ever becomes lazy/dynamic, a reintroduced throw could slip past
// this spec — the unit-level module-load test in test/SessionAnalytics.spec.ts is
// the backstop for that case.
test("SayPi detects Pi and decorates the mock page", async ({ context, extensionId }) => {
  expect(extensionId).toMatch(/^[a-p]{32}$/);
  const page = await context.newPage();
  await page.goto("https://pi.ai/talk", { waitUntil: "domcontentloaded" });

  // Primary proof: SayPi injected its call button into the decorated controls container.
  // The mock page mounts the prompt subtree post-load (mock-pi-page.html) so SayPi's
  // mutation-driven DOMObserver — which does no initial scan and decorates only nodes
  // ADDED after it attaches (spec fact #8) — witnesses the added node whose textarea
  // DESCENDANT matches Pi's prompt selector.
  await page.waitForSelector("#saypi-callButton", { timeout: 20_000 });
  await expect(page.locator("#saypi-prompt")).toHaveCount(1);
  await expect(page.locator(".saypi-prompt-container")).toHaveCount(1);
  await expect(page.locator("#saypi-prompt-controls-container")).toHaveCount(1);
  await page.waitForFunction(() => document.body.classList.contains("pi"));

  // Build-identity stamp (src/build-stamp.ts): the dev/e2e content script writes
  // <html data-saypi-build="<sha>@<branch> <iso>">. Asserting it here proves the
  // Vite `define` for __SAYPI_BUILD_STAMP__ actually replaced the token in a real
  // build (not the "dev" fallback) — durable CI coverage for the define, which no
  // unit test can exercise. "@" is present only on a fully-populated real stamp.
  const buildStamp = await page.evaluate(() => document.documentElement.dataset.saypiBuild);
  expect(buildStamp).toBeTruthy();
  expect(buildStamp).toMatch(/@/);
});
