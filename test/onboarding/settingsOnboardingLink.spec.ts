import { describe, it, expect, vi } from "vitest";
import {
  ONBOARDING_LINK_ID,
  wireOnboardingLink,
} from "../../src/onboarding/settingsOnboardingLink";
import { ONBOARDING_PAGE_PATH } from "../../src/onboarding/firstRun";

const getUrl = (path: string) => `chrome-extension://abc/${path}`;

function buildRoot(): HTMLElement {
  const root = document.createElement("div");
  root.innerHTML = `<a id="${ONBOARDING_LINK_ID}">Open the setup guide</a>`;
  return root;
}

function link(root: ParentNode): HTMLAnchorElement {
  return root.querySelector<HTMLAnchorElement>(`#${ONBOARDING_LINK_ID}`)!;
}

describe("wireOnboardingLink (#613)", () => {
  it("points the About-tab link at the onboarding page", () => {
    const root = buildRoot();

    expect(wireOnboardingLink(root, { getUrl })).toBe(true);

    expect(link(root).href).toBe(`chrome-extension://abc/${ONBOARDING_PAGE_PATH}`);
    expect(link(root).hidden).toBe(false);
  });

  it("resolves the same page the first-run tab opens", () => {
    // Reusing firstRun's constant is the point: one path, so the two routes
    // can never drift onto different files.
    const root = buildRoot();
    const spy = vi.fn(getUrl);

    wireOnboardingLink(root, { getUrl: spy });

    expect(spy).toHaveBeenCalledWith(ONBOARDING_PAGE_PATH);
  });

  it("opens in its own tab without leaking the settings page as opener", () => {
    const root = buildRoot();

    wireOnboardingLink(root, { getUrl });

    expect(link(root).target).toBe("_blank");
    expect(link(root).relList.contains("noopener")).toBe(true);
    expect(link(root).relList.contains("noreferrer")).toBe(true);
  });

  it("hides the link rather than offering a dead one when the URL can't be resolved", () => {
    const root = buildRoot();

    expect(
      wireOnboardingLink(root, {
        getUrl: () => {
          throw new Error("no runtime");
        },
      })
    ).toBe(false);

    expect(link(root).hidden).toBe(true);
    expect(link(root).getAttribute("href")).toBeNull();
  });

  it("is a no-op when the link is absent", () => {
    const root = document.createElement("div");

    expect(wireOnboardingLink(root, { getUrl })).toBe(false);
  });
});
