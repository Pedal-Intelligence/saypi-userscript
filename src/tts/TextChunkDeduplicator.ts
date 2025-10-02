export interface DeduplicatedChunk {
  novelText: string;
  removedText: string;
  overlapLength: number;
  leadingWhitespace: string;
  originalChunk: string;
  consumedEntireChunk: boolean;
}

const DEFAULT_CONTEXT_WINDOW = 400;
const MIN_OVERLAP = 4;

const TRAILING_WHITESPACE_REGEX = /\s+$/u;
const LEADING_WHITESPACE_REGEX = /^\s+/u;

export class TextChunkDeduplicator {
  private history: string = "";

  constructor(private readonly contextWindow: number = DEFAULT_CONTEXT_WINDOW) {}

  deduplicate(chunk: string, pendingBuffer: string): DeduplicatedChunk | null {
    if (!chunk) {
      return null;
    }

    const context = this.buildContext(pendingBuffer);
    if (!context) {
      return null;
    }

    const trimmedChunk = chunk.replace(LEADING_WHITESPACE_REGEX, "");
    if (!trimmedChunk) {
      return null;
    }

    const leadingWhitespaceLength = chunk.length - trimmedChunk.length;
    const leadingWhitespace = chunk.slice(0, leadingWhitespaceLength);

    const overlapLength = this.findOverlap(context, trimmedChunk);
    if (overlapLength < MIN_OVERLAP) {
      return null;
    }

    const removedText = trimmedChunk.slice(0, overlapLength);
    const novelText = trimmedChunk.slice(overlapLength);

    return {
      novelText,
      removedText: leadingWhitespace + removedText,
      overlapLength,
      leadingWhitespace,
      originalChunk: chunk,
      consumedEntireChunk: novelText.length === 0,
    };
  }

  registerProcessedText(text: string): void {
    if (!text) {
      return;
    }
    this.history = (this.history + text).slice(-this.contextWindow);
  }

  reset(): void {
    this.history = "";
  }

  private buildContext(pendingBuffer: string): string {
    const combined = `${this.history}${pendingBuffer}`;
    if (!combined) {
      return "";
    }
    return combined.replace(TRAILING_WHITESPACE_REGEX, "").slice(-this.contextWindow);
  }

  private findOverlap(context: string, chunk: string): number {
    const maxOverlap = Math.min(context.length, chunk.length);
    for (let length = maxOverlap; length > 0; length--) {
      const contextSuffix = context.slice(-length);
      const chunkPrefix = chunk.slice(0, length);
      if (contextSuffix === chunkPrefix) {
        return length;
      }
    }
    return 0;
  }
}
