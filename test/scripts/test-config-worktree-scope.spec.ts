import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
// picomatch is Vitest's own glob matcher (hoisted, untyped). Matching the real
// patterns with the real matcher is what stops this test degrading into "assert a
// string is present in an array" — which would pass on a pattern matching nothing.
// @ts-expect-error: untyped transitive dependency, used deliberately
import picomatch from "picomatch";

import vitestConfig from "../../vitest.config.js";

/**
 * Regression cover for #566: neither test runner excluded `.worktrees/`, so
 * `npm test` from the shared main checkout also ran every sibling agent's
 * in-progress specs — reporting THEIR failures as yours.
 *
 * That is worse than the wasted minute it costs. AGENTS.md mandates concurrent
 * agents work in `.worktrees/`, and separately tells each one to attribute any new
 * failure to its own change; together those send an agent chasing a red test on a
 * branch it has never checked out (and must not touch).
 *
 * These tests exercise the patterns with each runner's real matching semantics —
 * picomatch globs for Vitest, regexes for Jest — rather than asserting a string is
 * present, which would pass on a pattern that matches nothing.
 */

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

/** Paths that belong to a SIBLING worktree — no runner should ever collect these. */
const SIBLING_PATHS = [
  ".worktrees/preact-foundation/test/chatbots/ChatGPTSidebarConfig.spec.ts",
  ".worktrees/issue-460-pi-callbutton-initial-load/test/chatbots/ChatGPTSidebarConfig.spec.ts",
  ".worktrees/some-future-branch/test/deep/nested/thing.spec.ts",
  ".worktrees/some-future-branch/test/legacy.test.js",
];

/** Paths that belong to THIS checkout — every runner must still collect these. */
const OWN_PATHS = [
  "test/chatbots/ChatGPTSidebarConfig.spec.ts",
  "test/scripts/e2e-host-sweep-lib.spec.ts",
  "src/something.spec.ts",
  "test/legacy.test.js",
];

const jestConfig = () =>
  JSON.parse(readFileSync(join(repoRoot, "package.json"), "utf8")).jest;

describe("test runners stay inside their own checkout (#566)", () => {
  it("vitest excludes sibling worktrees", () => {
    const exclude = (vitestConfig as any).test.exclude as string[];
    const excluded = picomatch(exclude);

    for (const p of SIBLING_PATHS) expect(excluded(p), `should exclude ${p}`).toBe(true);
    for (const p of OWN_PATHS) expect(excluded(p), `should NOT exclude ${p}`).toBe(false);
  });

  /**
   * Jest matches testPathIgnorePatterns as regexes against the ABSOLUTE path, and
   * expands `<rootDir>` first. That distinction is the whole trap: a bare
   * `/\.worktrees/` looks equivalent, but when the checkout IS a worktree its own
   * absolute path contains `.worktrees/`, so every Jest test would be silently
   * ignored — a far worse failure than the one being fixed here, and a silent one.
   * Hence `checkout` is a parameter below, exercised as both the shared main
   * checkout and a worktree.
   */
  const jestIgnores = (checkout: string) => {
    const patterns: string[] = jestConfig().testPathIgnorePatterns ?? [];
    expect(patterns.length, "no testPathIgnorePatterns at all").toBeGreaterThan(0);
    return (p: string) =>
      patterns.some((pattern) =>
        new RegExp(pattern.replace("<rootDir>", checkout)).test(join(checkout, p))
      );
  };

  const MAIN_CHECKOUT = "/Users/dev/saypi-userscript";
  const WORKTREE_CHECKOUT = "/Users/dev/saypi-userscript/.worktrees/some-branch";

  it("jest ignores sibling worktrees when run from the shared checkout", () => {
    const ignored = jestIgnores(MAIN_CHECKOUT);

    for (const p of SIBLING_PATHS) expect(ignored(p), `should ignore ${p}`).toBe(true);
    for (const p of OWN_PATHS) expect(ignored(p), `should NOT ignore ${p}`).toBe(false);
  });

  it("jest still runs a worktree's OWN tests when invoked from inside it", () => {
    const ignored = jestIgnores(WORKTREE_CHECKOUT);

    for (const p of OWN_PATHS) expect(ignored(p), `should NOT ignore ${p}`).toBe(false);
    // A worktree nested inside a worktree is still somebody else's.
    expect(ignored(".worktrees/nested/test/thing.test.js")).toBe(true);
  });

  it("jest still ignores node_modules, which the added patterns must not displace", () => {
    expect(jestIgnores(MAIN_CHECKOUT)("node_modules/some-pkg/thing.test.js")).toBe(true);
  });
});
