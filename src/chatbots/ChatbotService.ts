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
  static getChatbotSync(): Chatbot {
    // Check if we're on a chatbot site
    const hostname = window.location.hostname;
    
    // If we're on pi.ai, claude.ai, or ChatGPT sites, use the appropriate chatbot
    if (hostname.includes("pi.ai")) {
      return new PiAIChatbot();
    } else if (hostname.includes("claude.ai")) {
      return new ClaudeChatbot();
    } else if (hostname.includes("chatgpt.com") || hostname.includes("chat.com") || hostname.includes("chat.openai.com")) {
      return new ChatGPTChatbot();
    } else {
      // For all other sites (universal dictation), use the web dictation chatbot
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
