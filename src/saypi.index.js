import AudioModule from "./AudioModule.js";
import { buttonModule } from "./ButtonModule.js";
import EventModule from "./EventModule.js";
import { addUserAgentFlags, initMode } from "./UserAgentModule.js";
import { submitErrorHandler } from "./SubmitErrorHandler.ts";
import getMessage from "./i18n.ts";
import { observeDOM } from "./chatbots/bootstrap.ts";
import EventBus from "./EventBus.js";

import "./styles/common.scss";
import "./styles/desktop.scss";
import "./styles/mobile.scss";
import "./styles/rectangles.css";

(async function () {
  "use strict";

  function startAudioModule() {
    const audioModule = new AudioModule();
    audioModule.start();
  }

  var isLoaded = false;
  EventBus.on("saypi:ui:content-loaded", function () {
    if (isLoaded) {
      return;
    }
    console.log("Content loaded. Initializing...");
    submitErrorHandler.initAudioOutputListener();
    submitErrorHandler.checkForRestorePoint();
    initMode();
    startAudioModule();
    isLoaded = true;
  });

  addUserAgentFlags();
  EventModule.init();
  observeDOM();

  function annotateDOM(prompt) {
    // Add id attributes to important elements

    const foundFooter = addIdFooter();
    const foundAudioControls = addIdAudioControls();
    const foundAudioOutputButton = addIdAudioOutputButton();

    addTalkButton(document.body);
    addLockButtons(document.body);

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
  //observer.observe(document, { childList: true, subtree: true });
})();
