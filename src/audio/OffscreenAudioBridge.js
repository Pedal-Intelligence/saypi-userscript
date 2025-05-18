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

    this.port = null;
    this.initialized = false;
    this.isOffscreenSupported = this._checkOffscreenSupport();
    this.deferredEvents = []; // Store events that arrive before initialization
    
    OffscreenAudioBridge.instance = this;
  }

  static getInstance() {
    if (!OffscreenAudioBridge.instance) {
      OffscreenAudioBridge.instance = new OffscreenAudioBridge();
    }
    return OffscreenAudioBridge.instance;
  }

  /**
   * Check if the browser supports offscreen documents
   * @returns {boolean} True if offscreen documents are supported
   */
  _checkOffscreenSupport() {
    // Firefox doesn't support offscreen
    if (isFirefox() || isSafari()) {
      logger.debug("[OffscreenAudioBridge] Offscreen documents not supported by this browser");
      return false;
    }
    
    // Chrome-based browser should have chrome.offscreen, but double-check
    if (!chrome.offscreen) {
      logger.debug("[OffscreenAudioBridge] chrome.offscreen not available in this browser");
      return false;
    }
    
    return true;
  }

  /**
   * Initialize the bridge connection to the background script
   */
  initialize() {
    if (this.initialized) {
      return;
    }
    
    if (!this.isOffscreenSupported) {
      logger.debug("[OffscreenAudioBridge] Offscreen not supported, bridge initialization skipped");
      this.initialized = true;
      return;
    }
    
    try {
      // Connect to background service worker
      this.port = chrome.runtime.connect({ name: "media-content-script-connection" });
      
      // Listen for messages from the offscreen document via background
      this.port.onMessage.addListener(this._handleMessageFromOffscreen.bind(this));
      
      this.port.onDisconnect.addListener(() => {
        logger.debug("[OffscreenAudioBridge] Port disconnected");
        this.port = null;
        
        // Try to reconnect after a brief delay
        setTimeout(() => {
          this.initialize();
        }, 1000);
      });
      
      this.initialized = true;
      logger.debug("[OffscreenAudioBridge] Bridge initialized");
      
      // Process any deferred events
      this._processDeferredEvents();
    } catch (error) {
      logger.error("[OffscreenAudioBridge] Error initializing bridge", error);
    }
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
   * Handle messages from the offscreen document via background
   * @param {Object} message The message from the offscreen document
   */
  _handleMessageFromOffscreen(message) {
    if (!message || !message.type) {
      return;
    }
    
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
    } else if (message.type.startsWith("OFFSCREEN_AUDIO_")) {
      // Handle offscreen audio responses
      const responseType = message.type.replace("OFFSCREEN_AUDIO_", "").toLowerCase();
      logger.debug(`[OffscreenAudioBridge] Received offscreen response: ${responseType}`);
      
      // Handle specific responses if needed
    }
  }

  /**
   * Send a message to the offscreen document via background
   * @param {string} type The message type
   * @param {Object} detail Additional message details
   */
  _sendMessageToOffscreen(type, detail = {}) {
    if (!this.initialized) {
      // Store the event to be processed after initialization
      this.deferredEvents.push({ type, detail });
      this.initialize();
      return;
    }
    
    if (!this.isOffscreenSupported) {
      // If offscreen is not supported, we can't send messages
      logger.debug(`[OffscreenAudioBridge] Offscreen not supported, cannot send ${type}`);
      return;
    }
    
    if (!this.port) {
      logger.warn(`[OffscreenAudioBridge] No port available, cannot send ${type}`);
      this.initialize(); // Try to reconnect
      return;
    }
    
    // Format the message for the background script
    const message = {
      type,
      ...detail
    };
    
    logger.debug(`[OffscreenAudioBridge] Sending message to offscreen: ${type}`);
    this.port.postMessage(message);
  }

  /**
   * Load and play an audio file in the offscreen document
   * @param {string} url The URL of the audio file to play
   */
  playAudio(url) {
    if (!url) {
      logger.error("[OffscreenAudioBridge] No URL provided for playAudio");
      return;
    }
    
    this._sendMessageToOffscreen("AUDIO_PLAY_REQUEST", { url });
  }

  /**
   * Pause currently playing audio
   */
  pauseAudio() {
    this._sendMessageToOffscreen("AUDIO_PAUSE_REQUEST");
  }

  /**
   * Resume paused audio
   */
  resumeAudio() {
    this._sendMessageToOffscreen("AUDIO_RESUME_REQUEST");
  }

  /**
   * Stop audio playback completely
   */
  stopAudio() {
    this._sendMessageToOffscreen("AUDIO_STOP_REQUEST");
  }
  
  /**
   * Check if offscreen documents are supported
   * @returns {boolean} True if supported
   */
  isSupported() {
    return this.isOffscreenSupported;
  }
} 