# Autonomous real-site dev-verify loop (Layer 4) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the build → load → reload cycle so the agent can verify extension changes against real chat hosts (pi.ai/Claude/ChatGPT) with no per-iteration founder involvement.

**Architecture:** WXT already bakes a `ws://localhost:<port>` reload client into the dev build, so a manually-loaded unpacked extension hot-reloads on every rebuild. We own a single `wxt dev` server pinned to port 3001 (matching the already-loaded extension, so no re-load needed), launched by an idempotent `scripts/dev-rig.mjs` run as a background task. Freshness is detected by polling `.output/chrome-mv3-dev` mtime; verification reuses a buffered-`MutationObserver` probe injected via the Claude-in-Chrome MCP. A re-runnable DOM recorder captures real-host DOM as dated fixtures for downstream layers.

**Tech Stack:** WXT 0.20.11, Node ESM (`.mjs`) scripts, Vitest (jsdom) for unit tests, Claude-in-Chrome MCP for verification.

**Spec:** `doc/specs/2026-06-13-autonomous-dev-loop-layer4-design.md`

---

## File Structure

- `scripts/dev-rig-lib.mjs` *(create)* — pure, side-effect-free helpers (`parseEnvVars`, `parseEnvMode`, `parseWxtPids`). Unit-tested.
- `scripts/dev-rig.mjs` *(create)* — imperative orchestrator: ensure remote `.env`, run predev (validate-env + copy-onnx), clear stray `wxt dev`, wait for the port, spawn one pinned server with auto-launch disabled. Verified by the live demo.
- `scripts/dom-capture/recorder.js` *(create)* — self-contained, injectable host-DOM recorder (resting snapshot + live mutation stream). Unit-tested in jsdom.
- `wxt.config.ts` *(modify)* — add env-gated top-level `server` (port/strictPort/origin) and `webExt.disabled`; remove the dead port block from the `vite:devServer:extendConfig` hook.
- `doc/autonomous-dev-loop.md` *(create)* — the runbook (setup, loop, probe, staged-identity check, DOM capture, boundaries, troubleshooting).
- `test/scripts/dev-rig-lib.spec.ts` *(create)* — Vitest unit tests for the pure helpers.
- `test/scripts/dom-capture-recorder.spec.ts` *(create)* — Vitest jsdom test exercising the real `recorder.js` artifact.
- `test/fixtures/host-dom/README.md` *(create)* — fixtures convention (dated, host-tagged, refreshable; "DOM is not a contract").

**Branch:** `feat/autonomous-dev-loop-layer4` (already created; the spec is committed there).

**Location gate:** every commit runs `[ "$(git rev-parse --abbrev-ref HEAD)" = "feat/autonomous-dev-loop-layer4" ] || exit 1` in the same shell invocation.

---

## Task 1: Pure launcher helpers

**Files:**
- Create: `scripts/dev-rig-lib.mjs`
- Test: `test/scripts/dev-rig-lib.spec.ts`

- [ ] **Step 1: Write the failing tests**

Create `test/scripts/dev-rig-lib.spec.ts`:

```ts
import { describe, it, expect } from "vitest";
import { parseEnvVars, parseEnvMode, parseWxtPids } from "../../scripts/dev-rig-lib.mjs";

describe("parseEnvVars", () => {
  it("ignores comments and trims inline comments", () => {
    const content = [
      "# a comment",
      "VITE_API_SERVER_URL=https://api.saypi.ai  # inline",
      "",
      "EMPTY=",
    ].join("\n");
    expect(parseEnvVars(content)).toEqual({
      VITE_API_SERVER_URL: "https://api.saypi.ai",
      EMPTY: "",
    });
  });
});

describe("parseEnvMode", () => {
  it("detects remote when the three server URLs match the remote preset", () => {
    const content = [
      "VITE_API_SERVER_URL=https://api.saypi.ai",
      "VITE_AUTH_SERVER_URL=https://www.saypi.ai",
      "VITE_APP_SERVER_URL=https://app.saypi.ai",
    ].join("\n");
    expect(parseEnvMode(content)).toBe("remote");
  });

  it("detects local", () => {
    const content = [
      "VITE_API_SERVER_URL=https://127.0.0.1:5001",
      "VITE_AUTH_SERVER_URL=http://localhost:3000",
      "VITE_APP_SERVER_URL=https://app.saypi.ai",
    ].join("\n");
    expect(parseEnvMode(content)).toBe("local");
  });

  it("falls back to custom for anything else", () => {
    expect(parseEnvMode("VITE_API_SERVER_URL=https://example.com")).toBe("custom");
  });

  it("honors legacy aliases (API_SERVER_URL)", () => {
    const content = [
      "API_SERVER_URL=https://api.saypi.ai",
      "AUTH_SERVER_URL=https://www.saypi.ai",
      "APP_SERVER_URL=https://app.saypi.ai",
    ].join("\n");
    expect(parseEnvMode(content)).toBe("remote");
  });
});

describe("parseWxtPids", () => {
  const repo = "/Users/rosscado/SayPi/saypi-userscript";
  it("returns PIDs of this repo's wxt dev processes only", () => {
    const ps = [
      `42273 node ${repo}/node_modules/.bin/wxt --browser chrome`,
      `65082 node ${repo}/node_modules/.bin/wxt --browser chrome`,
      `90001 node /some/other/project/node_modules/.bin/wxt --browser chrome`,
      `90002 /Applications/Google Chrome.app/Contents/MacOS/Google Chrome`,
    ].join("\n");
    expect(parseWxtPids(ps, repo)).toEqual([42273, 65082]);
  });

  it("returns [] when nothing matches", () => {
    expect(parseWxtPids("12345 node /x/y/z\n", "/Users/rosscado/SayPi/saypi-userscript")).toEqual([]);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm run test:vitest -- test/scripts/dev-rig-lib.spec.ts`
Expected: FAIL — cannot resolve `../../scripts/dev-rig-lib.mjs` (module does not exist yet).

- [ ] **Step 3: Implement the helpers**

Create `scripts/dev-rig-lib.mjs`:

```js
// Pure, side-effect-free helpers for the dev-rig launcher (scripts/dev-rig.mjs).
// No node-API calls here so they can be unit-tested under Vitest/jsdom.

// Server-URL presets, mirrored from scripts/switch-env.js.
const PRESETS = {
  local: {
    VITE_API_SERVER_URL: "https://127.0.0.1:5001",
    VITE_AUTH_SERVER_URL: "http://localhost:3000",
    VITE_APP_SERVER_URL: "https://app.saypi.ai",
  },
  remote: {
    VITE_API_SERVER_URL: "https://api.saypi.ai",
    VITE_AUTH_SERVER_URL: "https://www.saypi.ai",
    VITE_APP_SERVER_URL: "https://app.saypi.ai",
  },
};

const ALIASES = {
  VITE_API_SERVER_URL: ["API_SERVER_URL"],
  VITE_AUTH_SERVER_URL: ["AUTH_SERVER_URL"],
  VITE_APP_SERVER_URL: ["APP_SERVER_URL"],
};

/** Parse .env contents into a flat key→value map; ignores comments + inline comments. */
export function parseEnvVars(content) {
  const vars = {};
  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    const hash = value.indexOf("#");
    if (hash !== -1) value = value.slice(0, hash).trim();
    vars[key] = value;
  }
  return vars;
}

function resolveValue(vars, key) {
  if (Object.prototype.hasOwnProperty.call(vars, key)) return vars[key];
  for (const alias of ALIASES[key] ?? []) {
    if (Object.prototype.hasOwnProperty.call(vars, alias)) return vars[alias];
  }
  return undefined;
}

/** Which server preset does this .env match? @returns {"local"|"remote"|"custom"} */
export function parseEnvMode(content) {
  const vars = parseEnvVars(content);
  for (const [mode, preset] of Object.entries(PRESETS)) {
    const matches = Object.entries(preset).every(
      ([key, value]) => resolveValue(vars, key) === value,
    );
    if (matches) return mode;
  }
  return "custom";
}

/**
 * PIDs of THIS repo's `wxt` dev processes, from `ps -ax -o pid=,command=` output.
 * Matches the repo's wxt binary path so other projects' dev servers are never killed.
 */
export function parseWxtPids(psOutput, repoPath) {
  const needle = `${repoPath}/node_modules/.bin/wxt`;
  const pids = [];
  for (const line of psOutput.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const match = /^(\d+)\s+(.*)$/.exec(trimmed);
    if (!match) continue;
    const [, pid, command] = match;
    if (command.includes(needle)) pids.push(Number(pid));
  }
  return pids;
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm run test:vitest -- test/scripts/dev-rig-lib.spec.ts`
Expected: PASS (all describe blocks green, no warnings).

- [ ] **Step 5: Commit**

```bash
[ "$(git rev-parse --abbrev-ref HEAD)" = "feat/autonomous-dev-loop-layer4" ] || exit 1
git add scripts/dev-rig-lib.mjs test/scripts/dev-rig-lib.spec.ts
git commit -m "feat(dev-rig): pure env-mode + stray-wxt-pid helpers

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 2: Re-runnable host-DOM recorder

**Files:**
- Create: `scripts/dom-capture/recorder.js`
- Test: `test/scripts/dom-capture-recorder.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `test/scripts/dom-capture-recorder.spec.ts`:

```ts
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, it, expect, beforeEach } from "vitest";

const recorderSrc = readFileSync(
  resolve(__dirname, "../../scripts/dom-capture/recorder.js"),
  "utf8",
);

function loadRecorder() {
  // Evaluate the self-contained script in the jsdom global; installs window.__domCapture.
  new Function(recorderSrc)();
  return (window as any).__domCapture;
}

describe("dom recorder", () => {
  beforeEach(() => {
    document.body.innerHTML = `<div id="root"><span class="a b">hi</span></div>`;
  });

  it("summarizes an element node", () => {
    const rec = loadRecorder();
    const span = document.querySelector("span")!;
    expect(rec.summarizeNode(span)).toEqual({
      type: "element",
      tag: "span",
      classes: ["a", "b"],
    });
  });

  it("captures a resting snapshot and an attribute mutation", async () => {
    const rec = loadRecorder();
    rec.start("#root");
    document.querySelector("span")!.setAttribute("data-x", "1");
    await new Promise((r) => setTimeout(r, 0)); // let MutationObserver flush
    const record = rec.stop();
    expect(record.rootSelector).toBe("#root");
    expect(record.restingSnapshot).toContain("<span");
    const attrMut = record.mutations.find((m: any) => m.type === "attributes");
    expect(attrMut).toBeTruthy();
    expect(attrMut.attributeName).toBe("data-x");
    expect(attrMut.value).toBe("1");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test:vitest -- test/scripts/dom-capture-recorder.spec.ts`
Expected: FAIL — `ENOENT` reading `scripts/dom-capture/recorder.js` (does not exist yet).

- [ ] **Step 3: Implement the recorder**

Create `scripts/dom-capture/recorder.js`:

```js
/**
 * Re-runnable host-DOM recorder for Layer 4 fixture capture.
 * See doc/autonomous-dev-loop.md → "Capturing real-host DOM".
 *
 * Injected verbatim into a host page via the Claude-in-Chrome javascript_tool.
 * Installs window.__domCapture with start(rootSelector?) / stop(). Records BOTH a
 * resting snapshot AND the live MutationObserver stream, so dynamic, event-driven
 * DOM changes are captured — not just a still frame. The host DOM is a moving
 * target, not an API contract: re-run this to refresh fixtures when a host changes.
 *
 * Self-contained (no imports) so it can be eval'd in the page, and exercised
 * directly in jsdom by test/scripts/dom-capture-recorder.spec.ts.
 */
(function installDomRecorder(global) {
  const MAX_TEXT = 200;

  function summarizeNode(node) {
    if (!node) return null;
    if (node.nodeType === 3 /* TEXT_NODE */) {
      const text = (node.textContent || "").trim();
      return text ? { type: "text", text: text.slice(0, MAX_TEXT) } : null;
    }
    if (node.nodeType !== 1 /* ELEMENT_NODE */) {
      return { type: "other", nodeType: node.nodeType };
    }
    const el = node;
    const attrs = {};
    for (const attr of Array.from(el.attributes || [])) attrs[attr.name] = attr.value;
    const className = typeof el.className === "string" ? el.className : "";
    return {
      type: "element",
      tag: el.tagName.toLowerCase(),
      id: el.id || undefined,
      classes: className ? className.split(/\s+/).filter(Boolean) : undefined,
      attrs: Object.keys(attrs).length ? attrs : undefined,
    };
  }

  function buildMutationRecord(mutation, now) {
    const base = { at: now, type: mutation.type, target: summarizeNode(mutation.target) };
    if (mutation.type === "attributes") {
      base.attributeName = mutation.attributeName;
      base.value = mutation.target.getAttribute
        ? mutation.target.getAttribute(mutation.attributeName)
        : undefined;
    } else if (mutation.type === "characterData") {
      base.value = (mutation.target.textContent || "").slice(0, MAX_TEXT);
    } else if (mutation.type === "childList") {
      base.added = Array.from(mutation.addedNodes).map(summarizeNode).filter(Boolean);
      base.removed = Array.from(mutation.removedNodes).map(summarizeNode).filter(Boolean);
    }
    return base;
  }

  const api = {
    summarizeNode,
    buildMutationRecord,
    _observer: null,
    _record: null,
    start(rootSelector) {
      const root = rootSelector ? global.document.querySelector(rootSelector) : global.document.body;
      if (!root) throw new Error(`dom-recorder: root not found: ${rootSelector}`);
      const startedAt = Date.now();
      this._record = {
        host: global.location ? global.location.host : "(unknown)",
        url: global.location ? global.location.href : "(unknown)",
        rootSelector: rootSelector || "body",
        startedAt,
        restingSnapshot: root.outerHTML,
        mutations: [],
      };
      const record = this._record;
      this._observer = new global.MutationObserver((mutations) => {
        const now = Date.now() - startedAt;
        for (const m of mutations) record.mutations.push(buildMutationRecord(m, now));
      });
      this._observer.observe(root, { subtree: true, childList: true, attributes: true, characterData: true });
      return `recording "${record.rootSelector}" on ${record.host}`;
    },
    stop() {
      if (this._observer) this._observer.disconnect();
      this._observer = null;
      const record = this._record;
      this._record = null;
      return record;
    },
  };

  global.__domCapture = api;
  return api;
})(typeof window !== "undefined" ? window : globalThis);
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test:vitest -- test/scripts/dom-capture-recorder.spec.ts`
Expected: PASS (both tests green).

- [ ] **Step 5: Commit**

```bash
[ "$(git rev-parse --abbrev-ref HEAD)" = "feat/autonomous-dev-loop-layer4" ] || exit 1
git add scripts/dom-capture/recorder.js test/scripts/dom-capture-recorder.spec.ts
git commit -m "feat(dev-rig): re-runnable host-DOM recorder (resting + mutation stream)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 3: WXT dev-server config (pinned port + disabled auto-launch)

**Files:**
- Modify: `wxt.config.ts` (the `vite:devServer:extendConfig` hook ~line 354, and the returned config object ~line 348)

**Note:** These are dev-server-only and **env-gated** — with neither `WXT_DEV_PORT` nor `WXT_DISABLE_RUNNER` set (i.e. a normal `npm run build` or `npm run dev`), behaviour is unchanged and production artifacts are byte-for-byte identical. No manifest/permissions/signing change.

- [ ] **Step 1: Remove the dead port block from the dev-server hook**

Find:

```ts
      "vite:devServer:extendConfig": (config) => {
        applyChunkFilePattern(config);

        const desiredPort = Number(process.env.WXT_DEV_PORT ?? 3333);
        config.server ??= {};
        if (typeof config.server === "object") {
          const serverConfig = config.server as Record<string, any>;
          if (serverConfig.port == null) {
            serverConfig.port = desiredPort;
          }
          if (serverConfig.strictPort == null) {
            serverConfig.strictPort = true;
          }
        }
      },
```

Replace with:

```ts
      "vite:devServer:extendConfig": (config) => {
        applyChunkFilePattern(config);
      },
```

(The removed block never took effect — WXT/Vite assign `config.server.port` before this hook runs, so the `port == null` guard always skipped. Port pinning now lives in WXT's top-level `server` config below, which also controls the baked `origin`.)

- [ ] **Step 2: Add the env-gated dev-server + webExt config to the returned object**

Inside `export default defineConfig((env) => {`, after the `const permissions` lines and before `return {`, add:

```ts
  const devServer = process.env.WXT_DEV_PORT
    ? {
        port: Number(process.env.WXT_DEV_PORT),
        strictPort: true,
        origin: `http://localhost:${process.env.WXT_DEV_PORT}`,
      }
    : undefined;
```

Then in the returned object, immediately after `$schema: "https://unpkg.com/wxt/schemas/v6.json",`, add:

```ts
    server: devServer,
    webExt: {
      disabled: process.env.WXT_DISABLE_RUNNER === "true",
    },
```

- [ ] **Step 3: Verify the config — WITHOUT loading `.env.production`**

Do **not** run `npx wxt prepare` or `wxt build`: those default to *production* mode, and WXT's `loadEnv(mode, …)` (`node_modules/wxt/dist/core/utils/env.mjs`) then loads `.env.production` — which the guardrails forbid the loop from touching. `wxt prepare` also has no `--mode` flag, so it can't be made dev-only.

Config correctness is verified instead by the **rig's own startup** in Task 6: `wxt dev` runs in *development* mode (`command=serve` → mode `development`, per `wxt.mjs`), whose env-file list is `.env.development*` / `.env.<browser>*` / `.env` — **never `.env.production`**. A config syntax/type error makes the dev server fail to start, so a clean start *is* the verification. No separate offline step is needed.

- [ ] **Step 4: Confirm gate-off inertness by inspection**

Confirm by reading the diff that `dev.server` is `undefined` and `webExt.disabled` is `false` when `WXT_DEV_PORT`/`WXT_DISABLE_RUNNER` are unset — so a normal `npm run build` / `npm run dev` is byte-for-byte unchanged. The authoritative prod-inertness check is the adversarial reviewer (already performed): confirmed `dev.server`/`webExt` only affect `wxt dev`, never the built artifact.

- [ ] **Step 5: Commit**

```bash
[ "$(git rev-parse --abbrev-ref HEAD)" = "feat/autonomous-dev-loop-layer4" ] || exit 1
git add wxt.config.ts
git commit -m "feat(dev-rig): env-gated dev-server port pin + disable WXT auto-launch

Pin the dev server (WXT_DEV_PORT) with matching baked origin so a
manually-loaded unpacked extension reconnects to the right port, and
disable WXT's throwaway-browser auto-launch (WXT_DISABLE_RUNNER) so the
rig uses the existing MCP Chrome. Both env-gated; prod builds unchanged.
Removes the never-firing port block from the dev-server hook.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 4: The rig orchestrator

**Files:**
- Create: `scripts/dev-rig.mjs`

**Note:** Imperative glue around the Task 1 helpers; it spawns/kills processes, so it is verified by the live demo (Task 6), not unit tests. Do **not** run it during this task — running it kills the founder's current dev server. Only a `node --check` syntax check here.

- [ ] **Step 1: Write the orchestrator**

Create `scripts/dev-rig.mjs`:

```js
#!/usr/bin/env node
/**
 * Dev rig launcher for the autonomous real-site verify loop (Layer 4).
 * See doc/autonomous-dev-loop.md.
 *
 * - Ensures .env points at remote servers (URLs only — never .env.production).
 * - Runs predev (validate .env + copy ONNX) so the dev build is functional.
 * - Clears any stray `wxt dev` for THIS repo so one server owns the port.
 * - Starts a single `wxt dev` pinned to a fixed port (default 3001) with WXT's
 *   auto-launched browser disabled (we use the existing MCP Chrome).
 *
 * Run as a background task so the caller owns the build log:
 *   node scripts/dev-rig.mjs
 */
import { execFileSync, spawn } from "node:child_process";
import { createConnection } from "node:net";
import { fileURLToPath } from "node:url";
import { dirname, resolve as resolvePath } from "node:path";
import { readFileSync } from "node:fs";
import { parseEnvMode, parseWxtPids } from "./dev-rig-lib.mjs";

const PORT = Number(process.env.WXT_DEV_PORT ?? 3001);
const repoRoot = resolvePath(dirname(fileURLToPath(import.meta.url)), "..");

const log = (msg) => console.log(`[dev-rig] ${msg}`);
const run = (cmd, args) => execFileSync(cmd, args, { cwd: repoRoot, stdio: "inherit" });

function ensureRemoteEnv() {
  const mode = parseEnvMode(readFileSync(resolvePath(repoRoot, ".env"), "utf8"));
  if (mode === "remote") return log(".env already on remote servers");
  log(`.env mode is "${mode}" — switching to remote`);
  run("node", ["scripts/switch-env.js", "remote"]);
}

function runPredev() {
  log("validating .env (development) + copying ONNX");
  run("node", ["scripts/validate-env.js", "--file", ".env", "--env", "development"]);
  run("npm", ["run", "copy-onnx"]);
}

function killStrayWxt() {
  const ps = execFileSync("ps", ["-ax", "-o", "pid=,command="], { encoding: "utf8" });
  const pids = parseWxtPids(ps, repoRoot);
  for (const pid of pids) {
    log(`killing stray wxt dev (pid ${pid})`);
    try { process.kill(pid, "SIGTERM"); } catch (err) { log(`could not kill ${pid}: ${err.message}`); }
  }
  return pids.length;
}

function portIsFree(port) {
  return new Promise((resolve) => {
    const socket = createConnection({ port, host: "127.0.0.1" });
    socket.once("connect", () => { socket.destroy(); resolve(false); });
    socket.once("error", () => resolve(true));
  });
}

async function waitForPortFree(port, timeoutMs = 10000) {
  const deadline = Date.now() + timeoutMs; // Date.now() is fine in a plain script.
  while (Date.now() < deadline) {
    if (await portIsFree(port)) return true;
    await new Promise((r) => setTimeout(r, 250));
  }
  return false;
}

async function main() {
  log(`repo: ${repoRoot}`);
  ensureRemoteEnv();
  runPredev();
  if (killStrayWxt() > 0) {
    log(`waiting for port ${PORT} to free up`);
    if (!(await waitForPortFree(PORT))) {
      log(`port ${PORT} still busy after timeout — aborting`);
      process.exit(1);
    }
  }

  log(`starting wxt dev on :${PORT} (browser auto-launch disabled)`);
  log(`LOAD UNPACKED FROM: ${repoRoot}/.output/chrome-mv3-dev`);
  log(`freshness: poll mtime of .output/chrome-mv3-dev after each edit`);

  const wxtBin = resolvePath(repoRoot, "node_modules/.bin/wxt");
  const child = spawn(wxtBin, ["--browser", "chrome"], {
    cwd: repoRoot,
    stdio: "inherit",
    env: { ...process.env, WXT_DEV_PORT: String(PORT), WXT_DISABLE_RUNNER: "true" },
  });
  child.on("exit", (code) => process.exit(code ?? 0));
}

main().catch((err) => { log(`fatal: ${err.message}`); process.exit(1); });
```

- [ ] **Step 2: Syntax-check (do not run it)**

Run: `node --check scripts/dev-rig.mjs`
Expected: no output, exit 0 (valid syntax). Do not execute the script in this task.

- [ ] **Step 3: Commit**

```bash
[ "$(git rev-parse --abbrev-ref HEAD)" = "feat/autonomous-dev-loop-layer4" ] || exit 1
git add scripts/dev-rig.mjs
git commit -m "feat(dev-rig): idempotent single-server launcher (pinned port, no auto-launch)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 5: Runbook + fixtures convention

**Files:**
- Create: `doc/autonomous-dev-loop.md`
- Create: `test/fixtures/host-dom/README.md`

- [ ] **Step 1: Write the runbook**

Create `doc/autonomous-dev-loop.md`:

````markdown
# Autonomous real-site dev-verify loop (Layer 4)

Lets the agent verify extension changes against the real chat hosts (pi.ai,
Claude, ChatGPT) with no per-iteration founder involvement. Design:
`doc/specs/2026-06-13-autonomous-dev-loop-layer4-design.md`.

> This is the high-fidelity **spot-check** layer. It is not CI, and it cannot
> drive the microphone (see Boundaries). The headless harness with synthetic
> audio is Layer 3 (separate spec).

## One-time founder setup (already done)

1. Keep Chrome running with the Claude-in-Chrome extension.
2. `chrome://extensions` → Developer mode → **Load unpacked** →
   `/.output/chrome-mv3-dev`. Chrome remembers this by absolute path, so it
   survives restarts — you only do it once.
3. If the **store** build of SayPi is also installed, disable it while iterating
   so two content scripts don't both run on the page (see Troubleshooting).

## Starting the rig (agent)

Run as a **background task** so you own the build log:

```bash
node scripts/dev-rig.mjs
```

It ensures `.env` is on remote servers (URLs only — never `.env.production`),
runs predev, kills any stray `wxt dev` for this repo, and starts one server on
port **3001** with WXT's throwaway browser disabled. Port 3001 matches the
already-loaded extension's baked reload origin, so **no re-load is needed** —
the loaded extension just reconnects.

## The iterate-verify loop

1. **Edit** source in this checkout.
2. **Wait for the rebuild.** WXT rebuilds and pushes a reload over
   `ws://localhost:3001`; the extension and matching tabs reload themselves.
   Confirm the rebuild landed by polling the output dir's mtime:

   ```bash
   # newest mtime under the dev output (epoch seconds)
   find .output/chrome-mv3-dev -type f -newermt "@$EDIT_EPOCH" | head -1
   ```

   or simply re-read the background task's log for the rebuild line.
3. **Reload the test tab** via the MCP (`navigate` to the same URL) — belt and
   suspenders in case WXT didn't reload that specific tab.
4. **Assert** against the DOM (see the probe below).

## The verification probe (buffered MutationObserver)

Production builds strip `logger.debug`, and MCP console capture can miss events
fired before the first read. So buffer events in the page and read them back via
`javascript_tool`:

```js
// inject once, before triggering the behavior
window.__probe = [];
const obs = new MutationObserver((muts) => {
  for (const m of muts) {
    window.__probe.push({ t: Date.now(), type: m.type, target: m.target?.id || m.target?.className });
  }
});
obs.observe(document.body, { subtree: true, childList: true, attributes: true });
```

```js
// after triggering, read back
JSON.stringify(window.__probe.slice(-50));
```

## Staged-vs-released identity check

The founder versions the staged dev build one patch ahead of the store release
(store `x.y.z` → staged `x.y.z+1`). To confirm you're testing the staged build:

- **Source of truth (on disk):** the version the rig serves —
  `node -e "console.log(require('./.output/chrome-mv3-dev/manifest.json').version)"`.
- **On the page:** confirm exactly **one** set of SayPi controls is present (a
  duplicated set means a store copy is also injecting — disable it).

> Page-injected JS runs in the page's main world, which has no `chrome.runtime`,
> so you can't read `getManifest()` from the probe — use the on-disk version.

## Capturing real-host DOM (fixtures for Layers 2/3)

The host DOM is dynamic (mutates on input / LLM-response events) **and** drifts
over time. **It is not an API contract.** Capture is re-runnable, never a frozen
snapshot.

1. Inject `scripts/dom-capture/recorder.js` verbatim via `javascript_tool`
   (read the file, pass its contents).
2. `window.__domCapture.start("<root selector>")` — e.g. the message list.
3. Trigger the behavior (type, send a prompt; the founder speaks for mic paths).
4. `JSON.stringify(window.__domCapture.stop())` — read it back via the MCP.
5. Write it to `test/fixtures/host-dom/<host>/<YYYY-MM-DD>/<scenario>.json`.

Refresh deliberately when a host redesigns — a stale fixture is a signal to
re-capture, not a contract violation.

## Boundaries

- **No mic.** Can't inject audio into the running Chrome; VAD/STT paths that need
  *speaking* require the founder, or Layer 3 (fake audio at launch).
- **Real auth/login** must be provided by the founder's session.
- **Not CI.** Bound to the founder's browser + the MCP connection.
- **Real sites are flaky/rate-limited** — a failure can be the host, not us.

## Troubleshooting

- **No hot-reload after an edit:** confirm the rig's background task is alive and
  bound to :3001 (`lsof -nP -iTCP:3001 -sTCP:LISTEN`); confirm the loaded
  extension's baked origin is `localhost:3001`
  (`grep -ro "localhost:3001" .output/chrome-mv3-dev | head`). If the baked port
  differs, reload the extension once at `chrome://extensions`.
- **Duplicate SayPi controls:** the store build is also active — disable it.
- **Port busy / two servers:** re-run `node scripts/dev-rig.mjs`; it clears
  strays and waits for :3001.
- **Pages render unstyled:** `.env` is pointing at local servers — the rig
  switches it to remote, but confirm with `node scripts/switch-env.js status`.
````

- [ ] **Step 2: Write the fixtures convention**

Create `test/fixtures/host-dom/README.md`:

```markdown
# Host-DOM fixtures

Dated, host-tagged captures of real chat-host DOM, produced by the Layer 4 loop
(`doc/autonomous-dev-loop.md` → "Capturing real-host DOM") using
`scripts/dom-capture/recorder.js`.

Layout: `host-dom/<host>/<YYYY-MM-DD>/<scenario>.json`
(e.g. `host-dom/pi.ai/2026-06-14/llm-response-stream.json`).

Each file records a resting snapshot **and** the live mutation stream around an
interaction — capturing dynamic behavior, not just a still frame.

**These are not API contracts.** Host DOM drifts over time. A fixture that no
longer matches a host is a signal to re-capture deliberately (re-run the
recorder), not evidence of a regression in our code. Keep older dated captures
for diffing across host redesigns.
```

- [ ] **Step 3: Verify the docs render and links resolve**

Run: `ls doc/autonomous-dev-loop.md doc/specs/2026-06-13-autonomous-dev-loop-layer4-design.md test/fixtures/host-dom/README.md`
Expected: all three paths listed (referenced files exist).

- [ ] **Step 4: Commit**

```bash
[ "$(git rev-parse --abbrev-ref HEAD)" = "feat/autonomous-dev-loop-layer4" ] || exit 1
git add doc/autonomous-dev-loop.md test/fixtures/host-dom/README.md
git commit -m "docs(dev-rig): runbook + host-DOM fixtures convention

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 6: Live bring-up + end-to-end acceptance demo

**This task is interactive — it runs in the main session with the founder's Chrome + the Claude-in-Chrome MCP. It cannot be delegated to a subagent.** It is the real acceptance test for the whole loop.

- [ ] **Step 1: Full local test suite is green**

Run: `npm test`
Expected: Jest + Vitest all pass (including the new Task 1 / Task 2 specs).

- [ ] **Step 2: Take over the dev server**

Start the rig as a background task:

```bash
node scripts/dev-rig.mjs
```

Confirm it killed the two stray servers, bound :3001, and printed the load path.
Verify: `lsof -nP -iTCP:3001 -sTCP:LISTEN` shows exactly one node listener; no
listener remains on :3000.

- [ ] **Step 3: Confirm the loaded extension reconnects**

Via the MCP, open/refresh a pi.ai tab. Confirm SayPi controls render (single,
non-duplicated set) and the on-disk staged version matches:
`node -e "console.log(require('./.output/chrome-mv3-dev/manifest.json').version)"`.

- [ ] **Step 4: The trivial-visible-change demo (the acceptance gate)**

Make a tiny, visible, **throwaway** change (e.g. tweak an `aria-label` or a
visible label on a SayPi-injected control). Save. Then, with **zero founder
involvement**:
- Confirm `.output/chrome-mv3-dev` mtime advanced past the edit.
- Reload the pi.ai tab via the MCP.
- Assert via `read_page`/`javascript_tool` that the new label/aria is live.

Expected: the change is observed automatically. **Revert the throwaway change**
and confirm the revert also propagates.

- [ ] **Step 5: One real DOM capture (smoke the recorder end-to-end)**

Inject `scripts/dom-capture/recorder.js`, capture a short interaction on pi.ai,
and write the result to `test/fixtures/host-dom/pi.ai/2026-06-14/smoke.json`.
Confirm the file contains a `restingSnapshot` and a non-empty `mutations` array.

- [ ] **Step 6: Commit the smoke fixture (optional but useful)**

```bash
[ "$(git rev-parse --abbrev-ref HEAD)" = "feat/autonomous-dev-loop-layer4" ] || exit 1
git add test/fixtures/host-dom/pi.ai/2026-06-14/smoke.json
git commit -m "test(dev-rig): smoke fixture from first real-host DOM capture

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 7: PR, review gate, merge

- [ ] **Step 1: Push the branch**

```bash
[ "$(git rev-parse --abbrev-ref HEAD)" = "feat/autonomous-dev-loop-layer4" ] || exit 1
git push -u origin feat/autonomous-dev-loop-layer4
```

- [ ] **Step 2: Open the PR**

Use `gh pr create` with a narrative body: what the loop does, the env-gated/prod-inert wxt.config note, the boundaries (mic ceiling, not CI), and that Layer 3 follows. Reference the spec + plan paths.

- [ ] **Step 3: Adversarial reviewer subagent**

Dispatch a reviewer (Agent tool, `pr-review-toolkit:code-reviewer` or `feature-dev:code-reviewer`) focused on: (a) confirm `wxt.config.ts` `server`/`webExt` are env-gated and prod builds are unchanged when gates are unset; (b) the launcher never touches `.env.production` or secrets; (c) `parseWxtPids` cannot match unrelated processes. Post the verdict as a PR comment.

- [ ] **Step 4: CI green**

Confirm the GitHub Actions test workflow passes on the PR.

- [ ] **Step 5: Merge gate**

With CI green + reviewer verdict posted, squash-merge:

```bash
gh pr merge feat/autonomous-dev-loop-layer4 --squash --delete-branch
gh pr view feat/autonomous-dev-loop-layer4 --json state   # expect MERGED
```

(If the founder wants to sign off on the `wxt.config.ts` touch first, hold here.)

---

## Self-Review

**Spec coverage:**
- Owned single server, pinned 3001, no re-load → Tasks 3, 4, 6. ✓
- Build-log/mtime freshness signal → Task 5 runbook; Task 6 demo. ✓ (refined from log-string to mtime polling)
- Staged-vs-released identity via version → Task 5 runbook (refined to on-disk read + duplicate-control check, since page JS has no `chrome.runtime`). ✓
- WXT auto-launch disabled → Task 3. ✓
- `.env` remote, never `.env.production`/secrets → Task 1 (`parseEnvMode`), Task 4 (`ensureRemoteEnv`), Task 7 review. ✓
- Re-runnable, dynamism-aware DOM capture (resting + mutation stream, dated, refreshable, "not a contract") → Task 2 + Task 5 fixtures convention + Task 6 smoke. ✓
- Boundaries (mic, real auth, not CI) → Task 5 runbook. ✓
- Deliverables (launcher, runbook, capture routine) → Tasks 1–5. ✓
- Unit tests for pure helpers; live demo for orchestration → Tasks 1, 2, 6. ✓
- Out of scope (Playwright/mock/fake-audio/CI) → not present. ✓

**Placeholder scan:** none — every code/doc step contains full content; commands have expected output.

**Type/name consistency:** `parseEnvVars`/`parseEnvMode`/`parseWxtPids` exported in Task 1 and imported identically in Task 4. `window.__domCapture` with `start`/`stop`/`summarizeNode`/`buildMutationRecord` defined in Task 2 and used identically in its test and the Task 5 runbook. `WXT_DEV_PORT`/`WXT_DISABLE_RUNNER` consistent across Tasks 3 and 4.

**Refinements vs spec (intentional, same intent):** freshness signal uses `.output` mtime rather than log-string parsing (robust, version-independent); staged-identity uses on-disk manifest version + duplicate-control check rather than `getManifest()` (page main-world has no `chrome.runtime`).
