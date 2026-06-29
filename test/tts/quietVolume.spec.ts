import { describe, it, expect } from "vitest";
import { QUIET_TTS_VOLUME, ttsVolumeForQuietMode } from "../../src/tts/quietVolume";

describe("ttsVolumeForQuietMode (#437)", () => {
  it("is full volume when quiet mode is off", () => {
    expect(ttsVolumeForQuietMode(false)).toBe(1);
  });

  it("is the reduced quiet volume when quiet mode is on", () => {
    expect(ttsVolumeForQuietMode(true)).toBe(QUIET_TTS_VOLUME);
  });

  it("the quiet volume is a valid, genuinely quieter scalar", () => {
    expect(QUIET_TTS_VOLUME).toBeGreaterThan(0);
    expect(QUIET_TTS_VOLUME).toBeLessThan(1);
  });
});
