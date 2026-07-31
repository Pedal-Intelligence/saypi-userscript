import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/preact";
import { VoicesPanel } from "../../../entrypoints/settings/tabs/voices/VoicesPanel";

afterEach(() => cleanup());

describe("VoicesPanel", () => {
  it("renders the heading and the listening subtitle with their i18n keys", () => {
    const { container } = render(<VoicesPanel />);
    expect(
      container.querySelector(".panel-heading[data-i18n='voicesSectionTitle']"),
    ).toBeTruthy();
    // Its own class, not `.description`: preferences.css sets that to
    // display:none inside a .user-preference-item, so the subtitle would never
    // be seen.
    const subtitle = container.querySelector(
      ".voice-rail-subtitle[data-i18n='voicesSectionDescriptionListen']",
    );
    expect(subtitle).toBeTruthy();
    expect(subtitle!.classList.contains("description")).toBe(false);
  });

  it("renders the two containers VoicesController targets", () => {
    const { container } = render(<VoicesPanel />);
    expect(container.querySelector("#voice-studio")).toBeTruthy();
    // The switcher sits in the heading row, so the panel owns the slot.
    expect(
      container.querySelector(".voice-rail-head #voice-host-switcher"),
    ).toBeTruthy();
    // The 2c unified-catalog container and its pin explainer are gone.
    expect(container.querySelector("#voice-catalog")).toBeNull();
    expect(
      container.querySelector("[data-i18n='voicesPinExplainer']"),
    ).toBeNull();
  });

  it("puts the live region on its own span, never on the rail's container", () => {
    // aria-live on #voice-studio was right for a static catalog and wrong the
    // moment a player runs: every repaint of a 22-row rail gets announced.
    const { container } = render(<VoicesPanel />);
    expect(container.querySelector("#voice-studio")?.getAttribute("aria-live"))
      .toBeNull();
    const status = container.querySelector("#voice-status")!;
    expect(status.getAttribute("aria-live")).toBe("polite");
    expect(status.classList.contains("voice-visually-hidden")).toBe(true);
    // Its text is substituted ($name$), so it must never carry data-i18n.
    expect(status.hasAttribute("data-i18n")).toBe(false);
  });
});
