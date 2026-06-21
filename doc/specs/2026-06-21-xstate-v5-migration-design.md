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
- [ ] Characterization tests: AudioOutputMachine (fill).
- [ ] Characterization tests: AudioRetryMachine (fill).
- [ ] Characterization tests: AudioInputMachine (harden).
- [ ] Characterization tests: ConversationMachine (harden).
- [ ] Characterization tests: DictationMachine (harden).
- [ ] Characterization tests: SessionAnalyticsMachine (harden).
- [ ] Bug fixes found during char-testing (fail-first), each noted here with issue #.
- [ ] PR A opened, reviewed, CI green, merged.
- [ ] PR B: package.json bump + machine conversions + consumer conversions + helper flip.
- [ ] PR B: `npm test` green on v5.
- [ ] PR B: `e2e` green on v5.
- [ ] PR B opened, reviewed, CI green, merged.
- [ ] Loop done: migration complete + verified e2e. PushNotification sent.

### Iteration log

- **2026-06-21 (iter 1):** Brainstormed + locked decisions; created worktree; wrote this doc;
  built `createTestActor` facade; retrofitted 11 specs (suite green, tsc clean). Committed
  foundation checkpoint. Next: write new characterization tests for the 6 in-scope machines,
  starting with the untested-medium ones (AudioOutput, AudioRetry).
