/**
 * Lifecycle controller for the onboarding "try it yourself" mic meter (#437).
 *
 * The scheduler, clock, and level reader are injected so the loop (tick →
 * report → auto-stop → cleanup) is unit-testable without real Web Audio. The
 * onboarding page wires `readLevel` to an AnalyserNode and `schedule`/`cancel`
 * to requestAnimationFrame.
 */
import { rmsToMeterPercent } from "./audioLevel";

/** What a finished run of the meter actually observed (#615). */
export interface MicMeterResult {
  /** How many level readings were taken. Zero means the run measured nothing. */
  samples: number;
  /** The loudest reading seen (RMS 0..1); 0 when nothing was measured. */
  peakLevel: number;
}

export interface MicMeterDeps {
  /** Returns the current RMS level (0..1). */
  readLevel: () => number;
  /** Called each frame with the clamped meter percentage (0..100). */
  onLevel: (percent: number) => void;
  /**
   * Called once when the meter finishes (duration elapsed or stopped), with
   * what the run measured — so a caller can tell "heard you" from "heard
   * nothing" from "never got started" rather than assuming success.
   */
  onDone?: (result: MicMeterResult) => void;
  /** Schedules the next frame; returns a cancel handle. */
  schedule: (cb: () => void) => number;
  /** Cancels a scheduled frame. */
  cancel: (handle: number) => void;
  /** Monotonic clock in ms. */
  now: () => number;
  /** How long the meter runs before auto-stopping (default 10s). */
  durationMs?: number;
}

export interface MicMeterHandle {
  stop: () => void;
}

export function startMicMeter(deps: MicMeterDeps): MicMeterHandle {
  const durationMs = deps.durationMs ?? 10_000;
  const startedAt = deps.now();
  let handle: number | null = null;
  let finished = false;
  let samples = 0;
  let peakLevel = 0;

  function finish(): void {
    if (finished) return;
    finished = true;
    if (handle !== null) {
      deps.cancel(handle);
      handle = null;
    }
    deps.onDone?.({ samples, peakLevel });
  }

  function frame(): void {
    if (finished) return;
    const level = deps.readLevel();
    samples += 1;
    // Written as a comparison rather than Math.max so a NaN reading is ignored
    // instead of poisoning the peak.
    if (level > peakLevel) peakLevel = level;
    deps.onLevel(rmsToMeterPercent(level));
    if (deps.now() - startedAt >= durationMs) {
      finish();
      return;
    }
    handle = deps.schedule(frame);
  }

  handle = deps.schedule(frame);

  return { stop: finish };
}
