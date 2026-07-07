# Layer 4 (CDP) — autonomous Claude / ChatGPT real-host runs

Drives the founder's **real Chrome over CDP** so the agent can verify against the
live, Cloudflare-gated, authenticated hosts (**claude.ai**, **chatgpt.com**) — the
hosts Layer 3.5 can't reach (see `doc/layer35-real-host-loop.md`). It's the
agent-launched counterpart to the MCP-driven Layer 4.

> **Verified working (2026-06-20, founder's machine, Chrome/149): HEADED.** After a
> one-time profile setup, `layer4cdp diagnose`/`verify` load the extension, pass
> Cloudflare, and decorate live Claude (`#saypi-callButton` present). **Headless is
> Cloudflare-blocked** (cf_clearance is bound to the headed fingerprint), so this is
> a *visible-window-but-agent-driven* loop — no per-run founder action, but not
> silent cron. For zero-setup / when your Chrome is already open, use **Path 1**.

Design: `doc/specs/2026-06-20-layer4-cdp-cloudflare-real-host-design.md`.
Runner: `scripts/layer4cdp.mjs` (pure helpers in `scripts/layer4cdp-lib.mjs`).

## Two ways to drive Claude/ChatGPT

### Path 1 — interactive, MCP-driven (zero setup)

When your Chrome is open with the Claude-in-Chrome MCP + the dev build + logged in,
the agent drives a Claude/ChatGPT tab directly via the MCP and Sub-project A's hooks
(`saypi:dev-feed-speech`, `saypi:dev-reload`) — no CDP, no dedicated profile, no
Cloudflare problem. Recipe: **[doc/autonomous-dev-loop.md](autonomous-dev-loop.md) →
"Driving Claude/ChatGPT turns autonomously"**. Zero standing upkeep; needs your
Chrome open.

### Path 2 — headed CDP (this doc), agent-launched

For runs where you don't want to drive the MCP yourself: the agent launches its own
real-Chrome window over CDP and drives it. One-time setup, then no per-run founder
action (a window does pop — the machine must be unlocked; it's not silent cron).

## Why it works where Layer 3.5 doesn't

Layer 3.5 uses Playwright's bundled Chromium (Cloudflare blocks it) and Playwright
*launches* Chrome (Google's 2025 `--load-extension` restriction fires there). Layer 4
(CDP) **spawns real Chrome directly** (`child_process`) with `--remote-debugging-port`,
then `chromium.connectOverCDP()` — a real fingerprint, `navigator.webdriver===false`,
and a real, founder-established login. **No stealth/evasion.**

## One-time founder setup (Path 2)

```bash
npm run e2e:build          # build the dev extension into .output/chrome-mv3-dev
npm run layer4cdp:seed     # opens real Chrome (headed) on a DEDICATED profile
```

1. In the seed window, **log into claude.ai** (and/or chatgpt.com), solving the
   Cloudflare checkbox once.
2. Go to **`chrome://extensions`** → turn **Developer mode** ON → **Load unpacked**
   → select `<repo>/.output/chrome-mv3-dev`. Confirm "Say, Pi" is enabled.
   *(This is required: on an established profile, the runner does NOT pass
   `--load-extension` — Chrome's 2025 gating disables it there — so the extension
   must be profile-installed with Developer mode on. The store build, if present,
   should be disabled so only the dev build injects.)*
3. **Cmd-Q** to quit gracefully (so the settings persist).

The dedicated profile lives at `~/.config/saypi-cdp-profile` (override
`SAYPI_CDP_PROFILE_DIR`). It holds real cookies — **outside the repo, git-ignored,
never uploaded; separate from your daily Chrome profile** (two Chrome instances
can't share a running profile).

> **Privacy note:** if you sign into your Google account in this profile, Chrome Sync
> pulls your saved passwords/extensions into it. Turn off Sync (Settings → turn off
> sync) if you want it sandboxed — the claude.ai/chatgpt.com *site* logins (all the
> runner needs) are unaffected. You can also give the profile a distinct
> name/avatar so it's obvious which is which.

## Confirm it works, then run the loop

```bash
npm run layer4cdp:diagnose            # headed; VERDICT: usable / blocked
npm run layer4cdp:verify              # headed; drives a synthetic turn on claude.ai
node scripts/layer4cdp.mjs verify https://chatgpt.com/
node scripts/layer4cdp.mjs verify https://claude.ai/new --no-turn   # decoration only
node scripts/layer4cdp.mjs verify https://claude.ai/new --headless  # re-test headless (expect blocked)
```

- **`diagnose`** reports extension-loaded / past-Cloudflare / SayPi-decorated and a
  VERDICT. As of 2026-06-20 it returns **usable** headed (and **blocked** headless).
- **`verify`** attaches over CDP, navigates, and: on a Cloudflare challenge exits
  code **3** with "re-seed" (never pretends the bot page is the app); else asserts
  decoration, prints the loaded build, and (unless `--no-turn`) arms
  `saypi:dev-feed-speech`, starts a call, and reports whether a transcript reached
  the composer.
- Both default to **headed** (the only mode that passes Cloudflare for these hosts);
  `--headless` is an explicit opt-in for re-testing.

## Hermetic self-test

```bash
npm run layer4cdp:self-test
```

Headless real Chrome on a throwaway profile (with `--load-extension`, since a fresh
profile has no install), about:blank, asserts the extension SW loads over CDP. No
network/auth — proves the launch+attach+extension-load glue. Safe anywhere; does not
touch the seeded profile.

## Upkeep & fallback

`cf_clearance` is fingerprint+IP-bound and expires (hours–days, host-dependent). When
it does, `verify` exits 3 ("re-seed") — re-run `layer4cdp:seed`, pass the checkbox,
Cmd-Q. If that cadence is too high for your taste, **Path 1 (interactive MCP)** is
the zero-upkeep alternative.

## Clean shutdown (no "Restore pages?" prompt)

The runner closes Chrome **gracefully** (CDP `Browser.close`, fire-and-forget, then
polls the debug port) and, as a guarantee, marks the profile's `exit_type=Normal`
before exiting — plus launches with `--hide-crash-restore-bubble`. So a `verify` /
`diagnose` / `self-test` run never leaves the profile looking "crashed", and your
next manual launch won't show the "Restore pages? Chrome didn't shut down correctly"
dialog. (The earlier `SIGKILL` teardown was the cause of that dialog — fixed.) When
running `seed`, **Ctrl-C** now shuts Chrome down gracefully too.

## Boundaries

- **Headed only** for Cloudflare hosts → a visible window; the machine must be
  unlocked. Not silent cron.
- **Not CI** — real internet, real auth, flaky/rate-limited.
- **`verify` sends a real message** (unless `--no-turn`): the synthetic transcript is
  submitted to the host as the founder, leaving a real conversation behind and spending
  real STT quota. Purposeful runs only; never loop it unattended.
- **One CDP run at a time.** `verify`/`diagnose` and both sweeps share the seeded
  profile with no lockfile — never run two concurrently.
- **Requires Google Chrome** installed (set `CHROME_PATH` if not at the default).
- Real-host DOM drifts — confirms behavior, not a frozen contract.

## Costs & caps (#533)

Every real-host run spends the founder's resources (host plan quota, SayPi STT/TTS
credits), so runs are **ledgered and capped**. `verify` and both sweep harnesses
record each run — `{timestamp, harness, target, purpose}` — to `.l4-ledger.json` at
the repo root (gitignored; personal operational data) and **refuse to launch** once a
cap is reached. Check spend before planning real-host work, and include it in the
session handoff:

    node scripts/l4-ledger.mjs report

Caps are **PROPOSED defaults pending founder confirmation**: **6 runs per rolling 12h
session, 25 per rolling 7-day week**. The founder tunes them via
`SAYPI_L4_CAP_SESSION` / `SAYPI_L4_CAP_WEEK` or the `caps` block in the ledger file
(env wins). `SAYPI_L4_CAP_OVERRIDE=1` bypasses a refusal — **founder-authorized use
only**; the run is still ledgered, marked `[OVERRIDE]`. A missing or corrupt ledger
never blocks a run (first run bootstraps it; a corrupt file warns, is preserved at
`.l4-ledger.json.corrupt-<timestamp>` — recover founder-tuned caps from it manually —
and a fresh ledger starts). Note the ledger is advisory by design: `SAYPI_L4_LEDGER_PATH`
and the cap env vars are unaudited seams, unlike the `[OVERRIDE]`-marked bypass.
`SAYPI_L4_LEDGER_PATH` points at an alternate ledger (tests/dry-runs). Set
`SAYPI_L4_PURPOSE="why"` so the ledger entry says what the run was for; runs driven
outside the harnesses (e.g. the MCP dev rig) can be ledgered manually with
`node scripts/l4-ledger.mjs record --harness dev-rig --purpose "..."`. `seed`,
`diagnose`, and `self-test` don't send a message and aren't counted.
