import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Regression guard for #449: SayPi used to register
 * `window.addEventListener("unload", () => audioModule.stop())` in two audio
 * lifecycle call sites — `src/saypi.index.js` (universal dictation init) and
 * `src/AIChatModule.ts` (chat-host init).
 *
 * `unload` is deprecated in Chrome: pages that register it are logged with
 * "Permissions policy violation: unload is not allowed in this document" (seen
 * on the headerless local fixture during the e2e-dictation-sweep) and it can
 * disable back/forward-cache eligibility. The handler itself was inert —
 * `AudioModule.stop()` is a no-op with no other callers — so the listeners were
 * removed outright rather than replaced.
 *
 * This scans the REAL source (not a mock) so it both proves the removal and
 * stops a deprecated `unload` listener from creeping back in. Both the
 * `addEventListener("unload", …)` form and the equivalent `window.onunload = …`
 * property form are caught, across `src/` and the `entrypoints/` shims. The
 * pattern is anchored so it deliberately ignores the out-of-scope, still-
 * legitimate `beforeunload`/`onbeforeunload` handlers (e.g. the one in
 * `UniversalDictationModule.ts`).
 */
const root = resolve(__dirname, "..");
const scanRoots = ["src", "entrypoints"].map((d) => resolve(root, d));

// Matches addEventListener("unload"...) / addEventListener('unload'...) and the
// window.onunload = ... property form, with any whitespace — but NOT their
// `beforeunload` counterparts (the quote / dot must sit immediately before
// `unload`, so "beforeunload"/onbeforeunload never match).
const DEPRECATED_UNLOAD = /addEventListener\(\s*["']unload["']|\.onunload\s*=/;

function collectSourceFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...collectSourceFiles(full));
    } else if (/\.(ts|tsx|js|jsx|mjs)$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

const sourceFiles = scanRoots.flatMap(collectSourceFiles);

describe("#449 no deprecated 'unload' event listeners in src/ or entrypoints/", () => {
  it("sanity: the scan actually walked the source tree", () => {
    expect(sourceFiles.length).toBeGreaterThan(50);
  });

  it("registers no window/document 'unload' listeners", () => {
    const offenders = sourceFiles.filter((file) =>
      DEPRECATED_UNLOAD.test(readFileSync(file, "utf8"))
    );
    const relative = offenders.map((f) => f.slice(root.length + 1));
    expect(relative).toEqual([]);
  });
});
