import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { SpeechSynthesisModule } from "../../src/tts/SpeechSynthesisModule";
import { TTSControlsModule } from "../../src/tts/TTSControlsModule";
import {
  ChatHistoryMessageObserver,
  RootChatHistoryObserver,
} from "../../src/dom/ChatHistory";
import { JSDOM } from "jsdom";
import { UserPreferenceModule } from "../../src/prefs/PreferenceModule";
import { UserPreferenceModuleMock } from "../prefs/PreferenceModule.mock";
import { TextToSpeechService } from "../../src/tts/TextToSpeechService";
import { AudioStreamManager } from "../../src/tts/AudioStreamManager";
import { timeoutCalc } from "../tts/InputStream.spec";
import { AssistantResponse } from "../../src/dom/MessageElements";
import {
  audioProviders,
  SayPiSpeech,
  SpeechSynthesisVoiceRemote,
  SpeechUtterance,
} from "../../src/tts/SpeechModel";
import { BillingModule } from "../../src/billing/BillingModule";
import { PiAIChatbot } from "../../src/chatbots/Pi";
import { PiResponse } from "../../src/chatbots/pi/PiResponse";
import { setupTestDOM } from "../utils/dom";
import { md5 } from "js-md5";

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
    setupTestDOM();
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
      price_per_thousand_chars_in_usd: 0.3,
      price_per_thousand_chars_in_credits: 300,
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
   * Creates a chat message element in the style of pi.ai assistant messages.
   *
   * The function generates a structured HTML element for displaying chat messages.
   * It creates a nested structure of divs with specific classes for styling and layout.
   * Each paragraph of the message is wrapped in a div with pre-wrap whitespace handling.
   * An invisible hover menu is also added to each message.
   *
   * Sample output structure:
   * <div class="break-anywhere">
   *   <div class="flex items-center">
   *     <div class="w-full">
   *       <div class="whitespace-pre-wrap mb-4 last:mb-0">Message text...</div>
   *     </div>
   *   </div>
   *   <div style="opacity: 0; height: 0px;"></div>
   * </div>
   *
   * @param {string | string[]} text - The message content, either as a single string or an array of strings for multiple paragraphs.
   * @param {boolean} [decorated=false] - Whether to apply additional decoration to the message element.
   * @returns {HTMLElement} The created message element.
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
    addOnHoverMenu(messageElement);
    if (decorated) {
      decorateAssistantResponse(messageElement);
    }
    return messageElement;
  };

  /**
   * Add a (bare, undecorated) hover menu to a message element
   * For Pi, this is a div with opacity 0 and height 0, which expands on hover to show thread options
   * @param message The message element to add the hover menu to
   */
  const addOnHoverMenu = (message: HTMLElement) => {
    const menu = document.createElement("div");
    menu.setAttribute("style", "opacity: 0; height: 0px;");
    message.appendChild(menu);
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

      const before = ChatHistoryMessageObserver.findFirstAssistantResponse(
        chatHistoryElement,
        assistantResponseSelector
      );
      expect(before.found).toBe(false); // not found initially
      chatHistoryElement.appendChild(assistantMessage);

      const afterAddition =
        ChatHistoryMessageObserver.findFirstAssistantResponse(
          chatHistoryElement,
          assistantResponseSelector
        );
      expect(afterAddition.found).toBe(true);
      expect(afterAddition.decorated).toBe(false);
      decorateAssistantResponse(assistantMessage);
      const afterDecoration =
        ChatHistoryMessageObserver.findFirstAssistantResponse(
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
      const withJustifyEnd =
        ChatHistoryMessageObserver.findFirstAssistantResponse(
          chatHistoryElement,
          assistantResponseSelector
        );
      expect(withJustifyEnd.found).toBe(false); // should not match with "justify-end"

      // remove the prohibitive classname
      assistantMessage.classList.remove("justify-end");
      const withoutJustifyEnd =
        ChatHistoryMessageObserver.findFirstAssistantResponse(
          chatHistoryElement,
          assistantResponseSelector
        );
      expect(withoutJustifyEnd.found).toBe(true); // should match without "justify-end"
    });
  });

  describe("recent/present container reactive decoration (#309)", () => {
    // Reproduces the live pi.ai thread-load layout: #saypi-chat-history has a
    // spacer (1st child), a past-messages container (2nd), and a present/recent
    // container (3rd) holding the most-recent turn. On a real thread the present
    // container mounts AFTER the chat history is decorated, so the one-shot present
    // setup misses it and the most-recent message is left undecorated. The
    // RootChatHistoryObserver must pick it up reactively.
    let saypiChatHistory: HTMLElement;
    let chatbot: PiAIChatbot;
    let observer: RootChatHistoryObserver;

    beforeEach(() => {
      chatbot = new PiAIChatbot();
      saypiChatHistory = document.createElement("div");
      saypiChatHistory.id = "saypi-chat-history";
      saypiChatHistory.classList.add("chat-history");
      document.body.appendChild(saypiChatHistory);
    });

    afterEach(() => {
      observer?.disconnect();
      saypiChatHistory?.remove();
    });

    it("decorates the most-recent message when the present container appears after the observer attaches", async () => {
      // Keep the test focused on decoration: a non-SayPi provider skips the
      // incomplete-speech branch (which reaches the real UserPreferenceModule
      // singleton, unrelated to this behaviour) — same approach as the TTS
      // resilience tests below.
      vi.spyOn(speechSynthesisModule, "getActiveAudioProvider").mockResolvedValue(
        audioProviders.None
      );

      observer = new RootChatHistoryObserver(
        saypiChatHistory,
        "#saypi-chat-history",
        speechSynthesisModule,
        chatbot,
        false // don't auto-run; we drive the mutation sequence explicitly
      );
      observer.observe({ childList: true, subtree: false });

      // Mount sequence AFTER observe() — mirrors pi.ai's deferred layout.
      const spacer = document.createElement("div");
      spacer.className = "relative shrink-0 h-1 z-30";
      saypiChatHistory.appendChild(spacer);

      const pastContainer = document.createElement("div");
      pastContainer.className = "space-y-6";
      pastContainer.appendChild(createAssistantMessage("an older message"));
      saypiChatHistory.appendChild(pastContainer);

      const presentContainer = document.createElement("div");
      presentContainer.className = "pb-6 lg:pb-8";
      const recentMessage = createAssistantMessage("the most recent message");
      presentContainer.appendChild(recentMessage);
      saypiChatHistory.appendChild(presentContainer);

      // Allow the MutationObserver callbacks + async decoration to settle.
      await new Promise((r) => setTimeout(r, 50));

      // The most-recent message (in the present container) must be decorated.
      expect(recentMessage.classList.contains("assistant-message")).toBe(true);
      // And the past message must still be decorated (no regression to the past path).
      expect(
        pastContainer
          .querySelector("div.break-anywhere")
          ?.classList.contains("assistant-message")
      ).toBe(true);
    });

    it("decorates a message swapped deep into a REUSED present container (SPA thread switch)", async () => {
      vi.spyOn(speechSynthesisModule, "getActiveAudioProvider").mockResolvedValue(
        audioProviders.None
      );

      observer = new RootChatHistoryObserver(
        saypiChatHistory,
        "#saypi-chat-history",
        speechSynthesisModule,
        chatbot,
        false
      );
      observer.observe({ childList: true, subtree: false });

      // Initial layout from a prior thread: the present container already exists
      // (and is set up) with an inner wrapper, but no current-turn message yet.
      const spacer = document.createElement("div");
      spacer.className = "relative shrink-0 h-1 z-30";
      saypiChatHistory.appendChild(spacer);

      const pastContainer = document.createElement("div");
      pastContainer.className = "space-y-6";
      saypiChatHistory.appendChild(pastContainer);

      const presentContainer = document.createElement("div");
      presentContainer.className = "pb-6 lg:pb-8";
      const innerWrapper = document.createElement("div"); // persists across SPA nav
      innerWrapper.className = "space-y-6";
      presentContainer.appendChild(innerWrapper);
      saypiChatHistory.appendChild(presentContainer);

      // Let ensureRecentMessages set up the recent observer on presentContainer.
      await new Promise((r) => setTimeout(r, 30));

      // SPA navigation to another thread: pi.ai REUSES the same presentContainer
      // (so a re-runOnce is skipped) and swaps the new thread's most-recent message
      // in NESTED inside the existing wrapper — i.e. the mutation target is the
      // wrapper, not a direct child of presentContainer. A subtree:false observer
      // never sees it.
      const recentMessage = createAssistantMessage("most recent after SPA nav");
      innerWrapper.appendChild(recentMessage);

      await new Promise((r) => setTimeout(r, 50));

      expect(recentMessage.classList.contains("assistant-message")).toBe(true);
    });
  });

  describe("resilience to TTS failures (#268 / #241)", () => {
    // Minimal concrete observer whose streamSpeech rejects, simulating a TTS
    // synthesis failure (e.g. an unauthenticated user) or a voice-off race.
    class FailingTtsObserver extends ChatHistoryMessageObserver {
      protected streamSpeech(): Promise<never> {
        return Promise.reject(new Error("Failed to synthesize speech"));
      }
      protected streamState(): Promise<null> {
        return Promise.resolve(null);
      }
    }

    it("does not propagate a TTS failure out of findAndDecorateAssistantResponses (no uncaught rejection, decoration continues)", async () => {
      const chatbot = new PiAIChatbot();
      const observer = new FailingTtsObserver(
        chatHistoryElement,
        assistantResponseSelector,
        speechSynthesisModule,
        chatbot
      );

      // Keep the test focused on the catch: a non-SayPi provider skips the
      // incomplete-speech decoration branch (which reaches the real
      // UserPreferenceModule singleton, unrelated to this behavior).
      vi.spyOn(speechSynthesisModule, "getActiveAudioProvider").mockResolvedValue(
        audioProviders.None
      );

      const assistantMessage = createAssistantMessage("Hello from the assistant");
      chatHistoryElement.appendChild(assistantMessage);

      // Must resolve (not reject) despite streamSpeech throwing, and still have
      // processed/decorated the assistant message so the observer cycle continues.
      const observations = await observer.findAndDecorateAssistantResponses(
        chatHistoryElement
      );
      expect(observations.length).toBeGreaterThan(0);
    });

    it("still shows the incomplete-speech indicator when a selected (SayPi) voice fails to synthesize (#268)", async () => {
      const chatbot = new PiAIChatbot();
      const observer = new FailingTtsObserver(
        chatHistoryElement,
        assistantResponseSelector,
        speechSynthesisModule,
        chatbot
      );

      // A voice IS selected (provider resolves to SayPi) but synthesis fails:
      // the user must still get the incomplete-speech / regenerate affordance,
      // not silence. Spy on decorateIncompleteSpeech so we don't execute its
      // real body (which reaches the global UserPreferenceModule singleton).
      vi.spyOn(speechSynthesisModule, "getActiveAudioProvider").mockResolvedValue(
        audioProviders.SayPi
      );
      const incompleteSpy = vi
        .spyOn(AssistantResponse.prototype, "decorateIncompleteSpeech")
        .mockResolvedValue(undefined);

      const assistantMessage = createAssistantMessage("Hello from the assistant");
      chatHistoryElement.appendChild(assistantMessage);

      const observations = await observer.findAndDecorateAssistantResponses(
        chatHistoryElement
      );
      expect(observations.length).toBeGreaterThan(0);
      expect(incompleteSpy).toHaveBeenCalled();
    });
  });

  describe("findAssistantResponse", () => {
    it("should find an assistant response if present", () => {
      const obsNotFound = ChatHistoryMessageObserver.findFirstAssistantResponse(
        chatHistoryElement,
        assistantResponseSelector
      );
      expect(obsNotFound.found).toBe(false);
      const chatMessageElement = createAssistantMessage("Hello world");
      chatHistoryElement.appendChild(chatMessageElement);
      const obsFound = ChatHistoryMessageObserver.findFirstAssistantResponse(
        chatHistoryElement,
        assistantResponseSelector
      );
      expect(obsFound.found).toBe(true);
    });

    it("should not confuse user messages with assistant messages", () => {
      const chatMessageElement = document.createElement("div");
      chatMessageElement.classList.add("break-anywhere", "justify-end");
      chatHistoryElement.appendChild(chatMessageElement);
      const obsNotFound = ChatHistoryMessageObserver.findFirstAssistantResponse(
        chatHistoryElement,
        assistantResponseSelector
      );
      expect(obsNotFound.found).toBe(false);
    });

    it("should match an element with the correct selector", () => {
      const html =
        '<div class="break-anywhere"><div class="flex items-center"><div class="w-full"><div class="whitespace-pre-wrap mb-4 last:mb-0">Awesome! ...</div></div></div><div style="opacity: 0; height: 0px;"></div></div>';
      chatHistoryElement.innerHTML = html;
      const obsFound = ChatHistoryMessageObserver.findFirstAssistantResponse(
        chatHistoryElement,
        assistantResponseSelector
      );
      expect(obsFound.found).toBe(true);
    });
  });

  describe("decorateAssistantResponse", () => {
    it("should decorate an assistant response", () => {
      const chatMessageElement = createAssistantMessage("Hello there!");
      chatHistoryElement.appendChild(chatMessageElement);
      const assistantResponse = decorateAssistantResponse(chatMessageElement);
      expect(assistantResponse.element).toBe(chatMessageElement);
      expect(chatMessageElement.classList.contains("assistant-message")).toBe(
        true
      );
      const obs = ChatHistoryMessageObserver.findFirstAssistantResponse(
        chatHistoryElement,
        assistantResponseSelector
      );
      expect(obs.decorated).toBe(true);
    });
  });

  describe("text operators for assistant messages", () => {
    it("should get the text of an assistant message", () => {
      const chatMessageElement = createAssistantMessage("Hello there!");
      const html = chatMessageElement.outerHTML;
      const message = new PiResponse(chatMessageElement);
      expect(message.text).toBe("Hello there!");
    });

    it("should get the text of an assistant message with multiple paragraphs", () => {
      const chatMessageElement = createAssistantMessage([
        "Hello there!",
        "How are you doing?",
      ]);
      const text = new PiResponse(chatMessageElement).text;
      expect(text).toBe(
        ["Hello there!", "How are you doing?"].join(
          AssistantResponse.PARAGRAPH_SEPARATOR
        )
      );
    });

    it("should compute identical hashes for newline-equivalent text", () => {
      const paragraphs = [
        "It sounds like you just had one of those moments where a familiar word suddenly catches your attention and you wonder about its origins!",
        "The Thunderbird car name is probably the most common way people encounter the term today."
      ];
      const chatMessageElement = createAssistantMessage(paragraphs);
      const message = new PiResponse(chatMessageElement);

      const streamedText = paragraphs.join("\n");
      const normalized = AssistantResponse.normalizeTextForHash(streamedText);

      expect(md5(normalized)).toBe(message.hash);
    });

    it(
      "text and stable text should eventually converge",
      async () => {
        const chatMessageElement = createAssistantMessage([
          "Hello there!",
          "How are you doing?",
        ]);
        const message = new PiResponse(chatMessageElement);
        setTimeout(() => {
          // there must be a trigger to start and end the stream, otherwise it will never complete
          addTextToAssistantMessage(chatMessageElement, "How are the kids?");
        }, 3000);
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
      const message = new PiResponse(chatMessageElement);

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
