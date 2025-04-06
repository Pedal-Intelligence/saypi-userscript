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
      "inline-flex",
      "items-center",
      "justify-center",
      "relative",
      "shrink-0",
      "can-focus",
      "select-none",
      "disabled:pointer-events-none", 
      "disabled:opacity-50",
      "disabled:shadow-none",
      "disabled:drop-shadow-none",
      "h-7",
      "border-0.5",
      "text-text-100",
      "ml-1.5",
      "inline-flex",
      "items-start",
      "gap-[0.175em]",
      "rounded-md",
      "border-transparent",
      "text-sm",
      "opacity-80",
      "transition",
      "hover:opacity-100",
      "disabled:!opacity-80", 
      "sm:ml-0",
      "sm:pb-1",
      "sm:pl-1.5",
      "sm:pr-1",
      "sm:pt-1",
      "hover:bg-bg-100",
      "hover:border-border-400"
    ];
  }

  protected createVoiceButton(
    voice: SpeechSynthesisVoiceRemote | null
  ): HTMLButtonElement {
    const button = document.createElement("button");
    button.classList.add(...this.getButtonClasses());
    button.setAttribute("aria-haspopup", "true");
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("type", "button");

    // Create a div to match Claude's model selector structure
    const contentDiv = document.createElement("div");
    contentDiv.classList.add(
      "font-tiempos",
      "inline-flex",
      "items-center",
      "gap-[3px]",
      "text-[14px]",
      "h-[14px]",
      "leading-none",
    );

    // Use a muted waveform icon
    addSvgToButton(
      contentDiv,
      waveformSvgContent,
      "voiced-by",
      "block",
      "fill-current",
      "w-4",
      "h-4",
      "mr-1"
    );

    // Add the voice name in a container div
    const nameContainer = document.createElement("div");
    nameContainer.classList.add(
      "flex", 
      "items-center", 
      "gap-[4px]"
    );
    
    const voiceName = document.createElement("span");
    voiceName.classList.add(
      "voice-name",
      "whitespace-nowrap",
      "tracking-tight",
      "select-none"
    );
    voiceName.innerText = voice ? voice.name : "Voice off";
    nameContainer.appendChild(voiceName);
    contentDiv.appendChild(nameContainer);
    
    button.appendChild(contentDiv);

    // Add the chevron icon as a separate SVG
    addSvgToButton(
      button,
      chevronSvgContent,
      "chevron",
      "text-text-500",
      "shrink-0",
      "w-3",
      "h-3",
      "ml-1.5"
    );

    button.addEventListener("click", () => this.toggleMenu());
    return button;
  }

  protected createVoiceMenu(): HTMLDivElement {
    const menu = document.createElement("div");
    menu.classList.add(
      "z-50",
      "bg-white",
      "border-0.5",
      "border-border-300",
      "backdrop-blur-xl",
      "rounded-lg",
      "shadow-element",
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
      "pr-1",
      "hover:bg-bg-300"
    );
    item.setAttribute("role", "menuitem");
    item.setAttribute("tabindex", "-1");

    const content = document.createElement("div");
    const nameContainer = document.createElement("div");
    nameContainer.classList.add("flex", "items-center");
    
    const name = document.createElement("div");
    name.classList.add("flex-1", "text-sm", "font-normal", "text-text-300");
    name.innerText = voice ? voice.name : "Voice off";
    nameContainer.appendChild(name);
    content.appendChild(nameContainer);

    const description = document.createElement("div");
    description.classList.add("text-text-500", "pr-4", "text-xs");
    description.innerText = voice ? "TTS voice" : "Disable text-to-speech";
    content.appendChild(description);

    item.appendChild(content);

    // Add space for checkmark
    const checkmarkContainer = document.createElement("div");
    checkmarkContainer.classList.add("checkmark-container", "text-accent-secondary-100");
    item.appendChild(checkmarkContainer);

    item.addEventListener("click", () => this.handleVoiceSelection(voice));
    return item;
  }

  private positionMenuAboveButton(): void {
    const buttonRect = this.menuButton.getBoundingClientRect();
    
    // Use fixed positioning with transform to match Claude's native UI pattern
    this.menuContent.style.position = "fixed";
    this.menuContent.style.left = "0px";
    this.menuContent.style.top = "0px";
    
    // Calculate the X position (left edge of button)
    const leftPosition = buttonRect.left;
    
    // Calculate the Y position (top edge of button minus menu height minus gap)
    const topPosition = buttonRect.top - this.menuContent.offsetHeight - 8;
    
    // Apply transform to position the menu precisely
    this.menuContent.style.transform = `translate(${leftPosition}px, ${topPosition}px)`;
    this.menuContent.style.zIndex = "50";
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
        
        // Toggle selected state with Claude's styling
        item.classList.toggle("bg-bg-300", isSelected);
        
        // Update checkmark
        const checkmarkContainer = item.querySelector(".checkmark-container");
        if (checkmarkContainer) {
          checkmarkContainer.innerHTML = isSelected ? 
            '<svg width="16" height="16" viewBox="0 0 256 256" class="text-accent-secondary-100 mb-1 mr-1.5" fill="currentColor"><path d="M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z"></path></svg>' : 
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
    return 2; // Position right after the model selector and before the call button
  }
}
