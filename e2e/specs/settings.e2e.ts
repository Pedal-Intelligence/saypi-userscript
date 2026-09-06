import { test, expect } from "../fixtures/extension";
import { MOCK_VOICE_CATALOG } from "../support/voice-catalog";

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

const TABS = ["general", "chat", "dictation", "voices", "about"] as const;

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

      // Voices is the one panel whose content comes over the network, so
      // "has children" was the weakest assertion on this page: the mock API
      // served no /voices route, the tab rendered its own empty state, and
      // that passed. It now serves a catalog, so this can ask the real
      // question — did the fetch land and did the rail draw the voices in it?
      // A broken catalog fetch, a rejected parse or a paint that throws all
      // leave the rail empty or short, and all of them are invisible to a
      // child count. (What the rail DOES — focus, the arming rule, the pitch
      // chart — is voices-rail.e2e.ts; this stays a bootstrap assertion.)
      if (tab === "voices") {
        await expect(panel.locator(".voice-rail")).toBeVisible();
        await expect(panel.locator(".voice-row")).toHaveCount(
          MOCK_VOICE_CATALOG.length,
        );
        await expect(panel.locator(".voice-studio-empty")).toHaveCount(0);
      }

      // The way back into first-run setup (#613). Its href is resolved at
      // runtime from browser.runtime.getURL, so only a real extension context
      // can prove it points at a page that exists — a unit test can assert the
      // wiring, not that `onboarding.html` shipped under this id.
      if (tab === "about") {
        const setupGuide = panel.locator("#about-setup-guide");
        await expect(setupGuide).toBeVisible();
        await expect(setupGuide).toHaveAttribute(
          "href",
          `chrome-extension://${extensionId}/onboarding.html`,
        );
      }
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
