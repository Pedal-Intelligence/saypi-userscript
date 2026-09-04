import { test, expect } from "../fixtures/extension";
import { MOCK_VOICE_IDS } from "../support/voice-catalog";

/**
 * The real content script on the hermetic Pi settings route: stored voice →
 * readable notice → catalog action / native selection → real storage write.
 * Pi's native card handler owns its selection separately in localStorage.
 * No extension modules or DOM hooks are injected by this test.
 */
test.describe("Pi voice settings return path", () => {
  for (const theme of ["light", "dark"] as const) {
    test(`shows the current voice and returns to Pi in ${theme} mode`, async ({
      context, serviceWorker, extensionId,
    }, testInfo) => {
      await serviceWorker.evaluate(async (ids) => {
        await chrome.storage.local.set({
          prefs_migration_completed: true,
          shareData: false,
          saypi_voice_default_pending_hosts: [],
          voicePreferences: { pi: ids.onyx, claude: ids.alloy },
        });
      }, MOCK_VOICE_IDS);

      const page = await context.newPage();
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(`https://pi.ai/profile/settings?theme=${theme}`);
      const notice = page.locator(".saypi-voice-override-notice");
      await expect(notice).toContainText("Onyx", { timeout: 20_000 });
      await expect(notice).toContainText("Choose a Pi voice below to switch back.");
      const change = notice.getByRole("button", { name: "Change voice" });
      await expect(change).toBeVisible();

      // Read actual computed styles from the extension's built CSS plus Pi's
      // host-theme utility. A missing foreground on dark Pi used to be black.
      const contrast = await notice.evaluate((element) => {
        const color = getComputedStyle(element).color;
        const background = getComputedStyle(document.body).backgroundColor;
        const luminance = (css: string) => {
          const rgb = css.match(/[\d.]+/g)!.slice(0, 3).map(Number);
          const linear = rgb.map((value) => {
            const s = value / 255;
            return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
          });
          return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
        };
        const foregroundL = luminance(color);
        const backgroundL = luminance(background);
        return {
          background,
          ratio: (Math.max(foregroundL, backgroundL) + 0.05) /
            (Math.min(foregroundL, backgroundL) + 0.05),
          opacity: getComputedStyle(element).opacity,
          actionColor: getComputedStyle(element.querySelector("button")!).color,
          color,
        };
      });
      expect(contrast.background).toBe(theme === "dark" ? "rgb(18, 18, 18)" : "rgb(245, 243, 236)");
      expect(contrast.ratio).toBeGreaterThanOrEqual(4.5);
      expect(contrast.opacity).toBe("1");
      expect(contrast.actionColor).toBe(contrast.color);
      const screenshotPath = testInfo.outputPath(`pi-voice-settings-${theme}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      await testInfo.attach(`Pi voice settings — ${theme}`, {
        path: screenshotPath,
        contentType: "image/png",
      });

      // Exercise the real content → background navigation action. Inspect only
      // the new candidate tab's URL; this spec stays on the mock Pi host page.
      const catalogOpened = context.waitForEvent("page");
      await change.click();
      const catalog = await catalogOpened;
      await catalog.waitForURL(`chrome-extension://${extensionId}/settings.html`);
      await expect.poll(() => serviceWorker.evaluate(async () =>
        (await chrome.storage.local.get("voicePreferences")).voicePreferences,
      )).toEqual({ pi: MOCK_VOICE_IDS.onyx, claude: MOCK_VOICE_IDS.alloy });
      await catalog.close();

      const native = page.getByRole("button", { name: "Pi 2", exact: true });
      await native.click();
      await expect(native).toHaveAttribute("aria-pressed", "true");
      await expect.poll(() => page.evaluate(() => localStorage.getItem("mock-pi-native-voice"))).toBe("voice2");
      await expect.poll(() => serviceWorker.evaluate(async () =>
        (await chrome.storage.local.get("voicePreferences")).voicePreferences,
      )).toEqual({ claude: MOCK_VOICE_IDS.alloy });
      await expect(notice).toHaveCount(0);

      // Returning to the page must retain Pi's native choice, with no automatic
      // restoration of SayPi's override and the catalog door still available.
      await page.reload();
      await expect(page.locator("#saypi-voice-settings .saypi-more-voices")).toBeVisible();
      await expect(page.getByRole("button", { name: "Pi 2", exact: true })).toHaveAttribute("aria-pressed", "true");
      await expect(notice).toHaveCount(0);
      expect(errors).toEqual([]);
    });
  }

  test("a stored native Pi voice is not presented as a SayPi override", async ({ context, serviceWorker }) => {
    await serviceWorker.evaluate(() => chrome.storage.local.set({
      prefs_migration_completed: true,
      shareData: false,
      saypi_voice_default_pending_hosts: [],
      voicePreferences: { pi: "voice4" },
    }));
    const page = await context.newPage();
    await page.goto("https://pi.ai/profile/settings?theme=dark");
    await expect(page.locator("#saypi-voice-settings .saypi-more-voices")).toBeVisible({ timeout: 20_000 });
    // First observe an actual resolved remote voice, then replace it with the
    // native id through real storage. Waiting for the notice to disappear now
    // proves the provider classification ran; merely checking its absence
    // immediately after the door paints could beat the initial storage read.
    const notice = page.locator(".saypi-voice-override-notice");
    await serviceWorker.evaluate((id) => chrome.storage.local.set({ voicePreferences: { pi: id } }), MOCK_VOICE_IDS.onyx);
    await expect(notice).toContainText("Onyx");
    await serviceWorker.evaluate(() => chrome.storage.local.set({ voicePreferences: { pi: "voice4" } }));
    await expect(notice).toHaveCount(0);
    // The native return is a write through the live content-script preference
    // module even when an older native id is stored (no remote override).
    await page.getByRole("button", { name: "Pi 3", exact: true }).click();
    await expect.poll(() => serviceWorker.evaluate(async () =>
      (await chrome.storage.local.get("voicePreferences")).voicePreferences,
    )).toEqual({});
    await expect(notice).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Pi 3", exact: true })).toHaveAttribute("aria-pressed", "true");
  });

  test("an unresolved saved voice stays visible and can be relinquished", async ({ context, serviceWorker }) => {
    await serviceWorker.evaluate(() => chrome.storage.local.set({
      prefs_migration_completed: true,
      shareData: false,
      saypi_voice_default_pending_hosts: [],
      voicePreferences: { pi: "e2e-unavailable" },
    }));
    const page = await context.newPage();
    await page.goto("https://pi.ai/profile/settings?theme=dark");
    const notice = page.locator(".saypi-voice-override-notice");
    await expect(notice).toContainText("Your saved voice is unavailable right now.", { timeout: 20_000 });
    await expect(notice).not.toContainText("is speaking");
    await expect(notice.getByRole("button", { name: "Change voice" })).toBeVisible();
    await expect.poll(() => serviceWorker.evaluate(async () =>
      (await chrome.storage.local.get("voicePreferences")).voicePreferences,
    )).toEqual({ pi: "e2e-unavailable" });
    await page.getByRole("button", { name: "Pi 2", exact: true }).click();
    await expect.poll(() => serviceWorker.evaluate(async () =>
      (await chrome.storage.local.get("voicePreferences")).voicePreferences,
    )).toEqual({});
    await expect(notice).toHaveCount(0);
  });
});
