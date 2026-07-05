/**
 * New-install voice defaulting (2026-07-05 shortlist redesign;
 * doc/plans/2026-07-05-voice-shortlist-pins-design.md).
 *
 * On a FRESH install only, each chat host is marked "pending" a default voice.
 * The first time the user's voice is resolved for a pending host — once signed
 * in, so the catalog is available — the server-`recommended` voice is adopted,
 * persisted, and the host is drained from the pending set. Any explicit voice
 * choice OR "Voice off" also drains the host, so a deliberate off is never
 * re-defaulted.
 *
 * Existing users (extension UPDATE, not install) never get the pending marker,
 * so their voice — including a deliberate "Voice off", which is stored
 * identically to "never chose" — is never touched (grandfathering / no silent
 * swap). Reversible: reverting this code simply stops seeding future installs;
 * already-adopted users keep a normal, user-changeable voice preference.
 *
 * The default itself is server-driven (the `recommended` manifest field), so it
 * is inert until the server nominates one — the additive-optional contract.
 *
 * Logic is dependency-injected (like firstRun.ts) so it unit-tests without a
 * real `browser`/storage; PreferenceModule + the background worker wire it up.
 */
import { isFreshInstall } from "./firstRun";

/** chrome.storage.local key holding the host ids still awaiting a default. */
export const VOICE_DEFAULT_PENDING_KEY = "saypi_voice_default_pending_hosts";

/** Hosts that get an auto-adopted default voice on a fresh install. */
export const DEFAULTABLE_HOST_IDS = ["claude", "pi"] as const;

export interface VoiceDefaultStorage {
  get: (key: string) => Promise<unknown>;
  set: (key: string, value: unknown) => Promise<void>;
}

/** Normalise whatever is stored under the pending key to a string[]. */
export function toPendingHosts(raw: unknown): string[] {
  return Array.isArray(raw)
    ? raw.filter((h): h is string => typeof h === "string")
    : [];
}

/** Whether a host is still awaiting its first-install default voice. */
export function isDefaultPending(raw: unknown, hostId: string): boolean {
  return toPendingHosts(raw).includes(hostId);
}

/** The pending set with `hostId` removed (drained). */
export function withHostDrained(raw: unknown, hostId: string): string[] {
  return toPendingHosts(raw).filter((h) => h !== hostId);
}

/**
 * On a fresh install (never an update), mark every defaultable host pending.
 * Idempotent — a repeated install event won't clobber an in-progress set.
 * Swallows errors: a failure here must never break installation. Returns
 * whether the marker was written.
 */
export async function seedVoiceDefaultsOnFreshInstall(
  reason: string | undefined,
  storage: VoiceDefaultStorage
): Promise<boolean> {
  try {
    if (!isFreshInstall(reason)) return false;
    const existing = await storage.get(VOICE_DEFAULT_PENDING_KEY);
    if (existing !== undefined && existing !== null) return false;
    await storage.set(VOICE_DEFAULT_PENDING_KEY, [...DEFAULTABLE_HOST_IDS]);
    return true;
  } catch (e) {
    console.debug("[VoiceDefaults] Failed to seed pending defaults:", e);
    return false;
  }
}
