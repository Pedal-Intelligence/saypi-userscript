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
import { existsSync, mkdtempSync } from "node:fs";
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

/** Spawn real Chrome and attach over CDP. Returns { browser, child, kill }. */
async function launchAttached({ profileDir, headless }) {
  const port = await freePort();
  const args = buildCdpChromeArgs({ extensionDir: EXT_DIR, port, profileDir, headless });
  const child = spawn(chromePath(), args, { stdio: "ignore", detached: false });
  const kill = () => { try { child.kill("SIGKILL"); } catch {} };
  try {
    await waitForCdp(port);
    const browser = await chromium.connectOverCDP(`http://127.0.0.1:${port}`);
    return { browser, child, kill };
  } catch (err) {
    kill();
    throw err;
  }
}

function extensionLoaded(context) {
  return context.serviceWorkers().length > 0 || context.backgroundPages().length > 0;
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
  const { browser } = await launchAttached({ profileDir, headless: false });
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
  log(`diagnose ${opts.url} (headless CDP, seeded profile) — measuring the keystones`);
  const { browser, kill } = await launchAttached({ profileDir, headless: true });
  try {
    const ctx = browser.contexts()[0];
    const extOk = extensionLoaded(ctx);
    log(`extension loaded over CDP: ${extOk ? "YES" : "NO"}`);
    const page = await ctx.newPage();
    await page.goto(opts.url, { waitUntil: "domcontentloaded", timeout: 30_000 }).catch(() => {});
    const sig = await pageSignals(page);
    const blocked = isCloudflareChallenge(sig);
    log(`page title: ${JSON.stringify(sig.title)}`);
    log(`past Cloudflare: ${blocked ? "NO — challenge interstitial (re-seed / cf_clearance expired)" : "YES"}`);
    if (!blocked) {
      const decorated = await page.$("#saypi-callButton").then(Boolean).catch(() => false);
      log(`SayPi decorated the app: ${decorated ? "YES" : "no (logged out, or selector drift)"}`);
    }
    log(blocked
      ? "VERDICT: blocked — Path 2 not usable until re-seeded; use Path 1 (MCP) meanwhile."
      : extOk
      ? "VERDICT: usable — extension + Cloudflare both OK. Re-run periodically to gauge upkeep."
      : "VERDICT: extension didn't load — check the dev build / Chrome version.");
  } finally {
    await browser.close().catch(() => {});
    kill();
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
  const { browser, kill } = await launchAttached({ profileDir, headless: !opts.headed });
  let code = 1;
  try {
    const ctx = browser.contexts()[0];
    if (!extensionLoaded(ctx)) {
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
    await browser.close().catch(() => {});
    kill();
  }
  process.exit(code);
}

async function selfTest() {
  assertBuilt();
  const profileDir = mkdtempSync(join(tmpdir(), "saypi-l4cdp-selftest-"));
  log(`self-test (hermetic): temp profile ${profileDir}, about:blank`);
  const { browser, kill } = await launchAttached({ profileDir, headless: true });
  let ok = false;
  try {
    // give the SW a moment to register after attach
    await new Promise((r) => setTimeout(r, 2500));
    const ctx = browser.contexts()[0];
    ok = extensionLoaded(ctx);
    log(ok ? "OK: extension service worker loaded over CDP" : "FAIL: no extension SW");
  } finally {
    await browser.close().catch(() => {});
    kill();
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
