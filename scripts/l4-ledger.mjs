#!/usr/bin/env node
/**
 * l4-ledger — the Layer-4 real-host spend ledger + caps (#533).
 *
 * Real-host runs spend real resources (host plan quota, SayPi STT/TTS credits
 * from the founder's accounts). This module ledgers every run in
 * `.l4-ledger.json` at the repo root (gitignored — personal operational data)
 * and refuses to launch past the caps. Pure logic lives in l4-ledger-lib.mjs.
 *
 *   node scripts/l4-ledger.mjs report              # session/week counts + recent runs
 *   node scripts/l4-ledger.mjs record --harness X [--target Y] [--purpose Z]
 *                                                  # manual entry (e.g. a dev-rig turn)
 *
 * Caps (PROPOSED defaults pending founder confirmation): 6 runs / 12h session,
 * 25 runs / 7d week. Founder-adjustable via SAYPI_L4_CAP_SESSION /
 * SAYPI_L4_CAP_WEEK or the `caps` block in the ledger file.
 * SAYPI_L4_CAP_OVERRIDE=1 bypasses a refusal — FOUNDER-AUTHORIZED USE ONLY
 * (the overridden run is still ledgered, marked [OVERRIDE]).
 * SAYPI_L4_LEDGER_PATH points at an alternate ledger (tests/dry-runs).
 */
import { existsSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve as resolvePath } from "node:path";
import {
  parseLedger,
  resolveLedgerPath,
  resolveCaps,
  checkCaps,
  recordRun,
  formatReport,
} from "./l4-ledger-lib.mjs";

const repoRoot = resolvePath(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Read the ledger from disk. Never throws: missing → fresh, corrupt → warn + fresh.
 * A corrupt file is moved aside to `<path>.corrupt-<timestamp>` before anything can
 * overwrite it — it is evidence (prior runs, possibly a founder-tightened caps
 * block) for manual recovery, not junk. The backup pattern is gitignored.
 */
export function loadLedger(path) {
  if (!existsSync(path)) return { ledger: parseLedger(null).ledger };
  let text;
  try {
    text = readFileSync(path, "utf8");
  } catch (err) {
    return { ledger: parseLedger(null).ledger, warning: `could not read ledger (${err.message}) — starting fresh` };
  }
  const parsed = parseLedger(text);
  if (parsed.warning) {
    const backup = `${path}.corrupt-${new Date().toISOString().replace(/[:.]/g, "-")}`;
    try {
      renameSync(path, backup);
      return { ...parsed, warning: `${parsed.warning}; corrupt file preserved at ${backup} (recover any founder-tuned caps from it manually)` };
    } catch (err) {
      return { ...parsed, warning: `${parsed.warning}; could NOT preserve the corrupt file (${err.message})` };
    }
  }
  return parsed;
}

export function saveLedger(path, ledger) {
  writeFileSync(path, JSON.stringify(ledger, null, 2) + "\n");
}

/**
 * The harness hook: check the caps and ledger this run, or refuse loudly.
 * Called by layer4cdp.mjs (verify) and both sweep harnesses BEFORE launching
 * Chrome. Exits the process (code 2) when over cap, unless
 * SAYPI_L4_CAP_OVERRIDE=1 (founder-authorized use only). Ledger problems only
 * warn — this must never break a run when the ledger file is absent or broken.
 */
export function enforceSpendCap({ harness, target, purpose, env = process.env, now = Date.now(), log = console.log }) {
  const path = resolveLedgerPath(env, repoRoot);
  const { ledger, warning } = loadLedger(path);
  if (warning) log(`[l4-ledger] WARN: ${warning}`);
  const caps = resolveCaps(env, ledger);
  const check = checkCaps(ledger, caps, now);
  const override = env.SAYPI_L4_CAP_OVERRIDE === "1";
  if (!check.ok && !override) {
    log("[l4-ledger] ================= REAL-HOST SPEND CAP REACHED =================");
    log(`[l4-ledger] REFUSING to launch: ${check.sessionCount}/${caps.session} runs this session (12h), ${check.weekCount}/${caps.week} this week (7d).`);
    log("[l4-ledger] Real-host runs spend the founder's STT/TTS credits + host plan quota (AGENTS.md).");
    log("[l4-ledger] Wait for the window to roll, or — FOUNDER-AUTHORIZED ONLY — re-run with SAYPI_L4_CAP_OVERRIDE=1.");
    log(`[l4-ledger] Spend report: node scripts/l4-ledger.mjs report   (ledger: ${path})`);
    log("[l4-ledger] ===============================================================");
    process.exit(2);
  }
  if (!check.ok && override) {
    log(`[l4-ledger] CAP OVERRIDDEN (SAYPI_L4_CAP_OVERRIDE=1, founder-authorized): ${check.sessionCount}/${caps.session} session, ${check.weekCount}/${caps.week} week — run is ledgered as [OVERRIDE].`);
  }
  for (const w of check.warnings) log(`[l4-ledger] WARN: ${w}`);
  try {
    saveLedger(path, recordRun(ledger, { harness, target, purpose, now, override: !check.ok && override }));
    log(`[l4-ledger] ledgered ${harness} run (session ${check.sessionCount + 1}/${caps.session}, week ${check.weekCount + 1}/${caps.week}) → ${path}`);
  } catch (err) {
    log(`[l4-ledger] WARN: could not write ledger (${err.message}) — run proceeds unledgered`);
  }
  return check;
}

function parseFlags(argv) {
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const m = /^--([a-z-]+)$/.exec(argv[i]);
    if (m) flags[m[1]] = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : "true";
  }
  return flags;
}

function main() {
  const [command, ...rest] = process.argv.slice(2);
  const path = resolveLedgerPath(process.env, repoRoot);
  const { ledger, warning } = loadLedger(path);
  if (warning) console.log(`[l4-ledger] WARN: ${warning}`);
  const caps = resolveCaps(process.env, ledger);
  switch (command ?? "report") {
    case "report":
      console.log(formatReport(ledger, caps, Date.now()));
      console.log(`  ledger: ${path}`);
      break;
    case "record": {
      const flags = parseFlags(rest);
      if (!flags.harness) {
        console.log("usage: node scripts/l4-ledger.mjs record --harness <name> [--target <url>] [--purpose <why>]");
        process.exit(1);
      }
      saveLedger(path, recordRun(ledger, { harness: flags.harness, target: flags.target, purpose: flags.purpose }));
      console.log(`[l4-ledger] recorded ${flags.harness} run → ${path}`);
      break;
    }
    default:
      console.log("usage: node scripts/l4-ledger.mjs <report|record --harness <name> [--target <url>] [--purpose <why>]>");
      process.exit(1);
  }
}

// Run the CLI only when invoked directly (this module is also imported by the
// harnesses for enforceSpendCap, and by the Vitest spec).
if (process.argv[1] && resolvePath(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
