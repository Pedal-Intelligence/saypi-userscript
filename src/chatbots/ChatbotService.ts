import { Chatbot } from "./Chatbot";
import { PiAIChatbot } from "./Pi";

/**
 * This is the single place a concrete chatbot is created.
 * All other parts of the application should use this service to get a chatbot.
 */
export class ChatbotService {
  static getChatbot(): Chatbot {
    return new PiAIChatbot();
  }
}
