/**
 * release-lib — pure logic for the `release-extension` skill.
 *
 * No I/O, no git, no fs: everything here is a pure function so it can be unit-tested
 * (test/scripts/release-lib.spec.ts) and reused by both today's packet generator and a
 * future browser-driver / publishing-API path. The CLI wrapper (scripts/release.mjs)
 * does the git/fs/shell work and calls into here.
 *
 * The headline rule (founder-emphasized): the release version is DERIVED from the
 * published baseline + the actual payload — never assumed from package.json, which a
 * developer may have bumped (or not, or wrongly) for this payload. See decideVersion().
 */

/** Conventional-commit types we recognize. */
export const COMMIT_TYPES = [
  "feat",
  "fix",
  "perf",
  "refactor",
  "docs",
  "test",
  "build",
  "ci",
  "chore",
  "style",
  "revert",
];

/**
 * Scopes that are internal-only (tooling/tests/infra) and therefore NOT user-facing,
 * even on a feat/fix/perf. Used to keep the store changelog about what users actually
 * see, and to let the founder judge whether a feat(...) really warrants a minor bump.
 */
export const INTERNAL_SCOPES = new Set([
  "tooling",
  "dev",
  "ci",
  "test",
  "e2e",
  "layer35",
  "layer4cdp",
  "layer4",
  "deps",
  "agents",
  "repo",
  "build",
  "synthetic-audio",
]);

/** Types that are never user-facing regardless of scope. */
const NON_USER_FACING_TYPES = new Set([
  "refactor",
  "docs",
  "test",
  "build",
  "ci",
  "chore",
  "style",
  "revert",
]);

/**
 * @typedef {Object} Commit
 * @property {string} hash
 * @property {string} subject
 * @property {string|null} type
 * @property {string|null} scope
 * @property {boolean} breaking
 * @property {string} description
 * @property {number|null} pr
 * @property {boolean} userFacing
 */

/**
 * Parse one `git log --oneline` line ("<hash> <subject>") into structured form.
 * Returns null only when the line is empty. Non-conventional subjects parse with
 * type=null so they still count toward the payload (and land in "other").
 *
 * @param {string} line
 * @returns {Commit|null}
 */
export function parseCommitLine(line) {
  const trimmed = String(line || "").trim();
  if (!trimmed) return null;

  const m = trimmed.match(/^([0-9a-f]{7,40})\s+(.*)$/i);
  const hash = m ? m[1] : "";
  const subject = m ? m[2] : trimmed;

  // type(scope)!: subject
  const cc = subject.match(/^(\w+)(?:\(([^)]+)\))?(!)?:\s*(.+)$/);
  const type = cc ? cc[1].toLowerCase() : null;
  const scope = cc && cc[2] ? cc[2].toLowerCase() : null;
  const breaking = Boolean(cc && cc[3]) || /BREAKING[ -]CHANGE/.test(subject);

  // Last (#NNN) wins — squash-merges append the PR number, sometimes after a cherry-pick ref.
  const prMatches = [...subject.matchAll(/\(#(\d+)\)/g)];
  const pr = prMatches.length ? Number(prMatches[prMatches.length - 1][1]) : null;

  // Strip the trailing PR ref(s) from the description — the PR is tracked separately and
  // the renderer re-appends it, so keeping it here would double-print "(#392) (#392)".
  const description = (cc ? cc[4] : subject).replace(/\s*(?:\(#\d+\)\s*)+$/, "").trim();

  const knownType = type && COMMIT_TYPES.includes(type) ? type : null;
  const userFacing =
    knownType !== null &&
    !NON_USER_FACING_TYPES.has(knownType) &&
    !(scope && INTERNAL_SCOPES.has(scope));

  return { hash, subject, type: knownType, scope, breaking, description, pr, userFacing };
}

/**
 * Parse a block of `git log --oneline` output (string or array of lines).
 * @param {string|string[]} input
 * @returns {Commit[]}
 */
export function categorizeCommits(input) {
  const lines = Array.isArray(input) ? input : String(input || "").split("\n");
  return lines.map(parseCommitLine).filter((c) => c !== null);
}

/**
 * Summarize a categorized payload: counts, whether it has feats/breaking changes, and
 * the user-facing vs internal split that drives both the version and the changelog.
 * @param {Commit[]} commits
 */
export function summarizePayload(commits = []) {
  const byType = {};
  for (const c of commits) {
    const key = c.type || "other";
    byType[key] = (byType[key] || 0) + 1;
  }
  const userFacing = commits.filter((c) => c.userFacing);
  const featDrivers = commits.filter((c) => c.type === "feat");
  const breakingDrivers = commits.filter((c) => c.breaking);
  return {
    total: commits.length,
    byType,
    userFacing,
    internalCount: commits.length - userFacing.length,
    hasFeat: featDrivers.length > 0,
    hasBreaking: breakingDrivers.length > 0,
    featDrivers,
    breakingDrivers,
  };
}

// ── SemVer helpers ──────────────────────────────────────────────────────────────

/** Strip a leading "v" and parse "X.Y.Z" → [major, minor, patch]. */
export function parseSemver(v) {
  const m = String(v || "").trim().replace(/^v/, "").match(/^(\d+)\.(\d+)\.(\d+)/);
  if (!m) return null;
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

export function formatSemver(parts) {
  return `${parts[0]}.${parts[1]}.${parts[2]}`;
}

/** -1 / 0 / 1 comparing a vs b (accepts "v"-prefixed or bare). */
export function compareSemver(a, b) {
  const pa = parseSemver(a);
  const pb = parseSemver(b);
  if (!pa || !pb) throw new Error(`compareSemver: invalid version (${a} vs ${b})`);
  for (let i = 0; i < 3; i++) {
    if (pa[i] !== pb[i]) return pa[i] < pb[i] ? -1 : 1;
  }
  return 0;
}

/** Bump a version by level ("major" | "minor" | "patch"). */
export function bumpSemver(v, level) {
  const p = parseSemver(v);
  if (!p) throw new Error(`bumpSemver: invalid version "${v}"`);
  if (level === "major") return formatSemver([p[0] + 1, 0, 0]);
  if (level === "minor") return formatSemver([p[0], p[1] + 1, 0]);
  if (level === "patch") return formatSemver([p[0], p[1], p[2] + 1]);
  throw new Error(`bumpSemver: unknown level "${level}"`);
}

/**
 * Decide the release version from the published baseline + the payload, reconciling
 * against whatever package.json currently holds (which may be wrong for this payload).
 *
 * @param {object} args
 * @param {string|null} args.baseline   Highest published version (e.g. last release tag "1.10.7"). Falls back to pkgVersion.
 * @param {string} args.pkgVersion Current package.json version.
 * @param {Commit[]} args.commits  Categorized payload since baseline.
 * @returns {{version:string, level:string, baseline:string, candidate:string, pkgVersion:string,
 *   source:'candidate'|'staged', warnings:string[], reasoning:string, drivers:object[]}}
 */
export function decideVersion({ baseline, pkgVersion, commits = [] }) {
  const summary = summarizePayload(commits);
  const base = parseSemver(baseline) ? formatSemver(parseSemver(baseline)) : null;
  const pkg = parseSemver(pkgVersion) ? formatSemver(parseSemver(pkgVersion)) : null;
  if (!pkg) throw new Error(`decideVersion: invalid package.json version "${pkgVersion}"`);

  // No tags yet: treat the package version as the baseline so we never go backwards.
  const effectiveBaseline = base || pkg;

  const level = summary.hasBreaking ? "major" : summary.hasFeat ? "minor" : "patch";
  const candidate = bumpSemver(effectiveBaseline, level);
  const drivers = summary.hasBreaking ? summary.breakingDrivers : summary.hasFeat ? summary.featDrivers : [];

  const warnings = [];
  let version;
  let source;

  const pkgVsBase = compareSemver(pkg, effectiveBaseline);
  if (pkgVsBase <= 0) {
    // package.json is at or behind the published baseline → it was never bumped for this release.
    version = candidate;
    source = "candidate";
    if (pkgVsBase < 0) {
      warnings.push(
        `package.json (${pkg}) is BEHIND the published baseline (${effectiveBaseline}) — unusual; ignoring it and using the derived version.`,
      );
    }
  } else {
    // package.json is ahead of baseline → a bump was staged. Trust it only if it covers the payload.
    const pkgVsCandidate = compareSemver(pkg, candidate);
    if (pkgVsCandidate >= 0) {
      version = pkg;
      source = "staged";
    } else {
      version = candidate;
      source = "candidate";
      warnings.push(
        `Staged package.json version ${pkg} UNDER-COUNTS this payload, which warrants a ${level} bump ` +
          `(${drivers.length} ${level === "minor" ? "feature" : level} commit(s)). Proposing ${candidate} instead.`,
      );
    }
  }

  if (!base) {
    warnings.push(`No published baseline tag found — used package.json (${pkg}) as the baseline.`);
  }

  const reasoning =
    `Baseline (last published) ${effectiveBaseline}; payload of ${summary.total} commit(s) ` +
    `(${summary.userFacing.length} user-facing, ${summary.internalCount} internal) warrants a ${level} bump ` +
    `→ candidate ${candidate}. ` +
    (source === "staged"
      ? `package.json (${pkg}) already covers it, so releasing ${version}.`
      : `Releasing the derived ${version}.`);

  return {
    version,
    level,
    baseline: effectiveBaseline,
    candidate,
    pkgVersion: pkg,
    source,
    warnings,
    reasoning,
    drivers,
  };
}

// ── Rendering ────────────────────────────────────────────────────────────────────

const FIX_SCOPE_LABELS = {
  claude: "Claude",
  chatgpt: "ChatGPT",
  pi: "Pi",
  tts: "Voice output (TTS)",
  vad: "Voice detection",
  stt: "Transcription",
  settings: "Settings",
  ui: "Interface",
  telemetry: "Telemetry",
  audio: "Audio",
  auth: "Sign-in",
  i18n: "Translations",
  prefs: "Preferences",
};

function bullet(c) {
  const ref = c.pr ? ` (#${c.pr})` : "";
  return `- ${c.description}${ref}`;
}

/**
 * Render a data-driven changelog DIGEST from the payload. This is NOT the final store
 * copy — the skill rewrites the user-facing items into Say, Pi brand voice (see
 * references/brand-voice.md). The digest exists so that rewrite starts from facts.
 *
 * @param {object} args
 * @param {string} args.version
 * @param {string} args.dateISO   e.g. "2026-06-20" (caller supplies; lib is time-free)
 * @param {Commit[]} args.commits
 */
export function renderReleaseDigest({ version, dateISO, commits = [] }) {
  const summary = summarizePayload(commits);
  const feats = summary.userFacing.filter((c) => c.type === "feat");
  const fixes = summary.userFacing.filter((c) => c.type === "fix");
  const perf = summary.userFacing.filter((c) => c.type === "perf");

  const lines = [`# Changelog digest — v${version} (${dateISO})`, ""];
  lines.push(
    `_${summary.total} commits since the last release · ${summary.userFacing.length} user-facing, ` +
      `${summary.internalCount} under-the-hood. This is a factual digest; rewrite the user-facing items ` +
      `in brand voice for the stores._`,
    "",
  );

  if (feats.length) {
    lines.push("## ✨ New", ...feats.map(bullet), "");
  }
  if (perf.length) {
    lines.push("## ⚡ Performance", ...perf.map(bullet), "");
  }
  if (fixes.length) {
    lines.push("## 🐛 Fixes", ...fixes.map(bullet), "");
  }
  if (!feats.length && !perf.length && !fixes.length) {
    lines.push("_No user-facing changes detected — this is an internal/maintenance release._", "");
  }
  lines.push(
    `## 🔧 Under the hood`,
    `- ${summary.internalCount} internal change(s): tooling, tests, refactors, and docs.`,
    "",
  );
  return lines.join("\n");
}

/**
 * Render the per-store submission packet from store config + the final (voiced) release
 * notes. Pure string assembly — the CLI writes it to dist/submission-packet-v<x>.md.
 *
 * @param {object} args
 * @param {string} args.version
 * @param {string} args.dateISO
 * @param {string} args.baseline
 * @param {object} args.stores       Parsed stores.json
 * @param {string} args.releaseNotes Final, voiced "what's new" text (may be the digest if not yet written)
 * @param {string} [args.digest]     The factual digest, included for reference
 * @param {object} [args.summary]    summarizePayload() result, for the header
 */
export function renderPacket({ version, dateISO, baseline, stores, releaseNotes, digest, summary }) {
  const out = [];
  out.push(`# Say, Pi — submission packet v${version}`, "");
  out.push(`**Date:** ${dateISO}  ·  **Previous release:** v${baseline}`, "");
  if (summary) {
    out.push(
      `**Payload:** ${summary.total} commits — ${summary.userFacing.length} user-facing, ` +
        `${summary.internalCount} under-the-hood.`,
      "",
    );
  }
  out.push(
    "> One versioned build, submitted to every store the same day. Work top to bottom: Chrome → Edge → Firefox.",
    "> Steps that submit/publish are **irreversible once users auto-update** — they are yours to do, not an agent's.",
    "",
    "---",
    "",
  );

  out.push("## 📝 What's new (this release)", "", releaseNotes.trim(), "", "---", "");

  const order = stores.order || Object.keys(stores.stores || {});
  for (const key of order) {
    const s = (stores.stores || {})[key];
    if (!s) continue;
    out.push(`## ${s.displayName}`, "");

    const idBits = [];
    if (s.id) idBits.push(`**ID:** \`${s.id}\``);
    if (s.idTodo) idBits.push(`**ID:** _${s.idTodo}_`);
    if (idBits.length) out.push(idBits.join("  ·  "), "");

    out.push(`- **Upload:** \`${s.packageFile}\``);
    if (s.sourceArchiveFile) out.push(`- **Also upload (source):** \`${s.sourceArchiveFile}\``);
    out.push(`- **Dashboard:** ${s.dashboardUrl}`);
    if (s.listingUrl) out.push(`- **Live listing:** ${s.listingUrl}`);

    if (s.hasReleaseNotesField) {
      out.push(`- **Release-notes field:** yes → paste the "What's new" text above${s.releaseNotesLocation ? ` (${s.releaseNotesLocation})` : ""}.`);
    } else {
      out.push(`- **Release-notes field:** none — ${s.releaseNotesFallback || "no per-version changelog field on this store."}`);
    }
    if (s.reviewerNotesField) {
      out.push(`- **Reviewer notes:** ${s.reviewerNotes || "optional; describe the changes to speed review."}`);
    }
    if (typeof s.autoPublishOnApproval === "boolean") {
      out.push(
        `- **Go-live:** ${s.autoPublishOnApproval ? "**auto-publishes on approval** (submitting is the commit point — no manual go-live gate)." : "manual publish available after approval."}`,
      );
    }
    if (s.reviewEta) out.push(`- **Review ETA:** ${s.reviewEta}`);
    out.push("");

    if (Array.isArray(s.declarations) && s.declarations.length) {
      out.push("**Declarations to re-confirm** (see `doc/WEB_STORE_PERMISSIONS.md` for the canonical answers):");
      out.push(...s.declarations.map((d) => `- ${d}`), "");
    }

    if (Array.isArray(s.checklist) && s.checklist.length) {
      out.push("**Checklist:**");
      out.push(...s.checklist.map((c) => `- [ ] ${c}`), "");
    }

    if (Array.isArray(s.gotchas) && s.gotchas.length) {
      out.push("**Watch out:**");
      out.push(...s.gotchas.map((g) => `- ⚠️ ${g}`), "");
    }
    out.push("---", "");
  }

  if (digest) {
    out.push("## Appendix — factual changelog digest", "", digest.trim(), "");
  }
  return out.join("\n");
}

// ── Release-candidate verification (pure checks) ──────────────────────────────────
//
// These codify the manual checks that caught the 1.11.0 stale-build near-miss. The CLI
// (scripts/release.mjs `verify`, and `build` automatically) does the unzip/IO and calls
// these on the parsed manifests + archive entry lists. `issues` block the release;
// `warnings` are things to confirm.

/** The Chrome/Edge MV3 production permission set. Drift from this is flagged for review. */
export const EXPECTED_PROD_PERMISSIONS = [
  "storage",
  "cookies",
  "tabs",
  "contextMenus",
  "alarms",
  "offscreen",
  "audio",
  "identity",
];

/** Permissions that must NEVER appear in a production build (dev-only). */
export const DEV_ONLY_PERMISSIONS = ["downloads"];

/** @returns {{added: string[], removed: string[]}} actual-vs-expected permission diff. */
export function diffPermissions(actual = [], expected = EXPECTED_PROD_PERMISSIONS) {
  const e = new Set(expected);
  const a = new Set(actual);
  return {
    added: actual.filter((p) => !e.has(p)).sort(),
    removed: expected.filter((p) => !a.has(p)).sort(),
  };
}

/**
 * Check a built Chrome/Edge MV3 manifest.
 * @returns {{issues: string[], warnings: string[]}}
 */
export function checkChromeManifest(manifest = {}, version) {
  const issues = [];
  const warnings = [];
  if (manifest.version !== version) {
    issues.push(`Chrome manifest version is ${manifest.version}, expected ${version} (STALE BUILD?).`);
  }
  if (manifest.manifest_version !== 3) {
    issues.push(`Chrome manifest_version is ${manifest.manifest_version}, expected 3.`);
  }
  const perms = manifest.permissions || [];
  for (const dev of DEV_ONLY_PERMISSIONS) {
    if (perms.includes(dev)) issues.push(`Production build contains dev-only permission "${dev}".`);
  }
  const { added, removed } = diffPermissions(perms.filter((p) => !DEV_ONLY_PERMISSIONS.includes(p)));
  if (added.length) warnings.push(`Permission(s) ADDED vs the known set: ${added.join(", ")} — add justifications + expect extra review scrutiny.`);
  if (removed.length) warnings.push(`Permission(s) REMOVED vs the known set: ${removed.join(", ")} — confirm intended.`);
  return { issues, warnings };
}

/**
 * Check a built Firefox MV2 manifest.
 * @returns {{issues: string[], warnings: string[]}}
 */
export function checkFirefoxManifest(manifest = {}, version, geckoId = "gecko@saypi.ai") {
  const issues = [];
  const warnings = [];
  if (manifest.version !== version) {
    issues.push(`Firefox manifest version is ${manifest.version}, expected ${version} (STALE BUILD?).`);
  }
  if (manifest.manifest_version !== 2) {
    issues.push(`Firefox manifest_version is ${manifest.manifest_version}, expected 2 (MV2).`);
  }
  const gecko = manifest.browser_specific_settings?.gecko?.id;
  if (gecko !== geckoId) issues.push(`Firefox gecko id is "${gecko}", expected "${geckoId}".`);
  // The Firefox MV2 build strips Chrome-only permissions (wxt.config.ts); their presence
  // means the build didn't target Firefox correctly.
  for (const chromeOnly of ["offscreen", "audio"]) {
    if ((manifest.permissions || []).includes(chromeOnly)) {
      issues.push(`Firefox manifest must not include the "${chromeOnly}" permission (Chrome-only; stripped for MV2).`);
    }
  }
  return { issues, warnings };
}

/**
 * Check the AMO source archive's entry list (array of path strings).
 * @returns {{issues: string[], warnings: string[]}}
 */
export function checkSourceEntries(entries = []) {
  const issues = [];
  const warnings = [];
  const has = (re) => entries.some((e) => re.test(e));
  // Real secret files must never ship to AMO; templates ending in .example are fine.
  const secret = entries.filter((e) => /(^|\/)\.env(\.production)?$/.test(e));
  if (secret.length) issues.push(`Source archive contains secret env file(s): ${secret.join(", ")}.`);
  if (has(/(^|\/)node_modules\//)) issues.push(`Source archive contains node_modules/ (should be excluded).`);
  if (!has(/(^|\/)package-lock\.json$/)) issues.push(`Source archive is missing package-lock.json (AMO reviewers need it).`);
  if (!has(/(^|\/)src\//)) warnings.push(`Source archive has no src/ entries — confirm it contains the real sources.`);
  return { issues, warnings };
}

/**
 * Pick the release commit for a version from a list of candidates. The CLI gathers candidates
 * (commits whose message is the version bump) and reads each one's package.json version; this
 * returns the SHA of the first candidate whose version matches — so we tag the EXACT commit a
 * release was built from, not whatever HEAD happens to be after later merges moved main.
 *
 * @param {{sha: string, version: string}[]} candidates
 * @param {string} version
 * @returns {string|null}
 */
export function chooseReleaseCommit(candidates = [], version) {
  const target = parseSemver(version) ? formatSemver(parseSemver(version)) : version;
  const match = candidates.find((c) => {
    const v = parseSemver(c.version) ? formatSemver(parseSemver(c.version)) : c.version;
    return v === target;
  });
  return match ? match.sha : null;
}
