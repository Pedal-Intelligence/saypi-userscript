import {
  SpeechSynthesisUtteranceRemote,
  SpeechSynthesisVoiceRemote,
} from "./SpeechSynthesisModule";
import { TextToSpeechService } from "./TextToSpeechService";

const STREAM_TIMEOUT_MS = 10000; // end streams after 10 seconds of inactivity
const BUFFER_TIMEOUT_MS = 5000; // flush buffers after 5 seconds of inactivity (should it be coordinated with the timeout in InputStream.ts?)
const START_OF_SPEECH_MARKER = " "; // In the first message, the text should be a space " " to indicate the start of speech (why?)
const END_OF_SPEECH_MARKER = ""; // In the last message, the text should be an empty string to indicate the end of speech (why?)

export class AudioStreamManager {
  private speechBuffers: { [uuid: string]: string } = {};
  private speechBufferTimeouts: { [uuid: string]: NodeJS.Timeout } = {}; // flushes the buffer if idle for too long
  private speechStreamTimeouts: { [uuid: string]: NodeJS.Timeout } = {}; // ends the stream if idle for too long

  constructor(private ttsService: TextToSpeechService) {}

  async createStream(
    uuid: string,
    voice: SpeechSynthesisVoiceRemote,
    lang: string
  ): Promise<SpeechSynthesisUtteranceRemote> {
    const utterance = await this.ttsService.createSpeech(
      uuid,
      START_OF_SPEECH_MARKER,
      voice,
      lang,
      true
    );

    // Start a timeout that will end the stream if not reset in 10 seconds
    this.speechStreamTimeouts[utterance.id] = setTimeout(() => {
      this.endStream(utterance.id);
    }, STREAM_TIMEOUT_MS);
    return utterance;
  }

  async addSpeechToStream(uuid: string, text: string): Promise<void> {
    // Add text to buffer
    if (!this.speechBuffers[uuid]) {
      this.speechBuffers[uuid] = "";
    }
    console.log(`Adding text to speech buffer: "${text}"`);
    this.speechBuffers[uuid] += text;
    console.log(`Speech buffer now stands at: "${this.speechBuffers[uuid]}"`);

    // Send buffer if text ends with a sentence break or timeout is not set
    if (
      [".", "!", "?"].some((end) => text.endsWith(end)) ||
      text === END_OF_SPEECH_MARKER ||
      !this.speechBufferTimeouts[uuid]
    ) {
      await this.sendBuffer(uuid);
    }

    // Set/reset timeout to send buffer after 5 seconds
    if (this.speechBufferTimeouts[uuid]) {
      clearTimeout(this.speechBufferTimeouts[uuid]);
    }
    this.speechBufferTimeouts[uuid] = setTimeout(async () => {
      await this.sendBuffer(uuid);
    }, BUFFER_TIMEOUT_MS);
  }

  private async sendBuffer(uuid: string): Promise<void> {
    const text = this.speechBuffers[uuid];
    this.ttsService.addTextToSpeechStream(uuid, text).then(() => {
      // Reset the timeout
      if (this.speechStreamTimeouts[uuid]) {
        clearTimeout(this.speechStreamTimeouts[uuid]);
        this.speechStreamTimeouts[uuid] = setTimeout(() => {
          this.endStream(uuid);
        }, STREAM_TIMEOUT_MS);
      }
    });
  }

  async endStream(uuid: string): Promise<void> {
    // Clear the timeout
    if (this.speechStreamTimeouts[uuid]) {
      clearTimeout(this.speechStreamTimeouts[uuid]);
      delete this.speechStreamTimeouts[uuid];
      console.log("Ending speech stream");
      this.addSpeechToStream(uuid, END_OF_SPEECH_MARKER);
    } else {
      console.log("Speech stream already ended");
    }
  }
}
