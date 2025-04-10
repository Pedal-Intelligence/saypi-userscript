import { Chatbot } from "./Chatbot";
import { buttonModule } from "../ButtonModule.js";
import EventBus from "../events/EventBus.js";
import { ChatHistorySpeechManager } from "../tts/ChatHistoryManager";
import { Observation } from "../dom/Observation";
import { VoiceSettings } from "../tts/VoiceMenu";
import { UserPreferenceModule } from "../prefs/PreferenceModule";
import { ThemeManager } from "../themes/ThemeManagerModule";
import { VoiceMenuUIManager } from "../tts/VoiceMenuUIManager";

export class DOMObserver {
  ttsUiMgr: ChatHistorySpeechManager | null = null;
  voiceMenuUiMgr: VoiceMenuUIManager;
  constructor(private chatbot: Chatbot) {
    this.voiceMenuUiMgr = new VoiceMenuUIManager(
      this.chatbot,
      UserPreferenceModule.getInstance()
    );
    this.monitorForRouteChanges();
  }

  monitorForRouteChanges(): void {
    // Store the current URL for comparison
    let lastUrl = window.location.href;
    
    // Check for URL changes every 300ms
    setInterval(() => {
      const currentUrl = window.location.href;
      if (currentUrl !== lastUrl) {
        console.log('Route changed:', lastUrl, '->', currentUrl);
        lastUrl = currentUrl;
        
        // Check if the new path is a chatable path
        if (this.chatbot.isChatablePath(window.location.pathname)) {
          this.handleRouteChange();
        }
      }
    }, 300);
  }

  handleRouteChange(): void {
    // Allow time for DOM to update after route change
    setTimeout(() => {
      EventBus.emit("saypi:ui:content-loaded");
      // Additional route change handling can be added here
    }, 300);
  }

  observeDOM(): void {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        [...mutation.addedNodes]
          .filter((node) => node instanceof HTMLElement)
          .forEach((node) => {
            const addedElement = node as HTMLElement;
            const promptObs = this.findAndDecoratePrompt(addedElement);
            const ctrlPanelObs = this.findAndDecorateControlPanel(addedElement);
            const sidePanelObs = this.findAndDecorateSidePanel(addedElement);
            if (sidePanelObs.found && sidePanelObs.decorated) {
              const discoveryPanelObs =
                this.findAndDecorateDiscoveryPanel(addedElement);
              const voiceSettingsObs =
                this.findAndDecorateVoiceSettings(addedElement);
            }
            const audioControlsObs =
              this.findAndDecorateAudioControls(addedElement);
            if (audioControlsObs.isReady()) {
              this.voiceMenuUiMgr.findAndDecorateVoiceMenu(
                audioControlsObs.target as HTMLElement
              );
            }
            const audioOutputButtonObs =
              this.findAndDecorateAudioOutputButton(addedElement);
            const chatHistoryObs =
              this.findAndDecorateChatHistory(addedElement);

            if (promptObs.isReady()) {
              EventBus.emit("saypi:ui:content-loaded");
            }
          });
        [...mutation.removedNodes]
          .filter((node) => node instanceof HTMLElement)
          .forEach((node) => {
            const removedElement = node as HTMLElement;
            const obs = this.findPrompt(removedElement);
            if (obs.found) {
              this.findAndDecoratePrompt(document.body);
              if (obs.found && obs.isNew && obs.decorated) {
                EventBus.emit("saypi:ui:content-loaded");
              }
            }
            const ctrlPanelObs = this.findControlPanel(removedElement);
            if (ctrlPanelObs.found) {
              this.findAndDecorateControlPanel(document.body);
            }
            const audioControlsObs = this.findAudioControls(removedElement);
            if (audioControlsObs.found) {
              const replacementAudioControls = this.findAndDecorateAudioControls(document.body);
              if (replacementAudioControls.isReady()) {
                this.voiceMenuUiMgr.findAndDecorateVoiceMenu(
                  replacementAudioControls.target as HTMLElement
                );
              }
            }
            const audioOutputButtonObs =
              this.findAudioOutputButton(removedElement);
            if (audioOutputButtonObs.found) {
              this.findAndDecorateAudioOutputButton(document.body);
            }
            const chatHistoryObs = this.findChatHistory(removedElement);
            if (chatHistoryObs.found) {
              this.findAndDecorateChatHistory(document.body);
            }
          });
      });
    });

    EventBus.on("saypi:ui:content-loaded", () => {
      const audioControlsObs = this.findAndDecorateAudioControls(document.body);
      if (audioControlsObs.isReady()) {
        this.voiceMenuUiMgr.findAndDecorateVoiceMenu(
          audioControlsObs.target as HTMLElement
        );
      }
      const chatHistoryObs = this.findAndDecorateChatHistory(document.body);
      if (!chatHistoryObs.found) {
        console.warn("No chat history found on page load. Voice functionality may not work.");
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  monitorForSubmitButton(ancestor: HTMLElement, runInitial = true): void {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        [...mutation.addedNodes]
          .filter((node) => node instanceof HTMLElement)
          .forEach((node) => {
            const addedElement = node as HTMLElement;
            const submitButtonObs =
              this.findAndDecorateSubmitButton(addedElement);
          });
      });
    });

    if (runInitial) {
      this.findAndDecorateSubmitButton(ancestor);
    }

    // Start observing
    observer.observe(ancestor, { childList: true, subtree: true });
  }

  // Function to decorate the prompt input element, and other elements that depend on it
  decoratePrompt(prompt: HTMLElement): void {
    prompt.id = "saypi-prompt";
    const promptContainer = this.chatbot.getPromptContainer(prompt);
    if (promptContainer) {
      promptContainer.classList.add("saypi-prompt-container");
      const controlsContainer = this.chatbot.getPromptControlsContainer(promptContainer);
      if (controlsContainer) {
        controlsContainer.id = "saypi-prompt-controls-container";
        const ancestor = this.addIdPromptAncestor(controlsContainer);
        if (ancestor) this.monitorForSubmitButton(ancestor);
        const submitButtonSearch = this.findSubmitButton(controlsContainer);
        const insertionPosition = submitButtonSearch.found ? -1 : 0;
        buttonModule.createCallButton(controlsContainer, insertionPosition);
      }
    }
  }

  /**
   * Identifies and returns the row containing the discover and threads buttons on pi.ai
   * @returns {element: HTMLElement | null, new: boolean} the container element for the control panel, and whether it was newly created
   */
  findControlPanel(searchRoot: Element): Observation {
    const id = "saypi-control-panel-main";
    var mainControlPanel = document.getElementById(id);
    if (mainControlPanel) {
      return Observation.foundAlreadyDecorated(id, mainControlPanel);
    }
    mainControlPanel = searchRoot.querySelector(
      this.chatbot.getControlPanelSelector()
    );
    if (!mainControlPanel) {
      return Observation.notFound(id);
    }
    return new Observation(mainControlPanel, id, true, true, false);
  }

  decorateMainControlPanel(controlPanel: HTMLElement): void {
    const id = "saypi-control-panel-main";
    controlPanel.id = id;
    controlPanel.classList.add("saypi-control-panel");

    const toggleModeBtnPos = 1;
    buttonModule.createEnterButton(controlPanel, toggleModeBtnPos);
    buttonModule.createExitButton(controlPanel, toggleModeBtnPos);
    const themeManager = ThemeManager.getInstance();
    themeManager.createThemeToggleButton(controlPanel, toggleModeBtnPos + 2);
    buttonModule.createMiniSettingsButton(controlPanel, toggleModeBtnPos + 3);
  }

  findAndDecorateControlPanel(searchRoot: Element): Observation {
    const obs = this.findControlPanel(searchRoot);
    if (obs.found && obs.isNew && !obs.decorated) {
      this.decorateMainControlPanel(obs.target as HTMLElement);
    }
    return Observation.foundAndDecorated(obs);
  }

  findSidePanel(searchRoot: Element): Observation {
    const id = "saypi-side-panel";
    const existingSidePanel = document.getElementById(id);
    if (existingSidePanel) {
      // Side panel already exists, no need to search
      return Observation.foundAlreadyDecorated(id, existingSidePanel);
    }

    const sidePanel = searchRoot.querySelector(
      this.chatbot.getSidePanelSelector()
    );
    if (sidePanel) {
      return Observation.foundUndecorated(id, sidePanel);
    }
    return Observation.notFound(id);
  }

  decorateSidePanel(sidePanel: HTMLElement): void {
    sidePanel.id = "saypi-side-panel";
    sidePanel.classList.add("saypi-control-panel"); // the side panel is a secondary control panel for larger screens
    const immersiveModeBtnPos = 1;
    buttonModule.createImmersiveModeButton(sidePanel, immersiveModeBtnPos);
    buttonModule.createSettingsButton(sidePanel, immersiveModeBtnPos + 1);
  }

  findAndDecorateSidePanel(searchRoot: Element): Observation {
    const obs = this.findSidePanel(searchRoot);
    if (obs.found && obs.isNew && !obs.decorated) {
      this.decorateSidePanel(obs.target as HTMLElement);
    }
    return Observation.foundAndDecorated(obs);
  }

  findDiscoveryPanel(searchRoot: Element): Observation {
    const id = "saypi-discovery-panel";
    const existingDiscoveryPanel = document.getElementById(id);
    if (existingDiscoveryPanel) {
      // Discovery panel already exists, no need to search
      return Observation.foundAlreadyDecorated(id, existingDiscoveryPanel);
    }

    const discoveryPanel = searchRoot.querySelector(
      this.chatbot.getDiscoveryPanelSelector()
    );
    if (discoveryPanel) {
      return Observation.foundUndecorated(id, discoveryPanel);
    }
    return Observation.notFound(id);
  }

  decorateDiscoveryPanel(discoveryPanel: HTMLElement): void {
    discoveryPanel.id = "saypi-discovery-panel";
  }

  findAndDecorateDiscoveryPanel(searchRoot: Element): Observation {
    const obs = this.findDiscoveryPanel(searchRoot);
    if (obs.found && obs.isNew && !obs.decorated) {
      this.decorateDiscoveryPanel(obs.target as HTMLElement);
    }
    return Observation.foundAndDecorated(obs);
  }

  findAndDecorateVoiceSettings(searchRoot: Element): Observation {
    const obs = this.findVoiceSettings(searchRoot);
    if (obs.isUndecorated()) {
      // decorate voice settings
      this.decorateVoiceSettings(obs.target as HTMLElement);
    }
    return Observation.foundAndDecorated(obs);
  }

  findVoiceSettings(searchRoot: Element): Observation {
    const id = "saypi-voice-settings";
    const existingVoiceSettings = document.getElementById(id);
    if (existingVoiceSettings) {
      // Voice settings already exist, no need to search
      return Observation.foundAlreadyDecorated(id, existingVoiceSettings);
    }

    const voiceSettings = searchRoot.querySelector(
      this.chatbot.getVoiceSettingsSelector()
    );
    if (voiceSettings) {
      return Observation.foundUndecorated(id, voiceSettings);
    }
    return Observation.notFound(id);
  }

  decorateVoiceSettings(voiceSettingsElement: HTMLElement): void {
    const voiceSettings = new VoiceSettings(
      this.chatbot,
      UserPreferenceModule.getInstance(),
      voiceSettingsElement
    );
  }

  findSubmitButton(searchRoot: Element): Observation {
    const id = "saypi-submitButton";
    const existingSubmitButton = document.getElementById(id);
    if (existingSubmitButton) {
      // Submit button already exists, no need to search
      return Observation.foundAlreadyDecorated(id, existingSubmitButton);
    }

    const submitButton = searchRoot.querySelector(
      this.chatbot.getPromptSubmitButtonSelector()
    );
    if (submitButton) {
      return Observation.foundUndecorated(id, submitButton);
    }
    return Observation.notFound(id);
  }

  decorateSubmitButton(submitButton: HTMLElement): void {
    submitButton.id = "saypi-submitButton";
  }

  findAndDecorateSubmitButton(searchRoot: Element): Observation {
    const obs = this.findSubmitButton(searchRoot);
    if (obs.isUndecorated()) {
      this.decorateSubmitButton(obs.target as HTMLElement);
    }
    return Observation.foundAndDecorated(obs);
  }

  addIdPromptAncestor(container: Element): HTMLElement | null {
    // climb up the DOM tree until we find a div with class 'w-full'
    let parent = container.parentElement;
    while (parent) {
      if (parent.classList.contains("w-full")) {
        parent.id = "saypi-prompt-ancestor";
        return parent as HTMLElement;
      }
      parent = parent.parentElement;
    }
    return null;
  }

  findPrompt(searchRoot: Element): Observation {
    const id = "saypi-prompt";
    const existingPrompt = document.getElementById(id);
    if (existingPrompt) {
      // Prompt already exists, no need to search
      return Observation.foundAlreadyDecorated(id, existingPrompt);
    }

    const promptInput = this.chatbot.getPromptInput(searchRoot);
    if (promptInput) {
      return Observation.foundUndecorated(id, promptInput);
    }
    return Observation.notFound(id);
  }

  findAndDecoratePrompt(searchRoot: Element): Observation {
    const obs = this.findPrompt(searchRoot);
    if (obs.found && obs.isNew && !obs.decorated) {
      this.decoratePrompt(obs.target as HTMLElement);
    }
    return Observation.foundAndDecorated(obs);
  }

  findAudioControls(searchRoot: Element): Observation {
    const className = "saypi-audio-controls";
    const existingAudioControls = searchRoot.querySelector("." + className);
    if (existingAudioControls) {
      // Audio controls already exist, no need to search
      return Observation.foundAlreadyDecorated(className, existingAudioControls);
    }

    const audioControls = this.chatbot.getAudioControls(searchRoot);
    if (audioControls) {
      // Check if the found element already has the class (might have been added dynamically)
      if (audioControls.classList.contains(className)) {
        return Observation.foundAlreadyDecorated(className, audioControls);
      }
      return Observation.foundUndecorated(className, audioControls);
    }
    return Observation.notFound(className);
  }

  decorateAudioControls(audioControls: HTMLElement): void {
    audioControls.classList.add("saypi-audio-controls");
  }

  findAndDecorateAudioControls(searchRoot: Element): Observation {
    const obs = this.findAudioControls(searchRoot);
    if (obs.isUndecorated()) {
      this.decorateAudioControls(obs.target as HTMLElement);
    }
    return Observation.foundAndDecorated(obs);
  }

  findAudioOutputButton(searchRoot: Element): Observation {
    const id = "saypi-audio-output-button";
    const existingAudioOutputButton = document.getElementById(id);
    if (existingAudioOutputButton) {
      // Audio output button already exists, no need to search
      return Observation.foundAlreadyDecorated(id, existingAudioOutputButton);
    }

    const audioOutputButton = searchRoot.querySelector(
      this.chatbot.getAudioOutputButtonSelector()
    );
    if (audioOutputButton) {
      return Observation.foundUndecorated(id, audioOutputButton);
    }
    return Observation.notFound(id);
  }

  decorateAudioOutputButton(audioOutputButton: HTMLElement): void {
    audioOutputButton.id = "saypi-audio-output-button";
  }

  findAndDecorateAudioOutputButton(searchRoot: Element): Observation {
    const obs = this.findAudioOutputButton(searchRoot);
    if (obs.isUndecorated()) {
      this.decorateAudioOutputButton(obs.target as HTMLElement);
    }
    return Observation.foundAndDecorated(obs);
  }

  findChatHistory(searchRoot: HTMLElement): Observation {
    const id = "saypi-chat-history";
    const existingChatHistory = searchRoot.querySelector("#" + id);
    if (existingChatHistory) {
      // Chat history already exists, no need to search
      return Observation.foundAlreadyDecorated(id, existingChatHistory);
    }
    const chatHistory = this.chatbot.getChatHistory(searchRoot);
    if (chatHistory) {
      return Observation.foundUndecorated(id, chatHistory);
    }
    return Observation.notFound(id);
  }

  decorateChatHistory(chatHistory: HTMLElement): void {
    if (this.ttsUiMgr) {
      // teardown existing TTS UI manager to release resources
      this.ttsUiMgr.teardown();
    }
    this.ttsUiMgr = new ChatHistorySpeechManager(this.chatbot, chatHistory);
  }

  findAndDecorateChatHistory(searchRoot: HTMLElement): Observation {
    const obs = this.findChatHistory(searchRoot);
    if (obs.found && obs.isNew && !obs.decorated) {
      // decorate chat history
      this.decorateChatHistory(obs.target as HTMLElement);
    } else if (obs.found && obs.decorated) {
      return Observation.foundAlreadyDecorated(
        obs.id,
        obs.target as HTMLElement
      );
    }
    if (!obs.found) {
      return Observation.notFound("saypi-chat-history");
    }
    return Observation.foundAndDecorated(obs);
  }
}
