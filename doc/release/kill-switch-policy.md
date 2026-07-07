# Kill-switch-by-default — when a change must ship behind a server-side flag

Web stores have **no rollback**: once a version is published and users auto-update,
the only ways back are a server-side mitigation (minutes) or an expedited patch
through store review (days). That asymmetry is why
[`incident-response.md`](incident-response.md)'s first lever is the server-side
kill-switch — but a lever can only be pulled if it exists. This policy makes the
lever's existence a *precondition* of release rather than a lucky accident, which
is also the precondition for ever delegating patch-level submits (#532).

## The rule

> **A change must ship behind a server-side flag if its failure mode is
> user-visible on a shipped version AND it cannot be neutralized by an existing
> server-side lever** (e.g. serving a fallback voice list, omitting an optional
> response field, disabling an endpoint the client degrades gracefully around).

Apply the test per change, at two moments:

- **PR time** (author + reviewer): does this add a user-visible surface or change
  behavior on a critical path (voice turn, TTS playback, dictation, auth)? If yes,
  name the lever in the PR description — the flag, the field, or the existing
  lever that neutralizes it.
- **Release time** (founder, from the packet): the submission packet's
  release-level **Kill-switch coverage** checkbox — every payload change with a
  user-visible failure mode has a named lever or an explicitly accepted residual
  risk. Don't submit with that box unchecked.

"User-visible failure mode" means: if this code is wrong, a user sees breakage —
a crashed menu, a voice turn that won't submit, silent TTS, an error toast. A
change whose worst case is a log line, a telemetry gap, or slightly-suboptimal
behavior inside existing bounds does **not** trip the rule. Pure bug fixes that
restore intended behavior on an already-shipped surface don't trip it either
(their regression class is what the test suite and host sweeps cover) — the rule
targets *new or changed behavior* whose blast radius is unknown until real users
hit it.

## What counts as an acceptable switch

The switch must be **flippable by saypi-api/saypi-saas alone**, with no client
update, on a signal the shipped client **already polls or receives per turn**:

- **A server-side config/feature flag** gating what an existing endpoint serves.
  The precedent: `OPENAI_TTS_ENABLED`, forced `false` on saypi-api production,
  keeps OpenAI voices out of `GET /voices` — the client code (merged in PR #284)
  stays completely dormant until the API flips it. No client-side flag exists or
  is needed; absence from the response *is* the off state.
- **Feature-absence on an additive-optional contract**: the client treats an
  optional response field as "feature present when served". Withdrawing the field
  turns the feature off. Live examples: the ▶ voice-preview button renders only
  when `/voices` serves `sample_url` (`src/tts/VoiceMenu.ts`); the curation
  manifest's `section`/`featured`/`deprecated` fields steer the shortlist, and
  the client falls back to its local heuristic when they're absent
  (`src/tts/VoiceCuration.ts`).
- **A degradable endpoint**: the server 4xx's or empties an endpoint and the
  client's error handling reads it as "feature unavailable" rather than crashing.
  Acceptable only if the graceful-degradation requirement below is actually met
  and tested.

## What does NOT count

- **A client-side preference or setting.** It ships inside the broken bundle; if
  the feature crashes before the pref is read, or the pref UI itself is the
  broken surface, nobody can flip it — least of all us, remotely, for all users.
- **A `const` / env value baked into the bundle.** Changing it *is* a store
  release — the exact thing the switch exists to avoid.
- **"We'll patch quickly."** Store review is days, per store, and Edge is slowest.
  Speed of patching is the fallback plan (incident-response step 3), not coverage.

## Who flips it

**saypi-api** (coordinated with its autonomous session / the founder via a
cross-repo issue). The extension side never flips anything — it merely behaves
differently based on what the server serves. During an incident this is
incident-response step 2: file or urgently update the saypi-api issue naming the
flag and the desired state.

## The graceful-degradation requirement (client side)

Flag-off must look like **feature-absent, not error**. Concretely:

- No uncaught throw, no error toast, no broken adjacent UI when the server stops
  serving the feature. The pre-flag UX simply returns.
- Unknown/absent values from the server take a safe default. The shape of the
  OpenAI-voices near-miss is instructive: the *old* shipped client **threw** on an
  unrecognised `powered_by`, so flipping the flag ON would have crashed voice
  selection for anyone not yet updated. The fix (`retrieveProviderByEngine` in
  `src/tts/SpeechModel.ts`) warns and falls back to SayPi-served — which is why
  the rollout order is client-release *first*, flag-flip *last*
  (`doc/plans/2026-06-21-openai-voices-rollout.md`).
- Pin the off-state in a unit test: serve the flag-off response shape (field
  absent, list without the new entries) and assert the feature is absent and
  nothing errors. That test is what makes the switch trustworthy at 2am.

## Relationship to the release flow

- The rule lives here; [`README.md`](README.md) (the runbook) references it and
  the packet generator (`scripts/release-lib.mjs` → `renderPacket`) emits the
  release-level **Kill-switch coverage** checkbox on every submission packet.
- `AGENTS.md`'s release paragraph points here so the constitution and the
  runbook can't drift apart.
- Out of scope: building new flag infrastructure. saypi-api already has the
  pattern (env-forced flags, additive-optional response fields); this policy only
  requires that new risky features *use* it.

---

## Appendix — flag-coverage audit of merged-but-unreleased changes (2026-07-07)

Payload audited: `v1.13.0..origin/main` (45 commits, through `de842cb`).
Verdicts: **covered** (server lever exists), **not needed** (no user-visible
failure mode / bug fix on an existing surface), **gap** (rule would require a
lever that doesn't exist).

| Change (PRs) | User-visible failure mode | Coverage | Why |
|---|---|---|---|
| Voice catalog & shortlist redesign: capped 4-row menus, HD tier, curation manifest, Marin default, pins, cross-host catalog (#470, #476–#480, #486, #492, #512, #514–#517) | Broken/wrong in-host voice menus on every host | **Covered (content) / gap (behavior)** | The whole surface is driven by `GET /voices` + its curation manifest: the server can serve a minimal ElevenLabs-only list and omit manifest fields, and the client falls back to local heuristics (additive-optional contract; menu-never-empty and grandfathering invariants are unit-pinned). But no lever reverts the client to pre-redesign *menu behavior* (pin store, shortlist logic) if that code itself is defective — see #544. |
| Host Studio settings tab (#471→#479, #473→#480, #520, #522) | Broken settings Voices tab | **Gap (accepted-candidate)** | Pure client render; server controls only the catalog content it displays. Off the voice-turn critical path (in-host menus still work), so residual risk is low — rolled into #544 for an explicit accept-or-cover decision. |
| Voice preview ▶ / free-clip audition (#482, #484, #500) | Preview button errors or mis-parses audio | **Covered** | Feature-absence lever: ▶ renders only when the server serves `sample_url`; withdrawing the field removes the feature entirely. |
| Pi voice-surface fixes: "More voices" door, menu self-close (#495, #496, #498), menu crash fixes (#485), subtitle disambiguation (#478), instant settings→menu sync (#477) | Regression in existing menus | **Not needed** | Bug fixes restoring intended behavior on an already-shipped surface; no new failure surface. |
| Endpointing: turn-outcome events (#511) + submission-wait sign fix (#537) | Voice turn submits too early/late on every host | **Covered** | The signal is server-owned: `pFinishedSpeaking` arrives per turn on `/transcribe` and the server can tune or omit it; the client clamps and bounds the delay (floor/cap in `src/TimerModule.ts`), so the worst degenerate case is the pre-existing max wait, not a hang. The events themselves are telemetry the server may ignore. |
| Onboarding hint on OAuth connect (#493) | None (additive query param the server may ignore) | **Not needed** | Fails invisible: worst case is the hint isn't honored. |
| Dictation fixes (#459, #503, #506, #508) | Regression in universal dictation decoration/typing | **Not needed** | Bug fixes on the shipped dictation surface; regression class covered by unit tests + the dictation sweep. |
| TTS/auth/audio hardening: signed-out synthesis errors (#487), Claude submit race (#489), voice-cache auth invalidation (#457), sign-out routing (#458), offscreen owner-guard (#466), dead `unload` listeners (#513) | Regression in existing TTS/auth paths | **Not needed** | Fixes/hardening of shipped behavior, several of them *improving* graceful degradation (e.g. #487 is exactly the flag-off-must-not-error property). |
| Tooling / e2e / process / docs (#451, #461, #468, #469, #481, #504, #509, #536, #540, #541) | None (not in the shipped bundle's user path) | **Not needed** | Dev/CI/docs only. |

**Gap filed:** [#544](https://github.com/Pedal-Intelligence/saypi-userscript/issues/544)
— the voices redesign cluster (shortlist/pins/Host Studio) ships new client-side
menu behavior with no server-side lever that can revert it; decide explicitly to
accept the residual risk or add a manifest-driven revert before the next store
release.
