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
 */
export function parseSweepArgs(argv = []) {
  const positional = argv.filter((a) => !a.startsWith("--"));
  const flags = argv.filter((a) => a.startsWith("--"));
  const known = HOSTS.map((h) => h.key);
  const requested = positional.filter((p) => known.includes(p));
  const unknown = positional.filter((p) => !known.includes(p));
  const observeFlag = flags.find((f) => f.startsWith("--observe="));
  const observeMs = observeFlag ? Math.max(0, Number(observeFlag.split("=")[1]) || 0) : DEFAULT_OBSERVE_MS;
  return {
    hosts: requested.length ? requested : known,
    unknownHosts: unknown,
    observeMs,
    noTurn: flags.includes("--no-turn"),
    headed: !flags.includes("--headless"),
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
