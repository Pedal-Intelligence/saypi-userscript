# Layer 3.5 — agent-launched bundled-Chromium loop

> **⚠️ Cloudflare reality (corrected 2026-06-20): this loop is NOT reliable against
> real hosts. pi.ai, claude.ai, AND chatgpt.com all serve "Just a moment…" to
> headless bundled Chromium** (the original "pi.ai is Cloudflare-free" assumption was
> never tested for the *verify* path — only the *headed* seed, which passes). **For
> real-host turns use Layer 4 (CDP)** — `doc/layer4-cdp-real-host-loop.md` — which
> drives real Chrome (headed) and passes Cloudflare for *every* host including pi.ai.
> Layer 3.5 remains useful as a bundled-Chromium driver, but expect Cloudflare to
> block it headless.

A standalone verify loop that launches its **own** bundled-Chromium against real
hosts. It sits between Layer 3 (hermetic, mock hosts, in CI) and Layer 4 (the
founder's browser via the Claude-in-Chrome MCP).

Design: `doc/specs/2026-06-20-autonomous-loop-self-reload-and-synthetic-audio-design.md`.
Runner: `scripts/layer35.mjs` (pure helpers in `scripts/layer35-lib.mjs`).

## Why it exists

Layer 4 (`doc/autonomous-dev-loop.md`) borrows the founder's *running* Chrome, so
the agent can't pick launch flags or reach `chrome://extensions`. Layer 3 escapes
both but only against *mock* hosts. Layer 3.5 gets the best of both: the agent owns
the browser (so it self-reloads by relaunching and feeds synthetic audio), and it
points at the *real* hosts (real DNS, real auth, real network).

It builds directly on Sub-project A's in-extension synthetic audio source — the mic
is supplied in-process, no human speaking.

## The Cloudflare constraint (why Layer 4 CDP is preferred for real hosts)

The bind that shapes this loop:

- Loading the unpacked extension needs Playwright's **bundled Chromium** —
  `--load-extension` was restricted in **stable Chrome** in 2025, so Playwright
  *launching* `channel: "chrome"` never registers the extension's service worker
  (verified). So Layer 3.5 must use bundled Chromium.
- But bundled Chromium is **fingerprinted by Cloudflare**, which blocks it **headless
  on every real host — pi.ai, claude.ai, chatgpt.com alike** ("Just a moment…").
  Headed bundled Chromium sometimes squeaks past, but it's fragile.

**Layer 4 (CDP) solves this** by *spawning real Chrome directly* (not via Playwright's
launcher) and attaching over CDP — real Chrome loads the extension AND passes
Cloudflare (headed). **Use Layer 4 (CDP) for real-host turns on any host, including
pi.ai** (`doc/layer4-cdp-real-host-loop.md`).

`isUnsupportedCloudflareHost` (in `scripts/layer35-lib.mjs`) currently only refuses
claude.ai/chatgpt.com and still lets pi.ai through — that's a **known stale guard**
(pi.ai is also Cloudflare-gated headless); prefer Layer 4 CDP rather than relying on
this list. We deliberately do **not** use stealth/evasion plugins (an arms race, and
ToS-sensitive).

## What it is and isn't

- **Is:** an on-demand, agent-runnable real-host spot-check **for pi.ai**.
  Self-reloads (relaunch), drives the mic (synthetic source), carries real auth
  (seeded profile).
- **Isn't:** part of CI or the required `npm run test:e2e` gate. It reaches the real
  internet, and real hosts are flaky/rate-limited — a red run can be the host, not us.
  Keep it out of the hermetic suite. Not for Cloudflare-gated hosts (above).

## One-time founder setup (seed the profile)

```bash
npm run e2e:build          # build the dev extension into .output/chrome-mv3-dev
npm run layer35:seed       # opens a headed browser (login only, no extension)
```

In that browser, log into **pi.ai**, then press Ctrl-C. The session persists in the
profile directory and is reused by every later run — the "one founder action per
session → one founder action, ever" win, mirrored from Layer 4. (`seed` uses bundled Chromium with the
`--enable-automation` flag stripped and does not load the extension — seeding is
just login.)

The profile defaults to `~/.config/saypi-e2e-profile` (override with
`SAYPI_L35_PROFILE_DIR`). **It holds real session cookies — it lives OUTSIDE the
repo, is never committed, and is never uploaded as a CI/test artifact.**

## The agent loop (unattended)

```bash
npm run e2e:build                                   # after any source change
npm run layer35:verify                              # defaults to https://pi.ai/talk
node scripts/layer35.mjs verify https://pi.ai/talk --no-turn   # decoration only
node scripts/layer35.mjs verify https://pi.ai/talk --headed    # watch it run
# claude.ai / chatgpt.com are refused with a Layer-4 pointer (see "Supported hosts").
```

`verify` loads the extension, navigates to the real host, asserts SayPi decorated
the page (`#saypi-callButton`), prints the loaded build
(`<html data-saypi-build>`), then — unless `--no-turn` — arms the synthetic source
via the page bridge (`saypi:dev-feed-speech`), starts a call, and reports whether a
transcript landed in the prompt. Exit code is 0 when decoration is verified (the
extension loaded and ran against the real host); the transcript is reported
informationally because real STT output varies.

## Reloading without the founder

The agent reloads by **relaunching the context** (cheap, deterministic) — no
`chrome://extensions`, no slept-SW problem. The in-extension `saypi:dev-reload`
hook (Sub-project A) also works here, but relaunch is the simpler default for a
loop the agent fully owns.

## Hermetic self-test

```bash
npm run layer35:self-test
```

Launches headless at a throwaway temp profile, loads the extension against
`about:blank`, and asserts the service worker is present. No network, no auth —
proves the launch + extension-load glue. Safe to run anywhere (it does not touch
the seeded profile).

## Boundaries

- **Real auth** is founder-seeded (above); if the session expires, `verify` fails
  with a "re-seed the profile" message — re-run `layer35:seed`.
- **Real hosts drift** — this confirms behavior against the live host; it is not a
  frozen contract. Capture fixtures here for Layers 2/3 as needed.
- **Not CI.** Deliberately excluded from the required e2e run.
