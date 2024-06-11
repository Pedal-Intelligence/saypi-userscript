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

export class TextToSpeechUIManager {
  private userPreferences = UserPreferenceModule.getInstance();
  private speechSynthesis = SpeechSynthesisModule.getInstance();
  private ttsControls = new TTSControlsModule(this.speechSynthesis);
  private replaying = false; // flag to indicate whether the user requested a replay of an utterance
  private voiceMenu: VoiceMenu | null = null;

  // Methods for DOM manipulation and element ID assignment
  addIdChatHistory(): boolean {
    const chatHistory = document.querySelector(
      this.chatbot.getChatHistorySelector()
    );
    if (!chatHistory) {
      return false;
    } else {
      chatHistory.id = "saypi-chat-history";

      // the past messages container will be replaced when the chat history is updated, so is monitored for changes in RootChatHistoryObserver
      const pastChatMessagesContainer =
        chatHistory.querySelector(":nth-child(2)");
      if (pastChatMessagesContainer) {
        pastChatMessagesContainer.id = "saypi-chat-history-past-messages";
      }

      const presentChatMessagesContainer =
        chatHistory.querySelector(":nth-child(3)");
      if (presentChatMessagesContainer) {
        presentChatMessagesContainer.id = "saypi-chat-history-present-messages";
      }
    }
    return true;
  }

  md5OfNothing = "d41d8cd98f00b204e9800998ecf8427e";
  md5OfSpace = "7215ee9c7d9dc229d2921a40e899ec5f";

  /**
   * Find the message in the chat history that corresponds to the given utterance,
   * and associate the utterance with that message in the speech history.
   * @param utterance A spoken reading of a chat message
   */
  associateWithChatHistory(utterance: SpeechUtterance): void {
    // get most recent message in chat history
    const speech = new AssistantSpeech(utterance);
    const assistantMessages = document.querySelectorAll(".assistant-message");
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

  registerPastChatHistoryListener(): void {
    // this listener keeps track of the top-level chat history containers,
    // and recursively observes the children of the past messages container
    const rootChatHistoryObserver = new RootChatHistoryObserver(
      "#saypi-chat-history",
      this.speechSynthesis
    );
    rootChatHistoryObserver.observe({
      childList: true,
      subtree: false,
    });
  }

  async registerPresentChatHistoryListener(): Promise<ChatHistoryAdditionsObserver> {
    const selector = "#saypi-chat-history-present-messages";
    const existingMessagesObserver = new ChatHistoryOldMessageObserver(
      selector,
      this.speechSynthesis
    ); // this type of observer streams speech from the speech history
    const initialMessages = await existingMessagesObserver // TODO const oldMessages = await ...
      .runOnce(document.querySelector(selector) as HTMLElement); // run on initial content, i.e. most recent message in chat history
    console.debug(
      `Found ${initialMessages.length} recent assistant message(s)`
    );
    existingMessagesObserver.disconnect(); // only run once

    const newMessagesObserver = new ChatHistoryAdditionsObserver(
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
    return newMessagesObserver;
  }

  registerSpeechStreamListeners(): void {
    EventBus.on("saypi:tts:replaying", (utterance: SpeechUtterance) => {
      this.replaying = true;
    });
    EventBus.on(
      "saypi:tts:speechStreamStarted",
      (utterance: SpeechUtterance) => {
        if (utterance && !this.replaying) {
          this.associateWithChatHistory(utterance);
        }
        this.replaying = false;
      }
    );
  }

  findAndDecorateVoiceMenu(): Observation {
    const audioControlsContainer = document.getElementById(
      "saypi-audio-controls"
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

  // Constructor
  constructor(private chatbot: Chatbot) {
    this.addIdChatHistory();
    this.findAndDecorateVoiceMenu();
    this.registerPastChatHistoryListener();
    this.registerPresentChatHistoryListener();
    this.registerSpeechStreamListeners();
  }
}
