import { execFileSync } from "node:child_process";
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { assertDevManifest } from "../e2e/support/manifest-guard.ts";

const root = resolve(import.meta.dirname, "..");
const run = (cmd, args) =>
  execFileSync(cmd, args, { cwd: root, stdio: "inherit", env: process.env });

// 1) Public, non-secret dev URLs so the src bundle has a real api host to call
//    (host-resolver later redirects these hostnames to the local mocks).
//    NEVER write secrets here; these match .env.example public defaults.
//    The GA_* values are non-secret placeholders (mirroring .env.example's redacted
//    form). They are required only because SessionAnalyticsMachine.ts validates the
//    analytics config at MODULE LOAD and throws "GA_MEASUREMENT_ID is not set" when
//    absent — that throw aborts the entire content-script bootstrap before SayPi
//    decorates the page, so the harness needs them present (no analytics is actually
//    sent: the host is sandboxed and the debug endpoint is a no-op).
const envFile = resolve(root, ".env.development.local");
const desired = [
  "VITE_APP_SERVER_URL=https://app.saypi.ai",
  "VITE_API_SERVER_URL=https://api.saypi.ai",
  "VITE_AUTH_SERVER_URL=https://www.saypi.ai",
  "VITE_DEBUG_LOGS=true",
  "VITE_GA_MEASUREMENT_ID=G-E2E0000000",
  "VITE_GA_API_SECRET=e2e-no-secret",
  "VITE_GA_ENDPOINT=https://www.google-analytics.com/debug/mp/collect",
  "",
].join("\n");
writeFileSync(envFile, desired);
console.log(`[e2e-build] wrote ${envFile} (public URLs only)`);

// 2) copy ONNX/WASM (npm prebuild hook is skipped when calling wxt directly)
run("node", ["copy-onnx-files.js"]);

// 3) static development-mode build (NEVER bare `wxt build` -> that loads .env.production)
run("npx", ["wxt", "build", "-b", "chrome", "-m", "development"]);

// 4) fail fast unless the output is a proper static dev build
const manifestPath = resolve(root, ".output/chrome-mv3-dev/manifest.json");
if (!existsSync(manifestPath)) throw new Error(`Build did not produce ${manifestPath}`);
assertDevManifest(JSON.parse(readFileSync(manifestPath, "utf8")));
console.log("[e2e-build] OK: .output/chrome-mv3-dev is a valid static dev build");
