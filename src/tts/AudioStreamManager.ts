import { TextToSpeechService } from "./TextToSpeechService";
import { InputBuffer } from "./InputBuffer";
import { SpeechSynthesisVoiceRemote, SpeechUtterance } from "./SpeechModel";
import { Chatbot } from "../chatbots/Chatbot";
import { logger } from "../LoggingModule.js";

const STREAM_TIMEOUT_MS = 19000; // end streams after prolonged inactivity (<= 20s)
const BUFFER_TIMEOUT_MS = 1500; // flush buffers after inactivity
const START_OF_SPEECH_MARKER = " "; // In the first message, the text should be a space " " to indicate the start of speech (why?)
const KEEP_ALIVE_INTERVAL_MS = 12000;
const INACTIVITY_CHECK_INTERVAL_MS = 5000;
const INACTIVITY_THRESHOLD_MS = 10000;
const INACTIVITY_MAX_MS = 60000;

export class AudioStreamManager {
  private inputBuffers: { [uuid: string]: InputBuffer } = {};
  private keepAliveTimers: Map<string, ReturnType<typeof setInterval>> = new Map();
  private activeKeepAlive: Set<string> = new Set();
  private inactivityTimers: Map<string, ReturnType<typeof setInterval>> = new Map();
  private lastActivity: Map<string, number> = new Map();
  private openStreams: Set<string> = new Set();
  private lastKeepAliveSent: Map<string, number> = new Map();

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
    this.lastKeepAliveSent.delete(uuid);
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

    if (!this.activeKeepAlive.has(uuid) && this.activeKeepAlive.size > 0) {
      const existing = Array.from(this.activeKeepAlive).join(", ");
      logger.warn(
        `[TTS KeepAlive] Another keep-alive is active (${existing}); stopping it before starting ${uuid}`
      );
      for (const activeUuid of Array.from(this.activeKeepAlive)) {
        this.stopKeepAlive(activeUuid);
      }
    }

    if (this.hasInputBuffer(uuid) && !this.isOpen(uuid)) {
      logger.debug(
        `[TTS KeepAlive] Ignoring keep-alive start for closed stream ${uuid}`
      );
      return;
    }

    if (this.activeKeepAlive.has(uuid)) {
      return;
    }

    this.activeKeepAlive.add(uuid);

    const sendKeepAlive = (fromTimer: boolean) => {
      this.sendKeepAliveWithGuards(uuid, fromTimer);
    };

    logger.debug(
      `[TTS KeepAlive] Starting keep-alive for ${uuid}${toolName ? ` (${toolName})` : ""}`
    );
    sendKeepAlive(false);

    const timer = setInterval(() => {
      sendKeepAlive(true);
    }, KEEP_ALIVE_INTERVAL_MS);
    this.keepAliveTimers.set(uuid, timer);
  }

  stopKeepAlive(uuid: string): void {
    const timer = this.keepAliveTimers.get(uuid);
    if (timer) {
      clearInterval(timer);
      this.keepAliveTimers.delete(uuid);
    }
    if (this.activeKeepAlive.delete(uuid)) {
      logger.debug(`[TTS KeepAlive] Stopped keep-alive for ${uuid}`);
    }
    this.lastKeepAliveSent.delete(uuid);
  }

  private sendKeepAliveWithGuards(uuid: string, fromTimer: boolean): void {
    const now = Date.now();
    const lastSent = this.lastKeepAliveSent.get(uuid);
    const minimumInterval = KEEP_ALIVE_INTERVAL_MS * 0.8;

    if (lastSent && now - lastSent < minimumInterval) {
      logger.warn(
        `[TTS KeepAlive] Detected rapid keep-alive cadence for ${uuid} (Δ=${now - lastSent}ms); halting keep-alive.`
      );
      this.stopKeepAlive(uuid);
      return;
    }

    this.lastKeepAliveSent.set(uuid, now);

    void this.ttsService.sendKeepAlive(uuid).then((success) => {
      if (!success && fromTimer) {
        logger.warn(
          `[TTS KeepAlive] Upstream keep-alive call failed for ${uuid}; stopping timer.`
        );
        this.stopKeepAlive(uuid);
      }
    });
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
        !this.activeKeepAlive.has(uuid)
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
