import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

/**
 * Regression guard for SayPi button tooltips being obscured.
 *
 * The base tooltip (`desktop.scss`, inherited by Pi + Claude) used to position
 * the `::after` with `transform: translateX(-70%)` + `margin-left: 10px` — a crude
 * off-centre hack that pushed a wide tooltip left until it crossed the host's
 * sidebar boundary (Pi's sidebar is `z-[999]`) and got covered. Now it centres
 * properly and carries a z-index above host chrome.
 *
 * Verified visually at Layer 4 (live, on real pi.ai).
 */
const desktopScss = readFileSync(
  fileURLToPath(new URL("../../src/styles/desktop.scss", import.meta.url)),
  "utf8"
);

describe("Button tooltip positioning (desktop.scss base)", () => {
  it("centres the tooltip under the button (drops the old translateX(-70%) hack)", () => {
    const norm = desktopScss.replace(/\s+/g, " ");
    expect(norm).toContain("transform: translateX(-50%)");
    expect(norm).not.toContain("translateX(-70%)");
  });

  it("renders the tooltip above host chrome (z-index over Pi's z-999 sidebar)", () => {
    expect(desktopScss).toMatch(
      /\.tooltip\[aria-label\]::after[\s\S]*?z-index:\s*1000/
    );
  });
});
