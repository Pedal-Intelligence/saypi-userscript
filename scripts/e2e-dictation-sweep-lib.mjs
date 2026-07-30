// Pure helpers for the E2E dictation-sweep harness (scripts/e2e-dictation-sweep.mjs) —
// the universal-dictation counterpart to e2e-host-sweep.mjs/e2e-host-sweep-lib.mjs.
// Kept dependency-free so they unit-test like layer4cdp-lib.mjs.
// Universal dictation (UniversalDictationModule.ts) activates via a floating
// per-field `.saypi-dictation-button`, NOT #saypi-callButton, and has no chat
// concepts (no model/voice select, no TTS, no conversation thread) — success here
// is just "spoken text landed in the focused field."
// Design: doc/specs/2026-06-30-e2e-dictation-sweep-design.md
// Runbook: doc/e2e-dictation-sweep.md
import { classifyConsoleLine } from "./e2e-host-sweep-lib.mjs";

/**
 * @typedef {{selector: string, type: "input"|"textarea"|"contenteditable", label: string}} DictationField
 * @typedef {{key: string, label: string, url: string|null, dismissModal: {role: string, name: RegExp}|null, fields: DictationField[]}} DictationTarget
 */

/**
 * v1 sweep targets. Each is a site (or the local fixture, url: null — the harness
 * serves it) with one or more focusable fields to dictate into. Extension point for
 * new sites: see GH issue #163 ("Universal Dictation Platform Support Roadmap") for
 * what's confirmed-working vs. known-broken before adding one — a finding that
 * matches an already-logged known-broken site there isn't novel.
 * @type {DictationTarget[]}
 */
export const TARGETS = [
  {
    key: "fixture",
    label: "local test fixture",
    url: null,
    dismissModal: null,
    fields: [
      { selector: "#name", type: "input", label: "Name (plain input)" },
      { selector: "#message", type: "textarea", label: "Message (textarea)" },
      { selector: "#rich-text-editor", type: "contenteditable", label: "Rich Text Editor (plain contenteditable)" },
    ],
  },
  {
    key: "mistral",
    label: "Mistral Le Chat",
    url: "https://chat.mistral.ai/chat",
    dismissModal: { role: "button", name: /accept and continue/i },
    fields: [
      { selector: "[contenteditable='true'].ProseMirror, [contenteditable='true']", type: "contenteditable", label: "Composer (ProseMirror)" },
    ],
  },
  {
    // Grok (x.com/i/grok) is X's own AI assistant, embedded in the X web app —
    // NOT a chat host SayPi has a ChatbotIdentifier/Chatbot.ts adapter for, so it
    // gets generic universal dictation only (no call button, no auto-submit, no
    // TTS). REQUIRES the seeded CDP profile to be signed into an X/Twitter account:
    // unlike Mistral, x.com/i/grok redirects anonymous visitors to a login wall
    // with no accessible composer. There is no automatable one-click sign-in for
    // this (Google's FedCM account chooser is a native browser dialog outside the
    // page DOM, not a clickable element) — sign in manually, once, in the seeded
    // profile's headed window, same as the SayPi-account seed step in
    // doc/e2e-host-sweep.md. If unauthenticated, the sweep will simply record
    // buttonAppeared=false / transcriptLanded=false (the field selector won't
    // match the login page), not crash.
    key: "grok",
    label: "Grok (x.com)",
    url: "https://x.com/i/grok",
    dismissModal: null,
    fields: [
      // X renders a second, hidden mirror <textarea> (no placeholder attribute at
      // all, likely for autosizing) alongside the real visible composer — a
      // presence check (`[placeholder]`, no value match) disambiguates the two.
      // Deliberately NOT matching the placeholder's *value* ("Ask anything"):
      // UniversalDictationModule itself rewrites it while dictating (e.g. to
      // "Recording..."), and the sweep never explicitly stops dictation, so a
      // value-pinned selector stops matching the moment recording starts and
      // never matches again — a false "transcript didn't land" even though it
      // did (confirmed live: the same underlying mutability that caused #507).
      // Also deliberately NOT using a `:visible` suffix: that's a Playwright-only
      // pseudo-class that works through Playwright's own selector engine (e.g.
      // page.click()) but throws a SyntaxError when passed into a native
      // document.querySelector() call inside page.evaluate()/waitForFunction() —
      // which is exactly how the harness checks whether the transcript landed.
      { selector: "textarea[placeholder]", type: "textarea", label: "Composer (Ask anything)" },
    ],
  },
];

export const DEFAULT_BUTTON_TIMEOUT_MS = 10_000;
export const DEFAULT_TRANSCRIPT_TIMEOUT_MS = 30_000;
/**
 * Per focus *attempt* — deliberately under Playwright's 30s default, because the
 * harness now spends two attempts (one, then a generic overlay dismissal, then one
 * more). Two × 10s keeps the worst case inside the old single 30s budget, and an
 * interstitial that hasn't yielded in 10s of retries isn't going to (#569).
 */
export const DEFAULT_FOCUS_TIMEOUT_MS = 10_000;

/**
 * Flatten the target/field tree into one entry per field — the unit both the
 * orchestrator's loop and the unit tests work with. Pure; never mutates `targets`.
 * @param {DictationTarget[]} [targets]
 */
export function flattenFields(targets = TARGETS) {
  return targets.flatMap((t) =>
    t.fields.map((f) => ({
      targetKey: t.key,
      targetLabel: t.label,
      url: t.url,
      dismissModal: t.dismissModal ?? null,
      fieldSelector: f.selector,
      fieldType: f.type,
      fieldLabel: f.label,
    })),
  );
}

/**
 * Parse argv (without node/script) into a sweep descriptor.
 *   [target ...]   one or more target keys (default: all)
 *   --headless     opt-in headless (for re-testing only; real-host targets may wall this)
 */
export function parseSweepArgs(argv = []) {
  const positional = argv.filter((a) => !a.startsWith("--"));
  const flags = argv.filter((a) => a.startsWith("--"));
  const known = TARGETS.map((t) => t.key);
  const requested = positional.filter((p) => known.includes(p));
  const unknown = positional.filter((p) => !known.includes(p));
  return {
    targets: requested.length ? requested : known,
    unknownTargets: unknown,
    headed: !flags.includes("--headless"),
  };
}

/**
 * Has dictation landed plausible text in a field? Synthetic-speech clips vary per
 * turn (src/offscreen/syntheticSpeechPool.ts picks one of several at random), so
 * this deliberately does NOT match exact content — same approach as
 * e2e-host-sweep.mjs's transcript check: any non-empty value means it landed.
 */
export function transcriptLanded(value) {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Accessible names that dismiss an interstitial without navigating anywhere. Used by
 * the harness's generic overlay rescue (see e2e-dictation-sweep.mjs) as a
 * `getByRole("button", { name })` filter, so it must be a *whole-name* match: a
 * substring match would happily click "Skip to sign up" or a "Close account" link.
 *
 * Deliberately dismissal-only — no "OK"/"Continue"/"Accept", which on a consent or
 * upsell dialog opt the run *into* something rather than out of it (Mistral's ToS
 * "Accept and continue" is handled explicitly per-target by `dismissModal`, not here).
 */
export const OVERLAY_DISMISS_LABELS =
  /^\s*(close|close dialog|close modal|dismiss|not now|no thanks|no,? thanks|maybe later|later|skip|skip for now|got it|×|✕)\s*$/i;

/**
 * Strip the ANSI dim/reset codes Playwright wraps its call log in — the raw message is
 * near-unreadable in evidence.json otherwise. Exported so the harness stores exactly the
 * cleaned text the classifier reads (one implementation, not two).
 */
export const stripAnsi = (s) => String(s ?? "").replace(/\[[0-9;]*m/g, "");

/** Opening tags only — `</div>` fails the leading letter check, so closing tags are skipped. */
const OPEN_TAG = /<([a-zA-Z][a-zA-Z0-9-]*)((?:\s[^<>]*?)?)\/?>/g;

/**
 * Condense an HTML snippet's tag + attributes to a short, stable identity —
 * `img.css-9pa8cd[Introducing Grok 4.5 for Chat]`, `div#layers`. Enough for a human
 * to recognise the thing in the screenshot and for a future reader to tell one
 * interstitial from another, without pasting a 300-char tag into a note.
 */
function condenseTag(tag, attrs) {
  const attr = (name) => {
    const m = new RegExp(`\\b${name}="([^"]*)"`, "i").exec(attrs);
    return m ? m[1].trim() : "";
  };
  const id = attr("id");
  const cls = attr("class").split(/\s+/).filter(Boolean)[0];
  const label = attr("alt") || attr("aria-label") || attr("title") || attr("data-testid");
  let out = tag.toLowerCase();
  if (id) out += `#${id}`;
  else if (cls) out += `.${cls}`;
  if (label) out += `[${label}]`;
  return out;
}

/**
 * Pull the blocking element out of a Playwright click failure. Pure.
 *
 * When a click can't land, Playwright's call log already names the culprit —
 * `<img alt="Introducing Grok 4.5 for Chat"/> from <div id="layers"> subtree
 * intercepts pointer events` — so the harness never has to know anything about the
 * specific overlay. That matters: X ships different promo creative for every launch
 * (#569), and a rule matching this image would rot by the next one.
 *
 * The *last* interception in the log wins: Playwright retries for the whole timeout
 * and the final report is the state the click actually died in (X's promo animates,
 * so early lines can blame a transient wrapper `div`). And the window is clipped to
 * the reported line so an earlier `locator resolved to <textarea …>` line can't be
 * misread as the interceptor — blaming the target itself would be worse than the
 * generic note this replaces.
 *
 * @param {string|null|undefined} message a Playwright error message / call log
 * @returns {{element: string, container: string|null, raw: string}|null}
 */
export function describeInterceptor(message) {
  const text = stripAnsi(message);
  const MARK = "intercepts pointer events";
  const at = text.lastIndexOf(MARK);
  if (at < 0) return null;
  // The reported line, or (single-line logs) a bounded tail — either way, scoped
  // tightly enough that unrelated earlier tags stay out of it.
  const lineStart = Math.max(text.lastIndexOf("\n", at) + 1, 0);
  const window = text.slice(Math.max(lineStart, at - 700), at);
  const tags = [...window.matchAll(OPEN_TAG)].map((m) => condenseTag(m[1], m[2] || ""));
  if (!tags.length) return null;
  const nested = /\bfrom\s+<[^<>]*>[^<]*(?:<\/[a-zA-Z0-9-]+>)?\s*subtree\s*$/.test(window) && tags.length > 1;
  return {
    element: nested ? tags[tags.length - 2] : tags[tags.length - 1],
    container: nested ? tags[tags.length - 1] : null,
    raw: (window + MARK).replace(/^\s*-\s*/, "").trim().slice(0, 400),
  };
}

/**
 * Why a field ended the run without a dictation button. The distinction is the whole
 * point, and it's the one #559 drew for the host sweep's `classifyUndecorated`: only
 * NO_BUTTON is a SayPi defect worth hunting — everything else means the harness
 * never got the feature in front of a field it could judge (#569).
 */
export const FIELD_OUTCOME_KINDS = {
  /** Field focused, page decorated, button present — a real product verdict follows. */
  REACHED: "reached",
  /** Something on top of the page swallowed the click (host interstitial/promo/consent). */
  OVERLAY_BLOCKED: "overlay-blocked",
  /** The field selector never resolved — a sign-in wall, or our selector drifted. */
  FIELD_ABSENT: "field-absent",
  /** The field resolved and the click still failed for some other reason. */
  FOCUS_FAILED: "focus-failed",
  /** No SayPi build stamp on the page — the content script never ran at all. */
  NOT_INJECTED: "not-injected",
  /** Focused a decorated page's field and no button appeared. THE defect case. */
  NO_BUTTON: "no-button",
  /** The run ended before the field could be judged (Cloudflare, harness throw). */
  ABORTED: "run-aborted",
};

/**
 * Uniform verdict shape — every branch returns the same keys so summary.json columns
 * are stable (and a reader never has to wonder whether an absent field means "no" or
 * "this code path forgot").
 * @param {string} kind one of FIELD_OUTCOME_KINDS
 * @param {"saypi"|"host"|"automation"} owner whose problem this is
 * @param {boolean} fieldReached did the harness actually get the field focused?
 * @param {string} note the human-readable explanation the sweep report quotes
 * @param {{element: string, container: string|null, raw: string}|null} [interceptor]
 */
const verdict = (kind, owner, fieldReached, note, interceptor = null) => ({
  kind,
  owner,
  fieldReached,
  interceptor,
  note,
});

/**
 * Explain a field that produced no dictation button, from what the harness observed.
 * Pure. `owner` answers the only question a reader has first: `saypi` = hunt it,
 * `host` = the site did this to us, `automation` = fix the run.
 *
 * Precedence is deliberate:
 *  - `abortedBecause` short-circuits (a Cloudflare challenge or a thrown harness
 *    error means nothing downstream was observed, so a focus/button verdict would be
 *    fabricated);
 *  - then the focus outcome, because "we never reached the field" dominates
 *    everything about the field — an overlay-blocked click leaves `buttonAppeared`
 *    trivially false, which is exactly the false SayPi defect #569 was filed for;
 *  - then the build stamp: no content script means no button by construction, and
 *    that's a stale-`e2e:build`/injection-scope problem, not decoration drift;
 *  - only a focused field on a decorated page can be NO_BUTTON.
 *
 * @param {{focusError?: string|null, dismissAttempted?: boolean, decorated?: boolean,
 *          buttonAppeared?: boolean, abortedBecause?: string|null}} [input]
 */
export function classifyFieldOutcome(input = {}) {
  const focusError = input.focusError || null;
  const dismissed = input.dismissAttempted ? " after a generic dismiss attempt (Escape + any close/dismiss control)" : "";

  if (input.abortedBecause) {
    return verdict(
      FIELD_OUTCOME_KINDS.ABORTED,
      "automation",
      false,
      `no dictation button because ${input.abortedBecause} — the run ended before this field could be ` +
        `judged, so it says NOTHING about universal dictation. Fix the run (re-seed with ` +
        `npm run layer4cdp:seed for a Cloudflare block; read notes[]/console for a throw) and re-run.`,
    );
  }

  if (focusError) {
    const interceptor = describeInterceptor(focusError);
    if (interceptor) {
      return verdict(
        FIELD_OUTCOME_KINDS.OVERLAY_BLOCKED,
        "host",
        false,
        `the field was never focused${dismissed}: ${interceptor.element}` +
          (interceptor.container ? ` (inside ${interceptor.container})` : "") +
          ` sat over the composer and intercepted every click, so SayPi was never asked to decorate a ` +
          `focused field — this run says NOTHING about universal dictation here. Hosts show these ` +
          `interstitials (launch promos, consent, upsells) per-profile and per-campaign: open the ` +
          `99-overlay-blocked.png screenshot, dismiss it by hand in the seeded profile once, and re-run. ` +
          `If the same overlay keeps winning, teach the target a dismissModal for it.`,
        interceptor,
      );
    }
    if (!/locator resolved to/.test(stripAnsi(focusError))) {
      return verdict(
        FIELD_OUTCOME_KINDS.FIELD_ABSENT,
        "automation",
        false,
        `the field selector never matched anything${dismissed}, so nothing was focused and this run says ` +
          `NOTHING about universal dictation. Usually the profile is signed out and the host served a ` +
          `login/sign-in wall instead of the composer (see the target's Preconditions); less often the ` +
          `host moved the composer and the selector in TARGETS is what needs updating. Check the ` +
          `screenshot before touching either.`,
      );
    }
    return verdict(
      FIELD_OUTCOME_KINDS.FOCUS_FAILED,
      "automation",
      false,
      `the field resolved but could not be clicked${dismissed} (not a pointer-event interception — read ` +
        `focusError in evidence.json), so it was never focused and this run says NOTHING about universal ` +
        `dictation. Re-run; if it repeats, the field may be disabled/covered in a way Playwright reports ` +
        `differently.`,
    );
  }

  if (!input.decorated) {
    return verdict(
      FIELD_OUTCOME_KINDS.NOT_INJECTED,
      "automation",
      true,
      `the field was focused, but the page carries no data-saypi-build stamp — the content script never ` +
        `ran here, so no button could appear by construction. Not decoration drift: rebuild ` +
        `(npm run e2e:build), confirm the unpacked extension is enabled in the seeded profile, and check ` +
        `the host is in the universal content script's injection scope.`,
    );
  }

  if (!input.buttonAppeared) {
    return verdict(
      FIELD_OUTCOME_KINDS.NO_BUTTON,
      "saypi",
      true,
      `the field was focused on a decorated page (data-saypi-build present) and no ` +
        `.saypi-dictation-button appeared — SayPi was in a position to decorate it and didn't. This is ` +
        `the genuine defect case: hunt it (corroborate with the screenshot + console, then dedup against ` +
        `GH issue #163's known-broken list before filing).`,
    );
  }

  return verdict(
    FIELD_OUTCOME_KINDS.REACHED,
    "saypi",
    true,
    `the field was focused and .saypi-dictation-button appeared — the transcriptLanded verdict for this ` +
      `field is a real product signal.`,
  );
}

/**
 * Reduce a captured per-field evidence object to a flat, comparable summary. Pure —
 * mirrors e2e-host-sweep-lib.mjs's summarize(), but keyed on field-landed rather than
 * conversation-reply state.
 */
export function summarizeField(evidence = {}) {
  const cons = Array.isArray(evidence.console) ? evidence.console : [];
  const byOrigin = (origin, type) =>
    cons.filter((c) => classifyConsoleLine(c.text) === origin && (!type || c.t === type)).length;
  const outcome = evidence.outcome ?? null;
  return {
    target: evidence.target ?? null,
    field: evidence.field ?? null,
    decorated: !!evidence.decorated,
    cloudflareBlocked: !!evidence.cloudflareBlocked,
    buttonAppeared: !!evidence.buttonAppeared,
    transcriptLanded: !!evidence.transcriptLanded,
    // #569: `transcriptLanded: false` alone can't be triaged — these say whether
    // the harness even reached the field, and whose problem the failure is.
    outcomeKind: outcome?.kind ?? null,
    owner: outcome?.owner ?? null,
    fieldReached: !!outcome?.fieldReached,
    interceptor: outcome?.interceptor?.element ?? null,
    consoleErrors: cons.filter((c) => c.t === "error").length,
    consoleWarnings: cons.filter((c) => c.t === "warning").length,
    saypiErrors: byOrigin("saypi", "error"),
    saypiWarnings: byOrigin("saypi", "warning"),
    hostErrors: byOrigin("host", "error"),
    pageErrors: Array.isArray(evidence.pageErrors) ? evidence.pageErrors.length : 0,
    netFailures: Array.isArray(evidence.requestFailed) ? evidence.requestFailed.length : 0,
  };
}
