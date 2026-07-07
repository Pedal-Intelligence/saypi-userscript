// path-guard-lib.mjs — pure classifier for the path-guard CI check (issue #530).
//
// Decides whether a PR's changed files touch a founder-gated (high-blast-radius)
// path per AGENTS.md: auth/JWT, the manifest generator, release machinery, CI
// workflows, and the guard itself. Dependency-free and side-effect-free so it is
// unit-testable (test/scripts/path-guard.spec.ts) and safe to run from a BASE
// branch checkout in CI.
//
// Matching is deliberately plain-string: a pattern ending in "/" gates the whole
// directory (prefix match); any other pattern gates exactly that file. No globs,
// no regexes — the drift-guard spec asserts this stays true.

/**
 * Founder-gated path patterns. Sources:
 * - AGENTS.md "High-blast-radius changes" (auth/JWT, wxt.config.ts).
 * - AGENTS.md "Hard guardrails" (release/store-submission plumbing, CI gates).
 * - The guard itself (workflow + scripts), so weakening it is itself gated.
 */
export const GATED_PATH_PATTERNS = [
  // Auth / JWT
  "src/JwtManager.ts",
  "src/auth/",
  // Manifest, permissions, content-script injection scope. The `matches`
  // arrays actually live in the content-script entrypoint shims, not in
  // wxt.config.ts — gate exactly those two files (NOT all of entrypoints/,
  // where the settings UI lives and would over-gate routine work).
  "wxt.config.ts",
  "entrypoints/saypi.content.ts",
  "entrypoints/saypi-universal.content.ts",
  // Release machinery
  "scripts/release.mjs",
  "scripts/release-lib.mjs",
  "scripts/release-publish.mjs",
  "package-extension.sh",
  // CI workflows (includes the path-guard workflow itself)
  ".github/workflows/",
  // The guard's own scripts
  "scripts/path-guard.mjs",
  "scripts/path-guard-lib.mjs",
];

/** Strip a leading "./" so callers can pass either form. */
function normalize(path) {
  return path.startsWith("./") ? path.slice(2) : path;
}

function isGated(path) {
  const p = normalize(path);
  return GATED_PATH_PATTERNS.some((pattern) =>
    pattern.endsWith("/") ? p.startsWith(pattern) : p === pattern
  );
}

/**
 * Classify a list of changed file paths.
 * @param {string[]} paths changed file paths, repo-root-relative
 * @returns {{ gated: string[], clean: boolean }} gated paths (original
 *   spelling, input order) and whether the change set is clean of them
 */
export function classifyChangedFiles(paths) {
  const gated = paths.filter(isGated);
  return { gated, clean: gated.length === 0 };
}

/**
 * Full guard decision: classification + approval → outcome and message.
 * @param {string[]} paths changed file paths
 * @param {boolean} founderApproved whether the `founder-approved` label is on the PR
 * @returns {{ ok: boolean, gated: string[], message: string }}
 */
export function evaluatePathGuard(paths, founderApproved) {
  const { gated, clean } = classifyChangedFiles(paths);

  if (clean) {
    return {
      ok: true,
      gated,
      message: "path-guard: no founder-gated paths touched.",
    };
  }

  const list = gated.map((p) => `  - ${p}`).join("\n");

  if (founderApproved) {
    return {
      ok: true,
      gated,
      message:
        `path-guard: founder-gated paths approved via the founder-approved label:\n${list}`,
    };
  }

  return {
    ok: false,
    gated,
    message:
      `path-guard: this PR touches founder-gated (high-blast-radius) paths:\n${list}\n` +
      `Remedy: obtain founder sign-off, then have the founder-approved label applied ` +
      `(apply it only on actual founder instruction), per AGENTS.md "High-blast-radius changes".`,
  };
}
