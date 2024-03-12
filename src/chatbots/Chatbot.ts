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
  isChatablePath(path: string): boolean; // can the chatbot chat on this URL path?
  // ... other methods for different selectors
}
