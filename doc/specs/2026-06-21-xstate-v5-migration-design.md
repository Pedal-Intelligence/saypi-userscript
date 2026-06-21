# XState characterization net + v4→v5 migration

**Date:** 2026-06-21
**Status:** IN PROGRESS (see Progress Tracker at the bottom — this doc is the resumable source of truth for the `/loop` driving this work)
**Author:** autonomous session (founder-requested + approved)

## Why

The app's complex voice/conversation flows are modelled with XState, adopted early
and load-bearing ever since. Two strengthening moves were requested:

1. **Unit tests around the state machines** — a behavioral safety net.
2. **Upgrade XState** from the current `4.38.3` to the latest `5.x` (`5.32.1` at time of
   writing). v4→v5 is the big breaking rewrite, not a point bump.

The tests come first *because* they are the thing that makes the migration safe: a green
characterization suite on v4 is the proof that the v5 cutover changed no behavior.

## Decisions (locked with the founder)

| Decision | Choice | Rationale |
|---|---|---|
| Test style | **Safety-net now, model-based later** | Classic behavioral/characterization tests first to de-risk the migration; `@xstate/graph` path-testing layered onto the critical machines *after* v5 (the v4 `@xstate/test` is unmaintained — no stable v5 release). |
| Coverage scope | **Critical + untested-medium** | Harden `Dictation`, `Conversation`, `AudioInput`, `SessionAnalytics`; fill `AudioOutput`, `AudioRetry`. Skip the trivial toggles (`Theme`/`Focus`/`ScreenLock`/`VoiceConverter`) — low risk, compile-gated. |
| Bug policy | **Fix bugs as found** | Done *on v4* during the test-writing phase, fail-first (red→fix→green). The v4 baseline is correct *before* migration, so the v5 cutover still only changes the framework. |
| Migration mode | **Big-bang cutover** | One PR flips everything to v5; the green net proves it behaviour-preserving. (Machines are runtime-independent — none `invoke`/`spawn` another — so a single coherent flip is clean.) |

## Current-state facts (measured 2026-06-21)

- Deps: `xstate@^4.38.2` (resolved 4.38.3), `@xstate/fsm@^2.1.0`, `@xstate/test@^0.5.1`.
  No `@xstate/react`, no `@xstate/graph`.
- 10 machines in `src/state-machines/`. Sizes: Dictation 92KB, Conversation 62KB,
  AudioInput 29KB, SessionAnalytics 11KB, AudioOutput 10KB, AudioRetry 9KB,
  VoiceConverter 4KB, ThemeToggle 4KB, ScreenLock 3KB, Focus 2KB.
- `@xstate/fsm` is used **only** as a `Typestate` *type* import in `SessionAnalyticsMachine.ts`.
- `@xstate/test` is imported in exactly one **disabled** file (`test/SessionAnalytics.spec.disabled.ts`).
- Existing state-machine tests use the classic **`interpret()` + `.send()`** style
  (15 spec files, 152 tests, all green). They do *not* use model-based testing.

### v4 API surface to convert in the migration (measured)

| Change | Count |
|---|---|
| `interpret()` → `createActor()` | 10 |
| `.withConfig/.withContext` → `setup()` + `input` | 2 |
| `cond:` → `guard:` | 31 |
| `services:` → `actors:` | 8 |
| `invoke src:` → `fromPromise`/`fromCallback` | 4 |
| `assign()` + inline actions → v5 single-object arg `({ context, event })` | 47 |
| consumer snapshot access (`.matches/.value/.context`) → `actor.getSnapshot()…` | 108 |
| `predictableActionArguments` flags to remove (already v5 default) | 10 |

The 10 `predictableActionArguments: true` flags are good news — the machines already use
predictable action arguments, so action/assign bodies are close to v5 shape.

Machines are consumed (interpreted) by: `src/audio/AudioModule.js`, `src/StateMachineService.js`,
`src/AIChatModule.ts`, `src/UniversalDictationModule.ts`, `src/FullscreenModule.ts`,
`src/offscreen/synthetic-audio.ts`, `src/offscreen/vad_handler.ts`, `src/vad/OnscreenVADClient.ts`.

## The key trick: a migration-resilient test helper

Introduce `test/state-machines/support/testActor.ts` exposing `createTestActor(machine, opts)`:
- **Today (v4):** wraps `interpret(machine.withContext(...)).start()`; snapshot accessors read
  `service.state.value` / `.context` / `service.state.matches(...)`.
- **After v5:** the same helper wraps `createActor(machine, { input }).start()` and reads
  `actor.getSnapshot()`.

New tests use it, and we retrofit the existing 15 specs onto it. Then the v5 API break in the
test layer is a *one-file* edit, not ~400 call-site edits. (Consumers in `src/` still migrate
directly — the helper only shields the test surface.)

## Plan of work (PRs)

- **PR A — Safety net (this work, on v4):** design doc + this tracker, `createTestActor` helper,
  retrofit existing specs, new characterization tests for the 6 in-scope machines, plus any
  fail-first bug fixes surfaced. Gate: `npm test` green on v4. May split a substantial bug fix
  into its own PR.
- **PR B — Big-bang v4→v5 migration:** `package.json` (`xstate ^4→^5`, drop `@xstate/fsm` +
  dead `@xstate/test`), convert all 10 machines + consumers per the surface table, flip the test
  helper, drop `predictableActionArguments`. Gate: `npm test` **+ required `e2e`** green on v5 —
  that is the proof of behaviour-preservation.
- **(Deferred) PR C — Model-based path testing:** add `@xstate/graph`; `getShortestPaths`/
  `getSimplePaths` on `Conversation` + `Dictation`. Out of scope for "migration complete".

Each PR: own commit(s), independent reviewer-subagent verdict posted on the PR, auto-merge when
CI green + mergeable.

## Risks & mitigations

- **Two giant machines** (Dictation, Conversation) are the bulk of the manual conversion →
  the char-net + `tsc` gate catch regressions; conversion can be parallelised across subagents.
- **Bundle size** (AMO 5MB non-binary) → final state ships only v5; verify build size after PR B.
- **Under-observable side-effects** (DOM/audio) → char-tests mock and assert calls; some effects
  remain hard to observe — residual risk, noted.
- **Concurrent agents on `main`** → small PRs, isolated worktree, land fast.
- **`@xstate/fsm` removal** → it's only a type import; replace with `setup({ types })` in v5.

## Verification (definition of "done" for the loop)

1. `npm test` green (tsc + Jest + Vitest) on v5.
2. Required `e2e` check green (`npm run e2e:build && npm run test:e2e`) on v5.
3. A real-host Layer-4 (CDP) spot check on at least one host, if feasible without founder.
4. PR B merged.

---

## Progress Tracker (update every loop iteration)

- [x] Worktree `.worktrees/xstate-v5` on branch `xstate/safety-net` created off origin/main.
- [x] Toolchain verified in worktree (state-machine vitest baseline: 15 files / 152 tests green).
- [x] Design doc + tracker written.
- [x] `createTestActor` helper written (`test/state-machines/support/testActor.ts`) — v4-interpreter-compatible facade that absorbs the v5 send-signature changes (string events, two-arg `send(type, payload)`).
- [x] Existing 11 interpret-using specs retrofitted onto the helper; full state-machine suite green (15 files / 152 tests) + `tsc` clean.
- [x] Characterization tests: AudioOutputMachine (fill) — 43 tests.
- [x] Characterization tests: AudioRetryMachine (fill) — 34 tests.
- [x] Characterization tests: AudioInputMachine (harden) — 27 tests.
- [x] Characterization tests: ConversationMachine (harden) — 58 tests.
- [x] Characterization tests: DictationMachine (harden) — 45 tests.
- [x] Characterization tests: SessionAnalyticsMachine (harden) — 24 tests.
- [x] Full suite green together: 21 files / 383 tests; tsc clean. Committed (fffb14b).
- [ ] Bug triage (15 suspected bugs surfaced — see Bug Triage section below).
- [ ] PR A opened, reviewed, CI green, merged.
- [ ] PR B: package.json bump + machine conversions + consumer conversions + helper flip.
- [ ] PR B: `npm test` green on v5.
- [ ] PR B: `e2e` green on v5.
- [ ] PR B opened, reviewed, CI green, merged.
- [ ] Loop done: migration complete + verified e2e. PushNotification sent.

## Bug Triage (15 suspected bugs from the characterization pass)

All pinned as current behavior in the safety net (commented `// CHARACTERIZATION`).
Disposition honors the "fix bugs as found" decision while respecting the autonomous
mandate (taste/product calls are escalated, not auto-decided; fixes are scoped, not
bundled into the net).

**Fix during PR B (v5 forces `assign`; behavior-preserving in production):**
1. `AudioRetryMachine` — actions mutate the shared singleton context in place
   (`context.retries++`, `context.delay *= 2`, …) → leaks across actors. **HIGH.**
2. `AudioInputMachine` — `startRecording`/`prepareStop` mutate context directly
   (`recordingStartTime`, `waitingToStop`) → leaks across actors. **MEDIUM.**
3. `ConversationMachine` — `handleTranscriptionResponse` mutates the singleton context
   directly instead of via `assign`. **LOW.**
   → These are inseparable from the v5 `assign` conversion; fixing them there removes the
   leak and the relevant characterization tests flip from "pins leak" to "asserts isolation".

**Clear-cut independent bugs — fix via fail-first TDD (scoped follow-up PRs after migration):**
4. `ConversationMachine.clearMaintainanceFlag` — builds an `assign(...)` but discards it
   (no-op); flag never reset on `responding` exit. **LOW.**
6. `DictationMachine.hasAudio` — ignores `blob.size`, so a 0-byte blob with `duration>0`
   is treated as real audio and uploaded (disagrees with `hasNoAudio`). **LOW.**
7. `AudioInputMachine.sendData` — gates on kB rounded to 2dp (`>0`), dropping sub-~6-byte
   non-empty blobs. **LOW** (near-zero practical impact).

**Product / UX / metric taste calls — file + escalate to founder, do NOT auto-fix:**
5. `ConversationMachine.callStartingPrompt` — discarded `assign` means the pre-call draft is
   never backed up; "fixing" changes placeholder-restore UX.
8. `AudioInputMachine` — DOMException-specific mic-error messages are unreachable (service
   flattens the error to a string), so users always get the generic message.
9. `SessionAnalyticsMachine` — `message_sent` RTF is `Infinity` when no prior transcription.
10. `SessionAnalyticsMachine` — long-running-session activity prompt is unreachable (2h
    `after` > 30-min auto-end invoke, and every `send_message` restarts the invoke).
11. `SessionAnalyticsMachine` — `rollupTranscription` yields negative talk-time (unclamped)
    and conflates a `0` sentinel with a legitimate `0` timestamp.

**Quirks / vestigial / likely-intentional — note only (no fix, no issue):**
- `AudioOutputMachine` — `paused.play` skip branch self-transitions (swallows resume); skip
  flag consumed only inside the taken branch (self-consistent today).
- `AudioRetryMachine` — `Idle.sourceChanged` / `Playing.ended` reset-asymmetry vs siblings.
- `AudioInputMachine` — `microphoneAcquired` guard is a hardcoded `return true` (vestigial).

### Iteration log

- **2026-06-21 (iter 1):** Brainstormed + locked decisions; created worktree; wrote this doc;
  built `createTestActor` facade; retrofitted 11 specs (suite green, tsc clean). Committed
  foundation checkpoint (c280d20).
- **2026-06-21 (iter 2):** Ran the characterization workflow (12 agents) → +231 tests across 6
  new spec files; full suite green (21 files / 383), tsc clean. Committed net (fffb14b). Triaged
  the 15 surfaced bugs (see Bug Triage). Next: open PR A (net), reviewer verdict, merge; then
  PR B = the v5 cutover (fixing the context-mutation leaks via `assign` en route).
