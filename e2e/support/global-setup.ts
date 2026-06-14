import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { assertDevManifest } from "./manifest-guard.ts";
import { startMockServers, type MockServers } from "./mock-servers.ts";

// Self-signed certs are served by the mock API/Pi servers; the browser is launched
// with --ignore-certificate-errors, and Node-side fetches opt out of verification.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Repo root: e2e/support/global-setup.ts -> ../../
const ROOT = resolve(import.meta.dirname, "..", "..");
const DEV_MANIFEST = resolve(ROOT, ".output/chrome-mv3-dev/manifest.json");

let servers: MockServers | undefined;

/**
 * Playwright global setup. Runs BEFORE any worker launches the browser so the
 * launch-args fixture can read the assigned ports from env vars:
 *   1. Re-run the build guard against the static dev manifest (fail fast on a
 *      `wxt dev` / production build before we waste time launching Chrome).
 *   2. Start the two mock HTTPS servers on ephemeral ports.
 *   3. Export their ports via SAYPI_E2E_PI_PORT / SAYPI_E2E_API_PORT so the
 *      Chrome launch args (--host-resolver-rules) can pin host -> port.
 */
export default async function globalSetup(): Promise<void> {
  // 1) Build guard: the loaded extension must be a static development-mode build.
  let manifestRaw: string;
  try {
    manifestRaw = readFileSync(DEV_MANIFEST, "utf8");
  } catch {
    throw new Error(
      `Dev manifest not found at ${DEV_MANIFEST}. Run \`npm run e2e:build\` first.`,
    );
  }
  assertDevManifest(JSON.parse(manifestRaw));

  // 2) Start mock servers on ephemeral ports.
  servers = await startMockServers();

  // 3) Hand the ports off to the fixtures via env vars.
  process.env.SAYPI_E2E_PI_PORT = String(servers.piPort);
  process.env.SAYPI_E2E_API_PORT = String(servers.apiPort);

  // 4) Stash the close handle so global-teardown can find it even if this module
  //    is re-imported in a fresh context (Playwright runs setup/teardown in the
  //    same process, but be defensive about module-instance identity).
  (globalThis as Record<string, unknown>).__SAYPI_E2E_SERVERS__ = servers;
}

/**
 * Playwright global teardown. Closes the mock servers started in globalSetup.
 * Configured via `globalTeardown` in playwright.config (Task 6).
 */
export async function globalTeardown(): Promise<void> {
  const stashed =
    servers ??
    ((globalThis as Record<string, unknown>).__SAYPI_E2E_SERVERS__ as
      | MockServers
      | undefined);
  if (stashed) {
    await stashed.close();
  }
}
