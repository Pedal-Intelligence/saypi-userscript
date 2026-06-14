import { describe, it, expect } from "vitest";
import { buildTranscribeResponse, DEFAULT_TRANSCRIPT } from "../../e2e/support/transcribe-response";

describe("buildTranscribeResponse", () => {
  it("echoes the request sequenceNumber and returns the default transcript", () => {
    expect(buildTranscribeResponse({ sequenceNumber: 7 })).toEqual({
      text: DEFAULT_TRANSCRIPT,
      sequenceNumber: 7,
    });
  });

  it("allows overriding the transcript text", () => {
    expect(buildTranscribeResponse({ sequenceNumber: 1, text: "custom" })).toEqual({
      text: "custom",
      sequenceNumber: 1,
    });
  });

  it("defaults sequenceNumber to 1 when absent", () => {
    expect(buildTranscribeResponse({}).sequenceNumber).toBe(1);
  });

  it("never returns empty text (would trigger transcribedEmpty)", () => {
    expect(buildTranscribeResponse({ text: "" }).text.length).toBeGreaterThan(0);
  });
});
