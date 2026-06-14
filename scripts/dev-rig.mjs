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
    let settled = false;
    const done = (free) => {
      if (settled) return;
      settled = true;
      socket.destroy();
      resolve(free);
    };
    socket.setTimeout(500);
    socket.once("connect", () => done(false)); // someone is listening → busy
    socket.once("timeout", () => done(false)); // can't confirm free → treat as busy
    // Only a refused connection reliably means nothing is listening; any other
    // error (e.g. RST from a server mid-shutdown) is NOT proof the port is free.
    socket.once("error", (err) => done(err.code === "ECONNREFUSED"));
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
  killStrayWxt();
  // Always confirm the port is actually free before spawning — strays we couldn't
  // match (or any other process) could still be holding it. Returns immediately
  // when already free, so there's no delay in the common case.
  if (!(await waitForPortFree(PORT))) {
    log(`port ${PORT} still busy after timeout — free it and retry (lsof -nP -iTCP:${PORT} -sTCP:LISTEN)`);
    process.exit(1);
  }

  log(`starting wxt dev on :${PORT} (browser auto-launch disabled)`);
  log(`LOAD UNPACKED FROM: ${repoRoot}/.output/chrome-mv3-dev`);
  log(`freshness: poll mtime of .output/chrome-mv3-dev after each edit`);

  const wxtBin = resolvePath(repoRoot, "node_modules/.bin/wxt");
  // stdin must be an OPEN pipe, not "inherit"/"ignore". After the first file change
  // WXT starts a readline interface on stdin (its "o + enter = reopen browser"
  // shortcut). A non-TTY stdin at EOF makes readline close immediately and the
  // process exits right after the first reload. We open a pipe and never write to
  // or close it, so stdin never EOFs and the watcher stays alive. stdout/stderr
  // still flow to the caller's log.
  const child = spawn(wxtBin, ["--browser", "chrome"], {
    cwd: repoRoot,
    stdio: ["pipe", "inherit", "inherit"],
    env: { ...process.env, WXT_DEV_PORT: String(PORT), WXT_DISABLE_RUNNER: "true" },
  });
  // Forward termination to the child so stopping the rig (e.g. the background
  // task is SIGTERM'd) tears down wxt dev instead of orphaning it on the port.
  for (const sig of ["SIGTERM", "SIGINT"]) {
    process.on(sig, () => child.kill(sig));
  }
  child.on("exit", (code) => process.exit(code ?? 1)); // null code = signal-killed
}

main().catch((err) => { log(`fatal: ${err.message}`); process.exit(1); });
