# State machines (XState v5)

The app's complex voice/conversation/dictation flows are modelled as **XState v5**
state machines. This README is the fast-orientation guide for agents working here —
read it before adding or changing a machine, or wiring one into a module.

> **Version: XState v5** (`xstate@^5.20.1`). The codebase was migrated from v4 in
> 2026-06 (#401 safety net, #402 cutover). Do **not** write v4 idioms — they are gone
> on purpose. See the migration spec at
> [`doc/specs/2026-06-21-xstate-v5-migration-design.md`](../../doc/specs/2026-06-21-xstate-v5-migration-design.md).

## What lives here

Ten machines in `src/state-machines/`. The load-bearing ones:
`ConversationMachine` (the voice call), `DictationMachine` (universal dictation),
`AudioInputMachine` (mic/VAD), `AudioOutputMachine` (TTS playback),
`AudioRetryMachine` (Safari reload), `SessionAnalyticsMachine`. Plus small ones:
`FocusMachine`, `ScreenLockMachine`, `ThemeToggleMachine`, `VoiceConverter`.

Two construction shapes — check the file:
- **Standalone singletons:** `export const audioInputMachine = setup({...}).createMachine({...})`
  (also `audioOutputMachine`, `voiceConverterMachine`, and `export const machine` in
  `AudioRetryMachine`/`ScreenLockMachine`/`DictationMachine`/`FocusMachine`/`SessionAnalyticsMachine`
  — e.g. `FocusMachine`'s `machine` is consumed by `FullscreenModule` via `import { machine as focusMachine }`).
- **Dependency-injected factories:** `createConversationMachine(bot)`,
  `createDictationMachine(targetElement?)`, `createThemeToggleMachine(themeManager)` —
  call the factory to get the machine.

## Authoring a machine (v5 conventions)

Use `setup({...}).createMachine({...})`. Put implementations in `setup()` and reference
them by name from the state nodes. Mirror `AudioRetryMachine.ts` — it's the compact
reference conversion.

```ts
import { setup, assign, fromPromise } from "xstate";

export const machine = setup({
  types: { context: {} as Ctx, events: {} as Ev },        // no typestates; types live here
  actions: {
    bump: assign({ n: ({ context }) => context.n + 1 }),  // single-object arg
    notify: ({ context, event }) => EventBus.emit("x"),    // side-effect action
  },
  guards: { canX: ({ context }) => context.n < 5 },        // `cond:` is now `guard:`
  actors: { load: fromPromise(async ({ input }) => fetch(input.url)) },
  delays: { WAIT: ({ context }) => context.delay },
}).createMachine({ context: { n: 0 }, initial: "idle", states: { /* ... */ } });
```

Rules that matter (these are the v4→v5 breaks that bite):
- **Context changes go through `assign` — never mutate `context` in place.** Direct
  mutation does not persist in v5 *and* it leaked across actors in v4 (singleton context).
  That whole bug family was fixed in the migration; don't reintroduce it.
- **Handlers take a single object** `({ context, event }) => …`, not `(context, event)`.
- **`cond:` → `guard:`**.
- **Invoked work is an actor**: `services` → `actors` with `fromPromise`/`fromCallback`;
  `invoke.data` → `invoke.input`; on completion read `event.output` (success) /
  `event.error` (failure) — **not** the old `event.data`.
- No `predictableActionArguments` / `preserveActionOrder` (v5 defaults); no typestates.
- To send within a machine use `raise(...)` (self) / `sendTo(...)` / `sendParent(...)`;
  the v4 `send(...)` action creator is gone.

## Consuming a machine (in a module)

```ts
import { createActor } from "xstate";
import { logStateTransitions } from "../LoggingModule.js";

const actor = createActor(machine);            // NOT interpret()
logStateTransitions(actor, "My Machine");      // v5-correct transition logging
actor.start();
actor.send({ type: "play", source: url });     // events are ALWAYS objects
const snap = actor.getSnapshot();              // .value / .context / .matches(...)
```

- **`.subscribe()` returns a `Subscription`, not the actor.** Do *not* write
  `this.x = createActor(m).subscribe(cb)` — that stores the subscription and breaks
  `.start()`/`.send()`. Assign the actor first, then subscribe.
- **Snapshots have no `.changed` / `.history` / `.event`.** For transition logging use
  `LoggingModule.logStateTransitions(actor, label)`; the snapshot from `getSnapshot()`
  (or a `subscribe` callback) is frozen — read it, don't mutate it.
- **Events are single objects only** — no bare strings (`send("x")`), no two-arg
  (`send("x", payload)`), no arrays (`send(["a","b"])` → send twice).
- ⚠️ **Some senders don't import xstate.** `src/events/EventModule.js` (the EventBus→machine
  translator) and `src/TranscriptionModule.ts` send to actors obtained from
  `StateMachineService` without importing `xstate`, so a "find all xstate usages" grep
  misses them and `tsc` can't flag plain-JS sends. If you change an actor's event API,
  `grep -rn "\.send(" src/ entrypoints/` and check **every** call is an object. The
  headless **e2e** gate is what ultimately catches a missed runtime send.

Actors are interpreted by `src/audio/AudioModule.js`, `src/StateMachineService.js`,
`src/FullscreenModule.ts`, and `src/UniversalDictationModule.ts`.

## Testing a machine

**Always drive specs through the test seam — never raw `createActor`/`interpret`:**

```ts
import { createTestActor } from "./support/testActor"; // ("./state-machines/support/testActor" from the test/ root)

const service = createTestActor(machine);
service.start();
service.send("saypi:call");                       // string + two-arg forms are
service.send("saypi:transcribed", { text: "hi" }); // normalized to v5 objects for you
expect(service.state.matches("listening")).toBe(true);
expect(service.state.context.foo).toBe(1);        // service.state === getSnapshot()
```

`createTestActor` (in `test/state-machines/support/testActor.ts`) is the **single seam**
between specs and the XState runtime — it normalizes legacy send forms and exposes a v4-style
`.state` getter, so the version of XState is concentrated in one file. Don't set up scenarios
by mutating `service.state.context` (frozen in v5); drive the machine with events instead.

- **Characterization suites** (`*-characterization.spec.ts`, one per in-scope machine) pin
  current behaviour — the safety net behind the migration. The unit/contract layer
  (`npm test`) is the required gate; for anything touching the offscreen/VAD/STT wiring,
  the headless **e2e** layer exercises the machines end-to-end.
- **Model-based / path testing** (`@xstate/graph` `createTestModel` + `getShortestPaths`/
  `getSimplePaths`) is the planned complement for the critical machines — tracked in **#404**,
  not yet added.

## Adding or changing a machine — checklist

1. Author with `setup().createMachine()` per the conventions above.
2. Add (or extend) a `*-characterization.spec.ts` driven via `createTestActor`; run
   `npx vitest run test/state-machines/<Machine>*` green.
3. If you change an event/API, fix every consumer **and** the non-importing senders
   (`EventModule.js`, `TranscriptionModule.ts`) — grep `\.send(` repo-wide.
4. `npm test` (tsc + Jest + Vitest) green; for wiring changes also `npm run e2e:build && npm run test:e2e`.

Known deferred bugs the characterization net surfaced: **#403**.
