import { sortTranscripts } from "../src/TranscriptionModule";
import { expect } from "@jest/globals";

describe("sortTranscripts", () => {
  it("should trim whitespace from transcripts", () => {
    const transcripts: Record<number, string> = {
      1: "  first  ",
      2: "second ",
      3: " third",
    };
    const sorted = sortTranscripts(transcripts);
    expect(sorted).toEqual(["first", "second", "third"]);
  });

  it("should handle an empty list of transcripts", () => {
    const transcripts: Record<number, string> = {};
    const sorted = sortTranscripts(transcripts);
    expect(sorted).toEqual([]);
  });

  it("should correctly handle a list of transcripts that is already sorted", () => {
    const transcripts: Record<number, string> = {
      1: "first",
      2: "second",
      3: "third",
    };
    const sorted = sortTranscripts(transcripts);
    expect(sorted).toEqual(["first", "second", "third"]);
  });
});
