import { Observation } from "../dom/Observation";
import EventBus from "../events/EventBus";
import getMessage from "../i18n";
import { audioProviders } from "../tts/SpeechModel";
import { SpeechSynthesisModule } from "../tts/SpeechSynthesisModule";
import { VoiceSelector } from "../tts/VoiceMenu";
import { Chatbot } from "./Chatbot";
import { PiAIChatbot } from "./Pi";
import { UserPreferenceModule } from "../prefs/PreferenceModule";

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
    const className = "saypi-audio-controls";
    const audioControlsContainer = document.querySelector("." + className) as HTMLElement;
    const voiceMenu = document.getElementById(this.getId());

    if (!audioControlsContainer || !voiceMenu) {
      return Observation.notFound(className);
    }
    let foundAudioCtrls = Observation.foundUndecorated(
      className,
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
              this.addMissingPiVoices(voiceMenu);
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

export class PiVoiceSettings extends VoiceSelector {
  constructor(
    chatbot: Chatbot,
    userPreferences: UserPreferenceModule,
    element: HTMLElement
  ) {
    super(chatbot, userPreferences, element);
    this.addIdVoiceMenu(element);
    SpeechSynthesisModule.getInstance()
      .getVoices()
      .then((multilingualVoices) => {
        this.populateVoices(multilingualVoices, element);
        this.addMissingPiVoices(element);
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