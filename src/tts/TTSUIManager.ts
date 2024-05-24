import {
  SpeechSynthesisModule,
  SpeechSynthesisUtteranceRemote,
  SpeechSynthesisVoiceRemote,
} from "./SpeechSynthesisModule";
import { SpeechHistoryModule } from "./SpeechHistoryModule";
import { UserPreferenceModule } from "../prefs/PreferenceModule";
import { Chatbot } from "../chatbots/Chatbot";
import { BillingModule } from "../billing/BillingModule";
import EventBus from "../events/EventBus";
import { TTSControlsModule } from "./TTSControlsModule";
import {
  AssistantResponse,
  ChatHistoryObserver,
  RootChatHistoryObserver,
} from "../dom/ChatHistoryObserver";
import { Observation } from "../dom/Observation";
import { VoiceMenu } from "./VoiceMenu";

export class TextToSpeechUIManager {
  private billingModule = BillingModule.getInstance();
  private userPreferences = UserPreferenceModule.getInstance();
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

  chargeForTTS(utterance: SpeechSynthesisUtteranceRemote): void {
    const hoverMenu = document.getElementById(
      `saypi-tts-controls-${utterance.id}`
    );
    if (hoverMenu) {
      TTSControlsModule.updateCostBasis(
        hoverMenu,
        utterance.text.length,
        utterance.voice
      );
    }
    this.billingModule.charge(utterance);
  }

  associateWithChatHistory(
    chatHistoryObserver: ChatHistoryObserver,
    utterance: SpeechSynthesisUtteranceRemote
  ): void {
    // get most recent message in chat history
    const assistantMessages = document.querySelectorAll(".assistant-message");
    if (assistantMessages.length > 0) {
      const lastAssistantMessage = assistantMessages[
        assistantMessages.length - 1
      ] as HTMLElement;
      const assistantMessage = new AssistantResponse(lastAssistantMessage);
      chatHistoryObserver.decorateAssistantResponseWithSpeech(
        assistantMessage,
        utterance
      );
      // ensure the AssistantResponse object has finished mutating before generating its hash
      assistantMessage.stableHash().then((hash) => {
        // debug: verify the hashes have converged
        if (hash !== assistantMessage.hash) {
          console.error(`Hash mismatch: ${hash} vs ${assistantMessage.hash}`);
          assistantMessage.stableText().then((stableText) => {
            console.debug(`Stable text: "${stableText}"`);
            console.debug(`Assistant text: "${assistantMessage.text}"`);
          });
          return;
        }
        console.debug(`Adding speech to history with hash: ${hash}`);
        SpeechHistoryModule.getInstance().addSpeechToHistory(hash, utterance);
      });
    }
  }

  registerPastChatHistoryListener(): void {
    // this listener keeps track of the top-level chat history containers,
    // and recursively observes the children of the past messages container
    const rootChatHistoryObserver = new RootChatHistoryObserver(
      "#saypi-chat-history",
      SpeechSynthesisModule.getInstance()
    );
    rootChatHistoryObserver.observe({
      childList: true,
      subtree: false,
    });
  }

  registerPresentChatHistoryListener(): ChatHistoryObserver {
    const chatHistoryObserver = new ChatHistoryObserver(
      "#saypi-chat-history-present-messages",
      SpeechSynthesisModule.getInstance()
    );
    chatHistoryObserver.observe({
      childList: true,
      subtree: true,
      attributes: true,
    }); // would be more efficient to observe only the direct children of the chat history, but this is more robust
    return chatHistoryObserver;
  }

  registerSpeechStreamListeners(observer: ChatHistoryObserver): void {
    EventBus.on(
      "saypi:tts:replaying",
      (utterance: SpeechSynthesisUtteranceRemote) => {
        this.replaying = true;
      }
    );
    EventBus.on(
      "saypi:tts:speechStreamStarted",
      (utterance: SpeechSynthesisUtteranceRemote) => {
        if (utterance && !this.replaying) {
          this.associateWithChatHistory(observer, utterance);
        }
        this.replaying = false;
      }
    );
    EventBus.on(
      "saypi:tts:speechStreamEnded",
      (utterance: SpeechSynthesisUtteranceRemote) => {
        if (utterance) {
          this.chargeForTTS(utterance);
        }
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
    const observerPresent = this.registerPresentChatHistoryListener();
    this.registerSpeechStreamListeners(observerPresent);
  }
}
