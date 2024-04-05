import { ElementTextStream, SilentElementTextStream } from "../tts/InputStream";
import {
  SpeechSynthesisModule,
  SpeechSynthesisUtteranceRemote,
} from "../tts/SpeechSynthesisModule";
import { TTSControlsModule } from "../tts/TTSControlsModule";
import { BaseObserver } from "./BaseObserver";
import { Observation } from "./Observation";

class AssistantResponse {
  private _element: HTMLElement;
  private utteranceId: string | null = null;

  constructor(element: HTMLElement) {
    this._element = element;
    element.classList.add("chat-message", "assistant-message");
  }

  get text(): string {
    return this._element.innerText || this._element.textContent || "";
  }

  get element(): HTMLElement {
    return this._element;
  }

  get isTTSEnabled(): boolean {
    return this.utteranceId !== null;
  }

  enableTTS(utteranceId: string): void {
    this.utteranceId = utteranceId;
    this._element.dataset.utteranceId = utteranceId;
  }
}

class ChatHistoryObserver extends BaseObserver {
  private speechSynthesis: SpeechSynthesisModule;
  private ttsControlsModule: TTSControlsModule;
  constructor(selector: string, speechSynthesis: SpeechSynthesisModule) {
    super(selector);
    this.speechSynthesis = speechSynthesis;
    this.ttsControlsModule = new TTSControlsModule(speechSynthesis);
  }
  protected async callback(mutations: MutationRecord[]): Promise<void> {
    for (const mutation of mutations) {
      for (const node of [...mutation.addedNodes]) {
        if (node instanceof Element) {
          const addedElement = node as Element;
          const responseObs = await this.findAndDecorateAssistantResponse(
            addedElement
          );
          if (responseObs.isReady()) {
            // only expecting one new chat message at a time, so
            // skip this mutation if the chat message is already decorated
            return; // break early
          }
        }
      }
    }
  }

  // Chat history and automatic speech functionality
  async assistantChatMessageAdded(message: AssistantResponse): Promise<void> {
    const isEnabled = await this.speechSynthesis.isEnabled();
    if (isEnabled) {
      const utterance = await this.speechSynthesis.createSpeechStream();
      message.enableTTS(utterance.id);
      console.log("Created audio stream", utterance.id);
      const initialText = message.text;
      // send the initial text to the stream only if it's not empty
      if (initialText.trim()) {
        console.log(`Streaming text began with "${initialText}"`);
        this.speechSynthesis.addSpeechToStream(utterance.id, initialText);
      }
      let messageContent: HTMLElement | null = null;
      let hoverMenu: HTMLDivElement | null = null;
      let ttsControlsElement: HTMLElement | null = null;
      if (message.element.children.length > 0) {
        messageContent = message.element.children[0] as HTMLElement;
        messageContent.classList.add("message-content");
      }
      if (message.element.children.length > 1) {
        hoverMenu = message.element.children[1] as HTMLDivElement;
        hoverMenu.classList.add("message-hover-menu");
        if (hoverMenu.children.length > 0) {
          const createThreadButton = hoverMenu.children[0] as HTMLDivElement;
          createThreadButton.classList.add("create-thread-button");
        }
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
      this.ttsControlsModule.autoplaySpeech(utterance); // handle any errors
      this.observeChatMessageElement(
        messageContent || message.element,
        utterance
      );
    }
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

  static decorateAssistantResponse(element: HTMLElement): AssistantResponse {
    const message = new AssistantResponse(element);
    return message;
  }

  async findAndDecorateAssistantResponse(
    searchRoot: Element
  ): Promise<Observation> {
    const obs = ChatHistoryObserver.findAssistantResponse(searchRoot);
    if (obs.found) {
      console.log("Found assistant message", obs.target);
    }
    if (obs.found && obs.isNew && !obs.decorated) {
      const message = ChatHistoryObserver.decorateAssistantResponse(
        obs.target as HTMLElement
      );
      await this.assistantChatMessageAdded(message);
    }
    return Observation.decorated(obs);
  }

  private elementStream: ElementTextStream | null = null;

  observeChatMessageElement(
    message: HTMLElement,
    utterance: SpeechSynthesisUtteranceRemote
  ): void {
    // If we're already observing an element, disconnect from it
    if (this.elementStream) {
      this.elementStream.disconnect();
    }

    // Start observing the new element
    this.elementStream = new ElementTextStream(message);
    let firstChunkTime: number | null = null;

    this.elementStream.getStream().subscribe(
      (text) => {
        if (text.trim()) {
          const currentTime = Date.now();
          if (firstChunkTime === null) {
            firstChunkTime = currentTime;
          }
          const delay = currentTime - (firstChunkTime as number);
          console.log(`${delay}ms, streamed text: "${text}"`);
          this.speechSynthesis.addSpeechToStream(utterance.id, text);
          utterance.text += text;
        }
      },
      (error) => {
        console.error(`Error occurred streaming text from element: ${error}`);
      },
      () => {
        const totalTime = Date.now() - (firstChunkTime as number);
        console.log(`Element text stream complete after ${totalTime}ms`);
        this.speechSynthesis.endSpeechStream(utterance);
      }
    );
  }
}

export { AssistantResponse, ChatHistoryObserver };
