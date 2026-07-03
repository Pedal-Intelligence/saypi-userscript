import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import type { Mock } from "vitest";
import { SpeechSynthesisModule } from "../../src/tts/SpeechSynthesisModule";
import { TextToSpeechService } from "../../src/tts/TextToSpeechService";
import { AudioStreamManager } from "../../src/tts/AudioStreamManager";
import { mockVoices } from "../data/Voices";
import { UserPreferenceModule } from "../../src/prefs/PreferenceModule";
import {
  audioProviders,
  isPlaceholderUtterance,
  SpeechSynthesisVoiceRemote,
} from "../../src/tts/SpeechModel";
import EventBus from "../../src/events/EventBus";

// Controllable stand-in for the JwtManager singleton: the voice cache's
// validity is keyed off the auth state it reports (#456).
const fakeAuth = vi.hoisted(() => ({
  authenticated: false,
  userId: undefined as string | undefined,
}));

vi.mock("../../src/JwtManager", () => {
  const fakeJwtManager = {
    isAuthenticated: () => fakeAuth.authenticated,
    getClaims: () => (fakeAuth.userId ? { userId: fakeAuth.userId } : null),
  };
  return {
    JwtManager: class {},
    getJwtManagerSync: () => fakeJwtManager,
    getJwtManager: () => Promise.resolve(fakeJwtManager),
    default: () => Promise.resolve(fakeJwtManager),
  };
});

describe("SpeechSynthesisModule", () => {
  let speechSynthesisModule: SpeechSynthesisModule;
  let textToSpeechServiceMock: TextToSpeechService;
  let audioStreamManagerMock: AudioStreamManager;
  let userPreferenceModuleMock: UserPreferenceModule;

  beforeEach(() => {
    // mock the ConfigModule
    vi.mock("../../src/ConfigModule", () => ({
      config: {
        appServerUrl: "https://app.example.com",
        apiServerUrl: "https://api.saypi.ai",
        GA_MEASUREMENT_ID: "GA_MEASUREMENT_ID",
        GA_API_SECRET: "GA_API_SECRET",
        GA_ENDPOINT: "GA_ENDPOINT",
      },
    }));

    textToSpeechServiceMock = {
      getVoiceById: vi.fn(() => Promise.resolve(mockVoices[0])),
      getVoices: vi.fn(() => Promise.resolve(mockVoices)),
      createSpeech: vi.fn(),
      addTextToSpeechStream: vi.fn(),
    } as unknown as TextToSpeechService;

    audioStreamManagerMock = {
      createStream: vi.fn(),
      addSpeechToStream: vi.fn(),
      endStream: vi.fn(),
      isOpen: vi.fn().mockReturnValue(false),
    } as unknown as AudioStreamManager;

    fakeAuth.authenticated = false;
    fakeAuth.userId = undefined;

    const preferredVoiceMock = mockVoices[0];

    userPreferenceModuleMock = {
      hasVoice: vi.fn().mockResolvedValue(true),
      getVoice: vi.fn().mockResolvedValue(preferredVoiceMock),
      getLanguage: vi.fn().mockResolvedValue("en-US"),
    } as unknown as UserPreferenceModule;

    speechSynthesisModule = new SpeechSynthesisModule(
      textToSpeechServiceMock,
      audioStreamManagerMock,
      userPreferenceModuleMock
    );
  });

  afterEach(() => {
    // Some tests register menu-style listeners on the shared singleton
    // EventBus; drop them so they can't leak into unrelated tests.
    EventBus.removeAllListeners("saypi:auth:status-changed");
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it("should create an instance of SpeechSynthesisModule", () => {
    expect(speechSynthesisModule).toBeInstanceOf(SpeechSynthesisModule);
  });

  it("should initialize the provider", () => {
    const initProviderSpy = vi.spyOn(speechSynthesisModule, "initProvider");
    speechSynthesisModule.initProvider();
    expect(initProviderSpy).toHaveBeenCalled();
  });

  it("should get voices from the cache if available", async () => {
    speechSynthesisModule._cacheVoices(mockVoices, "claude");

    const actualVoices = await speechSynthesisModule.getVoices(undefined, "claude");

    expect(actualVoices).toEqual(mockVoices);
    expect(textToSpeechServiceMock.getVoices).not.toHaveBeenCalled();
  });

  it("should get voices from the TextToSpeechService if cache is empty", async () => {
    textToSpeechServiceMock.getVoices = vi.fn(() =>
      Promise.resolve(mockVoices)
    );

    const voices = await speechSynthesisModule.getVoices(undefined, "claude");

    expect(voices).toEqual(mockVoices);

    // Assert that the spy was called
    expect(textToSpeechServiceMock.getVoices).toHaveBeenCalledWith(
      undefined,
      "claude"
    );
  });

  it("should get voice by ID from the cache if available", async () => {
    const mockVoice = mockVoices[0];
    speechSynthesisModule._cacheVoices([mockVoice], "claude");

    const voice = await speechSynthesisModule.getVoiceById(
      mockVoice.id,
      undefined,
      "claude"
    );

    expect(voice).toEqual(mockVoice);
    expect(textToSpeechServiceMock.getVoiceById).not.toHaveBeenCalled();
  });

  it("should create a speech stream", async () => {
    const mockVoice = mockVoices[0];
    const mockUtterance = {
      id: "uuid",
      text: "Hello",
      lang: "en-US",
      voice: mockVoice,
      uri: "https://api.saypi.ai/speak/uuid",
      provider: audioProviders.SayPi,
    };
    audioStreamManagerMock.createStream = vi.fn(() =>
      Promise.resolve(mockUtterance)
    );

    const utterance = await speechSynthesisModule.createSpeechStream({
      getID: () => "claude",
    } as any);

    expect(utterance).toEqual(mockUtterance);
    expect(audioStreamManagerMock.createStream).toHaveBeenCalled();
  });

  it("createCompletedSpeechStream opens, sends the full text, and finalizes a one-shot stream (#375)", async () => {
    const mockUtterance = {
      id: "intro-uuid",
      text: " ",
      lang: "en-US",
      voice: mockVoices[0],
      uri: "https://api.saypi.ai/speak/intro-uuid/stream?voice_id=x",
      provider: audioProviders.SayPi,
    };
    (audioStreamManagerMock.createStream as Mock).mockResolvedValue(mockUtterance);

    const utterance = await speechSynthesisModule.createCompletedSpeechStream(
      "Hi, I'm Jarnathan.",
      { getID: () => "claude" } as any
    );

    expect(audioStreamManagerMock.createStream).toHaveBeenCalled();
    // Full text sent via the PUT-chunk protocol, then finalized — so the stream's
    // `…/speak/<id>/stream` GET returns audio (a bare createSpeech 405s).
    expect(audioStreamManagerMock.addSpeechToStream).toHaveBeenCalledWith(
      "intro-uuid",
      "Hi, I'm Jarnathan."
    );
    expect(audioStreamManagerMock.endStream).toHaveBeenCalledWith("intro-uuid");
    expect(utterance).toBe(mockUtterance);
  });

  // A voice audition (introduceVoice) must route its playback through the gated
  // audio:preview channel so it never talks over live TTS or an active call
  // (design §4). Normal conversation playback still loads directly.
  describe("speak() playback channel", () => {
    const utterance = {
      id: "u1",
      lang: "en-US",
      voice: mockVoices[0],
      uri: "https://api.saypi.ai/speak/u1/stream?voice_id=x",
      provider: audioProviders.SayPi,
      toString: () => "u1",
    } as any;

    it("emits audio:load for normal playback (preview omitted)", async () => {
      const emitSpy = vi.spyOn(EventBus, "emit");
      speechSynthesisModule.speak(utterance, { getID: () => "claude" } as any);
      await new Promise((r) => setTimeout(r, 0));
      expect(emitSpy).toHaveBeenCalledWith("audio:load", {
        url: utterance.uri,
      });
      expect(emitSpy).not.toHaveBeenCalledWith("audio:preview", expect.anything());
    });

    it("emits audio:preview (the gated channel) when preview is true", async () => {
      const emitSpy = vi.spyOn(EventBus, "emit");
      speechSynthesisModule.speak(utterance, { getID: () => "claude" } as any, true);
      await new Promise((r) => setTimeout(r, 0));
      expect(emitSpy).toHaveBeenCalledWith("audio:preview", {
        url: utterance.uri,
      });
      expect(emitSpy).not.toHaveBeenCalledWith("audio:load", expect.anything());
    });
  });

  it("createCompletedSpeechStream sends no text and finalizes nothing when voice is off (#375)", async () => {
    (userPreferenceModuleMock.getVoice as Mock).mockResolvedValue(null);

    const utterance = await speechSynthesisModule.createCompletedSpeechStream(
      "Hi.",
      { getID: () => "claude" } as any
    );

    expect(isPlaceholderUtterance(utterance)).toBe(true);
    expect(audioStreamManagerMock.addSpeechToStream).not.toHaveBeenCalled();
    expect(audioStreamManagerMock.endStream).not.toHaveBeenCalled();
  });

  it("reuses an open stream when the same messageId is provided", async () => {
    const mockVoice = mockVoices[0];
    const mockUtterance = {
      id: "uuid",
      text: "Hello again",
      lang: "en-US",
      voice: mockVoice,
      uri: "https://api.saypi.ai/speak/uuid",
      provider: audioProviders.SayPi,
    };

    (audioStreamManagerMock.createStream as Mock).mockResolvedValue(mockUtterance);
    (audioStreamManagerMock.isOpen as Mock).mockReturnValue(true);

    const chatbot = { getID: () => "claude" } as any;
    const first = await speechSynthesisModule.createSpeechStream(chatbot, "message-123");
    const second = await speechSynthesisModule.createSpeechStream(chatbot, "message-123");

    expect(first).toBe(second);
    expect(audioStreamManagerMock.createStream).toHaveBeenCalledTimes(1);
  });

  it("returns a silent placeholder instead of throwing when no voice is selected (voice off)", async () => {
    // Voice off (getVoice resolves null) must be a no-op for the auto-TTS path,
    // not an uncaught "No voice selected" throw that aborts message decoration.
    (userPreferenceModuleMock.getVoice as Mock).mockResolvedValue(null);

    const utterance = await speechSynthesisModule.createSpeechStream(
      { getID: () => "claude" } as any,
      "message-voiceoff"
    );

    expect(isPlaceholderUtterance(utterance)).toBe(true);
    expect(audioStreamManagerMock.createStream).not.toHaveBeenCalled();
  });

  it("keeps native audio for chatbots without a Say Pi voice selection", async () => {
    const preferredVoice = mockVoices[0];
    (userPreferenceModuleMock.hasVoice as Mock).mockImplementation(
      async (chatbotArg?: any) => {
        const id = typeof chatbotArg === "string" ? chatbotArg : chatbotArg?.getID?.();
        return id === "claude";
      }
    );
    (userPreferenceModuleMock.getVoice as Mock).mockImplementation(
      async (chatbotArg?: any) => {
        const id = typeof chatbotArg === "string" ? chatbotArg : chatbotArg?.getID?.();
        return id === "claude" ? preferredVoice : null;
      }
    );

    const claudeChatbot = { getID: () => "claude" } as any;
    const chatgptChatbot = { getID: () => "chatgpt" } as any;

    const claudeProvider = await speechSynthesisModule.getActiveAudioProvider(
      claudeChatbot
    );
    const chatgptProvider = await speechSynthesisModule.getActiveAudioProvider(
      chatgptChatbot
    );

    expect(claudeProvider).toEqual(audioProviders.SayPi);
    expect(chatgptProvider).toEqual(
      audioProviders.getDefaultForChatbot("chatgpt")
    );
  });

  it("uses per-chatbot Say Pi voices without affecting other chatbots", async () => {
    const claudeVoice = { ...mockVoices[0] };
    const chatgptVoice = { ...mockVoices[0], id: "other", name: "Other Voice" };

    (userPreferenceModuleMock.getVoice as Mock).mockImplementation(
      async (chatbotArg?: any) => {
        const id = typeof chatbotArg === "string" ? chatbotArg : chatbotArg?.getID?.();
        if (id === "chatgpt") {
          return chatgptVoice;
        }
        return claudeVoice;
      }
    );

    const claudeChatbot = { getID: () => "claude" } as any;
    const chatgptChatbot = { getID: () => "chatgpt" } as any;

    const claudeProvider = await speechSynthesisModule.getActiveAudioProvider(
      claudeChatbot
    );
    const chatgptProvider = await speechSynthesisModule.getActiveAudioProvider(
      chatgptChatbot
    );

    expect(claudeProvider).toEqual(audioProviders.SayPi);
    expect(chatgptProvider).toEqual(audioProviders.SayPi);
  });

  it("disables Say Pi provider when no voice preference is set for Claude", async () => {
    (userPreferenceModuleMock.getVoice as Mock).mockResolvedValue(null);

    const claudeChatbot = { getID: () => "claude" } as any;

    const provider = await speechSynthesisModule.getActiveAudioProvider(
      claudeChatbot
    );

    expect(provider).toBe(audioProviders.None);
  });

  it("falls back to native providers when no Say Pi voices are selected", async () => {
    (userPreferenceModuleMock.getVoice as Mock).mockResolvedValue(null);

    const chatgptChatbot = { getID: () => "chatgpt" } as any;

    const provider = await speechSynthesisModule.getActiveAudioProvider(
      chatgptChatbot
    );

    expect(provider).toEqual(
      audioProviders.getDefaultForChatbot("chatgpt")
    );
  });

  // The voice list is auth-dependent (401 → [], plus per-user custom voices),
  // so a cached list is only valid for the auth state it was fetched under.
  // Invalidation is keyed off JwtManager's synchronous state — which the
  // content script updates *before* emitting saypi:auth:status-changed — so it
  // holds regardless of EventBus listener ordering (#456).
  it("invalidates the voice cache on sign-out so a refetch returns the 401 shape (#456)", async () => {
    // Seed the cache as a signed-in session would.
    fakeAuth.authenticated = true;
    fakeAuth.userId = "user-a";
    speechSynthesisModule._cacheVoices(mockVoices, "claude");

    // Sign out: fetches now come back empty (TextToSpeechService maps 401 → []).
    textToSpeechServiceMock.getVoices = vi.fn(() => Promise.resolve([]));
    fakeAuth.authenticated = false;
    fakeAuth.userId = undefined;

    const voices = await speechSynthesisModule.getVoices(undefined, "claude");

    expect(textToSpeechServiceMock.getVoices).toHaveBeenCalled();
    expect(voices).toEqual([]);
  });

  it("refetches fresh voices on an account switch (#456)", async () => {
    // The previous account's voices are cached...
    fakeAuth.authenticated = true;
    fakeAuth.userId = "user-a";
    speechSynthesisModule._cacheVoices([mockVoices[0]], "claude");

    // ...then a different account signs in, with its own voice list.
    const freshVoices = [{ ...mockVoices[0], id: "fresh-voice", name: "Fresh Voice" }];
    textToSpeechServiceMock.getVoices = vi.fn(() => Promise.resolve(freshVoices));
    fakeAuth.userId = "user-b";

    const voices = await speechSynthesisModule.getVoices(undefined, "claude");

    expect(textToSpeechServiceMock.getVoices).toHaveBeenCalled();
    expect(voices).toEqual(freshVoices);
  });

  // On the standard bootstrap path the first VoiceSelector registers its
  // re-render listener BEFORE this module exists (the selector's own ctor
  // chain constructs the singleton), and EventBus dispatches in insertion
  // order. An event-driven cache clear in this module would therefore run
  // *after* the menu had already re-read the stale cache. The invalidation
  // must be listener-order-independent: the menu's synchronous getVoices call
  // during the sign-out re-render must already see an invalidated cache.
  it("serves the signed-out list to a menu listener that runs before the module's own auth handling (#456)", async () => {
    fakeAuth.authenticated = true;
    fakeAuth.userId = "user-a";

    // Mirror bootstrap order: menu listener first, module constructed second.
    EventBus.removeAllListeners("saypi:auth:status-changed");
    let voicesSeenByMenu: Promise<SpeechSynthesisVoiceRemote[]> | undefined;
    EventBus.on("saypi:auth:status-changed", () => {
      voicesSeenByMenu = lateModule.getVoices(undefined, "claude");
    });
    const lateModule = new SpeechSynthesisModule(
      textToSpeechServiceMock,
      audioStreamManagerMock,
      userPreferenceModuleMock
    );
    lateModule._cacheVoices(mockVoices, "claude");

    // Sign out. JwtManager's state is reconciled with the broadcast before
    // the event is emitted (handleAuthStatusUpdate in AuthStatusSync.ts —
    // exercised against the real JwtManager in test/AuthStatusSync.spec.ts).
    textToSpeechServiceMock.getVoices = vi.fn(() => Promise.resolve([]));
    fakeAuth.authenticated = false;
    fakeAuth.userId = undefined;
    EventBus.emit("saypi:auth:status-changed", false);

    expect(await voicesSeenByMenu).toEqual([]);
    expect(textToSpeechServiceMock.getVoices).toHaveBeenCalled();
  });

  // A voices fetch that started under the previous auth state must not
  // populate the cache after the auth state changes — a late response would
  // resurrect the previous user's voice list.
  it("discards an in-flight voices response that raced an auth change (#456)", async () => {
    fakeAuth.authenticated = true;
    fakeAuth.userId = "user-a";

    let resolveStaleFetch!: (voices: SpeechSynthesisVoiceRemote[]) => void;
    textToSpeechServiceMock.getVoices = vi.fn(
      () =>
        new Promise<SpeechSynthesisVoiceRemote[]>((resolve) => {
          resolveStaleFetch = resolve;
        })
    );
    const staleCall = speechSynthesisModule.getVoices(undefined, "claude");

    // Sign out while user A's fetch is still in flight; a signed-out call
    // starts its own fetch, then user A's response arrives late.
    fakeAuth.authenticated = false;
    fakeAuth.userId = undefined;
    textToSpeechServiceMock.getVoices = vi.fn(() => Promise.resolve([]));
    const signedOutCall = speechSynthesisModule.getVoices(undefined, "claude");
    resolveStaleFetch(mockVoices);

    expect(await signedOutCall).toEqual([]);
    expect(await staleCall).toEqual([]); // must not surface user A's voices
    // ...and the late response must not have poisoned the cache for later reads.
    expect(await speechSynthesisModule.getVoices(undefined, "claude")).toEqual([]);
  });

  // "" is InputBuffer's end-of-speech sentinel (END_OF_SPEECH_MARKER). ChatGPT's
  // writing-started marker (#399) emits an empty stream chunk to open the
  // piWriting window at the true start of the response. If that empty chunk were
  // appended to an already-open SayPi stream (a SayPi-voice-on-ChatGPT user) it
  // would be read as end-of-speech and silently close the stream, dropping the
  // rest of the reply's audio. A non-final empty text:added is never legitimate
  // — real end-of-speech flows through endSpeechStream — so it must be a no-op.
  it("does not forward an empty saypi:tts:text:added chunk to an open stream (#399)", () => {
    (audioStreamManagerMock.isOpen as Mock).mockReturnValue(true);

    EventBus.emit("saypi:tts:text:added", {
      utterance: { id: "utterance-1" },
      text: "",
    } as any);

    expect(audioStreamManagerMock.addSpeechToStream).not.toHaveBeenCalled();

    // Real reply text still flows to the (still-open) stream.
    EventBus.emit("saypi:tts:text:added", {
      utterance: { id: "utterance-1" },
      text: "Real reply text.",
    } as any);

    expect(audioStreamManagerMock.addSpeechToStream).toHaveBeenCalledWith(
      "utterance-1",
      "Real reply text."
    );
  });
});
