import { createActor, type AnyStateMachine } from "xstate";

/**
 * Migration-resilient test harness for the XState machines.
 *
 * This is the single seam between the specs and the XState runtime. It wraps
 * XState v5's `createActor()` and exposes a small facade mirroring the surface
 * the specs use: `.start()`, `.stop()`, `.send()`, `.state`, `.getSnapshot()`,
 * `.subscribe()`. (Before the v4 -> v5 upgrade this wrapped `interpret()` and a
 * v4 `State`; keeping the facade meant the upgrade touched only this file.)
 *
 * It normalizes events so the specs' existing call styles keep working:
 *  - string events  `send('saypi:call')`            -> `{ type: 'saypi:call' }`
 *  - the v4 two-arg  `send('x', { foo: 1 })`         -> `{ type: 'x', foo: 1 }`
 * v5's `actor.send` only accepts a single event object, so this normalization is
 * what lets the pre-existing specs run unchanged on v5.
 *
 * `.state` returns the current snapshot (`actor.getSnapshot()`), which carries
 * `.value`, `.context`, and `.matches()` — the same shape the specs read.
 *
 * Types are intentionally loose (`any` on the snapshot) so the test surface is
 * not coupled to exact snapshot generics; the assertions do the real checking.
 */

type SendableEvent = string | { type: string; [key: string]: unknown };

export interface TestActor {
  /** Start the actor. Returns the facade for chaining. */
  start(): TestActor;
  /** Stop the actor. */
  stop(): void;
  /**
   * Send an event. Accepts a full event object, a bare type string, or the
   * legacy two-arg form `send('x', { foo: 1 })` (merged into `{ type: 'x', foo: 1 }`).
   */
  send(event: SendableEvent, payload?: Record<string, unknown>): void;
  /** Current snapshot. Has `.value`, `.context`, and `.matches()`. */
  readonly state: any;
  /** Current snapshot (alias of `state`). */
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

export function createTestActor(machine: AnyStateMachine): TestActor {
  const actor = createActor(machine);
  const facade: TestActor = {
    start() {
      actor.start();
      return facade;
    },
    stop() {
      actor.stop();
    },
    send(event, payload) {
      actor.send(normalize(event, payload) as any);
    },
    get state() {
      return actor.getSnapshot();
    },
    getSnapshot() {
      return actor.getSnapshot();
    },
    subscribe(observer) {
      return actor.subscribe(observer as any);
    },
  };
  return facade;
}
