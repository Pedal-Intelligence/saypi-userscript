import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { sweepHost } from "../../scripts/e2e-host-sweep.mjs";

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
