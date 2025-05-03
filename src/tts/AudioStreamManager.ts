import { TextToSpeechService } from "./TextToSpeechService";
import { InputBuffer } from "./InputBuffer";
import { SpeechSynthesisVoiceRemote, SpeechUtterance } from "./SpeechModel";
import { Chatbot } from "../chatbots/Chatbot";

const STREAM_TIMEOUT_MS = 19000; // end streams after prolonged inactivity (<= 20s)
const BUFFER_TIMEOUT_MS = 1500; // flush buffers after inactivity
const START_OF_SPEECH_MARKER = " "; // In the first message, the text should be a space " " to indicate the start of speech (why?)

export class AudioStreamManager {
  private inputBuffers: { [uuid: string]: InputBuffer } = {};

  constructor(private ttsService: TextToSpeechService) {}

  async createStream(
    uuid: string,
    voice: SpeechSynthesisVoiceRemote,
    lang: string,
    chatbot?: Chatbot
  ): Promise<SpeechUtterance> {
    const utterance = await this.ttsService.createSpeech(
      uuid,
      START_OF_SPEECH_MARKER,
      voice,
      lang,
      true,
      chatbot
    );

    return utterance;
  }

  createInputBuffer(uuid: string): InputBuffer {
    this.inputBuffers[uuid] = new InputBuffer(
      uuid,
      this.ttsService,
      BUFFER_TIMEOUT_MS,
      STREAM_TIMEOUT_MS
    );
    return this.inputBuffers[uuid];
  }

  async addSpeechToStream(uuid: string, text: string): Promise<void> {
    if (!this.hasInputBuffer(uuid)) {
      this.createInputBuffer(uuid);
    }
    this.getInputBuffer(uuid).addText(text);
  }

  async replaceSpeechInStream(
    uuid: string,
    from: string,
    to: string
  ): Promise<boolean> {
    if (this.inputBuffers[uuid]) {
      const buffer = this.inputBuffers[uuid];
      if (buffer.isPending(from)) {
        buffer.replaceText(from, to);
        return true;
      } else {
        console.error(`Text not found in buffer: ${from}`);
        return false;
      }
    } else {
      console.error(`No input buffer found for UUID: ${uuid}`);
      return false;
    }
  }

  async endStream(uuid: string): Promise<void> {
    this.getInputBuffer(uuid).endInput();
  }

  getPendingText(uuid: string): string {
    return this.getInputBuffer(uuid)?.getPendingText() || "";
  }

  isPending(uuid: string, text: string): boolean {
    return this.getInputBuffer(uuid)?.isPending(text) || false;
  }

  hasSent(uuid: string, text: string): boolean {
    return this.getInputBuffer(uuid)?.hasSent(text) || false;
  }

  hasEnded(uuid: string): boolean {
    return this.getInputBuffer(uuid)?.hasEnded() || true;
  }

  isOpen(uuid: string): boolean {
    return this.getInputBuffer(uuid)?.isOpen() || false;
  }

  /* visible for testing */
  getInputBuffer(uuid: string): InputBuffer {
    return this.inputBuffers[uuid] || this.createInputBuffer(uuid);
  }

  hasInputBuffer(uuid: string): boolean {
    return !!this.inputBuffers[uuid];
  }
}
