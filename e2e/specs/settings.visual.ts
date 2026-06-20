import { test, expect } from "../fixtures/extension";

/**
 * Visual-regression baselines for the Preact-migrated settings page.
 *
 * On-demand (NOT in the required CI gate — see playwright.visual.config.ts):
 *   npm run test:e2e:visual           # compare against committed baselines
 *   npm run test:e2e:visual:update    # regenerate baselines after an intended UI change
 *
 * Baselines are platform-specific (committed under
 * `settings.visual.ts-snapshots/`). Genuinely dynamic, network-/auth-driven
 * regions are masked so the diff reflects layout/styling, not live data.
 */

const TABS = ["general", "chat", "dictation", "about"] as const;

test.describe("settings page visual baselines", () => {
  test.beforeEach(async ({ serviceWorker }) => {
    // Steady state (consent already decided) — see settings.e2e.ts.
    await serviceWorker.evaluate(() =>
      chrome.storage.local.set({ shareData: false }),
    );
  });

  for (const tab of TABS) {
    test(`tab: ${tab}`, async ({ context, extensionId }) => {
      const page = await context.newPage();
      await page.goto(`chrome-extension://${extensionId}/settings.html`);

      // Wait for the Preact bootstrap (header + selected panel populated).
      await page.locator("header.settings-header > *").first().waitFor();
      await page.locator(`.tab-button[data-tab="${tab}"]`).click();
      const panel = page.locator(`#tab-${tab}`);
      await expect(panel).toBeVisible();
      await expect(panel.locator(":scope > *").first()).toBeVisible();

      await expect(page).toHaveScreenshot(`settings-${tab}.png`, {
        fullPage: true,
        animations: "disabled",
        // Layout/styling diff only — not live, environment-dependent data.
        mask: [
          page.locator("#profile"), // auth / profile status
          page.locator("#premium-status"), // TTS/STT quota + premium tier (network)
          page.locator("#application-status"), // status-service ping (network)
        ],
        maxDiffPixelRatio: 0.01,
      });

      await page.close();
    });
  }
});
