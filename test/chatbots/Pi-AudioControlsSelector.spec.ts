import { describe, it, expect, beforeEach } from "vitest";
import { PiAIChatbot } from "../../src/chatbots/Pi";

/**
 * Contract test for Pi.ai's audio-output (voice on/off) button selector.
 *
 * Pi redesigned its audio controls: the voice on/off and voice-menu buttons
 * moved inside an `inline-flex` wrapper, and the row container lost
 * `items-center` (it now uses `z-10`). The old selector
 *   `.saypi-audio-controls > div > div.relative.flex.items-center.justify-end.self-end > button`
 * no longer matches, so SayPi never assigns `id="saypi-audio-output-button"`,
 * which breaks AudioControlsModule.activateAudioOutput()/isAudioOutputEnabled()
 * and SubmitErrorHandler (SayPi can't toggle Pi's voice during hands-free calls).
 *
 * Fixture captured live from pi.ai/talk on 2026-06-14.
 */
function buildPiAudioControls(): void {
  document.body.innerHTML = `
    <div class="undefined order-2 w-auto saypi-audio-controls">
      <div class="relative flex flex-col-reverse">
        <div class="relative z-10 flex justify-end self-end">
          <div class="inline-flex h-9 min-h-9 items-stretch overflow-hidden rounded-[100px] bg-fill-default">
            <button aria-label="Turn voice off" class="flex items-center justify-center">on/off</button>
            <span class="flex shrink-0 items-center justify-center self-stretch"></span>
            <button aria-label="Toggle voice menu" class="flex items-center justify-center">menu</button>
          </div>
        </div>
      </div>
      <div id="saypi-voice-menu"></div>
    </div>`;
}

describe("Pi getAudioOutputButtonSelector", () => {
  let chatbot: PiAIChatbot;

  beforeEach(() => {
    document.body.innerHTML = "";
    chatbot = new PiAIChatbot();
    buildPiAudioControls();
  });

  it("matches the voice on/off button in Pi's current audio-controls structure", () => {
    const selector = chatbot.getAudioOutputButtonSelector();
    const matched = document.querySelector(selector);

    expect(matched).not.toBeNull();
    // The audio-output button is the first (voice on/off) button, not the voice-menu toggle.
    expect(matched?.getAttribute("aria-label")).toBe("Turn voice off");
  });
});
