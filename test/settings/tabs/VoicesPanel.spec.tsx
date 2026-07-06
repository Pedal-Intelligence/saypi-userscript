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

  it("explains the per-host pin toggles", () => {
    const { container } = render(<VoicesPanel />);
    expect(
      container.querySelector(
        "#voices-preference [data-i18n='voicesPinExplainer']",
      ),
    ).toBeTruthy();
  });

  it("renders the unified catalog container VoicesController targets, with no host pills", () => {
    const { container } = render(<VoicesPanel />);
    expect(container.querySelector("#voice-catalog")).toBeTruthy();
    // The per-host pill tablist is gone — the catalog is one unified list.
    expect(container.querySelector("#voice-host-pills")).toBeNull();
    expect(container.querySelector(".voice-host-pill")).toBeNull();
  });
});
