/**
 * First-run onboarding gating (#437).
 *
 * Decides whether to open the post-install onboarding tab and guarantees it
 * only ever happens once on a fresh install — never on a browser/extension
 * update, and never repeatedly. The logic is dependency-injected so it can be
 * unit-tested without a real `browser` environment; the background service
 * worker wires it to `browser.tabs` / `browser.storage.local` (see
 * `src/svc/background.ts`).
 */

/** Extension-root path of the onboarding page (WXT emits `onboarding.html`). */
export const ONBOARDING_PAGE_PATH = "onboarding.html";

/** Storage key recording that the first-run tab has already been shown. */
export const ONBOARDING_SHOWN_KEY = "saypi_onboarding_shown";

/** The shape of `runtime.onInstalled` details we care about. */
export interface InstalledDetailsLike {
  reason?: string;
}

export interface FirstRunDeps {
  /** Opens a new tab at the given URL. */
  openTab: (url: string) => Promise<unknown>;
  /** Resolves an extension-relative path to a full extension URL. */
  getUrl: (path: string) => string;
  /** Minimal async key/value storage (e.g. browser.storage.local). */
  storage: {
    get: (key: string) => Promise<unknown>;
    set: (key: string, value: unknown) => Promise<void>;
  };
}

/** True only for a brand-new install (not an update or browser update). */
export function isFreshInstall(reason: string | undefined): boolean {
  return reason === "install";
}

/**
 * Opens the onboarding tab exactly once on a fresh install. Returns whether a
 * tab was opened. Swallows all errors — a failure here must never break
 * extension installation.
 */
export async function maybeOpenFirstRunTab(
  details: InstalledDetailsLike | undefined,
  deps: FirstRunDeps
): Promise<boolean> {
  try {
    if (!isFreshInstall(details?.reason)) return false;

    // Guard against re-showing (e.g. uninstall/reinstall loops, or an install
    // event arriving more than once).
    const alreadyShown = await deps.storage.get(ONBOARDING_SHOWN_KEY);
    if (alreadyShown) return false;

    await deps.openTab(deps.getUrl(ONBOARDING_PAGE_PATH));
    await deps.storage.set(ONBOARDING_SHOWN_KEY, true);
    return true;
  } catch (e) {
    console.debug("[Onboarding] Failed to open first-run tab:", e);
    return false;
  }
}
