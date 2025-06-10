import AudioModule from "./audio/AudioModule.js";
import { buttonModule } from "./ButtonModule.js";
import EventModule from "./events/EventModule.js";
import { addUserAgentFlags } from "./UserAgentModule.ts";
import { ImmersionService } from "./ImmersionService.js";
import { submitErrorHandler } from "./SubmitErrorHandler.ts";
import getMessage from "./i18n.ts";
import { DOMObserver } from "./chatbots/bootstrap.ts";
import EventBus from "./events/EventBus.js";
import { getJwtManager } from "./JwtManager.ts";
import telemetryModule from "./TelemetryModule.ts";

import "./styles/common.scss";
import "./styles/desktop.scss";
import "./styles/mobile.scss";
import "./styles/rectangles.css";
import "./styles/claude.scss"; // scoped by chatbot flags, i.e. <body class="claude">
import "./styles/pi.scss"; // scoped by chatbot flags, i.e. <body class="pi">
import { ChatbotService } from "./chatbots/ChatbotService.ts";
import { addChild } from "./dom/DOMModule.ts";
import SlowResponseHandler from "./SlowResponseHandler.ts";
import { UniversalDictationModule } from "./UniversalDictationModule.ts";

(async function () {
  "use strict";

  const chatbot = await ChatbotService.getChatbot();
  const audioModule = AudioModule.getInstance(); // inits the audio module's offline functions
  
  // Initialize telemetry module
  console.debug("Initializing telemetry module");
  telemetryModule; // This will invoke the getInstance() singleton which sets up event listeners

  // Setup listener for authentication status changes from background script
  function setupAuthListener() {
    console.log("Setting up authentication listener in content script");
    
    // Check auth status on initial load
    chrome.runtime.sendMessage({ type: "GET_AUTH_STATUS" }, (response) => {
      if (response && response.isAuthenticated !== undefined) {
        console.log("Initial authentication status:", response.isAuthenticated);
      }
    });
    
    // Listen for auth status changes from background script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === "AUTH_STATUS_CHANGED") {
        console.log("Received auth status change:", message.isAuthenticated);
        
        // Refresh token to ensure we have the latest from storage
        getJwtManager().then(jwtManager => {
          return jwtManager.loadFromStorage().then(() => {
            // Optionally, you can add more logic here if needed
            console.log("JWT manager updated with latest token");
            EventBus.emit("saypi:auth:status-changed", message.isAuthenticated);
          });
        });
      }
      // Make sure to return false as we're not sending a response asynchronously
      return false;
    });
  }

  function startAudioModule() {
    window.addEventListener("unload", () => {
      audioModule.stop();
    });
    audioModule.start();
  }

  var isLoaded = false;
  EventBus.on("saypi:ui:content-loaded", function () {
    if (isLoaded) {
      return;
    }
    // arguably these two functions are part of the content loading phase,
    // but they need to be called after other content has been loaded
    addVisualisations(document.body);
    const controlPanel = document.querySelector("#saypi-control-panel-main");
    const lockPosition = 4; // position of the lock buttons - just before the div.grow separator
    addLockButtons(controlPanel, lockPosition);

    submitErrorHandler.initAudioOutputListener();
    submitErrorHandler.checkForRestorePoint();

    new ImmersionService(chatbot).initMode();
    startAudioModule();
    isLoaded = true;
  });

  addUserAgentFlags();
  await ChatbotService.addChatbotFlags();
  EventModule.init();
  
  // Initialize JWT manager
  getJwtManager().then(jwtManager => {
    jwtManager.initialize();
  });
  
  setupAuthListener(); // Setup the auth listener
  new DOMObserver(chatbot).observeDOM();
  
  // Initialize Universal Dictation Module for non-chatbot pages
  const universalDictation = UniversalDictationModule.getInstance();
  universalDictation.initialize();

  function addVisualisations(container) {
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

    buttonModule.addTalkIcon(button);
    panel.appendChild(button);
  }

  function addLockButtons(container, position = 0) {
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
})();
