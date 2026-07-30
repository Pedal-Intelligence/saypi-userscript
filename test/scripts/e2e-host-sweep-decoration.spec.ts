import { describe, it, expect, beforeEach } from "vitest";
import {
  DECORATION_WATCHER,
  DECORATION_PROBE,
  DECORATION_BUDGET_MS,
  describeDecoration,
  classifyUndecorated,
  UNDECORATED_KINDS,
  summarize,
} from "../../scripts/e2e-host-sweep-lib.mjs";

/**
 * #570. #559 gave a decoration miss a *reason* (redirect / sign-in wall / drift).
 * This spec covers the layer underneath it: the miss's own MEASUREMENT.
 *
 * The sweep decides decoration with one `waitForSelector("#saypi-callButton",
 * { timeout: 25_000 })`, whose default `state: 'visible'` needs a non-empty
 * bounding box. So a bare `false` conflates three very different worlds:
 *
 *   a. SayPi never decorated              → genuine drift, hunt it
 *   b. SayPi decorated later than 25s     → a budget/latency finding
 *   c. the element was there but boxless   → a rendering/visibility finding
 *
 * The run that motivated this (2026-07-29, build 2cc21c0@main) reported
 * `decorated: false` + `possible-drift` with ZERO SayPi errors, while the SAME
 * bundle carried `domDiagnostics.callButtons: 1` and a screenshot showing the
 * button. A direct CDP probe then measured the button present with a non-empty
 * box at +771ms. The verdict was contradicted by its own evidence and no timing
 * was captured, so the miss was unexplainable after the fact.
 */

/** Give an element a real box — JSDOM's getBoundingClientRect is all zeros. */
function withBox(el: Element, box: { x: number; y: number; width: number; height: number }) {
  el.getBoundingClientRect = () => ({ ...box, top: box.y, left: box.x, right: box.x + box.width, bottom: box.y + box.height, toJSON: () => box }) as DOMRect;
}

function addCallButton(style = ""): HTMLElement {
  const el = document.createElement("button");
  el.id = "saypi-callButton";
  if (style) el.setAttribute("style", style);
  document.body.appendChild(el);
  return el;
}

/** MutationObserver records are delivered asynchronously; let them land. */
const flush = () => new Promise((r) => setTimeout(r, 0));

describe("DECORATION_WATCHER + DECORATION_PROBE record when the call button appeared", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    delete (window as unknown as Record<string, unknown>).__saypiSweepDecoration;
  });

  it("times the first appearance relative to the document's time origin", async () => {
    DECORATION_WATCHER();
    const before = DECORATION_PROBE();
    expect(before.present).toBe(false);
    expect(before.firstSeenMs).toBeNull();

    withBox(addCallButton(), { x: 8, y: 700, width: 44, height: 44 });
    await flush();

    const after = DECORATION_PROBE();
    expect(after.present).toBe(true);
    expect(after.count).toBe(1);
    expect(after.firstSeenMs).toBeGreaterThanOrEqual(0);
    expect(after.presentAtInstall).toBe(false);
    expect(after.hasBox).toBe(true);
    expect(after.box).toMatchObject({ width: 44, height: 44 });
    expect(after.computed).toMatchObject({ visibility: "visible" });
  });

  it("says so when the button already existed at install time (timing is an upper bound)", () => {
    addCallButton();
    DECORATION_WATCHER();
    const p = DECORATION_PROBE();
    expect(p.present).toBe(true);
    expect(p.presentAtInstall).toBe(true);
    expect(p.firstSeenMs).toBeGreaterThanOrEqual(0);
  });

  it("is idempotent — a re-install must not reset the recorded first sighting", async () => {
    DECORATION_WATCHER();
    withBox(addCallButton(), { x: 0, y: 0, width: 40, height: 40 });
    await flush();
    const first = DECORATION_PROBE().firstSeenMs as number;
    DECORATION_WATCHER(); // the harness's defensive second install
    expect(DECORATION_PROBE().firstSeenMs).toBe(first);
    expect(DECORATION_PROBE().presentAtInstall).toBe(false);
  });

  it("distinguishes present-but-boxless from absent", () => {
    DECORATION_WATCHER();
    const el = addCallButton("display:none");
    withBox(el, { x: 0, y: 0, width: 0, height: 0 });
    const p = DECORATION_PROBE();
    expect(p.present).toBe(true);
    expect(p.hasBox).toBe(false);
    expect(p.computed).toMatchObject({ display: "none" });
  });

  it("reports a null install time when no watcher ever ran", () => {
    const p = DECORATION_PROBE();
    expect(p.watcherInstalledAtMs).toBeNull();
    expect(p.firstSeenMs).toBeNull();
  });
});

describe("describeDecoration classifies the measurement (#570)", () => {
  const probe = (over: Record<string, unknown> = {}) => ({
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
    ...over,
  });

  it("flags the observed 2026-07-29 miss as an internal inconsistency, not drift", () => {
    const d = describeDecoration({ probe: probe(), callButtonsSeen: 1, waitSucceeded: false });
    expect(d.everPresent).toBe(true);
    expect(d.presentAtCheck).toBe(true);
    expect(d.firstSeenMs).toBe(771);
    expect(d.withinBudget).toBe(true);
    expect(d.contradiction).toBe("visible-but-missed");
    // The evidence sentence must carry the numbers a reader needs.
    expect(d.evidence).toContain("771");
    expect(d.evidence).toContain("44");
  });

  it("calls a present-but-boxless button present-but-invisible", () => {
    const d = describeDecoration({
      probe: probe({ box: { x: 0, y: 0, width: 0, height: 0 }, hasBox: false, computed: { display: "none", visibility: "visible", opacity: "1" } }),
      callButtonsSeen: 1,
      waitSucceeded: false,
    });
    expect(d.contradiction).toBe("present-but-invisible");
    expect(d.evidence).toMatch(/display=none|0×0/);
  });

  it("calls a button the deadline probe missed but the later diagnostics counted appeared-after-check", () => {
    // The screenshot + domDiagnostics are captured AFTER the decoration wait, which
    // is exactly how they can outvote it: the element arrived past the budget.
    const d = describeDecoration({
      probe: probe({ present: false, count: 0, firstSeenMs: null, box: null, computed: null, hasBox: false }),
      callButtonsSeen: 1,
      waitSucceeded: false,
    });
    expect(d.contradiction).toBe("appeared-after-check");
    expect(d.everPresent).toBe(true);
  });

  it("calls a button that was seen and then went away removed-before-check", () => {
    const d = describeDecoration({
      probe: probe({ present: false, count: 0, firstSeenMs: 900, box: null, computed: null, hasBox: false }),
      callButtonsSeen: 0,
      waitSucceeded: false,
    });
    expect(d.contradiction).toBe("removed-before-check");
    expect(d.everPresent).toBe(true);
  });

  it("finds NO contradiction when the button genuinely never appeared — drift stands", () => {
    const d = describeDecoration({
      probe: probe({ present: false, count: 0, firstSeenMs: null, box: null, computed: null, hasBox: false, checkedAtMs: 25_050 }),
      callButtonsSeen: 0,
      waitSucceeded: false,
    });
    expect(d.everPresent).toBe(false);
    expect(d.contradiction).toBeNull();
    expect(d.withinBudget).toBeNull();
    expect(d.evidence).toMatch(/never/i);
  });

  it("never reports a contradiction on a host that decorated", () => {
    const d = describeDecoration({ probe: probe(), callButtonsSeen: 1, waitSucceeded: true });
    expect(d.contradiction).toBeNull();
    expect(d.firstSeenMs).toBe(771); // the healthy-host baseline is still recorded
  });

  it("degrades honestly when no probe reading was taken at all", () => {
    const d = describeDecoration({ probe: null, callButtonsSeen: null, waitSucceeded: false });
    expect(d.probed).toBe(false);
    expect(d.everPresent).toBeNull();
    expect(d.contradiction).toBeNull();
    expect(d.evidence).toMatch(/no decoration reading/i);
  });

  // "Internal inconsistency" must not become a shrug. Only the visible-but-missed
  // flavour is genuinely the harness's fault; the other three are real SayPi behaviour
  // that simply isn't *selector drift*, and a blanket "nothing to see here" would bury
  // a slow bootstrap or a torn-out UI as effectively as a false drift buries real drift.
  it("attributes each contradiction to whoever actually owns it", () => {
    const flavours = {
      "visible-but-missed": probe(),
      "present-but-invisible": probe({ hasBox: false, box: { x: 0, y: 0, width: 0, height: 0 } }),
      "appeared-after-check": probe({ present: false, count: 0, firstSeenMs: null }),
      "removed-before-check": probe({ present: false, count: 0, firstSeenMs: 900 }),
    };
    const owners: Record<string, string> = {};
    for (const [flavour, reading] of Object.entries(flavours)) {
      const d = describeDecoration({
        probe: reading,
        callButtonsSeen: flavour === "removed-before-check" ? 0 : 1,
        waitSucceeded: false,
      });
      expect(d.contradiction).toBe(flavour);
      expect(d.nextStep).toBeTruthy();
      expect(d.nextStep).toMatch(/not selector drift|Do NOT\s+file selector drift/);
      owners[flavour] = d.attributable as string;
    }
    expect(owners).toEqual({
      "visible-but-missed": "automation",
      "present-but-invisible": "saypi",
      "appeared-after-check": "saypi",
      "removed-before-check": "saypi",
    });
  });

  it("treats a first sighting past the budget as out-of-budget", () => {
    const d = describeDecoration({
      probe: probe({ firstSeenMs: DECORATION_BUDGET_MS + 1_200, checkedAtMs: DECORATION_BUDGET_MS + 1_400 }),
      callButtonsSeen: 1,
      waitSucceeded: false,
    });
    expect(d.withinBudget).toBe(false);
    expect(d.evidence).toContain(String(DECORATION_BUDGET_MS));
  });
});

/**
 * The issue names three worlds a bare `false` conflates. This block asserts all three
 * are separable, together, from one another — the acceptance criterion in one place.
 */
describe("the three worlds a bare `decorated: false` conflates are all separable (#570)", () => {
  const reading = (over: Record<string, unknown> = {}) => ({
    selector: "#saypi-callButton",
    count: 0,
    present: false,
    firstSeenMs: null,
    presentAtInstall: false,
    watcherInstalledAtMs: 3,
    checkedAtMs: 25_060,
    box: null,
    computed: null,
    hasBox: false,
    ...over,
  });

  // (a) never in the DOM — the only world where `possible-drift` is the right verdict.
  const neverPresent = describeDecoration({
    probe: reading(),
    graceProbe: reading({ checkedAtMs: 30_100 }),
    callButtonsSeen: 0,
    waitSucceeded: false,
  });

  // (b) in the DOM, but later than the 25s budget. The deadline read sees nothing; the
  // bounded grace re-read does, and the watcher supplies the real appearance time.
  const lateArrival = describeDecoration({
    probe: reading(),
    graceProbe: reading({ present: true, count: 1, firstSeenMs: 27_400, checkedAtMs: 30_100, box: { x: 8, y: 700, width: 44, height: 44 }, computed: { display: "block", visibility: "visible", opacity: "1" }, hasBox: true }),
    callButtonsSeen: 0,
    waitSucceeded: false,
  });

  // (c) in the DOM the whole time, but with no non-empty box — so the visible-wait
  // legitimately never resolved. querySelectorAll would have counted it.
  const boxless = describeDecoration({
    probe: reading({ present: true, count: 1, firstSeenMs: 640, box: { x: 0, y: 0, width: 0, height: 0 }, computed: { display: "none", visibility: "visible", opacity: "1" } }),
    callButtonsSeen: 1,
    waitSucceeded: false,
  });

  it("gives each world a distinct contradiction value", () => {
    expect([neverPresent.contradiction, lateArrival.contradiction, boxless.contradiction]).toEqual([
      null,
      "appeared-after-check",
      "present-but-invisible",
    ]);
  });

  it("agrees on everPresent for the two that were, and disagrees for the one that wasn't", () => {
    expect(neverPresent.everPresent).toBe(false);
    expect(lateArrival.everPresent).toBe(true);
    expect(boxless.everPresent).toBe(true);
  });

  it("times (b) past the budget and (c) inside it", () => {
    expect(lateArrival.firstSeenMs).toBe(27_400);
    expect(lateArrival.withinBudget).toBe(false);
    expect(boxless.firstSeenMs).toBe(640);
    expect(boxless.withinBudget).toBe(true);
    expect(neverPresent.firstSeenMs).toBeNull();
  });

  it("routes only (a) to possible-drift; (b) and (c) are internal-inconsistency", () => {
    const kindOf = (decoration: object) =>
      classifyUndecorated({ requestedUrl: "https://claude.ai/new", finalUrl: "https://claude.ai/new", decoration }).kind;
    expect(kindOf(neverPresent)).toBe(UNDECORATED_KINDS.DRIFT);
    expect(kindOf(lateArrival)).toBe(UNDECORATED_KINDS.INCONSISTENT);
    expect(kindOf(boxless)).toBe(UNDECORATED_KINDS.INCONSISTENT);
  });

  it("makes (a)'s claim of absence a measurement, not merely a non-observation", () => {
    // "never appeared" is only trustworthy if the harness kept looking past the deadline
    // by PRESENCE. The note has to say it did.
    expect(neverPresent.evidence).toMatch(/still absent/);
    expect(neverPresent.evidence).toMatch(/measured, not merely unobserved/);
    expect(neverPresent.presentAtGrace).toBe(false);
  });

  it("distinguishes (b) from (c) in the prose too, not just in the enum", () => {
    expect(lateArrival.evidence).toMatch(/past the budget/);
    expect(lateArrival.nextStep).toMatch(/LATENCY/);
    expect(boxless.evidence).toMatch(/no non-empty box/);
    expect(boxless.nextStep).toMatch(/RENDERING/);
  });
});

describe("classifyUndecorated folds the measurement into its verdict (#570)", () => {
  const contradicted = describeDecoration({
    probe: {
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
    },
    callButtonsSeen: 1,
    waitSucceeded: false,
  });

  it("reports internal-inconsistency instead of possible-drift when the run outvotes itself", () => {
    const c = classifyUndecorated({
      requestedUrl: "https://claude.ai/new",
      finalUrl: "https://claude.ai/new",
      title: "Claude",
      decoration: contradicted,
    });
    expect(c.kind).toBe(UNDECORATED_KINDS.INCONSISTENT);
    expect(c.kind).not.toBe(UNDECORATED_KINDS.DRIFT);
    // Owner is the harness: don't send anyone hunting SayPi drift on this.
    expect(c.owner).toBe("automation");
    expect(c.note).toContain("771");
    expect(c.note).not.toMatch(/genuine-drift case/);
    // The note must carry the per-flavour next step, not a generic shrug.
    expect(c.note).toContain("Next:");
  });

  it("hands a present-but-invisible miss to SayPi — it is a rendering defect, not the harness", () => {
    const invisible = describeDecoration({
      probe: {
        selector: "#saypi-callButton",
        count: 1,
        present: true,
        firstSeenMs: 640,
        presentAtInstall: false,
        watcherInstalledAtMs: 0,
        checkedAtMs: 25_040,
        box: { x: 0, y: 0, width: 0, height: 0 },
        computed: { display: "block", visibility: "visible", opacity: "1" },
        hasBox: false,
      },
      callButtonsSeen: 1,
      waitSucceeded: false,
    });
    const c = classifyUndecorated({
      requestedUrl: "https://claude.ai/new",
      finalUrl: "https://claude.ai/new",
      decoration: invisible,
    });
    expect(c.kind).toBe(UNDECORATED_KINDS.INCONSISTENT);
    expect(c.owner).toBe("saypi");
  });

  it("keeps possible-drift — with the timing evidence attached — for a genuine miss (#559 intact)", () => {
    const absent = describeDecoration({
      probe: {
        selector: "#saypi-callButton",
        count: 0,
        present: false,
        firstSeenMs: null,
        presentAtInstall: false,
        watcherInstalledAtMs: 12,
        checkedAtMs: 25_080,
        box: null,
        computed: null,
        hasBox: false,
      },
      callButtonsSeen: 0,
      waitSucceeded: false,
    });
    const c = classifyUndecorated({
      requestedUrl: "https://claude.ai/new",
      finalUrl: "https://claude.ai/new",
      title: "Claude",
      decoration: absent,
    });
    expect(c.kind).toBe(UNDECORATED_KINDS.DRIFT);
    expect(c.owner).toBe("saypi");
    expect(c.note).toMatch(/genuine-drift case/);
    expect(c.note).toMatch(/never/i);
  });

  it("still classifies without any decoration input at all (back-compatible)", () => {
    const c = classifyUndecorated({
      requestedUrl: "https://claude.ai/new",
      finalUrl: "https://claude.ai/new",
      title: "Claude",
    });
    expect(c.kind).toBe(UNDECORATED_KINDS.DRIFT);
  });

  it("lets a redirect and an abort keep precedence over the measurement", () => {
    // Origin-first precedence (#559) is deliberate: "we were bounced off the chat
    // origin" is the stronger, more actionable fact than a stale element reading.
    expect(
      classifyUndecorated({
        requestedUrl: "https://pi.ai/talk",
        finalUrl: "https://hey.pi.ai/",
        decoration: contradicted,
      }).kind
    ).toBe(UNDECORATED_KINDS.REDIRECTED);
    expect(
      classifyUndecorated({
        requestedUrl: "https://claude.ai/new",
        finalUrl: "https://claude.ai/new",
        abortedBecause: "a Cloudflare challenge blocked the page",
        decoration: contradicted,
      }).kind
    ).toBe(UNDECORATED_KINDS.ABORTED);
  });
});

describe("summarize surfaces the decoration measurement in the run rollup (#570)", () => {
  it("carries first-seen timing and any contradiction", () => {
    const s = summarize({
      host: "claude",
      decorated: false,
      undecorated: { kind: UNDECORATED_KINDS.INCONSISTENT },
      decoration: { firstSeenMs: 771, everPresent: true, contradiction: "visible-but-missed" },
    });
    expect(s.undecorated).toBe(UNDECORATED_KINDS.INCONSISTENT);
    expect(s.decorationFirstSeenMs).toBe(771);
    expect(s.decorationEverPresent).toBe(true);
    expect(s.decorationContradiction).toBe("visible-but-missed");
  });

  it("defaults the decoration fields to null when nothing was measured", () => {
    const s = summarize({ host: "pi", decorated: true });
    expect(s.decorationFirstSeenMs).toBeNull();
    expect(s.decorationEverPresent).toBeNull();
    expect(s.decorationContradiction).toBeNull();
  });
});
