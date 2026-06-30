/**
 * Post-win speed-payoff notice (#437 slice 4b).
 *
 * After the user's first successful spoken exchange, shows a one-time,
 * dismissible below-composer notice celebrating the speed payoff ("~3× faster
 * than typing", plus the minutes saved when ≥ 1). Reuses the shared <Notice>
 * component (variant "speed") and the injected-notice lifecycle from
 * AgentModeNoticeModule; the show/one-time gating is the pure `decidePostWin`.
 */
import EventBus from "../events/EventBus";
import getMessage from "../i18n";
import { h, render } from "preact";
import { Notice } from "../ui/Notice";
import { findNoticeInjectionPoint } from "../ui/notice/findNoticeInjectionPoint";
import { getUsageTracker } from "../auth/UsageTracker";
import { ChatbotIdentifier } from "../chatbots/ChatbotIdentifier";
import { decidePostWin } from "./speedPayoff";

const AUTO_HIDE_MS = 12000;

export class SpeedPayoffNoticeModule {
  private static instance: SpeedPayoffNoticeModule;
  private currentNotice: HTMLElement | null = null;
  /** In-session guard against re-entrancy before the persisted flag is written. */
  private handled = false;

  private constructor() {}

  public static getInstance(): SpeedPayoffNoticeModule {
    if (!SpeedPayoffNoticeModule.instance) {
      SpeedPayoffNoticeModule.instance = new SpeedPayoffNoticeModule();
    }
    return SpeedPayoffNoticeModule.instance;
  }

  public initialize(): void {
    EventBus.on("saypi:usage:updated", this.handleUsageUpdated);
  }

  private handleUsageUpdated = async (): Promise<void> => {
    if (this.handled || this.currentNotice) return;

    const stats = getUsageTracker().getStats();
    const decision = decidePostWin(stats);
    if (!decision.show) return;

    // Mark handled + persisted before rendering so it can never show twice.
    this.handled = true;
    try {
      await getUsageTracker().markPostWinShown();
    } catch (error) {
      console.debug("[SpeedPayoffNotice] Failed to persist post-win flag:", error);
    }
    this.showNotice(decision.minutesSaved);
  };

  private showNotice(minutesSaved: number | null): void {
    let chatbotId: string;
    try {
      chatbotId = String(ChatbotIdentifier.getAppId() ?? "").toLowerCase();
    } catch {
      chatbotId = "";
    }

    const host = document.createElement("div");
    render(
      h(Notice, {
        variant: "speed",
        dataAttr: chatbotId ? { name: "data-chatbot", value: chatbotId } : undefined,
        iconSvg: null,
        iconFallback: "⚡",
        bodyHtml: this.buildBody(minutesSaved),
        dismissLabel: getMessage("dismissNotice") || "Dismiss",
        onDismiss: () => this.dismiss(),
      }),
      host,
    );
    const notice = host.firstElementChild as HTMLElement | null;
    if (!notice) return;

    const injectionPoint = findNoticeInjectionPoint(chatbotId);
    if (!injectionPoint) {
      // No anchor to attach to — skip silently rather than float it loose.
      console.debug("[SpeedPayoffNotice] No injection point; skipping notice");
      return;
    }
    injectionPoint.insertAdjacentElement("afterend", notice);
    this.currentNotice = notice;

    setTimeout(() => notice.classList.add("visible"), 50);
    setTimeout(() => this.dismiss(), AUTO_HIDE_MS);
  }

  private buildBody(minutesSaved: number | null): string {
    let body = `<strong>${this.escapeHtml(getMessage("speedPayoffNoticeHeadline"))}</strong>`;
    if (minutesSaved != null) {
      const line = getMessage("speedPayoffNoticeMinutes", String(minutesSaved));
      body += `<br><span class="saypi-speed-notice-minutes">${this.escapeHtml(line)}</span>`;
    }
    return body;
  }

  private escapeHtml(text: string): string {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
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

export const getSpeedPayoffNoticeModule = (): SpeedPayoffNoticeModule =>
  SpeedPayoffNoticeModule.getInstance();
