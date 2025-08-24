import { TextToSpeechService } from "./TextToSpeechService";

type FlushEvent = "eos" | "timeout" | "close";

const SENTENCE_BREAK_CHARS = [
  ".",
  "!",
  "?",
  "。", // chinese period/japanese maru
  "……", // chinese ellipsis
  "。。。", // chinese - ideographic full stop
  "～", // chinese wave dash,
  "・・・", // japanese - kanten
  "―", // japanese dash
  "~", // tilde (used in some Korean and some other languages as a sentence break)
  "\n", // newline
];

export class InputBuffer {
  private buffer: string = "";
  private bufferTimeout?: ReturnType<typeof setTimeout>;
  private streamTimeout?: ReturnType<typeof setTimeout>;
  private isClosed: boolean = false;
  private readonly BUFFER_TIMEOUT_MS: number;
  private readonly ttsService: TextToSpeechService;
  private readonly uuid: string;
  private readonly END_OF_SPEECH_MARKER = ""; // In the last message, the text should be an empty string to indicate the end of speech (why?)

  /**
   * Create a text input buffer for a input stream with {@param uuid}
   * The buffer will flush to {@param ttsService} when certain text is added, after {@param flushAfterMs} milliseconds of inactivity, and on close
   * If set, the buffer will close automatically after {@param closeAfterMs} milliseconds
   * @param uuid
   * @param ttsService
   * @param flushAfterMs
   * @param closeAfterMs
   */
  constructor(
    uuid: string,
    ttsService: TextToSpeechService,
    flushAfterMs: number,
    closeAfterMs: number
  ) {
    this.uuid = uuid;
    this.ttsService = ttsService;
    this.BUFFER_TIMEOUT_MS = flushAfterMs;
    if (closeAfterMs > 0) {
      this.setStreamTimeout(closeAfterMs);
    }
  }

  /**
   * Add text to the buffer
   * Raises an error if the buffer is closed
   * Flushes the buffer if the text ends with a sentence break
   * Closes the buffer if the text is the end of speech marker
   * @param text
   */
  addText(text: string): void {
    if (this.isClosed) {
      throw new Error(`Cannot add text to a closed buffer: ${this.uuid}`);
    }

    // noisy log messages
    //console.debug(`[InputBuffer] adding text to buffer: "${text}"`);

    this.buffer += text;
    this.resetBufferTimeout();

    if (text === this.END_OF_SPEECH_MARKER) {
      this.closeBuffer();
    } else {
      this.checkAndFlushPartialBuffer();
    }
  }

  private findLastBreakIndex(text: string): number {
    let lastIndex = -1;
    // Iterate through all known break characters
    for (const char of SENTENCE_BREAK_CHARS) {
      // Find the last occurrence of this specific break character in the text
      const index = text.lastIndexOf(char);
      // If this character's last occurrence is later than the latest one found so far, update lastIndex
      if (index > lastIndex) {
        lastIndex = index;
      }
    }
    // Return the index of the very last break character found, or -1 if none were found
    return lastIndex;
  }

  private checkAndFlushPartialBuffer(): void {
    const lastBreakIndex = this.findLastBreakIndex(this.buffer);

    if (lastBreakIndex !== -1) {
        // Found a break character
        if (lastBreakIndex === this.buffer.length - 1) {
            // Case 1: Buffer ends with a break character. Flush the whole buffer.
            const textToFlush = this.buffer;
            console.debug(`[InputBuffer] flushing buffer due to end-text break: "${textToFlush}"`);
            this.flushBuffer(textToFlush, "eos");
            this.buffer = "";
            // Clear potential timeout explicitly as buffer is empty
            if (this.bufferTimeout) {
                clearTimeout(this.bufferTimeout);
                this.bufferTimeout = undefined;
            }
        } else {
            // Case 2: Buffer contains a break, but not at the very end. Flush up to the break.
            const textToFlush = this.buffer.substring(0, lastBreakIndex + 1);
            const remainingText = this.buffer.substring(lastBreakIndex + 1);
            console.debug(`[InputBuffer] flushing buffer due to mid-text break: "${textToFlush}"`);
            this.flushBuffer(textToFlush, "eos");
            this.buffer = remainingText;
            // Timeout reset is handled in addText after this function returns, based on the updated buffer
        }
    }
    // If no break character is found, do nothing. Timeout will handle later.
  }

  private resetBufferTimeout(): void {
    if (this.bufferTimeout) {
      clearTimeout(this.bufferTimeout);
    }
    // Only set a new timeout if the buffer has content.
    if (this.buffer.length > 0) {
      this.bufferTimeout = setTimeout(() => {
          if (this.buffer.length > 0) { // Double check buffer has content before flushing on timeout
              console.debug(`[InputBuffer] flushing buffer due to timeout: "${this.buffer}"`);
              this.flushBuffer(this.buffer, "timeout");
              this.buffer = "";
          } else {
              console.debug(`[InputBuffer] timeout occurred but buffer is empty.`);
          }
      }, this.BUFFER_TIMEOUT_MS);
    } else {
         this.bufferTimeout = undefined; // Ensure no timeout if buffer is empty
    }
  }

  /**
   * Close the buffer after a certain amount of time
   * @param closeAfterMs
   */
  private setStreamTimeout(closeAfterMs: number): void {
    this.streamTimeout = setTimeout(() => {
      this.closeBuffer();
    }, closeAfterMs);
  }

  private async flushBuffer(textToFlush: string, event: FlushEvent): Promise<void> {
    if (!textToFlush && event !== "close") {
      // Don't flush empty strings unless closing
      return;
    }

    // const text = this.buffer; // Old logic: always flushed the whole buffer
    // this.buffer = ""; // Old logic: always cleared the whole buffer

    try {
      await this.ttsService.addTextToSpeechStream(this.uuid, textToFlush);
      console.debug(
        `Buffer flushed on ${event} for UUID: ${this.uuid}: "${textToFlush}"`
      );
    } catch (error) {
      console.error("Error sending buffer:", error);
    }
  }

  /**
   * Flush the buffer and close it
   */
  private async closeBuffer(): Promise<void> {
    if (this.isClosed) {
      return;
    }

    this.isClosed = true;

    if (this.bufferTimeout) {
      clearTimeout(this.bufferTimeout);
    }

    if (this.streamTimeout) {
      clearTimeout(this.streamTimeout);
    }

    // Add a small delay to ensure prior flushes reach the server
    return new Promise<void>((resolve) => {
      setTimeout(async () => {
        // Flush any remaining text before closing
        await this.flushBuffer(this.buffer, "close");
        this.buffer = ""; // Ensure buffer is empty after closing
        console.debug(`Buffer closed for UUID: ${this.uuid}`);
        resolve();
      }, 75);
    });
  }

  endInput(): void {
    if (!this.isClosed) {
      try {
        this.addText(this.END_OF_SPEECH_MARKER);
      } catch (error) {
        console.error("Error ending input stream:", error);
      }
    } else {
      console.debug("Input stream already ended or not found");
    }
  }

  /* visible for testing */
  getPendingText(): string {
    return this.buffer;
  }

  isPending(text: string): boolean {
    return this.buffer.includes(text);
  }

  hasSent(text: string): boolean {
    return !this.buffer.includes(text);
  }

  hasEnded(): boolean {
    return this.isClosed;
  }

  isOpen(): boolean {
    return !this.isClosed;
  }

  replaceText(from: string, to: string): void {
    this.buffer = this.buffer.replace(from, to);
  }
}
