import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createTestActor } from './support/testActor';
import EventBus from '../../src/events/EventBus.js';

// The machine emits on EventBus.emit during reload/play side-effects. Spy on it
// so we can assert the emitted events without exercising real subscribers.
vi.spyOn(EventBus, 'emit');

// System under test: AudioRetryMachine exports a ready-built `machine`.
import { machine as audioRetryMachine } from '../../src/state-machines/AudioRetryMachine';

// Constants mirrored from the machine source for assertion clarity.
const AUDIO_RELOAD_DELAY_MS = 1500;
const AUDIO_LOAD_TIMEOUT_MS = 4000; // WaitingWhileLoading `after` delay
const MAX_RETRY_ATTEMPTS = 5;

describe('AudioRetryMachine characterization', () => {
  let service: any;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(1_000_000));
    vi.mocked(EventBus.emit).mockClear();
    // CHARACTERIZATION / test-isolation note: the exported `machine` is a
    // singleton whose actions mutate `context` BY REFERENCE (e.g.
    // `context.retries++`, `context.retries = 0`) instead of using `assign`.
    // Those mutations therefore persist on the shared machine config object and
    // leak across actor instances. We seed a FRESH context object per test via
    // `withContext` so each test starts from the documented defaults. See the
    // "shared mutable context" suspected bug in the report.
    const machine = audioRetryMachine.withContext({
      delay: AUDIO_RELOAD_DELAY_MS,
      retries: 0,
      startTime: 0,
    });
    service = createTestActor(machine);
    service.start();
  });

  afterEach(() => {
    try {
      service?.stop();
    } catch {
      /* noop */
    }
    // Drain any `after`/delay timers the actor scheduled so they cannot leak
    // into the next test's fake-timer clock.
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  describe('initial state and context', () => {
    it('starts in Idle with default context', () => {
      const snap = service.state;
      expect(snap.matches('Idle')).toBe(true);
      expect(snap.context).toMatchObject({
        delay: AUDIO_RELOAD_DELAY_MS,
        retries: 0,
        startTime: 0,
      });
    });
  });

  describe('Idle transitions', () => {
    it('play -> Playing', () => {
      service.send('play');
      expect(service.state.matches('Playing')).toBe(true);
    });

    it('abort -> Reloading', () => {
      service.send('abort');
      expect(service.state.matches('Reloading')).toBe(true);
    });

    it('error -> Reloading', () => {
      service.send('error');
      expect(service.state.matches('Reloading')).toBe(true);
    });

    it('emptied -> Idle and resets the retry counter', () => {
      // Dirty the context first so the reset is observable.
      service.state.context.retries = 3;
      service.state.context.delay = 9999;
      service.send('emptied');
      expect(service.state.matches('Idle')).toBe(true);
      expect(service.state.context.retries).toBe(0);
      expect(service.state.context.delay).toBe(AUDIO_RELOAD_DELAY_MS);
    });

    it('sourceChanged stays in Idle and resets the retry counter (no target)', () => {
      service.state.context.retries = 2;
      service.state.context.delay = 6000;
      service.send('sourceChanged');
      // No target on this transition => remains in Idle.
      expect(service.state.matches('Idle')).toBe(true);
      expect(service.state.context.retries).toBe(0);
      expect(service.state.context.delay).toBe(AUDIO_RELOAD_DELAY_MS);
    });

    it('ignores events that have no handler in Idle (pause/ended/loadedmetadata/canplaythrough)', () => {
      // Idle only declares play/abort/error/emptied/sourceChanged. Anything else
      // is a no-op: the actor stays in Idle and emits nothing.
      for (const evt of ['pause', 'ended', 'loadedmetadata', 'canplaythrough']) {
        service.send(evt);
        expect(service.state.matches('Idle')).toBe(true);
      }
      expect(EventBus.emit).not.toHaveBeenCalled();
    });
  });

  describe('Playing transitions', () => {
    beforeEach(() => {
      service.send('play');
      expect(service.state.matches('Playing')).toBe(true);
    });

    it('pause -> Paused', () => {
      service.send('pause');
      expect(service.state.matches('Paused')).toBe(true);
    });

    it('abort -> Reloading', () => {
      service.send('abort');
      expect(service.state.matches('Reloading')).toBe(true);
    });

    it('error -> Reloading', () => {
      service.send('error');
      expect(service.state.matches('Reloading')).toBe(true);
    });

    it('ended -> Idle (does NOT reset the retry counter)', () => {
      service.state.context.retries = 4;
      service.send('ended');
      expect(service.state.matches('Idle')).toBe(true);
      // CHARACTERIZATION: `ended` has no resetRetryCounter action, unlike `emptied`.
      expect(service.state.context.retries).toBe(4);
    });

    it('emptied -> Idle and resets the retry counter', () => {
      service.state.context.retries = 4;
      service.send('emptied');
      expect(service.state.matches('Idle')).toBe(true);
      expect(service.state.context.retries).toBe(0);
    });

    it('ignores events that have no handler in Playing (play/loadedmetadata/canplaythrough/sourceChanged)', () => {
      // Playing declares pause/abort/error/ended/emptied. Anything else is a no-op.
      for (const evt of ['play', 'loadedmetadata', 'canplaythrough', 'sourceChanged']) {
        service.send(evt);
        expect(service.state.matches('Playing')).toBe(true);
      }
      expect(EventBus.emit).not.toHaveBeenCalled();
    });
  });

  describe('Paused transitions', () => {
    beforeEach(() => {
      service.send('play');
      service.send('pause');
      expect(service.state.matches('Paused')).toBe(true);
    });

    it('play -> Playing', () => {
      service.send('play');
      expect(service.state.matches('Playing')).toBe(true);
    });

    it('abort -> Reloading', () => {
      service.send('abort');
      expect(service.state.matches('Reloading')).toBe(true);
    });

    it('error -> Reloading', () => {
      service.send('error');
      expect(service.state.matches('Reloading')).toBe(true);
    });

    it('emptied -> Idle and resets the retry counter', () => {
      service.state.context.retries = 2;
      service.send('emptied');
      expect(service.state.matches('Idle')).toBe(true);
      expect(service.state.context.retries).toBe(0);
    });

    it('sourceChanged -> Idle and resets the retry counter', () => {
      service.state.context.retries = 2;
      service.state.context.delay = 6000;
      service.send('sourceChanged');
      // CHARACTERIZATION: unlike Idle.sourceChanged, the Paused variant DOES
      // declare a target (Idle).
      expect(service.state.matches('Idle')).toBe(true);
      expect(service.state.context.retries).toBe(0);
      expect(service.state.context.delay).toBe(AUDIO_RELOAD_DELAY_MS);
    });
  });

  describe('Reloading -> retry cycle (RELOAD_DELAY dynamic delay)', () => {
    it('after the reload delay, with retries remaining, goes to WaitingWhileLoading and runs reload actions', () => {
      service.send('error'); // Idle -> Reloading
      expect(service.state.matches('Reloading')).toBe(true);

      // Nothing fires before the delay elapses.
      vi.advanceTimersByTime(AUDIO_RELOAD_DELAY_MS - 1);
      expect(service.state.matches('Reloading')).toBe(true);
      expect(EventBus.emit).not.toHaveBeenCalled();

      // Cross the RELOAD_DELAY boundary (delay = 1500 on first entry).
      vi.advanceTimersByTime(1);
      expect(service.state.matches('WaitingWhileLoading')).toBe(true);

      // forceReload emits audio:reload, increaseDelay doubles, incrementRetryCounter bumps.
      expect(EventBus.emit).toHaveBeenCalledWith('audio:reload');
      expect(service.state.context.retries).toBe(1);
      expect(service.state.context.delay).toBe(AUDIO_RELOAD_DELAY_MS * 2);
      // forceReload sets startTime on the first retry (retries was 0) using
      // Date.now() at the moment the reload action runs — i.e. AFTER the 1500ms
      // reload delay has elapsed on the (fake) system clock.
      expect(service.state.context.startTime).toBe(1_000_000 + AUDIO_RELOAD_DELAY_MS);
    });

    it('uses the (doubled) context.delay for the second reload, proving RELOAD_DELAY is dynamic', () => {
      service.send('error'); // -> Reloading, delay still 1500
      vi.advanceTimersByTime(AUDIO_RELOAD_DELAY_MS); // -> WaitingWhileLoading, delay now 3000, retries 1

      expect(service.state.matches('WaitingWhileLoading')).toBe(true);
      expect(service.state.context.delay).toBe(3000);

      // Time out of WaitingWhileLoading (4000ms `after`) back into Reloading.
      // decreaseDelayAfterTimeout: max(1500, 3000 - 4000) = 1500.
      vi.advanceTimersByTime(AUDIO_LOAD_TIMEOUT_MS);
      expect(service.state.matches('Reloading')).toBe(true);
      expect(service.state.context.delay).toBe(AUDIO_RELOAD_DELAY_MS);

      // The second reload must wait the new (1500ms) delay.
      vi.mocked(EventBus.emit).mockClear();
      vi.advanceTimersByTime(AUDIO_RELOAD_DELAY_MS - 1);
      expect(service.state.matches('Reloading')).toBe(true);
      vi.advanceTimersByTime(1);
      expect(service.state.matches('WaitingWhileLoading')).toBe(true);
      expect(EventBus.emit).toHaveBeenCalledWith('audio:reload');
      expect(service.state.context.retries).toBe(2);
    });

    it('ignores error/abort/play/pause/ended while Reloading (only load events or the delay transition it)', () => {
      service.send('error'); // Idle -> Reloading
      expect(service.state.matches('Reloading')).toBe(true);
      vi.mocked(EventBus.emit).mockClear();

      // Reloading only declares loadedmetadata/canplaythrough (+ an `after`
      // delay). It does NOT re-handle error/abort, so a second error mid-reload
      // is swallowed and the existing reload timer keeps running.
      for (const evt of ['error', 'abort', 'play', 'pause', 'ended']) {
        service.send(evt);
        expect(service.state.matches('Reloading')).toBe(true);
      }
      expect(EventBus.emit).not.toHaveBeenCalled();

      // The original reload timer still fires after the delay.
      vi.advanceTimersByTime(AUDIO_RELOAD_DELAY_MS);
      expect(service.state.matches('WaitingWhileLoading')).toBe(true);
      expect(EventBus.emit).toHaveBeenCalledWith('audio:reload');
    });

    it('preserves startTime across retries (only set on the first retry, when retries === 0)', () => {
      service.send('error'); // -> Reloading
      vi.advanceTimersByTime(AUDIO_RELOAD_DELAY_MS); // retry 1: startTime stamped
      const firstStartTime = service.state.context.startTime;
      expect(firstStartTime).toBe(1_000_000 + AUDIO_RELOAD_DELAY_MS);

      // Cycle back to Reloading (timeout) and drive a second retry at a LATER
      // system clock. forceReload's `if (context.retries === 0)` guard means
      // startTime must NOT be re-stamped on the second retry.
      vi.advanceTimersByTime(AUDIO_LOAD_TIMEOUT_MS); // -> Reloading, delay back to 1500
      vi.advanceTimersByTime(service.state.context.delay); // retry 2
      expect(service.state.context.retries).toBe(2);
      expect(service.state.context.startTime).toBe(firstStartTime);
    });

    it('reaching max retries lands in Idle instead of reloading again', () => {
      // Pre-load context to the edge: retries already at max so the second
      // candidate transition (maxRetriesReached) is taken.
      service.send('error'); // -> Reloading
      service.state.context.retries = MAX_RETRY_ATTEMPTS; // 5 >= 5

      vi.mocked(EventBus.emit).mockClear();
      vi.advanceTimersByTime(service.state.context.delay);

      // CHARACTERIZATION: maxRetriesReached guard wins -> Idle, no reload emitted.
      expect(service.state.matches('Idle')).toBe(true);
      expect(EventBus.emit).not.toHaveBeenCalledWith('audio:reload');
    });

    it('exhausts all retries then falls back to Idle (full integration of the retry loop)', () => {
      service.send('error'); // -> Reloading
      vi.mocked(EventBus.emit).mockClear();

      // The dynamic delay on each Reloading entry. increaseDelay doubles on
      // entering WaitingWhileLoading; decreaseDelayAfterTimeout = max(1500,
      // delay-4000) on the timeout back to Reloading. So per cycle:
      //   enter Reloading @1500 -> Waiting @3000 -> timeout -> Reloading @1500 ...
      // i.e. every Reloading entry uses delay 1500.
      const expectedDelayOnReloadEntry = AUDIO_RELOAD_DELAY_MS;

      // Drive five complete retry cycles. Each cycle:
      //   Reloading --(delay)--> WaitingWhileLoading --(4000 timeout)--> Reloading
      for (let i = 0; i < MAX_RETRY_ATTEMPTS; i++) {
        expect(service.state.matches('Reloading')).toBe(true);
        expect(service.state.context.delay).toBe(expectedDelayOnReloadEntry);
        // Advance the current dynamic delay to leave Reloading.
        vi.advanceTimersByTime(service.state.context.delay);
        expect(service.state.matches('WaitingWhileLoading')).toBe(true);
        expect(service.state.context.retries).toBe(i + 1);
        // increaseDelay doubled the delay on entry to WaitingWhileLoading.
        expect(service.state.context.delay).toBe(expectedDelayOnReloadEntry * 2);
        // Time out of WaitingWhileLoading back into Reloading.
        vi.advanceTimersByTime(AUDIO_LOAD_TIMEOUT_MS);
      }

      // forceReload fired audio:reload once per retry across all five cycles.
      const reloadCalls = vi
        .mocked(EventBus.emit)
        .mock.calls.filter(([evt]) => evt === 'audio:reload');
      expect(reloadCalls).toHaveLength(MAX_RETRY_ATTEMPTS);

      // Now retries === 5; the next RELOAD_DELAY elapse hits maxRetriesReached.
      expect(service.state.matches('Reloading')).toBe(true);
      expect(service.state.context.retries).toBe(MAX_RETRY_ATTEMPTS);
      vi.mocked(EventBus.emit).mockClear();
      vi.advanceTimersByTime(service.state.context.delay);
      expect(service.state.matches('Idle')).toBe(true);
      // The max-retries fallthrough runs NO actions (no reload, no play).
      expect(EventBus.emit).not.toHaveBeenCalled();
    });
  });

  describe('Reloading recovery via load events', () => {
    beforeEach(() => {
      service.send('error'); // Idle -> Reloading
      expect(service.state.matches('Reloading')).toBe(true);
    });

    it('loadedmetadata -> Playing, resets retries and forces play', () => {
      service.state.context.retries = 2;
      service.state.context.delay = 6000;
      vi.mocked(EventBus.emit).mockClear();

      service.send('loadedmetadata');
      expect(service.state.matches('Playing')).toBe(true);
      // resetRetryCounter
      expect(service.state.context.retries).toBe(0);
      expect(service.state.context.delay).toBe(AUDIO_RELOAD_DELAY_MS);
      // forcePlay emits audio:output:play
      expect(EventBus.emit).toHaveBeenCalledWith('audio:output:play');
    });

    it('canplaythrough -> Playing, resets retries and forces play', () => {
      service.state.context.retries = 3;
      vi.mocked(EventBus.emit).mockClear();

      service.send('canplaythrough');
      expect(service.state.matches('Playing')).toBe(true);
      expect(service.state.context.retries).toBe(0);
      expect(EventBus.emit).toHaveBeenCalledWith('audio:output:play');
    });
  });

  describe('WaitingWhileLoading transitions', () => {
    beforeEach(() => {
      // Idle -> Reloading -> (1500ms) -> WaitingWhileLoading
      service.send('error');
      vi.advanceTimersByTime(AUDIO_RELOAD_DELAY_MS);
      expect(service.state.matches('WaitingWhileLoading')).toBe(true);
      vi.mocked(EventBus.emit).mockClear();
    });

    it('loadedmetadata -> Playing, resets retries and forces play', () => {
      service.send('loadedmetadata');
      expect(service.state.matches('Playing')).toBe(true);
      expect(service.state.context.retries).toBe(0);
      expect(service.state.context.delay).toBe(AUDIO_RELOAD_DELAY_MS);
      expect(EventBus.emit).toHaveBeenCalledWith('audio:output:play');
    });

    it('canplaythrough -> Playing, resets retries and forces play', () => {
      service.send('canplaythrough');
      expect(service.state.matches('Playing')).toBe(true);
      expect(service.state.context.retries).toBe(0);
      expect(EventBus.emit).toHaveBeenCalledWith('audio:output:play');
    });

    it('error -> Reloading (does not change retries)', () => {
      const retriesBefore = service.state.context.retries;
      service.send('error');
      expect(service.state.matches('Reloading')).toBe(true);
      expect(service.state.context.retries).toBe(retriesBefore);
    });

    it('abort -> Reloading', () => {
      service.send('abort');
      expect(service.state.matches('Reloading')).toBe(true);
    });

    it('the 4000ms load timeout returns to Reloading and decreases the delay', () => {
      // Entering WaitingWhileLoading the first time set delay = 3000.
      expect(service.state.context.delay).toBe(3000);
      vi.advanceTimersByTime(AUDIO_LOAD_TIMEOUT_MS);
      expect(service.state.matches('Reloading')).toBe(true);
      // decreaseDelayAfterTimeout: max(1500, 3000 - 4000) = 1500.
      expect(service.state.context.delay).toBe(AUDIO_RELOAD_DELAY_MS);
    });

    it('the timeout does NOT fire before 4000ms elapse', () => {
      vi.advanceTimersByTime(AUDIO_LOAD_TIMEOUT_MS - 1);
      expect(service.state.matches('WaitingWhileLoading')).toBe(true);
    });

    it('ignores events with no handler in WaitingWhileLoading (play/pause/ended/emptied)', () => {
      // WaitingWhileLoading declares loadedmetadata/canplaythrough/error/abort
      // (+ the 4000ms timeout). Other events are no-ops and do not cancel the
      // pending timeout.
      for (const evt of ['play', 'pause', 'ended', 'emptied']) {
        service.send(evt);
        expect(service.state.matches('WaitingWhileLoading')).toBe(true);
      }
      expect(EventBus.emit).not.toHaveBeenCalled();
      // The timeout still fires after the full 4000ms.
      vi.advanceTimersByTime(AUDIO_LOAD_TIMEOUT_MS);
      expect(service.state.matches('Reloading')).toBe(true);
    });
  });

  describe('shared mutable context leak (suspected bug)', () => {
    // CHARACTERIZATION: the exported `machine` is a singleton whose actions
    // mutate `context` by reference (e.g. `context.retries++`) instead of using
    // `assign`. Those mutations persist on the shared machine config and leak
    // into every subsequently-interpreted actor. This block pins that CURRENT
    // (buggy) behavior WITHOUT the `withContext` seeding the rest of the suite
    // uses, so the leak is directly observable. See suspectedBugs in the report.
    it('a fresh actor created after a prior run inherits the prior run\'s mutated context', () => {
      // Run #1: drive the retry loop to exhaustion so the shared context is
      // mutated to retries=5 and a non-zero startTime.
      const first = createTestActor(audioRetryMachine).start();
      first.send('error');
      for (let i = 0; i < MAX_RETRY_ATTEMPTS; i++) {
        vi.advanceTimersByTime(first.state.context.delay);
        vi.advanceTimersByTime(AUDIO_LOAD_TIMEOUT_MS);
      }
      expect(first.state.context.retries).toBe(MAX_RETRY_ATTEMPTS);
      const leakedStartTime = first.state.context.startTime;
      expect(leakedStartTime).toBeGreaterThan(0);
      first.stop();

      // Run #2: a brand-new actor off the SAME exported machine. It SHOULD start
      // from the declared defaults {delay:1500, retries:0, startTime:0} but
      // instead inherits the leaked values.
      const second = createTestActor(audioRetryMachine).start();
      expect(second.state.context.retries).toBe(MAX_RETRY_ATTEMPTS); // leaked 5, not 0
      expect(second.state.context.startTime).toBe(leakedStartTime); // leaked, not 0

      // Consequence: because retries already >= 5, an `error` then the reload
      // delay hits maxRetriesReached and goes straight to Idle (skipping the
      // entire reload cycle) instead of attempting a reload.
      vi.mocked(EventBus.emit).mockClear();
      second.send('error');
      expect(second.state.matches('Reloading')).toBe(true);
      vi.advanceTimersByTime(second.state.context.delay);
      expect(second.state.matches('Idle')).toBe(true);
      expect(EventBus.emit).not.toHaveBeenCalledWith('audio:reload');
      second.stop();
    });
  });
});
