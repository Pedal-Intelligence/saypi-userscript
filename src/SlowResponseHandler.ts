import EventBus from "./events/EventBus";
import { SayPiSpeech } from "./tts/SpeechModel";
import {
  PiSpeechSourceParser,
  SayPiSpeechSourceParser,
  SpeechSourceParser,
} from "./tts/SpeechSourceParsers";
import { SpeechSynthesisModule } from "./tts/SpeechSynthesisModule";

class SlowResponseHandler {
  private static instance: SlowResponseHandler;
  private piParser: SpeechSourceParser;
  private sayPiParser: SpeechSourceParser;

  private constructor(speechModule: SpeechSynthesisModule) {
    // Private constructor to prevent instantiation
    this.piParser = new PiSpeechSourceParser();
    this.sayPiParser = new SayPiSpeechSourceParser(speechModule);
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
        console.error("MediaError code 4:", error.message);
        if (
          error.message.includes(
            "DEMUXER_ERROR_COULD_NOT_OPEN: FFmpegDemuxer: open context failed"
          )
        ) {
          console.error(
            "Detected potential slow response causing demuxer error"
          );
          if (this.sayPiParser.matches(src)) {
            this.handleSlowResponseForSayPiAudioProvider();
          } else if (this.piParser.matches(src)) {
            this.handleSlowResponseForPiAudioProvider();
          }
        }
      } else {
        console.error(`Other media error (code ${error.code}):`, error.message);
      }
    } else {
      console.error("Unknown error type:", error);
    }
  }

  // Function to handle slow response
  private handleSlowResponseForSayPiAudioProvider(): void {
    console.log("Detected slow response, increasing timeout");
    // Dispatch a custom event that your extension can listen for
    EventBus.emit("saypi:tts:text:delay");
  }

  private handleSlowResponseForPiAudioProvider(): void {
    console.log("Detected slow response, reloading audio");
    // sleep for 1500ms before reloading the audio
    setTimeout(() => {}, 1500);
  }
}

export default SlowResponseHandler;
