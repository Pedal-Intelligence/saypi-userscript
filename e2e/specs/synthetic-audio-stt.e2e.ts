import { test, expect } from "../fixtures/extension";
import { DEFAULT_TRANSCRIPT } from "../support/transcribe-response";
import {
  seedAutoSubmitFalse,
  openDecoratedPiPage,
  getTranscribeHits,
} from "../support/dictation";
import { hasOffscreenDocument } from "../support/lifecycle";

/**
 * Proves the IN-EXTENSION synthetic audio source drives the full voice-input
 * pipeline — the autonomy upgrade that lets the Layer-4 loop run a voice turn with
 * no human at the mic, and the foundation for the Layer 3.5 real-host loop.
 *
 *   page event saypi:dev-feed-speech  ->  content bridge  ->  SW  ->  arms the
 *     offscreen VAD_USE_SYNTHETIC_AUDIO latch (clipUrl = bundled WAV)
 *       ->  click call  ->  initializeVAD builds a MediaStream from the WAV via
 *         AudioContext.decodeAudioData (the real-browser path unit tests can't run)
 *           ->  MicVAD.new({ stream })  ->  Silero-v5  ->  onSpeechEnd
 *             ->  SW POSTs the mock /transcribe  ->  DEFAULT_TRANSCRIPT in #saypi-prompt
 *
 * This isolates the synthetic path: arming sets mergedOptions.stream, so vad-web
 * uses the provided stream and ignores getUserMedia entirely — the launch-flag
 * fake mic is bypassed. If createSyntheticSpeechStream were broken, VAD init would
 * fail and no transcript would ever appear.
 */
test("in-extension synthetic audio -> VAD -> mock STT -> transcript in prompt", async ({
  context,
  serviceWorker,
}) => {
  await seedAutoSubmitFalse(serviceWorker);

  const page = await openDecoratedPiPage(context);

  // Arm the synthetic source via the page bridge (the exact path the Layer-4 MCP
  // loop uses): main-world CustomEvent -> content script -> SW -> offscreen latch.
  // One-shot (loop:false, the default) — a single utterance + trailing silence so
  // the VAD sees end-of-speech and STT submits; loop:true never fires end-of-speech
  // (#349). Omitting the detail entirely would also default to one-shot.
  await page.evaluate(() => {
    window.dispatchEvent(
      new CustomEvent("saypi:dev-feed-speech", { detail: { loop: false } }),
    );
  });

  // Arming creates the offscreen document as a side effect; wait for it so the
  // latch is set before the call starts the VAD (which then reads it).
  await expect
    .poll(() => hasOffscreenDocument(serviceWorker), {
      timeout: 10_000,
      message: "offscreen document was never created — feed-speech bridge did not reach the SW",
    })
    .toBe(true);

  // Start the call: VAD initializes, reads the armed latch, and is fed the
  // synthetic stream instead of the (launch-flag) microphone.
  await page.click("#saypi-callButton");

  // The synthetic clip drives Silero-v5 -> onSpeechEnd -> SW POSTs /transcribe.
  await expect
    .poll(() => getTranscribeHits(serviceWorker), {
      timeout: 30_000,
      message: "mock /transcribe was never hit — synthetic audio did not drive the VAD",
    })
    .toBeGreaterThan(0);

  // autoSubmit=false => the merged transcript is drafted into the prompt.
  await page.waitForFunction(
    (expected) =>
      (document.getElementById("saypi-prompt") as HTMLTextAreaElement | null)?.value?.includes(
        expected,
      ) ?? false,
    DEFAULT_TRANSCRIPT,
    { timeout: 30_000 },
  );

  const value = await page.locator("#saypi-prompt").inputValue();
  expect(value).toContain(DEFAULT_TRANSCRIPT);
});
