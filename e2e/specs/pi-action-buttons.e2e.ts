import { test, expect } from "../fixtures/extension";

/**
 * Layer 3 guards for SayPi's message-action buttons on pi.ai, verified against
 * the REAL built extension CSS (.output/chrome-mv3-dev via --load-extension).
 *
 * pi.ai now ships its own native "Copy message" button, so SayPi's copy button
 * is redundant and must be hidden; and SayPi's remaining action button
 * (telemetry) must be visually seamless with pi.ai's native action-bar buttons
 * (Copy / 👍 / 👎 / …), which are `size-8` (32px), `rounded-[0.625rem]` (10px),
 * `p-1.5` (6px), `text-text-secondary` coloured, full-strength, with 16px icons.
 *
 * Strategy mirrors pi-call-button.e2e.ts: load the pi.ai mock host so Chrome
 * injects the extension's real content-script stylesheet and SayPi tags
 * <body class="pi">, then inject a representative action-bar subtree plus pi's
 * own theme variables (which the mock host doesn't ship) and read computed
 * styles off the shipped CSS.
 *
 * Pre-fix values (measured live on pi.ai) the assertions beat: container had a
 * tinted pill background rgb(245 234 220); telemetry button was 24×24,
 * opacity 0.6, border-radius 0, padding 0; the copy button was present.
 */
test("SayPi's Pi action buttons are seamless with native (copy hidden, telemetry matches) (real build)", async ({
  context,
}) => {
  const page = await context.newPage();
  await page.goto("https://pi.ai/talk", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.body.classList.contains("pi"), {
    timeout: 20_000,
  });

  const result = await page.evaluate(() => {
    // The base telemetry CSS is scoped under html.desktop-view (SayPi adds this
    // on desktop; the mock host doesn't). It MUST be present, otherwise the base
    // rule never applies and this test would false-pass without exercising the
    // real cascade (where the base 24px rule must be out-specified by pi.scss).
    document.documentElement.classList.add("desktop-view");

    // pi.ai defines these theme variables; the mock host doesn't, so recreate
    // them so the extension's `var(--color-…)` references resolve to pi's values.
    document.documentElement.style.setProperty("--color-text-secondary", "#655E55");
    document.documentElement.style.setProperty("--color-fill-hover", "#E9DDCD");
    document.documentElement.style.setProperty("--color-fill-tap", "#E4D7C6");

    // Inject a representative SayPi action-bar subtree (what PiMessageControls
    // builds), so the shipped CSS styles it exactly as on a real message.
    const bar = document.createElement("div");
    bar.className = "message-action-bar";
    const ctrls = document.createElement("div");
    ctrls.className = "saypi-tts-controls";
    const copy = document.createElement("button");
    copy.className = "saypi-button tooltip tts-item saypi-copy-button";
    const tel = document.createElement("button");
    tel.className = "saypi-telemetry-button";
    tel.innerHTML =
      '<svg viewBox="0 0 768 768"><path d="M384 96 L384 384"></path></svg>';
    ctrls.appendChild(copy);
    ctrls.appendChild(tel);
    bar.appendChild(ctrls);
    document.body.appendChild(bar);

    const csCtrls = getComputedStyle(ctrls);
    const csCopy = getComputedStyle(copy);
    const csTel = getComputedStyle(tel);
    const path = tel.querySelector("path") as SVGElement;
    const csPath = getComputedStyle(path);
    const csSvg = getComputedStyle(tel.querySelector("svg") as SVGElement);

    return {
      containerBg: csCtrls.backgroundColor,
      copyDisplay: csCopy.display,
      telWidth: csTel.width,
      telHeight: csTel.height,
      telRadius: csTel.borderRadius,
      telPadding: csTel.padding,
      telOpacity: csTel.opacity,
      telColor: csPath.fill,
      svgWidth: csSvg.width,
      svgHeight: csSvg.height,
    };
  });

  // Copy button: hidden (pi.ai has its own native copy).
  expect(result.copyDisplay, "SayPi copy button must be hidden on Pi").toBe(
    "none"
  );

  // Container: no tinted "pill" — sits inline with native buttons.
  expect(
    result.containerBg,
    `controls container must be transparent (was ${result.containerBg})`
  ).toBe("rgba(0, 0, 0, 0)");

  // Telemetry button: native size / radius / padding / full strength.
  expect(result.telWidth, "telemetry width must match native 32px").toBe("32px");
  expect(result.telHeight, "telemetry height must match native 32px").toBe(
    "32px"
  );
  expect(result.telRadius, "telemetry radius must be native 10px").toBe("10px");
  expect(result.telPadding, "telemetry padding must be native 6px").toBe("6px");
  expect(result.telOpacity, "telemetry must be full-strength, not faded").toBe(
    "1"
  );

  // Telemetry icon: native 16px, coloured with pi's text-secondary.
  expect(result.svgWidth, "telemetry icon must be native 16px").toBe("16px");
  expect(result.svgHeight, "telemetry icon must be native 16px").toBe("16px");
  expect(
    result.telColor,
    `telemetry icon must use pi's text-secondary (was ${result.telColor})`
  ).toBe("rgb(101, 94, 85)");
});
