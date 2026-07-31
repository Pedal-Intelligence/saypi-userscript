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

test.use({ showScrollbars: true });

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

    for (const width of [390, 735, 736]) {
      await page.setViewportSize({ width, height: 844 });
      for (const tab of TABS) {
        await page.locator(`.tab-button[data-tab="${tab}"]`).click();
        const panel = page.locator(`#tab-${tab}`);
        await expect(panel).toBeVisible();
        const overflow = await page.evaluate(
          () =>
            document.body.scrollWidth - document.documentElement.clientWidth,
        );
        expect(
          overflow,
          `horizontal overflow of ${overflow}px on ${tab} at ${width}px`,
        ).toBeLessThanOrEqual(0);
      }
    }

    await page.close();
  });
});
