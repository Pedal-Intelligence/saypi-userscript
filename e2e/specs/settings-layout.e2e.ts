import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Page } from "@playwright/test";
import { test, expect } from "../fixtures/extension";

/**
 * Settings page layout stability across tab switches.
 *
 * Only some panes are tall enough to scroll the document (on the real page,
 * the Voices studio). When scrollbars take layout space — macOS with a mouse
 * connected, Windows/Linux defaults — switching to such a pane pops the
 * scrollbar in, shrinks the viewport, and re-centers the header and container
 * ~7px left: a visible shunt on every tab switch (confirmed on real Chrome via
 * a Layer-4 CDP probe; overlay-scrollbar environments hide it).
 *
 * Headless needs two nudges to lay out real scrollbars: drop Playwright's
 * default --hide-scrollbars (the showScrollbars fixture option), and style
 * ::-webkit-scrollbar (custom-styled scrollbars are never overlay).
 */

const TABS = ["general", "chat", "dictation", "voices", "about"] as const;

/** Phone width, the last mobile width, and the first desktop width. 736px is
 *  where the header is tightest: the mobile rules stop hiding the
 *  unauthenticated blurb, but there is no spare room yet. */
const WIDTHS = [390, 735, 736] as const;

test.use({ showScrollbars: true });

/**
 * Walk every tab at every small viewport and require no horizontal overflow.
 * `label` names the locale under test so a failure says which language broke.
 */
async function expectNoOverflowAtSmallViewports(page: Page, label: string) {
  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: 844 });
    for (const tab of TABS) {
      await page.locator(`.tab-button[data-tab="${tab}"]`).click();
      const panel = page.locator(`#tab-${tab}`);
      await expect(panel).toBeVisible();
      const overflow = await page.evaluate(
        () => document.body.scrollWidth - document.documentElement.clientWidth,
      );
      expect(
        overflow,
        `horizontal overflow of ${overflow}px on ${tab} at ${width}px in ${label}`,
      ).toBeLessThanOrEqual(0);
    }
  }
}

test.describe("settings page layout", () => {
  test("keeps the header anchored across tab switches (no scrollbar shunt)", async ({
    context,
    extensionId,
    serviceWorker,
  }) => {
    // Seed a consent decision so the General tab renders its steady state.
    await serviceWorker.evaluate(() =>
      chrome.storage.local.set({ shareData: false }),
    );

    const page = await context.newPage();
    await page.goto(`chrome-extension://${extensionId}/settings.html`);
    await page.addStyleTag({ content: "::-webkit-scrollbar { width: 15px; }" });

    const banner = page.locator(".settings-header .profile-banner");
    await expect(banner).toBeVisible();
    // Track the sidebar too: the 2026-07-30 shunt was the shrink-to-fit
    // container re-centering (sidebar moved, banner did not), so asserting the
    // banner alone misses half the failure modes.
    const chip = page.locator('.tab-button[data-tab="general"]');

    const positions: Record<string, string> = {};
    let sawScrollingTab = false;
    for (const tab of TABS) {
      await page.locator(`.tab-button[data-tab="${tab}"]`).click();
      const panel = page.locator(`#tab-${tab}`);
      await expect(panel).toBeVisible();
      await expect(panel.locator(":scope > *")).not.toHaveCount(0);
      positions[tab] = `banner:${(await banner.boundingBox())!.x},sidebar:${
        (await chip.boundingBox())!.x
      }`;
      const overflows = await page.evaluate(
        () =>
          document.documentElement.scrollHeight >
          document.documentElement.clientHeight,
      );
      sawScrollingTab ||= overflows;
    }

    // Guard the guard: if no tab overflows, the scrollbar scenario silently
    // stopped being exercised (e.g. the hermetic panes all got short) and this
    // test proves nothing — fail loudly instead.
    expect(
      sawScrollingTab,
      "no settings tab overflows the viewport — shrink the window or this test is vacuous",
    ).toBe(true);

    const xs = Object.values(positions);
    expect(
      positions,
      `header banner shifted horizontally between tabs: ${JSON.stringify(positions)}`,
    ).toEqual(Object.fromEntries(TABS.map((t) => [t, xs[0]])));

    await page.close();
  });

  test("fits small viewports without horizontal overflow", async ({
    context,
    extensionId,
    serviceWorker,
  }) => {
    // The popup-era 736px min-width on html/body forced horizontal scrolling
    // in any narrower tab and kept the ≤735px mobile layout permanently dead.
    // Now the mobile layout (icon-row sidebar, full-width cards) must engage
    // instead: every tab at phone width, and the boundary widths, render with
    // no horizontal overflow.
    await serviceWorker.evaluate(() =>
      chrome.storage.local.set({ shareData: false }),
    );
    const page = await context.newPage();
    await page.goto(`chrome-extension://${extensionId}/settings.html`);
    await page.waitForSelector(".settings-header .profile-banner");

    await expectNoOverflowAtSmallViewports(page, "en");

    await page.close();
  });
});

/**
 * The same fit guarantee, in a language whose strings are much longer than
 * English.
 *
 * English fit at 736px with ~100px to spare, so the guard above stayed green
 * while German overflowed by 156px, Greek by 160px, Tamil by 78px and Finnish
 * by 69px — on every tab, because the offender is the shared header. The
 * mechanism was the header's identity group defaulting to `min-width: auto`,
 * which floored the row at the unwrapped width of the "log in to access..."
 * blurb; see the `.profile-identity` rule in src/popup/tabs.css.
 *
 * `--lang` does not change the extension's language, and neither does the
 * browser UI locale in a headless run: chrome.i18n picks the catalog at load
 * time. So swap the *built* English catalog for the locale under test, then
 * prove the swap took by reading a translated string off the page — a silent
 * fallback to English is exactly what would make this test lie.
 */
const BUILT_EN = resolve(
  import.meta.dirname,
  "../../.output/chrome-mv3-dev/_locales/en/messages.json",
);
const catalogPath = (locale: string) =>
  resolve(import.meta.dirname, `../../_locales/${locale}/messages.json`);

// de and el are the two worst offenders measured; between them they cover a
// long-compound language and a non-Latin script.
for (const locale of ["de", "el"] as const) {
  test.describe(`settings page layout (${locale} catalog)`, () => {
    // beforeAll runs before the test-scoped `context` fixture launches the
    // browser, so the extension is loaded with the swapped catalog already in
    // place. Nothing races it: this project runs e2e with workers: 1.
    test.beforeAll(() => {
      writeFileSync(BUILT_EN, readFileSync(catalogPath(locale)));
    });

    // Restore from the source catalog, not from a snapshot taken here: the
    // build copies _locales verbatim, so this is exact and cannot bake in a
    // stale swap left behind by an interrupted run.
    test.afterAll(() => {
      writeFileSync(BUILT_EN, readFileSync(catalogPath("en")));
    });

    test("fits small viewports without horizontal overflow", async ({
      context,
      extensionId,
      serviceWorker,
    }) => {
      await serviceWorker.evaluate(() =>
        chrome.storage.local.set({ shareData: false }),
      );
      const page = await context.newPage();
      await page.goto(`chrome-extension://${extensionId}/settings.html`);
      await page.waitForSelector(".settings-header .profile-banner");

      const expected = JSON.parse(readFileSync(catalogPath(locale), "utf8"))
        .signIn.message as string;
      await expect(
        page.locator("#auth-button"),
        `the ${locale} catalog did not take — the page is still English, so this test would prove nothing`,
      ).toHaveText(expected);

      await expectNoOverflowAtSmallViewports(page, locale);

      await page.close();
    });
  });
}
