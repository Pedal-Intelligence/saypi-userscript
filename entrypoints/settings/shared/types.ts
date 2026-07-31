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

