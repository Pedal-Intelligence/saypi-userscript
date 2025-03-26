import { AssistantResponse } from "../dom/MessageElements";
import { UserMessage } from "../dom/MessageElements";
import { VoiceSelector } from "../tts/VoiceMenu";
import { shortenTranscript } from "../TextModule";

export interface Chatbot {
  getChatHistorySelector(): string;
  getPastChatHistorySelector(): string; // can be identical to chat history
  getRecentChatHistorySelector(): string; // can be identical to chat history
  getVoiceMenuSelector(): string;
  getVoiceSettingsSelector(): string;
  getDiscoveryPanelSelector(): string;
  getAudioOutputButtonSelector(): string;
  getAudioControlsSelector(): string;
  getControlPanelSelector(): string;
  getSidePanelSelector(): string;
  getPromptTextInputSelector(): string;
  getPromptSubmitButtonSelector(): string;
  getAssistantResponseSelector(): string;
  getAssistantResponseContentSelector(): string;
  getUserPromptSelector(): string; // Selector to find user's chat messages
  getUserMessageContentSelector(): string; // Selector to find content within user messages
  getChatPath(): string;
  isChatablePath(path: string): boolean; // can the chatbot chat on this URL path?
  // ... other methods for different selectors
  getExtraCallButtonClasses(): string[];
  getContextWindowCapacityCharacters(): number; // Returns the context window capacity in characters

  getPrompt(element: HTMLElement): UserPrompt;
  getAssistantResponse(
    element: HTMLElement,
    includeInitialText?: boolean
  ): AssistantResponse;
  getUserMessage(element: HTMLElement): UserMessage; // Get a user message from an element
  getName(): string; // the display name of the chatbot, e.g. "Pi", "Claude"
  getID(): string; // the name of the chatbot as it appears in URLs, etc., e.g. "pi", "claude"
  getNickname(): Promise<string>; // Returns the user's preferred nickname for the AI assistant, or the default name if not set
  hasNickname(): Promise<boolean>;
}

export interface UserPrompt {
  getDraft(): string;
  setDraft(transcript: string): void;
  clear(): void;
  setText(text: string): void;
  getText(): string;
  setPlaceholderText(text: string): void;
  getPlaceholderText(): string;
  getDefaultPlaceholderText(): string;
  PROMPT_CHARACTER_LIMIT: number;
  setMessage(label: string): void;
  setFinal(transcript: string, isMaintainanceMessage?: boolean): void;
}

