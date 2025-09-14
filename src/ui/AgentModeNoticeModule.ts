import EventBus from "../events/EventBus";
import { UserPreferenceModule } from "../prefs/PreferenceModule";
import { Chatbot } from "../chatbots/Chatbot";
import getMessage from "../i18n";
import { openSettings } from "../popup/popupopener";
import { ChatbotService } from "../chatbots/ChatbotService";
import { IconModule } from "../icons/IconModule";

export class AgentModeNoticeModule {
  private static instance: AgentModeNoticeModule;
  private preferenceModule: UserPreferenceModule;
  private currentNotice: HTMLElement | null = null;
  private dismissedState: Map<string, boolean> = new Map();
  private storageKey = "saypi-agent-notice-dismissed";
  private cachedChatbot: Chatbot | null = null;

  private constructor() {
    this.preferenceModule = UserPreferenceModule.getInstance();
    this.loadDismissedState();
    this.setupEventListeners();
  }

  public static getInstance(): AgentModeNoticeModule {
    if (!AgentModeNoticeModule.instance) {
      AgentModeNoticeModule.instance = new AgentModeNoticeModule();
    }
    return AgentModeNoticeModule.instance;
  }

  private loadDismissedState(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.dismissedState = new Map(Object.entries(parsed));
      }
    } catch (error) {
      console.debug("Failed to load agent notice dismissed state:", error);
    }
  }

  private saveDismissedState(): void {
    try {
      const obj = Object.fromEntries(this.dismissedState);
      localStorage.setItem(this.storageKey, JSON.stringify(obj));
    } catch (error) {
      console.debug("Failed to save agent notice dismissed state:", error);
    }
  }

  private setupEventListeners(): void {
    // Listen for preference changes that affect agent mode
    EventBus.on("userPreferenceChanged", (changes) => {
      if ("discretionaryMode" in changes) {
        this.handleAgentModeChange(changes.discretionaryMode);
      }
      
      // Handle nickname changes - refresh the notice if it's currently shown
      if ("nickname" in changes) {
        this.handleNicknameChange(changes.nickname);
      }
    });
  }

  private handleAgentModeChange(isAgentMode: boolean): void {
    if (isAgentMode) {
      // Small delay to ensure DOM is ready
      setTimeout(async () => await this.showNoticeIfNeeded(), 100);
    } else {
      this.hideNotice().catch(error => {
        console.debug('Failed to hide agent notice:', error);
      });
    }
  }

  private handleNicknameChange(newNickname: string | null): void {
    // If there's a notice currently shown and agent mode is still active, refresh it
    if (this.currentNotice && 
        document.contains(this.currentNotice) && 
        this.preferenceModule.getCachedDiscretionaryMode()) {
      
      // Force refresh the notice with updated nickname (async, no need to await)
      this.showNoticeIfNeeded(newNickname).catch(error => {
        console.debug('Failed to refresh agent notice after nickname change:', error);
      });
    }
  }

  private async getChatbot(): Promise<Chatbot> {
    if (!this.cachedChatbot) {
      this.cachedChatbot = await ChatbotService.getChatbot();
    }
    return this.cachedChatbot;
  }

  public async showNoticeIfNeeded(overrideNickname?: string | null): Promise<void> {
    // Check if agent mode is active
    const isAgentMode = this.preferenceModule.getCachedDiscretionaryMode();
    if (!isAgentMode) {
      return;
    }

    // Get chatbot instance (cached)
    const currentChatbot = await this.getChatbot();
    const chatbotId = currentChatbot.getID();
    
    // Get chatbot name - use override if provided, otherwise get from chatbot
    const chatbotName = overrideNickname !== undefined 
      ? (overrideNickname || currentChatbot.getName() || currentChatbot.getID())
      : await currentChatbot.getNickname();

    // Check if already dismissed for this chatbot
    if (this.dismissedState.get(chatbotId)) {
      return;
    }

    // If notice is already shown and we have an override nickname, hide first to refresh
    if (this.currentNotice && document.contains(this.currentNotice) && overrideNickname !== undefined) {
      await this.hideNotice();
    }
    // Otherwise, if notice is already shown without override, skip
    else if (this.currentNotice && document.contains(this.currentNotice)) {
      return;
    }

    await this.createAndShowNotice(chatbotId, chatbotName);
  }


  private async createAndShowNotice(chatbotId: string, chatbotName: string): Promise<void> {
    await this.hideNotice(); // Remove any existing notice

    const notice = document.createElement("div");
    notice.className = "saypi-agent-notice";
    notice.setAttribute("data-chatbot", chatbotId);

    // Notice content
    const content = document.createElement("div");
    content.className = "saypi-agent-notice-content";

    // Icon
    const iconContainer = document.createElement("div");
    iconContainer.className = "saypi-agent-notice-icon";
    
    // Use bot icon from IconModule (Lucide bot icon)
    try {
      const botIcon = IconModule.bot.cloneNode(true) as SVGElement;
      botIcon.setAttribute("class", "saypi-agent-notice-robot-icon");
      botIcon.setAttribute("width", "20");
      botIcon.setAttribute("height", "20");
      iconContainer.appendChild(botIcon);
    } catch {
      // Fallback to simple emoji or text
      iconContainer.innerHTML = "🤖";
    }
    
    content.appendChild(iconContainer);

    // Text content
    const textContainer = document.createElement("div");
    textContainer.className = "saypi-agent-notice-text";

    const rawMessage = getMessage("agentModeNoticeMessage", [chatbotName]);
    textContainer.innerHTML = this.formatNoticeMessage(rawMessage);

    content.appendChild(textContainer);

    // Close button
    const closeButton = document.createElement("button");
    closeButton.className = "saypi-agent-notice-close";
    closeButton.setAttribute("aria-label", getMessage("dismissNotice") || "Dismiss");
    closeButton.innerHTML = "×";
    closeButton.addEventListener("click", () => this.dismissNotice(chatbotId));

    content.appendChild(closeButton);
    notice.appendChild(content);

    // Inject into appropriate location
    this.injectNotice(notice, chatbotId);
    this.currentNotice = notice;

    // Show with animation
    setTimeout(() => notice.classList.add("visible"), 50);
  }

  private formatNoticeMessage(message: string): string {
    // Replace placeholders with actual links
    const agentModeLink = `<a href="https://www.saypi.ai/agents" target="_blank" rel="noopener noreferrer" class="saypi-agent-notice-link">${getMessage("agentMode") || "agent mode"}</a>`;
    const settingsLink = `<a href="#" class="saypi-agent-notice-link saypi-settings-link">${getMessage("settings") || "settings"}</a>`;
    
    return message
      .replace(/\{agentModeLink\}/g, agentModeLink)
      .replace(/\{settingsLink\}/g, settingsLink);
  }

  private injectNotice(notice: HTMLElement, chatbotId: string): void {
    const injectionPoint = this.findInjectionPoint(chatbotId);
    if (injectionPoint) {
      // Insert after the injection point
      injectionPoint.insertAdjacentElement("afterend", notice);
      
      // Set up settings link click handler
      const settingsLink = notice.querySelector(".saypi-settings-link") as HTMLElement;
      if (settingsLink) {
        settingsLink.addEventListener("click", (e) => {
          e.preventDefault();
          openSettings();
        });
      }
    } else {
      console.debug("Could not find injection point for agent notice on", chatbotId);
    }
  }

  private findInjectionPoint(chatbotId: string): HTMLElement | null {
    // Primary approach: Use universal #saypi-chat-ancestor if available
    const chatAncestor = document.querySelector("#saypi-chat-ancestor") as HTMLElement;
    if (chatAncestor) {
      return chatAncestor;
    }

    // Fallback to chatbot-specific selectors if chat ancestor isn't found
    switch (chatbotId) {
      case "chatgpt":
        // Look for ChatGPT's unified composer form
        return document.querySelector('form[data-type="unified-composer"]') as HTMLElement;
        
      case "claude":
        // Look for Claude's prompt container fieldset
        return document.querySelector("fieldset.w-full") as HTMLElement;
        
      case "pi":
        // Look for Pi's prompt controls container
        return document.querySelector("#saypi-prompt-controls-container")?.parentElement as HTMLElement ||
               document.querySelector(".saypi-prompt-container") as HTMLElement;
        
      default:
        // Generic fallback - look for any prompt container
        return document.querySelector("#saypi-prompt-controls-container")?.parentElement as HTMLElement ||
               document.querySelector(".saypi-prompt-container") as HTMLElement ||
               document.querySelector('form[data-type="unified-composer"]') as HTMLElement;
    }
  }

  private dismissNotice(chatbotId: string): void {
    // Mark as dismissed for this chatbot
    this.dismissedState.set(chatbotId, true);
    this.saveDismissedState();
    
    // Hide the notice
    this.hideNotice().catch(error => {
      console.debug('Failed to hide agent notice:', error);
    });
  }

  private hideNotice(): Promise<void> {
    if (this.currentNotice) {
      this.currentNotice.classList.remove("visible");
      // Remove from DOM after animation
      return new Promise(resolve => {
        setTimeout(() => {
          if (this.currentNotice && this.currentNotice.parentNode) {
            this.currentNotice.parentNode.removeChild(this.currentNotice);
          }
          this.currentNotice = null;
          resolve();
        }, 300);
      });
    }
    return Promise.resolve();
  }

  // Public method to reset dismissed state (useful for testing)
  public resetDismissedState(chatbotId?: string): void {
    if (chatbotId) {
      this.dismissedState.delete(chatbotId);
    } else {
      this.dismissedState.clear();
    }
    this.saveDismissedState();
  }

  // Public method to manually trigger notice display (useful for testing)
  public async forceShowNotice(): Promise<void> {
    const currentChatbot = await this.getChatbot();
    const chatbotId = currentChatbot.getID();
    this.resetDismissedState(chatbotId);
    await this.showNoticeIfNeeded();
  }
}