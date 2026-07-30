import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { sweepHost } from "../../scripts/e2e-host-sweep.mjs";
import { DECORATION_PROBE, DIAGS, UNDECORATED_KINDS } from "../../scripts/e2e-host-sweep-lib.mjs";

/**
 * The classifier spec next door proves classifyUndecorated() in isolation. This one
 * proves the WIRING — specifically the invariant doc/e2e-host-sweep.md now states as
 * fact and the analysis checklist tells agents to rely on:
 *
 *   an undecorated host ALWAYS carries an `undecorated` verdict in evidence.json.
 *
 * That invariant is held by a guard in sweepHost's `finally`, and it exists precisely
 * because two paths return before the classifier would otherwise run (the Cloudflare
 * early return, and the outer catch). Asserting it on the return value alone would be
 * weaker than the claim — the checklist sends a reader to the FILE — so these tests
 * read evidence.json off disk.
 *
 * Stub pages, not a browser: sweepHost only needs the handful of Playwright methods
 * exercised before the early returns, so the real function runs unmodified.
 */

const CF_HTML = '<html><head><title>Just a moment...</title></head><body>cf-chl-bypass</body></html>';

/** Minimal Playwright-page stand-in; `overrides` shape the path under test. */
function stubPage(overrides: Record<string, unknown> = {}) {
  const noop = async () => undefined;
  return {
    on: () => {},
    addInitScript: noop,
    goto: noop,
    title: async () => "New chat",
    content: async () => "<html><body>ok</body></html>",
    url: () => "https://chatgpt.com/",
    waitForSelector: async () => {
      throw new Error("not found");
    },
    evaluate: noop,
    screenshot: noop,
    close: noop,
    ...overrides,
  };
}

const runSweep = (page: unknown, outDir: string) =>
  sweepHost({ newPage: async () => page }, "chatgpt", "https://chatgpt.com/", { noTurn: true }, outDir);

const evidenceOnDisk = (outDir: string) =>
  JSON.parse(readFileSync(join(outDir, "chatgpt", "evidence.json"), "utf8"));

describe("sweepHost always records a verdict for an undecorated host (#559)", () => {
  let outDir: string;

  beforeEach(() => {
    outDir = mkdtempSync(join(tmpdir(), "saypi-sweep-wiring-"));
  });

  afterEach(() => {
    rmSync(outDir, { recursive: true, force: true });
  });

  it("classifies the Cloudflare early return, which bypasses the normal classifier", async () => {
    const ev = await runSweep(
      stubPage({ title: async () => "Just a moment...", content: async () => CF_HTML }),
      outDir
    );

    expect(ev.cloudflareBlocked).toBe(true);
    expect(ev.decorated).toBe(false);
    expect(ev.undecorated).not.toBeNull();
    expect(evidenceOnDisk(outDir).undecorated).not.toBeNull();
  });

  it("classifies a run that throws after the decoration wait", async () => {
    // page.url() is read again after waitForSelector and is NOT individually guarded,
    // so throwing there is the honest way to reach the outer catch.
    let urlCalls = 0;
    const ev = await runSweep(
      stubPage({
        url: () => {
          if (++urlCalls > 1) throw new Error("target closed");
          return "https://chatgpt.com/";
        },
      }),
      outDir
    );

    expect(ev.decorated).toBe(false);
    expect(ev.notes.some((n: string) => n.includes("target closed"))).toBe(true);
    expect(ev.undecorated).not.toBeNull();
    expect(evidenceOnDisk(outDir).undecorated).not.toBeNull();
  });

  it("leaves the verdict null when the host decorated — the invariant is one-directional", async () => {
    const ev = await runSweep(stubPage({ waitForSelector: async () => ({}) }), outDir);

    expect(ev.decorated).toBe(true);
    expect(ev.undecorated).toBeNull();
    // finalUrl is populated regardless; only the verdict is decoration-conditional.
    expect(evidenceOnDisk(outDir).finalUrl).toBe("https://chatgpt.com/");
  });
});

/**
 * #570 — the wiring for the layer underneath the verdict. The classifier spec proves
 * describeDecoration/classifyUndecorated in isolation; this proves the harness actually
 * *takes the reading* and folds it into what lands on disk.
 *
 * The sequencing is the whole point: `01-before.png` and `domDiagnostics` are captured
 * AFTER the decoration wait, which is exactly how they came to contradict it on
 * 2026-07-29 (`decorated: false` + `possible-drift`, but `callButtons: 1` and a
 * screenshot showing the button). Now that contradiction has to be *reported*, not
 * silently filed as drift.
 */
describe("sweepHost records the decoration measurement (#570)", () => {
  let outDir: string;

  beforeEach(() => {
    outDir = mkdtempSync(join(tmpdir(), "saypi-sweep-decoration-"));
  });

  afterEach(() => {
    rmSync(outDir, { recursive: true, force: true });
  });

  /** Route each in-page evaluate by the function the harness passes. */
  const evaluateWith = (readings: { probe?: unknown; diags?: unknown }) =>
    async (fn: unknown) => {
      if (fn === DECORATION_PROBE) return readings.probe ?? null;
      if (fn === DIAGS.chatgpt) return readings.diags ?? {};
      return undefined;
    };

  const missedButPresent = {
    selector: "#saypi-callButton",
    count: 1,
    present: true,
    firstSeenMs: 771,
    presentAtInstall: false,
    watcherInstalledAtMs: 0,
    checkedAtMs: 25_100,
    box: { x: 8, y: 700, width: 44, height: 44 },
    computed: { display: "block", visibility: "visible", opacity: "1" },
    hasBox: true,
  };

  it("reports the contradicted miss as an internal inconsistency, not possible-drift", async () => {
    const ev = await runSweep(
      stubPage({ evaluate: evaluateWith({ probe: missedButPresent, diags: { callButtons: 1 } }) }),
      outDir
    );

    expect(ev.decorated).toBe(false);
    const onDisk = evidenceOnDisk(outDir);
    expect(onDisk.undecorated.kind).toBe(UNDECORATED_KINDS.INCONSISTENT);
    // The three facts the issue's first acceptance criterion asks for.
    expect(onDisk.decoration.everPresent).toBe(true);
    expect(onDisk.decoration.firstSeenMs).toBe(771);
    expect(onDisk.decoration.box).toEqual({ x: 8, y: 700, width: 44, height: 44 });
    expect(onDisk.decoration.computed.visibility).toBe("visible");
    expect(onDisk.decoration.contradiction).toBe("visible-but-missed");
  });

  it("still says possible-drift when the button genuinely never appeared", async () => {
    const ev = await runSweep(
      stubPage({
        evaluate: evaluateWith({
          probe: { ...missedButPresent, count: 0, present: false, firstSeenMs: null, box: null, computed: null, hasBox: true },
          diags: { callButtons: 0 },
        }),
      }),
      outDir
    );

    expect(ev.decorated).toBe(false);
    const onDisk = evidenceOnDisk(outDir);
    expect(onDisk.undecorated.kind).toBe(UNDECORATED_KINDS.DRIFT);
    expect(onDisk.decoration.everPresent).toBe(false);
    expect(onDisk.decoration.contradiction).toBeNull();
  });

  it("records the timing baseline on a healthy host too", async () => {
    const ev = await runSweep(
      stubPage({
        waitForSelector: async () => ({}),
        evaluate: evaluateWith({ probe: missedButPresent, diags: { callButtons: 1 } }),
      }),
      outDir
    );

    expect(ev.decorated).toBe(true);
    const onDisk = evidenceOnDisk(outDir);
    expect(onDisk.decoration.firstSeenMs).toBe(771);
    expect(onDisk.decoration.contradiction).toBeNull();
    expect(onDisk.undecorated).toBeNull();
  });

  it("installs the decoration watcher before navigating, so timing is navigation-relative", async () => {
    const order: string[] = [];
    await runSweep(
      stubPage({
        addInitScript: async () => { order.push("addInitScript"); },
        goto: async () => { order.push("goto"); },
        evaluate: evaluateWith({ probe: missedButPresent, diags: { callButtons: 1 } }),
      }),
      outDir
    );

    expect(order).toEqual(["addInitScript", "goto"]);
  });

  it("keeps looking by DOM PRESENCE after a miss, and does not on a healthy host", async () => {
    // The grace re-read is what separates "never in the DOM" from "in the DOM, later
    // than the budget" — and it must cost a healthy host nothing.
    const waits = (calls: Array<Record<string, unknown>>, decorated: boolean) => async (
      _sel: string,
      opts: Record<string, unknown>
    ) => {
      calls.push(opts);
      if (decorated) return {};
      throw new Error("not found");
    };

    const missCalls: Array<Record<string, unknown>> = [];
    await runSweep(
      stubPage({
        waitForSelector: waits(missCalls, false),
        evaluate: evaluateWith({ probe: missedButPresent, diags: { callButtons: 1 } }),
      }),
      outDir
    );
    expect(missCalls).toHaveLength(2);
    expect(missCalls[0].state).toBeUndefined(); // the verdict wait: Playwright's default 'visible'
    expect(missCalls[0].timeout).toBe(25_000); // budget UNCHANGED (#570 explicitly out of scope)
    expect(missCalls[1].state).toBe("attached"); // the grace read: presence, not visibility

    const hitCalls: Array<Record<string, unknown>> = [];
    await runSweep(
      stubPage({
        waitForSelector: waits(hitCalls, true),
        evaluate: evaluateWith({ probe: missedButPresent, diags: { callButtons: 1 } }),
      }),
      outDir
    );
    expect(hitCalls).toHaveLength(1);
  });

  it("degrades honestly when the probe cannot run", async () => {
    const ev = await runSweep(
      stubPage({
        evaluate: async () => { throw new Error("Execution context was destroyed"); },
      }),
      outDir
    );

    expect(ev.decorated).toBe(false);
    const onDisk = evidenceOnDisk(outDir);
    expect(onDisk.decoration.probed).toBe(false);
    expect(onDisk.decoration.everPresent).toBeNull();
    // No reading is no excuse for a missing verdict — the #559 invariant still holds.
    expect(onDisk.undecorated).not.toBeNull();
  });
});
