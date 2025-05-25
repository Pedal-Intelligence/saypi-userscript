import { logger } from "../LoggingModule.js";

logger.log("[SayPi Media Coordinator] Script loaded.");

// Helper function to sanitize messages for logging by removing/truncating large data
export function sanitizeMessageForLogs(message: any): any {
  if (!message || typeof message !== 'object') {
    return message;
  }
  
  // Create a sanitized copy
  const sanitizedMessage = { ...message };
  
  // Specifically handle audio data which is typically very large
  if (sanitizedMessage.audioData && Array.isArray(sanitizedMessage.audioData)) {
    sanitizedMessage.audioData = `[Array(${sanitizedMessage.audioData.length}) omitted from logs]`;
  }
  
  // Handle any other large arrays
  for (const key in sanitizedMessage) {
    if (
      sanitizedMessage[key] && 
      Array.isArray(sanitizedMessage[key]) && 
      sanitizedMessage[key].length > 100
    ) {
      sanitizedMessage[key] = `[Array(${sanitizedMessage[key].length}) omitted from logs]`;
    }
    
    // Handle nested objects (but avoid circular references)
    if (
      sanitizedMessage[key] && 
      typeof sanitizedMessage[key] === 'object' && 
      !Array.isArray(sanitizedMessage[key])
    ) {
      sanitizedMessage[key] = sanitizeMessageForLogs(sanitizedMessage[key]);
    }
  }
  
  return sanitizedMessage;
}

// ----- Reference counting for usage tracking -----
export interface UsageCounter {
  vad: number;
  audio: number;
}

// Make these globals singleton-safe
declare global {
  interface Window {
    saypiMediaCoordinator?: {
      usageCounter: UsageCounter;
      messageHandlers: Map<string, MessageHandler>;
      autoShutdownTimer: number | null;
      isListenerSetup: boolean;
    };
  }
}

// Initialize singleton state
if (!window.saypiMediaCoordinator) {
  window.saypiMediaCoordinator = {
    usageCounter: { vad: 0, audio: 0 },
    messageHandlers: new Map(),
    autoShutdownTimer: null,
    isListenerSetup: false
  };
}

const state = window.saypiMediaCoordinator;

// Auto-shutdown timer
const AUTO_SHUTDOWN_DELAY = 30000; // 30 seconds of complete inactivity

export function incrementUsage(type: keyof UsageCounter) {
  state.usageCounter[type]++;
  
  // Clear any existing shutdown timer since we're now active
  if (state.autoShutdownTimer !== null) {
    clearTimeout(state.autoShutdownTimer);
    state.autoShutdownTimer = null;
  }
  
  logger.debug(`[SayPi Media Coordinator] ${type} usage incremented to ${state.usageCounter[type]}`);
}

export function decrementUsage(type: keyof UsageCounter) {
  if (state.usageCounter[type] > 0) {
    state.usageCounter[type]--;
  }
  
  logger.debug(`[SayPi Media Coordinator] ${type} usage decremented to ${state.usageCounter[type]}`);
  
  // Check if both VAD and audio are inactive
  if (state.usageCounter.vad === 0 && state.usageCounter.audio === 0) {
    startAutoShutdownTimer();
  }
}

export function resetUsageCounter(type: keyof UsageCounter) {
  state.usageCounter[type] = 0;
  logger.debug(`[SayPi Media Coordinator] ${type} usage reset to 0`);
  
  // Check if we should start the auto-shutdown timer
  if (state.usageCounter.vad === 0 && state.usageCounter.audio === 0) {
    startAutoShutdownTimer();
  }
}

function startAutoShutdownTimer() {
  // Don't start a new timer if one is already running
  if (state.autoShutdownTimer !== null) {
    return;
  }
  
  logger.debug(`[SayPi Media Coordinator] Starting auto-shutdown timer for ${AUTO_SHUTDOWN_DELAY}ms`);
  
  state.autoShutdownTimer = window.setTimeout(() => {
    if (state.usageCounter.vad === 0 && state.usageCounter.audio === 0) {
      logger.debug('[SayPi Media Coordinator] Auto-shutdown triggered after inactivity');
      // Tell the background script to close the offscreen document
      chrome.runtime.sendMessage({
        type: 'OFFSCREEN_AUTO_SHUTDOWN',
        origin: 'offscreen-document'
      });
    }
    state.autoShutdownTimer = null;
  }, AUTO_SHUTDOWN_DELAY);
}

// Message handler registry
type MessageHandler = (message: any, sourceTabId: number) => Promise<any> | any;

export function registerMessageHandler(messageType: string, handler: MessageHandler) {
  state.messageHandlers.set(messageType, handler);
  logger.debug(`[SayPi Media Coordinator] Registered handler for message type: ${messageType} (total: ${state.messageHandlers.size})`);
}

export function unregisterMessageHandler(messageType: string) {
  state.messageHandlers.delete(messageType);
  logger.debug(`[SayPi Media Coordinator] Unregistered handler for message type: ${messageType}`);
}

// Send response back to content script
export function sendResponse(type: string, payload: any, targetTabId: number) {
  chrome.runtime.sendMessage({
    type: `OFFSCREEN_${type}_RESPONSE`,
    payload,
    targetTabId,
    origin: "offscreen-document",
  });
}

// Send error response back to content script
export function sendError(type: string, error: any, targetTabId: number) {
  chrome.runtime.sendMessage({
    type: `OFFSCREEN_${type}_ERROR`,
    payload: { success: false, error: error.message || "Unhandled error" },
    targetTabId,
    origin: "offscreen-document",
  });
}

// Global message listener - will be set up by the main script
export function setupMessageListener() {
  if (state.isListenerSetup) {
    logger.debug("[SayPi Media Coordinator] Message listener already setup, skipping");
    return;
  }
  
  chrome.runtime.onMessage.addListener((message, sender, chromeSendResponse) => {
    // Log all incoming messages for debugging
    if (message.type && typeof message.type === 'string') {
      console.log(`[SayPi Media Coordinator] 📥 Received message: ${message.type}`, {
        origin: message.origin,
        source: message.source,
        sourceTabId: message.sourceTabId,
        timestamp: Date.now()
      });
    }

    // Check if this is a message we should process
    if ((message.origin !== "content-script" && message.source !== "content-script") || 
        (message.sourceTabId === undefined && message.tabId === undefined)) {
      console.warn(`[SayPi Media Coordinator] ⚠️ Skipping message due to invalid origin/source or missing tabId:`, {
        origin: message.origin,
        source: message.source,
        type: message.type,
        hasSourceTabId: message.sourceTabId !== undefined,
        hasTabId: message.tabId !== undefined
      });
      return;
    }

    if(message.type !== "VAD_FRAME_PROCESSED") {
      // frame processed messages are too chatty, so we don't log them
      const sanitizedMessage = sanitizeMessageForLogs(message);
      logger.debug("[SayPi Media Coordinator] Received message from background:", sanitizedMessage);
    }
    
    // Use either sourceTabId or tabId (they should be the same - from the content script)
    const { type } = message;
    const sourceTabId = message.sourceTabId || message.tabId;
    
    if (!sourceTabId) {
      console.error(`[SayPi Media Coordinator] ❌ Message has no valid tab ID:`, {
        type: message.type,
        origin: message.origin,
        source: message.source
      });
      return;
    }

    // Find and execute the appropriate handler
    const handler = state.messageHandlers.get(type);
    if (!handler) {
      logger.warn(`[SayPi Media Coordinator] Unknown message type received: ${type} (available handlers: ${Array.from(state.messageHandlers.keys()).join(', ')})`);
      sendResponse(type, { success: false, error: "Unknown message type" }, sourceTabId);
      return false;
    }

    try {
      const result = handler(message, sourceTabId);
      
      // Handle async responses
      if (result && typeof result.then === 'function') {
        result
          .then((response: any) => sendResponse(type, response, sourceTabId))
          .catch((error: any) => {
            logger.reportError(error, { function: 'Message Handler', messageType: type, tabId: sourceTabId }, "Error processing request");
            sendError(type, error, sourceTabId);
          });
        return true; // Indicate async response
      }
      
      // Handle sync responses
      if (result !== undefined) {
        sendResponse(type, result, sourceTabId);
      }
      
      return false;
    } catch (error: any) {
      logger.reportError(error, { function: 'Message Handler', messageType: type, tabId: sourceTabId }, "Error executing message handler");
      sendError(type, error, sourceTabId);
      return false;
    }
  });
  
  state.isListenerSetup = true;
  logger.debug("[SayPi Media Coordinator] Message listener setup complete");
} 