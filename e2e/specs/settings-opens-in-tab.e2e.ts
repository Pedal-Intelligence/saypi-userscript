import { test, expect } from "../fixtures/extension";

/**
 * Settings open as a full browser tab (the standard options-page pattern),
 * not a separate popup window.
 *
 * Every entry point funnels through the background's openSettingsPage():
 * the toolbar-icon click and the `openPopup` runtime message that
 * openSettings() (content scripts, e.g. the voice menus' "More voices…"
 * doors) sends. This spec drives the message path — the only one a test can
 * reach — and asserts tab-not-window, focus-dedupe, and the manifest's
 * options_ui registration.
 */

test.describe("settings tab flow", () => {
  test("openPopup message opens settings in a tab, dedupes, and options_ui is registered", async ({
    context,
    extensionId,
    serviceWorker,
  }) => {
    // Any extension page can send runtime messages to the background; the
    // permissions prompt page is a quiet one (no auto side effects).
    const trigger = await context.newPage();
    await trigger.goto(`chrome-extension://${extensionId}/permissions.html`);

    const settingsUrl = `chrome-extension://${extensionId}/settings.html`;
    await trigger.evaluate(() =>
      chrome.runtime.sendMessage({ action: "openPopup" }),
    );
    // Installation can open onboarding concurrently. Match the requested tab
    // instead of assuming the next page event belongs to this message.
    await expect.poll(() => context.pages().filter(page => page.url() === settingsUrl).length).toBe(1);
    const settingsPage = context.pages().find(page => page.url() === settingsUrl)!;

    // The page must live in a normal (tabbed) window — no popup-type window
    // may have been created anywhere in the browser.
    const windowTypes = await serviceWorker.evaluate(async () => {
      const wins = await chrome.windows.getAll({});
      return wins.map((w) => w.type);
    });
    expect(
      windowTypes.every((t) => t === "normal"),
      `expected only normal windows, got: ${windowTypes.join(", ")}`,
    ).toBe(true);

    // A second open request focuses the existing settings tab instead of
    // opening a duplicate.
    const pagesBefore = context.pages().length;
    await trigger.evaluate(() =>
      chrome.runtime.sendMessage({ action: "openPopup" }),
    );
    await trigger.waitForTimeout(500);
    expect(context.pages().length).toBe(pagesBefore);

    // The manifest registers settings.html as the options page, opened in a
    // tab — this lights up "Options" in the icon context menu and
    // chrome://extensions, and enables runtime.openOptionsPage().
    const optionsUi = await serviceWorker.evaluate(
      () => chrome.runtime.getManifest().options_ui,
    );
    expect(optionsUi?.page).toContain("settings.html");
    expect(optionsUi?.open_in_tab).toBe(true);

    await settingsPage.close();
    await trigger.close();
  });
});
