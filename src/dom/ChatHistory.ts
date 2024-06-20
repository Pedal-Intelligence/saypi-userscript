import { ElementTextStream, TextContent } from "../tts/InputStream";
import { SpeechSynthesisModule } from "../tts/SpeechSynthesisModule";
import { TTSControlsModule } from "../tts/TTSControlsModule";
import { BaseObserver } from "./BaseObserver";
import { Observation } from "./Observation";
import { SpeechHistoryModule } from "../tts/SpeechHistoryModule";
import {
  AssistantSpeech,
  SpeechUtterance,
  StreamedSpeech,
  audioProviders,
} from "../tts/SpeechModel";
import { BillingModule } from "../billing/BillingModule";
import EventBus from "../events/EventBus";
import { AssistantResponse } from "./MessageElements";
interface ResourceReleasable {
  teardown(): void;
}
type EventListener = {
  event: string;
  listener: (...args: any[]) => void;
};
type Observer = {
  disconnect: () => void;
};

/**
 * Monitors the root element of the chat history for past and present sections
 */
class ChatHistoryRootElementObserver extends BaseObserver {
  speechSynthesis: SpeechSynthesisModule;
  oldMessageObserver: ChatHistoryOldMessageObserver | null = null;
  /* This class adds an id to the 2nd child of the element under observeration, whenever children are added to the element */
  constructor(
    private chatHistoryElement: HTMLElement,
    selector: string,
    speechSynthesis: SpeechSynthesisModule,
    initialRun: boolean = true
  ) {
    super(chatHistoryElement, selector);
    this.speechSynthesis = speechSynthesis;
    if (initialRun) {
      this.runOnce();
    }
  }

  /**
   * Check if the child element is the container for the chat history's past messages
   * @param child - a child of the chat history root element
   */
  private handleChatHistoryChild(child: Element): void {
    // error if the child is not a direct descendant of the chat history element
    if (!this.chatHistoryElement.contains(child)) {
      console.error("Element is not a child of the chat history", child);
      return;
    }
    const pastMessagesContainer =
      this.chatHistoryElement?.querySelector(":nth-child(2)");
    if (pastMessagesContainer == child) {
      // add id to the 2nd child of the element
      pastMessagesContainer.id = "saypi-chat-history-past-messages";
      if (this.oldMessageObserver) {
        this.oldMessageObserver.disconnect();
      }
      this.oldMessageObserver = new ChatHistoryOldMessageObserver(
        this.chatHistoryElement,
        `#${pastMessagesContainer.id}`,
        this.speechSynthesis
      );
      this.oldMessageObserver
        .runOnce(pastMessagesContainer)
        .then((messages) => {
          console.debug(`Found ${messages.length} old assistant messages`);
        });
      this.oldMessageObserver.observe({
        childList: true,
        subtree: false,
      });
    }
  }

  public async runOnce(): Promise<void> {
    // run once on the direct children of the root element
    for (const node of [...this.chatHistoryElement.children]) {
      if (node instanceof Element) {
        const child = node as Element;
        this.handleChatHistoryChild(child);
      }
    }
  }

  protected async callback(mutations: MutationRecord[]): Promise<void> {
    for (const mutation of mutations) {
      for (const node of [...mutation.addedNodes]) {
        if (node instanceof Element) {
          const addedElement = node as Element;
          this.handleChatHistoryChild(addedElement);
        }
      }
    }
  }
}

abstract class ChatHistoryMessageObserver extends BaseObserver {
  protected speechSynthesis: SpeechSynthesisModule;
  protected ttsControlsModule: TTSControlsModule;
  protected haltOnFirst: boolean = false; // stop searching after the first chat message is found
  constructor(
    chatHistoryElement: HTMLElement,
    selector: string,
    speechSynthesis: SpeechSynthesisModule
  ) {
    super(chatHistoryElement, selector);
    this.speechSynthesis = speechSynthesis;
    this.ttsControlsModule = new TTSControlsModule(speechSynthesis);
  }

  /**
   * Given a chat message, return a streamable speech utterance
   * @param message: AssistantResponse - a HTML element representing a chatbot's message
   * @returns SpeechUtterance | null - a speakable representation of the chat message
   */
  protected abstract streamSpeech(
    message: AssistantResponse
  ): Promise<StreamedSpeech | null>;

  protected async callback(mutations: MutationRecord[]): Promise<void> {
    for (const mutation of mutations) {
      for (const node of [...mutation.addedNodes]) {
        if (node instanceof Element) {
          const addedElement = node as Element;
          const responseObs = await this.findAndDecorateAssistantResponse(
            addedElement
          );
          if (this.haltOnFirst && responseObs.isReady()) {
            // only expecting one new chat message at a time, so
            // skip this mutation if the chat message is already decorated
            return; // break early
          }
        }
      }
    }
  }

  static findAssistantResponse(searchRoot: Element): Observation {
    const query = "div.break-anywhere:not(.justify-end)"; // TODO: -> this.chatbot.getAssistantResponseSelector();
    const deepMatch = searchRoot.querySelector(query);
    if (deepMatch) {
      const found = Observation.foundUndecorated(deepMatch.id, deepMatch);
      if (deepMatch.classList.contains("assistant-message")) {
        return Observation.foundAndDecorated(found);
      }
      return found;
    }
    /* I have no idea why the query selector doesn't cover the case below too, but it sometimes doesn't */
    if (
      searchRoot.classList.contains("break-anywhere") &&
      !searchRoot.classList.contains("justify-end")
    ) {
      const found = Observation.foundUndecorated(searchRoot.id, searchRoot);
      if (searchRoot.classList.contains("assistant-message")) {
        return Observation.foundAndDecorated(found);
      }
      return found;
    }
    return Observation.notFound("");
  }

  /**
   * Decorates the assistant response with the necessary classes and attributes,
   * but does not add any additional functionality, i.e. speech
   * @param messageElement - the chat message to decorate
   * @returns AssistantResponse - the decorated chat message
   */
  public decorateAssistantResponse(
    messageElement: HTMLElement
  ): AssistantResponse {
    const message = new AssistantResponse(messageElement);
    return message;
  }

  /**
   * Decorates the assistant response with speech functionality
   * @deprecated - use AssistantResponse.decorateSpeech() instead
   */
  decorateAssistantResponseWithSpeech(
    message: AssistantResponse,
    speech: StreamedSpeech
  ): void {}

  async findAndDecorateAssistantResponse(
    searchRoot: Element
  ): Promise<Observation> {
    let obs = ChatHistoryMessageObserver.findAssistantResponse(searchRoot);
    if (obs.found) {
      console.log("Found assistant message", obs);
    }
    if (obs.found && obs.isNew && !obs.decorated) {
      const message = this.decorateAssistantResponse(obs.target as HTMLElement);
      obs = Observation.foundAndDecorated(obs, message);
      const speech = await this.streamSpeech(message);
      if (speech?.utterance) {
        message.decorateSpeech(speech.utterance);
      }
      if (speech?.charge) {
        message.decorateCost(speech.charge);
      }
    }
    return obs;
  }

  async streamSpeechFromHistory(
    history: SpeechHistoryModule,
    message: AssistantResponse
  ): Promise<StreamedSpeech | null> {
    const speechRecord = await history.getSpeechFromHistory(message.hash);
    if (speechRecord) {
      console.debug("Found message in speech history", speechRecord);
      return speechRecord;
    } else {
      // speech not cached
      return null;
    }
  }
}

class ChatHistoryOldMessageObserver extends ChatHistoryMessageObserver {
  private speechHistory: SpeechHistoryModule =
    SpeechHistoryModule.getInstance();

  /**
   * Run the observer once on the direct children of the root element
   * Used for initial decoration of the chat history, before additional chat messages are loaded
   * @param root: Element - the root of a tree of possible chat messages
   */
  async runOnce(root: Element): Promise<AssistantResponse[]> {
    let messagesFound: AssistantResponse[] = [];
    for (const node of [...root.children]) {
      if (node instanceof Element) {
        const child = node as Element;
        const observation = await this.findAndDecorateAssistantResponse(child);
        if (observation.isReady() && observation.decorations.length > 0) {
          messagesFound.push(observation.decorations[0]);
        }
      }
    }
    return messagesFound;
  }

  async streamSpeech(
    message: AssistantResponse
  ): Promise<StreamedSpeech | null> {
    // query the speech history module for the utterance
    return await this.streamSpeechFromHistory(this.speechHistory, message);
  }
}

class ChatHistoryNewMessageObserver
  extends ChatHistoryMessageObserver
  implements ResourceReleasable
{
  private ignoreMessages: AssistantResponse[];
  private speechHistory: SpeechHistoryModule =
    SpeechHistoryModule.getInstance();

  private EventListeners: EventListener[] = [];

  constructor(
    chatHistoryElement: HTMLElement,
    selector: string,
    speechSynthesis: SpeechSynthesisModule,
    ignoreMessages: AssistantResponse[] = []
  ) {
    super(chatHistoryElement, selector, speechSynthesis);
    this.haltOnFirst = true; // only expecting to load one new chat message at a time
    this.ignoreMessages = ignoreMessages;
  }

  /**
   * Override the default decoration method to account for the behaviour of new messages
   */
  public decorateAssistantResponse(
    messageElement: HTMLElement
  ): AssistantResponse {
    const message = new AssistantResponse(messageElement, false); // streaming assistant messages should not include initial text
    return message;
  }

  // Chat history and automatic speech functionality
  async streamSpeech(
    message: AssistantResponse
  ): Promise<StreamedSpeech | null> {
    // check if the message is already in the ignore list
    console.debug("Checking if message is in ignore list", message.text);
    if (this.ignoreMessages.some((m) => m.hash === message.hash)) {
      console.debug("Message is in ignore list, stream from history instead");
      return await this.streamSpeechFromHistory(this.speechHistory, message);
    }

    const provider = await this.speechSynthesis.getActiveAudioProvider();
    if (provider === audioProviders.SayPi) {
      const utterance = await this.speechSynthesis.createSpeechStream();
      message.decorateSpeech(utterance);
      console.debug("Opened audio input stream", utterance.id);

      const messageContent = await message.decoratedContent();
      this.observeChatMessageElement(
        messageContent,
        utterance,
        () => this.ttsControlsModule.autoplaySpeech(utterance, 200),
        (text) => {
          console.debug("Closed audio input stream", utterance.id);
          console.debug("Streamed text:", text);
          const charge = BillingModule.getInstance().charge(utterance, text);
          console.debug("Charging for TTS", charge);
          message.decorateCost(charge);
          console.debug("Saving charge to history", charge);
          this.speechHistory.addChargeToHistory(charge.utteranceHash, charge);
        }
      );
      return new AssistantSpeech(utterance);
    } else {
      // speech will be generated by Pi.ai, stream details not available yet
      const streamStartedListener = (utterance: SpeechUtterance) => {
        message.decorateSpeech(utterance);
        return new AssistantSpeech(utterance);
      };
      EventBus.on("saypi:tts:speechStreamStarted", streamStartedListener);
      this.EventListeners.push({
        event: "saypi:tts:speechStreamStarted",
        listener: streamStartedListener,
      });
      return null;
    }
  }

  teardown(): void {
    for (const listener of this.EventListeners) {
      EventBus.off(listener.event, listener.listener);
    }
  }

  public disconnect(): void {
    super.disconnect();
    this.teardown();
  }

  private textStream: ElementTextStream | null = null;

  observeChatMessageElement(
    messageContent: HTMLElement,
    utterance: SpeechUtterance,
    onStart: () => void,
    onEnd: (fullText: string) => void
  ): void {
    // If we're already observing an element, disconnect from it
    if (this.textStream) {
      this.textStream.disconnect();
    }

    // Start observing the new element
    this.textStream = new ElementTextStream(messageContent);
    let firstChunkTime: number | null = null;
    let fullText = ""; // Variable to accumulate the text

    this.textStream.getStream().subscribe(
      (text: TextContent) => {
        let start = false;
        if (text.changed) {
          console.debug(
            `Text changed from "${text.changedFrom}" to "${text.text}"`
          );
          this.speechSynthesis
            .replaceSpeechInStream(utterance.id, text.changedFrom!, text.text)
            .then((replaced) => {
              if (replaced) {
                console.debug(
                  `Replaced text in stream: "${text.changedFrom}" -> "${text.text}"`
                );
              } else {
                console.error(
                  `Failed to replace text in stream before being flushed: "${text.changedFrom}" -> "${text.text}"`
                );
              }
            });
        } else {
          const txt = text.text;
          fullText += txt; // Add the text chunk to the full text
          const currentTime = Date.now();
          if (firstChunkTime === null) {
            firstChunkTime = currentTime;
            start = true;
          }
          const delay = currentTime - (firstChunkTime as number);
          console.debug(`+${delay}ms, streamed text: "${txt}"`);
          this.speechSynthesis.addSpeechToStream(utterance.id, txt).then(() => {
            if (start) {
              onStart();
            }
          });
        }
      },
      (error) => {
        console.error(`Error occurred streaming text from element: ${error}`);
      },
      () => {
        if (firstChunkTime) {
          const totalTime = Date.now() - (firstChunkTime as number);
          console.info(
            `Text stream complete after ${(totalTime / 1000).toFixed(
              1
            )} seconds`
          );
        } else {
          console.info("Text stream complete with no text");
        }
        this.speechSynthesis.endSpeechStream(utterance);
        if (onEnd) {
          onEnd(fullText); // Pass the full text to the onEnd callback
        }
      }
    );
  }
}

/**
 * Get the most recent assistant message from the chat history
 */
function getMostRecentAssistantMessage(): AssistantResponse | null {
  const assistantMessages = document.querySelectorAll(".assistant-message");
  if (assistantMessages.length > 0) {
    const messageElement = assistantMessages[
      assistantMessages.length - 1
    ] as HTMLElement;
    return new AssistantResponse(messageElement);
  }
  return null;
}

export {
  AssistantSpeech,
  ChatHistoryMessageObserver,
  ChatHistoryOldMessageObserver,
  ChatHistoryNewMessageObserver as ChatHistoryAdditionsObserver,
  ChatHistoryRootElementObserver as RootChatHistoryObserver,
  getMostRecentAssistantMessage,
  ResourceReleasable,
  EventListener,
  Observer,
};
