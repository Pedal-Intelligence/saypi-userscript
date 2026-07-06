import { describe, it, expect } from "vitest";
import {
  getVoiceTier,
  curateShortlist,
  visibleCatalog,
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

  it("keeps the in-host menus short — 4 rows (2026-07-05 shortlist redesign)", () => {
    // The menu is a handful of sensible defaults + a door, not a browse surface.
    // Both hosts share the same short cap.
    expect(CLAUDE_MENU_CAP).toBe(4);
    expect(PI_MENU_CAP).toBe(4);
    // A catalog larger than the cap trims to exactly 4 visible rows.
    expect(curateShortlist(claudeFlipDay, null, CLAUDE_MENU_CAP).voices.length).toBe(4);
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

// --- §5 curation-manifest consumption (saypi-api #293) --------------------
// GET /voices now serves featured/section/recommended/deprecated/... on each
// voice. When those fields are present the client obeys them instead of the
// local price/rank heuristic; when absent it falls back (contract discipline).

type Manifest = Partial<
  Pick<
    SpeechSynthesisVoiceRemote,
    | "featured"
    | "section"
    | "recommended"
    | "deprecated"
    | "sibling_id"
    | "language"
    | "chars_per_minute"
  >
>;

function withManifest(
  v: SpeechSynthesisVoiceRemote,
  m: Manifest
): SpeechSynthesisVoiceRemote {
  return { ...v, ...m };
}

// A server-curated catalog mirroring the live shape (3 ElevenLabs "hd" +
// 10 OpenAI "everyday"). The featured set is deliberately DIVERGENT from what
// the local heuristic would pick (onyx/sage/shimmer are low-rank everyday
// voices the heuristic would never shortlist) — so a green test proves the
// client follows the server manifest, not its own ranking.
const FEATURED_IDS = new Set([
  "ig1TeITnnNlsJtfHxJlW", // Paola (hd)
  "bWJPewAagbymiJXZcxnh", // Joey (hd)
  "onyx",
  "sage",
  "shimmer",
]);
const curated = piFlipDay.map((v) =>
  withManifest(v, {
    featured: FEATURED_IDS.has(v.id),
    section: v.powered_by === "ElevenLabs" ? "hd" : "everyday",
  })
);

describe("getVoiceTier with a server section", () => {
  it("prefers section:hd over a value price", () => {
    expect(
      getVoiceTier(withManifest(voice("x", "X", "OpenAI", 50), { section: "hd" }))
    ).toBe("hd");
  });

  it("prefers section:everyday over a premium price", () => {
    expect(
      getVoiceTier(
        withManifest(voice("y", "Y", "ElevenLabs", 1000), { section: "everyday" })
      )
    ).toBe("everyday");
  });

  it("treats a language-shelf section as everyday for the HD chip", () => {
    expect(
      getVoiceTier(
        withManifest(voice("z", "Z", "60dB", undefined), { section: "language" })
      )
    ).toBe("everyday");
  });

  it("falls back to the price/provider heuristic when section is absent", () => {
    expect(getVoiceTier(voice("w", "W", "ElevenLabs", 1000))).toBe("hd");
  });
});

describe("curateShortlist with a server-curated catalog", () => {
  it("draws the shortlist from the server featured set, in server order (capped)", () => {
    // curated features 5 voices; the cap of 4 keeps the first four in server order.
    const result = curateShortlist(curated, null, PI_MENU_CAP);
    expect(result.voices.map((v) => v.name)).toEqual([
      "Paola",
      "Joey",
      "Onyx",
      "Sage",
    ]);
  });

  it("pins the current voice first, then the server featured set", () => {
    const result = curateShortlist(curated, "alloy", CLAUDE_MENU_CAP);
    // current (Alloy) + the first three featured, capped at 4.
    expect(result.voices.map((v) => v.name)).toEqual([
      "Alloy",
      "Paola",
      "Joey",
      "Onyx",
    ]);
  });

  it("fills to the cap in server order when fewer voices are featured than the cap", () => {
    // Only two featured, cap 4 → the two featured, then the next two in server order.
    const twoFeatured = piFlipDay.map((v, i) =>
      withManifest(v, {
        featured: i < 2,
        section: v.powered_by === "ElevenLabs" ? "hd" : "everyday",
      })
    );
    const result = curateShortlist(twoFeatured, null, CLAUDE_MENU_CAP);
    expect(result.voices.length).toBe(CLAUDE_MENU_CAP); // 4
    expect(result.voices.slice(0, 2).map((v) => v.id)).toEqual(
      piFlipDay.slice(0, 2).map((v) => v.id)
    );
    // slots 3–4 filled straight down server order (next un-taken voices)
    expect(result.voices.slice(2, 4).map((v) => v.id)).toEqual(
      piFlipDay.slice(2, 4).map((v) => v.id)
    );
  });

  it("never yields an empty menu when the server marks nothing featured", () => {
    const noneFeatured = piFlipDay.map((v) =>
      withManifest(v, {
        featured: false,
        section: v.powered_by === "ElevenLabs" ? "hd" : "everyday",
      })
    );
    const result = curateShortlist(noneFeatured, null, PI_MENU_CAP);
    expect(result.voices.length).toBe(PI_MENU_CAP);
    // filled straight down the server order
    expect(result.voices.map((v) => v.id)).toEqual(
      piFlipDay.slice(0, PI_MENU_CAP).map((v) => v.id)
    );
  });

  it("still uses the local heuristic for a catalog with no manifest fields", () => {
    // piFlipDay carries no featured field → heuristic path (backward compat)
    const result = curateShortlist(piFlipDay, null, PI_MENU_CAP);
    const everyday = result.voices
      .filter((v) => getVoiceTier(v) === "everyday")
      .map((v) => v.name);
    expect(everyday).toEqual(["Coral", "Nova", "Ash"].slice(0, everyday.length));
  });
});

// --- §Phase-2 user pins (doc/plans/2026-07-05-voice-shortlist-pins-design.md) --
// When the user has curated their own shortlist by pinning, the resolved
// pinned set drives menu membership DIRECTLY: current voice first
// (grandfathering), then pinned voices in catalog order, capped — and with NO
// fill-to-cap padding, which is what makes the "empty-pin floor" real (0 pins →
// current + door only). Omitting pinnedIds must leave every existing path
// (server-featured + heuristic) untouched.

describe("curateShortlist with user pins (pinnedIds)", () => {
  it("draws membership from the pinned set, current-first, with no padding", () => {
    const pinned = new Set(["onyx", "sage"]); // two pins
    const result = curateShortlist(curated, "alloy", CLAUDE_MENU_CAP, pinned);
    // current (Alloy, grandfathered) + the two pins in catalog order — NOT padded to 4.
    expect(result.voices.map((v) => v.id)).toEqual(["alloy", "onyx", "sage"]);
  });

  it("pins the current voice first even when it is not in the pinned set (grandfathering)", () => {
    const pinned = new Set(["onyx"]);
    const result = curateShortlist(curated, "nova", CLAUDE_MENU_CAP, pinned);
    expect(result.voices[0].id).toBe("nova");
    expect(result.voices.map((v) => v.id)).toContain("onyx");
  });

  it("does not duplicate the current voice when it is also pinned", () => {
    const pinned = new Set(["alloy", "onyx"]);
    const result = curateShortlist(curated, "alloy", CLAUDE_MENU_CAP, pinned);
    expect(result.voices.filter((v) => v.id === "alloy").length).toBe(1);
  });

  it("caps a large pinned set at the menu cap (the menu never scales)", () => {
    const pinned = new Set([
      "ig1TeITnnNlsJtfHxJlW",
      "bWJPewAagbymiJXZcxnh",
      "coral",
      "onyx",
      "sage",
      "shimmer",
    ]); // six pins
    const result = curateShortlist(curated, null, CLAUDE_MENU_CAP, pinned);
    expect(result.voices.length).toBe(CLAUDE_MENU_CAP);
  });

  it("orders pinned voices by catalog (server) order, not by pinned-set order", () => {
    const pinned = new Set(["shimmer", "onyx"]); // deliberately reversed
    const result = curateShortlist(curated, null, PI_MENU_CAP, pinned);
    const onyxIdx = result.voices.findIndex((v) => v.id === "onyx");
    const shimmerIdx = result.voices.findIndex((v) => v.id === "shimmer");
    expect(onyxIdx).toBeGreaterThanOrEqual(0);
    expect(onyxIdx).toBeLessThan(shimmerIdx); // onyx precedes shimmer in server order
  });

  it("yields the current voice only when the pinned set is empty (empty-pin floor)", () => {
    const result = curateShortlist(curated, "alloy", CLAUDE_MENU_CAP, new Set());
    // The "More voices…" door is added by the menu, not curation — curation
    // legitimately returns just the grandfathered current voice.
    expect(result.voices.map((v) => v.id)).toEqual(["alloy"]);
  });

  it("can be empty when pins are empty and there is no current voice (menu shows just the door)", () => {
    const result = curateShortlist(curated, null, CLAUDE_MENU_CAP, new Set());
    expect(result.voices).toEqual([]);
    expect(result.hiddenCount).toBe(curated.length);
  });

  it("excludes a deprecated pinned voice unless it is the current voice", () => {
    const withDeprecated = curated.map((v) =>
      v.id === "onyx" ? withManifest(v, { deprecated: true }) : v
    );
    const pinned = new Set(["onyx", "sage"]);
    const result = curateShortlist(withDeprecated, null, CLAUDE_MENU_CAP, pinned);
    expect(result.voices.map((v) => v.id)).not.toContain("onyx");
    expect(result.voices.map((v) => v.id)).toContain("sage");
  });

  it("leaves the un-pinned path (undefined pinnedIds) exactly as before", () => {
    // Regression guard: omitting pinnedIds reproduces the server-featured path.
    const result = curateShortlist(curated, null, PI_MENU_CAP);
    expect(result.voices.map((v) => v.name)).toEqual([
      "Paola",
      "Joey",
      "Onyx",
      "Sage",
    ]);
  });
});

describe("curateShortlist grandfathering (deprecated voices)", () => {
  it("excludes a deprecated voice even when the server featured it", () => {
    const withDeprecated = curated.map((v) =>
      v.id === "onyx" ? withManifest(v, { deprecated: true }) : v
    );
    const result = curateShortlist(withDeprecated, null, CLAUDE_MENU_CAP);
    expect(result.voices.map((v) => v.id)).not.toContain("onyx");
  });

  it("drops deprecated voices from the selectable count behind the door", () => {
    const withDeprecated = curated.map((v) =>
      v.id === "alloy" ? withManifest(v, { deprecated: true }) : v
    );
    const result = curateShortlist(withDeprecated, null, CLAUDE_MENU_CAP);
    // 13 catalog − 1 deprecated − 4 shown = 8 behind the door
    expect(result.hiddenCount).toBe(8);
  });

  it("keeps rendering the user's current voice even after it is deprecated (grandfathering)", () => {
    const withDeprecated = curated.map((v) =>
      v.id === "alloy" ? withManifest(v, { deprecated: true }) : v
    );
    const result = curateShortlist(withDeprecated, "alloy", CLAUDE_MENU_CAP);
    expect(result.voices[0].id).toBe("alloy");
  });
});

describe("visibleCatalog", () => {
  const a = voice("a", "A", "OpenAI", 50);
  const b = withManifest(voice("b", "B", "OpenAI", 50), { deprecated: true });
  const c = voice("c", "C", "OpenAI", 50);

  it("hides deprecated voices from new selectors", () => {
    expect(visibleCatalog([a, b, c], null).map((v) => v.id)).toEqual(["a", "c"]);
  });

  it("keeps a deprecated voice that is the current selection", () => {
    expect(visibleCatalog([a, b, c], "b").map((v) => v.id)).toEqual([
      "a",
      "b",
      "c",
    ]);
  });
});
