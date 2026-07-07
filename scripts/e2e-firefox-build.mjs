/**
 * Build the static Firefox MV2 development extension for the e2e-firefox smoke
 * lane (advisory CI). Mirrors scripts/e2e-build.mjs (the Chrome Layer-3 build)
 * including its safety guards — see that script and e2e/README.md's "dual-env
 * gotcha" for the rationale. Never run bare `wxt build` here: that loads
 * .env.production and produces a production bundle.
 *
 * Output: .output/firefox-mv2-dev/ (WXT suffixes non-production modes with -dev).
 */
import { execFileSync } from "node:child_process";
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const run = (cmd, args) =>
  execFileSync(cmd, args, { cwd: root, stdio: "inherit", env: process.env });

// 1) Public, non-secret dev URLs so the src bundle has a real api host to call.
//    Same values (and same file) as scripts/e2e-build.mjs — NEVER write secrets
//    here; these match .env.example public defaults. GA_* are deliberately
//    OMITTED so telemetry fails soft (#292) and bootstrap must still decorate.
const envFile = resolve(root, ".env.development.local");
const desired = [
  "VITE_APP_SERVER_URL=https://app.saypi.ai",
  "VITE_API_SERVER_URL=https://api.saypi.ai",
  "VITE_AUTH_SERVER_URL=https://www.saypi.ai",
  "VITE_DEBUG_LOGS=true",
  "",
].join("\n");
writeFileSync(envFile, desired);
console.log(`[e2e-firefox-build] wrote ${envFile} (public URLs only, GA omitted)`);

// 2) copy ONNX/WASM (npm prebuild hook is skipped when calling wxt directly)
run("node", ["copy-onnx-files.js"]);

// 3) static development-mode MV2 build for the firefox target. `--mv2` is
//    explicit (matching `npm run dev:firefox`) even though WXT defaults the
//    firefox target to MV2 — this is the manifest version we ship to AMO.
run("npx", ["wxt", "build", "-b", "firefox", "--mv2", "-m", "development"]);

// 4) fail fast unless the output is a proper static MV2 dev build.
const manifestPath = resolve(root, ".output/firefox-mv2-dev/manifest.json");
if (!existsSync(manifestPath)) throw new Error(`Build did not produce ${manifestPath}`);
assertFirefoxDevManifest(JSON.parse(readFileSync(manifestPath, "utf8")));
console.log("[e2e-firefox-build] OK: .output/firefox-mv2-dev is a valid static MV2 dev build");

/**
 * MV2 counterpart of e2e/support/manifest-guard.ts's assertDevManifest():
 * refuse a `wxt dev` server output (no static content_scripts, localhost:3001
 * CSP) and refuse the wrong manifest version. MV2's content_security_policy is
 * a plain string, so this guard is inlined here rather than reusing the
 * Chrome/MV3 guard (which reads content_security_policy.extension_pages).
 */
function assertFirefoxDevManifest(manifest) {
  if (manifest?.manifest_version !== 2) {
    throw new Error(
      `Expected manifest_version 2 for the Firefox/AMO target, got ${manifest?.manifest_version}. ` +
        "Wrong build flags — this lane exists to run the exact MV2 artifact we ship.",
    );
  }
  const scripts = manifest?.content_scripts;
  if (!Array.isArray(scripts) || scripts.length === 0) {
    throw new Error(
      "Manifest has no static content_scripts — this looks like a `wxt dev` server build. " +
        "Run `npm run e2e:build:firefox` (wxt build -m development) and load .output/firefox-mv2-dev.",
    );
  }
  // The smoke asserts universal dictation on a plain-HTTP localhost fixture, so
  // the universal content script MUST match http://*/* (saypi-universal.content.ts).
  const matchesHttp = scripts.some((s) => (s.matches ?? []).includes("http://*/*"));
  if (!matchesHttp) {
    throw new Error(
      "No content script matches http://*/* — the universal dictation script is missing " +
        "or its match patterns drifted (entrypoints/saypi-universal.content.ts).",
    );
  }
  const matchesPi = scripts.some((s) => (s.matches ?? []).some((p) => p.includes("pi.ai")));
  if (!matchesPi) {
    throw new Error("No content script matches https://pi.ai/* — wrong build or wxt.config drift.");
  }
  const csp = typeof manifest?.content_security_policy === "string" ? manifest.content_security_policy : "";
  if (csp.includes("localhost:3001")) {
    throw new Error("CSP contains localhost:3001 — this is a `wxt dev` server build, not a static build.");
  }
}
