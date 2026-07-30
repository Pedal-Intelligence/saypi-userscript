import { piAutoRead } from "./pi/PiAutoRead";

/**
 * A host whose "read responses aloud" switch is a BEHAVIOUR rather than a
 * decoratable element.
 *
 * `Chatbot.getAudioOutputButtonSelector()` encodes three assumptions: the
 * control is always in the DOM, a click toggles it, and its state can be read
 * off the rendered icon. Claude and ChatGPT still satisfy all three. Pi stopped
 * satisfying any of them when it retired its in-chat voice menu (2026-07-30) in
 * favour of a "Chat options" kebab whose popover — and therefore whose auto-read
 * checkbox — exists only while the menu is open.
 *
 * Rather than stretch the selector contract to cover a host it no longer
 * describes, such hosts supply one of these instead.
 */
export interface AudioOutputToggle {
  /**
   * Whether the host is currently set to speak its responses. MUST NOT have a
   * visible side effect — it is called on paths (e.g. call start) where opening
   * host UI to answer would be wrong.
   */
  isAudioOutputEnabled(): boolean;

  /**
   * Drive the host to `enabled`. Resolves once the host has been driven, or
   * once the attempt has been abandoned — a host surface that has drifted must
   * degrade quietly rather than reject, since callers are fire-and-forget.
   */
  setAudioOutputEnabled(enabled: boolean): Promise<void>;
}

/**
 * Resolve the toggle for a host, or null when the host's audio control is an
 * ordinary decoratable button (Claude, ChatGPT) and the selector path applies.
 *
 * Keyed on the chatbot ID rather than accepting a `Chatbot`, deliberately: the
 * consumer is `AudioControlsModule`, which lives deep inside the TTS graph
 * (`MessageElements → SpeechSynthesisModule → AudioControlsModule`). Taking a
 * `Chatbot` would mean reaching `ChatbotService` from there, which closes a
 * real import cycle back through `ClaudeResponse`. Every module reachable from
 * here is a DOM-only leaf.
 */
export function getAudioOutputToggle(
  chatbotId: string | null | undefined
): AudioOutputToggle | null {
  return chatbotId === "pi" ? piAutoRead : null;
}
