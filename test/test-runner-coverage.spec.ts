import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";

/**
 * Guard against the "orphan test file" trap.
 *
 * This repo runs two test runners with mutually exclusive, narrow patterns:
 *   - Jest   (package.json "jest".testMatch):  (asterisks)/ *.test.js
 *   - Vitest (vitest.config.js test.include):  (asterisks)/ *.spec.ts
 *
 * Any other test-like filename (e.g. *.test.ts, *.spec.js, *.test.tsx) matches
 * NEITHER runner and silently never executes. Two such files previously sat
 * un-run for months. This guard fails the moment a committed test file is not
 * picked up by exactly one runner, so the gap surfaces immediately.
 *
 * It audits git-tracked files only (via `git ls-files`): an orphan that isn't
 * committed isn't really "in the repo", and using git avoids walking
 * node_modules / build outputs and the permission/blind-spot pitfalls of a
 * hand-maintained directory ignore-list.
 *
 * If this fails: rename the listed file to *.spec.ts (Vitest) or *.test.js
 * (Jest), or — if you intend to add a new extension — widen the matching
 * runner's config AND the corresponding RUNNERS entry below.
 */

// Anything that looks like a test file, regardless of which runner (if any) owns it.
const TEST_FILE = /\.(test|spec)\.(ts|tsx|js|jsx|mts|cts|mjs|cjs)$/;

// These MUST mirror the runner configs:
const RUNNERS = [
  { name: "Jest (**/*.test.js)", match: /\.test\.js$/ }, // package.json -> jest.testMatch
  { name: "Vitest (**/*.spec.ts)", match: /\.spec\.ts$/ }, // vitest.config.js -> test.include
];

function trackedTestFiles(): string[] {
  // -z: NUL-separated, robust to unusual filenames. Runs from the repo/worktree
  // root (Vitest's cwd), so git resolves the correct tree regardless of caller cwd.
  const out = execFileSync("git", ["ls-files", "-z"], { encoding: "utf-8" });
  return out.split("\0").filter((f) => f.length > 0 && TEST_FILE.test(f));
}

describe("test runner coverage", () => {
  it("finds committed test files to check (scan sanity)", () => {
    expect(trackedTestFiles().length).toBeGreaterThan(0);
  });

  it("every committed test file is picked up by exactly one runner", () => {
    const misrouted = trackedTestFiles()
      .map((file) => ({
        file,
        runners: RUNNERS.filter((r) => r.match.test(file)).map((r) => r.name),
      }))
      .filter((x) => x.runners.length !== 1)
      .sort((a, b) => a.file.localeCompare(b.file));

    expect(
      misrouted,
      "These committed test files are not picked up by exactly one runner " +
        "(neither = orphan that never runs; both = ambiguous). Rename to " +
        "*.spec.ts (Vitest) or *.test.js (Jest):\n" +
        misrouted
          .map((m) => `  - ${m.file} -> [${m.runners.join(", ") || "no runner"}]`)
          .join("\n")
    ).toEqual([]);
  });
});
