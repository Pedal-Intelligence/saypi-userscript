import { describe, it, expect, beforeEach, vi } from "vitest";
import "../../../src/popup/mode-selector"; // IIFE: registers window.ModeSelector
import { replaceI18n } from "../../../entrypoints/settings/shared/i18n";

/**
 * Regression test for the Dictation mode label showing the wrong mode.
 *
 * Observed live on pi.ai (2026-06-14): with the stored preference set to
 * "accuracy", the slider and description correctly showed the accuracy mode,
 * but the text label read "balanced".
 *
 * Root cause: ModeSelector.setIndex() updated the label's textContent but not
 * its `data-i18n` attribute. The settings page localizes all `[data-i18n]`
 * elements via replaceI18n() (on load / language change), which reset
 * #sliderValue back to its hard-coded `data-i18n="mode_balanced"`. The
 * descriptions survive because each has its own data-i18n; the single shared
 * label does not.
 */
const MESSAGES: Record<string, string> = {
  mode_speed: "speed",
  mode_balanced: "balanced",
  mode_accuracy: "accuracy",
  mode_speed_description: "Fastest response, but less accurate. Prone to interrupting.",
  mode_balanced_description: "Good balance of speed and accuracy for most uses.",
  mode_accuracy_description:
    "Highest accuracy, but slower transcription speed. Prone to hallucinations.",
};

const VALUES = [
  { id: "speed", i18nLabelKey: "mode_speed", i18nDescriptionKey: "mode_speed_description" },
  { id: "balanced", i18nLabelKey: "mode_balanced", i18nDescriptionKey: "mode_balanced_description" },
  { id: "accuracy", i18nLabelKey: "mode_accuracy", i18nDescriptionKey: "mode_accuracy_description" },
];

function buildDictationDom(): void {
  // Mirrors entrypoints/settings/tabs/dictation/dictation.html (label hard-codes mode_balanced).
  document.body.innerHTML = `
    <div id="preference-selector" class="mode-selector">
      <div>
        <div class="flex justify-between mb-2">
          <span class="icon" slider-value="0" id="speed"><span class="icon-circle"></span></span>
          <span class="icon active" slider-value="1" id="balanced"><span class="icon-circle"></span></span>
          <span class="icon" slider-value="2" id="accuracy"><span class="icon-circle"></span></span>
        </div>
        <input type="range" min="0" max="2" value="1" id="customRange" />
      </div>
      <div id="sliderValue" data-i18n="mode_balanced">balanced</div>
      <div class="description" data-i18n="mode_speed_description">x</div>
      <div class="description" data-i18n="mode_balanced_description">x</div>
      <div class="description" data-i18n="mode_accuracy_description">x</div>
    </div>`;
}

describe("Dictation ModeSelector label", () => {
  beforeEach(() => {
    (chrome.i18n.getMessage as any) = vi.fn((key: string) => MESSAGES[key] ?? key);
    (chrome.storage.local as any)._setState({ prefer: "accuracy" });
    buildDictationDom();
  });

  it("stays in sync with the selected mode after the page re-localizes (replaceI18n)", async () => {
    const selector = new (window as any).ModeSelector({
      containerId: "preference-selector",
      sliderId: "customRange",
      labelId: "sliderValue",
      storageKey: "prefer",
      values: VALUES,
    });
    selector.init();
    // ModeSelector reads the stored preference asynchronously, then calls setIndex().
    await new Promise((resolve) => setTimeout(resolve, 0));

    const label = document.getElementById("sliderValue")!;
    const slider = document.getElementById("customRange") as HTMLInputElement;

    // Precondition: stored "accuracy" preference was applied.
    expect(slider.value).toBe("2");
    expect(label.textContent).toBe("accuracy");

    // The settings page localizes [data-i18n] elements; this can run after init.
    replaceI18n();

    // The label must still reflect the selected mode, not revert to "balanced".
    expect(label.textContent).toBe("accuracy");
  });
});
