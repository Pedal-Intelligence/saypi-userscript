import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  EDGE_KEY_LIFETIME_DAYS,
  FRESHNESS_CREDENTIAL,
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
} from "../../scripts/store-status-lib.mjs";

const NOW = new Date("2026-07-07T12:00:00Z");
const DAY = 24 * 60 * 60 * 1000;
const daysAgo = (n: number) => new Date(NOW.getTime() - n * DAY).toISOString();

// ── Per-store credential naming (what the check is actually about) ─────────────────

describe("FRESHNESS_CREDENTIAL", () => {
  it("names the rotating credential per store", () => {
    expect(FRESHNESS_CREDENTIAL.chrome).toBe("CWS_REFRESH_TOKEN");
    expect(FRESHNESS_CREDENTIAL.edge).toBe("EDGE_API_KEY");
    expect(FRESHNESS_CREDENTIAL.firefox).toBe("WEB_EXT_API_KEY/SECRET");
  });
});

// ── Skipped / error records ─────────────────────────────────────────────────────────

describe("freshnessSkipped / freshnessError", () => {
  it("skipped: SKIPPED status, names missing vars (never values), exit-code neutral", () => {
    const r = freshnessSkipped("edge", ["EDGE_API_KEY", "EDGE_CLIENT_ID"]);
    expect(r.store).toBe("edge");
    expect(r.skipped).toBe(true);
    expect(r.status).toBe("SKIPPED");
    expect(r.reason).toMatch(/EDGE_API_KEY/);
    expect(r.reason).toMatch(/EDGE_CLIENT_ID/);
  });

  it("error: ERROR status with the message as reason", () => {
    const r = freshnessError("chrome", "network timeout");
    expect(r.status).toBe("ERROR");
    expect(r.reason).toBe("network timeout");
  });
});

// ── Chrome: OAuth refresh-token exchange classification ─────────────────────────────

describe("classifyCwsTokenFreshness", () => {
  it("a successful exchange is OK — but notes that it does not prove long-lived (Testing vs In production)", () => {
    const r = classifyCwsTokenFreshness({ access_token: "ya29.SECRET-VALUE", expires_in: 3599 }, true);
    expect(r.store).toBe("chrome");
    expect(r.status).toBe("OK");
    expect(r.notes.join(" ")).toMatch(/in production/i);
    // The access token value must never leak into the record.
    expect(JSON.stringify(r)).not.toContain("ya29.SECRET-VALUE");
  });

  it("invalid_grant means the refresh token is expired/revoked — EXPIRED with the remint pointer", () => {
    const r = classifyCwsTokenFreshness(
      { error: "invalid_grant", error_description: "Token has been expired or revoked." },
      false,
    );
    expect(r.status).toBe("EXPIRED");
    expect(r.reason).toMatch(/invalid_grant/);
    expect(r.reason).toMatch(/remint|OAuth Playground/i);
  });

  it("unauthorized_client means client/token mismatch — EXPIRED with the same-client rule", () => {
    const r = classifyCwsTokenFreshness({ error: "unauthorized_client" }, false);
    expect(r.status).toBe("EXPIRED");
    expect(r.reason).toMatch(/same OAuth client/i);
  });

  it("any other failure is ERROR (carries the description)", () => {
    const r = classifyCwsTokenFreshness({ error: "internal_failure", error_description: "boom" }, false);
    expect(r.status).toBe("ERROR");
    expect(r.reason).toMatch(/boom/);
  });
});

// ── Edge: dummy-UUID probe classification ────────────────────────────────────────────

describe("classifyEdgeProbeFreshness", () => {
  it("a non-401 probe response means the key was accepted (404 for the dummy id is normal)", () => {
    const r = classifyEdgeProbeFreshness(404);
    expect(r.store).toBe("edge");
    expect(r.status).toBe("OK");
  });

  it("401 means the ~72-day key has expired — EXPIRED pointing at Partner Center", () => {
    const r = classifyEdgeProbeFreshness(401);
    expect(r.status).toBe("EXPIRED");
    expect(r.reason).toMatch(/72/);
    expect(r.reason).toMatch(/Partner Center/i);
  });

  it("5xx is an ERROR, not a credential verdict", () => {
    expect(classifyEdgeProbeFreshness(503).status).toBe("ERROR");
  });
});

// ── Firefox: authenticated AMO request classification ───────────────────────────────

describe("classifyAmoProbeFreshness", () => {
  it("2xx on the auth-required endpoint verifies the JWT credentials", () => {
    const r = classifyAmoProbeFreshness(200);
    expect(r.store).toBe("firefox");
    expect(r.status).toBe("OK");
  });

  it("401/403 means the JWT credentials were rejected — EXPIRED with the regenerate pointer", () => {
    for (const code of [401, 403]) {
      const r = classifyAmoProbeFreshness(code);
      expect(r.status).toBe("EXPIRED");
      expect(r.reason).toMatch(/addons\.mozilla\.org/);
    }
  });

  it("5xx is an ERROR, not a credential verdict", () => {
    expect(classifyAmoProbeFreshness(500).status).toBe("ERROR");
  });
});

// ── Edge key expiry countdown from EDGE_KEY_ISSUED (manual issued date) ──────────────

describe("edgeKeyCountdown", () => {
  it("computes expiresAt = issued + 72 days and the remaining days", () => {
    const c = edgeKeyCountdown({ issued: daysAgo(10), now: NOW })!;
    expect(c.expired).toBe(false);
    expect(c.daysUntilExpiry).toBe(EDGE_KEY_LIFETIME_DAYS - 10);
    expect(c.expiresAt).toBe(new Date(Date.parse(daysAgo(10)) + EDGE_KEY_LIFETIME_DAYS * DAY).toISOString());
  });

  it("a key older than the lifetime is expired (negative countdown)", () => {
    const c = edgeKeyCountdown({ issued: daysAgo(80), now: NOW })!;
    expect(c.expired).toBe(true);
    expect(c.daysUntilExpiry).toBeLessThan(0);
  });

  it("exactly at the lifetime boundary counts as expired", () => {
    const c = edgeKeyCountdown({ issued: daysAgo(EDGE_KEY_LIFETIME_DAYS), now: NOW })!;
    expect(c.expired).toBe(true);
    expect(c.daysUntilExpiry).toBe(0);
  });

  it("returns null for an absent or unparseable issued date", () => {
    expect(edgeKeyCountdown({ issued: undefined, now: NOW })).toBeNull();
    expect(edgeKeyCountdown({ issued: "not-a-date", now: NOW })).toBeNull();
  });
});

describe("applyEdgeCountdown", () => {
  const okEdge = () => classifyEdgeProbeFreshness(404);

  it("merges the countdown into an OK record", () => {
    const r = applyEdgeCountdown(okEdge(), edgeKeyCountdown({ issued: daysAgo(10), now: NOW }));
    expect(r.status).toBe("OK");
    expect(r.daysUntilExpiry).toBe(62);
    expect(r.expiresAt).toBeTruthy();
  });

  it("flags EXPIRING_SOON inside the warn window", () => {
    const r = applyEdgeCountdown(okEdge(), edgeKeyCountdown({ issued: daysAgo(60), now: NOW }), { warnDays: 14 });
    expect(r.status).toBe("EXPIRING_SOON");
    expect(r.reason).toMatch(/12 day/);
  });

  it("an expired countdown wins even when the probe still passed", () => {
    const r = applyEdgeCountdown(okEdge(), edgeKeyCountdown({ issued: daysAgo(80), now: NOW }));
    expect(r.status).toBe("EXPIRED");
  });

  it("no countdown (EDGE_KEY_ISSUED unset) → probe-result-only, with a note saying so", () => {
    const r = applyEdgeCountdown(okEdge(), null);
    expect(r.status).toBe("OK");
    expect(r.notes.join(" ")).toMatch(/EDGE_KEY_ISSUED/);
  });

  it("never downgrades an EXPIRED probe verdict", () => {
    const r = applyEdgeCountdown(classifyEdgeProbeFreshness(401), edgeKeyCountdown({ issued: daysAgo(10), now: NOW }));
    expect(r.status).toBe("EXPIRED");
  });
});

// ── last-verified history (state file round-trip, injected clock) ───────────────────

describe("applyFreshnessHistory / nextFreshnessState", () => {
  it("a record verified OK now reads 0 days since verified", () => {
    const [r] = applyFreshnessHistory([classifyAmoProbeFreshness(200)], {}, NOW);
    expect(r.lastVerifiedAt).toBe(NOW.toISOString());
    expect(r.daysSinceVerified).toBe(0);
  });

  it("a skipped record carries the previous verification age from state", () => {
    const state = { edge: { lastVerifiedAt: daysAgo(5) } };
    const [r] = applyFreshnessHistory([freshnessSkipped("edge", ["EDGE_API_KEY"])], state, NOW);
    expect(r.lastVerifiedAt).toBe(daysAgo(5));
    expect(r.daysSinceVerified).toBe(5);
  });

  it("no history at all → null (never invents a verification)", () => {
    const [r] = applyFreshnessHistory([freshnessSkipped("chrome", ["CWS_CLIENT_ID"])], {}, NOW);
    expect(r.lastVerifiedAt).toBeNull();
    expect(r.daysSinceVerified).toBeNull();
  });

  it("nextFreshnessState records now for verified stores and keeps prior entries for the rest", () => {
    const state = { chrome: { lastVerifiedAt: daysAgo(9) } };
    const records = [
      freshnessSkipped("chrome", ["CWS_CLIENT_ID"]), // not verified this run
      classifyEdgeProbeFreshness(404), // verified
      classifyAmoProbeFreshness(401), // rejected — must NOT count as verified
    ];
    const next = nextFreshnessState(state, records, NOW);
    expect(next.chrome).toEqual({ lastVerifiedAt: daysAgo(9) });
    expect(next.edge).toEqual({ lastVerifiedAt: NOW.toISOString() });
    expect(next.firefox).toBeUndefined();
  });

  it("EXPIRING_SOON still counts as a successful verification (the credential works today)", () => {
    const soon = applyEdgeCountdown(classifyEdgeProbeFreshness(404), edgeKeyCountdown({ issued: daysAgo(60), now: NOW }));
    const next = nextFreshnessState({}, [soon], NOW);
    expect(next.edge).toEqual({ lastVerifiedAt: NOW.toISOString() });
  });
});

// ── Rendering + exit code ────────────────────────────────────────────────────────────

describe("renderFreshnessTable", () => {
  it("renders one row per store with credential, status, verified age, and expiry", () => {
    const records = applyFreshnessHistory(
      [
        classifyCwsTokenFreshness({ access_token: "t" }, true),
        applyEdgeCountdown(classifyEdgeProbeFreshness(404), edgeKeyCountdown({ issued: daysAgo(60), now: NOW })),
        freshnessSkipped("firefox", ["WEB_EXT_API_KEY", "WEB_EXT_API_SECRET"]),
      ],
      {},
      NOW,
    );
    const table = renderFreshnessTable(records);
    expect(table).toMatch(/chrome/);
    expect(table).toMatch(/CWS_REFRESH_TOKEN/);
    expect(table).toMatch(/EDGE_API_KEY/);
    expect(table).toMatch(/EXPIRING_SOON/);
    expect(table).toMatch(/SKIPPED/);
    expect(table).toMatch(/2026-07-19/); // edge expiresAt: issued 2026-05-08 + 72-day lifetime
  });
});

describe("freshnessExitCode", () => {
  it("0 when everything is OK, SKIPPED, or merely EXPIRING_SOON", () => {
    const records = [
      classifyAmoProbeFreshness(200),
      freshnessSkipped("chrome", ["CWS_CLIENT_ID"]),
      applyEdgeCountdown(classifyEdgeProbeFreshness(404), edgeKeyCountdown({ issued: daysAgo(60), now: NOW })),
    ];
    expect(freshnessExitCode(records)).toBe(0);
  });

  it("1 when any credential is EXPIRED or a check ERRORed", () => {
    expect(freshnessExitCode([classifyEdgeProbeFreshness(401)])).toBe(1);
    expect(freshnessExitCode([freshnessError("chrome", "boom")])).toBe(1);
  });
});

describe("freshness state file hygiene", () => {
  it(".credential-freshness.json is gitignored (timestamps-only state must never be committed)", () => {
    const gitignore = readFileSync(resolve(__dirname, "../../.gitignore"), "utf8");
    expect(gitignore.split("\n")).toContain(".credential-freshness.json");
  });
});
