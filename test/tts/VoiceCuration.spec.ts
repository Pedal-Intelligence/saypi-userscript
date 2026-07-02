import { describe, it, expect } from "vitest";
import {
  getVoiceTier,
  curateShortlist,
  CLAUDE_MENU_CAP,
  PI_MENU_CAP,
} from "../../src/tts/VoiceCuration";
import { SpeechSynthesisVoiceRemote } from "../../src/tts/SpeechModel";

// Minimal voice factory matching the GET /voices serialization (saypi-api
// tts/models.py Voice): only the fields curation reads, plus required
// SpeechSynthesisVoice members.
function voice(
  id: string,
  name: string,
  poweredBy: string,
  credits: number | undefined,
  gender?: string
): SpeechSynthesisVoiceRemote {
  return {
    id,
    name,
    powered_by: poweredBy,
    price: credits !== undefined ? credits / 3333 : (undefined as any),
    price_per_thousand_chars_in_usd: credits !== undefined ? credits / 3333 : (undefined as any),
    price_per_thousand_chars_in_credits: credits as any,
    gender,
    lang: "en",
    default: false,
    localService: false,
    voiceURI: `https://api.saypi.ai/voices/${id}`,
  } as SpeechSynthesisVoiceRemote;
}

// The live Claude catalog (10 ElevenLabs voices, server order per
// saypi-api tts/claude.json) — abbreviated to the fields curation reads.
const claudeElevenLabs = [
  voice("c6SfcYrb2t09NHXiT80T", "Jarnathan", "ElevenLabs", 1000, "M"),
  voice("gs0tAILXbY5DNrJrsM6F", "Jeff", "ElevenLabs", 1000, "M"),
  voice("1SM7GgM6IMuvQlz2BwM3", "Mark", "ElevenLabs", 1000, "M"),
  voice("DTKMou8ccj1ZaWGBiotd", "Jamahal", "ElevenLabs", 1000, "M"),
  voice("vBKc2FfBKJfcZNyEt1n6", "Finn", "ElevenLabs", 1000, "M"),
  voice("aMSt68OGf4xUZAnLpTU8", "Juniper", "ElevenLabs", 1000, "F"),
  voice("56AoDkrOh6qfVPDXZ7Pt", "Cassidy", "ElevenLabs", 1000, "F"),
  voice("eR40ATw9ArzDf9h3v7t7", "Addison", "ElevenLabs", 1000, "F"),
  voice("g6xIsTj2HwM6VR4iXFCw", "Jessica", "ElevenLabs", 1000, "F"),
  voice("lcMyyd2HUfFzxdCaC4Ta", "Lucy", "ElevenLabs", 1000, "F"),
];

// The 10 OpenAI voices (server order per saypi-api tts/voice.py).
const openAiVoices = [
  voice("alloy", "Alloy", "OpenAI", 50, "F"),
  voice("ash", "Ash", "OpenAI", 50, "M"),
  voice("ballad", "Ballad", "OpenAI", 50, "M"),
  voice("coral", "Coral", "OpenAI", 50, "F"),
  voice("echo", "Echo", "OpenAI", 50, "M"),
  voice("fable", "Fable", "OpenAI", 50, "Other"),
  voice("nova", "Nova", "OpenAI", 50, "F"),
  voice("onyx", "Onyx", "OpenAI", 50, "M"),
  voice("sage", "Sage", "OpenAI", 50, "F"),
  voice("shimmer", "Shimmer", "OpenAI", 50, "F"),
];

// The Pi catalog: Paola/Joey (flash) + the pricier Paola v3 variant.
const piElevenLabs = [
  voice("ig1TeITnnNlsJtfHxJlW", "Paola", "ElevenLabs", 1000),
  voice("bWJPewAagbymiJXZcxnh", "Joey", "ElevenLabs", 1000),
  voice("paola-v3", "Paola", "ElevenLabs", 2000, "F"),
];

const claudeFlipDay = [...claudeElevenLabs, ...openAiVoices]; // 20 voices
const piFlipDay = [...piElevenLabs, ...openAiVoices]; // 13 voices

describe("getVoiceTier", () => {
  it("classifies premium-priced voices as hd (ElevenLabs at 1000+ credits/1k)", () => {
    expect(getVoiceTier(claudeElevenLabs[0])).toBe("hd");
    expect(getVoiceTier(piElevenLabs[2])).toBe("hd"); // 2000 cr v3 variant
  });

  it("classifies value-priced voices as everyday (OpenAI at 50 credits/1k)", () => {
    expect(getVoiceTier(openAiVoices[0])).toBe("everyday");
  });

  it("falls back to provider when price is missing: ElevenLabs → hd, others → everyday", () => {
    expect(getVoiceTier(voice("x", "X", "ElevenLabs", undefined))).toBe("hd");
    expect(getVoiceTier(voice("y", "Y", "OpenAI", undefined))).toBe("everyday");
    expect(getVoiceTier(voice("z", "Z", "60dB", undefined))).toBe("everyday");
  });

  it("classifies a future cheap provider as everyday by price alone", () => {
    expect(getVoiceTier(voice("h1", "Asha", "60dB", 10))).toBe("everyday");
  });
});

describe("curateShortlist", () => {
  it("shows the whole catalog with no overflow when it fits the cap (today's Pi set)", () => {
    const result = curateShortlist(piElevenLabs, null, PI_MENU_CAP);
    expect(result.voices.map((v) => v.id)).toEqual(piElevenLabs.map((v) => v.id));
    expect(result.hiddenCount).toBe(0);
  });

  it("caps the flip-day Claude catalog and reports the overflow", () => {
    const result = curateShortlist(claudeFlipDay, null, CLAUDE_MENU_CAP);
    expect(result.voices.length).toBe(CLAUDE_MENU_CAP);
    expect(result.hiddenCount).toBe(claudeFlipDay.length - CLAUDE_MENU_CAP);
  });

  it("pins the current voice first even when it is not featured", () => {
    // Lucy is last in server order and not an HD-featured pick
    const result = curateShortlist(
      claudeFlipDay,
      "lcMyyd2HUfFzxdCaC4Ta",
      CLAUDE_MENU_CAP
    );
    expect(result.voices[0].name).toBe("Lucy");
    expect(result.voices.length).toBe(CLAUDE_MENU_CAP);
  });

  it("does not duplicate the current voice when it is also a featured pick", () => {
    const result = curateShortlist(
      claudeFlipDay,
      "c6SfcYrb2t09NHXiT80T", // Jarnathan, also the first HD pick
      CLAUDE_MENU_CAP
    );
    const jarnathans = result.voices.filter((v) => v.name === "Jarnathan");
    expect(jarnathans.length).toBe(1);
    expect(result.voices[0].name).toBe("Jarnathan");
  });

  it("features a gender-diverse pair of HD voices in server order", () => {
    const result = curateShortlist(claudeFlipDay, null, CLAUDE_MENU_CAP);
    const hdNames = result.voices
      .filter((v) => getVoiceTier(v) === "hd")
      .map((v) => v.name);
    // First male in server order + first female in server order — not Jarnathan+Jeff
    expect(hdNames).toEqual(["Jarnathan", "Juniper"]);
  });

  it("features everyday voices by popularity rank (Coral, Nova, Ash, Onyx — never Alloy)", () => {
    const result = curateShortlist(claudeFlipDay, null, CLAUDE_MENU_CAP);
    const everydayNames = result.voices
      .filter((v) => getVoiceTier(v) === "everyday")
      .map((v) => v.name);
    expect(everydayNames).toEqual(["Coral", "Nova", "Ash", "Onyx"].slice(0, everydayNames.length));
    expect(everydayNames).not.toContain("Alloy");
  });

  it("fills to the cap in server order when the catalog is single-tier (pre-flip Claude)", () => {
    const result = curateShortlist(claudeElevenLabs, null, CLAUDE_MENU_CAP);
    expect(result.voices.length).toBe(CLAUDE_MENU_CAP);
    // Gender-diverse featured pair first, then server order fill
    expect(result.voices[0].name).toBe("Jarnathan");
    expect(result.voices[1].name).toBe("Juniper");
    expect(result.hiddenCount).toBe(claudeElevenLabs.length - CLAUDE_MENU_CAP);
  });

  it("reports tiersCoexist only when both tiers are in the full catalog", () => {
    expect(curateShortlist(claudeElevenLabs, null, CLAUDE_MENU_CAP).tiersCoexist).toBe(false);
    expect(curateShortlist(claudeFlipDay, null, CLAUDE_MENU_CAP).tiersCoexist).toBe(true);
    // even when the everyday rows dominate the shortlist, coexistence is a catalog fact
    expect(curateShortlist(piFlipDay, null, PI_MENU_CAP).tiersCoexist).toBe(true);
  });

  it("ranks value voices by id, so a server re-skin of display names keeps the order", () => {
    // §7.3 of the plan holds open renaming OpenAI voices; ids are the stable key.
    const reskinned = [
      voice("alloy", "Neutral", "OpenAI", 50, "F"),
      voice("coral", "Sunny", "OpenAI", 50, "F"),
    ];
    const result = curateShortlist(reskinned, null, 2);
    expect(result.voices[0].id).toBe("coral");
  });

  it("tolerates a malformed catalog entry with a missing name without throwing", () => {
    const malformed = voice("broken", undefined as unknown as string, "OpenAI", 50);
    const result = curateShortlist([...openAiVoices, malformed], null, 4);
    expect(result.voices.length).toBe(4);
  });

  it("never features two HD voices with the same display name (Paola flash + Paola v3)", () => {
    const result = curateShortlist(piFlipDay, null, PI_MENU_CAP);
    const hdNames = result.voices
      .filter((v) => getVoiceTier(v) === "hd")
      .map((v) => v.name);
    expect(hdNames).toEqual(["Paola", "Joey"]);
  });

  it("ignores a current voice id that is not in the catalog (e.g. a Pi built-in)", () => {
    const result = curateShortlist(piFlipDay, "voice3", PI_MENU_CAP);
    expect(result.voices.length).toBe(PI_MENU_CAP);
    expect(result.voices.map((v) => v.id)).not.toContain("voice3");
  });
});
