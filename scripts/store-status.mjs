#!/usr/bin/env node
/**
 * store-status — READ-ONLY store-review status check for all three web stores (#529).
 *
 *   node scripts/store-status.mjs [--json] [--stall-days N]     (npm run release:status)
 *   node scripts/store-status.mjs --freshness [--json]          (npm run release:freshness, #534)
 *
 * `--freshness` reuses the same per-store credential probes but reports CREDENTIAL
 * health instead of review state: does each publishing credential still work, when was
 * it last verified (state kept in the gitignored .credential-freshness.json), and — for
 * Edge, whose ~72-day API-key expiry the API can't report — a countdown computed from
 * the founder-recorded EDGE_KEY_ISSUED. Rotation runbook: doc/release/publishing-
 * credentials.md ("Rotation & lifetimes"). Exit 1 only on EXPIRED/ERROR; SKIPPED and
 * EXPIRING_SOON exit 0 (the #525 weekly routine consumes --json and pings the founder).
 *
 * For each store in doc/release/stores.json it hits read-only status endpoints with the
 * SAME credentials `release:submit` uses (env vars / .env.publish — see
 * doc/release/publishing-credentials.md) and prints a compact table: live version,
 * review state, last update, and a stall flag when a submission has been in review —
 * or a store has lagged the latest release tag — longer than the threshold (default 14
 * days). A store whose credentials are absent is reported as SKIPPED (exit 0), so the
 * command degrades gracefully; only a failed check (bad auth, network, unexpected
 * response) exits 1.
 *
 * SAFETY: this command never uploads, publishes, or mutates anything — every request is
 * a GET (plus the OAuth token POST for Chrome and a GET credentials probe for Edge).
 * It reads only process.env / .env.publish (never .env.production) and logs only the
 * NAMES of env vars, never values.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve as resolvePath } from "node:path";
import {
  requireEnv,
  CWS_ENV,
  CWS_TOKEN_URL,
  cwsTokenBody,
  cwsStatusUrl,
  cwsErrorMessage,
  EDGE_ENV,
  edgeHeaders,
  edgeUploadPollUrl,
  AMO_ENV,
  parseSemver,
  formatSemver,
  compareSemver,
} from "./release-lib.mjs";
import {
  STATUS_STORES,
  missingCreds,
  skippedRecord,
  errorRecord,
  normalizeChromeStatus,
  normalizeEdgeStatus,
  normalizeAmoStatus,
  computeStalls,
  renderStatusTable,
  amoAuthHeader,
  edgeCrxIdFromListingUrl,
  isFinalSemver,
  freshnessSkipped,
  freshnessError,
  classifyCwsTokenFreshness,
  classifyEdgeProbeFreshness,
  classifyAmoProbeFreshness,
  edgeKeyCountdown,
  applyEdgeCountdown,
  applyFreshnessHistory,
  nextFreshnessState,
  renderFreshnessTable,
  freshnessExitCode,
} from "./store-status-lib.mjs";

const repoRoot = resolvePath(dirname(fileURLToPath(import.meta.url)), "..");
const STORES_PATH = join(repoRoot, "doc", "release", "stores.json");
// Gitignored, founder-provided publishing credentials — the same file `release:submit`
// auto-loads (scripts/release.mjs loadPublishEnv; parser mirrored here so release.mjs
// stays untouched). Never .env.production.
const ENV_PUBLISH_PATH = join(repoRoot, ".env.publish");
const FETCH_TIMEOUT_MS = 15_000;

const info = (m) => console.error(m); // status/log lines → stderr; report → stdout

function loadPublishEnv() {
  if (!existsSync(ENV_PUBLISH_PATH)) return 0;
  const loaded = [];
  for (const raw of readFileSync(ENV_PUBLISH_PATH, "utf8").split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const m = line.match(/^(?:export\s+)?([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!m) continue;
    const [, key, rawVal] = m;
    if (key in process.env) continue; // explicit shell env takes precedence
    process.env[key] = rawVal.replace(/^(['"])(.*)\1$/, "$2");
    loaded.push(key);
  }
  if (loaded.length) info(`Loaded ${loaded.length} credential(s) from .env.publish: ${loaded.join(", ")}`);
  return loaded.length;
}

async function getJson(url, init = {}) {
  const res = await fetch(url, { ...init, signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
  const json = await res.json().catch(() => ({}));
  return { res, json };
}

/** Latest release tag (vX.Y.Z) + its commit date, for the release-lag stall heuristic. */
function latestReleaseFromGit() {
  try {
    // Final release tags only — prerelease tags (v1.14.0-rc.1) must not become the
    // lag-heuristic baseline (parseSemver alone would truncate them to a final).
    const tags = execFileSync("git", ["tag", "-l", "v*"], { cwd: repoRoot, encoding: "utf8" })
      .split("\n")
      .map((t) => t.trim())
      .filter(isFinalSemver)
      .map((t) => formatSemver(parseSemver(t)));
    if (!tags.length) return null;
    const version = tags.sort(compareSemver).at(-1);
    const date = execFileSync("git", ["log", "-1", "--format=%cI", `v${version}`], {
      cwd: repoRoot,
      encoding: "utf8",
    }).trim();
    return date ? { version, date } : null;
  } catch {
    return null;
  }
}

// ── Per-store checks (all read-only) ───────────────────────────────────────────────

async function checkChrome(env) {
  const e = requireEnv(CWS_ENV, env);
  const { res: tokRes, json: tok } = await getJson(CWS_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: cwsTokenBody({ clientId: e.CWS_CLIENT_ID, clientSecret: e.CWS_CLIENT_SECRET, refreshToken: e.CWS_REFRESH_TOKEN }),
  });
  if (!tokRes.ok || !tok.access_token) throw new Error(`auth failed: ${cwsErrorMessage(tok)}`);
  const { res, json } = await getJson(cwsStatusUrl(e.CWS_PUBLISHER_ID, e.CWS_EXTENSION_ID), {
    headers: { Authorization: `Bearer ${tok.access_token}` },
  });
  if (!res.ok) throw new Error(`fetchStatus failed: ${cwsErrorMessage(json)}`);
  return normalizeChromeStatus(json);
}

async function checkEdge(env, stores) {
  const e = requireEnv(EDGE_ENV, env);
  // 1. Credentials probe (same read-only probe `release:submit --dry-run` uses): a GET on a
  //    poll URL with a dummy operation id — 401 = key rejected/expired (~72-day expiry).
  const probe = await fetch(edgeUploadPollUrl(e.EDGE_PRODUCT_ID, "00000000-0000-0000-0000-000000000000"), {
    headers: edgeHeaders({ apiKey: e.EDGE_API_KEY, clientId: e.EDGE_CLIENT_ID }),
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (probe.status === 401) {
    throw new Error("publish-API credentials rejected (401) — EDGE_API_KEY expires every ~72 days; rotate in Partner Center.");
  }
  // 2. Live listing state from the public product-details endpoint (the publish API has no
  //    read-only status endpoint). The listing crx id comes from stores.json's listingUrl.
  const crxId = edgeCrxIdFromListingUrl(stores?.stores?.edge?.listingUrl);
  if (!crxId) throw new Error("could not derive the Edge listing crx id from stores.json listingUrl");
  const { res, json } = await getJson(`https://microsoftedge.microsoft.com/addons/getproductdetailsbycrxid/${crxId}`);
  if (!res.ok) throw new Error(`product details failed (HTTP ${res.status})`);
  const record = normalizeEdgeStatus(json);
  record.notes.unshift(`publish-API credentials accepted (probe HTTP ${probe.status})`);
  return record;
}

async function checkFirefox(env, stores) {
  const e = requireEnv(AMO_ENV, env);
  const guid = stores?.stores?.firefox?.id || "gecko@saypi.ai";
  const auth = () => ({ Authorization: amoAuthHeader({ issuer: e.WEB_EXT_API_KEY, secret: e.WEB_EXT_API_SECRET }) });
  const base = `https://addons.mozilla.org/api/v5/addons/addon/${encodeURIComponent(guid)}`;
  const { res, json: addon } = await getJson(`${base}/`, { headers: auth() });
  if (!res.ok) throw new Error(`addon detail failed (HTTP ${res.status}${addon.detail ? `: ${addon.detail}` : ""})`);
  // The versions list (with unlisted/unreviewed entries) needs developer auth; tolerate
  // failure so a scope problem degrades to detail-only rather than an ERROR record.
  let versions = null;
  const v = await getJson(`${base}/versions/?filter=all_with_unlisted&page_size=25`, { headers: auth() }).catch(() => null);
  if (v?.res?.ok) versions = v.json;
  const record = normalizeAmoStatus(addon, versions);
  if (!versions) record.notes.push("versions list unavailable — review-queue visibility limited to the public listing");
  return record;
}

const CHECKS = { chrome: checkChrome, edge: checkEdge, firefox: checkFirefox };

// ── Per-store credential-freshness probes (#534 — all read-only) ─────────────────────

async function probeChromeFreshness(env) {
  const e = requireEnv(CWS_ENV, env);
  const { res, json } = await getJson(CWS_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: cwsTokenBody({ clientId: e.CWS_CLIENT_ID, clientSecret: e.CWS_CLIENT_SECRET, refreshToken: e.CWS_REFRESH_TOKEN }),
  });
  return classifyCwsTokenFreshness(json, res.ok);
}

async function probeEdgeFreshness(env) {
  const e = requireEnv(EDGE_ENV, env);
  const probe = await fetch(edgeUploadPollUrl(e.EDGE_PRODUCT_ID, "00000000-0000-0000-0000-000000000000"), {
    headers: edgeHeaders({ apiKey: e.EDGE_API_KEY, clientId: e.EDGE_CLIENT_ID }),
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  // EDGE_KEY_ISSUED (optional, .env.publish): the day the key was created in Partner
  // Center — the API cannot report a key's expiry date, so the countdown is manual.
  return applyEdgeCountdown(classifyEdgeProbeFreshness(probe.status), edgeKeyCountdown({ issued: env.EDGE_KEY_ISSUED }));
}

async function probeFirefoxFreshness(env, stores) {
  const e = requireEnv(AMO_ENV, env);
  const guid = stores?.stores?.firefox?.id || "gecko@saypi.ai";
  // The unlisted-inclusive versions list REQUIRES developer auth, so it's a true
  // credential probe (the public addon detail would succeed with a missing header).
  const url = `https://addons.mozilla.org/api/v5/addons/addon/${encodeURIComponent(guid)}/versions/?filter=all_with_unlisted&page_size=1`;
  const res = await fetch(url, {
    headers: { Authorization: amoAuthHeader({ issuer: e.WEB_EXT_API_KEY, secret: e.WEB_EXT_API_SECRET }) },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  return classifyAmoProbeFreshness(res.status);
}

const FRESHNESS_PROBES = { chrome: probeChromeFreshness, edge: probeEdgeFreshness, firefox: probeFirefoxFreshness };

// Last-verified history — timestamps only, no secrets; gitignored local state.
const FRESHNESS_STATE_PATH = join(repoRoot, ".credential-freshness.json");

function loadFreshnessState() {
  try {
    return existsSync(FRESHNESS_STATE_PATH) ? JSON.parse(readFileSync(FRESHNESS_STATE_PATH, "utf8")) : {};
  } catch {
    return {};
  }
}

async function runFreshness(asJson) {
  const now = new Date();
  const stores = existsSync(STORES_PATH) ? JSON.parse(readFileSync(STORES_PATH, "utf8")) : null;

  const records = [];
  for (const store of STATUS_STORES) {
    const missing = missingCreds(store, process.env);
    if (missing.length) {
      info(`${store}: SKIPPED (missing env: ${missing.join(", ")})`);
      records.push(freshnessSkipped(store, missing));
      continue;
    }
    try {
      info(`${store}: probing credentials…`);
      records.push(await FRESHNESS_PROBES[store](process.env, stores));
    } catch (e) {
      records.push(freshnessError(store, e?.message || String(e)));
    }
  }

  const state = loadFreshnessState();
  const annotated = applyFreshnessHistory(records, state, now);
  writeFileSync(FRESHNESS_STATE_PATH, JSON.stringify(nextFreshnessState(state, records, now), null, 2) + "\n");

  if (asJson) {
    console.log(JSON.stringify({ generatedAt: now.toISOString(), mode: "freshness", stores: annotated }, null, 2));
  } else {
    console.log("");
    console.log(renderFreshnessTable(annotated));
  }

  const attention = annotated.filter((r) => r.status === "EXPIRED" || r.status === "EXPIRING_SOON");
  if (attention.length) {
    info(
      `\n⚠ ${attention.length} credential(s) need rotation — founder action; see ` +
        `doc/release/publishing-credentials.md ("Rotation & lifetimes").`,
    );
  }
  process.exit(freshnessExitCode(annotated));
}

// ── Entry ───────────────────────────────────────────────────────────────────────────

async function main() {
  const argv = process.argv.slice(2);
  const asJson = argv.includes("--json");
  if (argv.includes("--freshness")) {
    loadPublishEnv();
    await runFreshness(asJson);
    return;
  }
  const stallDaysArg = argv[argv.indexOf("--stall-days") + 1];
  const stallDays = argv.includes("--stall-days") ? Number(stallDaysArg) : 14;
  if (!Number.isFinite(stallDays) || stallDays <= 0) {
    console.error(`Invalid --stall-days "${stallDaysArg}" — expected a positive number.`);
    process.exit(2);
  }

  loadPublishEnv();
  const stores = existsSync(STORES_PATH) ? JSON.parse(readFileSync(STORES_PATH, "utf8")) : null;
  const latestRelease = latestReleaseFromGit();

  const records = [];
  for (const store of STATUS_STORES) {
    const missing = missingCreds(store, process.env);
    if (missing.length) {
      info(`${store}: SKIPPED (missing env: ${missing.join(", ")})`);
      records.push(skippedRecord(store, missing));
      continue;
    }
    try {
      info(`${store}: checking…`);
      records.push(await CHECKS[store](process.env, stores));
    } catch (e) {
      records.push(errorRecord(store, e?.message || String(e)));
    }
  }

  const flagged = computeStalls(records, { now: new Date(), stallDays, latestRelease });

  if (asJson) {
    console.log(JSON.stringify({ generatedAt: new Date().toISOString(), stallDays, latestRelease, stores: flagged }, null, 2));
  } else {
    console.log("");
    console.log(renderStatusTable(flagged));
    if (latestRelease) console.log(`\n  latest release tag: v${latestRelease.version} (${latestRelease.date.slice(0, 10)})`);
  }

  const errored = flagged.filter((r) => r.state === "ERROR");
  const stalled = flagged.filter((r) => r.stalled);
  if (stalled.length) info(`\n⚠ ${stalled.length} store(s) look STALLED — see doc/release/README.md ("Checking review status").`);
  process.exit(errored.length ? 1 : 0);
}

main().catch((e) => {
  console.error(e?.message || String(e));
  process.exit(1);
});
