import { TextToSpeechService } from "./TextToSpeechService";

export class InputBuffer {
    private buffer: string = "";
    private bufferTimeout?: NodeJS.Timeout;
    private streamTimeout?: NodeJS.Timeout;
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
    constructor(uuid: string, ttsService: TextToSpeechService, flushAfterMs: number, closeAfterMs: number) {
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
  
      this.buffer += text;
      this.resetBufferTimeout();
  
      if (text === this.END_OF_SPEECH_MARKER) {
        this.closeBuffer();
      }
      else if (this.shouldFlushBuffer(text)) {
        this.flushBuffer();
      }
    }
  
    private shouldFlushBuffer(text: string): boolean {
      return [".", "!", "?"].some(end => text.endsWith(end)) || text === this.END_OF_SPEECH_MARKER;
    }
  
    private resetBufferTimeout(): void {
      if (this.bufferTimeout) {
        clearTimeout(this.bufferTimeout);
      }
      this.bufferTimeout = setTimeout(() => {
        this.flushBuffer();
      }, this.BUFFER_TIMEOUT_MS);
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
  
    private async flushBuffer(): Promise<void> {
      const text = this.buffer;
      this.buffer = "";
  
      try {
        await this.ttsService.addTextToSpeechStream(this.uuid, text);
        console.debug(`Buffer flushed for UUID: ${this.uuid}: "${text}"`)
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
  
      await this.flushBuffer();
      console.log(`Buffer closed for UUID: ${this.uuid}`);
    }
  
    endInput(): void {
      if (!this.isClosed) {
        try {
          this.addText("");
        } catch (error) {
          console.error("Error ending input stream:", error);
        }
      } else {
        console.log("Input stream already ended or not found");
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
  }