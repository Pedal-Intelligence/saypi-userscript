import { md5 } from "js-md5";
import {
  ElementTextStream,
  InputStreamOptions,
  LateChangeEvent,
  TextContent,
} from "../tts/InputStream";
import { AssistantSpeech, SpeechUtterance } from "../tts/SpeechModel";
import { TTSControlsModule } from "../tts/TTSControlsModule";
import { SpeechSynthesisModule } from "../tts/SpeechSynthesisModule";
import { BillingModule, UtteranceCharge } from "../billing/BillingModule";
import { Observation } from "./Observation";
import { Chatbot } from "../chatbots/Chatbot";
import { PiAIChatbot } from "../chatbots/Pi";
import EventBus from "../events/EventBus";
import { isMobileDevice } from "../UserAgentModule";
import { UserPreferenceModule } from "../prefs/PreferenceModule";
import { SpeechHistoryModule } from "../tts/SpeechHistoryModule";

class PopupMenu {
  private _element: HTMLElement;

  constructor(
    private message: AssistantResponse,
    element: HTMLElement,
    private speech: SpeechUtterance | null,
    private ttsControls: TTSControlsModule
  ) {
    this._element = element;
  }

  get element(): HTMLElement {
    return this._element;
  }

  decorate(): void {
    this._element.classList.add("popup-menu");
    this.ttsControls.addCopyButton(this.message, this._element, true);
    if (this.speech) {
      this.decorateSpeech(this.speech);
    }
  }
  decorateSpeech(speech: SpeechUtterance) {
    this.ttsControls.addSpeechButton(speech, this._element, true);
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

abstract class AssistantResponse {
  private _element: HTMLElement;
  private stable: boolean = false;
  // visible for testing
  static PARAGRAPH_SEPARATOR = ""; // should match ElementInputStream's delimiter argument
  protected includeInitialText = true; // stable text may be called on completed messages, so include the initial text unless streaming
  protected ttsControlsModule: TTSControlsModule;
  protected messageControls: MessageControls;

  abstract get contentSelector(): string;
  abstract createTextStream(
    content: HTMLElement,
    options?: InputStreamOptions
  ): ElementTextStream;
  abstract decorateControls(): MessageControls;

  constructor(element: HTMLElement, includeInitialText = true) {
    this._element = element;
    this.includeInitialText = includeInitialText;
    this.ttsControlsModule = TTSControlsModule.getInstance();
    this.decorate();
    this.messageControls = this.decorateControls();
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
    const wfull = this._element.querySelector(this.contentSelector);
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
              const classNameFromContentSelector =
                this.contentSelector.split(".")[1];
              if (
                addedElement.classList.contains(classNameFromContentSelector)
              ) {
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
    const textStream = this.createTextStream(content, options);
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

  async decorateSpeech(utterance: SpeechUtterance): Promise<void> {
    this.messageControls.decorateSpeech(utterance);
  }

  async decorateIncompleteSpeech(replace: boolean = false): Promise<void> {
    this.messageControls.decorateIncompleteSpeech(replace);
  }

  async decorateCost(charge: UtteranceCharge): Promise<void> {
    this.messageControls.decorateCost(charge);
  }
}

abstract class MessageControls {
  protected hoverMenu: HTMLElement | null; // hover menu is the container for the message controls
  protected messageControlsElement: HTMLElement | null; // message controls is the container for Say, Pi buttons etc.

  constructor(
    protected message: AssistantResponse,
    protected ttsControls: TTSControlsModule
  ) {
    this.hoverMenu = this.messageControlsElement = null; // will be initialized in decorateControls()
    this.decorateControls(message);
  }

  protected getExtraControlClasses(): string[] {
    return [];
  }

  /**
   * Get a CSS selector for the hover menu element, relative to the message element
   */
  abstract getHoverMenuSelector(): string;

  protected async decorateControls(message: AssistantResponse): Promise<void> {
    return new Promise((resolve) => {
      const findAndDecorateHoverMenu = () => {
        let hoverMenu = message.element.querySelector(".message-hover-menu");
        if (!hoverMenu) {
          hoverMenu = message.element.querySelector(
            this.getHoverMenuSelector()
          );
          if (hoverMenu) {
            hoverMenu.classList.add("message-hover-menu");
            // pi-specific thread button (TODO: move to PiAIChatbot)
            if (hoverMenu.children.length > 0) {
              const createThreadButton = hoverMenu
                .children[0] as HTMLDivElement;
              createThreadButton.classList.add("create-thread-button");
            }
          } else {
            console.debug(
              "Hover menu not ready, wait until the message is fully loaded"
            );
            this.watchForHoverMenu(message, findAndDecorateHoverMenu);
            return;
          }
        }

        let msgCtrlsElement = message.element.querySelector(
          ".saypi-tts-controls"
        ) as HTMLDivElement;
        if (!msgCtrlsElement) {
          msgCtrlsElement = document.createElement("div");
          msgCtrlsElement.classList.add(
            "saypi-tts-controls",
            ...this.getExtraControlClasses()
          );
          hoverMenu?.appendChild(msgCtrlsElement);
        }
        this.messageControlsElement = msgCtrlsElement;

        const copyButtonElement =
          msgCtrlsElement.querySelector(".saypi-copy-button");
        if (!copyButtonElement) {
          this.ttsControls.addCopyButton(this.message, msgCtrlsElement);
        }

        resolve();
      };

      findAndDecorateHoverMenu();
    });
  }

  private watchForHoverMenu(
    message: AssistantResponse,
    callback: () => void
  ): void {
    // setup an observer to wait for the hover menu to load
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of [...mutation.addedNodes]) {
          if (node instanceof HTMLElement) {
            const addedElement = node as HTMLElement;
            if (addedElement.querySelector(this.getHoverMenuSelector())) {
              observer.disconnect();
              callback();
              return;
            }
          }
        }
      }
    });
    observer.observe(message.element, { childList: true, subtree: true });
  }

  /**
   * Apply speech to this chat message
   * @param utterance
   */
  async decorateSpeech(utterance: SpeechUtterance): Promise<void> {
    await this.decorateControls(this.message); // ensure message controls are ready

    this.message.element.dataset.utteranceId = utterance.id;
    this.message.element.classList.add("speech-enabled");

    if (!this.messageControlsElement) {
      console.error(
        "Message controls element not found, please call decorateControls() before decorateSpeech()"
      );
      return;
    }

    if (isMobileDevice() && this.hoverMenu) {
      this.watchForPopupMenu(this.hoverMenu as HTMLElement, utterance);
    }
    const speechButtonElement = this.messageControlsElement.querySelector(
      ".saypi-speak-button"
    );
    if (!speechButtonElement) {
      this.ttsControls.addSpeechButton(utterance, this.messageControlsElement);
    }
    this.decorateCost(UtteranceCharge.none); // cost is unknown at this point
    const costElement = this.messageControlsElement.querySelector(
      ".saypi-cost"
    ) as HTMLDivElement | null;
    if (costElement && utterance.voice) {
      this.ttsControls.addPoweredBy(costElement, utterance.voice);
    }
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
                this.message,
                obs.target as HTMLElement,
                speech,
                this.ttsControls
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

  async decorateIncompleteSpeech(replace: boolean = false): Promise<void> {
    this.message.element.classList.add("speech-incomplete");

    const price = await UserPreferenceModule.getInstance()
      .getVoice()
      .then((voice) => {
        if (!voice) {
          return 0;
        }
        return BillingModule.getInstance().quote(voice!, this.message.text);
      });
    const regenButton = this.ttsControls.createGenerateSpeechButton(price);

    const readAloudButton = this.message.element.querySelector(
      ".saypi-speak-button"
    );
    if (readAloudButton && replace) {
      readAloudButton.replaceWith(regenButton);
    } else {
      const messageControlsElement = this.message.element.querySelector(
        ".saypi-tts-controls"
      ) as HTMLDivElement | null;
      if (messageControlsElement) {
        messageControlsElement.appendChild(regenButton);
      }
    }

    // add event listener to regenerate speech
    regenButton.addEventListener("click", async () => {
      regenButton.disabled = true;
      const speechSynthesis = SpeechSynthesisModule.getInstance();
      const speechHistory = SpeechHistoryModule.getInstance();
      speechSynthesis
        .createSpeech(this.message.text, false)
        .then((utterance) => {
          speechSynthesis.speak(utterance);
          this.decorateSpeech(utterance);
          const charge = BillingModule.getInstance().charge(
            utterance,
            this.message.text
          );
          this.decorateCost(charge);
          const speech = new AssistantSpeech(utterance, charge);
          speechHistory.addSpeechToHistory(charge.utteranceHash, speech);
          regenButton.remove();
          this.message.element.classList.remove("speech-incomplete");
        });
    });
  }

  /**
   * Apply a charge to this chat message
   * Can be called multiple times to update the charge
   * @param charge The cost of the speech
   */
  decorateCost(charge: UtteranceCharge): void {
    const ttsControlsElement = this.message.element.querySelector(
      ".saypi-tts-controls"
    ) as HTMLDivElement | null;
    const costElement = this.message.element.querySelector(".saypi-cost");
    if (ttsControlsElement && !costElement) {
      this.ttsControls.addCostBasis(ttsControlsElement, charge);
    } else if (costElement) {
      this.ttsControls.updateCostBasis(
        ttsControlsElement as HTMLElement,
        charge
      );
    }

    const messageContentElement =
      this.message.element.querySelector(".content");
    if (messageContentElement) {
      messageContentElement.id = `saypi-message-content-${this.message.utteranceId}`;
    }

    if (isMobileDevice()) {
      // TODO: we need a way to deregister this listener when the message is removed - perhaps a teardown method?
      EventBus.on(
        "saypi:tts:menuPop",
        (event: { utteranceId: string; menu: PopupMenu }) => {
          const id = this.message.element.dataset.utteranceId;
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
            this.ttsControls.updateCostBasis(menuElement, charge);
          } else {
            this.ttsControls.addCostBasis(menuElement, charge, true);
          }
        }
      );
    }
  }
}

export { AssistantResponse, MessageControls, PopupMenu };
