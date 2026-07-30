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
 * never got a chat app in front of the extension (#559).
 */
export const UNDECORATED_KINDS = {
  /** The page ended up on a different origin than requested (pi.ai/talk → hey.pi.ai). */
  REDIRECTED: "redirected-off-origin",
  /** Right origin, but the host served a sign-in wall instead of the chat app. */
  SIGNED_OUT: "signed-out",
  /** The requested page loaded and SayPi still didn't decorate it. THE defect case. */
  DRIFT: "possible-drift",
  /** The run never got far enough to judge (Cloudflare challenge, harness error). */
  ABORTED: "run-aborted",
  /** Not enough signal to tell (no usable final URL) — read the screenshot. */
  UNKNOWN: "unknown",
};

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
 * @param {{requestedUrl?: string, finalUrl?: string, title?: string, signInVisible?: boolean,
 *          abortedBecause?: string}} [input]
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
