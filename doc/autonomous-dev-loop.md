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
   `<repo>/.output/chrome-mv3-dev`. Chrome remembers this by absolute path, so
   it survives restarts — you only do it once.
3. If the **store** build of SayPi is also installed, disable it while iterating
   so two content scripts don't both run on the page (see Troubleshooting).

## Starting the rig (agent)

Run as a **background task** so you own the build log:

```bash
node scripts/dev-rig.mjs
```

It ensures `.env` is on remote servers (URLs only — never `.env.production`),
runs predev, kills any stray `wxt dev` for this repo, confirms the port is free,
and starts one server on port **3001** with WXT's throwaway browser disabled.
Port 3001 matches the already-loaded extension's baked reload origin, so **no
re-load is needed** — the loaded extension just reconnects.

## Environment and the production boundary

The rig runs `wxt dev`, which is **development mode**. By WXT's `loadEnv`
(`node_modules/wxt/dist/core/utils/env.mjs`), development mode loads
`.env`, `.env.development*`, and `.env.<browser>*` — and **never `.env.production`**.
The rig also only ever reads/writes `.env` (via `scripts/switch-env.js`, which
rewrites the three `VITE_*_SERVER_URL` keys), never `.env.production` or any
secret.

**Do not run `wxt prepare` or `wxt build` as part of the loop** — both default to
*production* mode and will load `.env.production`. The loop never needs them:
`wxt dev` hot-reloads everything.

## The iterate-verify loop

1. **Edit** source in this checkout.
2. **Wait for the rebuild.** WXT rebuilds and pushes a reload over
   `ws://localhost:3001`; the extension and matching tabs reload themselves.
   Confirm the rebuild landed by polling the output dir's mtime (it advances on
   each rebuild):

   ```bash
   # most-recent mtime under the dev output, epoch seconds
   find .output/chrome-mv3-dev -type f -exec stat -f '%m' {} + | sort -n | tail -1
   ```

   or re-read the rig's background-task log for its rebuild line.
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
  strays and waits for :3001 (and aborts with guidance if something else holds it).
- **Pages render unstyled:** `.env` is pointing at local servers — the rig
  switches it to remote, but confirm with `node scripts/switch-env.js status`.
