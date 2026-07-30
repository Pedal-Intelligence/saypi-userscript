import { describe, it, expect } from "vitest";
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
 * The error text below is the real one from
 * `.output/e2e-dictation-sweep/2026-07-29T21-25-23-179Z/grok__4/evidence.json`,
 * ANSI dim codes and all — Playwright names the interceptor for us, so nothing
 * needs to match X's specific creative (which will change with the next launch).
 */
const GROK_PROMO_CLICK_ERROR = [
  "page.click: Timeout 30000ms exceeded.",
  "Call log:",
  "\u001b[2m  - waiting for locator('textarea[placeholder]')\u001b[22m",
  "\u001b[2m    - locator resolved to <textarea dir=\"auto\" spellcheck=\"true\" placeholder=\"Ask anything\" class=\"r-30o5oe r-1dz5y72\">Hello there, this is a quick test of the voice ac…</textarea>\u001b[22m",
  "\u001b[2m  - attempting click action\u001b[22m",
  "\u001b[2m    2 × waiting for element to be visible, enabled and stable\u001b[22m",
  "\u001b[2m      - element is visible, enabled and stable\u001b[22m",
  "\u001b[2m      - scrolling into view if needed\u001b[22m",
  "\u001b[2m      - done scrolling\u001b[22m",
  "\u001b[2m      - <div class=\"css-175oi2r r-f4gmv6 r-3pj75a\">…</div> from <div id=\"layers\" class=\"r-zchlnj r-1d2f490\">…</div> subtree intercepts pointer events\u001b[22m",
  "\u001b[2m    - retrying click action\u001b[22m",
  "\u001b[2m      - waiting 100ms\u001b[22m",
  "\u001b[2m    14 × waiting for element to be visible, enabled and stable\u001b[22m",
  "\u001b[2m       - element is visible, enabled and stable\u001b[22m",
  "\u001b[2m       - <img draggable=\"false\" class=\"css-9pa8cd\" alt=\"Introducing Grok 4.5 for Chat\" src=\"https://abs.twimg.com/responsive-web/client-web/Grok-Promo-Popup-4-5-Launch.fc2ebfea.png\"/> from <div id=\"layers\" class=\"r-zchlnj r-1d2f490\">…</div> subtree intercepts pointer events\u001b[22m",
  "\u001b[2m     - retrying click action\u001b[22m",
  "\u001b[2m       - waiting 500ms\u001b[22m",
].join("\n");

describe("describeInterceptor — name the overlay Playwright already blamed (#569)", () => {
  it("names the X promo image and the layer it lives in, from the real failure", () => {
    const i = describeInterceptor(GROK_PROMO_CLICK_ERROR);
    expect(i).not.toBeNull();
    // Identity, not creative: tag + class + accessible-ish label, so the note is
    // actionable without the harness knowing anything about this promo.
    expect(i!.element).toBe('img.css-9pa8cd[Introducing Grok 4.5 for Chat]');
    expect(i!.container).toBe("div#layers");
    // No ANSI escapes leak into the human-readable raw line.
    expect(i!.raw).not.toMatch(/\u001b\[/);
  });

  it("does not mistake the resolved target locator for the interceptor", () => {
    // The <textarea> appears EARLIER in the call log than any interceptor; blaming
    // it would be worse than the generic note it replaces.
    expect(describeInterceptor(GROK_PROMO_CLICK_ERROR)!.element).not.toMatch(/textarea/);
  });

  it("reports the LAST interception in the log — the one the retries died on", () => {
    const log = [
      "  - <div class=\"early\">…</div> from <div id=\"layers\">…</div> subtree intercepts pointer events",
      "  - retrying click action",
      "  - <button aria-label=\"Sign up\" class=\"late\">…</button> from <div id=\"layers\">…</div> subtree intercepts pointer events",
    ].join("\n");
    expect(describeInterceptor(log)!.element).toBe("button.late[Sign up]");
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
      focusError: GROK_PROMO_CLICK_ERROR,
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
      focusError: GROK_PROMO_CLICK_ERROR,
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
      { focusError: GROK_PROMO_CLICK_ERROR },
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
    const blocked = classifyFieldOutcome({ focusError: GROK_PROMO_CLICK_ERROR });
    const aborted = classifyFieldOutcome({ abortedBecause: "boom" });
    expect(keys(blocked)).toEqual(keys(reached));
    expect(keys(aborted)).toEqual(keys(reached));
  });
});

describe("OVERLAY_DISMISS_LABELS — the generic, creative-agnostic dismiss step (#569)", () => {
  it("matches the dismissal affordances a promo/interstitial actually ships", () => {
    for (const label of ["Close", "close", "Dismiss", "Not now", "No thanks", "Maybe later", "Skip", "Got it"]) {
      expect(OVERLAY_DISMISS_LABELS.test(label)).toBe(true);
    }
  });
  it("does not match controls that would take the run somewhere else", () => {
    for (const label of ["Log in", "Sign up", "Continue with Google", "Send", "Accept and continue", "Try Grok 4.5", "Post"]) {
      expect(OVERLAY_DISMISS_LABELS.test(label)).toBe(false);
    }
  });
  it("is anchored (a stray 'skip' inside prose must not fire it)", () => {
    expect(OVERLAY_DISMISS_LABELS.test("Skip this step and close the dialog forever")).toBe(false);
  });
});
