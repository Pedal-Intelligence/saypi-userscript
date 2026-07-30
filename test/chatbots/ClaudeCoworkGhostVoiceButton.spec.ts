// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Cowork-mode composer contract (#580).
 *
 * Recorded live on claude.ai/new, 2026-07-30. The composer controls row
 * (decorated by SayPi as #saypi-prompt-controls-container / .saypi-audio-controls)
 * holds, in order: [attach + Chat/Cowork toggle] [grow spacer] [model selector]
 * [SayPi voice selector] [dictation cluster] [native voice-mode wrapper]
 * [SayPi call button].
 *
 * In COWORK mode Claude hides its "Use voice mode" button without releasing its
 * space: the wrapper stays in the row as an invisible placeholder (`opacity-0`,
 * still reserving `@[460px]:w-8`), and Claude slides its own neighbours — the
 * model selector and the dictation cluster — 40px right over that space with the
 * container-query utility `@[460px]:translate-x-10`. The slide is paint-only
 * (translate does not affect flex layout), so anything of SayPi's interleaved
 * between those natives gets painted over: the translated model selector landed
 * on top of the SayPi voice selector.
 *
 * claude.scss absorbs this by collapsing the placeholder and cancelling the
 * slide whenever the placeholder is present (`:has(> .opacity-0)` guard), so
 * plain flex layout spaces every control in both modes. These tests pin the two
 * DOM discriminators that CSS keys off, in both recorded states.
 */

const MODEL_SELECTOR_BASE =
  "flex items-center gap-2 transition-[opacity,transform,translate,margin-right] duration-snap ease-out min-w-[5rem] @max-[340px]:min-w-9 translate-x-0";
const MIC_CLUSTER_BASE =
  "shrink-0 transition-transform duration-snap ease-out motion-reduce:transition-none translate-x-0";
const VOICE_WRAPPER_BASE =
  "shrink-0 flex items-center transition-[opacity,width,margin-left] duration-snap ease-out z-10 justify-end";
const SLIDE_CLASS = "@[460px]:translate-x-10";

function buildControlsRow(mode: "chat" | "cowork"): HTMLElement {
  const cowork = mode === "cowork";
  const modelSelectorClasses = cowork
    ? `${MODEL_SELECTOR_BASE} ${SLIDE_CLASS}`
    : MODEL_SELECTOR_BASE;
  const micClusterClasses = cowork
    ? `${MIC_CLUSTER_BASE} ${SLIDE_CLASS}`
    : MIC_CLUSTER_BASE;
  const voiceWrapperClasses = cowork
    ? `${VOICE_WRAPPER_BASE} w-0 -ml-2 @[460px]:w-8 @[460px]:ml-0 opacity-0`
    : `${VOICE_WRAPPER_BASE} w-8`;

  document.body.innerHTML = `
    <div class="relative flex items-center w-full gap-2 @container saypi-audio-controls"
         id="saypi-prompt-controls-container">
      <div class="relative shrink-0 flex items-center gap-1">
        <button aria-label="Add files, connectors, and more" type="button"></button>
        <div role="radiogroup" aria-label="Surface"></div>
      </div>
      <div class="grow"></div>
      <div class="${modelSelectorClasses}">
        <button aria-label="Model: Opus 5 Low" type="button"></button>
      </div>
      <div id="claude-voice-selector">
        <button aria-haspopup="true" type="button">Shimmer</button>
      </div>
      <div class="${micClusterClasses}">
        <button aria-label="Press and hold to record" type="button"></button>
      </div>
      <div class="${voiceWrapperClasses}">
        <button aria-label="Use voice mode" type="button"></button>
      </div>
      <button id="saypi-callButton"
              class="call-button saypi-button tooltip rounded-full claude-call-button claude-mobile-call-button"
              type="button"></button>
    </div>`;
  return document.getElementById("saypi-prompt-controls-container") as HTMLElement;
}

describe("Claude Cowork-mode ghost voice-mode button (#580)", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("cowork: the collapse selector matches exactly the hidden voice-mode wrapper", () => {
    buildControlsRow("cowork");

    const matches = document.querySelectorAll(
      "#saypi-prompt-controls-container > .opacity-0"
    );
    expect(matches.length).toBe(1);
    // It is the native voice-mode button's wrapper, nothing of SayPi's.
    expect(
      matches[0].querySelector('button[aria-label="Use voice mode"]')
    ).not.toBeNull();
    expect(matches[0].id).toBe("");
  });

  it("cowork: the guard matches the row, and the slid natives carry the translate utility", () => {
    const row = buildControlsRow("cowork");

    expect(
      document.querySelector("#saypi-prompt-controls-container:has(> .opacity-0)")
    ).toBe(row);

    // The natives Claude slides over the placeholder's space — the model
    // selector (immediately before SayPi's voice selector) and the dictation
    // cluster — carry the paint-only slide our CSS cancels.
    const voiceSelector = document.getElementById("claude-voice-selector")!;
    const modelSelector = voiceSelector.previousElementSibling!;
    const micCluster = voiceSelector.nextElementSibling!;
    expect(modelSelector.classList.contains(SLIDE_CLASS)).toBe(true);
    expect(micCluster.classList.contains(SLIDE_CLASS)).toBe(true);
    // SayPi's interleaved controls do NOT get the slide — that asymmetry is the bug.
    expect(voiceSelector.classList.contains(SLIDE_CLASS)).toBe(false);
    const callButton = document.getElementById("saypi-callButton")!;
    expect(callButton.classList.contains(SLIDE_CLASS)).toBe(false);
  });

  it("chat: neither discriminator matches, so the fix is inert", () => {
    buildControlsRow("chat");

    expect(
      document.querySelector("#saypi-prompt-controls-container > .opacity-0")
    ).toBeNull();
    expect(
      document.querySelector("#saypi-prompt-controls-container:has(> .opacity-0)")
    ).toBeNull();
  });

  it("claude.scss collapses the placeholder and cancels the slide, guarded on the placeholder", () => {
    const raw = readFileSync(
      resolve(__dirname, "../../src/styles/claude.scss"),
      "utf8"
    );
    // Strip comments so we assert against actual rules, not prose.
    const scss = raw.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");

    // Collapse the invisible placeholder so it stops reserving 32px.
    expect(scss).toMatch(
      /#saypi-prompt-controls-container\s*>\s*\.opacity-0\s*\{[^}]*display:\s*none/
    );
    // Cancel the compensating slide — but only while the placeholder is present,
    // so Chat mode's layout (and its transitions) are untouched.
    expect(scss).toMatch(
      /#saypi-prompt-controls-container:has\(\s*>\s*\.opacity-0\s*\)\s*>\s*div\s*\{[^}]*translate:\s*none\s*!important/
    );
  });
});
