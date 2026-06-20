# Autonomous real-site dev-verify loop (Layer 4)

Lets the agent verify extension changes against the real chat hosts (pi.ai,
Claude, ChatGPT) with no per-iteration founder involvement. Design:
`doc/specs/2026-06-13-autonomous-dev-loop-layer4-design.md`.

> This is the high-fidelity **spot-check** layer. It is not CI, and it cannot
> drive the microphone (see Boundaries). The headless harness with synthetic
> audio is Layer 3 (separate spec).

## Autonomy model — what's hands-off vs. needs the founder

Read this first; it sets expectations for how the loop actually runs.

- **Every code edit is hands-off.** Edit → rig rebuilds (~1s) → the connected
  service worker re-registers the content script → the agent reloads the test tab
  via the MCP → assert. No founder action per edit. (Verified end-to-end on real
  pi.ai, both directions, 2026-06-14.)
- **The founder reloads the extension exactly once per session** — right after the
  agent (re)starts the rig (setup step 3). After that, every edit that session is
  autonomous.
- **The agent CANNOT reload the extension itself** (validated 2026-06-14, don't
  re-attempt): the MCP `navigate` tool forces an `https://` prefix so it can't open
  `chrome://extensions`, and the `computer` click/screenshot tool only sees the page
  viewport (no address bar, no browser chrome). `chrome://extensions` is therefore
  unreachable from automation. When a rig (re)start is unavoidable, ask the founder:
  *"please click ⟲ on the Say, Pi `<version>` card."*
- **Minimize rig restarts** to minimize that ask. Keep **one long-lived rig** — it's
  stable across edits. You only restart it if you change `wxt.config.ts` or it dies.
  A fresh agent session = a fresh rig = one founder reload at the start, then nothing.
- **Layer 3 removes this entirely** (its own spec): Playwright launches a fresh,
  dedicated Chromium per run via `--load-extension`, which it can reload/relaunch
  itself — no `chrome://extensions`, no stale service worker — and can feed fake mic
  audio for the VAD/STT paths this layer can't.

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
   `ws://localhost:3001`; the connected service worker re-registers the content
   script (in MV3 **dev** mode WXT registers content scripts dynamically via
   `chrome.scripting` — the dev manifest has no `content_scripts`; production
   declares them statically). Confirm the rebuild landed by polling the output
   dir's mtime (it advances on each rebuild):

   ```bash
   # most-recent mtime under the dev output, epoch seconds
   find .output/chrome-mv3-dev -type f -exec stat -f '%m' {} + | sort -n | tail -1
   ```

   or re-read the rig's background-task log for its `✔ Reloaded:` line.

   **Confirm the *loaded* build, not just the on-disk one.** The content script
   stamps the build identity onto `<html data-saypi-build="<sha>@<branch> <iso>">`
   (`src/build-stamp.ts`, injected by a Vite `define` in `wxt.config.ts`). Read it
   from the page's main world and compare to the current commit — this is the
   **definitive** freshness check, because the on-disk mtime can be fresh while the
   *page* still runs a stale build (e.g. its MV3 SW slept and never picked up the
   reload):

   ```js
   document.documentElement.dataset.saypiBuild   // e.g. "0b65de4@main 2026-06-16T21:00:00Z"
   ```
   ```bash
   git rev-parse --short HEAD                     # the sha it should match
   ```

   The rig also watches `src/` and prints a loud `⚠ hot-reload looks STALLED`
   warning when an edit doesn't produce a rebuild within a few seconds — your cue
   that the SW slept and the extension needs one reload (it can't reach the page to
   know the SW is gone, so it flags the on-disk symptom).
3. **Reload the test tab** via the MCP (`navigate` to the same URL), then read the
   DOM. With the SW connected WXT already reloads matching tabs itself; the MCP
   reload is a reliable belt-and-suspenders step and gives a clean point to assert.
   Verified live: with the SW connected, an edit reaches the real pi.ai DOM with no
   per-edit extension reload. (If a change *doesn't* appear, the SW likely slept or
   the rig restarted — reload the extension once, setup step 3.)
4. **Assert** against the DOM (see the probe below).

### CSS changes don't hot-reload — verify styles at Layer 3, never by injection (learned 2026-06-15)

**`wxt dev` cannot hot-reload content-script CSS.** It hot-reloads content-script
**JS** live from the dev server, but a changed `.scss` never reaches the loaded
extension. This is structural, not a stale watcher: WXT's `detectDevChanges`
maps a changed file to the content-script step only if the file is in a JS
chunk's `moduleIds` (`findEffectedSteps`). Content-script CSS is emitted as an
*asset*, so an `.scss` edit matches nothing → it's classified **`no-change`** →
no rebuild, no reload. (JS hot-reloads because it *is* in `moduleIds`.) The dev
server on `:3001` serves the freshly-compiled SCSS on demand, but that is not
what the manifest-injected content script uses, so the page keeps the old rule.
Restarting the rig only "works" because the *initial* build re-reads source.

**Do not inject CSS into the page to "verify" a style.** A rule you paste into
the tab (even via `<style>` + `!important`) tests *your* rule, not the artifact
the build system produced — it's a false signal. We hit exactly this trap and it
masked nothing real.

Instead, **verify CSS/visual contracts at Layer 3 against the real build** — it
loads the actual `wxt build` output via `--load-extension`, so the browser
injects the extension's real content-script CSS, autonomously and in CI. The
pattern: navigate to the host mock (so the manifest CSS injects), let SayPi tag
the body by host, create the element the shipped stylesheet targets, and assert
its **computed** style. See `e2e/specs/tooltip-contrast.e2e.ts` (regression guard
for the Claude tooltip contrast bug — confirmed fail-first by reverting the fix
and rebuilding). The Claude host mock is wired the same way as Pi
(`e2e/support/mock-claude-page.html`, `MAP claude.ai` in `launch-args.ts`,
Host-routed in `mock-servers.ts`).

Layer 1/2 SCSS-text assertions (`test/ui/TooltipContrast.spec.ts`,
`test/ui/TooltipPositioning.spec.ts`) remain a fast first guard on the source,
but the Layer 3 spec is what proves the *built* CSS renders correctly.

If you must spot-check a style on the **real** host (Layer 4), there is no live
loop: rebuild (`npm run e2e:build`, or restart the rig) and have the founder
reload the unpacked extension once, then assert computed styles on the page — but
prefer Layer 3, which needs neither the founder nor the real host.

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

## Observability: see SayPi's own logs, and probe pitfalls (learned 2026-06-14)

The biggest time-sink on the first real run was assuming the harness was dead
because **no SayPi logs appeared**. They were there — just suppressed.

- **Turn SayPi's logs on.** The logger is quiet by default *even in a `wxt dev`
  build*: `logger.debug`/`info` emit nothing until debug mode is enabled. Enable it
  per tab and reload: `localStorage.setItem('saypi:debug', 'true')` (or open the
  page with `?saypi_debug=1`). After that the MCP `read_console_messages` *does*
  capture the content script's isolated-world logs (prefixed `[SayPi DEBUG]`,
  sourced from `content-scripts/saypi.js`). Until you do this, expect zero SayPi
  output — that is not a broken harness.
- **Arm capture *before* you reload.** MCP console/network tracking starts on the
  *first* `read_console_messages` / `read_network_requests` call for a tab, resets
  on navigation, and the buffer is small + deduped. Early-init logs are missed
  unless you call the read tool once (to arm) and *then* reload — or rely on the
  in-page buffer below.
- **`javascript_tool` results can be silently blocked.** A call whose executed
  code emits console output containing long digit runs (e.g. `Date.now()`
  timestamps) returns `[BLOCKED: Cookie/query string data]` — the whole result is
  redacted by a privacy filter. Install probes *silently* (no `console.log` from
  injected code) and keep long numbers out of returned strings; prefer
  `performance.now()|0` over `Date.now()` inside probes.
- **`offsetParent` lies for `position:fixed` elements.** The call button is
  `fixed`, so an `offsetParent`-based "visible?" check reports it hidden when it is
  actually on screen. Use `getBoundingClientRect()` (non-zero box) or
  `el.checkVisibility()` instead.
- **Tooling:** in this environment `rg`'s colored output can mangle matched words —
  read files with the Read tool or use `grep` / `rg --color=never -N`. `fd` is not
  installed; use `find` / `rg --files`.

Paste-once probe that enables logs and records main-world console + errors +
unhandled rejections + DOM mutations (read any back later via `window.__cap` /
`window.__probe`):

```js
(() => {
  localStorage.setItem('saypi:debug','true'); // reload after this to capture init logs
  if (!window.__cap) {
    window.__cap = [];
    for (const lvl of ['log','info','warn','error','debug']) {
      const orig = console[lvl].bind(console);
      console[lvl] = (...a) => { try { window.__cap.push({ lvl, n: performance.now()|0,
        msg: a.map(x => { try { return typeof x==='string'?x:JSON.stringify(x); } catch { return String(x); } }).join(' ').slice(0,300) }); } catch {} return orig(...a); };
    }
    addEventListener('error', e => window.__cap.push({ lvl:'uncaught', msg:(e.message+' @ '+e.filename+':'+e.lineno).slice(0,300) }));
    addEventListener('unhandledrejection', e => window.__cap.push({ lvl:'rejection', msg:String(e.reason&&(e.reason.stack||e.reason.message||e.reason)).slice(0,300) }));
  }
  if (!window.__probe) {
    window.__probe = [];
    new MutationObserver(ms => { for (const m of ms) window.__probe.push({ n:performance.now()|0, type:m.type, target:(m.target&&(m.target.id||(m.target.className&&String(m.target.className).slice(0,50))))||'' }); })
      .observe(document.body, { subtree:true, childList:true, attributes:true });
  }
  return 'probes installed';
})()
```

> The content script (isolated world) and `javascript_tool` (page main world) are
> different JS contexts: the main-world `__cap` hook only catches main-world logs;
> for SayPi's own logs use `read_console_messages` *with* `saypi:debug` enabled.

## What the MCP can't reach (test it at Layer 2 instead)

The extension **Settings page opens in its own browser window**, outside the MCP
tab group — `tabs_context_mcp` never lists it and `computer`/`javascript_tool`
can't drive it. The founder can screenshot it on request, but treat Settings-tab
behaviour (e.g. the Dictation / Submit-mode selectors) as **Layer 1–2 territory**:
unit-test the controller plus a `replaceI18n()` re-localization pass rather than
trying to drive the popup. That is how the 2026-06-14 dictation mode-label fix was
verified (`test/settings/tabs/DictationModeSelector.spec.ts`).

## Verifying UI parity (check position + states, not just the property you changed)

A real miss on this run: after resizing an injected icon I checked its *size*
numerically and eyeballed the *resting* state — and shipped it visibly
off-centre. Two lessons: a change aimed at one property (size) can break another
(alignment), and the resting state (transparent background) hides alignment
problems that only the hover/active background reveals.

When decorating or restyling a host control, verify it the way the user sees it:

1. **Position, not just size.** Assert the icon's *centre* matches the button's
   centre (via `getBoundingClientRect`, and the glyph's via `getBBox`) — not only
   its dimensions. An icon larger than the padding box won't centre unless the
   button explicitly flex-centres it.
2. **All interactive states.** Resting *and* hover *and* active (*and* dark). The
   hover/active background is what exposes alignment, padding, radius and size
   mismatches; the resting transparent state hides them.
3. **Diff the whole box model against the native reference** — size, centre-offset,
   padding, border-radius, hover fill — not just the one property you touched.
4. **Re-verify the whole component after *every* change.** Don't assume a property
   you didn't touch is still fine (resizing the icon is what broke its centring).

A reusable parity probe — compare a SayPi button to a native reference:

```js
(() => {
  const box = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
    const svg = el.querySelector('svg'); let iconCentreOffset = null;
    if (svg) { const s = svg.getBoundingClientRect();
      iconCentreOffset = { dx: Math.round((s.x+s.width/2-(r.x+r.width/2))*10)/10,
                           dy: Math.round((s.y+s.height/2-(r.y+r.height/2))*10)/10 }; }
    return { size: Math.round(r.width)+'x'+Math.round(r.height), display: cs.display,
             padding: cs.padding, radius: cs.borderRadius, iconCentreOffset };
  };
  return JSON.stringify({
    saypi: box(document.getElementById('saypi-settingsButton')),
    native: box(document.querySelector('[data-testid="nav-new-chat"]')),
  }, null, 1);
})()
```

`iconCentreOffset` near `{dx:0, dy:0}` means the glyph is centred; anything else is
the class of bug missed on 2026-06-14. Run the probe in the hover state too.

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
2. `window.__domCapture.start("<root selector>")` — always pass a **tight**
   selector (e.g. the message list or a single message). Omitting it captures the
   whole `<body>` `outerHTML`, which is huge and noisy on real chat hosts.
3. Trigger the behavior (type, send a prompt; the founder speaks for mic paths).
4. `JSON.stringify(window.__domCapture.stop())` — read it back via the MCP.
5. Write it to `test/fixtures/host-dom/<host>/<YYYY-MM-DD>/<scenario>.json`.

Refresh deliberately when a host redesigns — a stale fixture is a signal to
re-capture, not a contract violation.

## Reloading and driving the mic without the founder (DEV-only hooks)

Two of the loop's recurring founder asks now have in-extension, DEV-only escape
hatches (gated on `import.meta.env.DEV`, stripped from production). Both are driven
from the page main world, which the MCP `javascript_tool` *can* reach. Source:
`src/dev/devReload.ts`; design:
`doc/specs/2026-06-20-autonomous-loop-self-reload-and-synthetic-audio-design.md`.

- **Self-reload — no `chrome://extensions`.** Dispatch the page event and the
  content script relays it to the SW, which calls `chrome.runtime.reload()`
  (re-reads the unpacked build from disk):

  ```js
  window.dispatchEvent(new CustomEvent("saypi:dev-reload"));
  ```

  After firing it, confirm the reload landed by comparing `<html data-saypi-build>`
  to `git rev-parse --short HEAD` (the same freshness check used elsewhere).
  **Best-effort:** it recovers config changes, routine reloads, and a *slept* SW
  (the message wakes it). A truly *wedged* SW that won't wake still needs the
  founder's one click on the unpacked card — now a rare fallback, not per-session.

- **Synthetic voice turn — no human at the mic.** Arm the in-extension synthetic
  audio source, then start a call as usual; the offscreen VAD is fed a bundled WAV
  (`public/audio/synthetic-speech.wav`) instead of the microphone, so the full
  VAD → onSpeechEnd → STT → draft path runs autonomously:

  ```js
  window.dispatchEvent(new CustomEvent("saypi:dev-feed-speech", { detail: { loop: true } }));
  // then click the call button (#saypi-callButton) to start the VAD
  ```

  Under the hood the content bridge forwards to the SW, which arms the offscreen
  `VAD_USE_SYNTHETIC_AUDIO` latch for the tab; `initializeVAD` then passes the
  synthetic `MediaStream` to `MicVAD.new({ stream })`, bypassing `getUserMedia`.
  Layer 3 calls the same mechanism on the SW directly via
  `__saypiOffscreenTestHooks.feedSyntheticSpeech(tabId)`
  (`e2e/specs/synthetic-audio-stt.e2e.ts`).

## Driving Claude / ChatGPT turns autonomously (Path 1 — interactive, via this MCP)

The two hooks above make **Claude and ChatGPT** drivable without the founder right
here in the MCP loop — and unlike Layer 3.5, there is **no Cloudflare or
`--load-extension` problem**, because this is your real, already-authenticated
browser with the extension installed normally. Recipe, per Claude/ChatGPT tab:

1. Ensure the dev build is loaded (version stamp on `<html data-saypi-build>` matches
   HEAD) and you're logged in. Open the chat tab in the MCP tab group.
2. **Reload after an edit:** `javascript_tool` →
   `window.dispatchEvent(new CustomEvent("saypi:dev-reload"))`, then reconfirm the
   build stamp.
3. **Drive a voice turn (no mic):** `javascript_tool` →
   `window.dispatchEvent(new CustomEvent("saypi:dev-feed-speech", {detail:{loop:true}}))`,
   then click `#saypi-callButton`.
4. **Assert** via DOM reads / the `__cap`/`__probe` buffers. Note Claude's composer is
   contenteditable (ProseMirror), not a textarea — assert against the contenteditable's
   text, not a `.value`.

For **unattended/cron** Claude/ChatGPT runs (no MCP), use **Layer 4 (CDP)** —
`doc/layer4-cdp-real-host-loop.md` — which spawns real Chrome over CDP and drives the
same hooks. Its only caveat is Cloudflare `cf_clearance` upkeep (measured by
`npm run layer4cdp:diagnose`); this interactive path has none.

## Boundaries

- **Mic: synthetic source covers VAD→STT autonomously** (the `saypi:dev-feed-speech`
  hook above). It bypasses the real `getUserMedia`/device-permission path, which
  rarely changes and stays covered by Layer 3's flag-based real-`getUserMedia` path
  and occasional founder spot-checks.
- **Real auth/login** must be provided by the founder's session.
- **Not CI.** Bound to the founder's browser + the MCP connection.
- **Real sites are flaky/rate-limited** — a failure can be the host, not us.

## Troubleshooting

- **No hot-reload after an edit:** first check `<html data-saypi-build>` on the
  page against `git rev-parse --short HEAD` — a mismatch (or a sha from an earlier
  rig) means the *page* is stale even if `.output` looks fresh, so the SW slept;
  reload the extension once at `chrome://extensions`. (The rig also prints a
  `⚠ hot-reload looks STALLED` warning when an edit doesn't rebuild.) Then confirm
  the rig's background task is alive and bound to :3001
  (`lsof -nP -iTCP:3001 -sTCP:LISTEN`); confirm the loaded extension's baked origin
  is `localhost:3001` (`grep -ro "localhost:3001" .output/chrome-mv3-dev | head`).
  If the baked port differs, reload the extension once at `chrome://extensions`.
- **A CSS/SCSS change won't appear (but JS changes do):** expected and structural —
  `wxt dev` never hot-reloads content-script CSS. Don't inject CSS to work around
  it; verify styles at Layer 3 against the real build. See *CSS changes don't
  hot-reload — verify styles at Layer 3* under the iterate-verify loop.
- **Duplicate SayPi controls:** the store build is also active — disable it.
- **Port busy / two servers:** re-run `node scripts/dev-rig.mjs`; it clears
  strays and waits for :3001 (and aborts with guidance if something else holds it).
- **Pages render unstyled:** `.env` is pointing at local servers — the rig
  switches it to remote, but confirm with `node scripts/switch-env.js status`.
