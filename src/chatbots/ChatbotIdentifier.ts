/**
 * A lightweight module for identifying the current chatbot without circular dependencies.
 * This module doesn't import any specific chatbot implementations to avoid dependency cycles.
 */
export class ChatbotIdentifier {
  /**
   * Identifies which chatbot is being used based on the current URL
   * @returns The identifier string for the current chatbot
   */
  static identifyChatbot(hostnameOverride?: string): string {
    const hostname = (hostnameOverride ?? window.location.hostname).toLowerCase();

    // Extract the registrable domain (e.g., "claude.ai" in "chat.claude.ai")
    const parts = hostname.split(".");
    const baseDomain = parts.slice(-2).join(".");

    switch (baseDomain) {
      case "claude.ai":
        return "claude";
      case "pi.ai":
        return "pi";
      default:
        // Fallback – treat any other site as a generic web page for dictation use-case
        return "web";
    }
  }

  /**
   * Gets the app ID for the current chatbot without instantiating the chatbot
   * @returns The app ID to use in API calls
   */
  static getAppId(): string {
    return this.identifyChatbot();
  }

  static getChatbotName(): string {
    return this.identifyChatbot() === "claude" ? "Claude" : "Pi";
  }

  /**
   * Checks if the current chatbot matches a specific type
   * @param type The chatbot type to check against
   * @returns True if the current chatbot matches the specified type
   */
  static isChatbotType(type: string): boolean {
    return this.identifyChatbot() === type;
  }

}