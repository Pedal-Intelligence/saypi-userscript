import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

/**
 * Regression guard for SayPi following Pi.ai's native light/dark theme.
 *
 * pi.scss used to hardcode light-mode colours (bg-cream-550, brown
 * rgb(107,98,85) icons), so on Pi's dark UI SayPi's control buttons stayed light
 * (most glaringly a bright cream settings circle). Rather than maintain a parallel
 * `html.dark` colour set, the control buttons now style themselves with Pi's own
 * design tokens (`--color-text-secondary`, `--color-button-fill-*`), which Pi
 * redefines under `html.dark` — so they track Pi's theme automatically.
 *
 * Visual correctness is verified at Layer 4 (live, light + dark on real pi.ai);
 * this guards that the token-based theming doesn't silently regress to hardcoded
 * light colours.
 */
const piScss = readFileSync(
  fileURLToPath(new URL("../../src/styles/pi.scss", import.meta.url)),
  "utf8"
);

describe("Pi control buttons follow Pi's theme via design tokens (pi.scss)", () => {
  it("colours the control-button icons with Pi's --color-text-secondary token", () => {
    expect(piScss).toMatch(
      /\.saypi-control-button svg[\s\S]*?color:\s*var\(--color-text-secondary/
    );
  });

  it("uses Pi's fill tokens for the control-button hover state", () => {
    expect(piScss).toMatch(/var\(--color-button-fill-hover/);
  });

  it("no longer hardcodes the light-mode cream settings-button background", () => {
    // The old defect: a fixed bg-cream-550 (rgb(237,225,209)) circle that stayed
    // light on Pi's dark UI. The settings button is now transparent + token hover.
    expect(piScss).not.toMatch(/#saypi-settingsButton\s*\{[^}]*rgb\(237,\s*225,\s*209\)/);
  });
});
