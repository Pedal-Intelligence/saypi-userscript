import { test, expect } from "../fixtures/extension";

/**
 * #559 — a chat-ADJACENT host runs universal dictation, not chat.
 *
 * `hey.pi.ai` is where pi.ai bounces every logged-out visitor: a marketing
 * splash with no composer. The chat content script's match pattern is
 * `https://pi.ai/*`, which matches the host `pi.ai` and nothing else, so the
 * script that actually loads there is the *universal* one — and it used to take
 * the chat branch anyway, because the mode gate was derived from
 * `identifyChatbot()`, which collapses a hostname to its registrable domain.
 * Result: chat machinery booting with nothing to decorate, while
 * `UniversalDictationModule.isExcludedSite()` (literally `isInChatMode()`)
 * suppressed dictation. The user got neither feature.
 *
 * The unit specs pin the two booleans against a mocked location. This is the
 * only layer that can show the whole thing actually works: the real manifest
 * deciding which script injects, the real bundle booting, and a real dictation
 * button landing on a real field.
 *
 * `hey.pi.ai` is mapped at the DNS layer like every other host here
 * (`fixtures/launch-args.ts`), so the page is served on the genuine
 * `https://hey.pi.ai` origin and the manifest's match patterns are evaluated for
 * real — not against a localhost stand-in.
 */
test("hey.pi.ai gets universal dictation, not the chat call button", async ({
  context,
}) => {
  const page = await context.newPage();
  page.on("console", (msg) => {
    if (msg.type() === "error") console.log(`[page-error] ${msg.text()}`);
  });
  await page.goto("https://hey.pi.ai/", { waitUntil: "domcontentloaded" });

  // Positive signal FIRST. The dictation button is created hidden
  // (display:none until its field is focused), so wait on "attached", not the
  // default "visible". This is also what makes the negative assertion below
  // meaningful — on a page where the content script never ran, it would pass
  // instantly and prove nothing.
  await page.waitForSelector(".saypi-dictation-button", {
    state: "attached",
    timeout: 20_000,
  });

  // The regression: chat mode must NOT have booted here.
  await expect(page.locator("#saypi-callButton")).toHaveCount(0);
  await expect(page.locator(".saypi-prompt-container")).toHaveCount(0);

  // ...and the button is a working one, not just an orphan in the DOM: focusing
  // the field reveals it, which is the decorate -> focus -> show path users hit.
  await page.locator("#email").focus();
  await expect(page.locator(".saypi-dictation-button").first()).toBeVisible();
});
