import {
  isPlaceholderUtterance,
  isFailedUtterance,
  SayPiSpeech,
  SpeechSynthesisVoiceRemote,
  SpeechUtterance,
} from "./SpeechModel";
import { callApi } from "../ApiClient";
import { Chatbot } from "../chatbots/Chatbot";
import { ChatbotIdentifier } from "../chatbots/ChatbotIdentifier";
import { FailedSpeechUtterance } from "./FailedSpeechUtterance";
import { SpeechFailureReason } from "./SpeechFailureReason";
import { getClientId } from "../usage/ClientIdManager";
import { getExtensionVersion } from "../usage/VersionManager";

/**
 * Interface for TTS request data sent to the /speak/{uuid} endpoint
 */
interface TTSRequestData {
  voice: string;
  text: string;
  lang: string;
  sequenceNumber: number;
  // Usage analytics metadata (optional but recommended)
  clientId?: string;
  version?: string;
  app?: string;
}

/**
 * Interface for TTS stream request data sent to /speak/{uuid}/stream endpoint
 */
interface TTSStreamRequestData {
  text: string;
  sequenceNumber: number;
}

export class TextToSpeechService {
  private sequenceNumbers: { [key: string]: number } = {};

  public async getVoiceById(id: string): Promise<SpeechSynthesisVoiceRemote> {
    const response = await callApi(`${this.serviceUrl}/voices/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to get voice: ${response.status}`);
    }
    return response.json();
  }

  public async getVoices(chatbot?: Chatbot): Promise<SpeechSynthesisVoiceRemote[]> {
    const appId = chatbot ? chatbot.getID() : ChatbotIdentifier.getAppId();
    const endpoint = `${this.serviceUrl}/voices?app=${appId}`;
    const response = await callApi(endpoint);
    if (response.status === 401) {
      // treat unauthenticated the same as "no voices"
      return [];
    }
    if (!response.ok) {
      throw new Error(`Failed to get voices: ${response.status}`);
    }
    return response.json();
  }

  private serviceUrl: string;

  public constructor(serviceUrl: string) {
    this.serviceUrl = serviceUrl;
  }

  public async createSpeech(
    uuid: string,
    text: string,
    voice: SpeechSynthesisVoiceRemote,
    lang: string,
    stream: boolean,
    chatbot?: Chatbot
  ): Promise<SpeechUtterance> {
    if (isPlaceholderUtterance(uuid)) {
      throw new Error("Cannot create speech from placeholder");
    }
    const voice_id = voice.id;
    const appId = chatbot ? chatbot.getID() : ChatbotIdentifier.getAppId();
    
    // Prepare data with usage analytics metadata as specified in PRD
    const data: TTSRequestData = { 
      voice: voice_id, 
      text: text, 
      lang: lang, 
      sequenceNumber: 0
    };
    
    // Add usage analytics metadata
    try {
      const clientId = await getClientId();
      data.clientId = clientId;
      
      const version = getExtensionVersion();
      data.version = version;
      
      data.app = appId.toLowerCase();
    } catch (error) {
      console.warn("[TextToSpeechService] Failed to add usage analytics metadata:", error);
      // Continue without analytics metadata if there's an error
    }
    
    this.sequenceNumbers[uuid] = 0; // initialize sequence number for this utterance
    const baseUri = `${this.serviceUrl}/speak/${uuid}`;
    const queryParams = `voice_id=${voice_id}&lang=${lang}&app=${appId}`;
    let uri = stream
      ? `${baseUri}/stream?${queryParams}`
      : `${baseUri}?${queryParams}`;

    const utterance: SpeechUtterance = new SayPiSpeech(uuid, lang, voice, uri);
    const response = await callApi(uri, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (response.status === 429) {
      // "expected failure" → return object, not exception
      return new FailedSpeechUtterance(
        uuid,
        lang,
        voice,
        SpeechFailureReason.InsufficientCredit
      );
    }
    
    if (![200, 201].includes(response.status)) {
      throw new Error("Failed to synthesize speech");
    }
    return utterance;
  }

  public async addTextToSpeechStream(
    uuid: string,
    text: string
  ): Promise<void> {
    if (isPlaceholderUtterance(uuid)) {
      console.info(
        `Cannot add text to placeholder. Skipping ${text.length} characters.`
      );
      return;
    }
    
    // Check if this is a failed utterance ID we're tracking
    // This is a simple way to prevent sending additional requests when we know they'll fail
    // A more robust solution would track failed utterances in a separate collection
    if (uuid.startsWith("failed-")) {
      console.info(
        `Cannot add text to failed utterance. Skipping ${text.length} characters.`
      );
      return;
    }
    
    if (!this.sequenceNumbers[uuid]) {
      this.sequenceNumbers[uuid] = 1; // assume additions follow an initial creation with sequence number 0
    }
    const sequenceNumber = this.sequenceNumbers[uuid]++;
    const data: TTSStreamRequestData = { text: text, sequenceNumber: sequenceNumber };
    const uri = `${this.serviceUrl}/speak/${uuid}/stream`;
    const response = await callApi(uri, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 429) {
      // "expected failure" → return object, not exception
      console.info(
        `Cannot add text to failed utterance ${uuid}. Skipping ${text.length} characters.`
      );
      return;
    }
    if (![200, 201].includes(response.status)) {
      throw new Error("Failed to add text to speech stream");
    }
  }
}
