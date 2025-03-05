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
import { AssistantWritingEvent } from "../dom/MessageEvents";
import { createSVGElement } from "../dom/DOMModule";

export class TTSControlsModule {
  private constructor(private speechSynthesis: SpeechSynthesisModule) {
    this.registerEventListeners();
  }

  private static instance: TTSControlsModule;
  static getInstance(): TTSControlsModule {
    if (!TTSControlsModule.instance) {
      TTSControlsModule.instance = new TTSControlsModule(
        SpeechSynthesisModule.getInstance()
      );
    }
    return TTSControlsModule.instance;
  }

  private registerEventListeners() {
    EventBus.on("saypi:piWriting", (event: AssistantWritingEvent) => {
      this.autoplaySpeech(event.utterance, 200); // wait a beat after starting the input stream before starting the output stream
    });
  }

  constructTextToSpeechControl(classname: string, title: string, icon: string) {
    const button = document.createElement("button");
    button.type = "button";
    button.classList.add(
      "text-center",
      "saypi-button",
      "tooltip",
      "tts-item",
      classname
    );
    button.setAttribute("aria-label", title);
    button.appendChild(createSVGElement(icon));
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

  createGenerateSpeechButton(price?: number, currency = "credits") {
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
      "tts-item",
      classname
    );
    button.setAttribute("title", title);
    button.innerText = title;
    button.appendChild(createSVGElement(icon));
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
    insertBefore?: Element | null,
    containerIsMenu: boolean = false
  ): void {
    const button = containerIsMenu
      ? this.createSpeechButtonForMenu()
      : this.createSpeechButton();
    button.addEventListener("click", () => {
      EventBus.emit("saypi:tts:replaying", utterance); //  notify the ui manager that the next speech it hears will be a replay
      this.speechSynthesis.speak(utterance);
    });
    if (insertBefore) {
      container.insertBefore(button, insertBefore);
    } else {
      container.appendChild(button);
    }
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
        const originalAriaLabel = button.getAttribute("ariaLabel") || getMessage("copyButtonTitle");
        button.setAttribute("aria-label", getMessage("copiedButtonTitle"));
        button.replaceChild( createSVGElement(copiedIconSVG), button.childNodes[0]);
        button.disabled = true;
        // reset after a few seconds
        setTimeout(() => {
          button.setAttribute("aria-label", originalAriaLabel);
          button.replaceChild( createSVGElement(copyIconSVG), button.childNodes[0]);
          button.disabled = false;
        }, 2500);
      }
    });
    container.appendChild(button);
  }

  createCostElementForMenu(): HTMLElement {
    const costElement = document.createElement("button");
    costElement.classList.add("saypi-cost", "tooltip");
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
    costElement.classList.add("saypi-cost", "tooltip", "tooltip-wide");
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
    const costBasisContainer = document.createElement("div");
    costBasisContainer.classList.add("saypi-cost-container", "tts-item");

    const currency = getMessage("currencyUSDAbbreviation");
    const costElement = containerIsMenu
      ? this.createCostElementForMenu()
      : this.createCostElementForMessage();
    let chargeExplanation;
    if (cost) {
      chargeExplanation = getMessage("ttsCostExplanation", [
        cost.toFixed(2),
        currency,
        "Say, Pi", // provider name
      ]);
    } else {
      chargeExplanation = getMessage("ttsCostExplanationFree");
      costElement.classList.add("cost-free");
    }
    costElement.setAttribute("aria-label", chargeExplanation);
    costElement.replaceChildren(this.createPriceSpan(cost));
    const verticalSpacer = document.createElement("div");
    verticalSpacer.classList.add("vertical-separator");
    // insert as first child of cost element
    costElement.insertBefore(verticalSpacer, costElement.firstChild);
    costBasisContainer.appendChild(costElement);
    container.appendChild(costBasisContainer);

    // add a link to the pricing page
    const pricingLink = document.createElement("a");
    pricingLink.href = "https://www.saypi.ai/pricing";
    pricingLink.target = "_blank";
    pricingLink.classList.add("saypi-pricing-link", "tooltip", "tts-item");
    const tooltipText = getMessage("ttsCostExplanationSayPi", ["Say, Pi"]);
    pricingLink.setAttribute("aria-label", tooltipText);
    const providerLogo = document.createElement("img");
    providerLogo.classList.add("flair", "audio-provider", "saypi-logo");
    providerLogo.src = getResourceUrl("icons/logos/saypi.png");
    providerLogo.alt = "Say, Pi logo";
    pricingLink.appendChild(providerLogo);
    costBasisContainer.appendChild(pricingLink);

    return costBasisContainer;
  }

  createPriceSpan(cost: number): HTMLSpanElement {
    const priceSpan = document.createElement("span");
    priceSpan.classList.add("price");
    const valueSpan = document.createElement("span");
    valueSpan.classList.add("value");
    valueSpan.innerText = cost.toFixed(2);
    priceSpan.appendChild(valueSpan);
    
    // Add credits label
    if (cost > 0) {
      const currencySpan = document.createElement("span");
      currencySpan.classList.add("currency-label");
      currencySpan.innerText = " " + getMessage("currencyUSDAbbreviation");
      priceSpan.appendChild(currencySpan);
    }
    
    return priceSpan;
  }

  addPoweredBy(
    container: HTMLElement,
    voice: SpeechSynthesisVoiceRemote,
    insertBefore?: Element | null
  ) {
    let poweredByElement = container.querySelector(
      ".saypi-powered-by"
    ) as HTMLElement | null;
    if (poweredByElement) {
      return;
    }
    poweredByElement = document.createElement("div");
    const ttsEngine = voice.powered_by;
    const ttsLabel = getMessage("ttsPoweredBy", ttsEngine);
    poweredByElement.classList.add(
      "saypi-powered-by",
      "tooltip",
      "tts-item",
      "tooltip-wide"
    );
    poweredByElement.setAttribute("aria-label", ttsLabel);
    poweredByElement.appendChild(this.createTtsLogo(ttsEngine));
    if (insertBefore) {
      container.insertBefore(poweredByElement, insertBefore);
    } else {
      container.appendChild(poweredByElement);
    }
  }

  createTtsLogo(ttsEngine : string) {
    const logo = document.createElement("img");
    const logoImageExt = ttsEngine === "inflection.ai" ? "png" : "svg"; // can't find a good svg for inflection.ai
    const logoImageUrl = getResourceUrl(
      `icons/logos/${ttsEngine.toLowerCase()}.${logoImageExt}`
    );
    logo.setAttribute("src", logoImageUrl);
    logo.classList.add("h-4", "w-4", "inline-block");
    return logo;
  }

  public updateCostBasis(container: HTMLElement, charge: UtteranceCharge) {
    const costElement = container.querySelector(
      ".saypi-cost"
    ) as HTMLElement | null;
    if (costElement) {
      const valueElement = costElement.querySelector(".value") as HTMLElement;
      valueElement.textContent = charge.cost.toFixed(2);
      if (charge.cost) {
        const currency = getMessage("currencyUSDAbbreviation");
        costElement.setAttribute(
          "aria-label",
          getMessage("ttsCostExplanation", [charge.cost.toFixed(2), currency, "Say, Pi"])
        );
        costElement.classList.remove("cost-free");
        
        // Update or add currency label
        let currencyLabel = costElement.querySelector(".currency-label");
        if (!currencyLabel) {
          currencyLabel = document.createElement("span");
          currencyLabel.classList.add("currency-label");
          valueElement.parentNode?.appendChild(currencyLabel);
        }
        currencyLabel.textContent = " " + currency;
      } else {
        costElement.setAttribute(
          "aria-label",
          getMessage("ttsCostExplanationFree")
        );
        costElement.classList.add("cost-free");
      }
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
