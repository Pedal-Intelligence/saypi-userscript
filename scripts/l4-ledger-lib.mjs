/**
 * l4-ledger-lib — pure logic for the Layer-4 real-host spend ledger + caps (#533).
 *
 * Every Layer-4 (CDP) real-host run spends real resources from the founder's
 * accounts (host plan quota, SayPi STT/TTS credits). This module implements a
 * lightweight run ledger (a JSON file, `.l4-ledger.json` at the repo root,
 * gitignored) and windowed spend caps so the harnesses can refuse to run past
 * budget instead of surprising the founder at the bill.
 *
 * Pure: no fs, no process — all inputs injected (env, now). The fs/CLI shell
 * lives in scripts/l4-ledger.mjs; the harness hook is `enforceSpendCap` there.
 *
 * Cap semantics: a run is blocked when the count of already-ledgered runs in
 * the window has reached the cap (at-cap blocked, under-cap ok). Defaults are
 * PROPOSED pending founder confirmation; founder-adjustable via the env vars
 * SAYPI_L4_CAP_SESSION / SAYPI_L4_CAP_WEEK or a `caps` block in the ledger file
 * (precedence: env > ledger caps block > defaults).
 */

/** PROPOSED defaults (pending founder confirmation — see issue #533). */
export const DEFAULT_CAPS = Object.freeze({ session: 6, week: 25 });

/** A "session" is a rolling 12h window (agent sessions have no hard boundary). */
export const SESSION_WINDOW_MS = 12 * 60 * 60 * 1000;
/** Rolling 7-day window. */
export const WEEK_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * @typedef {{timestamp: string, harness: string, target: string, purpose: string, override?: boolean}} LedgerRun
 * @typedef {{caps?: {session?: number, week?: number}, runs: LedgerRun[]}} Ledger
 */

/** @returns {Ledger} */
export function emptyLedger() {
  return { caps: { ...DEFAULT_CAPS }, runs: [] };
}

/**
 * Parse ledger file content. NEVER throws — a corrupt ledger must not crash a
 * verify run; it warns and starts fresh instead.
 * @param {string|null|undefined} text raw file content, or null if the file is absent
 * @returns {{ledger: ReturnType<typeof emptyLedger>, warning?: string}}
 */
export function parseLedger(text) {
  if (text == null || text === "") return { ledger: emptyLedger() };
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (err) {
    return { ledger: emptyLedger(), warning: `ledger file is corrupt (${err.message}) — starting a fresh ledger` };
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed) || !Array.isArray(parsed.runs)) {
    return { ledger: emptyLedger(), warning: "ledger file has an unexpected shape (corrupt?) — starting a fresh ledger" };
  }
  return { ledger: { caps: parsed.caps, runs: parsed.runs } };
}

/** @returns {string} the ledger path — SAYPI_L4_LEDGER_PATH (tests/scratch) or `<repoRoot>/.l4-ledger.json` */
export function resolveLedgerPath(env, repoRoot) {
  if (env.SAYPI_L4_LEDGER_PATH) return env.SAYPI_L4_LEDGER_PATH;
  // join() without importing node:path (keep the module pure/portable):
  return `${repoRoot.replace(/\/$/, "")}/.l4-ledger.json`;
}

function parseCap(value) {
  if (value == null) return undefined;
  const n = Number(value);
  return Number.isInteger(n) && n >= 0 ? n : undefined;
}

/**
 * Effective caps: env vars > ledger `caps` block > DEFAULT_CAPS.
 * Invalid values (non-integers, negatives) are ignored at each level.
 */
export function resolveCaps(env, ledger) {
  const fileCaps = ledger?.caps ?? {};
  return {
    session: parseCap(env.SAYPI_L4_CAP_SESSION) ?? parseCap(fileCaps.session) ?? DEFAULT_CAPS.session,
    week: parseCap(env.SAYPI_L4_CAP_WEEK) ?? parseCap(fileCaps.week) ?? DEFAULT_CAPS.week,
  };
}

/** Count runs whose timestamp falls within the trailing window ending at `now`. */
export function countRuns(runs, windowMs, now) {
  let count = 0;
  for (const run of runs ?? []) {
    const t = Date.parse(run?.timestamp ?? "");
    if (Number.isFinite(t) && t > now - windowMs && t <= now) count++;
  }
  return count;
}

/**
 * Check the caps BEFORE recording a new run: with a session cap of 6, the 7th
 * run in the window is refused.
 * @returns {{ok: boolean, sessionCount: number, weekCount: number, caps: {session:number,week:number}, warnings: string[]}}
 */
export function checkCaps(ledger, caps, now) {
  const sessionCount = countRuns(ledger.runs, SESSION_WINDOW_MS, now);
  const weekCount = countRuns(ledger.runs, WEEK_WINDOW_MS, now);
  const warnings = [];
  const ok = sessionCount < caps.session && weekCount < caps.week;
  if (ok) {
    if (sessionCount + 1 >= caps.session)
      warnings.push(`this is the last run under the session cap (${sessionCount + 1}/${caps.session} in 12h)`);
    if (weekCount + 1 >= caps.week)
      warnings.push(`this is the last run under the week cap (${weekCount + 1}/${caps.week} in 7d)`);
  }
  return { ok, sessionCount, weekCount, caps, warnings };
}

/**
 * Append a run entry (immutably — returns a new ledger).
 * @param {{harness: string, target?: string, purpose?: string, now?: number, override?: boolean}} entry
 */
export function recordRun(ledger, { harness, target, purpose, now = Date.now(), override = false }) {
  const run = {
    timestamp: new Date(now).toISOString(),
    harness,
    target: target ?? "(unspecified)",
    purpose: purpose ?? "(unspecified)",
    ...(override ? { override: true } : {}),
  };
  return { ...ledger, runs: [...(ledger.runs ?? []), run] };
}

/** Human-readable spend report: counts vs caps + the most recent runs. */
export function formatReport(ledger, caps, now, { recent = 10 } = {}) {
  const sessionCount = countRuns(ledger.runs, SESSION_WINDOW_MS, now);
  const weekCount = countRuns(ledger.runs, WEEK_WINDOW_MS, now);
  const lines = [
    `Layer-4 real-host spend (caps are PROPOSED pending founder confirmation — #533):`,
    `  session (12h): ${sessionCount}/${caps.session} runs`,
    `  week (7d):     ${weekCount}/${caps.week} runs`,
  ];
  const tail = (ledger.runs ?? []).slice(-recent);
  lines.push(tail.length ? `  recent runs:` : `  recent runs: (none)`);
  for (const r of tail) {
    lines.push(`    ${r.timestamp}  ${r.harness}  ${r.target}  — ${r.purpose}${r.override ? "  [OVERRIDE]" : ""}`);
  }
  return lines.join("\n");
}
