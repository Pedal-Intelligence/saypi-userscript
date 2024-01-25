import { Chatbot } from "./Chatbot";

class PiAIChatbot extends Chatbot {
  getPromptTextInputSelector(): string {
    return "textarea[enterkeyhint]";
  }

  getPromptSubmitButtonSelector(): string {
    return ".pi-submit-button"; // replace with actual submit button selector for pi.ai
  }

  getControlPanelSelector(): any {
    return ".flex.items-center.grow";
  }
}

export { PiAIChatbot };
