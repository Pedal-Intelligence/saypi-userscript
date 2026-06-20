import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

/**
 * Guards the retirement of the vendored Tailwind v2 dump.
 *
 * Every Tailwind-style utility class used in the settings HTML templates must
 * be defined in base.css, so dropping the dump never leaves an element
 * unstyled. Also asserts the dump is no longer imported.
 */
const settingsDir = fileURLToPath(
  new URL("../../entrypoints/settings", import.meta.url),
);
const baseCss = readFileSync(
  fileURLToPath(
    new URL("../../entrypoints/settings/styles/base.css", import.meta.url),
  ),
  "utf-8",
);

function collectHtml(dir: string): string {
  let html = "";
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = `${dir}/${entry.name}`;
    if (entry.isDirectory()) html += collectHtml(p);
    else if (entry.name.endsWith(".html")) html += readFileSync(p, "utf-8");
  }
  return html;
}

const html = collectHtml(settingsDir);
const classTokens = new Set<string>();
for (const m of html.matchAll(/class="([^"]*)"/g)) {
  for (const tok of m[1].split(/\s+/)) if (tok) classTokens.add(tok);
}

// Tokens base.css is responsible for (Tailwind-style utilities).
const UTILITY =
  /^(flex|hidden|items-|justify-|w-|h-|max-w-|m[trbl]?-|p[xy]?-|px-|py-|border$|rounded|bg-|text-|font-|appearance-|cursor-|focus:|hover:)/;

// Class names base.css defines (unescaping CSS \: and \. ).
const definedClasses = new Set<string>();
for (const m of baseCss.matchAll(/\.((?:[\w-]|\\.)+)/g)) {
  definedClasses.add(m[1].replace(/\\(.)/g, "$1"));
}

describe("settings Tailwind retirement", () => {
  it("base.css defines every Tailwind utility class used in the settings HTML", () => {
    const used = [...classTokens].filter((t) => UTILITY.test(t)).sort();
    expect(used.length).toBeGreaterThan(0); // sanity: we actually scanned classes
    const missing = used.filter((t) => !definedClasses.has(t));
    expect(
      missing,
      `Undefined utility classes (would render unstyled): ${missing.join(", ")}`,
    ).toEqual([]);
  });

  it("no longer imports the vendored Tailwind dump", () => {
    const indexTs = readFileSync(
      fileURLToPath(
        new URL("../../entrypoints/settings/index.ts", import.meta.url),
      ),
      "utf-8",
    );
    expect(indexTs).not.toContain("tailwind.min.css");
  });
});
