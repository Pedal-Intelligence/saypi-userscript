import { test, expect } from "../fixtures/extension";

// Exercise the shipped HTML, fonts, localization and browser APIs together.
// The fixture uses only local mock hosts and a synthetic microphone.
test("welcome works offline with local artwork, quiet mode and the microphone test", async ({ context, extensionId, serviceWorker }, testInfo) => {
  const page = await context.newPage();
  const errors: string[] = [];
  const requests: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => requests.push(request.url()));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await context.setOffline(true);
  await page.goto(`chrome-extension://${extensionId}/onboarding.html`);
  await page.evaluate(() => document.fonts.ready);

  await expect(page.getByRole("heading", { name: "Welcome to Say, Pi", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Open Pi", exact: true })).toHaveAttribute("href", "https://pi.ai/talk");
  expect(await page.locator("img").evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0))).toBe(true);
  expect(await page.evaluate(() => document.fonts.check('600 48px Poppins'))).toBe(true);
  expect(requests.filter((url) => /^https?:/.test(url))).toEqual([]);
  await page.screenshot({ path: testInfo.outputPath("onboarding-desktop.png"), fullPage: true });

  await page.getByRole("radio", { name: "Around other people" }).check();
  await expect.poll(() => serviceWorker.evaluate(async () => (await chrome.storage.local.get("quietMode")).quietMode)).toBe(true);
  await expect(page.locator("#onboarding-env-status")).toContainText("Quiet mode on");
  await page.getByRole("radio", { name: "Somewhere private" }).check();
  await expect.poll(() => serviceWorker.evaluate(async () => (await chrome.storage.local.get("quietMode")).quietMode)).toBe(false);

  const meter = page.locator("#onboarding-mic-meter");
  await expect(meter).toBeHidden();
  await page.getByRole("button", { name: "Test your microphone", exact: true }).click();
  await expect(meter).toBeVisible();
  await expect(page.locator("#onboarding-mic-test-status")).toContainText("Listening");
  await page.getByRole("button", { name: "Stop test", exact: true }).click();
  await expect(meter).toBeHidden();
  await expect(page.getByRole("button", { name: "Test your microphone", exact: true })).toBeEnabled();

  await page.setViewportSize({ width: 360, height: 800 });
  await page.screenshot({ path: testInfo.outputPath("onboarding-narrow.png"), fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.keyboard.press("Tab");
  await page.getByRole("link", { name: "Open Pi", exact: true }).focus();
  expect(await page.getByRole("link", { name: "Open Pi", exact: true }).evaluate((el) => getComputedStyle(el).outlineStyle)).toBe("solid");
  expect(errors).toEqual([]);
});
