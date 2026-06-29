import type { Chatbot } from "../chatbots/Chatbot";
import { ChatbotIdentifier } from "../chatbots/ChatbotIdentifier";
import { getClientId } from "./ClientIdManager";
import { getExtensionVersion } from "./VersionManager";

export interface UsageMetadata {
  clientId?: string;
  version?: string;
  app?: string;
  language?: string;
  /**
   * The authenticated user's team id (from the JWT claims). Present only once
   * the user is signed in; absent for anonymous traffic. Sending it attributes
   * first-conversation usage to the user's team so the onboarding funnel can
   * tell "installed but never succeeded" apart from "never installed" (#437).
   */
  teamId?: string;
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
    const appId = chatbot?.getID?.() ?? ChatbotIdentifier.getAppId();
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

  try {
    const { getJwtManagerSync } = await import("../JwtManager");
    const jwt = getJwtManagerSync();
    // Only attribute to a team once the user is actually signed in; anonymous
    // traffic stays keyed on clientId alone.
    if (jwt.isAuthenticated()) {
      const teamId = jwt.getClaims()?.teamId;
      if (teamId) result.teamId = teamId;
    }
  } catch (e) {
    console.warn("[UsageMetadata] Failed to resolve teamId", e);
  }

  return result;
}
