/**
 * Wires the onboarding "where will you usually talk?" question (#437 slice 4d).
 *
 * On selection, maps the environment to the quiet-mode default and persists it.
 * The storage write is injected so the binding logic is unit-testable; the page
 * passes a writer that sets the `quietMode` pref (which content scripts pick up
 * live via storage.onChanged).
 */
import {
  environmentToQuietMode,
  VOICE_ENVIRONMENTS,
  type VoiceEnvironment,
} from "./environmentQuietMode";

export interface EnvironmentQuestionDeps {
  translate: (key: string) => string;
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

  const onChange = async (radio: HTMLInputElement): Promise<void> => {
    if (!radio.checked) return;
    const env = radio.value as VoiceEnvironment;
    if (!(VOICE_ENVIRONMENTS as readonly string[]).includes(env)) return;

    const quiet = environmentToQuietMode(env);
    try {
      await deps.setQuietMode(quiet);
    } catch (e) {
      console.debug("[Onboarding] Failed to apply quiet mode from environment:", e);
    }
    if (status) {
      status.textContent = deps.translate(
        quiet ? "onboarding_envQuietOn" : "onboarding_envQuietOff"
      );
    }
  };

  const handlers = radios.map((radio) => {
    const handler = () => void onChange(radio);
    radio.addEventListener("change", handler);
    return { radio, handler };
  });

  return () => handlers.forEach(({ radio, handler }) => radio.removeEventListener("change", handler));
}
