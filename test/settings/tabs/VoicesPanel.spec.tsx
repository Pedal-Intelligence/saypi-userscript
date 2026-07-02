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

  it("brands each pill with its assistant's logo while keeping the text label (#473)", () => {
    const { container } = render(<VoicesPanel />);
    const piLogo = container.querySelector<HTMLImageElement>(
      "#voice-host-pi img.voice-host-logo"
    );
    const claudeLogo = container.querySelector<HTMLImageElement>(
      "#voice-host-claude img.voice-host-logo"
    );
    expect(piLogo?.getAttribute("src")).toBe("/icons/logos/pi.png");
    expect(claudeLogo?.getAttribute("src")).toBe("/icons/logos/claude.png");
    // Decorative images: the pill text stays the accessible label.
    expect(piLogo?.getAttribute("alt")).toBe("");
    expect(claudeLogo?.getAttribute("aria-hidden")).toBe("true");
    expect(container.querySelector("#voice-host-pi")?.textContent?.trim()).toBe("Pi");
    expect(
      container.querySelector("#voice-host-claude")?.textContent?.trim()
    ).toBe("Claude");
  });
});
