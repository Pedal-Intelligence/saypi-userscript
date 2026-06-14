import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

/**
 * The dark-mode / theme switcher is a SayPi *immersive-mode* affordance (the
 * full-screen experience SayPi layers on top of the host). The chat hosts now
 * ship their own native dark mode in the normal view, so the toggle belongs in
 * immersive mode only.
 *
 * Previously it was added to the normal control panel and only hidden by
 * accident (on Pi it collapsed to 0x0 for lack of the `mini` class), which read
 * as a broken/invisible control. This guards that the toggle is *intentionally*
 * hidden outside immersive view.
 */
const commonScss = readFileSync(
  fileURLToPath(new URL("../../src/styles/common.scss", import.meta.url)),
  "utf8"
);

describe("Theme toggle is immersive-only", () => {
  it("hides the theme toggle outside immersive view", () => {
    const normalized = commonScss.replace(/\s+/g, " ");
    expect(normalized).toMatch(
      /html:not\(\.immersive-view\) \.theme-toggle-button \{ display: none/
    );
  });
});
