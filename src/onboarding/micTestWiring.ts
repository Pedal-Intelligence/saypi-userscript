/**
 * Wires the onboarding "try it yourself" mic-test (#437).
 *
 * Web Audio is hidden behind an injectable `acquire()` that yields a level
 * reader + release fn, so the start/stop/toggle/error logic here is fully
 * unit-testable; the default acquire does getUserMedia + AnalyserNode in a real
 * browser. Reuses the slice-3a mic-error classifier for a friendly denial path.
 */
import { computeRms } from "./audioLevel";
import { startMicMeter, type MicMeterHandle } from "./micMeter";
import {
  classifyMicError,
  describeMicRecovery,
} from "../permissions/micPermissionRecovery";

export interface MicSource {
  /** Current RMS level (0..1). */
  readLevel: () => number;
  /** Tears down the stream/audio graph. */
  release: () => void;
}

export interface MicTestElements {
  button: HTMLButtonElement;
  meter: HTMLElement;
  fill: HTMLElement;
  status: HTMLElement;
}

export interface MicTestWiringOptions {
  translate: (key: string, substitutions?: string) => string;
  acquire?: () => Promise<MicSource>;
  schedule?: (cb: () => void) => number;
  cancel?: (handle: number) => void;
  now?: () => number;
  durationMs?: number;
}

async function defaultAcquire(): Promise<MicSource> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const Ctx: typeof AudioContext =
    window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const ctx = new Ctx();
  const source = ctx.createMediaStreamSource(stream);
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 1024;
  source.connect(analyser);
  const data = new Float32Array(analyser.fftSize);
  return {
    readLevel: () => {
      analyser.getFloatTimeDomainData(data);
      return computeRms(data);
    },
    release: () => {
      try {
        source.disconnect();
      } catch {
        /* ignore */
      }
      stream.getTracks().forEach((t) => t.stop());
      void ctx.close();
    },
  };
}

/** Attaches click handling to the mic-test button. Returns a disposer. */
export function wireMicTest(els: MicTestElements, opts: MicTestWiringOptions): () => void {
  const acquire = opts.acquire ?? defaultAcquire;
  const schedule = opts.schedule ?? ((cb) => requestAnimationFrame(cb));
  const cancel = opts.cancel ?? ((h) => cancelAnimationFrame(h));
  const now = opts.now ?? (() => performance.now());
  const durationMs = opts.durationMs ?? 10_000;
  const t = opts.translate;

  let source: MicSource | null = null;
  let meter: MicMeterHandle | null = null;
  let running = false;

  function reset(statusKey: string): void {
    running = false;
    meter = null;
    if (source) {
      source.release();
      source = null;
    }
    els.meter.hidden = true;
    els.fill.style.width = "0%";
    els.button.disabled = false;
    els.button.textContent = t("onboarding_micTestButton");
    els.status.textContent = statusKey ? t(statusKey) : "";
  }

  async function start(): Promise<void> {
    els.button.disabled = true;
    els.status.textContent = t("onboarding_micTestRequesting");
    try {
      source = await acquire();
    } catch (err) {
      const recovery = describeMicRecovery(classifyMicError((err as DOMException)?.name));
      reset("");
      // Show the recovery guidance instead of a generic failure (#437).
      els.status.textContent = t(recovery.bodyKey);
      return;
    }

    running = true;
    els.button.disabled = false;
    els.button.textContent = t("onboarding_micTestStop");
    els.meter.hidden = false;
    els.status.textContent = t("onboarding_micTestListening");

    const src = source;
    meter = startMicMeter({
      readLevel: () => src.readLevel(),
      onLevel: (pct) => {
        els.fill.style.width = `${pct}%`;
      },
      onDone: () => reset("onboarding_micTestDone"),
      schedule,
      cancel,
      now,
      durationMs,
    });
  }

  function onClick(): void {
    if (running) {
      meter?.stop();
    } else {
      void start();
    }
  }

  els.button.addEventListener("click", onClick);
  return () => {
    els.button.removeEventListener("click", onClick);
    meter?.stop();
  };
}
