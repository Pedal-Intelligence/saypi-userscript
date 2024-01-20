import AudioModule from "./AudioModule.js";
import { buttonModule } from "./ButtonModule.js";
import EventModule from "./EventModule.js";
import { addUserAgentFlags, initMode } from "./UserAgentModule.js";
import { submitErrorHandler } from "./SubmitErrorHandler.ts";
import getMessage from "./i18n.ts";

import "./styles/common.scss";
import "./styles/desktop.scss";
import "./styles/mobile.scss";
import "./styles/rectangles.css";
import { SpeechSynthesisModule } from "./tts/SpeechSynthesisModule.ts";
import { UserPreferenceModule } from "./prefs/PreferenceModule.ts";
import EventBus from "./EventBus.js";

(async function () {
  "use strict";

  function startAudioModule() {
    const audioModule = new AudioModule();
    audioModule.start();
  }

  addUserAgentFlags();
  EventModule.init();

  // Create a MutationObserver to listen for changes to the DOM
  // textareas are added to the DOM after the page loads
  const callback = function (mutationsList, observer) {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        // Iterate through added nodes
        mutation.addedNodes.forEach((node) => {
          // Check if added node is a textarea with 'enterkeyhint' attribute
          if (
            node.nodeName === "TEXTAREA" &&
            node.hasAttribute("enterkeyhint")
          ) {
            if (!document.getElementById("saypi-prompt")) {
              annotateDOM(node);
            }
            return;
          }

          // Check if added node contains a textarea with 'enterkeyhint' attribute
          if (node.querySelectorAll) {
            const textareas = node.querySelectorAll("textarea[enterkeyhint]");
            if (
              textareas.length > 0 &&
              !document.getElementById("saypi-prompt")
            ) {
              // Do something with the first textarea that has 'enterkeyhint'
              annotateDOM(textareas[0]);
              submitErrorHandler.initAudioOutputListener();
              submitErrorHandler.checkForRestorePoint();
              return;
            }
          }
        });
      }
    }
  };

  // Options for the observer (which mutations to observe)
  const config = { attributes: false, childList: true, subtree: true };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(document.body, config);

  function annotateDOM(prompt) {
    // Add id attributes to important elements
    prompt.id = "saypi-prompt";
    prompt.parentElement.classList.add("saypi-prompt-container");
    const foundFooter = addIdFooter();
    const foundAudioControls = addIdAudioControls();
    if (foundAudioControls) {
      addIdVoiceMenu();
      restyleVoiceMenuControls();
      addVoiceMenuExpansionListener();
      addVoiceButtonAdditionListener();
    }
    const promptControlsContainer = prompt.parentElement.parentElement;
    promptControlsContainer.id = "saypi-prompt-controls-container";
    const foundPromptAncestor = addIdPromptAncestor(promptControlsContainer);
    const foundAudioOutputButton = addIdAudioOutputButton();
    addIdSubmitButton(promptControlsContainer);
    const foundChatHistory = addIdChatHistory();
    if (foundChatHistory) {
      registerChatHistoryListener();
    }
    addTalkButton(document.body);
    addLockButtons(document.body);
    buttonModule.createCallButton(promptControlsContainer, -1);
    buttonModule.createEnterButton();
    buttonModule.createExitButton();
    initMode();
  }

  function addIdChatHistory() {
    const chatHistory = document.querySelector("div.t-body-chat");
    if (!chatHistory) {
      return false;
    } else {
      chatHistory.id = "saypi-chat-history";
    }
    return true;
  }

  function addIdPromptAncestor(container) {
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

  function addIdSubmitButton(container) {
    const submitButtons = container.querySelectorAll("button[type=button]");
    if (submitButtons.length > 0) {
      const lastSubmitButton = submitButtons[submitButtons.length - 1];
      lastSubmitButton.id = "saypi-submitButton";
    }
  }

  function addIdFooter() {
    // Find all audio elements on the page
    var audioElements = document.querySelectorAll("audio");
    var found = false; // default to not found

    audioElements.forEach(function (audio) {
      var precedingDiv = audio.previousElementSibling;

      // If we've already found a div, we can skip further iterations
      if (found) return;

      // Check if the preceding element is a div
      if (precedingDiv && precedingDiv.tagName.toLowerCase() === "div") {
        // Assign an ID to the div
        precedingDiv.lastElementChild.id = "saypi-footer";
        found = true; // set to found
      }
    });

    return found;
  }

  function addIdAudioControls() {
    // Find all audio elements on the page
    var audioElements = document.querySelectorAll("audio");
    var found = false; // default to not found

    audioElements.forEach(function (audio) {
      var nextDiv = audio.nextElementSibling;

      // If we've already found a div, we can skip further iterations
      if (found) return;

      // Check if the preceding element is a div
      if (nextDiv && nextDiv.tagName.toLowerCase() === "div") {
        // Assign an ID to the div
        nextDiv.id = "saypi-audio-controls";
        found = true; // set to found
      }
    });

    return found;
  }

  function addIdVoiceMenu() {
    // voice selection menu is the first div descendent of the audio controls container with a class 't-action-m'
    const audioControlsContainer = document.getElementById(
      "saypi-audio-controls"
    );
    if (!audioControlsContainer) {
      return false;
    }
    const voiceMenu = audioControlsContainer.querySelector("div.t-action-m");
    if (!voiceMenu) {
      return false;
    } else {
      voiceMenu.id = "saypi-voice-menu";
    }
    return true;
  }

  function restyleVoiceMenuControls() {
    const voiceMenu = document.getElementById("saypi-voice-menu");
    if (!voiceMenu) {
      return false;
    }
    const voiceMenuControls = voiceMenu.nextSibling;
    if (!voiceMenuControls) {
      return false;
    }
    voiceMenuControls.id = "saypi-voice-menu-controls";

    // Create a MutationObserver instance
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

    // Start observing the voiceMenuControls for configuration changes
    observer.observe(voiceMenuControls, {
      attributes: true,
      attributeFilter: ["class"],
    });
  }

  function registerVoiceChangeHandler(menu) {
    // for each pre-existing voice button in the menu, add a click handler to unset the voice
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
          markVoiceButtonAsSelected(button);
        });
      });
    });
  }

  function addVoiceMenuExpansionListener() {
    const audioControlsContainer = document.getElementById(
      "saypi-audio-controls"
    );
    const voiceMenu = document.getElementById("saypi-voice-menu");

    if (!audioControlsContainer || !voiceMenu) {
      return false;
    }

    const observerCallback = async function (mutationsList, observer) {
      const saypiCustomVoiceIsSelected =
        (await UserPreferenceModule.getVoice()) !== null;
      for (let mutation of mutationsList) {
        if (mutation.type === "childList") {
          for (let node of mutation.addedNodes) {
            // the addition of a button with an aria-label giving instructions to "close the menu", indicates the voice menu is expanded
            if (
              node.nodeName === "BUTTON" &&
              node.getAttribute("aria-label") &&
              node === audioControlsContainer.firstChild
            ) {
              voiceMenu.classList.add("expanded");
              // mark the selected voice each time the menu is expanded (because pi.ai recreates the menu each time)
              addVoicesToMenu(voiceMenu);
              registerVoiceChangeHandler(voiceMenu);
            }
          }
          for (let node of mutation.removedNodes) {
            if (node.nodeName === "BUTTON" && node.getAttribute("aria-label")) {
              voiceMenu.classList.remove("expanded");
              return;
            }
          }
        }
      }
    };

    const observer = new MutationObserver(observerCallback);
    observer.observe(audioControlsContainer, { childList: true });
  }

  function introduceVoice(voice) {
    const introduction = "Hello, World!";
    const speechSynthesis = new SpeechSynthesisModule();
    speechSynthesis.createSpeech(introduction).then((utterance) => {
      speechSynthesis.speak(utterance);
    });
  }

  function populateVoices(voices, menu) {
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
          markVoiceButtonAsSelected(button);
          introduceVoice(voice);
        });
      });
      button.dataset.voiceId = voice.id;
      customVoiceButtons.push(button);
    });

    // add the custom voice buttons to the start of the menu
    customVoiceButtons.reverse().forEach((button) => {
      menu.insertBefore(button, menu.firstChild);
    });

    return true;
  }

  function isBuiltInVoiceButton(button) {
    return !button.classList.contains("saypi-voice-button");
  }

  function addVoiceButtonAdditionListener() {
    const voiceMenu = document.getElementById("saypi-voice-menu");
    if (!voiceMenu) {
      return false;
    }
    // observe the voice menu for changes to child nodes
    // if a button is added that does not have class 'saypi-voice-button', evaluate whether it should be marked as selected
    const observerCallback = function (mutationsList, observer) {
      for (let mutation of mutationsList) {
        if (mutation.type === "childList") {
          for (let node of mutation.addedNodes) {
            if (node.nodeName === "BUTTON") {
              // a voice button was added to the menu that is not a custom voice button
              // if a voice is selected, mark the button as selected
              UserPreferenceModule.getVoice().then((voice) => {
                const customVoiceIsSelected = voice !== null;
                if (customVoiceIsSelected) {
                  if (isBuiltInVoiceButton(node)) {
                    unmarkButtonAsSelectedVoice(node);
                  } else if (node.dataset.voiceId === voice.id) {
                    markButtonAsSelectedVoice(node);
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

  function addVoicesToMenu(voiceMenu) {
    const speechSynthesis = new SpeechSynthesisModule();
    speechSynthesis.getVoices().then((voices) => {
      populateVoices(voices, voiceMenu);
    });
  }

  function markButtonAsSelectedVoice(button) {
    button.disabled = true;
    button.classList.add("selected", "bg-neutral-300", "text-primary-700");
    button.classList.remove("hover:bg-neutral-300");
  }

  function unmarkButtonAsSelectedVoice(button) {
    button.disabled = false;
    button.classList.remove("selected", "bg-neutral-300", "text-primary-700");
    button.classList.add("hover:bg-neutral-300");
  }

  /**
   * Mark the specified button as the selected voice, and unmark all other buttons
   * @param {HTMLButtonElement} button
   * @returns void
   */
  async function markVoiceButtonAsSelected(button) {
    const voiceMenu = document.getElementById("saypi-voice-menu");
    if (!voiceMenu) {
      return false;
    }

    // iterative over buttons in the menu, and mark the selected voice
    const voiceButtons = voiceMenu.querySelectorAll("button");
    if (!voiceButtons || voiceButtons.length === 0) {
      return false;
    }
    voiceButtons.forEach((button) => {
      unmarkButtonAsSelectedVoice(button);
    });
    markButtonAsSelectedVoice(button);
  }

  async function registerChatHistoryListener() {
    const chatHistory = document.getElementById("saypi-chat-history");
    if (!chatHistory) {
      return;
    }
    let lastMessage = null;
    const debouncedEmit = _.debounce((lastMessage) => {
      console.log("Pi said:", lastMessage.innerText);
      EventBus.emit("assistant-message-received", {
        role: "assistant",
        content: lastMessage.innerText,
        streaming: true,
      });
    }, 0); // ms delay before emitting event

    const speechSynthesis = new SpeechSynthesisModule();

    const observerCallback = function (mutationsList, observer) {
      for (let mutation of mutationsList) {
        if (mutation.type === "childList") {
          for (let node of mutation.addedNodes) {
            if (
              node.nodeName === "DIV" &&
              node.classList.contains("break-anywhere") &&
              !node.classList.contains("justify-end")
            ) {
              // a new chat message was added to the chat history
              console.log("chat message added to chat history", node);
              node.classList.add("chat-message", "assistant-message");
              speechSynthesis.createSpeechStream().then((utterance) => {
                node.dataset.utteranceId = utterance.id;
              });
              lastMessage = node;
            } else if (node.nodeName === "SPAN") {
              // streaming text initially appears as within a span node with style display: none and opacity: 0
              speechSynthesis.addSpeechToStream(
                lastMessage.dataset.utteranceId,
                node.innerText
              );
            }
          }
        }
      }
    };
    const observer = new MutationObserver(observerCallback);
    observer.observe(chatHistory, { childList: true, subtree: true });
  }

  function addIdAudioOutputButton() {
    // audio button is the last button element in the audio controls container
    const audioButton = document.querySelector(
      "#saypi-audio-controls > div > div.relative.flex.items-center.justify-end.self-end.p-2 > button"
    );
    if (!audioButton) {
      return false;
    } else {
      audioButton.id = "saypi-audio-output-button";
    }
    return true;
  }

  function addTalkButton(container) {
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
    button.classList.add(classNames.split(" "));

    panel.appendChild(button);
    buttonModule.addTalkIcon(button);

    // Call the function to inject the script after the button has been added
    startAudioModule();
  }

  function addLockButtons(container) {
    // Create a containing div
    var panel = document.createElement("div");
    panel.id = "saypi-lock-panel";
    panel.classList.add("unlocked");

    if (container) {
      container.appendChild(panel);
    } else {
      document.body.appendChild(panel);
    }

    var lockButton = buttonModule.createLockButton(panel);
    var unlockButton = buttonModule.createUnlockButton(panel);
    var touchAbsorber = document.createElement("div");
    touchAbsorber.id = "saypi-touch-absorber";
    panel.appendChild(touchAbsorber);

    var lockedText = document.createElement("p");
    lockedText.id = "saypi-locked-text";
    lockedText.innerHTML = getMessage("lockedScreen");
    panel.appendChild(lockedText);
    var unlockInstruction = document.createElement("span");
    unlockInstruction.id = "saypi-unlock-instruction";
    unlockInstruction.classList.add("subtext");
    unlockInstruction.innerHTML = getMessage("unlockInstruction");
    lockedText.appendChild(unlockInstruction);
  }

  // Start observing the entire document for changes to child nodes and subtree
  observer.observe(document, { childList: true, subtree: true });
})();
