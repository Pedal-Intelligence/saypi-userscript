import { config } from "./ConfigModule";
import StateMachineService from "./StateMachineService";
import { isMobileView } from "./UserAgentModule";
import EventBus from "./EventBus";
import EventModule from "./EventModule";

// Define the shape of the response JSON object
interface TranscriptionResponse {
  text: string;
  pFinishedSpeaking?: number;
}

const knownNetworkErrorMessages = [
  "Failed to fetch", // Chromium-based browsers
  "Load failed", // Safari
  "NetworkError when attempting to fetch resource.", // Firefox
  // Add more known error messages here
];

export async function uploadAudioWithRetry(
  audioBlob: Blob,
  audioDurationMillis: number,
  precedingTranscripts: string[] = [],
  maxRetries: number = 3
): Promise<void> {
  let retryCount = 0;
  let delay = 1000; // initial delay of 1 second

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  while (retryCount < maxRetries) {
    try {
      await uploadAudio(audioBlob, audioDurationMillis, precedingTranscripts);
      return;
    } catch (error) {
      // check for timeout errors (30s on Heroku)
      if (
        error instanceof TypeError &&
        knownNetworkErrorMessages.includes(error.message)
      ) {
        console.log(
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
  precedingTranscripts: string[] = []
): Promise<void> {
  try {
    const messages = precedingTranscripts.map((transcript) => ({
      role: "user",
      content: transcript,
    }));
    const formData = constructTranscriptionFormData(audioBlob, messages);
    const language = navigator.language;

    const startTime = new Date().getTime();
    const response: Response = await fetch(
      `${config.apiServerUrl}/transcribe?language=${language}`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const responseJson: TranscriptionResponse = await response.json();
    const endTime = new Date().getTime();
    const transcriptionDurationMillis = endTime - startTime;
    const transcript = responseJson.text;
    const wc = transcript.split(" ").length;
    const payload: TranscriptionResponse = { text: transcript };
    if (responseJson.pFinishedSpeaking) {
      payload.pFinishedSpeaking = responseJson.pFinishedSpeaking;
    }

    console.log(
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
  } catch (error) {
    // raise to the next level for retry logic
    throw error;
  }
}

function constructTranscriptionFormData(
  audioBlob: Blob,
  messages: { role: string; content: string }[]
) {
  const formData = new FormData();
  let audioFilename = "audio.webm";

  if (audioBlob.type === "audio/mp4") {
    audioFilename = "audio.mp4";
  } else if (audioBlob.type === "audio/wav") {
    audioFilename = "audio.wav";
  }

  console.log(
    `Transcribing audio Blob with MIME type: ${audioBlob.type}, size: ${(
      audioBlob.size / 1024
    ).toFixed(2)}kb`
  );
  console.log(`Providing ${messages.length} preceding messages as context`);

  // Add the audio blob to the FormData object
  formData.append("audio", audioBlob, audioFilename);
  formData.append("messages", JSON.stringify(messages));
  return formData;
}

export function setPromptText(transcript: string): void {
  console.log(`Transcript: ${transcript}`);
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
