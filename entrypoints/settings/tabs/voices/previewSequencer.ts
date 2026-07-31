/**
 * The Voices studio's audio layer (design §5).
 *
 * A single audition is a one-item sequence, so "play" and "stop-then-play"
 * are the same operation and there is exactly one code path between a click
 * and a clip.
 */

/** One clip in an audition sequence. */
export interface AuditionItem {
  voiceId: string;
  url: string;
  /**
   * Per-clip level match, attenuate-only (design §5.1). 1.0 until the
   * soundprint pass measures voiced RMS; `<audio>.volume` cannot exceed 1.0,
   * so this can quieten a loud clip but never rescue a quiet one.
   */
  gain: number;
}

/**
 * What the whole page knows about playback, as one snapshot.
 *
 * A snapshot, not a per-voice boolean: the shipped player handed each caller a
 * `(playing: boolean)` line scoped to ONE voice, which meant (a) a superseded
 * clip's late callback could write "not playing" into the voice that replaced
 * it, and (b) a repaint had no way to ask what was playing. A snapshot names
 * the voice, so a late write is either fenced out or harmlessly true, and any
 * repaint can restore itself from the last one.
 */
export interface AuditionState {
  running: boolean;
  playingVoiceId: string | null;
  loadingVoiceId: string | null;
  position: { index: number; total: number } | null;
  error: { voiceId: string; kind: "blocked" | "failed" } | null;
}

export const IDLE_AUDITION: AuditionState = Object.freeze({
  running: false,
  playingVoiceId: null,
  loadingVoiceId: null,
  position: null,
  error: null,
});

/**
 * The gap between clips in a sequence. Deliberately not zero: for A/B you need
 * to hear the seam. Predicted jitter with preloaded elements is 10–60 ms
 * against 320 ms — inaudible as inconsistency.
 */
export const AUDITION_BEAT_MS = 320;

/** The absolute ceiling on "long enough to have heard it" (design §8). */
export const HEARD_CEILING_SECONDS = 1.4;
/** The proportional floor, for clips shorter than the ceiling allows. */
export const HEARD_FRACTION = 0.65;

/**
 * Did this playback position count as having heard the voice? (design §8)
 *
 * `ended`, OR `currentTime >= min(1.4 s, 0.65 × duration)` — whichever fires
 * first. Both branches are load-bearing. Measured clip durations are
 * 1.11–2.90 s, so an absolute threshold near 2 s would fire at ~100 % of the
 * catalog and degenerate into completion-only; and completion-only would
 * record nothing during the arrow walk, which interrupts clips BY DESIGN —
 * exactly backwards for the feature this exists to serve. On the shortest clip
 * the rule fires at 0.72 s (past any mis-click); on the longest at 1.4 s.
 *
 * Pure, because jsdom cannot play audio: this is the only layer that can prove
 * the boundary, and in jsdom `duration` is always `NaN` — which is also the
 * real pre-metadata case, hence the fallback rather than a `false`.
 */
export function qualifiesAsHeard(position: {
  currentTime: number;
  duration: number;
  ended: boolean;
}): boolean {
  if (position.ended) return true;
  const { currentTime, duration } = position;
  if (!Number.isFinite(currentTime) || currentTime <= 0) return false;
  const known = Number.isFinite(duration) && duration > 0;
  const threshold = known
    ? Math.min(HEARD_CEILING_SECONDS, HEARD_FRACTION * duration)
    : HEARD_CEILING_SECONDS;
  return currentTime >= threshold;
}

/** `readyState` at which a clip can start without an audible stall. */
const HAVE_FUTURE_DATA = 3;

export interface PreviewSequencerOptions {
  /**
   * Element factory. The ONE seam these tests need: jsdom's
   * `HTMLMediaElement.play()` is unimplemented and returns `undefined`, so
   * everything above this line is provable at Layer 1/2 and nothing below it
   * is testable at all.
   */
  createAudio?: () => HTMLAudioElement;
}

const pauseSafely = (audio: HTMLAudioElement): void => {
  try {
    audio.pause();
  } catch {
    // jsdom has no media; a failed pause is never worth propagating.
  }
};

const rewind = (audio: HTMLAudioElement): void => {
  try {
    if (audio.currentTime !== 0) audio.currentTime = 0;
  } catch {
    // Seeking before metadata can throw; the clip still starts at 0.
  }
};

const errorName = (error: unknown): string =>
  error instanceof Error ? error.name : "";

const sameState = (a: AuditionState, b: AuditionState): boolean =>
  a.running === b.running &&
  a.playingVoiceId === b.playingVoiceId &&
  a.loadingVoiceId === b.loadingVoiceId &&
  a.position?.index === b.position?.index &&
  a.position?.total === b.position?.total &&
  a.error?.voiceId === b.error?.voiceId &&
  a.error?.kind === b.error?.kind;

/**
 * Plays a sequence of sample clips, at a steady beat, and says what it is
 * doing. A single audition is a one-item sequence, so "play" and
 * "stop-then-play" are the same operation.
 *
 * **A monotonic session token is the entire cancellation model.** `play()`
 * and `stop()` bump `session`; every asynchronous continuation — the `play()`
 * promise, the inter-clip timer, and (via the per-buffer `carrying` stamp)
 * every media event — captures the session it belongs to and returns
 * immediately if it is stale. That is what kills the shipped player's live
 * hazard by construction: `pause()` QUEUES its event, so a superseded clip's
 * terminal handler used to run after the next clip had already claimed the
 * state line, and wrote into the new voice's UI.
 */
export class PreviewSequencer {
  /**
   * Two elements, alternating. With one element you cannot preload during
   * playback — setting `src` kills the current clip — so while N plays, N+1
   * loads into the other.
   */
  private readonly buffers: HTMLAudioElement[];
  private session = 0;
  private items: AuditionItem[] = [];
  private index = -1;
  /** Which buffer carries the current item; the other one preloads. */
  private active = 1;
  /** Per-buffer stamp: which session and item that element is sounding. */
  private carrying: ({ session: number; index: number } | null)[] = [
    null,
    null,
  ];
  private state: AuditionState = IDLE_AUDITION;
  private readonly listeners = new Set<(state: AuditionState) => void>();
  private readonly heardListeners = new Set<(voiceId: string) => void>();
  private heardCurrent = false;
  /** Consecutive clip failures; two in a row stop the sequence. */
  private failureRun = 0;
  /**
   * Items already counted as failed in this session. One clip is ONE failure,
   * but a 404 reports itself TWICE (see `fail`), and each item is attempted at
   * most once per session — so an index is the whole identity of a failure.
   */
  private readonly failed = new Set<number>();
  private preloadFailed = false;
  private beat: ReturnType<typeof setTimeout> | null = null;

  constructor(opts?: PreviewSequencerOptions) {
    const create = opts?.createAudio ?? (() => new Audio());
    this.buffers = [create(), create()];
    this.buffers.forEach((audio, slot) => {
      audio.preload = "auto";
      audio.addEventListener("play", () => this.onPlay(slot));
      audio.addEventListener("pause", () => this.onPause(slot));
      audio.addEventListener("timeupdate", () => this.onTimeUpdate(slot));
      audio.addEventListener("ended", () => this.onEnded(slot));
      audio.addEventListener("error", () => this.onError(slot));
    });
  }

  /** Play these clips in order, replacing whatever is running. */
  play(items: AuditionItem[]): void {
    this.cancel();
    if (items.length === 0) {
      this.emit(IDLE_AUDITION);
      return;
    }
    this.items = [...items];
    this.startItem(0);
  }

  stop(): void {
    this.cancel();
    this.emit(IDLE_AUDITION);
  }

  getState(): AuditionState {
    return this.state;
  }

  subscribe(fn: (state: AuditionState) => void): () => void {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  /**
   * A clip PLAYED (design §8) — as opposed to a button having been clicked.
   * The sequencer is the only honest emitter of this, because `onState(false)`
   * fires identically for pause, ended and error: a caller literally cannot
   * tell why playback stopped.
   */
  onHeard(fn: (voiceId: string) => void): () => void {
    this.heardListeners.add(fn);
    return () => {
      this.heardListeners.delete(fn);
    };
  }

  // --- the sequence ---------------------------------------------------------

  private startItem(index: number): void {
    const item = this.items[index];
    if (!item) {
      this.finish();
      return;
    }
    pauseSafely(this.buffers[this.active]);
    this.index = index;
    this.active = 1 - this.active;
    const audio = this.buffers[this.active];
    this.carrying[this.active] = { session: this.session, index };
    this.heardCurrent = false;
    if (audio.src !== item.url) {
      audio.src = item.url;
      audio.load();
    }
    audio.volume = Math.min(1, Math.max(0, item.gain));
    rewind(audio);
    this.emit({
      running: true,
      playingVoiceId: null,
      loadingVoiceId: item.voiceId,
      position: { index: index + 1, total: this.items.length },
      error: null,
    });

    const s = this.session;
    const started: unknown = audio.play();
    if (started instanceof Promise) {
      started.catch((error: unknown) => {
        if (s !== this.session) return;
        // A legitimate supersede — the user pressed ↓ fast. Not an error.
        if (errorName(error) === "AbortError") return;
        if (errorName(error) === "NotAllowedError") {
          // Chrome gates media on sticky document activation. Nothing will
          // sound until the user clicks, so say that instead of stalling.
          this.halt({ voiceId: item.voiceId, kind: "blocked" });
          return;
        }
        this.fail(index);
      });
    }
    this.preload(index + 1);
  }

  private preload(index: number): void {
    const item = this.items[index];
    if (!item) return;
    const audio = this.buffers[1 - this.active];
    // Already pointed here: keep what we know about it. Clearing the flag on a
    // no-op would forget that THIS clip has already errored, and the beat would
    // then wait forever for a `canplay` the element will never fire again.
    if (audio.src === item.url) return;
    this.preloadFailed = false; // a fresh load — nothing known against it yet
    audio.src = item.url;
    audio.load();
  }

  /**
   * Deadline-scheduled: start N+1 at `max(now + 320 ms, whenReady(N+1))`. If
   * it isn't buffered the gap stretches VISIBLY (`loadingVoiceId`) rather than
   * mysteriously.
   */
  private scheduleAdvance(): void {
    const next = this.index + 1;
    if (next >= this.items.length) {
      this.finish();
      return;
    }
    const s = this.session;
    this.clearBeat();
    this.beat = setTimeout(() => {
      if (s !== this.session) return;
      this.beat = null;
      this.startWhenReady(next, s);
    }, AUDITION_BEAT_MS);
  }

  private startWhenReady(index: number, s: number): void {
    const item = this.items[index];
    if (!item) {
      this.finish();
      return;
    }
    if (this.preloadFailed) {
      this.fail(index);
      return;
    }
    const audio = this.buffers[1 - this.active];
    if (audio.readyState >= HAVE_FUTURE_DATA) {
      this.startItem(index);
      return;
    }
    this.emit({
      ...this.state,
      running: true,
      playingVoiceId: null,
      loadingVoiceId: item.voiceId,
    });
    const settle = (failed: boolean) => {
      audio.removeEventListener("canplay", onReady);
      audio.removeEventListener("loadeddata", onReady);
      audio.removeEventListener("error", onFail);
      if (s !== this.session) return;
      if (failed) this.fail(index);
      else this.startItem(index);
    };
    const onReady = () => settle(false);
    const onFail = () => settle(true);
    audio.addEventListener("canplay", onReady);
    audio.addEventListener("loadeddata", onReady);
    audio.addEventListener("error", onFail);
  }

  /**
   * A clip 404'd or failed to decode: mark it and carry on after the beat.
   * Two consecutive failures stop — one bad asset is a note, a run of them is
   * a broken sequence nobody wants to sit through.
   *
   * Idempotent per item, because the platform reports one failure twice: per
   * the HTML spec's "failed with elements" steps, a clip that cannot be
   * fetched fires `error` at the element AND rejects the pending `play()`
   * promise with `NotSupportedError`. Counting both would trip the
   * two-in-a-row stop on the very first bad asset.
   */
  private fail(index: number): void {
    const item = this.items[index];
    if (!item) return;
    if (this.failed.has(index)) return;
    this.failed.add(index);
    this.failureRun += 1;
    const error = { voiceId: item.voiceId, kind: "failed" as const };
    if (this.failureRun >= 2 || index + 1 >= this.items.length) {
      this.halt(error);
      return;
    }
    this.index = index;
    // Point the spare buffer at the item we are advancing TO. It may still be
    // holding the clip that just failed — in which case nothing else ever
    // re-points it, the next voice is never fetched, and the beat either
    // condemns it unheard or waits forever for a `canplay` on the wrong src.
    this.preload(index + 1);
    this.emit({
      ...this.state,
      running: true,
      playingVoiceId: null,
      loadingVoiceId: null,
      error,
    });
    this.scheduleAdvance();
  }

  private finish(): void {
    this.cancel();
    this.emit(IDLE_AUDITION);
  }

  private halt(error: AuditionState["error"]): void {
    this.cancel();
    this.emit({ ...IDLE_AUDITION, error });
  }

  /**
   * Bump the session — which invalidates every outstanding continuation — and
   * silence both buffers. Emits nothing: the caller decides what the new
   * truth is.
   */
  private cancel(): void {
    this.session += 1;
    this.clearBeat();
    this.items = [];
    this.index = -1;
    this.carrying = [null, null];
    this.heardCurrent = false;
    this.failureRun = 0;
    this.failed.clear();
    this.preloadFailed = false;
    this.buffers.forEach(pauseSafely);
  }

  private clearBeat(): void {
    if (this.beat === null) return;
    clearTimeout(this.beat);
    this.beat = null;
  }

  // --- media events ---------------------------------------------------------

  /**
   * The item a buffer's event belongs to, or null when the event is stale —
   * a different session, or the buffer that just handed over. THE fence.
   */
  private itemOf(slot: number): AuditionItem | null {
    const carried = this.carrying[slot];
    if (!carried || carried.session !== this.session) return null;
    if (slot !== this.active) return null;
    return this.items[carried.index] ?? null;
  }

  private onPlay(slot: number): void {
    const item = this.itemOf(slot);
    if (!item) return;
    this.failureRun = 0;
    this.emit({
      ...this.state,
      running: true,
      playingVoiceId: item.voiceId,
      loadingVoiceId: null,
      error: null,
    });
  }

  private onPause(slot: number): void {
    const item = this.itemOf(slot);
    if (!item) return;
    if (this.buffers[slot].ended) return; // `ended` owns that transition
    this.emit({ ...this.state, playingVoiceId: null });
  }

  private onTimeUpdate(slot: number): void {
    if (this.heardCurrent) return;
    const item = this.itemOf(slot);
    if (!item) return;
    const audio = this.buffers[slot];
    if (
      !qualifiesAsHeard({
        currentTime: audio.currentTime,
        duration: audio.duration,
        ended: false,
      })
    )
      return;
    this.markHeard(item.voiceId);
  }

  private onEnded(slot: number): void {
    const item = this.itemOf(slot);
    if (!item) return;
    this.markHeard(item.voiceId);
    this.scheduleAdvance();
  }

  private onError(slot: number): void {
    const carried = this.carrying[slot];
    if (carried && this.itemOf(slot)) {
      // Blame what this buffer is CARRYING, not `this.index` — which, after a
      // failed preload, has already moved on to the item that failed to load.
      this.fail(carried.index);
      return;
    }
    // The PRELOADING buffer failed. Nothing to say yet — it surfaces when the
    // beat tries to start it, instead of waiting for a `canplay` that will
    // never come.
    if (slot !== this.active) this.preloadFailed = true;
  }

  private markHeard(voiceId: string): void {
    if (this.heardCurrent) return;
    this.heardCurrent = true;
    [...this.heardListeners].forEach((fn) => fn(voiceId));
  }

  private emit(state: AuditionState): void {
    if (sameState(this.state, state)) return;
    this.state = state;
    [...this.listeners].forEach((fn) => fn(state));
  }
}
