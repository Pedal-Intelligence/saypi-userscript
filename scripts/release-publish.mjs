/**
 * release-publish — headless store submission via the official publishing APIs (#412).
 *
 * The I/O layer for the `release.mjs submit` command: authenticates and uploads/publishes a
 * built artifact to each store's API. Pure request builders + response interpreters live in
 * release-lib.mjs (unit-tested without secrets); this file does the fetch/spawn + polling.
 *
 * Credentials come from env vars the FOUNDER provides (see doc/release/publishing-credentials.md);
 * this code never reads .env.production or hardcodes secrets. Real submission is irreversible and
 * founder-gated — `release.mjs submit` requires --yes; `--dry-run` only auth-checks (no publish).
 *
 * API specs verified 2026-06: CWS V2, Edge v1.1, AMO via `web-ext sign` (v8).
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve as resolvePath } from "node:path";
import {
  requireEnv,
  CWS_ENV,
  CWS_TOKEN_URL,
  cwsTokenBody,
  cwsUploadUrl,
  cwsPublishUrl,
  cwsStatusUrl,
  interpretCwsUpload,
  interpretCwsPublish,
  cwsErrorMessage,
  EDGE_ENV,
  edgeHeaders,
  edgeUploadUrl,
  edgeUploadPollUrl,
  edgePublishUrl,
  edgePublishPollUrl,
  operationIdFromLocation,
  interpretEdgeOperation,
  AMO_ENV,
  buildAmoMetadata,
  webExtSignArgs,
} from "./release-lib.mjs";

const repoRoot = resolvePath(dirname(fileURLToPath(import.meta.url)), "..");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const POLL_INTERVAL_MS = 5000;
const POLL_MAX = 60; // ~5 min

// ── Chrome Web Store (API V2) ─────────────────────────────────────────────────────
export async function chromeSubmit({ zipPath, env = process.env, dryRun = false, log = console.log }) {
  const e = requireEnv(CWS_ENV, env);
  const tokRes = await fetch(CWS_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: cwsTokenBody({ clientId: e.CWS_CLIENT_ID, clientSecret: e.CWS_CLIENT_SECRET, refreshToken: e.CWS_REFRESH_TOKEN }),
  });
  const tok = await tokRes.json().catch(() => ({}));
  if (!tokRes.ok || !tok.access_token) throw new Error(`Chrome auth failed: ${cwsErrorMessage(tok)}`);
  const auth = { Authorization: `Bearer ${tok.access_token}` };
  log("  ✓ authenticated");

  const stRes = await fetch(cwsStatusUrl(e.CWS_PUBLISHER_ID, e.CWS_EXTENSION_ID), { headers: auth });
  const st = await stRes.json().catch(() => ({}));
  if (!stRes.ok) throw new Error(`Chrome status check failed: ${cwsErrorMessage(st)}`);
  const published = st.publishedItemRevisionStatus?.distributionChannels?.[0]?.crxVersion;
  log(`  current published version: ${published || "unknown"}`);
  if (dryRun) {
    log("  dry run — auth + status OK; not uploading or publishing.");
    return `Chrome dry-run OK (published ${published || "?"})`;
  }

  if (!existsSync(zipPath)) throw new Error(`${zipPath} not found — run \`build\` first.`);
  const upRes = await fetch(cwsUploadUrl(e.CWS_PUBLISHER_ID, e.CWS_EXTENSION_ID), { method: "POST", headers: auth, body: readFileSync(zipPath) });
  const upJson = await upRes.json().catch(() => ({}));
  if (!upRes.ok) throw new Error(`Chrome upload failed: ${cwsErrorMessage(upJson)}`);
  let up = interpretCwsUpload(upJson);
  for (let i = 0; up.inProgress && i < POLL_MAX; i++) {
    await sleep(POLL_INTERVAL_MS);
    const s = await fetch(cwsStatusUrl(e.CWS_PUBLISHER_ID, e.CWS_EXTENSION_ID), { headers: auth }).then((r) => r.json()).catch(() => ({}));
    up = interpretCwsUpload(s);
  }
  if (!up.ok) throw new Error(`Chrome upload did not succeed (state: ${up.state}).`);
  log("  ✓ package uploaded"); // crxVersion isn't on the upload response; the version is verified pre-build by `verify`

  const pubRes = await fetch(cwsPublishUrl(e.CWS_PUBLISHER_ID, e.CWS_EXTENSION_ID), {
    method: "POST",
    headers: { ...auth, "Content-Type": "application/json" },
    body: "{}",
  });
  const pubJson = await pubRes.json().catch(() => ({}));
  if (!pubRes.ok) throw new Error(`Chrome publish failed: ${cwsErrorMessage(pubJson)}`);
  const pub = interpretCwsPublish(pubJson);
  if (!pub.ok) throw new Error(`Chrome publish returned unexpected state: ${pub.state}`);
  if (pub.warnings.length) log(`  ⚠ ${pub.warnings.length} publish warning(s) — review on the dashboard`);
  return `Chrome submitted — state: ${pub.state}`;
}

// ── Microsoft Edge Add-ons (API v1.1) ─────────────────────────────────────────────
async function pollEdge(url, headers, label, log) {
  for (let i = 0; i < POLL_MAX; i++) {
    const res = await fetch(url, { headers });
    const json = await res.json().catch(() => ({}));
    const op = interpretEdgeOperation(json);
    if (op.ok) return;
    if (op.failed) {
      // Edge `errors` can be strings OR objects ({message}); normalize so we don't print [object Object].
      const errs = (op.errors || []).map((x) => (x && typeof x === "object" ? x.message ?? JSON.stringify(x) : x));
      throw new Error(`Edge ${label} failed: ${[op.errorCode, op.message, ...errs].filter(Boolean).join(" — ")}`);
    }
    await sleep(POLL_INTERVAL_MS);
  }
  throw new Error(`Edge ${label} polling timed out.`);
}

export async function edgeSubmit({ zipPath, notes = "", env = process.env, dryRun = false, log = console.log }) {
  const e = requireEnv(EDGE_ENV, env);
  const headers = edgeHeaders({ apiKey: e.EDGE_API_KEY, clientId: e.EDGE_CLIENT_ID });
  if (dryRun) {
    // Auth probe: GET a poll URL with a dummy operation id — 401 = bad creds; anything else = accepted.
    const probe = await fetch(edgeUploadPollUrl(e.EDGE_PRODUCT_ID, "00000000-0000-0000-0000-000000000000"), { headers });
    if (probe.status === 401) throw new Error("Edge auth failed (401) — check EDGE_API_KEY/EDGE_CLIENT_ID (keys expire every ~72 days).");
    log(`  ✓ credentials accepted (probe HTTP ${probe.status})`);
    log("  dry run — not uploading or publishing.");
    return "Edge dry-run OK";
  }

  if (!existsSync(zipPath)) throw new Error(`${zipPath} not found — run \`build\` first.`);
  const upRes = await fetch(edgeUploadUrl(e.EDGE_PRODUCT_ID), {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/zip" },
    body: readFileSync(zipPath),
  });
  if (upRes.status !== 202) throw new Error(`Edge upload rejected (HTTP ${upRes.status}).`);
  const upOp = operationIdFromLocation(upRes.headers.get("location"));
  log(`  uploading (op ${upOp})…`);
  await pollEdge(edgeUploadPollUrl(e.EDGE_PRODUCT_ID, upOp), headers, "upload", log);
  log("  ✓ package uploaded");

  // Publish body is PLAIN TEXT certification notes (NOT JSON) per the Edge v1.1 reference.
  const pubRes = await fetch(edgePublishUrl(e.EDGE_PRODUCT_ID), { method: "POST", headers, body: notes || "Automated release." });
  if (pubRes.status !== 202) throw new Error(`Edge publish rejected (HTTP ${pubRes.status}).`);
  const pubOp = operationIdFromLocation(pubRes.headers.get("location"));
  log(`  publishing (op ${pubOp})…`);
  await pollEdge(edgePublishPollUrl(e.EDGE_PRODUCT_ID, pubOp), headers, "publish", log);
  return "Edge submitted to certification";
}

// ── Firefox AMO (via web-ext sign) ────────────────────────────────────────────────
export function firefoxSubmit({ sourceDir, sourceCode, releaseNotes, approvalNotes, env = process.env, dryRun = false, log = console.log }) {
  requireEnv(AMO_ENV, env);
  const bin = join(repoRoot, "node_modules", ".bin", "web-ext");
  const webExt = existsSync(bin) ? bin : "web-ext";

  if (dryRun) {
    const check = spawnSync(webExt, ["--version"], { cwd: repoRoot, encoding: "utf8" });
    if (check.status !== 0) throw new Error("web-ext is not runnable — run `npm install`.");
    if (!existsSync(sourceDir)) log(`  ⚠ source dir ${sourceDir} not present yet — run \`build:firefox\` before a real submit.`);
    log(`  ✓ AMO credentials present; web-ext ${String(check.stdout).trim()} available`);
    log("  dry run — not submitting (web-ext sign would submit to AMO).");
    return "Firefox dry-run OK";
  }

  if (!existsSync(sourceDir)) throw new Error(`Firefox source dir ${sourceDir} not found — run \`build:firefox\` first.`);
  const distDir = join(repoRoot, "dist");
  mkdirSync(distDir, { recursive: true });
  const metaFile = join(distDir, "amo-metadata.json");
  writeFileSync(metaFile, JSON.stringify(buildAmoMetadata({ releaseNotes, approvalNotes }), null, 2));

  const argv = webExtSignArgs({
    sourceDir,
    artifactsDir: join(distDir, "web-ext-artifacts"),
    sourceCode: existsSync(sourceCode) ? sourceCode : undefined,
    metadataFile: metaFile,
  });
  log(`  running: web-ext ${argv.slice(1).join(" ")}`);
  const res = spawnSync(webExt, argv.slice(1), { cwd: repoRoot, stdio: "inherit", env });
  if (res.status !== 0) throw new Error(`web-ext sign failed (exit ${res.status}).`);
  return "Firefox submitted to AMO review queue";
}

// ── Dispatcher ────────────────────────────────────────────────────────────────────
export function submitToStore(store, opts = {}) {
  switch (store) {
    case "chrome":
      return chromeSubmit({ zipPath: join(repoRoot, "dist", "saypi.chrome.zip"), ...opts });
    case "edge":
      return edgeSubmit({ zipPath: join(repoRoot, "dist", "saypi.edge.zip"), ...opts });
    case "firefox":
      return firefoxSubmit({
        sourceDir: join(repoRoot, ".output", "firefox-mv2"),
        sourceCode: join(repoRoot, "source-code.zip"),
        ...opts,
      });
    default:
      throw new Error(`Unknown store "${store}". Use: chrome | edge | firefox.`);
  }
}
