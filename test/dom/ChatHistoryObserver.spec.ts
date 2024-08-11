import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { SpeechSynthesisModule } from "../../src/tts/SpeechSynthesisModule";
import { TTSControlsModule } from "../../src/tts/TTSControlsModule";
import { ChatHistoryMessageObserver } from "../../src/dom/ChatHistory";
import { JSDOM } from "jsdom";
import { UserPreferenceModule } from "../../src/prefs/PreferenceModule";
import { UserPreferenceModuleMock } from "../prefs/PreferenceModule.mock";
import { TextToSpeechService } from "../../src/tts/TextToSpeechService";
import { AudioStreamManager } from "../../src/tts/AudioStreamManager";
import { timeoutCalc } from "../tts/InputStream.spec";
import { AssistantResponse } from "../../src/dom/MessageElements";
import {
  SayPiSpeech,
  SpeechSynthesisVoiceRemote,
  SpeechUtterance,
} from "../../src/tts/SpeechModel";
import { BillingModule } from "../../src/billing/BillingModule";
import { PiAIChatbot, PiResponse } from "../../src/chatbots/Pi";

vi.mock("../tts/InputStream");
vi.mock("../tts/SpeechSynthesisModule");
vi.mock("../tts/TTSControlsModule");

describe("ChatHistoryMessageObserver", () => {
  let speechSynthesisModule: SpeechSynthesisModule;
  let textToSpeechServiceMock: TextToSpeechService;
  let audioStreamManagerMock: AudioStreamManager;
  let userPreferenceModuleMock: UserPreferenceModule;
  let ttsControlsModuleMock: TTSControlsModule;
  let chatHistoryElement: HTMLElement;
  let mockVoice: SpeechSynthesisVoiceRemote;
  let assistantResponseSelector: string;

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

    mockVoice = {
      id: "voice1",
      name: "Samantha",
      lang: "en",
      localService: false,
      default: false,
      price: 0.3,
      powered_by: "saypi.ai",
      voiceURI: "",
    };

    const mockUtterance: SpeechUtterance = new SayPiSpeech(
      "utterance-id",
      "en",
      mockVoice,
      "https://api.saypi.ai/speech/utterance-id"
    );
    audioStreamManagerMock = {
      createStream: vi.fn(() => Promise.resolve(mockUtterance)),
      addSpeechToStream: vi.fn(),
      endStream: vi.fn(),
    } as unknown as AudioStreamManager;

    userPreferenceModuleMock =
      UserPreferenceModuleMock.getInstance() as unknown as UserPreferenceModule;

    const billingModuleMock = BillingModule.getInstance();

    speechSynthesisModule = new SpeechSynthesisModule(
      textToSpeechServiceMock,
      audioStreamManagerMock,
      userPreferenceModuleMock,
      billingModuleMock
    );
    ttsControlsModuleMock = TTSControlsModule.getInstance();

    assistantResponseSelector =
      new PiAIChatbot().getAssistantResponseSelector();
  });

  afterEach(() => {});

  const addParagraph = (paragraph: string, parent: HTMLElement) => {
    const preWrap = document.createElement("div");
    preWrap.classList.add("whitespace-pre-wrap", "mb-4", "last:mb-0");
    parent.appendChild(preWrap);
    const words = paragraph.split(" ");
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const isLastWord = i === words.length - 1;
      const textNode = document.createTextNode(isLastWord ? word : word + " ");
      preWrap.appendChild(textNode);
    }
  };

  const decorateAssistantResponse = (element: HTMLElement) => {
    return new PiResponse(element);
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
    const messageElement = document.createElement("div");
    messageElement.classList.add("break-anywhere");
    const flex = document.createElement("div");
    flex.classList.add("flex", "items-center");
    const wFull = document.createElement("div");
    wFull.classList.add("w-full");
    flex.appendChild(wFull);
    messageElement.appendChild(flex);
    for (const paragraph of paragraphs) {
      addParagraph(paragraph, wFull);
    }
    if (decorated) {
      decorateAssistantResponse(messageElement);
    }
    return messageElement;
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

      const before = ChatHistoryMessageObserver.findAssistantResponse(
        chatHistoryElement,
        assistantResponseSelector
      );
      expect(before.found).toBe(false); // not found initially
      chatHistoryElement.appendChild(assistantMessage);

      const afterAddition = ChatHistoryMessageObserver.findAssistantResponse(
        chatHistoryElement,
        assistantResponseSelector
      );
      expect(afterAddition.found).toBe(true);
      expect(afterAddition.decorated).toBe(false);
      decorateAssistantResponse(assistantMessage);
      const afterDecoration = ChatHistoryMessageObserver.findAssistantResponse(
        chatHistoryElement,
        assistantResponseSelector
      );
      expect(afterDecoration.found).toBe(true);
      expect(afterDecoration.decorated).toBe(true);
    });

    it("should match an element where the selector class is only added afterwards", async () => {
      const assistantMessage = createAssistantMessage("Hello world");
      assistantMessage.classList.add("justify-end"); // elements containing this class are not assistant messages

      chatHistoryElement.appendChild(assistantMessage);
      const withJustifyEnd = ChatHistoryMessageObserver.findAssistantResponse(
        chatHistoryElement,
        assistantResponseSelector
      );
      expect(withJustifyEnd.found).toBe(false); // should not match with "justify-end"

      // remove the prohibitive classname
      assistantMessage.classList.remove("justify-end");
      const withoutJustifyEnd =
        ChatHistoryMessageObserver.findAssistantResponse(
          chatHistoryElement,
          assistantResponseSelector
        );
      expect(withoutJustifyEnd.found).toBe(true); // should match without "justify-end"
    });
  });

  describe("findAssistantResponse", () => {
    it("should find an assistant response if present", () => {
      const obsNotFound = ChatHistoryMessageObserver.findAssistantResponse(
        chatHistoryElement,
        assistantResponseSelector
      );
      expect(obsNotFound.found).toBe(false);
      const chatMessageElement = createAssistantMessage("Hello world");
      chatHistoryElement.appendChild(chatMessageElement);
      const obsFound = ChatHistoryMessageObserver.findAssistantResponse(
        chatHistoryElement,
        assistantResponseSelector
      );
      expect(obsFound.found).toBe(true);
    });

    it("should not confuse user messages with assistant messages", () => {
      const chatMessageElement = document.createElement("div");
      chatMessageElement.classList.add("break-anywhere", "justify-end");
      chatHistoryElement.appendChild(chatMessageElement);
      const obsNotFound = ChatHistoryMessageObserver.findAssistantResponse(
        chatHistoryElement,
        assistantResponseSelector
      );
      expect(obsNotFound.found).toBe(false);
    });

    it("should match an element with the correct selector", () => {
      const html =
        '<div class="break-anywhere"><div class="flex items-center"><div class="w-full"><div class="whitespace-pre-wrap mb-4 last:mb-0">Awesome! ...</div></div></div><div style="opacity: 0; height: 0px;"></div></div>';
      chatHistoryElement.innerHTML = html;
      const obsFound = ChatHistoryMessageObserver.findAssistantResponse(
        chatHistoryElement,
        assistantResponseSelector
      );
      expect(obsFound.found).toBe(true);
    });
  });

  describe("decorateAssistantResponse", () => {
    it("should decorate an assistant response", () => {
      const chatMessageElement = createAssistantMessage("Hello there!");
      const assistantResponse = decorateAssistantResponse(chatMessageElement);
      expect(assistantResponse.element).toBe(chatMessageElement);
      expect(chatMessageElement.classList.contains("assistant-message")).toBe(
        true
      );
      const obs = ChatHistoryMessageObserver.findAssistantResponse(
        chatMessageElement,
        assistantResponseSelector
      );
      expect(obs.decorated).toBe(true);
    });
  });

  describe("text operators for assistant messages", () => {
    it("should get the text of an assistant message", () => {
      const chatMessageElement = createAssistantMessage("Hello there!");
      const html = chatMessageElement.outerHTML;
      const message = new AssistantResponse(chatMessageElement);
      expect(message.text).toBe("Hello there!");
    });

    it("should get the text of an assistant message with multiple paragraphs", () => {
      const chatMessageElement = createAssistantMessage([
        "Hello there!",
        "How are you doing?",
      ]);
      const text = new AssistantResponse(chatMessageElement).text;
      expect(text).toBe(
        ["Hello there!", "How are you doing?"].join(
          AssistantResponse.PARAGRAPH_SEPARATOR
        )
      );
    });

    it(
      "text and stable text should converge",
      async () => {
        const chatMessageElement = createAssistantMessage([
          "Hello there!",
          "How are you doing?",
        ]);
        const message = new AssistantResponse(chatMessageElement);
        const stableText = await message.stableText();
        expect(message.text).toBe(stableText);

        const stableHash = await message.stableHash();
        expect(message.hash).toBe(stableHash);
      },
      timeoutCalc(2)
    );

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
        ["Hello there!", "How are you doing?", "How are the kids?"].join(
          AssistantResponse.PARAGRAPH_SEPARATOR
        )
      );
      expect(stableHash).toBeDefined();
    }, 20000);
  });
});
