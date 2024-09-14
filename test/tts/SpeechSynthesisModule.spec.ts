import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import { SpeechSynthesisModule } from "../../src/tts/SpeechSynthesisModule";
import { TextToSpeechService } from "../../src/tts/TextToSpeechService";
import { AudioStreamManager } from "../../src/tts/AudioStreamManager";
import { JSDOM } from "jsdom";
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
    const dom = new JSDOM();
    global.document = dom.window.document;

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
      getVoiceById: vi.fn(),
      getVoices: vi.fn(),
      createSpeech: vi.fn(),
      addTextToSpeechStream: vi.fn(),
    } as unknown as TextToSpeechService;

    audioStreamManagerMock = {
      createStream: vi.fn(),
      addSpeechToStream: vi.fn(),
      endStream: vi.fn(),
    } as unknown as AudioStreamManager;

    const preferredVoiceMock = mockVoices[0];

    userPreferenceModuleMock = {
      hasVoice: vi.fn().mockReturnValue(true),
      getVoice: vi.fn().mockReturnValue(preferredVoiceMock),
      getLanguage: vi.fn().mockReturnValue("en-US"),
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
    //vi.resetAllMocks();
    vi.unstubAllEnvs();
    //vi.clearAllMocks();
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
    speechSynthesisModule._cacheVoices(mockVoices);

    const actualVoices = await speechSynthesisModule.getVoices();

    expect(actualVoices).toEqual(mockVoices);
    expect(textToSpeechServiceMock.getVoices).not.toHaveBeenCalled();
  });

  it("should get voices from the TextToSpeechService if cache is empty", async () => {
    textToSpeechServiceMock.getVoices = vi.fn(() =>
      Promise.resolve(mockVoices)
    );

    const voices = await speechSynthesisModule.getVoices();

    expect(voices).toEqual(mockVoices);

    // Assert that the spy was called
    expect(textToSpeechServiceMock.getVoices).toHaveBeenCalled();
  });

  it("should get voice by ID from the cache if available", async () => {
    const mockVoice = mockVoices[0];
    speechSynthesisModule._cacheVoices([mockVoice]);

    const voice = await speechSynthesisModule.getVoiceById(mockVoice.id);

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

    const utterance = await speechSynthesisModule.createSpeechStream();

    expect(utterance).toEqual(mockUtterance);
    expect(audioStreamManagerMock.createStream).toHaveBeenCalled();
  });
});
