import {
  SpeechSynthesisModule,
  SpeechSynthesisUtteranceRemote,
  SpeechSynthesisVoiceRemote,
} from "./SpeechSynthesisModule";
import { UserPreferenceModule } from "../prefs/PreferenceModule";
import { Chatbot } from "../chatbots/Chatbot";

export class TextToSpeechUIManager {
  // Methods for DOM manipulation and element ID assignment
  addIdChatHistory(): boolean {
    const chatHistory = document.querySelector(
      this.chatbot.getChatHistorySelector()
    );
    if (!chatHistory) {
      return false;
    } else {
      chatHistory.id = "saypi-chat-history";
      const pastChatMessagesContainer =
        chatHistory.querySelector(":nth-child(2)");
      if (pastChatMessagesContainer) {
        pastChatMessagesContainer.id = "saypi-chat-history-past-messages";
      }
      const presentChatMessagesContainer =
        chatHistory.querySelector(":nth-child(3)");
      if (presentChatMessagesContainer) {
        presentChatMessagesContainer.id = "saypi-chat-history-present-messages";
      }
    }
    return true;
  }

  addIdVoiceMenu(): boolean {
    const audioControlsContainer = document.getElementById(
      "saypi-audio-controls"
    );
    if (!audioControlsContainer) {
      return false;
    }
    const voiceMenu = audioControlsContainer.querySelector(
      this.chatbot.getVoiceMenuSelector()
    );
    if (!voiceMenu) {
      return false;
    } else {
      voiceMenu.id = "saypi-voice-menu";
    }
    return true;
  }

  restyleVoiceMenuControls(): boolean {
    const voiceMenu = document.getElementById("saypi-voice-menu");
    if (!voiceMenu) {
      return false;
    }
    const voiceMenuControls = voiceMenu.nextSibling;
    if (!voiceMenuControls || !(voiceMenuControls instanceof HTMLElement)) {
      return false;
    }
    voiceMenuControls.id = "saypi-voice-menu-controls";

    const observer = new MutationObserver((mutationsList) => {
      for (let mutation of mutationsList) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class" &&
          voiceMenuControls.classList.contains("self-end")
        ) {
          voiceMenuControls.classList.remove("self-end");
        }
      }
    });

    observer.observe(voiceMenuControls, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return true; // Assuming restyling works without further checks
  }

  // Voice selection management
  registerVoiceChangeHandler(menu: HTMLElement): boolean {
    const voiceButtons = Array.from(menu.querySelectorAll("button"));
    if (!voiceButtons || voiceButtons.length === 0) {
      return false;
    }
    const builtInPiVoiceButtons = voiceButtons.filter(
      (button) => !button.classList.contains("saypi-voice-button")
    );
    builtInPiVoiceButtons.forEach((button) => {
      button.addEventListener("click", () => {
        UserPreferenceModule.unsetVoice().then(() => {
          this.markVoiceButtonAsSelected(button);
        });
      });
    });
    return true;
  }

  addVoiceMenuExpansionListener(): boolean {
    const audioControlsContainer = document.getElementById(
      "saypi-audio-controls"
    );
    const voiceMenu = document.getElementById("saypi-voice-menu");

    if (!audioControlsContainer || !voiceMenu) {
      return false;
    }

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
              this.addVoicesToMenu(voiceMenu);
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
    return true; // Assuming listener doesn't require further checks
  }

  introduceVoice(voice: SpeechSynthesisVoiceRemote): void {
    const introduction = "Hello, World!";
    const speechSynthesis = SpeechSynthesisModule.getInstance();
    speechSynthesis.createSpeech(introduction).then((utterance) => {
      utterance.voice = voice;
      speechSynthesis.speak(utterance);
    });
  }

  populateVoices(
    voices: SpeechSynthesisVoiceRemote[],
    menu: HTMLElement
  ): boolean {
    if (!voices || voices.length === 0) {
      console.log("No voices found");
      return false;
    }

    const customVoiceButtons = Array(voices.length);

    voices.forEach((voice) => {
      // if not already in the menu, add the voice
      if (menu.querySelector(`button[data-voice-id="${voice.id}"]`)) {
        // voice already in menu, skip to next voice
        return;
      }
      const button = document.createElement("button");
      // template: <button type="button" class="mb-1 rounded px-2 py-3 text-center hover:bg-neutral-300">Pi 6</button>
      button.type = "button";
      button.classList.add(
        "mb-1",
        "rounded",
        "px-2",
        "py-3",
        "text-center",
        "hover:bg-neutral-300",
        "saypi-voice-button"
      );
      button.innerHTML = "Say, Pi - " + voice.name; // TODO: localize
      button.addEventListener("click", () => {
        UserPreferenceModule.setVoice(voice).then(() => {
          customVoiceButtons.forEach((button) => {
            this.unmarkButtonAsSelectedVoice(button);
          });
          this.markVoiceButtonAsSelected(button);
          this.introduceVoice(voice);
        });
      });
      button.dataset.voiceId = voice.id;
      customVoiceButtons.push(button);
    });

    customVoiceButtons.reverse().forEach((button) => {
      menu.insertBefore(button, menu.firstChild);
    });

    return true;
  }

  markVoiceButtonAsSelected(button: HTMLButtonElement): void {
    button.disabled = true;
    button.classList.add("selected", "bg-neutral-300", "text-primary-700");
    button.classList.remove("hover:bg-neutral-300");
  }

  addVoicesToMenu(voiceMenu: HTMLElement): void {
    const speechSynthesis = SpeechSynthesisModule.getInstance();
    speechSynthesis.getVoices().then((voices) => {
      this.populateVoices(voices, voiceMenu);
    });
  }

  markButtonAsSelectedVoice(button: HTMLButtonElement) {
    button.disabled = true;
    button.classList.add("selected", "bg-neutral-300", "text-primary-700");
    button.classList.remove("hover:bg-neutral-300");
  }

  unmarkButtonAsSelectedVoice(button: HTMLButtonElement) {
    button.disabled = false;
    button.classList.remove("selected", "bg-neutral-300", "text-primary-700");
    button.classList.add("hover:bg-neutral-300");
  }

  // Helper for identifying built-in Pi voice buttons
  isBuiltInVoiceButton(button: HTMLButtonElement): boolean {
    return !button.classList.contains("saypi-voice-button");
  }

  // Listen for additions of custom voice buttons and update selections
  addVoiceButtonAdditionListener(): void {
    const voiceMenu = document.getElementById("saypi-voice-menu");
    if (!voiceMenu) {
      return; // Assuming we exit if the voice menu is unavailable
    }

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
              // a voice button was added to the menu that is not a custom voice button
              // if a voice is selected, mark the button as selected
              UserPreferenceModule.getVoice().then((voice) => {
                const customVoiceIsSelected = voice !== null;
                if (customVoiceIsSelected) {
                  if (this.isBuiltInVoiceButton(node as HTMLButtonElement)) {
                    this.unmarkButtonAsSelectedVoice(node as HTMLButtonElement);
                  } else if (
                    (node as HTMLElement).dataset.voiceId === voice.id
                  ) {
                    // unmark all other buttons and mark this one as selected
                    const voiceButtons = Array.from(
                      voiceMenu.querySelectorAll("button")
                    );
                    voiceButtons.forEach((button) => {
                      this.unmarkButtonAsSelectedVoice(
                        button as HTMLButtonElement
                      );
                    });
                    this.markButtonAsSelectedVoice(node as HTMLButtonElement);
                  }
                }
              });
            }
          }
        }
      }
    };
    const observer = new MutationObserver(observerCallback);
    observer.observe(voiceMenu, { childList: true });
  }

  // Chat history and automatic speech functionality
  assistantChatMessageAdded(node: HTMLElement): void {
    node.classList.add("chat-message", "assistant-message");
    const speechSynthesis = SpeechSynthesisModule.getInstance();
    speechSynthesis.isEnabled().then((isEnabled) => {
      if (isEnabled) {
        speechSynthesis.createSpeechStream().then((utterance) => {
          node.dataset.utteranceId = utterance.id;
          console.log("Created audio stream", utterance.id);
          const initialText = node.innerText;
          console.log('Streaming text began with "', initialText);
          speechSynthesis.addSpeechToStream(utterance.id, initialText);
          this.addSpeechButton(speechSynthesis, utterance, node);
          this.autoplaySpeech(speechSynthesis, utterance); // handle any errors
        });
      }
    });
  }

  async registerChatHistoryListener(): Promise<void> {
    const chatHistory = document.getElementById(
      "saypi-chat-history-present-messages"
    );
    if (!chatHistory) {
      return;
    }
    let latestChatMessage: HTMLDivElement | HTMLSpanElement | null = null;
    const speechSynthesis = SpeechSynthesisModule.getInstance();

    const observerCallback = (
      mutationsList: MutationRecord[],
      observer: MutationObserver
    ) => {
      for (let mutation of mutationsList) {
        if (mutation.type === "childList") {
          for (let node of mutation.addedNodes) {
            if (
              node instanceof HTMLElement &&
              node.nodeName === "DIV" &&
              node.classList.contains("break-anywhere") &&
              !node.classList.contains("justify-end")
            ) {
              this.assistantChatMessageAdded(node);
              latestChatMessage = node;
            } else if (node.nodeName === "SPAN") {
              // streaming text initially appears as within a span node with style display: none and opacity: 0
              const streamedText = (node as HTMLSpanElement).innerText;
              speechSynthesis.isEnabled().then((isEnabled) => {
                if (
                  isEnabled &&
                  latestChatMessage &&
                  latestChatMessage.dataset.utteranceId
                ) {
                  console.log('Streaming text "', streamedText, '"');
                  speechSynthesis.addSpeechToStream(
                    latestChatMessage.dataset.utteranceId,
                    streamedText
                  );
                }
              });
            }
          }
        }
      }
    };

    const observer = new MutationObserver(observerCallback);
    observer.observe(chatHistory, { childList: true, subtree: true });
  }

  addSpeechButton(
    speechSynthesis: SpeechSynthesisModule,
    utterance: SpeechSynthesisUtteranceRemote,
    node: HTMLElement
  ): void {
    const button = document.createElement("button");
    button.type = "button";
    button.classList.add(
      "ml-2",
      "rounded",
      "px-2",
      "py-3",
      "text-center",
      "hover:bg-neutral-300",
      "saypi-chat-message-button"
    );
    button.innerHTML = "Read aloud"; // TODO: localize
    button.addEventListener("click", () => {
      speechSynthesis
        .speak(utterance)
        .then(() => console.log("Reading chat message aloud")) // start streaming output
        .catch((error) =>
          console.error(`Error occurred reading chat message: ${error}`)
        ); // handle any errors
    });
    node.appendChild(button);
  }

  autoplaySpeech(
    speechSynthesis: SpeechSynthesisModule,
    utterance: SpeechSynthesisUtteranceRemote
  ) {
    // wait a beat, then start streaming the utterance
    setTimeout(() => {
      speechSynthesis
        .speak(utterance)
        .then(() => console.log("Reading chat message aloud")) // start streaming output
        .catch((error) =>
          console.error(`Error occurred reading chat message: ${error}`)
        ); // handle any errors
    }, 1000);
  }

  // Constructor
  constructor(private chatbot: Chatbot) {
    this.addIdChatHistory();
    this.addIdVoiceMenu();
    this.restyleVoiceMenuControls();
    this.addVoiceMenuExpansionListener();
    this.addVoiceButtonAdditionListener();
    this.registerChatHistoryListener();
  }
}
