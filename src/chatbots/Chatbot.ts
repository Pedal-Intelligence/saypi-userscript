// Chatbot.ts
abstract class Chatbot {
  getControlPanelSelector(): any {
    throw new Error("Method not implemented.");
  }
  // Define abstract methods for getting selectors which the subclasses must implement
  abstract getPromptTextInputSelector(): string;
  abstract getPromptSubmitButtonSelector(): string;
  // ... other abstract methods for different selectors
}

export { Chatbot };
