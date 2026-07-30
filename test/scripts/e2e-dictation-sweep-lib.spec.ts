import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import {
  TARGETS,
  flattenFields,
  parseSweepArgs,
  transcriptLanded,
  summarizeField,
  describeInterceptor,
  classifyFieldOutcome,
  FIELD_OUTCOME_KINDS,
  OVERLAY_DISMISS_LABELS,
} from "../../scripts/e2e-dictation-sweep-lib.mjs";

describe("TARGETS registry", () => {
  it("covers the v1 fixture + Mistral + Grok targets, each with at least one field", () => {
    expect(TARGETS.map((t) => t.key)).toEqual(["fixture", "mistral", "grok"]);
    for (const t of TARGETS) {
      expect(typeof t.label).toBe("string");
      expect(t.fields.length).toBeGreaterThan(0);
      for (const f of t.fields) {
        expect(typeof f.selector).toBe("string");
        expect(typeof f.label).toBe("string");
        expect(["input", "textarea", "contenteditable"]).toContain(f.type);
      }
    }
  });
  it("the fixture target has no URL (the harness serves it) and no modal to dismiss", () => {
    const fixture = TARGETS.find((t) => t.key === "fixture");
    expect(fixture?.url).toBeNull();
    expect(fixture?.dismissModal).toBeNull();
  });
  it("the mistral target is a real https URL with a ToS dismiss config", () => {
    const mistral = TARGETS.find((t) => t.key === "mistral");
    expect(mistral?.url).toMatch(/^https:\/\//);
    expect(mistral?.dismissModal).toMatchObject({ role: "button" });
  });
  it("the grok target's field selector is stable across dictation (no :visible, no pinned placeholder value)", () => {
    const grok = TARGETS.find((t) => t.key === "grok");
    expect(grok?.url).toBe("https://x.com/i/grok");
    // `:visible` throws a SyntaxError under native document.querySelector(), which
    // is how the harness checks transcript-landed (page.waitForFunction) — so the
    // field selector must be plain CSS the browser itself understands, not a
    // Playwright-only extension.
    expect(grok?.fields[0]?.selector).not.toMatch(/:visible/);
    // Must not pin the placeholder's *value* either: UniversalDictationModule
    // rewrites it while dictating (e.g. to "Recording..."), so a value-pinned
    // selector stops matching once recording starts — a false "didn't land".
    // Presence-only (`[placeholder]`, no `=`) still disambiguates from x.com's
    // second, placeholder-less mirror textarea, and stays valid all session.
    expect(grok?.fields[0]?.selector).toBe("textarea[placeholder]");
  });
});

describe("flattenFields", () => {
  it("produces one flat entry per field, carrying the parent target's key/label/url/modal", () => {
    const items = flattenFields(TARGETS);
    const totalFieldCount = TARGETS.reduce((sum, t) => sum + t.fields.length, 0);
    expect(items.length).toBe(totalFieldCount);
    for (const item of items) {
      expect(item.targetKey).toBeDefined();
      expect(item.targetLabel).toBeDefined();
      expect(item.fieldSelector).toBeDefined();
      expect(item.fieldType).toBeDefined();
      expect(item.fieldLabel).toBeDefined();
    }
  });
  it("does not mutate the source TARGETS array", () => {
    const before = JSON.stringify(TARGETS);
    flattenFields(TARGETS);
    expect(JSON.stringify(TARGETS)).toBe(before);
  });
  it("is pure over a custom targets array (doesn't reach for the module-level TARGETS)", () => {
    const custom = [{ key: "x", label: "X", url: "https://x.example", dismissModal: null, fields: [{ selector: "#a", type: "input" as const, label: "A" }] }];
    expect(flattenFields(custom)).toEqual([
      { targetKey: "x", targetLabel: "X", url: "https://x.example", dismissModal: null, fieldSelector: "#a", fieldType: "input", fieldLabel: "A" },
    ]);
  });
});

describe("parseSweepArgs", () => {
  it("defaults to all targets, headed", () => {
    const a = parseSweepArgs([]);
    expect(a.targets).toEqual(["fixture", "mistral", "grok"]);
    expect(a.headed).toBe(true);
    expect(a.unknownTargets).toEqual([]);
  });
  it("selects a subset by target key, preserving the requested set", () => {
    expect(parseSweepArgs(["mistral"]).targets).toEqual(["mistral"]);
  });
  it("collects unknown target tokens instead of treating them as targets", () => {
    const a = parseSweepArgs(["gmail", "fixture"]);
    expect(a.targets).toEqual(["fixture"]);
    expect(a.unknownTargets).toEqual(["gmail"]);
  });
  it("honors --headless", () => {
    expect(parseSweepArgs(["--headless"]).headed).toBe(false);
  });
});

describe("transcriptLanded", () => {
  it("is true for any non-empty trimmed string", () => {
    expect(transcriptLanded("Hello there, this is a test.")).toBe(true);
    expect(transcriptLanded("  padded  ")).toBe(true);
  });
  it("is false for empty, whitespace-only, null, or non-string values", () => {
    expect(transcriptLanded("")).toBe(false);
    expect(transcriptLanded("   ")).toBe(false);
    expect(transcriptLanded(null)).toBe(false);
    expect(transcriptLanded(undefined)).toBe(false);
    expect(transcriptLanded(false)).toBe(false);
  });
});

describe("summarizeField", () => {
  it("separates SayPi-attributable errors/warnings from host noise, keyed on field-landed", () => {
    const s = summarizeField({
      target: "mistral",
      field: "Composer (ProseMirror)",
      decorated: true,
      buttonAppeared: true,
      transcriptLanded: true,
      console: [
        { t: "error", text: "[SayPi DEBUG] something broke" },
        { t: "error", text: "ProseMirror expects the CSS white-space property" },
        { t: "warning", text: "[SayPi] heads up" },
      ],
      pageErrors: [{ message: "x" }],
      requestFailed: [{ url: "https://api.saypi.ai/transcribe" }],
    });
    expect(s).toMatchObject({
      target: "mistral",
      field: "Composer (ProseMirror)",
      decorated: true,
      buttonAppeared: true,
      transcriptLanded: true,
      consoleErrors: 2,
      saypiErrors: 1,
      hostErrors: 1,
      saypiWarnings: 1,
      pageErrors: 1,
      netFailures: 1,
    });
  });
  it("is robust to an empty / partial evidence object", () => {
    const s = summarizeField({});
    expect(s.decorated).toBe(false);
    expect(s.buttonAppeared).toBe(false);
    expect(s.transcriptLanded).toBe(false);
    expect(s.consoleErrors).toBe(0);
    expect(s.saypiErrors).toBe(0);
  });
  it("flags a field whose button never appeared as not landed, regardless of decoration", () => {
    const s = summarizeField({ decorated: true, buttonAppeared: false, transcriptLanded: false });
    expect(s.decorated).toBe(true);
    expect(s.buttonAppeared).toBe(false);
    expect(s.transcriptLanded).toBe(false);
  });
  it("carries the field outcome's kind/owner/reached forward so summary.json can be triaged (#569)", () => {
    const s = summarizeField({
      target: "grok",
      decorated: true,
      buttonAppeared: false,
      transcriptLanded: false,
      outcome: {
        kind: FIELD_OUTCOME_KINDS.OVERLAY_BLOCKED,
        owner: "host",
        fieldReached: false,
        interceptor: { element: 'img.css-9pa8cd[Introducing Grok 4.5 for Chat]', container: "div#layers", raw: "" },
        note: "…",
      },
    });
    expect(s.outcomeKind).toBe(FIELD_OUTCOME_KINDS.OVERLAY_BLOCKED);
    expect(s.owner).toBe("host");
    expect(s.fieldReached).toBe(false);
    expect(s.interceptor).toBe('img.css-9pa8cd[Introducing Grok 4.5 for Chat]');
  });
  it("leaves the outcome fields null when a run predates / lacks a classification", () => {
    const s = summarizeField({});
    expect(s.outcomeKind).toBeNull();
    expect(s.owner).toBeNull();
    expect(s.fieldReached).toBe(false);
    expect(s.interceptor).toBeNull();
  });
});

/**
 * #569: X served a "Introducing Grok 4.5 for Chat" promo modal into `div#layers`,
 * which swallowed every click at the composer. `page.click` retried for 30s and
 * failed, and the sweep then recorded the generic
 * "no .saypi-dictation-button appeared for this field" — a note that reads as a
 * SayPi decoration defect for a field the harness never actually reached.
 *
 * The distinction to draw is exactly the one #559 drew for the host sweep's
 * `classifyUndecorated`: "never got in front of the feature" (automation/host
 * problem, says NOTHING about SayPi) vs. "got in front of the feature and it
 * didn't work" (the defect this sweep exists to find).
 *
 * The fixture is the **verbatim** Playwright message from that run — extracted from
 * `.output/e2e-dictation-sweep/2026-07-29T21-25-23-179Z/grok__4/evidence.json`'s
 * `notes[0]` (minus the harness's own `"focus: "` prefix) and checked in, because
 * `.output/` is gitignored. ANSI escapes intact: stripping them is the code's job,
 * not the fixture's.
 *
 * **Do not trim it.** The first version of this spec used a hand-shortened excerpt,
 * and that truncation hid a real bug. The real log carries EIGHT interceptions, and
 * X's promo animates: the anonymous wrapper `div.css-175oi2r` is blamed both FIRST
 * and LAST, while the informative labelled image sits in the middle. A "take the last
 * one" rule looked right against the excerpt and returned `div.css-175oi2r` — useless
 * to a reader — against reality. The only reason the sweep printed the useful name at
 * all was that `focusError` happened to be sliced to 4000 chars, clipping the trailing
 * wrapper: a coincidence, not a design, and one the 30s→10s timeout change could flip.
 */
const REAL_GROK_LOG = readFileSync(
  new URL("../fixtures/e2e-dictation-sweep/grok-promo-click-error.txt", import.meta.url),
  "utf8",
);

describe("describeInterceptor — name the overlay Playwright already blamed (#569)", () => {
  it("has a verbatim, untrimmed fixture (guards the truncation that hid the bug)", () => {
    // Pinned so a future "tidy up the fixture" breaks loudly rather than silently
    // restoring the excerpt that made a broken selection rule look correct.
    expect(REAL_GROK_LOG.length).toBe(4726);
    expect(REAL_GROK_LOG.match(/intercepts pointer events/g)).toHaveLength(8);
    expect(REAL_GROK_LOG).toContain("[2m"); // ANSI intact
    // The trap itself: the LAST interception blames the anonymous wrapper, not the
    // labelled promo image.
    const last = REAL_GROK_LOG.lastIndexOf("intercepts pointer events");
    expect(REAL_GROK_LOG.slice(last - 300, last)).toContain("css-175oi2r");
    expect(REAL_GROK_LOG.slice(last - 300, last)).not.toContain("Introducing Grok");
  });

  it("names the X promo image and the layer it lives in, from the REAL untrimmed log", () => {
    const i = describeInterceptor(REAL_GROK_LOG);
    expect(i).not.toBeNull();
    // Identity, not creative: tag + class + accessible-ish label, so the note is
    // actionable without the harness knowing anything about this promo.
    expect(i!.element).toBe("img.css-9pa8cd[Introducing Grok 4.5 for Chat]");
    expect(i!.container).toBe("div#layers");
    // No ANSI escapes leak into the human-readable raw line.
    expect(i!.raw).not.toMatch(/\[/);
  });

  it("does not mistake the resolved target locator for the interceptor", () => {
    // The <textarea> appears EARLIER in the call log than any interceptor; blaming
    // it would be worse than the generic note it replaces.
    expect(describeInterceptor(REAL_GROK_LOG)!.element).not.toMatch(/textarea/);
  });

  it("prefers the most identifying interception over merely the last one", () => {
    // A human-readable label beats an id beats a bare class — that's what makes the
    // note actionable. Taking the last blindly is what broke against the real log.
    const log = [
      "  - <img alt=\"Introducing Something\" class=\"promo\"/> from <div id=\"layers\">…</div> subtree intercepts pointer events",
      "  - retrying click action",
      "  - <div class=\"css-wrapper\">…</div> from <div id=\"layers\">…</div> subtree intercepts pointer events",
    ].join("\n");
    expect(describeInterceptor(log)!.element).toBe("img.promo[Introducing Something]");
  });

  it("falls back to the last interception when none is more identifying than another", () => {
    // Class-only throughout: no signal to prefer, so the freshest state wins and the
    // reader still gets something rather than null.
    const log = [
      "  - <div class=\"early\">…</div> from <div id=\"layers\">…</div> subtree intercepts pointer events",
      "  - retrying click action",
      "  - <div class=\"late\">…</div> from <div id=\"layers\">…</div> subtree intercepts pointer events",
    ].join("\n");
    const i = describeInterceptor(log)!;
    expect(i.element).toBe("div.late");
    expect(i.container).toBe("div#layers");
  });

  it("breaks ties toward the freshest interception among equally identifying ones", () => {
    const log = [
      "  - <button aria-label=\"Dismiss\" class=\"a\">…</button> from <div id=\"layers\">…</div> subtree intercepts pointer events",
      "  - <button aria-label=\"Sign up\" class=\"b\">…</button> from <div id=\"layers\">…</div> subtree intercepts pointer events",
    ].join("\n");
    expect(describeInterceptor(log)!.element).toBe("button.b[Sign up]");
  });

  it("handles an interceptor reported without a `from … subtree` clause", () => {
    const log = "  - <div id=\"cookie-banner\">…</div> intercepts pointer events";
    const i = describeInterceptor(log)!;
    expect(i.element).toBe("div#cookie-banner");
    expect(i.container).toBeNull();
  });

  it("still works when the whole call log arrives as one line", () => {
    const oneLine =
      "page.click: Timeout exceeded. Call log: - locator resolved to <textarea placeholder=\"Ask anything\"></textarea> - " +
      "<img class=\"promo\" alt=\"Promo\"/> from <div id=\"layers\">…</div> subtree intercepts pointer events - retrying";
    const i = describeInterceptor(oneLine)!;
    expect(i.element).toBe("img.promo[Promo]");
    expect(i.container).toBe("div#layers");
  });

  it("returns null when the click failed for a reason other than interception", () => {
    expect(describeInterceptor("page.click: Timeout 10000ms exceeded.\nCall log:\n  - waiting for locator('#nope')")).toBeNull();
    expect(describeInterceptor("")).toBeNull();
    expect(describeInterceptor(null)).toBeNull();
    expect(describeInterceptor(undefined)).toBeNull();
  });
});

describe("classifyFieldOutcome — never reached the field vs. reached it and no button (#569)", () => {
  it("calls the real Grok promo-modal failure an overlay block, not a SayPi defect", () => {
    const o = classifyFieldOutcome({
      focusError: REAL_GROK_LOG,
      dismissAttempted: true,
      decorated: true,
      buttonAppeared: false,
    });
    expect(o.kind).toBe(FIELD_OUTCOME_KINDS.OVERLAY_BLOCKED);
    expect(o.owner).not.toBe("saypi");
    expect(o.fieldReached).toBe(false);
    expect(o.interceptor?.element).toBe('img.css-9pa8cd[Introducing Grok 4.5 for Chat]');
    // AC1: the note names the blocking overlay instead of the generic no-button line.
    expect(o.note).toMatch(/img\.css-9pa8cd/);
    expect(o.note).toMatch(/div#layers/);
    expect(o.note).not.toMatch(/no \.saypi-dictation-button appeared/);
    // and it says out loud that this run judged nothing about SayPi
    expect(o.note).toMatch(/NOTHING about/i);
  });

  it("keeps the genuine defect case attributable to SayPi", () => {
    const o = classifyFieldOutcome({ focusError: null, decorated: true, buttonAppeared: false });
    expect(o.kind).toBe(FIELD_OUTCOME_KINDS.NO_BUTTON);
    expect(o.owner).toBe("saypi");
    expect(o.fieldReached).toBe(true);
    expect(o.note).toMatch(/\.saypi-dictation-button/);
  });

  it("calls a focused, decorated, button-bearing field reached", () => {
    const o = classifyFieldOutcome({ focusError: null, decorated: true, buttonAppeared: true });
    expect(o.kind).toBe(FIELD_OUTCOME_KINDS.REACHED);
    expect(o.fieldReached).toBe(true);
  });

  it("separates a field the selector never found (login wall / drifted selector) from an overlay", () => {
    const o = classifyFieldOutcome({
      focusError: "page.click: Timeout 10000ms exceeded.\nCall log:\n  - waiting for locator('textarea[placeholder]')",
      decorated: true,
      buttonAppeared: false,
    });
    expect(o.kind).toBe(FIELD_OUTCOME_KINDS.FIELD_ABSENT);
    expect(o.owner).not.toBe("saypi");
    expect(o.fieldReached).toBe(false);
    expect(o.note).toMatch(/sign|login|selector/i);
  });

  it("falls back to a plain focus failure when the field resolved but the click still failed", () => {
    const o = classifyFieldOutcome({
      focusError:
        "page.click: Timeout 10000ms exceeded.\nCall log:\n  - locator resolved to <textarea placeholder=\"Ask anything\"></textarea>\n  - element is not enabled",
      decorated: true,
      buttonAppeared: false,
    });
    expect(o.kind).toBe(FIELD_OUTCOME_KINDS.FOCUS_FAILED);
    expect(o.fieldReached).toBe(false);
    expect(o.owner).not.toBe("saypi");
  });

  it("blames the build, not decoration, when no SayPi build stamp was on the page", () => {
    const o = classifyFieldOutcome({ focusError: null, decorated: false, buttonAppeared: false });
    expect(o.kind).toBe(FIELD_OUTCOME_KINDS.NOT_INJECTED);
    expect(o.owner).not.toBe("saypi");
    expect(o.note).toMatch(/e2e:build|content script/i);
  });

  it("short-circuits on an aborted run (Cloudflare / harness throw) ahead of every URL-ish verdict", () => {
    const o = classifyFieldOutcome({
      abortedBecause: "the host served a Cloudflare challenge",
      focusError: REAL_GROK_LOG,
      decorated: false,
      buttonAppeared: false,
    });
    expect(o.kind).toBe(FIELD_OUTCOME_KINDS.ABORTED);
    expect(o.owner).not.toBe("saypi");
    expect(o.fieldReached).toBe(false);
    expect(o.note).toMatch(/Cloudflare challenge/);
  });

  it("is total: every input shape gets a kind, an owner and a note (never null)", () => {
    for (const input of [
      undefined,
      {},
      { focusError: "" },
      { decorated: true },
      { focusError: REAL_GROK_LOG },
      { abortedBecause: "boom" },
    ]) {
      const o = classifyFieldOutcome(input as Record<string, unknown>);
      expect(Object.values(FIELD_OUTCOME_KINDS)).toContain(o.kind);
      expect(typeof o.owner).toBe("string");
      expect(o.note.length).toBeGreaterThan(0);
      expect(typeof o.fieldReached).toBe("boolean");
    }
  });

  it("returns a uniform shape whichever branch fires (so summary.json columns stay stable)", () => {
    const keys = (o: object) => Object.keys(o).sort();
    const reached = classifyFieldOutcome({ decorated: true, buttonAppeared: true });
    const blocked = classifyFieldOutcome({ focusError: REAL_GROK_LOG });
    const aborted = classifyFieldOutcome({ abortedBecause: "boom" });
    expect(keys(blocked)).toEqual(keys(reached));
    expect(keys(aborted)).toEqual(keys(reached));
  });
});

describe("OVERLAY_DISMISS_LABELS — the generic, creative-agnostic dismiss step (#569)", () => {
  it("matches the dismissal affordances a promo/interstitial actually ships", () => {
    for (const label of ["Close", "close", "Dismiss", "Not now", "No thanks", "Maybe later", "Skip", "✕"]) {
      expect(OVERLAY_DISMISS_LABELS.test(label)).toBe(true);
    }
  });
  it("does not match controls that would take the run somewhere else, or consent to anything", () => {
    for (const label of [
      "Log in",
      "Sign up",
      "Continue with Google",
      "Send",
      "Accept and continue",
      "Continue",
      "OK",
      "Allow",
      "Try Grok 4.5",
      "Post",
      "Skip to sign up",
      "Close account",
      "Log out",
      // "Got it" is the accept-all button on a common genre of cookie banner, so it
      // lands on the wrong side of the dismiss-vs-consent line this set draws —
      // clicking it would opt the run into tracking rather than closing a promo.
      "Got it",
    ]) {
      expect(OVERLAY_DISMISS_LABELS.test(label)).toBe(false);
    }
  });
  it("is anchored (a stray 'skip' inside prose must not fire it)", () => {
    expect(OVERLAY_DISMISS_LABELS.test("Skip this step and close the dialog forever")).toBe(false);
  });
});
