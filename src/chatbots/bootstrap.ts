import { Chatbot } from "./Chatbot";
import { buttonModule } from "../ButtonModule.js";
import EventBus from "../events/EventBus.js";
import { ChatHistorySpeechManager } from "../tts/ChatHistoryManager";
import { Observation } from "../dom/Observation";
import { VoiceSettings } from "../tts/VoiceMenu";
import { UserPreferenceModule } from "../prefs/PreferenceModule";

export class DOMObserver {
  ttsUiMgr: ChatHistorySpeechManager | null = null;
  constructor(private chatbot: Chatbot) {}

  observeDOM(): void {
    // MutationObserver setup in a separate file or the same file where you start observing
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        [...mutation.addedNodes]
          .filter((node) => node instanceof HTMLElement)
          .forEach((node) => {
            const addedElement = node as HTMLElement;
            const promptObs = this.findAndDecoratePromptField(addedElement);
            const ctrlPanelObs = this.findAndDecorateControlPanel(addedElement);
            const sidePanelObs = this.findAndDecorateSidePanel(addedElement);
            if (sidePanelObs.found && sidePanelObs.decorated) {
              // this condition is particular to pi.ai
              const discoveryPanelObs =
                this.findAndDecorateDiscoveryPanel(addedElement);
              const voiceSettingsObs =
                this.findAndDecorateVoiceSettings(addedElement);
            }
            const audioControlsObs =
              this.findAndDecorateAudioControls(addedElement);
            const audioOutputButtonObs =
              this.findAndDecorateAudioOutputButton(addedElement);
            // ... handle other elements
            const chatHistoryObs =
              this.findAndDecorateChatHistory(addedElement);

            // notify listeners that (all critical) script content has been loaded
            if (promptObs.isReady()) {
              EventBus.emit("saypi:ui:content-loaded");
            }
          });
        [...mutation.removedNodes]
          .filter((node) => node instanceof HTMLElement)
          .forEach((node) => {
            const removedElement = node as HTMLElement;
            const obs = this.findPromptField(removedElement);
            if (obs.found) {
              // Prompt field is being removed, so search for a replacement in the main document
              this.findAndDecoratePromptField(document.body);
              if (obs.found && obs.isNew && obs.decorated) {
                // emit event to notify listeners that script content has been loaded
                EventBus.emit("saypi:ui:content-loaded");
              }
            }
            const ctrlPanelObs = this.findControlPanel(removedElement);
            if (ctrlPanelObs.found) {
              // Control panel is being removed, so search for a replacement in the main document
              this.findAndDecorateControlPanel(document.body);
            }
            const audioControlsObs = this.findAudioControls(removedElement);
            if (audioControlsObs.found) {
              // Audio controls are being removed, so search for a replacement in the main document
              this.findAndDecorateAudioControls(document.body);
            }
            const audioOutputButtonObs =
              this.findAudioOutputButton(removedElement);
            if (audioOutputButtonObs.found) {
              // Audio output button is being removed, so search for a replacement in the main document
              this.findAndDecorateAudioOutputButton(document.body);
            }
            const chatHistoryObs = this.findChatHistory(removedElement);
            if (chatHistoryObs.found) {
              // Chat history is being removed, so search for a replacement in the main document
              this.findAndDecorateChatHistory(document.body);
            }
          });
      });
    });

    // Start observing
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Function to decorate the prompt input element, and other elements that depend on it
  decoratePrompt(prompt: HTMLInputElement): void {
    prompt.id = "saypi-prompt";
    const promptParent = prompt.parentElement;
    if (promptParent) {
      promptParent.classList.add("saypi-prompt-container");
      const promptGrandparent = promptParent.parentElement;
      if (promptGrandparent) {
        promptGrandparent.id = "saypi-prompt-controls-container";
        this.addIdPromptAncestor(promptGrandparent);
        this.addIdSubmitButton(promptGrandparent);
        buttonModule.createCallButton(promptGrandparent, -1);
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

  decorateControlPanel(controlPanel: HTMLElement): void {
    const id = "saypi-control-panel-main";
    controlPanel.id = id;
    controlPanel.classList.add("saypi-control-panel");

    const toggleModeBtnPos = 1;
    buttonModule.createEnterButton(controlPanel, toggleModeBtnPos);
    buttonModule.createExitButton(controlPanel, toggleModeBtnPos);
    buttonModule.createThemeToggleButton(controlPanel, toggleModeBtnPos + 2);
  }

  findAndDecorateControlPanel(searchRoot: Element): Observation {
    const obs = this.findControlPanel(searchRoot);
    if (obs.found && obs.isNew && !obs.decorated) {
      this.decorateControlPanel(obs.target as HTMLElement);
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

  addIdSubmitButton(container: Element) {
    const submitButtons = container.querySelectorAll("button[type=button]");
    if (submitButtons.length > 0) {
      const lastSubmitButton = submitButtons[submitButtons.length - 1];
      lastSubmitButton.id = "saypi-submitButton";
    }
  }

  addIdPromptAncestor(container: Element) {
    // climb up the DOM tree until we find a div with class 'w-full'
    let parent = container.parentElement;
    while (parent) {
      if (parent.classList.contains("w-full")) {
        parent.id = "saypi-prompt-ancestor";
        return true;
      }
      parent = parent.parentElement;
    }
    return false;
  }

  findPromptField(searchRoot: Element): Observation {
    const id = "saypi-prompt";
    const existingPrompt = document.getElementById(id);
    if (existingPrompt) {
      // Prompt already exists, no need to search
      return Observation.foundAlreadyDecorated(id, existingPrompt);
    }

    const promptInput = searchRoot.querySelector(
      this.chatbot.getPromptTextInputSelector()
    );
    if (promptInput) {
      return Observation.foundUndecorated(id, promptInput);
    }
    return Observation.notFound(id);
  }

  findAndDecoratePromptField(searchRoot: Element): Observation {
    const obs = this.findPromptField(searchRoot);
    if (obs.found && obs.isNew && !obs.decorated) {
      this.decoratePrompt(obs.target as HTMLInputElement);
    }
    return Observation.foundAndDecorated(obs);
  }

  findAudioControls(searchRoot: Element): Observation {
    const id = "saypi-audio-controls";
    const existingAudioControls = document.getElementById(id);
    if (existingAudioControls) {
      // Audio controls already exist, no need to search
      return Observation.foundAlreadyDecorated(id, existingAudioControls);
    }

    const audioControls = searchRoot.querySelector(
      this.chatbot.getAudioControlsSelector()
    );
    if (audioControls) {
      return Observation.foundUndecorated(id, audioControls);
    }
    return Observation.notFound(id);
  }

  decorateAudioControls(audioControls: HTMLElement): void {
    audioControls.id = "saypi-audio-controls";
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
    const chatHistory = searchRoot.querySelector(
      this.chatbot.getChatHistorySelector()
    );
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
    }
    return Observation.foundAndDecorated(obs);
  }
}
