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

  it("renders the host pills and catalog container VoicesController targets", () => {
    const { container } = render(<VoicesPanel />);
    const pills = [
      ...container.querySelectorAll("#voice-host-pills button.voice-host-pill"),
    ];
    expect(pills.map((p) => p.id)).toEqual([
      "voice-host-pi",
      "voice-host-claude",
    ]);
    expect(container.querySelector("#voice-catalog")).toBeTruthy();
  });
});
