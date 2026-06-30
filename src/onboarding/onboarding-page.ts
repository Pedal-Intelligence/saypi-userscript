/**
 * First-run onboarding page logic (#437).
 *
 * The page ships with English text inline in the HTML; this localizes it for
 * other locales by id. The mapping + apply step are extracted as a pure
 * function so they can be unit-tested in JSDOM without the extension runtime.
 */
import { browser } from "wxt/browser";
import getMessage from "../i18n";
import { wireMicTest } from "./micTestWiring";
import { wireEnvironmentQuestion } from "./environmentQuestion";

/** Maps element ids in onboarding/index.html to their i18n message keys. */
export const ONBOARDING_I18N_KEYS: Record<string, string> = {
  "onboarding-heading": "onboarding_heading",
  "onboarding-intro": "onboarding_intro",
  "onboarding-step1-title": "onboarding_step1Title",
  "onboarding-step1-body": "onboarding_step1Body",
  "onboarding-step2-title": "onboarding_step2Title",
  "onboarding-step2-body": "onboarding_step2Body",
  "onboarding-cta-pi": "onboarding_ctaPi",
  "onboarding-cta-claude": "onboarding_ctaClaude",
  "onboarding-cta-chatgpt": "onboarding_ctaChatgpt",
  "onboarding-mic-test-btn": "onboarding_micTestButton",
  "onboarding-env-title": "onboarding_envTitle",
  "onboarding-env-private-label": "onboarding_envPrivate",
  "onboarding-env-mixed-label": "onboarding_envMixed",
  "onboarding-env-around-label": "onboarding_envAroundOthers",
  "onboarding-footer": "onboarding_footer",
};

/**
 * Replaces each known element's text with its localized message when one
 * exists. Missing/empty translations are skipped so the inline English text
 * remains as the fallback.
 */
export function applyOnboardingI18n(
  root: ParentNode,
  translate: (key: string) => string
): void {
  for (const [id, key] of Object.entries(ONBOARDING_I18N_KEYS)) {
    const el = root.querySelector(`#${id}`);
    if (!el) continue;
    let msg = "";
    try {
      msg = translate(key) ?? "";
    } catch {
      msg = "";
    }
    if (msg) el.textContent = msg;
  }
}

/** Wires the "try it yourself" mic-test if its elements are present. */
export function setupMicTest(root: ParentNode): void {
  const button = root.querySelector<HTMLButtonElement>("#onboarding-mic-test-btn");
  const meter = root.querySelector<HTMLElement>("#onboarding-mic-meter");
  const fill = root.querySelector<HTMLElement>("#onboarding-mic-meter-fill");
  const status = root.querySelector<HTMLElement>("#onboarding-mic-test-status");
  if (!button || !meter || !fill || !status) return;
  wireMicTest(
    { button, meter, fill, status },
    { translate: (key, sub) => getMessage(key, sub) }
  );
}

/** Wires the "where will you usually talk?" question if present (#437). */
export function setupEnvironmentQuestion(root: ParentNode): void {
  if (!root.querySelector('input[name="voice-environment"]')) return;
  wireEnvironmentQuestion(root, {
    translate: (key) => getMessage(key),
    setQuietMode: (on) => browser.storage.local.set({ quietMode: on }),
  });
}

function init(): void {
  applyOnboardingI18n(document, (key) => getMessage(key));
  setupMicTest(document);
  setupEnvironmentQuestion(document);
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}
