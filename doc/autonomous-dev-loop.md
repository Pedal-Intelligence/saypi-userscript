# Autonomous real-site dev-verify loop (Layer 4)

Lets the agent verify extension changes against the real chat hosts (pi.ai,
Claude, ChatGPT) with no per-iteration founder involvement. Design:
`doc/specs/2026-06-13-autonomous-dev-loop-layer4-design.md`.

> This is the high-fidelity **spot-check** layer. It is not CI, and it cannot
> drive the microphone (see Boundaries). The headless harness with synthetic
> audio is Layer 3 (separate spec).

## Setup (order matters)

**Verified live:** the rig must be running *before* the extension's MV3 service
worker connects. With the wrong order the loaded extension stays bound to a dead
server and **silently never hot-reloads** (edits rebuild on disk but never reach
the page). So:

1. Keep Chrome running with the Claude-in-Chrome extension.
2. **Start the rig first** (see "Starting the rig" below).
3. `chrome://extensions` → Developer mode → **Load unpacked** →
   `<repo>/.output/chrome-mv3-dev` (first time only — Chrome remembers the path),
   then click **reload ⟲** on that unpacked card. The reload connects the
   extension's service worker to the live `ws://localhost:3001`, where the open
   socket keeps the SW alive to receive hot-reload signals. **Reload the extension
   once after every rig (re)start** — that's the one recurring manual step.
4. If a **store** build of SayPi is also installed, **disable it** so only the dev
   build injects (otherwise two content scripts run and you can't tell which is live).
5. **Tell dev builds apart by version.** The staged dev build is versioned one
   patch ahead of the store release (store `x.y.z` → staged `x.y.z+1`, currently
   `1.10.8`). Check the served version on disk:
   `node -e "console.log(require('./.output/chrome-mv3-dev/manifest.json').version)"`
   (and after an extension reload it shows at `chrome://extensions`).

## Starting the rig (agent)

Run as a **background task** so you own the build log:

```bash
node scripts/dev-rig.mjs
```

It ensures `.env` is on remote servers (URLs only — never `.env.production`),
runs predev, kills any stray `wxt dev` for this repo, confirms the port is free,
and starts one server on port **3001** (origin baked into the extension's reload
client) with WXT's throwaway browser disabled. It stays alive across edits.

> After the rig starts (or restarts), **reload the unpacked extension once**
> (setup step 3). Until you do, edits rebuild on disk but won't reach the running
> page — the SW is still bound to the previous server.

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
2. **Wait for the rebuild.** WXT rebuilds (~1s) and pushes a reload over
   `ws://localhost:3001`; the connected service worker re-registers the runtime
   content script (SayPi's content scripts are runtime-registered — `content_scripts`
   is absent from the manifest). Confirm the rebuild landed by polling the output
   dir's mtime (it advances on each rebuild):

   ```bash
   # most-recent mtime under the dev output, epoch seconds
   find .output/chrome-mv3-dev -type f -exec stat -f '%m' {} + | sort -n | tail -1
   ```

   or re-read the rig's background-task log for its `✔ Reloaded` line.
3. **Reload the test tab** via the MCP (`navigate` to the same URL). This is what
   makes the re-registered content script take effect on the open page — verified
   live: with the SW connected, an edit reaches the real pi.ai DOM after just a tab
   reload, no per-edit extension reload. (If a change *doesn't* appear, the SW
   likely slept or the rig restarted — reload the extension once, setup step 3.)
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
