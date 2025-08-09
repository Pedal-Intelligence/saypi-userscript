import { config } from "./ConfigModule.js";
import StateMachineService from "./StateMachineService.js";
import { logger } from "./LoggingModule.js";
import { UserPreferenceModule } from "./prefs/PreferenceModule";
import { callApi } from "./ApiClient";
import EventBus from "./events/EventBus";
import { ChatbotService } from "./chatbots/ChatbotService";

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
function logStepDuration(stepName: string, startTime: number, thresholdWarn: number = 200, thresholdError: number = 500): void {
  const duration = Date.now() - startTime;
  if (duration > thresholdError) {
    logger.error(`[TranscriptionModule] Critical duration for ${stepName}: ${duration}ms`);
  } else if (duration > thresholdWarn) {
    logger.warn(`[TranscriptionModule] High duration for ${stepName}: ${duration}ms`);
  } else if (duration > 50) { // Log elevated durations as info
    logger.info(`[TranscriptionModule] Elevated duration for ${stepName}: ${duration}ms`);
  }
}

/**
 * Logs transcription processing delays based on threshold values
 * @param captureTimestamp - When the audio was originally captured
 * @param clientTimestamp - When the client received the data 
 * @param transcriptionTimestamp - When transcription processing began
 */
function logTranscriptionDelay(captureTimestamp: number, clientTimestamp: number | null, transcriptionTimestamp: number): void {
  const captureToTranscriptionDelay = transcriptionTimestamp - captureTimestamp;
  const clientToTranscriptionDelay = clientTimestamp ? 
    transcriptionTimestamp - clientTimestamp : null;
  
  if (captureToTranscriptionDelay > 1000) {
    logger.error(
      `[TranscriptionModule] Critical delay: ${captureToTranscriptionDelay}ms from audio capture to transcription start. ` +
      `Client-to-transcription: ${clientToTranscriptionDelay}ms`
    );
  } else if (captureToTranscriptionDelay > 500) {
    logger.warn(
      `[TranscriptionModule] High delay: ${captureToTranscriptionDelay}ms from audio capture to transcription start. ` +
      `Client-to-transcription: ${clientToTranscriptionDelay}ms`
    );
  } else if (captureToTranscriptionDelay > 300) {
    logger.info(
      `[TranscriptionModule] Elevated delay: ${captureToTranscriptionDelay}ms from audio capture to transcription start. ` +
      `Client-to-transcription: ${clientToTranscriptionDelay}ms`
    );
  }
}

/**
 * Logs API request delays based on threshold values
 * @param captureTimestamp - When the audio was originally captured
 * @param transcriptionTimestamp - When transcription processing began
 * @param apiRequestTimestamp - When the API request was initiated
 */
function logApiRequestDelay(captureTimestamp: number, transcriptionTimestamp: number, apiRequestTimestamp: number): void {
  const captureToApiDelay = apiRequestTimestamp - captureTimestamp;
  const transcriptionToApiDelay = apiRequestTimestamp - transcriptionTimestamp;
  
  if (captureToApiDelay > 1000) {
    logger.error(
      `[TranscriptionModule] Critical API request delay: ${captureToApiDelay}ms from capture to API request. ` +
      `Transcription start to API request: ${transcriptionToApiDelay}ms`
    );
  } else if (captureToApiDelay > 500) {
    logger.warn(
      `[TranscriptionModule] High API request delay: ${captureToApiDelay}ms from capture to API request. ` +
      `Transcription start to API request: ${transcriptionToApiDelay}ms`
    );
  } else if (captureToApiDelay > 300) {
    logger.info(
      `[TranscriptionModule] Elevated API request delay: ${captureToApiDelay}ms from capture to API request. ` +
      `Transcription start to API request: ${transcriptionToApiDelay}ms`
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
const TIMEOUT_MS = 10000; // 30 seconds

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
  console.debug(`[TranscriptionModule] in-flight transcription requests: ${sequenceNumsPendingTranscription.size}`);
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
): Promise<number> {
  let retryCount = 0;
  let delay = 1000; // initial delay of 1 second
  const transcriptionStartTimestamp = Date.now();
  
  // Log timing information if timestamps are available
  if (captureTimestamp) {
    logTranscriptionDelay(
      captureTimestamp, 
      clientReceiveTimestamp || null, 
      transcriptionStartTimestamp
    );
  }

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  let usedSequenceNumber: number;
  
  while (retryCount < maxRetries) {
    try {
      usedSequenceNumber = transcriptionSent();
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

  console.error("Max retries reached. Giving up.");
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
    logStepDuration("ChatbotService.getChatbot (uploadAudio)", stepStartTime);

    stepStartTime = Date.now();
    const formData = await constructTranscriptionFormData(
      audioBlob,
      audioDurationMillis / 1000,
      messages,
      sessionId,
      chatbot,
      sequenceNumber,
      inputType,
      inputLabel
    );
    logStepDuration("constructTranscriptionFormData (total)", stepStartTime);
    
    stepStartTime = Date.now();
    const language = userPreferences.getCachedLanguage();
    logStepDuration("userPreferences.getCachedLanguage", stepStartTime);
    
    const appId = chatbot.getID();

    const controller = new AbortController();
    const { signal } = controller;

    setTimeout(() => controller.abort(), TIMEOUT_MS);

    const startTime = new Date().getTime();
    
    // Additional timing information for API request
    if (captureTimestamp && transcriptionStartTimestamp) {
      logApiRequestDelay(captureTimestamp, transcriptionStartTimestamp, startTime);
    }
    
    // Emit transcription started event for telemetry tracking
    EventBus.emit("saypi:transcribing", {
      sequenceNumber: sequenceNum,
      timestamp: startTime,
      captureTimestamp: captureTimestamp,
      clientReceiveTimestamp: transcriptionStartTimestamp,
      apiRequestDelay: captureTimestamp ? (startTime - captureTimestamp) : undefined
    });
    
    const response = await callApi(
      `${config.apiServerUrl}/transcribe?app=${appId}&language=${language}`,
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

    logger.info(
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
        console.error("Fetch aborted due to timeout", error);
      } else {
        console.error("An unexpected error occurred:", error);
      }
    } else {
      console.error("Something thrown that is not an Error object:", error);
    }

    // re-throw the error if your logic requires it
    throw error;
  }
}

async function constructTranscriptionFormData(
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
  formData.append("sequenceNumber", sequenceNumber?.toString() || sequenceNum.toString());
  formData.append("messages", JSON.stringify(messages));
  formData.append("acceptsMerge", "true"); // always accept merge requests (since v1.4.10)
  if (sessionId) {
    formData.append("sessionId", sessionId);
  }

  // Wait for preferences to be retrieved before appending them to the FormData
  let stepStartTime = Date.now();
  const preference = userPreferences.getCachedTranscriptionMode();
  logStepDuration("userPreferences.getCachedTranscriptionMode", stepStartTime);
  if (preference) {
    formData.append("prefer", preference);
  }

  stepStartTime = Date.now();
  const discretionaryMode = userPreferences.getCachedDiscretionaryMode();
  logStepDuration("userPreferences.getCachedDiscretionaryMode", stepStartTime);
  if (discretionaryMode) {
    formData.append("analyzeForResponse", "true");
  }

  // Get the chatbot's nickname if set
  if (!chatbot) {
    stepStartTime = Date.now();
    chatbot = await ChatbotService.getChatbot();
    logStepDuration("ChatbotService.getChatbot (constructTranscriptionFormData)", stepStartTime);
  }
  stepStartTime = Date.now();
  const nickname = await chatbot.getNickname();
  logStepDuration("chatbot.getNickname", stepStartTime);
  
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
  stepStartTime = Date.now();
  const removeFiller = userPreferences.getCachedRemoveFillerWords();
  logStepDuration("userPreferences.getCachedRemoveFillerWords", stepStartTime);
  if (removeFiller) {
    formData.append("removeFillerWords", "true");
  }

  return formData;
}
