import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

/**
 * Guards the contrast of the body-portal button tooltip (`.saypi-tooltip`).
 *
 * The tooltip is appended to <body> (to escape host overflow clipping), so it
 * sits OUTSIDE the host's themed component subtrees. Any CSS custom property it
 * references must therefore be defined at :root/body scope on that host — a
 * host-scoped token won't resolve on the portal.
 *
 * Regression (claude.ai, light theme): the Claude override set
 *   background-color: hsl(var(--black) / 0.8);
 * but Claude defines no `--black` variable on <body>. An undefined `var()` is
 * invalid at computed-value time and resolves to the property's *initial* value
 * (`background-color: transparent`) — it does NOT fall back to the base rule's
 * colour. The base `color: #fff` stayed, so the tooltip rendered as white text
 * on a transparent box over Claude's light background — invisible.
 *
 * Live measurement on claude.ai/new (2026-06-15, light theme):
 *   .saypi-tooltip computed -> background-color: rgba(0,0,0,0); color: rgb(255,255,255)
 *
 * Two invariants prevent this class of bug:
 *   1. The base rule must pair a background-colour with a text colour.
 *   2. No host override may use a bare `var(...)` (no comma fallback) for the
 *      tooltip's background/text colour — a fallback keeps it readable even when
 *      the host-scoped token is absent (see ChatGPT's `var(--x, rgba(...))`).
 */
const read = (p: string) =>
  readFileSync(fileURLToPath(new URL(p, import.meta.url)), "utf8");

const sheets: Record<string, string> = {
  common: read("../../src/styles/common.scss"),
  pi: read("../../src/styles/pi.scss"),
  claude: read("../../src/styles/claude.scss"),
  chatgpt: read("../../src/styles/chatgpt.scss"),
  desktop: read("../../src/styles/desktop.scss"),
  mobile: read("../../src/styles/mobile.scss"),
};

/** Extract the bodies of all bare `.saypi-tooltip { ... }` rules (not `.visible`). */
function tooltipRuleBodies(css: string): string[] {
  const bodies: string[] = [];
  const re = /\.saypi-tooltip\s*\{([^}]*)\}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(css)) !== null) bodies.push(m[1]);
  return bodies;
}

/** A `var(` that has no comma before its matching close paren = no fallback. */
function hasVarWithoutFallback(declaration: string): boolean {
  const idx = declaration.indexOf("var(");
  if (idx === -1) return false;
  let depth = 0;
  for (let i = idx + 3; i < declaration.length; i++) {
    const ch = declaration[i];
    if (ch === "(") depth++;
    else if (ch === ")") {
      depth--;
      if (depth === 0) return true; // closed the var() with no comma seen
    } else if (ch === "," && depth === 1) {
      return false; // fallback present
    }
  }
  return true;
}

describe("Body-portal tooltip stays readable across hosts", () => {
  it("base .saypi-tooltip pairs a background colour with a text colour", () => {
    const base = tooltipRuleBodies(sheets.common)[0];
    expect(base, "common.scss should define a .saypi-tooltip rule").toBeTruthy();
    expect(base).toMatch(/background-color\s*:/);
    expect(base).toMatch(/(^|\s)color\s*:/);
  });

  it("no host tooltip override uses a var() colour without a fallback", () => {
    for (const [host, css] of Object.entries(sheets)) {
      for (const body of tooltipRuleBodies(css)) {
        const colourDecls = body
          .split(";")
          .filter((d) => /(^|\s)(background-color|background|color)\s*:/.test(d));
        for (const decl of colourDecls) {
          expect(
            hasVarWithoutFallback(decl),
            `${host}.scss .saypi-tooltip colour uses a var() with no fallback (won't resolve on the <body> portal): "${decl.trim()}"`
          ).toBe(false);
        }
      }
    }
  });

  it("the Claude override no longer references the undefined --black token", () => {
    for (const body of tooltipRuleBodies(sheets.claude)) {
      expect(body).not.toContain("--black");
    }
  });
});
