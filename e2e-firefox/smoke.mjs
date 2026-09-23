/**
 * e2e-firefox smoke — the whole test, in one plain node script.
 *
 * Proves the exact artifact we ship to AMO boots in the exact browser it ships
 * to: build `.output/firefox-mv2-dev` (npm run e2e:build:firefox), temporary-
 * install it into a real headless Firefox via selenium-webdriver 4 + geckodriver,
 * load a plain-HTTP localhost fixture page, focus a text field, and assert the
 * universal dictation content script decorates it with a visible
 * `.saypi-dictation-button`.
 *
 * That single assertion covers: manifest accepted (temporary install would
 * fail otherwise), background starts, content script injects on Gecko, and the
 * DOM decoration path works — the coverage slice no other layer exercises in
 * Firefox. See e2e-firefox/README.md and
 * doc/specs/2026-07-07-firefox-coverage-decision.md (#527).
 *
 * It then presses the button and asserts the in-page VAD initializes (#655).
 * Firefox has no offscreen document, so the VAD runs in the content script:
 * onnxruntime-web's WASM + `.mjs` glue, the Silero model fetched through the
 * cross-realm ArrayBuffer shim, and the audio worklet all load there, under
 * Gecko's rules. Chrome's Layer 3 can't see any of that. Firefox's fake-mic
 * prefs stand in for a microphone; the tone it plays isn't speech, so this
 * proves the VAD *starts*, not that it detects anything.
 *
 * Run: npm run e2e:build:firefox && npm run test:e2e:firefox
 * Env: FIREFOX_BIN — optional path to the Firefox binary (CI sets it from
 *      browser-actions/setup-firefox; locally Selenium finds the system install).
 * geckodriver is resolved by Selenium Manager (bundled with selenium-webdriver)
 * or picked up from PATH — no separate dev-dependency needed.
 */
import http from "node:http";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { Builder, By } from "selenium-webdriver";
import firefox from "selenium-webdriver/firefox.js";
import { Command } from "selenium-webdriver/lib/command.js";

const root = resolve(import.meta.dirname, "..");
const buildDir = resolve(root, ".output/firefox-mv2-dev");
const fixturePath = resolve(import.meta.dirname, "fixture.html");
const artifactsDir = resolve(import.meta.dirname, "artifacts");

// Content-script boot + decoration, generous for CI. Overridable for local
// fail-path testing (e.g. SAYPI_SMOKE_TIMEOUT_MS=5000).
const DECORATION_TIMEOUT_MS = Number(process.env.SAYPI_SMOKE_TIMEOUT_MS) || 45_000;
// Model + ~14 MB of WASM compile in a cold headless Firefox; generous for CI.
const VAD_TIMEOUT_MS = Number(process.env.SAYPI_SMOKE_VAD_TIMEOUT_MS) || 60_000;
const POLL_INTERVAL_MS = 500;

/** Hosts the built bundle believes it talks to (see the "dual-env gotcha" in
 * e2e/README.md). Firefox has no --host-resolver-rules; the closest knob is the
 * `network.dns.localDomains` pref, which resolves the listed hostnames to
 * loopback — requests fail fast with connection-refused instead of leaving the
 * machine. Bootstrap must decorate anyway (fail-soft telemetry/auth, #292), so
 * this both keeps the run hermetic and asserts that fail-softness on Firefox. */
const SINKHOLED_HOSTS = [
  "api.saypi.ai",
  "www.saypi.ai",
  "app.saypi.ai",
  "pi.ai",
  "www.google-analytics.com",
  "google-analytics.com",
].join(",");

function fail(msg) {
  console.error(`[e2e-firefox] FAIL: ${msg}`);
  process.exitCode = 1;
}

function startFixtureServer() {
  const html = readFileSync(fixturePath);
  const server = http.createServer((_req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
  });
  return new Promise((resolveServer) => {
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolveServer({ server, url: `http://127.0.0.1:${port}/` });
    });
  });
}

async function buildDriver() {
  const options = new firefox.Options();
  options.addArguments("-headless");
  // Temporary add-ons (installAddon(path, /*temporary=*/true)) do not require
  // signing, but keep the pref explicit so a future switch to a packed .xpi
  // doesn't silently start failing on signature checks.
  options.setPreference("xpinstall.signatures.required", false);
  options.setPreference("network.dns.localDomains", SINKHOLED_HOSTS);
  // Echo page/extension console output to Firefox's stdout, and surface that
  // stdout (via geckodriver) in this process's output — without this a
  // content-script crash on CI is an opaque "button never appeared".
  options.setPreference("devtools.console.stdout.content", true);
  // A fake, pre-authorised microphone, so pressing the dictation button can start
  // the in-page VAD in a headless run (#655).
  options.setPreference("media.navigator.streams.fake", true);
  options.setPreference("media.navigator.permission.disabled", true);
  if (process.env.FIREFOX_BIN) {
    options.setBinary(process.env.FIREFOX_BIN);
  }
  const service = new firefox.ServiceBuilder().setStdio("inherit");
  return new Builder()
    .forBrowser("firefox")
    .setFirefoxOptions(options)
    .setFirefoxService(service)
    .build();
}

/**
 * Temporary-install the UNPACKED build directory by filesystem path — the same
 * mechanism as about:debugging's "Load Temporary Add-on".
 *
 * Deliberately NOT `driver.installAddon(dir, true)`: that base64-zips the
 * directory and geckodriver stages the zip as a temp XPI which does not
 * reliably survive for later loads — on Firefox 140 ESR the background loads
 * (read at install time) but every content-script injection then fails with
 * `NS_ERROR_FILE_ACCESS_DENIED` / "Unable to load script:
 * moz-extension://…/content-scripts/saypi-universal.js" (reproduced locally;
 * Firefox 152 happened to tolerate it). Passing `path` instead makes Firefox
 * read the unpacked directory directly, which works on both. Requires
 * geckodriver + Firefox on the same host as this script — true locally and on
 * the CI runner.
 */
async function installUnpackedAddon(driver, dir) {
  // "install addon" is registered on the driver's command executor by
  // selenium-webdriver/firefox.js (POST /session/:id/moz/addon/install).
  return driver.execute(
    new Command("install addon").setParameter("path", dir).setParameter("temporary", true),
  );
}

/** Where the in-page VAD reports its state (OnscreenVADClient → VADStatusIndicator). */
const VAD_PROBE_SCRIPT = `
  const text = (sel) => (document.querySelector(sel) || {}).textContent || "";
  return { status: text(".saypi-vad-status-text"), detail: text(".saypi-vad-status-details") };
`;

/** One decoration probe, evaluated in the page. */
const PROBE_SCRIPT = `
  const btn = document.querySelector(".saypi-dictation-button");
  return {
    present: !!btn,
    display: btn ? getComputedStyle(btn).display : null,
    activeElementId: document.activeElement ? document.activeElement.id : null,
  };
`;

async function dumpFailureArtifacts(driver, lastState) {
  try {
    mkdirSync(artifactsDir, { recursive: true });
    const html = await driver.executeScript("return document.documentElement.outerHTML;");
    writeFileSync(resolve(artifactsDir, "page.html"), String(html));
    const png = await driver.takeScreenshot();
    writeFileSync(resolve(artifactsDir, "page.png"), Buffer.from(png, "base64"));
    writeFileSync(
      resolve(artifactsDir, "last-state.json"),
      JSON.stringify({ lastState, timeoutMs: DECORATION_TIMEOUT_MS }, null, 2),
    );
    console.error(`[e2e-firefox] failure artifacts written to ${artifactsDir}`);
  } catch (err) {
    console.error("[e2e-firefox] could not write failure artifacts:", err);
  }
}

async function main() {
  if (!existsSync(resolve(buildDir, "manifest.json"))) {
    throw new Error(
      `No built extension at ${buildDir} — run \`npm run e2e:build:firefox\` first.`,
    );
  }

  const { server, url } = await startFixtureServer();
  console.log(`[e2e-firefox] fixture server on ${url}`);

  let driver;
  try {
    driver = await buildDriver();
    const caps = await driver.getCapabilities();
    console.log(
      `[e2e-firefox] Firefox ${caps.getBrowserVersion()} (headless), ` +
        `geckodriver via ${process.env.FIREFOX_BIN ? "FIREFOX_BIN" : "system default"}`,
    );

    // Temporary install of the UNPACKED build dir. A manifest Firefox rejects
    // fails right here — that failure is itself the first assertion of this smoke.
    if (process.env.SAYPI_SMOKE_SKIP_INSTALL === "1") {
      // Fail-path seam: prove the smoke goes red (exit 1 + artifacts) when the
      // extension never decorates. Never set on CI.
      console.warn("[e2e-firefox] SAYPI_SMOKE_SKIP_INSTALL=1 — add-on NOT installed");
    } else {
      const addonId = await installUnpackedAddon(driver, buildDir);
      console.log(`[e2e-firefox] temporary add-on installed (id: ${addonId})`);
    }

    await driver.get(url);
    const input = await driver.findElement(By.id("smoke-input"));
    await input.click();

    const deadline = Date.now() + DECORATION_TIMEOUT_MS;
    let state = null;
    let decorated = false;
    while (Date.now() < deadline) {
      state = await driver.executeScript(PROBE_SCRIPT);
      if (state.present && state.display !== "none") {
        decorated = true;
        break;
      }
      // The content script injects at document_idle; if it booted after our
      // click it relies on the already-focused-element scan. Re-focus each
      // poll so a lost focus can never be the reason the smoke goes red.
      await driver.executeScript(
        "const el = document.getElementById('smoke-input'); if (el) el.focus();",
      );
      await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
    }

    if (!decorated) {
      await dumpFailureArtifacts(driver, state);
      throw new Error(
        `.saypi-dictation-button did not decorate the focused input within ` +
          `${DECORATION_TIMEOUT_MS / 1000}s (last probe: ${JSON.stringify(state)}). ` +
          `See ${artifactsDir} for page HTML + screenshot.`,
      );
    }

    // A delayed blur must not hide a field that regained focus (#622).
    // Check after the 150 ms click grace period, using real browser focus events.
    await driver.executeScript(
      "const el = document.getElementById('smoke-input'); el.blur(); el.focus();",
    );
    await new Promise((r) => setTimeout(r, 250));
    state = await driver.executeScript(PROBE_SCRIPT);
    if (!state.present || state.display === "none" || state.activeElementId !== "smoke-input") {
      await dumpFailureArtifacts(driver, state);
      throw new Error(`Rapid refocus hid the dictation button: ${JSON.stringify(state)}`);
    }

    console.log(
      `[e2e-firefox] PASS: .saypi-dictation-button visible on the focused input ` +
        `(probe: ${JSON.stringify(state)})`,
    );

    // Press the button (it listens for mousedown) and wait for the VAD to come up.
    await driver.executeScript(`
      document.querySelector(".saypi-dictation-button")
        .dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true, button: 0 }));
    `);
    const vadDeadline = Date.now() + VAD_TIMEOUT_MS;
    let vad = null;
    let vadReady = false;
    while (Date.now() < vadDeadline) {
      vad = await driver.executeScript(VAD_PROBE_SCRIPT);
      if (/fail|error/i.test(vad.status + " " + vad.detail)) break;
      // "Waiting for speech" appears only once start() has built the audio graph, which
      // is the step that broke (#655). "Initialized" (after MicVAD.new) isn't enough.
      if (/Waiting for speech/.test(vad.detail)) {
        vadReady = true;
        break;
      }
      await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
    }
    if (!vadReady) {
      await dumpFailureArtifacts(driver, vad);
      throw new Error(
        `The in-page VAD did not initialize within ${VAD_TIMEOUT_MS / 1000}s ` +
          `(last status: ${JSON.stringify(vad)}). See ${artifactsDir}.`,
      );
    }
    // Let the model run on a few seconds of fake-mic frames: an inference or resampling
    // failure would surface here rather than at start.
    await new Promise((r) => setTimeout(r, 3000));
    vad = await driver.executeScript(VAD_PROBE_SCRIPT);
    if (/fail|error/i.test(vad.status + " " + vad.detail)) {
      await dumpFailureArtifacts(driver, vad);
      throw new Error(`The in-page VAD failed after starting: ${JSON.stringify(vad)}`);
    }
    console.log(`[e2e-firefox] PASS: in-page VAD initialized and running (status: ${JSON.stringify(vad)})`);
  } finally {
    if (driver) await driver.quit().catch(() => {});
    server.close();
  }
}

main().catch((err) => {
  fail(err?.message ?? String(err));
});
