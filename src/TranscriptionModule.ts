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

function transcriptionSent(): void {
  sequenceNum++;
  sequenceNumsPendingTranscription.add({
    seq: sequenceNum,
    timestamp: Date.now(),
  });
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
  return sequenceNumsPendingTranscription.size > 0;
}

// call after completed user input is submitted
export function clearPendingTranscriptions(): void {
  sequenceNumsPendingTranscription.clear();
}

export async function uploadAudioWithRetry(
  audioBlob: Blob,
  audioDurationMillis: number,
  precedingTranscripts: Record<number, string> = {},
  sessionId?: string,
  maxRetries: number = 3
): Promise<void> {
  let retryCount = 0;
  let delay = 1000; // initial delay of 1 second

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  while (retryCount < maxRetries) {
    try {
      transcriptionSent();
      await uploadAudio(
        audioBlob,
        audioDurationMillis,
        precedingTranscripts,
        sessionId
      );
      return;
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
        StateMachineService.actor.send("saypi:transcribeFailed", {
          detail: error,
        });
        return;
      }
    }
  }

  console.error("Max retries reached. Giving up.");
  StateMachineService.actor.send("saypi:transcribeFailed", {
    detail: new Error("Max retries reached"),
  });
}

async function uploadAudio(
  audioBlob: Blob,
  audioDurationMillis: number,
  precedingTranscripts: Record<number, string> = {},
  sessionId?: string
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

    const chatbot = await ChatbotService.getChatbot();
    const formData = await constructTranscriptionFormData(
      audioBlob,
      audioDurationMillis / 1000,
      messages,
      sessionId,
      chatbot
    );
    const language = await userPreferences.getLanguage();
    const appId = chatbot.getID();

    const controller = new AbortController();
    const { signal } = controller;

    setTimeout(() => controller.abort(), TIMEOUT_MS);

    const startTime = new Date().getTime();
    
    // Emit transcription started event for telemetry tracking
    EventBus.emit("saypi:transcribing", {
      sequenceNumber: sequenceNum,
      timestamp: startTime,
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

    if (responseJson.text.length === 0) {
      StateMachineService.actor.send("saypi:transcribedEmpty");
    } else {
      StateMachineService.actor.send("saypi:transcribed", payload);
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
  chatbot?: any
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
  formData.append("sequenceNumber", sequenceNum.toString());
  formData.append("messages", JSON.stringify(messages));
  formData.append("acceptsMerge", "true"); // always accept merge requests (since v1.4.10)
  if (sessionId) {
    formData.append("sessionId", sessionId);
  }

  // Wait for preferences to be retrieved before appending them to the FormData
  const preference = await userPreferences.getTranscriptionMode();
  if (preference) {
    formData.append("prefer", preference);
  }

  const discretionaryMode = await userPreferences.getDiscretionaryMode();
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

  return formData;
}
