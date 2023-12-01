import { TranscriptMergeService } from "../src/TranscriptMergeService";
import { expect, describe, it } from "@jest/globals";

// Create an instance of the service with mock values for the constructor (doesn't make any network requests)
const transcriptMergeService = new TranscriptMergeService(
  "http://mock-api-url",
  "en-US"
);

describe("TranscriptMergeService.sortTranscripts", () => {
  it("should trim whitespace from transcripts", () => {
    const transcripts: Record<number, string> = {
      1: "  first  ",
      2: "second ",
      3: " third",
    };
    const sorted = transcriptMergeService.sortTranscripts(transcripts);
    expect(sorted).toEqual(["first", "second", "third"]);
  });

  it("should handle an empty list of transcripts", () => {
    const transcripts: Record<number, string> = {};
    const sorted = transcriptMergeService.sortTranscripts(transcripts);
    expect(sorted).toEqual([]);
  });

  it("should correctly handle a list of transcripts that is already sorted", () => {
    const transcripts: Record<number, string> = {
      1: "first",
      2: "second",
      3: "third",
    };
    const sorted = transcriptMergeService.sortTranscripts(transcripts);
    expect(sorted).toEqual(["first", "second", "third"]);
  });
});
