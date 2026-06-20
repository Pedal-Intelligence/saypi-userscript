# Autonomous Claude/ChatGPT real-host runs (Cloudflare-gated hosts)

**Status:** Design approved (2026-06-20, founder: "yes, want autonomous Claude/ChatGPT
real-host runs … implement if you have enough information").
**Builds on:** Sub-project A (in-extension `saypi:dev-feed-speech` / `saypi:dev-reload`
hooks, merged #338), Layer 3.5 (#340/#342).
**Related:** `doc/layer35-real-host-loop.md`, `doc/autonomous-dev-loop.md`.

## Problem

Layer 3.5 (#342) is pi.ai-only: claude.ai / chatgpt.com sit behind Cloudflare,
which blocks Playwright's bundled Chromium, and stable Chrome refuses Playwright's
`--load-extension`. We want the agent to verify against the live **Claude/ChatGPT**
too — both interactively and unattended.

## Two paths (founder chose: both; wary of CDP upkeep)

### Path 1 — Interactive, MCP-driven (primary; zero standing infra)

When the founder's Chrome is open with the Claude-in-Chrome MCP, the dev build
loaded, and logged in, the agent already has everything it needs — Sub-project A's
hooks are reachable from the page main world via the MCP `javascript_tool`:

- **Voice turn (no mic):** `window.dispatchEvent(new CustomEvent("saypi:dev-feed-speech", {detail:{loop:true}}))` then click the host's call/voice control.
- **Reload (no chrome://extensions):** `window.dispatchEvent(new CustomEvent("saypi:dev-reload"))`.
- **Assert** via DOM reads / the in-page `__cap`/`__probe` buffers.

No Cloudflare problem (the real browser is already past it), no `--load-extension`
problem (installed normally). **Upkeep: none** beyond the existing Layer 4 assumption
(founder's Chrome open + MCP connected). Deliverable: a documented recipe in
`doc/autonomous-dev-loop.md` + a live confirmation that the hooks drive a turn on
Claude's contenteditable composer (which differs from pi.ai's textarea).

### Path 2 — Headless CDP runner (unattended/cron; conditional on upkeep)

A standalone runner that drives a dedicated **real Chrome** over CDP — no founder,
no MCP. Keystone resolved by probe (2026-06-20): **real Chrome launched directly
via `child_process` with `--remote-debugging-port` + `--load-extension`, then
`chromium.connectOverCDP()`, loads the extension SW headed AND headless, with
`navigator.webdriver === false`** (Chrome/149). This is the path Playwright's own
launcher can't take (Google's `--load-extension` restriction fires there).

Flow:

1. **`seed`** (founder, once, headed): launch the dedicated profile, log into
   claude.ai / chatgpt.com, pass the Cloudflare checkbox once. `cf_clearance` +
   session cookies persist in the profile. (No `chrome://extensions` step — the
   runner passes `--load-extension` itself at run time.)
2. **`diagnose`** (founder, once after seed): headless CDP launch with the seeded
   profile + `--load-extension`, navigate to claude.ai, and report the keystone:
   did the extension load? did we get **past Cloudflare** (no challenge interstitial)?
   is the app logged in? This is the empirical "does it actually work + what's the
   upkeep" check — the founder runs it to decide whether Path 2 is worth using.
3. **`verify [url]`** (agent, unattended): headless CDP launch, navigate, **detect a
   Cloudflare challenge** (`isCloudflareChallenge`: `Just a moment…` title /
   `/cdn-cgi/challenge` / Turnstile markers) → if blocked, exit with a clear
   "re-seed needed" code instead of emitting garbage; else assert decoration, arm
   `saypi:dev-feed-speech`, drive a turn, report the transcript.
4. **`self-test`** (hermetic): about:blank, assert the extension SW loads over CDP.
   No network/auth — proves the launch+attach+extension-load glue (probe-proven).

**Honest upkeep:** `cf_clearance` is fingerprint+IP-bound and expires (hours–days,
host-dependent). So Path 2 is **not guaranteed near-zero upkeep** — `diagnose`
measures it, and `verify` degrades gracefully (re-seed signal) rather than lying.
If upkeep is too high for the founder's taste, Path 1 is the zero-upkeep fallback.
**No stealth/evasion** (arms race + ToS) — we rely only on a real Chrome profile
with a real, founder-established session.

## Architecture (Path 2)

- `scripts/layer4cdp-lib.mjs` (pure, unit-tested): `parseLayer4CdpArgs`,
  `resolveCdpProfileDir` (`SAYPI_CDP_PROFILE_DIR` → default `~/.config/saypi-cdp-profile`),
  `buildCdpChromeArgs({extensionDir, port, profileDir, headless})` (raw-launch args:
  `--remote-debugging-port`, `--user-data-dir`, `--load-extension`,
  `--disable-extensions-except`, `--no-first-run`, `--no-default-browser-check`;
  **never** `--enable-automation`), and `isCloudflareChallenge({title, url, html})`.
- `scripts/layer4cdp.mjs` (runner): `spawn` real Chrome with those args, poll
  `http://127.0.0.1:<port>/json/version`, `chromium.connectOverCDP`, then the
  seed/diagnose/verify/self-test commands above. Reuses the synthetic-speech page
  bridge + transcript assertion from the Layer 3.5 pattern.
- `package.json`: `layer4cdp:seed|diagnose|verify|self-test`.
- Docs: this spec + a `doc/layer4-cdp-real-host-loop.md` usage guide + CLAUDE.md row +
  the Path 1 recipe in `doc/autonomous-dev-loop.md`.

## What's verifiable by the agent vs. founder-gated

- **Agent-verifiable (this PR):** the pure lib (required gate); the hermetic
  `self-test` (extension SW loads over CDP — probe-proven); `isCloudflareChallenge`
  unit tests.
- **Founder-gated (one-time `diagnose`):** whether Cloudflare actually passes under
  CDP-driven real Chrome with seeded `cf_clearance`, and the real upkeep cadence.
  The runner is built and self-tested; the authenticated real-host turn is confirmed
  by the founder running `seed` then `diagnose`, exactly like Layer 3.5's seeded turn.

## Non-goals

- Not CI (real internet, real auth, flaky/rate-limited). Standalone, on-demand.
- No stealth/evasion plugins.
- Not a replacement for Path 1 — both ship; Path 1 is the zero-upkeep interactive
  option, Path 2 the unattended one.

## Risks

| Risk | Mitigation |
| --- | --- |
| Cloudflare detects CDP attach despite webdriver:false | `diagnose` measures it empirically; `verify` detects the challenge and signals re-seed; Path 1 fallback. |
| `cf_clearance` expiry → upkeep | Persistent profile reuses it until expiry; graceful re-seed signal; founder decides via `diagnose`. |
| Dedicated profile holds real cookies | Outside the repo, git-ignored default, never uploaded; separate from the founder's daily profile (can't share a running profile). |
| Headless real-Chrome extension load regresses across Chrome versions | `self-test` is the guard; run it before a session. |
