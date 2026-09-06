import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { PiAIChatbot } from "../../src/chatbots/Pi";

/**
 * Regression guard for the call button matching Pi's native send button.
 *
 * Pi's composer send button is `size-10` (40px) painted with Pi's
 * `--color-accent-alt-*` tokens (#038247 light / #43A774 dark, with hover and
 * tap shades). The call button had drifted: a 36px disc in SayPi's own brand
 * green (#418a2f from call.svg), sitting visibly smaller and a different shade
 * beside the send button. The fix pins the disc's size and fills to Pi's tokens
 * so it tracks Pi's theme (incl. dark mode) the same way the native button does.
 *
 * Visual parity is verified at Layer 4 on real pi.ai; this guards the rules
 * against silently regressing to the brand green / 36px.
 */
const piScss = readFileSync(
  fileURLToPath(new URL("../../src/styles/pi.scss", import.meta.url)),
  "utf8"
);

describe("Pi call button matches the native send button (pi.scss)", () => {
  it("sizes the call button to Pi's size-10 (2.5rem) on desktop", () => {
    expect(piScss).toMatch(
      /#saypi-callButton\s*\{[^}]*width:\s*2\.5rem;[^}]*height:\s*2\.5rem;/
    );
  });

  it("does not keep the stale size-9 (2.25rem) mobile sizing", () => {
    expect(piScss).not.toMatch(/#saypi-callButton\s*\{[^}]*2\.25rem/);
  });

  it("paints the idle disc with Pi's --color-accent-alt-default token", () => {
    expect(piScss).toMatch(
      /#saypi-callButton[^{]*svg path\.background\s*\{[^}]*fill:\s*var\(--color-accent-alt-default/
    );
  });

  it("uses Pi's hover and tap accent tokens for the disc", () => {
    expect(piScss).toMatch(/:hover[^{]*\{[^}]*var\(--color-accent-alt-hover/);
    expect(piScss).toMatch(/:active[^{]*\{[^}]*var\(--color-accent-alt-tap/);
  });

  it("colours the receiver glyph with Pi's --color-base-contrast token", () => {
    expect(piScss).toMatch(
      /path\.phone-receiver\s*\{[^}]*fill:\s*var\(--color-base-contrast/
    );
  });
});

describe("Pi call button host classes", () => {
  it("no longer carries the cream Tailwind classes Pi's build has dropped", () => {
    // Pi's `--color-cream-*` tokens are gone from pi.ai, so bg-cream-550 and
    // enabled:hover:bg-cream-650 were silent no-ops; hover is now token-driven.
    const classes = new PiAIChatbot().getExtraCallButtonClasses();
    expect(classes).not.toContain("bg-cream-550");
    expect(classes).not.toContain("enabled:hover:bg-cream-650");
  });
});
