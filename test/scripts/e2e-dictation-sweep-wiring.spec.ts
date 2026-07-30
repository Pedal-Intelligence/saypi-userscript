import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { sweepField } from "../../scripts/e2e-dictation-sweep.mjs";
import { FIELD_OUTCOME_KINDS, OVERLAY_DISMISS_LABELS } from "../../scripts/e2e-dictation-sweep-lib.mjs";

/**
 * The lib spec next door proves the classifier in isolation. This one proves the
 * WIRING — the invariant doc/e2e-dictation-sweep.md now states as fact and the
 * analysis checklist tells agents to rely on:
 *
 *   every swept field carries an `outcome` verdict in evidence.json, and a field the
 *   harness never reached is never reported as "no button appeared".
 *
 * #569's failure was entirely in the wiring: `classifyFieldOutcome`'s equivalent
 * reasoning could have been done by a human reading the 30s click timeout, but the
 * harness wrote "no .saypi-dictation-button appeared for this field" into notes[] and
 * that's what got read. So these tests read evidence.json off disk, same as the host
 * sweep's undecorated-wiring spec.
 *
 * Stub pages, not a browser: sweepField only touches a handful of Playwright methods,
 * so the real function runs unmodified.
 */

/** The real interception message from the 2026-07-29 grok run, ANSI codes and all. */
const GROK_PROMO_CLICK_ERROR = [
  "page.click: Timeout 10000ms exceeded.",
  "Call log:",
  "\u001b[2m  - waiting for locator('textarea[placeholder]')\u001b[22m",
  "\u001b[2m    - locator resolved to <textarea placeholder=\"Ask anything\">…</textarea>\u001b[22m",
  "\u001b[2m      - <img draggable=\"false\" class=\"css-9pa8cd\" alt=\"Introducing Grok 4.5 for Chat\" src=\"https://abs.twimg.com/responsive-web/client-web/Grok-Promo-Popup-4-5-Launch.fc2ebfea.png\"/> from <div id=\"layers\" class=\"r-zchlnj\">…</div> subtree intercepts pointer events\u001b[22m",
  "\u001b[2m    - retrying click action\u001b[22m",
].join("\n");

const CF_HTML = '<html><head><title>Just a moment...</title></head><body>cf-chl-bypass</body></html>';

const GROK_ITEM = {
  targetKey: "grok",
  targetLabel: "Grok (x.com)",
  url: "https://x.com/i/grok",
  dismissModal: null,
  fieldSelector: "textarea[placeholder]",
  fieldType: "textarea" as const,
  fieldLabel: "Composer (Ask anything)",
};

type Calls = {
  clicks: string[];
  escapes: number;
  screenshots: string[];
  dismissLookups: number;
  /** Every getByRole(role, opts) the harness issued — proves WHICH filter it passed. */
  roleQueries: { role: string; name: unknown }[];
};

/**
 * Minimal Playwright-page stand-in. `clickResults` is consumed one per field-click
 * attempt: a string rejects that attempt with it, null resolves.
 */
function stubPage(opts: {
  /** One entry per field-click attempt: a string or Error rejects it, null resolves. */
  clickResults?: (string | Error | null)[];
  buttonAppears?: boolean;
  dismissControlVisible?: boolean;
  content?: string;
  title?: string;
  build?: string | null;
  calls: Calls;
}) {
  const clickResults = [...(opts.clickResults ?? [null])];
  const noop = async () => undefined;
  const page: Record<string, unknown> = {
    on: () => {},
    goto: noop,
    title: async () => opts.title ?? "Grok / X",
    content: async () => opts.content ?? "<html><body>ok</body></html>",
    url: () => "https://x.com/i/grok",
    evaluate: async (fn: unknown) => {
      // Two different evaluate() uses: the build-stamp read, and the dev-feed-speech dispatch.
      const src = String(fn);
      if (src.includes("saypiBuild")) return opts.build === undefined ? "abc123@main" : opts.build;
      return undefined;
    },
    click: async (selector: string) => {
      if (selector.includes("saypi-dictation-button")) return undefined;
      opts.calls.clicks.push(selector);
      const next = clickResults.length > 1 ? clickResults.shift() : clickResults[0];
      if (next instanceof Error) throw next;
      if (next) throw new Error(next);
      return undefined;
    },
    keyboard: {
      press: async () => {
        opts.calls.escapes += 1;
      },
    },
    getByRole: (role: string, o: { name?: unknown } = {}) => {
      opts.calls.dismissLookups += 1;
      opts.calls.roleQueries.push({ role, name: o.name });
      const locator = {
        first: () => locator,
        waitFor: async () => {
          if (!opts.dismissControlVisible) throw new Error("not visible");
        },
        getAttribute: async () => "Close",
        textContent: async () => "Close",
        click: async () => undefined,
      };
      return locator;
    },
    waitForTimeout: noop,
    waitForSelector: async () => {
      if (opts.buttonAppears === false) throw new Error("not found");
      return {};
    },
    waitForFunction: async () => ({ jsonValue: async () => "Hello there, this is a test." }),
    screenshot: async ({ path }: { path: string }) => {
      opts.calls.screenshots.push(path.split("/").pop() as string);
    },
    close: noop,
  };
  return page;
}

const freshCalls = (): Calls => ({ clicks: [], escapes: 0, screenshots: [], dismissLookups: 0, roleQueries: [] });

const run = (page: unknown, outDir: string, item = GROK_ITEM) =>
  sweepField({ newPage: async () => page }, item, outDir, 0);

const evidenceOnDisk = (outDir: string, target = "grok") =>
  JSON.parse(readFileSync(join(outDir, `${target}__0`, "evidence.json"), "utf8"));

describe("sweepField always records an outcome, and never blames SayPi for an unreached field (#569)", () => {
  let outDir: string;
  let calls: Calls;

  beforeEach(() => {
    outDir = mkdtempSync(join(tmpdir(), "saypi-dictation-wiring-"));
    calls = freshCalls();
  });

  afterEach(() => {
    rmSync(outDir, { recursive: true, force: true });
  });

  it("reports X's promo overlay by name instead of the generic no-button note", async () => {
    const ev = await run(stubPage({ clickResults: [GROK_PROMO_CLICK_ERROR], calls }), outDir);

    expect(ev.fieldFocused).toBe(false);
    expect(ev.outcome!.kind).toBe(FIELD_OUTCOME_KINDS.OVERLAY_BLOCKED);
    expect(ev.outcome!.owner).toBe("host");
    expect(ev.outcome!.interceptor!.element).toBe("img.css-9pa8cd[Introducing Grok 4.5 for Chat]");

    const onDisk = evidenceOnDisk(outDir);
    expect(onDisk.outcome.kind).toBe(FIELD_OUTCOME_KINDS.OVERLAY_BLOCKED);
    // AC1/AC2: the note a human reads names the overlay, and the misleading generic
    // line is gone entirely.
    expect(onDisk.notes.join("\n")).toMatch(/img\.css-9pa8cd\[Introducing Grok 4\.5 for Chat\]/);
    expect(onDisk.notes.join("\n")).not.toMatch(/no \.saypi-dictation-button appeared for this field/);
    // The screenshot is named for the verdict, so the evidence dir self-describes.
    expect(calls.screenshots).toContain("99-overlay-blocked.png");
  });

  it("tries a generic dismissal (Escape, then a close-labelled control) before giving up", async () => {
    await run(stubPage({ clickResults: [GROK_PROMO_CLICK_ERROR], dismissControlVisible: true, calls }), outDir);

    expect(calls.escapes).toBe(1);
    expect(calls.dismissLookups).toBe(1);
    expect(calls.clicks.filter((c) => c === GROK_ITEM.fieldSelector)).toHaveLength(2); // one retry, not more
    expect(evidenceOnDisk(outDir).overlayDismissSteps.join(" ")).toMatch(/Escape/);
  });

  it("recovers when the dismissal works: the retry focuses and a real verdict follows", async () => {
    const ev = await run(
      stubPage({ clickResults: [GROK_PROMO_CLICK_ERROR, null], dismissControlVisible: true, calls }),
      outDir,
    );

    expect(ev.fieldFocused).toBe(true);
    expect(ev.outcome!.kind).toBe(FIELD_OUTCOME_KINDS.REACHED);
    expect(ev.transcriptLanded).toBe(true);
  });

  it("does not touch the overlay rescue when the first focus click lands (fixture/mistral path)", async () => {
    const ev = await run(stubPage({ calls }), outDir);

    expect(calls.escapes).toBe(0);
    expect(calls.dismissLookups).toBe(0);
    expect(ev.overlayDismissSteps).toEqual([]);
    expect(ev.outcome!.kind).toBe(FIELD_OUTCOME_KINDS.REACHED);
    expect(ev.transcriptLanded).toBe(true);
  });

  it("still calls a reached-but-buttonless field a SayPi defect", async () => {
    const ev = await run(stubPage({ buttonAppears: false, calls }), outDir);

    expect(ev.fieldFocused).toBe(true);
    expect(ev.buttonAppeared).toBe(false);
    expect(ev.outcome!.kind).toBe(FIELD_OUTCOME_KINDS.NO_BUTTON);
    expect(ev.outcome!.owner).toBe("saypi");
    expect(calls.screenshots).toContain("99-no-button.png");
  });

  it("classifies the Cloudflare early return, which bypasses the normal classifier", async () => {
    const ev = await run(
      stubPage({ title: "Just a moment...", content: CF_HTML, calls }),
      outDir,
    );

    expect(ev.cloudflareBlocked).toBe(true);
    expect(ev.outcome!.kind).toBe(FIELD_OUTCOME_KINDS.ABORTED);
    expect(evidenceOnDisk(outDir).outcome).not.toBeNull();
  });

  it("classifies a run that throws mid-field rather than defaulting to no-button", async () => {
    // Nearly every page call in sweepField is individually guarded (that's why a
    // throw used to end up looking like "no button"), so throw from the un-guarded
    // build-stamp re-check wait — the honest way to reach the outer catch.
    const page = stubPage({ build: null, calls });
    page.waitForTimeout = async () => {
      throw new Error("Target closed");
    };
    const ev = await run(page, outDir);

    expect(ev.outcome!.kind).toBe(FIELD_OUTCOME_KINDS.ABORTED);
    expect(ev.notes.join("\n")).toMatch(/Target closed/);
    expect(evidenceOnDisk(outDir).outcome).not.toBeNull();
  });
  it("passes OVERLAY_DISMISS_LABELS itself as the getByRole filter (#569 review)", async () => {
    // The stub used to ignore getByRole's arguments, so the one safeguard standing
    // between the rescue and a "Accept all"/"Log in" button went untested where it is
    // actually applied. Assert the real filter object reaches Playwright.
    await run(stubPage({ clickResults: [GROK_PROMO_CLICK_ERROR], dismissControlVisible: true, calls }), outDir);

    expect(calls.roleQueries).toHaveLength(1);
    expect(calls.roleQueries[0].role).toBe("button");
    expect(calls.roleQueries[0].name).toBe(OVERLAY_DISMISS_LABELS);
  });

  it("does not call an empty-message click rejection a success (#569 review)", async () => {
    // `page.click(...).catch((e) => e.message)` yields "" for `new Error("")`, and ""
    // is falsy — so the focus read as successful and the field classified as
    // no-button / owner:saypi: the exact false SayPi defect #569 exists to prevent.
    const ev = await run(stubPage({ clickResults: [new Error(""), new Error("")], calls }), outDir);

    expect(ev.fieldFocused).toBe(false);
    expect(ev.focusError).toBeTruthy();
    expect(ev.outcome!.kind).not.toBe(FIELD_OUTCOME_KINDS.NO_BUTTON);
    expect(ev.outcome!.owner).not.toBe("saypi");
    expect(ev.outcome!.fieldReached).toBe(false);
  });
});
