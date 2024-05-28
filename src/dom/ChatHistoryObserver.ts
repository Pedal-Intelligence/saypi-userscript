import { md5 } from "js-md5";
import {
  ElementTextStream,
  PARAGRAPH_BREAK,
  SilentElementTextStream,
} from "../tts/InputStream";
import {
  SpeechSynthesisModule,
  SpeechSynthesisUtteranceRemote,
} from "../tts/SpeechSynthesisModule";
import { TTSControlsModule } from "../tts/TTSControlsModule";
import { BaseObserver } from "./BaseObserver";
import { Observation } from "./Observation";
import { SpeechHistoryModule } from "../tts/SpeechHistoryModule";
import { audioProviders } from "../tts/SpeechModel";

class AssistantResponse {
  private _element: HTMLElement;
  private stablised: boolean = false;
  private finalText: string = "";

  constructor(element: HTMLElement) {
    this._element = element;
    this.decorate();
  }

  private decorate(): void {
    this._element.classList.add("chat-message", "assistant-message");
    this.decoratedContent();
  }

  /**
   * Waits for the content of the chat message to load and returns it
   * The content is the main text of the chat message, excluding any metadata or buttons
   * @returns Promise<HTMLElement> - the content of the chat message
   */
  async decoratedContent(): Promise<HTMLElement> {
    const content = this._element.querySelector(".content");
    if (content) {
      // content already found and decorated
      return content as HTMLElement;
    }
    const wfull = this._element.querySelector(".w-full");
    if (wfull) {
      // content found but not decorated yet
      wfull.classList.add("content");
      return wfull as HTMLElement;
    }
    // content not found, wait for it to load
    return new Promise((resolve) => {
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          for (const node of [...mutation.addedNodes]) {
            if (node instanceof HTMLElement) {
              const addedElement = node as HTMLElement;
              // TODO: w-full is specific to Pi.ai, should be generalized with Chatbot parameter
              if (addedElement.classList.contains("w-full")) {
                addedElement.classList.add("content");
                observer.disconnect();
                resolve(addedElement);
              }
            }
          }
        }
      });
      observer.observe(this._element, { childList: true, subtree: true });
    });
  }

  /**
   * Get the text content of the chat message,
   * as it is at the time of calling this method, which may not be completely loaded if the response is still streaming
   * Get stableText() to get the finished text content of the chat message
   */
  get text(): string {
    const contentNode = this._element.querySelector(".content");
    if (contentNode) {
      const content = contentNode as HTMLElement;
      const textContent = content.innerText || content.textContent || "";
      return textContent.trim();
    }
    return "";
  }

  async stableText(): Promise<string> {
    if (this.stablised) {
      return this.finalText;
    }
    const content = await this.decoratedContent();
    const textStream = new ElementTextStream(content);
    const textBuffer: string[] = [];
    return new Promise((resolve) => {
      textStream.getStream().subscribe({
        next: (text) => {
          textBuffer.push(text);
        },
        complete: () => {
          this.stablised = true;
          this.finalText = textBuffer.join("");
          resolve(this.finalText);
        },
      });
    });
  }

  /**
   * Get the md5 hash of the text content of the chat message
   * Use this function only if you know the text content is already stable,
   * otherwise get stableHash() to get the hash of the final text content
   */
  get hash(): string {
    // return a md5 hash of the text content
    return md5(this.text);
  }

  async stableHash(): Promise<string> {
    // return a md5 hash of the text content
    const stableText = await this.stableText();
    return md5(stableText);
  }

  get element(): HTMLElement {
    return this._element;
  }

  get utteranceId(): string | null {
    return this._element.dataset.utteranceId || null;
  }

  get isTTSEnabled(): boolean {
    return this.utteranceId !== null;
  }

  enableTTS(utterance: SpeechSynthesisUtteranceRemote): void {
    this._element.dataset.utteranceId = utterance.id;
  }
}

class ChatHistoryRootElementObserver extends BaseObserver {
  chatHistoryRootElement: HTMLElement | null = null;
  speechSynthesis: SpeechSynthesisModule;
  oldMessageObserver: ChatHistoryOldMessageObserver | null = null;
  /* This class adds an id to the 2nd child of the element under observeration, whenever children are added to the element */
  constructor(selector: string, speechSynthesis: SpeechSynthesisModule) {
    super(selector);
    this.chatHistoryRootElement = document.querySelector(selector);
    this.speechSynthesis = speechSynthesis;
  }

  protected async callback(mutations: MutationRecord[]): Promise<void> {
    for (const mutation of mutations) {
      for (const node of [...mutation.addedNodes]) {
        if (node instanceof Element) {
          const addedElement = node as Element;
          const pastMessagesContainer =
            this.chatHistoryRootElement?.querySelector(":nth-child(2)");
          if (pastMessagesContainer == addedElement) {
            // add id to the 2nd child of the element
            pastMessagesContainer.id = "saypi-chat-history-past-messages";
            if (this.oldMessageObserver) {
              this.oldMessageObserver.disconnect();
            }
            this.oldMessageObserver = new ChatHistoryOldMessageObserver(
              `#${pastMessagesContainer.id}`,
              this.speechSynthesis
            );
            this.oldMessageObserver
              .runOnce(pastMessagesContainer)
              .then((numFound) => {
                console.debug(`Found ${numFound} old assistant messages`);
              });
            this.oldMessageObserver.observe({
              childList: true,
              subtree: false,
            });
          }
        }
      }
    }
  }
}

abstract class ChatHistoryMessageObserver extends BaseObserver {
  protected speechSynthesis: SpeechSynthesisModule;
  protected ttsControlsModule: TTSControlsModule;
  protected haltOnFirst: boolean = false; // stop searching after the first chat message is found
  constructor(selector: string, speechSynthesis: SpeechSynthesisModule) {
    super(selector);
    this.speechSynthesis = speechSynthesis;
    this.ttsControlsModule = new TTSControlsModule(speechSynthesis);
  }

  /**
   * Given a chat message, return a streamable speech utterance
   * @param message: AssistantResponse - a HTML element representing a chatbot's message
   * @returns SpeechSynthesisUtteranceRemote | null - a speakable representation of the chat message
   */
  protected abstract streamSpeech(
    message: AssistantResponse
  ): Promise<SpeechSynthesisUtteranceRemote | null>;

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

  /**
   * Run the observer once on the direct children of the root element
   * Used for initial decoration of the chat history, before additional chat messages are loaded
   * @param root: Element - the root of a tree of possible chat messages
   */
  async runOnce(root: Element): Promise<number> {
    let numFound = 0;
    for (const node of [...root.children]) {
      if (node instanceof Element) {
        const child = node as Element;
        const responseObs = await this.findAndDecorateAssistantResponse(child);
        if (responseObs.isReady()) {
          numFound += 1;
        }
      }
    }
    return numFound;
  }

  static findAssistantResponse(searchRoot: Element): Observation {
    const query = "div.break-anywhere:not(.justify-end)"; // TODO: -> this.chatbot.getAssistantResponseSelector();
    const deepMatch = searchRoot.querySelector(query);
    if (deepMatch) {
      const found = Observation.notDecorated(deepMatch.id, deepMatch);
      if (deepMatch.classList.contains("assistant-message")) {
        return Observation.decorated(found);
      }
      return found;
    }
    /* I have no idea why the query selector doesn't cover the case below too, but it sometimes doesn't */
    if (
      searchRoot.classList.contains("break-anywhere") &&
      !searchRoot.classList.contains("justify-end")
    ) {
      const found = Observation.notDecorated(searchRoot.id, searchRoot);
      if (searchRoot.classList.contains("assistant-message")) {
        return Observation.decorated(found);
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
  static decorateAssistantResponse(
    messageElement: HTMLElement
  ): AssistantResponse {
    const message = new AssistantResponse(messageElement);
    return message;
  }

  /**
   * Decorates the assistant response with speech functionality
   */
  decorateAssistantResponseWithSpeech(
    message: AssistantResponse,
    utterance: SpeechSynthesisUtteranceRemote
  ): void {
    if (!message.isTTSEnabled) {
      message.enableTTS(utterance);
    }

    let hoverMenu = message.element.querySelector(".message-hover-menu");
    if (!hoverMenu) {
      if (message.element.children.length > 1) {
        hoverMenu = message.element.children[1] as HTMLDivElement;
        hoverMenu.classList.add("message-hover-menu");
        if (hoverMenu.children.length > 0) {
          const createThreadButton = hoverMenu.children[0] as HTMLDivElement;
          createThreadButton.classList.add("create-thread-button");
        }
        let ttsControlsElement = message.element.querySelector(
          "saypi-tts-controls"
        ) as HTMLDivElement | null;
        if (!ttsControlsElement) {
          ttsControlsElement = document.createElement("div");
          ttsControlsElement.id = `saypi-tts-controls-${utterance.id}`;
          ttsControlsElement.classList.add("saypi-tts-controls", "pt-4");
          hoverMenu.appendChild(ttsControlsElement);
          this.ttsControlsModule.addSpeechButton(utterance, ttsControlsElement);
          this.ttsControlsModule.addCostBasis(
            ttsControlsElement,
            utterance.text.length,
            utterance.voice
          );
        }
      }
    }
  }

  async findAndDecorateAssistantResponse(
    searchRoot: Element
  ): Promise<Observation> {
    const obs = ChatHistoryNewMessageObserver.findAssistantResponse(searchRoot);
    if (obs.found) {
      console.log("Found assistant message", obs.target);
    }
    if (obs.found && obs.isNew && !obs.decorated) {
      const message = ChatHistoryMessageObserver.decorateAssistantResponse(
        obs.target as HTMLElement
      );
      const utterance = await this.streamSpeech(message);
      if (utterance) {
        this.decorateAssistantResponseWithSpeech(message, utterance);
      }
    }
    return Observation.decorated(obs);
  }
}

class ChatHistoryOldMessageObserver extends ChatHistoryMessageObserver {
  private speechHistory: SpeechHistoryModule =
    SpeechHistoryModule.getInstance();

  async streamSpeech(
    message: AssistantResponse
  ): Promise<SpeechSynthesisUtteranceRemote | null> {
    // query the speech history module for the utterance
    const utterance = await this.speechHistory.getSpeechFromHistory(
      message.hash
    );
    if (utterance) {
      console.debug("Found message in speech history", utterance.id);
      return utterance;
    } else {
      // speech not cached
      return null;
    }
  }
}

class ChatHistoryNewMessageObserver extends ChatHistoryMessageObserver {
  constructor(selector: string, speechSynthesis: SpeechSynthesisModule) {
    super(selector, speechSynthesis);
    this.haltOnFirst = true; // only expecting to load one new chat message at a time
  }

  // Chat history and automatic speech functionality
  async streamSpeech(
    message: AssistantResponse
  ): Promise<SpeechSynthesisUtteranceRemote | null> {
    const provider = await this.speechSynthesis.getActiveAudioProvider();
    if (provider === audioProviders.SayPi) {
      const utterance = await this.speechSynthesis.createSpeechStream();
      message.enableTTS(utterance);
      console.debug("Opened audio input stream", utterance.id);
      const initialText = message.text;
      // send the initial text to the stream only if it's not empty
      if (initialText.trim()) {
        console.debug(`Streaming text began with "${initialText}"`);
        this.speechSynthesis.addSpeechToStream(utterance.id, initialText);
      }
      const messageContent = await message.decoratedContent();
      this.observeChatMessageElement(
        messageContent,
        utterance,
        () => this.ttsControlsModule.autoplaySpeech(utterance, 200),
        () => {
          console.debug("Closed audio input stream", utterance.id);
        }
      );
      return utterance;
    }
    return null;
  }

  private textStream: ElementTextStream | null = null;

  observeChatMessageElement(
    messageContent: HTMLElement,
    utterance: SpeechSynthesisUtteranceRemote,
    onStart: () => void,
    onEnd: () => void
  ): void {
    // If we're already observing an element, disconnect from it
    if (this.textStream) {
      this.textStream.disconnect();
    }

    // Start observing the new element
    this.textStream = new ElementTextStream(messageContent);
    let firstChunkTime: number | null = null;

    this.textStream.getStream().subscribe(
      (text) => {
        let start = false;
        if (text.trim() || text === PARAGRAPH_BREAK) {
          const currentTime = Date.now();
          if (firstChunkTime === null) {
            firstChunkTime = currentTime;
            start = true;
          }
          const delay = currentTime - (firstChunkTime as number);
          console.debug(`+${delay}ms, streamed text: "${text}"`);
          this.speechSynthesis
            .addSpeechToStream(utterance.id, text)
            .then(() => {
              if (start) {
                onStart();
              }
            });
          utterance.text += text;
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
          onEnd();
        }
      }
    );
  }
}

export {
  AssistantResponse,
  ChatHistoryMessageObserver,
  ChatHistoryNewMessageObserver as ChatHistoryAdditionsObserver,
  ChatHistoryRootElementObserver as RootChatHistoryObserver,
};
