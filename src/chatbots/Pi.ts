import { Chatbot } from "./Chatbot";

class PiAIChatbot extends Chatbot {
  getPromptTextInputSelector(): string {
    return "textarea[enterkeyhint]";
  }

  getPromptSubmitButtonSelector(): string {
    return ".pi-submit-button"; // replace with actual selector for PiAI
  }

  // ... other specific implementations of selectors
}

export { PiAIChatbot };
