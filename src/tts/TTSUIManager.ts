import {
  SpeechSynthesisModule,
  SpeechSynthesisUtteranceRemote,
  SpeechSynthesisVoiceRemote,
} from "./SpeechSynthesisModule";
import { UserPreferenceModule } from "../prefs/PreferenceModule";
import { Chatbot } from "../chatbots/Chatbot";
import { ElementTextStream } from "./InputStream";
import { buttonModule } from "../ButtonModule";
import { getResourceUrl } from "../ResourceModule";
import getMessage from "../i18n";
import { BillingModule } from "../billing/BillingModule";

class AssistantResponse {
  private _element: HTMLElement;
  private utteranceId: string | null = null;

  constructor(element: HTMLElement) {
    this._element = element;
    element.classList.add("chat-message", "assistant-message");
  }

  get text(): string {
    return this._element.innerText;
  }

  get element(): HTMLElement {
    return this._element;
  }

  get isTTSEnabled(): boolean {
    return this.utteranceId !== null;
  }

  enableTTS(utteranceId: string): void {
    this.utteranceId = utteranceId;
    this._element.dataset.utteranceId = utteranceId;
  }
}

export class TextToSpeechUIManager {
  private billingModule = BillingModule.getInstance();

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

  private elementStream: ElementTextStream | null = null;

  observeChatMessageElement(
    message: HTMLElement,
    utterance: SpeechSynthesisUtteranceRemote,
    hoverMenu: HTMLElement | null
  ): void {
    // If we're already observing an element, disconnect from it
    if (this.elementStream) {
      this.elementStream.disconnect();
    }

    const speechSynthesis = SpeechSynthesisModule.getInstance();
    // Start observing the new element
    this.elementStream = new ElementTextStream(message);
    this.elementStream.getStream().subscribe(
      (text) => {
        if (text.trim()) {
          console.log(`Streamed text from element: "${text}"`);
          speechSynthesis.addSpeechToStream(utterance.id, text);
          utterance.text += text;
        }
      },
      (error) => {
        console.error(`Error occurred streaming text from element: ${error}`);
      },
      () => {
        console.log(
          "Element text stream complete. Please end the tts input stream."
        );
        speechSynthesis.endSpeechStream(utterance.id);
        if (hoverMenu) {
          this.addCostBasis(hoverMenu, utterance.text.length, utterance.voice);
        }
        this.billingModule.charge(utterance);
      }
    );
  }
  /**
   * Add the cost of the TTS stream to the chat message
   * @param container The menu element to add the cost basis to
   * @param characterCount The number of characters in the message
   */
  addCostBasis(
    container: HTMLElement,
    characterCount: number,
    voice: SpeechSynthesisVoiceRemote
  ) {
    const pricePer1kCharacters = voice.price;
    const cost = (characterCount / 1000) * pricePer1kCharacters;
    const currency = getMessage("currencyUSDAbbreviation");
    const costElement = document.createElement("div");
    costElement.classList.add("text-sm", "text-neutral-500", "saypi-cost");
    costElement.title = getMessage("ttsCostExplanation", [
      cost.toFixed(2),
      currency,
    ]);
    costElement.innerHTML = `Cost: $${cost.toFixed(2)}`;
    container.appendChild(costElement);

    const poweredByElement = document.createElement("div");
    const ttsEngine = voice.powered_by;
    const ttsLabel = getMessage("ttsPoweredBy", ttsEngine);
    poweredByElement.classList.add(
      "text-sm",
      "text-neutral-500",
      "saypi-powered-by"
    );
    poweredByElement.title = ttsLabel;
    const logoImageUrl = getResourceUrl(
      `icons/logos/${ttsEngine.toLowerCase()}.svg`
    );
    poweredByElement.innerHTML = `<img src="${logoImageUrl}" alt="${ttsLabel}" class="h-4 w-4 inline-block">`;
    costElement.appendChild(poweredByElement);
  }

  // Chat history and automatic speech functionality
  assistantChatMessageAdded(message: AssistantResponse): void {
    const speechSynthesis = SpeechSynthesisModule.getInstance();
    speechSynthesis.isEnabled().then((isEnabled) => {
      if (isEnabled) {
        speechSynthesis.createSpeechStream().then((utterance) => {
          message.enableTTS(utterance.id);
          console.log("Created audio stream", utterance.id);
          const initialText = message.text;
          // send the initial text to the stream only if it's not empty
          if (initialText.trim()) {
            console.log(`Streaming text began with "${initialText}"`);
            speechSynthesis.addSpeechToStream(utterance.id, initialText);
          }
          let messageContent: HTMLElement | null = null;
          let hoverMenu: HTMLDivElement | null = null;
          let ttsControls: HTMLElement | null = null;
          if (message.element.children.length > 0) {
            messageContent = message.element.children[0] as HTMLElement;
            messageContent.classList.add("message-content");
          }
          if (message.element.children.length > 1) {
            hoverMenu = message.element.children[1] as HTMLDivElement;
            hoverMenu.classList.add("message-hover-menu");
            if (hoverMenu.children.length > 0) {
              const createThreadButton = hoverMenu
                .children[0] as HTMLDivElement;
              createThreadButton.classList.add("create-thread-button");
            }
            ttsControls = document.createElement("div");
            ttsControls.classList.add("saypi-tts-controls", "pt-4");
            hoverMenu.appendChild(ttsControls);
            this.addSpeechButton(speechSynthesis, utterance, ttsControls);
          }
          this.autoplaySpeech(speechSynthesis, utterance); // handle any errors
          this.observeChatMessageElement(
            messageContent || message.element,
            utterance,
            ttsControls
          );
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
              this.assistantChatMessageAdded(new AssistantResponse(node));
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
    container: HTMLElement
  ): void {
    const button = buttonModule.createSpeechButton();
    button.addEventListener("click", () => {
      speechSynthesis
        .speak(utterance)
        .then(() => console.log("Reading chat message aloud")) // start streaming output
        .catch((error) =>
          console.error(`Error occurred reading chat message: ${error}`)
        ); // handle any errors
    });
    container.appendChild(button);
  }

  autoplaySpeech(
    speechSynthesis: SpeechSynthesisModule,
    utterance: SpeechSynthesisUtteranceRemote
  ) {
    // wait a beat, then start streaming the utterance
    setTimeout(() => {
      speechSynthesis
        .speak(utterance)
        .then(() => console.log("Automatically reading chat message aloud")) // start streaming output
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
