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

### One-time seed for the TTS/voice-output path

To exercise the **output** path (TTS readback, voice menu, credits) — the half of the
product an unauthenticated/voice-off profile silently skips — the only manual step is,
once, in the seeded profile's headed window (`npm run layer4cdp:seed`):

- **Sign into your SayPi account** (saypi.ai) so the extension has a JWT (interactive
  login — can't be automated). The account needs TTS voices/quota available.

You do **not** need to pick a voice by hand: the sweep **auto-selects a SayPi voice on
claude.ai** before the turn (default on; `--no-select-voice` opts out), driving the real
voice-menu → `setVoice` path so the active provider becomes **`Say, Pi`**. This is the
key nuance the coverage check enforces — only `Say, Pi` counts as SayPi-TTS-exercised
(`isSaypiTtsProvider`); pi.ai's `Speech provided by Pi` is its *native* voice (SayPi
just relays it), `None` is voice-off, and ChatGPT uses native Read Aloud. claude.ai has
no native voice, so it's the clean host to exercise the engine (offscreen audio under
CSP, credits, the #238/#241/#268 cluster). If the account has no voices/quota, the
auto-select finds nothing and the sweep notes "no SayPi voice available".

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
node scripts/e2e-host-sweep.mjs --claude-model=keep # leave Claude's current model (verify Max/slow settings)
node scripts/e2e-host-sweep.mjs --claude-model=opus # force a specific model
node scripts/e2e-host-sweep.mjs --headless          # re-test headless (Cloudflare-walled; expect blocks)
```

**Model selection (claude.ai):** by default the sweep picks **Haiku 4.5** (fastest) on
claude.ai before the turn, so the reply + TTS readback finish inside the observe window.
Opus-Max extended-thinking can exceed it, leaving the turn stuck in `piThinking` until
its 15s safety-net — a *latency* artifact, not a SayPi defect. SayPi's code path
(decoration, readback) is model-independent, so this is purely a faster-iteration choice.
**SayPi must still work on the slowest/Max settings** — verify that explicitly with
`--claude-model=keep` (uses whatever the profile is set to) or `--claude-model=opus`,
accepting longer turns / a possible `piThinking` timeout window.

Per host the harness writes to `.output/e2e-host-sweep/<run>/<host>/`:
`evidence.json` (console / pageErrors / network / requestFailed / domDiagnostics /
auth+voice / transcript / observe flags / `finalUrl` + `undecorated` + `decoration`) and
screenshots (`01-before`, `02-transcript`, `0N-observe…`, `99-final`). A run-level
`summary.json` holds the per-host `summarize()` rollup.

## Analysis discipline (don't skip — this is where false findings come from)

1. **Corroborate every finding with a screenshot AND the console trace before
   concluding.** Cheap signals lie: a `transcript=null` / `reply=false` is often a
   *false negative* because the composer **clears on auto-submit** — the turn actually
   succeeded. (This exact trap produced a wrong first read on ChatGPT in the sweep that
   first shipped this tool; the screenshot showed the reply had rendered.)
2. **`decorated=false` is not automatically drift — read `undecorated.kind` first.**
   A host can fail to decorate because SayPi never got a chat app to decorate. The
   harness classifies it for you from the requested vs. **final** URL (`evidence.finalUrl`
   — hosts bounce you *after* load, so this is re-read at the decoration deadline) plus
   any sign-in affordance on the page. Every undecorated host gets one of these six —
   `undecorated` is null **only** when the host decorated:
   - `redirected-off-origin` — we left the requested origin (the live case: pi.ai now
     bounces signed-out visitors from `pi.ai/talk` to the `hey.pi.ai` splash, #559).
     **Automation/seeding problem** — sign in to the seeded profile and re-run. Says
     nothing about SayPi.
   - `signed-out` — right origin, sign-in wall instead of the chat app. Same:
     automation/seeding, re-seed and re-run.
   - `possible-drift` — the requested page rendered and SayPi still didn't decorate it.
     **This is the real defect case** — hunt it against `domDiagnostics`. The classifier
     deliberately biases here: a sign-in button alone stays `possible-drift` (as a caveat
     in the note), because a false "signed out" would bury the very defect class this
     sweep exists to find. The probe behind that caveat counts a control that is not
     hidden by `display:none` / `visibility:hidden` / `[hidden]` / `aria-hidden`; it does
     **not** model layout, so a zero-sized or off-screen control still counts.
   - `internal-inconsistency` — the miss is **contradicted by the run's own evidence**
     (#570): the call button *was* in the DOM. Never file this as drift; read
     `decoration.contradiction` for which of the four stories it is, and
     `decoration.nextStep` for what to do. This is the verdict the 2026-07-29 run should
     have produced (`callButtons: 1` and a screenshot of the button, filed as
     `possible-drift`).
   - `run-aborted` — the run ended before the page could be judged at all (a Cloudflare
     challenge, or an exception mid-host — see `cloudflareBlocked` / `notes[]`). Fix the
     run and re-run; says nothing about SayPi.
   - `unknown` — no usable final URL; fall back to `01-before.png`.

   **2b. Then read `evidence.decoration` — the measurement behind the one bit (#570).**
   `decorated` is a single `waitForSelector("#saypi-callButton", { timeout: 25_000 })`,
   and its default `state: 'visible'` needs a **non-empty bounding box** —
   `querySelectorAll` (what `domDiagnostics.callButtons` counts) does not. So the harness
   also records, every run: whether the button was **ever** in the DOM, **when it first
   appeared relative to navigation** (`firstSeenMs`, timed by a watcher installed via
   `addInitScript` *before* the page loads), and its **box + computed
   display/visibility/opacity at the deadline**. Healthy hosts are sub-second — the
   direct probe behind #570 measured claude.ai at **+771ms** — so a `firstSeenMs` in the
   seconds is itself a finding.

   The sequencing matters and is deliberate: **`01-before.png` and `domDiagnostics` are
   captured AFTER the decoration wait**, which is exactly how they can outvote it. On a
   miss the harness also keeps *looking* for a bounded 5s more (`DECORATION_GRACE_MS`) by
   **DOM presence** (`state: 'attached'`) rather than visibility — a run that stops
   observing at the deadline structurally cannot tell "never in the DOM" from "in the
   DOM, just later than the budget", since both read as absent. That read costs a healthy
   host nothing, never changes `decorated`, and leaves the 25s budget alone; it just
   means a `possible-drift` verdict now rests on **measured** absence.

   When the evidence does outvote the verdict, `describeDecoration()` names which of four
   stories it is:

   | `decoration.contradiction` | means | owner |
   |---|---|---|
   | `visible-but-missed` | present *with* a non-empty box at the deadline — the wait should have resolved | automation (re-run; **not** drift) |
   | `present-but-invisible` | in the DOM but boxless / `display:none` — the visible-wait failed legitimately | SayPi (a **rendering** defect) |
   | `appeared-after-check` | absent at the deadline, found by the grace re-read or the later census — decoration finished past the budget (with the real `firstSeenMs`) | SayPi (a **latency** finding) |
   | `removed-before-check` | timed a first sighting, gone by the deadline | SayPi (a **teardown/re-render** defect) |

   `contradiction: null` on a miss is what makes `possible-drift` trustworthy rather than
   merely unrefuted: the note then states outright that the button never entered the DOM.
   `summary.json` carries `decorationEverPresent` / `decorationFirstSeenMs` /
   `decorationContradiction` so a whole run can be scanned at a glance, and the per-host
   log line prints `firstSeen=+Nms` plus a loud `⚠️ CONTRADICTED(...)`.
3. **Attribute to SayPi only.** Hosts emit their own console noise (claude.ai `/v1/toolbox`
   405s, ProseMirror warnings, framework deprecations). `summarize()` splits
   `saypiErrors`/`saypiWarnings` from `hostErrors` for you — file SayPi-attributable
   issues, not host noise.
4. **Beware harness artifacts.** Some signals are produced by the headed/background-tab
   harness, not normal use (e.g. an `exitFullscreen` "Document not active" rejection is
   amplified by a non-focused tab). Label these honestly.
5. **`/transcribe` is invisible to the page listener** — it routes via the background SW
   (so STT success shows in the console "Transcribed N words" line + the composer, not
   in `network[]`). Don't read its absence as a failure.
6. **Dedup before filing** — check open **and closed** issues (`gh issue list --state all`);
   host DOM-drift is a recurring class (#350/#351/#352/#362), so a "new" drift may be a
   re-occurrence or already tracked.
7. **Honest per-host reporting.** A host whose core flows are healthy should be reported
   **clean, with evidence** — do not pad with a low-value issue just to hit a per-host
   count.

## Filing

File SayPi-attributable, novel, verified defects per the **Issue Authoring Standard**
(`AGENTS.md`): Problem / Scope / Reproduction-verification (expected vs actual) /
Acceptance criteria / Notes-Hypotheses (non-binding). Note in the body that it was found
via this Layer-4 CDP sweep on the current commit. File automation blockers too (label
`enhancement` + `agent`; there is no `testing` label in this repo).

## Cost & side effects (know what a run spends)

A default sweep is **not free or traceless** — it acts as the founder on real accounts:

- **Real messages.** Each host receives a real user message (the synthetic transcript)
  in a **new conversation that is not cleaned up afterwards**; on auto-submit hosts the
  assistant genuinely replies. Repeated runs accumulate junk conversations on the
  founder's pi.ai / claude.ai / chatgpt.com accounts.
- **Real quota.** A run consumes Claude/ChatGPT plan quota, SayPi STT calls, and (when
  voice-on) SayPi TTS credits. Run on-demand with a purpose; never in an unattended
  loop or cron.
- **The model switch persists.** The default `--claude-model=haiku` selection is a real
  UI click and stays set on the profile after the run; use `--claude-model=keep` to
  avoid changing it.
- **Evidence can contain account data.** Screenshots and captured console/network lines
  may include account names, conversation content, and auth-adjacent headers. They live
  under git-ignored `.output/e2e-host-sweep/` — never commit them, and check before
  pasting any into a GitHub issue.
- **One CDP run at a time.** All Layer-4 harnesses share the one seeded profile
  (`~/.config/saypi-cdp-profile`) and there is no lockfile guard — don't run two
  sweeps/verifies concurrently (the `/sweep` skill runs its two harnesses sequentially
  for exactly this reason).

## Boundaries

- **Headed only** for Cloudflare hosts → a visible window; machine must be unlocked. Not
  cron. Not CI.
- Real-host DOM **drifts** — the sweep confirms behavior, it is not a frozen contract.
- The synthetic source plays **one** utterance per call (`loop:false`); it cannot be
  re-armed mid-call, so **multi-turn** conversations can't be driven synthetically today
  (issue #364). Single-turn per host is what the sweep covers.
- **The redirect classifier's live path is unproven.** `classifyUndecorated` and the
  sign-in probe are unit-tested, but the mechanism that feeds them — re-reading
  `page.url()` *after* the 25s decoration wait, so a client-side bounce that fires past
  `domcontentloaded` is caught — has never run against a bouncing host. The case that
  motivated it (signed-out `pi.ai/talk` → `hey.pi.ai`) is no longer reproducible: the
  seeded profile is signed in to pi.ai, so `/talk` doesn't bounce. The `finally` guard
  that makes "every undecorated host has a kind" true IS run — `sweepHost` is importable
  and `…-undecorated-wiring.spec.ts` drives it against stub pages — but only the
  after-the-wait `page.url()` re-read still awaits a real bouncing host. So the first
  real `redirected-off-origin` verdict should be sanity-checked against `01-before.png`
  rather than trusted outright (#559).
- **The decoration measurement's `hasBox` is only meaningful in a real browser.**
  `DECORATION_PROBE` reads `getBoundingClientRect()`, which JSDOM reports as all zeros,
  so the unit tests stub the rect. And `firstSeenMs` is navigation-relative *provided*
  the `addInitScript` watcher took: if only the defensive post-load install ran, the
  reading carries `presentAtInstall: true` / `firstSeenExact: false` and the number is an
  **upper bound**, which the evidence sentence says out loud. The `visible-but-missed`
  flavour has not yet been reproduced deliberately — it was inferred from the 2026-07-29
  bundle, so the first live one is worth checking against `01-before.png` (#570).
- Built on `scripts/layer4cdp-lib.mjs` (launch/Cloudflare/profile helpers) +
  `scripts/e2e-host-sweep-lib.mjs` (pure: host registry, arg parse, console attribution,
  summary, per-host DOM diagnostics, the undecorated classifier + sign-in probe, the
  decoration watcher/probe + `describeDecoration` — unit-tested in
  `test/scripts/e2e-host-sweep-lib.spec.ts`, `…-diags.spec.ts`, `…-undecorated.spec.ts`,
  `…-decoration.spec.ts`; the `sweepHost` wiring in `…-undecorated-wiring.spec.ts`).
```
