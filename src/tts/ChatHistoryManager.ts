import { SpeechSynthesisModule, TextErrorEvent } from "./SpeechSynthesisModule";
import { SpeechHistoryModule } from "./SpeechHistoryModule";
import { MessageHistoryModule } from "./MessageHistoryModule";
import { UserPreferenceModule } from "../prefs/PreferenceModule";
import { Chatbot } from "../chatbots/Chatbot";
import EventBus from "../events/EventBus";
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
import { VoiceSelector } from "./VoiceMenu";
import { SpeechUtterance } from "./SpeechModel";
import { findRootAncestor } from "../dom/DOMModule";
import { UtteranceCharge } from "../billing/BillingModule";

export class ChatHistorySpeechManager implements ResourceReleasable {
  private userPreferences = UserPreferenceModule.getInstance();
  private speechSynthesis = SpeechSynthesisModule.getInstance();
  private speechHistory = SpeechHistoryModule.getInstance();
  private messageHistory = MessageHistoryModule.getInstance();
  private replaying = false; // flag to indicate whether the user requested a replay of an utterance
  private voiceMenu: VoiceSelector | null = null;

  // managed resources
  private eventListeners: EventListener[] = [];
  private observers: Observer[] = [];

  private newMessageObserver: ChatHistoryAdditionsObserver | null = null;

  findAndDecorateVoiceMenu(): Observation {
    const audioControlsContainer = document.querySelector(
      ".saypi-audio-controls"
    );
    if (!audioControlsContainer) {
      return Observation.notFound("saypi-audio-controls");
    }
    let voiceMenuElement = audioControlsContainer.querySelector(
      this.chatbot.getVoiceMenuSelector()
    ) as HTMLElement | null;
    if (voiceMenuElement && voiceMenuElement instanceof HTMLElement) {
      const obs = Observation.foundUndecorated(
        "saypi-voice-menu",
        voiceMenuElement
      );
      this.voiceMenu = this.chatbot.getVoiceMenu(
        this.userPreferences,
        voiceMenuElement
      );
      return Observation.foundAndDecorated(obs);
    }
    // create a div under the container to hold the voice menu
    voiceMenuElement = document.createElement("div");
    voiceMenuElement.id = "saypi-voice-menu";
    this.voiceMenu = this.chatbot.getVoiceMenu(
      this.userPreferences,
      voiceMenuElement
    );
    const positionFromEnd = this.voiceMenu?.getPositionFromEnd();
    
    // Calculate insertion position from the end
    const childrenCount = audioControlsContainer.children.length;
    const insertionIndex = Math.max(0, childrenCount - positionFromEnd);
    
    if (insertionIndex >= childrenCount) {
      audioControlsContainer.appendChild(voiceMenuElement);
    } else {
      audioControlsContainer.insertBefore(
        voiceMenuElement, 
        audioControlsContainer.children[insertionIndex]
      );
    }
    const obs = Observation.foundUndecorated(
      "saypi-voice-menu",
      voiceMenuElement
    );
    return Observation.foundAndDecorated(obs);
  }

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

  md5OfNothing = "d41d8cd98f00b204e9800998ecf8427e";
  md5OfSpace = "7215ee9c7d9dc229d2921a40e899ec5f";

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
        console.debug(
          `Saving speech for ${assistantMessage.toString()} with hash: ${hash}`
        );
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
    const initialMessages = await existingMessagesObserver
      .runOnce(
        findRootAncestor(chatHistoryElement).querySelector(
          selector
        ) as HTMLElement
      );
    console.debug(
      `Found ${initialMessages.length} recent assistant message(s)`
    );
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
      if (event.utterance?.id) {
        // find the message in the chat history that corresponds to the given utterance
        // and mark it as having an error
        try {
          const message = getAssistantMessageByUtteranceId(
            this.chatbot,
            event.utterance.id
          );
          if (message) {
            message.decoratedContent().then((content) => {
              content.classList.add("inconsistent-text"); // redundant with incomplete speech?
            });
            message.decorateIncompleteSpeech();
          }
        } catch (e) {
          // message not found - non-fatal error
          console.debug(
            `Could not find message for utterance ${event.utterance.id}. Won't be able to decorate with speech error.`
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
          console.debug(
            `Could not find message for utterance ${charge.utteranceId}. Won't be able to decorate with charge.`
          );
        }
      }
    };

    EventBus.on("saypi:billing:utteranceCharged", speechChargeListener);

    this.eventListeners.push({
      event: "saypi:tts:text:charged",
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
    this.registerPresentChatHistoryListener(chatHistoryElement).then(
      (observer) => {
        this.newMessageObserver = observer;
      }
    );
    this.registerSpeechStreamListeners(chatHistoryElement);
    this.registerMessageErrorListeners();
    this.registerMessageChargeListeners();
    this.registerMessageHideListeners();
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
