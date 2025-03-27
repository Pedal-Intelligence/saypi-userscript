import { Chatbot } from "./Chatbot";
import { ClaudeChatbot } from "./Claude";
import { PiAIChatbot } from "./Pi";

/**
 * This is the single place a concrete chatbot is created.
 * All other parts of the application should use this service to get a chatbot.
 */
export class ChatbotService {
  static async getChatbot(): Promise<Chatbot> {
    // return chatbot depending on the location
    if (window.location.hostname.includes("claude")) {
      return new ClaudeChatbot();
    } else {
      return new PiAIChatbot();
    }
  }

  static async addChatbotFlags(): Promise<void> {
    // add flags to the body to indicate which chatbot is being used
    const chatbot = await ChatbotService.getChatbot();
    document.body.classList.add(chatbot.getName().toLowerCase());
  }
}
