/**
 * The first-run page makes promises to a brand-new user. These tests pin the
 * ones the code has to be able to keep.
 *
 * Two halves:
 *  - the inline English in `entrypoints/onboarding/index.html` and the `en`
 *    catalog must say the same thing, because the page ships the English
 *    inline and only *replaces* it for other locales — so they can drift
 *    silently, and a fix applied to one alone would reach nobody;
 *  - the claims themselves must match what the extension actually does.
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ONBOARDING_I18N_KEYS } from "../../src/onboarding/onboarding-page";

const markup = readFileSync(
  new URL("../../entrypoints/onboarding/index.html", import.meta.url),
  "utf8"
);
const en: Record<string, { message: string }> = JSON.parse(
  readFileSync(new URL("../../_locales/en/messages.json", import.meta.url), "utf8")
);

const page = new DOMParser().parseFromString(markup, "text/html");
const squash = (s: string) => s.replace(/\s+/g, " ").trim();
const message = (key: string) => en[key]?.message ?? "";

describe("onboarding first-run copy", () => {
  it("keeps the inline English identical to the en catalog for every localized element", () => {
    for (const [id, key] of Object.entries(ONBOARDING_I18N_KEYS)) {
      const el = page.querySelector(`#${id}`);
      expect(el, `#${id} exists in index.html`).not.toBeNull();
      expect(en[key], `${key} exists in _locales/en`).toBeDefined();
      expect(squash(el!.textContent ?? ""), `#${id} matches ${key}`).toBe(
        squash(message(key))
      );
    }
  });

  describe("the pinned toolbar button vs the in-page call button (#612)", () => {
    it("tells the reader that the toolbar button opens Say, Pi's settings", () => {
      // src/svc/background.ts binds action.onClicked -> openSettingsPage().
      // The pin step is the only place we describe that button, so it has to
      // name the right destination.
      expect(message("onboarding_step1Body")).toMatch(/settings/i);
    });

    it("does not promise a call from the toolbar button", () => {
      expect(message("onboarding_step1Body")).not.toMatch(/call/i);
    });

    it("locates the call button on the assistant's page, in the step that starts a conversation", () => {
      const step2 = message("onboarding_step2Body");
      expect(step2).toMatch(/call button/i);
      // Not just "the Say, Pi call button" — the reader has to be told it
      // appears in the chat itself, or the toolbar icon is the obvious guess.
      expect(step2).toMatch(/\b(page|chat|composer|where you type)\b/i);
    });
  });
});
