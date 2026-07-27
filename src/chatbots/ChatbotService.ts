import { Chatbot } from "./Chatbot";
import { ClaudeChatbot } from "./Claude";
import { PiAIChatbot } from "./Pi";
import ChatGPTChatbot from "./ChatGPT";
import { WebDictationChatbot } from "./Web";
import { ChatbotIdentifier } from "./ChatbotIdentifier";

/**
 * This is the single place a concrete chatbot is created.
 * All other parts of the application should use this service to get a chatbot.
 */
export class ChatbotService {
  /**
   * Derived from the same predicate as the mode gate, so the two can't disagree
   * (#559). This used to run its own SUBSTRING hostname test
   * (`hostname.includes("pi.ai")`), which agreed with the mode gate only by
   * accident — both were domain-shaped. Once mode narrowed to the exact chat-app
   * hosts, a chat-adjacent page like `hey.pi.ai` ran universal dictation while
   * holding a `PiAIChatbot`, and downstream code that reads the chatbot rather
   * than the mode diverged with it: `constructTranscriptionFormData()` appended
   * the user's Pi `nickname` to a dictation upload that carries no such field on
   * any other site, and `buildUsageMetadata()` prefers `chatbot.getID()` over
   * `ChatbotIdentifier.getAppId()`.
   *
   * So: not a chat-app host ⇒ the dictation chatbot, whatever product the
   * hostname belongs to; otherwise switch on the identified chatbot. The five
   * chat-app hosts resolve exactly as before. Attribution — `identifyChatbot()`
   * / `getAppId()` / the `body` class — is deliberately left domain-shaped;
   * `hey.pi.ai` is still Pi, it just isn't a chat page.
   */
  static getChatbotSync(): Chatbot {
    if (!ChatbotIdentifier.isChatAppHost()) {
      // Universal dictation, including on a non-chat subdomain of a chat app.
      return new WebDictationChatbot();
    }

    switch (ChatbotIdentifier.identifyChatbot()) {
      case "pi":
        return new PiAIChatbot();
      case "claude":
        return new ClaudeChatbot();
      case "chatgpt":
        return new ChatGPTChatbot();
      default:
        // Unreachable while CHAT_APP_HOSTNAMES and identifyChatbot() agree — the
        // parity spec pins the former to the injection scope, and the mode spec
        // pins the latter's answer for every one of those hosts. Fall back to
        // the dictation chatbot rather than throwing on a page we can't name.
        return new WebDictationChatbot();
    }
  }

  static async getChatbot(): Promise<Chatbot> {
    return this.getChatbotSync();
  }

  static async addChatbotFlags(): Promise<void> {
    // Use the identifier directly for adding CSS classes
    // This avoids instantiating a full chatbot object just for the class name
    const chatbotType = ChatbotIdentifier.identifyChatbot();
    if (chatbotType) {
      document.body.classList.add(chatbotType);
    }
  }
}
