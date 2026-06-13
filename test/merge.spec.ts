import { describe, it, expect } from "vitest";
import { TranscriptMergeService } from "../src/TranscriptMergeService";

// Constructed with mock values; sortTranscripts is pure and makes no network requests.
const transcriptMergeService = new TranscriptMergeService(
  "http://mock-api-url",
  "en-US"
);

describe("TranscriptMergeService.sortTranscripts", () => {
  it("orders segments by ascending numeric key", () => {
    const transcripts: Record<number, string> = {
      3: "third",
      1: "first",
      2: "second",
    };
    const sorted = transcriptMergeService.sortTranscripts(transcripts);
    expect(sorted).toEqual(["first", "second", "third"]);
  });

  it("preserves each segment's whitespace verbatim (does not trim)", () => {
    // Intentional: mergeTranscriptsLocal relies on leading/trailing whitespace
    // (and newlines from manual edits) to decide spacing between segments, so
    // sortTranscripts must not trim. See TranscriptMergeService.sortTranscripts.
    const transcripts: Record<number, string> = {
      1: "  first  ",
      2: "second ",
      3: " third",
    };
    const sorted = transcriptMergeService.sortTranscripts(transcripts);
    expect(sorted).toEqual(["  first  ", "second ", " third"]);
  });

  it("should handle an empty list of transcripts", () => {
    const transcripts: Record<number, string> = {};
    const sorted = transcriptMergeService.sortTranscripts(transcripts);
    expect(sorted).toEqual([]);
  });
});
