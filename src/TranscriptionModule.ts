import { config } from "./ConfigModule.js";
import StateMachineService from "./StateMachineService.js";
import { isMobileView } from "./UserAgentModule.js";
import EventBus from "./EventBus.js";
import EventModule from "./EventModule.js";
import { logger } from "./LoggingModule.js";

// Define the shape of the response JSON object
interface TranscriptionResponse {
  text: string;
  sequenceNumber: number;
  pFinishedSpeaking?: number;
}

const knownNetworkErrorMessages = [
  "Failed to fetch", // Chromium-based browsers
  "Load failed", // Safari
  "NetworkError when attempting to fetch resource.", // Firefox
  // Add more known error messages here
];

// timeout for transcription requests
const TIMEOUT_MS = 30000; // 30 seconds

// track sequence numbers for in-flight transcription requests
let sequenceNum = 0;
const sequenceNumsPendingTranscription: Set<{
  seq: number;
  timestamp: number;
}> = new Set();

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
      logger.debug(
        `Transcription response ${seq} received after ${
          (Date.now() - entry.timestamp) / 1000
        }s`
      );
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
  maxRetries: number = 3
): Promise<void> {
  let retryCount = 0;
  let delay = 1000; // initial delay of 1 second

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  while (retryCount < maxRetries) {
    try {
      transcriptionSent();
      await uploadAudio(audioBlob, audioDurationMillis);
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
  audioDurationMillis: number
): Promise<void> {
  try {
    const formData = constructTranscriptionFormData(audioBlob);
    const language = navigator.language;

    const controller = new AbortController();
    const { signal } = controller;

    setTimeout(() => controller.abort(), TIMEOUT_MS);

    const startTime = new Date().getTime();
    const response: Response = await fetch(
      `${config.apiServerUrl}/transcribe?language=${language}`,
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
    if (responseJson.pFinishedSpeaking) {
      payload.pFinishedSpeaking = responseJson.pFinishedSpeaking;
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

function constructTranscriptionFormData(audioBlob: Blob) {
  const formData = new FormData();
  let audioFilename = "audio.webm";

  if (audioBlob.type === "audio/mp4") {
    audioFilename = "audio.mp4";
  } else if (audioBlob.type === "audio/wav") {
    audioFilename = "audio.wav";
  }

  logger.info(
    `Transcribing audio Blob with MIME type: ${audioBlob.type}, size: ${(
      audioBlob.size / 1024
    ).toFixed(2)}kb`
  );

  // Add the audio blob to the FormData object
  formData.append("audio", audioBlob, audioFilename);
  formData.append("sequenceNumber", sequenceNum.toString());
  return formData;
}

export function setPromptText(transcript: string): void {
  logger.info(`Merged transcript: ${transcript}`);
  const textarea = document.getElementById(
    "saypi-prompt"
  ) as HTMLTextAreaElement;
  if (isMobileView()) {
    // if transcript is > 1000 characters, truncate it to 999 characters plus an ellipsis
    if (transcript.length > 1000) {
      transcript = `${transcript.substring(0, 999)}…`;
      console.warn(
        `Transcript was too long for Pi. Truncated to 999 characters, losing the following text: ... ${transcript.substring(
          999
        )}`
      );
    }
    EventModule.setNativeValue(textarea, transcript);
    EventBus.emit("saypi:autoSubmit");
  } else {
    EventModule.simulateTyping(textarea, `${transcript} `);
  }
}

export function mergeTranscripts(transcripts: Record<number, string>): string {
  const sortedKeys = Object.keys(transcripts)
    .map(Number)
    .sort((a, b) => a - b);

  const sortedTranscripts: string[] = [];

  for (const key of sortedKeys) {
    sortedTranscripts.push(transcripts[key].trim());
  }

  return sortedTranscripts.join(" ");
}
