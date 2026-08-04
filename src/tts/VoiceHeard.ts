import {
  defaultLocalStorage,
  type KeyValueStorage,
} from "../storage/localKeyStorage";

/**
 * What this browser profile has already listened to
 * (doc/plans/2026-07-31-voices-audition-room-design.md §8).
 *
 * A sibling of `VoicePins.ts` in DISCIPLINE — one exported key constant, pure
 * helpers separated from the async layer, coercion at the untrusted storage
 * boundary, an injectable `KeyValueStorage` — and deliberately NOT in shape.
 *
 * Heard is a flat, additive `voiceId → epoch ms` map, and GLOBAL rather than
 * per-host. The asymmetry with pins is principled: a PIN is about a host's
 * in-chat menu — a host-owned, capped resource — so per-host is the only
 * honest scope for it, and its two-sided `{pinned, unpinned}` overlay exists
 * only because the *server* owns a `featured` default set the user is editing.
 * The server has no opinion about what you have listened to, a voice is
 * literally the same `sample_url` file on both hosts, and there is nothing to
 * un-hear — so an `unpinned[]` counterpart here would be cargo cult.
 *
 * `chrome.storage.local`, NEVER `sync`: `sync` has an 8 KB per-item cap, which
 * a 400-entry map would silently blow, and an hourly write quota precisely
 * designed to throttle a write-per-audition stream like this one.
 *
 * Two things this file deliberately does not have:
 *  - **Play counts.** They answer no question the page asks, and they turn
 *    every replay into a write. The timestamp is kept because it buys
 *    cap-and-evict (retired voices would otherwise leave tombstones forever)
 *    and leaves a future recency policy as a constant rather than a migration.
 *  - **A version field.** `VoicePins` has none either; a value-shape change is
 *    detectable in `toHeardStore`, which is where a migration would live.
 *
 * And one thing it must never grow: **pruning against the live catalog.** It
 * looks like the obvious cleanup and it is a data-loss trap — the studio's
 * `fetchHost` catches a failed catalog request into an EMPTY catalog, so one
 * bad network moment would wipe the map. Cap-and-evict is catalog-independent
 * and cannot do that.
 *
 * Survives sign-out and needs no code to: `JwtManager.clear()` removes exactly
 * four named keys, and this is not one of them. Stated openly, that makes
 * heard per-browser-profile rather than per-account — on a shared profile,
 * account B sees account A's marks. Non-sensitive, and consistent with the
 * existing `voicesCache` behaviour (#456).
 */

export const VOICE_HEARD_KEY = "voiceHeard";

/** voiceId → epoch ms of the last qualifying play. Absence means unheard. */
export type VoiceHeardStore = Record<string, number>;

/**
 * How many voices the map remembers. Well past any real catalog (22 today),
 * so it is a runaway guard rather than a policy: reaching it at all would mean
 * the catalog has been replaced several times over, and the oldest marks are
 * then the ones least likely to describe a voice that still exists.
 */
export const HEARD_CAP = 400;

// --- pure helpers ---------------------------------------------------------

/**
 * The cap, enforced wherever a store is constructed — oldest evicted first.
 *
 * `keep` is never evicted. Without it, marking a voice on an already-full map
 * whose timestamps all collide could drop the very entry it was asked to add,
 * and "I just listened to that" is the one fact this file exists to hold.
 */
function capped(store: VoiceHeardStore, keep: string | null): VoiceHeardStore {
  const ids = Object.keys(store);
  const excess = ids.length - HEARD_CAP;
  if (excess <= 0) return store;
  const doomed = new Set(
    ids
      .filter((id) => id !== keep)
      .sort((a, b) => store[a] - store[b])
      .slice(0, excess)
  );
  const next: VoiceHeardStore = {};
  for (const id of ids) if (!doomed.has(id)) next[id] = store[id];
  return next;
}

/**
 * Coerce any stored value to a safe map — the storage boundary is untrusted.
 *
 * Anything that is not a finite, non-negative number is dropped rather than
 * repaired: a garbage timestamp would sort wrongly in `capped()`, and a voice
 * whose mark we cannot trust is better treated as unheard than as heard at an
 * unknowable time. `Object.fromEntries` defines own data properties, so a
 * hostile `__proto__` key lands as data rather than reaching the prototype.
 */
export function toHeardStore(raw: unknown): VoiceHeardStore {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const entries = Object.entries(raw as Record<string, unknown>).filter(
    (entry): entry is [string, number] =>
      typeof entry[1] === "number" && Number.isFinite(entry[1]) && entry[1] >= 0
  );
  return capped(Object.fromEntries(entries), null);
}

/** Has this voice ever played long enough to count? Absence means no. */
export function isHeard(store: VoiceHeardStore, voiceId: string): boolean {
  return typeof (store as Record<string, unknown>)[voiceId] === "number";
}

/**
 * Record a qualifying play. Additive and idempotent-in-effect: a replay only
 * refreshes the timestamp, which nothing on screen reads.
 *
 * Returns a new map — the caller's copy is never mutated, so an in-memory
 * store and a persisted one can be updated from the same helper without one
 * silently aliasing the other.
 */
export function markHeardAt(
  store: VoiceHeardStore,
  voiceId: string,
  now: number
): VoiceHeardStore {
  if (!voiceId) return toHeardStore(store);
  const at = Number.isFinite(now) && now > 0 ? now : 0;
  return capped({ ...toHeardStore(store), [voiceId]: at }, voiceId);
}

// --- storage-backed helpers (dependency-injected) -------------------------

/** The whole map, coerced. A missing key and an unreadable one are both `{}`. */
export async function loadHeardStore(
  storage: KeyValueStorage = defaultLocalStorage()
): Promise<VoiceHeardStore> {
  try {
    return toHeardStore(await storage.get(VOICE_HEARD_KEY));
  } catch {
    return {};
  }
}

/**
 * Persist one qualifying play. **Failures are swallowed** — no revert, no
 * `console.error`.
 *
 * Deliberately the inverse of `setVoicePinned`'s caller, which correctly
 * reverts its optimistic flip: a pin is a promise about another surface, so a
 * pin that did not persist is a lie the user will meet again in the host's
 * menu. A heard mark asserts only that the user's ears were in the room, which
 * is true whether or not the write landed, and a lost mark costs them one
 * faint print. Re-inking a row they demonstrably heard would be the worse bug.
 */
export async function recordVoiceHeard(
  voiceId: string,
  now: number = Date.now(),
  storage: KeyValueStorage = defaultLocalStorage()
): Promise<void> {
  try {
    const store = toHeardStore(await storage.get(VOICE_HEARD_KEY));
    await storage.set(VOICE_HEARD_KEY, markHeardAt(store, voiceId, now));
  } catch {
    // See the doc comment: a lost mark is a non-event.
  }
}
