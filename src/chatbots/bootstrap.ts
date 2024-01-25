import { Chatbot } from "./Chatbot";
import { PiAIChatbot } from "./Pi";
import { buttonModule } from "../ButtonModule.js";
import EventBus from "../EventBus.js";
import { add } from "lodash";

class Observation {
  constructor(
    public readonly target: Element | null,
    public readonly id: string,
    public readonly found: boolean,
    public readonly isNew: boolean,
    public readonly decorated: boolean
  ) {}

  // Whether the observed element is fully loaded and ready to be used
  isReady(): boolean {
    return this.found && this.isNew && this.decorated;
  }

  // Whether the observed element has been found, but not yet decorated with the extension's enhancements
  undecorated(): boolean {
    return this.found && this.isNew && !this.decorated;
  }

  // Where the element does not exist in the DOM
  static notFound(id: string): Observation {
    return new Observation(null, id, false, false, false);
  }
  // Where the element exists in the DOM, and has already been decorated with the extension's enhancements
  static foundExisting(id: string, element: Element): Observation {
    return new Observation(element, id, true, false, true);
  }
  // Where the element exists in the DOM, and has newly been decorated with the extension's enhancements
  static decorated(obs: Observation): Observation {
    return new Observation(obs.target, obs.id, obs.found, obs.isNew, true);
  }
  // Where the element exists in the DOM, but has not been decorated with the extension's enhancements
  static notDecorated(id: string, element: Element): Observation {
    return new Observation(element, id, true, true, false);
  }
}

const chatbot: Chatbot = new PiAIChatbot();

export function observeDOM(): void {
  // MutationObserver setup in a separate file or the same file where you start observing
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      [...mutation.addedNodes]
        .filter((node) => node instanceof Element)
        .forEach((node) => {
          const addedElement = node as Element;
          const promptObs = findAndDecoratePromptField(addedElement);
          const ctrlPanelObs = findAndDecorateControlPanel(addedElement);
          const audioControlsObs = findAndDecorateAudioControls(addedElement);
          // ... handle other elements

          // notify listeners that (all critical) script content has been loaded
          if (promptObs.isReady()) {
            EventBus.emit("saypi:ui:content-loaded");
          }
        });
      [...mutation.removedNodes]
        .filter((node) => node instanceof Element)
        .forEach((node) => {
          const removedElement = node as Element;
          const obs = findPromptField(removedElement);
          if (obs.found) {
            // Prompt field is being removed, so search for a replacement in the main document
            findAndDecoratePromptField(document.body);
            if (obs.found && obs.isNew && obs.decorated) {
              // emit event to notify listeners that script content has been loaded
              EventBus.emit("saypi:ui:content-loaded");
            }
          }
          const ctrlPanelObs = findControlPanel(removedElement);
          if (ctrlPanelObs.found) {
            // Control panel is being removed, so search for a replacement in the main document
            findAndDecorateControlPanel(document.body);
          }
          const audioControlsObs = findAudioControls(removedElement);
          if (audioControlsObs.found) {
            // Audio controls are being removed, so search for a replacement in the main document
            findAndDecorateAudioControls(document.body);
          }
        });
    });
  });

  // Start observing
  observer.observe(document.body, { childList: true, subtree: true });
}

// Function to decorate the prompt input element, and other elements that depend on it
function decoratePrompt(prompt: HTMLInputElement): void {
  console.log("Decorating prompt input", prompt);
  prompt.id = "saypi-prompt";
  const promptParent = prompt.parentElement;
  if (promptParent) {
    promptParent.classList.add("saypi-prompt-container");
    const promptGrandparent = promptParent.parentElement;
    if (promptGrandparent) {
      promptGrandparent.id = "saypi-prompt-controls-container";
      addIdPromptAncestor(promptGrandparent);
      addIdSubmitButton(promptGrandparent);
      buttonModule.createCallButton(promptGrandparent, -1);
    }
  }
}

/**
 * Identifies and returns the row containing the discover and threads buttons on pi.ai
 * @returns {element: HTMLElement | null, new: boolean} the container element for the control panel, and whether it was newly created
 */
function findControlPanel(searchRoot: Element): Observation {
  const id = "saypi-control-panel-main";
  var mainControlPanel = document.getElementById(id);
  if (mainControlPanel) {
    return Observation.foundExisting(id, mainControlPanel);
  }
  mainControlPanel = searchRoot.querySelector(
    chatbot.getControlPanelSelector()
  );
  if (!mainControlPanel) {
    return Observation.notFound(id);
  }
  return new Observation(mainControlPanel, id, true, true, false);
}

function decorateControlPanel(controlPanel: HTMLElement): void {
  const id = "saypi-control-panel-main";
  controlPanel.id = id;
  controlPanel.classList.add("saypi-control-panel");

  const toggleModeBtnPos = 1;
  buttonModule.createEnterButton(controlPanel, toggleModeBtnPos);
  buttonModule.createExitButton(controlPanel, toggleModeBtnPos);
}

function findAndDecorateControlPanel(searchRoot: Element): Observation {
  const obs = findControlPanel(searchRoot);
  if (obs.found && obs.isNew && !obs.decorated) {
    decorateControlPanel(obs.target as HTMLElement);
  }
  return Observation.decorated(obs);
}

function addIdSubmitButton(container: Element) {
  const submitButtons = container.querySelectorAll("button[type=button]");
  if (submitButtons.length > 0) {
    const lastSubmitButton = submitButtons[submitButtons.length - 1];
    lastSubmitButton.id = "saypi-submitButton";
  }
}

function addIdPromptAncestor(container: Element) {
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

function findPromptField(searchRoot: Element): Observation {
  const id = "saypi-prompt";
  const existingPrompt = document.getElementById(id);
  if (existingPrompt) {
    // Prompt already exists, no need to search
    return Observation.foundExisting(id, existingPrompt);
  }

  const promptInput = searchRoot.querySelector(
    chatbot.getPromptTextInputSelector()
  );
  if (promptInput) {
    return Observation.notDecorated(id, promptInput);
  }
  return Observation.notFound(id);
}

function findAndDecoratePromptField(searchRoot: Element): Observation {
  const obs = findPromptField(searchRoot);
  if (obs.found && obs.isNew && !obs.decorated) {
    decoratePrompt(obs.target as HTMLInputElement);
  }
  return Observation.decorated(obs);
}

function findAudioControls(searchRoot: Element): Observation {
  const id = "saypi-audio-controls";
  const existingAudioControls = document.getElementById(id);
  if (existingAudioControls) {
    // Audio controls already exist, no need to search
    return Observation.foundExisting(id, existingAudioControls);
  }

  const audioControls = searchRoot.querySelector(
    chatbot.getAudioControlsSelector()
  );
  if (audioControls) {
    return Observation.notDecorated(id, audioControls);
  }
  return Observation.notFound(id);
}

function decorateAudioControls(audioControls: HTMLElement): void {
  audioControls.id = "saypi-audio-controls";
}

function findAndDecorateAudioControls(searchRoot: Element): Observation {
  const obs = findAudioControls(searchRoot);
  if (obs.undecorated()) {
    decorateAudioControls(obs.target as HTMLElement);
  }
  return Observation.decorated(obs);
}
