import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the Opus path so the transcode orchestration can be exercised without
// real WebCodecs (JSDOM has none). The real encode is covered at Layer 3.
vi.mock("../../src/audio/OpusEncoder", () => ({
  isOpusUploadSupported: vi.fn(),
  encodeToOpusWebM: vi.fn(),
}));

import {
  transcodeForUpload,
  convertToWavBlob,
  convertToWavBuffer,
} from "../../src/audio/AudioEncoder";
import { isOpusUploadSupported, encodeToOpusWebM } from "../../src/audio/OpusEncoder";

const frames = new Float32Array([0, 0.5, -0.5, 0.25, -0.25, 1, -1]);

// JSDOM's Blob lacks arrayBuffer(); real browsers (and the content script) have
// it. Provide it so the transcode path can read the WAV bytes under test.
const wavBlob = () => {
  const blob = convertToWavBlob(frames);
  if (typeof blob.arrayBuffer !== "function") {
    const buf = convertToWavBuffer(frames);
    (blob as { arrayBuffer: () => Promise<ArrayBuffer> }).arrayBuffer = async () => buf;
  }
  return blob;
};

describe("transcodeForUpload — WAV→Opus at the network boundary (#414)", () => {
  beforeEach(() => {
    vi.mocked(isOpusUploadSupported).mockReset();
    vi.mocked(encodeToOpusWebM).mockReset();
  });

  it("transcodes a 16-bit PCM WAV to WebM/Opus when supported, passing decoded samples", async () => {
    vi.mocked(isOpusUploadSupported).mockResolvedValue(true);
    vi.mocked(encodeToOpusWebM).mockResolvedValue(
      new Blob(["opus"], { type: "audio/webm" })
    );

    const out = await transcodeForUpload(wavBlob());

    expect(out.type).toBe("audio/webm");
    const passed = vi.mocked(encodeToOpusWebM).mock.calls[0][0];
    expect(passed).toBeInstanceOf(Float32Array);
    expect(passed.length).toBe(frames.length); // decoded sample count matches
    expect(passed[1]).toBeCloseTo(0.5, 2); // values survive the 16-bit round-trip
    expect(passed[2]).toBeCloseTo(-0.5, 2);
  });

  it("returns the WAV unchanged when Opus is unsupported (Firefox <130 etc.)", async () => {
    vi.mocked(isOpusUploadSupported).mockResolvedValue(false);
    const input = wavBlob();
    const out = await transcodeForUpload(input);
    expect(out).toBe(input);
    expect(encodeToOpusWebM).not.toHaveBeenCalled();
  });

  it("leaves a non-WAV blob untouched (no probe, no encode)", async () => {
    const input = new Blob(["x"], { type: "audio/webm" });
    const out = await transcodeForUpload(input);
    expect(out).toBe(input);
    expect(isOpusUploadSupported).not.toHaveBeenCalled();
    expect(encodeToOpusWebM).not.toHaveBeenCalled();
  });

  it("falls back to the original WAV when the Opus encode throws (never fails the upload)", async () => {
    vi.mocked(isOpusUploadSupported).mockResolvedValue(true);
    vi.mocked(encodeToOpusWebM).mockRejectedValue(new Error("encoder blew up"));
    const input = wavBlob();
    const out = await transcodeForUpload(input);
    expect(out).toBe(input);
    expect(out.type).toBe("audio/wav");
  });
});
