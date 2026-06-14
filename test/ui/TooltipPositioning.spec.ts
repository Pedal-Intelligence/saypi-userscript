import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

/**
 * Guards that SayPi button tooltips are rendered as a body-level **portal**
 * (`.saypi-tooltip`, positioned by src/ui/Tooltip.ts) rather than a CSS
 * `::after` pseudo-element.
 *
 * The `::after` approach (even when centred) was clipped by the host's
 * `overflow:hidden` containers (Pi's rounded prompt box) and couldn't be lifted
 * out with z-index. The portal escapes all clipping/stacking contexts. This guard
 * keeps us from regressing back to the clippable pseudo-element.
 */
const read = (p: string) =>
  readFileSync(fileURLToPath(new URL(p, import.meta.url)), "utf8");

const common = read("../../src/styles/common.scss");
const hostSheets = {
  desktop: read("../../src/styles/desktop.scss"),
  pi: read("../../src/styles/pi.scss"),
  claude: read("../../src/styles/claude.scss"),
  chatgpt: read("../../src/styles/chatgpt.scss"),
  mobile: read("../../src/styles/mobile.scss"),
};

describe("Button tooltips use a body-level portal (not a clippable ::after)", () => {
  it("defines the .saypi-tooltip portal base (position:fixed, high z-index) in common.scss", () => {
    const norm = common.replace(/\s+/g, " ");
    expect(norm).toMatch(/\.saypi-tooltip\s*\{[^}]*position:\s*fixed/);
    // A high z-index so it sits above host chrome (e.g. Pi's z-[999] sidebar).
    expect(norm).toMatch(/\.saypi-tooltip\s*\{[^}]*z-index:\s*\d{4,}/);
  });

  it("no longer renders the clippable CSS ::after tooltip on any host", () => {
    expect(common).not.toContain(".tooltip[aria-label]::after");
    for (const [host, css] of Object.entries(hostSheets)) {
      expect(css, `${host}.scss should not use ::after tooltips`).not.toContain(
        ".tooltip[aria-label]::after"
      );
    }
  });
});
