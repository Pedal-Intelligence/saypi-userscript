import { describe, it, expect } from "vitest";
import { readdirSync } from "node:fs";
import { join, relative } from "node:path";

/**
 * Guard against the "orphan test file" trap.
 *
 * This repo runs two test runners with mutually exclusive, narrow patterns:
 *   - Jest   (package.json "jest".testMatch):  ** / *.test.js
 *   - Vitest (vitest.config.js test.include):  ** / *.spec.ts
 *
 * Any other test-like filename (e.g. *.test.ts, *.spec.js, *.test.tsx) matches
 * NEITHER runner and silently never executes. Two such files previously sat
 * un-run for months. This guard fails the moment a test file lands that no
 * runner will pick up, so the gap surfaces immediately instead of rotting.
 *
 * If this fails: rename the listed file to *.spec.ts (Vitest) or *.test.js
 * (Jest), or — if you intend to add a new extension — widen the matching
 * runner's config AND the corresponding pattern below.
 */

const ROOT = process.cwd();

const IGNORED_DIRS = new Set([
  "node_modules",
  ".git",
  ".output",
  ".wxt",
  "dist",
  "public",
  "coverage",
  ".worktrees",
  ".cache",
]);

// Anything that looks like a test file, regardless of which runner (if any) owns it.
const TEST_FILE = /\.(test|spec)\.(ts|tsx|js|jsx|mts|cts|mjs|cjs)$/;

// These MUST mirror the runner configs:
const JEST_MATCH = /\.test\.js$/; // package.json -> jest.testMatch: ["**/*.test.js"]
const VITEST_MATCH = /\.spec\.ts$/; // vitest.config.js -> test.include: ["**/*.spec.ts"]

function collectTestFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (IGNORED_DIRS.has(entry.name)) continue;
      collectTestFiles(join(dir, entry.name), acc);
    } else if (entry.isFile() && TEST_FILE.test(entry.name)) {
      acc.push(relative(ROOT, join(dir, entry.name)));
    }
  }
  return acc;
}

describe("test runner coverage", () => {
  it("finds test files to check (scan sanity)", () => {
    expect(collectTestFiles(ROOT).length).toBeGreaterThan(0);
  });

  it("every test file is picked up by exactly one runner (no orphans)", () => {
    const orphans = collectTestFiles(ROOT)
      .filter((f) => !JEST_MATCH.test(f) && !VITEST_MATCH.test(f))
      .sort();

    expect(
      orphans,
      "These test files match neither Jest (**/*.test.js) nor Vitest " +
        "(**/*.spec.ts) and will never run. Rename to *.spec.ts or *.test.js:\n" +
        orphans.map((o) => `  - ${o}`).join("\n")
    ).toEqual([]);
  });
});
