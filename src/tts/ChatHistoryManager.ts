import {
  SpeechSynthesisModule,
  TextCompletedEvent,
  TextErrorEvent,
} from "./SpeechSynthesisModule";
import { SpeechHistoryModule } from "./SpeechHistoryModule";
import { MessageHistoryModule } from "./MessageHistoryModule";
import { UserPreferenceModule } from "../prefs/PreferenceModule";
import { Chatbot } from "../chatbots/Chatbot";
import EventBus from "../events/EventBus";
import { AssistantResponse } from "../dom/MessageElements";
import {
  AssistantSpeech,
  ChatHistoryAdditionsObserver,
  ChatHistoryOldMessageObserver,
  Observer,
  RootChatHistoryObserver,
  EventListener,
  ResourceReleasable,
  getAssistantMessageByUtterance as getAssistantMessageByUtteranceId,
} from "../dom/ChatHistory";
import { Observation } from "../dom/Observation";
import { SpeechUtterance } from "./SpeechModel";
import { logger } from "../LoggingModule";
import { findRootAncestor } from "../dom/DOMModule";
import { UtteranceCharge } from "../billing/BillingModule";
import { md5 } from "js-md5";
import { TextualNotificationsModule } from "../NotificationsModule";
import getMessage from "../i18n";

export class ChatHistorySpeechManager implements ResourceReleasable {
  private userPreferences = UserPreferenceModule.getInstance();
  private speechSynthesis = SpeechSynthesisModule.getInstance();
  private speechHistory = SpeechHistoryModule.getInstance();
  private messageHistory = MessageHistoryModule.getInstance();
  private replaying = false; // flag to indicate whether the user requested a replay of an utterance

  // managed resources
  private eventListeners: EventListener[] = [];
  private observers: Observer[] = [];

  private newMessageObserver: ChatHistoryAdditionsObserver | null = null;
  private static pendingSpeeches: Map<
    string,
    {
      message: AssistantResponse;
      speech: AssistantSpeech;
      manager: ChatHistorySpeechManager;
    }
  > = new Map();
  private static completionListenerRegistered = false;
  private static readonly MD5_OF_NOTHING = "d41d8cd98f00b204e9800998ecf8427e";
  private static readonly MD5_OF_SPACE = "7215ee9c7d9dc229d2921a40e899ec5f";

  // Methods for DOM manipulation and element ID assignment
  addIdChatHistory(chatHistory: HTMLElement): void {
    chatHistory.id = "saypi-chat-history";
    chatHistory.classList.add("chat-history");
    const rootAncestor = findRootAncestor(chatHistory);

    // for pi.ai, the past messages container will be replaced when the chat history is updated, so is monitored for changes in RootChatHistoryObserver
    const pastHistorySelector = this.chatbot.getPastChatHistorySelector();
    const pastChatMessagesContainer = pastHistorySelector
      ? rootAncestor.querySelector(pastHistorySelector)
      : chatHistory;
    if (pastChatMessagesContainer) {
      pastChatMessagesContainer.classList.add("chat-history", "past-messages");
    }

    const presentHistorySelector = this.chatbot.getRecentChatHistorySelector();
    const presentChatMessagesContainer = presentHistorySelector
      ? rootAncestor.querySelector(presentHistorySelector)
      : chatHistory;
    if (presentChatMessagesContainer) {
      presentChatMessagesContainer.classList.add(
        "chat-history",
        "present-messages"
      );
    }
  }

  /**
   * Find the message in the chat history that corresponds to the given utterance,
   * and associate the utterance with that message in the speech history.
   * @param utterance A spoken reading of a chat message
   */
  async associateWithChatHistory(
    searchRoot: HTMLElement,
    utterance: SpeechUtterance
  ): Promise<void> {
    // get most recent message in chat history
    const speech = new AssistantSpeech(utterance);
    await this.newMessageObserver?.findAndDecorateAssistantResponses(
      searchRoot
    ); // ensure decorators have run before searching for the message
    const assistantMessages = searchRoot.querySelectorAll(".assistant-message");
    if (assistantMessages.length > 0) {
      const lastAssistantMessage = assistantMessages[
        assistantMessages.length - 1
      ] as HTMLElement;
      const assistantMessage =
        this.chatbot.getAssistantResponse(lastAssistantMessage);
      assistantMessage.decorateSpeech(utterance);
      const existingPending = ChatHistorySpeechManager.pendingSpeeches.get(
        utterance.id
      );
      if (existingPending) {
        logger.warn(
          `Replacing pending speech association for utterance ${utterance.id}`
        );
      }
      ChatHistorySpeechManager.pendingSpeeches.set(utterance.id, {
        message: assistantMessage,
        speech,
        manager: this,
      });
    }
  }

  private static handleSpeechCompletion(event: TextCompletedEvent): void {
    const pending = ChatHistorySpeechManager.pendingSpeeches.get(
      event.utterance.id
    );
    if (!pending) {
      return;
    }

    ChatHistorySpeechManager.pendingSpeeches.delete(event.utterance.id);

    const { message: assistantMessage, speech, manager } = pending;
    const normalizedCompletedText = AssistantResponse.normalizeTextForHash(
      event.text
    );
    const completedHash = md5(normalizedCompletedText);
    const messageHash = assistantMessage.hash;
    if (completedHash !== messageHash) {
      console.error(`Hash mismatch: ${completedHash} vs ${assistantMessage.hash}`);
      if (completedHash === ChatHistorySpeechManager.MD5_OF_NOTHING) {
        console.error(
          "Hash is md5 of nothing - stable text failed to resolve."
        );
      } else if (completedHash === ChatHistorySpeechManager.MD5_OF_SPACE) {
        console.error("Hash is md5 of ' ' - text stream may be empty.");
      }
      logger.debug(`Completed text: "${event.text}"`);
      logger.debug(`Normalized completed text: "${normalizedCompletedText}"`);
      logger.debug(`Assistant text: "${assistantMessage.text}"`);
      return;
    }

    logger.debug(
      `Saving speech for ${assistantMessage.toString()} with hash: ${completedHash}`
    );
    manager.speechHistory.addSpeechToHistory(completedHash, speech);
  }

  private static registerSpeechCompletionListener(): void {
    if (ChatHistorySpeechManager.completionListenerRegistered) {
      return;
    }
    EventBus.on(
      "saypi:tts:text:completed",
      ChatHistorySpeechManager.handleSpeechCompletion
    );
    ChatHistorySpeechManager.completionListenerRegistered = true;
  }

  private static clearPendingForManager(
    manager: ChatHistorySpeechManager
  ): void {
    const utteranceIdsToDelete: string[] = [];
    for (const [utteranceId, pending] of ChatHistorySpeechManager.pendingSpeeches) {
      if (pending.manager === manager) {
        utteranceIdsToDelete.push(utteranceId);
      }
    }

    for (const utteranceId of utteranceIdsToDelete) {
      ChatHistorySpeechManager.pendingSpeeches.delete(utteranceId);
    }
  }

  registerPastChatHistoryListener(chatHistoryElement: HTMLElement): void {
    // this listener keeps track of the top-level chat history containers,
    // and recursively observes the children of the past messages container
    const rootChatHistoryObserver = new RootChatHistoryObserver(
      chatHistoryElement,
      "#saypi-chat-history",
      this.speechSynthesis,
      this.chatbot
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
    const selector = ".chat-history.present-messages";
    const existingMessagesObserver = new ChatHistoryOldMessageObserver(
      chatHistoryElement,
      selector,
      this.speechSynthesis,
      this.chatbot
    );
    const recentContainer = findRootAncestor(chatHistoryElement).querySelector(
      selector
    ) as HTMLElement | null;
    const initialMessages = recentContainer
      ? await existingMessagesObserver.runOnce(recentContainer)
      : [];
    if (initialMessages.length > 0) {
      logger.debug(
        `Found ${initialMessages.length} recent assistant message(s)`
      );
    }
    existingMessagesObserver.disconnect(); // only run once

    const newMessagesObserver = new ChatHistoryAdditionsObserver(
      chatHistoryElement,
      selector,
      this.speechSynthesis,
      this.chatbot,
      initialMessages
    );
    newMessagesObserver.observe({
      childList: true,
      subtree: true,
      attributes: true,
      attributeOldValue: true, // Enable tracking of old attribute values for debugging
    });
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
    ChatHistorySpeechManager.registerSpeechCompletionListener();

    this.eventListeners.push({ event: "saypi:tts:replaying", listener: replayingListener });
    this.eventListeners.push({ event: "saypi:tts:speechStreamStarted", listener: speechStreamStartedListener });

    this.eventListeners.push(
      { event: "saypi:tts:replaying", listener: replayingListener },
      {
        event: "saypi:tts:speechStreamStarted",
        listener: speechStreamStartedListener,
      }
    );
  }

  registerMessageErrorListeners(): void {
    const speechErrorListener = (event: TextErrorEvent) => {
      console.warn(
        `Speech error for utterance: ${event.utterance.id}`,
        event.error
      );
      const utteranceId = event.utterance?.id;
      if (utteranceId) {
        ChatHistorySpeechManager.pendingSpeeches.delete(utteranceId);
        // find the message in the chat history that corresponds to the given utterance
        // and mark it as having an error
        try {
          const message = getAssistantMessageByUtteranceId(
            this.chatbot,
            utteranceId
          );
          if (message) {
            message.decoratedContent().then((content) => {
              content.classList.add("inconsistent-text"); // redundant with incomplete speech?
            });
            message.decorateIncompleteSpeech();
          }
        } catch (e) {
          // message not found - non-fatal error
          logger.debug(
            `Could not find message for utterance ${utteranceId}. Won't be able to decorate with speech error.`
          );
        }
      }
    };

    EventBus.on("saypi:tts:text:error", speechErrorListener);

    this.eventListeners.push({
      event: "saypi:tts:text:error",
      listener: speechErrorListener,
    });
  }

  registerMessageChargeListeners(): void {
    const speechChargeListener = (charge: UtteranceCharge) => {
      if (charge.utteranceId && charge.cost > 0) {
        // find the message in the chat history that corresponds to the given utterance
        // and mark it as having a charge
        try {
          const message = getAssistantMessageByUtteranceId(
            this.chatbot,
            charge.utteranceId
          );
          if (message) {
            message.decorateCost(charge);
            this.speechHistory.addChargeToHistory(charge.utteranceHash, charge);
          }
        } catch (e) {
          // message not found - non-fatal error
          logger.debug(
            `Could not find message for utterance ${charge.utteranceId}. Won't be able to decorate with charge.`
          );
        }
      }
    };

    EventBus.on("saypi:billing:utteranceCharged", speechChargeListener);

    this.eventListeners.push({
      event: "saypi:billing:utteranceCharged",
      listener: speechChargeListener,
    });
  }

  registerMessageHideListeners(): void {
    const hideMessageListener = async () => {
      const assistantMessages = document.querySelectorAll(".assistant-message");
      if (assistantMessages.length > 0) {
        const lastMessage = assistantMessages[assistantMessages.length - 1] as HTMLElement;
        const assistantMessage = this.chatbot.getAssistantResponse(lastMessage);
        
        // Save the maintenance message state
        await this.messageHistory.markAsMaintenanceMessage(assistantMessage);
        
        // Apply the state decoration
        const hash = assistantMessage.hash;
        const state = await this.messageHistory.getMessageState(hash);
        if (state) {
          await assistantMessage.decorateState(state);
        }
      }
    };

    EventBus.on("saypi:ui:hide-message", hideMessageListener);

    this.eventListeners.push({
      event: "saypi:ui:hide-message",
      listener: hideMessageListener,
    });
  }

  // Teardown method to disconnect event listeners and release resources
  teardown(): void {
    this.eventListeners.forEach(({ event, listener }) => {
      EventBus.off(event, listener);
    });
    this.eventListeners = [];

    ChatHistorySpeechManager.clearPendingForManager(this);

    this.observers.forEach((observer) => {
      observer.disconnect();
    });
    this.observers = [];
  }

  // Constructor
  constructor(private chatbot: Chatbot, chatHistoryElement: HTMLElement) {
    this.addIdChatHistory(chatHistoryElement);
    this.registerPastChatHistoryListener(chatHistoryElement);
    this.registerPresentChatHistoryListener(chatHistoryElement).then(
      (observer) => {
        this.newMessageObserver = observer;
      }
    );
    this.registerSpeechStreamListeners(chatHistoryElement);
    this.registerMessageErrorListeners();
    this.registerMessageChargeListeners();
    this.registerMessageHideListeners();
    this.registerTTSUnavailabilityListener();
  }

  /**
   * Listen for TTS unavailability events and show user-friendly notification
   * This happens when browser doesn't support offscreen and site has restrictive CSP
   */
  private registerTTSUnavailabilityListener(): void {
    const ttsUnavailableListener = (detail: { browserName: string; chatbotName: string; reason: string }) => {
      logger.debug(`[ChatHistoryManager] TTS unavailable notification triggered`, detail);

      const message = getMessage('ttsUnavailableBrowserChatbot', [
        detail.browserName,
        detail.chatbotName
      ]);

      // Use TextualNotificationsModule with extended timeout (30 seconds)
      // User can dismiss by clicking the notification
      const notifications = new TextualNotificationsModule();
      notifications.showNotification(message, 'info', 30);
    };

    EventBus.on('tts:unavailable', ttsUnavailableListener);

    this.eventListeners.push({
      event: 'tts:unavailable',
      listener: ttsUnavailableListener,
    });
  }

  findAudioControls(searchRoot: Element): Observation {
    const className = "saypi-audio-controls";
    const existingAudioControls = searchRoot.querySelector("." + className);
    if (existingAudioControls) {
      return Observation.foundAlreadyDecorated(className, existingAudioControls);
    }
    return Observation.notFound(className);
  }
}
