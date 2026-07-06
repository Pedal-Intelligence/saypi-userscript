import { describe, it, expect } from "vitest";
import {
  unifyHostCatalogs,
  type HostCatalog,
  type UnifiedVoiceRow,
} from "../../src/tts/VoiceCatalogUnify";
import { SpeechSynthesisVoiceRemote } from "../../src/tts/SpeechModel";

// Minimal voice factory — only the fields unify/tier read.
function v(
  id: string,
  over: Partial<SpeechSynthesisVoiceRemote> = {}
): SpeechSynthesisVoiceRemote {
  return {
    id,
    name: id.charAt(0).toUpperCase() + id.slice(1),
    powered_by: "OpenAI",
    price_per_thousand_chars_in_credits: 50,
    default: false,
    lang: "en",
    localService: false,
    voiceURI: `https://api.saypi.ai/voices/${id}`,
    ...over,
  } as SpeechSynthesisVoiceRemote;
}

function host(
  hostId: string,
  voices: SpeechSynthesisVoiceRemote[],
  over: Partial<HostCatalog> = {}
): HostCatalog {
  return { hostId, voices, currentId: null, overlay: null, ...over };
}

function rowFor(rows: UnifiedVoiceRow[], id: string): UnifiedVoiceRow {
  const row = rows.find((r) => r.voice.id === id);
  if (!row) throw new Error(`no row for ${id}`);
  return row;
}

function stateFor(row: UnifiedVoiceRow, hostId: string) {
  const s = row.hosts.find((h) => h.hostId === hostId);
  if (!s) throw new Error(`no ${hostId} state`);
  return s;
}

describe("unifyHostCatalogs — union & serveability", () => {
  it("collapses a voice served by both hosts into a single row with both host states", () => {
    const shared = v("marin");
    const rows = unifyHostCatalogs([
      host("pi", [shared]),
      host("claude", [v("marin")]),
    ]);
    expect(rows.length).toBe(1);
    expect(rows[0].hosts.map((h) => h.hostId)).toEqual(["pi", "claude"]);
    expect(stateFor(rows[0], "pi").serveable).toBe(true);
    expect(stateFor(rows[0], "claude").serveable).toBe(true);
  });

  it("marks a host-specific voice serveable on that host only", () => {
    const rows = unifyHostCatalogs([
      host("pi", [v("paola")]),
      host("claude", [v("jarnathan")]),
    ]);
    expect(stateFor(rowFor(rows, "paola"), "pi").serveable).toBe(true);
    expect(stateFor(rowFor(rows, "paola"), "claude").serveable).toBe(false);
    expect(stateFor(rowFor(rows, "jarnathan"), "claude").serveable).toBe(true);
    expect(stateFor(rowFor(rows, "jarnathan"), "pi").serveable).toBe(false);
  });

  it("orders the union first-host-first, then appends later-host-only voices", () => {
    const rows = unifyHostCatalogs([
      host("pi", [v("paola"), v("marin")]),
      host("claude", [v("marin"), v("jarnathan")]),
    ]);
    expect(rows.map((r) => r.voice.id)).toEqual(["paola", "marin", "jarnathan"]);
  });

  it("contributes nothing for a host whose catalog is empty (e.g. a failed fetch)", () => {
    const rows = unifyHostCatalogs([
      host("pi", [v("marin")]),
      host("claude", []),
    ]);
    expect(rows.length).toBe(1);
    expect(stateFor(rows[0], "claude").serveable).toBe(false);
    expect(stateFor(rows[0], "pi").serveable).toBe(true);
  });
});

describe("unifyHostCatalogs — pin state", () => {
  it("treats a server-featured voice as pinned by default (no overlay)", () => {
    const rows = unifyHostCatalogs([
      host("pi", [v("marin", { featured: true }), v("ash", { featured: false })]),
    ]);
    expect(stateFor(rowFor(rows, "marin"), "pi").pinned).toBe(true);
    expect(stateFor(rowFor(rows, "ash"), "pi").pinned).toBe(false);
  });

  it("applies the user's overlay: removes an unpinned default, adds a pinned non-default", () => {
    const rows = unifyHostCatalogs([
      host(
        "pi",
        [v("marin", { featured: true }), v("ash")],
        { overlay: { pinned: ["ash"], unpinned: ["marin"] } }
      ),
    ]);
    expect(stateFor(rowFor(rows, "marin"), "pi").pinned).toBe(false);
    expect(stateFor(rowFor(rows, "ash"), "pi").pinned).toBe(true);
  });

  it("keeps pin state independent per host", () => {
    const rows = unifyHostCatalogs([
      host("pi", [v("marin", { featured: true })]),
      host("claude", [v("marin", { featured: false })]),
    ]);
    expect(stateFor(rowFor(rows, "marin"), "pi").pinned).toBe(true);
    expect(stateFor(rowFor(rows, "marin"), "claude").pinned).toBe(false);
  });

  it("never reports a voice pinned on a host that does not serve it", () => {
    const rows = unifyHostCatalogs([
      host("pi", [v("paola", { featured: true })]),
      host("claude", []),
    ]);
    expect(stateFor(rowFor(rows, "paola"), "claude").pinned).toBe(false);
  });
});

describe("unifyHostCatalogs — current voice", () => {
  it("marks the host's current voice", () => {
    const rows = unifyHostCatalogs([
      host("pi", [v("marin"), v("ash")], { currentId: "ash" }),
      host("claude", [v("marin"), v("ash")], { currentId: "marin" }),
    ]);
    expect(stateFor(rowFor(rows, "ash"), "pi").isCurrent).toBe(true);
    expect(stateFor(rowFor(rows, "ash"), "claude").isCurrent).toBe(false);
    expect(stateFor(rowFor(rows, "marin"), "claude").isCurrent).toBe(true);
  });
});

describe("unifyHostCatalogs — exclusions", () => {
  it("excludes host-native default voices (Pi 1-8) from the pin catalog", () => {
    const rows = unifyHostCatalogs([
      host("pi", [v("pi-1", { default: true }), v("marin")]),
    ]);
    expect(rows.map((r) => r.voice.id)).toEqual(["marin"]);
  });

  it("excludes a deprecated voice from the catalog", () => {
    const rows = unifyHostCatalogs([
      host("pi", [v("marin"), v("retired", { deprecated: true })]),
    ]);
    expect(rows.map((r) => r.voice.id)).toEqual(["marin"]);
  });

  it("keeps a deprecated voice that is the host's current selection (grandfathering)", () => {
    const rows = unifyHostCatalogs([
      host("pi", [v("retired", { deprecated: true })], { currentId: "retired" }),
    ]);
    expect(rows.map((r) => r.voice.id)).toEqual(["retired"]);
    expect(stateFor(rows[0], "pi").isCurrent).toBe(true);
  });
});

describe("unifyHostCatalogs — tier", () => {
  it("classifies each row's tier from the voice", () => {
    const rows = unifyHostCatalogs([
      host("claude", [
        v("jarnathan", { powered_by: "ElevenLabs", price_per_thousand_chars_in_credits: 1000 }),
        v("nova"),
      ]),
    ]);
    expect(rowFor(rows, "jarnathan").tier).toBe("hd");
    expect(rowFor(rows, "nova").tier).toBe("everyday");
  });
});
