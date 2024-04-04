import { describe, it, expect, vi, beforeEach } from "vitest";
import { ElementTextStream } from "../../src/tts/InputStream";
import {
  SpeechSynthesisModule,
  SpeechSynthesisUtteranceRemote,
} from "../../src/tts/SpeechSynthesisModule";
import { TTSControlsModule } from "../../src/tts/TTSControlsModule";
import {
  ChatHistoryObserver,
  AssistantResponse,
} from "../../src/dom/ChatHistoryObserver";
import { Observation } from "../../src/dom/Observation";
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

  beforeEach(() => {
    const dom = new JSDOM();
    global.document = dom.window.document;
    global.MutationObserver = dom.window.MutationObserver;
    global.Node = dom.window.Node;
    global.NodeList = dom.window.NodeList;
    global.Element = dom.window.Element;

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
      "selector",
      speechSynthesisModule
    );
  });

  describe("callback", () => {
    it("should call findAndDecorateAssistantResponse for added elements", () => {
      const root = document.createElement("div");
      const addedElement = document.createElement("div");
      root.appendChild(addedElement);
      const addedNodes: NodeList = root.childNodes; // addedElement
      const removedNodes: NodeList = addedElement.childNodes; // empty
      const mutation: MutationRecord = {
        addedNodes: addedNodes,
        attributeName: null,
        attributeNamespace: null,
        nextSibling: null,
        oldValue: null,
        previousSibling: null,
        removedNodes: removedNodes,
        target: document.body,
        type: "childList",
      };
      const findAndDecorateAssistantResponseSpy = vi.spyOn(
        chatHistoryObserver,
        "findAndDecorateAssistantResponse"
      );

      chatHistoryObserver["callback"]([mutation]);

      expect(findAndDecorateAssistantResponseSpy).toHaveBeenCalledWith(
        addedElement
      );
    });
  });

  describe("findAndDecorateAssistantResponse", () => {
    it("should decorate the assistant response if found and not decorated", () => {
      const element = document.createElement("div");
      element.id = "assistant-response";
      const foundNotDecorated = Observation.notDecorated(element.id, element);
      const findAssistantResponseSpy = vi
        .spyOn(chatHistoryObserver, "findAssistantResponse")
        .mockReturnValue(foundNotDecorated);
      const decorateAssistantResponseSpy = vi.spyOn(
        chatHistoryObserver,
        "decorateAssistantResponse"
      );
      const assistantChatMessageAddedSpy = vi.spyOn(
        chatHistoryObserver,
        "assistantChatMessageAdded"
      );

      chatHistoryObserver.findAndDecorateAssistantResponse(document.body);

      expect(findAssistantResponseSpy).toHaveBeenCalledWith(document.body);
      expect(decorateAssistantResponseSpy).toHaveBeenCalledWith(element);
      expect(assistantChatMessageAddedSpy).toHaveBeenCalled();
    });
  });

  describe("assistantChatMessageAdded", () => {
    it("should enable TTS and observe chat message element if speech synthesis is enabled", async () => {
      const message = new AssistantResponse(document.createElement("div"));
      const utterance: SpeechSynthesisUtteranceRemote = {
        id: "utterance-id",
        text: "Hello",
        voice: mockVoice,
        lang: "en",
        uri: "https://api.saypi.ai/speech/utterance-id",
      };
      const observeChatMessageElementSpy = vi.spyOn(
        chatHistoryObserver,
        "observeChatMessageElement"
      );

      await chatHistoryObserver.assistantChatMessageAdded(message);

      expect(message.isTTSEnabled).toBe(true);
      expect(observeChatMessageElementSpy).toHaveBeenCalledWith(
        message.element,
        utterance
      );
    });
  });

  describe("observeChatMessageElement", () => {
    it("should stream text from the element and add speech to the stream", () => {
      const message = document.createElement("div");
      const utterance: SpeechSynthesisUtteranceRemote = {
        id: "utterance-id",
        text: "",
        voice: mockVoice,
        lang: "en",
        uri: "https://api.saypi.ai/speech/utterance-id",
      };
      const addSpeechToStreamSpy = vi.spyOn(
        speechSynthesisModule,
        "addSpeechToStream"
      );
      const endSpeechStreamSpy = vi.spyOn(
        speechSynthesisModule,
        "endSpeechStream"
      );

      chatHistoryObserver.observeChatMessageElement(message, utterance);

      expect(addSpeechToStreamSpy).toHaveBeenCalledWith(
        "utterance-id",
        "Hello"
      );
      expect(addSpeechToStreamSpy).toHaveBeenCalledWith(
        "utterance-id",
        " world"
      );
      expect(utterance.text).toBe("Hello world");
      expect(endSpeechStreamSpy).toHaveBeenCalledWith(utterance);
    });
  });
});
