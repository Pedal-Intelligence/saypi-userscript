import getMessage from "../i18n";
import { SpeechSynthesisModule } from "./SpeechSynthesisModule";
import volumeIconSVG from "../icons/volume-mid.svg";
import copyIconSVG from "../icons/copy.svg";
import copiedIconSVG from "../icons/copied.svg";
import regenerateIconSVG from "../icons/regenerate.svg";
import { getResourceUrl } from "../ResourceModule";
import EventBus from "../events/EventBus";
import { UtteranceCharge } from "../billing/BillingModule";
import { SpeechSynthesisVoiceRemote, SpeechUtterance } from "./SpeechModel";
import { AssistantResponse } from "../dom/MessageElements";

export class TTSControlsModule {
  constructor(private speechSynthesis: SpeechSynthesisModule) {}

  constructTextToSpeechControl(classname: string, title: string, icon: string) {
    const button = document.createElement("button");
    button.type = "button";
    button.classList.add("text-center", "saypi-button", "tooltip", classname);
    button.setAttribute("aria-label", title);
    button.innerHTML = icon;
    return button;
  }

  /**
   * A speech button that can be used among chat message controls
   * @returns A button element that can be used to replay the last utterance
   */
  createSpeechButton() {
    // use createTTSCtrlButton to create a button with the correct classes
    const button = this.constructTextToSpeechControl(
      "saypi-speak-button",
      getMessage("readAloudButtonTitle"),
      volumeIconSVG
    );
    return button;
  }

  createGenerateSpeechButton(price?: number, currency = "USD") {
    const message = price
      ? getMessage("regenerateButtonTitle", [price.toFixed(2), currency])
      : getMessage("regenerateButtonTitleFree");
    const button = this.constructTextToSpeechControl(
      "saypi-regenerate-button",
      message,
      regenerateIconSVG
    );
    return button;
  }

  createCopyButton() {
    const button = this.constructTextToSpeechControl(
      "saypi-copy-button",
      getMessage("copyButtonTitle"),
      copyIconSVG
    );
    return button;
  }

  constructTextToSpeechControlForMenu(
    classname: string,
    title: string,
    icon: string
  ) {
    const button = document.createElement("button");
    button.type = "button";
    button.classList.add(
      "flex",
      "h-12",
      "w-full",
      "items-center",
      "justify-between",
      "rounded",
      "px-2.5",
      "hover:bg-neutral-50-hover",
      "active:bg-neutral-50-tap",
      "active:text-primary-700",
      "saypi-button",
      "tooltip",
      classname
    );
    button.setAttribute("title", title);
    button.innerHTML = title + icon;
    return button;
  }

  /**
   * A speech button that can be used in a menu on a mobile device
   * @returns A button element that can be used to replay the last utterance
   */
  createSpeechButtonForMenu() {
    // use createTTSCtrlButton to create a button with the correct classes
    const button = this.constructTextToSpeechControlForMenu(
      "saypi-speak-button",
      getMessage("readAloudButtonTitle"),
      volumeIconSVG
    );
    return button;
  }

  createCopyButtonForMenu() {
    const button = this.constructTextToSpeechControlForMenu(
      "saypi-copy-button",
      getMessage("copyButtonTitle"),
      copyIconSVG
    );
    return button;
  }

  addSpeechButton(
    utterance: SpeechUtterance,
    container: HTMLElement,
    containerIsMenu: boolean = false
  ): void {
    const button = containerIsMenu
      ? this.createSpeechButtonForMenu()
      : this.createSpeechButton();
    button.addEventListener("click", () => {
      EventBus.emit("saypi:tts:replaying", utterance); //  notify the ui manager that the next speech it hears will be a replay
      this.speechSynthesis.speak(utterance);
    });
    container.appendChild(button);
  }

  addCopyButton(
    message: AssistantResponse,
    container: HTMLElement,
    containerIsMenu: boolean = false
  ): void {
    const button = containerIsMenu
      ? this.createCopyButtonForMenu()
      : this.createCopyButton();
    button.addEventListener("click", () => {
      navigator.clipboard.writeText(message.text);
      if (!containerIsMenu) {
        const originalAriaLabel =
          button.getAttribute("ariaLabel") || getMessage("copyButtonTitle");
        const originalInnerHtml = button.innerHTML;
        button.setAttribute("aria-label", getMessage("copiedButtonTitle"));
        button.innerHTML = copiedIconSVG;
        button.disabled = true;
        // reset after a few seconds
        setTimeout(() => {
          button.setAttribute("aria-label", originalAriaLabel);
          button.innerHTML = originalInnerHtml;
          button.disabled = false;
        }, 2500);
      }
    });
    container.appendChild(button);
  }

  createCostElementForMenu(): HTMLElement {
    const costElement = document.createElement("button");
    costElement.classList.add("saypi-cost");
    costElement.classList.add(
      "flex",
      "h-12",
      "w-full",
      "items-center",
      "justify-between",
      "rounded",
      "px-2.5",
      "hover:bg-neutral-50-hover",
      "active:bg-neutral-50-tap",
      "active:text-primary-700"
    );
    return costElement;
  }

  createCostElementForMessage() {
    const costElement = document.createElement("span");
    costElement.classList.add("saypi-cost");
    return costElement;
  }

  /**
   * Add the cost of the TTS stream to the chat message
   * @param container The menu element to add the cost basis to
   * @param characterCount The number of characters in the message
   */
  addCostBasis(
    container: HTMLElement,
    charge: UtteranceCharge,
    containerIsMenu: boolean = false
  ): HTMLElement | void {
    const cost = charge.cost;
    if (cost === undefined) {
      // cost should not be undefined, but just in case it is, don't display anything
      return;
    }
    const currency = getMessage("currencyUSDAbbreviation");
    const costElement = containerIsMenu
      ? this.createCostElementForMenu()
      : this.createCostElementForMessage();
    if (cost) {
      costElement.title = getMessage("ttsCostExplanation", [
        cost.toFixed(2),
        currency,
      ]);
    } else {
      costElement.title = getMessage("ttsCostExplanationFree");
      costElement.classList.add("cost-free");
    }

    costElement.innerHTML = `Cost: <span class="price">$<span class="value">${cost.toFixed(
      2
    )}</span></span>`;
    container.appendChild(costElement);
    return costElement;
  }

  addPoweredBy(container: HTMLElement, voice: SpeechSynthesisVoiceRemote) {
    let poweredByElement = container.querySelector(
      ".saypi-powered-by"
    ) as HTMLElement | null;
    if (poweredByElement) {
      return;
    }
    poweredByElement = document.createElement("div");
    const ttsEngine = voice.powered_by;
    const ttsLabel = getMessage("ttsPoweredBy", ttsEngine);
    poweredByElement.classList.add("saypi-powered-by", "tooltip");
    poweredByElement.setAttribute("aria-label", ttsLabel);
    const logoImageExt = ttsEngine === "inflection.ai" ? "png" : "svg"; // can't find a good svg for inflection.ai
    const logoImageUrl = getResourceUrl(
      `icons/logos/${ttsEngine.toLowerCase()}.${logoImageExt}`
    );
    poweredByElement.innerHTML = `<img src="${logoImageUrl}" class="h-4 w-4 inline-block">`;
    container.appendChild(poweredByElement);
  }

  public updateCostBasis(container: HTMLElement, charge: UtteranceCharge) {
    const costElement = container.querySelector(
      ".saypi-cost .value"
    ) as HTMLElement | null;
    if (costElement) {
      costElement.textContent = charge.cost.toFixed(2);
      const currency = getMessage("currencyUSDAbbreviation");
      costElement.title = getMessage("ttsCostExplanation", [
        charge.cost.toFixed(2),
        currency,
      ]);
    }
  }

  /**
   * Start streaming the utterance's audio output immediately
   * @param utterance The utterance to stream
   * @param delayMs The number of milliseconds to wait before starting the stream
   */
  autoplaySpeech(utterance: SpeechUtterance, delayMs = 0) {
    // wait a beat, then start streaming the utterance
    setTimeout(() => {
      this.speechSynthesis.speak(utterance);
    }, delayMs);
  }
}
