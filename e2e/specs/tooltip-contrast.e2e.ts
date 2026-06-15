import { test, expect } from "../fixtures/extension";

/**
 * Layer 3 regression guard for the Claude button-tooltip contrast bug.
 *
 * The body-portal tooltip (`.saypi-tooltip`) was invisible on claude.ai: the
 * Claude override set `background-color: hsl(var(--black) / 0.8)`, but the portal
 * lives on <body> where Claude defines no `--black`. An undefined var() computes
 * to the property's initial value (`transparent`) — NOT the base rule's colour —
 * so the box rendered transparent while the inherited `color:#fff` stayed: white
 * text on nothing.
 *
 * This verifies the fix against the REAL BUILD, not an injected rule. We load the
 * actual built extension (`.output/chrome-mv3-dev`, produced by `wxt build`) into
 * Chrome via --load-extension, navigate to the claude.ai mock host (so Chrome
 * injects the extension's real content-script CSS per the manifest match), let
 * SayPi tag the body by host, then read the computed style of the element the
 * shipped stylesheet targets. The mock page defines no `--black`, replicating
 * claude.ai exactly.
 *
 * Before the fix this computes `rgba(0, 0, 0, 0)` (transparent) and the spec
 * fails; after, `rgba(0, 0, 0, 0.8)` and it passes. Confirmed fail-first by
 * temporarily reverting the fix in the source and rebuilding.
 */
test("Claude tooltip CSS renders an opaque, readable pill (real build)", async ({ context }) => {
  const page = await context.newPage();
  await page.goto("https://claude.ai/new", { waitUntil: "domcontentloaded" });

  // SayPi tags <body> by host (ChatbotService.addChatbotFlags) — proves the
  // content script and its CSS are live on claude.ai, and that the host-scoped
  // `html body.claude .saypi-tooltip` override (not the base rule) is in effect.
  await page.waitForFunction(() => document.body.classList.contains("claude"), {
    timeout: 20_000,
  });

  // Create the element the shipped CSS targets and read its computed style. The
  // colours come from the extension's real stylesheet — nothing is injected here.
  const style = await page.evaluate(() => {
    const el = document.createElement("div");
    el.className = "saypi-tooltip";
    el.textContent = "Start a hands-free conversation with Claude";
    document.body.appendChild(el);
    const cs = getComputedStyle(el);
    const out = { backgroundColor: cs.backgroundColor, color: cs.color };
    el.remove();
    return out;
  });

  // Parse the background; the bug rendered it fully transparent (alpha 0).
  const m = style.backgroundColor.match(/rgba?\(([^)]+)\)/);
  expect(m, `unexpected background-color: "${style.backgroundColor}"`).not.toBeNull();
  const [r, g, b, a = 1] = m![1].split(",").map((s) => parseFloat(s));

  // Opaque enough to be visible (regression: alpha was 0).
  expect(a, `tooltip background must be opaque, got "${style.backgroundColor}"`).toBeGreaterThan(0.5);
  // A dark fill, so the white label reads against it.
  expect(r + g + b, `tooltip background must be dark, got "${style.backgroundColor}"`).toBeLessThan(120);
  // White text.
  expect(style.color).toBe("rgb(255, 255, 255)");
});
