/**
 * Build-identity stamp.
 *
 * `__SAYPI_BUILD_STAMP__` is replaced at build time by a Vite `define`
 * (see wxt.config.ts) with the git short SHA, branch, and ISO build time. The
 * content script writes it onto `<html data-saypi-build="...">` so the page's
 * main world — and therefore an automation probe (Layer 4) — can read exactly
 * which build is injected. This is what makes a stale dev build (e.g. one whose
 * hot-reload silently stalled) detectable instead of a guess: compare the loaded
 * stamp against the current `git rev-parse --short HEAD`.
 */

export interface BuildStamp {
  sha: string;
  branch: string;
  time: string;
}

// Declared for TypeScript; substituted by Vite at build time. `typeof` keeps this
// safe in the test/dev environment where the define is absent (no ReferenceError).
declare const __SAYPI_BUILD_STAMP__: BuildStamp | undefined;

export const BUILD_STAMP: BuildStamp =
  (typeof __SAYPI_BUILD_STAMP__ !== "undefined" && __SAYPI_BUILD_STAMP__) || {
    sha: "dev",
    branch: "dev",
    time: "",
  };

/** Compact, human-readable single-line representation, e.g. "0b65de4@main 2026-06-16T21:00:00Z". */
export function formatBuildStamp(stamp: BuildStamp = BUILD_STAMP): string {
  const ref =
    stamp.branch && stamp.branch !== stamp.sha ? `${stamp.sha}@${stamp.branch}` : stamp.sha;
  return `${ref} ${stamp.time}`.trim();
}

/**
 * Record the build identity on the document root so it is readable from the
 * page's main world (the content script runs in an isolated world, but the DOM
 * is shared). Safe to call more than once.
 */
export function stampBuildOnDocument(
  doc: Document = document,
  stamp: BuildStamp = BUILD_STAMP
): void {
  const el = doc?.documentElement;
  if (!el) return;
  el.dataset.saypiBuild = formatBuildStamp(stamp);
}
