import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createTestActor } from "./support/testActor";

// ---------------------------------------------------------------------------
// Behavior suite for the voice-PREVIEW capability of AudioOutputMachine
// (design 2026-07-02-voice-selection-ux.md §4 / handoff §"Client preview
// playback"). A preview plays a free canned sample clip when the user taps ▶
// on a voice row. The one hard requirement: a preview must NEVER talk over
// live TTS or an active call. The machine enforces that structurally —
//
//   • `preview` is only wired in `idle`, so it is silently dropped while the
//     machine is `loading`/`loaded.*` (i.e. while live TTS is in flight); and
//   • a `callActive` context flag (set by `callStarted`/`callEnded`, driven
//     from ConversationMachine's session:* events) guards the idle case where
//     a call is live but momentarily between utterances.
//
// A permitted preview reuses the existing `replaying` flag so its deliberately
// source-mismatched clip is not killed by the `shouldSkip` guard, then emits
// `audio:load` on the SAME channel live TTS uses — no new offscreen plumbing.
//
// Mock surface mirrors AudioOutputMachine-characterization.spec.ts.
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
  SpeechSynthesisModule: { getInstance: () => ({}) },
}));

vi.mock("../../src/prefs/PreferenceModule", () => ({
  UserPreferenceModule: {
    getInstance: () => ({ getLanguage: () => Promise.resolve("en") }),
  },
}));

vi.mock("../../src/tts/SpeechSourceParsers", () => ({
  PiSpeechSourceParser: vi.fn().mockImplementation(() => ({
    parse: () => null,
  })),
  SayPiSpeechSourceParser: vi.fn().mockImplementation(() => ({
    parse: () => Promise.resolve(null),
  })),
}));

import { audioOutputMachine } from "../../src/state-machines/AudioOutputMachine";
import { audioProviders } from "../../src/tts/SpeechModel";

const piProvider = audioProviders.Pi;
const PI_SRC = "https://pi.ai/audio/track-1.mp3";
// A canned sample lives on api.saypi.ai and is deliberately NOT the selected
// voice's source, so it exercises the mismatch-exempt (replaying) path.
const SAMPLE_URL = "https://api.saypi.ai/voices/nova/sample.mp3";

describe("AudioOutputMachine — voice preview playback", () => {
  let service: any;

  beforeEach(() => {
    emit.mockClear();
    service = createTestActor(audioOutputMachine);
    service.start();
  });

  afterEach(() => {
    try {
      service?.stop();
    } catch {}
  });

  describe("preview from idle (nothing playing, no call)", () => {
    it("emits audio:load with the sample url and marks the track as replaying", () => {
      service.send({ type: "preview", source: SAMPLE_URL });
      // Stays in idle: the real <audio> loadstart (driven by AudioModule) is
      // what advances the machine — preview only arms + kicks the load.
      expect(service.state.matches("idle")).toBe(true);
      expect(service.state.context.replaying).toBe(true);
      expect(emit).toHaveBeenCalledWith("audio:load", { url: SAMPLE_URL });
    });

    it("the armed replaying flag exempts the mismatched sample from shouldSkip", () => {
      // No provider/voice selected (default None) => the sample source would
      // normally be skipped as a mismatch. preview must let it through.
      service.send({ type: "preview", source: SAMPLE_URL });
      service.send({ type: "loadstart", source: SAMPLE_URL });
      expect(service.state.matches("loading")).toBe(true);
      expect(emit).not.toHaveBeenCalledWith("audio:skipCurrent");
    });
  });

  describe("preview never talks over live TTS", () => {
    function driveToPlaying() {
      service.send({ type: "changeProvider", provider: piProvider });
      service.send({ type: "loadstart", source: PI_SRC });
      service.send({ type: "loadedmetadata" });
      service.send({ type: "play", source: PI_SRC });
    }

    it("is suppressed while a track is playing (no audio:load, state unchanged)", () => {
      driveToPlaying();
      expect(service.state.matches({ loaded: "playing" })).toBe(true);
      emit.mockClear();
      service.send({ type: "preview", source: SAMPLE_URL });
      expect(emit).not.toHaveBeenCalledWith("audio:load", { url: SAMPLE_URL });
      expect(service.state.matches({ loaded: "playing" })).toBe(true);
    });

    it("is suppressed while loading a track", () => {
      service.send({ type: "changeProvider", provider: piProvider });
      service.send({ type: "loadstart", source: PI_SRC }); // -> loading
      expect(service.state.matches("loading")).toBe(true);
      emit.mockClear();
      service.send({ type: "preview", source: SAMPLE_URL });
      expect(emit).not.toHaveBeenCalledWith("audio:load", { url: SAMPLE_URL });
      expect(service.state.matches("loading")).toBe(true);
    });
  });

  describe("preview is allowed from every resting (non-audible) state", () => {
    function driveToReady() {
      service.send({ type: "changeProvider", provider: piProvider });
      service.send({ type: "loadstart", source: PI_SRC });
      service.send({ type: "loadedmetadata" }); // -> loaded.ready
    }

    it("allows a preview from loaded.ready (loaded but not yet playing)", () => {
      driveToReady();
      expect(service.state.matches({ loaded: "ready" })).toBe(true);
      emit.mockClear();
      service.send({ type: "preview", source: SAMPLE_URL });
      expect(emit).toHaveBeenCalledWith("audio:load", { url: SAMPLE_URL });
    });

    it("allows a preview from loaded.paused (a paused reply is not audible)", () => {
      driveToReady();
      service.send({ type: "play", source: PI_SRC }); // -> playing
      service.send({ type: "pause" }); // -> paused
      expect(service.state.matches({ loaded: "paused" })).toBe(true);
      emit.mockClear();
      service.send({ type: "preview", source: SAMPLE_URL });
      expect(emit).toHaveBeenCalledWith("audio:load", { url: SAMPLE_URL });
    });
  });

  describe("a lingering skip flag never swallows an intentional preview", () => {
    it("clears an armed skip so the preview's own load is not skipped", () => {
      // skip can be armed (audio:skipNext, Pi auto-play suppression) and left
      // unconsumed into a later idle. A deliberate ▶ tap must still play.
      service.send({ type: "skipNext" }); // skip = true
      service.send({ type: "preview", source: SAMPLE_URL });
      service.send({ type: "loadstart", source: SAMPLE_URL }); // the preview's own load
      expect(service.state.matches("loading")).toBe(true);
      expect(emit).not.toHaveBeenCalledWith("audio:skipCurrent");
    });
  });

  describe("the menu stays usable after a preview finishes", () => {
    it("allows a second preview once the first has ended (rests in loaded.ended, not idle)", () => {
      const SECOND = "https://api.saypi.ai/voices/ash/sample.mp3";
      // Play the first preview clip through to completion.
      service.send({ type: "preview", source: SAMPLE_URL });
      service.send({ type: "loadstart", source: SAMPLE_URL });
      service.send({ type: "loadedmetadata" });
      service.send({ type: "play", source: SAMPLE_URL });
      service.send({ type: "ended" });
      expect(service.state.matches({ loaded: "ended" })).toBe(true);
      emit.mockClear();
      // A second ▶ tap must audition again — not be silently dropped because
      // the finished clip left the machine parked in loaded.ended.
      service.send({ type: "preview", source: SECOND });
      expect(emit).toHaveBeenCalledWith("audio:load", { url: SECOND });
    });
  });

  describe("preview never talks over an active call", () => {
    it("callStarted/callEnded toggle context.callActive without leaving idle", () => {
      expect(service.state.context.callActive).toBe(false);
      service.send({ type: "callStarted" });
      expect(service.state.context.callActive).toBe(true);
      expect(service.state.matches("idle")).toBe(true);
      service.send({ type: "callEnded" });
      expect(service.state.context.callActive).toBe(false);
    });

    it("is dropped while a call is active (idle but callActive), allowed once it ends", () => {
      service.send({ type: "callStarted" });
      service.send({ type: "preview", source: SAMPLE_URL });
      expect(emit).not.toHaveBeenCalledWith("audio:load", { url: SAMPLE_URL });

      service.send({ type: "callEnded" });
      service.send({ type: "preview", source: SAMPLE_URL });
      expect(emit).toHaveBeenCalledWith("audio:load", { url: SAMPLE_URL });
    });
  });
});
