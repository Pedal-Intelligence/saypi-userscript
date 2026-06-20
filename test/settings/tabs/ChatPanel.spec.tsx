import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/preact";
import { ChatPanel } from "../../../entrypoints/settings/tabs/chat/ChatPanel";

afterEach(() => cleanup());

describe("ChatPanel", () => {
  it("renders the submit-mode selector with the ids/icons SubmitModeController targets", () => {
    const { container } = render(<ChatPanel />);
    expect(container.querySelector("#submit-mode-selector")).toBeTruthy();
    expect(container.querySelector("input#submitModeRange[type='range']")).toBeTruthy();
    expect(container.querySelector("#submitModeValue")).toBeTruthy();

    // The three mode icons, by id and order, each with its slider-value + lucide icon.
    const icons = [...container.querySelectorAll("#submit-mode-selector .icon")];
    expect(icons.map((i) => i.id)).toEqual(["auto", "agent", "off"]);
    expect(icons.map((i) => i.getAttribute("slider-value"))).toEqual(["0", "1", "2"]);
    expect(
      icons.map((i) => i.querySelector("i[data-lucide]")?.getAttribute("data-lucide")),
    ).toEqual(["zap", "bot", "hand"]);
  });

  it("renders the three submit-mode descriptions with their i18n keys", () => {
    const { container } = render(<ChatPanel />);
    const keys = [
      ...container.querySelectorAll("#submit-mode-selector .description"),
    ].map((d) => d.getAttribute("data-i18n"));
    expect(keys).toEqual([
      "submit_mode_auto_description",
      "submit_mode_agent_description",
      "submit_mode_off_description",
    ]);
    // The agent description is skipped by the i18n pass (filled dynamically).
    expect(
      container
        .querySelector("[data-i18n='submit_mode_agent_description']")
        ?.getAttribute("data-i18n-skip"),
    ).toBe("true");
  });

  it("renders the nickname input and the two preference toggles", () => {
    const { container } = render(<ChatPanel />);
    expect(
      container.querySelector("input#assistant-nickname[type='text']"),
    ).toBeTruthy();
    expect(
      container.querySelector("input#allow-interruptions[type='checkbox']"),
    ).toBeTruthy();
    expect(
      container.querySelector("input#chatgpt-auto-read-aloud[type='checkbox']"),
    ).toBeTruthy();
  });
});
