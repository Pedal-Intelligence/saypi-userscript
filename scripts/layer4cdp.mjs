#!/usr/bin/env node
/**
 * Layer 4 (CDP) — agent-launched, Cloudflare-capable real-host loop for Claude/ChatGPT.
 * See doc/layer4-cdp-real-host-loop.md and
 * doc/specs/2026-06-20-layer4-cdp-cloudflare-real-host-design.md.
 *
 * Drives the founder's REAL Chrome (launched directly via child_process, attached
 * over CDP) so it loads the unpacked extension (probe-verified, headed AND headless,
 * navigator.webdriver===false) and presents a real fingerprint to Cloudflare. Real
 * auth comes from a dedicated, founder-seeded profile.
 *
 *   node scripts/layer4cdp.mjs seed [url]        # founder logs in once (headed)
 *   node scripts/layer4cdp.mjs diagnose [url]    # founder: does Cloudflare pass? (headless)
 *   node scripts/layer4cdp.mjs verify [url]      # agent: drive a turn (headless)
 *   node scripts/layer4cdp.mjs self-test         # hermetic launch+load smoke
 *
 * NOT CI — real internet, real auth, flaky/rate-limited.
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir, homedir } from "node:os";
import { createServer } from "node:net";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve as resolvePath } from "node:path";
import {
  parseLayer4CdpArgs,
  resolveCdpProfileDir,
  buildCdpChromeArgs,
  isCloudflareChallenge,
} from "./layer4cdp-lib.mjs";

const repoRoot = resolvePath(dirname(fileURLToPath(import.meta.url)), "..");
const EXT_DIR = join(repoRoot, ".output", "chrome-mv3-dev");
const log = (msg) => console.log(`[layer4cdp] ${msg}`);

function chromePath() {
  if (process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH)) return process.env.CHROME_PATH;
  const candidates = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/opt/google/chrome/chrome",
  ];
  const found = candidates.find((p) => existsSync(p));
  if (!found) {
    log("could not find Google Chrome — set CHROME_PATH to the executable");
    process.exit(1);
  }
  return found;
}

function assertBuilt() {
  if (!existsSync(EXT_DIR)) {
    log(`missing dev build at ${EXT_DIR} — run: npm run e2e:build`);
    process.exit(1);
  }
}

/**
 * Guarantee the profile's NEXT launch won't show "Restore pages?". Call only after
 * the browser is confirmed gone. Chrome's own exit_type bookkeeping is unreliable on
 * a synced, many-extension profile (graceful close doesn't always flip it to Normal),
 * so we set it ourselves — minimal, safe (Chrome rewrites these keys every run).
 */
function markCleanExit(profileDir) {
  try {
    const pref = join(profileDir, "Default", "Preferences");
    if (!existsSync(pref)) return;
    const p = JSON.parse(readFileSync(pref, "utf8"));
    p.profile = p.profile || {};
    p.profile.exit_type = "Normal";
    p.profile.exited_cleanly = true;
    writeFileSync(pref, JSON.stringify(p));
  } catch (err) {
    log(`note: could not mark clean exit (${err.message})`);
  }
}

function freePort() {
  return new Promise((resolve, reject) => {
    const srv = createServer();
    srv.unref();
    srv.on("error", reject);
    srv.listen(0, "127.0.0.1", () => {
      const { port } = srv.address();
      srv.close(() => resolve(port));
    });
  });
}

async function waitForCdp(port, ms = 15000) {
  const deadline = Date.now() + ms;
  while (Date.now() < deadline) {
    try {
      const r = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (r.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error("CDP endpoint never came up");
}

/** Spawn real Chrome and attach over CDP. Returns { browser, child, shutdown }. */
async function launchAttached({ profileDir, headless, loadExtension = false }) {
  const port = await freePort();
  const args = buildCdpChromeArgs({ extensionDir: EXT_DIR, port, profileDir, headless, loadExtension });
  const child = spawn(chromePath(), args, { stdio: "ignore", detached: false });
  const hardKill = () => { try { child.kill("SIGKILL"); } catch {} };
  const portDead = async () => {
    try { await fetch(`http://127.0.0.1:${port}/json/version`); return false; } catch { return true; }
  };
  let browser;
  // Shut Chrome down GRACEFULLY so it records exit_type=Normal. SIGKILL can't be
  // trapped, so a SIGKILL'd Chrome shows a "Restore pages? Chrome didn't shut down
  // correctly" prompt on the NEXT launch of the profile (verified). Use the CDP
  // `Browser.close` graceful path — FIRE-AND-FORGET: the command's own response never
  // returns because Chrome exits first, so awaiting it would hang. Confirm shutdown by
  // polling the debug port (robust to macOS's launcher/PID split); SIGTERM then SIGKILL
  // only as fallbacks.
  const shutdown = async () => {
    try {
      const session = await browser.newBrowserCDPSession();
      session.send("Browser.close").catch(() => {});
    } catch {
      try { child.kill("SIGTERM"); } catch {}
    }
    const deadline = Date.now() + 6000;
    while (Date.now() < deadline) {
      if (await portDead()) { markCleanExit(profileDir); return; }
      await new Promise((r) => setTimeout(r, 200));
    }
    try { child.kill("SIGTERM"); } catch {}
    await new Promise((r) => setTimeout(r, 1500));
    if (!(await portDead())) hardKill();
    await new Promise((r) => setTimeout(r, 500));
    markCleanExit(profileDir);
  };
  try {
    await waitForCdp(port);
    browser = await chromium.connectOverCDP(`http://127.0.0.1:${port}`);
    return { browser, child, shutdown };
  } catch (err) {
    try { child.kill("SIGTERM"); } catch {}
    setTimeout(hardKill, 3000).unref?.();
    throw err;
  }
}

function extensionLoaded(context) {
  return context.serviceWorkers().length > 0 || context.backgroundPages().length > 0;
}

/** MV3 service workers register lazily after attach — poll instead of checking once. */
async function waitForExtension(context, ms = 12000) {
  const deadline = Date.now() + ms;
  while (Date.now() < deadline) {
    if (extensionLoaded(context)) return true;
    await new Promise((r) => setTimeout(r, 500));
  }
  return extensionLoaded(context);
}

async function pageSignals(page) {
  const title = await page.title().catch(() => "");
  const url = page.url();
  const html = await page.content().catch(() => "");
  return { title, url, html };
}

async function seed(opts) {
  const profileDir = resolveCdpProfileDir(process.env, homedir());
  log(`seeding CDP profile at ${profileDir} (real Chrome, headed)`);
  log(`log into ${new URL(opts.url).hostname} (solve the Cloudflare checkbox), then Ctrl-C.`);
  const { browser, shutdown } = await launchAttached({ profileDir, headless: false });
  // Ctrl-C must close Chrome GRACEFULLY (else the next launch shows "Restore pages?").
  let closing = false;
  for (const sig of ["SIGINT", "SIGTERM"]) {
    process.on(sig, () => {
      if (closing) return;
      closing = true;
      log("shutting down Chrome gracefully…");
      shutdown().finally(() => process.exit(0));
    });
  }
  const ctx = browser.contexts()[0];
  const page = ctx.pages()[0] ?? (await ctx.newPage());
  await page.goto(opts.url, { waitUntil: "domcontentloaded" }).catch(() => {});
  await new Promise(() => {}); // hold until Ctrl-C
}

async function diagnose(opts) {
  assertBuilt();
  const profileDir = resolveCdpProfileDir(process.env, homedir());
  if (!existsSync(profileDir)) {
    log(`no seeded profile at ${profileDir} — run: npm run layer4cdp:seed first`);
    process.exit(1);
  }
  log(`diagnose ${opts.url} (${opts.headed ? "headed" : "headless"} CDP, seeded profile) — measuring the keystones`);
  const { browser, shutdown } = await launchAttached({ profileDir, headless: !opts.headed });
  try {
    const ctx = browser.contexts()[0];
    const extOk = await waitForExtension(ctx);
    log(`extension loaded over CDP: ${extOk ? "YES" : "NO"}`);
    const page = await ctx.newPage();
    await page.goto(opts.url, { waitUntil: "domcontentloaded", timeout: 30_000 }).catch(() => {});
    const sig = await pageSignals(page);
    const blocked = isCloudflareChallenge(sig);
    log(`page title: ${JSON.stringify(sig.title)}`);
    log(`past Cloudflare: ${blocked ? "NO — challenge interstitial (re-seed / cf_clearance expired)" : "YES"}`);
    let decorated = false;
    if (!blocked) {
      decorated = await page.waitForSelector("#saypi-callButton", { timeout: 20_000 }).then(() => true).catch(() => false);
      log(`SayPi decorated the app: ${decorated ? "YES" : "no (logged out, or selector drift)"}`);
    }
    log(blocked
      ? "VERDICT: blocked — Cloudflare challenge. If headless, that's expected — re-run headed; else re-seed (cf_clearance expired)."
      : decorated
      ? "VERDICT: usable — extension loaded, Cloudflare passed, SayPi decorated the host. Re-run periodically to gauge upkeep."
      : extOk
      ? "VERDICT: past Cloudflare + extension loaded, but no decoration — check login / selectors."
      : "VERDICT: extension didn't load — ensure Developer mode is ON + the dev build is loaded in the seeded profile (see doc/layer4-cdp-real-host-loop.md).");
  } finally {
    await shutdown();
  }
  process.exit(0);
}

async function verify(opts) {
  assertBuilt();
  const profileDir = resolveCdpProfileDir(process.env, homedir());
  if (!existsSync(profileDir)) {
    log(`no seeded profile at ${profileDir} — run: npm run layer4cdp:seed first`);
    process.exit(1);
  }
  log(`verify ${opts.url} (CDP, ${opts.headed ? "headed" : "headless"})`);
  const { browser, shutdown } = await launchAttached({ profileDir, headless: !opts.headed });
  let code = 1;
  try {
    const ctx = browser.contexts()[0];
    if (!(await waitForExtension(ctx))) {
      log("FAIL: extension did not load over CDP (run self-test / check the build)");
      return;
    }
    const page = await ctx.newPage();
    page.on("console", (m) => { if (m.type() === "error") log(`[page-error] ${m.text()}`); });
    await page.goto(opts.url, { waitUntil: "domcontentloaded", timeout: 30_000 });
    const sig = await pageSignals(page);
    if (isCloudflareChallenge(sig)) {
      log("BLOCKED: Cloudflare challenge — cf_clearance expired. Re-run: npm run layer4cdp:seed");
      code = 3;
      return;
    }
    await page.waitForSelector("#saypi-callButton", { timeout: 25_000 });
    log("OK: SayPi decorated the page (#saypi-callButton present)");
    const build = await page.evaluate(() => document.documentElement.dataset.saypiBuild ?? "(none)");
    log(`loaded build: ${build}`);
    if (!opts.noTurn) {
      await page.evaluate(() =>
        window.dispatchEvent(new CustomEvent("saypi:dev-feed-speech", { detail: { loop: true } })));
      await page.click("#saypi-callButton").catch(() => log("could not click call button"));
      log("armed synthetic speech + started a call; watching the prompt…");
      const got = await page
        .waitForFunction(() => {
          const el = document.querySelector("#saypi-prompt, [contenteditable='true'], textarea");
          return !!(el && (el.value ?? el.textContent ?? "").trim().length > 0);
        }, undefined, { timeout: 30_000 })
        .then(() => true).catch(() => false);
      log(got ? "OK: transcript drafted into the composer" : "WARN: no transcript (real STT/host may differ; decoration verified)");
    }
    code = 0;
  } catch (err) {
    log(`FAIL: ${err.message}`);
  } finally {
    await shutdown();
  }
  process.exit(code);
}

async function selfTest() {
  assertBuilt();
  const profileDir = mkdtempSync(join(tmpdir(), "saypi-l4cdp-selftest-"));
  log(`self-test (hermetic): temp profile ${profileDir}, about:blank`);
  const { browser, shutdown } = await launchAttached({ profileDir, headless: true, loadExtension: true });
  let ok = false;
  try {
    const ctx = browser.contexts()[0];
    ok = await waitForExtension(ctx);
    log(ok ? "OK: extension service worker loaded over CDP" : "FAIL: no extension SW");
  } finally {
    await shutdown();
  }
  process.exit(ok ? 0 : 1);
}

async function main() {
  const opts = parseLayer4CdpArgs(process.argv.slice(2));
  switch (opts.command) {
    case "seed": return seed(opts);
    case "diagnose": return diagnose(opts);
    case "verify": return verify(opts);
    case "self-test": return selfTest();
    default:
      log("usage: node scripts/layer4cdp.mjs <seed|diagnose|verify [url] [--headed] [--no-turn]|self-test>");
      process.exit(1);
  }
}

main().catch((err) => { log(`fatal: ${err.message}`); process.exit(1); });
