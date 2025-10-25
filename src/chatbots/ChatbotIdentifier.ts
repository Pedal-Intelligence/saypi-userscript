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

  /**
   * Checks if the current path is chatable for the given chatbot
   * This duplicates logic from individual chatbot classes to avoid circular dependencies
   * @param chatbot The chatbot identifier
   * @param path The current path
   * @returns True if the path supports chat mode
   */
  private static isChatablePath(chatbot: ChatbotId, path: string): boolean {
    switch (chatbot) {
      case "claude":
        // Exclude coding agent routes like /code
        return (
          path.includes("/new") ||
          path.includes("/chat") ||
          path.includes("/project")
        );
      case "chatgpt":
        // Exclude coding agent routes like /codex
        return (
          path === "/" ||
          path.startsWith("/c/") ||
          path.startsWith("/g/") ||
          path.startsWith("/share/")
        );
      case "pi":
        // Pi's chatable paths
        return (
          path.startsWith("/talk") ||
          path.startsWith("/discover") ||
          path.startsWith("/threads") ||
          (path.startsWith("/profile") && !path.endsWith("/account"))
        );
      case "web":
      default:
        return false;
    }
  }

  static isInDictationMode(): boolean {
    const chatbot = this.identifyChatbot();
    if (chatbot === "web") {
      return true;
    }
    
    // Check if current path is non-chatable for chatbot sites
    const location = this.getGlobalLocation();
    if (!location) {
      return true; // Default to dictation mode if we can't determine location
    }
    
    return chatbot !== undefined && !this.isChatablePath(chatbot, location.pathname);
  }

  static isInChatMode(): boolean {
    const chatbot = this.identifyChatbot();
    if (!chatbot || chatbot === "web") {
      return false;
    }
    
    // Check if current path is chatable for chatbot sites
    const location = this.getGlobalLocation();
    if (!location) {
      return false; // Default to dictation mode if we can't determine location
    }
    
    return this.isChatablePath(chatbot, location.pathname);
  }

}
