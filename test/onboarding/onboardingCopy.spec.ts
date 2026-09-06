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
import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  ONBOARDING_I18N_KEYS,
  ONBOARDING_I18N_SUBSTITUTIONS,
} from "../../src/onboarding/onboarding-page";

const markup = readFileSync(
  new URL("../../entrypoints/onboarding/index.html", import.meta.url),
  "utf8"
);
const en: Record<string, { message: string }> = JSON.parse(
  readFileSync(new URL("../../_locales/en/messages.json", import.meta.url), "utf8")
);

const page = new DOMParser().parseFromString(markup, "text/html");
const squash = (s: string) => s.replace(/\s+/g, " ").trim();

/** The en message with its one substitution resolved, as the page renders it. */
function message(key: string): string {
  const raw = en[key]?.message ?? "";
  const from = ONBOARDING_I18N_SUBSTITUTIONS[key];
  return from ? raw.replace(/\$[A-Za-z0-9_]+\$/g, en[from]?.message ?? "") : raw;
}

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

  describe("the promised way back into setup (#613)", () => {
    it("names the tab the return route actually lives on", () => {
      const footer = message("onboarding_footer");
      expect(footer).toMatch(/settings/i);
      // "from Say, Pi's settings" sent people looking through five tabs for a
      // control that did not exist. Now the link is on About, so say About.
      expect(footer).toMatch(/\babout\b/i);
    });

    it("borrows the tab's own label rather than spelling it out again", () => {
      // A hand-written "About" in 32 catalogs drifts from the tab button: the
      // first translation pass produced 11 locales whose footer named a tab
      // that is labelled something else in the sidebar. Substituting the
      // sidebar's own string makes that impossible.
      expect(ONBOARDING_I18N_SUBSTITUTIONS.onboarding_footer).toBe("tabAbout");
      expect(en.onboarding_footer.message).toContain("$tab$");
    });

    it("declares the substitution in every locale, so no catalog renders a raw token", () => {
      const localeDirs = new URL("../../_locales/", import.meta.url);
      for (const loc of readdirSync(localeDirs)) {
        const catalog = JSON.parse(
          readFileSync(new URL(`${loc}/messages.json`, localeDirs), "utf8")
        );
        const entry = catalog.onboarding_footer;
        expect(entry?.message, `${loc} has a footer`).toBeDefined();
        expect(entry.message, `${loc} keeps the token`).toContain("$tab$");
        expect(entry.placeholders?.tab?.content, `${loc} declares it`).toBe("$1");
      }
    });
  });

  describe("the environment question (#614)", () => {
    it("says what the answer changes, before it is answered", () => {
      // The radios write `quietMode` the instant one is picked. The heading
      // alone ("Where will you usually talk?") never said so.
      const help = message("onboarding_envHelp");
      expect(help).not.toBe("");
      expect(help).toMatch(/quiet mode/i);
      expect(page.querySelector("#onboarding-env-help")).not.toBeNull();
    });

    it("puts the explanation ahead of the options, where it can still inform the choice", () => {
      const help = page.querySelector("#onboarding-env-help")!;
      const options = page.querySelector('[role="radiogroup"]')!;
      expect(
        help.compareDocumentPosition(options) & Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();
    });

    it("describes quiet mode as a state, so the same words serve a fresh answer and a revisit", () => {
      // These now render on load from stored state as well as after a click,
      // so "Got it —" style acknowledgements would be a lie on a revisit.
      expect(message("onboarding_envQuietOn")).toMatch(/quiet mode is on/i);
      expect(message("onboarding_envQuietOff")).toMatch(/quiet mode is off/i);
    });

    it("has something honest to say when the setting could not be saved", () => {
      expect(message("onboarding_envSaveFailed")).not.toBe("");
    });
  });
});
