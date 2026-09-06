/**
 * Wires the onboarding "where will you usually talk?" question (#437 slice 4d).
 *
 * On selection, maps the environment to the quiet-mode default and persists it.
 * Storage is injected — both halves — so the binding logic is unit-testable;
 * the page passes readers/writers for the `quietMode` pref (which content
 * scripts pick up live via storage.onChanged).
 *
 * The question is a setting, not a survey, and that governs the behaviour here
 * (#614): it opens showing what is actually stored rather than blank, it never
 * claims to have saved something it did not, and a slow write can never
 * overwrite the answer that came after it.
 */
import {
  environmentToQuietMode,
  VOICE_ENVIRONMENTS,
  type VoiceEnvironment,
} from "./environmentQuietMode";

export interface EnvironmentQuestionDeps {
  translate: (key: string) => string;
  /** Reads the stored quiet-mode pref; `undefined` when it has never been set. */
  getQuietMode: () => Promise<boolean | undefined>;
  setQuietMode: (on: boolean) => Promise<void>;
}

/** Binds the environment radios; returns a disposer. */
export function wireEnvironmentQuestion(
  root: ParentNode,
  deps: EnvironmentQuestionDeps
): () => void {
  const radios = Array.from(
    root.querySelectorAll<HTMLInputElement>('input[name="voice-environment"]')
  );
  const status = root.querySelector<HTMLElement>("#onboarding-env-status");

  /**
   * Counts answers given. A write that resolves after a later answer was made
   * is stale, and reporting it would leave the page describing a setting the
   * user has already moved on from.
   */
  let answers = 0;
  let disposed = false;

  const show = (key: string): void => {
    if (status) status.textContent = deps.translate(key);
  };

  const onChange = async (radio: HTMLInputElement): Promise<void> => {
    if (!radio.checked) return;
    const env = radio.value as VoiceEnvironment;
    if (!(VOICE_ENVIRONMENTS as readonly string[]).includes(env)) return;

    const quiet = environmentToQuietMode(env);
    const answer = ++answers;
    try {
      await deps.setQuietMode(quiet);
    } catch (e) {
      console.debug("[Onboarding] Failed to apply quiet mode from environment:", e);
      if (disposed || answer !== answers) return;
      // Nothing was saved, so nothing should look chosen — and a radio left
      // checked would swallow the retry, since re-clicking it fires no change.
      radio.checked = false;
      show("onboarding_envSaveFailed");
      return;
    }
    if (disposed || answer !== answers) return;
    show(quiet ? "onboarding_envQuietOn" : "onboarding_envQuietOff");
  };

  const handlers = radios.map((radio) => {
    const handler = () => void onChange(radio);
    radio.addEventListener("change", handler);
    return { radio, handler };
  });

  void (async () => {
    let stored: boolean | undefined;
    try {
      stored = await deps.getQuietMode();
    } catch (e) {
      console.debug("[Onboarding] Could not read the stored quiet mode:", e);
      return;
    }
    // The user answering while the read was in flight is the newer truth.
    if (disposed || answers > 0 || stored === undefined) return;

    if (stored) {
      // "Around other people" is the only answer that stores true, so showing
      // it selected states a fact rather than guessing one. When quiet mode is
      // off, "somewhere private" and "a mix of places" are indistinguishable —
      // both store false — so no radio is chosen and only the setting is named.
      const around = radios.find((radio) => radio.value === "around-others");
      if (around) around.checked = true;
    }
    show(stored ? "onboarding_envQuietOn" : "onboarding_envQuietOff");
  })();

  return () => {
    disposed = true;
    handlers.forEach(({ radio, handler }) => radio.removeEventListener("change", handler));
  };
}
