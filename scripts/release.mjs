#!/usr/bin/env node
/**
 * release — CLI for the `release-extension` skill.
 *
 * Glues the pure logic in release-lib.mjs to git/fs and the existing, trusted build
 * scripts (package-extension.sh, `npm run source-archive`). It does NOT reimplement the
 * build. See .claude/skills/release-extension/SKILL.md for the operated runbook.
 *
 *   node scripts/release.mjs preflight        # read-only: repo/tooling/version state
 *   node scripts/release.mjs plan [--save]    # read-only: derive version + changelog digest
 *   node scripts/release.mjs packet [--version X]  # write dist/submission-packet-v<x>.md
 *   node scripts/release.mjs bump [version] --yes  # set package.json version (no git tag)
 *   node scripts/release.mjs build --yes           # founder-only: build + package all stores
 *   node scripts/release.mjs tag [version] --yes   # founder-only: create the release tag
 *   node scripts/release.mjs finalize [version] --yes  # founder-only: push commit + tag
 *
 * SAFETY (see AGENTS.md): release is founder-only and irreversible once users auto-update.
 * `preflight`/`plan`/`packet` are read-only/safe. `bump` mutates package.json. `build`
 * loads .env.production. `tag`/`finalize` touch shared git history. The latter four refuse
 * to run without --yes and must be operated by the founder, never autonomously.
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync, rmSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve as resolvePath } from "node:path";
import {
  categorizeCommits,
  summarizePayload,
  decideVersion,
  renderReleaseDigest,
  renderPacket,
  parseSemver,
  compareSemver,
  formatSemver,
  checkChromeManifest,
  checkFirefoxManifest,
  checkSourceEntries,
  chooseReleaseCommit,
  PUBLISH_STORES,
} from "./release-lib.mjs";
import { submitToStore } from "./release-publish.mjs";

const repoRoot = resolvePath(dirname(fileURLToPath(import.meta.url)), "..");
const STORES_PATH = join(repoRoot, "doc", "release", "stores.json");
const RELEASE_NOTES_PATH = join(repoRoot, "_locales", "en", "release_notes.txt");
const DIST = join(repoRoot, "dist");

const C = { reset: "\x1b[0m", red: "\x1b[31m", green: "\x1b[32m", yellow: "\x1b[33m", dim: "\x1b[2m", bold: "\x1b[1m" };
const log = (m) => console.log(m);
const ok = (m) => console.log(`${C.green}✓${C.reset} ${m}`);
const warn = (m) => console.log(`${C.yellow}⚠${C.reset}  ${m}`);
const bad = (m) => console.log(`${C.red}✘${C.reset} ${m}`);
const dateISO = () => new Date().toISOString().slice(0, 10);

function git(args, { allowFail = false } = {}) {
  try {
    return execFileSync("git", args, { cwd: repoRoot, encoding: "utf8" }).trim();
  } catch (e) {
    if (allowFail) return "";
    throw e;
  }
}

function pkgVersion() {
  return JSON.parse(readFileSync(join(repoRoot, "package.json"), "utf8")).version;
}

/** Highest published version tag (vX.Y.Z), or null if there are none. */
function baselineTag() {
  const tags = git(["tag", "-l", "v*"], { allowFail: true }).split("\n").filter(Boolean);
  const semvers = tags.map((t) => parseSemver(t)).filter(Boolean).map(formatSemver);
  if (!semvers.length) return null;
  return semvers.sort(compareSemver).at(-1);
}

/** Categorized commits since the baseline tag (or all of HEAD if no tag). */
function payloadSince(baseline) {
  const range = baseline ? `v${baseline}..HEAD` : "HEAD";
  const out = git(["log", range, "--oneline", "--no-merges"], { allowFail: true });
  return categorizeCommits(out);
}

function loadStores() {
  if (!existsSync(STORES_PATH)) throw new Error(`stores config not found at ${STORES_PATH}`);
  return JSON.parse(readFileSync(STORES_PATH, "utf8"));
}

function gather() {
  const baseline = baselineTag();
  const pkg = pkgVersion();
  const commits = payloadSince(baseline);
  const decision = decideVersion({ baseline, pkgVersion: pkg, commits });
  const summary = summarizePayload(commits);
  return { baseline, pkg, commits, decision, summary };
}

// ── Commands ──────────────────────────────────────────────────────────────────────

function cmdPreflight() {
  log(`${C.bold}Release preflight${C.reset}\n`);
  let problems = 0;

  const branch = git(["rev-parse", "--abbrev-ref", "HEAD"], { allowFail: true });
  branch === "main" ? ok(`on main`) : warn(`on "${branch}" — a real release is cut from main`);

  const dirty = git(["status", "--porcelain"], { allowFail: true });
  dirty ? warn(`working tree has uncommitted changes`) : ok(`working tree clean`);

  const head = git(["rev-parse", "HEAD"], { allowFail: true });
  const origin = git(["rev-parse", "origin/main"], { allowFail: true });
  if (head && origin) {
    head === origin ? ok(`HEAD == origin/main`) : warn(`HEAD != origin/main (push/pull before releasing)`);
  } else {
    warn(`could not compare HEAD to origin/main`);
  }

  for (const tool of ["node", "npm", "jq", "zip", "unzip", "cmp"]) {
    try {
      execFileSync("which", [tool], { stdio: "ignore" });
      ok(`${tool} available`);
    } catch {
      bad(`${tool} NOT found${tool === "jq" ? " (needed for the Firefox build)" : ""}`);
      problems++;
    }
  }

  existsSync(join(repoRoot, ".env.production"))
    ? ok(`.env.production present (existence only — never read by this tool)`)
    : (bad(`.env.production missing — production build will fail`), problems++);

  // Optional: latest test workflow status via gh.
  try {
    const out = execFileSync(
      "gh",
      ["run", "list", "--branch", "main", "--workflow", "test.yaml", "--limit", "1", "--json", "conclusion,status"],
      { cwd: repoRoot, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    );
    const [run] = JSON.parse(out);
    if (run?.conclusion === "success") ok(`latest test.yaml on main: success`);
    else if (run) warn(`latest test.yaml on main: ${run.status}/${run.conclusion ?? "pending"}`);
  } catch {
    log(`${C.dim}  (gh unavailable — skipped CI status check)${C.reset}`);
  }

  const { baseline, pkg, decision } = gather();
  log(`\n${C.bold}Version state${C.reset}`);
  log(`  published baseline: ${baseline ? "v" + baseline : "(none)"}`);
  log(`  package.json:       ${pkg}`);
  log(`  → would release:    ${C.bold}${decision.version}${C.reset} (${decision.level}, ${decision.source})`);
  decision.warnings.forEach(warn);

  log("");
  if (problems) {
    bad(`${problems} blocking issue(s) — resolve before releasing.`);
    process.exit(1);
  }
  ok(`Preflight looks releasable. Next: \`node scripts/release.mjs plan\`.`);
}

function cmdPlan({ save }) {
  const { baseline, pkg, commits, decision, summary } = gather();
  log(`${C.bold}Release plan${C.reset}\n`);
  log(`  published baseline: ${baseline ? "v" + baseline : "(none)"}`);
  log(`  package.json:       ${pkg}`);
  log(`  payload:            ${summary.total} commits — ${summary.userFacing.length} user-facing, ${summary.internalCount} internal`);
  log(`  ${C.bold}proposed version:   ${decision.version}${C.reset} (${decision.level} bump, source: ${decision.source})`);
  log(`  ${C.dim}${decision.reasoning}${C.reset}`);
  decision.warnings.forEach(warn);
  if (decision.drivers.length) {
    log(`\n  ${decision.level} driven by:`);
    decision.drivers.slice(0, 12).forEach((c) => log(`    - ${c.description}${c.pr ? ` (#${c.pr})` : ""}`));
  }

  const digest = renderReleaseDigest({ version: decision.version, dateISO: dateISO(), commits });
  log(`\n${"─".repeat(70)}\n`);
  log(digest);

  if (save) {
    mkdirSync(DIST, { recursive: true });
    const p = join(DIST, `release-notes-draft-v${decision.version}.md`);
    writeFileSync(p, digest);
    ok(`Saved changelog digest → ${p}`);
    log(`${C.dim}  Rewrite the user-facing items in brand voice → _locales/en/release_notes.txt${C.reset}`);
  }
}

function cmdPacket({ version }) {
  const { baseline, commits, decision, summary } = gather();
  const v = version || decision.version;
  const stores = loadStores();
  const digest = renderReleaseDigest({ version: v, dateISO: dateISO(), commits });

  // Prefer the founder-voiced release notes; fall back to the factual digest.
  let releaseNotes;
  if (existsSync(RELEASE_NOTES_PATH)) {
    releaseNotes = readFileSync(RELEASE_NOTES_PATH, "utf8").trim();
    log(`${C.dim}Using voiced release notes from _locales/en/release_notes.txt${C.reset}`);
  } else {
    releaseNotes = digest;
    warn(`No _locales/en/release_notes.txt yet — packet uses the factual digest as a placeholder.`);
  }

  const md = renderPacket({ version: v, dateISO: dateISO(), baseline: baseline || "?", stores, releaseNotes, digest, summary });
  mkdirSync(DIST, { recursive: true });
  const p = join(DIST, `submission-packet-v${v}.md`);
  writeFileSync(p, md);
  ok(`Wrote submission packet → ${p}`);
}

function requireYes(cmd, flags) {
  if (!flags.yes) {
    // `cmd` is the subcommand plus any positional, e.g. "bump" or "submit chrome".
    // Show the npm-correct form too: via `npm run`, flags MUST follow a `--` separator,
    // or npm swallows them and a bare `--yes`/`--dry-run` silently never reaches this script.
    const [sub, ...rest] = cmd.split(" ");
    const npmHint = `npm run release:${sub} -- ${[...rest, "--yes"].join(" ")}`;
    bad(`\`${cmd}\` mutates state and is founder-only. Re-run with --yes once you've reviewed the plan.`);
    warn(`Via npm, flags need a \`--\` separator: ${npmHint}`);
    warn(`Release is irreversible once users auto-update (AGENTS.md). Never run this autonomously.`);
    process.exit(2);
  }
}

function cmdBump({ version, yes }) {
  requireYes("bump", { yes });
  const { decision } = gather();
  const v = version || decision.version;
  const cmp = compareSemver(v, pkgVersion());
  if (cmp === 0) {
    ok(`package.json is already at ${v} — nothing to bump.`);
    return;
  }
  if (cmp < 0) {
    bad(`Refusing to downgrade package.json (${pkgVersion()}) to ${v}.`);
    process.exit(2);
  }
  execFileSync("npm", ["version", v, "--no-git-tag-version"], { cwd: repoRoot, stdio: "inherit" });
  ok(`Bumped package.json to ${v} (no git tag created). Commit this with the release.`);
}

/** Releases are cut from main; tag/finalize refuse to run anywhere else. */
function assertOnMain(cmd) {
  const branch = git(["rev-parse", "--abbrev-ref", "HEAD"], { allowFail: true });
  if (branch !== "main") {
    bad(`\`${cmd}\` must run on main (currently on "${branch || "?"}"). Releases are cut from main.`);
    process.exit(2);
  }
}

function cmdBuild({ yes, version }) {
  requireYes("build", { yes });
  const v = version || pkgVersion();
  // Loud, unambiguous: the stale-build near-miss happened because a build ran in a different
  // checkout. Print exactly what/where, and clear stale output so nothing carries over.
  log(`${C.bold}Building v${v}${C.reset} from ${repoRoot}`);
  if (pkgVersion() !== v) {
    bad(`package.json is ${pkgVersion()} but you asked to build ${v}. Bump first (or drop --version).`);
    process.exit(2);
  }
  warn(`This runs the production build (loads .env.production) and packages all stores.`);
  for (const stale of [".output", "dist", "source-code.zip"]) {
    rmSync(join(repoRoot, stale), { recursive: true, force: true });
  }
  execFileSync("bash", [join(repoRoot, "package-extension.sh"), "chrome", "edge", "firefox"], {
    cwd: repoRoot,
    stdio: "inherit",
  });
  execFileSync("npm", ["run", "source-archive"], { cwd: repoRoot, stdio: "inherit" });
  ok(`Built + packaged: dist/saypi.chrome.zip, dist/saypi.edge.zip, dist/saypi.firefox.xpi, source-code.zip`);
  log(`\n${C.bold}Verifying the release candidates…${C.reset}`);
  const clean = verifyArtifacts(v);
  if (!clean) {
    bad(`Build verification FAILED — do NOT submit these artifacts. See issues above.`);
    process.exit(1);
  }
}

// ── Artifact verification ─────────────────────────────────────────────────────────

/** Parse manifest.json out of a zip/xpi (without extracting). */
function manifestFromZip(zipPath) {
  const raw = execFileSync("unzip", ["-p", zipPath, "manifest.json"], { cwd: repoRoot, encoding: "utf8" });
  return JSON.parse(raw);
}

/** List entry paths inside a zip. */
function zipEntries(zipPath) {
  return execFileSync("unzip", ["-Z1", zipPath], { cwd: repoRoot, encoding: "utf8" })
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Verify the built release candidates against the target version. Returns true if clean
 * (no hard issues). Codifies the manual checks from the 1.11.0 wet run.
 */
function verifyArtifacts(version) {
  const chromeZip = join(DIST, "saypi.chrome.zip");
  const edgeZip = join(DIST, "saypi.edge.zip");
  const firefoxXpi = join(DIST, "saypi.firefox.xpi");
  const sourceZip = join(repoRoot, "source-code.zip");

  const allIssues = [];
  const allWarnings = [];
  const note = (label, { issues, warnings }) => {
    issues.forEach((i) => allIssues.push(`[${label}] ${i}`));
    warnings.forEach((w) => allWarnings.push(`[${label}] ${w}`));
  };

  for (const [label, p] of [["chrome.zip", chromeZip], ["edge.zip", edgeZip], ["firefox.xpi", firefoxXpi], ["source-code.zip", sourceZip]]) {
    if (!existsSync(p)) allIssues.push(`[${label}] missing — run \`build\` first.`);
  }
  if (allIssues.length) {
    allIssues.forEach(bad);
    return false;
  }

  // Read each archive defensively: a corrupt/unreadable zip becomes a clean failure on the
  // same reporting path, not an uncaught stack trace.
  try { note("chrome", checkChromeManifest(manifestFromZip(chromeZip), version)); }
  catch (e) { allIssues.push(`[chrome] could not read manifest: ${e.message}`); }
  try { note("firefox", checkFirefoxManifest(manifestFromZip(firefoxXpi), version)); }
  catch (e) { allIssues.push(`[firefox] could not read manifest: ${e.message}`); }
  try { note("source", checkSourceEntries(zipEntries(sourceZip))); }
  catch (e) { allIssues.push(`[source] could not read entries: ${e.message}`); }

  // Edge must be a byte-identical copy of Chrome.
  try {
    execFileSync("cmp", ["-s", chromeZip, edgeZip]);
    ok(`edge.zip is byte-identical to chrome.zip`);
  } catch {
    allIssues.push(`[edge] edge.zip differs from chrome.zip (should be an identical copy).`);
  }

  // Freshness: the artifacts should be newer than package.json (else they predate the bump).
  const pkgMtime = statSync(join(repoRoot, "package.json")).mtimeMs;
  for (const [label, p] of [["chrome.zip", chromeZip], ["firefox.xpi", firefoxXpi]]) {
    const m = statSync(p).mtimeMs;
    if (m < pkgMtime) allWarnings.push(`[${label}] is OLDER than package.json — possible stale build.`);
  }

  allIssues.forEach(bad);
  allWarnings.forEach(warn);
  if (!allIssues.length) {
    ok(`All archives report version ${version}; permissions, manifests, and source archive look good.`);
  }
  return allIssues.length === 0;
}

function cmdVerify({ version }) {
  const v = version || gather().decision.version;
  log(`${C.bold}Verifying release candidates for v${v}…${C.reset}\n`);
  if (!verifyArtifacts(v)) {
    bad(`Verification FAILED — do NOT submit these artifacts.`);
    process.exit(1);
  }
  ok(`Release candidates verified.`);
}

function versionAtCommit(ref) {
  try {
    return JSON.parse(execFileSync("git", ["show", `${ref}:package.json`], { cwd: repoRoot, encoding: "utf8" })).version;
  } catch {
    return null;
  }
}

/**
 * Resolve the EXACT commit a release was built from — the version-bump commit (matched by message)
 * whose package.json equals the version. Falls back to HEAD only if HEAD's package.json matches.
 * Returns null if nothing matches, so we never tag the wrong commit after concurrent merges move main.
 */
function resolveReleaseCommit(version) {
  const shas = git(["log", "--grep", `Version bump to v${version}`, "--format=%H", "-n", "30"], { allowFail: true })
    .split("\n")
    .filter(Boolean);
  const candidates = shas.map((sha) => ({ sha, version: versionAtCommit(sha) })).filter((c) => c.version);
  const chosen = chooseReleaseCommit(candidates, version);
  if (chosen) return chosen;
  const head = git(["rev-parse", "HEAD"], { allowFail: true });
  if (head && versionAtCommit("HEAD") === version) return head;
  return null;
}

function cmdTag({ version, yes }) {
  requireYes("tag", { yes });
  assertOnMain("tag");
  const v = version || pkgVersion();
  const tag = `v${v}`;
  const commit = resolveReleaseCommit(v);
  if (!commit) {
    bad(`Could not find the v${v} release commit (no "Version bump to v${v}" commit and HEAD's package.json isn't ${v}). Bump + commit the release first.`);
    process.exit(2);
  }
  // Tag the resolved release commit explicitly (NOT HEAD — concurrent merges may have moved main).
  // `git tag` (no -f) refuses to clobber an existing tag, so re-tagging a released version fails loudly.
  execFileSync("git", ["tag", tag, commit], { cwd: repoRoot, stdio: "inherit" });
  ok(`Created tag ${tag} → ${commit.slice(0, 7)} (the v${v} release commit). Push with \`finalize\`.`);
}

function cmdFinalize({ version, yes, ghRelease }) {
  requireYes("finalize", { yes });
  assertOnMain("finalize");
  const v = version || pkgVersion();
  const tag = `v${v}`;
  if (!git(["tag", "-l", tag], { allowFail: true })) {
    bad(`Tag ${tag} does not exist locally — run \`tag ${v} --yes\` first.`);
    process.exit(2);
  }
  // Push the release commit and tag together, explicitly to origin/main (not the default remote).
  execFileSync("git", ["push", "origin", "main", tag], { cwd: repoRoot, stdio: "inherit" });
  ok(`Pushed origin/main and tag ${tag}.`);
  if (ghRelease) createGhRelease(v, tag);
  else log(`${C.dim}  (skipped GitHub release; create with \`gh release create ${tag} --notes-file _locales/en/release_notes.txt\`)${C.reset}`);
}

/** Cut a GitHub release from the voiced notes (best-effort; --no-gh-release opts out). */
function createGhRelease(v, tag) {
  const notes = existsSync(RELEASE_NOTES_PATH) ? RELEASE_NOTES_PATH : join(DIST, `release-notes-draft-v${v}.md`);
  if (!existsSync(notes)) {
    warn(`No release notes found (${RELEASE_NOTES_PATH} or dist draft) — skipping GitHub release.`);
    return;
  }
  try {
    execFileSync("gh", ["release", "create", tag, "--title", tag, "--notes-file", notes, "--verify-tag", "--latest"], {
      cwd: repoRoot,
      stdio: "inherit",
    });
    ok(`Created GitHub release ${tag} (you can refine its title/body on GitHub).`);
  } catch (e) {
    warn(`Could not create the GitHub release (${e.message}); create it manually if wanted.`);
  }
}

/**
 * ⛔ Submit a built artifact to a store via its publishing API (#412). The most dangerous
 * command: a real submit publishes to a live store. `--dry-run` only auth-checks (no publish);
 * a real submit requires --yes and is founder-only. Credentials come from env (founder-provided).
 */
async function cmdSubmit({ store, version, yes, dryRun }) {
  if (!PUBLISH_STORES.includes(store)) {
    bad(`\`submit\` needs a store: ${PUBLISH_STORES.join(" | ")} (e.g. \`npm run release:submit -- chrome --dry-run\`).`);
    process.exit(2);
  }
  if (!dryRun) requireYes(`submit ${store}`, { yes });
  const v = version || pkgVersion();
  log(`${C.bold}${dryRun ? "Dry-run" : "Submitting"} ${store} — v${v}${C.reset}`);
  const releaseNotes = existsSync(RELEASE_NOTES_PATH) ? readFileSync(RELEASE_NOTES_PATH, "utf8").trim() : "";
  const approvalNotes =
    "Built with Node >=22 / npm >=10: `npm ci && npm run build:firefox`. Source in source-code.zip " +
    "(pre-minification). The onnxruntime eval() is in the WASM-unused fallback path and is never executed.";
  try {
    const result = await submitToStore(store, {
      env: process.env,
      dryRun,
      log,
      notes: `Automated release of v${v}.`,
      releaseNotes,
      approvalNotes,
    });
    ok(result);
  } catch (e) {
    bad(`${store} submission failed: ${e.message}`);
    process.exit(1);
  }
}

// ── Entry ───────────────────────────────────────────────────────────────────────

async function main() {
  const argv = process.argv.slice(2);
  const command = argv[0];
  const flags = {
    yes: argv.includes("--yes"),
    save: argv.includes("--save"),
    dryRun: argv.includes("--dry-run"),
    ghRelease: !argv.includes("--no-gh-release"),
    store: argv[1] && !argv[1].startsWith("-") ? argv[1] : null,
    version: (() => {
      const i = argv.indexOf("--version");
      if (i >= 0 && argv[i + 1]) return argv[i + 1].replace(/^v/, "");
      // positional version for bump/tag/finalize
      const pos = argv[1];
      if (pos && /^v?\d+\.\d+\.\d+$/.test(pos)) return pos.replace(/^v/, "");
      return null;
    })(),
  };

  switch (command) {
    case "preflight":
      return cmdPreflight();
    case "plan":
    case "dry-run":
      return cmdPlan(flags);
    case "packet":
      return cmdPacket(flags);
    case "bump":
      return cmdBump(flags);
    case "build":
      return cmdBuild(flags);
    case "verify":
      return cmdVerify(flags);
    case "tag":
      return cmdTag(flags);
    case "finalize":
      return cmdFinalize(flags);
    case "submit":
      return cmdSubmit(flags);
    default:
      log(`Usage: node scripts/release.mjs <preflight|plan|packet|bump|build|verify|tag|finalize|submit> [--save] [--version X] [--dry-run] [--yes]`);
      log(`       submit <chrome|edge|firefox> [--dry-run | --yes]   # ⛔ founder-only API submission (#412)`);
      log(`Via npm, put flags after \`--\` or npm drops them, e.g. \`npm run release:submit -- chrome --dry-run\`.`);
      process.exit(command ? 1 : 0);
  }
}

main().catch((e) => {
  bad(e?.message || String(e));
  process.exit(1);
});
