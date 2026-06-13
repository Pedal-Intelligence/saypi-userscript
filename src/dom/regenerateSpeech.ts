import { SpeechSynthesisModule } from "../tts/SpeechSynthesisModule";
import { SpeechUtterance } from "../tts/SpeechModel";

/**
 * Shared click handler for the "regenerate speech" button on assistant messages.
 *
 * Disables the button, obtains a fresh utterance for `text`, and hands it to
 * `onUtterance` for message-specific decoration (speak, charge, history, button
 * removal). If speech cannot be generated — most commonly because no voice is
 * selected (voice off / signed out), but also on transient synthesis or network
 * errors — the button is re-enabled so the user can retry, and the failure is
 * logged rather than surfaced as an unhandled promise rejection that would leave
 * the button stuck disabled. (#241/#268)
 *
 * The auto-TTS path already degrades to a silent placeholder (see
 * SpeechSynthesisModule.createSpeechStream); this brings the explicit,
 * user-triggered regenerate path to parity.
 */
export async function regenerateSpeech(
  regenButton: HTMLButtonElement,
  text: string,
  onUtterance: (utterance: SpeechUtterance) => void | Promise<void>
): Promise<void> {
  regenButton.disabled = true;

  let utterance: SpeechUtterance;
  try {
    utterance = await SpeechSynthesisModule.getInstance().createSpeech(
      text,
      false
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message === "No voice selected") {
      // Expected when voice is off or the user is signed out — not an error.
      console.debug("[SayPi] Speech regeneration skipped: no voice selected");
    } else {
      console.warn("[SayPi] Speech could not be generated:", error);
    }
    // Re-enable so the user can retry instead of leaving the button stuck disabled.
    regenButton.disabled = false;
    return;
  }

  // Speech generated; run the caller's decoration. If that fails, recover the
  // button too — but label it distinctly so a post-generation bug isn't reported
  // as a generation failure.
  try {
    await onUtterance(utterance);
  } catch (error) {
    console.warn("[SayPi] Speech regenerated but post-processing failed:", error);
    regenButton.disabled = false;
  }
}
