import { describe, it, expect, vi } from "vitest";
import {
  VOICE_DEFAULT_PENDING_KEY,
  DEFAULTABLE_HOST_IDS,
  toPendingHosts,
  isDefaultPending,
  withHostDrained,
  seedVoiceDefaultsOnFreshInstall,
} from "../../src/onboarding/voiceDefaults";

describe("voiceDefaults pure helpers", () => {
  it("normalises stored pending values to a string[]", () => {
    expect(toPendingHosts(["claude", "pi"])).toEqual(["claude", "pi"]);
    expect(toPendingHosts(["claude", 3, null, "pi"])).toEqual(["claude", "pi"]);
    expect(toPendingHosts(undefined)).toEqual([]);
    expect(toPendingHosts("nope")).toEqual([]);
  });

  it("reports pending membership", () => {
    expect(isDefaultPending(["claude", "pi"], "claude")).toBe(true);
    expect(isDefaultPending(["pi"], "claude")).toBe(false);
    expect(isDefaultPending(undefined, "claude")).toBe(false);
  });

  it("drains a host from the pending set", () => {
    expect(withHostDrained(["claude", "pi"], "claude")).toEqual(["pi"]);
    expect(withHostDrained(["pi"], "claude")).toEqual(["pi"]);
    expect(withHostDrained(undefined, "claude")).toEqual([]);
  });
});

describe("seedVoiceDefaultsOnFreshInstall", () => {
  const makeStorage = (initial?: unknown) => {
    const store: Record<string, unknown> = {};
    if (initial !== undefined) store[VOICE_DEFAULT_PENDING_KEY] = initial;
    return {
      store,
      get: vi.fn((key: string) => Promise.resolve(store[key])),
      set: vi.fn((key: string, value: unknown) => {
        store[key] = value;
        return Promise.resolve();
      }),
    };
  };

  it("marks every defaultable host pending on a fresh install", async () => {
    const s = makeStorage();
    const wrote = await seedVoiceDefaultsOnFreshInstall("install", s);
    expect(wrote).toBe(true);
    expect(s.store[VOICE_DEFAULT_PENDING_KEY]).toEqual([...DEFAULTABLE_HOST_IDS]);
  });

  it("does NOT seed on an update (existing users are grandfathered)", async () => {
    const s = makeStorage();
    const wrote = await seedVoiceDefaultsOnFreshInstall("update", s);
    expect(wrote).toBe(false);
    expect(s.set).not.toHaveBeenCalled();
    expect(s.store[VOICE_DEFAULT_PENDING_KEY]).toBeUndefined();
  });

  it("does NOT clobber an already-seeded pending set (repeated install event)", async () => {
    const s = makeStorage(["pi"]); // claude already drained, pi still pending
    const wrote = await seedVoiceDefaultsOnFreshInstall("install", s);
    expect(wrote).toBe(false);
    expect(s.set).not.toHaveBeenCalled();
    expect(s.store[VOICE_DEFAULT_PENDING_KEY]).toEqual(["pi"]);
  });

  it("never throws — a storage failure must not break installation", async () => {
    const failing = {
      get: vi.fn(() => Promise.reject(new Error("boom"))),
      set: vi.fn(() => Promise.resolve()),
    };
    await expect(
      seedVoiceDefaultsOnFreshInstall("install", failing)
    ).resolves.toBe(false);
  });
});
