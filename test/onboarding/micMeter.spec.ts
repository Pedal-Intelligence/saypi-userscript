import { describe, it, expect, vi } from "vitest";
import { startMicMeter } from "../../src/onboarding/micMeter";

/**
 * Drives the meter with a controllable scheduler + clock so we can test the
 * lifecycle (ticking, auto-stop, cleanup) without real Web Audio.
 */
function harness() {
  let pending: (() => void) | null = null;
  let nextId = 1;
  let t = 0;
  return {
    schedule: (cb: () => void) => {
      pending = cb;
      return nextId++;
    },
    cancel: () => {
      pending = null;
    },
    now: () => t,
    advance(ms: number) {
      t += ms;
    },
    tick() {
      const cb = pending;
      pending = null;
      cb?.();
    },
    get hasPending() {
      return pending !== null;
    },
  };
}

describe("startMicMeter (#437)", () => {
  it("reports a meter percent on each tick", () => {
    const h = harness();
    const onLevel = vi.fn();
    startMicMeter({
      readLevel: () => 0.4, // -> 100%
      onLevel,
      schedule: h.schedule,
      cancel: h.cancel,
      now: h.now,
      durationMs: 1000,
    });

    h.tick();
    h.advance(100);
    h.tick();

    expect(onLevel).toHaveBeenCalledWith(100);
    expect(onLevel.mock.calls.length).toBeGreaterThanOrEqual(2);
  });

  it("auto-stops after durationMs and calls onDone exactly once", () => {
    const h = harness();
    const onDone = vi.fn();
    startMicMeter({
      readLevel: () => 0.2,
      onLevel: () => {},
      onDone,
      schedule: h.schedule,
      cancel: h.cancel,
      now: h.now,
      durationMs: 500,
    });

    h.tick(); // t=0
    h.advance(600); // past duration
    h.tick(); // should detect done

    expect(onDone).toHaveBeenCalledTimes(1);
    expect(h.hasPending).toBe(false);

    // no further scheduling after done
    h.advance(1000);
    h.tick();
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it("stop() halts ticking and is idempotent", () => {
    const h = harness();
    const onLevel = vi.fn();
    const meter = startMicMeter({
      readLevel: () => 0.3,
      onLevel,
      schedule: h.schedule,
      cancel: h.cancel,
      now: h.now,
      durationMs: 10000,
    });

    h.tick();
    const callsBefore = onLevel.mock.calls.length;
    meter.stop();
    meter.stop(); // idempotent
    expect(h.hasPending).toBe(false);

    h.advance(100);
    h.tick();
    expect(onLevel.mock.calls.length).toBe(callsBefore);
  });

  it("invokes onDone when stopped so cleanup always runs", () => {
    const h = harness();
    const onDone = vi.fn();
    const meter = startMicMeter({
      readLevel: () => 0.1,
      onLevel: () => {},
      onDone,
      schedule: h.schedule,
      cancel: h.cancel,
      now: h.now,
      durationMs: 10000,
    });
    meter.stop();
    expect(onDone).toHaveBeenCalledTimes(1);
  });
});

describe("what the meter actually measured (#615)", () => {
  it("reports the loudest reading and how many it took", () => {
    const h = harness();
    const onDone = vi.fn();
    const levels = [0.05, 0.3, 0.1];
    let i = 0;
    startMicMeter({
      readLevel: () => levels[Math.min(i++, levels.length - 1)],
      onLevel: () => {},
      onDone,
      schedule: h.schedule,
      cancel: h.cancel,
      now: h.now,
      durationMs: 500,
    });

    h.tick();
    h.tick();
    h.tick();
    h.advance(600);
    h.tick();

    expect(onDone).toHaveBeenCalledWith({ samples: 4, peakLevel: 0.3 });
  });

  it("reports nothing measured when stopped before the first frame", () => {
    const h = harness();
    const onDone = vi.fn();
    const meter = startMicMeter({
      readLevel: () => 0.4,
      onLevel: () => {},
      onDone,
      schedule: h.schedule,
      cancel: h.cancel,
      now: h.now,
      durationMs: 10000,
    });

    meter.stop();

    expect(onDone).toHaveBeenCalledWith({ samples: 0, peakLevel: 0 });
  });

  it("keeps the peak at zero for a silent source", () => {
    const h = harness();
    const onDone = vi.fn();
    const meter = startMicMeter({
      readLevel: () => 0,
      onLevel: () => {},
      onDone,
      schedule: h.schedule,
      cancel: h.cancel,
      now: h.now,
      durationMs: 10000,
    });

    h.tick();
    h.tick();
    meter.stop();

    expect(onDone).toHaveBeenCalledWith({ samples: 2, peakLevel: 0 });
  });
});
