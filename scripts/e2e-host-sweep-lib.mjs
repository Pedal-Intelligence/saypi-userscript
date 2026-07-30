// Pure helpers for the E2E host-sweep harness (scripts/e2e-host-sweep.mjs) — the
// agent-launched, rich-capture real-host E2E sweep over pi.ai/claude.ai/chatgpt.com.
// Kept dependency-free so they unit-test like scripts/layer4cdp-lib.mjs.
// Runbook: doc/e2e-host-sweep.md

/** The supported chatbot hosts, in sweep order. `key` is the CLI token + label. */
export const HOSTS = [
  { key: "pi", url: "https://pi.ai/talk", label: "pi.ai" },
  { key: "claude", url: "https://claude.ai/new", label: "claude.ai" },
  { key: "chatgpt", url: "https://chatgpt.com/", label: "chatgpt.com" },
];

export const DEFAULT_OBSERVE_MS = 28_000;

/**
 * Parse argv (without node/script) into a sweep descriptor.
 *   [host ...]            one or more host keys (default: all three)
 *   --observe=<ms>        how long to watch the conversation after the transcript lands
 *   --no-turn             decoration-only (don't drive a voice turn)
 *   --headless            opt-in headless (Cloudflare-walled on real hosts; for re-testing only)
 *   --no-select-voice     skip auto-selecting a SayPi voice (test the voice-off path instead)
 *   --claude-model=<m>    claude.ai model to select before the turn: haiku (default, fastest —
 *                         avoids Opus-Max extended-thinking latency that times the turn out),
 *                         sonnet, opus, or keep (leave the profile's current model — use this
 *                         to verify SayPi works on the slow/Max settings too)
 */
export const CLAUDE_MODELS = ["haiku", "sonnet", "opus", "keep"];
export const DEFAULT_CLAUDE_MODEL = "haiku";
export function parseSweepArgs(argv = []) {
  const positional = argv.filter((a) => !a.startsWith("--"));
  const flags = argv.filter((a) => a.startsWith("--"));
  const known = HOSTS.map((h) => h.key);
  const requested = positional.filter((p) => known.includes(p));
  const unknown = positional.filter((p) => !known.includes(p));
  const observeFlag = flags.find((f) => f.startsWith("--observe="));
  const observeMs = observeFlag ? Math.max(0, Number(observeFlag.split("=")[1]) || 0) : DEFAULT_OBSERVE_MS;
  const modelFlag = flags.find((f) => f.startsWith("--claude-model="));
  const requestedModel = modelFlag ? modelFlag.split("=")[1]?.trim().toLowerCase() : DEFAULT_CLAUDE_MODEL;
  const claudeModel = CLAUDE_MODELS.includes(requestedModel) ? requestedModel : DEFAULT_CLAUDE_MODEL;
  return {
    hosts: requested.length ? requested : known,
    unknownHosts: unknown,
    observeMs,
    noTurn: flags.includes("--no-turn"),
    headed: !flags.includes("--headless"),
    // Default ON: auto-select a SayPi voice (on hosts that support one) before the
    // turn so the sweep actually exercises SayPi's TTS engine. --no-select-voice
    // opts out (e.g. to test the voice-off / unauthenticated-degradation path).
    selectVoice: !flags.includes("--no-select-voice"),
    // claude.ai model to pick before the turn. Default 'haiku' so the assistant
    // replies fast enough for the turn + TTS readback to complete within the observe
    // window (Opus-Max extended-thinking can exceed it). 'keep' = test the current
    // (possibly Max) model. Unknown values fall back to the default.
    claudeModel,
  };
}

/**
 * Attribute a console line to its origin so the sweep can separate SayPi's own
 * signal from host-app noise (claude.ai 405s, ProseMirror warnings, etc.) and
 * harness artifacts. Heuristic, deliberately conservative.
 */
export function classifyConsoleLine(text = "") {
  const t = String(text);
  if (/\[SayPi|\[Say, Pi|saypi:|SayPi DEBUG|OffscreenVADClient|AudioInputMachine|ConversationMachine|TranscriptionModule/i.test(t)) {
    return "saypi";
  }
  // Known host-app / framework noise we should NOT attribute to SayPi.
  if (/ProseMirror|Deprecated API for given entry type|\/v1\/toolbox\/|challenge-platform/i.test(t)) {
    return "host";
  }
  return "other";
}

/**
 * SayPi's own TTS engine (synthesis served from the SayPi domain) reports this
 * provider name in the "Speech provided by …" log (src/tts/SpeechModel.ts). It is
 * the ONLY value that means SayPi's synthesis/playback path actually ran. By
 * contrast "Pi" is pi.ai's NATIVE voice (SayPi just relays Pi's own audio), "None"
 * is voice-off, and ChatGPT uses its native Read Aloud — none of those exercise
 * SayPi's TTS engine. Lenient about case/whitespace.
 */
export const SAYPI_TTS_PROVIDER = "Say, Pi";
export function isSaypiTtsProvider(name) {
  return typeof name === "string" && name.trim().toLowerCase() === SAYPI_TTS_PROVIDER.toLowerCase();
}

/**
 * Decide, across a run's per-host summaries, whether the sweep actually exercised
 * SayPi's TTS engine, and whether it was authenticated. Pure. Drives the honest
 * end-of-run coverage warnings — a native "Pi" voice must NOT read as TTS-covered.
 */
export function ttsCoverage(summaries = []) {
  const perHost = summaries.map((s) => ({
    host: s.host ?? null,
    voiceProvider: s.voiceProvider ?? null,
    saypiTtsExercised: isSaypiTtsProvider(s.voiceProvider),
  }));
  return {
    perHost,
    anySaypiTts: perHost.some((h) => h.saypiTtsExercised),
    anyAuthed: summaries.some((s) => s.authStatus === true),
  };
}

/**
 * Why a host ended the run with nothing decorated. The distinction is the whole
 * point: only DRIFT is a SayPi defect worth hunting — the others mean the sweep
 * never got a chat app in front of the extension (#559), or that the harness's own
 * reading of the page can't be trusted (#570).
 */
export const UNDECORATED_KINDS = {
  /** The page ended up on a different origin than requested (pi.ai/talk → hey.pi.ai). */
  REDIRECTED: "redirected-off-origin",
  /** Right origin, but the host served a sign-in wall instead of the chat app. */
  SIGNED_OUT: "signed-out",
  /** The requested page loaded and SayPi still didn't decorate it. THE defect case. */
  DRIFT: "possible-drift",
  /**
   * The "not decorated" verdict is contradicted by the run's OWN evidence — the call
   * button was present in the DOM (per the deadline probe, the grace re-read, or the
   * later `domDiagnostics.callButtons` census). Reading this as drift sends someone
   * hunting a SayPi bug that the same bundle disproves (#570).
   */
  INCONSISTENT: "internal-inconsistency",
  /** The run never got far enough to judge (Cloudflare challenge, harness error). */
  ABORTED: "run-aborted",
  /** Not enough signal to tell (no usable final URL) — read the screenshot. */
  UNKNOWN: "unknown",
};

/**
 * The selector the sweep treats as proof SayPi decorated a chat host, and the budget
 * it waits for it. Both mirror `sweepHost`'s `waitForSelector` call — keep them in
 * sync with it (the budget is quoted in the notes readers act on).
 */
export const CALL_BUTTON_SELECTOR = "#saypi-callButton";
export const DECORATION_BUDGET_MS = 25_000;

/**
 * On a MISS only, how much longer the harness keeps *looking* (never waiting — the
 * verdict is already recorded). Purely observational, and the reason it exists is that
 * a run which stops looking at the deadline structurally cannot tell "never in the DOM"
 * apart from "in the DOM, just later than the budget": both read as absent. The
 * post-deadline `domDiagnostics` census widens that window by only a few hundred ms.
 *
 * The grace read uses PRESENCE semantics (`state: 'attached'`), not the visible-wait's,
 * so it answers exactly the question the verdict can't. It does NOT change the 25s
 * budget or `decorated` — a host that decorates at +27s is still correctly reported as
 * having failed to decorate in time, now with the number that says why (#570).
 */
export const DECORATION_GRACE_MS = 5_000;

/**
 * Installed in the page BEFORE navigation (`page.addInitScript`), so it can time the
 * call button's first appearance against the document's own time origin. Also
 * re-invoked defensively via `page.evaluate` after load in case the init script never
 * took — hence idempotent, and hence `presentAtInstall`, which tells a reader whether
 * `firstSeenMs` is a measurement or merely an upper bound.
 *
 * Self-contained (stringified and evaluated in the page, same rule as DIAGS): it may
 * not close over anything from this module, so the selector is inlined.
 *
 * Why a watcher at all: `waitForSelector` reports only pass/fail at the deadline. When
 * it misses, the question that actually needs answering is "was the element EVER
 * there, and when" — and 25s after the fact only a recorder can say (#570).
 */
export const DECORATION_WATCHER = () => {
  const w = window;
  const existing = w.__saypiSweepDecoration;
  if (existing) return existing.installedAtMs;
  const state = { installedAtMs: performance.now(), firstSeenMs: null, presentAtInstall: false };
  w.__saypiSweepDecoration = state;
  const mark = () => {
    if (state.firstSeenMs !== null) return true;
    if (!document.querySelector("#saypi-callButton")) return false;
    state.firstSeenMs = performance.now();
    return true;
  };
  if (mark()) {
    state.presentAtInstall = true;
    return state.installedAtMs;
  }
  // Observe `document`, not `document.documentElement`: at addInitScript time (before
  // any page script) the document element may not exist yet, and observing the
  // document node with subtree covers the whole tree either way. Disconnects on the
  // first sighting, so the cost on a healthy host is a fraction of a second.
  const obs = new MutationObserver(() => {
    if (mark()) obs.disconnect();
  });
  obs.observe(document, { childList: true, subtree: true });
  return state.installedAtMs;
};

/**
 * Read at the decoration deadline: is the call button there, since when, and — the
 * distinction a bare `false` loses — does it have the non-empty bounding box that
 * Playwright's default `state: 'visible'` requires? `querySelectorAll` (what
 * `domDiagnostics.callButtons` counts) does not care about layout, which is precisely
 * how the two can disagree.
 *
 * Self-contained, same rule as DIAGS/SIGN_IN_PROBE. Under JSDOM
 * `getBoundingClientRect` reports all zeros, so `hasBox` is only meaningful in a real
 * browser (unit tests stub the rect).
 */
export const DECORATION_PROBE = () => {
  const el = document.querySelector("#saypi-callButton");
  const state = window.__saypiSweepDecoration || null;
  const view = document.defaultView;
  const round = (n) => (typeof n === "number" && isFinite(n) ? Math.round(n) : null);
  let box = null;
  let computed = null;
  if (el) {
    const r = typeof el.getBoundingClientRect === "function" ? el.getBoundingClientRect() : null;
    if (r) box = { x: round(r.x), y: round(r.y), width: round(r.width), height: round(r.height) };
    if (view && typeof view.getComputedStyle === "function") {
      const s = view.getComputedStyle(el);
      computed = { display: s.display, visibility: s.visibility, opacity: s.opacity };
    }
  }
  return {
    selector: "#saypi-callButton",
    count: document.querySelectorAll("#saypi-callButton").length,
    present: !!el,
    // ms since the document's time origin (i.e. relative to navigation).
    firstSeenMs: state ? round(state.firstSeenMs) : null,
    presentAtInstall: state ? !!state.presentAtInstall : null,
    watcherInstalledAtMs: state ? round(state.installedAtMs) : null,
    checkedAtMs: round(performance.now()),
    box,
    computed,
    hasBox: !!(box && box.width > 0 && box.height > 0),
  };
};

/**
 * Turn the DECORATION_PROBE readings (the one taken at the deadline, plus the miss-only
 * `graceProbe` taken up to DECORATION_GRACE_MS later, plus the run's own
 * `domDiagnostics.callButtons` census) into the facts the undecorated verdict and its
 * note are built from. Pure.
 *
 * `contradiction` is the load-bearing output: non-null means the harness's "not
 * decorated" is disproved by the harness's own evidence, so the miss is a measurement
 * story, not a SayPi-drift story. The four flavours are all worth telling apart:
 *
 *   - `visible-but-missed` — present with a non-empty box at the deadline. The 25s
 *     visible-wait should have resolved. THE 2026-07-29 case (#570): box 44×44,
 *     display=block, first seen at +771ms.
 *   - `present-but-invisible` — in the DOM but boxless / display:none / hidden, so the
 *     visible-wait legitimately failed. Not absence — a rendering question.
 *   - `appeared-after-check` — the deadline probe saw nothing, but the grace re-read or
 *     the later `domDiagnostics` census did. The screenshot and diagnostics are captured
 *     AFTER the wait, so this is decoration that finished past the budget — and because
 *     the watcher timed the real first sighting, the number is navigation-relative even
 *     when it lands past the deadline.
 *   - `removed-before-check` — the watcher timed a first sighting, but by the deadline
 *     it was gone (a host re-render tore SayPi's UI out).
 *
 * A miss with no contradiction leaves DRIFT standing, and the evidence sentence then
 * says out loud that the button never entered the DOM — which is what makes the drift
 * verdict trustworthy rather than merely unrefuted.
 *
 * @param {{probe?: object|null, graceProbe?: object|null, callButtonsSeen?: number|null,
 *          waitSucceeded?: boolean, budgetMs?: number, graceMs?: number}} [input]
 */
export function describeDecoration(input = {}) {
  const probe = input.probe ?? null;
  const callButtonsSeen = typeof input.callButtonsSeen === "number" ? input.callButtonsSeen : null;
  const graceProbe = input.graceProbe ?? null;
  const budgetMs = typeof input.budgetMs === "number" ? input.budgetMs : DECORATION_BUDGET_MS;
  const graceMs = typeof input.graceMs === "number" ? input.graceMs : DECORATION_GRACE_MS;
  const waitSucceeded = input.waitSucceeded === true;
  const base = {
    selector: CALL_BUTTON_SELECTOR,
    budgetMs,
    graceMs,
    probed: !!probe,
    graceProbed: !!graceProbe,
    presentAtGrace: graceProbe ? !!graceProbe.present : null,
    watcherInstalled: null,
    everPresent: null,
    presentAtCheck: null,
    count: null,
    firstSeenMs: null,
    firstSeenExact: null,
    checkedAtMs: null,
    withinBudget: null,
    hasBox: null,
    box: null,
    computed: null,
    callButtonsSeen,
    contradiction: null,
    evidence: "",
    nextStep: "",
    attributable: null,
  };
  /**
   * Who owns each contradiction. `internal-inconsistency` says the verdict can't be
   * trusted; it does NOT automatically mean "nothing to see here" — three of the four
   * flavours are real SayPi behaviour that simply isn't selector drift.
   */
  const ATTRIBUTABLE = {
    "visible-but-missed": "automation",
    "present-but-invisible": "saypi",
    "appeared-after-check": "saypi",
    "removed-before-check": "saypi",
  };
  /**
   * What a reader should actually DO about each contradiction. Kept per-flavour on
   * purpose: two of the four are harness problems, but the other two are genuine SayPi
   * findings that just aren't *selector drift* — a blanket "not a SayPi issue" would
   * bury a slow bootstrap or a torn-out UI as cleanly as a false drift buries the real
   * thing.
   */
  const NEXT_STEP = {
    "visible-but-missed":
      `the wait itself is what needs explaining, not SayPi: re-run this host (--no-turn is enough) ` +
      `to see whether it reproduces, and compare the first-sighting time against the budget. Do NOT ` +
      `file selector drift.`,
    "present-but-invisible":
      `attributable to SayPi, but as a RENDERING defect, not selector drift: hunt why the call button ` +
      `mounted with no non-empty box (zero-sized, display:none, detached container).`,
    "appeared-after-check":
      `attributable to SayPi, but as a LATENCY finding, not selector drift: decoration completed after ` +
      `the budget, so ask why bootstrap took that long on this host (normal is sub-second) before ` +
      `touching the budget.`,
    "removed-before-check":
      `attributable to SayPi, but as a TEARDOWN/re-render defect, not selector drift: the call button ` +
      `mounted and then disappeared — find out whether a host re-render tore it out and SayPi failed ` +
      `to re-decorate.`,
  };

  if (!probe) {
    // Still surface a contradiction we can see without a probe: the census alone.
    const censusContradicts = !waitSucceeded && (callButtonsSeen > 0 || !!graceProbe?.present);
    return {
      ...base,
      everPresent: censusContradicts ? true : null,
      contradiction: censusContradicts ? "appeared-after-check" : null,
      nextStep: censusContradicts ? NEXT_STEP["appeared-after-check"] : "",
      attributable: censusContradicts ? ATTRIBUTABLE["appeared-after-check"] : null,
      evidence:
        `no decoration reading was taken (the in-page probe did not run), so nothing is known ` +
        `about ${CALL_BUTTON_SELECTOR} beyond the wait's own verdict` +
        (censusContradicts
          ? `, except that domDiagnostics later counted ${callButtonsSeen} of them.`
          : `.`),
    };
  }

  // `presentAtCheck` / box / computed style stay strictly the DEADLINE reading — that is
  // the "at check time" state the verdict is about. The grace reading only ever adds
  // knowledge the deadline read couldn't have: that it showed up later, and when.
  const presentAtGrace = graceProbe ? !!graceProbe.present : null;
  const firstSeenMs =
    typeof probe.firstSeenMs === "number"
      ? probe.firstSeenMs
      : typeof graceProbe?.firstSeenMs === "number"
        ? graceProbe.firstSeenMs
        : null;
  const presentAtCheck = !!probe.present;
  const hasBox = !!probe.hasBox && presentAtCheck;
  const everPresent = presentAtCheck || firstSeenMs !== null || callButtonsSeen > 0 || presentAtGrace === true;
  const withinBudget = firstSeenMs === null ? null : firstSeenMs <= budgetMs;
  const style = probe.computed
    ? `display=${probe.computed.display} visibility=${probe.computed.visibility} opacity=${probe.computed.opacity}`
    : "computed style unavailable";
  const boxText = probe.box ? `${probe.box.width}×${probe.box.height} box at (${probe.box.x},${probe.box.y})` : "no box";
  const when =
    firstSeenMs === null
      ? null
      : probe.presentAtInstall
        ? `at or before +${firstSeenMs}ms (already present when the watcher installed, so that is an upper bound)`
        : `at +${firstSeenMs}ms`;

  let contradiction = null;
  if (!waitSucceeded) {
    if (presentAtCheck) contradiction = hasBox ? "visible-but-missed" : "present-but-invisible";
    else if (callButtonsSeen > 0 || presentAtGrace === true) contradiction = "appeared-after-check";
    else if (firstSeenMs !== null) contradiction = "removed-before-check";
  }

  let evidence;
  if (presentAtCheck) {
    evidence =
      `${CALL_BUTTON_SELECTOR} was present ×${probe.count} at the ${budgetMs}ms deadline ` +
      `(read at +${probe.checkedAtMs}ms) with a ${boxText}, ${style}` +
      (when ? `; first seen ${when}` : `; first-appearance time unknown (no watcher)`) +
      `.`;
    if (contradiction === "visible-but-missed") {
      evidence +=
        ` The element was therefore in the DOM AND had a non-empty box, so the ` +
        `${budgetMs}ms visible-wait missing it is a harness/timing artifact, not selector drift.`;
    } else if (contradiction === "present-but-invisible") {
      evidence +=
        ` The element was in the DOM but had no non-empty box, which is exactly what ` +
        `Playwright's default state:'visible' requires — so the miss is a visibility ` +
        `problem, not absence.`;
    }
  } else if (contradiction === "appeared-after-check") {
    const sawIt = [
      presentAtGrace === true ? `the +${graceMs}ms grace re-read found it${when ? ` (first seen ${when})` : ""}` : null,
      callButtonsSeen > 0 ? `domDiagnostics counted ${callButtonsSeen}` : null,
    ].filter(Boolean).join(" and ");
    evidence =
      `${CALL_BUTTON_SELECTOR} was absent at the ${budgetMs}ms deadline (read at ` +
      `+${probe.checkedAtMs}ms), but ${sawIt} — both AFTER the wait. Decoration finished ` +
      `past the budget, so this is slow bootstrap, not a missing selector.`;
  } else if (contradiction === "removed-before-check") {
    evidence =
      `${CALL_BUTTON_SELECTOR} was seen ${when} but was gone by the ${budgetMs}ms deadline ` +
      `(read at +${probe.checkedAtMs}ms), and domDiagnostics counted ${callButtonsSeen ?? 0}. ` +
      `Something removed SayPi's UI after it mounted.`;
  } else {
    evidence =
      `${CALL_BUTTON_SELECTOR} never entered the DOM during the ${budgetMs}ms window ` +
      `(watcher installed at +${probe.watcherInstalledAtMs ?? "?"}ms, deadline read at ` +
      `+${probe.checkedAtMs}ms, domDiagnostics counted ${callButtonsSeen ?? 0})` +
      (graceProbe
        ? `, and it was still absent ${graceProbe.checkedAtMs != null ? `at +${graceProbe.checkedAtMs}ms ` : ""}` +
          `after a further ${graceMs}ms of looking by DOM PRESENCE rather than visibility. ` +
          `Absence is therefore measured, not merely unobserved.`
        : `. No grace re-read was taken, so "never" covers only the budget window.`);
  }
  if (withinBudget === false) {
    evidence += ` Note: the first sighting (+${firstSeenMs}ms) is PAST the ${budgetMs}ms budget.`;
  }

  return {
    ...base,
    watcherInstalled: probe.watcherInstalledAtMs !== null && probe.watcherInstalledAtMs !== undefined,
    everPresent,
    presentAtCheck,
    count: typeof probe.count === "number" ? probe.count : null,
    firstSeenMs,
    firstSeenExact: firstSeenMs === null ? null : !probe.presentAtInstall,
    checkedAtMs: typeof probe.checkedAtMs === "number" ? probe.checkedAtMs : null,
    withinBudget,
    presentAtGrace,
    hasBox,
    box: probe.box ?? null,
    computed: probe.computed ?? null,
    contradiction,
    evidence,
    nextStep: contradiction ? NEXT_STEP[contradiction] : "",
    attributable: contradiction ? ATTRIBUTABLE[contradiction] : null,
  };
}

/** Auth-ish route segments every host uses for its sign-in wall. */
const AUTH_ROUTE = /(^|\/)(login|log-in|signin|sign-in|sign_in|auth|authorize)(\/|$)/i;
const AUTH_TITLE = /\b(log ?in|sign ?in|sign ?up)\b/i;

/** Origin key for comparison: host without a cosmetic leading "www.". null if unusable. */
function originKey(url) {
  try {
    const u = new URL(String(url));
    if (!/^https?:$/.test(u.protocol)) return null;
    return u.host.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
}

/**
 * Explain a host that never decorated (#saypi-callButton never appeared), from
 * what the harness can observe at that moment. Pure.
 *
 * Precedence is deliberate. Origin first: a marketing splash like hey.pi.ai also
 * shows sign-up CTAs, and "we were bounced off the chat origin" is the stronger,
 * more actionable fact. Then a corroborated sign-in wall — corroborated means the
 * final URL is an auth route, or the page *title* reads as auth AND a sign-in
 * affordance is present and not hidden. A bare affordance on the requested page is NOT enough:
 * we bias toward DRIFT because a false "signed out" quietly buries the highest-
 * signal defect class this sweep exists to find, while a false "drift" only costs
 * one investigation. The affordance still rides along in the note as a caveat.
 *
 * `abortedBecause` short-circuits everything: the harness has paths that end a run
 * before the page can be judged at all (a Cloudflare challenge, an exception), and
 * those must not fall through to a URL-derived verdict — a crashed page reports a
 * junk URL, which would read as `unknown` and send the reader to a screenshot the
 * run never took. Every `decorated: false` host gets a kind; none are left null.
 *
 * `decoration` (a describeDecoration() result, #570) is consulted LAST, immediately
 * before DRIFT would be returned. Placing it there is deliberate on both sides: a
 * contradicted measurement must never be filed as drift, but it must also not outrank
 * the origin/sign-in facts above it — those describe what page we were even looking at,
 * and a stale element reading on a marketing splash shouldn't retitle a redirect. When
 * there is no contradiction, its evidence sentence still rides along on the DRIFT note,
 * which is what turns "we didn't see it" into "it was never in the DOM".
 *
 * @param {{requestedUrl?: string, finalUrl?: string, title?: string, signInVisible?: boolean,
 *          abortedBecause?: string, decoration?: object|null}} [input]
 * @returns {{kind: string, owner: string, redirected: boolean, requestedOrigin: string|null,
 *            finalOrigin: string|null, finalUrl: string|null, signInAffordance: boolean, note: string}}
 */
export function classifyUndecorated(input = {}) {
  const requestedUrl = input.requestedUrl ?? null;
  const finalUrl = input.finalUrl ?? null;
  const title = String(input.title ?? "");
  const signInAffordance = !!input.signInVisible;
  const requestedOrigin = originKey(requestedUrl);
  const finalOrigin = originKey(finalUrl);
  const decoration = input.decoration ?? null;
  const base = { requestedOrigin, finalOrigin, finalUrl: finalUrl ?? null, signInAffordance };

  if (input.abortedBecause) {
    return {
      ...base,
      kind: UNDECORATED_KINDS.ABORTED,
      owner: "automation",
      redirected: false,
      note:
        `not decorated because ${input.abortedBecause} — the run ended before SayPi could be judged ` +
        `against a chat app, so it says NOTHING about SayPi selector drift. Fix the run ` +
        `(re-seed with npm run layer4cdp:seed for a Cloudflare block; read notes[]/console for an ` +
        `error) and re-run before reading anything into this host.`,
    };
  }

  if (!requestedOrigin || !finalOrigin) {
    return {
      ...base,
      kind: UNDECORATED_KINDS.UNKNOWN,
      owner: "unknown",
      redirected: false,
      note:
        `not decorated, and the final URL could not be read (requested ${requestedUrl ?? "?"}, ` +
        `final ${finalUrl || "(none)"}) — can't tell a redirect / sign-in wall from SayPi selector ` +
        `drift. Check the 01-before.png screenshot and the console before concluding anything.`,
    };
  }

  if (finalOrigin !== requestedOrigin) {
    return {
      ...base,
      kind: UNDECORATED_KINDS.REDIRECTED,
      owner: "automation",
      redirected: true,
      note:
        `not decorated because the page left the requested origin: ${requestedUrl} → ${finalUrl}. ` +
        `SayPi never saw the chat app, so this run says NOTHING about SayPi selector drift. ` +
        `Usually the seeded profile is signed out and the host bounces visitors to an intro/marketing ` +
        `page; less often the host has moved its chat app. Next step: sign in to the seeded profile ` +
        `(npm run layer4cdp:seed), re-run, and if it still lands on ${finalOrigin} while signed in, ` +
        `the host URL in HOSTS is what changed.`,
    };
  }

  let finalPath = "/";
  try {
    finalPath = new URL(finalUrl).pathname;
  } catch {
    /* originKey already proved it parses; keep the default */
  }
  if (AUTH_ROUTE.test(finalPath) || (AUTH_TITLE.test(title) && signInAffordance)) {
    return {
      ...base,
      kind: UNDECORATED_KINDS.SIGNED_OUT,
      owner: "automation",
      redirected: false,
      note:
        `not decorated because ${finalOrigin} served a sign-in wall rather than the chat app ` +
        `(${finalUrl}${title ? `, title "${title}"` : ""}). The chat DOM never rendered, so this run ` +
        `says NOTHING about SayPi selector drift. Next step: sign in to the seeded profile ` +
        `(npm run layer4cdp:seed) and re-run.`,
    };
  }

  if (decoration && decoration.contradiction) {
    return {
      ...base,
      kind: UNDECORATED_KINDS.INCONSISTENT,
      owner: decoration.attributable ?? "automation",
      redirected: false,
      note:
        `not decorated according to the ${decoration.budgetMs ?? DECORATION_BUDGET_MS}ms ` +
        `visible-wait, but the run's own evidence contradicts that verdict ` +
        `[${decoration.contradiction}]: ${decoration.evidence}` +
        (decoration.nextStep ? ` Next: ${decoration.nextStep}` : "") +
        ` Corroborate with 01-before.png and domDiagnostics.callButtons (both captured AFTER the ` +
        `wait, which is how they can outvote it).`,
    };
  }

  return {
    ...base,
    kind: UNDECORATED_KINDS.DRIFT,
    owner: "saypi",
    redirected: false,
    note:
      `not decorated on the requested page itself (${finalUrl}) — no redirect off ${requestedOrigin} ` +
      `and no sign-in wall, so the host app rendered and SayPi failed to decorate it. This is the ` +
      `genuine-drift case: hunt it (compare domDiagnostics against the adapter's selectors, ` +
      `corroborate with 01-before.png).` +
      (decoration?.evidence ? ` Measurement: ${decoration.evidence}` : "") +
      (signInAffordance
        ? ` Caveat: a sign-in affordance was on the page and not hidden — confirm the profile is ` +
          `actually signed in to the host before filing a drift issue.`
        : ""),
  };
}

/**
 * Was a sign-in affordance on the page, not hidden? Corroborating evidence for
 * classifyUndecorated. Self-contained: the harness stringifies it and evaluates
 * it in the page (same rule as DIAGS — it may not close over this module, so the
 * `hidden` helper lives inside the function body).
 *
 * Deliberately narrow — a short, button-shaped "Log in"/"Sign up" label or an auth
 * href — so prose that merely mentions signing in doesn't fire it. And it skips
 * anything hidden: every signed-in host ships a login link parked in some collapsed
 * menu, and counting that would staple a "but a sign-in affordance was there"
 * caveat onto essentially every genuine drift finding.
 *
 * `visible` means exactly "matched and not hidden by display:none /
 * visibility:hidden / [hidden] / aria-hidden on itself or an ancestor". It does
 * not model layout (offsetParent/getClientRects report nothing under JSDOM, so
 * that branch could never be tested), so zero-sized or off-screen-positioned
 * controls still count.
 */
export const SIGN_IN_PROBE = () => {
  const LABEL = /^(sign[ -]?in|log[ -]?in|sign[ -]?up|register|get started|continue with [a-z]+)$/i;
  const HREF = /\/(login|log-in|signin|sign-in|sign_in|auth|authorize)(\/|\?|$)/i;
  // Sign-OUT is auth-shaped but means the opposite (we're signed in) — /api/auth/logout
  // matches HREF, and letting it through would staple a backwards caveat onto a note.
  const OUT = /(log|sign)[ -_]?out/i;
  // Ancestor walk, not just the element: `display` doesn't inherit, so a
  // <nav style="display:none"> hides its children without touching their own
  // computed style. (Cost of the walk is why it runs only on label/href matches —
  // a chat host's sidebar has hundreds of anchors.)
  // (via document.defaultView, not the bare global: the probe has to work both in
  // the page and under the JSDOM the unit tests hand-build, which exposes `document`
  // without a global `getComputedStyle`.)
  const view = document.defaultView;
  const hidden = (el) => {
    if (el.closest("[hidden], [aria-hidden='true']")) return true;
    if (!view) return false;
    for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
      const s = view.getComputedStyle(n);
      if (s.display === "none" || s.visibility === "hidden") return true;
    }
    return false;
  };
  const labels = [];
  for (const el of document.querySelectorAll("a, button, [role='button']")) {
    const text = (el.textContent || "").trim();
    if (text.length > 40) continue; // prose, not a control
    const href = el.getAttribute("href") || "";
    if (OUT.test(text) || OUT.test(href)) continue;
    if (!LABEL.test(text) && !(href && HREF.test(href))) continue;
    if (hidden(el)) continue;
    const label = text || href.slice(0, 80);
    if (label && !labels.includes(label)) labels.push(label);
  }
  return { visible: labels.length > 0, labels: labels.slice(0, 6) };
};

/**
 * Reduce a captured evidence object to a flat, comparable summary. Pure — takes
 * the shape the harness writes (console[], pageErrors[], requestFailed[], ...).
 */
export function summarize(evidence = {}) {
  const cons = Array.isArray(evidence.console) ? evidence.console : [];
  const byOrigin = (origin, type) =>
    cons.filter((c) => classifyConsoleLine(c.text) === origin && (!type || c.t === type)).length;
  return {
    host: evidence.host ?? null,
    decorated: !!evidence.decorated,
    // Where the page actually ended up, and why nothing decorated if it didn't.
    // `finalUrl` is recorded on every run (a healthy claude.ai lands on a
    // conversation URL); `undecorated` is null exactly when the host decorated.
    // Together they keep a reader from mistaking a redirect for drift (#559).
    finalUrl: evidence.finalUrl ?? null,
    undecorated: evidence.undecorated?.kind ?? null,
    // The decoration measurement (#570), flattened. `decorationContradiction` is the
    // one to scan a summary.json for: non-null means a "not decorated" the run itself
    // disproves, so the host's verdict is about the harness, not about SayPi.
    decorationEverPresent: evidence.decoration?.everPresent ?? null,
    decorationFirstSeenMs: evidence.decoration?.firstSeenMs ?? null,
    decorationContradiction: evidence.decoration?.contradiction ?? null,
    cloudflareBlocked: !!evidence.cloudflareBlocked,
    transcript: evidence.transcript ?? null,
    authStatus: evidence.authStatus ?? null,
    voiceProvider: evidence.voiceProvider ?? null,
    consoleErrors: cons.filter((c) => c.t === "error").length,
    consoleWarnings: cons.filter((c) => c.t === "warning").length,
    saypiErrors: byOrigin("saypi", "error"),
    saypiWarnings: byOrigin("saypi", "warning"),
    hostErrors: byOrigin("host", "error"),
    pageErrors: Array.isArray(evidence.pageErrors) ? evidence.pageErrors.length : 0,
    netFailures: Array.isArray(evidence.requestFailed) ? evidence.requestFailed.length : 0,
  };
}

/**
 * The chat-history selector chatgpt.com's adapter uses (src/chatbots/ChatGPT.ts
 * getChatHistorySelector()). Tag-agnostic on purpose: ChatGPT swapped the turn
 * container from <article> to <section> in 2026-06 while keeping the
 * data-testid (#362). Kept in sync by test/scripts/e2e-host-sweep-diags.spec.ts.
 */
export const CHATGPT_TURN_SELECTOR = '[data-testid^="conversation-turn"]';
export const CHATGPT_CHAT_HISTORY_SELECTOR = `div:has(> ${CHATGPT_TURN_SELECTOR})`;

/**
 * Per-host DOM/selector diagnostics, evaluated in page context by the harness.
 * These mirror the selectors SayPi's adapters depend on, so a sweep surfaces real
 * drift — and, just as importantly, does NOT manufacture drift by probing a
 * selector the adapter has already moved off (#560). Each is a self-contained
 * function: it is stringified and evaluated in the page, so it may not close over
 * anything from this module.
 */
export const DIAGS = {
  pi: () => ({
    // Pi retired its in-chat voice menu on 2026-07-30 and SayPi stopped
    // synthesising a container for it, so `#saypi-voice-menu` is now 0 BY
    // DESIGN on /talk — probing it here would manufacture drift the adapter has
    // deliberately moved off (#560, #563). What the adapter depends on now is
    // the "Chat options" kebab, and the auto-read checkbox inside its popover
    // (only present while open, hence reported separately from the kebab).
    chatOptionsButtons: document.querySelectorAll('button[aria-label="Chat options"]').length,
    autoReadItemsWhenOpen: document.querySelectorAll('[data-testid="chat-options-auto-read"]').length,
    // Voice choice now lives solely on pi.ai/profile/settings; on /talk this is
    // expected to be 0, and non-zero only on the settings route.
    voiceSettingsGrids: document.querySelectorAll("#saypi-voice-settings").length,
    moreVoicesDoors: document.querySelectorAll(".saypi-more-voices").length,
    chatHistory: document.querySelectorAll("#saypi-chat-history").length,
    presentMsgsDecorated: document.querySelectorAll(".present-messages [id*='saypi'], .present-messages [class*='saypi']").length,
    callButtons: document.querySelectorAll("#saypi-callButton").length,
  }),
  claude: () => ({
    voiceSelectors: document.querySelectorAll("#claude-voice-selector").length,
    assistantMsgs: document.querySelectorAll(".font-claude-message, [data-testid='assistant-turn']").length,
    customPlaceholders: document.querySelectorAll(".custom-placeholder, #claude-placeholder").length,
    nativePlaceholders: [...document.querySelectorAll("p[data-placeholder]")].map((p) => p.getAttribute("data-placeholder")).slice(0, 4),
    callButtons: document.querySelectorAll("#saypi-callButton").length,
  }),
  chatgpt: () => ({
    // Tag-agnostic, matching the adapter. The per-tag census below still exposes a
    // future tag change instead of silently absorbing it.
    turnsByTestid: document.querySelectorAll('[data-testid^="conversation-turn"]').length,
    turnTags: [...new Set([...document.querySelectorAll('[data-testid^="conversation-turn"]')].map((t) => t.tagName.toLowerCase()))],
    assistantByDataTurn: document.querySelectorAll('[data-turn="assistant"]').length,
    assistantByRole: document.querySelectorAll('[data-message-author-role="assistant"]').length,
    chatHistorySelMatch: document.querySelectorAll('div:has(> [data-testid^="conversation-turn"])').length,
    saypiChatHistory: document.querySelectorAll("#saypi-chat-history").length,
    callButtons: document.querySelectorAll("#saypi-callButton").length,
  }),
};
