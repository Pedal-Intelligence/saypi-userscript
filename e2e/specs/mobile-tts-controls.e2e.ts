import { test, expect } from "../fixtures/extension";

/**
 * Layer 3 guard for #94 — SayPi's per-message TTS controls must be reachable at a
 * phone viewport, verified against the REAL built extension CSS
 * (.output/chrome-mv3-dev via --load-extension).
 *
 * #94 was filed in 2024 against a popup menu that no longer exists: `mobile.scss`
 * hid `.saypi-tts-controls` outright with the justification "on mobile, speech
 * controls are in a popup menu instead". The emitter for that menu
 * (`watchForPopupMenu`) was removed in #427 and the `PopupMenu` class itself in
 * #428, so the rule stopped relocating the controls and simply deleted them on
 * mobile — the user's original complaint ("I can't reach Read Aloud on my phone")
 * made worse, not fixed.
 *
 * This spec pins the fixed state at the only layer that can see it: the cascade of
 * the shipped stylesheet, plus real layout and hit-testing. jsdom applies none of
 * the built CSS and has no layout, so a unit test could not tell `display: none`
 * from a control that renders but sits off the right edge of a 390px screen —
 * which is the literal title of #94.
 *
 * What it asserts, at a 390×844 (iPhone-class) viewport with `html.mobile-device`:
 *  1. the controls container renders (not `display: none`);
 *  2. every injected control is fully inside the viewport horizontally;
 *  3. every control is the actual hit-test target at its own centre (nothing
 *     overlays it), at a tap size no smaller than pi.ai's own 32px action buttons;
 *  4. the page does not scroll horizontally because of them.
 *
 * The action bar is populated with eight native-sized (32px) sibling buttons —
 * 256px of host chrome that a 390px row cannot hold alongside SayPi's ~195px of
 * controls — so assertions 2 and 4 exercise the overflow case rather than a
 * comfortably-empty bar. Without the mobile `flex-wrap: wrap` guard the controls
 * run off the right edge here, which is the symptom #94 was actually filed for.
 */

const PHONE = { width: 390, height: 844 };

/**
 * Minimum tap target: 24 CSS px, WCAG 2.2 SC 2.5.8 "Target Size (Minimum)", AA.
 * Measured on the shipped stylesheet at this viewport: generate-speech 36×31,
 * pricing link 32×24, telemetry 32×32, cost readout 24 tall. (The generate-speech
 * button's 31px height is not mobile-specific — it is the same on desktop, one
 * pixel under pi.ai's own 32px action buttons — so it is left alone here rather
 * than restyled through a mobile fix.)
 */
const MIN_TAP_PX = 24;

test("per-message TTS controls are visible and tappable at a phone viewport (real build)", async ({
  context,
}) => {
  const page = await context.newPage();
  await page.setViewportSize(PHONE);
  await page.goto("https://pi.ai/talk", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.body.classList.contains("pi"), {
    timeout: 20_000,
  });

  await page.evaluate(() => {
    // Two root flags the shipped CSS keys on, neither of which a headless desktop
    // Chrome sets for itself:
    //  - `mobile-device` — UserAgentModule.addDeviceFlags() adds it on a phone; it
    //    is what scopes the rules under test.
    //  - `desktop-view` — ImmersionService's *standard* (non-immersive) view, which
    //    a phone also gets. It matters because desktop.scss loads messages.scss
    //    inside `html.desktop-view`, and messages.scss is where the controls get
    //    their layout. Without it the container would be unstyled and this spec
    //    would pass for the wrong reason.
    document.documentElement.classList.add("mobile-device", "desktop-view");
    // pi.ai's theme variables (the mock host doesn't ship them).
    document.documentElement.style.setProperty("--color-text-secondary", "#655E55");
    document.body.style.margin = "0";

    // The subtree PiMessageControls actually builds on a decorated message:
    // AssistantResponse tags the message `chat-message assistant-message`, the
    // action bar gets `message-action-bar`, and SayPi appends its own
    // `.saypi-tts-controls` div holding the generate-speech button, the cost
    // readout (cost + pricing link) and the telemetry button.
    const message = document.createElement("div");
    message.className = "chat-message assistant-message";

    const bar = document.createElement("div");
    bar.className = "message-action-bar";

    // pi.ai's own action buttons (Copy / 👍 / 👎 / …) are `size-8` = 32px and do
    // not shrink. Eight of them (256px) plus SayPi's controls (~195px) cannot fit
    // a 390px row, so the bar MUST wrap for our controls to stay on screen.
    for (let i = 0; i < 8; i++) {
      const native = document.createElement("button");
      native.className = "pi-native-action";
      native.style.cssText = "width:32px;height:32px;flex:none";
      bar.appendChild(native);
    }

    const controls = document.createElement("div");
    controls.className = "saypi-tts-controls pt-4 text-neutral-500 text-sm";

    const regenerate = document.createElement("button");
    regenerate.type = "button";
    regenerate.className =
      "text-center saypi-button tooltip tts-item saypi-regenerate-button";
    regenerate.setAttribute("aria-label", "Read this message aloud");
    regenerate.innerHTML =
      '<svg viewBox="0 0 24 24"><path d="M4 4h16v16H4z"></path></svg>';
    controls.appendChild(regenerate);

    const costContainer = document.createElement("div");
    costContainer.className = "saypi-cost-container tts-item";
    const cost = document.createElement("span");
    cost.className = "saypi-cost tooltip tooltip-wide";
    const separator = document.createElement("div");
    separator.className = "vertical-separator";
    const price = document.createElement("span");
    price.className = "price";
    price.innerHTML =
      '<span class="value">120</span><span class="currency-label"> credits</span>';
    cost.appendChild(separator);
    cost.appendChild(price);
    const pricingLink = document.createElement("a");
    pricingLink.className = "saypi-pricing-link tooltip tts-item";
    pricingLink.href = "https://www.saypi.ai/pricing";
    pricingLink.appendChild(document.createElement("img"));
    costContainer.appendChild(cost);
    costContainer.appendChild(pricingLink);
    controls.appendChild(costContainer);

    const telemetry = document.createElement("button");
    telemetry.className = "saypi-telemetry-button";
    telemetry.innerHTML =
      '<svg viewBox="0 0 768 768"><path d="M384 96 L384 384"></path></svg>';
    controls.appendChild(telemetry);

    bar.appendChild(controls);
    message.appendChild(bar);
    document.body.insertBefore(message, document.body.firstChild);
  });

  // 1. The controls render at all.
  const controls = page.locator(".saypi-tts-controls");
  await expect(
    controls,
    "SayPi's per-message TTS controls must not be hidden on mobile (#94)"
  ).toBeVisible();

  // 2–3. Every control is on-screen, big enough to tap, and is itself the
  // hit-test target at its own centre (i.e. nothing is overlaying it).
  const probe = await page.evaluate(
    ({ minTap }) => {
      const selectors = [
        ".saypi-regenerate-button",
        ".saypi-cost-container",
        ".saypi-pricing-link",
        ".saypi-telemetry-button",
      ];
      return {
        viewportWidth: window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        controls: selectors.map((selector) => {
          const el = document.querySelector(selector) as HTMLElement;
          const rect = el.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const hit = document.elementFromPoint(cx, cy);
          return {
            selector,
            display: getComputedStyle(el).display,
            left: rect.left,
            right: rect.right,
            width: rect.width,
            height: rect.height,
            // The regenerate/telemetry buttons wrap an <svg>, so the hit-test can
            // legitimately land on a descendant; the pricing link wraps an <img>.
            hitsSelf: !!hit && (hit === el || el.contains(hit)),
            tappable: rect.width >= minTap && rect.height >= minTap,
          };
        }),
      };
    },
    { minTap: MIN_TAP_PX }
  );

  for (const control of probe.controls) {
    expect(
      control.display,
      `${control.selector} must not be display:none on mobile`
    ).not.toBe("none");
    expect(
      control.left,
      `${control.selector} must not sit off the left edge (left=${control.left})`
    ).toBeGreaterThanOrEqual(0);
    expect(
      control.right,
      `${control.selector} must not overflow the ${probe.viewportWidth}px screen (right=${control.right})`
    ).toBeLessThanOrEqual(probe.viewportWidth);
    expect(
      control.hitsSelf,
      `${control.selector} must be the hit-test target at its own centre (nothing overlaying it)`
    ).toBe(true);
    expect(
      control.tappable,
      `${control.selector} must meet the WCAG 2.2 AA ${MIN_TAP_PX}px minimum target size (was ${control.width}×${control.height})`
    ).toBe(true);
  }

  // 4. Restoring the controls must not give the page a horizontal scrollbar.
  expect(
    probe.scrollWidth,
    `the action bar must not push the page wider than the ${probe.viewportWidth}px screen`
  ).toBeLessThanOrEqual(probe.viewportWidth);
});
