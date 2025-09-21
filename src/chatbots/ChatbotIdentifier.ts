/**
 * A lightweight module for identifying the current chatbot without circular dependencies.
 * This module doesn't import any specific chatbot implementations to avoid dependency cycles.
 */
type ChatbotId = "claude" | "pi" | "chatgpt" | "web";

export class ChatbotIdentifier {
  /**
   * Identifies which chatbot is being used based on the current URL
   * @returns The identifier string for the current chatbot
  */
  static identifyChatbot(hostnameOverride?: string): ChatbotId | undefined {
    const hostname = this.resolveHostname(hostnameOverride);

    if (!hostname) {
      return undefined;
    }

    // Extract the registrable domain (e.g., "claude.ai" in "chat.claude.ai")
    const parts = hostname.split(".");
    const baseDomain = parts.slice(-2).join(".");

    switch (baseDomain) {
      case "claude.ai":
        return "claude";
      case "pi.ai":
        return "pi";
      case "chatgpt.com":
      case "chat.com":
        return "chatgpt";
      case "openai.com":
        // Check if it's chat.openai.com specifically
        if (hostname.includes("chat.")) {
          return "chatgpt";
        }
        return "web";
      default:
        // Fallback – treat any other site as a generic web page for dictation use-case
        return "web";
    }
  }

  /**
   * Gets the app ID for the current chatbot without instantiating the chatbot
   * @returns The app ID to use in API calls
   */
  static getAppId(): ChatbotId | undefined {
    return this.identifyChatbot();
  }

  private static resolveHostname(hostnameOverride?: string): string | null {
    if (hostnameOverride) {
      return hostnameOverride.toLowerCase();
    }

    const globalLocation = this.getGlobalLocation();
    const detectedHostname = globalLocation?.hostname;

    return detectedHostname ? detectedHostname.toLowerCase() : null;
  }

  private static getGlobalLocation(): Location | null {
    if (typeof window !== "undefined" && window.location) {
      return window.location;
    }

    if (typeof globalThis !== "undefined") {
      const { location } = globalThis as { location?: Location };
      if (location) {
        // In extension service workers this resolves to the worker's own
        // script scope (e.g., chrome-extension://<id>/), not an active tab.
        return location;
      }
    }

    return null;
  }

  static getChatbotName(): string {
    const chatbot = this.identifyChatbot();
    if (!chatbot) {
      return "Unknown";
    }
    switch (chatbot) {
      case "claude":
        return "Claude";
      case "pi":
        return "Pi";
      case "chatgpt":
        return "ChatGPT";
      default:
        return "Web";
    }
  }

  /**
   * Checks if the current chatbot matches a specific type
   * @param type The chatbot type to check against
   * @returns True if the current chatbot matches the specified type
   */
  static isChatbotType(type: string): boolean {
    return this.identifyChatbot() === type;
  }

  static isInDictationMode(): boolean {
    const chatbot = this.identifyChatbot();
    return chatbot === "web";
  }

  static isInChatMode(): boolean {
    const chatbot = this.identifyChatbot();
    if (!chatbot) {
      return false;
    }
    return chatbot !== "web";
  }

}
