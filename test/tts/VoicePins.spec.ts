import { describe, it, expect } from "vitest";
import {
  toOverlay,
  serverFeaturedIds,
  resolvePinnedIds,
  togglePin,
  isHostOverlayEmpty,
  getHostOverlay,
  loadHostOverlay,
  setVoicePinned,
  resolvePinnedIdsForHost,
  VOICE_PINS_KEY,
  type HostPinOverlay,
  type PinStorage,
} from "../../src/tts/VoicePins";

// A voice pin overlay records only the user's explicit *deltas* on top of the
// server's `featured` set (the default pins): ids they added (`pinned`) and
// server-default ids they removed (`unpinned`). The pure helpers below are the
// whole model — everything else layers storage on top.

describe("toOverlay (null-safety at the storage boundary)", () => {
  it("passes a well-formed overlay through", () => {
    expect(toOverlay({ pinned: ["a"], unpinned: ["b"] })).toEqual({
      pinned: ["a"],
      unpinned: ["b"],
    });
  });

  it("coerces missing / garbage fields to empty string arrays", () => {
    expect(toOverlay(null)).toEqual({ pinned: [], unpinned: [] });
    expect(toOverlay(undefined)).toEqual({ pinned: [], unpinned: [] });
    expect(toOverlay({})).toEqual({ pinned: [], unpinned: [] });
    expect(toOverlay({ pinned: "x", unpinned: 3 })).toEqual({
      pinned: [],
      unpinned: [],
    });
    expect(toOverlay({ pinned: ["a", 1, null, "b"] })).toEqual({
      pinned: ["a", "b"],
      unpinned: [],
    });
  });
});

describe("serverFeaturedIds", () => {
  it("returns the ids of featured voices only, in order", () => {
    expect(
      serverFeaturedIds([
        { id: "a", featured: true },
        { id: "b", featured: false },
        { id: "c" },
        { id: "d", featured: true },
      ] as any)
    ).toEqual(["a", "d"]);
  });
});

describe("resolvePinnedIds (defaults overlaid with user deltas)", () => {
  const featured = ["a", "b", "c", "d"];

  it("is the server featured set when the overlay is null (identity — un-customized)", () => {
    expect([...resolvePinnedIds(featured, null)]).toEqual(featured);
  });

  it("adds user-pinned ids on top of the defaults", () => {
    expect(resolvePinnedIds(featured, { pinned: ["z"], unpinned: [] })).toEqual(
      new Set(["a", "b", "c", "d", "z"])
    );
  });

  it("removes user-unpinned defaults", () => {
    expect(resolvePinnedIds(featured, { pinned: [], unpinned: ["b"] })).toEqual(
      new Set(["a", "c", "d"])
    );
  });

  it("resolves to an empty set when every default is unpinned", () => {
    expect(
      resolvePinnedIds(featured, { pinned: [], unpinned: featured }).size
    ).toBe(0);
  });
});

describe("togglePin (minimal, normalized deltas)", () => {
  const featured = ["a", "b", "c", "d"];

  it("records an unpinned server default in `unpinned`", () => {
    expect(togglePin(null, "b", featured, false)).toEqual({
      pinned: [],
      unpinned: ["b"],
    });
  });

  it("records a pinned non-default voice in `pinned`", () => {
    expect(togglePin(null, "z", featured, true)).toEqual({
      pinned: ["z"],
      unpinned: [],
    });
  });

  it("re-pinning a previously-unpinned default clears the removal (reverts to default)", () => {
    const removed = togglePin(null, "b", featured, false);
    expect(togglePin(removed, "b", featured, true)).toEqual({
      pinned: [],
      unpinned: [],
    });
  });

  it("unpinning a user-added voice just drops it from `pinned`", () => {
    const added = togglePin(null, "z", featured, true);
    expect(togglePin(added, "z", featured, false)).toEqual({
      pinned: [],
      unpinned: [],
    });
  });

  it("pinning a voice that is already a server default is a no-op (already pinned)", () => {
    expect(togglePin(null, "a", featured, true)).toEqual({
      pinned: [],
      unpinned: [],
    });
  });

  it("does not duplicate an id already recorded", () => {
    const added = togglePin(null, "z", featured, true);
    expect(togglePin(added, "z", featured, true)).toEqual({
      pinned: ["z"],
      unpinned: [],
    });
  });
});

describe("isHostOverlayEmpty", () => {
  it("is true only when both arrays are empty (or the overlay is null)", () => {
    expect(isHostOverlayEmpty({ pinned: [], unpinned: [] })).toBe(true);
    expect(isHostOverlayEmpty(null)).toBe(true);
    expect(isHostOverlayEmpty({ pinned: ["a"], unpinned: [] })).toBe(false);
    expect(isHostOverlayEmpty({ pinned: [], unpinned: ["b"] })).toBe(false);
  });
});

describe("getHostOverlay", () => {
  it("returns null for a host the user never customized", () => {
    expect(getHostOverlay({}, "pi")).toBeNull();
  });

  it("returns the normalized overlay for a customized host", () => {
    expect(
      getHostOverlay({ pi: { pinned: ["z"], unpinned: [] } } as any, "pi")
    ).toEqual({ pinned: ["z"], unpinned: [] });
  });

  it("normalizes a garbage stored value defensively", () => {
    expect(
      getHostOverlay({ pi: { pinned: "nope" } } as any, "pi")
    ).toEqual({ pinned: [], unpinned: [] });
  });
});

// --- storage-backed helpers (dependency-injected, like voiceDefaults.ts) ---

function memoryStorage(
  seed: Record<string, unknown> = {}
): PinStorage & { store: Record<string, unknown> } {
  const store: Record<string, unknown> = { ...seed };
  return {
    store,
    get: async (key: string) => store[key],
    set: async (key: string, value: unknown) => {
      store[key] = value;
    },
  };
}

describe("loadHostOverlay", () => {
  it("returns null when nothing is stored", async () => {
    expect(await loadHostOverlay("pi", memoryStorage())).toBeNull();
  });

  it("returns the stored overlay for the host", async () => {
    const s = memoryStorage({
      [VOICE_PINS_KEY]: { pi: { pinned: ["z"], unpinned: [] } },
    });
    expect(await loadHostOverlay("pi", s)).toEqual({ pinned: ["z"], unpinned: [] });
  });

  it("returns null for a host absent from a populated store", async () => {
    const s = memoryStorage({
      [VOICE_PINS_KEY]: { claude: { pinned: ["z"], unpinned: [] } },
    });
    expect(await loadHostOverlay("pi", s)).toBeNull();
  });
});

describe("setVoicePinned", () => {
  const featured = ["a", "b", "c", "d"];

  it("persists an unpin as a host overlay", async () => {
    const s = memoryStorage();
    await setVoicePinned("pi", "b", featured, false, s);
    expect((s.store[VOICE_PINS_KEY] as any).pi).toEqual({
      pinned: [],
      unpinned: ["b"],
    });
  });

  it("drains the host key when the overlay reverts to empty (back to defaults)", async () => {
    const s = memoryStorage();
    await setVoicePinned("pi", "b", featured, false, s); // customize
    await setVoicePinned("pi", "b", featured, true, s); // revert
    expect((s.store[VOICE_PINS_KEY] as any)?.pi).toBeUndefined();
  });

  it("never disturbs another host's overlay", async () => {
    const s = memoryStorage({
      [VOICE_PINS_KEY]: { claude: { pinned: ["x"], unpinned: [] } },
    });
    await setVoicePinned("pi", "z", featured, true, s);
    expect((s.store[VOICE_PINS_KEY] as any).claude).toEqual({
      pinned: ["x"],
      unpinned: [],
    });
    expect((s.store[VOICE_PINS_KEY] as any).pi).toEqual({
      pinned: ["z"],
      unpinned: [],
    });
  });
});

describe("resolvePinnedIdsForHost (the menu-consumer entry point)", () => {
  const voices = [
    { id: "a", featured: true },
    { id: "b", featured: true },
    { id: "z" },
  ] as any;

  it("returns null for an un-customized host — the menu keeps its default (padded) path", async () => {
    expect(await resolvePinnedIdsForHost("pi", voices, memoryStorage())).toBeNull();
  });

  it("returns the resolved pinned set for a customized host", async () => {
    const s = memoryStorage({
      [VOICE_PINS_KEY]: { pi: { pinned: ["z"], unpinned: ["b"] } },
    });
    expect(await resolvePinnedIdsForHost("pi", voices, s)).toEqual(
      new Set(["a", "z"])
    );
  });
});

describe("the overlay is a delta, not a snapshot", () => {
  it("a NEW server-featured voice reaches a user who had emptied their shortlist", () => {
    // The user unpinned every voice they had seen...
    const originalFeatured = ["a", "b"];
    let overlay: HostPinOverlay | null = null;
    overlay = togglePin(overlay, "a", originalFeatured, false);
    overlay = togglePin(overlay, "b", originalFeatured, false);
    expect(resolvePinnedIds(originalFeatured, overlay).size).toBe(0); // emptied

    // ...then the server later features a brand-new voice "c". Because the
    // overlay only records removals of voices the user actually saw, "c" is not
    // in `unpinned`, so it surfaces. This is intended: server curation keeps
    // introducing new voices; an emptied shortlist is not a permanent block.
    const laterFeatured = ["a", "b", "c"];
    expect(resolvePinnedIds(laterFeatured, overlay)).toEqual(new Set(["c"]));
  });
});
