/**
 * store-status-lib — pure logic for the read-only store-review status check (#529).
 *
 * No network, no fs, no clock: response→record normalizers per store, stall computation
 * with an injected `now`, and table rendering — all unit-tested in
 * test/scripts/store-status-lib.spec.ts. The I/O (fetch, credentials, git) lives in
 * scripts/store-status.mjs.
 *
 * Response shapes:
 *  - Chrome: CWS API V2 `items:fetchStatus` (developer.chrome.com/docs/webstore/api/reference/rest/v2).
 *  - Edge:   the public product-details endpoint (the credentialed publish API exposes NO
 *            read-only review state — see doc/release/publishing-credentials.md).
 *  - AMO:    v5 addon detail + versions list (mozilla.org/api/v5); an "unreviewed" listed
 *            file marks a version still in the review queue.
 *
 * Credential env-var sets are reused from release-lib.mjs — same names `release:submit` uses.
 */
import { createHmac, randomUUID } from "node:crypto";
import { CWS_ENV, EDGE_ENV, AMO_ENV, compareSemver, cwsErrorMessage } from "./release-lib.mjs";

export const STATUS_STORES = ["chrome", "edge", "firefox"];

/**
 * Strictly-final X.Y.Z (optionally v-prefixed). release-lib's parseSemver has no end
 * anchor, so a prerelease tag like v1.14.0-rc.1 would parse as final 1.14.0 and could
 * false-flag every store in the lag heuristic — versions must pass this guard first.
 */
export function isFinalSemver(v) {
  return /^v?\d+\.\d+\.\d+$/.test(String(v ?? "").trim());
}

/** Required env var NAMES per store (values are never logged anywhere in this tool). */
export const STORE_ENV = { chrome: CWS_ENV, edge: EDGE_ENV, firefox: AMO_ENV };

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * @typedef {Object} StatusRecord
 * @property {"chrome"|"edge"|"firefox"} store
 * @property {boolean} skipped        true when credentials were missing (no request made)
 * @property {string} [reason]        why the store was skipped / errored
 * @property {string|null} liveVersion
 * @property {string} state           PUBLISHED | IN_REVIEW | REJECTED | SKIPPED | ERROR | UNKNOWN | …
 * @property {string|null} submittedVersion
 * @property {string|null} submittedAt  ISO timestamp of the in-review submission (when the API exposes one)
 * @property {string|null} updatedAt    ISO timestamp of the last store-side update
 * @property {boolean} inReview
 * @property {string[]} notes
 * @property {boolean} [stalled]
 * @property {string|null} [stallReason]
 */

function baseRecord(store) {
  return {
    store,
    skipped: false,
    liveVersion: null,
    state: "UNKNOWN",
    submittedVersion: null,
    submittedAt: null,
    updatedAt: null,
    inReview: false,
    notes: [],
  };
}

/** Names of the store's required env vars that are absent from `env`. */
export function missingCreds(store, env = {}) {
  return (STORE_ENV[store] || []).filter((name) => !env[name]);
}

/** Record for a store we did NOT query because its credentials are missing. Not an error. */
export function skippedRecord(store, missing = []) {
  return {
    ...baseRecord(store),
    skipped: true,
    state: "SKIPPED",
    reason: `missing env: ${missing.join(", ")} (see doc/release/publishing-credentials.md)`,
  };
}

/** Record for a store whose check failed (auth/network/shape) — reported, never thrown. */
export function errorRecord(store, message) {
  return { ...baseRecord(store), state: "ERROR", reason: message };
}

// ── Chrome Web Store (API V2 :fetchStatus) ──────────────────────────────────────────

/**
 * Normalize a CWS V2 fetchStatus response. ItemState enum:
 * PENDING_REVIEW | STAGED | PUBLISHED | PUBLISHED_TO_TESTERS | REJECTED | CANCELLED.
 * fetchStatus carries NO timestamps, so submittedAt stays null (stall detection then
 * falls back to the release-lag heuristic in computeStalls).
 * @returns {StatusRecord}
 */
export function normalizeChromeStatus(json = {}) {
  const r = baseRecord("chrome");
  const published = json.publishedItemRevisionStatus;
  const submitted = json.submittedItemRevisionStatus;
  r.liveVersion = published?.distributionChannels?.[0]?.crxVersion ?? null;
  if (submitted) {
    r.submittedVersion = submitted.distributionChannels?.[0]?.crxVersion ?? null;
    r.inReview = submitted.state === "PENDING_REVIEW";
    r.state = r.inReview ? "IN_REVIEW" : submitted.state || "UNKNOWN";
  } else if (r.liveVersion) {
    r.state = published?.state || "PUBLISHED";
  }
  if (json.takenDown) r.notes.push("item is TAKEN DOWN");
  if (json.warned) r.notes.push("item has been warned by the store");
  return r;
}

// ── Microsoft Edge Add-ons (public product details) ─────────────────────────────────

/**
 * Normalize the public getproductdetailsbycrxid response ({version, lastUpdateDate in
 * epoch SECONDS}). Edge's publish API has no read-only review-state endpoint, so review
 * visibility is limited to "which version is live, since when".
 * @returns {StatusRecord}
 */
export function normalizeEdgeStatus(json = {}) {
  const r = baseRecord("edge");
  r.liveVersion = json.version ?? null;
  if (typeof json.lastUpdateDate === "number") {
    r.updatedAt = new Date(json.lastUpdateDate * 1000).toISOString();
  }
  if (r.liveVersion) r.state = "PUBLISHED";
  r.notes.push("Edge exposes no review state via API — stall detection uses release lag");
  return r;
}

// ── Firefox AMO (v5 addon detail + versions list) ───────────────────────────────────

/**
 * Normalize the AMO addon detail (public) plus, when available, the authenticated
 * versions list (?filter=all_with_unlisted). A listed version whose file.status is
 * neither "public" nor "disabled" (i.e. "unreviewed") is still in the review queue.
 * @param {object} [addon]
 * @param {{results?: Array<{version?: string, channel?: string, file?: {status?: string, created?: string}}>}|null} [versions]
 * @returns {StatusRecord}
 */
export function normalizeAmoStatus(addon = {}, versions = null) {
  const r = baseRecord("firefox");
  const current = addon.current_version;
  r.liveVersion = current?.version ?? null;
  r.updatedAt = current?.reviewed ?? current?.file?.created ?? addon.last_updated ?? null;
  if (r.liveVersion) r.state = addon.status === "public" || !addon.status ? "PUBLISHED" : String(addon.status).toUpperCase();

  const pending = (versions?.results || []).filter(
    (v) => v.channel === "listed" && v.file && !["public", "disabled"].includes(v.file.status),
  );
  if (pending.length) {
    // Newest submission first (by file.created).
    pending.sort((a, b) => String(b.file.created).localeCompare(String(a.file.created)));
    r.inReview = true;
    r.state = "IN_REVIEW";
    r.submittedVersion = pending[0].version ?? null;
    r.submittedAt = pending[0].file.created ?? null;
  }
  return r;
}

// ── Stall computation (injected clock) ──────────────────────────────────────────────

/**
 * Flag stalled stores. Two signals, in priority order:
 *  1. In-review age: a submission has sat in review for MORE than `stallDays`
 *     (only when the store's API exposes the submission timestamp — AMO does).
 *  2. Release lag: the store's live version is behind `latestRelease.version` even though
 *     that release is older than `stallDays` — catches stores with no review visibility
 *     (Edge) or no timestamps (Chrome).
 * Skipped/unknown records are never flagged.
 *
 * @param {StatusRecord[]} records
 * @param {{now?: Date, stallDays?: number, latestRelease?: {version: string, date: string}|null}} opts
 * @returns {StatusRecord[]} new records with {stalled, stallReason}
 */
export function computeStalls(records, { now = new Date(), stallDays = 14, latestRelease = null } = {}) {
  const nowMs = now.getTime();
  const days = (iso) => (nowMs - Date.parse(iso)) / DAY_MS;
  return records.map((r) => {
    const out = { ...r, stalled: false, stallReason: null };
    if (r.skipped || r.state === "ERROR") return out;

    if (r.inReview && r.submittedAt && days(r.submittedAt) > stallDays) {
      out.stalled = true;
      out.stallReason = `${r.submittedVersion || "a submission"} in review for ${Math.floor(days(r.submittedAt))} days (threshold ${stallDays})`;
      return out;
    }

    if (
      latestRelease &&
      isFinalSemver(latestRelease.version) &&
      r.liveVersion &&
      isFinalSemver(r.liveVersion) &&
      compareSemver(r.liveVersion, latestRelease.version) < 0 &&
      days(latestRelease.date) > stallDays
    ) {
      out.stalled = true;
      out.stallReason =
        `live ${r.liveVersion} is behind v${latestRelease.version}, released ` +
        `${Math.floor(days(latestRelease.date))} days ago (threshold ${stallDays})`;
    }
    return out;
  });
}

// ── Rendering ───────────────────────────────────────────────────────────────────────

/** Compact fixed-width table: store, live version, state, submitted, updated, stall flag. */
export function renderStatusTable(records = []) {
  const headers = ["store", "live", "state", "submitted", "updated", "stall"];
  const rows = records.map((r) => [
    r.store,
    r.liveVersion || "—",
    r.state,
    r.submittedVersion ? `${r.submittedVersion}${r.submittedAt ? ` @ ${r.submittedAt.slice(0, 10)}` : ""}` : "—",
    r.updatedAt ? r.updatedAt.slice(0, 10) : "—",
    r.stalled ? "⚠ STALLED" : r.skipped || r.state === "ERROR" ? "—" : "ok",
  ]);
  const widths = headers.map((h, i) => Math.max(h.length, ...rows.map((row) => row[i].length)));
  const line = (cells) => cells.map((c, i) => c.padEnd(widths[i])).join("  ");
  const out = [line(headers), line(widths.map((w) => "─".repeat(w))), ...rows.map(line)];

  const details = records
    .flatMap((r) => [
      ...(r.reason ? [`${r.store}: ${r.reason}`] : []),
      ...(r.stallReason ? [`${r.store}: ${r.stallReason}`] : []),
      ...(r.notes || []).map((n) => `${r.store}: ${n}`),
    ])
    .map((d) => `  · ${d}`);
  return [...out, ...(details.length ? ["", ...details] : [])].join("\n");
}

// ── AMO JWT auth (HS256, per addons-server API v5 auth docs) ────────────────────────

/**
 * Build the `Authorization: JWT <token>` header value for AMO API requests.
 * Deterministic given {now, jti} so it's testable; the secret is only used to sign
 * (never embedded). AMO requires exp ≤ iat + 5 minutes and rejects tokens whose iat is
 * in the future, so iat is backdated 30s to absorb local clock skew.
 * @param {{issuer: string, secret: string, now?: Date, jti?: string}} args
 */
export function amoAuthHeader({ issuer, secret, now = new Date(), jti = randomUUID() }) {
  const b64 = (obj) => Buffer.from(JSON.stringify(obj)).toString("base64url");
  const iat = Math.floor(now.getTime() / 1000) - 30;
  const head = b64({ alg: "HS256", typ: "JWT" });
  const payload = b64({ iss: issuer, jti, iat, exp: iat + 300 });
  const sig = createHmac("sha256", secret).update(`${head}.${payload}`).digest("base64url");
  return `JWT ${head}.${payload}.${sig}`;
}

// ── stores.json helpers ─────────────────────────────────────────────────────────────

/** The Edge LISTING id (crx id) is the last path segment of stores.json's listingUrl. */
export function edgeCrxIdFromListingUrl(url = "") {
  const seg = String(url).split("?")[0].split("/").filter(Boolean).pop() || "";
  return /^[a-p]{32}$/.test(seg) ? seg : null;
}

// ── Credential freshness (#534) ──────────────────────────────────────────────────────
//
// Pure classification for `store-status.mjs --freshness` (npm run release:freshness):
// per-store credential health from the SAME read-only probes the status check already
// performs (CWS refresh-token exchange, Edge dummy-UUID probe, AMO JWT-authed GET),
// plus a computed Edge key-expiry countdown from the founder-recorded EDGE_KEY_ISSUED
// (the Edge API exposes no way to read a key's expiry date). Lifetime facts + rotation
// steps live in doc/release/publishing-credentials.md ("Rotation & lifetimes").

/** Edge Publish-API keys expire every 72 days (MS Edge blog, 2025-01-08; was 2 years). */
export const EDGE_KEY_LIFETIME_DAYS = 72;

/** The credential that actually rotates, per store — what a freshness verdict is about. */
export const FRESHNESS_CREDENTIAL = {
  chrome: "CWS_REFRESH_TOKEN",
  edge: "EDGE_API_KEY",
  firefox: "WEB_EXT_API_KEY/SECRET",
};

/**
 * @typedef {Object} FreshnessRecord
 * @property {"chrome"|"edge"|"firefox"} store
 * @property {string} credential        The rotating credential this verdict is about
 * @property {"OK"|"EXPIRING_SOON"|"EXPIRED"|"SKIPPED"|"ERROR"} status
 * @property {boolean} skipped          true when credentials were missing (no request made)
 * @property {string|null} reason       why the credential is not simply OK
 * @property {string[]} notes
 * @property {string|null} expiresAt        (Edge only) computed from EDGE_KEY_ISSUED
 * @property {number|null} daysUntilExpiry  (Edge only) computed from EDGE_KEY_ISSUED
 * @property {string|null} lastVerifiedAt   from the freshness state file (applyFreshnessHistory)
 * @property {number|null} daysSinceVerified
 */

/** @returns {FreshnessRecord} */
function baseFreshness(store) {
  return {
    store,
    credential: FRESHNESS_CREDENTIAL[store] || store,
    status: "OK",
    skipped: false,
    reason: null,
    notes: [],
    expiresAt: null,
    daysUntilExpiry: null,
    lastVerifiedAt: null,
    daysSinceVerified: null,
  };
}

/**
 * Record for a store we did NOT probe because its credentials are missing. Not an error.
 * @returns {FreshnessRecord}
 */
export function freshnessSkipped(store, missing = []) {
  return {
    ...baseFreshness(store),
    skipped: true,
    status: "SKIPPED",
    reason: `missing env: ${missing.join(", ")} (see doc/release/publishing-credentials.md)`,
  };
}

/**
 * Record for a probe that failed for a non-credential reason (network, unexpected shape).
 * @returns {FreshnessRecord}
 */
export function freshnessError(store, message) {
  return { ...baseFreshness(store), status: "ERROR", reason: message };
}

/**
 * Classify the Chrome OAuth refresh-token exchange (the POST to CWS_TOKEN_URL).
 * A success proves the token works TODAY — it cannot distinguish a long-lived
 * "In production" token from a "Testing" one that dies in 7 days, so an OK carries
 * that caveat as a note. Never copies token values into the record.
 * @param {object} json     token-endpoint response body
 * @param {boolean} httpOk  res.ok
 * @returns {FreshnessRecord}
 */
export function classifyCwsTokenFreshness(json = {}, httpOk = false) {
  const r = baseFreshness("chrome");
  if (httpOk && json.access_token) {
    r.notes.push(
      "exchange succeeded — does NOT prove the token is long-lived: confirm the OAuth app is " +
        '"In production" (Google Auth Platform → Audience), else the token expires in 7 days',
    );
    return r;
  }
  if (json.error === "invalid_grant") {
    r.status = "EXPIRED";
    r.reason =
      "refresh token expired or revoked (invalid_grant) — remint via the OAuth Playground " +
      '(publishing-credentials.md § "Minting CWS_REFRESH_TOKEN")';
    return r;
  }
  if (json.error === "unauthorized_client") {
    r.status = "EXPIRED";
    r.reason =
      "token/client mismatch (unauthorized_client) — id, secret, and refresh token must all come " +
      "from the same OAuth client; remint the token with the current client";
    return r;
  }
  r.status = "ERROR";
  r.reason = `token exchange failed: ${cwsErrorMessage(json)}`;
  return r;
}

/**
 * Classify the Edge dummy-UUID probe (GET on a poll URL — the same probe `release:status`
 * and `release:submit --dry-run` use). 401/403 = key rejected; any other response (404 for
 * the dummy operation id is normal) means the key was accepted.
 * @param {number} httpStatus
 * @returns {FreshnessRecord}
 */
export function classifyEdgeProbeFreshness(httpStatus) {
  const r = baseFreshness("edge");
  if (httpStatus === 401 || httpStatus === 403) {
    r.status = "EXPIRED";
    r.reason = `key rejected (HTTP ${httpStatus}) — EDGE_API_KEY expires every ~${EDGE_KEY_LIFETIME_DAYS} days; create a new key in Partner Center → Edge → Publish API (then update EDGE_KEY_ISSUED)`;
    return r;
  }
  if (httpStatus >= 500) {
    r.status = "ERROR";
    r.reason = `probe failed server-side (HTTP ${httpStatus}) — no credential verdict`;
    return r;
  }
  r.notes.push(`probe accepted (HTTP ${httpStatus})`);
  return r;
}

/**
 * Classify an AMO request that REQUIRES developer auth (the versions list with
 * filter=all_with_unlisted). 2xx proves the JWT issuer/secret work; 401/403 = rejected.
 * @param {number} httpStatus
 * @returns {FreshnessRecord}
 */
export function classifyAmoProbeFreshness(httpStatus) {
  const r = baseFreshness("firefox");
  if (httpStatus >= 200 && httpStatus < 300) return r;
  if (httpStatus === 401 || httpStatus === 403) {
    r.status = "EXPIRED";
    r.reason = `JWT credentials rejected (HTTP ${httpStatus}) — regenerate at https://addons.mozilla.org/developers/addon/api/key/`;
    return r;
  }
  r.status = "ERROR";
  r.reason = `authenticated probe failed (HTTP ${httpStatus}) — no credential verdict`;
  return r;
}

/**
 * Compute the Edge key expiry countdown from the founder-recorded issue date
 * (EDGE_KEY_ISSUED in .env.publish) — the API can't report it. Null when absent/invalid.
 * @param {{issued?: string, now?: Date, lifetimeDays?: number}} args
 * @returns {{issuedAt: string, expiresAt: string, daysUntilExpiry: number, expired: boolean}|null}
 */
export function edgeKeyCountdown({ issued, now = new Date(), lifetimeDays = EDGE_KEY_LIFETIME_DAYS } = {}) {
  const issuedMs = Date.parse(issued ?? "");
  if (!Number.isFinite(issuedMs)) return null;
  const expiresMs = issuedMs + lifetimeDays * DAY_MS;
  return {
    issuedAt: new Date(issuedMs).toISOString(),
    expiresAt: new Date(expiresMs).toISOString(),
    daysUntilExpiry: Math.floor((expiresMs - now.getTime()) / DAY_MS),
    expired: now.getTime() >= expiresMs,
  };
}

/**
 * Merge the Edge countdown into a probe record. An expired countdown escalates to
 * EXPIRED even when the probe passed (the probe can lag the actual cutoff); a countdown
 * inside the warn window escalates OK → EXPIRING_SOON. A probe-EXPIRED verdict is never
 * downgraded. Without a countdown the record stays probe-result-only, with a note.
 * @param {FreshnessRecord} record
 * @param {ReturnType<typeof edgeKeyCountdown>} countdown
 * @param {{warnDays?: number}} [opts]
 * @returns {FreshnessRecord}
 */
export function applyEdgeCountdown(record, countdown, { warnDays = 14 } = {}) {
  const out = { ...record, notes: [...record.notes] };
  if (!countdown) {
    out.notes.push("EDGE_KEY_ISSUED not set — expiry countdown unavailable (probe result only)");
    return out;
  }
  out.expiresAt = countdown.expiresAt;
  out.daysUntilExpiry = countdown.daysUntilExpiry;
  if (out.status !== "OK") return out;
  if (countdown.expired) {
    out.status = "EXPIRED";
    out.reason = `key issued ${countdown.issuedAt.slice(0, 10)} is past its ${EDGE_KEY_LIFETIME_DAYS}-day lifetime — rotate in Partner Center (then update EDGE_KEY_ISSUED)`;
  } else if (countdown.daysUntilExpiry <= warnDays) {
    out.status = "EXPIRING_SOON";
    out.reason = `key expires in ${countdown.daysUntilExpiry} day(s) (${countdown.expiresAt.slice(0, 10)}) — rotate in Partner Center soon`;
  }
  return out;
}

/** A record whose probe actually verified the credential works today. */
function isVerified(record) {
  return record.status === "OK" || record.status === "EXPIRING_SOON";
}

/**
 * Annotate records with last-verified history from the freshness state file
 * ({store: {lastVerifiedAt}}). A store verified THIS run reads as verified now;
 * anything else carries the previous timestamp (or null — never invented).
 * @param {FreshnessRecord[]} records
 * @param {Record<string, {lastVerifiedAt?: string}>} [state]
 * @param {Date} [now]
 * @returns {FreshnessRecord[]}
 */
export function applyFreshnessHistory(records, state = {}, now = new Date()) {
  return records.map((r) => {
    const prev = state[r.store]?.lastVerifiedAt ?? null;
    const at = isVerified(r) ? now.toISOString() : prev;
    return {
      ...r,
      lastVerifiedAt: at,
      daysSinceVerified: at ? Math.floor((now.getTime() - Date.parse(at)) / DAY_MS) : null,
    };
  });
}

/**
 * Next contents for the freshness state file: verified-this-run stores stamped `now`,
 * everything else keeps its previous entry.
 * @param {Record<string, {lastVerifiedAt?: string}>} state
 * @param {FreshnessRecord[]} records
 * @param {Date} [now]
 */
export function nextFreshnessState(state = {}, records = [], now = new Date()) {
  const next = { ...state };
  for (const r of records) {
    if (isVerified(r)) next[r.store] = { lastVerifiedAt: now.toISOString() };
  }
  return next;
}

/** Compact fixed-width freshness table: store, credential, status, verified age, expiry. */
export function renderFreshnessTable(records = []) {
  const headers = ["store", "credential", "status", "last verified", "expires"];
  const rows = records.map((r) => [
    r.store,
    r.credential,
    r.status,
    r.lastVerifiedAt
      ? `${r.lastVerifiedAt.slice(0, 10)}${r.daysSinceVerified ? ` (${r.daysSinceVerified}d ago)` : " (today)"}`
      : "never",
    r.expiresAt
      ? `${r.expiresAt.slice(0, 10)}${r.daysUntilExpiry != null ? ` (${r.daysUntilExpiry}d)` : ""}`
      : "—",
  ]);
  const widths = headers.map((h, i) => Math.max(h.length, ...rows.map((row) => row[i].length)));
  const line = (cells) => cells.map((c, i) => c.padEnd(widths[i])).join("  ");
  const out = [line(headers), line(widths.map((w) => "─".repeat(w))), ...rows.map(line)];

  const details = records
    .flatMap((r) => [
      ...(r.reason ? [`${r.store}: ${r.reason}`] : []),
      ...(r.notes || []).map((n) => `${r.store}: ${n}`),
    ])
    .map((d) => `  · ${d}`);
  return [...out, ...(details.length ? ["", ...details] : [])].join("\n");
}

/** 1 when any credential is EXPIRED or a probe ERRORed; SKIPPED/EXPIRING_SOON stay 0. */
export function freshnessExitCode(records = []) {
  return records.some((r) => r.status === "EXPIRED" || r.status === "ERROR") ? 1 : 0;
}
