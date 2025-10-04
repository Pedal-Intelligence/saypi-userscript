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
import { buildUsageMetadata } from "../usage/UsageMetadata";

const KEEP_ALIVE_RATE_WINDOW_MS = 12000;
const MAX_KEEP_ALIVES_PER_RATE_WINDOW = 2;

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
  totalChunks?: number;
}

interface TTSStreamOptions {
  isFinalChunk?: boolean;
}

export class TextToSpeechService {
  private sequenceNumbers: { [key: string]: number } = {};
  private keepAliveTimestamps: number[] = [];
  private keepAliveSuppressedCount = 0;
  private keepAliveSuppressionStart: number | null = null;
  private keepAliveSuppressionLastLog: number | null = null;

  public async getVoiceById(id: string): Promise<SpeechSynthesisVoiceRemote> {
    const response = await callApi(`${this.serviceUrl}/voices/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to get voice: ${response.status}`);
    }
    return response.json();
  }

  public async getVoices(
    chatbot?: Chatbot,
    chatbotIdOverride?: string
  ): Promise<SpeechSynthesisVoiceRemote[]> {
    const appId = chatbotIdOverride ?? (chatbot ? chatbot.getID() : ChatbotIdentifier.getAppId());
    const endpoint = new URL(`${this.serviceUrl}/voices`);
    if (appId) {
      endpoint.searchParams.set("app", appId.toLowerCase());
    }
    const response = await callApi(endpoint.toString());
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
      const usageMeta = await buildUsageMetadata(chatbot);
      if (usageMeta.clientId) data.clientId = usageMeta.clientId;
      if (usageMeta.version) data.version = usageMeta.version;
      if (usageMeta.app) data.app = usageMeta.app;
    } catch (error) {
      console.warn("[TextToSpeechService] Failed to add usage analytics metadata:", error);
      // Continue without analytics metadata if there's an error
    }
    
    this.sequenceNumbers[uuid] = 0; // initialize sequence number for this utterance
    const baseUri = `${this.serviceUrl}/speak/${uuid}`;
    const params = new URLSearchParams();
    params.set("voice_id", voice_id);
    params.set("lang", lang);
    // Always lowercase app id in query param as well
    if (appId) {
      params.set("app", appId.toLowerCase());
    }
    let uri = stream
      ? `${baseUri}/stream?${params.toString()}`
      : `${baseUri}?${params.toString()}`;

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
    text: string,
    options: TTSStreamOptions = {}
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
    if (options.isFinalChunk) {
      data.totalChunks = sequenceNumber;
    }
    const uri = `${this.serviceUrl}/speak/${uuid}/stream`;
    const startTime = typeof performance !== "undefined" ? performance.now() : Date.now();
    console.debug(
      `[TTS Stream] Sending chunk seq=${sequenceNumber} uuid=${uuid} length=${text.length}`
    );

    let response: Response;
    try {
      response = await callApi(uri, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error(
        `[TTS Stream] Network error while sending chunk seq=${sequenceNumber} uuid=${uuid}`,
        error
      );
      throw error;
    }

    const duration = (typeof performance !== "undefined" ? performance.now() : Date.now()) - startTime;
    console.debug(
      `[TTS Stream] Chunk seq=${sequenceNumber} uuid=${uuid} completed with status ${response.status} in ${duration.toFixed(0)}ms`
    );

    if (response.status === 429) {
      // "expected failure" → return object, not exception
      console.info(
        `Cannot add text to failed utterance ${uuid}. Skipping ${text.length} characters.`
      );
      return;
    }
    if (![200, 201].includes(response.status)) {
      console.error(
        `[TTS Stream] Unexpected status ${response.status} while sending chunk seq=${sequenceNumber} uuid=${uuid}`
      );
      throw new Error("Failed to add text to speech stream");
    }

    if (options.isFinalChunk) {
      delete this.sequenceNumbers[uuid];
    }
  }

  public async sendKeepAlive(uuid: string): Promise<boolean> {
    if (!uuid || isPlaceholderUtterance(uuid) || uuid.startsWith("failed-")) {
      return false;
    }

    const now = Date.now();
    if (this.isKeepAliveRateLimited(now)) {
      this.recordSuppressedKeepAlive(now, uuid);
      return false;
    }
    this.flushSuppressedKeepAlives(now, uuid);
    this.keepAliveTimestamps.push(now);

    const uri = `${this.serviceUrl}/speak/${uuid}/stream`;
    try {
      const response = await callApi(uri, {
        method: "PUT",
        body: JSON.stringify({ keepAlive: true }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        console.error(`[TTS KeepAlive] Unauthorized for stream ${uuid}`);
        return false;
      }

      if (response.status === 429) {
        console.warn(`[TTS KeepAlive] Rate limited for stream ${uuid}`);
        return false;
      }

      if (!response.ok) {
        console.error(
          `[TTS KeepAlive] Failed with status ${response.status} for stream ${uuid}`
        );
        return false;
      }

      console.debug(`[TTS KeepAlive] Sent keep-alive for stream ${uuid}`);
      return true;
    } catch (error) {
      console.error(`[TTS KeepAlive] Network error for stream ${uuid}`, error);
      return false;
    }
  }

  private isKeepAliveRateLimited(now: number): boolean {
    this.keepAliveTimestamps = this.keepAliveTimestamps.filter(
      (timestamp) => now - timestamp < KEEP_ALIVE_RATE_WINDOW_MS
    );

    return this.keepAliveTimestamps.length >= MAX_KEEP_ALIVES_PER_RATE_WINDOW;
  }

  private recordSuppressedKeepAlive(now: number, uuid: string): void {
    if (this.keepAliveSuppressionStart === null) {
      this.keepAliveSuppressionStart = now;
      this.keepAliveSuppressedCount = 0;
      this.keepAliveSuppressionLastLog = null;
    }

    this.keepAliveSuppressedCount += 1;

    if (this.keepAliveSuppressionLastLog === null) {
      console.warn(
        `[TTS KeepAlive] Global rate guard activated; suppressing keep-alives (first uuid=${uuid}).`
      );
      this.keepAliveSuppressionLastLog = now;
      return;
    }

    if (now - this.keepAliveSuppressionLastLog >= KEEP_ALIVE_RATE_WINDOW_MS) {
      const duration = now - (this.keepAliveSuppressionStart ?? now);
      console.warn(
        `[TTS KeepAlive] Still suppressing keep-alives; ${this.keepAliveSuppressedCount} blocked over ${duration}ms (latest uuid=${uuid}).`
      );
      this.keepAliveSuppressionLastLog = now;
    }
  }

  private flushSuppressedKeepAlives(now: number, resumedUuid: string): void {
    if (
      this.keepAliveSuppressionStart === null ||
      this.keepAliveSuppressedCount === 0
    ) {
      return;
    }

    const duration = now - this.keepAliveSuppressionStart;
    console.warn(
      `[TTS KeepAlive] Suppressed ${this.keepAliveSuppressedCount} keep-alives over ${duration}ms before resuming (uuid=${resumedUuid}).`
    );

    this.keepAliveSuppressedCount = 0;
    this.keepAliveSuppressionStart = null;
    this.keepAliveSuppressionLastLog = null;
  }
}
