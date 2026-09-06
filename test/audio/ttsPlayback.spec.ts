import { describe, it, expect } from "vitest";
import { applyTtsPlaybackSettings, loadTtsSource } from "../../src/audio/ttsPlayback";
import { DEFAULT_TTS_PLAYBACK_RATE } from "../../src/tts/playbackRate";

/**
 * The one place a TTS source is handed to a media element, shared by the
 * in-page path (AudioModule) and the offscreen path (audio_handler).
 *
 * Two traps live here:
 *  1. The HTML media load algorithm resets `playbackRate` to
 *     `defaultPlaybackRate` when a new `src` is set — so the rate MUST be
 *     applied after the src, and `defaultPlaybackRate` must be set too (a
 *     later `load()`/cache-bust would otherwise silently drop the speed).
 *  2. The offscreen <audio> element is a SINGLE instance shared by every tab,
 *     so a load that says nothing about speed must reset it, never inherit
 *     whatever the previous tab left behind.
 */
class FakeMediaElement {
  /** Ordered record of property writes, so ordering can be asserted. */
  writes: string[] = [];
  preservesPitch = false;
  private _src = "";
  private _volume = 1;
  private _defaultPlaybackRate = 1;
  private _playbackRate = 1;

  get src() {
    return this._src;
  }
  set src(value: string) {
    this._src = value;
    this.writes.push("src");
    // The relevant half of the HTML media load algorithm.
    this._playbackRate = this._defaultPlaybackRate;
  }

  get volume() {
    return this._volume;
  }
  set volume(value: number) {
    this._volume = value;
    this.writes.push("volume");
  }

  get defaultPlaybackRate() {
    return this._defaultPlaybackRate;
  }
  set defaultPlaybackRate(value: number) {
    this._defaultPlaybackRate = value;
    this.writes.push("defaultPlaybackRate");
  }

  get playbackRate() {
    return this._playbackRate;
  }
  set playbackRate(value: number) {
    this._playbackRate = value;
    this.writes.push("playbackRate");
  }

  /** Emulate a re-load of the current source (e.g. the cache-busting reload). */
  load() {
    this._playbackRate = this._defaultPlaybackRate;
  }
}

const el = () => new FakeMediaElement() as unknown as HTMLMediaElement & FakeMediaElement;

describe("loadTtsSource (#96)", () => {
  it("applies the playback rate AFTER the src, so the load algorithm's reset cannot win", () => {
    const audio = el();

    loadTtsSource(audio, "https://example.com/reply.mp3", { playbackRate: 1.5 });

    expect(audio.playbackRate).toBe(1.5);
    expect(audio.writes.indexOf("src")).toBeLessThan(
      audio.writes.indexOf("playbackRate"),
    );
  });

  it("sets defaultPlaybackRate too, so a later load()/cache-bust keeps the speed", () => {
    const audio = el();

    loadTtsSource(audio, "https://example.com/reply.mp3", { playbackRate: 1.5 });
    audio.load();

    expect(audio.defaultPlaybackRate).toBe(1.5);
    expect(audio.playbackRate).toBe(1.5);
  });

  it("resets the rate to 1.0 when a load says nothing about speed (shared offscreen element)", () => {
    const audio = el();
    // Another tab left the shared element at double speed.
    audio.defaultPlaybackRate = 2;
    audio.playbackRate = 2;

    loadTtsSource(audio, "https://example.com/other-tab.mp3", {});

    expect(audio.playbackRate).toBe(DEFAULT_TTS_PLAYBACK_RATE);
    expect(audio.defaultPlaybackRate).toBe(DEFAULT_TTS_PLAYBACK_RATE);
  });

  it("normalises an unsupported stored rate instead of trusting it", () => {
    const audio = el();

    loadTtsSource(audio, "https://example.com/reply.mp3", {
      playbackRate: 99 as number,
    });

    expect(audio.playbackRate).toBe(2);
  });

  it("keeps pitch natural at non-default speeds", () => {
    const audio = el();

    loadTtsSource(audio, "https://example.com/reply.mp3", { playbackRate: 1.5 });

    expect(audio.preservesPitch).toBe(true);
  });

  it("sets the src it was given", () => {
    const audio = el();

    loadTtsSource(audio, "https://example.com/reply.mp3", {});

    expect(audio.src).toBe("https://example.com/reply.mp3");
  });
});

describe("applyTtsPlaybackSettings volume (#117 / #437)", () => {
  it("applies a supplied volume", () => {
    const audio = el();

    applyTtsPlaybackSettings(audio, { volume: 0.5 });

    expect(audio.volume).toBe(0.5);
  });

  it("leaves the volume untouched when none is supplied", () => {
    const audio = el();
    audio.volume = 0.5;
    audio.writes.length = 0;

    applyTtsPlaybackSettings(audio, {});

    expect(audio.volume).toBe(0.5);
    expect(audio.writes).not.toContain("volume");
  });

  it("clamps a volume into the 0..1 the element accepts", () => {
    const loud = el();
    const negative = el();

    applyTtsPlaybackSettings(loud, { volume: 4 });
    applyTtsPlaybackSettings(negative, { volume: -1 });

    expect(loud.volume).toBe(1);
    expect(negative.volume).toBe(0);
  });

  it("ignores a non-finite volume rather than throwing at the element", () => {
    const audio = el();
    audio.volume = 0.5;

    applyTtsPlaybackSettings(audio, { volume: Number.NaN });

    expect(audio.volume).toBe(0.5);
  });
});
