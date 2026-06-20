// @vitest-environment jsdom
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Claude.ts pulls in MessageElements + VoiceMenu transitively; stub them (mirrors
// ClaudeSidebarConfig.spec.ts) so we can import the placeholder decoration helper.
vi.mock("../../src/dom/MessageElements", () => {
  class AssistantResponse {}
  class MessageControls {}
  class UserMessage {}
  return { AssistantResponse, MessageControls, UserMessage };
});
vi.mock("../../src/tts/VoiceMenu", () => {
  class VoiceSelector {
    constructor() {}
    getId() { return "voice-selector"; }
    getButtonClasses() { return []; }
  }
  return { VoiceSelector, addSvgToButton: () => {} };
});

let findAndDecorateCustomPlaceholderElement: typeof import("../../src/chatbots/Claude").findAndDecorateCustomPlaceholderElement;

beforeAll(async () => {
  const module = await import("../../src/chatbots/Claude");
  findAndDecorateCustomPlaceholderElement = module.findAndDecorateCustomPlaceholderElement;
});

/**
 * Build the real Claude composer shape (verified live on claude.ai 2026-06-20):
 *   div.saypi-prompt-container               (a CLASS, never an id)
 *     └── #saypi-prompt (.tiptap .ProseMirror, contenteditable)
 *           └── p[data-placeholder] .is-empty .is-editor-empty
 *                 before:content-[attr(data-placeholder)] before:!text-text-500
 * SayPi clones that <p> into #claude-placeholder.custom-placeholder, inserted
 * `afterend` of #saypi-prompt (so the clone is #saypi-prompt's next sibling).
 */
function buildComposer(): HTMLElement {
  document.body.innerHTML = `
    <div class="saypi-prompt-container">
      <div id="saypi-prompt" contenteditable="true" class="tiptap ProseMirror">
        <p data-placeholder="How can I help you today?"
           class="is-empty is-editor-empty before:content-[attr(data-placeholder)] before:!text-text-500 before:whitespace-nowrap"><br></p>
      </div>
    </div>`;
  return document.getElementById("saypi-prompt") as HTMLElement;
}

describe("Claude composer placeholder suppression (#351)", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("inserts the custom-placeholder clone as the next sibling of #saypi-prompt", () => {
    const prompt = buildComposer();
    const obs = findAndDecorateCustomPlaceholderElement(prompt);

    expect(obs.found).toBe(true);
    const clone = document.getElementById("claude-placeholder")!;
    expect(clone).not.toBeNull();
    expect(clone.classList.contains("custom-placeholder")).toBe(true);
    // The adjacency the suppression CSS keys off: clone is the prompt's NEXT SIBLING,
    // sharing the prompt's parent (NOT a sibling of the container).
    expect(prompt.nextElementSibling).toBe(clone);
    expect(clone.parentElement).toBe(prompt.parentElement);
  });

  it("the corrected suppression selector targets the native placeholder; the old one cannot", () => {
    const prompt = buildComposer();
    findAndDecorateCustomPlaceholderElement(prompt);
    const native = prompt.querySelector("p[data-placeholder]")!;

    // FIXED selector (claude.scss): #saypi-prompt:has(+ .custom-placeholder) p[data-placeholder]
    expect(
      document.querySelector("#saypi-prompt:has(+ .custom-placeholder) p[data-placeholder]")
    ).toBe(native);

    // OLD selector failed two ways:
    // (1) #saypi-prompt-container is an *id* selector — only a CLASS is ever set.
    expect(
      document.querySelector(
        "#saypi-prompt-container:has(+ .custom-placeholder) #saypi-prompt p[data-placeholder]"
      )
    ).toBeNull();
    // (2) the clone is a sibling of #saypi-prompt, not of the container — so even by
    //     class the `+ .custom-placeholder` adjacency on the container never holds.
    expect(document.querySelector(".saypi-prompt-container:has(+ .custom-placeholder)")).toBeNull();
  });

  it("claude.scss suppresses the native placeholder via the correct adjacency + content override", () => {
    const raw = readFileSync(resolve(__dirname, "../../src/styles/claude.scss"), "utf8");
    // Strip comments so we assert against actual rules, not prose (the explanatory
    // comment legitimately names the old broken selector).
    const scss = raw.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");

    // The corrected rule: key off #saypi-prompt + .custom-placeholder and override the
    // ::before content (Claude's content is not !important, so ours wins).
    expect(scss).toMatch(/#saypi-prompt:has\(\+\s*\.custom-placeholder\)/);
    expect(scss).toMatch(/p\[data-placeholder\]::before\s*\{[^}]*content:\s*["']{2}\s*!important/);

    // The broken selector must be gone (it never matched: id-vs-class + wrong sibling).
    expect(scss).not.toMatch(/#saypi-prompt-container:has\(/);
  });
});
