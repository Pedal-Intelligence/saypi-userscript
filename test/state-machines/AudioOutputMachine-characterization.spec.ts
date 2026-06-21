import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createTestActor } from "./support/testActor";

// ---------------------------------------------------------------------------
// Characterization suite for AudioOutputMachine.
//
// These tests PIN the machine's CURRENT behavior (states, transitions, guards,
// context mutations, and EventBus side-effects). They are deliberately written
// against the code as-is; where behavior looks surprising it is flagged with a
// CHARACTERIZATION comment and reported as a suspected bug rather than "fixed".
//
// Mock surface (mirrors the other state-machine specs): EventBus is replaced
// with a spy so we can assert emitted events; the TTS speech-source plumbing
// (SpeechSynthesisModule / PreferenceModule / SpeechSourceParsers) is stubbed
// so `notifySpeechStart` does not reach into real IO. SpeechModel itself is
// left REAL so the machine's default provider + the providers we construct in
// tests share the genuine `matches()` / `matchesSource()` logic.
// ---------------------------------------------------------------------------

const emit = vi.fn();
vi.mock("../../src/events/EventBus.js", () => ({
  default: {
    emit: (...args: any[]) => emit(...args),
    on: vi.fn(),
    off: vi.fn(),
    once: vi.fn(),
  },
}));

vi.mock("../../src/tts/SpeechSynthesisModule", () => ({
  SpeechSynthesisModule: {
    getInstance: () => ({}),
  },
}));

vi.mock("../../src/prefs/PreferenceModule", () => ({
  UserPreferenceModule: {
    getInstance: () => ({
      getLanguage: () => Promise.resolve("en"),
    }),
  },
}));

// Controllable parse results so individual tests can drive the
// `notifySpeechStart` emit path (which otherwise resolves to null speech).
// Default is null (no further emit); a test can set `piParseResult` to a
// speech-like object to pin the `saypi:tts:speechStreamStarted` emission.
let piParseResult: any = null;
const piParse = vi.fn((..._args: any[]) => piParseResult);
const saypiParse = vi.fn((..._args: any[]) => Promise.resolve(null));
vi.mock("../../src/tts/SpeechSourceParsers", () => ({
  PiSpeechSourceParser: vi.fn().mockImplementation(() => ({
    parse: (...args: any[]) => piParse(...args),
  })),
  SayPiSpeechSourceParser: vi.fn().mockImplementation(() => ({
    parse: (...args: any[]) => saypiParse(...args),
  })),
}));

import { audioOutputMachine } from "../../src/state-machines/AudioOutputMachine";
import { audioProviders } from "../../src/tts/SpeechModel";

// A provider that matches pi.ai sources (used to exercise the "source matches"
// branch of the shouldSkip guard, since the default provider is `None` which
// never matches anything).
const piProvider = audioProviders.Pi;
const PI_SRC = "https://pi.ai/audio/track-1.mp3";
const OTHER_SRC = "https://example.com/track-1.mp3";

// A voice stub whose matchesSource is configurable per test.
function makeVoice(matches: boolean) {
  return { matchesSource: vi.fn((_src: string) => matches) } as any;
}

describe("AudioOutputMachine characterization", () => {
  let service: any;

  beforeEach(() => {
    emit.mockClear();
    piParse.mockClear();
    saypiParse.mockClear();
    piParseResult = null;
    service = createTestActor(audioOutputMachine);
    service.start();
  });

  afterEach(() => {
    try {
      service?.stop();
    } catch {}
  });

  describe("initial state & context", () => {
    it("starts in idle with the documented default context", () => {
      expect(service.state.matches("idle")).toBe(true);
      const ctx = service.state.context;
      expect(ctx.skip).toBe(false);
      expect(ctx.autoplay).toBe(false);
      expect(ctx.replaying).toBe(false);
      expect(ctx.voice).toBeNull();
      // In JSDOM no chatbot is identified, so the default provider is `None`.
      expect(ctx.provider).toBe(audioProviders.None);
    });
  });

  describe("global handlers (changeProvider / changeVoice / replaying)", () => {
    it("changeProvider replaces the provider in context without changing state", () => {
      service.send({ type: "changeProvider", provider: piProvider });
      expect(service.state.context.provider).toBe(piProvider);
      expect(service.state.matches("idle")).toBe(true);
    });

    it("changeVoice replaces the voice in context", () => {
      const voice = makeVoice(true);
      service.send({ type: "changeVoice", voice });
      expect(service.state.context.voice).toBe(voice);
    });

    it("replaying sets context.replaying = true", () => {
      expect(service.state.context.replaying).toBe(false);
      service.send({ type: "replaying" });
      expect(service.state.context.replaying).toBe(true);
    });
  });

  describe("idle state transitions", () => {
    it("skipNext sets skip=true and stays in idle", () => {
      service.send({ type: "skipNext" });
      expect(service.state.context.skip).toBe(true);
      expect(service.state.matches("idle")).toBe(true);
    });

    it("loadstart with a non-matching source while NOT skipping is skipped (default provider None never matches)", () => {
      // shouldSkip: isNotReplaying(true) && isProviderMismatch(!None.matches) => true
      service.send({ type: "loadstart", source: PI_SRC });
      // Stays in idle (internal skip transition), emits audio:skipCurrent.
      expect(service.state.matches("idle")).toBe(true);
      expect(emit).toHaveBeenCalledWith("audio:skipCurrent");
      // The skip flag is reset to false by the skip branch's assign.
      expect(service.state.context.skip).toBe(false);
    });

    it("loadstart with a matching provider proceeds to loading", () => {
      service.send({ type: "changeProvider", provider: piProvider });
      service.send({ type: "loadstart", source: PI_SRC });
      expect(service.state.matches("loading")).toBe(true);
      // Entering loading emits notifySpeechStart side-effects (no skip emit).
      expect(emit).not.toHaveBeenCalledWith("audio:skipCurrent");
    });

    it("loadstart with an EMPTY source only honors the explicit skip flag (does not skip by default)", () => {
      // No skip flag set -> shouldSkip returns false for empty source -> loading.
      service.send({ type: "loadstart", source: "" });
      expect(service.state.matches("loading")).toBe(true);
    });

    it("loadstart with an empty source AND skip flag set skips and resets the flag", () => {
      service.send({ type: "skipNext" }); // skip=true
      service.send({ type: "loadstart", source: "" });
      expect(service.state.matches("idle")).toBe(true);
      expect(emit).toHaveBeenCalledWith("audio:skipCurrent");
      expect(service.state.context.skip).toBe(false);
    });

    it("loadstart honors replaying flag: matching-provider replay proceeds to loading", () => {
      // Set provider to None (default) so source mismatches, but mark replaying.
      // isNotReplaying=false => source-mismatch branch suppressed => not skipped.
      service.send({ type: "replaying" });
      service.send({ type: "loadstart", source: PI_SRC });
      expect(service.state.matches("loading")).toBe(true);
    });

    it("play with matching provider proceeds to loading from idle", () => {
      service.send({ type: "changeProvider", provider: piProvider });
      service.send({ type: "play", source: PI_SRC });
      expect(service.state.matches("loading")).toBe(true);
    });

    it("play with a non-matching source from idle is skipped (stays idle)", () => {
      service.send({ type: "play", source: PI_SRC });
      expect(service.state.matches("idle")).toBe(true);
      expect(emit).toHaveBeenCalledWith("audio:skipCurrent");
    });
  });

  describe("shouldSkip guard: voice matching branch", () => {
    it("a voice that does NOT match the source causes a skip even with a matching provider", () => {
      service.send({ type: "changeProvider", provider: piProvider });
      const voice = makeVoice(false); // voice mismatch
      service.send({ type: "changeVoice", voice });
      service.send({ type: "loadstart", source: PI_SRC });
      expect(service.state.matches("idle")).toBe(true);
      expect(emit).toHaveBeenCalledWith("audio:skipCurrent");
      expect(voice.matchesSource).toHaveBeenCalledWith(PI_SRC);
    });

    it("a voice that matches and a matching provider proceeds to loading", () => {
      service.send({ type: "changeProvider", provider: piProvider });
      service.send({ type: "changeVoice", voice: makeVoice(true) });
      service.send({ type: "loadstart", source: PI_SRC });
      expect(service.state.matches("loading")).toBe(true);
    });
  });

  describe("loading state", () => {
    function driveToLoading() {
      service.send({ type: "changeProvider", provider: piProvider });
      service.send({ type: "loadstart", source: PI_SRC });
    }

    it("entering loading resets replaying to false", () => {
      service.send({ type: "replaying" }); // replaying=true
      driveToLoading();
      expect(service.state.matches("loading")).toBe(true);
      expect(service.state.context.replaying).toBe(false);
    });

    it("loadedmetadata transitions loading -> loaded.ready and emits saypi:ready", () => {
      driveToLoading();
      emit.mockClear();
      service.send({ type: "loadedmetadata" });
      expect(service.state.matches({ loaded: "ready" })).toBe(true);
      expect(emit).toHaveBeenCalledWith("saypi:ready");
    });
  });

  describe("loaded compound state lifecycle", () => {
    function driveToReady() {
      service.send({ type: "changeProvider", provider: piProvider });
      service.send({ type: "loadstart", source: PI_SRC });
      service.send({ type: "loadedmetadata" });
    }

    it("ready -> playing on play emits saypi:piSpeaking", () => {
      driveToReady();
      emit.mockClear();
      service.send({ type: "play", source: PI_SRC });
      expect(service.state.matches({ loaded: "playing" })).toBe(true);
      expect(emit).toHaveBeenCalledWith("saypi:piSpeaking");
    });

    it("playing -> paused on pause emits piStoppedSpeaking (playing exit action)", () => {
      driveToReady();
      service.send({ type: "play", source: PI_SRC });
      emit.mockClear();
      service.send({ type: "pause" });
      expect(service.state.matches({ loaded: "paused" })).toBe(true);
      expect(emit).toHaveBeenCalledWith("saypi:piStoppedSpeaking");
    });

    it("playing -> ended on ended emits piStoppedSpeaking (exit) then piFinishedSpeaking (entry)", () => {
      driveToReady();
      service.send({ type: "play", source: PI_SRC });
      emit.mockClear();
      service.send({ type: "ended" });
      expect(service.state.matches({ loaded: "ended" })).toBe(true);
      expect(emit).toHaveBeenCalledWith("saypi:piStoppedSpeaking");
      expect(emit).toHaveBeenCalledWith("saypi:piFinishedSpeaking");
    });

    it("canplaythrough in playing is an internal no-op (stays playing)", () => {
      driveToReady();
      service.send({ type: "play", source: PI_SRC });
      emit.mockClear();
      service.send({ type: "canplaythrough" });
      expect(service.state.matches({ loaded: "playing" })).toBe(true);
      // Internal transition: no exit/entry emit fired.
      expect(emit).not.toHaveBeenCalledWith("saypi:piStoppedSpeaking");
      expect(emit).not.toHaveBeenCalledWith("saypi:piSpeaking");
    });

    it("ended -> ready on seeked re-emits saypi:ready", () => {
      driveToReady();
      service.send({ type: "play", source: PI_SRC });
      service.send({ type: "ended" });
      emit.mockClear();
      service.send({ type: "seeked" });
      expect(service.state.matches({ loaded: "ready" })).toBe(true);
      expect(emit).toHaveBeenCalledWith("saypi:ready");
    });

    it("paused -> playing on play (no skip) re-emits saypi:piSpeaking", () => {
      driveToReady();
      service.send({ type: "play", source: PI_SRC }); // -> playing
      service.send({ type: "pause" }); // -> paused
      emit.mockClear();
      service.send({ type: "play", source: PI_SRC }); // -> playing
      expect(service.state.matches({ loaded: "playing" })).toBe(true);
      expect(emit).toHaveBeenCalledWith("saypi:piSpeaking");
    });

    it("paused -> paused on play when shouldSkip: stays paused, emits skipCurrent, resets skip", () => {
      driveToReady();
      service.send({ type: "play", source: PI_SRC }); // -> playing
      service.send({ type: "pause" }); // -> paused
      // Force a skip: change to a mismatching voice so shouldSkip is true.
      service.send({ type: "changeVoice", voice: makeVoice(false) });
      emit.mockClear();
      service.send({ type: "play", source: PI_SRC });
      // CHARACTERIZATION: the paused.play skip branch targets "paused" (a
      // self-transition), so it stays paused rather than re-playing.
      expect(service.state.matches({ loaded: "paused" })).toBe(true);
      expect(emit).toHaveBeenCalledWith("audio:skipCurrent");
      expect(service.state.context.skip).toBe(false);
    });

    it("emptied from any loaded substate returns to idle", () => {
      driveToReady();
      service.send({ type: "play", source: PI_SRC }); // -> playing
      emit.mockClear();
      service.send({ type: "emptied" });
      expect(service.state.matches("idle")).toBe(true);
      // Leaving playing emits the stopped-speaking exit action.
      expect(emit).toHaveBeenCalledWith("saypi:piStoppedSpeaking");
    });
  });

  describe("notifySpeechStart side-effect on entering loading", () => {
    it("does not emit skipCurrent and reaches loading for a matching provider source", () => {
      service.send({ type: "changeProvider", provider: piProvider });
      service.send({ type: "loadstart", source: PI_SRC });
      expect(service.state.matches("loading")).toBe(true);
      // notifySpeechStart resolves to null speech (parsers stubbed) so it emits
      // nothing further; the important pin is no spurious skip.
      expect(emit).not.toHaveBeenCalledWith("audio:skipCurrent");
    });
  });

  describe("guard re-evaluation across explicit skip flag", () => {
    it("skipNext then a MATCHING loadstart still skips because the explicit flag wins", () => {
      service.send({ type: "changeProvider", provider: piProvider });
      service.send({ type: "changeVoice", voice: makeVoice(true) }); // would proceed
      service.send({ type: "skipNext" }); // skip=true overrides
      service.send({ type: "loadstart", source: PI_SRC });
      expect(service.state.matches("idle")).toBe(true);
      expect(emit).toHaveBeenCalledWith("audio:skipCurrent");
      expect(service.state.context.skip).toBe(false);
    });
  });

  // ------------------------------------------------------------------
  // Real provider.matches() logic via a genuinely-mismatching domain.
  // The earlier idle tests lean on the default None provider (which never
  // matches). These exercise the provider-domain branch with the REAL Pi
  // provider against a NON-pi.ai source.
  // ------------------------------------------------------------------
  describe("shouldSkip guard: provider domain matching (real Pi provider)", () => {
    it("matching provider but OTHER-domain source is a provider mismatch -> skip", () => {
      service.send({ type: "changeProvider", provider: piProvider });
      service.send({ type: "loadstart", source: OTHER_SRC });
      expect(service.state.matches("idle")).toBe(true);
      expect(emit).toHaveBeenCalledWith("audio:skipCurrent");
    });

    it("replaying suppresses a provider-domain mismatch -> proceeds to loading", () => {
      service.send({ type: "changeProvider", provider: piProvider });
      service.send({ type: "replaying" });
      service.send({ type: "loadstart", source: OTHER_SRC });
      expect(service.state.matches("loading")).toBe(true);
    });

    it("replaying suppresses a VOICE mismatch -> proceeds to loading", () => {
      // Provider matches (Pi vs pi.ai src) but voice does not match. Without
      // replaying this would skip; replaying suppresses the source-mismatch arm.
      service.send({ type: "changeProvider", provider: piProvider });
      service.send({ type: "changeVoice", voice: makeVoice(false) });
      service.send({ type: "replaying" });
      service.send({ type: "loadstart", source: PI_SRC });
      expect(service.state.matches("loading")).toBe(true);
    });
  });

  // ------------------------------------------------------------------
  // notifySpeechStart's downstream emit. With the Pi parser returning a
  // real speech object, entering `loading` must emit
  // saypi:tts:speechStreamStarted with that speech.
  // ------------------------------------------------------------------
  describe("notifySpeechStart emits speechStreamStarted when a speech is parsed", () => {
    it("entering loading with a parsed Pi speech emits speechStreamStarted", async () => {
      const speech = { voice: { name: "Voice A", powered_by: "pi" } };
      piParseResult = speech;
      service.send({ type: "changeProvider", provider: piProvider });
      service.send({ type: "loadstart", source: PI_SRC });
      expect(service.state.matches("loading")).toBe(true);
      // notifySpeechStart awaits getLanguage() then parses; flush microtasks.
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
      expect(piParse).toHaveBeenCalledWith(PI_SRC);
      expect(emit).toHaveBeenCalledWith("saypi:tts:speechStreamStarted", speech);
    });

    it("entering loading with a null parse result does NOT emit speechStreamStarted", async () => {
      piParseResult = null;
      service.send({ type: "changeProvider", provider: piProvider });
      service.send({ type: "loadstart", source: PI_SRC });
      await Promise.resolve();
      await Promise.resolve();
      expect(emit).not.toHaveBeenCalledWith(
        "saypi:tts:speechStreamStarted",
        expect.anything()
      );
    });
  });

  // ------------------------------------------------------------------
  // Unhandled events: pins the machine's silence (no transition, no emit)
  // for events that are not wired in a given state. These document the
  // CURRENT boundaries of each state's `on` map.
  // ------------------------------------------------------------------
  describe("unhandled events are no-ops in their state", () => {
    it("idle ignores playback-lifecycle events (loadedmetadata, pause, ended, seeked)", () => {
      for (const type of ["loadedmetadata", "pause", "ended", "seeked", "canplaythrough", "emptied"]) {
        service.send({ type });
        expect(service.state.matches("idle")).toBe(true);
      }
      // None of these produce side-effects in idle.
      expect(emit).not.toHaveBeenCalled();
    });

    it("loading ignores skipNext and play (only loadedmetadata advances it)", () => {
      service.send({ type: "changeProvider", provider: piProvider });
      service.send({ type: "loadstart", source: PI_SRC });
      expect(service.state.matches("loading")).toBe(true);
      emit.mockClear();
      service.send({ type: "skipNext" });
      service.send({ type: "play", source: PI_SRC });
      // Still loading; neither event is wired there.
      expect(service.state.matches("loading")).toBe(true);
      expect(emit).not.toHaveBeenCalledWith("audio:skipCurrent");
      expect(emit).not.toHaveBeenCalledWith("saypi:piSpeaking");
    });

    it("loaded.ready ignores skipNext, pause, ended (only play advances)", () => {
      service.send({ type: "changeProvider", provider: piProvider });
      service.send({ type: "loadstart", source: PI_SRC });
      service.send({ type: "loadedmetadata" }); // -> loaded.ready
      emit.mockClear();
      service.send({ type: "skipNext" });
      service.send({ type: "pause" });
      service.send({ type: "ended" });
      expect(service.state.matches({ loaded: "ready" })).toBe(true);
      // skipNext is not handled here, so context.skip stays false.
      expect(service.state.context.skip).toBe(false);
      expect(emit).not.toHaveBeenCalled();
    });

    it("loaded.ended ignores play (only seeked returns to ready)", () => {
      service.send({ type: "changeProvider", provider: piProvider });
      service.send({ type: "loadstart", source: PI_SRC });
      service.send({ type: "loadedmetadata" });
      service.send({ type: "play", source: PI_SRC }); // -> playing
      service.send({ type: "ended" }); // -> ended
      emit.mockClear();
      service.send({ type: "play", source: PI_SRC });
      expect(service.state.matches({ loaded: "ended" })).toBe(true);
      expect(emit).not.toHaveBeenCalledWith("saypi:piSpeaking");
    });
  });

  // ------------------------------------------------------------------
  // emptied is wired on the `loaded` parent, so it returns to idle from
  // EVERY substate. The original suite only covered the `playing` case;
  // these pin `ready` (no exit emit) and `paused` (no exit emit).
  // ------------------------------------------------------------------
  describe("emptied returns to idle from every loaded substate", () => {
    function driveToReady() {
      service.send({ type: "changeProvider", provider: piProvider });
      service.send({ type: "loadstart", source: PI_SRC });
      service.send({ type: "loadedmetadata" });
    }

    it("emptied from loaded.ready -> idle (no piStoppedSpeaking, ready has no exit action)", () => {
      driveToReady();
      emit.mockClear();
      service.send({ type: "emptied" });
      expect(service.state.matches("idle")).toBe(true);
      expect(emit).not.toHaveBeenCalledWith("saypi:piStoppedSpeaking");
    });

    it("emptied from loaded.paused -> idle (paused has no exit action)", () => {
      driveToReady();
      service.send({ type: "play", source: PI_SRC }); // -> playing
      service.send({ type: "pause" }); // -> paused
      emit.mockClear();
      service.send({ type: "emptied" });
      expect(service.state.matches("idle")).toBe(true);
      expect(emit).not.toHaveBeenCalledWith("saypi:piStoppedSpeaking");
    });

    it("emptied from loaded.ended -> idle", () => {
      driveToReady();
      service.send({ type: "play", source: PI_SRC }); // -> playing
      service.send({ type: "ended" }); // -> ended
      emit.mockClear();
      service.send({ type: "emptied" });
      expect(service.state.matches("idle")).toBe(true);
    });
  });

  // ------------------------------------------------------------------
  // Global handlers stay internal even inside the compound `loaded` state:
  // they assign context without leaving the current (sub)state.
  // ------------------------------------------------------------------
  describe("global handlers are internal even inside loaded", () => {
    function driveToPlaying() {
      service.send({ type: "changeProvider", provider: piProvider });
      service.send({ type: "loadstart", source: PI_SRC });
      service.send({ type: "loadedmetadata" });
      service.send({ type: "play", source: PI_SRC });
    }

    it("changeVoice while playing updates context without leaving playing", () => {
      driveToPlaying();
      expect(service.state.matches({ loaded: "playing" })).toBe(true);
      const voice = makeVoice(true);
      emit.mockClear();
      service.send({ type: "changeVoice", voice });
      expect(service.state.matches({ loaded: "playing" })).toBe(true);
      expect(service.state.context.voice).toBe(voice);
      // No exit/entry of playing fired.
      expect(emit).not.toHaveBeenCalledWith("saypi:piStoppedSpeaking");
      expect(emit).not.toHaveBeenCalledWith("saypi:piSpeaking");
    });

    it("changeProvider while playing updates context without leaving playing", () => {
      driveToPlaying();
      service.send({ type: "changeProvider", provider: audioProviders.SayPi });
      expect(service.state.matches({ loaded: "playing" })).toBe(true);
      expect(service.state.context.provider).toBe(audioProviders.SayPi);
    });

    it("replaying while playing sets the flag without leaving playing", () => {
      driveToPlaying();
      service.send({ type: "replaying" });
      expect(service.state.matches({ loaded: "playing" })).toBe(true);
      expect(service.state.context.replaying).toBe(true);
    });
  });

  // ------------------------------------------------------------------
  // Emit ordering for the playing -> ended transition: the playing EXIT
  // (piStoppedSpeaking) must fire before the ended ENTRY (piFinishedSpeaking).
  // ------------------------------------------------------------------
  describe("emit ordering on playing -> ended", () => {
    it("piStoppedSpeaking (exit) precedes piFinishedSpeaking (entry)", () => {
      service.send({ type: "changeProvider", provider: piProvider });
      service.send({ type: "loadstart", source: PI_SRC });
      service.send({ type: "loadedmetadata" });
      service.send({ type: "play", source: PI_SRC });
      emit.mockClear();
      service.send({ type: "ended" });
      const calls = emit.mock.calls.map((c: any[]) => c[0]);
      const stoppedIdx = calls.indexOf("saypi:piStoppedSpeaking");
      const finishedIdx = calls.indexOf("saypi:piFinishedSpeaking");
      expect(stoppedIdx).toBeGreaterThanOrEqual(0);
      expect(finishedIdx).toBeGreaterThanOrEqual(0);
      expect(stoppedIdx).toBeLessThan(finishedIdx);
    });
  });

  // ------------------------------------------------------------------
  // A full ended -> seeked -> ready -> play cycle, confirming the machine
  // can re-enter playing after a seek-back from ended.
  // ------------------------------------------------------------------
  describe("ended -> seeked -> ready -> play full cycle", () => {
    it("re-enters playing after seeking back from ended", () => {
      service.send({ type: "changeProvider", provider: piProvider });
      service.send({ type: "loadstart", source: PI_SRC });
      service.send({ type: "loadedmetadata" });
      service.send({ type: "play", source: PI_SRC }); // playing
      service.send({ type: "ended" }); // ended
      service.send({ type: "seeked" }); // ready
      expect(service.state.matches({ loaded: "ready" })).toBe(true);
      emit.mockClear();
      service.send({ type: "play", source: PI_SRC }); // playing again
      expect(service.state.matches({ loaded: "playing" })).toBe(true);
      expect(emit).toHaveBeenCalledWith("saypi:piSpeaking");
    });
  });
});
