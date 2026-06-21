import { interpret, type AnyStateMachine } from "xstate";

/**
 * Migration-resilient test harness for the XState machines.
 *
 * Today this wraps XState v4's `interpret()` and exposes a small facade that
 * mirrors the v4 interpreter surface the specs actually use:
 *   `.start()`, `.stop()`, `.send()`, `.state`, `.getSnapshot()`, `.subscribe()`.
 *
 * Why a facade instead of returning the raw interpreter? So that the v4 -> v5
 * upgrade touches a SINGLE file. When the codebase moves to XState v5 this is
 * the only place that changes:
 *   - `interpret(machine)`        -> `createActor(machine)`
 *   - the `state` getter          -> returns `actor.getSnapshot()`
 *   - `getSnapshot()`             -> `actor.getSnapshot()`
 * The ~400 call sites across `test/state-machines/*.spec.ts` keep working
 * unchanged, because the facade contract is identical on both versions.
 *
 * It also normalizes string events (`send('saypi:call')`) into event objects
 * (`send({ type: 'saypi:call' })`). v4 accepts both; v5 accepts only objects.
 * Normalizing here means the specs' existing string sends survive the upgrade.
 *
 * Types are intentionally loose (`any` on the snapshot) to avoid coupling the
 * test surface to v4-vs-v5 type shapes; the assertions in the specs do the real
 * type-checking work.
 *
 * The optional `context` seed (v4: `machine.withContext`) keeps the one v4-only
 * isolation idiom inside this single seam too. It exists because several machines
 * export a singleton whose actions currently mutate the shared context object in
 * place (a real bug, tracked for the migration), so tests that need a pristine
 * starting context reseed per-test. Once those actions move to `assign` in v5,
 * actors no longer leak and this seed becomes unnecessary — at the v5 flip it maps
 * to `createActor(machine, { input })` or is simply dropped.
 */

type SendableEvent = string | { type: string; [key: string]: unknown };

export interface TestActorOptions {
  /** Seed the actor's starting context (v4 `withContext`); see file header. */
  context?: Record<string, unknown>;
}

export interface TestActor {
  /** Start the actor. Returns the facade for chaining (matches v4 `interpret().start()`). */
  start(): TestActor;
  /** Stop the actor. */
  stop(): void;
  /**
   * Send an event. Accepts:
   *  - a full event object: `send({ type: 'x', foo: 1 })`
   *  - a bare type string: `send('x')`
   *  - the v4 two-arg form: `send('x', { foo: 1 })` (merged into `{ type: 'x', foo: 1 }`)
   * The two-arg form does not exist in v5; normalizing here lets the existing
   * specs survive the upgrade untouched.
   */
  send(event: SendableEvent, payload?: Record<string, unknown>): void;
  /** Current snapshot. Has `.value`, `.context`, and `.matches()`. */
  readonly state: any;
  /** Current snapshot (alias of `state`, for specs that call `getSnapshot()`). */
  getSnapshot(): any;
  /** Subscribe to snapshot changes. */
  subscribe(observer: (snapshot: any) => void): { unsubscribe(): void };
}

const normalize = (
  event: SendableEvent,
  payload?: Record<string, unknown>,
) => {
  const base = typeof event === "string" ? { type: event } : event;
  return payload ? { ...base, ...payload } : base;
};

export function createTestActor(
  machine: AnyStateMachine,
  options?: TestActorOptions,
): TestActor {
  const configured =
    options?.context !== undefined
      ? machine.withContext(options.context as any)
      : machine;
  const service = interpret(configured);
  const facade: TestActor = {
    start() {
      service.start();
      return facade;
    },
    stop() {
      service.stop();
    },
    send(event, payload) {
      service.send(normalize(event, payload) as any);
    },
    get state() {
      return service.state;
    },
    getSnapshot() {
      return service.getSnapshot();
    },
    subscribe(observer) {
      return service.subscribe(observer as any);
    },
  };
  return facade;
}
