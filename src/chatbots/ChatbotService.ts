import { Chatbot } from "./Chatbot";

/**
 * This is the single place a concrete chatbot is created.
 * All other parts of the application should use this service to get a chatbot.
 * The chatbot is lazy loaded to avoid circular dependencies.
 */
export class ChatbotService {
  static async getChatbot(): Promise<Chatbot> {
    // return chatbot depending on the location
    if (window.location.hostname.includes("claude")) {
      const module = await import("./Claude"); // lazy load the Claude chatbot
      return new module.ClaudeChatbot();
    } else {
      const module = await import("./Pi"); // lazy load the Pi chatbot
      return new module.PiAIChatbot();
    }
  }

  static async addChatbotFlags(): Promise<void> {
    // add flags to the body to indicate which chatbot is being used
    const chatbot = await ChatbotService.getChatbot();
    document.body.classList.add(chatbot.getName().toLowerCase());
  }
}
