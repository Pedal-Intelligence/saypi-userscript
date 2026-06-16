import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { TranscriptMergeService } from "../src/TranscriptMergeService";

// Exercises mergeTranscriptsRemote against the REAL service (only fetch is stubbed).
// The continuity gate must be computed from the segment SEQUENCE KEYS (1, 2, 3…),
// not from parseInt() of the spoken text — otherwise the server /merge never runs
// for any real multi-segment utterance.

const FAR_FUTURE_OFFSET_MS = 60_000; // well above the 2s averageResponseTime gate

describe("TranscriptMergeService.mergeTranscriptsRemote", () => {
  let fetchMock: ReturnType<typeof vi.fn>;
  const cutoff = () => Date.now() + FAR_FUTURE_OFFSET_MS;

  beforeEach(() => {
    fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ combined_transcript: "merged result" }),
    });
    (global as any).fetch = fetchMock;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete (global as any).fetch;
  });

  it("POSTs to /merge and returns the combined transcript for consecutive segments of real speech", async () => {
    const service = new TranscriptMergeService("http://api.example", "en-US");

    const result = await service.mergeTranscriptsRemote(
      { 1: "Hello there", 2: "how are you", 3: "today" },
      cutoff()
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      "http://api.example/merge",
      expect.objectContaining({ method: "POST" })
    );
    expect(result).toBe("merged result");
  });

  it("does NOT call /merge when the segment keys are non-consecutive (a gap implies a discontinuity)", async () => {
    const service = new TranscriptMergeService("http://api.example", "en-US");

    // Keys 1 and 3 — segment 2 is missing, so the sequence is not continuous.
    const result = await service.mergeTranscriptsRemote(
      { 1: "Hello there", 3: "today" },
      cutoff()
    );

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result).toBe("");
  });

  it("does NOT call /merge for a single segment", async () => {
    const service = new TranscriptMergeService("http://api.example", "en-US");

    const result = await service.mergeTranscriptsRemote({ 1: "Hello there" }, cutoff());

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result).toBe("");
  });

  it("does NOT call /merge when there is not enough time remaining before cutoff", async () => {
    const service = new TranscriptMergeService("http://api.example", "en-US");

    // cutoff already passed → timeRemaining < averageResponseTime
    const result = await service.mergeTranscriptsRemote(
      { 1: "Hello there", 2: "how are you" },
      Date.now() - 1
    );

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result).toBe("");
  });

  it("judges continuity by the segment KEYS, not by numbers parsed from the text", async () => {
    const service = new TranscriptMergeService("http://api.example", "en-US");

    // Keys 1 and 5 are non-consecutive (segment missing), so this must NOT merge —
    // even though the spoken text happens to start with consecutive numbers
    // ("1 dog", "2 cats"). The old code parseInt()-ed the text → [1, 2] → wrongly
    // continuous → POSTed. This pins the fix to read keys, not text.
    const result = await service.mergeTranscriptsRemote(
      { 1: "1 dog", 5: "2 cats" },
      cutoff()
    );

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result).toBe("");
  });
});
