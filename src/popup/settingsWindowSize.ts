/**
 * Adaptive settings-window sizing (macOS System Settings pattern): the popup
 * opens compact — right for the form-style tabs — and grows when a pane needs
 * a full page. Today that's only the Voices studio (Host Studio redesign,
 * doc/plans/2026-07-07-voices-host-studio-design.md); a future roomy tab is
 * one more entry in LARGE_TABS.
 *
 * Pure: the caller (settings bootstrap) supplies current window + screen
 * bounds and applies the result via browser.windows.update.
 */

/** Tabs that need a full page rather than the compact popup. */
const LARGE_TABS = new Set(["voices"]);

/**
 * Whether a settings tab wants the full-size window — used by the background
 * to open deep-linked windows at full size directly (no visible grow-jolt).
 */
export function isRoomySettingsTab(tab: string): boolean {
  return LARGE_TABS.has(tab);
}

/**
 * Roomy target for the studio: 1120 fits the 940px content column + sidebar
 * with breathing room; 900 shows stage + slots + a full shelf row.
 */
export const STUDIO_WINDOW = { width: 1120, height: 900 };

export interface WindowBounds {
  width: number;
  height: number;
}
export interface ScreenBounds {
  availWidth: number;
  availHeight: number;
}

/**
 * The window growth needed so `tab` fits, or null when none is needed.
 * Grow-only, per dimension: switching back to a compact tab never shrinks
 * the window, and a user's own larger sizing is always respected (no yo-yo).
 */
export function settingsWindowGrowthFor(
  tab: string,
  current: WindowBounds,
  screen: ScreenBounds
): WindowBounds | null {
  if (!LARGE_TABS.has(tab)) return null;
  const width = Math.max(
    current.width,
    Math.min(STUDIO_WINDOW.width, screen.availWidth)
  );
  const height = Math.max(
    current.height,
    Math.min(STUDIO_WINDOW.height, screen.availHeight)
  );
  if (width === current.width && height === current.height) return null;
  return { width, height };
}
