import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/preact";
import { GeneralPanel } from "../../../entrypoints/settings/tabs/general/GeneralPanel";

afterEach(() => cleanup());

describe("GeneralPanel", () => {
  it("renders the sound-effects and share-analytics toggles", () => {
    const { container } = render(<GeneralPanel />);
    expect(
      container.querySelector("input#sound-effects[type='checkbox']"),
    ).toBeTruthy();
    expect(
      container.querySelector("input#share-data[type='checkbox']"),
    ).toBeTruthy();
  });

  it("renders the quota section the premium/usage modules target", () => {
    const { container } = render(<GeneralPanel />);
    expect(container.querySelector("#premium-status")).toBeTruthy();
    expect(container.querySelector("#tts-quota-remaining-value")).toBeTruthy();
    expect(container.querySelector("#stt-quota-remaining-value")).toBeTruthy();
    expect(container.querySelector("#quota-reset-date")).toBeTruthy();
  });

  it("renders the upgrade button (hidden section) with its focus-ring classes", () => {
    const { container } = render(<GeneralPanel />);
    expect(container.querySelector("section#upgrade.hidden")).toBeTruthy();
    const btn = container.querySelector("#upgrade #upgrade-button") as HTMLElement;
    expect(btn).toBeTruthy();
    for (const cls of ["bg-blue-600", "rounded-md", "focus:ring-2", "focus:ring-blue-500"]) {
      expect(btn.classList.contains(cls), `missing ${cls}`).toBe(true);
    }
  });

  it("renders the consent card (hidden) with its hero, opt-in/opt-out, and clear-preferences", () => {
    const { container } = render(<GeneralPanel />);
    expect(container.querySelector("section#analytics-consent.hidden")).toBeTruthy();
    expect(container.querySelector("#analytics-consent .consent-hero")).toBeTruthy();
    expect(container.querySelector("button#opt-in")).toBeTruthy();
    expect(container.querySelector("button#opt-out")).toBeTruthy();
    expect(
      container.querySelector("#devtools #clear-preferences i[data-lucide='trash-2']"),
    ).toBeTruthy();
  });
});
