import { getResourceUrl } from "../ResourceModule";
import { Chatbot } from "../chatbots/Chatbot";
import { getMostRecentAssistantMessage } from "../dom/ChatHistory";
import { Observation } from "../dom/Observation";
import EventBus from "../events/EventBus";
import getMessage from "../i18n";
import { UserPreferenceModule } from "../prefs/PreferenceModule";
import { audioProviders, SpeechSynthesisVoiceRemote } from "./SpeechModel";
import { SpeechSynthesisModule } from "./SpeechSynthesisModule";
import waveformSvgContent from "../icons/wave.svg";
import chevronSvgContent from "../icons/claude-chevron.svg";
import { add } from "lodash";

export abstract class VoiceSelector {
  protected chatbot: Chatbot;
  protected userPreferences: UserPreferenceModule;
  protected element: HTMLElement;
  protected selectedVoiceButton: HTMLButtonElement | null = null;

  constructor(
    chatbot: Chatbot,
    userPreferences: UserPreferenceModule,
    element: HTMLElement
  ) {
    this.chatbot = chatbot;
    this.userPreferences = userPreferences;
    this.element = element;
  }

  abstract getId(): string;
  abstract getButtonClasses(): string[];

  // Voice selection management
  registerVoiceChangeHandler(menu: HTMLElement): boolean {
    const voiceButtons = Array.from(menu.querySelectorAll("button"));
    if (!voiceButtons || voiceButtons.length === 0) {
      return false;
    }
    const builtInPiVoiceButtons = voiceButtons.filter((button) =>
      this.isBuiltInVoiceButton(button)
    );
    builtInPiVoiceButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.userPreferences.unsetVoice().then(() => {
          if (this.selectedVoiceButton) {
            this.unmarkButtonAsSelectedVoice(this.selectedVoiceButton);
          }
          this.markButtonAsSelectedVoice(button);
        });
      });
    });
    return true;
  }
  protected addIdVoiceMenu(element: HTMLElement): void {
    element.id = this.getId();
  }
  protected markButtonAsSelectedVoice(button: HTMLButtonElement): void {
    button.disabled = true;
    button.classList.add("selected", "bg-neutral-300", "text-primary-700");
    button.classList.remove("hover:bg-neutral-300");

    if (this.selectedVoiceButton) {
      this.unmarkButtonAsSelectedVoice(this.selectedVoiceButton);
    }
    this.selectedVoiceButton = button;
  }

  protected unmarkButtonAsSelectedVoice(button: HTMLButtonElement): void {
    button.disabled = false;
    button.classList.remove("selected", "bg-neutral-300", "text-primary-700");
    button.classList.add("hover:bg-neutral-300", "border-neutral-500");
    button.setAttribute("style", ""); // remove inline styles from builtin voice buttons on voice settings page
  }

  protected isBuiltInVoiceButton(button: HTMLButtonElement): boolean {
    return !button.classList.contains("saypi-custom-voice");
  }

  addVoicesToSelector(voiceSelector: HTMLElement): void {
    const speechSynthesis = SpeechSynthesisModule.getInstance();
    speechSynthesis.getVoices().then((voices) => {
      this.populateVoices(voices, voiceSelector);
    });
  }

  populateVoices(
    voices: SpeechSynthesisVoiceRemote[],
    voiceSelector: HTMLElement
  ): boolean {
    if (!voices || voices.length === 0) {
      console.log("No voices found");
      return false;
    }

    const customVoiceButtons = Array(voices.length);

    voices.forEach((voice) => {
      // if not already in the menu, add the voice
      if (voiceSelector.querySelector(`button[data-voice-id="${voice.id}"]`)) {
        // voice already in menu, skip to next voice
        return;
      }
      const button = document.createElement("button");
      // template: <button type="button" class="mb-1 rounded px-2 py-3 text-center hover:bg-neutral-300">Pi 6</button>
      button.type = "button";
      const additionalClasses = ["saypi-voice-button", "saypi-custom-voice"];
      const combinedClasses = [
        ...this.getButtonClasses(),
        ...additionalClasses,
        voice.name.toLowerCase().replace(" ", "-"),
      ];
      button.classList.add(...combinedClasses);
      const name = document.createElement("span");
      name.classList.add("voice-name");
      name.innerText = voice.name;
      button.appendChild(name);
      const flair = document.createElement("img");
      flair.classList.add("flair");
      flair.src = getResourceUrl("icons/logos/saypi.png");
      flair.alt = "Say, Pi logo";
      flair.title = getMessage("enhancedVoice", ["Say, Pi"]);
      button.appendChild(flair);
      button.addEventListener("click", () => {
        this.userPreferences.setVoice(voice).then(() => {
          console.log(`Selected voice: ${voice.name}`);
          customVoiceButtons.forEach((button) => {
            this.unmarkButtonAsSelectedVoice(button);
          });
          const voiceButtons = voiceSelector.querySelectorAll("button");
          voiceButtons.forEach((button) => {
            if (this.isBuiltInVoiceButton(button as HTMLButtonElement)) {
              this.unmarkButtonAsSelectedVoice(button as HTMLButtonElement);
            }
          });
          this.markButtonAsSelectedVoice(button);
          this.introduceVoice(voice);
        });
      });
      button.dataset.voiceId = voice.id;
      customVoiceButtons.push(button);
    });

    customVoiceButtons.reverse().forEach((button) => {
      voiceSelector.insertBefore(button, voiceSelector.firstChild);
    });

    return true;
  }

  introduceVoice(voice: SpeechSynthesisVoiceRemote): void {
    const lastMessage = getMostRecentAssistantMessage(this.chatbot);
    const name = voice.name.toLowerCase().replace(" ", "_");
    const introduction =
      lastMessage?.text || getMessage(`voiceIntroduction_${name}`);
    const speechSynthesis = SpeechSynthesisModule.getInstance();
    const notEnglish = "";
    speechSynthesis
      .createSpeech(introduction, false, notEnglish)
      .then((utterance) => {
        utterance.voice = voice;
        speechSynthesis.speak(utterance);
      });
  }

  // Listen for additions of custom voice buttons and update selections
  addVoiceButtonAdditionListener(voiceMenu: HTMLElement): void {
    const observerCallback = (
      mutationsList: MutationRecord[],
      observer: MutationObserver
    ) => {
      for (let mutation of mutationsList) {
        if (mutation.type === "childList") {
          for (let node of mutation.addedNodes) {
            if (
              node.nodeName === "BUTTON" &&
              node instanceof HTMLButtonElement
            ) {
              const button = node as HTMLButtonElement;
              this.handleButtonAddition(button);
            }
          }
        }
      }
    };
    const observer = new MutationObserver(observerCallback);
    observer.observe(voiceMenu, { childList: true });
  }

  handleButtonAddition(button: HTMLButtonElement): void {
    // a voice button was added to the menu that is not a custom voice button
    // if a voice is selected, mark the button as selected
    this.userPreferences.getVoice().then((voice) => {
      const customVoiceIsSelected = voice !== null;
      if (customVoiceIsSelected) {
        if (this.isBuiltInVoiceButton(button)) {
          this.unmarkButtonAsSelectedVoice(button);
        } else if (button.dataset.voiceId === voice.id) {
          // unmark all other buttons and mark this one as selected
          const voiceButtons = Array.from(
            this.element.querySelectorAll("button")
          );
          voiceButtons.forEach((btn) => {
            this.unmarkButtonAsSelectedVoice(btn as HTMLButtonElement);
          });
          this.markButtonAsSelectedVoice(button);
        }
      }
    });
  }
}

export class PiVoiceMenu extends VoiceSelector {
  constructor(
    chatbot: Chatbot,
    userPreferences: UserPreferenceModule,
    element: HTMLElement
  ) {
    super(chatbot, userPreferences, element);

    this.addIdVoiceMenu(element);
    this.restyleVoiceMenuControls(element);
    this.addVoiceMenuExpansionListener();
    this.addVoiceButtonAdditionListener(element);
  }

  getId(): string {
    return "saypi-voice-menu";
  }

  getButtonClasses(): string[] {
    return [
      "mb-1",
      "rounded",
      "px-2",
      "py-3",
      "text-center",
      "hover:bg-neutral-300",
    ];
  }

  restyleVoiceMenuControls(voiceMenu: HTMLElement): Observation {
    let obs: Observation;
    const voiceMenuControls = voiceMenu.nextSibling;
    if (!voiceMenuControls || !(voiceMenuControls instanceof HTMLElement)) {
      obs = Observation.notFound("saypi-voice-menu-controls");
      return obs;
    }
    voiceMenuControls.id = "saypi-voice-menu-controls";
    obs = Observation.foundUndecorated(
      "saypi-voice-menu-controls",
      voiceMenuControls
    );

    // add a class to the voice menu controls if the user has selected a SayPi voice
    let voiceProvidedBySayPi = false;
    this.userPreferences.hasVoice().then((hasVoice) => {
      if (hasVoice) {
        voiceMenuControls.classList.add("saypi-provided-voice");
        voiceProvidedBySayPi = true;
      }
    });
    EventBus.on("userPreferenceChanged", (detail) => {
      if (detail.audioProvider) {
        if (detail.audioProvider === audioProviders.SayPi) {
          voiceMenuControls.classList.add("saypi-provided-voice");
          voiceProvidedBySayPi = true;
        } else {
          voiceMenuControls.classList.remove("saypi-provided-voice");
          voiceProvidedBySayPi = false;
        }
      }
    });

    const observer = new MutationObserver((mutationsList) => {
      for (let mutation of mutationsList) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class" &&
          voiceMenuControls.classList.contains("self-end")
        ) {
          voiceMenuControls.classList.remove("self-end");
        }
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "style"
        ) {
          // menu has changed between a circle and a rectangle (border-radius style), as happens when audio is toggled on pi.ai
          if (voiceProvidedBySayPi) {
            voiceMenuControls.classList.add("saypi-provided-voice");
          }
        }
      }
    });

    observer.observe(voiceMenuControls, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });
    return Observation.foundAndDecorated(obs);
  }

  addVoiceMenuExpansionListener(): Observation {
    const audioControlsContainer = document.getElementById(
      "saypi-audio-controls"
    );
    const voiceMenu = document.getElementById(this.getId());

    if (!audioControlsContainer || !voiceMenu) {
      return Observation.notFound("saypi-audio-controls");
    }
    let foundAudioCtrls = Observation.foundUndecorated(
      "saypi-audio-controls",
      audioControlsContainer
    );

    const observerCallback = async (
      mutationsList: MutationRecord[],
      observer: MutationObserver
    ) => {
      for (let mutation of mutationsList) {
        if (mutation.type === "childList") {
          for (let node of mutation.addedNodes) {
            // the addition of a button with an aria-label giving instructions to "close the menu", indicates the voice menu is expanded
            if (
              node instanceof HTMLElement &&
              node.nodeName === "BUTTON" &&
              node.getAttribute("aria-label") &&
              node === audioControlsContainer.firstChild
            ) {
              voiceMenu.classList.add("expanded");
              // mark the selected voice each time the menu is expanded (because pi.ai recreates the menu each time)
              this.userPreferences.getTextToSpeechEnabled().then((enabled) => {
                if (enabled) this.addVoicesToSelector(voiceMenu);
              });
              this.registerVoiceChangeHandler(voiceMenu);
            }
          }
          for (let node of mutation.removedNodes) {
            if (
              node instanceof HTMLElement &&
              node.nodeName === "BUTTON" &&
              node.getAttribute("aria-label")
            ) {
              voiceMenu.classList.remove("expanded");
              return;
            }
          }
        }
      }
    };

    const observer = new MutationObserver(observerCallback);
    observer.observe(audioControlsContainer, { childList: true });
    return Observation.foundAndDecorated(foundAudioCtrls); // Assuming listener doesn't require further checks
  }
}

export class VoiceSettings extends VoiceSelector {
  constructor(
    chatbot: Chatbot,
    userPreferences: UserPreferenceModule,
    element: HTMLElement
  ) {
    super(chatbot, userPreferences, element);
    this.addIdVoiceMenu(element);
    SpeechSynthesisModule.getInstance()
      .getVoices()
      .then((voices) => {
        this.populateVoices(voices, element);
        this.handleExistingVoiceButtons(element);
        this.registerVoiceChangeHandler(element);
      });
  }

  getId(): string {
    return "saypi-voice-settings";
  }

  getButtonClasses(): string[] {
    return [
      "flex",
      "items-center",
      "justify-between",
      "rounded-lg",
      "border",
      "px-3",
      "py-5",
      "font-sans",
      "text-body-m-mobile",
      "text-primary-700",
      "border-neutral-500",
    ];
  }

  handleExistingVoiceButtons(voiceMenu: HTMLElement): void {
    const voiceButtons = Array.from(voiceMenu.querySelectorAll("button"));
    if (!voiceButtons || voiceButtons.length === 0) {
      return;
    }
    voiceButtons.forEach((button) => {
      this.handleButtonAddition(button as HTMLButtonElement);
    });
  }
}

export class ClaudeVoiceMenu extends VoiceSelector {
  constructor(
    chatbot: Chatbot,
    userPreferences: UserPreferenceModule,
    element: HTMLElement
  ) {
    super(chatbot, userPreferences, element);
    this.addIdVoiceMenu(element);
    this.initializeVoiceSelector(chatbot);
  }

  getId(): string {
    return "claude-voice-selector";
  }

  getButtonClasses(): string[] {
    return [
      "font-tiempos",
      "inline-flex",
      "gap-[4px]",
      "text-[14px]",
      "leading-none",
      "items-center",
      "text-text-100",
    ];
  }

  protected createVoiceButton(
    voice: SpeechSynthesisVoiceRemote
  ): HTMLButtonElement {
    const button = document.createElement("button");
    button.classList.add(...this.getButtonClasses());
    button.dataset.voiceId = voice.id;

    addSvgToButton(
      button,
      waveformSvgContent,
      "voiced-by",
      "block",
      "translate-y-[1.5px]",
      "fill-current"
    );

    const voiceName = document.createElement("span");
    voiceName.classList.add(
      "voice-name",
      "whitespace-nowrap",
      "tracking-tight"
    );
    voiceName.innerText = voice.name;
    button.appendChild(voiceName);

    addSvgToButton(
      button,
      chevronSvgContent,
      "chevron",
      "text-text-500",
      "ml-px",
      "shrink-0",
      "translate-y-px",
      "fill-current"
    );

    button.addEventListener("click", () => this.handleVoiceSelection(voice));
    return button;
  }

  protected handleVoiceSelection(voice: SpeechSynthesisVoiceRemote): void {
    this.userPreferences.setVoice(voice).then(() => {
      console.log(`Selected voice: ${voice.name}`);
      this.updateSelectedVoice(voice);
      this.introduceVoice(voice);
    });
  }

  protected updateSelectedVoice(
    selectedVoice: SpeechSynthesisVoiceRemote
  ): void {
    const buttons = this.element.querySelectorAll("button[data-voice-id]");
    buttons.forEach((button) => {
      if (button instanceof HTMLButtonElement) {
        if (button.dataset.voiceId === selectedVoice.id) {
          this.markButtonAsSelectedVoice(button);
        } else {
          this.unmarkButtonAsSelectedVoice(button);
        }
      }
    });
  }

  populateVoices(
    voices: SpeechSynthesisVoiceRemote[],
    voiceSelector: HTMLElement
  ): boolean {
    if (!voices || voices.length === 0) {
      console.log("No voices found");
      return false;
    }

    // For now, only show the first voice
    const firstVoice = voices[0];
    if (
      firstVoice &&
      !voiceSelector.querySelector(`button[data-voice-id="${firstVoice.id}"]`)
    ) {
      const button = this.createVoiceButton(firstVoice);
      voiceSelector.appendChild(button);
    }

    return true;
  }

  private initializeVoiceSelector(chatbot: Chatbot): void {
    const speechSynthesis = SpeechSynthesisModule.getInstance();
    speechSynthesis.getVoices(chatbot).then((voices) => {
      this.populateVoices(voices, this.element);
      this.registerVoiceChangeHandler(this.element);
    });
  }

  // Override other methods as needed to fit Claude AI's specific requirements
}

function innerContent(svgContent: string): string {
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgContent, "image/svg+xml");
  return svgDoc.documentElement.innerHTML;
}

function viewbox(svgContent: string): string {
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgContent, "image/svg+xml");
  return svgDoc.documentElement.getAttribute("viewBox") || "0 0 256 256";
}

function addSvgToButton(
  button: HTMLElement,
  svgContent: string,
  ...classNames: string[]
): void {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  button.appendChild(svg);
  svg.innerHTML = innerContent(svgContent);
  svg.setAttribute("viewBox", viewbox(svgContent));
  classNames.forEach((className) => svg.classList.add(className));
}
