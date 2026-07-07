import { describe, it, expect } from "vitest";
import {
  missingCreds,
  skippedRecord,
  normalizeChromeStatus,
  normalizeEdgeStatus,
  normalizeAmoStatus,
  computeStalls,
  renderStatusTable,
  amoAuthHeader,
  edgeCrxIdFromListingUrl,
  errorRecord,
  isFinalSemver,
  STATUS_STORES,
} from "../../scripts/store-status-lib.mjs";

// ── Fixtures (shapes derived from each store's documented/observed API responses) ──

// CWS V2 :fetchStatus — schema per developer.chrome.com/docs/webstore/api/reference/rest/v2
// (publishedItemRevisionStatus/submittedItemRevisionStatus are ItemRevisionStatus objects;
// ItemState enum: PENDING_REVIEW | STAGED | PUBLISHED | PUBLISHED_TO_TESTERS | REJECTED | CANCELLED).
const CWS_PUBLISHED_ONLY = {
  name: "publishers/123/items/glhhgglpalmjjkoiigojligncepccdei",
  itemId: "glhhgglpalmjjkoiigojligncepccdei",
  publishedItemRevisionStatus: {
    state: "PUBLISHED",
    distributionChannels: [{ deployPercentage: 100, crxVersion: "1.12.0" }],
  },
  lastAsyncUploadState: "SUCCEEDED",
  takenDown: false,
  warned: false,
};

const CWS_IN_REVIEW = {
  ...CWS_PUBLISHED_ONLY,
  submittedItemRevisionStatus: {
    state: "PENDING_REVIEW",
    distributionChannels: [{ deployPercentage: 100, crxVersion: "1.13.0" }],
  },
};

const CWS_REJECTED = {
  ...CWS_PUBLISHED_ONLY,
  submittedItemRevisionStatus: {
    state: "REJECTED",
    distributionChannels: [{ deployPercentage: 100, crxVersion: "1.13.0" }],
  },
};

// Edge public product details (microsoftedge.microsoft.com/addons/getproductdetailsbycrxid/<crxid>)
// — observed live 2026-07-07: version is a string, lastUpdateDate is epoch SECONDS (float).
const EDGE_DETAILS = {
  crxId: "jabjanmkommeachipnbiggdohahbfgpj",
  name: "Say, Pi: Hands-Free AI Voice Chat",
  version: "1.11.0",
  lastUpdateDate: 1782086063.6782613, // 2026-06-21T23:54:23Z
};

// AMO v5 addon detail (addons.mozilla.org/api/v5/addons/addon/<guid>/) — observed live 2026-07-07.
const AMO_ADDON = {
  guid: "gecko@saypi.ai",
  slug: "say-pi",
  status: "public",
  current_version: {
    version: "1.13.0",
    reviewed: "2026-07-01T06:36:03Z",
    file: { status: "public", created: "2026-07-01T06:31:42Z" },
  },
  last_updated: "2026-07-01T06:36:03Z",
};

// AMO v5 versions list (…/versions/?filter=all_with_unlisted) — file.status "unreviewed"
// marks a version still in the review queue.
const AMO_VERSIONS_IN_REVIEW = {
  results: [
    {
      version: "1.14.0",
      channel: "listed",
      file: { status: "unreviewed", created: "2026-07-05T10:00:00Z" },
    },
    {
      version: "1.13.0",
      channel: "listed",
      file: { status: "public", created: "2026-07-01T06:31:42Z" },
    },
    {
      version: "0.9.0",
      channel: "listed",
      file: { status: "disabled", created: "2024-01-01T00:00:00Z" },
    },
  ],
};

const NOW = new Date("2026-07-07T12:00:00Z");
const DAY = 24 * 60 * 60 * 1000;

// ── Credentials gating ─────────────────────────────────────────────────────────────

describe("missingCreds / skippedRecord", () => {
  it("reports every required env var name per store when env is empty", () => {
    expect(missingCreds("chrome", {})).toEqual([
      "CWS_CLIENT_ID",
      "CWS_CLIENT_SECRET",
      "CWS_REFRESH_TOKEN",
      "CWS_PUBLISHER_ID",
      "CWS_EXTENSION_ID",
    ]);
    expect(missingCreds("edge", {})).toEqual(["EDGE_PRODUCT_ID", "EDGE_API_KEY", "EDGE_CLIENT_ID"]);
    expect(missingCreds("firefox", {})).toEqual(["WEB_EXT_API_KEY", "WEB_EXT_API_SECRET"]);
  });

  it("reports nothing when all vars are present", () => {
    const env = {
      EDGE_PRODUCT_ID: "p",
      EDGE_API_KEY: "k",
      EDGE_CLIENT_ID: "c",
    };
    expect(missingCreds("edge", env)).toEqual([]);
  });

  it("skippedRecord is marked SKIPPED and names the missing vars (never values)", () => {
    const r = skippedRecord("edge", ["EDGE_API_KEY", "EDGE_CLIENT_ID"]);
    expect(r.store).toBe("edge");
    expect(r.skipped).toBe(true);
    expect(r.state).toBe("SKIPPED");
    expect(r.reason).toMatch(/EDGE_API_KEY/);
    expect(r.reason).toMatch(/EDGE_CLIENT_ID/);
  });

  it("STATUS_STORES covers all three stores in submission order", () => {
    expect(STATUS_STORES).toEqual(["chrome", "edge", "firefox"]);
  });
});

// ── Chrome normalizer ──────────────────────────────────────────────────────────────

describe("normalizeChromeStatus", () => {
  it("published-only: live version, PUBLISHED, nothing in review", () => {
    const r = normalizeChromeStatus(CWS_PUBLISHED_ONLY);
    expect(r.store).toBe("chrome");
    expect(r.liveVersion).toBe("1.12.0");
    expect(r.state).toBe("PUBLISHED");
    expect(r.inReview).toBe(false);
    expect(r.submittedVersion).toBeNull();
  });

  it("pending review: surfaces the submitted version and IN_REVIEW state", () => {
    const r = normalizeChromeStatus(CWS_IN_REVIEW);
    expect(r.liveVersion).toBe("1.12.0");
    expect(r.state).toBe("IN_REVIEW");
    expect(r.inReview).toBe(true);
    expect(r.submittedVersion).toBe("1.13.0");
    // CWS fetchStatus carries no timestamps — stall detection falls back to release lag.
    expect(r.submittedAt).toBeNull();
  });

  it("rejected submission is surfaced as REJECTED (not in review)", () => {
    const r = normalizeChromeStatus(CWS_REJECTED);
    expect(r.state).toBe("REJECTED");
    expect(r.inReview).toBe(false);
    expect(r.submittedVersion).toBe("1.13.0");
  });

  it("takenDown/warned flags land in notes", () => {
    const r = normalizeChromeStatus({ ...CWS_PUBLISHED_ONLY, takenDown: true, warned: true });
    expect(r.notes.join(" ")).toMatch(/taken down/i);
    expect(r.notes.join(" ")).toMatch(/warned/i);
  });

  it("tolerates an empty response", () => {
    const r = normalizeChromeStatus({});
    expect(r.liveVersion).toBeNull();
    expect(r.state).toBe("UNKNOWN");
  });
});

// ── Edge normalizer ────────────────────────────────────────────────────────────────

describe("normalizeEdgeStatus", () => {
  it("maps version + epoch-seconds lastUpdateDate to an ISO timestamp", () => {
    const r = normalizeEdgeStatus(EDGE_DETAILS);
    expect(r.store).toBe("edge");
    expect(r.liveVersion).toBe("1.11.0");
    expect(r.state).toBe("PUBLISHED");
    expect(r.updatedAt).toMatch(/^2026-06-21T/);
    // Edge's publish API exposes no review state — the record says so.
    expect(r.notes.join(" ")).toMatch(/review state/i);
  });

  it("tolerates an empty response", () => {
    const r = normalizeEdgeStatus({});
    expect(r.liveVersion).toBeNull();
    expect(r.updatedAt).toBeNull();
    expect(r.state).toBe("UNKNOWN");
  });
});

// ── AMO normalizer ─────────────────────────────────────────────────────────────────

describe("normalizeAmoStatus", () => {
  it("public addon detail alone: live version + PUBLISHED", () => {
    const r = normalizeAmoStatus(AMO_ADDON);
    expect(r.store).toBe("firefox");
    expect(r.liveVersion).toBe("1.13.0");
    expect(r.state).toBe("PUBLISHED");
    expect(r.updatedAt).toBe("2026-07-01T06:36:03Z");
    expect(r.inReview).toBe(false);
  });

  it("an unreviewed listed version marks the record IN_REVIEW with its submission time", () => {
    const r = normalizeAmoStatus(AMO_ADDON, AMO_VERSIONS_IN_REVIEW);
    expect(r.state).toBe("IN_REVIEW");
    expect(r.inReview).toBe(true);
    expect(r.submittedVersion).toBe("1.14.0");
    expect(r.submittedAt).toBe("2026-07-05T10:00:00Z");
    expect(r.liveVersion).toBe("1.13.0"); // live version unchanged while in review
  });

  it("disabled/public versions never count as in-review", () => {
    const r = normalizeAmoStatus(AMO_ADDON, {
      results: AMO_VERSIONS_IN_REVIEW.results.filter((v) => v.file.status !== "unreviewed"),
    });
    expect(r.inReview).toBe(false);
    expect(r.state).toBe("PUBLISHED");
  });

  it("tolerates empty responses", () => {
    const r = normalizeAmoStatus({});
    expect(r.liveVersion).toBeNull();
    expect(r.state).toBe("UNKNOWN");
  });
});

// ── Stall computation (injected clock) ─────────────────────────────────────────────

describe("computeStalls", () => {
  // `any` because the lib's StatusRecord typedef narrows `store` to the union; the loose
  // fixture builder is fine for tests.
  const base = (over: Record<string, unknown>): any => ({
    store: "firefox",
    skipped: false,
    liveVersion: "1.13.0",
    state: "PUBLISHED",
    submittedVersion: null,
    submittedAt: null,
    updatedAt: null,
    inReview: false,
    notes: [],
    ...over,
  });

  it("flags an in-review submission older than the threshold", () => {
    const submittedAt = new Date(NOW.getTime() - 15 * DAY).toISOString();
    const [r] = computeStalls([base({ inReview: true, state: "IN_REVIEW", submittedVersion: "1.14.0", submittedAt })], {
      now: NOW,
      stallDays: 14,
    });
    expect(r.stalled).toBe(true);
    expect(r.stallReason).toMatch(/15 day/);
  });

  it("boundary: exactly at the threshold is NOT stalled; just over is", () => {
    const atThreshold = new Date(NOW.getTime() - 14 * DAY).toISOString();
    const justOver = new Date(NOW.getTime() - 14 * DAY - 60 * 1000).toISOString();
    const mk = (submittedAt: string) =>
      computeStalls([base({ inReview: true, state: "IN_REVIEW", submittedAt })], { now: NOW, stallDays: 14 })[0];
    expect(mk(atThreshold).stalled).toBe(false);
    expect(mk(justOver).stalled).toBe(true);
  });

  it("flags a store whose live version lags a release older than the threshold (the Edge scenario)", () => {
    const latestRelease = { version: "1.13.0", date: new Date(NOW.getTime() - 20 * DAY).toISOString() };
    const [r] = computeStalls([base({ store: "edge", liveVersion: "1.11.0" })], {
      now: NOW,
      stallDays: 14,
      latestRelease,
    });
    expect(r.stalled).toBe(true);
    expect(r.stallReason).toMatch(/1\.11\.0/);
    expect(r.stallReason).toMatch(/1\.13\.0/);
  });

  it("does not flag a lagging store while the release is younger than the threshold", () => {
    const latestRelease = { version: "1.13.0", date: new Date(NOW.getTime() - 3 * DAY).toISOString() };
    const [r] = computeStalls([base({ store: "edge", liveVersion: "1.11.0" })], {
      now: NOW,
      stallDays: 14,
      latestRelease,
    });
    expect(r.stalled).toBe(false);
  });

  it("does not flag up-to-date stores, skipped records, or unknown versions", () => {
    const latestRelease = { version: "1.13.0", date: new Date(NOW.getTime() - 20 * DAY).toISOString() };
    const records = [
      base({}), // live == latest
      base({ store: "edge", skipped: true, state: "SKIPPED", liveVersion: null }),
      base({ store: "chrome", liveVersion: null, state: "UNKNOWN" }),
    ];
    const out = computeStalls(records, { now: NOW, stallDays: 14, latestRelease });
    expect(out.map((r) => r.stalled)).toEqual([false, false, false]);
  });

  it("ignores a prerelease latest tag in the lag heuristic (never masquerades as a final)", () => {
    // release-lib's parseSemver has no end anchor, so "1.14.0-rc.1" would parse as 1.14.0;
    // the lag rule must reject prerelease versions outright.
    const latestRelease = { version: "1.14.0-rc.1", date: new Date(NOW.getTime() - 20 * DAY).toISOString() };
    const [r] = computeStalls([base({ store: "edge", liveVersion: "1.11.0" })], {
      now: NOW,
      stallDays: 14,
      latestRelease,
    });
    expect(r.stalled).toBe(false);
  });

  it("respects a custom --stall-days threshold", () => {
    const submittedAt = new Date(NOW.getTime() - 5 * DAY).toISOString();
    const [strict] = computeStalls([base({ inReview: true, submittedAt })], { now: NOW, stallDays: 3 });
    const [lax] = computeStalls([base({ inReview: true, submittedAt })], { now: NOW, stallDays: 14 });
    expect(strict.stalled).toBe(true);
    expect(lax.stalled).toBe(false);
  });
});

// ── Table rendering ────────────────────────────────────────────────────────────────

describe("renderStatusTable", () => {
  it("renders one row per store with version, state, and a stall marker", () => {
    const records = computeStalls(
      [
        normalizeChromeStatus(CWS_IN_REVIEW),
        normalizeEdgeStatus(EDGE_DETAILS),
        skippedRecord("firefox", ["WEB_EXT_API_KEY", "WEB_EXT_API_SECRET"]),
      ],
      { now: NOW, stallDays: 14, latestRelease: { version: "1.13.0", date: "2026-06-15T00:00:00Z" } },
    );
    const table = renderStatusTable(records);
    expect(table).toMatch(/chrome/);
    expect(table).toMatch(/edge/);
    expect(table).toMatch(/firefox/);
    expect(table).toMatch(/1\.12\.0/);
    expect(table).toMatch(/1\.11\.0/);
    expect(table).toMatch(/IN_REVIEW/);
    expect(table).toMatch(/SKIPPED/);
    expect(table).toMatch(/STALLED/); // edge lags 1.13.0 released 22 days before NOW
  });

  it("ERROR rows show — (not ok) in the stall column", () => {
    const table = renderStatusTable(computeStalls([errorRecord("chrome", "auth failed")], { now: NOW }));
    const row = table.split("\n").find((l) => l.startsWith("chrome"))!;
    expect(row).toMatch(/ERROR/);
    expect(row).not.toMatch(/\bok\b/);
  });
});

// ── Final-version guard ────────────────────────────────────────────────────────────

describe("isFinalSemver", () => {
  it("accepts only strictly-final X.Y.Z (optionally v-prefixed)", () => {
    expect(isFinalSemver("1.13.0")).toBe(true);
    expect(isFinalSemver("v1.13.0")).toBe(true);
    expect(isFinalSemver("1.14.0-rc.1")).toBe(false);
    expect(isFinalSemver("v1.14.0-beta")).toBe(false);
    expect(isFinalSemver("1.13")).toBe(false);
    expect(isFinalSemver("")).toBe(false);
    expect(isFinalSemver(null as unknown as string)).toBe(false);
  });
});

// ── AMO JWT (deterministic with injected clock + nonce) ────────────────────────────

describe("amoAuthHeader", () => {
  it("builds an HS256 JWT with iss/jti/iat/exp and a 5-minute lifetime", () => {
    const header = amoAuthHeader({ issuer: "user:123:45", secret: "s3cret", now: NOW, jti: "nonce-1" });
    expect(header).toMatch(/^JWT [A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/);
    const [h, p] = header.slice(4).split(".");
    const dec = (s: string) => JSON.parse(Buffer.from(s, "base64url").toString("utf8"));
    expect(dec(h)).toEqual({ alg: "HS256", typ: "JWT" });
    const payload = dec(p);
    expect(payload.iss).toBe("user:123:45");
    expect(payload.jti).toBe("nonce-1");
    // iat is backdated 30s so a fast local clock can't put it in AMO's future (401s).
    expect(payload.iat).toBe(Math.floor(NOW.getTime() / 1000) - 30);
    expect(payload.exp).toBe(payload.iat + 300);
  });

  it("is deterministic for the same inputs and never embeds the secret", () => {
    const a = amoAuthHeader({ issuer: "i", secret: "topsecret", now: NOW, jti: "j" });
    const b = amoAuthHeader({ issuer: "i", secret: "topsecret", now: NOW, jti: "j" });
    expect(a).toBe(b);
    expect(a).not.toContain("topsecret");
  });
});

// ── stores.json helpers ────────────────────────────────────────────────────────────

describe("edgeCrxIdFromListingUrl", () => {
  it("extracts the crx id from the Edge listing URL in stores.json", () => {
    expect(edgeCrxIdFromListingUrl("https://microsoftedge.microsoft.com/addons/detail/jabjanmkommeachipnbiggdohahbfgpj")).toBe(
      "jabjanmkommeachipnbiggdohahbfgpj",
    );
  });
  it("returns null for a malformed URL", () => {
    expect(edgeCrxIdFromListingUrl("")).toBeNull();
  });
});
