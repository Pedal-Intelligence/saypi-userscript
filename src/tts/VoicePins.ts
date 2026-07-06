import type { SpeechSynthesisVoiceRemote } from "./SpeechModel";

/**
 * Per-host voice pins (doc/plans/2026-07-05-voice-shortlist-pins-design.md).
 *
 * A "pin" marks a voice for the short in-app menu of a host. The server's
 * `featured` set is the DEFAULT pin set; this module stores only the user's
 * explicit deltas on top — an *overlay*, not a snapshot — so a user who has
 * curated their own shortlist still receives future server curation for the
 * voices they never touched. (An emptied shortlist is therefore not a permanent
 * block: a brand-new featured voice, absent from the user's `unpinned` list,
 * still surfaces. That is intentional.)
 *
 * Storage is host-generic and local-first: one chrome.storage.local key holds
 * `{ [hostId]: { pinned: string[]; unpinned: string[] } }`. A third host is a
 * config line at the call site, not a schema change here.
 *
 * The pure helpers below are the whole model; the async helpers only add a
 * (dependency-injected) storage layer on top, mirroring src/onboarding/voiceDefaults.ts.
 */

export const VOICE_PINS_KEY = "voicePins";

export interface HostPinOverlay {
  /** Voice ids the user pinned on top of the server defaults (non-defaults). */
  pinned: string[];
  /** Server-default voice ids the user removed. */
  unpinned: string[];
}

/** hostId → overlay. A host absent from the map is un-customized (default pins). */
export type VoicePinStore = Record<string, HostPinOverlay>;

/** The slice of chrome.storage.local this module needs (injectable for tests). */
export interface PinStorage {
  get(key: string): Promise<unknown>;
  set(key: string, value: unknown): Promise<void>;
}

// --- pure helpers ---------------------------------------------------------

function toStringArray(raw: unknown): string[] {
  return Array.isArray(raw)
    ? raw.filter((x): x is string => typeof x === "string")
    : [];
}

/** Coerce any stored value to a safe overlay — the storage boundary is untrusted. */
export function toOverlay(raw: unknown): HostPinOverlay {
  const obj = (raw && typeof raw === "object" ? raw : {}) as Record<
    string,
    unknown
  >;
  return { pinned: toStringArray(obj.pinned), unpinned: toStringArray(obj.unpinned) };
}

/** An overlay carrying no deltas is equivalent to un-customized (default pins). */
export function isHostOverlayEmpty(overlay: HostPinOverlay | null): boolean {
  return !overlay || (overlay.pinned.length === 0 && overlay.unpinned.length === 0);
}

/** The host's overlay, or null when the host was never customized. */
export function getHostOverlay(
  store: VoicePinStore,
  hostId: string
): HostPinOverlay | null {
  const raw = (store as Record<string, unknown>)[hostId];
  return raw === undefined ? null : toOverlay(raw);
}

/** The ids the server marks `featured` (its default pin set), in catalog order. */
export function serverFeaturedIds(
  voices: Array<Pick<SpeechSynthesisVoiceRemote, "id" | "featured">>
): string[] {
  return voices.filter((v) => v.featured).map((v) => v.id);
}

/**
 * The resolved pinned set = server defaults, minus the user's removals, plus
 * the user's additions. A null overlay is the identity (just the defaults), so
 * this doubles as "what would be pinned for an un-customized host".
 */
export function resolvePinnedIds(
  featuredIds: Iterable<string>,
  overlay: HostPinOverlay | null
): Set<string> {
  const resolved = new Set<string>(featuredIds);
  if (overlay) {
    for (const id of overlay.unpinned) resolved.delete(id);
    for (const id of overlay.pinned) resolved.add(id);
  }
  return resolved;
}

/**
 * Apply a pin/unpin to an overlay, keeping it minimal: `pinned` only ever holds
 * non-default additions, `unpinned` only ever holds default removals, so an
 * overlay that has drifted back to the defaults normalizes to empty (and the
 * storage layer then drops the host key).
 */
export function togglePin(
  overlay: HostPinOverlay | null,
  voiceId: string,
  featuredIds: Iterable<string>,
  pin: boolean
): HostPinOverlay {
  const isDefault = new Set(featuredIds).has(voiceId);
  const base = toOverlay(overlay);
  const pinned = new Set(base.pinned);
  const unpinned = new Set(base.unpinned);

  if (pin) {
    unpinned.delete(voiceId);
    // A default is already pinned, so it needs no addition entry.
    if (isDefault) pinned.delete(voiceId);
    else pinned.add(voiceId);
  } else {
    pinned.delete(voiceId);
    // Only a default needs a removal entry; a non-default just leaves `pinned`.
    if (isDefault) unpinned.add(voiceId);
    else unpinned.delete(voiceId);
  }
  return { pinned: [...pinned], unpinned: [...unpinned] };
}

// --- storage-backed helpers (dependency-injected) -------------------------

/** chrome.storage.local wrapper matching PreferenceModule's guarded idiom. */
export function defaultPinStorage(): PinStorage {
  return {
    get: (key) =>
      new Promise((resolve) => {
        if (typeof chrome === "undefined" || !chrome.storage || !chrome.storage.local) {
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
        if (typeof chrome === "undefined" || !chrome.storage || !chrome.storage.local) {
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

async function loadStore(storage: PinStorage): Promise<VoicePinStore> {
  const raw = await storage.get(VOICE_PINS_KEY);
  return raw && typeof raw === "object" ? (raw as VoicePinStore) : {};
}

/** The host's overlay from storage, or null when the host was never customized. */
export async function loadHostOverlay(
  hostId: string,
  storage: PinStorage = defaultPinStorage()
): Promise<HostPinOverlay | null> {
  return getHostOverlay(await loadStore(storage), hostId);
}

/**
 * Persist a pin/unpin for one voice on one host. When the resulting overlay is
 * empty (the user reverted to the defaults) the host key is dropped, so an
 * un-customized host and a reverted-to-default host are indistinguishable —
 * both fall back to the server-featured default path.
 */
export async function setVoicePinned(
  hostId: string,
  voiceId: string,
  featuredIds: Iterable<string>,
  pin: boolean,
  storage: PinStorage = defaultPinStorage()
): Promise<void> {
  const store = await loadStore(storage);
  const next = togglePin(getHostOverlay(store, hostId), voiceId, featuredIds, pin);
  const updated: VoicePinStore = { ...store };
  if (isHostOverlayEmpty(next)) delete updated[hostId];
  else updated[hostId] = next;
  await storage.set(VOICE_PINS_KEY, updated);
}

/**
 * The in-host menu's entry point: the resolved pinned ids for a host, or null
 * when the user has NOT customized that host. Null is meaningful — the menu
 * then keeps its default (server-featured, fill-to-cap) path untouched; only a
 * real overlay switches the menu to pin-defined membership.
 */
export async function resolvePinnedIdsForHost(
  hostId: string,
  voices: Array<Pick<SpeechSynthesisVoiceRemote, "id" | "featured">>,
  storage: PinStorage = defaultPinStorage()
): Promise<Set<string> | null> {
  const overlay = await loadHostOverlay(hostId, storage);
  if (!overlay) return null;
  return resolvePinnedIds(serverFeaturedIds(voices), overlay);
}
