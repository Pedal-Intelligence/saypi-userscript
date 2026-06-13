import { describe, it, expect, beforeEach, vi, type Mock } from "vitest";
import { UserPreferenceModule, MIGRATION_FLAG } from "../PreferenceModule";

describe("UserPreferenceModule migration (sync -> local)", () => {
  let syncGet: Mock;
  let localGet: Mock;
  let localSet: Mock;
  let localRemove: Mock;

  beforeEach(() => {
    syncGet = vi.fn((_keys, cb) => cb({ autoSubmit: false, theme: "dark" }));
    localGet = vi.fn((_keys, cb) => cb({}));
    localSet = vi.fn((_items, cb) => cb());
    localRemove = vi.fn((_key, cb) => cb());

    global.chrome = {
      storage: {
        sync: { get: syncGet },
        local: { get: localGet, set: localSet, remove: localRemove },
      },
      runtime: { lastError: null },
    } as unknown as typeof chrome;
  });

  // migrateStorage() reads only chrome.* (no `this`). Instantiate via the
  // prototype so the constructor's fire-and-forget wiring (cache load, message
  // listeners) doesn't run — we exercise the migration in isolation.
  const migrate = () =>
    (
      Object.create(UserPreferenceModule.prototype) as UserPreferenceModule
    ).migrateStorage();

  it("copies sync preferences into local and then sets the migration flag", async () => {
    await migrate();

    // reads the managed keys from sync...
    expect(syncGet).toHaveBeenCalledWith(
      expect.arrayContaining(["autoSubmit", "theme"]),
      expect.any(Function)
    );
    // ...writes the migrated prefs (plus the seeded empty voice map) to local...
    expect(localSet).toHaveBeenNthCalledWith(
      1,
      { autoSubmit: false, theme: "dark", voicePreferences: {} },
      expect.any(Function)
    );
    // ...then marks migration complete.
    expect(localSet).toHaveBeenNthCalledWith(
      2,
      { [MIGRATION_FLAG]: true },
      expect.any(Function)
    );
  });

  it("does nothing when the migration flag is already set", async () => {
    localGet.mockImplementation((_keys, cb) => cb({ [MIGRATION_FLAG]: true }));

    await migrate();

    expect(syncGet).not.toHaveBeenCalled();
    expect(localSet).not.toHaveBeenCalled();
  });
});
