import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/preact";
import { VoicesPanel } from "../../../entrypoints/settings/tabs/voices/VoicesPanel";

afterEach(() => cleanup());

describe("VoicesPanel", () => {
  it("renders the heading and description with their i18n keys", () => {
    const { container } = render(<VoicesPanel />);
    expect(
      container.querySelector(".panel-heading[data-i18n='voicesSectionTitle']"),
    ).toBeTruthy();
    expect(
      container.querySelector(
        "#voices-preference [data-i18n='voicesSectionDescription']",
      ),
    ).toBeTruthy();
  });

  it("renders the studio container VoicesController targets", () => {
    const { container } = render(<VoicesPanel />);
    expect(container.querySelector("#voice-studio")).toBeTruthy();
    // The 2c unified-catalog container and its pin explainer are gone — the
    // studio shows the pin payoff (menu slots) instead of explaining it.
    expect(container.querySelector("#voice-catalog")).toBeNull();
    expect(
      container.querySelector("[data-i18n='voicesPinExplainer']"),
    ).toBeNull();
  });
});
