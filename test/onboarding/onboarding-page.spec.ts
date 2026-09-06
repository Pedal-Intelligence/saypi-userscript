import { describe, it, expect } from "vitest";
import { applyOnboardingI18n, ONBOARDING_I18N_KEYS } from "../../src/onboarding/onboarding-page";

function makeRoot(): HTMLElement {
  const root = document.createElement("div");
  root.innerHTML = `
    <h1 id="onboarding-heading">English heading</h1>
    <p id="onboarding-intro">English intro</p>
    <a id="onboarding-cta-pi">Open Pi</a>
  `;
  return root;
}

describe("applyOnboardingI18n (#437)", () => {
  it("replaces element text with the localized message when one exists", () => {
    const root = makeRoot();
    const dict: Record<string, string> = {
      onboarding_heading: "Bienvenue",
      onboarding_intro: "Intro localisée",
      onboarding_ctaPi: "Ouvrir Pi",
    };

    applyOnboardingI18n(root, (k) => dict[k] ?? "");

    expect(root.querySelector("#onboarding-heading")!.textContent).toBe("Bienvenue");
    expect(root.querySelector("#onboarding-intro")!.textContent).toBe("Intro localisée");
    expect(root.querySelector("#onboarding-cta-pi")!.textContent).toBe("Ouvrir Pi");
  });

  it("keeps the inline English fallback when the translation is empty/missing", () => {
    const root = makeRoot();

    applyOnboardingI18n(root, () => "");

    expect(root.querySelector("#onboarding-heading")!.textContent).toBe("English heading");
    expect(root.querySelector("#onboarding-intro")!.textContent).toBe("English intro");
  });

  it("does not throw when the translate function throws", () => {
    const root = makeRoot();

    expect(() =>
      applyOnboardingI18n(root, () => {
        throw new Error("i18n unavailable");
      })
    ).not.toThrow();
    // fallback text preserved
    expect(root.querySelector("#onboarding-heading")!.textContent).toBe("English heading");
  });

  it("ignores ids that are not present in the document", () => {
    const root = document.createElement("div");
    root.innerHTML = `<h1 id="onboarding-heading">Hi</h1>`;
    // every mapped key resolves, but only the heading exists
    expect(() => applyOnboardingI18n(root, (k) => k)).not.toThrow();
    expect(root.querySelector("#onboarding-heading")!.textContent).toBe("onboarding_heading");
  });

  it("fills the footer's tab name from the Settings tab's own label (#613)", () => {
    const root = document.createElement("div");
    root.innerHTML = `<p id="onboarding-footer">English footer</p>`;
    const dict: Record<string, string> = {
      tabAbout: "Über",
      onboarding_footer: "Wieder zu öffnen unter $tab$.",
    };

    applyOnboardingI18n(root, (k, sub) =>
      (dict[k] ?? "").replace("$tab$", sub ?? "")
    );

    expect(root.querySelector("#onboarding-footer")!.textContent).toBe(
      "Wieder zu öffnen unter Über."
    );
  });

  it("keeps the English footer rather than a half-filled sentence when the tab label is missing", () => {
    const root = document.createElement("div");
    root.innerHTML = `<p id="onboarding-footer">English footer</p>`;

    applyOnboardingI18n(root, (k) => (k === "tabAbout" ? "" : "Reopen from $tab$."));

    expect(root.querySelector("#onboarding-footer")!.textContent).toBe("English footer");
  });

  it("maps every onboarding element id to a namespaced onboarding_ key", () => {
    for (const key of Object.values(ONBOARDING_I18N_KEYS)) {
      expect(key).toMatch(/^onboarding_/);
    }
  });
});
