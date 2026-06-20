import AudioModule from "./audio/AudioModule.js";
import EventBus from "./events/EventBus.js";
import { logger } from "./LoggingModule.js";
import { getJwtManager } from "./JwtManager.ts";
import telemetryModule from "./TelemetryModule.ts";
import { addUserAgentFlags } from "./UserAgentModule.ts";
import { stampBuildOnDocument } from "./build-stamp.ts";
import { installDevReloadBridge, installDevFeedSpeechBridge } from "./dev/devReload.ts";

// Import styles that are needed across all modes
import "./styles/tokens.scss"; // SayPi design tokens (--saypi-*) on :root
import "./styles/common.scss";
import "./styles/desktop.scss";
import "./styles/mobile.scss";
import "./styles/rectangles.css";
import "./styles/agent-notice.scss";
import "./styles/compat-notice.scss";
import "./styles/auth-prompt.scss";

import { ChatbotService } from "./chatbots/ChatbotService.ts";
import { ChatbotIdentifier } from "./chatbots/ChatbotIdentifier.ts";

// Static imports for all modules (but conditionally execute)
import { UniversalDictationModule } from "./UniversalDictationModule.ts";
import { AIChatModule } from "./AIChatModule.ts";
import { initTooltip } from "./ui/Tooltip.ts";

// Conditional style imports
import "./styles/claude.scss"; // scoped by chatbot flags, i.e. <body class="claude">
import "./styles/claude-mobile.scss"; // scoped by html.mobile-device body.claude
import "./styles/pi.scss"; // scoped by chatbot flags, i.e. <body class="pi">

(async function () {
  "use strict";

  // Record which build is injected on <html data-saypi-build="...">, readable
  // from the page's main world so a Layer-4 probe can detect a stale dev build.
  // Dev/e2e builds only — no need to expose build identity on production pages.
  if (import.meta.env.DEV) {
    stampBuildOnDocument();
    installDevReloadBridge();
    installDevFeedSpeechBridge();
  }

  // Determine the mode based on the centralized identifier helpers
  const chatbotType = ChatbotIdentifier.identifyChatbot();
  const isChatMode = ChatbotIdentifier.isInChatMode();
  const isDictationMode = ChatbotIdentifier.isInDictationMode();

  logger.info(`Say, Pi extension loading in ${isChatMode ? 'chat' : 'dictation'} mode for ${chatbotType}`);

  // Initialize common modules needed by both modes
  const audioModule = AudioModule.getInstance(); // inits the audio module's offline functions

  // Non-essential early init (compat notice + auth prompts). These are isolated in
  // their own try/catch because they `await import(...)` extension chunks, and a
  // chunk-load rejection — e.g. when the service worker is updating/restarting at
  // reload time ("Extension context invalidated") — would otherwise abort the whole
  // bootstrap before `initializeChatMode()` runs, leaving the page looking like
  // vanilla Claude with no call button. The core decoration must NOT depend on these
  // succeeding, so a failure here is logged and swallowed rather than propagated.

  // Initialize compatibility notification UI early to catch all compatibility events
  logger.debug("Initializing compatibility notification UI");
  try {
    const { CompatibilityNotificationUI } = await import(/* webpackMode: "eager" */ "./compat/CompatibilityNotificationUI.ts");
    CompatibilityNotificationUI.getInstance().initialize();
  } catch (error) {
    logger.error("Compatibility notification UI failed to initialize (non-fatal):", error);
  }

  // Body-portal tooltips for SayPi buttons (escape host overflow/stacking clipping)
  initTooltip();

  // Initialize progressive authentication prompt system (for chatbot overlay prompts)
  logger.debug("Initializing auth prompt system");
  try {
    const { getAuthPromptController } = await import(/* webpackMode: "eager" */ "./auth/AuthPromptController.ts");
    const { getAuthPromptUI } = await import(/* webpackMode: "eager" */ "./auth/AuthPromptUI.ts");
    const { getUsageTracker } = await import(/* webpackMode: "eager" */ "./auth/UsageTracker.ts");
    await getAuthPromptController().initialize();
    getAuthPromptUI().initialize();

    // Expose debug method for resetting auth prompt tracking
    window.saypiResetAuthPrompts = async () => {
      await getUsageTracker().resetStats();
      console.log("[SayPi] Auth prompt tracking reset. Reload page to take effect.");
    };
  } catch (error) {
    logger.error("Auth prompt system failed to initialize (non-fatal):", error);
  }

  // Initialize telemetry module
  logger.debug("Initializing telemetry module");
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
  if (isChatMode) {
    await initializeChatMode();
  } else if (isDictationMode) {
    await initializeDictationMode();
  }

  // Setup listener for authentication status changes from background script
  function setupAuthListener() {
    logger.debug("Setting up authentication listener in content script");
    
    // Check auth status on initial load
    chrome.runtime.sendMessage({ type: "GET_AUTH_STATUS" }, (response) => {
      if (response && response.isAuthenticated !== undefined) {
        logger.debug("Initial authentication status:", response.isAuthenticated);
      }
    });
    
    // Listen for auth status changes from background script
    chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
      if (message.type === "AUTH_STATUS_CHANGED") {
        logger.info("Received auth status change:", message.isAuthenticated);
        
        // Refresh token to ensure we have the latest from storage
        getJwtManager().then(async jwtManager => {
          await jwtManager.loadFromStorage();
          // Optionally, you can add more logic here if needed
          logger.debug("JWT manager updated with latest token");
          EventBus.emit("saypi:auth:status-changed", message.isAuthenticated);
        });
      }
      // Make sure to return false as we're not sending a response asynchronously
      return false;
    });
  }

  // Initialize chat mode for chatbot sites (claude.ai, pi.ai, chatgpt.com)
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

  // Expose API client for testing in development
  if (typeof window !== 'undefined' && window.location.href.includes('test-csp-bypass.html')) {
    const { callApi } = await import('./ApiClient.ts');
    if (!window.sayPi) window.sayPi = {};
    window.sayPi.callApi = callApi;
    window.callApi = callApi; // Also expose directly for easier testing
  }
})();
