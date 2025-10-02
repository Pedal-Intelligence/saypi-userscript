import { describe, it, expect } from "vitest";
import { TextChunkDeduplicator } from "../../src/tts/TextChunkDeduplicator";

describe("TextChunkDeduplicator", () => {
  it("removes previously flushed overlap while preserving new content", () => {
    const deduplicator = new TextChunkDeduplicator();
    deduplicator.registerProcessedText("The answer is clear.");

    const result = deduplicator.deduplicate(
      "The answer is clear. We need to act.",
      ""
    );

    expect(result).not.toBeNull();
    expect(result!.novelText).toBe(" We need to act.");
    expect(result!.consumedEntireChunk).toBe(false);
  });

  it("removes overlap against pending buffer content", () => {
    const deduplicator = new TextChunkDeduplicator();

    const result = deduplicator.deduplicate(
      " But maybe that's the point.",
      "But maybe that's"
    );

    expect(result).not.toBeNull();
    expect(result!.novelText).toBe(" the point.");
  });

  it("handles whitespace variation at chunk boundaries", () => {
    const deduplicator = new TextChunkDeduplicator();
    deduplicator.registerProcessedText("Hello world");

    const result = deduplicator.deduplicate(
      " Hello world, how are you?",
      ""
    );

    expect(result).not.toBeNull();
    expect(result!.novelText).toBe(", how are you?");
  });

  it("supports partial word overlaps", () => {
    const deduplicator = new TextChunkDeduplicator();

    const result = deduplicator.deduplicate(
      "incomplete sentence",
      "incomp"
    );

    expect(result).not.toBeNull();
    expect(result!.novelText).toBe("lete sentence");
  });

  it("preserves chunks that are entirely repeated", () => {
    const deduplicator = new TextChunkDeduplicator();

    const result = deduplicator.deduplicate(" little lamb,", "Mary had a little lamb,");

    expect(result).not.toBeNull();
    expect(result!.consumedEntireChunk).toBe(true);
  });

  it("keeps structural whitespace when it is meaningful", () => {
    const deduplicator = new TextChunkDeduplicator();
    deduplicator.registerProcessedText("Hello world");

    const result = deduplicator.deduplicate("\nHello world again", "");

    expect(result).not.toBeNull();
    expect(result!.leadingWhitespace).toBe("\n");
    expect(result!.novelText).toBe(" again");
  });
});
