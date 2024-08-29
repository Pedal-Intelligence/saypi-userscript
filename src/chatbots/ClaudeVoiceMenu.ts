import { UserPreferenceModule } from "../prefs/PreferenceModule";
import { SpeechSynthesisVoiceRemote } from "../tts/SpeechModel";
import { VoiceSelector, addSvgToButton } from "../tts/VoiceMenu";
import { Chatbot } from "./Chatbot";
import waveformSvgContent from "../icons/wave.svg";
import chevronSvgContent from "../icons/claude-chevron.svg";
import { SpeechSynthesisModule } from "../tts/SpeechSynthesisModule";

export class ClaudeVoiceMenu extends VoiceSelector {
  private menuButton: HTMLButtonElement;
  private menuContent: HTMLDivElement;

  constructor(
    chatbot: Chatbot,
    userPreferences: UserPreferenceModule,
    element: HTMLElement
  ) {
    super(chatbot, userPreferences, element);

    // Initialize properties with placeholder elements - to satisfy TypeScript compiler
    this.menuButton = document.createElement("button");
    this.menuContent = document.createElement("div");

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
    voice: SpeechSynthesisVoiceRemote | null
  ): HTMLButtonElement {
    const button = document.createElement("button");
    button.classList.add(...this.getButtonClasses());
    button.setAttribute("aria-haspopup", "true");
    button.setAttribute("aria-expanded", "false");

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
    voiceName.innerText = voice ? voice.name : "Voice off";
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

    button.addEventListener("click", () => this.toggleMenu());
    return button;
  }

  protected createVoiceMenu(): HTMLDivElement {
    const menu = document.createElement("div");
    menu.classList.add(
      "z-50",
      "bg-bg-300",
      "border-0.5",
      "border-border-300",
      "backdrop-blur-xl",
      "rounded-lg",
      "min-w-[8rem]",
      "overflow-hidden",
      "p-1",
      "text-text-200",
      "shadow-element",
      "!bg-bg-200"
    );
    menu.setAttribute("role", "menu");
    menu.setAttribute("aria-orientation", "vertical");
    menu.style.display = "none";
    return menu;
  }

  protected createMenuItem(
    voice: SpeechSynthesisVoiceRemote | null
  ): HTMLDivElement {
    const item = document.createElement("div");
    item.classList.add(
      "py-1",
      "px-2",
      "rounded-md",
      "cursor-pointer",
      "whitespace-nowrap",
      "overflow-hidden",
      "text-ellipsis",
      "grid",
      "grid-cols-[minmax(0,_1fr)_auto]",
      "gap-2",
      "items-center",
      "outline-none",
      "select-none",
      "[&[data-highlighted]]:bg-bg-400",
      "[&[data-highlighted]]:text-text-000",
      "group",
      "pr-1"
    );
    item.setAttribute("role", "menuitem");
    item.setAttribute("tabindex", "-1");

    const content = document.createElement("div");
    const nameContainer = document.createElement("div");
    nameContainer.classList.add("flex", "items-center");
    const name = document.createElement("div");
    name.classList.add("flex-1", "text-sm", "font-medium", "text-text-100");
    name.innerText = voice ? voice.name : "Voice off";
    nameContainer.appendChild(name);
    content.appendChild(nameContainer);

    const description = document.createElement("div");
    description.classList.add("text-text-400", "pr-4", "text-xs");
    description.innerText = voice ? "TTS voice" : "Disable text-to-speech";
    content.appendChild(description);

    item.appendChild(content);

    item.addEventListener("click", () => this.handleVoiceSelection(voice));
    return item;
  }

  private positionMenuAboveButton(): void {
    const buttonRect = this.menuButton.getBoundingClientRect();
    const menuRect = this.menuContent.getBoundingClientRect();

    this.menuContent.style.position = "absolute";
    this.menuContent.style.bottom = `${window.innerHeight - buttonRect.top}px`;
    this.menuContent.style.left = "0"; // Align with nearest positioned ancestor
    this.menuContent.style.width = `${Math.max(
      buttonRect.width,
      menuRect.width
    )}px`;
  }

  private toggleMenu(): void {
    const isExpanded = this.menuButton.getAttribute("aria-expanded") === "true";
    this.menuButton.setAttribute("aria-expanded", (!isExpanded).toString());

    if (!isExpanded) {
      this.menuContent.style.display = "block";
      this.positionMenuAboveButton();
    } else {
      this.menuContent.style.display = "none";
    }
  }

  private handleVoiceSelection(voice: SpeechSynthesisVoiceRemote | null): void {
    if (voice) {
      this.userPreferences.setVoice(voice).then(() => {
        console.log(`Selected voice: ${voice.name}`);
        this.updateSelectedVoice(voice);
        this.introduceVoice(voice);
      });
    } else {
      this.userPreferences.unsetVoice().then(() => {
        console.log("Voice disabled");
        this.updateSelectedVoice(null);
      });
    }
    this.toggleMenu();
  }

  private updateSelectedVoice(
    selectedVoice: SpeechSynthesisVoiceRemote | null
  ): void {
    const voiceName = this.menuButton.querySelector(".voice-name");
    if (voiceName) {
      voiceName.textContent = selectedVoice ? selectedVoice.name : "Voice off";
    }

    const menuItems = this.menuContent.querySelectorAll("[role='menuitem']");
    menuItems.forEach((item) => {
      if (item instanceof HTMLElement) {
        const isSelected =
          item.textContent ===
          (selectedVoice ? selectedVoice.name : "Voice off");
        item.classList.toggle("bg-bg-300", isSelected);
        item.classList.toggle("text-text-100", isSelected);

        // Add or remove checkmark
        const checkmark = item.querySelector(".checkmark");
        if (isSelected && !checkmark) {
          const checkmarkSvg = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
          );
          checkmarkSvg.classList.add(
            "checkmark",
            "text-accent-main-100",
            "mb-1",
            "mr-1.5"
          );
          checkmarkSvg.setAttribute("width", "20");
          checkmarkSvg.setAttribute("height", "20");
          checkmarkSvg.setAttribute("viewBox", "0 0 256 256");
          checkmarkSvg.innerHTML =
            '<path d="M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z"></path>';
          item.appendChild(checkmarkSvg);
        } else if (!isSelected && checkmark) {
          checkmark.remove();
        }
      }
    });
  }

  private initializeVoiceSelector(chatbot: Chatbot): void {
    const speechSynthesis = SpeechSynthesisModule.getInstance();
    speechSynthesis.getVoices(chatbot).then((voices) => {
      this.menuButton = this.createVoiceButton(null);
      this.element.appendChild(this.menuButton);

      this.menuContent = this.createVoiceMenu();
      this.element.appendChild(this.menuContent);

      // Add "Voice off" option
      const voiceOffItem = this.createMenuItem(null);
      this.menuContent.appendChild(voiceOffItem);

      voices.forEach((voice) => {
        const menuItem = this.createMenuItem(voice);
        this.menuContent.appendChild(menuItem);
      });

      // Set initial selected voice
      this.userPreferences.getVoice().then((voice) => {
        this.updateSelectedVoice(voice);
      });

      // Close menu when clicking outside
      document.addEventListener("click", (event) => {
        if (!this.element.contains(event.target as Node)) {
          this.menuContent.style.display = "none";
          this.menuButton.setAttribute("aria-expanded", "false");
        }
      });
    });
  }
}
