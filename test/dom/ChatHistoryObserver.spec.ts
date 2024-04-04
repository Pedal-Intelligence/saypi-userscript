import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  SpeechSynthesisModule,
  SpeechSynthesisUtteranceRemote,
} from "../../src/tts/SpeechSynthesisModule";
import { TTSControlsModule } from "../../src/tts/TTSControlsModule";
import { ChatHistoryObserver } from "../../src/dom/ChatHistoryObserver";
import { voice as mockVoice } from "../data/Voices";
import { JSDOM } from "jsdom";
import { UserPreferenceModule } from "../../src/prefs/PreferenceModule";
import { UserPreferenceModuleMock } from "../prefs/PreferenceModule.mock";
import { TextToSpeechService } from "../../src/tts/TextToSpeechService";
import { AudioStreamManager } from "../../src/tts/AudioStreamManager";

vi.mock("../tts/InputStream");
vi.mock("../tts/SpeechSynthesisModule");
vi.mock("../tts/TTSControlsModule");

describe("ChatHistoryObserver", () => {
  let speechSynthesisModule: SpeechSynthesisModule;
  let textToSpeechServiceMock: TextToSpeechService;
  let audioStreamManagerMock: AudioStreamManager;
  let userPreferenceModuleMock: UserPreferenceModule;
  let chatHistoryObserver: ChatHistoryObserver;
  let ttsControlsModuleMock: TTSControlsModule;
  let chatHistoryElement: HTMLElement;

  beforeEach(() => {
    const dom = new JSDOM();
    global.document = dom.window.document;
    global.MutationObserver = dom.window.MutationObserver;
    global.Node = dom.window.Node;
    global.NodeList = dom.window.NodeList;
    global.Element = dom.window.Element;

    chatHistoryElement = document.createElement("div");
    chatHistoryElement.id = "chat-history";

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

    const mockUtterance: SpeechSynthesisUtteranceRemote = {
      id: "utterance-id",
      text: "Hello world",
      voice: mockVoice,
      lang: "en",
      uri: "https://api.saypi.ai/speech/utterance-id",
    };
    audioStreamManagerMock = {
      createStream: vi.fn(() => Promise.resolve(mockUtterance)),
      addSpeechToStream: vi.fn(),
      endStream: vi.fn(),
    } as unknown as AudioStreamManager;

    userPreferenceModuleMock =
      UserPreferenceModuleMock.getInstance() as unknown as UserPreferenceModule;

    speechSynthesisModule = new SpeechSynthesisModule(
      textToSpeechServiceMock,
      audioStreamManagerMock,
      userPreferenceModuleMock
    );
    ttsControlsModuleMock = new TTSControlsModule(speechSynthesisModule);
    chatHistoryObserver = new ChatHistoryObserver(
      chatHistoryElement.id,
      speechSynthesisModule
    );
  });

  afterEach(() => {
    chatHistoryObserver.disconnect();
  });

  const createAssistantMessage = (text: string) => {
    const message = document.createElement("div");
    message.classList.add("break-anywhere");
    message.textContent = text;
    return message;
  };

  describe("callback", () => {
    it("should find assistant messages when added", () => {
      const assistantMessage = createAssistantMessage("Hello world");

      chatHistoryObserver.observe({ childList: true, subtree: true });
      chatHistoryElement.appendChild(assistantMessage);
      // after 1s, check that the assistant message was found and decorated
      setTimeout(() => {
        expect(assistantMessage.classList.contains("assistant-message")).toBe(
          true
        );
      }, 1000);
    });
  });

  describe("findAssistantResponse", () => {
    it("should find an assistant response if present", () => {
      const obsNotFound =
        chatHistoryObserver.findAssistantResponse(chatHistoryElement);
      expect(obsNotFound.found).toBe(false);
      const chatMessageElement = createAssistantMessage("Hello world");
      chatHistoryElement.appendChild(chatMessageElement);
      const obsFound =
        chatHistoryObserver.findAssistantResponse(chatHistoryElement);
      expect(obsFound.found).toBe(true);
    });

    it("should not confuse user messages with assistant messages", () => {
      const chatMessageElement = document.createElement("div");
      chatMessageElement.classList.add("break-anywhere", "justify-end");
      chatHistoryElement.appendChild(chatMessageElement);
      const obsNotFound =
        chatHistoryObserver.findAssistantResponse(chatHistoryElement);
      expect(obsNotFound.found).toBe(false);
    });
  });

  describe("decorateAssistantResponse", () => {
    it("should decorate an assistant response", () => {
      const chatMessageElement = createAssistantMessage("Hello world");
      const assistantResponse =
        chatHistoryObserver.decorateAssistantResponse(chatMessageElement);
      expect(assistantResponse.element).toBe(chatMessageElement);
      expect(assistantResponse.text).toBe("Hello world");
      expect(chatMessageElement.classList.contains("assistant-message")).toBe(
        true
      );
    });
  });
});
