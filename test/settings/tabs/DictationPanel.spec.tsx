import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/preact";
import { DictationPanel } from "../../../entrypoints/settings/tabs/dictation/DictationPanel";

afterEach(() => cleanup());

describe("DictationPanel", () => {
  it("renders the mode selector with the ids/icons ModeSelector targets", () => {
    const { container } = render(<DictationPanel />);
    expect(container.querySelector("#preference-selector")).toBeTruthy();
    expect(container.querySelector("input#customRange[type='range']")).toBeTruthy();
    expect(container.querySelector("#sliderValue")).toBeTruthy();

    const icons = [...container.querySelectorAll("#preference-selector .icon")];
    expect(icons.map((i) => i.id)).toEqual(["speed", "balanced", "accuracy"]);
    expect(icons.map((i) => i.getAttribute("slider-value"))).toEqual(["0", "1", "2"]);
    expect(
      icons.map((i) => i.querySelector("i[data-lucide]")?.getAttribute("data-lucide")),
    ).toEqual(["rabbit", "scale", "turtle"]);
    // The balanced icon starts active (matches the range's default value="1").
    expect(container.querySelector("#balanced")?.classList.contains("active")).toBe(true);
  });

  it("renders the language picker with all language options", () => {
    const { container } = render(<DictationPanel />);
    const picker = container.querySelector(".js-language-picker");
    expect(picker).toBeTruthy();
    const select = container.querySelector("select#language-picker-select");
    expect(select).toBeTruthy();
    const options = [...select!.querySelectorAll("option")];
    expect(options.length).toBe(30); // 29 languages + Auto-detect
    expect(options.at(0)?.getAttribute("value")).toBe("arabic");
    expect(options.at(-1)?.getAttribute("value")).toBe("global"); // Auto-detect
  });

  it("renders the VAD-status and filler-words toggles", () => {
    const { container } = render(<DictationPanel />);
    expect(
      container.querySelector("input#vad-status-indicator-enabled[type='checkbox']"),
    ).toBeTruthy();
    expect(
      container.querySelector("input#remove-filler-words[type='checkbox']"),
    ).toBeTruthy();
  });
});
