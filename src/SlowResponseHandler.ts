import { ReloadAudioRequest } from "./audio/AudioEvents";
import EventBus from "./events/EventBus";
import { audioProviders, SayPiSpeech } from "./tts/SpeechModel";
import {
  PiSpeechSourceParser,
  SayPiSpeechSourceParser,
  SpeechSourceParser,
} from "./tts/SpeechSourceParsers";
import { SpeechSynthesisModule } from "./tts/SpeechSynthesisModule";

class SlowResponseHandler {
  private static instance: SlowResponseHandler;

  private constructor(private speechModule: SpeechSynthesisModule) {
    // Private constructor to prevent instantiation
  }

  public static getInstance(): SlowResponseHandler {
    if (!SlowResponseHandler.instance) {
      const voiceModule = SpeechSynthesisModule.getInstance();
      SlowResponseHandler.instance = new SlowResponseHandler(voiceModule);
    }
    return SlowResponseHandler.instance;
  }

  // Function to handle audio errors
  public handleAudioError(event: Event): void {
    const audioElement = event.target as HTMLAudioElement;
    const error = audioElement.error;
    const src = audioElement.currentSrc;

    if (error instanceof MediaError) {
      if (error.code === 4) {
        console.error(
          "Detected potential slow response. MediaError code 4:",
          error.message
        );
        this.handleSlowResponseForTextStream();
        this.speechModule.getActiveAudioProvider().then((audioProvider) => {
          if (audioProvider === audioProviders.Pi) {
            this.handleSlowResponseForAudioStream(src);
          }
        });
      } else {
        console.error(`Other media error (code ${error.code}):`, error.message);
      }
    } else {
      console.error("Unknown error type:", error);
    }
  }

  // Function to handle slow response
  private handleSlowResponseForTextStream(): void {
    console.log("Detected slow response, increasing timeout");
    // Dispatch a custom event that your extension can listen for
    EventBus.emit("saypi:tts:text:delay");
  }

  private handleSlowResponseForAudioStream(src: string): void {
    console.log("Detected slow response, reloading audio from", src);
    // sleep for 1500ms before reloading the audio
    setTimeout(() => {
      const details: ReloadAudioRequest = {
        bypassCache: true,
        playImmediately: true,
      };
      EventBus.emit("audio:reload", details);
    }, 1500 * 2);
  }
}

export default SlowResponseHandler;
