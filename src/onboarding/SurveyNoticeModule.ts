/**
 * Post-win micro-survey notice (#437).
 *
 * After a few successful spoken exchanges (a "clearly good conversation"), shows
 * a one-time below-composer micro-survey for signed-in users. A rating posts to
 * the saypi-saas feedback sink (Bearer-JWT authed via callApi); the result is
 * never surfaced as an error. Mirrors the injected-notice lifecycle of
 * SpeedPayoffNoticeModule; the gate is the pure `decideSurvey`.
 */
import EventBus from "../events/EventBus";
import getMessage from "../i18n";
import { findNoticeInjectionPoint } from "../ui/notice/findNoticeInjectionPoint";
import { getUsageTracker } from "../auth/UsageTracker";
import { ChatbotIdentifier } from "../chatbots/ChatbotIdentifier";
import { getJwtManagerSync } from "../JwtManager";
import { getClientId } from "../usage/ClientIdManager";
import { getExtensionVersion } from "../usage/VersionManager";
import { callApi } from "../ApiClient";
import { decideSurvey } from "./postWinSurvey";
import { renderSurvey, renderSurveyThanks } from "./surveyView";
import { submitPostWinFeedback } from "./feedbackClient";

const THANKS_HIDE_MS = 3000;

export class SurveyNoticeModule {
  private static instance: SurveyNoticeModule;
  private currentNotice: HTMLElement | null = null;
  private handled = false;

  private constructor() {}

  public static getInstance(): SurveyNoticeModule {
    if (!SurveyNoticeModule.instance) {
      SurveyNoticeModule.instance = new SurveyNoticeModule();
    }
    return SurveyNoticeModule.instance;
  }

  public initialize(): void {
    EventBus.on("saypi:usage:updated", this.handleUsageUpdated);
  }

  private isAuthenticated(): boolean {
    try {
      return getJwtManagerSync().isAuthenticated();
    } catch {
      return false;
    }
  }

  private handleUsageUpdated = async (): Promise<void> => {
    if (this.handled || this.currentNotice) return;

    const stats = getUsageTracker().getStats();
    if (!decideSurvey({ ...stats, authenticated: this.isAuthenticated() })) return;

    // Mark handled + persisted before rendering so it can never show twice.
    this.handled = true;
    try {
      await getUsageTracker().markSurveyShown();
    } catch (error) {
      console.debug("[PostWinSurvey] Failed to persist survey-shown flag:", error);
    }
    this.showSurvey(stats.interactionCount);
  };

  private showSurvey(interactionCount: number): void {
    let chatbotId: string;
    try {
      chatbotId = String(ChatbotIdentifier.getAppId() ?? "").toLowerCase();
    } catch {
      chatbotId = "";
    }

    const root = document.createElement("div");
    root.className = "saypi-survey-notice";
    if (chatbotId) root.setAttribute("data-chatbot", chatbotId);

    renderSurvey(root, {
      translate: (key, sub) => getMessage(key, sub),
      onRate: (rating) => void this.submit(rating, chatbotId, interactionCount),
      onDismiss: () => this.dismiss(),
    });

    const injectionPoint = findNoticeInjectionPoint(chatbotId);
    if (!injectionPoint) {
      console.debug("[PostWinSurvey] No injection point; skipping survey");
      return;
    }
    injectionPoint.insertAdjacentElement("afterend", root);
    this.currentNotice = root;
    setTimeout(() => root.classList.add("visible"), 50);
  }

  private async submit(rating: number, chatbotId: string, interactionCount: number): Promise<void> {
    const notice = this.currentNotice;
    if (notice) renderSurveyThanks(notice, (key) => getMessage(key));

    let clientId: string | undefined;
    try {
      clientId = await getClientId();
    } catch {
      clientId = undefined;
    }

    await submitPostWinFeedback(
      {
        rating,
        app: chatbotId || undefined,
        version: getExtensionVersion() || undefined,
        clientId,
        metadata: { conversations: interactionCount },
      },
      { callApi },
    );

    setTimeout(() => this.dismiss(), THANKS_HIDE_MS);
  }

  private dismiss(): void {
    if (!this.currentNotice) return;
    const notice = this.currentNotice;
    notice.classList.remove("visible");
    setTimeout(() => {
      notice.parentNode?.removeChild(notice);
      if (this.currentNotice === notice) this.currentNotice = null;
    }, 300);
  }

  /** Test/teardown helper. */
  public cleanup(): void {
    EventBus.off("saypi:usage:updated", this.handleUsageUpdated);
    if (this.currentNotice) {
      this.currentNotice.parentNode?.removeChild(this.currentNotice);
      this.currentNotice = null;
    }
    this.handled = false;
  }
}

export const getSurveyNoticeModule = (): SurveyNoticeModule => SurveyNoticeModule.getInstance();
