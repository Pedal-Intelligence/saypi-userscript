import { config } from "./ConfigModule.js";
import StateMachineService from "./StateMachineService.js";
import { ImmersionService } from "./ImmersionService.js";
import EventBus from "./events/EventBus.js";
import EventModule from "./events/EventModule.js";
import { logger } from "./LoggingModule.js";
import { UserPreferenceModule } from "./prefs/PreferenceModule";

// Define the shape of the response JSON object
interface TranscriptionResponse {
  text: string;
  sequenceNumber: number;
  pFinishedSpeaking?: number;
  tempo?: number;
  merged?: number[];
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
          sequenceNumber: Number(seq), // Convert the string to a number
        };
      }
    );

    // Await the async function to get the formData
    const formData = await constructTranscriptionFormData(
      audioBlob,
      audioDurationMillis / 1000,
      messages,
      sessionId
    );
    const language = await userPreferences.getLanguage();

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
    if (responseJson.hasOwnProperty("pFinishedSpeaking")) {
      payload.pFinishedSpeaking = responseJson.pFinishedSpeaking;
    }
    if (responseJson.hasOwnProperty("tempo")) {
      payload.tempo = responseJson.tempo;
    }
    if (responseJson.hasOwnProperty("merged")) {
      payload.merged = responseJson.merged;
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
  sessionId?: string
) {
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

  // Add the audio and other input parameters to the FormData object
  formData.append("audio", audioBlob, audioFilename);
  formData.append("duration", audioDurationSeconds.toString());
  formData.append("sequenceNumber", sequenceNum.toString());
  formData.append("messages", JSON.stringify(messages));
  formData.append("acceptsMerge", "true"); // always accept merge requests (since v1.4.10)
  if (sessionId) {
    formData.append("sessionId", sessionId);
  }

  // Wait for the preference to be retrieved before appending it to the FormData
  const preference = await userPreferences.getTranscriptionMode();
  if (preference) {
    formData.append("prefer", preference);
  }

  return formData;
}

function scrollToBottom(textarea: HTMLTextAreaElement) {
  // Define the height range for the textarea
  const maxHeight = 455;
  const minHeight = 32;

  // Reset the height to get the correct scrollHeight
  textarea.style.height = `${minHeight}px`; // (initial height) aka 2rem

  // Set the height of the textarea, up to the maximum height
  if (textarea.scrollHeight > maxHeight) {
    textarea.style.height = `${maxHeight}px`;
    textarea.style.overflowY = "scroll"; // Enable vertical scrollbar
  } else {
    const newHeight = Math.max(minHeight, textarea.scrollHeight);
    textarea.style.height = `${newHeight}px`;
    textarea.style.overflowY = "hidden"; // Hide vertical scrollbar
  }

  // Scroll to the bottom
  textarea.scrollTop = textarea.scrollHeight;
}

/**
 * Get the prompt textarea's current placeholder text
 */
export function getDraftPrompt(): string {
  const textarea = document.getElementById(
    "saypi-prompt"
  ) as HTMLTextAreaElement;

  return textarea.getAttribute("placeholder") || "";
}

/**
 * Set a descriptive message for the user in the prompt textarea
 * Used to inform the user of the current state of the application
 * @param label The placeholder text to be displayed in the prompt textarea
 */
export function setUserMessage(label: string): void {
  const textarea = document.getElementById(
    "saypi-prompt"
  ) as HTMLTextAreaElement;
  textarea.setAttribute("placeholder", label);
  scrollToBottom(textarea);
}

/**
 * Set the prompt textarea to the given transcript, but do not submit it
 * @param transcript The prompt to be displayed in the prompt textarea
 */
export function setDraftPrompt(transcript: string): void {
  const textarea = document.getElementById(
    "saypi-prompt"
  ) as HTMLTextAreaElement;

  UserPreferenceModule.getAutoSubmit().then((autoSubmit) => {
    if (autoSubmit) {
      textarea.setAttribute("placeholder", `${transcript}`);
    } else {
      textarea.setAttribute("placeholder", "");
      // clear the text area content
      textarea.value = "";
      EventModule.simulateTyping(textarea, `${transcript} `, false);
    }
    scrollToBottom(textarea);
  });
}

const PROMPT_CHARACTER_LIMIT = 4000;
export function setFinalPrompt(transcript: string): void {
  logger.info(`Final transcript: ${transcript}`);
  const textarea = document.getElementById(
    "saypi-prompt"
  ) as HTMLTextAreaElement;
  if (ImmersionService.isViewImmersive()) {
    // if transcript is > max characters, truncate it to max-1 characters plus an ellipsis
    if (transcript.length > PROMPT_CHARACTER_LIMIT) {
      const truncatedLength = PROMPT_CHARACTER_LIMIT - 1;
      transcript = `${transcript.substring(0, truncatedLength)}…`;
      console.warn(
        `Transcript was too long for Pi. Truncated to ${truncatedLength} characters, losing the following text: ... ${transcript.substring(
          truncatedLength
        )}`
      );
    }
    EventModule.typeTextAndSubmit(textarea, transcript, true);
  } else {
    EventModule.simulateTyping(textarea, `${transcript} `, true); // types and submits the prompt
  }
}
