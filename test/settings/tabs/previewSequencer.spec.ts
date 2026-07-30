import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  AuditionItem,
  AuditionState,
  AUDITION_BEAT_MS,
  PreviewSequencer,
  qualifiesAsHeard,
} from "../../../entrypoints/settings/tabs/voices/previewSequencer";

/**
 * The audition sequencer (design §5), driven entirely above the media element.
 *
 * jsdom has no media at all — `HTMLMediaElement.play()` is unimplemented and
 * returns `undefined`, `duration` is `NaN`, and no events ever fire — so the
 * sequencer takes an element factory and these tests hand it a fake that
 * models the parts of the spec the design depends on:
 *
 *  - `pause()` QUEUES its `pause` event rather than firing it synchronously
 *    (HTML spec: "queue a media element task"). That queueing is the whole
 *    mechanism behind the superseded-callback race.
 *  - a pending `play()` promise REJECTS with `AbortError` when the element is
 *    paused before it resolves.
 *  - `readyState` gates whether the next clip can start on the beat.
 */

const urlOf = (voiceId: string) => `https://api.saypi.ai/samples/${voiceId}.mp3`;
const item = (voiceId: string, gain = 1): AuditionItem => ({
  voiceId,
  url: urlOf(voiceId),
  gain,
});

const HAVE_NOTHING = 0;
const HAVE_FUTURE_DATA = 3;

class FakeAudio {
  src = "";
  volume = 1;
  preload = "";
  currentTime = 0;
  duration = NaN;
  ended = false;
  paused = true;
  readyState = HAVE_FUTURE_DATA;
  playCalls = 0;
  loadCalls = 0;
  /** Rejection to hand back from the NEXT play() call, if any. */
  rejectPlayWith: Error | null = null;
  private pending: { reject: (e: unknown) => void } | null = null;
  private readonly listeners = new Map<string, Set<(e: unknown) => void>>();

  addEventListener(type: string, fn: (e: unknown) => void): void {
    const set = this.listeners.get(type) ?? new Set();
    set.add(fn);
    this.listeners.set(type, set);
  }

  removeEventListener(type: string, fn: (e: unknown) => void): void {
    this.listeners.get(type)?.delete(fn);
  }

  load(): void {
    this.loadCalls++;
  }

  play(): Promise<void> {
    this.playCalls++;
    this.paused = false;
    this.ended = false;
    const rejection = this.rejectPlayWith;
    if (rejection) {
      this.rejectPlayWith = null;
      return Promise.reject(rejection);
    }
    // Resolves when the element actually starts (the test fires "play").
    return new Promise<void>((resolve, reject) => {
      this.pending = { reject };
      this.resolvePending = resolve;
    });
  }

  pause(): void {
    if (this.paused) return;
    this.paused = true;
    // A pause that interrupts a pending play() rejects it — that is how a
    // superseded clip reports itself in a real browser.
    this.pending?.reject(domError("AbortError"));
    this.pending = null;
    // Queued, not synchronous. This is the defect's carrier.
    queueMicrotask(() => this.fire("pause"));
  }

  fire(type: string): void {
    if (type === "play") {
      this.resolvePending?.();
      this.resolvePending = null;
      this.pending = null;
    }
    if (type === "ended") {
      this.ended = true;
      this.paused = true;
    }
    const event = { type, target: this };
    const inline = (this as unknown as Record<string, unknown>)[`on${type}`];
    if (typeof inline === "function") (inline as (e: unknown) => void)(event);
    [...(this.listeners.get(type) ?? [])].forEach((fn) => fn(event));
  }

  private resolvePending: (() => void) | null = null;
}

function domError(name: string): Error {
  const error = new Error(name);
  error.name = name;
  return error;
}

function harness(
  opts: { audioReadyState?: number; refusePlayWith?: string } = {}
) {
  const created: FakeAudio[] = [];
  const sequencer = new PreviewSequencer({
    createAudio: () => {
      const audio = new FakeAudio();
      if (opts.audioReadyState !== undefined)
        audio.readyState = opts.audioReadyState;
      if (opts.refusePlayWith) audio.rejectPlayWith = domError(opts.refusePlayWith);
      created.push(audio);
      return audio as unknown as HTMLAudioElement;
    },
  });
  const seen: AuditionState[] = [];
  sequencer.subscribe((state) => seen.push(state));
  const heard: string[] = [];
  sequencer.onHeard((voiceId) => heard.push(voiceId));
  /** The element currently carrying a voice's clip. */
  const elementFor = (voiceId: string) =>
    created.find((audio) => audio.src === urlOf(voiceId));
  /** Every play() the sequencer has issued — two buffers get reused. */
  const totalPlays = () =>
    created.reduce((sum, audio) => sum + audio.playCalls, 0);
  return { sequencer, created, seen, heard, elementFor, totalPlays };
}

/** Drain the microtask queue (queued media events, play() promise handlers). */
async function settle(): Promise<void> {
  for (let i = 0; i < 5; i++) await Promise.resolve();
}

beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
});

describe("qualifiesAsHeard (design §8)", () => {
  // Measured clip durations are 1.11–2.90 s, so an absolute threshold would
  // fire at ~100% and degenerate into completion-only; and completion-only
  // would record nothing during the arrow walk, which interrupts clips by
  // design. Both branches are load-bearing.
  const shortest = 1.11; // 0.65 × 1.11 = 0.7215 s

  it("has not been heard just before 65% of the shortest clip", () => {
    expect(
      qualifiesAsHeard({ currentTime: 0.71, duration: shortest, ended: false })
    ).toBe(false);
  });

  it("counts as heard just past 65% of the shortest clip", () => {
    expect(
      qualifiesAsHeard({ currentTime: 0.73, duration: shortest, ended: false })
    ).toBe(true);
  });

  it("caps the fraction at 1.4 s on a long clip", () => {
    // 0.65 × 2.90 = 1.885 s, so the cap is what fires.
    expect(
      qualifiesAsHeard({ currentTime: 1.39, duration: 2.9, ended: false })
    ).toBe(false);
    expect(
      qualifiesAsHeard({ currentTime: 1.4, duration: 2.9, ended: false })
    ).toBe(true);
  });

  it("falls back to the 1.4 s branch when duration is unknown", () => {
    // Metadata may not have arrived — and in jsdom duration is ALWAYS NaN.
    expect(
      qualifiesAsHeard({ currentTime: 1.39, duration: NaN, ended: false })
    ).toBe(false);
    expect(
      qualifiesAsHeard({ currentTime: 1.4, duration: NaN, ended: false })
    ).toBe(true);
    expect(
      qualifiesAsHeard({ currentTime: 1.4, duration: 0, ended: false })
    ).toBe(true);
  });

  it("counts a finished clip regardless of the numbers", () => {
    expect(
      qualifiesAsHeard({ currentTime: 0, duration: NaN, ended: true })
    ).toBe(true);
    expect(
      qualifiesAsHeard({ currentTime: 0.1, duration: 1.11, ended: true })
    ).toBe(true);
  });

  it("does not count a clip that never started", () => {
    expect(
      qualifiesAsHeard({ currentTime: 0, duration: 1.11, ended: false })
    ).toBe(false);
  });
});

describe("PreviewSequencer — the session token is the whole cancellation model", () => {
  /**
   * DEFECT (a), reproduced. The shipped player calls `previewAudio.pause()` —
   * which QUEUES a pause event — and then reassigns the module-global
   * `previewOnState` before that task runs, so the superseded clip's terminal
   * handler writes into the NEW voice's UI. Cosmetic with one clip; a skipped
   * voice the moment a sequence depends on it.
   */
  it("never lets a superseded clip's terminal handler write into the voice that replaced it", async () => {
    const { sequencer, elementFor } = harness();
    sequencer.play([item("marin")]);
    elementFor("marin")!.fire("play");
    expect(sequencer.getState().playingVoiceId).toBe("marin");

    // The user presses ↓ fast: coral supersedes marin mid-clip.
    sequencer.play([item("coral")]);
    elementFor("coral")!.fire("play");
    expect(sequencer.getState().playingVoiceId).toBe("coral");

    // marin's pause event (and its rejected play() promise) land AFTER coral
    // started. Neither may touch coral's state.
    await settle();

    expect(sequencer.getState().playingVoiceId).toBe("coral");
    expect(sequencer.getState().running).toBe(true);
  });

  it("ignores a superseded play()'s AbortError instead of reporting an error", async () => {
    const { sequencer, elementFor, seen } = harness();
    sequencer.play([item("marin")]);
    elementFor("marin")!.fire("play");
    sequencer.play([item("coral")]);
    elementFor("coral")!.fire("play");
    await settle();
    expect(seen.some((state) => state.error !== null)).toBe(false);
  });

  it("never lets a superseded sequence's pending beat advance the new one", async () => {
    const { sequencer, elementFor, totalPlays } = harness();
    sequencer.play([item("onyx"), item("echo")]);
    elementFor("onyx")!.fire("play");
    elementFor("onyx")!.fire("ended");
    // The beat for echo is now armed. Before it fires, the user clicks coral.
    sequencer.play([item("coral")]);
    elementFor("coral")!.fire("play");
    await settle();
    const playsBefore = totalPlays();
    vi.advanceTimersByTime(AUDITION_BEAT_MS * 3);
    await settle();
    expect(sequencer.getState().playingVoiceId).toBe("coral");
    expect(totalPlays()).toBe(playsBefore);
  });

  it("stop() silences every buffer and reports idle", async () => {
    const { sequencer, created, elementFor } = harness();
    sequencer.play([item("onyx"), item("echo")]);
    elementFor("onyx")!.fire("play");
    sequencer.stop();
    await settle();
    expect(sequencer.getState()).toEqual({
      running: false,
      playingVoiceId: null,
      loadingVoiceId: null,
      position: null,
      error: null,
    });
    expect(created.every((audio) => audio.paused)).toBe(true);
  });
});

describe("PreviewSequencer — double buffering and the 320 ms beat", () => {
  it("preloads the next clip into the other element while this one plays", () => {
    const { sequencer, created, elementFor } = harness();
    sequencer.play([item("onyx"), item("echo")]);
    elementFor("onyx")!.fire("play");
    // Two elements, so setting the next src cannot kill the current clip.
    expect(created.length).toBe(2);
    expect(elementFor("echo")).toBeTruthy();
    expect(elementFor("echo")).not.toBe(elementFor("onyx"));
    expect(elementFor("echo")!.preload).toBe("auto");
    expect(elementFor("echo")!.playCalls).toBe(0);
  });

  it("starts the next clip one beat after the last one ended", async () => {
    const { sequencer, elementFor } = harness();
    sequencer.play([item("onyx"), item("echo")]);
    elementFor("onyx")!.fire("play");
    elementFor("onyx")!.fire("ended");
    await settle();

    vi.advanceTimersByTime(AUDITION_BEAT_MS - 1);
    await settle();
    expect(elementFor("echo")!.playCalls).toBe(0);

    vi.advanceTimersByTime(1);
    await settle();
    expect(elementFor("echo")!.playCalls).toBe(1);
    elementFor("echo")!.fire("play");
    expect(sequencer.getState().playingVoiceId).toBe("echo");
    expect(sequencer.getState().position).toEqual({ index: 2, total: 2 });
  });

  it("stretches the gap visibly when the next clip is not ready yet", async () => {
    const { sequencer, elementFor } = harness({
      audioReadyState: HAVE_NOTHING,
    });
    sequencer.play([item("onyx"), item("echo")]);
    elementFor("onyx")!.fire("play");
    elementFor("onyx")!.fire("ended");
    await settle();
    vi.advanceTimersByTime(AUDITION_BEAT_MS);
    await settle();

    // Past the deadline but unbuffered: say so rather than stall mysteriously.
    expect(elementFor("echo")!.playCalls).toBe(0);
    expect(sequencer.getState().loadingVoiceId).toBe("echo");

    elementFor("echo")!.readyState = HAVE_FUTURE_DATA;
    elementFor("echo")!.fire("canplay");
    await settle();
    expect(elementFor("echo")!.playCalls).toBe(1);
  });

  it("ends the sequence after the last clip", async () => {
    const { sequencer, elementFor } = harness();
    sequencer.play([item("onyx")]);
    elementFor("onyx")!.fire("play");
    elementFor("onyx")!.fire("ended");
    await settle();
    vi.advanceTimersByTime(AUDITION_BEAT_MS * 2);
    await settle();
    expect(sequencer.getState().running).toBe(false);
    expect(sequencer.getState().playingVoiceId).toBeNull();
  });

  it("applies each item's attenuation to the element that plays it", () => {
    const { sequencer, elementFor } = harness();
    sequencer.play([item("sage", 0.6)]);
    expect(elementFor("sage")!.volume).toBe(0.6);
  });
});

describe("PreviewSequencer — error discrimination (design §5.1)", () => {
  it("surfaces an autoplay refusal as an actionable blocked state", async () => {
    // Chrome gates media on sticky document activation; when it refuses there
    // is nothing to hear, so say what would fix it rather than stalling.
    const { sequencer } = harness({ refusePlayWith: "NotAllowedError" });
    sequencer.play([item("onyx"), item("echo")]);
    await settle();
    expect(sequencer.getState().error).toEqual({
      voiceId: "onyx",
      kind: "blocked",
    });
    expect(sequencer.getState().running).toBe(false);
  });

  it("marks a failed clip and carries on after the beat", async () => {
    const { sequencer, elementFor } = harness();
    sequencer.play([item("onyx"), item("echo")]);
    elementFor("onyx")!.fire("error");
    await settle();
    expect(sequencer.getState().error).toEqual({
      voiceId: "onyx",
      kind: "failed",
    });
    vi.advanceTimersByTime(AUDITION_BEAT_MS);
    await settle();
    expect(elementFor("echo")!.playCalls).toBe(1);
  });

  it("stops the sweep after two consecutive failures", async () => {
    const { sequencer, elementFor, totalPlays } = harness();
    sequencer.play([item("onyx"), item("echo"), item("ash")]);
    elementFor("onyx")!.fire("error");
    await settle();
    vi.advanceTimersByTime(AUDITION_BEAT_MS);
    await settle();
    elementFor("echo")!.fire("error");
    await settle();
    const playsBefore = totalPlays();
    vi.advanceTimersByTime(AUDITION_BEAT_MS * 3);
    await settle();
    expect(sequencer.getState().running).toBe(false);
    expect(sequencer.getState().error).toEqual({
      voiceId: "echo",
      kind: "failed",
    });
    expect(totalPlays()).toBe(playsBefore);
  });

  it("resets the failure run once a clip plays", async () => {
    const { sequencer, elementFor } = harness();
    sequencer.play([item("onyx"), item("echo"), item("ash")]);
    elementFor("onyx")!.fire("error");
    await settle();
    vi.advanceTimersByTime(AUDITION_BEAT_MS);
    await settle();
    elementFor("echo")!.fire("play");
    elementFor("echo")!.fire("ended");
    await settle();
    vi.advanceTimersByTime(AUDITION_BEAT_MS);
    await settle();
    // ash reuses onyx's buffer (there are only two), so count the sequence's
    // position rather than that element's lifetime play count.
    expect(sequencer.getState().position).toEqual({ index: 3, total: 3 });
    expect(sequencer.getState().loadingVoiceId).toBe("ash");
    expect(elementFor("ash")!.paused).toBe(false);
  });
});

describe("PreviewSequencer — heard emission (design §8)", () => {
  // The sequencer is the only honest emitter: it is the one thing that knows a
  // clip PLAYED rather than that a button was clicked.
  it("emits heard once the clip passes the threshold, and only once", () => {
    const { sequencer, elementFor, heard } = harness();
    sequencer.play([item("marin")]);
    const audio = elementFor("marin")!;
    audio.duration = 1.11;
    audio.fire("play");
    audio.currentTime = 0.71;
    audio.fire("timeupdate");
    expect(heard).toEqual([]);
    audio.currentTime = 0.73;
    audio.fire("timeupdate");
    audio.currentTime = 0.9;
    audio.fire("timeupdate");
    expect(heard).toEqual(["marin"]);
  });

  it("emits heard on a clip that finishes without a qualifying timeupdate", () => {
    const { sequencer, elementFor, heard } = harness();
    sequencer.play([item("marin")]);
    elementFor("marin")!.fire("play");
    elementFor("marin")!.fire("ended");
    expect(heard).toEqual(["marin"]);
  });

  it("never counts a clip that errored", async () => {
    const { sequencer, elementFor, heard } = harness();
    sequencer.play([item("marin")]);
    elementFor("marin")!.fire("error");
    await settle();
    expect(heard).toEqual([]);
  });

  it("emits once per item across a sequence", async () => {
    const { sequencer, elementFor, heard } = harness();
    sequencer.play([item("onyx"), item("echo")]);
    elementFor("onyx")!.fire("play");
    elementFor("onyx")!.fire("ended");
    await settle();
    vi.advanceTimersByTime(AUDITION_BEAT_MS);
    await settle();
    elementFor("echo")!.fire("play");
    elementFor("echo")!.fire("ended");
    expect(heard).toEqual(["onyx", "echo"]);
  });
});
