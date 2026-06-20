#!/usr/bin/env node
/**
 * Layer 3.5 — agent-launched real-host verify loop.
 * See doc/layer35-real-host-loop.md and
 * doc/specs/2026-06-20-autonomous-loop-self-reload-and-synthetic-audio-design.md.
 *
 * Launches its OWN Chrome (Playwright launchPersistentContext) against the REAL
 * hosts, loads the built extension via --load-extension (self-reloadable, no
 * chrome://extensions), and feeds the in-extension synthetic audio source (no human
 * at the mic). Real auth comes from a founder-seeded persistent profile.
 *
 *   node scripts/layer35.mjs seed                 # founder logs in once (headed)
 *   node scripts/layer35.mjs verify [url]         # agent runs a turn (headless)
 *   node scripts/layer35.mjs self-test            # hermetic launch+load smoke
 *
 * NOT part of the hermetic Layer-3 suite or CI — it reaches the real internet.
 */
import { chromium } from "playwright";
import { existsSync, mkdtempSync } from "node:fs";
import { tmpdir, homedir } from "node:os";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve as resolvePath } from "node:path";
import {
  parseLayer35Args,
  resolveProfileDir,
  buildRealHostChromeArgs,
  buildSeedChromeArgs,
  isUnsupportedCloudflareHost,
} from "./layer35-lib.mjs";

// Layer 3.5 runs the BUNDLED Chromium: it's the only channel that loads an unpacked
// extension via --load-extension (Google restricted that flag in stable Chrome in
// 2025 — channel:"chrome" launches but never registers the extension SW, verified).
// The trade-off: bundled Chromium is fingerprinted by Cloudflare, so Cloudflare-
// gated hosts (claude.ai, chatgpt.com) can't be driven here — use Layer 4 for those
// (real browser, extension installed normally, already past Cloudflare). See
// isUnsupportedCloudflareHost + doc/layer35-real-host-loop.md.
const BUNDLED = { channel: "chromium", ignoreDefaultArgs: ["--enable-automation"] };

const repoRoot = resolvePath(dirname(fileURLToPath(import.meta.url)), "..");
const EXT_DIR = join(repoRoot, ".output", "chrome-mv3-dev");
const WAV = join(repoRoot, "e2e", "fixtures", "audio", "speech-16k-mono.wav");
const log = (msg) => console.log(`[layer35] ${msg}`);

function assertBuilt() {
  if (!existsSync(EXT_DIR)) {
    log(`missing dev build at ${EXT_DIR} — run: npm run e2e:build`);
    process.exit(1);
  }
}

async function waitForServiceWorker(context) {
  let [sw] = context.serviceWorkers();
  if (!sw) sw = await context.waitForEvent("serviceworker", { timeout: 20_000 });
  return sw;
}

async function seed(opts) {
  // No assertBuilt(): seeding is login-only and does not load the extension.
  const profileDir = resolveProfileDir(process.env, homedir());
  const url = opts.url ?? "https://pi.ai/talk";
  log(`seeding profile at ${profileDir} (login only, no extension)`);
  log("a browser opens — log into the host, then press Ctrl-C.");
  if (isUnsupportedCloudflareHost(url)) {
    log(`NOTE: ${new URL(url).hostname} is behind Cloudflare — Layer 3.5 can't drive it`);
    log("(bundled Chromium is blocked; real Chrome won't load the extension). Use Layer 4.");
  }
  const context = await chromium.launchPersistentContext(profileDir, {
    ...BUNDLED,
    headless: false,
    args: buildSeedChromeArgs(),
  });
  const page = context.pages()[0] ?? (await context.newPage());
  await page.goto(url, { waitUntil: "domcontentloaded" }).catch(() => {});
  await new Promise(() => {}); // hold open until the founder Ctrl-Cs
}

async function verify(opts) {
  assertBuilt();
  const profileDir = resolveProfileDir(process.env, homedir());
  if (!existsSync(profileDir)) {
    log(`no seeded profile at ${profileDir} — run: npm run layer35:seed (founder logs in once)`);
    process.exit(1);
  }
  if (isUnsupportedCloudflareHost(opts.url)) {
    log(`${new URL(opts.url).hostname} is behind Cloudflare — Layer 3.5 can't drive it.`);
    log("Bundled Chromium (the only channel that loads the extension) is blocked by");
    log("Cloudflare; stable Chrome (which Cloudflare accepts) refuses --load-extension.");
    log("Use Layer 4 for Claude/ChatGPT (real browser, extension installed normally,");
    log("already past Cloudflare + the saypi:dev-feed-speech/dev-reload hooks). See");
    log("doc/layer35-real-host-loop.md.");
    process.exit(2);
  }
  log(`verify ${opts.url} (profile ${profileDir}, ${opts.headed ? "headed" : "headless"})`);
  const context = await chromium.launchPersistentContext(profileDir, {
    ...BUNDLED,
    headless: !opts.headed,
    args: buildRealHostChromeArgs({ extensionDir: EXT_DIR, wavPath: WAV, headless: !opts.headed }),
  });
  let ok = false;
  try {
    const sw = await waitForServiceWorker(context);
    log(`extension loaded: ${sw.url().split("/")[2]}`);
    const page = await context.newPage();
    page.on("console", (m) => { if (m.type() === "error") log(`[page-error] ${m.text()}`); });
    await page.goto(opts.url, { waitUntil: "domcontentloaded", timeout: 30_000 });

    await page.waitForSelector("#saypi-callButton", { timeout: 25_000 });
    log("OK: SayPi decorated the page (#saypi-callButton present)");
    const build = await page.evaluate(() => document.documentElement.dataset.saypiBuild ?? "(none)");
    log(`loaded build: ${build}`);

    if (!opts.noTurn) {
      // Arm the in-extension synthetic source via the page bridge, then start a call.
      await page.evaluate(() =>
        window.dispatchEvent(new CustomEvent("saypi:dev-feed-speech", { detail: { loop: true } })));
      await page.click("#saypi-callButton").catch(() => log("could not click call button"));
      log("armed synthetic speech + started a call; watching the prompt for a transcript…");
      const got = await page
        .waitForFunction(
          () => ((document.getElementById("saypi-prompt")) ?? {}).value?.trim().length > 0,
          undefined,
          { timeout: 30_000 },
        )
        .then(() => true)
        .catch(() => false);
      const value = await page.locator("#saypi-prompt").inputValue().catch(() => "");
      if (got) log(`OK: transcript drafted into the prompt: "${value.slice(0, 120)}"`);
      else log("WARN: no transcript appeared (real STT/host may differ; decoration still verified)");
    }
    ok = true; // decoration verified = the extension loaded & ran against the real host
  } catch (err) {
    log(`FAIL: ${err.message}`);
  } finally {
    await context.close();
  }
  process.exit(ok ? 0 : 1);
}

async function selfTest() {
  assertBuilt();
  const tmpProfile = mkdtempSync(join(tmpdir(), "saypi-l35-selftest-"));
  log(`self-test (hermetic): temp profile ${tmpProfile}, about:blank`);
  const context = await chromium.launchPersistentContext(tmpProfile, {
    ...BUNDLED,
    headless: true,
    args: buildRealHostChromeArgs({ extensionDir: EXT_DIR, wavPath: WAV, headless: true }),
  });
  let ok = false;
  try {
    const sw = await waitForServiceWorker(context);
    const id = sw.url().split("/")[2];
    log(`OK: extension service worker loaded (id ${id})`);
    ok = !!id;
  } catch (err) {
    log(`FAIL: ${err.message}`);
  } finally {
    await context.close();
  }
  process.exit(ok ? 0 : 1);
}

async function main() {
  const opts = parseLayer35Args(process.argv.slice(2));
  switch (opts.command) {
    case "seed": return seed(opts);
    case "verify": return verify(opts);
    case "self-test": return selfTest();
    default:
      log("usage: node scripts/layer35.mjs <seed|verify [url] [--headed] [--no-turn]|self-test>");
      process.exit(1);
  }
}

main().catch((err) => { log(`fatal: ${err.message}`); process.exit(1); });
