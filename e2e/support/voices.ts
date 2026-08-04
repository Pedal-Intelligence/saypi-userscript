import type { Page, Worker } from "@playwright/test";
import { MOCK_VOICE_CATALOG, AUDITIONABLE_VOICE_IDS } from "./voice-catalog.ts";

/**
 * Drive-the-rail helpers for `specs/voices-rail.e2e.ts`.
 *
 * Two jobs, both about determinism. The rail resolves asynchronously in three
 * stages — catalog over the network, soundprints behind an IntersectionObserver,
 * then a re-sort once a measurement disagrees with the build-time pitch seed —
 * so "the page is ready" is a condition to wait ON, never a duration to sleep
 * for. And playback leaves no lasting DOM trace (a clip that has finished looks
 * exactly like a clip that never started), so proving something DIDN'T sound
 * needs a recording made while it wasn't happening.
 */

/** Rows in the rail, including the clipless one below the rule. */
export const RAIL_ROW_COUNT = MOCK_VOICE_CATALOG.length;
/** Rows with a clip — the denominator of every counter on the control bar. */
export const AUDITIONABLE_COUNT = AUDITIONABLE_VOICE_IDS.length;

/** One transition into a sounding state, in the order it happened. */
export interface PlayLogEntry {
  voiceId: string;
  /** `loading` (clip fetched, not yet audible) or `playing` (audible). */
  state: "loading" | "playing";
}

declare global {
  interface Window {
    __saypiRailPlayLog?: PlayLogEntry[];
  }
}

/**
 * Open settings, activate Voices, and wait until the rail has finished
 * resolving — every row painted, every clip measured, and the pitch re-sort
 * that the measurements trigger already applied.
 *
 * The last stage is the subtle one. `measurePrint` calls `requestSettle`, which
 * batches the re-sort onto a `setTimeout(…, 0)`, so the instant the final print
 * appears the rail may still be one macrotask away from its true order. Rather
 * than sleep, drain the queue: two nested zero-delay timers resolve strictly
 * after any timer already queued when they were scheduled.
 *
 * Deliberately keyboard-free after the tab click — `focusRail` is what the
 * headline spec is testing, so nothing here may hand the rail focus by proxy.
 */
export async function openVoicesRail(
  page: Page,
  extensionId: string,
): Promise<void> {
  await page.goto(`chrome-extension://${extensionId}/settings.html`);
  await page.locator('.tab-button[data-tab="voices"]').click();
  await page.waitForFunction(
    (expected) => {
      const rows = document.querySelectorAll("#tab-voices .voice-row");
      if (rows.length !== expected) return false;
      // A print with no bars is a row still showing its bare reference line.
      return [
        ...document.querySelectorAll("#tab-voices .voice-row[data-print-voice]"),
      ].every(
        (row) =>
          (row.querySelector(".voice-print-trace")?.childElementCount ?? 0) > 0,
      );
    },
    RAIL_ROW_COUNT,
    { timeout: 30_000 },
  );
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        setTimeout(() => setTimeout(() => resolve(), 0), 0),
      ),
  );
}

/**
 * Seed the analytics-consent decision the settings shell asks for on first run.
 *
 * Not cosmetic here: undecided, the General tab renders a full-width consent
 * hero that overlays the sidebar, and the sidebar is how these specs reach the
 * Voices tab. `false` (declined) is the privacy-preserving default, and matches
 * what `settings.e2e.ts` seeds.
 */
export async function seedConsentDecision(worker: Worker): Promise<void> {
  await worker.evaluate(() => chrome.storage.local.set({ shareData: false }));
}

/**
 * Start recording every voice that begins to sound, in order.
 *
 * The rail expresses playback as two classes on the row (`loading` while the
 * clip is still arriving, `playing` once it is audible) and clears them again
 * when the clip ends — so by the time a test could look, the evidence is gone.
 * This records the false→true transitions as they happen, which turns two
 * otherwise-untestable claims into ordinary assertions: *nothing* sounded
 * before the reader pressed a key, and the sweep walked more than one voice.
 *
 * Observes the PANEL rather than the rail: a late measurement re-sorts the
 * catalog by replacing the whole `<ul>`, which would silently orphan an
 * observer bound to it. The panel outlives every repaint.
 */
export async function recordPlayback(page: Page): Promise<void> {
  await page.evaluate(() => {
    const log: PlayLogEntry[] = [];
    window.__saypiRailPlayLog = log;
    const on = new Map<string, boolean>();
    const panel = document.querySelector("#tab-voices");
    if (!panel) throw new Error("no #tab-voices to observe");
    new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        const row = mutation.target as HTMLElement;
        if (!row.classList?.contains("voice-row")) continue;
        const voiceId = row.dataset.voiceId;
        if (!voiceId) continue;
        for (const state of ["loading", "playing"] as const) {
          const key = `${voiceId}:${state}`;
          const now = row.classList.contains(state);
          if (now && !on.get(key)) log.push({ voiceId, state });
          on.set(key, now);
        }
      }
    }).observe(panel, {
      attributes: true,
      attributeFilter: ["class"],
      subtree: true,
    });
  });
}

/** Everything recorded so far. */
function readPlayback(page: Page): Promise<PlayLogEntry[]> {
  return page.evaluate(() => window.__saypiRailPlayLog ?? []);
}

/**
 * The first `count` voices to have sounded, in the order each first did.
 *
 * Sliced rather than returned whole so it is a settling value, not a moving
 * one: once two voices have played, "the first two voices that played" is true
 * forever, which is what lets `expect.poll` assert on it without racing the
 * third. Shorter than `count` while the page is still catching up — which is
 * exactly the value a failure should report.
 */
export async function firstVoicesToSound(
  page: Page,
  count: number,
): Promise<string[]> {
  const log = await readPlayback(page);
  return [...new Set(log.map((entry) => entry.voiceId))].slice(0, count);
}

/** Which voice the arrow cursor is on, read from the rail's own bookkeeping. */
export function cursorVoiceId(page: Page): Promise<string | null> {
  return page.evaluate(() => {
    const rail = document.querySelector("#tab-voices .voice-rail");
    const activeDescendant = rail?.getAttribute("aria-activedescendant");
    if (!activeDescendant) return null;
    return (
      document.getElementById(activeDescendant) as HTMLElement | null
    )?.dataset.voiceId ?? null;
  });
}

/** The rail's rows, top to bottom, by voice id. */
export function railOrder(page: Page): Promise<string[]> {
  return page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>("#tab-voices .voice-row")].map(
      (row) => row.dataset.voiceId ?? "",
    ),
  );
}

/** Does the rail itself hold DOM focus? (Not a row — the rail is one tab stop.) */
export function railHasDomFocus(page: Page): Promise<boolean> {
  return page.evaluate(
    () =>
      !!document.activeElement &&
      document.activeElement === document.querySelector("#tab-voices .voice-rail"),
  );
}
