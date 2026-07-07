import { describe, it, expect } from "vitest";
import { mkdtempSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import {
  DEFAULT_CAPS,
  SESSION_WINDOW_MS,
  WEEK_WINDOW_MS,
  emptyLedger,
  parseLedger,
  resolveCaps,
  resolveLedgerPath,
  recordRun,
  countRuns,
  checkCaps,
  formatReport,
} from "../../scripts/l4-ledger-lib.mjs";
import { loadLedger, saveLedger } from "../../scripts/l4-ledger.mjs";

const NOW = Date.parse("2026-07-07T12:00:00Z");
const HOURS = 60 * 60 * 1000;
const DAYS = 24 * HOURS;

/** A run entry `agoMs` before NOW. */
function runAt(agoMs: number, extra: Record<string, unknown> = {}) {
  return {
    timestamp: new Date(NOW - agoMs).toISOString(),
    harness: "layer4cdp:verify",
    target: "https://claude.ai/new",
    purpose: "test",
    ...extra,
  };
}

describe("l4-ledger (#533 — spend caps + resource ledger for Layer-4 runs)", () => {
  describe("countRuns (windowed counting with injected now)", () => {
    it("counts only runs inside the window", () => {
      const runs = [runAt(1 * HOURS), runAt(13 * HOURS), runAt(6 * DAYS), runAt(8 * DAYS)];
      expect(countRuns(runs, SESSION_WINDOW_MS, NOW)).toBe(1); // only the 1h-ago run is inside 12h
      expect(countRuns(runs, WEEK_WINDOW_MS, NOW)).toBe(3); // 8d-ago is outside the week
    });

    it("ignores entries with unparseable timestamps rather than crashing", () => {
      const runs = [runAt(1 * HOURS), { timestamp: "not-a-date" }, {}];
      expect(countRuns(runs as never, SESSION_WINDOW_MS, NOW)).toBe(1);
    });
  });

  describe("recordRun", () => {
    it("appends an entry with timestamp/harness/target/purpose without mutating the input", () => {
      const before = emptyLedger();
      const after = recordRun(before, {
        harness: "e2e-host-sweep",
        target: "pi,claude,chatgpt",
        purpose: "post-merge sweep",
        now: NOW,
      });
      expect(before.runs).toHaveLength(0); // no mutation
      expect(after.runs).toHaveLength(1);
      expect(after.runs[0]).toMatchObject({
        harness: "e2e-host-sweep",
        target: "pi,claude,chatgpt",
        purpose: "post-merge sweep",
      });
      expect(Date.parse(after.runs[0].timestamp)).toBe(NOW);
    });
  });

  describe("checkCaps (cap boundaries)", () => {
    const caps = { session: 6, week: 25 };

    it("is ok under the session cap", () => {
      const ledger = { runs: Array.from({ length: 5 }, () => runAt(1 * HOURS)) };
      const r = checkCaps(ledger, caps, NOW);
      expect(r.ok).toBe(true);
      expect(r.sessionCount).toBe(5);
    });

    it("blocks AT the session cap (the cap+1'th run is refused)", () => {
      const ledger = { runs: Array.from({ length: 6 }, () => runAt(1 * HOURS)) };
      const r = checkCaps(ledger, caps, NOW);
      expect(r.ok).toBe(false);
      expect(r.sessionCount).toBe(6);
    });

    it("blocks at the week cap even when the session window is clear", () => {
      const ledger = { runs: Array.from({ length: 25 }, () => runAt(2 * DAYS)) };
      const r = checkCaps(ledger, caps, NOW);
      expect(r.ok).toBe(false);
      expect(r.sessionCount).toBe(0);
      expect(r.weekCount).toBe(25);
    });

    it("frees up as runs age out of the session window", () => {
      const ledger = { runs: Array.from({ length: 6 }, () => runAt(13 * HOURS)) };
      const r = checkCaps(ledger, caps, NOW);
      expect(r.ok).toBe(true);
      expect(r.sessionCount).toBe(0);
      expect(r.weekCount).toBe(6);
    });

    it("warns when this run is the last one under a cap", () => {
      const ledger = { runs: Array.from({ length: 5 }, () => runAt(1 * HOURS)) };
      const r = checkCaps(ledger, caps, NOW);
      expect(r.ok).toBe(true);
      expect(r.warnings.some((w: string) => /last/i.test(w))).toBe(true);
    });
  });

  describe("resolveCaps (defaults < ledger caps block < env vars)", () => {
    it("uses the proposed defaults with no env and no ledger caps block", () => {
      expect(resolveCaps({}, emptyLedger())).toEqual(DEFAULT_CAPS);
      expect(DEFAULT_CAPS).toEqual({ session: 6, week: 25 });
    });

    it("honours a caps block in the ledger file", () => {
      const ledger = { caps: { session: 3, week: 10 }, runs: [] };
      expect(resolveCaps({}, ledger)).toEqual({ session: 3, week: 10 });
    });

    it("lets SAYPI_L4_CAP_SESSION / SAYPI_L4_CAP_WEEK override everything", () => {
      const ledger = { caps: { session: 3, week: 10 }, runs: [] };
      const env = { SAYPI_L4_CAP_SESSION: "2", SAYPI_L4_CAP_WEEK: "9" };
      expect(resolveCaps(env, ledger)).toEqual({ session: 2, week: 9 });
    });

    it("ignores invalid env values and falls back", () => {
      const env = { SAYPI_L4_CAP_SESSION: "abc", SAYPI_L4_CAP_WEEK: "-4" };
      expect(resolveCaps(env, emptyLedger())).toEqual(DEFAULT_CAPS);
    });
  });

  describe("parseLedger (never crash a verify run)", () => {
    it("bootstraps a fresh ledger when there is no file content", () => {
      const { ledger, warning } = parseLedger(null);
      expect(ledger.runs).toEqual([]);
      expect(warning).toBeUndefined();
    });

    it("warns and starts fresh on corrupt JSON", () => {
      const { ledger, warning } = parseLedger("{ not json !!");
      expect(ledger.runs).toEqual([]);
      expect(warning).toMatch(/corrupt/i);
    });

    it("warns and starts fresh on a wrong-shaped file", () => {
      for (const bad of ["[]", '{"runs": "nope"}', '"hi"']) {
        const { ledger, warning } = parseLedger(bad);
        expect(ledger.runs).toEqual([]);
        expect(warning).toMatch(/corrupt|shape/i);
      }
    });
  });

  describe("loadLedger / saveLedger (fs round-trip)", () => {
    it("returns a fresh ledger for a missing file (first run bootstraps)", () => {
      const dir = mkdtempSync(join(tmpdir(), "l4-ledger-"));
      const { ledger, warning } = loadLedger(join(dir, "does-not-exist.json"));
      expect(ledger.runs).toEqual([]);
      expect(warning).toBeUndefined();
    });

    it("survives a corrupt file on disk (warn + fresh, no crash)", () => {
      const dir = mkdtempSync(join(tmpdir(), "l4-ledger-"));
      const path = join(dir, "ledger.json");
      writeFileSync(path, "garbage{{{");
      const { ledger, warning } = loadLedger(path);
      expect(ledger.runs).toEqual([]);
      expect(warning).toBeTruthy();
    });

    it("round-trips a recorded run", () => {
      const dir = mkdtempSync(join(tmpdir(), "l4-ledger-"));
      const path = join(dir, "ledger.json");
      const ledger = recordRun(emptyLedger(), { harness: "h", target: "t", purpose: "p", now: NOW });
      saveLedger(path, ledger);
      const { ledger: back } = loadLedger(path);
      expect(back.runs).toHaveLength(1);
      expect(back.runs[0].harness).toBe("h");
    });
  });

  describe("resolveLedgerPath", () => {
    it("defaults to .l4-ledger.json at the repo root", () => {
      expect(resolveLedgerPath({}, "/repo")).toBe(join("/repo", ".l4-ledger.json"));
    });

    it("honours SAYPI_L4_LEDGER_PATH (test/scratch ledgers must not pollute the real one)", () => {
      expect(resolveLedgerPath({ SAYPI_L4_LEDGER_PATH: "/tmp/scratch.json" }, "/repo")).toBe("/tmp/scratch.json");
    });
  });

  describe("formatReport", () => {
    it("includes session/week counts against caps and recent runs", () => {
      let ledger = emptyLedger();
      ledger = recordRun(ledger, { harness: "layer4cdp:verify", target: "https://pi.ai/talk", purpose: "verify #533", now: NOW - 1 * HOURS });
      const out = formatReport(ledger, { session: 6, week: 25 }, NOW);
      expect(out).toMatch(/1\/6/);
      expect(out).toMatch(/1\/25/);
      expect(out).toContain("layer4cdp:verify");
      expect(out).toContain("verify #533");
    });
  });

  describe("gitignore drift-guard", () => {
    it(".l4-ledger.json is gitignored (personal operational data, never committed)", () => {
      const gitignore = readFileSync(resolve(__dirname, "../../.gitignore"), "utf8");
      expect(gitignore.split("\n")).toContain(".l4-ledger.json");
    });
  });
});
