import type { AudioOutputToggle } from "../AudioOutputToggle";

/**
 * Pi's in-chat audio control, as of the 2026-07-30 redesign.
 *
 * Pi retired its in-chat voice menu and replaced the whole surface with a
 * "Chat options" kebab holding a single auto-read checkbox. The kebab is always
 * present; the popover — and therefore the checkbox — is mounted on open and
 * torn down on close, so unlike Claude and ChatGPT there is nothing here that
 * `bootstrap` can find-and-decorate once and click later. That is why Pi
 * implements {@link AudioOutputToggle} instead of returning a usable
 * `getAudioOutputButtonSelector()`.
 *
 * Deliberately a standalone leaf module rather than methods on `PiAIChatbot`:
 * `AudioControlsModule` is the consumer, and it sits deep inside the TTS graph
 * (`MessageElements → SpeechSynthesisModule → AudioControlsModule`). Reaching
 * the chatbot registry from there closes a real import cycle back through
 * `ClaudeResponse`. This module depends on nothing but the DOM.
 */
const CHAT_OPTIONS_BUTTON = 'button[aria-label="Chat options"]';
const AUTO_READ_ITEM = '[data-testid="chat-options-auto-read"]';
/**
 * Pi mirrors the auto-read setting here. Treated as an OPTIMISATION only — it
 * answers "is it already on?" without opening host UI. It is never trusted as
 * the basis for a write; see `setAudioOutputEnabled`.
 */
const AUTO_READ_MIRROR_KEY = "isVoiceEnabled";
/** How long to wait for Pi's React to mount the popover after opening it. */
const POPOVER_MOUNT_TIMEOUT_MS = 2000;
const POPOVER_POLL_INTERVAL_MS = 25;

async function waitForAutoReadItem(): Promise<HTMLElement | null> {
  const attempts = POPOVER_MOUNT_TIMEOUT_MS / POPOVER_POLL_INTERVAL_MS;
  for (let attempt = 0; attempt <= attempts; attempt++) {
    const item = document.querySelector<HTMLElement>(AUTO_READ_ITEM);
    if (item) return item;
    await new Promise((resolve) =>
      setTimeout(resolve, POPOVER_POLL_INTERVAL_MS)
    );
  }
  console.warn(
    "Pi's auto-read control did not appear after opening Chat options; leaving audio output untouched."
  );
  return null;
}

export const piAutoRead: AudioOutputToggle = {
  /**
   * Read Pi's auto-read state without touching its UI.
   *
   * Prefers the live checkbox's `aria-checked` when the popover happens to be
   * open — note the LABEL is not a usable signal, since it reads "Turn off
   * auto-read" when on but "Auto-read" when off. Falls back to Pi's own
   * localStorage mirror otherwise, because opening the menu to answer a
   * question would be a visible side effect on a read.
   */
  isAudioOutputEnabled(): boolean {
    const item = document.querySelector(AUTO_READ_ITEM);
    if (item) {
      return item.getAttribute("aria-checked") === "true";
    }
    try {
      return localStorage.getItem(AUTO_READ_MIRROR_KEY) === "true";
    } catch {
      // Storage can be unavailable (blocked cookies, partitioned contexts).
      // Reporting "off" is the safe answer: it costs at most one popover open,
      // and the read-before-write below prevents a wrong toggle.
      return false;
    }
  },

  /**
   * Drive Pi's auto-read toggle, which now lives behind the "Chat options"
   * kebab.
   *
   * Re-reading `aria-checked` once the popover has mounted is what makes the
   * localStorage fallback safe to be wrong: a stale mirror can then only cost
   * one unnecessary popover open — it can never flip auto-read the wrong way.
   * Without that re-read this would happily turn a user's auto-read OFF on the
   * strength of a stale cached value.
   *
   * Never rejects: callers are fire-and-forget, and a drifted host surface
   * should degrade to "we couldn't", not to an unhandled rejection.
   */
  async setAudioOutputEnabled(enabled: boolean): Promise<void> {
    if (this.isAudioOutputEnabled() === enabled) return;

    const kebab = document.querySelector<HTMLElement>(CHAT_OPTIONS_BUTTON);
    if (!kebab) return;

    // If the user already had the menu open, it is theirs — drive it, but leave
    // it exactly as we found it.
    const openedByUs = !document.querySelector(AUTO_READ_ITEM);
    if (openedByUs) kebab.click();

    try {
      const item = await waitForAutoReadItem();
      if (!item) return;
      if ((item.getAttribute("aria-checked") === "true") !== enabled) {
        item.click(); // Pi leaves the popover open after this
      }
    } finally {
      if (openedByUs && document.querySelector(AUTO_READ_ITEM)) {
        kebab.click();
      }
    }
  },
};
