# Layer 4 (CDP) — autonomous real-host runs for Claude / ChatGPT

Drives the founder's **real Chrome over CDP** so the agent can verify against the
live, Cloudflare-gated, authenticated hosts (**claude.ai**, **chatgpt.com**) — the
hosts Layer 3.5 can't reach (see `doc/layer35-real-host-loop.md`). It's the
agent-launched counterpart to the MCP-driven Layer 4.

Design: `doc/specs/2026-06-20-layer4-cdp-cloudflare-real-host-design.md`.
Runner: `scripts/layer4cdp.mjs` (pure helpers in `scripts/layer4cdp-lib.mjs`).

## Why it works where Layer 3.5 doesn't

Layer 3.5 uses Playwright's bundled Chromium (Cloudflare blocks it) and Playwright
*launches* Chrome (Google's 2025 `--load-extension` restriction fires there). Layer 4
(CDP) avoids both: it **spawns real Chrome directly** (`child_process`) with
`--remote-debugging-port` + `--load-extension`, then `chromium.connectOverCDP()`.
Probe-verified (2026-06-20, Chrome/149): this loads the extension **headed AND
headless** with `navigator.webdriver === false` — a real fingerprint Cloudflare is
far more likely to accept, plus a real, founder-established session.

**No stealth/evasion** — just a real browser with a real profile and a real login.

## Two ways to drive Claude/ChatGPT (pick per situation)

### Path 1 — Interactive (MCP), zero setup

When your Chrome is open with the Claude-in-Chrome MCP + the dev build + logged in,
the agent drives a Claude/ChatGPT tab directly via the MCP and Sub-project A's hooks
— no CDP, no dedicated profile. See **"Driving Claude/ChatGPT turns" in
`doc/autonomous-dev-loop.md`**. Zero standing upkeep; needs your Chrome open.

### Path 2 — Headless CDP (this doc), unattended

For cron / no-founder runs. One-time setup, then unattended — subject to Cloudflare
`cf_clearance` upkeep (below).

## One-time founder setup

```bash
npm run e2e:build          # build the dev extension
npm run layer4cdp:seed     # opens real Chrome (headed) on a DEDICATED profile
```

Log into claude.ai (and/or chatgpt.com), solving the Cloudflare checkbox once, then
Ctrl-C. The session + `cf_clearance` persist in the dedicated profile
(`~/.config/saypi-cdp-profile`, override `SAYPI_CDP_PROFILE_DIR`). It holds real
cookies — **outside the repo, git-ignored, never uploaded; separate from your daily
Chrome profile** (two Chrome instances can't share a running profile).

## Does it actually work for you? Run the diagnostic

The one keystone the agent can't verify (Cloudflare passing under CDP) is empirical
and IP/fingerprint-bound. Measure it:

```bash
npm run layer4cdp:diagnose            # defaults to https://claude.ai/new
```

It reports: did the extension load over CDP, did you get **past Cloudflare**, is the
app logged in — and a VERDICT (usable / blocked / extension-failed). Re-run it now
and then to gauge how long `cf_clearance` survives — that *is* your upkeep cadence.

## The unattended loop

```bash
npm run e2e:build                                  # after any source change
npm run layer4cdp:verify                           # defaults to https://claude.ai/new
node scripts/layer4cdp.mjs verify https://chatgpt.com/
node scripts/layer4cdp.mjs verify https://claude.ai/new --headed   # watch it
node scripts/layer4cdp.mjs verify https://claude.ai/new --no-turn  # decoration only
```

`verify` attaches over CDP, navigates, and:
- **Cloudflare challenge detected** → exits code **3** with "re-run `layer4cdp:seed`"
  (cf_clearance expired) — it never pretends the bot page is the app.
- else asserts SayPi decorated the page, prints the loaded build, and (unless
  `--no-turn`) arms `saypi:dev-feed-speech`, starts a call, and reports whether a
  transcript reached the composer. Exit 0 on decoration verified.

## Hermetic self-test

```bash
npm run layer4cdp:self-test
```

Headless real Chrome on a throwaway profile, about:blank, asserts the extension SW
loads over CDP. No network/auth — proves the launch+attach+extension-load glue
(probe-proven). Safe anywhere; does not touch the seeded profile.

## Honest upkeep & fallback

`cf_clearance` is fingerprint+IP-bound and expires (hours–days, host-dependent), so
Layer 4 (CDP) is **not guaranteed near-zero upkeep**. `diagnose` measures it; `verify`
degrades gracefully (re-seed signal). If the cadence is too high for your taste, use
**Path 1 (interactive MCP)** for Claude/ChatGPT — zero upkeep, needs your Chrome open.

## Boundaries

- **Not CI** — real internet, real auth, flaky/rate-limited.
- **Requires Google Chrome** installed (set `CHROME_PATH` if not at the default).
- Real-host DOM drifts — confirms behavior, not a frozen contract.
