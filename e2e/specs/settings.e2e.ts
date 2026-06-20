import { test, expect } from "../fixtures/extension";

/**
 * Settings page renders end-to-end in a real (headless) browser with the
 * extension runtime live.
 *
 * Why this exists: the settings UI was migrated from imperative HTML strings to
 * Preact components (the `entrypoints/settings/**` tabs + header). Unit tests
 * (Layer 1-2) exercise the panels in isolation, but they can't catch a broken
 * *bootstrap* — e.g. the PR4f regression where the header relied on a CSS
 * utility that had been dropped, so it rendered but looked wrong, or a chunk/
 * import wiring break that leaves a panel empty. Those only surface when the
 * built extension actually loads `settings.html` and runs `index.ts`. This is
 * the cheapest layer that can prove the migrated page mounts and renders.
 *
 * This is the render/contract guard (CI-gated). Pixel-level appearance is
 * covered separately and on-demand by `settings.visual.ts` (not in the required
 * gate — see e2e/README.md).
 */

const TABS = ["general", "chat", "dictation", "about"] as const;

test.describe("settings page (Preact migration)", () => {
  test("bootstraps the header and every tab panel without uncaught errors", async ({
    context,
    extensionId,
    serviceWorker,
  }) => {
    // Seed an analytics-consent decision so the General tab renders in its
    // steady state (what returning users see) rather than the first-run consent
    // gate, whose full-width hero overlays the sidebar. `false` = declined,
    // the privacy-preserving default.
    await serviceWorker.evaluate(() =>
      chrome.storage.local.set({ shareData: false }),
    );

    const page = await context.newPage();

    // Uncaught exceptions ('pageerror') are the real "bootstrap broke" signal:
    // a Preact mount that throws, or a controller that crashes. Network 404s
    // (auth/status pings against the mock api) surface as console errors, not
    // pageerrors, so this stays robust in the hermetic env.
    const pageErrors: Error[] = [];
    page.on("pageerror", (err) => pageErrors.push(err));

    await page.goto(`chrome-extension://${extensionId}/settings.html`);

    // The header is a Preact mount (HeaderView). If the bootstrap ran, it has
    // rendered children.
    const header = page.locator("header.settings-header");
    await expect(header).toBeVisible();
    await expect(header.locator(":scope > *")).not.toHaveCount(0);

    // The default (general) tab is active and populated on load.
    const generalPanel = page.locator("#tab-general");
    await expect(generalPanel).toBeVisible();
    await expect(generalPanel.locator(":scope > *")).not.toHaveCount(0);

    // Every other tab lazy-loads its Preact panel on selection. Click through
    // each and assert it becomes visible with rendered content.
    for (const tab of TABS) {
      await page.locator(`.tab-button[data-tab="${tab}"]`).click();
      const panel = page.locator(`#tab-${tab}`);
      await expect(panel).toBeVisible();
      await expect(panel).not.toHaveClass(/\bhidden\b/);
      await expect(panel.locator(":scope > *")).not.toHaveCount(0);
    }

    expect(
      pageErrors,
      `uncaught errors during settings bootstrap:\n${pageErrors
        .map((e) => e.message)
        .join("\n")}`,
    ).toEqual([]);

    await page.close();
  });
});
