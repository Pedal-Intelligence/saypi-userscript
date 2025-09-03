import AudioModule from "./audio/AudioModule.js";
import EventBus from "./events/EventBus.js";
import { buttonModule } from "./ButtonModule.js";
import EventModule from "./events/EventModule.js";
import { ImmersionService } from "./ImmersionService.js";
import { submitErrorHandler } from "./SubmitErrorHandler";
import getMessage from "./i18n";
import { DOMObserver } from "./chatbots/bootstrap";
import { addChild } from "./dom/DOMModule";
import SlowResponseHandler from "./SlowResponseHandler";
import { ChatbotService } from "./chatbots/ChatbotService";
import { logger } from "./LoggingModule";

export class AIChatModule {
  private static instance: AIChatModule;
  private audioModule: AudioModule;
  private isLoaded = false;

  private constructor() {
    this.audioModule = AudioModule.getInstance();
  }

  public static getInstance(): AIChatModule {
    if (!AIChatModule.instance) {
      AIChatModule.instance = new AIChatModule();
    }
    return AIChatModule.instance;
  }

  public async initialize(): Promise<void> {
    logger.info("Initializing chat mode");
    
    const chatbot = await ChatbotService.getChatbot();

    // Setup content loaded event handler
    EventBus.on("saypi:ui:content-loaded", () => {
      if (this.isLoaded) {
        return;
      }
      // arguably these two functions are part of the content loading phase,
      // but they need to be called after other content has been loaded
      this.addVisualisations(document.body);
      const controlPanel = document.querySelector("#saypi-control-panel-main");
      const lockPosition = 4; // position of the lock buttons - just before the div.grow separator
      this.addLockButtons(controlPanel, lockPosition);

      submitErrorHandler.initAudioOutputListener();
      submitErrorHandler.checkForRestorePoint();

      new ImmersionService(chatbot).initMode();
      this.startAudioModule();
      this.isLoaded = true;
    });

    // Initialize chat-specific modules
    EventModule.init();
    const domObserver = new DOMObserver(chatbot);
    domObserver.observeDOM();
    
    // Make DOMObserver accessible globally for route change detection
    (globalThis as any).DOMObserver = domObserver;
    (window as any).DOMObserver = domObserver;
  }

  private startAudioModule(): void {
    window.addEventListener("unload", () => {
      this.audioModule.stop();
    });
    this.audioModule.start();
  }

  private addVisualisations(container: HTMLElement | null): void {
    // Create a containing div
    var panel = document.createElement("div");
    panel.id = "saypi-panel";

    if (container) {
      container.appendChild(panel);
    } else {
      document.body.appendChild(panel);
    }

    // talk "button" is no longer a button, but a div
    var button = document.createElement("div");
    button.id = "saypi-talkButton";

    const classNames =
      "relative flex mt-1 mb-1 rounded-full px-2 py-3 text-center bg-cream-550 hover:bg-cream-650 hover:text-brand-green-700 text-muted";
    button.classList.add(...classNames.split(" "));

    buttonModule.addTalkIcon(button);
    panel.appendChild(button);
  }

  private addLockButtons(container: Element | null, position = 0): void {
    // Create a containing div
    var lockPanel = document.createElement("div");
    lockPanel.id = "saypi-lock-panel";
    lockPanel.classList.add("unlocked");
    document.body.classList.add("unlocked");

    if (container) {
      addChild(container, lockPanel, position);
    } else {
      document.body.appendChild(lockPanel);
    }

    const buttonContainer = lockPanel;
    var lockButton = buttonModule.createLockButton(buttonContainer);
    var unlockButton = buttonModule.createUnlockButton(buttonContainer);
    var touchAbsorber = document.createElement("div");
    touchAbsorber.id = "saypi-touch-absorber";
    lockPanel.appendChild(touchAbsorber);

    var lockedText = document.createElement("p");
    lockedText.id = "saypi-locked-text";
    lockedText.innerText = getMessage("lockedScreen");
    lockPanel.appendChild(lockedText);
    var unlockInstruction = document.createElement("span");
    unlockInstruction.id = "saypi-unlock-instruction";
    unlockInstruction.classList.add("subtext");
    unlockInstruction.innerText = getMessage("unlockInstruction");
    lockedText.appendChild(unlockInstruction);
  }

  public destroy(): void {
    // Cleanup if needed - for symmetry with UniversalDictationModule
    // Currently no specific cleanup needed for chat mode
  }
}
