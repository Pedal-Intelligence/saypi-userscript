#!/usr/bin/env node
/**
 * E2E host sweep — agent-launched, rich-capture real-host E2E across pi.ai /
 * claude.ai / chatgpt.com. The thorough counterpart to `layer4cdp.mjs verify`
 * (which captures console-errors-only + a composer-only transcript check):
 * this drives a synthetic voice turn per host and captures EVERYTHING worth a
 * defect hunt —
 *   - every console message (log/info/warn/error) + pageerror
 *   - network responses for saypi/api/auth endpoints + all >=400s + requestfailed
 *   - the transcript that lands in the composer + whether the turn auto-submits
 *     and an assistant reply renders (observed over time, screenshot-corroborated)
 *   - per-host DOM/selector diagnostics (the selectors SayPi's adapter depends on)
 *   - SayPi auth + selected-voice state (so a sweep KNOWS if it skipped the TTS path)
 *   - screenshots before / at-transcript / during-observe / final
 * Writes a JSON evidence file + PNGs per host under .output/e2e-host-sweep/<run>/.
 *
 *   node scripts/e2e-host-sweep.mjs [host ...] [--observe=<ms>] [--no-turn] [--headless]
 *   npm run e2e-host-sweep            # all three hosts, headed (the working mode)
 *
 * Real Chrome over CDP on the SEEDED profile (extension profile-installed). HEADED
 * (Cloudflare walls headless on every real host). NOT CI. See doc/e2e-host-sweep.md
 * for the full runbook (preconditions, the one-time authed+voice-on seed, analysis
 * discipline, how to file findings).
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { createServer } from "node:net";
import { dirname, join, resolve as resolvePath } from "node:path";
import { fileURLToPath } from "node:url";
import { resolveCdpProfileDir, buildCdpChromeArgs, isCloudflareChallenge } from "./layer4cdp-lib.mjs";
import { HOSTS, parseSweepArgs, summarize } from "./e2e-host-sweep-lib.mjs";

const repoRoot = resolvePath(dirname(fileURLToPath(import.meta.url)), "..");
const EXT_DIR = join(repoRoot, ".output", "chrome-mv3-dev");
const log = (m) => console.log(`[e2e-sweep] ${m}`);

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
    const s = createServer(); s.unref(); s.on("error", rej);
    s.listen(0, "127.0.0.1", () => { const { port } = s.address(); s.close(() => res(port)); });
  });
const portDead = async (p) => { try { await fetch(`http://127.0.0.1:${p}/json/version`); return false; } catch { return true; } };

/**
 * Guarantee the seeded profile's NEXT launch won't show "Restore pages?". Same
 * gotcha + fix as scripts/layer4cdp.mjs (Chrome's exit_type bookkeeping is
 * unreliable on a synced, many-extension profile) — this harness shares that
 * profile, so it must mark a clean exit too. Call only after Chrome is gone.
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

// Per-host DOM/selector diagnostics, evaluated in page context. These mirror the
// selectors SayPi's adapters depend on, so a sweep surfaces drift directly.
const DIAGS = {
  pi: () => ({
    voiceMenus: document.querySelectorAll("#saypi-voice-menu").length,
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
    turnsByTestid: document.querySelectorAll('article[data-testid^="conversation-turn"]').length,
    assistantByDataTurn: document.querySelectorAll('article[data-turn="assistant"]').length,
    assistantByRole: document.querySelectorAll('[data-message-author-role="assistant"]').length,
    chatHistorySelMatch: document.querySelectorAll('div:has(> article[data-testid^="conversation-turn"])').length,
    articleCount: document.querySelectorAll("article").length,
    callButtons: document.querySelectorAll("#saypi-callButton").length,
  }),
};

async function sweepHost(ctx, host, url, opts, outDir) {
  const ev = {
    host, url, decorated: false, cloudflareBlocked: false, build: null,
    transcript: null, autoSubmitted: false, assistantReplied: false,
    authStatus: null, voiceProvider: null,
    console: [], pageErrors: [], network: [], requestFailed: [],
    domDiagnostics: {}, errorToasts: [], notes: [],
  };
  const dir = join(outDir, host);
  mkdirSync(dir, { recursive: true });
  const page = await ctx.newPage();
  page.on("console", (m) => {
    const text = m.text();
    ev.console.push({ t: m.type(), text: text.slice(0, 600) });
    const auth = text.match(/Auth status refreshed:\s*(true|false)/i);
    if (auth) ev.authStatus = auth[1].toLowerCase() === "true";
    const voice = text.match(/Speech provided by\s+(.+)/i);
    if (voice) ev.voiceProvider = voice[1].trim(); // capture full (possibly multi-word) provider/voice name
  });
  page.on("pageerror", (e) => ev.pageErrors.push({ message: e.message, stack: (e.stack || "").slice(0, 800) }));
  page.on("requestfailed", (r) => {
    const u = r.url();
    if (/saypi|api\.saypi|transcribe|\/merge|auth|google-analytics|\.onnx|\.wasm/.test(u))
      ev.requestFailed.push({ url: u.slice(0, 200), failure: r.failure()?.errorText });
  });
  page.on("response", (resp) => {
    const u = resp.url(), st = resp.status();
    if (/api\.saypi\.ai|saypi\.ai\/|transcribe|\/merge|auth|tts|\/voices/.test(u) || st >= 400) {
      const stiming = resp.headers()["server-timing"];
      ev.network.push({ url: u.slice(0, 200), status: st, serverTiming: stiming ? stiming.slice(0, 300) : undefined });
    }
  });

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 35_000 }).catch((e) => ev.notes.push(`goto: ${e.message}`));
    const sig = { title: await page.title().catch(() => ""), url: page.url(), html: (await page.content().catch(() => "")).slice(0, 4000) };
    if (isCloudflareChallenge(sig)) { ev.cloudflareBlocked = true; log(`${host}: BLOCKED by Cloudflare — re-seed (npm run layer4cdp:seed)`); return ev; }

    ev.decorated = await page.waitForSelector("#saypi-callButton", { timeout: 25_000 }).then(() => true).catch(() => false);
    ev.build = await page.evaluate(() => document.documentElement.dataset.saypiBuild ?? "(none)").catch(() => null);
    await page.screenshot({ path: join(dir, "01-before.png") }).catch(() => {});
    ev.domDiagnostics = await page.evaluate(DIAGS[host]).catch((e) => ({ error: e.message }));

    if (!ev.decorated) { ev.notes.push("not decorated — selector drift or logged out"); return ev; }

    if (!opts.noTurn) {
      await page.evaluate(() => window.dispatchEvent(new CustomEvent("saypi:dev-feed-speech", { detail: { loop: false } })));
      await page.click("#saypi-callButton").catch(() => ev.notes.push("could not click call button"));
      ev.transcript = await page.waitForFunction(() => {
        const el = document.querySelector("#saypi-prompt, div[contenteditable='true'], textarea");
        const v = el ? (el.value ?? el.textContent ?? "").trim() : "";
        return v.length > 0 ? v : false;
      }, undefined, { timeout: 30_000 }).then((h) => h.jsonValue()).catch(() => null);
      await page.screenshot({ path: join(dir, "02-transcript.png") }).catch(() => {});

      const deadline = Date.now() + opts.observeMs;
      let shot = 3;
      while (Date.now() < deadline) {
        await new Promise((r) => setTimeout(r, 4000));
        const snap = await page.evaluate(() => {
          const el = document.querySelector("#saypi-prompt, div[contenteditable='true'], textarea");
          const composer = el ? (el.value ?? el.textContent ?? "").trim() : "";
          const assistant =
            document.querySelectorAll("[data-message-author-role='assistant'], .font-claude-message, .assistant-message, [data-testid='assistant-turn']").length;
          const toasts = [...document.querySelectorAll("[class*='saypi'][class*='notification'], [role='alert'], [class*='saypi-error']")]
            .map((e) => (e.textContent || "").trim()).filter((t) => t && t.length < 240).slice(0, 8);
          return { composer: composer.slice(0, 300), assistant, toasts };
        }).catch((e) => ({ error: e.message }));
        if (snap.composer === "") ev.autoSubmitted = true;
        if ((snap.assistant || 0) > 0) ev.assistantReplied = true;
        for (const t of (snap.toasts || [])) if (!ev.errorToasts.includes(t)) ev.errorToasts.push(t);
        await page.screenshot({ path: join(dir, `0${shot++}-observe.png`) }).catch(() => {});
      }
      await page.screenshot({ path: join(dir, "99-final.png") }).catch(() => {});
    }
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
  if (opts.unknownHosts.length) log(`ignoring unknown host(s): ${opts.unknownHosts.join(", ")} (known: ${HOSTS.map((h) => h.key).join(", ")})`);
  const profileDir = resolveCdpProfileDir(process.env, homedir());
  if (!existsSync(profileDir)) { log(`no seeded profile at ${profileDir} — run: npm run layer4cdp:seed first`); process.exit(1); }

  const runStamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outDir = join(repoRoot, ".output", "e2e-host-sweep", runStamp);
  mkdirSync(outDir, { recursive: true });
  log(`sweeping ${opts.hosts.join(", ")} (${opts.headed ? "headed" : "headless"}${opts.noTurn ? ", no-turn" : ""}) → ${outDir}`);

  const port = await freePort();
  const child = spawn(chromePath(), buildCdpChromeArgs({ extensionDir: EXT_DIR, port, profileDir, headless: !opts.headed, loadExtension: false }), { stdio: "ignore" });
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

    for (const key of opts.hosts) {
      const { url } = HOSTS.find((h) => h.key === key);
      log(`--- ${key} (${url}) ---`);
      const ev = await sweepHost(ctx, key, url, opts, outDir);
      const s = summarize(ev);
      summaries.push(s);
      log(`${key}: decorated=${s.decorated} cf=${s.cloudflareBlocked} transcript=${!!s.transcript} reply=${ev.assistantReplied} auth=${s.authStatus} voice=${s.voiceProvider} | saypiErr=${s.saypiErrors} saypiWarn=${s.saypiWarnings} pageErr=${s.pageErrors} netFail=${s.netFailures} | diag=${JSON.stringify(ev.domDiagnostics)}`);
    }
  } finally {
    writeFileSync(join(outDir, "summary.json"), JSON.stringify(summaries, null, 2));
    log(`wrote ${join(outDir, "summary.json")}`);
    await shutdown();
  }
  const anyAuthed = summaries.some((s) => s.authStatus === true);
  const anyVoice = summaries.some((s) => s.voiceProvider && s.voiceProvider !== "None");
  if (!anyAuthed) log("⚠️  SayPi account is UNAUTHENTICATED in this profile — the TTS/voice-output path was NOT exercised. Sign in (saypi.ai) in the seeded profile to cover it.");
  if (!anyVoice) log("⚠️  No voice selected (Speech provided by None) — TTS readback NOT exercised. Pick a voice in the seeded profile to cover it.");
  log(`SWEEP DONE — evidence under ${outDir}`);
  process.exit(0);
}
main().catch((e) => { log(`fatal: ${e.message}`); process.exit(1); });
