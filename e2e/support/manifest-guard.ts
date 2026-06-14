/**
 * Fail-fast guard that the loaded extension is a STATIC development-mode build,
 * not a `wxt dev` server output (no static content_scripts, localhost:3001 CSP)
 * and not a production build. See spec "eight load-bearing facts" #1-#4.
 */
export interface ChromeManifest {
  manifest_version?: number;
  content_security_policy?: { extension_pages?: string };
  content_scripts?: Array<{ js?: string[]; matches?: string[] }>;
}

export function assertDevManifest(manifest: unknown): void {
  const m = manifest as ChromeManifest;
  const scripts = m?.content_scripts;
  if (!Array.isArray(scripts) || scripts.length === 0) {
    throw new Error(
      "Manifest has no static content_scripts — this looks like a `wxt dev` server build. " +
        "Run `npm run e2e:build` (wxt build -m development) and load .output/chrome-mv3-dev.",
    );
  }
  const matchesPi = scripts.some((s) => (s.matches ?? []).some((p) => p.includes("pi.ai")));
  if (!matchesPi) {
    throw new Error("No content script matches https://pi.ai/* — wrong build or wxt.config drift.");
  }
  const csp = m?.content_security_policy?.extension_pages ?? "";
  if (csp.includes("localhost:3001")) {
    throw new Error("CSP contains localhost:3001 — this is a `wxt dev` server build, not a static build.");
  }
  if (!csp.includes("wasm-unsafe-eval")) {
    throw new Error("CSP missing 'wasm-unsafe-eval' — WASM VAD will not load.");
  }
}
