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
 * Reduce a captured per-field evidence object to a flat, comparable summary. Pure —
 * mirrors e2e-host-sweep-lib.mjs's summarize(), but keyed on field-landed rather than
 * conversation-reply state.
 */
export function summarizeField(evidence = {}) {
  const cons = Array.isArray(evidence.console) ? evidence.console : [];
  const byOrigin = (origin, type) =>
    cons.filter((c) => classifyConsoleLine(c.text) === origin && (!type || c.t === type)).length;
  return {
    target: evidence.target ?? null,
    field: evidence.field ?? null,
    decorated: !!evidence.decorated,
    cloudflareBlocked: !!evidence.cloudflareBlocked,
    buttonAppeared: !!evidence.buttonAppeared,
    transcriptLanded: !!evidence.transcriptLanded,
    consoleErrors: cons.filter((c) => c.t === "error").length,
    consoleWarnings: cons.filter((c) => c.t === "warning").length,
    saypiErrors: byOrigin("saypi", "error"),
    saypiWarnings: byOrigin("saypi", "warning"),
    hostErrors: byOrigin("host", "error"),
    pageErrors: Array.isArray(evidence.pageErrors) ? evidence.pageErrors.length : 0,
    netFailures: Array.isArray(evidence.requestFailed) ? evidence.requestFailed.length : 0,
  };
}
