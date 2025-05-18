import { logger } from "../LoggingModule.js";
import EventBus from "../events/EventBus.js";
import { isFirefox, isSafari } from "../UserAgentModule.ts";

/**
 * Bridge class that connects the content script to the offscreen document for audio playback
 * This class is responsible for:
 * - Detecting if the browser supports offscreen documents
 * - Establishing a connection to the background script
 * - Sending audio commands to the offscreen document
 * - Receiving audio events from the offscreen document
 * - Forwarding events to the EventBus for state machines
 */
export default class OffscreenAudioBridge {
  constructor() {
    if (OffscreenAudioBridge.instance) {
      return OffscreenAudioBridge.instance;
    }

    this.initialized = false;
    this.offscreenSupported = null; // Will be set after checking via background
    this.deferredEvents = []; // Store events that arrive before initialization
    this.activeMessageIds = new Set(); // Track in-flight messages
    
    // Set up message listener
    chrome.runtime.onMessage.addListener(this._handleMessageFromBackground.bind(this));
    
    OffscreenAudioBridge.instance = this;
  }

  static getInstance() {
    if (!OffscreenAudioBridge.instance) {
      OffscreenAudioBridge.instance = new OffscreenAudioBridge();
    }
    return OffscreenAudioBridge.instance;
  }

  /**
   * Check if the browser supports offscreen documents.
   * This is a two-step process:
   * 1. Quick check based on browser type (immediate)
   * 2. Actual capability check via background (async)
   * 
   * @returns {Promise<boolean>} Promise that resolves to true if offscreen is supported
   */
  async _checkOffscreenSupport() {
    // Quick fail for known unsupported browsers
    if (isFirefox() || isSafari()) {
      logger.debug("[OffscreenAudioBridge] Offscreen documents not supported by this browser type");
      return false;
    }
    
    try {
      // Ask the background service worker to check if offscreen API is available
      const response = await chrome.runtime.sendMessage({ 
        type: "CHECK_OFFSCREEN_SUPPORT" 
      });
      
      logger.debug(`[OffscreenAudioBridge] Offscreen support check response: ${JSON.stringify(response)}`);
      
      if (response && response.supported === true) {
        return true;
      } else {
        // If we got a response but supported is false
        return false;
      }
    } catch (error) {
      // If message sending failed, the background service worker might not be available
      logger.error("[OffscreenAudioBridge] Error checking offscreen support:", error);
      return false;
    }
  }

  /**
   * Initialize the bridge
   * @returns {Promise<boolean>} Promise that resolves to true if initialization was successful
   */
  async initialize() {
    if (this.initialized) {
      return this.offscreenSupported;
    }
    
    // Check if offscreen is supported first
    if (this.offscreenSupported === null) {
      this.offscreenSupported = await this._checkOffscreenSupport();
    }
    
    if (!this.offscreenSupported) {
      logger.debug("[OffscreenAudioBridge] Offscreen not supported, bridge initialization skipped");
      this.initialized = true;
      return false;
    }
    
    this.initialized = true;
    logger.debug("[OffscreenAudioBridge] Bridge initialized (using direct messaging)");
    
    // Process any deferred events
    this._processDeferredEvents();
    return true;
  }

  /**
   * Process any events that were received before initialization
   */
  _processDeferredEvents() {
    if (this.deferredEvents.length > 0) {
      logger.debug(`[OffscreenAudioBridge] Processing ${this.deferredEvents.length} deferred events`);
      
      for (const { type, detail } of this.deferredEvents) {
        this._sendMessageToOffscreen(type, detail);
      }
      
      this.deferredEvents = [];
    }
  }

  /**
   * Handle messages from the background script
   * @param {Object} message The message from the background script
   * @param {Object} sender The sender of the message
   * @param {Function} sendResponse Function to send a response
   * @returns {boolean} Whether we'll send a response asynchronously
   */
  _handleMessageFromBackground(message, sender, sendResponse) {
    if (!message || !message.type) {
      return false;
    }
    
    // Log receipt of the message
    logger.debug(`[OffscreenAudioBridge] Received message: ${message.type}`, {
      origin: message.origin || 'unknown',
      timestamp: Date.now()
    });
    
    // Forward audio events to the EventBus
    if (message.type.startsWith("AUDIO_")) {
      const eventType = message.type.replace("AUDIO_", "").toLowerCase();
      logger.debug(`[OffscreenAudioBridge] Received audio event: ${eventType}`);
      
      // Map to event bus events
      let eventBusEvent = null;
      
      switch (eventType) {
        case "play":
        case "playing":
          eventBusEvent = "play";
          break;
        case "pause":
          eventBusEvent = "pause";
          break;
        case "ended":
          eventBusEvent = "ended";
          break;
        case "error":
          eventBusEvent = "error";
          break;
        // Add other events as needed
        default:
          eventBusEvent = eventType;
      }
      
      if (eventBusEvent) {
        EventBus.trigger(eventBusEvent, message.detail);
      }
      
      return false; // No async response
    } else if (message.type.startsWith("OFFSCREEN_AUDIO_")) {
      // Handle offscreen audio responses
      const responseType = message.type.replace("OFFSCREEN_AUDIO_", "").toLowerCase();
      logger.debug(`[OffscreenAudioBridge] Received offscreen response: ${responseType}`, 
        message.payload ? { success: message.payload.success } : {});
      
      // If this is a response to a message we sent, mark it as received
      if (message.messageId && this.activeMessageIds.has(message.messageId)) {
        this.activeMessageIds.delete(message.messageId);
      }
      
      // If there's an error, emit it to the EventBus
      if (message.payload && message.payload.error) {
        logger.error(`[OffscreenAudioBridge] Error from offscreen: ${message.payload.error}`);
        this._emitAudioErrorEvent(responseType, message.payload.error);
      }
      
      return false; // No async response
    }
    
    return false; // No async response
  }

  /**
   * Generate a unique message ID
   * @returns {string} A unique message ID
   */
  _generateMessageId() {
    return `audio-msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Send a message to the offscreen document via background
   * @param {string} type The message type
   * @param {Object} detail Additional message details
   * @returns {Promise<boolean>} Promise that resolves to true if message was sent successfully
   */
  async _sendMessageToOffscreen(type, detail = {}) {
    if (!this.initialized) {
      // Store the event to be processed after initialization
      this.deferredEvents.push({ type, detail });
      const initSuccess = await this.initialize();
      
      // If initialization failed and this is a critical audio message, emit an error event
      if (!initSuccess && type.startsWith("AUDIO_")) {
        this._emitAudioErrorEvent(type, "Offscreen initialization failed");
        return false;
      }
      
      return initSuccess;
    }
    
    if (!this.offscreenSupported) {
      // If offscreen is not supported, we can't send messages
      logger.debug(`[OffscreenAudioBridge] Offscreen not supported, cannot send ${type}`);
      
      // For audio messages, emit an error event so the UI can handle it
      if (type.startsWith("AUDIO_")) {
        this._emitAudioErrorEvent(type, "Offscreen not supported in this browser");
      }
      
      return false;
    }
    
    // Generate a unique ID for this message
    const messageId = this._generateMessageId();
    this.activeMessageIds.add(messageId);
    
    // Format the message for the background script
    const message = {
      type,
      messageId,
      source: "content-script",
      timestamp: Date.now(),
      ...detail
    };
    
    logger.debug(`[OffscreenAudioBridge] 📤 Sending message to background: ${type}`, {
      messageId,
      messageDetails: JSON.stringify(message),
      timestamp: Date.now()
    });
    
    try {
      // Set up a timeout for message sending
      const timeout = 5000; // 5 seconds
      
      // Create a promise that resolves when the message is sent
      const sendPromise = new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(message, (response) => {
          // Check for a runtime error (indicates a disconnected port)
          const lastError = chrome.runtime.lastError;
          if (lastError) {
            reject(new Error(`Failed to send message: ${lastError.message}`));
            return;
          }
          
          resolve(response);
        });
      });
      
      // Create a promise that rejects after the timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Message sending timed out after ${timeout}ms`));
        }, timeout);
      });
      
      // Race the promises
      await Promise.race([sendPromise, timeoutPromise]);
      
      logger.debug(`[OffscreenAudioBridge] ✅ Message ${type} (ID: ${messageId}) sent successfully`);
      return true;
    } catch (error) {
      logger.error(`[OffscreenAudioBridge] ❌ Error sending message ${type}:`, error);
      
      // Clean up the message ID
      this.activeMessageIds.delete(messageId);
      
      // If this is an audio message, emit an error event
      if (type.startsWith("AUDIO_")) {
        this._emitAudioErrorEvent(type, `Failed to send message: ${error.message || "Unknown error"}`);
      }
      
      return false;
    }
  }

  /**
   * Emit an audio error event to the EventBus so that UI components can handle it
   * @param {string} requestType The original request type that failed
   * @param {string} errorMessage The error message
   */
  _emitAudioErrorEvent(requestType, errorMessage) {
    // Map request types to appropriate error information
    let errorContext;
    
    switch (requestType) {
      case "AUDIO_PLAY_REQUEST":
        errorContext = "playing audio";
        break;
      case "AUDIO_PAUSE_REQUEST":
        errorContext = "pausing audio";
        break;
      case "AUDIO_RESUME_REQUEST":
        errorContext = "resuming audio";
        break;
      case "AUDIO_STOP_REQUEST":
        errorContext = "stopping audio";
        break;
      default:
        errorContext = "audio operation";
    }
    
    const errorDetail = {
      source: "OffscreenAudioBridge",
      message: `Error ${errorContext}: ${errorMessage}`,
      originalRequest: requestType,
      timestamp: Date.now()
    };
    
    logger.error(`[OffscreenAudioBridge] ${errorDetail.message}`);
    
    // Trigger an error event that UI components can listen for
    EventBus.trigger("error", errorDetail);
  }

  /**
   * Load an audio file in the offscreen document
   * @param {string} url The URL of the audio file to load
   * @param {boolean} autoPlay Whether to play the audio immediately after loading
   * @returns {Promise<boolean>} Promise that resolves to true if message was sent successfully
   */
  async loadAudio(url, autoPlay = true) {
    if (!url) {
      logger.error("[OffscreenAudioBridge] No URL provided for loadAudio");
      this._emitAudioErrorEvent("AUDIO_LOAD_REQUEST", "No URL provided");
      return false;
    }
    
    return await this._sendMessageToOffscreen("AUDIO_LOAD_REQUEST", { url, autoPlay });
  }

  /**
   * Load and play an audio file in the offscreen document
   * @param {string} url The URL of the audio file to play
   * @returns {Promise<boolean>} Promise that resolves to true if message was sent successfully
   */
  async playAudio(url) {
    if (url) {
      // If URL is provided, load and play
      return await this.loadAudio(url, true);
    } else {
      // If no URL, assume we're playing an already loaded audio
      return await this._sendMessageToOffscreen("AUDIO_PLAY_REQUEST");
    }
  }

  /**
   * Pause currently playing audio
   * @returns {Promise<boolean>} Promise that resolves to true if message was sent successfully
   */
  async pauseAudio() {
    return await this._sendMessageToOffscreen("AUDIO_PAUSE_REQUEST");
  }

  /**
   * Resume paused audio
   * @returns {Promise<boolean>} Promise that resolves to true if message was sent successfully
   */
  async resumeAudio() {
    return await this._sendMessageToOffscreen("AUDIO_RESUME_REQUEST");
  }

  /**
   * Stop audio playback completely
   * @returns {Promise<boolean>} Promise that resolves to true if message was sent successfully
   */
  async stopAudio() {
    return await this._sendMessageToOffscreen("AUDIO_STOP_REQUEST");
  }
  
  /**
   * Check if offscreen documents are supported
   * @returns {Promise<boolean>} Promise that resolves to true if supported
   */
  async isSupported() {
    if (this.offscreenSupported === null) {
      this.offscreenSupported = await this._checkOffscreenSupport();
    }
    return this.offscreenSupported;
  }
} 