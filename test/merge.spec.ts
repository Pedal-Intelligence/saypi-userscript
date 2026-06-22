import { describe, it, expect } from "vitest";
import { TranscriptMergeService } from "../src/TranscriptMergeService";

// sortTranscripts and mergeTranscriptsLocal are pure and make no network requests.
const transcriptMergeService = new TranscriptMergeService();

describe("TranscriptMergeService.sortTranscripts", () => {
  it("orders segments by ascending numeric (not lexicographic) key", () => {
    // Multi-digit keys so this genuinely exercises the numeric comparator:
    // a string sort would order ["1","10","2"] and fail this assertion. Sequence
    // numbers routinely exceed 9 in long sessions, so numeric order is load-bearing.
    const transcripts: Record<number, string> = {
      10: "tenth",
      2: "second",
      1: "first",
    };
    const sorted = transcriptMergeService.sortTranscripts(transcripts);
    expect(sorted).toEqual(["first", "second", "tenth"]);
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
