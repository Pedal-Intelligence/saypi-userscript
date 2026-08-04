import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  HEARD_CAP,
  VOICE_HEARD_KEY,
  isHeard,
  loadHeardStore,
  markHeardAt,
  recordVoiceHeard,
  toHeardStore,
  type VoiceHeardStore,
} from "../../src/tts/VoiceHeard";
import type { KeyValueStorage } from "../../src/storage/localKeyStorage";

// Heard memory is a FLAT, ADDITIVE `voiceId → epoch ms` map, global rather
// than per-host: a voice is literally the same sample_url file on both hosts,
// and there is nothing to un-hear. The pure helpers below are the whole model;
// the async pair only adds an injectable storage layer on top.

beforeEach(() => {
  // The chrome.storage mock in test/vitest.setup.js is MODULE-scoped and
  // nothing resets it between cases — a map left behind by the last test
  // would silently seed the next one.
  (chrome.storage.local as any)._reset?.();
});

/** A store of `n` voices, oldest first, one second apart. */
const many = (n: number, from = 1_000): VoiceHeardStore =>
  Object.fromEntries(
    Array.from({ length: n }, (_, i) => [`v${String(i).padStart(4, "0")}`, from + i])
  );

describe("toHeardStore (coercion at the untrusted storage boundary)", () => {
  it("passes a well-formed map through", () => {
    expect(toHeardStore({ onyx: 1_700_000_000_000, coral: 12 })).toEqual({
      onyx: 1_700_000_000_000,
      coral: 12,
    });
  });

  it("coerces anything that is not a map to empty", () => {
    for (const raw of [null, undefined, 7, "onyx", true, ["onyx"], () => {}]) {
      expect(toHeardStore(raw)).toEqual({});
    }
  });

  it("drops entries whose timestamp is not a usable number", () => {
    // Repaired rather than rescued: a garbage timestamp sorts wrongly in the
    // eviction order, and a mark we cannot date is worth less than no mark.
    expect(
      toHeardStore({
        good: 5,
        alsoGood: 0,
        stringy: "5",
        nan: Number.NaN,
        infinite: Number.POSITIVE_INFINITY,
        negative: -1,
        nested: { at: 5 },
        nothing: null,
      })
    ).toEqual({ good: 5, alsoGood: 0 });
  });

  it("does not let a hostile key reach the prototype", () => {
    const store = toHeardStore(JSON.parse('{"__proto__": 5, "onyx": 6}'));
    expect(isHeard(store, "onyx")).toBe(true);
    expect(({} as any).__proto__).not.toBe(5);
    expect(Object.prototype.hasOwnProperty.call(store, "__proto__")).toBe(true);
  });

  it("enforces the cap on the way in, so a corrupt map cannot grow forever", () => {
    const store = toHeardStore(many(HEARD_CAP + 25));
    expect(Object.keys(store)).toHaveLength(HEARD_CAP);
    // Oldest first out: v0000..v0024 are the 25 that go.
    expect(isHeard(store, "v0024")).toBe(false);
    expect(isHeard(store, "v0025")).toBe(true);
  });
});

describe("isHeard (absence means unheard)", () => {
  it("is false for a voice the map has never seen", () => {
    expect(isHeard({}, "onyx")).toBe(false);
    expect(isHeard({ coral: 1 }, "onyx")).toBe(false);
  });

  it("is true for any recorded timestamp, including the epoch itself", () => {
    expect(isHeard({ onyx: 1 }, "onyx")).toBe(true);
    expect(isHeard({ onyx: 0 }, "onyx")).toBe(true);
  });

  it("never mistakes an inherited property for a mark", () => {
    // A voice id is server-supplied, so "toString"/"constructor" are reachable
    // strings, and `store[id]` alone would answer yes for both.
    expect(isHeard({}, "toString")).toBe(false);
    expect(isHeard({}, "constructor")).toBe(false);
  });
});

describe("markHeardAt", () => {
  it("adds a voice without touching the caller's map", () => {
    const before: VoiceHeardStore = { coral: 1 };
    const after = markHeardAt(before, "onyx", 9);
    expect(after).toEqual({ coral: 1, onyx: 9 });
    expect(before).toEqual({ coral: 1 });
  });

  it("refreshes the timestamp on a replay rather than counting it", () => {
    // No play counts, deliberately: they answer no question the page asks and
    // turn every replay into a bigger write.
    const twice = markHeardAt(markHeardAt({}, "onyx", 5), "onyx", 50);
    expect(twice).toEqual({ onyx: 50 });
  });

  it("coerces an unusable clock to 0 rather than storing NaN", () => {
    expect(markHeardAt({}, "onyx", Number.NaN)).toEqual({ onyx: 0 });
    expect(markHeardAt({}, "onyx", -5)).toEqual({ onyx: 0 });
  });

  it("repairs a garbage store on the way through", () => {
    expect(markHeardAt({ junk: "x" } as any, "onyx", 3)).toEqual({ onyx: 3 });
  });
});

describe("markHeardAt — cap and evict at the 400 boundary", () => {
  it("keeps everything up to the cap", () => {
    const full = markHeardAt(many(HEARD_CAP - 1), "onyx", 999_999);
    expect(Object.keys(full)).toHaveLength(HEARD_CAP);
    expect(isHeard(full, "v0000")).toBe(true);
  });

  it("evicts the OLDEST entry on the one that crosses it", () => {
    const over = markHeardAt(many(HEARD_CAP), "onyx", 999_999);
    expect(Object.keys(over)).toHaveLength(HEARD_CAP);
    expect(isHeard(over, "v0000")).toBe(false); // the oldest
    expect(isHeard(over, "v0001")).toBe(true);
    expect(isHeard(over, "onyx")).toBe(true);
  });

  it("never evicts the voice it was just asked to remember", () => {
    // Even when every existing mark is NEWER than the one being written —
    // "I just listened to that" is the single fact this module exists to hold.
    const future = many(HEARD_CAP, 9_000_000);
    const over = markHeardAt(future, "onyx", 1);
    expect(isHeard(over, "onyx")).toBe(true);
    expect(Object.keys(over)).toHaveLength(HEARD_CAP);
  });

  it("re-marking a voice already in a full map evicts nothing", () => {
    const full = many(HEARD_CAP);
    const again = markHeardAt(full, "v0000", 9_999_999);
    expect(Object.keys(again)).toHaveLength(HEARD_CAP);
    expect(again.v0000).toBe(9_999_999);
  });
});

describe("the storage layer", () => {
  it("round-trips through chrome.storage.local under one named key", async () => {
    await recordVoiceHeard("onyx", 42);
    expect((chrome.storage.local as any)._getState()[VOICE_HEARD_KEY]).toEqual({
      onyx: 42,
    });
    expect(isHeard(await loadHeardStore(), "onyx")).toBe(true);
  });

  it("is additive across calls", async () => {
    await recordVoiceHeard("onyx", 1);
    await recordVoiceHeard("coral", 2);
    expect(await loadHeardStore()).toEqual({ onyx: 1, coral: 2 });
  });

  it("never writes to chrome.storage.sync", async () => {
    // sync has an 8KB per-item cap a 400-entry map would silently blow, and an
    // hourly write quota precisely designed to throttle a stream like this.
    await recordVoiceHeard("onyx", 1);
    expect(chrome.storage.sync.set).not.toHaveBeenCalled();
  });

  it("coerces garbage that was already in storage", async () => {
    (chrome.storage.local as any)._setState({ [VOICE_HEARD_KEY]: "nonsense" });
    expect(await loadHeardStore()).toEqual({});
    await recordVoiceHeard("onyx", 3);
    expect(await loadHeardStore()).toEqual({ onyx: 3 });
  });

  it("SWALLOWS a failed write — no throw, no revert, no console noise", async () => {
    // Deliberately the inverse of a pin, which does revert: a pin is a promise
    // about another surface, while a heard mark asserts only that the user's
    // ears were in the room — which stays true whether or not the write landed.
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const broken: KeyValueStorage = {
      get: async () => ({}),
      set: async () => {
        throw new Error("QUOTA_BYTES");
      },
    };
    await expect(recordVoiceHeard("onyx", 1, broken)).resolves.toBeUndefined();
    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
  });

  it("survives an unreadable store instead of rejecting", async () => {
    const broken: KeyValueStorage = {
      get: async () => {
        throw new Error("nope");
      },
      set: async () => {},
    };
    expect(await loadHeardStore(broken)).toEqual({});
  });

  it("keeps ids that no live catalog contains — pruning is a data-loss trap", async () => {
    // fetchHost catches a failed catalog request into an EMPTY catalog, so a
    // prune-against-the-catalog cleanup would wipe the whole map on one bad
    // network moment. Cap-and-evict is catalog-independent and cannot.
    await recordVoiceHeard("a-voice-the-server-retired", 1);
    await recordVoiceHeard("onyx", 2);
    expect(Object.keys(await loadHeardStore()).sort()).toEqual([
      "a-voice-the-server-retired",
      "onyx",
    ]);
  });
});
