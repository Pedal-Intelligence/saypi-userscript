import { Chatbot } from "./Chatbot";

/**
 * Simple chatbot implementation for universal dictation on non-chatbot sites
 */
export class WebDictationChatbot implements Chatbot {
  getName(): string {
    return "Say, Pi";
  }

  getID(): string {
    return "web";
  }

  async getNickname(): Promise<string> {
    return this.getName(); // No custom nickname for web dictation
  }

  async hasNickname(): Promise<boolean> {
    return false;
  }

  supportsFocusMode(): boolean {
    return false;
  }

  // All other methods throw errors as they should not be called during dictation
  getChatHistory(): HTMLElement { throw new Error("Not implemented for dictation"); }
  getAudioControls(): HTMLElement { throw new Error("Not implemented for dictation"); }
  getPromptInput(): HTMLElement { throw new Error("Not implemented for dictation"); }
  getPromptContainer(): HTMLElement { throw new Error("Not implemented for dictation"); }
  getPromptControlsContainer(): HTMLElement { throw new Error("Not implemented for dictation"); }
  getChatHistorySelector(): string { throw new Error("Not implemented for dictation"); }
  getPastChatHistorySelector(): string { throw new Error("Not implemented for dictation"); }
  getRecentChatHistorySelector(): string { throw new Error("Not implemented for dictation"); }
  getVoiceMenuSelector(): string { throw new Error("Not implemented for dictation"); }
  getVoiceSettingsSelector(): string { throw new Error("Not implemented for dictation"); }
  getDiscoveryPanelSelector(): string { throw new Error("Not implemented for dictation"); }
  getAudioOutputButtonSelector(): string { throw new Error("Not implemented for dictation"); }
  getAudioControlsSelector(): string { throw new Error("Not implemented for dictation"); }
  getControlPanelSelector(): string { throw new Error("Not implemented for dictation"); }
  getSidebarSelector(): string { throw new Error("Not implemented for dictation"); }
  getPromptTextInputSelector(): string { throw new Error("Not implemented for dictation"); }
  getPromptSubmitButtonSelector(): string { throw new Error("Not implemented for dictation"); }
  getAssistantResponseSelector(): string { throw new Error("Not implemented for dictation"); }
  getAssistantResponseContentSelector(): string { throw new Error("Not implemented for dictation"); }
  getUserPromptSelector(): string { throw new Error("Not implemented for dictation"); }
  getUserMessageContentSelector(): string { throw new Error("Not implemented for dictation"); }
  getChatPath(): string { throw new Error("Not implemented for dictation"); }
  isChatablePath(): boolean { throw new Error("Not implemented for dictation"); }
  getExtraCallButtonClasses(): string[] { throw new Error("Not implemented for dictation"); }
  getContextWindowCapacityCharacters(): number { throw new Error("Not implemented for dictation"); }
  getPrompt(): any { throw new Error("Not implemented for dictation"); }
  getAssistantResponse(): any { throw new Error("Not implemented for dictation"); }
  getUserMessage(): any { throw new Error("Not implemented for dictation"); }
  getVoiceMenu(): any { throw new Error("Not implemented for dictation"); }
  getCachedAssistantResponse(): any { throw new Error("Not implemented for dictation"); }
  clearCachedAssistantResponse(): boolean { throw new Error("Not implemented for dictation"); }
  simulateFormSubmit(): boolean { throw new Error("Not implemented for dictation"); }
  getSidebarConfig(): any { throw new Error("Not implemented for dictation"); }
}
