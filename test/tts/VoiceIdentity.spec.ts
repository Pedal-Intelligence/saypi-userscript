import { describe, it, expect } from "vitest";
import { getVoiceIdentity } from "../../src/tts/VoiceIdentity";

describe("getVoiceIdentity", () => {
  it("returns the curated identity for a curated id", () => {
    const identity = getVoiceIdentity({ id: "marin", name: "Marin" });
    expect(identity.taglineKey).toBe("voiceTagline_marin");
    expect(identity.gradient).toEqual(["#2DD4BF", "#0E7490"]);
  });

  it("falls back to the display name when the id is opaque (ElevenLabs UUIDs)", () => {
    const identity = getVoiceIdentity({
      id: "6c2c6af2-93e9-4e57-a1c3-1f2a9d1a5e30",
      name: "Paola",
    });
    expect(identity.taglineKey).toBe("voiceTagline_paola");
    expect(identity.gradient).toEqual(["#FCA5A5", "#DC2626"]);
  });

  it("matches case-insensitively on id and name", () => {
    expect(getVoiceIdentity({ id: "Nova", name: "NOVA" }).taglineKey).toBe(
      "voiceTagline_nova"
    );
  });

  it("derives a deterministic fallback for uncurated voices, with no tagline", () => {
    const first = getVoiceIdentity({ id: "zz-unknown-1", name: "Zeta" });
    const second = getVoiceIdentity({ id: "zz-unknown-1", name: "Zeta" });
    expect(first).toEqual(second);
    expect(first.taglineKey).toBeUndefined();
    expect(first.gradient[0]).toMatch(/^hsl\(/);
    expect(first.gradient[1]).toMatch(/^hsl\(/);
  });

  it("spreads distinct unknown ids across distinct gradients", () => {
    const a = getVoiceIdentity({ id: "unknown-voice-a", name: "A" });
    const b = getVoiceIdentity({ id: "unknown-voice-b", name: "B" });
    expect(a.gradient).not.toEqual(b.gradient);
  });

  it("survives absent name/id without throwing", () => {
    const identity = getVoiceIdentity({ id: "", name: undefined as any });
    expect(identity.gradient).toHaveLength(2);
  });
});
