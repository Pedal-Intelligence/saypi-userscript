/**
 * The one-key slice of `chrome.storage.local` that the local-first stores in
 * this codebase need, behind an injectable interface.
 *
 * Promoted verbatim out of `VoicePins.ts` (which now re-exports it under its
 * old names) rather than copied a third time for the soundprint cache. Every
 * consumer wants exactly this: get one key, set one key, never throw when
 * `chrome` is absent — which is the case in unit tests, and in any page that
 * loads a module before the extension APIs exist.
 *
 * `local`, never `sync`, deliberately: `sync` has an 8 KB per-item cap and an
 * hourly write quota, and every store built on this (pins, prints, heard)
 * writes a growing map on ordinary interaction. `PreferenceModule.ts:54-67`
 * already migrated this repo away from `sync` for the same reason.
 */

export interface KeyValueStorage {
  get(key: string): Promise<unknown>;
  set(key: string, value: unknown): Promise<void>;
}

const hasLocalStorageArea = (): boolean =>
  typeof chrome !== "undefined" && !!chrome.storage && !!chrome.storage.local;

/** chrome.storage.local wrapper matching PreferenceModule's guarded idiom. */
export function defaultLocalStorage(): KeyValueStorage {
  return {
    get: (key) =>
      new Promise((resolve) => {
        if (!hasLocalStorageArea()) {
          resolve(undefined);
          return;
        }
        chrome.storage.local.get([key], (result) => {
          resolve(
            chrome.runtime && chrome.runtime.lastError ? undefined : result?.[key]
          );
        });
      }),
    set: (key, value) =>
      new Promise((resolve, reject) => {
        if (!hasLocalStorageArea()) {
          resolve();
          return;
        }
        chrome.storage.local.set({ [key]: value }, () => {
          const err = chrome.runtime && chrome.runtime.lastError;
          if (err) reject(err);
          else resolve();
        });
      }),
  };
}
