import { config } from "./ConfigModule.js";
import StateMachineService from "./StateMachineService.js";
import { logger } from "./LoggingModule.js";
import { UserPreferenceModule } from "./prefs/PreferenceModule";
import { callApi } from "./ApiClient";
import EventBus from "./events/EventBus";
import { ChatbotService } from "./chatbots/ChatbotService";
import { buildUsageMetadata } from "./usage/UsageMetadata";
import { constructTranscriptionFormData } from "./TranscriptionForm";

// Define the shape of the response JSON object
interface TranscriptionResponse {
  text: string;
  sequenceNumber: number;
  pFinishedSpeaking?: number;
  tempo?: number;
  merged?: number[];
  responseAnalysis?: {
    shouldRespond: boolean;
  };
}

/**
 * Logs the duration of a specific step if it exceeds defined thresholds.
 * @param stepName - Name of the step being logged.
 * @param startTime - The timestamp when the step started.
 * @param thresholdWarn - Threshold in ms for a warning log.
 * @param thresholdError - Threshold in ms for an error log.
 */
function logStepDuration(
  stepName: string,
  startTime: number,
  thresholdWarn: number = 200,
  thresholdError: number = 500,
  context: Record<string, unknown> = {}
): void {
  const duration = Date.now() - startTime;
  const logContext = { ...context, durationMs: duration };
  if (duration > thresholdError) {
    logger.error(`[TranscriptionModule] Critical duration for ${stepName}`, logContext);
  } else if (duration > thresholdWarn) {
    logger.warn(`[TranscriptionModule] High duration for ${stepName}`, logContext);
  } else if (duration > 50) { // Log elevated durations as info
    logger.info(`[TranscriptionModule] Elevated duration for ${stepName}`, logContext);
  }
}

/**
 * Logs transcription processing delays based on threshold values
 * @param captureTimestamp - When the audio was originally captured
 * @param clientTimestamp - When the client received the data 
 * @param transcriptionTimestamp - When transcription processing began
 */
function logTranscriptionDelay(
  captureTimestamp: number,
  clientTimestamp: number | null,
  transcriptionTimestamp: number,
  context: Record<string, unknown> = {}
): void {
  const captureToTranscriptionDelay = transcriptionTimestamp - captureTimestamp;
  const clientToTranscriptionDelay = clientTimestamp ? 
    transcriptionTimestamp - clientTimestamp : null;
  const logContext = {
    ...context,
    captureToTranscriptionDelayMs: captureToTranscriptionDelay,
    clientToTranscriptionDelayMs: clientToTranscriptionDelay
  };
  
  if (captureToTranscriptionDelay > 1000) {
    logger.error(
      `[TranscriptionModule] Critical delay from audio capture to transcription start`,
      logContext
    );
  } else if (captureToTranscriptionDelay > 500) {
    logger.warn(
      `[TranscriptionModule] High delay from audio capture to transcription start`,
      logContext
    );
  } else if (captureToTranscriptionDelay > 300) {
    logger.info(
      `[TranscriptionModule] Elevated delay from audio capture to transcription start`,
      logContext
    );
  }
}

/**
 * Logs API request delays based on threshold values
 * @param captureTimestamp - When the audio was originally captured
 * @param transcriptionTimestamp - When transcription processing began
 * @param apiRequestTimestamp - When the API request was initiated
 */
function logApiRequestDelay(
  captureTimestamp: number,
  transcriptionTimestamp: number,
  apiRequestTimestamp: number,
  context: Record<string, unknown> = {}
): void {
  const captureToApiDelay = apiRequestTimestamp - captureTimestamp;
  const transcriptionToApiDelay = apiRequestTimestamp - transcriptionTimestamp;
  const logContext = {
    ...context,
    captureToApiDelayMs: captureToApiDelay,
    transcriptionToApiDelayMs: transcriptionToApiDelay
  };
  
  if (captureToApiDelay > 1000) {
    logger.error(
      `[TranscriptionModule] Critical API request delay detected`,
      logContext
    );
  } else if (captureToApiDelay > 500) {
    logger.warn(
      `[TranscriptionModule] High API request delay detected`,
      logContext
    );
  } else if (captureToApiDelay > 300) {
    logger.info(
      `[TranscriptionModule] Elevated API request delay detected`,
      logContext
    );
  }
}

const knownNetworkErrorMessages = [
  "Failed to fetch", // Chromium-based browsers
  "Load failed", // Safari
  "NetworkError when attempting to fetch resource.", // Firefox
  // Add more known error messages here
];

// timeout for transcription requests
const TIMEOUT_MS = 10000; // 10 seconds

// track sequence numbers for in-flight transcription requests
let sequenceNum = 0;
const sequenceNumsPendingTranscription: Set<{
  seq: number;
  timestamp: number;
}> = new Set();

const userPreferences = UserPreferenceModule.getInstance();

function checkForExpiredEntries() {
  const now = Date.now();
  sequenceNumsPendingTranscription.forEach((entry) => {
    if (now - entry.timestamp > TIMEOUT_MS) {
      sequenceNumsPendingTranscription.delete(entry);
      logger.info(`Transcription request ${entry.seq} timed out`);
    }
  });
}

function transcriptionSent(): number {
  sequenceNum++;
  sequenceNumsPendingTranscription.add({
    seq: sequenceNum,
    timestamp: Date.now(),
  });
  return sequenceNum;
}

function transcriptionReceived(seq: number): void {
  // delete entry with matching sequence number
  sequenceNumsPendingTranscription.forEach((entry) => {
    if (entry.seq === seq) {
      sequenceNumsPendingTranscription.delete(entry);
      const transcriptionDuration = Date.now() - entry.timestamp;
      logger.debug(
        `Transcription response ${seq} received after ${
          transcriptionDuration / 1000
        }s`
      );
      
      // Track in telemetry
      EventBus.emit("saypi:transcription:received", {
        sequenceNumber: seq,
        duration: transcriptionDuration,
        timestamp: Date.now()
      });
      
      return;
    }
  });
}

export function isTranscriptionPending(): boolean {
  checkForExpiredEntries();
  logger.debug(`[TranscriptionModule] in-flight transcription requests: ${sequenceNumsPendingTranscription.size}`);
  return sequenceNumsPendingTranscription.size > 0;
}

// call after completed user input is submitted
export function clearPendingTranscriptions(): void {
  sequenceNumsPendingTranscription.clear();
}

// Get the current sequence number (useful for tracking which target element to associate with)
export function getCurrentSequenceNumber(): number {
  return sequenceNum;
}

export async function uploadAudioWithRetry(
  audioBlob: Blob,
  audioDurationMillis: number,
  precedingTranscripts: Record<number, string> = {},
  sessionId?: string,
  maxRetries: number = 3,
  captureTimestamp?: number,
  clientReceiveTimestamp?: number,
  inputType?: string,
  inputLabel?: string,
  onSequenceNumber?: (sequenceNumber: number) => void,
): Promise<number> {
  let retryCount = 0;
  let delay = 1000; // initial delay of 1 second
  const transcriptionStartTimestamp = Date.now();
  const estimatedSequenceNumber = sequenceNum + 1;
  
  // Log timing information if timestamps are available
  if (captureTimestamp) {
    logTranscriptionDelay(
      captureTimestamp, 
      clientReceiveTimestamp || null, 
      transcriptionStartTimestamp,
      {
        audioDurationMs: audioDurationMillis,
        audioBytes: audioBlob.size,
        sequenceNumber: estimatedSequenceNumber,
        inputType,
        inputLabel
      }
    );
  }

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  let usedSequenceNumber: number;
  
  while (retryCount < maxRetries) {
    try {
      usedSequenceNumber = transcriptionSent();
      if (onSequenceNumber) {
        try {
          onSequenceNumber(usedSequenceNumber);
        } catch (callbackError) {
          logger.error(
            "[TranscriptionModule] onSequenceNumber callback threw an error",
            callbackError
          );
        }
      }
      await uploadAudio(
        audioBlob,
        audioDurationMillis,
        precedingTranscripts,
        sessionId,
        captureTimestamp,
        transcriptionStartTimestamp,
        usedSequenceNumber,
        inputType,
        inputLabel
      );
      return usedSequenceNumber;
    } catch (error) {
      // check for timeout errors (30s on Heroku)
      if (
        error instanceof TypeError &&
        knownNetworkErrorMessages.includes(error.message)
      ) {
        logger.info(
          `Attempt ${retryCount + 1}/${maxRetries} failed. Retrying in ${
            delay / 1000
          } seconds...`
        );
        await sleep(delay);

        // Exponential backoff
        delay *= 2;

        retryCount++;
      } else {
        console.error("Unexpected error: ", error);
        // Notify both conversation and dictation flows of the failure
        StateMachineService.conversationActor.send("saypi:transcribeFailed", {
          detail: error,
        });
        // Emit a specific failure event that UniversalDictationModule forwards to DictationMachine
        EventBus.emit("saypi:transcribeFailed");
        EventBus.emit("saypi:transcription:failed", {
          sequenceNumber: sequenceNum,
        });
        throw error; // Re-throw non-network errors to exit the retry loop
      }
    }
  }

  logger.error("Max retries reached. Giving up.");
  StateMachineService.conversationActor.send("saypi:transcribeFailed", {
    detail: new Error("Max retries reached"),
  });
  // Ensure DictationMachine leaves transcribing state on terminal failure
  EventBus.emit("saypi:transcribeFailed");
  EventBus.emit("saypi:transcription:failed", {
    sequenceNumber: usedSequenceNumber!,
  });
  throw new Error("Max retries reached");
}

/**
 * Upload audio for refinement pass (Phase 2 dual-phase transcription).
 * This is a bare-bones transcription request that bypasses sequence number tracking.
 *
 * Key differences from uploadAudioWithRetry():
 * - No sequenceNumber parameter or tracking
 * - No precedingTranscripts/acceptsMerge (full audio → full transcription)
 * - No increment of global sequence counter
 * - Uses requestId (UUID) for response correlation instead
 * - Emits separate events: saypi:refinement:started, saypi:refinement:completed, saypi:refinement:failed
 *
 * @param audioBlob - Combined audio from all segments
 * @param audioDurationMillis - Total duration in milliseconds
 * @param requestId - UUID for tracking this refinement request
 * @param sessionId - Optional session ID
 * @param maxRetries - Maximum number of retry attempts
 * @returns Promise resolving to the transcription text
 */
export async function uploadAudioForRefinement(
  audioBlob: Blob,
  audioDurationMillis: number,
  requestId: string,
  sessionId?: string,
  maxRetries: number = 3
): Promise<string> {
  let retryCount = 0;
  let delay = 1000; // initial delay of 1 second
  const transcriptionStartTimestamp = Date.now();

  // Emit refinement started event (moved to outer function to avoid multiple emissions on retry)
  EventBus.emit("saypi:refinement:started", {
    requestId,
    timestamp: transcriptionStartTimestamp,
    audioDurationMs: audioDurationMillis,
    audioBytes: audioBlob.size,
  });

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  while (retryCount < maxRetries) {
    try {
      const transcriptionText = await uploadAudioForRefinementInternal(
        audioBlob,
        audioDurationMillis,
        requestId,
        sessionId,
        transcriptionStartTimestamp
      );

      // Emit refinement-specific completion event
      EventBus.emit("saypi:refinement:completed", {
        requestId,
        text: transcriptionText,
      });

      return transcriptionText;
    } catch (error) {
      // check for timeout errors (30s on Heroku)
      if (
        error instanceof TypeError &&
        knownNetworkErrorMessages.includes(error.message)
      ) {
        logger.info(
          `[Refinement ${requestId}] Attempt ${retryCount + 1}/${maxRetries} failed. Retrying in ${
            delay / 1000
          } seconds...`
        );
        await sleep(delay);

        // Exponential backoff
        delay *= 2;

        retryCount++;
      } else {
        console.error(`[Refinement ${requestId}] Unexpected error:`, error);
        // Emit refinement-specific failure event
        EventBus.emit("saypi:refinement:failed", {
          requestId,
          error,
        });
        throw error; // Re-throw non-network errors to exit the retry loop
      }
    }
  }

  logger.error(`[Refinement ${requestId}] Max retries reached. Giving up.`);
  EventBus.emit("saypi:refinement:failed", {
    requestId,
    error: new Error("Max retries reached"),
  });
  throw new Error("Max retries reached");
}

/**
 * Internal function to upload audio for refinement (bare-bones request).
 * Does NOT use sequence numbers, precedingTranscripts, or acceptsMerge.
 */
async function uploadAudioForRefinementInternal(
  audioBlob: Blob,
  audioDurationMillis: number,
  requestId: string,
  sessionId?: string,
  transcriptionStartTimestamp?: number
): Promise<string> {
  try {
    const chatbot = await ChatbotService.getChatbot();

    // Build minimal FormData (no sequence number, no messages, no acceptsMerge)
    const formData = new FormData();
    let audioFilename = "audio.webm";
    if (audioBlob.type === "audio/mp4") {
      audioFilename = "audio.mp4";
    } else if (audioBlob.type === "audio/wav") {
      audioFilename = "audio.wav";
    }

    formData.append("audio", audioBlob, audioFilename);
    formData.append("duration", (audioDurationMillis / 1000).toString());
    formData.append("requestId", requestId); // UUID for correlation

    if (sessionId) {
      formData.append("sessionId", sessionId);
    }

    // Add minimal usage metadata
    try {
      const usageMeta = await buildUsageMetadata(chatbot);
      if (usageMeta.clientId) formData.append("clientId", usageMeta.clientId);
      if (usageMeta.version) formData.append("version", usageMeta.version);
      if (usageMeta.app) formData.append("app", usageMeta.app);
      if (usageMeta.language) formData.append("language", usageMeta.language);
    } catch (error) {
      logger.warn(`[Refinement ${requestId}] Failed to add usage metadata:`, error);
    }

    // Get user preferences for transcription
    const preference = userPreferences.getCachedTranscriptionMode();
    if (preference) {
      formData.append("prefer", preference);
    }

    // Remove filler words if enabled
    const removeFiller = userPreferences.getCachedRemoveFillerWords();
    if (removeFiller) {
      formData.append("removeFillerWords", "true");
    }

    logger.debug(
      `[Refinement ${requestId}] Uploading ${(audioBlob.size / 1024).toFixed(2)}kb of audio`
    );

    const controller = new AbortController();
    const { signal } = controller;
    setTimeout(() => controller.abort(), TIMEOUT_MS);

    const startTime = Date.now();

    // Build URL params
    const usageMeta = await buildUsageMetadata(chatbot);
    const params = new URLSearchParams();
    if (usageMeta.app) params.set("app", usageMeta.app);
    if (usageMeta.language) params.set("language", usageMeta.language);

    const response = await callApi(
      `${config.apiServerUrl}/transcribe${params.toString() ? `?${params.toString()}` : ""}`,
      {
        method: "POST",
        body: formData,
        signal,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const responseJson = await response.json();
    const endTime = Date.now();
    const transcriptionDurationMillis = endTime - startTime;
    const transcript = responseJson.text;
    const wc = transcript.split(" ").length;

    logger.debug(
      `[Refinement ${requestId}] Transcribed ${Math.round(
        audioDurationMillis / 1000
      )}s of audio into ${wc} words in ${Math.round(
        transcriptionDurationMillis / 1000
      )}s`
    );

    if (transcript.length === 0) {
      logger.warn(`[Refinement ${requestId}] Received empty transcription`);
    }

    return transcript;
  } catch (error) {
    logger.error(`[Refinement ${requestId}] Upload failed:`, error);
    throw error;
  }
}

async function uploadAudio(
  audioBlob: Blob,
  audioDurationMillis: number,
  precedingTranscripts: Record<number, string> = {},
  sessionId?: string,
  captureTimestamp?: number,
  transcriptionStartTimestamp?: number,
  sequenceNumber?: number,
  inputType?: string,
  inputLabel?: string
): Promise<void> {
  try {
    const resolvedSequenceNumber = sequenceNumber ?? (sequenceNum + 1);
    const messages = Object.entries(precedingTranscripts).map(
      ([seq, content]) => {
        return {
          role: "user",
          content: content,
          sequenceNumber: Number(seq),
        };
      }
    );

    let stepStartTime = Date.now();
    const chatbot = await ChatbotService.getChatbot();
    logStepDuration("ChatbotService.getChatbot (uploadAudio)", stepStartTime, 200, 500, {
      sequenceNumber: resolvedSequenceNumber,
      inputType,
      inputLabel
    });

    stepStartTime = Date.now();
    const formData = await constructTranscriptionFormData(
      audioBlob,
      audioDurationMillis / 1000,
      messages,
      sessionId,
      chatbot,
      resolvedSequenceNumber,
      inputType,
      inputLabel
    );
    logStepDuration("constructTranscriptionFormData (total)", stepStartTime, 200, 500, {
      audioDurationMs: audioDurationMillis,
      audioBytes: audioBlob.size,
      sequenceNumber: resolvedSequenceNumber,
      inputType,
      inputLabel,
      precedingTranscriptCount: messages.length
    });
    
    // Gather usage metadata once to build URL params safely
    const usageMeta = await buildUsageMetadata(chatbot);

    const controller = new AbortController();
    const { signal } = controller;

    setTimeout(() => controller.abort(), TIMEOUT_MS);

    const startTime = new Date().getTime();
    
    // Additional timing information for API request
    if (captureTimestamp && transcriptionStartTimestamp) {
      logApiRequestDelay(captureTimestamp, transcriptionStartTimestamp, startTime, {
        audioDurationMs: audioDurationMillis,
        audioBytes: audioBlob.size,
        sequenceNumber: resolvedSequenceNumber,
        inputType,
        inputLabel,
        precedingTranscriptCount: messages.length
      });
    }
    
    // Emit transcription started event for telemetry tracking
    EventBus.emit("saypi:transcribing", {
      sequenceNumber: resolvedSequenceNumber,
      timestamp: startTime,
      captureTimestamp: captureTimestamp,
      clientReceiveTimestamp: transcriptionStartTimestamp,
      apiRequestDelay: captureTimestamp ? (startTime - captureTimestamp) : undefined
    });
    
    const params = new URLSearchParams();
    if (usageMeta.app) params.set("app", usageMeta.app);
    if (usageMeta.language) params.set("language", usageMeta.language);

    const response = await callApi(
      `${config.apiServerUrl}/transcribe${params.toString() ? `?${params.toString()}` : ""}`,
      {
        method: "POST",
        body: formData,
        signal,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const responseJson: TranscriptionResponse = await response.json();
    const seq = responseJson.sequenceNumber;
    if (seq !== undefined) {
      transcriptionReceived(seq);
    }
    const endTime = new Date().getTime();
    const transcriptionDurationMillis = endTime - startTime;
    const transcript = responseJson.text;
    const wc = transcript.split(" ").length;
    const payload: TranscriptionResponse = {
      text: transcript,
      sequenceNumber: seq,
    };
    if (responseJson.hasOwnProperty("pFinishedSpeaking")) {
      payload.pFinishedSpeaking = responseJson.pFinishedSpeaking;
    }
    if (responseJson.hasOwnProperty("tempo")) {
      payload.tempo = responseJson.tempo;
    }
    if (responseJson.hasOwnProperty("merged")) {
      payload.merged = responseJson.merged;
    }
    if (responseJson.hasOwnProperty("responseAnalysis")) {
      payload.responseAnalysis = responseJson.responseAnalysis;
    }

    logger.debug(
      `Transcribed ${Math.round(
        audioDurationMillis / 1000
      )}s of audio into ${wc} words in ${Math.round(
        transcriptionDurationMillis / 1000
      )}s`
    );
    
    if (captureTimestamp) {
      const totalProcessingTime = endTime - captureTimestamp;
      logger.debug(
        `Total processing time from audio capture to transcription completion: ${Math.round(totalProcessingTime / 1000)}s`
      );
    }

    if (responseJson.text.length === 0) {
      StateMachineService.conversationActor.send("saypi:transcribedEmpty");
      EventBus.emit("saypi:transcribedEmpty");
      EventBus.emit("saypi:transcription:empty", {
        sequenceNumber: seq,
      });
    } else {
      StateMachineService.conversationActor.send("saypi:transcribed", payload);
      EventBus.emit("saypi:transcription:completed", payload);
      // no need to emit transcription:received event here, it's handled by transcriptionReceived function
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        logger.error("Fetch aborted due to timeout", error);
      } else {
        logger.error("An unexpected error occurred:", error);
      }
    } else {
      logger.error("Something thrown that is not an Error object:", error);
    }

    // re-throw the error if your logic requires it
    throw error;
  }
}

// (Local duplicate removed; using imported constructTranscriptionFormData)
