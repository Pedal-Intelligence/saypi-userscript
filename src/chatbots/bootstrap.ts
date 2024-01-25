import { Chatbot } from "./Chatbot";
import { PiAIChatbot } from "./Pi";
import { buttonModule } from "../ButtonModule.js";
import { find } from "lodash";

class Observation {
  constructor(
    public readonly target: Element | null,
    public readonly id: string,
    public readonly found: boolean,
    public readonly isNew: boolean,
    public readonly decorated: boolean
  ) {}
}

const chatbot: Chatbot = new PiAIChatbot();

export function observeDOM(): void {
  // MutationObserver setup in a separate file or the same file where you start observing
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      [...mutation.addedNodes]
        .filter((node) => node instanceof Element)
        .forEach((node) => {
          const element = node as Element;
          findAndDecoratePromptField(element);
          // ... handle other elements
        });
      [...mutation.removedNodes]
        .filter((node) => node instanceof Element)
        .forEach((node) => {
          const element = node as Element;
          const obs = findPromptField(element);
          if (obs.found) {
            // Prompt field is being removed, so search for a replacement in the main document
            findAndDecoratePromptField(document.body);
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
    return new Observation(existingPrompt, id, true, false, true);
  }

  const promptInput = searchRoot.querySelector(
    chatbot.getPromptTextInputSelector()
  );
  if (promptInput) {
    return new Observation(promptInput, id, true, true, false);
  }
  return new Observation(null, id, false, false, false);
}

function findAndDecoratePromptField(searchRoot: Element): Observation {
  const obs = findPromptField(searchRoot);
  if (obs.found && obs.isNew && !obs.decorated) {
    decoratePrompt(obs.target as HTMLInputElement);
  }
  return new Observation(obs.target, obs.id, obs.found, obs.isNew, true);
}
// ... make sure to handle disconnection of observer when not needed to avoid performance issues
