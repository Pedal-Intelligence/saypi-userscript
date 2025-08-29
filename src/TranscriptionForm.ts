import { logger } from "./LoggingModule.js";
import { UserPreferenceModule } from "./prefs/PreferenceModule";
import { ChatbotService } from "./chatbots/ChatbotService";
import { buildUsageMetadata } from "./usage/UsageMetadata";

const userPreferences = UserPreferenceModule.getInstance();

export async function constructTranscriptionFormData(
  audioBlob: Blob,
  audioDurationSeconds: number,
  messages: { role: string; content: string; sequenceNumber?: number }[],
  sessionId?: string,
  chatbot?: any,
  sequenceNumber?: number,
  inputType?: string,
  inputLabel?: string
) {
  const formData = new FormData();
  let audioFilename = "audio.webm";

  if (audioBlob.type === "audio/mp4") {
    audioFilename = "audio.mp4";
  } else if (audioBlob.type === "audio/wav") {
    audioFilename = "audio.wav";
  }

  logger.debug(
    `Transcribing audio Blob with MIME type: ${audioBlob.type}, size: ${(
      audioBlob.size / 1024
    ).toFixed(2)}kb`
  );

  // Add the audio and other input parameters to the FormData object
  formData.append("audio", audioBlob, audioFilename);
  formData.append("duration", audioDurationSeconds.toString());
  formData.append("sequenceNumber", (sequenceNumber ?? 0).toString());
  formData.append("messages", JSON.stringify(messages));
  formData.append("acceptsMerge", "true");
  if (sessionId) {
    formData.append("sessionId", sessionId);
  }

  // Add usage analytics metadata as specified in PRD
  try {
    const usageMeta = await buildUsageMetadata(chatbot);
    if (usageMeta.clientId) formData.append("clientId", usageMeta.clientId);
    if (usageMeta.version) formData.append("version", usageMeta.version);
    if (usageMeta.app) formData.append("app", usageMeta.app);
    if (usageMeta.language) formData.append("language", usageMeta.language);
  } catch (error) {
    logger.warn("[TranscriptionForm] Failed to add usage analytics metadata:", error);
  }

  // Wait for preferences to be retrieved before appending them to the FormData
  const preference = userPreferences.getCachedTranscriptionMode();
  if (preference) {
    formData.append("prefer", preference);
  }

  const discretionaryMode = userPreferences.getCachedDiscretionaryMode();
  if (discretionaryMode) {
    formData.append("analyzeForResponse", "true");
  }

  // Get the chatbot's nickname if set
  if (!chatbot) {
    chatbot = await ChatbotService.getChatbot();
  }
  const nickname = await chatbot.getNickname();
  const defaultName = chatbot.getName();
  if (nickname && nickname !== defaultName) {
    formData.append("nickname", nickname);
  }

  // Add input context for dictation mode if available
  if (inputType) {
    formData.append("inputType", inputType);
  }
  if (inputLabel) {
    formData.append("inputLabel", inputLabel);
  }

  // Remove filler words preference (always send if enabled; server decides applicability)
  const removeFiller = userPreferences.getCachedRemoveFillerWords();
  if (removeFiller) {
    formData.append("removeFillerWords", "true");
  }

  return formData;
}


