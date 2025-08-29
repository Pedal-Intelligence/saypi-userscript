import type { Chatbot } from "../chatbots/Chatbot";
import { getClientId } from "./ClientIdManager";
import { getExtensionVersion } from "./VersionManager";

export interface UsageMetadata {
  clientId?: string;
  version?: string;
  app?: string;
  language?: string;
}

/**
 * Builds usage analytics metadata as specified in the PRD.
 * Fields are optional so callers can decide which ones to include.
 */
export async function buildUsageMetadata(chatbot?: Chatbot): Promise<UsageMetadata> {
  const result: UsageMetadata = {};

  try {
    result.clientId = await getClientId();
  } catch (e) {
    console.warn("[UsageMetadata] Failed to get clientId", e);
  }

  try {
    const version = getExtensionVersion();
    if (version) result.version = version;
  } catch (e) {
    console.warn("[UsageMetadata] Failed to get version", e);
  }

  try {
    let bot = chatbot;
    if (!bot) {
      const { ChatbotService } = await import("../chatbots/ChatbotService");
      bot = await ChatbotService.getChatbot();
    }
    const appId = bot?.getID?.();
    if (appId) result.app = String(appId).toLowerCase();
  } catch (e) {
    console.warn("[UsageMetadata] Failed to resolve app id", e);
  }

  try {
    const { UserPreferenceModule } = await import("../prefs/PreferenceModule");
    const prefs = UserPreferenceModule.getInstance();
    const language = prefs.getCachedLanguage?.();
    if (language) result.language = language;
  } catch (e) {
    console.warn("[UsageMetadata] Failed to resolve language", e);
  }

  return result;
}


