import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createTestActor } from "./support/testActor";

// ---------------------------------------------------------------------------
// Regression suite: a voice PREVIEW must not log a spurious error.
//
// Found on live claude.ai (Layer-4 CDP, 2026-07-05): tapping ▶ on a voice with
// a `sample_url` (or auditioning a voice on select, via #484's reroute) logged
//
//   console.error: Failed to get speech from audio source:
//     Invalid source: https://api.saypi.ai/voices/<id>/sample?v=… is not a
//     streaming speech URL.
//
// on every preview. The clip still played (the error is caught → null), but the
// noise fires on a now-live, frequent user action.
//
// Root cause: `notifySpeechStart` (the `loading` entry action) resolves the
// audio source to a transcript via `getSpeechFromAudioSource`, which is gated by
// the HOSTNAME-only `audioProviders.SayPi.matches` (true for api.saypi.ai), then
// hands the URL to `SayPiSpeechSourceParser.parse`, which only accepts a
// `/speak/<id>/stream` TTS stream and throws on a `/voices/<id>/sample` clip.
//
// CRUCIALLY: the sibling AudioOutputMachine-preview.spec.ts MOCKS
// SayPiSpeechSourceParser to resolve null, so it never reproduces this. Here the
// parser is REAL — that's the whole point.
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

// Mock only the heavy leaf module the real SpeechSourceParsers imports — NOT the
// parsers themselves (a sample URL throws before it ever touches the voiceModule).
vi.mock("../../src/tts/SpeechSynthesisModule", () => ({
  SpeechSynthesisModule: { getInstance: () => ({}) },
}));

vi.mock("../../src/prefs/PreferenceModule", () => ({
  UserPreferenceModule: {
    getInstance: () => ({ getLanguage: () => Promise.resolve("en") }),
  },
}));

import { audioOutputMachine } from "../../src/state-machines/AudioOutputMachine";
import { isVoiceSampleUrl } from "../../src/tts/SpeechSourceParsers";

// The exact live sample URL shape (…/voices/<id>/sample?v=<hash>).
const SAMPLE_URL = "https://api.saypi.ai/voices/c6SfcYrb2t09NHXiT80T/sample?v=a1292da1";
// A well-formed TTS stream source — must still be treated as a real speech stream.
const STREAM_URL =
  "https://api.saypi.ai/speak/5dbec6ff-9ee8-43fa-a9c1-e6bd51e9dfc6/stream?voice_id=ig1TeITnnNlsJtfHxJlW&lang=en-GB";

const flush = () => new Promise((r) => setTimeout(r, 0));

describe("AudioOutputMachine — preview source is not mistaken for a speech stream", () => {
  let service: any;
  let errorSpy: any;

  beforeEach(() => {
    emit.mockClear();
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    service = createTestActor(audioOutputMachine);
    service.start();
  });

  afterEach(() => {
    errorSpy.mockRestore();
    try {
      service?.stop();
    } catch {}
  });

  describe("isVoiceSampleUrl", () => {
    it("recognises a canned /voices/<id>/sample preview clip", () => {
      expect(isVoiceSampleUrl(SAMPLE_URL)).toBe(true);
    });

    it("does NOT match a /speak/<id>/stream TTS source", () => {
      expect(isVoiceSampleUrl(STREAM_URL)).toBe(false);
    });

    it("is false for a non-URL or an unrelated audio source", () => {
      expect(isVoiceSampleUrl("not a url")).toBe(false);
      expect(isVoiceSampleUrl("https://pi.ai/audio/track-1.mp3")).toBe(false);
    });
  });

  it("does NOT log a 'streaming speech URL' error when a preview clip loads", async () => {
    service.send({ type: "preview", source: SAMPLE_URL });
    service.send({ type: "loadstart", source: SAMPLE_URL }); // -> loading -> notifySpeechStart
    await flush();
    await flush();

    const streamingErr = errorSpy.mock.calls.find((c: any[]) =>
      String(c[0]).includes("is not a streaming speech URL")
    );
    expect(streamingErr).toBeUndefined();
  });

  it("still logs when a genuinely malformed /speak/ stream fails to resolve (fix stays surgical)", async () => {
    // Guards against the tempting-but-wrong "just gate on the parser's matches()"
    // shortcut, which would swallow real diagnostics for broken stream URLs too.
    const MALFORMED_STREAM = "https://api.saypi.ai/speak/only-an-id"; // no /stream segment
    service.send({ type: "preview", source: MALFORMED_STREAM });
    service.send({ type: "loadstart", source: MALFORMED_STREAM });
    await flush();
    await flush();

    const streamingErr = errorSpy.mock.calls.find((c: any[]) =>
      String(c[0]).includes("is not a streaming speech URL")
    );
    expect(streamingErr).toBeDefined();
  });
});
