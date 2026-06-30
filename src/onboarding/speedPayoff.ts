/**
 * Speed-payoff value-mirror math (#437 slice 4b).
 *
 * Computes "you spoke ~N minutes faster than typing" on-device. The formula and
 * constants are the contract agreed with the web/backend side (saypi-saas#202)
 * so the in-extension post-win notice and the mid-trial value-mirror email show
 * the SAME number. Pure + unit-tested; the headline copy lives in i18n.
 */

/** Average typing speed (words per minute) — agreed constant. */
export const TYPING_WPM = 40;
/** Average speaking speed (words per minute) — agreed constant. */
export const SPEAKING_WPM = 150;

/** Words spoken in `sttSeconds` of speech, at SPEAKING_WPM. */
export function wordsSpoken(sttSeconds: number): number {
  if (!(sttSeconds > 0)) return 0;
  return (sttSeconds * SPEAKING_WPM) / 60;
}

/** Minutes saved vs typing the same words, given `sttSeconds` of speech. */
export function minutesSavedVsTyping(sttSeconds: number): number {
  return wordsSpoken(sttSeconds) * (1 / TYPING_WPM - 1 / SPEAKING_WPM);
}

/**
 * Whole-minute value to display, or null to suppress the line. Per the contract,
 * the "minutes saved" line is hidden when under a minute has been saved.
 */
export function displayMinutesSaved(sttSeconds: number): number | null {
  const minutes = minutesSavedVsTyping(sttSeconds);
  if (minutes < 1) return null;
  return Math.round(minutes);
}

export interface PostWinInputs {
  /** Whether the post-win notice has already been shown (one-time). */
  postWinShown: boolean;
  /** Completed voice interactions so far. */
  interactionCount: number;
  /** Cumulative transcribed-speech seconds. */
  sttSeconds: number;
}

export interface PostWinDecision {
  /** Whether to show the post-win notice now. */
  show: boolean;
  /** Whole minutes saved to display, or null to omit the "minutes faster" line. */
  minutesSaved: number | null;
}

/**
 * Decides whether to show the one-time post-win speed-payoff notice. It fires
 * after the user's first successful spoken exchange, and never again. The
 * headline ("~3× faster than typing") shows regardless; `minutesSaved` is null
 * when under a minute has been saved (the line is then omitted).
 */
export function decidePostWin(stats: PostWinInputs): PostWinDecision {
  if (stats.postWinShown || stats.interactionCount < 1) {
    return { show: false, minutesSaved: null };
  }
  return { show: true, minutesSaved: displayMinutesSaved(stats.sttSeconds) };
}
