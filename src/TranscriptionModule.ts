import { config } from "./ConfigModule";
import StateMachineService from "./StateMachineService";
import { isMobileView } from "./UserAgentModule";
import EventBus from "./EventBus";
import EventModule from "./EventModule";

// Define the shape of the response JSON object
interface TranscriptionResponse {
  text: string;
}

export function uploadAudio(audioBlob: Blob, audioDurationMillis: number): void {
  // Create a FormData object
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
    ).toFixed(2)}kb`,
    audioBlob
  );

  // Add the audio blob to the FormData object
  formData.append("audio", audioBlob, audioFilename);
  // Get the user's preferred language
  const language = navigator.language;

  const startTime = new Date().getTime();
  // Post the audio to the server for transcription
  fetch(`${config.apiServerUrl}/transcribe?language=${language}`, {
    method: "POST",
    body: formData,
  })
    .then((response: Response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    })
    .then((responseJson: TranscriptionResponse) => {
      const endTime = new Date().getTime();
      const transcriptionDurationMillis = endTime - startTime;

      console.log(
        `Transcribed ${Math.round(audioDurationMillis / 1000)}s of audio in ${Math.round(transcriptionDurationMillis / 1000)}s`
      );

      if (responseJson.text.length === 0) {
        StateMachineService.actor.send("saypi:transcribedEmpty");
      } else {
        StateMachineService.actor.send("saypi:transcribed", {
          text: responseJson.text,
        });
      }
    })
    .catch((error: Error) => {
      console.error("Looks like there was a problem: ", error);
      StateMachineService.actor.send("saypi:transcribeFailed");
    });
}

export function handleTranscriptionResponse(transcript: string): void {
  console.log(`Transcript: ${transcript}`);
  const textarea = document.getElementById("saypi-prompt") as HTMLTextAreaElement;
  if (isMobileView()) {
    // if transcript is > 1000 characters, truncate it to 999 characters plus an ellipsis
    if (transcript.length > 1000) {
      transcript = `${transcript.substring(0, 999)}…`;
      console.warn(
        `Transcript was too long for Pi. Truncated to 999 characters, losing the following text: ... ${transcript.substring(999)}`
      );
    }
    EventModule.setNativeValue(textarea, transcript);
    EventBus.emit("saypi:autoSubmit");
  } else {
    EventModule.simulateTyping(textarea, `${transcript} `);
  }
}
