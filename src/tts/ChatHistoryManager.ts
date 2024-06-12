import { SpeechSynthesisModule } from "./SpeechSynthesisModule";
import { SpeechHistoryModule } from "./SpeechHistoryModule";
import { UserPreferenceModule } from "../prefs/PreferenceModule";
import { Chatbot } from "../chatbots/Chatbot";
import EventBus from "../events/EventBus";
import {
  AssistantSpeech,
  ChatHistoryAdditionsObserver,
  ChatHistoryOldMessageObserver,
  RootChatHistoryObserver,
} from "../dom/ChatHistory";
import { Observation } from "../dom/Observation";
import { VoiceMenu } from "./VoiceMenu";
import { AssistantResponse } from "../dom/MessageElements";
import { SpeechUtterance } from "./SpeechModel";
import { TTSControlsModule } from "./TTSControlsModule";

type EventListener = {
  event: string;
  listener: (...args: any[]) => void;
};
type Observer = {
  disconnect: () => void;
};

export class ChatHistorySpeechManager {
  private userPreferences = UserPreferenceModule.getInstance();
  private speechSynthesis = SpeechSynthesisModule.getInstance();
  private ttsControls = new TTSControlsModule(this.speechSynthesis);
  private replaying = false; // flag to indicate whether the user requested a replay of an utterance
  private voiceMenu: VoiceMenu | null = null;

  // managed resources
  private eventListeners: EventListener[] = [];
  private observers: Observer[] = [];

  findAndDecorateVoiceMenu(): Observation {
    const audioControlsContainer = document.querySelector(
      "#saypi-audio-controls"
    );
    if (!audioControlsContainer) {
      return Observation.notFound("saypi-audio-controls");
    }
    const voiceMenuElement = audioControlsContainer.querySelector(
      this.chatbot.getVoiceMenuSelector()
    );
    if (voiceMenuElement && voiceMenuElement instanceof HTMLElement) {
      let obs = Observation.notDecorated("saypi-voice-menu", voiceMenuElement);
      this.voiceMenu = new VoiceMenu(
        this.chatbot,
        this.userPreferences,
        voiceMenuElement
      );
      return Observation.decorated(obs);
    }
    return Observation.notFound("saypi-voice-menu");
  }

  // Methods for DOM manipulation and element ID assignment
  addIdChatHistory(chatHistory: HTMLElement): void {
    chatHistory.id = "saypi-chat-history";

    // the past messages container will be replaced when the chat history is updated, so is monitored for changes in RootChatHistoryObserver
    const pastChatMessagesContainer =
      chatHistory.querySelector(":nth-child(2)");
    if (pastChatMessagesContainer) {
      pastChatMessagesContainer.id = "saypi-chat-history-past-messages";
    }

    if (chatHistory.children.length >= 3) {
      const presentChatMessagesContainer = chatHistory.children[2];
      //  chatHistory.querySelector(":nth-child(3)"); // less reliable than direct access, for some reason
      if (presentChatMessagesContainer) {
        presentChatMessagesContainer.id = "saypi-chat-history-present-messages";
      }
    } else {
      console.warn(
        "Present messages container not found in chat history.",
        chatHistory
      );
    }
  }

  md5OfNothing = "d41d8cd98f00b204e9800998ecf8427e";
  md5OfSpace = "7215ee9c7d9dc229d2921a40e899ec5f";

  /**
   * Find the message in the chat history that corresponds to the given utterance,
   * and associate the utterance with that message in the speech history.
   * @param utterance A spoken reading of a chat message
   */
  associateWithChatHistory(
    searchRoot: HTMLElement,
    utterance: SpeechUtterance
  ): void {
    // get most recent message in chat history
    const speech = new AssistantSpeech(utterance);
    const assistantMessages = searchRoot.querySelectorAll(".assistant-message");
    if (assistantMessages.length > 0) {
      const lastAssistantMessage = assistantMessages[
        assistantMessages.length - 1
      ] as HTMLElement;
      const assistantMessage = new AssistantResponse(lastAssistantMessage);
      assistantMessage.decorateSpeech(utterance);
      // ensure the AssistantResponse object has finished mutating before generating its hash
      assistantMessage.stableHash().then((hash) => {
        // debug: verify the hashes have converged
        if (hash !== assistantMessage.hash) {
          console.error(`Hash mismatch: ${hash} vs ${assistantMessage.hash}`);
          if (hash === this.md5OfNothing) {
            console.error(
              "Hash is md5 of nothing - stable text failed to resolve."
            );
          } else if (hash === this.md5OfSpace) {
            console.error("Hash is md5 of ' ' - text stream may be empty.");
          }
          assistantMessage.stableText().then((stableText) => {
            console.debug(`Stable text: "${stableText}"`);
            console.debug(`Assistant text: "${assistantMessage.text}"`);
          });
          return;
        }
        console.debug(`Adding speech to history with hash: ${hash}`);
        SpeechHistoryModule.getInstance().addSpeechToHistory(hash, speech);
      });
    }
  }

  registerPastChatHistoryListener(chatHistoryElement: HTMLElement): void {
    // this listener keeps track of the top-level chat history containers,
    // and recursively observes the children of the past messages container
    const rootChatHistoryObserver = new RootChatHistoryObserver(
      chatHistoryElement,
      "#saypi-chat-history",
      this.speechSynthesis
    );
    rootChatHistoryObserver.observe({
      childList: true,
      subtree: false,
    });
    this.observers.push(rootChatHistoryObserver);
  }

  async registerPresentChatHistoryListener(
    chatHistoryElement: HTMLElement
  ): Promise<ChatHistoryAdditionsObserver> {
    const selector = "#saypi-chat-history-present-messages";
    const existingMessagesObserver = new ChatHistoryOldMessageObserver(
      chatHistoryElement,
      selector,
      this.speechSynthesis
    ); // this type of observer streams speech from the speech history
    const initialMessages = await existingMessagesObserver // TODO const oldMessages = await ...
      .runOnce(chatHistoryElement.querySelector(selector) as HTMLElement); // run on initial content, i.e. most recent message in chat history
    console.debug(
      `Found ${initialMessages.length} recent assistant message(s)`
    );
    existingMessagesObserver.disconnect(); // only run once

    const newMessagesObserver = new ChatHistoryAdditionsObserver(
      chatHistoryElement,
      selector,
      this.speechSynthesis,
      initialMessages // ignore these messages when observing new messages
    ); // this type of observer streams speech from the TTS service
    // continuously observe the chat history for new messages
    newMessagesObserver.observe({
      childList: true,
      subtree: true,
      attributes: true,
    }); // would be more efficient to observe only the direct children of the chat history, but this is more robust
    this.observers.push(newMessagesObserver);
    return newMessagesObserver;
  }

  // Register event listeners and store them for later removal
  registerSpeechStreamListeners(chatHistoryElement: HTMLElement): void {
    const replayingListener = (utterance: SpeechUtterance) => {
      this.replaying = true;
    };
    const speechStreamStartedListener = (utterance: SpeechUtterance) => {
      if (utterance && !this.replaying) {
        this.associateWithChatHistory(chatHistoryElement, utterance);
      }
      this.replaying = false;
    };

    EventBus.on("saypi:tts:replaying", replayingListener);
    EventBus.on("saypi:tts:speechStreamStarted", speechStreamStartedListener);

    this.eventListeners.push(
      { event: "saypi:tts:replaying", listener: replayingListener },
      {
        event: "saypi:tts:speechStreamStarted",
        listener: speechStreamStartedListener,
      }
    );
  }

  // Teardown method to disconnect event listeners and release resources
  teardown(): void {
    this.eventListeners.forEach(({ event, listener }) => {
      EventBus.off(event, listener);
    });
    this.eventListeners = [];

    this.observers.forEach((observer) => {
      observer.disconnect();
    });
    this.observers = [];
  }

  // Constructor
  constructor(private chatbot: Chatbot, chatHistoryElement: HTMLElement) {
    this.addIdChatHistory(chatHistoryElement);
    this.findAndDecorateVoiceMenu(); // voice menu is not within the chat history, but is a related element
    this.registerPastChatHistoryListener(chatHistoryElement);
    this.registerPresentChatHistoryListener(chatHistoryElement);
    this.registerSpeechStreamListeners(chatHistoryElement);
  }
}
