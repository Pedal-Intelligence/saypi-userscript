/**
 * OnboardingHint - best-effort post-connect voiceGoal/locale hint
 *
 * On the SaaS side, `User.voiceGoal` and `User.signupLocale` are captured only
 * when a user completes the web onboarding wizard, which ~89% of signups skip by
 * authorising the extension directly. To populate those fields for wizard-skippers,
 * the extension sends a lightweight, authenticated hint immediately after a
 * successful OAuth connect. The SaaS persists it only when the field is currently
 * null (never overwriting a wizard-provided value).
 *
 * This is strictly best-effort: it must never delay or fail token issuance, so
 * every failure path is swallowed and the call is fire-and-forget.
 *
 * @see https://github.com/saypi/saypi-userscript/issues/490
 * @see saypi-saas#225 - the paired server-side change (receiving end + persistence)
 */

import { config } from "../ConfigModule";
import { logger } from "../LoggingModule";
import { ChatbotIdentifier } from "../chatbots/ChatbotIdentifier";

/**
 * The onboarding "voice goal" vocabulary shared with the SaaS. Maps 1:1 to the
 * assistant/site the user connected from, with any non-chat site collapsed to
 * the universal-dictation use-case.
 */
export type VoiceGoal = "chatgpt" | "claude" | "pi" | "dictation";

export interface OnboardingHint {
  voiceGoal?: VoiceGoal;
  locale?: string;
}

/**
 * Infer a voiceGoal from the URL of the tab that initiated the connect flow.
 *
 * Only http(s) sites yield a signal: extension pages (the settings tab), the
 * new-tab page, `about:` URLs, etc. return `undefined` so we never tag a
 * settings-page-initiated connect as "dictation" and mislead the funnel.
 */
export function voiceGoalFromUrl(url?: string): VoiceGoal | undefined {
  if (!url) {
    return undefined;
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return undefined;
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return undefined;
  }

  switch (ChatbotIdentifier.identifyChatbot(parsed.hostname)) {
    case "claude":
      return "claude";
    case "pi":
      return "pi";
    case "chatgpt":
      return "chatgpt";
    case "web":
      return "dictation";
    default:
      return undefined;
  }
}

/**
 * Send the onboarding hint to the SaaS after a successful connect.
 *
 * Best-effort by contract: returns quietly (never throws) if there is nothing
 * worth sending, if the auth server URL is unconfigured, or if the request
 * fails for any reason. Its absence changes nothing about the connect flow.
 */
export async function sendOnboardingHint(
  accessToken: string,
  hint: OnboardingHint,
): Promise<void> {
  const body: OnboardingHint = {};
  if (hint.voiceGoal) {
    body.voiceGoal = hint.voiceGoal;
  }
  if (hint.locale) {
    body.locale = hint.locale;
  }

  // Nothing to persist, or no way to authenticate the write — skip silently.
  if (!body.voiceGoal && !body.locale) {
    return;
  }
  if (!accessToken || !config.authServerUrl) {
    return;
  }

  try {
    const response = await fetch(`${config.authServerUrl}/api/onboarding/hint`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      logger.debug(
        "[OnboardingHint] hint POST returned non-OK, ignoring:",
        response.status,
      );
      return;
    }

    logger.debug("[OnboardingHint] onboarding hint sent", body);
  } catch (error) {
    logger.debug(
      "[OnboardingHint] onboarding hint failed (best-effort, ignoring):",
      error,
    );
  }
}
