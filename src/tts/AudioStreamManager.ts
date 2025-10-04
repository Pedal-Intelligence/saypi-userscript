import { TextToSpeechService } from "./TextToSpeechService";
import { InputBuffer } from "./InputBuffer";
import { SpeechSynthesisVoiceRemote, SpeechUtterance } from "./SpeechModel";
import { Chatbot } from "../chatbots/Chatbot";
import { logger } from "../LoggingModule.js";
import { StreamKeepAliveController } from "./StreamKeepAliveController";

const STREAM_TIMEOUT_MS = 19000; // end streams after prolonged inactivity (<= 20s)
const BUFFER_TIMEOUT_MS = 1500; // flush buffers after inactivity
const START_OF_SPEECH_MARKER = " "; // In the first message, the text should be a space " " to indicate the start of speech (why?)
const INACTIVITY_CHECK_INTERVAL_MS = 5000;
const INACTIVITY_THRESHOLD_MS = 10000;
const INACTIVITY_MAX_MS = 60000;

export class AudioStreamManager {
  private inputBuffers: { [uuid: string]: InputBuffer } = {};
  private inactivityTimers: Map<string, ReturnType<typeof setInterval>> = new Map();
  private lastActivity: Map<string, number> = new Map();
  private openStreams: Set<string> = new Set();
  private keepAliveController: StreamKeepAliveController;

  constructor(private ttsService: TextToSpeechService) {
    this.keepAliveController = new StreamKeepAliveController({
      sendKeepAlive: (uuid: string) => this.ttsService.sendKeepAlive(uuid),
      warn: logger.warn.bind(logger),
      debug: logger.debug.bind(logger),
    });
  }

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

    this.openStreams.add(uuid);
    this.touchActivity(uuid);
    this.ensureInactivityMonitor(uuid);
    this.stopKeepAlive(uuid); // ensure previous state reset if reused

    return utterance;
  }

  createInputBuffer(uuid: string): InputBuffer {
    this.inputBuffers[uuid] = new InputBuffer(
      uuid,
      this.ttsService,
      BUFFER_TIMEOUT_MS,
      STREAM_TIMEOUT_MS
    );
    this.ensureInactivityMonitor(uuid);
    return this.inputBuffers[uuid];
  }

  async addSpeechToStream(uuid: string, text: string): Promise<void> {
    if (!this.hasInputBuffer(uuid)) {
      this.createInputBuffer(uuid);
    }
    this.stopKeepAlive(uuid);
    this.touchActivity(uuid);
    this.getInputBuffer(uuid).addText(text);
  }

  async replaceSpeechInStream(
    uuid: string,
    from: string,
    to: string
  ): Promise<boolean> {
    if (this.inputBuffers[uuid]) {
      const buffer = this.inputBuffers[uuid];
      this.stopKeepAlive(uuid);
      this.touchActivity(uuid);
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
    this.stopKeepAlive(uuid);
    this.stopInactivityMonitor(uuid);
    this.getInputBuffer(uuid).endInput();
    this.openStreams.delete(uuid);
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
    if (!this.openStreams.has(uuid)) {
      return false;
    }

    const buffer = this.inputBuffers[uuid];
    if (!buffer) {
      // Stream has been created but hasn't buffered any text yet.
      return true;
    }
    return buffer.isOpen();
  }

  /* visible for testing */
  getInputBuffer(uuid: string): InputBuffer {
    return this.inputBuffers[uuid] || this.createInputBuffer(uuid);
  }

  /* visible for testing */
  hasActiveKeepAlive(uuid: string): boolean {
    return this.keepAliveController.isActive(uuid);
  }

  hasInputBuffer(uuid: string): boolean {
    return !!this.inputBuffers[uuid];
  }

  startKeepAlive(uuid: string, toolName?: string): void {
    if (!this.openStreams.has(uuid)) {
      logger.warn(
        `[TTS KeepAlive] Ignoring keep-alive start for non-open stream ${uuid}`
      );
      return;
    }

    if (this.hasInputBuffer(uuid) && !this.isOpen(uuid)) {
      logger.debug(
        `[TTS KeepAlive] Ignoring keep-alive start for closed stream ${uuid}`
      );
      return;
    }
    this.keepAliveController.start(uuid, toolName);
  }

  stopKeepAlive(uuid: string): void {
    this.keepAliveController.stop(uuid);
  }

  private touchActivity(uuid: string): void {
    this.lastActivity.set(uuid, Date.now());
  }

  private ensureInactivityMonitor(uuid: string): void {
    if (this.inactivityTimers.has(uuid)) {
      return;
    }

    const timer = setInterval(() => {
      const lastActivity = this.lastActivity.get(uuid);
      if (!lastActivity) {
        return;
      }

      const inactiveDuration = Date.now() - lastActivity;
      if (
        inactiveDuration >= INACTIVITY_THRESHOLD_MS &&
        inactiveDuration <= INACTIVITY_MAX_MS &&
        !this.keepAliveController.isActive(uuid)
      ) {
        void this.ttsService.sendKeepAlive(uuid);
      }
    }, INACTIVITY_CHECK_INTERVAL_MS);

    this.inactivityTimers.set(uuid, timer);
  }

  private stopInactivityMonitor(uuid: string): void {
    const timer = this.inactivityTimers.get(uuid);
    if (timer) {
      clearInterval(timer);
      this.inactivityTimers.delete(uuid);
    }
    this.lastActivity.delete(uuid);
  }
}
