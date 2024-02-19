export interface Chatbot {
  getChatHistorySelector(): any;
  getVoiceMenuSelector(): string;
  getAudioOutputButtonSelector(): string;
  getAudioControlsSelector(): string;
  getControlPanelSelector(): string;
  getSidePanelSelector(): string;
  getPromptTextInputSelector(): string;
  getPromptSubmitButtonSelector(): string;
  getChatPath(): string;
  // ... other methods for different selectors
}
