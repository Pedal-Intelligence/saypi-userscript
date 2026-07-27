/**
 * A lightweight module for identifying the current chatbot without circular dependencies.
 * This module doesn't import any specific chatbot implementations to avoid dependency cycles.
 */
export type ChatbotId = "claude" | "pi" | "chatgpt" | "web";

/**
 * The exact hostnames of the chat apps SayPi decorates — i.e. the hosts the CHAT
 * content script is injected into (`CHATBOT_MATCHES` in
 * `entrypoints/saypi.content.ts`, and the mirror-image `excludeMatches` in
 * `entrypoints/saypi-universal.content.ts`).
 *
 * Both entrypoints import the same `src/saypi.index.js`, so the bundle cannot ask
 * at runtime which script loaded it; the injection scope has to be restated here
 * for the mode gate to read. Those entrypoint files are founder-gated, so
 * `test/chatbots/ChatbotIdentifier-injectionParity.spec.ts` reads them from disk
 * and fails if this list drifts from them.
 *
 * Exact hosts, not registrable domains: a Chrome match pattern of
 * `https://pi.ai/*` matches the host `pi.ai` and nothing else — not `hey.pi.ai`,
 * not `www.pi.ai` (see #559).
 */
export const CHAT_APP_HOSTNAMES = [
  "pi.ai",
  "claude.ai",
  "chatgpt.com",
  "chat.com",
  "chat.openai.com",
] as const;

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
   * True when the current page is one of the chat apps SayPi decorates.
   *
   * Keyed on the exact hostname rather than `identifyChatbot()`'s registrable
   * domain: `identifyChatbot()` answers "which product is this?" (attribution),
   * whereas mode is "does this page have a chat UI to decorate?". Those diverge
   * on any non-chat subdomain — `hey.pi.ai` is Pi's marketing splash with no
   * composer, yet it is very much Pi (#559).
   *
   * Hostname, not origin: the injection scope this mirrors is written as host
   * match patterns, so a plain host list tracks it 1:1.
   */
  static isChatAppHost(hostnameOverride?: string): boolean {
    const hostname = this.resolveHostname(hostnameOverride);
    if (!hostname) {
      return false;
    }
    return (CHAT_APP_HOSTNAMES as readonly string[]).includes(hostname);
  }

  /**
   * The two mode gates partition every page: exactly one of them is true for any
   * hostname. Narrowing only `isInChatMode()` would have left `hey.pi.ai` in
   * NEITHER mode — chat machinery gone AND universal dictation still suppressed.
   *
   * The one carve-out, unchanged from before: a context with no `location`
   * binding at all — no page, no mode, both gates false. Note this is NOT the
   * extension service worker; as `getGlobalLocation()` says, that resolves to
   * the worker's own `chrome-extension://<id>/` scope, so it has a hostname, it
   * is not a chat-app host, and it lands in dictation mode exactly as it did
   * before this change.
   */
  static isInDictationMode(): boolean {
    const hostname = this.resolveHostname();
    if (!hostname) {
      return false;
    }
    return !this.isChatAppHost(hostname);
  }

  static isInChatMode(): boolean {
    return this.isChatAppHost();
  }

}
