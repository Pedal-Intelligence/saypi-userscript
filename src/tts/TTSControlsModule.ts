import getMessage from "../i18n";
import { SpeechSynthesisModule } from "./SpeechSynthesisModule";
import volumeIconSVG from "../icons/volume-mid.svg";
import { getResourceUrl } from "../ResourceModule";
import EventBus from "../events/EventBus";
import { UtteranceCharge } from "../billing/BillingModule";
import { SpeechSynthesisVoiceRemote, SpeechUtterance } from "./SpeechModel";

export class TTSControlsModule {
  constructor(private speechSynthesis: SpeechSynthesisModule) {}

  createSpeechButton() {
    const button = document.createElement("button");
    button.type = "button";
    button.classList.add(
      "text-center",
      "hover:bg-neutral-300",
      "saypi-speak-button"
    );
    button.title = getMessage("readAloudButtonTitle");
    button.innerHTML = volumeIconSVG;
    return button;
  }

  addSpeechButton(utterance: SpeechUtterance, container: HTMLElement): void {
    const button = this.createSpeechButton();
    button.addEventListener("click", () => {
      EventBus.emit("saypi:tts:replaying", utterance); //  notify the ui manager that the next speech it hears will be a replay
      this.speechSynthesis.speak(utterance);
    });
    container.appendChild(button);
  }

  /**
   * Add the cost of the TTS stream to the chat message
   * @param container The menu element to add the cost basis to
   * @param characterCount The number of characters in the message
   */
  addCostBasis(
    container: HTMLElement,
    charge: UtteranceCharge
  ): HTMLElement | void {
    const cost = charge.cost;
    if (cost === undefined) {
      // cost should not be undefined, but just in case it is, don't display anything
      return;
    }
    const currency = getMessage("currencyUSDAbbreviation");
    const costElement = document.createElement("div");
    costElement.classList.add("text-sm", "text-neutral-500", "saypi-cost");
    if (cost) {
      costElement.title = getMessage("ttsCostExplanation", [
        cost.toFixed(2),
        currency,
      ]);
    } else {
      costElement.title = getMessage("ttsCostExplanationFree");
      costElement.classList.add("cost-free");
    }

    costElement.innerHTML = `Cost: $<span class="value">${cost.toFixed(
      2
    )}</span>`;
    container.appendChild(costElement);
    return costElement;
  }

  addPoweredBy(container: HTMLElement, voice: SpeechSynthesisVoiceRemote) {
    const poweredByElement = document.createElement("div");
    const ttsEngine = voice.powered_by;
    const ttsLabel = getMessage("ttsPoweredBy", ttsEngine);
    poweredByElement.classList.add(
      "text-sm",
      "text-neutral-500",
      "saypi-powered-by"
    );
    poweredByElement.title = ttsLabel;
    const logoImageExt = ttsEngine === "inflection.ai" ? "png" : "svg"; // can't find a good svg for inflection.ai
    const logoImageUrl = getResourceUrl(
      `icons/logos/${ttsEngine.toLowerCase()}.${logoImageExt}`
    );
    poweredByElement.innerHTML = `<img src="${logoImageUrl}" alt="${ttsLabel}" class="h-4 w-4 inline-block">`;
    container.appendChild(poweredByElement);
  }

  public static updateCostBasis(
    container: HTMLElement,
    charge: UtteranceCharge
  ) {
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
