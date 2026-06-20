# E2E host sweep — periodic real-host defect hunt across all three hosts

A repeatable, agent-launched sweep that drives a synthetic voice turn on **pi.ai,
claude.ai, and chatgpt.com** (real Chrome over CDP, headed), captures rich evidence,
and surfaces SayPi-attributable defects + automation blockers. This is the runbook
behind the `/e2e-host-sweep` skill; you can also run the harness directly.

It is the **thorough** counterpart to `layer4cdp.mjs verify` (which captures
console-*errors*-only + a composer-only transcript check that false-negatives on
auto-submit hosts — see issue #364). The sweep captures every console message,
network failures, per-host selector diagnostics, auth/voice state, the full
conversation, and screenshots.

> **Layer:** this is **Layer 4 (CDP)** — real hosts, real DOM, real network. It is the
> only layer that can find **real-host DOM drift** (the dominant defect class — e.g.
> #350/#351/#352/#362). Layer 3 uses *mock* DOMs and structurally cannot; its role is
> the inverse — once the sweep finds a drift bug, encode an L3 fixture/contract test to
> guard it. Not CI; needs the founder's machine unlocked (a visible window opens).

## Preconditions

1. **Google Chrome** installed (set `CHROME_PATH` if not at the default).
2. **Seeded CDP profile** at `~/.config/saypi-cdp-profile` (`SAYPI_CDP_PROFILE_DIR` to
   override), with the dev extension profile-installed (Developer mode + Load unpacked).
   See `doc/layer4-cdp-real-host-loop.md` for the one-time setup.
3. **Dev build at HEAD:** `npm run e2e:build` (the profile-installed unpacked extension
   re-reads `.output/chrome-mv3-dev` from disk on each launch, so rebuilding at HEAD =
   the sweep tests current `main`; confirm via the `data-saypi-build` stamp the sweep
   logs). **If the build fails with `Rollup failed to resolve import "<pkg>"` (e.g.
   `preact`), your local `node_modules` is stale after a recent merge — run `npm install`
   and rebuild.** A stale build that loads but doesn't decorate shows up as
   `layer4cdp:diagnose` reporting "extension loaded YES, no decoration".
4. **`cf_clearance` fresh:** `npm run layer4cdp:diagnose` must say **VERDICT: usable**.
   If it says blocked, re-seed (`npm run layer4cdp:seed`, pass the Cloudflare checkbox,
   Cmd-Q).

### One-time seed for the TTS/voice-output path (recommended)

By default the sweep wants to exercise the **output** path too (TTS readback, voice
menu, credits) — the half of the product that an unauthenticated/voice-off profile
silently skips. To cover it, once, in the seeded profile's headed window
(`npm run layer4cdp:seed`):

- **Sign into your SayPi account** (saypi.ai) so the extension has a JWT.
- **Select a _SayPi_ voice on claude.ai** (e.g. an ElevenLabs voice) — **not** pi.ai's
  native voice. This is the key nuance: the sweep only counts SayPi's TTS engine as
  exercised when the active provider is **`Say, Pi`** (`isSaypiTtsProvider`). A pi.ai
  turn logs `Speech provided by Pi` (pi.ai's *native* voice — SayPi just relays it),
  `None` is voice-off, and ChatGPT uses native Read Aloud — none of those run SayPi's
  synthesis/playback path. claude.ai has no native voice, so selecting a SayPi voice
  there is the clean way to exercise the engine (offscreen audio under CSP, credits, the
  #238/#241/#268 cluster).

Then Cmd-Q. The sweep logs `auth=` and `voice=` per host and prints a loud ⚠️ if it
detects the account is unauthenticated **or that SayPi's TTS engine (`Say, Pi`) was never
the active provider** (a native `Pi`/`None`/Read-Aloud run does NOT satisfy it) — so a
run always tells you, honestly, whether it actually covered SayPi TTS. (Caveat: auth/voice state is read from SayPi's
**debug** console logs, which the dev build emits — `npm run e2e:build` sets
`VITE_DEBUG_LOGS=true`. If debug logging is off, both stay `null` and the warning may
fire even when authed; treat the warning as "couldn't confirm coverage", and corroborate
with the on-page voice menu / sign-in state if in doubt.) (You can still run anonymous/voice-off for a quick
input-path-only check; the warning just flags the gap.)

## Run it

```bash
npm run e2e:build                 # 1. build current HEAD into .output/chrome-mv3-dev
npm run layer4cdp:diagnose        # 2. confirm VERDICT: usable (re-seed if blocked)
npm run e2e-host-sweep            # 3. sweep all three hosts (headed)

# variants
node scripts/e2e-host-sweep.mjs chatgpt pi          # subset of hosts
node scripts/e2e-host-sweep.mjs --no-turn           # decoration-only (fast)
node scripts/e2e-host-sweep.mjs --observe=40000     # watch the conversation longer
node scripts/e2e-host-sweep.mjs --headless          # re-test headless (Cloudflare-walled; expect blocks)
```

Per host the harness writes to `.output/e2e-host-sweep/<run>/<host>/`:
`evidence.json` (console / pageErrors / network / requestFailed / domDiagnostics /
auth+voice / transcript / observe flags) and screenshots
(`01-before`, `02-transcript`, `0N-observe…`, `99-final`). A run-level `summary.json`
holds the per-host `summarize()` rollup.

## Analysis discipline (don't skip — this is where false findings come from)

1. **Corroborate every finding with a screenshot AND the console trace before
   concluding.** Cheap signals lie: a `transcript=null` / `reply=false` is often a
   *false negative* because the composer **clears on auto-submit** — the turn actually
   succeeded. (This exact trap produced a wrong first read on ChatGPT in the sweep that
   first shipped this tool; the screenshot showed the reply had rendered.)
2. **Attribute to SayPi only.** Hosts emit their own console noise (claude.ai `/v1/toolbox`
   405s, ProseMirror warnings, framework deprecations). `summarize()` splits
   `saypiErrors`/`saypiWarnings` from `hostErrors` for you — file SayPi-attributable
   issues, not host noise.
3. **Beware harness artifacts.** Some signals are produced by the headed/background-tab
   harness, not normal use (e.g. an `exitFullscreen` "Document not active" rejection is
   amplified by a non-focused tab). Label these honestly.
4. **`/transcribe` is invisible to the page listener** — it routes via the background SW
   (so STT success shows in the console "Transcribed N words" line + the composer, not
   in `network[]`). Don't read its absence as a failure.
5. **Dedup before filing** — check open **and closed** issues (`gh issue list --state all`);
   host DOM-drift is a recurring class (#350/#351/#352/#362), so a "new" drift may be a
   re-occurrence or already tracked.
6. **Honest per-host reporting.** A host whose core flows are healthy should be reported
   **clean, with evidence** — do not pad with a low-value issue just to hit a per-host
   count.

## Filing

File SayPi-attributable, novel, verified defects per the **Issue Authoring Standard**
(`AGENTS.md`): Problem / Scope / Reproduction-verification (expected vs actual) /
Acceptance criteria / Notes-Hypotheses (non-binding). Note in the body that it was found
via this Layer-4 CDP sweep on the current commit. File automation blockers too (label
`enhancement` + `agent`; there is no `testing` label in this repo).

## Boundaries

- **Headed only** for Cloudflare hosts → a visible window; machine must be unlocked. Not
  cron. Not CI.
- Real-host DOM **drifts** — the sweep confirms behavior, it is not a frozen contract.
- The synthetic source plays **one** utterance per call (`loop:false`); it cannot be
  re-armed mid-call, so **multi-turn** conversations can't be driven synthetically today
  (issue #364). Single-turn per host is what the sweep covers.
- Built on `scripts/layer4cdp-lib.mjs` (launch/Cloudflare/profile helpers) +
  `scripts/e2e-host-sweep-lib.mjs` (pure: host registry, arg parse, console attribution,
  summary — unit-tested in `test/scripts/e2e-host-sweep-lib.spec.ts`).
```
