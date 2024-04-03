import { ElementTextStream } from "../tts/InputStream";
import {
  SpeechSynthesisModule,
  SpeechSynthesisUtteranceRemote,
} from "../tts/SpeechSynthesisModule";
import { TTSControlsModule } from "../tts/TTSControlsModule";
import { Observation } from "./Observation";

class AssistantResponse {
  private _element: HTMLElement;
  private utteranceId: string | null = null;

  constructor(element: HTMLElement) {
    this._element = element;
    element.classList.add("chat-message", "assistant-message");
  }

  get text(): string {
    return this._element.innerText;
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

export class ChatHistoryObserver extends BaseObserver {
  private speechSynthesis: SpeechSynthesisModule;
  private ttsControlsModule: TTSControlsModule;
  constructor(selector: string, speechSynthesis: SpeechSynthesisModule) {
    super(selector);
    this.speechSynthesis = speechSynthesis;
    this.ttsControlsModule = new TTSControlsModule(speechSynthesis);
  }
  protected callback(mutations: MutationRecord[]): void {
    mutations.forEach((mutation) => {
      [...mutation.addedNodes]
        .filter((node) => node instanceof Element)
        .forEach((node) => {
          const addedElement = node as Element;
          const responseObs =
            this.findAndDecorateAssistantResponse(addedElement);
          if (responseObs.isReady()) {
            // only expecting new chat message at a time, so
            // skip this mutation if the chat message is already decorated
            return;
          }
        });
    });
  }

  // Chat history and automatic speech functionality
  assistantChatMessageAdded(message: AssistantResponse): void {
    const speechSynthesis = SpeechSynthesisModule.getInstance();
    speechSynthesis.isEnabled().then((isEnabled) => {
      if (isEnabled) {
        speechSynthesis.createSpeechStream().then((utterance) => {
          message.enableTTS(utterance.id);
          console.log("Created audio stream", utterance.id);
          const initialText = message.text;
          // send the initial text to the stream only if it's not empty
          if (initialText.trim()) {
            console.log(`Streaming text began with "${initialText}"`);
            speechSynthesis.addSpeechToStream(utterance.id, initialText);
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
              const createThreadButton = hoverMenu
                .children[0] as HTMLDivElement;
              createThreadButton.classList.add("create-thread-button");
            }
            ttsControlsElement = document.createElement("div");
            ttsControlsElement.id = `saypi-tts-controls-${utterance.id}`;
            ttsControlsElement.classList.add("saypi-tts-controls", "pt-4");
            hoverMenu.appendChild(ttsControlsElement);
            this.ttsControlsModule.addSpeechButton(
              utterance,
              ttsControlsElement
            );
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
        });
      }
    });
  }

  findAssistantResponse(searchRoot: Element): Observation {
    const query = "div.break-anywhere:not(.justify-end)"; // TODO: -> this.chatbot.getAssistantResponseSelector();
    const aiMessage = searchRoot.querySelector(query);
    if (aiMessage) {
      return Observation.notDecorated(aiMessage.id, aiMessage);
    }
    return Observation.notFound("");
  }

  decorateAssistantResponse(element: HTMLElement): AssistantResponse {
    const message = new AssistantResponse(element);
    return message;
  }

  findAndDecorateAssistantResponse(searchRoot: Element): Observation {
    const obs = this.findAssistantResponse(searchRoot);
    if (obs.found && obs.isNew && !obs.decorated) {
      const message = this.decorateAssistantResponse(obs.target as HTMLElement);
      this.assistantChatMessageAdded(message);
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

    const speechSynthesis = SpeechSynthesisModule.getInstance();
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
          speechSynthesis.addSpeechToStream(utterance.id, text);
          utterance.text += text;
        }
      },
      (error) => {
        console.error(`Error occurred streaming text from element: ${error}`);
      },
      () => {
        const totalTime = Date.now() - (firstChunkTime as number);
        console.log(`Element text stream complete after ${totalTime}ms`);
        speechSynthesis.endSpeechStream(utterance);
      }
    );
  }
}
