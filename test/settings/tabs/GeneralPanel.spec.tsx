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

  it("renders the Voice playback group with a speed and a volume slider (#96/#117)", () => {
    const { container } = render(<GeneralPanel />);
    expect(container.querySelector("#voice-playback-preference")).toBeTruthy();

    const speed = container.querySelector<HTMLInputElement>(
      "input#tts-playback-rate[type='range']",
    );
    const volume = container.querySelector<HTMLInputElement>(
      "input#tts-volume[type='range']",
    );
    expect(speed).toBeTruthy();
    expect(volume).toBeTruthy();
    expect([speed!.min, speed!.max, speed!.step]).toEqual(["0.5", "2", "0.1"]);
    expect([volume!.min, volume!.max, volume!.step]).toEqual(["0", "100", "5"]);
  });

  it("gives each slider a labelled readout with no data-i18n to clobber", () => {
    const { container } = render(<GeneralPanel />);
    for (const id of ["#tts-playback-rate-value", "#tts-volume-value"]) {
      const readout = container.querySelector(id);
      expect(readout, `missing ${id}`).toBeTruthy();
      // replaceI18n() rewrites every [data-i18n] element's text on each tab
      // load, which would wipe the substituted value out of these.
      expect(readout!.hasAttribute("data-i18n")).toBe(false);
    }
    expect(
      container.querySelector("label[for='tts-playback-rate'] [data-i18n]"),
    ).toBeTruthy();
    expect(
      container.querySelector("label[for='tts-volume'] [data-i18n]"),
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
