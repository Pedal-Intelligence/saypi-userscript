/**
 * Lifecycle controller for the onboarding "try it yourself" mic meter (#437).
 *
 * The scheduler, clock, and level reader are injected so the loop (tick →
 * report → auto-stop → cleanup) is unit-testable without real Web Audio. The
 * onboarding page wires `readLevel` to an AnalyserNode and `schedule`/`cancel`
 * to requestAnimationFrame.
 */
import { rmsToMeterPercent } from "./audioLevel";

export interface MicMeterDeps {
  /** Returns the current RMS level (0..1). */
  readLevel: () => number;
  /** Called each frame with the clamped meter percentage (0..100). */
  onLevel: (percent: number) => void;
  /** Called once when the meter finishes (duration elapsed or stopped) for cleanup. */
  onDone?: () => void;
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

  function finish(): void {
    if (finished) return;
    finished = true;
    if (handle !== null) {
      deps.cancel(handle);
      handle = null;
    }
    deps.onDone?.();
  }

  function frame(): void {
    if (finished) return;
    deps.onLevel(rmsToMeterPercent(deps.readLevel()));
    if (deps.now() - startedAt >= durationMs) {
      finish();
      return;
    }
    handle = deps.schedule(frame);
  }

  handle = deps.schedule(frame);

  return { stop: finish };
}
