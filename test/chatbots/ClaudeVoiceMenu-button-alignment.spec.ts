import { describe, it, expect, vi } from "vitest";

// Break a latent import cycle that only surfaces in the test's module-load
// order: VoiceMenu.ts imports PiAIChatbot from Pi.ts, which imports PiVoiceMenu,
// which `extends VoiceSelector` (defined in VoiceMenu.ts) before it's ready.
// Stubbing Pi short-circuits the cycle; getButtonClasses() never touches Pi.
vi.mock("../../src/chatbots/Pi", () => ({ PiAIChatbot: class {} }));

import { ClaudeVoiceMenu } from "../../src/chatbots/ClaudeVoiceMenu";

/**
 * Contract test for the Claude voice-menu selector button's alignment.
 *
 * On claude.ai the voice selector sits in Claude's prompt-controls row alongside
 * the native model selector, Settings, mic and (SayPi's) call button. Every
 * native sibling in that row is `h-8` (32px) with `align-items: center`. The
 * voice button is explicitly built to "match Claude's model selector structure"
 * (ClaudeVoiceMenu.ts), but its class list drifted: it carried a stray
 * `items-start` (alongside the intended `items-center`) and `h-7`.
 *
 * Because `items-start` wins in Tailwind's generated CSS, the computed
 * `align-items` resolved to `flex-start`, top-aligning the speaker icon + label
 * so they rode ~6px above the row's centre line — the reported "out of
 * alignment wrt its neighbouring controls". `h-7` also left the box (and its
 * hover background) 4px shorter than every native sibling.
 *
 * `getButtonClasses()` is a pure method (uses no `this`), so we invoke it off
 * the prototype rather than constructing the heavy ClaudeVoiceMenu (whose ctor
 * kicks off async voice loading).
 *
 * Live measurements on claude.ai/new (2026-06-14, viewport 1456px):
 *   native model selector / mic / Settings / call button: h=32, align-items=center
 *   voice selector (before fix):                           h=28, align-items=flex-start
 *   voice icon + "Voice off" label vCenter: 448 vs row centre 454 (6px high)
 */
function buttonClasses(): string[] {
  return (ClaudeVoiceMenu.prototype as unknown as {
    getButtonClasses(): string[];
  }).getButtonClasses();
}

describe("ClaudeVoiceMenu selector button aligns with Claude's native controls", () => {
  it("vertically centres its content (items-center, no conflicting items-start)", () => {
    const classes = buttonClasses();
    expect(classes).toContain("items-center");
    // items-start contradicts items-center and wins in the generated CSS,
    // top-aligning the icon + label — the visible misalignment.
    expect(classes).not.toContain("items-start");
  });

  it("matches the native control-button height (h-8, like the model selector & mic)", () => {
    const classes = buttonClasses();
    expect(classes).toContain("h-8");
    expect(classes).not.toContain("h-7");
  });

  it("carries no duplicate utility classes", () => {
    const classes = buttonClasses();
    const duplicates = classes.filter((c, i) => classes.indexOf(c) !== i);
    expect(duplicates).toEqual([]);
  });
});
