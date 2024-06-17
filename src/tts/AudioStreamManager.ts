import { TextToSpeechService } from "./TextToSpeechService";
import { InputBuffer } from "./InputBuffer";
import { SpeechSynthesisVoiceRemote, SpeechUtterance } from "./SpeechModel";

const STREAM_TIMEOUT_MS = 15000; // end streams after prolonged inactivity
const BUFFER_TIMEOUT_MS = 1000; // flush buffers after inactivity
const START_OF_SPEECH_MARKER = " "; // In the first message, the text should be a space " " to indicate the start of speech (why?)

export class AudioStreamManager {
  private inputBuffers: { [uuid: string]: InputBuffer } = {};

  constructor(private ttsService: TextToSpeechService) {}

  async createStream(
    uuid: string,
    voice: SpeechSynthesisVoiceRemote,
    lang: string
  ): Promise<SpeechUtterance> {
    const utterance = await this.ttsService.createSpeech(
      uuid,
      START_OF_SPEECH_MARKER,
      voice,
      lang,
      true
    );

    this.inputBuffers[utterance.id] = new InputBuffer(
      utterance.id,
      this.ttsService,
      BUFFER_TIMEOUT_MS,
      STREAM_TIMEOUT_MS
    );

    return utterance;
  }

  async addSpeechToStream(uuid: string, text: string): Promise<void> {
    if (this.inputBuffers[uuid]) {
      this.inputBuffers[uuid].addText(text);
    } else {
      console.error(`No input buffer found for UUID: ${uuid}`);
    }
  }

  async endStream(uuid: string): Promise<void> {
    if (this.inputBuffers[uuid]) {
      this.inputBuffers[uuid].endInput();
    } else {
      console.log("Speech stream already ended or not found");
    }
  }

  getPendingText(uuid: string): string {
    return this.inputBuffers[uuid]?.getPendingText() || "";
  }

  isPending(uuid: string, text: string): boolean {
    return this.inputBuffers[uuid]?.isPending(text) || false;
  }

  hasSent(uuid: string, text: string): boolean {
    return this.inputBuffers[uuid]?.hasSent(text) || false;
  }

  hasEnded(uuid: string): boolean {
    return this.inputBuffers[uuid]?.hasEnded() || true;
  }

  /* visible for testing */
  getInputBuffer(uuid: string): InputBuffer | undefined {
    return this.inputBuffers[uuid];
  }
}
