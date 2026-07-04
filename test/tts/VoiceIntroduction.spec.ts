import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../src/ConfigModule", () => ({
  config: { appServerUrl: "https://app.example.com", apiServerUrl: "https://api.saypi.ai" },
}));

// Break the VoiceMenu -> Pi -> PiVoiceMenu -> VoiceMenu import cycle.
vi.mock("../../src/chatbots/Pi", () => ({ PiAIChatbot: class {} }));

vi.mock("../../src/JwtManager", () => ({
  getJwtManagerSync: () => ({ isAuthenticated: () => true, getClaims: () => null }),
}));

// No recent assistant message → introduceVoice falls back to the per-voice intro string.
vi.mock("../../src/dom/ChatHistory", () => ({ getMostRecentAssistantMessage: () => undefined }));
const getMessageMock = vi.fn((key: string, _subs?: string[]) => `intro:${key}`);
vi.mock("../../src/i18n", () => ({ default: (key: string, subs?: string[]) => getMessageMock(key, subs) }));

const createCompletedSpeechStreamMock = vi.fn();
const createSpeechMock = vi.fn();
const speakMock = vi.fn();
vi.mock("../../src/tts/SpeechSynthesisModule", () => ({
  SpeechSynthesisModule: {
    getInstance: () => ({
      createCompletedSpeechStream: createCompletedSpeechStreamMock,
      createSpeech: createSpeechMock,
      speak: speakMock,
    }),
  },
}));

const emitMock = vi.fn();
vi.mock("../../src/events/EventBus", () => ({
  default: { emit: (...args: any[]) => emitMock(...args), on: vi.fn(), off: vi.fn() },
}));

import { VoiceSelector } from "../../src/tts/VoiceMenu";

class TestVoiceSelector extends VoiceSelector {
  getId(): string {
    return "test-voice-selector";
  }
  getButtonClasses(): string[] {
    return [];
  }
}

/**
 * #375: introducing a SayPi custom voice must request a STREAMING speech source.
 * The non-streaming `createSpeech(text, false)` builds a `…/speak/<id>` URL (no
 * `/stream` segment), which the audio-output source parser rejects with
 * "is not a streaming speech URL" → the intro is silent + an error is logged.
 */
describe("VoiceSelector.introduceVoice — streaming source (#375)", () => {
  let selector: TestVoiceSelector;
  const customVoice: any = { id: "vabc", name: "Jarnathan", default: false, powered_by: "inflection.ai" };

  beforeEach(() => {
    createCompletedSpeechStreamMock.mockReset().mockResolvedValue({ voice: null });
    createSpeechMock.mockReset().mockResolvedValue({ voice: null });
    speakMock.mockReset();
    getMessageMock.mockReset().mockImplementation((key: string) => `intro:${key}`);
    const el = document.createElement("div");
    // A non-Pi chatbot so introduceVoice takes the custom-voice branch.
    const chatbot: any = { getID: () => "claude" };
    selector = new TestVoiceSelector(chatbot, {} as any, el);
  });

  it("introduces the custom voice via a finalized streaming source, not non-streaming createSpeech", async () => {
    selector.introduceVoice(customVoice);
    // allow the createCompletedSpeechStream promise chain to settle
    await new Promise((r) => setTimeout(r, 0));

    // The finalized-streaming path (open → send text → finalize) is what produces a
    // playable `…/speak/<id>/stream` source; the non-streaming createSpeech is not used.
    expect(createCompletedSpeechStreamMock).toHaveBeenCalledTimes(1);
    expect(createSpeechMock).not.toHaveBeenCalled();
    const [textArg] = createCompletedSpeechStreamMock.mock.calls[0];
    expect(textArg).toBe(`intro:voiceIntroduction_jarnathan`);
    expect(speakMock).toHaveBeenCalledTimes(1);
  });

  it("falls back to the generic introduction when the voice has no voice-specific script", async () => {
    // chrome.i18n returns "" for a missing voiceIntroduction_<name> key.
    getMessageMock.mockImplementation((key: string, subs?: string[]) =>
      key === "voiceIntroductionGeneric" ? `Hi, I'm ${subs?.[0]}.` : ""
    );

    selector.introduceVoice(customVoice);
    await new Promise((r) => setTimeout(r, 0));

    expect(createCompletedSpeechStreamMock).toHaveBeenCalledTimes(1);
    const [textArg] = createCompletedSpeechStreamMock.mock.calls[0];
    expect(textArg).toBe("Hi, I'm Jarnathan."); // non-empty → something to synthesize
    expect(speakMock).toHaveBeenCalledTimes(1);
  });

  it("does NOT synthesize an empty intro (no blank stream / 405) when there is no text at all", async () => {
    getMessageMock.mockImplementation(() => ""); // every i18n lookup empty

    selector.introduceVoice(customVoice);
    await new Promise((r) => setTimeout(r, 0));

    expect(createCompletedSpeechStreamMock).not.toHaveBeenCalled();
    expect(createSpeechMock).not.toHaveBeenCalled();
    expect(speakMock).not.toHaveBeenCalled();
  });
});

/**
 * Phase 1.5 (founder-chosen): route the existing select-time audition through
 * the gated preview path, so selecting a voice mid-turn no longer talks over
 * live TTS / an active call — it is suppressed instead. The audition still
 * SYNTHESIZES (metered) for custom voices; only its PLAYBACK is gated. The
 * metered synthesis itself is retired later (Phase 2, server-gated on clips).
 */
describe("VoiceSelector.introduceVoice — routes audition through the gated preview path", () => {
  const customVoice: any = { id: "vabc", name: "Jarnathan", default: false, powered_by: "inflection.ai" };

  beforeEach(() => {
    createCompletedSpeechStreamMock.mockReset().mockResolvedValue({ voice: null });
    createSpeechMock.mockReset().mockResolvedValue({ voice: null });
    speakMock.mockReset();
    emitMock.mockReset();
    getMessageMock.mockReset().mockImplementation((key: string) => `intro:${key}`);
  });

  it("plays a custom-voice audition through speak(..., preview=true), not ungated", async () => {
    const el = document.createElement("div");
    const chatbot: any = { getID: () => "claude" }; // custom-voice branch
    const selector = new TestVoiceSelector(chatbot, {} as any, el);

    selector.introduceVoice(customVoice);
    await new Promise((r) => setTimeout(r, 0));

    expect(speakMock).toHaveBeenCalledTimes(1);
    // The 3rd arg is the preview flag: true routes playback through audio:preview.
    expect(speakMock.mock.calls[0][2]).toBe(true);
  });

  it("plays a built-in voice audition via audio:preview, not the ungated audio:load", () => {
    const el = document.createElement("div");
    // A built-in provider (has getVoiceIntroductionUrl) with a default voice.
    const chatbot: any = {
      getID: () => "pi",
      getExtraVoices: () => [],
      getVoiceIntroductionUrl: (id: string) => `https://pi.ai/intro/${id}`,
    };
    const selector = new TestVoiceSelector(chatbot, {} as any, el);
    const builtInVoice: any = { id: "1", name: "Pi 1", default: true, powered_by: "inflection.ai" };

    selector.introduceVoice(builtInVoice);

    expect(emitMock).toHaveBeenCalledWith("audio:preview", {
      url: "https://pi.ai/intro/1",
    });
    expect(emitMock).not.toHaveBeenCalledWith("audio:load", expect.anything());
  });
});

/**
 * Phase 2 (server-gated on canned clips — now live): once saypi-api serves a free
 * `sample_url` per voice (design §4), the select-time audition plays that FREE clip
 * through the gated preview channel instead of synthesizing "Hi, I'm X" via the
 * METERED live-TTS path. Auditioning a voice must no longer burn the user's TTS
 * quota (the `introduceVoice()` metered-preview defect, amplified post-flip by
 * novelty). Metered synthesis stays ONLY as the fallback for voices that carry no
 * clip (e.g. a user's private custom clone the catalog can't pre-render).
 */
describe("VoiceSelector.introduceVoice — prefers the free sample_url clip over metered synthesis (Phase 2)", () => {
  beforeEach(() => {
    createCompletedSpeechStreamMock.mockReset().mockResolvedValue({ voice: null });
    createSpeechMock.mockReset().mockResolvedValue({ voice: null });
    speakMock.mockReset();
    emitMock.mockReset();
    getMessageMock.mockReset().mockImplementation((key: string) => `intro:${key}`);
  });

  it("plays the free sample_url clip via audio:preview and does NOT synthesize (no quota spend)", async () => {
    const el = document.createElement("div");
    const chatbot: any = { getID: () => "claude" }; // catalog voice on a non-built-in host
    const selector = new TestVoiceSelector(chatbot, {} as any, el);
    const sampleUrl = "https://api.saypi.ai/voices/nova/sample?v=abc123";
    const catalogVoice: any = {
      id: "nova",
      name: "Nova",
      default: false,
      powered_by: "OpenAI",
      sample_url: sampleUrl,
    };

    selector.introduceVoice(catalogVoice);
    await new Promise((r) => setTimeout(r, 0));

    expect(emitMock).toHaveBeenCalledWith("audio:preview", { url: sampleUrl });
    // The metered live-TTS path must NOT run when a free clip exists.
    expect(createCompletedSpeechStreamMock).not.toHaveBeenCalled();
    expect(speakMock).not.toHaveBeenCalled();
  });

  it("still falls back to gated metered synthesis for a voice with no sample_url (custom clone)", async () => {
    const el = document.createElement("div");
    const chatbot: any = { getID: () => "claude" };
    const selector = new TestVoiceSelector(chatbot, {} as any, el);
    // A user's private clone carries no pre-rendered catalog clip.
    const customClone: any = { id: "vabc", name: "Jarnathan", default: false, powered_by: "ElevenLabs" };

    selector.introduceVoice(customClone);
    await new Promise((r) => setTimeout(r, 0));

    expect(createCompletedSpeechStreamMock).toHaveBeenCalledTimes(1);
    expect(speakMock).toHaveBeenCalledTimes(1);
    expect(speakMock.mock.calls[0][2]).toBe(true); // still gated (preview=true)
    // No free clip → nothing played directly through the preview channel.
    expect(emitMock).not.toHaveBeenCalledWith(
      "audio:preview",
      expect.objectContaining({ url: expect.stringContaining("/sample") })
    );
  });

  it("prefers sample_url even for a built-in default voice when the catalog serves one", () => {
    const el = document.createElement("div");
    const chatbot: any = {
      getID: () => "pi",
      getExtraVoices: () => [],
      getVoiceIntroductionUrl: (id: string) => `https://pi.ai/intro/${id}`,
    };
    const selector = new TestVoiceSelector(chatbot, {} as any, el);
    const sampleUrl = "https://api.saypi.ai/voices/1/sample?v=zzz";
    const builtInVoice: any = {
      id: "1",
      name: "Pi 1",
      default: true,
      powered_by: "inflection.ai",
      sample_url: sampleUrl,
    };

    selector.introduceVoice(builtInVoice);

    // The canonical catalog clip wins over the provider's own intro URL.
    expect(emitMock).toHaveBeenCalledWith("audio:preview", { url: sampleUrl });
    expect(emitMock).not.toHaveBeenCalledWith("audio:preview", {
      url: "https://pi.ai/intro/1",
    });
  });
});
