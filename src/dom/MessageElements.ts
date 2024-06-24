import { md5 } from "js-md5";
import { ElementTextStream, TextContent } from "../tts/InputStream";
import { SpeechUtterance } from "../tts/SpeechModel";
import { TTSControlsModule } from "../tts/TTSControlsModule";
import { SpeechSynthesisModule } from "../tts/SpeechSynthesisModule";
import { UtteranceCharge } from "../billing/BillingModule";
import { Observation } from "./Observation";
import { Chatbot } from "../chatbots/Chatbot";
import { PiAIChatbot } from "../chatbots/Pi";
import EventBus from "../events/EventBus";
import { isMobileDevice } from "../UserAgentModule";

class PopupMenu {
  private _element: HTMLElement;

  constructor(
    element: HTMLElement,
    private speech: SpeechUtterance,
    private ttsControls: TTSControlsModule
  ) {
    this._element = element;
  }

  get element(): HTMLElement {
    return this._element;
  }

  decorate(): void {
    this._element.classList.add("popup-menu");
    this.ttsControls.addSpeechButton(this.speech, this._element, true);
  }

  static find(chatbot: Chatbot, searchRoot: HTMLElement): Observation {
    let popupMenu = searchRoot.querySelector(".popup-menu");
    if (popupMenu) {
      return Observation.foundAlreadyDecorated(".popup-menu", popupMenu);
    }
    popupMenu = searchRoot.querySelector(".shadow-input") as HTMLElement | null; // TODO: generalize with Chatbot parameter
    if (popupMenu) {
      return Observation.foundUndecorated(".popup-menu", popupMenu);
    }
    return Observation.notFound(".popup-menu");
  }
}

class AssistantResponse {
  private _element: HTMLElement;
  private stable: boolean = false;
  // visible for testing
  static PARAGRAPH_SEPARATOR = ""; // should match ElementInputStream's delimiter argument
  protected includeInitialText = true; // stable text may be called on completed messages, so include the initial text unless streaming
  protected ttsControlsModule: TTSControlsModule;

  constructor(element: HTMLElement, includeInitialText = true) {
    this._element = element;
    this.includeInitialText = includeInitialText;
    this.ttsControlsModule = new TTSControlsModule(
      SpeechSynthesisModule.getInstance()
    );
    this.decorate();
  }

  private async decorate(): Promise<void> {
    this._element.classList.add("chat-message", "assistant-message");
    await this.decoratedContent();
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
      return textContent.replace(/\n/g, AssistantResponse.PARAGRAPH_SEPARATOR);
    }
    return "";
  }

  /**
   * Get the final text content of the chat message
   * This method waits for the text content to be completely loaded
   */
  async stableText(): Promise<string> {
    if (this.stable) {
      return this.text;
    }
    const content = await this.decoratedContent();
    const options = { includeInitialText: this.includeInitialText };
    const textStream = new ElementTextStream(content, options);
    return new Promise((resolve) => {
      textStream.getStream().subscribe({
        complete: () => {
          this.stable = true;
          resolve(this.text);
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

  private watchForPopupMenu(
    hoverMenu: HTMLElement,
    speech: SpeechUtterance
  ): void {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of [...mutation.addedNodes]) {
          if (node instanceof HTMLElement) {
            const addedElement = node as HTMLElement;
            const obs = PopupMenu.find(new PiAIChatbot(), addedElement);
            if (obs.found && !obs.decorated) {
              const popupMenu = new PopupMenu(
                obs.target as HTMLElement,
                speech,
                this.ttsControlsModule
              );
              popupMenu.decorate();
              EventBus.emit("saypi:tts:menuPop", {
                utteranceId: speech.id,
                menu: popupMenu,
              });
            }
          }
        }
      }
    });
    observer.observe(hoverMenu, { childList: true, subtree: false });
  }

  /**
   * Apply speech to this chat message
   * @param utterance
   */
  decorateSpeech(utterance: SpeechUtterance): void {
    this._element.dataset.utteranceId = utterance.id;
    this._element.classList.add("speech-enabled");

    let hoverMenu = this.element.querySelector(".message-hover-menu");
    if (!hoverMenu) {
      if (this.element.children.length > 1) {
        hoverMenu = this.element.children[1] as HTMLDivElement;
        hoverMenu.classList.add("message-hover-menu");
        if (hoverMenu.children.length > 0) {
          const createThreadButton = hoverMenu.children[0] as HTMLDivElement;
          createThreadButton.classList.add("create-thread-button");
        }
      }
    }
    if (isMobileDevice() && hoverMenu) {
      this.watchForPopupMenu(hoverMenu as HTMLElement, utterance);
    }
    let ttsControlsElement = this.element.querySelector(
      ".saypi-tts-controls"
    ) as HTMLDivElement;
    if (!ttsControlsElement) {
      ttsControlsElement = document.createElement("div");
      ttsControlsElement.id = `saypi-tts-controls-${utterance.id}`;
      ttsControlsElement.classList.add("saypi-tts-controls", "pt-4");
      hoverMenu?.appendChild(ttsControlsElement);
    }
    const speechButtonElement = ttsControlsElement.querySelector(
      ".saypi-speak-button"
    );
    if (!speechButtonElement) {
      this.ttsControlsModule.addSpeechButton(utterance, ttsControlsElement);
    }
    this.decorateCost(UtteranceCharge.none); // cost is unknown at this point
    const costElement = ttsControlsElement.querySelector(
      ".saypi-cost"
    ) as HTMLDivElement | null;
    if (costElement && utterance.voice) {
      this.ttsControlsModule.addPoweredBy(costElement, utterance.voice);
    }
  }

  /**
   * Apply a charge to this chat message
   * Can be called multiple times to update the charge
   * @param charge The cost of the speech
   */
  decorateCost(charge: UtteranceCharge): void {
    const ttsControlsElement = this.element.querySelector(
      ".saypi-tts-controls"
    ) as HTMLDivElement | null;
    const costElement = this.element.querySelector(".saypi-cost");
    if (ttsControlsElement && !costElement) {
      this.ttsControlsModule.addCostBasis(ttsControlsElement, charge);
    } else if (costElement) {
      this.ttsControlsModule.updateCostBasis(
        ttsControlsElement as HTMLElement,
        charge
      );
    }

    const messageContentElement = this.element.querySelector(".content");
    if (messageContentElement) {
      messageContentElement.id = `saypi-message-content-${this.utteranceId}`;
    }

    if (isMobileDevice()) {
      // TODO: we need a way to deregister this listener when the message is removed - perhaps a teardown method?
      EventBus.on(
        "saypi:tts:menuPop",
        (event: { utteranceId: string; menu: PopupMenu }) => {
          const id = this._element.dataset.utteranceId;
          if (
            !id ||
            id !== event.utteranceId ||
            id !== charge.utteranceId ||
            !charge.cost
          ) {
            return;
          }
          const menuElement = event.menu.element;
          const menuCostElement = menuElement.querySelector(".saypi-cost");
          if (menuCostElement) {
            this.ttsControlsModule.updateCostBasis(menuElement, charge);
          } else {
            this.ttsControlsModule.addCostBasis(menuElement, charge, true);
          }
        }
      );
    }
  }
}

export { AssistantResponse };
