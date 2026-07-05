# E2E dictation sweep — real-host defect hunt for universal dictation

A repeatable, agent-launched sweep that drives a synthetic **dictation** turn into
each configured field (the local test fixture + real, login-free sites) and surfaces
SayPi-attributable defects. This is the universal-dictation counterpart to
`doc/e2e-host-sweep.md` — that sweep covers the three chat hosts'
voice-conversation feature; this one covers `UniversalDictationModule.ts`, the
separate code path that injects a floating per-field button into arbitrary
non-chat-host input fields.

> **Layer:** this is **Layer 4 (CDP)** for real-site targets — real DOM, real
> network, the only layer that can find real-host DOM drift. The local fixture
> target runs through the same harness for convenience (one CDP session, one
> profile) even though it's not subject to drift. Not CI; needs the founder's
> machine unlocked (a visible window opens) for the real-site target.

## What this does NOT cover

Universal dictation has no chat concepts — no model/voice selection, no TTS, no
conversation thread, no assistant reply. Success is just **"spoken text landed in
the focused field."** Activation is the floating `.saypi-dictation-button` injected
per focused field, NOT `#saypi-callButton` (the chat-host mechanism
`e2e-host-sweep.mjs` drives) — confirmed by two live spikes before this harness was
built (see `doc/specs/2026-06-30-e2e-dictation-sweep-design.md`).

Not in v1, by design (see the spec's Non-goals): the right-click "Start Dictation
with Say, Pi" context-menu activation path, cross-field auto-switch, and the
Lexical/Slate/Quill editor strategies (no login-free site using those frameworks was
found — `TextInsertionManager.ts` has dedicated strategies for them, untested here).

## Targets (v1)

Defined in `scripts/e2e-dictation-sweep-lib.mjs`'s `TARGETS` — the extension point
for adding more. See GH issue #163 ("Universal Dictation Platform Support Roadmap")
for what's confirmed-working vs. known-broken before adding a site; a finding that
matches an already-logged known-broken site/behavior there is not novel.

| target | fields | why |
|---|---|---|
| `fixture` (`test/fixtures/test-dictation.html`, served locally) | plain `<input>`, `<textarea>`, plain `<div contenteditable>` | zero-login, zero-drift baseline covering 3 field types in one page |
| `mistral` (`chat.mistral.ai`, branded "Vibe" in-product) | `ProseMirror` contenteditable composer | real, **login-free** (one-time ToS dialog, no sign-in), confirmed-working per issue #163, adds rich-editor-strategy + live-DOM-drift coverage |
| `grok` (`x.com/i/grok`) | plain `<textarea>` composer ("Ask anything") | real; X's own AI assistant embedded in the X web app — **requires X/Twitter sign-in** in the seeded profile (see Preconditions), unlike the other two targets. Not a SayPi chat host (no `ChatbotIdentifier` adapter), so it only gets generic universal dictation — no call button, auto-submit, or TTS. |

Candidates ruled out for v1 (see the design spec for detail): Character.AI
(hard signup wall before any composer is reachable), GitHub (anonymous users can't
reach an actual comment textarea), Gemini (only reachable because the shared seeded
CDP profile happens to carry a logged-in Google session — not a reproducible
login-free path).

## Preconditions

1. **Google Chrome** installed (set `CHROME_PATH` if not at the default).
2. **Seeded CDP profile** at `~/.config/saypi-cdp-profile` (`SAYPI_CDP_PROFILE_DIR`
   to override), with the dev extension profile-installed (Developer mode + Load
   unpacked). See `doc/layer4-cdp-real-host-loop.md` for the one-time setup. No
   SayPi account sign-in is needed (dictation doesn't need auth) — same profile the
   host sweep uses is fine, no extra seeding step for `fixture`/`mistral`.
3. **X/Twitter sign-in for the `grok` target only:** unlike `mistral`, `x.com/i/grok`
   redirects an anonymous visitor to a login wall with no accessible composer — sign
   into an X account in the seeded profile's headed window, once (interactive login,
   same pattern as the SayPi-account seed step in `doc/e2e-host-sweep.md`). There is
   no automatable one-click sign-in here: Google's FedCM account-chooser popup (if
   offered) is a native browser dialog rendered outside the page DOM, so it can't be
   clicked via CDP/Playwright automation — it must be completed by a human in the
   visible window. If the profile isn't signed in, a `grok` run degrades gracefully
   (`buttonAppeared=false`, a `focus:` note) rather than failing hard, since the
   field selector simply won't match the login page.
4. **Dev build at HEAD:** `npm run e2e:build` (the profile-installed unpacked
   extension re-reads `.output/chrome-mv3-dev` from disk on each launch, so
   rebuilding at HEAD = the sweep tests current `main`; confirm via the
   `data-saypi-build` stamp the sweep logs).
5. **`cf_clearance` fresh** (only matters if a future target is Cloudflare-gated):
   `npm run layer4cdp:diagnose` should say **VERDICT: usable**.

## Run it

```bash
npm run e2e:build              # 1. build current HEAD into .output/chrome-mv3-dev
npm run e2e-dictation-sweep    # 2. sweep all v1 targets (headed)

# variants
node scripts/e2e-dictation-sweep.mjs fixture     # local fixture only (fast, no network)
node scripts/e2e-dictation-sweep.mjs mistral     # real-site only
node scripts/e2e-dictation-sweep.mjs grok        # Grok only (needs X sign-in — see Preconditions)
node scripts/e2e-dictation-sweep.mjs --headless  # re-test headless (real-site targets may wall this)
```

Per field the harness writes to
`.output/e2e-dictation-sweep/<run>/<target>__<index>/`: `evidence.json`
(console / pageErrors / requestFailed / decorated / buttonAppeared /
transcriptLanded / transcriptText) and screenshots (`01-focused`, `99-final` or
`99-no-button` on failure). A run-level `summary.json` holds the per-field
`summarizeField()` rollup.

## Analysis discipline (don't skip — this is where false findings come from)

1. **Corroborate every finding with a screenshot AND the console trace before
   concluding.** A `transcriptLanded=false` could mean a real regression, a button
   that never appeared, or a harness timing issue (slow real-site content-script
   injection) — open the screenshot before deciding which.
2. **Attribute to SayPi only.** `summarizeField()` splits `saypiErrors`/
   `saypiWarnings` from `hostErrors` (reusing `e2e-host-sweep-lib.mjs`'s
   `classifyConsoleLine` — Mistral's composer is also ProseMirror, so the same
   host-noise patterns apply).
3. **Dedup against GH issue #163 first**, then open/closed issues generally
   (`gh issue list --state all`). #163 is the existing roadmap/known-broken-sites
   list for this feature — a finding matching its known-broken entries isn't novel;
   comment on/update #163 instead of filing a duplicate `bug` issue. Only genuine
   regressions on already-confirmed-working sites/fields, or new findings on the v1
   fixture (no prior failure history), get a fresh issue.
4. **Honest per-target reporting.** A clean sweep — all targets, all fields,
   transcript landed — is reported clean-with-evidence, not padded with a low-value
   finding to manufacture a defect count.
5. **A `grok` failure on an unauthenticated profile is expected, not a fresh
   defect.** Since `grok` is included in the default (no-args) target list but
   requires a one-time manual X sign-in (see Preconditions), a profile that hasn't
   been signed in will legitimately show `buttonAppeared=false`/`transcriptLanded=false`
   for `grok` while `fixture`/`mistral` stay clean — sign in before concluding
   there's a regression.

## Filing

File SayPi-attributable, novel, verified defects per the **Issue Authoring
Standard** (`AGENTS.md`): Problem / Scope / Reproduction-verification (expected vs
actual) / Acceptance criteria / Notes-Hypotheses (non-binding). Note in the body
that it was found via this Layer-4 CDP dictation sweep on the current commit.
Labels: `bug` (no host-specific labels exist for dictation targets the way the chat
sweep has `claude`/`chatgpt`/`pi ai` — use the target name in the body instead).

## Cost & side effects

Lighter than the host sweep (no SayPi sign-in, no TTS, and the fixture target is fully
local), but a `mistral` or `grok` run still types a real message into a real composer
and spends real SayPi STT calls — purposeful runs only, never an unattended loop. The
`grok` target additionally acts as whichever X account is signed into the seeded
profile (a real, non-cleaned-up entry in Grok's conversation history). Evidence lands
under git-ignored `.output/e2e-dictation-sweep/` — never commit it. Same
shared-profile rule as the host sweep: one CDP harness run at a time (no lockfile
guard).

## Boundaries

- **Headed** for the real-site targets (Mistral and Grok aren't currently known to
  wall headless, but the harness defaults headed for parity with the host sweep and
  to catch a future change). The local fixture target works headless too if ever
  needed, since it has no Cloudflare/bot-detection surface.
- Single dictation turn per field (`loop:false`) — same synthetic-speech limitation
  as the host sweep (issue #364); no multi-utterance or field-switching scenarios.
- Built on `scripts/layer4cdp-lib.mjs` (launch/Cloudflare/profile helpers, shared
  with the host sweep) + `scripts/e2e-dictation-sweep-lib.mjs` (pure: target
  registry, arg parse, transcript-landed check, summary — reuses
  `e2e-host-sweep-lib.mjs`'s `classifyConsoleLine` for console attribution —
  unit-tested in `test/scripts/e2e-dictation-sweep-lib.spec.ts`).
