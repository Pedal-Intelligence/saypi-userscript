import { test, expect } from "../fixtures/extension";

/**
 * Layer 3 guards for the SayPi call button on pi.ai, verified against the REAL
 * built extension CSS (.output/chrome-mv3-dev via --load-extension) — not an
 * injected rule. We navigate to the pi.ai mock host so Chrome injects the
 * extension's real content-script stylesheet, let SayPi decorate the page (it
 * creates #saypi-callButton and tags <body class="pi">), then assert computed
 * styles on the shipped button.
 */

/**
 * Bug: the prompt composer is ~16px taller with SayPi than native pi.ai.
 *
 * Root cause: Pi's getExtraCallButtonClasses() puts Tailwind `m-2` (0.5rem all
 * sides) on #saypi-callButton. On desktop the button is in-flow
 * (position:relative), so its 8px top+bottom margin makes it the tallest item in
 * Pi's `items-center` prompt-controls row and inflates the rounded box by 16px.
 * Pi's own submit button has margin 0. The fix neutralises the call button's
 * vertical margin (desktop + Pi scoped) so it matches the native button.
 *
 * This reproduces Pi's host environment — the `.m-2` utility pi.ai ships and the
 * `html.desktop-view` class SayPi sets on desktop — then reads the computed
 * vertical margin off the real shipped button. Before the fix it is 8px (the
 * bug); after, 0px. Horizontal spacing (margin-left) is preserved.
 */
test("Pi call button has no vertical margin, so it doesn't inflate the composer (real build)", async ({
  context,
}) => {
  const page = await context.newPage();
  await page.goto("https://pi.ai/talk", { waitUntil: "domcontentloaded" });

  // Wait for SayPi to decorate: body tagged `pi` and the call button injected.
  await page.waitForFunction(() => document.body.classList.contains("pi"), {
    timeout: 20_000,
  });
  await page.waitForSelector("#saypi-callButton", { timeout: 20_000 });

  const result = await page.evaluate(() => {
    // Reproduce Pi's host environment (NOT the extension's CSS, which is real):
    //  - desktop view: SayPi adds html.desktop-view on desktop, where the button
    //    is in-flow and its margin affects layout.
    //  - Pi's `m-2` utility (margin: 0.5rem) — Pi ships this; the e2e mock host
    //    doesn't, so define it to recreate the live margin the fix must beat.
    document.documentElement.classList.add("desktop-view");
    const hostUtil = document.createElement("style");
    hostUtil.textContent = ".m-2 { margin: 0.5rem; }";
    document.head.appendChild(hostUtil);

    const btn = document.getElementById("saypi-callButton");
    if (!btn) return null;
    const cs = getComputedStyle(btn);
    return {
      hasM2: btn.classList.contains("m-2"),
      marginTop: cs.marginTop,
      marginBottom: cs.marginBottom,
      marginLeft: cs.marginLeft,
    };
  });

  expect(result, "call button not found").not.toBeNull();
  // Sanity: the shipped button really carries Pi's m-2 utility (else the test
  // would trivially pass without exercising the cascade).
  expect(result!.hasM2, "call button should carry Pi's m-2 class").toBe(true);

  // The fix must zero the vertical margin so the button matches Pi's native
  // (margin-0) submit button and the composer keeps its native height.
  expect(
    result!.marginTop,
    `margin-top must be 0 (was ${result!.marginTop}); m-2's 8px inflates the composer`
  ).toBe("0px");
  expect(
    result!.marginBottom,
    `margin-bottom must be 0 (was ${result!.marginBottom}); m-2's 8px inflates the composer`
  ).toBe("0px");
});
