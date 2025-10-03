import { logger } from "../LoggingModule.js";

const mediaCoordinatorGlobal = window as any;
if (!mediaCoordinatorGlobal.__saypiMediaCoordinatorLogged) {
  logger.log("[SayPi Media Coordinator] Script loaded.");
  mediaCoordinatorGlobal.__saypiMediaCoordinatorLogged = true;
} else {
  logger.debug("[SayPi Media Coordinator] Script already loaded; reusing existing state.");
}

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
export function sendResponse(
  type: string,
  payload: any,
  targetTabId: number,
  requestMessageId?: string
) {
  chrome.runtime.sendMessage({
    type: `OFFSCREEN_${type}_RESPONSE`,
    payload,
    targetTabId,
    origin: "offscreen-document",
    requestMessageId,
  });
}

// Send error response back to content script
export function sendError(
  type: string,
  error: any,
  targetTabId: number,
  requestMessageId?: string
) {
  chrome.runtime.sendMessage({
    type: `OFFSCREEN_${type}_ERROR`,
    payload: { success: false, error: error.message || "Unhandled error" },
    targetTabId,
    origin: "offscreen-document",
    requestMessageId,
  });
}

// Global message listener - will be set up by the main script
export function setupMessageListener() {
  if (state.isListenerSetup) {
    logger.debug("[SayPi Media Coordinator] Message listener already setup, skipping");
    return;
  }
  const trustedOrigins = new Set(["content-script", "background", "offscreen-document"]);
  const tabOptionalMessageTypes = new Set([
    "API_REQUEST",
    "OFFSCREEN_AUTO_SHUTDOWN",
  ]);
  
  chrome.runtime.onMessage.addListener((message, sender, chromeSendResponse) => {
    if (message.type !== "VAD_FRAME_PROCESSED") {
      logger.debug("[SayPi Media Coordinator] Raw message before sanitization", {
        rawMessage: message,
        sender: {
          tabId: sender?.tab?.id,
          frameId: typeof sender?.frameId === 'number' ? sender.frameId : undefined,
          url: sender?.url,
          origin: (sender as any)?.origin,
        }
      });
    }
    // Log all incoming messages for debugging
    if (message.type && typeof message.type === 'string') {
      logger.debug(`[SayPi Media Coordinator] Received message`, {
        type: message.type,
        origin: message.origin,
        source: message.source,
        sourceTabId: message.sourceTabId,
        timestamp: Date.now()
      });
    }

    const origin = message.origin || message.source;
    const proxiedByBackground = message.proxiedByBackground === true;
    if (origin && !trustedOrigins.has(origin)) {
      logger.warn(`[SayPi Media Coordinator] Skipping message due to untrusted origin/source`, {
        origin: message.origin,
        source: message.source,
        type: message.type
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
    const sourceTabId = message.sourceTabId ?? message.tabId ?? message.targetTabId;

    if (sourceTabId === undefined && !tabOptionalMessageTypes.has(type)) {
      if (proxiedByBackground) {
        logger.error(`[SayPi Media Coordinator] Proxied message missing tab context`, {
          type: message.type,
          origin: message.origin,
          source: message.source,
          messageId: message.messageId
        });
      } else {
        logger.debug(`[SayPi Media Coordinator] Ignoring direct message without tab context`, {
          type: message.type,
          origin: message.origin,
          source: message.source
        });
      }
      return;
    }

    if (sourceTabId === undefined && tabOptionalMessageTypes.has(type)) {
      logger.debug(`[SayPi Media Coordinator] Processing ${type} message without tab context`, {
        origin: message.origin,
        source: message.source
      });
    }

    // Find and execute the appropriate handler
    const handler = state.messageHandlers.get(type);
    if (!handler) {
      if (tabOptionalMessageTypes.has(type)) {
        logger.debug(`[SayPi Media Coordinator] No handler registered for optional message type ${type}; skipping.`);
        return false;
      }
      logger.warn(`[SayPi Media Coordinator] Unknown message type received: ${type} (available handlers: ${Array.from(state.messageHandlers.keys()).join(', ')})`);
      if (sourceTabId !== undefined) {
        sendResponse(type, { success: false, error: "Unknown message type" }, sourceTabId);
      }
      return false;
    }

    try {
      const result = handler(message, sourceTabId as number);
      
      // Handle async responses
      if (result && typeof result.then === 'function') {
        result
          .then((response: any) => sendResponse(type, response, sourceTabId, message.messageId))
          .catch((error: any) => {
            logger.reportError(error, { function: 'Message Handler', messageType: type, tabId: sourceTabId }, "Error processing request");
            sendError(type, error, sourceTabId, message.messageId);
          });
        return false;
      }
      
      // Handle sync responses
      if (result !== undefined) {
        sendResponse(type, result, sourceTabId, message.messageId);
      }
      return false;
    } catch (error: any) {
      logger.reportError(error, { function: 'Message Handler', messageType: type, tabId: sourceTabId }, "Error executing message handler");
      sendError(type, error, sourceTabId, message.messageId);
      return false;
    }
  });
  
  state.isListenerSetup = true;
  logger.debug("[SayPi Media Coordinator] Message listener setup complete");
} 
