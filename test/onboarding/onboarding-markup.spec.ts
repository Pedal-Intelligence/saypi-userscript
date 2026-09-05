import { readFileSync } from "node:fs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { browser } from "wxt/browser";
import {
  applyOnboardingI18n,
  ONBOARDING_I18N_KEYS,
  setupEnvironmentQuestion,
} from "../../src/onboarding/onboarding-page";
import { wireMicTest, type MicTestElements } from "../../src/onboarding/micTestWiring";

const markup = readFileSync(
  new URL("../../entrypoints/onboarding/index.html", import.meta.url),
  "utf8"
);
const translate = (key: string) => `localized:${key}`;
const assistants = [
  ["onboarding-cta-pi", "https://pi.ai/talk"],
  ["onboarding-cta-claude", "https://claude.ai/new"],
  ["onboarding-cta-chatgpt", "https://chatgpt.com/"],
] as const;

function micElements(root: ParentNode): MicTestElements {
  return {
    button: root.querySelector<HTMLButtonElement>("#onboarding-mic-test-btn")!,
    meter: root.querySelector<HTMLElement>("#onboarding-mic-meter")!,
    fill: root.querySelector<HTMLElement>("#onboarding-mic-meter-fill")!,
    status: root.querySelector<HTMLElement>("#onboarding-mic-test-status")!,
  };
}

describe("onboarding entrypoint integration", () => {
  let page: Document;

  beforeEach(() => {
    page = new DOMParser().parseFromString(markup, "text/html");
  });

  it("localizes every page label once without removing assistant artwork or controls", () => {
    for (const id of Object.keys(ONBOARDING_I18N_KEYS)) {
      expect(page.querySelectorAll(`#${id}`), id).toHaveLength(1);
    }

    const logos = assistants.map(([id]) => {
      const link = page.querySelector(`#${id}`)!.closest("a")!;
      const logo = link.querySelector("img");
      expect(logo, `${id} has recognizable assistant artwork`).not.toBeNull();
      return { link, logo };
    });
    const radios = Array.from(page.querySelectorAll('input[name="voice-environment"]'));
    const mic = micElements(page);

    applyOnboardingI18n(page, translate);

    for (const [id, key] of Object.entries(ONBOARDING_I18N_KEYS)) {
      expect(page.querySelector(`#${id}`)!.textContent).toBe(translate(key));
    }
    for (const { link, logo } of logos) {
      expect(link.contains(logo)).toBe(true);
    }
    expect(page.querySelectorAll('input[name="voice-environment"]')).toHaveLength(3);
    for (const radio of radios) {
      expect(page.contains(radio)).toBe(true);
      expect(radio.closest("label")!.textContent).toContain("localized:onboarding_env");
    }
    expect(mic.button.tagName).toBe("BUTTON");
    expect(mic.button.type).toBe("button");
    expect(page.contains(mic.button)).toBe(true);
    expect(mic.meter.contains(mic.fill)).toBe(true);
    expect(mic.meter.hidden).toBe(true);
  });

  it("keeps each localized assistant action a secure native link to its chat", () => {
    applyOnboardingI18n(page, translate);

    for (const [id, url] of assistants) {
      const label = page.querySelector(`#${id}`)!;
      const link = label.closest("a")!;
      expect(link.getAttribute("href")).toBe(url);
      expect(link.target).toBe("_blank");
      expect(link.relList.contains("noopener")).toBe(true);
      expect(link.relList.contains("noreferrer")).toBe(true);
      expect(link.textContent).toContain(translate(ONBOARDING_I18N_KEYS[id]));
    }
  });

  it("lets the localized environment labels apply quiet mode without a submit gate", async () => {
    await browser.storage.local.remove("quietMode");
    applyOnboardingI18n(page, translate);
    setupEnvironmentQuestion(page);
    const group = page.querySelector('[role="radiogroup"]')!;
    expect(group.getAttribute("aria-labelledby")).toBe("onboarding-env-title");
    expect(page.querySelector('input[name="voice-environment"]:checked')).toBeNull();
    expect((await browser.storage.local.get("quietMode")).quietMode).toBeUndefined();

    for (const [value, quiet] of [
      ["around-others", true],
      ["private", false],
      ["mixed", false],
    ] as const) {
      const radio = page.querySelector<HTMLInputElement>(`input[value="${value}"]`)!;
      radio.closest("label")!.click();
      await Promise.resolve();

      expect(radio.checked).toBe(true);
      expect(page.querySelectorAll('input[name="voice-environment"]:checked')).toHaveLength(1);
      expect((await browser.storage.local.get("quietMode")).quietMode).toBe(quiet);
      expect(page.querySelector("#onboarding-env-status")!.textContent).not.toBe("");
    }
    await browser.storage.local.remove("quietMode");
  });

  it("keeps microphone request, listening, and stop states usable in the real markup", async () => {
    applyOnboardingI18n(page, translate);
    const els = micElements(page);
    let frame: (() => void) | undefined;
    const release = vi.fn();
    const dispose = wireMicTest(els, {
      translate,
      acquire: async () => ({ readLevel: () => 0.4, release }),
      schedule: (callback) => { frame = callback; return 1; },
      cancel: () => { frame = undefined; },
      now: () => 0,
    });

    els.button.click();
    expect(els.button.disabled).toBe(true);
    expect(els.status.textContent).toBe(translate("onboarding_micTestRequesting"));
    await Promise.resolve();
    frame!();

    expect(els.button.disabled).toBe(false);
    expect(els.button.textContent).toBe(translate("onboarding_micTestStop"));
    expect(els.meter.hidden).toBe(false);
    expect(els.fill.style.width).toBe("100%");
    expect(els.status.textContent).toBe(translate("onboarding_micTestListening"));
    expect(els.status.getAttribute("role")).toBe("status");
    expect(els.status.getAttribute("aria-live")).toBe("polite");

    els.button.click();
    expect(release).toHaveBeenCalledTimes(1);
    expect(els.button.textContent).toBe(translate("onboarding_micTestButton"));
    expect(els.meter.hidden).toBe(true);
    expect(els.fill.style.width).toBe("0%");
    expect(els.status.textContent).toBe(translate("onboarding_micTestDone"));
    dispose();
  });

  it("keeps microphone denial recovery visible and retryable after localization", async () => {
    applyOnboardingI18n(page, translate);
    const els = micElements(page);
    const dispose = wireMicTest(els, {
      translate,
      acquire: async () => { throw { name: "NotAllowedError" }; },
    });

    els.button.click();
    await Promise.resolve();

    expect(els.button.disabled).toBe(false);
    expect(els.button.textContent).toBe(translate("onboarding_micTestButton"));
    expect(els.meter.hidden).toBe(true);
    expect(els.status.textContent).toBe(translate("permissions_recoveryDeniedBody"));
    dispose();
  });
});
