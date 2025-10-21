import { browser } from "wxt/browser";
import { createIcons, icons } from "lucide";
import { initIcons, refreshIcons } from "./components/icons";
import { SettingsHeader } from "./components/header";
import { TabNavigator } from "./components/tabs";
import { GeneralTab } from "./tabs/general";
import { ChatTab } from "./tabs/chat";
import { DictationTab } from "./tabs/dictation";
import { AboutTab } from "./tabs/about";
import { replaceI18n } from "./shared/i18n";
import type { TabController } from "./shared/types";

// Styles
import "../../src/popup/tailwind.min.css";
import "../../src/popup/toggle.css";
import "../../src/popup/language-picker.css";
import "../../src/popup/status.css";
import "../../src/popup/consent.css";
import "../../src/popup/preferences.css";
import "../../src/popup/usage.css";
import "../../src/popup/beta.css";
import "../../src/popup/tabs.css";
import "./styles/global.css";

console.info("[Settings] Initializing");

// Expose lucide globally ONCE
(window as any).lucide = { createIcons, icons };

const setStaticIcons = () => {
  if (!browser.runtime?.getURL) return;

  document.querySelectorAll<HTMLImageElement>("[data-icon]").forEach((img) => {
    const asset = img.dataset.icon;
    if (!asset) return;
    img.src = browser.runtime.getURL(`icons/${asset}`);
  });
};

class SettingsApp {
  private header!: SettingsHeader;
  private tabs: Map<string, TabController> = new Map();
  private navigator!: TabNavigator;

  async init(): Promise<void> {
    console.info("[Settings] Bootstrap starting");

    const headerRoot = document.querySelector<HTMLElement>('.settings-header');
    if (!headerRoot) {
      throw new Error("[Settings] Header root element not found");
    }

    this.header = new SettingsHeader(headerRoot);
    this.header.render();

    setStaticIcons();

    // Load legacy modules that don't need DOM (config, auth-shared only)
    await Promise.all([
      import("../../src/popup/simple-user-agent.js"),
      import("../../src/popup/mode-selector.js"),
      import("../../src/popup/language-picker.js"),
      import("../../src/popup/auth-shared.js"),
    ]);

    // Initialize tab controllers
    this.tabs.set('general', new GeneralTab(document.querySelector('#tab-general')!));
    this.tabs.set('chat', new ChatTab(document.querySelector('#tab-chat')!));
    this.tabs.set('dictation', new DictationTab(document.querySelector('#tab-dictation')!));
    this.tabs.set('about', new AboutTab(document.querySelector('#tab-about')!));

    // Determine which tab to show initially
    const initialTab = localStorage.getItem('saypi.settings.selectedTab') || 'general';

    // Load only the initial tab
    await this.loadTab(initialTab);

    // Initialize tab navigator (adds icons to tab buttons)
    this.navigator = new TabNavigator({
      onTabChange: (tabId) => this.switchToTab(tabId)
    });

    // Select initial tab
    this.navigator.selectTab(initialTab);

    // Apply i18n after initial tab is loaded
    replaceI18n();

    // Initialize icons ONCE after initial DOM is ready
    initIcons();

    // Initialize auth (auth button is in header, always present)
    await import("../../src/popup/auth.js");

    // Load status subscription handler
    await import("../../src/popup/status-subscription.js");

    console.info("[Settings] Bootstrap complete");
  }

  private async loadTab(tabId: string): Promise<void> {
    const tab = this.tabs.get(tabId);
    if (!tab) return;

    if (!tab.initialized) {
      try {
        await tab.init();
        tab.initialized = true;

        // Refresh i18n and icons for newly loaded tab
        replaceI18n();
        refreshIcons();

        // For General tab: update quota display based on auth state
        if (tabId === 'general' && (window as any).updateQuotaDisplayForAuthState) {
          await (window as any).updateQuotaDisplayForAuthState();
        }
      } catch (error) {
        console.error(`[Settings] Failed to load ${tabId} tab:`, error);
      }
    }
  }

  private async switchToTab(tabId: string): Promise<void> {
    // Load tab on-demand when user switches to it
    await this.loadTab(tabId);
  }
}

// Bootstrap
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new SettingsApp().init());
} else {
  new SettingsApp().init();
}
