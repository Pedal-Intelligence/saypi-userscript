import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

/**
 * Guards the retirement of the vendored Tailwind v2 dump.
 *
 * Every Tailwind-style utility class used anywhere in the settings surface must
 * be styled by some settings/popup stylesheet, so dropping the dump never
 * leaves an element unstyled. This scans not just `.html` templates but also
 * the `.ts`/`.tsx` that render markup (e.g. `header.ts`'s template string, the
 * `*Panel.tsx` components) and the popup `.js` helpers that mutate classes via
 * `classList` (e.g. `status-subscription.js`'s quota-bar colours) — the gap
 * that left the header + status dots unstyled when PR #368 scanned only HTML.
 */
const root = (p: string) => fileURLToPath(new URL(`../../${p}`, import.meta.url));

function filesUnder(dir: string, exts: string[]): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = `${dir}/${entry.name}`;
    if (entry.isDirectory()) out.push(...filesUnder(p, exts));
    else if (exts.some((e) => entry.name.endsWith(e))) out.push(p);
  }
  return out;
}

// Markup sources: templates (.html), Preact components (.tsx), controllers and
// template strings (.ts), and the popup JS helpers that inject/toggle classes.
const sourceFiles = [
  ...filesUnder(root("entrypoints/settings"), [".html", ".ts", ".tsx"]),
  ...filesUnder(root("src/popup"), [".js"]),
];

// Stylesheets that together style the settings surface.
const cssFiles = [
  ...filesUnder(root("entrypoints/settings"), [".css"]),
  ...filesUnder(root("src/popup"), [".css"]),
];

// Classes that look like Tailwind utilities (a settings stylesheet must define).
const UTILITY =
  /^(flex$|flex-|items-|justify-|self-|content-|w-|h-|min-|max-|m[trblxy]?-|p[trblxy]?-|gap-|space-|text-|font-|leading-|tracking-|bg-|border$|border-|rounded|hidden$|block$|inline|grid|opacity-|shadow|ring|cursor-|appearance-|focus:|hover:)/;

// Used in markup but never a real Tailwind v2 utility — the old dump never
// defined these either, so they were always harmless no-ops.
const NEVER_DEFINED = new Set(["text-normal"]);

function usedClasses(): Set<string> {
  const out = new Set<string>();
  for (const f of sourceFiles) {
    const src = readFileSync(f, "utf-8");
    // class="..." | class='...' | className="..." | className='...'
    for (const m of src.matchAll(/\bclass(?:Name)?\s*=\s*["']([^"']*)["']/g)) {
      for (const t of m[1].split(/\s+/)) if (t) out.add(t);
    }
    // classList.add/toggle/remove('a', 'b', ...) — quoted literals
    for (const m of src.matchAll(
      /classList\.(?:add|toggle|remove)\(([^)]*)\)/g,
    )) {
      for (const lit of m[1].matchAll(/["']([^"']+)["']/g)) {
        for (const t of lit[1].split(/\s+/)) if (t) out.add(t);
      }
    }
  }
  return out;
}

function definedClasses(): Set<string> {
  const out = new Set<string>();
  for (const f of cssFiles) {
    const css = readFileSync(f, "utf-8");
    for (const m of css.matchAll(/\.((?:[\w-]|\\.)+)/g)) {
      out.add(m[1].replace(/\\(.)/g, "$1"));
    }
  }
  return out;
}

describe("settings Tailwind retirement", () => {
  it("every Tailwind utility used in the settings surface is styled by a settings stylesheet", () => {
    const defined = definedClasses();
    const used = [...usedClasses()]
      .filter((t) => UTILITY.test(t) && !NEVER_DEFINED.has(t))
      .sort();
    expect(used.length).toBeGreaterThan(0); // sanity: we actually scanned classes
    const missing = used.filter((t) => !defined.has(t));
    expect(
      missing,
      "Utility classes used in settings markup/JS but defined in no settings " +
        `stylesheet (would render unstyled): ${missing.join(", ")}`,
    ).toEqual([]);
  });

  it("no longer imports the vendored Tailwind dump", () => {
    const indexTs = readFileSync(root("entrypoints/settings/index.ts"), "utf-8");
    expect(indexTs).not.toContain("tailwind.min.css");
  });
});
