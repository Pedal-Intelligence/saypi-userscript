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
      "flex",
      "items-center",
      "px-3",
      "py-2",
      "rounded-lg",
      "hover:bg-neutral-100",
      "text-sm",
      "text-neutral-300",
      "font-normal",
      "transition-colors",
      "duration-100"
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
      "fill-current",
      "w-4",
      "h-4",
      "text-neutral-600",
      "mr-1"
    );

    const voiceName = document.createElement("span");
    voiceName.classList.add(
      "voice-name",
      "whitespace-nowrap"
    );
    voiceName.innerText = voice ? voice.name : "Voice off";
    button.appendChild(voiceName);

    addSvgToButton(
      button,
      chevronSvgContent,
      "chevron",
      "fill-current",
      "w-3.5",
      "h-3.5",
      "ml-1.5",
      "text-neutral-400"
    );

    button.addEventListener("click", () => this.toggleMenu());
    return button;
  }

  protected createVoiceMenu(): HTMLDivElement {
    const menu = document.createElement("div");
    menu.classList.add(
      "z-50",
      "bg-white",
      "border",
      "border-gray-200",
      "rounded-lg",
      "shadow-lg",
      "min-w-[160px]",
      "max-h-[280px]",
      "overflow-y-auto",
      "overflow-x-hidden",
      "p-1",
      "voice-menu-content"
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
      "py-2",
      "px-3",
      "rounded-md",
      "cursor-pointer",
      "whitespace-nowrap",
      "overflow-hidden",
      "text-ellipsis",
      "flex",
      "flex-col",
      "gap-0.5",
      "outline-none",
      "select-none",
      "hover:bg-neutral-100",
      "transition-colors",
      "duration-100"
    );
    item.setAttribute("role", "menuitem");
    item.setAttribute("tabindex", "-1");

    const nameContainer = document.createElement("div");
    nameContainer.classList.add("flex", "items-center", "justify-between");
    
    const name = document.createElement("div");
    name.classList.add("text-sm", "font-normal", "text-neutral-300");
    name.innerText = voice ? voice.name : "Voice off";
    nameContainer.appendChild(name);
    
    // Add space for checkmark
    const checkmarkContainer = document.createElement("div");
    checkmarkContainer.classList.add("checkmark-container", "w-5", "h-5", "text-accent-secondary-100");
    nameContainer.appendChild(checkmarkContainer);
    
    item.appendChild(nameContainer);

    const description = document.createElement("div");
    description.classList.add("text-xs", "text-neutral-500");
    description.innerText = voice ? "TTS voice" : "Disable text-to-speech";
    item.appendChild(description);

    item.addEventListener("click", () => this.handleVoiceSelection(voice));
    return item;
  }

  private positionMenuAboveButton(): void {
    const buttonRect = this.menuButton.getBoundingClientRect();
    
    // Set the menu to be positioned above the button
    this.menuContent.style.position = "absolute";
    this.menuContent.style.bottom = `calc(100% + 8px)`; // Position above with gap
    this.menuContent.style.left = "0";
    this.menuContent.style.minWidth = `${Math.max(buttonRect.width, 160)}px`;
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
        const itemName = item.querySelector(".text-sm")?.textContent;
        const isSelected = itemName === (selectedVoice ? selectedVoice.name : "Voice off");
        
        // Toggle selected state
        item.classList.toggle("bg-blue-50", isSelected);
        
        // Update checkmark
        const checkmarkContainer = item.querySelector(".checkmark-container");
        if (checkmarkContainer) {
          checkmarkContainer.innerHTML = isSelected ? 
            '<svg class="w-5 h-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>' : 
            '';
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
      this.userPreferences.getVoice(chatbot).then((voice) => {
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

  getPositionFromEnd(): number {
    return 1; // Position right before the model selector
  }
}
