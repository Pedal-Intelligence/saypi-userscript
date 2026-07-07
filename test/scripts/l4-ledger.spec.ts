import { describe, it, expect, vi, afterEach } from "vitest";
import { existsSync, mkdtempSync, readdirSync, writeFileSync, readFileSync } from "node:fs";
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
import { loadLedger, saveLedger, enforceSpendCap } from "../../scripts/l4-ledger.mjs";

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

  describe("corrupt-ledger recovery preserves evidence (review nit A)", () => {
    it("moves the corrupt file aside to <path>.corrupt-<timestamp> with its bytes intact", () => {
      const dir = mkdtempSync(join(tmpdir(), "l4-ledger-"));
      const path = join(dir, "ledger.json");
      writeFileSync(path, "garbage{{{");
      const { ledger, warning } = loadLedger(path);
      expect(ledger.runs).toEqual([]); // still fail-open
      expect(existsSync(path)).toBe(false); // original moved aside, not left to be clobbered
      const backups = readdirSync(dir).filter((f) => f.startsWith("ledger.json.corrupt-"));
      expect(backups).toHaveLength(1);
      expect(readFileSync(join(dir, backups[0]), "utf8")).toBe("garbage{{{");
      expect(warning).toContain(backups[0]); // the warning says where the evidence went
    });

    it("never replaces a founder-tightened caps block in a VALID ledger with defaults", () => {
      const dir = mkdtempSync(join(tmpdir(), "l4-ledger-"));
      const path = join(dir, "ledger.json");
      writeFileSync(path, JSON.stringify({ caps: { session: 2, week: 5 }, runs: [] }));
      enforceSpendCap({
        harness: "test",
        target: "t",
        purpose: "caps preservation",
        env: { SAYPI_L4_LEDGER_PATH: path },
        now: NOW,
        log: () => {},
      });
      const saved = JSON.parse(readFileSync(path, "utf8"));
      expect(saved.caps).toEqual({ session: 2, week: 5 }); // tightened caps survive the save
      expect(saved.runs).toHaveLength(1);
      expect(existsSync(path + ".corrupt-")).toBe(false); // no spurious backup for a valid file
    });
  });

  describe("enforceSpendCap (review nit B — the enforcement core itself)", () => {
    const exitError = new Error("process.exit called");
    afterEach(() => vi.restoreAllMocks());

    function atCapLedgerFile() {
      const dir = mkdtempSync(join(tmpdir(), "l4-ledger-"));
      const path = join(dir, "ledger.json");
      writeFileSync(path, JSON.stringify({ runs: [runAt(1 * HOURS), runAt(2 * HOURS)] }));
      return path;
    }

    it("refuses with exit code 2 at cap, without ledgering the refused run", () => {
      const path = atCapLedgerFile();
      const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {
        throw exitError;
      });
      const logs: string[] = [];
      expect(() =>
        enforceSpendCap({
          harness: "test",
          target: "t",
          purpose: "refusal",
          env: { SAYPI_L4_LEDGER_PATH: path, SAYPI_L4_CAP_SESSION: "2" },
          now: NOW,
          log: (m: string) => logs.push(m),
        })
      ).toThrow(exitError);
      expect(exitSpy).toHaveBeenCalledWith(2);
      expect(logs.some((m) => /REFUSING to launch/.test(m))).toBe(true);
      expect(JSON.parse(readFileSync(path, "utf8")).runs).toHaveLength(2); // refused run NOT appended
    });

    it("ledgers an over-cap run with override: true under SAYPI_L4_CAP_OVERRIDE=1", () => {
      const path = atCapLedgerFile();
      const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {
        throw exitError;
      });
      const logs: string[] = [];
      enforceSpendCap({
        harness: "test",
        target: "t",
        purpose: "override",
        env: { SAYPI_L4_LEDGER_PATH: path, SAYPI_L4_CAP_SESSION: "2", SAYPI_L4_CAP_OVERRIDE: "1" },
        now: NOW,
        log: (m: string) => logs.push(m),
      });
      expect(exitSpy).not.toHaveBeenCalled();
      const saved = JSON.parse(readFileSync(path, "utf8"));
      expect(saved.runs).toHaveLength(3);
      expect(saved.runs[2].override).toBe(true);
      expect(logs.some((m) => /CAP OVERRIDDEN/.test(m))).toBe(true);
    });

    it("under cap: ledgers the run and does not exit", () => {
      const dir = mkdtempSync(join(tmpdir(), "l4-ledger-"));
      const path = join(dir, "ledger.json");
      const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {
        throw exitError;
      });
      const logs: string[] = [];
      enforceSpendCap({
        harness: "layer4cdp:verify",
        target: "https://pi.ai/talk",
        purpose: "first run bootstraps",
        env: { SAYPI_L4_LEDGER_PATH: path },
        now: NOW,
        log: (m: string) => logs.push(m),
      });
      expect(exitSpy).not.toHaveBeenCalled();
      expect(JSON.parse(readFileSync(path, "utf8")).runs).toHaveLength(1);
      expect(logs.some((m) => /ledgered layer4cdp:verify run/.test(m))).toBe(true);
    });

    it("warns on write failure and does NOT also claim the run was ledgered (review nit C)", () => {
      const dir = mkdtempSync(join(tmpdir(), "l4-ledger-"));
      // Point the ledger path AT A DIRECTORY: read fails (EISDIR) → fail-open fresh
      // ledger; write fails (EISDIR) → warn, run proceeds unledgered.
      const logs: string[] = [];
      enforceSpendCap({
        harness: "test",
        target: "t",
        purpose: "write failure",
        env: { SAYPI_L4_LEDGER_PATH: dir },
        now: NOW,
        log: (m: string) => logs.push(m),
      });
      expect(logs.some((m) => /could not write ledger/.test(m))).toBe(true);
      expect(logs.some((m) => /ledgered test run/.test(m))).toBe(false); // no contradictory success line
    });
  });

  describe("gitignore drift-guard", () => {
    it(".l4-ledger.json is gitignored (personal operational data, never committed)", () => {
      const gitignore = readFileSync(resolve(__dirname, "../../.gitignore"), "utf8");
      expect(gitignore.split("\n")).toContain(".l4-ledger.json");
    });

    it("corrupt-ledger backups are gitignored too", () => {
      const gitignore = readFileSync(resolve(__dirname, "../../.gitignore"), "utf8");
      expect(gitignore.split("\n")).toContain(".l4-ledger.json.corrupt-*");
    });
  });
});
