export const OFFSCREEN_DOCUMENT_PATH = "src/offscreen/media_offscreen.html";

class OffscreenManager {
  private creating?: Promise<void>;
  private portMap: Map<number, chrome.runtime.Port> = new Map(); // tabId to Port

  async hasDocument(): Promise<boolean> {
    // Check if chrome.offscreen exists first
    if (!chrome.offscreen) {
      console.debug("chrome.offscreen API not available in this browser");
      return false;
    }
    
    if (typeof chrome.offscreen.hasDocument === 'function') {
      try {
        return await chrome.offscreen.hasDocument();
      } catch (error) {
        console.warn("Error calling chrome.offscreen.hasDocument:", error);
        return false;
      }
    }
    
    // Fallback if hasDocument is not available (e.g., older Chrome versions or different environment)
    // This is a rough heuristic; a more robust check might involve trying to send a message
    // and seeing if it fails, or maintaining an internal state variable.
    // For now, we'll rely on our internal state tracking if the API isn't there.
    // This part might need refinement based on testing.
    console.warn("chrome.offscreen.hasDocument API not available. Relying on internal state.");
    // A simple internal check if we've attempted creation.
    // This doesn't confirm the document *still* exists if closed externally.
    return !!this.creating; // A proxy for "attempted to create"
  }

  private async setupOffscreenDocument(): Promise<void> {
    // Check if chrome.offscreen is available
    if (!chrome.offscreen) {
      throw new Error("Offscreen documents API not available in this browser");
    }
    
    // Check if the document already exists.
    if (await this.hasDocument()) {
      console.log("Offscreen document already exists.");
      return;
    }

    if (this.creating) {
      await this.creating;
      return;
    }

    console.log("Creating offscreen document...");
    
    try {
      this.creating = chrome.offscreen.createDocument({
        url: OFFSCREEN_DOCUMENT_PATH,
        reasons: [chrome.offscreen.Reason.USER_MEDIA, chrome.offscreen.Reason.AUDIO_PLAYBACK],
        justification: "Microphone VAD and TTS playback under restrictive host-page CSP",
      });

      await this.creating;
      console.log("Offscreen document created successfully.");
    } catch (error) {
      console.error("Error creating offscreen document:", error);
      throw error; // Re-throw to be caught by callers
    } finally {
      this.creating = undefined;
    }
  }

  public async closeOffscreenDocument(): Promise<void> {
    // Check if chrome.offscreen is available
    if (!chrome.offscreen) {
      console.debug("chrome.offscreen API not available - cannot close offscreen document");
      return;
    }
    
    if (!(await this.hasDocument())) {
      console.log("No offscreen document to close or hasDocument API not available to confirm.");
      // If hasDocument isn't available, we might still try to close if we think one exists
      // For now, if hasDocument says no, we assume no.
      return;
    }
    console.log("Closing offscreen document...");
    
    try {
      await chrome.offscreen.closeDocument();
      this.portMap.clear(); // Clear ports as the document is gone
      console.log("Offscreen document closed.");
    } catch (error) {
      console.warn("Error closing offscreen document:", error);
      // Clear ports anyway since the document might be gone
      this.portMap.clear();
    }
  }

  public async sendMessageToOffscreenDocument(message: any, targetTabId?: number): Promise<void> {
    try {
      // Check if chrome.offscreen is available before trying to set up
      if (!chrome.offscreen) {
        throw new Error("Offscreen documents API not available in this browser");
      }
      
      await this.setupOffscreenDocument(); // Ensure document exists
      
      // Create the message with correct properties
      const messageWithTabId = { 
        ...message,
        tabId: targetTabId
      };
      
      // If the message has 'source' but not 'origin', map it correctly for the offscreen document
      if (message.source === "content-script" && !message.origin) {
        messageWithTabId.origin = "content-script";
      }
      
      // Add specific logging for audio messages
      if (message.type && typeof message.type === 'string' && message.type.includes('AUDIO_')) {
        console.log(`[OffscreenManager] 📢 Forwarding audio message to offscreen: ${message.type}`, {
          tabId: targetTabId,
          url: message.url,
          timestamp: Date.now()
        });
      }
      
      // Create a timeout promise to ensure we don't hang if message delivery fails
      const messageDeliveryTimeout = 2000; // 2 seconds timeout
      const timeoutPromise = new Promise<void>((_, reject) => {
        setTimeout(() => reject(new Error(`Message delivery timed out after ${messageDeliveryTimeout}ms`)), messageDeliveryTimeout);
      });
      
      // Promise for the actual message sending
      const sendPromise = new Promise<void>((resolve, reject) => {
        try {
          console.debug(`[OffscreenManager] forwarding message to offscreen: ${messageWithTabId.type}`);
          chrome.runtime.sendMessage(messageWithTabId);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
      
      // Race the message sending against the timeout
      await Promise.race([sendPromise, timeoutPromise]);
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`[OffscreenManager] Error sending message to offscreen document: ${errorMessage}`, {
        messageType: message?.type,
        targetTabId,
        timestamp: Date.now()
      });
      
      // If this is an audio message, we should notify the content script about the failure
      if (message.type && typeof message.type === 'string' && message.type.includes('AUDIO_') && targetTabId) {
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

  public registerContentScriptConnection(port: chrome.runtime.Port): void {
    // Accept both the old VAD connection name and the new media connection name
    if (port.name !== "vad-content-script-connection" && port.name !== "media-content-script-connection") {
      return;
    }
    const tabId = port.sender?.tab?.id;
    if (!tabId) {
      console.error("Port connection from content script without tab ID.", port);
      return;
    }

    console.log(`Registered ${port.name} connection from tab ${tabId}`);
    this.portMap.set(tabId, port);

    port.onMessage.addListener(async (message) => {
      // Add specific logging for audio messages
      if (message.type && typeof message.type === 'string' && message.type.includes('AUDIO_')) {
        console.log(`[OffscreenManager] 🎧 Port received audio message: ${message.type}`, {
          tabId,
          url: message.url,
          timestamp: Date.now()
        });
      }
      
      console.debug(`Background received message from content script (tab ${tabId}):`, message);
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
      console.log(`Content script connection from tab ${tabId} disconnected.`);
      this.portMap.delete(tabId);
      if (this.portMap.size === 0) {
        console.log("All content script connections closed. Closing offscreen document.");
        this.closeOffscreenDocument();
      }
    });
  }
  
  public forwardMessageToContentScript(tabId: number, message: any): void {
    const port = this.portMap.get(tabId);
    if (port) {
      console.debug(`[OffscreenManager] forwarding message to content script (tab ${tabId}): ${message.type}`);
      port.postMessage(message);
    } else {
      console.warn(`No active port found for tab ${tabId} to forward message: ${message.type}`);
    }
  }
}

// Export a singleton instance
export const offscreenManager = new OffscreenManager(); 