export interface TabController {
  container: HTMLElement;
  init(): Promise<void>;
  /**
   * This tab has just left the screen — the user switched to another one.
   *
   * Distinct from `destroy()`, which the orchestrator never calls: tabs stay
   * mounted and initialized for the life of the page, so a tab that owns
   * something ongoing has, until now, had no way to learn that nobody is
   * looking at it any more. Optional, and four of the five tabs want nothing
   * to do with it — they are forms, and a form off-screen is simply a form.
   *
   * Voices is the exception that earned this hook: it runs a media player, and
   * `Play all` walks a whole catalog. Without it a sweep started on Voices goes
   * on sounding while you read About, with its Stop button no longer on screen.
   * A curiosity with one 1.5 s clip; a defect with a minute of audio.
   */
  onHidden?(): void;
  /**
   * This tab has just come on screen — it is the one the user is looking at.
   *
   * The mirror of `onHidden`, and it exists for the same reason: an inactive
   * panel is `display: none`, so nothing inside it can hold DOM focus, and a
   * tab switcher that toggles classes hands focus nowhere. Four of the five
   * tabs are forms and want nothing to do with it — the browser's own tab
   * order is the right answer for a form.
   *
   * Voices is the exception, again. Its rail is a `role="listbox"` whose whole
   * interaction model is the keyboard: `Space` plays, `↑↓` walk, `Enter`
   * commits. Without this hook the rail set `tabIndex=0` and painted an
   * active descendant while DOM focus stayed on the sidebar button that opened
   * it — it LOOKED focused and could not be typed at, which made the design's
   * headline claim ("hear a voice: one action") false.
   *
   * Called for the INCOMING tab, after it has loaded, and after the outgoing
   * tab's `onHidden` — so a tab that queued something on the way in can be
   * told to drop it on the way back out.
   */
  onShown?(): void;
  destroy?(): void;
  initialized?: boolean;
}

export interface UserData {
  name?: string;
  userId?: string;
  teamId?: string;
  planId?: string;
  ttsQuotaRemaining?: number;
  ttsQuotaMonthly?: number;
}

// Global type augmentations
declare global {
  interface Window {
    lucide?: {
      createIcons: (options?: any) => void;
      icons: Record<string, any>;
    };
  }
}

