#!/usr/bin/env node
/**
 * E2E dictation sweep — agent-launched, real-host(+local-fixture) E2E for universal
 * dictation (UniversalDictationModule.ts), the per-field-button counterpart to
 * e2e-host-sweep.mjs's chat-host conversation sweep. Drives a synthetic dictation
 * turn into each configured field (TARGETS in e2e-dictation-sweep-lib.mjs) and
 * checks the transcript landed.
 *
 * No chat concepts here — no model/voice selection, no TTS, no conversation thread,
 * no assistant reply. Success is just "spoken text appeared in the focused field."
 * Activation is the floating `.saypi-dictation-button` injected per focused field,
 * NOT #saypi-callButton (that's the chat-host mechanism e2e-host-sweep.mjs drives).
 *
 *   node scripts/e2e-dictation-sweep.mjs [target ...] [--headless]
 *   npm run e2e-dictation-sweep            # all v1 targets, headed
 *
 * Real Chrome over CDP on the SEEDED profile (extension profile-installed) — same
 * harness as e2e-host-sweep.mjs. NOT CI. See doc/e2e-dictation-sweep.md for the full
 * runbook (preconditions, target list, analysis discipline, how to file findings).
 * Design: doc/specs/2026-06-30-e2e-dictation-sweep-design.md
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { createServer as createNetServer } from "node:net";
import http from "node:http";
import { dirname, join, resolve as resolvePath } from "node:path";
import { fileURLToPath } from "node:url";
import { resolveCdpProfileDir, buildCdpChromeArgs, isCloudflareChallenge } from "./layer4cdp-lib.mjs";
import {
  TARGETS,
  parseSweepArgs,
  flattenFields,
  summarizeField,
  transcriptLanded,
  DEFAULT_BUTTON_TIMEOUT_MS,
  DEFAULT_TRANSCRIPT_TIMEOUT_MS,
} from "./e2e-dictation-sweep-lib.mjs";
import { enforceSpendCap } from "./l4-ledger.mjs";

const repoRoot = resolvePath(dirname(fileURLToPath(import.meta.url)), "..");
const EXT_DIR = join(repoRoot, ".output", "chrome-mv3-dev");
const FIXTURE_PATH = join(repoRoot, "test", "fixtures", "test-dictation.html");
const log = (m) => console.log(`[e2e-dictation-sweep] ${m}`);

// Mirrors e2e-host-sweep.mjs's chromePath() (own copy, not shared — see design doc).
function chromePath() {
  const c = [
    process.env.CHROME_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
  ].filter(Boolean);
  const found = c.find((p) => existsSync(p));
  if (!found) { log("could not find Google Chrome — set CHROME_PATH"); process.exit(1); }
  return found;
}

const freePort = () =>
  new Promise((res, rej) => {
    const s = createNetServer();
    s.unref();
    s.on("error", rej);
    s.listen(0, "127.0.0.1", () => { const { port } = s.address(); s.close(() => res(port)); });
  });
const portDead = async (p) => { try { await fetch(`http://127.0.0.1:${p}/json/version`); return false; } catch { return true; } };

/** Same gotcha + fix as scripts/layer4cdp.mjs / e2e-host-sweep.mjs: Chrome's
 * exit_type bookkeeping is unreliable on a synced, many-extension profile — mark
 * the shared seeded profile's NEXT launch as a clean exit so it skips "Restore
 * pages?". Call only after Chrome is gone. */
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

/** Serve the local test fixture over plain HTTP — extensions can't reliably reach
 * file:// URLs without an explicit "allow access to file URLs" permission, which
 * the dev profile doesn't grant. Started once, reused for every fixture field. */
function startFixtureServer() {
  const html = readFileSync(FIXTURE_PATH);
  const server = http.createServer((_req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
  });
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({ server, url: `http://127.0.0.1:${port}/` });
    });
  });
}

/** Dismiss a one-time site modal (e.g. Mistral's ToS dialog) if present.
 * Best-effort — absence isn't an error, most targets don't have one. Waits for the
 * button to become visible rather than a one-shot `count()` check: `count()` doesn't
 * auto-wait, so on a client-rendered SPA a modal that mounts even slightly after
 * domcontentloaded would be missed and never dismissed (same waiting idiom as
 * waitForSelector elsewhere in this codebase, e.g. e2e-host-sweep.mjs/layer4cdp.mjs). */
async function dismissModalIfPresent(page, dismissModal) {
  if (!dismissModal) return false;
  const btn = page.getByRole(dismissModal.role, { name: dismissModal.name });
  const appeared = await btn.first().waitFor({ state: "visible", timeout: 5_000 }).then(() => true).catch(() => false);
  if (!appeared) return false;
  await btn.first().click().catch(() => {});
  await page.waitForTimeout(800);
  return true;
}

async function sweepField(ctx, item, outDir, index) {
  const ev = {
    target: item.targetKey, targetLabel: item.targetLabel, field: item.fieldLabel,
    selector: item.fieldSelector, build: null, decorated: false, cloudflareBlocked: false,
    buttonAppeared: false, transcriptLanded: false, transcriptText: null,
    console: [], pageErrors: [], requestFailed: [], notes: [],
  };
  const dir = join(outDir, `${item.targetKey}__${index}`);
  mkdirSync(dir, { recursive: true });
  const page = await ctx.newPage();
  page.on("console", (m) => ev.console.push({ t: m.type(), text: m.text().slice(0, 600) }));
  page.on("pageerror", (e) => ev.pageErrors.push({ message: e.message, stack: (e.stack || "").slice(0, 800) }));
  page.on("requestfailed", (r) => {
    const u = r.url();
    if (/saypi|api\.saypi|transcribe|\/merge|auth/.test(u)) ev.requestFailed.push({ url: u.slice(0, 200), failure: r.failure()?.errorText });
  });

  try {
    await page.goto(item.url, { waitUntil: "domcontentloaded", timeout: 25_000 }).catch((e) => ev.notes.push(`goto: ${e.message}`));
    const sig = { title: await page.title().catch(() => ""), url: page.url(), html: (await page.content().catch(() => "")).slice(0, 4000) };
    if (isCloudflareChallenge(sig)) { ev.cloudflareBlocked = true; log(`${item.targetKey}: BLOCKED by Cloudflare`); return ev; }

    await dismissModalIfPresent(page, item.dismissModal);

    ev.build = await page.evaluate(() => document.documentElement.dataset.saypiBuild ?? null).catch(() => null);
    if (!ev.build) {
      // give the content script a moment on slower real sites, then re-check
      await page.waitForTimeout(2000);
      ev.build = await page.evaluate(() => document.documentElement.dataset.saypiBuild ?? null).catch(() => null);
    }
    ev.decorated = !!ev.build;

    await page.click(item.fieldSelector).catch((e) => ev.notes.push(`focus: ${e.message}`));
    await page.screenshot({ path: join(dir, "01-focused.png") }).catch(() => {});

    ev.buttonAppeared = await page
      .waitForSelector(".saypi-dictation-button:visible", { timeout: DEFAULT_BUTTON_TIMEOUT_MS })
      .then(() => true)
      .catch(() => false);

    if (!ev.buttonAppeared) {
      ev.notes.push("no .saypi-dictation-button appeared for this field");
      await page.screenshot({ path: join(dir, "99-no-button.png") }).catch(() => {});
      return ev;
    }

    await page.evaluate(() => window.dispatchEvent(new CustomEvent("saypi:dev-feed-speech", { detail: { loop: false } })));
    await page.click(".saypi-dictation-button:visible").catch((e) => ev.notes.push(`button click: ${e.message}`));

    const fieldValue = await page
      .waitForFunction((sel) => {
        const el = document.querySelector(sel);
        if (!el) return false;
        const v = (el.value ?? el.textContent ?? "").trim();
        return v.length > 0 ? v : false;
      }, item.fieldSelector, { timeout: DEFAULT_TRANSCRIPT_TIMEOUT_MS })
      .then((h) => h.jsonValue())
      .catch(() => null);

    ev.transcriptText = fieldValue;
    ev.transcriptLanded = transcriptLanded(fieldValue);
    await page.screenshot({ path: join(dir, "99-final.png") }).catch(() => {});
  } catch (err) {
    ev.notes.push(`error: ${err.message}`);
  } finally {
    writeFileSync(join(dir, "evidence.json"), JSON.stringify(ev, null, 2));
    await page.close().catch(() => {});
  }
  return ev;
}

async function main() {
  if (!existsSync(EXT_DIR)) { log(`missing dev build at ${EXT_DIR} — run: npm run e2e:build`); process.exit(1); }
  const opts = parseSweepArgs(process.argv.slice(2));
  if (opts.unknownTargets.length) log(`ignoring unknown target(s): ${opts.unknownTargets.join(", ")} (known: ${TARGETS.map((t) => t.key).join(", ")})`);
  const profileDir = resolveCdpProfileDir(process.env, homedir());
  if (!existsSync(profileDir)) { log(`no seeded profile at ${profileDir} — run: npm run layer4cdp:seed first`); process.exit(1); }

  // Spend cap + ledger (#533): one sweep = one ledgered run (real STT spend on each
  // field's turn). Refuses (exit 2) when over cap unless SAYPI_L4_CAP_OVERRIDE=1.
  enforceSpendCap({
    harness: "e2e-dictation-sweep",
    target: opts.targets.join(","),
    purpose: process.env.SAYPI_L4_PURPOSE ?? "dictation sweep (defect hunt)",
    log,
  });

  const runStamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outDir = join(repoRoot, ".output", "e2e-dictation-sweep", runStamp);
  mkdirSync(outDir, { recursive: true });

  const selectedTargets = TARGETS.filter((t) => opts.targets.includes(t.key));
  let items = flattenFields(selectedTargets);
  log(`sweeping ${selectedTargets.map((t) => t.key).join(", ")} (${items.length} field(s), ${opts.headed ? "headed" : "headless"}) → ${outDir}`);

  let fixtureServer = null;
  if (items.some((i) => i.targetKey === "fixture")) {
    const { server, url } = await startFixtureServer();
    fixtureServer = server;
    items = items.map((i) => (i.targetKey === "fixture" ? { ...i, url } : i));
  }

  const port = await freePort();
  const child = spawn(
    chromePath(),
    buildCdpChromeArgs({ extensionDir: EXT_DIR, port, profileDir, headless: !opts.headed, loadExtension: false }),
    { stdio: "ignore" },
  );
  let browser;
  const shutdown = async () => {
    try { const s = await browser.newBrowserCDPSession(); s.send("Browser.close").catch(() => {}); } catch { try { child.kill("SIGTERM"); } catch {} }
    const dl = Date.now() + 6000;
    while (Date.now() < dl) { if (await portDead(port)) { markCleanExit(profileDir); return; } await new Promise((r) => setTimeout(r, 200)); }
    try { child.kill("SIGTERM"); } catch {}
    await new Promise((r) => setTimeout(r, 1500));
    if (!(await portDead(port))) { try { child.kill("SIGKILL"); } catch {} }
    await new Promise((r) => setTimeout(r, 500));
    markCleanExit(profileDir);
  };

  const summaries = [];
  try {
    const dl0 = Date.now() + 15000;
    while (Date.now() < dl0) { try { if ((await fetch(`http://127.0.0.1:${port}/json/version`)).ok) break; } catch {} await new Promise((r) => setTimeout(r, 200)); }
    browser = await chromium.connectOverCDP(`http://127.0.0.1:${port}`);
    const ctx = browser.contexts()[0];
    for (let i = 0; i < 24 && ctx.serviceWorkers().length === 0 && ctx.backgroundPages().length === 0; i++) await new Promise((r) => setTimeout(r, 500));
    log(`extension SW count: ${ctx.serviceWorkers().length}`);

    let idx = 0;
    for (const item of items) {
      log(`--- ${item.targetKey} / ${item.fieldLabel} ---`);
      const ev = await sweepField(ctx, item, outDir, idx++);
      const s = summarizeField(ev);
      summaries.push(s);
      log(`${item.targetKey}/${item.fieldLabel}: decorated=${s.decorated} cf=${s.cloudflareBlocked} button=${s.buttonAppeared} transcriptLanded=${s.transcriptLanded} | saypiErr=${s.saypiErrors} saypiWarn=${s.saypiWarnings} pageErr=${s.pageErrors} netFail=${s.netFailures}`);
    }
  } finally {
    writeFileSync(join(outDir, "summary.json"), JSON.stringify(summaries, null, 2));
    log(`wrote ${join(outDir, "summary.json")}`);
    await shutdown();
    if (fixtureServer) fixtureServer.close();
  }

  const failed = summaries.filter((s) => !s.transcriptLanded);
  if (failed.length) {
    log(`⚠️  ${failed.length}/${summaries.length} field(s) did NOT get a landed transcript — see evidence under ${outDir}.`);
  }
  log(`SWEEP DONE — evidence under ${outDir}`);
  process.exit(0);
}
main().catch((e) => { log(`fatal: ${e.message}`); process.exit(1); });
