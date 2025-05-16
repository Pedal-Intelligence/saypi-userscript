export const OFFSCREEN_DOCUMENT_PATH = "src/offscreen/vad_offscreen.html";

class OffscreenManager {
  private creating?: Promise<void>;
  private portMap: Map<number, chrome.runtime.Port> = new Map(); // tabId to Port

  async hasDocument(): Promise<boolean> {
    if (chrome.offscreen && typeof chrome.offscreen.hasDocument === 'function') {
      return await chrome.offscreen.hasDocument();
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
    this.creating = chrome.offscreen.createDocument({
      url: OFFSCREEN_DOCUMENT_PATH,
      reasons: [chrome.offscreen.Reason.USER_MEDIA],
      justification: "Required for Voice Activity Detection (VAD) processing in an isolated environment to comply with strict CSPs on host pages.",
    });

    try {
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
    if (!(await this.hasDocument())) {
      console.log("No offscreen document to close or hasDocument API not available to confirm.");
      // If hasDocument isn't available, we might still try to close if we think one exists
      // For now, if hasDocument says no, we assume no.
      return;
    }
    console.log("Closing offscreen document...");
    await chrome.offscreen.closeDocument();
    this.portMap.clear(); // Clear ports as the document is gone
    console.log("Offscreen document closed.");
  }

  public async sendMessageToOffscreenDocument(message: any, targetTabId?: number): Promise<void> {
    await this.setupOffscreenDocument(); // Ensure document exists
    const messageWithTabId = targetTabId !== undefined ? { ...message, tabId: targetTabId } : message;
    try {
      console.debug("Background sending message to offscreen:", messageWithTabId);
      chrome.runtime.sendMessage(messageWithTabId);
    } catch (error) {
      console.error("Error sending message to offscreen document:", error, messageWithTabId);
      // Potentially try to re-establish or alert the user/system
    }
  }

  public registerContentScriptConnection(port: chrome.runtime.Port): void {
    if (port.name !== "vad-content-script-connection") {
      return;
    }
    const tabId = port.sender?.tab?.id;
    if (!tabId) {
      console.error("Port connection from content script without tab ID.", port);
      return;
    }

    console.log(`Registered content script connection from tab ${tabId}`);
    this.portMap.set(tabId, port);

    port.onMessage.addListener(async (message) => {
      console.debug(`Background received message from content script (tab ${tabId}):`, message);
      // Ensure offscreen document is ready before forwarding certain messages
      if (message.type === "VAD_START_REQUEST" || message.type === "AUDIO_CHUNK" || message.type === "VAD_STOP_REQUEST") {
         await this.setupOffscreenDocument(); // Ensure document is active for VAD operations
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
      console.debug(`Background forwarding message to content script (tab ${tabId}):`, message);
      port.postMessage(message);
    } else {
      console.warn(`No active port found for tab ${tabId} to forward message:`, message);
    }
  }
}

// Export a singleton instance
export const offscreenManager = new OffscreenManager(); 