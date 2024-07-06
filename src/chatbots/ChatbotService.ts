import { Chatbot } from "./Chatbot";
import { PiAIChatbot } from "./Pi";
import { ClaudeChatbot } from "./Claude";

/**
 * This is the single place a concrete chatbot is created.
 * All other parts of the application should use this service to get a chatbot.
 */
export class ChatbotService {
  static getChatbot(): Chatbot {
    // return chatbot depending on the location
    if (window.location.hostname.includes("claude")) {
      return new ClaudeChatbot();
    } else {
      return new PiAIChatbot();
    }
  }
}
