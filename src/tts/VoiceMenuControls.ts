/**
 * Positive, exhaustive classification of every interactive element SayPi's
 * voice menus may encounter. The old model classified by ABSENCE ("lacks
 * saypi-voice-button ⇒ built-in host voice"), which made every new element
 * guilty until proven innocent — a nested ▶ read as a host voice would unset
 * the user's voice on click (#483's blocker) and miscount Pi's native voices.
 * Here every kind is declared by a marker it CARRIES; `unknown` is inert:
 * SayPi code never selects, tears down, counts, or wires an unknown element.
 */
export type VoiceMenuControlKind =
  | "custom-voice"
  | "restored-voice"
  | "door"
  | "preview"
  | "host-voice"
  | "unknown";

/**
 * Stamped on a host-native voice button at the single adoption site
 * (GridVoiceSelector.adoptHostRow); doubles as the wired-exactly-once guard.
 */
export const HOST_VOICE_ATTR = "data-saypi-host-voice";

export function classifyControl(el: Element): VoiceMenuControlKind {
  // Preview first: a ▶ nested inside (or sharing markers with) a row must
  // never be read as the row itself.
  if (el.classList.contains("saypi-voice-preview")) return "preview";
  if (el.classList.contains("saypi-more-voices")) return "door";
  if (el.classList.contains("saypi-custom-voice")) return "custom-voice";
  if (el.classList.contains("saypi-restored-voice")) return "restored-voice";
  if (el.hasAttribute(HOST_VOICE_ATTR)) return "host-voice";
  return "unknown";
}

export function markAdopted(el: Element): void {
  el.setAttribute(HOST_VOICE_ATTR, "true");
}
