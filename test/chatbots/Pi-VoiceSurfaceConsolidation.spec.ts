import { describe, it, expect } from "vitest";
import { JSDOM } from "jsdom";
import { PiAIChatbot } from "../../src/chatbots/Pi";
import { getAudioOutputToggle } from "../../src/chatbots/AudioOutputToggle";
import type { Chatbot } from "../../src/chatbots/Chatbot";

/**
 * Contract test for Pi's adapter after the 2026-07-30 voice-surface
 * consolidation.
 *
 * Pi replaced its in-chat voice menu — a pill that expanded into a card listing
 * its eight voices — with a "Chat options" kebab whose popover holds exactly one
 * control: an auto-read toggle. Voice selection now lives only on
 * pi.ai/profile/settings.
 *
 * This spec pins the three adapter answers that changed, each of which is an
 * ABSENCE and therefore easy to "helpfully" reinstate later:
 *   1. no in-chat voice menu (both optional Chatbot members omitted),
 *   2. a blank audio-output-button selector (the control isn't decoratable),
 *   3. the audio-output behaviour supplied as an AudioOutputToggle instead.
 *
 * Fixture captured live from pi.ai/talk on 2026-07-30 (Claude-in-Chrome, logged
 * in), popover open.
 */
const liveAudioControlsHTML = `
  <audio></audio>
  <div class="order-2 w-auto saypi-audio-controls">
    <button aria-label="Chat options" type="button" class="inline-flex items-center justify-center size-10 rounded-[0.625rem] p-1.5">
      <span class="flex shrink-0 items-center justify-center [&>svg]:size-full size-5">
        <svg><circle/><circle/><circle/></svg>
      </span>
    </button>
    <div role="menu" aria-label="Chat options" class="flex flex-col rounded-10 border border-solid border-menu-stroke bg-menu-background p-2 w-40 gap-0.5 z-20">
      <div role="menuitemcheckbox" aria-selected="false" tabindex="0" aria-checked="true"
           data-testid="chat-options-auto-read"
           class="flex min-h-11 cursor-pointer items-center gap-2 rounded-[8px] p-2">
        <span class="flex size-5 shrink-0 items-center justify-center"><svg><path d="M11.1111 6.05556L15 9.94446"/></svg></span>
        <span class="text-body-s min-h-px min-w-0 flex-[1_0_0] truncate text-left">Turn off auto-read</span>
      </div>
    </div>
  </div>`;

describe("Pi adapter after the voice-surface consolidation (2026-07-30)", () => {
  const chatbot = new PiAIChatbot();
  const q = (html: string, sel: string) =>
    new JSDOM(html).window.document.querySelectorAll(sel);

  describe("the in-chat voice menu is gone", () => {
    it("declares neither optional voice-menu member", () => {
      // Their ABSENCE is the signal VoiceMenuUIManager reads to leave Pi's DOM
      // alone. Reinstating either one brings back the permanently-empty
      // <div id="saypi-voice-menu"> in Pi's header. Viewed through the Chatbot
      // interface, where both members are optional.
      const asChatbot: Chatbot = chatbot;
      expect(asChatbot.getVoiceMenuSelector).toBeUndefined();
      expect(asChatbot.getVoiceMenu).toBeUndefined();
    });

    it("Pi's live DOM no longer contains the surface the old selectors targeted", () => {
      // The retired heuristics: `div.t-action-m` (the menu container) and the
      // "Toggle voice menu" button the "More voices" door anchored on.
      expect(q(liveAudioControlsHTML, "div.t-action-m").length).toBe(0);
      expect(
        q(liveAudioControlsHTML, 'button[aria-label="Toggle voice menu"]').length
      ).toBe(0);
    });
  });

  describe("the audio-output control is no longer decoratable", () => {
    it("returns a blank selector, which bootstrap treats as 'this host has none'", () => {
      expect(chatbot.getAudioOutputButtonSelector().trim()).toBe("");
    });

    it("the shipped-broken literal matches 0 on the live DOM (documents the bug)", () => {
      const old =
        ".saypi-audio-controls > div > div.relative.flex.justify-end.self-end > div > button";
      expect(q(liveAudioControlsHTML, old).length).toBe(0);
    });

    it("supplies an AudioOutputToggle in its place", () => {
      expect(getAudioOutputToggle(chatbot.getID())).not.toBeNull();
    });
  });

  describe("the surfaces SayPi still depends on are intact", () => {
    it("still finds Pi's audio-controls container", () => {
      expect(
        q(liveAudioControlsHTML, chatbot.getAudioControlsSelector()).length
      ).toBe(1);
    });

    it("anchors the auto-read control on its stable test id, not its label", () => {
      // The label is not a usable state signal: it reads "Turn off auto-read"
      // when auto-read is ON and "Auto-read" when OFF.
      const item = new JSDOM(liveAudioControlsHTML).window.document.querySelector(
        '[data-testid="chat-options-auto-read"]'
      );
      expect(item).not.toBeNull();
      expect(item!.getAttribute("aria-checked")).toBe("true");
      expect(item!.textContent).toContain("Turn off auto-read");
    });
  });
});
