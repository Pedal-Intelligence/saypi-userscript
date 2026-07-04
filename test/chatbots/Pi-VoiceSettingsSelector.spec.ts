import { describe, expect, it } from "vitest";
import { JSDOM } from "jsdom";
import { PiAIChatbot } from "../../src/chatbots/Pi";

/**
 * Pi Voice settings selector (pi.ai/profile/settings) — re-anchored 2026-07-04
 * (Layer-4 CDP capture). Pi redesigned the page: the content column drifted
 * `mx-auto w-full px-6 py-10` → `mx-auto w-full max-w-2xl flex-1 px-6 py-3 pt-20`
 * and the card grid `grid grid-cols-2 gap-4` → `grid grid-cols-1 gap-4
 * sm:grid-cols-2`, so the old class-literal matched 0 and PiVoiceSettings never
 * decorated (the "More voices" door never appeared — #491 sibling). Class
 * strings below are verbatim from the live DOM.
 */

// The live settings page: content column > card grid of 8 <button> voice cards.
const settingsHTML = `
  <div class="flex h-full flex-col">
    <div class="mx-auto w-full max-w-2xl flex-1 px-6 py-3 pt-20">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        ${Array.from({ length: 8 }, (_, i) => `
          <button class="inline-flex items-center h-[56px] w-full rounded-[10px] border border-divider-stroke px-[24px] py-0 bg-secondary-default text-text-secondary">
            <span class="text-action-m relative min-w-0 flex-1 truncate text-left">Pi ${i + 1}</span>
          </button>`).join("")}
      </div>
    </div>
  </div>`;

// A chat/talk-page-ish DOM: audio controls, NO settings grid.
const talkHTML = `
  <div class="order-2 w-auto saypi-audio-controls">
    <div class="relative flex flex-col-reverse">
      <div class="inline-flex rounded-[100px] bg-fill-default">
        <button aria-label="Turn voice off"></button>
        <button aria-label="Toggle voice menu"></button>
      </div>
    </div>
  </div>`;

// A WIDER surface (e.g. /discover) that also renders a responsive card grid —
// the every-batch body scan visits it too, so the selector must NOT match it.
const widerGridHTML = `
  <div class="mx-auto w-full max-w-4xl px-6 py-6">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <button><span>Topic A</span></button>
      <button><span>Topic B</span></button>
    </div>
  </div>`;

describe("Pi Voice settings selector (#491 sibling — settings-page redesign)", () => {
  const chatbot = new PiAIChatbot();
  const q = (html: string, sel: string) =>
    new JSDOM(html).window.document.querySelectorAll(sel);

  it("the shipped-broken literal matches 0 on the live settings grid (documents the bug)", () => {
    const old = "div.mx-auto.w-full.px-6.py-10 > div.grid.grid-cols-2.gap-4";
    expect(q(settingsHTML, old).length).toBe(0);
  });

  it("the new selector matches the settings card grid exactly once", () => {
    const matches = q(settingsHTML, chatbot.getVoiceSettingsSelector());
    expect(matches.length).toBe(1);
    expect((matches[0] as HTMLElement).classList.contains("grid")).toBe(true);
    // It's the card grid — its children are the voice cards.
    expect((matches[0] as HTMLElement).querySelectorAll("button").length).toBe(8);
  });

  it("does NOT match a chat/talk-page DOM (no spurious decoration — the body scan visits every chatable page)", () => {
    expect(q(talkHTML, chatbot.getVoiceSettingsSelector()).length).toBe(0);
  });

  it("does NOT match a wider (max-w-4xl) card grid like /discover — max-w-2xl scopes it to the settings column", () => {
    expect(q(widerGridHTML, chatbot.getVoiceSettingsSelector()).length).toBe(0);
  });
});
