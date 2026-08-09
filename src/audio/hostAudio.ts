/**
 * Two decisions about the HOST's audio element, kept out of AudioModule.js so
 * they can be tested (that module's constructor drags in the whole content-script
 * bootstrap — the same reason `audioElementRemoval.ts` exists).
 *
 * Both exist to serve one rule: when a SayPi voice is selected for the active
 * host, SayPi is the text-to-speech provider — the host's own audio is silenced
 * and ours plays instead (#602).
 */

/**
 * The element to bind to after losing the tracked one.
 *
 * The old recovery was to re-arm an observer that only fires for NEWLY ADDED
 * subtrees. On a host that replaces its player rather than reusing it (pi.ai
 * does), the replacement is already in the document by the time we look, so
 * that observer waits forever and the binding is lost for the life of the page
 * — with it, every `loadstart` the output machine needs in order to skip the
 * host's voice.
 *
 * Prefers an element already carrying our id (we decorated it before), then any
 * other. Returns null when there is genuinely nothing yet, which is the only
 * case where waiting for an insertion is the right answer.
 */
export function findHostAudioElement(
  root: Document | Element | null | undefined,
  decoratedId: string
): HTMLAudioElement | null {
  if (!root) return null;
  // Matched by property rather than by an interpolated `#id` selector: the id
  // never needs escaping, and this can't throw on a hostile one.
  const elements = [...root.querySelectorAll<HTMLAudioElement>("audio")];
  return elements.find((el) => el.id === decoratedId) ?? elements[0] ?? null;
}

/**
 * Whether the host's element should be held muted right now.
 *
 * An invariant rather than a reaction: `skipCurrent` only fires when we catch a
 * `loadstart`, so a track the host started before we bound to it stays audible
 * for its whole length. Muting is also gentler than pausing — the host's player
 * keeps its own state, and its UI doesn't fight us over it.
 *
 * `playbackIsOffscreen` is the condition that makes this safe. Under the
 * offscreen document (Chrome/Edge) our speech never touches the page's element,
 * so muting it silences only the host. Where offscreen isn't available (Firefox,
 * Safari) SayPi plays through that same element, and muting it would mute US —
 * there, skip-on-loadstart remains the whole mechanism.
 */
export function shouldMuteHostAudio(state: {
  providerIsSayPi: boolean;
  playbackIsOffscreen: boolean;
}): boolean {
  return state.providerIsSayPi && state.playbackIsOffscreen;
}
