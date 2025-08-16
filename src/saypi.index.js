import AudioModule from "./audio/AudioModule.js";
import EventBus from "./events/EventBus.js";
import { getJwtManager } from "./JwtManager.ts";
import telemetryModule from "./TelemetryModule.ts";
import { addUserAgentFlags } from "./UserAgentModule.ts";

// Import styles that are needed across all modes
import "./styles/common.scss";
import "./styles/desktop.scss";
import "./styles/mobile.scss";
import "./styles/rectangles.css";

import { ChatbotService } from "./chatbots/ChatbotService.ts";
import { ChatbotIdentifier } from "./chatbots/ChatbotIdentifier.ts";

// Static imports for all modules (but conditionally execute)
import { UniversalDictationModule } from "./UniversalDictationModule.ts";
import { AIChatModule } from "./AIChatModule.ts";

// Conditional style imports
import "./styles/claude.scss"; // scoped by chatbot flags, i.e. <body class="claude">
import "./styles/pi.scss"; // scoped by chatbot flags, i.e. <body class="pi">

(async function () {
  "use strict";

  // Determine the mode based on the current site
  const chatbotType = ChatbotIdentifier.identifyChatbot();
  const isChatbotSite = chatbotType === "claude" || chatbotType === "pi";
  const isDictationSite = chatbotType === "web";

  console.log(`Say, Pi extension loading in ${isChatbotSite ? 'chat' : 'dictation'} mode for ${chatbotType}`);

  // Initialize common modules needed by both modes
  const audioModule = AudioModule.getInstance(); // inits the audio module's offline functions
  
  // Initialize telemetry module
  console.debug("Initializing telemetry module");
  telemetryModule; // This will invoke the getInstance() singleton which sets up event listeners

  // Common initialization for both modes
  addUserAgentFlags();
  await ChatbotService.addChatbotFlags();
  
  // Initialize JWT manager
  getJwtManager().then(jwtManager => {
    jwtManager.initialize();
  });
  
  // Setup authentication listener (needed for both modes)
  setupAuthListener();

  // Initialize mode-specific modules
  if (isChatbotSite) {
    await initializeChatMode();
  } else if (isDictationSite) {
    await initializeDictationMode();
  }

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
    chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
      if (message.type === "AUTH_STATUS_CHANGED") {
        console.log("Received auth status change:", message.isAuthenticated);
        
        // Refresh token to ensure we have the latest from storage
        getJwtManager().then(async jwtManager => {
          await jwtManager.loadFromStorage();
          // Optionally, you can add more logic here if needed
          console.log("JWT manager updated with latest token");
          EventBus.emit("saypi:auth:status-changed", message.isAuthenticated);
        });
      }
      // Make sure to return false as we're not sending a response asynchronously
      return false;
    });
  }

  // Initialize chat mode for chatbot sites (claude.ai, pi.ai)
  async function initializeChatMode() {
    const aiChatModule = AIChatModule.getInstance();
    await aiChatModule.initialize();
  }

  // Initialize dictation mode for non-chatbot sites
  async function initializeDictationMode() {
    console.log("Initializing dictation mode");
    
    // UniversalDictationModule is already imported statically - just use it

    function startAudioModule() {
      window.addEventListener("unload", () => {
        audioModule.stop();
      });
      audioModule.start();
    }

    // Start audio module when dictation is needed
    EventBus.on("saypi:dictation:initialized", function () {
      console.log("Starting audio module for dictation");
      startAudioModule();
    });
    
    // Initialize Universal Dictation Module
    const universalDictation = UniversalDictationModule.getInstance();
    universalDictation.initialize();
  }
})();
