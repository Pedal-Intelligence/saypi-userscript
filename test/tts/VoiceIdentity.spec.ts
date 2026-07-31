import { describe, it, expect } from "vitest";
import { getVoiceIdentity } from "../../src/tts/VoiceIdentity";

// The module is now a tagline-key lookup and nothing else: the curated colour
// table and its djb2 fallback were deleted with the orbs (2026-07-31 design
// §6.3), because a hash-derived gradient looks like it encodes something about
// a voice and encodes nothing. The mark is the voice's own soundprint now.
describe("getVoiceIdentity", () => {
  it("returns the curated tagline key for a curated id", () => {
    expect(getVoiceIdentity({ id: "marin", name: "Marin" }).taglineKey).toBe(
      "voiceTagline_marin"
    );
  });

  it("falls back to the display name when the id is opaque (ElevenLabs UUIDs)", () => {
    const identity = getVoiceIdentity({
      id: "6c2c6af2-93e9-4e57-a1c3-1f2a9d1a5e30",
      name: "Paola",
    });
    expect(identity.taglineKey).toBe("voiceTagline_paola");
  });

  it("matches case-insensitively on id and name", () => {
    expect(getVoiceIdentity({ id: "Nova", name: "NOVA" }).taglineKey).toBe(
      "voiceTagline_nova"
    );
  });

  it("leaves an uncurated voice with no tagline, and no invented anything", () => {
    // The catalog can grow without a client release; an unknown voice falls
    // back to server metadata for its subtitle rather than to a fabricated
    // visual identity.
    expect(getVoiceIdentity({ id: "zz-unknown-1", name: "Zeta" })).toEqual({});
  });

  it("survives absent name/id without throwing", () => {
    expect(getVoiceIdentity({ id: "", name: undefined as any })).toEqual({});
  });
});
