import { createIcons, icons } from "lucide";
import { initIcons } from "./components/icons";
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
  if (!chrome.runtime?.getURL) return;
  
  document.querySelectorAll<HTMLImageElement>("[data-icon]").forEach((img) => {
    const asset = img.dataset.icon;
    if (!asset) return;
    img.src = chrome.runtime.getURL(`icons/${asset}`);
  });
};

class SettingsApp {
  private tabs: Map<string, TabController> = new Map();
  private navigator!: TabNavigator;
  
  async init(): Promise<void> {
    console.info("[Settings] Bootstrap starting");
    setStaticIcons();
    
    // Load legacy modules that don't need DOM (config, auth)
    await Promise.all([
      import("../../src/popup/popup-config.js"),
      import("../../src/popup/simple-user-agent.js"),
      import("../../src/popup/mode-selector.js"),
      import("../../src/popup/language-picker.js"),
      import("../../src/popup/auth-shared.js"),
    ]);
    await import("../../src/popup/auth.js");
    
    // Initialize tab modules (lazy)
    this.tabs.set('general', new GeneralTab(document.querySelector('#tab-general')!));
    this.tabs.set('chat', new ChatTab(document.querySelector('#tab-chat')!));
    this.tabs.set('dictation', new DictationTab(document.querySelector('#tab-dictation')!));
    this.tabs.set('about', new AboutTab(document.querySelector('#tab-about')!));
    
    // Load ALL tabs upfront (popup.js needs all DOM to be present)
    await Promise.all([
      this.tabs.get('general')!.init(),
      this.tabs.get('chat')!.init(),
      this.tabs.get('dictation')!.init(),
      this.tabs.get('about')!.init(),
    ]);
    
    // Mark all tabs as initialized
    this.tabs.forEach(tab => tab.initialized = true);
    
    // Initialize tab navigator (adds icons to tab buttons)
    this.navigator = new TabNavigator({
      onTabChange: (tabId) => this.switchToTab(tabId)
    });
    
    // Select initial tab (just changes visibility, HTML already loaded)
    const initialTab = localStorage.getItem('saypi.settings.selectedTab') || 'general';
    this.navigator.selectTab(initialTab);
    
    // Apply i18n after all tabs are loaded
    replaceI18n();
    
    // Initialize icons ONCE after all DOM is ready
    initIcons();
    
    // NOW load popup.js and status.js - all DOM is ready
    await import("../../src/popup/popup.js");
    await import("../../src/popup/status.js");
    await import("../../src/popup/status-subscription.js");
    
    console.info("[Settings] Bootstrap complete");
  }
  
  private async loadTab(tabId: string): Promise<void> {
    const tab = this.tabs.get(tabId);
    if (tab && !tab.initialized) {
      await tab.init();
      tab.initialized = true;
    }
  }
  
  private switchToTab(tabId: string): void {
    // All tabs are already loaded, just switching visibility
    // This is called by TabNavigator when user clicks a tab
  }
}

// Bootstrap
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new SettingsApp().init());
} else {
  new SettingsApp().init();
}
