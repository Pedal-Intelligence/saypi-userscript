// Chatbot.ts
abstract class Chatbot {
  getAudioOutputButtonSelector(): string {
    throw new Error("Method not implemented.");
  }
  abstract getAudioControlsSelector(): string;
  getControlPanelSelector(): string {
    throw new Error("Method not implemented.");
  }
  getSidePanelSelector(): string {
    throw new Error("Method not implemented.");
  }
  // Define abstract methods for getting selectors which the subclasses must implement
  abstract getPromptTextInputSelector(): string;
  abstract getPromptSubmitButtonSelector(): string;
  // ... other abstract methods for different selectors
}

export { Chatbot };
