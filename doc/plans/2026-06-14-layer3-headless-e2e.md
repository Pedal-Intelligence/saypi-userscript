# Headless E2E harness (Layer 3) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A Playwright-driven headless-Chrome harness that loads the built (development-mode) extension against a local mock Pi page + local mock saypi-api, and asserts SayPi decorates the page (slice a) and that a fake-audio mic → real offscreen WASM-VAD → mock STT lands a transcript in the prompt (slice b), wired into CI as an advisory job.

**Architecture:** A new top-level `e2e/` tree (Playwright, specs named `*.e2e.ts`), separate from `test/` (Jest/Vitest). Pure helpers (`manifest-guard`, `launch-args`, `transcribe-response`) are unit-tested in Vitest under `test/e2e/` so they run in the existing required gate; the Playwright specs run in a new advisory workflow. The extension is built with `wxt build -b chrome -m development` (never `.env.production`); real saypi hostnames are redirected to local mock HTTPS servers via Chrome `--host-resolver-rules` + `--ignore-certificate-errors`, so no manifest/permission change is needed.

**Tech Stack:** WXT 0.20.11, Chrome MV3, `@playwright/test`, `selfsigned` (runtime cert), Node 22, Vitest (existing), `@ricky0123/vad-web` Silero-v5 (real), Chromium fake-audio flags.

**Spec:** `doc/specs/2026-06-14-layer3-headless-e2e-design.md` — read the "eight load-bearing facts" section; every task below depends on them.

**Conventions for every task:** Work in this worktree. Before any `git commit`, run the location gate in the same shell:
`[ "$(git rev-parse --abbrev-ref HEAD)" = "feat/layer3-e2e-harness" ] || exit 1`
Never edit generated artifacts (`.output/`, `.wxt/`, `public/` build output). Never load `.env.production`. Keep the `test` npm aggregate unchanged.

---

### Task 1: Vitest exclude for `e2e/**` + pure manifest-shape guard

**Files:**
- Modify: `vitest.config.js`
- Create: `e2e/support/manifest-guard.ts`
- Test: `test/e2e/manifest-guard.spec.ts`

- [ ] **Step 1: Exclude `e2e/**` from Vitest** so Playwright `*.e2e.ts` files (and harness sources) are never collected as Vitest tests. Edit `vitest.config.js`:

```js
import { fileURLToPath } from "node:url";
import { defineConfig, configDefaults } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("./src", import.meta.url)),
      "~/": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    include: ["**/*.spec.ts"],
    exclude: [...configDefaults.exclude, "e2e/**"],
    globals: true,
    setupFiles: ["test/vitest.setup.js"],
  },
  testTimeout: 10000,
});
```

- [ ] **Step 2: Write the failing test** `test/e2e/manifest-guard.spec.ts`:

```ts
import { describe, it, expect } from "vitest";
import { assertDevManifest } from "../../e2e/support/manifest-guard";

const goodManifest = {
  manifest_version: 3,
  content_security_policy: { extension_pages: "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'" },
  content_scripts: [
    { js: ["content-scripts/saypi-universal.js"], matches: ["http://*/*", "https://*/*"] },
    { js: ["content-scripts/saypi.js"], matches: ["https://pi.ai/*", "https://claude.ai/*"] },
  ],
};

describe("assertDevManifest", () => {
  it("accepts a valid development build manifest", () => {
    expect(() => assertDevManifest(goodManifest)).not.toThrow();
  });

  it("rejects a manifest with no content_scripts (dev-server output)", () => {
    expect(() => assertDevManifest({ ...goodManifest, content_scripts: undefined }))
      .toThrow(/content_scripts/i);
  });

  it("rejects when no content script matches pi.ai", () => {
    const m = { ...goodManifest, content_scripts: [{ js: ["x.js"], matches: ["https://claude.ai/*"] }] };
    expect(() => assertDevManifest(m)).toThrow(/pi\.ai/i);
  });

  it("rejects a dev-server CSP containing localhost:3001", () => {
    const m = { ...goodManifest, content_security_policy: { extension_pages: "script-src 'self' http://localhost:3001" } };
    expect(() => assertDevManifest(m)).toThrow(/localhost:3001/i);
  });

  it("rejects a CSP missing wasm-unsafe-eval", () => {
    const m = { ...goodManifest, content_security_policy: { extension_pages: "script-src 'self'; object-src 'self'" } };
    expect(() => assertDevManifest(m)).toThrow(/wasm-unsafe-eval/i);
  });
});
```

- [ ] **Step 3: Run, watch it fail** — `npx vitest run test/e2e/manifest-guard.spec.ts` → FAIL (module not found / assertDevManifest undefined).

- [ ] **Step 4: Implement** `e2e/support/manifest-guard.ts`:

```ts
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
```

- [ ] **Step 5: Run to verify pass** — `npx vitest run test/e2e/manifest-guard.spec.ts` → PASS. Then `npm test` → still green (e2e/** excluded, new spec passes).

- [ ] **Step 6: Commit**

```bash
[ "$(git rev-parse --abbrev-ref HEAD)" = "feat/layer3-e2e-harness" ] || exit 1
git add vitest.config.js e2e/support/manifest-guard.ts test/e2e/manifest-guard.spec.ts
git commit -m "test(e2e): add manifest-shape guard for Layer 3 build verification"
```

---

### Task 2: Pure launch-args builder

**Files:**
- Create: `e2e/fixtures/launch-args.ts`
- Test: `test/e2e/launch-args.spec.ts`

- [ ] **Step 1: Write the failing test** `test/e2e/launch-args.spec.ts`:

```ts
import { describe, it, expect } from "vitest";
import { buildLaunchArgs } from "../../e2e/fixtures/launch-args";

describe("buildLaunchArgs", () => {
  const args = buildLaunchArgs({
    extensionDir: "/abs/.output/chrome-mv3-dev",
    piPort: 8443,
    apiPort: 8443,
    wavPath: "/abs/speech.wav",
  });

  it("loads exactly the one unpacked extension", () => {
    expect(args).toContain("--disable-extensions-except=/abs/.output/chrome-mv3-dev");
    expect(args).toContain("--load-extension=/abs/.output/chrome-mv3-dev");
  });

  it("redirects pi.ai and the saypi api/auth hosts to local mocks", () => {
    const rule = args.find((a) => a.startsWith("--host-resolver-rules="));
    expect(rule).toBeTruthy();
    expect(rule).toContain("MAP pi.ai 127.0.0.1:8443");
    expect(rule).toContain("MAP api.saypi.ai 127.0.0.1:8443");
    expect(rule).toContain("MAP www.saypi.ai 127.0.0.1:8443");
    expect(rule).toContain("EXCLUDE localhost");
  });

  it("bypasses cert validation (SNI stays the real host)", () => {
    expect(args).toContain("--ignore-certificate-errors");
  });

  it("feeds the fake mic from the given wav", () => {
    expect(args).toContain("--use-fake-device-for-media-stream");
    expect(args).toContain("--use-fake-ui-for-media-stream");
    expect(args).toContain("--use-file-for-fake-audio-capture=/abs/speech.wav");
  });

  it("uses the new headless mode", () => {
    expect(args).toContain("--headless=new");
  });
});
```

- [ ] **Step 2: Run, watch it fail** — `npx vitest run test/e2e/launch-args.spec.ts` → FAIL.

- [ ] **Step 3: Implement** `e2e/fixtures/launch-args.ts`:

```ts
export interface LaunchArgsOptions {
  extensionDir: string;
  piPort: number;
  apiPort: number;
  wavPath: string;
}

/** Build the Chrome launch args for the Layer 3 harness. See spec facts #5-#8. */
export function buildLaunchArgs(o: LaunchArgsOptions): string[] {
  const hostRules = [
    `MAP pi.ai 127.0.0.1:${o.piPort}`,
    `MAP api.saypi.ai 127.0.0.1:${o.apiPort}`,
    `MAP www.saypi.ai 127.0.0.1:${o.apiPort}`,
    `MAP app.saypi.ai 127.0.0.1:${o.apiPort}`,
    `EXCLUDE localhost`,
  ].join(",");
  return [
    `--disable-extensions-except=${o.extensionDir}`,
    `--load-extension=${o.extensionDir}`,
    `--host-resolver-rules=${hostRules}`,
    "--ignore-certificate-errors",
    "--allow-insecure-localhost",
    "--use-fake-device-for-media-stream",
    "--use-fake-ui-for-media-stream",
    `--use-file-for-fake-audio-capture=${o.wavPath}`,
    "--headless=new",
    "--no-sandbox",
    "--autoplay-policy=no-user-gesture-required",
  ];
}
```

- [ ] **Step 4: Run to verify pass** — `npx vitest run test/e2e/launch-args.spec.ts` → PASS.

- [ ] **Step 5: Commit**

```bash
[ "$(git rev-parse --abbrev-ref HEAD)" = "feat/layer3-e2e-harness" ] || exit 1
git add e2e/fixtures/launch-args.ts test/e2e/launch-args.spec.ts
git commit -m "test(e2e): add Chrome launch-args builder for Layer 3 harness"
```

---

### Task 3: Pure STT transcribe-response shaper

**Files:**
- Create: `e2e/support/transcribe-response.ts`
- Test: `test/e2e/transcribe-response.spec.ts`

- [ ] **Step 1: Write the failing test** `test/e2e/transcribe-response.spec.ts`:

```ts
import { describe, it, expect } from "vitest";
import { buildTranscribeResponse, DEFAULT_TRANSCRIPT } from "../../e2e/support/transcribe-response";

describe("buildTranscribeResponse", () => {
  it("echoes the request sequenceNumber and returns the default transcript", () => {
    expect(buildTranscribeResponse({ sequenceNumber: 7 })).toEqual({
      text: DEFAULT_TRANSCRIPT,
      sequenceNumber: 7,
    });
  });

  it("allows overriding the transcript text", () => {
    expect(buildTranscribeResponse({ sequenceNumber: 1, text: "custom" })).toEqual({
      text: "custom",
      sequenceNumber: 1,
    });
  });

  it("defaults sequenceNumber to 1 when absent", () => {
    expect(buildTranscribeResponse({}).sequenceNumber).toBe(1);
  });

  it("never returns empty text (would trigger transcribedEmpty)", () => {
    expect(buildTranscribeResponse({ text: "" }).text.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run, watch it fail** — `npx vitest run test/e2e/transcribe-response.spec.ts` → FAIL.

- [ ] **Step 3: Implement** `e2e/support/transcribe-response.ts`:

```ts
export const DEFAULT_TRANSCRIPT = "hello world this is a test";

export interface TranscribeRequestInfo {
  sequenceNumber?: number;
  text?: string;
}

/**
 * Minimal valid /transcribe response the client parses (TranscriptionModule).
 * `text` must be non-empty; `sequenceNumber` should echo the request's value.
 */
export function buildTranscribeResponse(req: TranscribeRequestInfo): {
  text: string;
  sequenceNumber: number;
} {
  const text = req.text && req.text.length > 0 ? req.text : DEFAULT_TRANSCRIPT;
  return { text, sequenceNumber: req.sequenceNumber ?? 1 };
}
```

- [ ] **Step 4: Run to verify pass** — `npx vitest run test/e2e/transcribe-response.spec.ts` → PASS.

- [ ] **Step 5: Commit**

```bash
[ "$(git rev-parse --abbrev-ref HEAD)" = "feat/layer3-e2e-harness" ] || exit 1
git add e2e/support/transcribe-response.ts test/e2e/transcribe-response.spec.ts
git commit -m "test(e2e): add mock STT /transcribe response shaper"
```

---

### Task 4: `e2e:build` tooling + local build verification

**Files:**
- Create: `scripts/e2e-build.mjs`
- Modify: `package.json` (scripts)

This validates spec facts #1–#4 against the real toolchain locally.

- [ ] **Step 1: Implement** `scripts/e2e-build.mjs` — writes a gitignored `.env.development.local` with the three public URLs (so `import.meta.env.VITE_*_SERVER_URL` are baked, pointing at the real saypi hosts that host-resolver later redirects), runs `copy-onnx` then `wxt build -b chrome -m development`, and runs the manifest guard:

```js
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
const envFile = resolve(root, ".env.development.local");
const desired = [
  "VITE_APP_SERVER_URL=https://app.saypi.ai",
  "VITE_API_SERVER_URL=https://api.saypi.ai",
  "VITE_AUTH_SERVER_URL=https://www.saypi.ai",
  "VITE_DEBUG_LOGS=true",
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
```

> Note: importing a `.ts` from an `.mjs` requires Node's type-stripping (Node 22.6+ `--experimental-strip-types`) or a tiny inline reimplementation. If the import fails under the repo's Node, inline the guard checks in this script OR run it via `npx tsx`. The implementer picks whichever works in this repo's Node 22 and documents it. Prefer `node --experimental-strip-types scripts/e2e-build.mjs` if needed.

- [ ] **Step 2: Add npm scripts** to `package.json` (do NOT modify the `test` aggregate):

```json
"e2e:build": "node --experimental-strip-types scripts/e2e-build.mjs",
"test:e2e": "playwright test --config e2e/playwright.config.ts"
```

- [ ] **Step 3: Run and verify** — `npm run e2e:build`. Expected: copy-onnx runs, wxt build succeeds (~5s), prints `[e2e-build] OK`. Confirm `.output/chrome-mv3-dev/manifest.json` exists with `content_scripts` matching `pi.ai` and CSP `wasm-unsafe-eval`. Confirm `.env.development.local` contains ONLY public URLs (no secrets). Confirm `git status` does not show `.env.development.local` (gitignored) or `.output/` (gitignored).

- [ ] **Step 4: Commit** (only the script + package.json; the build output and env file are gitignored):

```bash
[ "$(git rev-parse --abbrev-ref HEAD)" = "feat/layer3-e2e-harness" ] || exit 1
git add scripts/e2e-build.mjs package.json
git commit -m "build(e2e): add e2e:build (dev-mode static build + manifest guard)"
```

---

### Task 5: Mock HTTPS servers (Pi page + saypi-api) and global setup

**Files:**
- Create: `e2e/support/mock-pi-page.html`
- Create: `e2e/support/mock-servers.ts`
- Create: `e2e/support/global-setup.ts`
- Create: `e2e/support/check-servers.mjs` (local smoke check)
- Modify: `package.json` (add `selfsigned` devDep)

- [ ] **Step 1: Add `selfsigned`** — `npm install -D selfsigned` (pure-JS self-signed cert; no openssl dependency).

- [ ] **Step 2: Create the mock Pi page** `e2e/support/mock-pi-page.html`. The prompt subtree is mounted POST-load as a nested descendant so the content-script MutationObserver fires (spec fact #8):

```html
<!doctype html>
<html>
  <head><meta charset="utf-8" /><title>Pi mock</title></head>
  <body>
    <main id="__next"><div id="mock-mount"></div></main>
    <script>
      // Mount AFTER load so the already-attached MutationObserver sees an added node
      // whose DESCENDANT matches Pi's prompt selector (querySelector excludes the node itself).
      // Nesting: controls (=> #saypi-prompt-controls-container)
      //            > container (=> .saypi-prompt-container)
      //              > textarea (=> #saypi-prompt)
      window.addEventListener("load", function () {
        setTimeout(function () {
          var mount = document.getElementById("mock-mount");
          var controls = document.createElement("div");
          var container = document.createElement("div");
          var ta = document.createElement("textarea");
          ta.setAttribute("placeholder", "What's on your mind?");
          ta.setAttribute("enterkeyhint", "enter");
          container.appendChild(ta);
          controls.appendChild(container);
          mount.appendChild(controls);
        }, 300);
      });
    </script>
  </body>
</html>
```

- [ ] **Step 3: Create the mock servers** `e2e/support/mock-servers.ts` — two HTTPS servers sharing one self-signed cert. The Pi server serves the mock page for any path; the api server parses multipart `/transcribe` and replies via `buildTranscribeResponse`, recording that it was hit (the intermediate localizer). Use only Node built-ins + `selfsigned` (no busboy needed — we just need to read the `sequenceNumber` field; a tolerant multipart scan suffices, or accept any body and echo sequenceNumber=1):

```ts
import https from "node:https";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import selfsigned from "selfsigned";
import { buildTranscribeResponse } from "./transcribe-response";

const pems = selfsigned.generate([{ name: "commonName", value: "saypi-e2e" }], { days: 1 });
const tls = { key: pems.private, cert: pems.cert };
const PAGE = readFileSync(resolve(import.meta.dirname, "mock-pi-page.html"), "utf8");

export interface MockServers {
  piPort: number;
  apiPort: number;
  transcribeHits: () => number;
  close: () => Promise<void>;
}

function extractSequenceNumber(body: Buffer): number {
  // tolerant scan of the multipart form for the sequenceNumber field
  const m = body.toString("latin1").match(/name="sequenceNumber"\r?\n\r?\n(\d+)/);
  return m ? Number(m[1]) : 1;
}

export async function startMockServers(): Promise<MockServers> {
  let hits = 0;

  const piServer = https.createServer(tls, (_req, res) => {
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end(PAGE);
  });

  const apiServer = https.createServer(tls, (req, res) => {
    if (req.method === "POST" && req.url && req.url.startsWith("/transcribe")) {
      const chunks: Buffer[] = [];
      req.on("data", (c) => chunks.push(c));
      req.on("end", () => {
        hits++;
        const seq = extractSequenceNumber(Buffer.concat(chunks));
        const payload = JSON.stringify(buildTranscribeResponse({ sequenceNumber: seq }));
        res.writeHead(200, {
          "content-type": "application/json",
          "access-control-allow-origin": "*",
          "access-control-allow-credentials": "true",
        });
        res.end(payload);
      });
      return;
    }
    if (req.method === "POST" && req.url && req.url.startsWith("/merge")) {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify({ combined_transcript: "" }));
      return;
    }
    res.writeHead(404).end();
  });

  await new Promise<void>((r) => piServer.listen(0, "127.0.0.1", r));
  await new Promise<void>((r) => apiServer.listen(0, "127.0.0.1", r));

  return {
    piPort: (piServer.address() as import("node:net").AddressInfo).port,
    apiPort: (apiServer.address() as import("node:net").AddressInfo).port,
    transcribeHits: () => hits,
    close: async () => {
      await new Promise((r) => piServer.close(() => r(null)));
      await new Promise((r) => apiServer.close(() => r(null)));
    },
  };
}
```

> Port choice: bind to ephemeral port `0` then read the assigned port. BUT `--host-resolver-rules` must point at fixed ports decided before launch. Resolution: start the servers in global-setup FIRST, read their ports, then pass them through to the launch args (Task 6 reads ports from a setup-shared module or env var). The implementer wires global-setup → fixture port handoff (e.g. via `process.env.SAYPI_E2E_PI_PORT` / `SAYPI_E2E_API_PORT`, or a written JSON file in a tmp dir). Pick one and keep it simple.

- [ ] **Step 4: Create** `e2e/support/global-setup.ts` — Playwright global setup that runs the build guard (re-reads `.output/chrome-mv3-dev/manifest.json` and calls `assertDevManifest`), starts the mock servers, and exports their ports to the fixtures (via env vars). Provide a matching global-teardown that closes them.

- [ ] **Step 5: Local smoke check** `e2e/support/check-servers.mjs` — starts the servers, `fetch`es `https://127.0.0.1:<piPort>/talk` (with `NODE_TLS_REJECT_UNAUTHORIZED=0`) and asserts the HTML contains `mock-mount`; POSTs a tiny multipart to `/transcribe` and asserts the JSON has `text` + `sequenceNumber`; closes. Run it: `node e2e/support/check-servers.mjs` → prints OK.

- [ ] **Step 6: Run & commit**

```bash
node e2e/support/check-servers.mjs   # expect: servers OK
[ "$(git rev-parse --abbrev-ref HEAD)" = "feat/layer3-e2e-harness" ] || exit 1
git add e2e/support/mock-pi-page.html e2e/support/mock-servers.ts e2e/support/global-setup.ts e2e/support/check-servers.mjs package.json package-lock.json
git commit -m "test(e2e): add mock Pi page + mock saypi-api HTTPS servers"
```

---

### Task 6: Playwright skeleton + decoration smoke test (slice a) — THE WALKING SKELETON

**Files:**
- Create: `e2e/playwright.config.ts`
- Create: `e2e/fixtures/extension.ts`
- Create: `e2e/specs/decoration.e2e.ts`
- Modify: `package.json` (add `@playwright/test` devDep)

- [ ] **Step 1: Add Playwright** — `npm install -D @playwright/test` then `npx playwright install chromium` (local).

- [ ] **Step 2: Create** `e2e/playwright.config.ts`:

```ts
import { defineConfig } from "@playwright/test";
import { resolve } from "node:path";

export default defineConfig({
  testDir: resolve(import.meta.dirname, "specs"),
  testMatch: "**/*.e2e.ts",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 2 : 0,
  timeout: 60_000,
  globalSetup: resolve(import.meta.dirname, "support/global-setup.ts"),
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: { trace: "on-first-retry" },
});
```

- [ ] **Step 3: Create** `e2e/fixtures/extension.ts` — the persistent-context fixture using `buildLaunchArgs` and the ports from global-setup; resolves `extensionId` and `serviceWorker` from the SW:

```ts
import { test as base, chromium, type BrowserContext, type Worker } from "@playwright/test";
import { resolve } from "node:path";
import { buildLaunchArgs } from "./launch-args";

const EXT_DIR = resolve(import.meta.dirname, "../../.output/chrome-mv3-dev");
const WAV = resolve(import.meta.dirname, "audio/speech-16k-mono.wav");

export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
  serviceWorker: Worker;
}>({
  context: async ({}, use) => {
    const piPort = Number(process.env.SAYPI_E2E_PI_PORT);
    const apiPort = Number(process.env.SAYPI_E2E_API_PORT);
    const context = await chromium.launchPersistentContext("", {
      channel: "chromium",
      args: buildLaunchArgs({ extensionDir: EXT_DIR, piPort, apiPort, wavPath: WAV }),
      ignoreHTTPSErrors: true,
    });
    await use(context);
    await context.close();
  },
  serviceWorker: async ({ context }, use) => {
    let [sw] = context.serviceWorkers();
    if (!sw) sw = await context.waitForEvent("serviceworker");
    await use(sw);
  },
  extensionId: async ({ serviceWorker }, use) => {
    await use(serviceWorker.url().split("/")[2]);
  },
});
export const expect = test.expect;
```

- [ ] **Step 4: Write the decoration spec** `e2e/specs/decoration.e2e.ts`:

```ts
import { test, expect } from "../fixtures/extension";

test("SayPi detects Pi and decorates the mock page", async ({ context, extensionId }) => {
  expect(extensionId).toMatch(/^[a-p]{32}$/);
  const page = await context.newPage();
  await page.goto("https://pi.ai/talk", { waitUntil: "domcontentloaded" });

  // Primary proof: SayPi injected its call button into the decorated controls container.
  await page.waitForSelector("#saypi-callButton", { timeout: 20_000 });
  await expect(page.locator("#saypi-prompt")).toHaveCount(1);
  await expect(page.locator(".saypi-prompt-container")).toHaveCount(1);
  await expect(page.locator("#saypi-prompt-controls-container")).toHaveCount(1);
  await page.waitForFunction(() => document.body.classList.contains("pi"));
});
```

- [ ] **Step 5: Run** — `npm run e2e:build && npm run test:e2e`. Expected: decoration spec PASSES (extension loads headless, pi.ai resolves to the mock, SayPi decorates). If `#saypi-callButton` never appears, debug the mount-timing (try injecting the subtree via `page.evaluate` after navigation per spec fact #8) before proceeding. **Do not start Task 8 until this is reliably green.**

- [ ] **Step 6: Commit**

```bash
[ "$(git rev-parse --abbrev-ref HEAD)" = "feat/layer3-e2e-harness" ] || exit 1
git add e2e/playwright.config.ts e2e/fixtures/extension.ts e2e/specs/decoration.e2e.ts package.json package-lock.json
git commit -m "test(e2e): Playwright skeleton + Pi decoration smoke test (slice a)"
```

---

### Task 7: Fake-audio speech fixture

**Files:**
- Create: `e2e/fixtures/audio/speech-16k-mono.wav`
- Create: `e2e/fixtures/audio/README.md`

- [ ] **Step 1: Generate** the deterministic, license-clean speech clip (macOS `say` + `ffmpeg`; both verified present on this host):

```bash
say -v Samantha -o /tmp/saypi-speech.aiff "Hello SayPi, this is a test of voice activity detection."
ffmpeg -hide_banner -loglevel error -y -i /tmp/saypi-speech.aiff \
  -ac 1 -ar 16000 -c:a pcm_s16le -af "apad=pad_dur=0.5" \
  -map_metadata -1 -flags +bitexact -fflags +bitexact \
  e2e/fixtures/audio/speech-16k-mono.wav
rm /tmp/saypi-speech.aiff
```

- [ ] **Step 2: Verify the fixture**:

```bash
ffprobe -hide_banner e2e/fixtures/audio/speech-16k-mono.wav   # expect: pcm_s16le, 16000 Hz, 1 channels, s16
file e2e/fixtures/audio/speech-16k-mono.wav                    # expect: RIFF ... WAVE audio, Microsoft PCM, 16 bit, mono 16000 Hz
ls -l e2e/fixtures/audio/speech-16k-mono.wav                   # expect: < 200 KB
```

- [ ] **Step 3: Write** `e2e/fixtures/audio/README.md` documenting: the spec (RIFF/WAVE, 16-bit PCM, mono, 16 kHz, ~3s speech + 0.5s trailing silence), provenance (self-generated via macOS `say -v Samantha`, license-clean), the exact regeneration command above, and why a real speech clip (not a tone) is required (Silero-v5 speech model).

- [ ] **Step 4: Commit**

```bash
[ "$(git rev-parse --abbrev-ref HEAD)" = "feat/layer3-e2e-harness" ] || exit 1
git add e2e/fixtures/audio/speech-16k-mono.wav e2e/fixtures/audio/README.md
git commit -m "test(e2e): add fake-mic speech fixture for VAD path"
```

---

### Task 8: STT end-to-end spec (slice b)

**Files:**
- Create: `e2e/specs/dictation-stt.e2e.ts`
- (Possibly modify) `e2e/fixtures/extension.ts` if a storage-seed helper is needed.

- [ ] **Step 1: Verify the autoSubmit storage key** — read `src/prefs/PreferenceModule.ts` to confirm the exact `chrome.storage.local` key for the autoSubmit preference (the spec assumes `autoSubmit`; confirm the literal key and any namespacing). Use the verified key in Step 2.

- [ ] **Step 2: Write the STT spec** `e2e/specs/dictation-stt.e2e.ts`. Seed `autoSubmit=false` in extension storage via the service worker BEFORE navigating, navigate, wait for decoration (the prerequisite), let the fake audio drive VAD → STT, then assert the transcript landed in `#saypi-prompt.value` and that the mock `/transcribe` was hit:

```ts
import { test, expect } from "../fixtures/extension";
import { DEFAULT_TRANSCRIPT } from "../support/transcribe-response";

test("fake audio -> VAD -> mock STT -> transcript in prompt", async ({ context, serviceWorker }) => {
  // Seed autoSubmit=false so the draft is typed into #saypi-prompt.value and persists.
  // (Confirm the exact key from PreferenceModule in Step 1.)
  await serviceWorker.evaluate(async () => {
    await chrome.storage.local.set({ autoSubmit: false });
  });

  const page = await context.newPage();
  await page.goto("https://pi.ai/talk", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("#saypi-callButton", { timeout: 20_000 }); // decoration prerequisite

  // The fake mic loops the speech clip; the offscreen Silero-v5 model should fire onSpeechEnd,
  // the SW posts to the mock /transcribe, and the transcript is typed into the prompt.
  await page.waitForFunction(
    (expected) => document.getElementById("saypi-prompt")?.value?.includes(expected),
    DEFAULT_TRANSCRIPT,
    { timeout: 30_000 },
  );

  const value = await page.locator("#saypi-prompt").inputValue();
  expect(value).toContain(DEFAULT_TRANSCRIPT);
});
```

- [ ] **Step 3: Run** — `npm run e2e:build && npm run test:e2e`. Expected: both specs pass locally. **If the STT spec fails** because the fake audio doesn't trigger VAD headless on this host, capture diagnostics: (a) does the mock report a `/transcribe` hit? If not, VAD never fired (investigate fake-audio reaching offscreen / Silero threshold — try a louder/longer clip); if yes but no transcript, the plumbing broke (investigate autoSubmit key / prompt insertion). Report honestly which sub-step fails; the headless-Linux fake-audio path is the known top CI-only risk (spec risks table) and may only pass on the CI runner.

- [ ] **Step 4: Commit**

```bash
[ "$(git rev-parse --abbrev-ref HEAD)" = "feat/layer3-e2e-harness" ] || exit 1
git add e2e/specs/dictation-stt.e2e.ts e2e/fixtures/extension.ts
git commit -m "test(e2e): fake-audio VAD -> mock STT -> transcript spec (slice b)"
```

---

### Task 9: Advisory CI workflow + harness README

**Files:**
- Create: `.github/workflows/e2e.yaml`
- Create: `e2e/README.md`

- [ ] **Step 1: Create the advisory workflow** `.github/workflows/e2e.yaml` — separate from `test.yaml`, NOT a required check. Runs on PR + push to main; Ubuntu; Node 22; install; `npx playwright install --with-deps chromium`; `npm run e2e:build`; `npm run test:e2e`. Upload the Playwright report/trace as an artifact on failure. Keep it clearly advisory (a comment header noting it is non-blocking until promoted by founder sign-off):

```yaml
name: e2e (advisory)
on:
  pull_request:
    branches: [main]
  push:
    branches: [main]
# ADVISORY: not a required merge check. Promotion to required is a founder-signed gate change.
jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22.x
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run e2e:build
      - run: npm run test:e2e
        env:
          CI: "true"
      - if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: |
            test-results/
            playwright-report/
          retention-days: 7
```

> The implementer verifies `npm ci` works in CI (the repo's `test.yaml` uses `npm install` with retry logic — mirror whatever that workflow does for install reliability if `npm ci` is flaky). Do NOT add this job to the required checks or to the `test` aggregate.

- [ ] **Step 2: Write** `e2e/README.md` — how to run locally (`npm run e2e:build && npm run test:e2e`), the architecture (build → host-resolver redirect → mock servers → fake audio), the dual-env gotcha (shell vars reach `host_permissions`, `.env` files reach `import.meta.env`), how to refresh the WAV fixture and the STT contract, the local-vs-CI risk split, and that the job is advisory.

- [ ] **Step 3: Validate the workflow YAML** locally (e.g. `npx --yes @action-validator/cli .github/workflows/e2e.yaml` if available, or careful manual review) and confirm `npm test` is still green and unchanged.

- [ ] **Step 4: Commit**

```bash
[ "$(git rev-parse --abbrev-ref HEAD)" = "feat/layer3-e2e-harness" ] || exit 1
git add .github/workflows/e2e.yaml e2e/README.md
git commit -m "ci(e2e): add advisory Layer 3 headless E2E workflow + README"
```

---

### Task 10: Mark Layer 3 shipped in agent docs

**Files:**
- Modify: `AGENTS.md` (Testability Investment paragraph + Assistant/Agent Docs list)
- Modify: `doc/autonomous-bootstrap.md` (layer 3 item)

- [ ] **Step 1: Update `AGENTS.md`** — in the Testability Investment paragraph, mark layer 3 as built (this PR) with a pointer to `e2e/README.md` and the spec; add `e2e/README.md` to the Assistant/Agent Docs list. Keep the existing layer 4 wording.

- [ ] **Step 2: Update `doc/autonomous-bootstrap.md`** — annotate the layer-3 bullet in "The testability-investment plan" as SHIPPED (this PR) with the runbook pointer, mirroring how layer 4 is annotated.

- [ ] **Step 3: Commit**

```bash
[ "$(git rev-parse --abbrev-ref HEAD)" = "feat/layer3-e2e-harness" ] || exit 1
git add AGENTS.md doc/autonomous-bootstrap.md
git commit -m "docs: mark Layer 3 headless E2E harness as shipped"
```

---

## Self-review notes (author)

- **Spec coverage:** every spec deliverable maps to a task — manifest-guard (T1), launch-args (T2), transcribe-response (T3), e2e:build (T4), mock servers + page + global-setup (T5), Playwright skeleton + decoration (T6), WAV fixture (T7), STT spec (T8), advisory CI + README (T9), docs (T10).
- **Required-gate safety:** the `test` aggregate is never modified; pure helpers add Vitest coverage that runs in the existing gate; e2e is a separate advisory job.
- **Production boundary:** T4 hard-codes `-m development` + guard; only public URLs written to a gitignored env file; no manifest/permission change anywhere.
- **Type consistency:** `buildLaunchArgs`, `assertDevManifest`, `buildTranscribeResponse`/`DEFAULT_TRANSCRIPT` names are used identically across tasks and tests.
- **Known CI-only risk:** headless-Linux fake-audio (T8) may only validate on the CI runner; reported honestly, mitigated by the advisory posture.
