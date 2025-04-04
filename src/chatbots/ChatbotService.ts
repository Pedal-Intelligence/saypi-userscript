import { Chatbot } from "./Chatbot";
import { ClaudeChatbot } from "./Claude";
import { PiAIChatbot } from "./Pi";
import { ChatbotIdentifier } from "./ChatbotIdentifier";

/**
 * This is the single place a concrete chatbot is created.
 * All other parts of the application should use this service to get a chatbot.
 */
export class ChatbotService {
  static async getChatbot(): Promise<Chatbot> {
    // Use the ChatbotIdentifier to determine which chatbot to instantiate
    const chatbotType = ChatbotIdentifier.identifyChatbot();
    
    switch (chatbotType) {
      case "claude":
        return new ClaudeChatbot();
      case "pi":
      default:
        return new PiAIChatbot();
    }
  }

  static async addChatbotFlags(): Promise<void> {
    // Use the identifier directly for adding CSS classes
    // This avoids instantiating a full chatbot object just for the class name
    const chatbotType = ChatbotIdentifier.identifyChatbot();
    document.body.classList.add(chatbotType);
  }
}
