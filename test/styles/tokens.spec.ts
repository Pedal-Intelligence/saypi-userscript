import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

/**
 * Contract guard for the SayPi design-token layer.
 *
 * Downstream styling (and a future Claude Design sync) depends on these
 * `--saypi-*` custom properties existing with these exact values — they are the
 * single source of truth for the literals previously duplicated across the
 * content-script SCSS. If a token is renamed or its value drifts, the SCSS that
 * references it via var() silently changes appearance; this test catches that.
 */
const tokensCss = readFileSync(
  fileURLToPath(new URL("../../src/styles/tokens.scss", import.meta.url)),
  "utf-8",
);

// The exact literals these tokens replaced (whitespace-normalized on both sides).
const EXPECTED: Record<string, string> = {
  "--saypi-green": "#418a2f",
  "--saypi-green-dark": "#24381b",
  "--saypi-cream": "rgb(245 238 223)",
  "--saypi-cream-dark": "rgb(237 225 209)",
  "--saypi-ink": "rgb(13 60 38)",
};

function declaredValue(name: string): string | undefined {
  const m = tokensCss.match(new RegExp(`${name}\\s*:\\s*([^;]+);`));
  return m?.[1].replace(/\s+/g, " ").trim();
}

describe("SayPi design tokens", () => {
  it("defines every brand token with its canonical value", () => {
    for (const [name, value] of Object.entries(EXPECTED)) {
      expect(declaredValue(name), `${name} should be defined`).toBe(value);
    }
  });

  it("declares the tokens on :root so they cascade to injected widgets", () => {
    expect(tokensCss).toMatch(/:root\s*\{/);
  });
});
