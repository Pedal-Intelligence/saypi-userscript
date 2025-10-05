/**
 * BrowserCompatibilityModule - Centralized browser/site compatibility detection
 *
 * Detects browser and chatbot combination compatibility issues and emits events
 * for other modules to handle (UI notifications, analytics, etc.).
 *
 * This module has no UI concerns - it only detects and reports compatibility issues.
 */

import { getBrowserInfo, getTTSCompatibilityIssue } from "../UserAgentModule";
import { ChatbotIdentifier } from "../chatbots/ChatbotIdentifier";
import EventBus from "../events/EventBus";
import { logger } from "../LoggingModule";

export interface CompatibilityIssue {
  feature: 'tts' | 'vad' | 'stt';
  hasIssue: boolean;
  browserName: string;
  chatbotName: string;
  chatbotType: string;
  reason: string;
  severity: 'error' | 'warning' | 'info';
}

/**
 * Browser Compatibility Module
 * Singleton that performs compatibility checks and emits events
 */
export class BrowserCompatibilityModule {
  private static instance: BrowserCompatibilityModule;
  private issuesReported: Set<string> = new Set();

  private constructor() {
    logger.debug("[BrowserCompatibilityModule] Initialized");
  }

  public static getInstance(): BrowserCompatibilityModule {
    if (!BrowserCompatibilityModule.instance) {
      BrowserCompatibilityModule.instance = new BrowserCompatibilityModule();
    }
    return BrowserCompatibilityModule.instance;
  }

  /**
   * Check TTS compatibility for current browser/chatbot combination
   * Emits 'compatibility:tts:issue' event if incompatibility detected
   *
   * Note: ChatGPT is excluded from checks as it has native "Read Aloud" TTS
   * that works on all browsers without requiring our streaming API.
   *
   * @returns CompatibilityIssue if there's a problem, null otherwise
   */
  public checkTTSCompatibility(): CompatibilityIssue | null {
    const chatbotType = ChatbotIdentifier.identifyChatbot();

    // Handle case where chatbot type is undefined
    if (!chatbotType) {
      logger.debug("[BrowserCompatibilityModule] No chatbot type detected, skipping TTS check");
      return null;
    }

    // ChatGPT has native "Read Aloud" feature that works on all browsers
    // See: https://www.saypi.ai/chatgpt
    if (chatbotType === 'chatgpt') {
      logger.debug("[BrowserCompatibilityModule] ChatGPT uses native Read Aloud, skipping TTS check");
      return null;
    }

    const ttsIssue = getTTSCompatibilityIssue(chatbotType);

    if (ttsIssue?.hasIssue) {
      const chatbotName = this.getChatbotDisplayName(chatbotType);

      const issue: CompatibilityIssue = {
        feature: 'tts',
        hasIssue: true,
        browserName: ttsIssue.browserName,
        chatbotName,
        chatbotType: chatbotType, // Explicit assignment to satisfy TypeScript
        reason: ttsIssue.reason,
        severity: 'warning' // TTS failure is warning, not error (STT still works)
      };

      // Emit event for UI/analytics/logging
      this.emitCompatibilityIssue(issue);

      return issue;
    }

    return null;
  }

  /**
   * Emit compatibility issue event (only once per unique issue)
   * Uses deduplication to avoid spamming the same issue multiple times
   */
  private emitCompatibilityIssue(issue: CompatibilityIssue): void {
    const issueKey = `${issue.feature}:${issue.browserName}:${issue.chatbotType}:${issue.reason}`;

    // Deduplicate - only emit each unique issue once per session
    if (this.issuesReported.has(issueKey)) {
      logger.debug(`[BrowserCompatibilityModule] Issue already reported: ${issueKey}`);
      return;
    }

    this.issuesReported.add(issueKey);

    logger.warn(
      `[BrowserCompatibilityModule] Compatibility issue detected: ${issue.feature} unavailable on ${issue.browserName} + ${issue.chatbotName}`,
      { reason: issue.reason, severity: issue.severity }
    );

    // Emit event for listeners (UI notification modules, analytics, etc.)
    EventBus.emit('compatibility:issue', issue);
  }

  /**
   * Get user-friendly chatbot display name
   */
  private getChatbotDisplayName(chatbotType: string): string {
    switch (chatbotType) {
      case 'claude':
        return 'Claude';
      case 'chatgpt':
        return 'ChatGPT';
      case 'pi':
        return 'Pi';
      default:
        return chatbotType;
    }
  }

  /**
   * Reset reported issues (mainly for testing)
   */
  public resetReportedIssues(): void {
    this.issuesReported.clear();
  }
}
