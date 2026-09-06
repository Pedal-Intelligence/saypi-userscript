/**
 * The Settings-side half of the onboarding route (#613).
 *
 * The first-run page told people they could come back to it from Say, Pi's
 * settings, but nothing in Settings led anywhere near it: `firstRun.ts` opens
 * the page once, on a fresh install, and that was the only door. Anyone who
 * closed the tab mid-setup — before pinning, before testing their microphone —
 * had no way back.
 *
 * This is the second door: an ordinary link on the About tab, resolved to the
 * same `ONBOARDING_PAGE_PATH` the first-run tab opens so the two can never
 * drift onto different files. Deliberately a *link*, not an auto-open: it
 * costs a click and so can never surprise anyone at startup, which is the one
 * thing the first-run gate has to keep guaranteeing.
 *
 * The URL lookup is injected so the wiring is unit-testable; the About tab
 * passes `browser.runtime.getURL`.
 */
import { ONBOARDING_PAGE_PATH } from "./firstRun";

/** Element id of the About-tab link, shared by the panel markup and the tests. */
export const ONBOARDING_LINK_ID = "about-setup-guide";

export interface OnboardingLinkDeps {
  /** Resolves an extension-relative path to a full extension URL. */
  getUrl: (path: string) => string;
}

/**
 * Points the About tab's setup-guide link at the onboarding page. Returns
 * whether the link ended up usable — if the URL can't be resolved the link is
 * hidden rather than left in place with nowhere to go.
 */
export function wireOnboardingLink(
  root: ParentNode,
  deps: OnboardingLinkDeps
): boolean {
  const link = root.querySelector<HTMLAnchorElement>(`#${ONBOARDING_LINK_ID}`);
  if (!link) return false;

  let url = "";
  try {
    url = deps.getUrl(ONBOARDING_PAGE_PATH) || "";
  } catch (e) {
    console.debug("[Onboarding] Could not resolve the onboarding page URL:", e);
  }
  if (!url) {
    link.hidden = true;
    return false;
  }

  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.hidden = false;
  return true;
}
