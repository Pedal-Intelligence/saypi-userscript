import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  SpeechSynthesisModule,
  SpeechSynthesisUtteranceRemote,
} from "../../src/tts/SpeechSynthesisModule";
import { TTSControlsModule } from "../../src/tts/TTSControlsModule";
import {
  AssistantResponse,
  ChatHistoryObserver,
} from "../../src/dom/ChatHistoryObserver";
import { voice as mockVoice } from "../data/Voices";
import { JSDOM } from "jsdom";
import { UserPreferenceModule } from "../../src/prefs/PreferenceModule";
import { UserPreferenceModuleMock } from "../prefs/PreferenceModule.mock";
import { TextToSpeechService } from "../../src/tts/TextToSpeechService";
import { AudioStreamManager } from "../../src/tts/AudioStreamManager";
import { add } from "lodash";

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
    document.body.appendChild(chatHistoryElement);

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

  const addParagraph = (paragraph: string, parent: HTMLElement) => {
    const preWrap = document.createElement("div");
    preWrap.classList.add("whitespace-pre-wrap", "mb-4", "last:mb-0");
    parent.appendChild(preWrap);
    const words = paragraph.split(" ");
    for (const word of words) {
      const textNode = document.createTextNode(word + " ");
      preWrap.appendChild(textNode);
    }
  };

  /**
   * Create a chat message element, in the style of pi.ai assistant messages
   * @param text
   * @param decorated
   * @returns
   */
  const createAssistantMessage = (
    text: string | string[],
    decorated: boolean = false
  ) => {
    const paragraphs = Array.isArray(text) ? text : [text];
    const message = document.createElement("div");
    message.classList.add("break-anywhere");
    const flex = document.createElement("div");
    flex.classList.add("flex", "items-center");
    const wFull = document.createElement("div");
    wFull.classList.add("w-full");
    flex.appendChild(wFull);
    message.appendChild(flex);
    for (const paragraph of paragraphs) {
      addParagraph(paragraph, wFull);
    }
    if (decorated) {
      ChatHistoryObserver.decorateAssistantResponse(message);
    }
    return message;
  };

  const addTextToAssistantMessage = (message: HTMLElement, text: string) => {
    const lastParagraph = message.querySelector(
      ".whitespace-pre-wrap:last-child"
    );
    if (lastParagraph) {
      const textNode = document.createTextNode(text);
      lastParagraph.appendChild(textNode);
    }
  };

  describe("observe chat history for message additions", async () => {
    it("should find assistant messages when added", async () => {
      const assistantMessage = createAssistantMessage("Hello world");

      const before =
        ChatHistoryObserver.findAssistantResponse(chatHistoryElement);
      expect(before.found).toBe(false); // not found initially
      chatHistoryElement.appendChild(assistantMessage);

      const afterAddition =
        ChatHistoryObserver.findAssistantResponse(chatHistoryElement);
      expect(afterAddition.found).toBe(true);
      expect(afterAddition.decorated).toBe(false);
      ChatHistoryObserver.decorateAssistantResponse(assistantMessage);
      const afterDecoration =
        ChatHistoryObserver.findAssistantResponse(chatHistoryElement);
      expect(afterDecoration.found).toBe(true);
      expect(afterDecoration.decorated).toBe(true);
    });

    it("should match an element where the selector class is only added afterwards", async () => {
      const assistantMessage = createAssistantMessage("Hello world");
      assistantMessage.classList.add("justify-end"); // elements containing this class are not assistant messages

      chatHistoryElement.appendChild(assistantMessage);
      const withJustifyEnd =
        ChatHistoryObserver.findAssistantResponse(chatHistoryElement);
      expect(withJustifyEnd.found).toBe(false); // should not match with "justify-end"

      // remove the prohibitive classname
      assistantMessage.classList.remove("justify-end");
      const withoutJustifyEnd =
        ChatHistoryObserver.findAssistantResponse(chatHistoryElement);
      expect(withoutJustifyEnd.found).toBe(true); // should match without "justify-end"
    });
  });

  describe("findAssistantResponse", () => {
    it("should find an assistant response if present", () => {
      const obsNotFound =
        ChatHistoryObserver.findAssistantResponse(chatHistoryElement);
      expect(obsNotFound.found).toBe(false);
      const chatMessageElement = createAssistantMessage("Hello world");
      chatHistoryElement.appendChild(chatMessageElement);
      const obsFound =
        ChatHistoryObserver.findAssistantResponse(chatHistoryElement);
      expect(obsFound.found).toBe(true);
    });

    it("should not confuse user messages with assistant messages", () => {
      const chatMessageElement = document.createElement("div");
      chatMessageElement.classList.add("break-anywhere", "justify-end");
      chatHistoryElement.appendChild(chatMessageElement);
      const obsNotFound =
        ChatHistoryObserver.findAssistantResponse(chatHistoryElement);
      expect(obsNotFound.found).toBe(false);
    });

    it("should match an element with the correct selector", () => {
      const html =
        '<div class="break-anywhere"><div class="flex items-center"><div class="w-full"><div class="whitespace-pre-wrap mb-4 last:mb-0">Awesome! ...</div></div></div><div style="opacity: 0; height: 0px;"></div></div>';
      chatHistoryElement.innerHTML = html;
      const obsFound =
        ChatHistoryObserver.findAssistantResponse(chatHistoryElement);
      expect(obsFound.found).toBe(true);
    });
  });

  describe("decorateAssistantResponse", () => {
    it("should decorate an assistant response", () => {
      const chatMessageElement = createAssistantMessage("Hello there!");
      const assistantResponse =
        ChatHistoryObserver.decorateAssistantResponse(chatMessageElement);
      expect(assistantResponse.element).toBe(chatMessageElement);
      expect(chatMessageElement.classList.contains("assistant-message")).toBe(
        true
      );
      const obs = ChatHistoryObserver.findAssistantResponse(chatMessageElement);
      expect(obs.decorated).toBe(true);
    });
  });

  describe("text operators for assistant messages", () => {
    it("should get the text of an assistant message", () => {
      const chatMessageElement = createAssistantMessage("Hello there!");
      const message = new AssistantResponse(chatMessageElement);
      expect(message.text).toBe("Hello there!");
    });

    it("should get the text of an assistant message with multiple paragraphs", () => {
      const chatMessageElement = createAssistantMessage([
        "Hello there!",
        "How are you doing?",
      ]);
      const text = new AssistantResponse(chatMessageElement).text;
      expect(text).toBe("Hello there! How are you doing?");
    });

    it("text and stable text should converge", async () => {
      const chatMessageElement = createAssistantMessage([
        "Hello there!",
        "How are you doing?",
      ]);
      const message = new AssistantResponse(chatMessageElement);
      const stableText = await message.stableText();
      expect(message.text).toBe(stableText);

      const stableHash = await message.stableHash();
      expect(message.hash).toBe(stableHash);
    });

    it("should eventually complete stableText and stableHash", async () => {
      const chatMessageElement = createAssistantMessage([
        "Hello there!",
        "How are you doing?",
      ]);
      chatHistoryElement.appendChild(chatMessageElement);
      const message = new AssistantResponse(chatMessageElement);

      // after a delay, add text to the message
      setTimeout(() => {
        addTextToAssistantMessage(chatMessageElement, "How are the kids?");
        console.log("Added text to message");
      }, 3000);
      console.log("Waiting for stable text and hash...");
      const stableText = await message.stableText();
      console.log("Stable text:", stableText);
      const stableHash = await message.stableHash();
      console.log("Stable hash:", stableHash);

      expect(stableText).toBe(
        "Hello there! How are you doing? How are the kids?"
      );
      expect(stableHash).toBeDefined();
    }, 20000);
  });
});
