import { browser } from "wxt/browser";
import { logger } from "../LoggingModule.js";

export const OFFSCREEN_DOCUMENT_PATH = "offscreen.html";

class OffscreenManager {
  private creating?: Promise<void>;
  private portMap: Map<number, browser.runtime.Port> = new Map(); // tabId to Port
  private lastOffscreenExistsLog = 0;
  private readonly offscreenExistsThrottleMs = 30000;
  private lastVadEventByTab: Map<number, { type: string; loggedAt: number }> = new Map();
  private pendingAudioMessages: Map<string, {
    type: string;
    tabId?: number;
    url?: string;
    dispatchedAt: number;
  }> = new Map();

  async hasDocument(): Promise<boolean> {
    // Check if browser.offscreen exists first
    if (!browser.offscreen) {
      logger.debug("[OffscreenManager] browser.offscreen API not available in this browser");
      return false;
    }
    
    if (typeof browser.offscreen.hasDocument === 'function') {
      try {
        return await browser.offscreen.hasDocument();
      } catch (error) {
        logger.warn("[OffscreenManager] Error calling browser.offscreen.hasDocument:", error);
        return false;
      }
    }
    
    // Fallback if hasDocument is not available (e.g., older Chrome versions or different environment)
    // This is a rough heuristic; a more robust check might involve trying to send a message
    // and seeing if it fails, or maintaining an internal state variable.
    // For now, we'll rely on our internal state tracking if the API isn't there.
    // This part might need refinement based on testing.
    logger.debug("[OffscreenManager] browser.offscreen.hasDocument API not available. Relying on internal state.");
    // A simple internal check if we've attempted creation.
    // This doesn't confirm the document *still* exists if closed externally.
    return !!this.creating; // A proxy for "attempted to create"
  }

  private async setupOffscreenDocument(): Promise<void> {
    // Check if browser.offscreen is available
    if (!browser.offscreen) {
      throw new Error("Offscreen documents API not available in this browser");
    }
    
    // Check if the document already exists.
    if (await this.hasDocument()) {
      const now = Date.now();
      if (now - this.lastOffscreenExistsLog > this.offscreenExistsThrottleMs) {
        logger.debug("[OffscreenManager] Reusing existing offscreen document for media coordination.", {
          connectedTabs: Array.from(this.portMap.keys()),
          pendingAudio: this.pendingAudioMessages.size
        });
        this.lastOffscreenExistsLog = now;
      }
      return;
    }

    if (this.creating) {
      await this.creating;
      return;
    }

    const tabCount = this.portMap.size;
    logger.info("[OffscreenManager] Creating offscreen document to host VAD/TTS pipeline despite page CSP.", {
      reason: tabCount === 0 ? "no existing sandbox" : `servicing ${tabCount} connected tab(s)`,
      pendingAudio: this.pendingAudioMessages.size,
      connectedTabs: Array.from(this.portMap.keys())
    });
    
    try {
      this.creating = browser.offscreen.createDocument({
        url: OFFSCREEN_DOCUMENT_PATH,
        reasons: [browser.offscreen.Reason.USER_MEDIA, browser.offscreen.Reason.AUDIO_PLAYBACK],
        justification: "Microphone VAD and TTS playback under restrictive host-page CSP",
      });

      await this.creating;
      logger.debug("[OffscreenManager] Offscreen document ready for media pipeline.", {
        timestamp: Date.now()
      });
    } catch (error) {
      logger.error("[OffscreenManager] Error creating offscreen document:", error);
      throw error; // Re-throw to be caught by callers
    } finally {
      this.creating = undefined;
    }
  }

  public async closeOffscreenDocument(): Promise<void> {
    // Check if browser.offscreen is available
    if (!browser.offscreen) {
      logger.debug("[OffscreenManager] browser.offscreen API not available - cannot close offscreen document");
      return;
    }
    
    if (!(await this.hasDocument())) {
      logger.debug("[OffscreenManager] No offscreen document to close or hasDocument API not available to confirm.");
      // If hasDocument isn't available, we might still try to close if we think one exists
      // For now, if hasDocument says no, we assume no.
      return;
    }
    logger.info("[OffscreenManager] Closing offscreen document because no media clients remain.", {
      connectedTabs: Array.from(this.portMap.keys()),
      pendingAudio: this.pendingAudioMessages.size
    });
    
    try {
      await browser.offscreen.closeDocument();
      this.portMap.clear(); // Clear ports as the document is gone
      this.pendingAudioMessages.clear();
      logger.debug("[OffscreenManager] Offscreen document closed.");
    } catch (error) {
      logger.warn("[OffscreenManager] Error closing offscreen document:", error);
      // Clear ports anyway since the document might be gone
      this.portMap.clear();
      this.pendingAudioMessages.clear();
    }
  }

  private trackAudioDispatch(message: any, targetTabId?: number) {
    const messageId = message?.messageId;
    if (!messageId || typeof messageId !== "string") {
      return;
    }
    this.pendingAudioMessages.set(messageId, {
      type: message?.type,
      tabId: targetTabId,
      url: message?.url,
      dispatchedAt: Date.now()
    });
  }

  public resolveAudioDispatch(messageId?: string): {
    type: string;
    tabId?: number;
    url?: string;
    dispatchedAt: number;
  } | undefined {
    if (!messageId) {
      return undefined;
    }
    const detail = this.pendingAudioMessages.get(messageId);
    if (detail) {
      this.pendingAudioMessages.delete(messageId);
      return detail;
    }
    return undefined;
  }

  public async sendMessageToOffscreenDocument(message: any, targetTabId?: number): Promise<void> {
    try {
      // Check if browser.offscreen is available before trying to set up
      if (!browser.offscreen) {
        throw new Error("Offscreen documents API not available in this browser");
      }
      
      await this.setupOffscreenDocument(); // Ensure document exists
      
      // Create the message with correct properties
      const resolvedTabId = targetTabId ?? message?.sourceTabId ?? message?.tabId;
      const messageWithTabId = { 
        ...message,
        tabId: resolvedTabId,
        sourceTabId: message?.sourceTabId ?? resolvedTabId,
        proxiedByBackground: true,
        origin: 'background',
        originalOrigin: message?.origin ?? message?.source
      };
      if (typeof resolvedTabId !== 'number') {
        logger.warn("[OffscreenManager] Forwarding message without resolved tab id", {
          messageType: message?.type,
          targetTabId,
          messageSourceTabId: message?.sourceTabId,
          messageTabId: message?.tabId,
          rawMessage: message,
        });
      }

      // If the message has 'source' but not 'origin', map it correctly for the offscreen document
      if (message.source === "content-script") {
        messageWithTabId.source = message.source;
      }

      // Add specific logging for audio messages
      if (message.type && typeof message.type === 'string' && message.type.includes('AUDIO_')) {
        logger.debug(`[OffscreenManager] Forwarding audio message to offscreen: ${message.type}`, {
          tabId: targetTabId,
          url: message.url,
          messageId: message.messageId,
          pendingAudioBeforeSend: this.pendingAudioMessages.size
        });
        this.trackAudioDispatch(message, targetTabId);
      }
      
      // Create a timeout promise to ensure we don't hang if message delivery fails
      const messageDeliveryTimeout = 2000; // 2 seconds timeout
      const timeoutPromise = new Promise<void>((_, reject) => {
        setTimeout(() => reject(new Error(`Message delivery timed out after ${messageDeliveryTimeout}ms`)), messageDeliveryTimeout);
      });
      
      // Promise for the actual message sending
      const sendPromise = (async () => {
        try {
          logger.debug(`[OffscreenManager] Forwarding message to offscreen: ${messageWithTabId.type}`, {
            tabId: messageWithTabId.tabId,
            sourceTabId: messageWithTabId.sourceTabId,
            origin: messageWithTabId.origin,
          });

          await browser.runtime.sendMessage(messageWithTabId);
        } catch (error: any) {
          const errMsg = error instanceof Error ? error.message : String(error);
          const isNoResponse = errMsg.includes('The message port closed before a response was received');
          if (isNoResponse) {
            logger.debug('[OffscreenManager] Message delivered without explicit response', {
              messageType: messageWithTabId.type,
              tabId: messageWithTabId.tabId,
              messageId: messageWithTabId.messageId,
            });
            return;
          }
          throw error;
        }
      })();
      
      // Race the message sending against the timeout
      await Promise.race([sendPromise, timeoutPromise]);
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const expectedDisconnect = errorMessage.includes('Receiving end does not exist') ||
        errorMessage.includes('Could not establish connection');

      const logPayload = {
        messageType: message?.type,
        targetTabId,
        timestamp: Date.now(),
        hasPort: targetTabId ? this.portMap.has(targetTabId) : this.portMap.size > 0,
        trackedTabs: Array.from(this.portMap.keys()),
        pendingAudioCount: this.pendingAudioMessages.size
      };

      if (expectedDisconnect) {
        logger.debug('[OffscreenManager] Offscreen document disconnected before message delivery', {
          ...logPayload,
          error: errorMessage
        });
      } else {
        logger.error(`[OffscreenManager] Error sending message to offscreen document: ${errorMessage}`, logPayload);
      }
      
      // If this is an audio message, notify content scripts unless the disconnect was expected
      if (!expectedDisconnect && message.type && typeof message.type === 'string' && message.type.includes('AUDIO_') && targetTabId) {
        this.notifyMessageFailure(message.type, targetTabId, errorMessage);
      }
    }
  }

  /**
   * Notify the content script that a message failed to be delivered to the offscreen document
   */
  private notifyMessageFailure(messageType: string, tabId: number, errorMessage: string): void {
    const port = this.portMap.get(tabId);
    if (port) {
      const responseType = messageType.replace('REQUEST', 'ERROR');
      port.postMessage({
        type: responseType,
        error: `Failed to send message to offscreen document: ${errorMessage}`,
        timestamp: Date.now()
      });
    }
  }

  public registerContentScriptConnection(port: browser.runtime.Port): void {
    // Accept both the old VAD connection name and the new media connection name
    if (port.name !== "vad-content-script-connection" && port.name !== "media-content-script-connection") {
      return;
    }
    const tabId = port.sender?.tab?.id;
    const tabTitle = port.sender?.tab?.title;
    if (!tabId) {
      console.error("Port connection from content script without tab ID.", port);
      return;
    }

    this.portMap.set(tabId, port);
    const connectedTabs = Array.from(this.portMap.keys());
    logger.debug(`[OffscreenManager] Registered ${port.name} connection from tab ${tabId} to broker audio/video via offscreen.`, {
      tabName: tabTitle,
      connectedTabs,
      pendingAudio: this.pendingAudioMessages.size
    });

    port.onMessage.addListener(async (message) => {
      // Add specific logging for audio messages
      if (message.type && typeof message.type === 'string' && message.type.includes('AUDIO_')) {
        logger.debug(`[OffscreenManager] Port received audio message: ${message.type}`, {
          tabId,
          url: message.url,
          timestamp: Date.now()
        });
      }
      
      logger.debug(`[OffscreenManager] Background received message from content script (tab ${tabId}):`, message);
      // Ensure offscreen document is ready before forwarding certain messages
      if (
        message.type === "VAD_START_REQUEST" || 
        message.type === "AUDIO_CHUNK" || 
        message.type === "VAD_STOP_REQUEST" ||
        message.type === "AUDIO_PLAY_REQUEST" ||
        message.type === "AUDIO_PAUSE_REQUEST" ||
        message.type === "AUDIO_RESUME_REQUEST" ||
        message.type === "AUDIO_STOP_REQUEST"
      ) {
         await this.setupOffscreenDocument(); // Ensure document is active
      }
      // Forward message to offscreen document, including the source tabId
      this.sendMessageToOffscreenDocument({ ...message, sourceTabId: tabId, origin: "content-script" });
    });

    port.onDisconnect.addListener(() => {
      const remainingTabs = Array.from(this.portMap.keys()).filter(id => id !== tabId);
      logger.debug(`[OffscreenManager] Content script connection from tab ${tabId} disconnected; evaluating teardown.`, {
        tabName: tabTitle,
        remainingTabs
      });
      this.portMap.delete(tabId);
      if (this.portMap.size === 0) {
        logger.debug("[OffscreenManager] All media bridges disconnected; tearing down offscreen document.");
        this.closeOffscreenDocument();
      }
    });
  }
  
  public forwardMessageToContentScript(tabId: number, message: any): void {
    const port = this.portMap.get(tabId);
    if (port) {
      if (typeof message?.type === "string" && message.type.startsWith("VAD_SPEECH_")) {
        const now = Date.now();
        const last = this.lastVadEventByTab.get(tabId);
        if (last && last.type === message.type && now - last.loggedAt < 4000) {
          port.postMessage(message);
          return;
        }
        this.lastVadEventByTab.set(tabId, { type: message.type, loggedAt: now });
        logger.debug(`[OffscreenManager] Forwarding VAD message to content script (tab ${tabId}): ${message.type}`, {
          duration: message?.duration,
          confidence: message?.confidence,
          frameCount: message?.frameCount
        });
      } else {
        logger.debug(`[OffscreenManager] Forwarding message to content script (tab ${tabId}): ${message.type}`);
      }
      port.postMessage(message);
    } else {
      logger.warn(`[OffscreenManager] No active port found for tab ${tabId} to forward message: ${message.type}`);
    }
  }
}

// Export a singleton instance
export const offscreenManager = new OffscreenManager(); 
