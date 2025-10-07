import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import type { Mock } from "vitest";
import { SpeechSynthesisModule } from "../../src/tts/SpeechSynthesisModule";
import { TextToSpeechService } from "../../src/tts/TextToSpeechService";
import { AudioStreamManager } from "../../src/tts/AudioStreamManager";
import { mockVoices } from "../data/Voices";
import { UserPreferenceModule } from "../../src/prefs/PreferenceModule";
import { BillingModule } from "../../src/billing/BillingModule";
import { audioProviders } from "../../src/tts/SpeechModel";

describe("SpeechSynthesisModule", () => {
  let speechSynthesisModule: SpeechSynthesisModule;
  let textToSpeechServiceMock: TextToSpeechService;
  let audioStreamManagerMock: AudioStreamManager;
  let userPreferenceModuleMock: UserPreferenceModule;
  let billingModuleMock: BillingModule;

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

    const preferredVoiceMock = mockVoices[0];

    userPreferenceModuleMock = {
      hasVoice: vi.fn().mockResolvedValue(true),
      getVoice: vi.fn().mockResolvedValue(preferredVoiceMock),
      getLanguage: vi.fn().mockResolvedValue("en-US"),
    } as unknown as UserPreferenceModule;

    billingModuleMock = {
      getChargeForUtterance: vi.fn(),
    } as unknown as BillingModule;

    speechSynthesisModule = new SpeechSynthesisModule(
      textToSpeechServiceMock,
      audioStreamManagerMock,
      userPreferenceModuleMock,
      billingModuleMock
    );
  });

  afterEach(() => {
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
});
