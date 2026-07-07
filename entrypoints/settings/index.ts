import { browser } from "wxt/browser";
import type { PublicPath } from "wxt/browser";
import { createIcons, icons } from "lucide";
import { initIcons, refreshIcons } from "./components/icons";
import { SettingsHeader } from "./components/header";
import { TabNavigator } from "./components/tabs";
import { GeneralTab } from "./tabs/general";
import { ChatTab } from "./tabs/chat";
import { DictationTab } from "./tabs/dictation";
import { VoicesTab, setInitialVoicesHost } from "./tabs/voices";
import { AboutTab } from "./tabs/about";
import { replaceI18n } from "./shared/i18n";
import type { TabController } from "./shared/types";
import {
  SETTINGS_DEEP_LINK_KEY,
  parseSettingsDeepLink,
} from "../../src/popup/popupopener";
import { settingsWindowGrowthFor } from "../../src/popup/settingsWindowSize";

// Styles
import "./styles/base.css"; // reset + utilities (replaces the 2.9 MB Tailwind v2 dump)
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
    img.src = browser.runtime.getURL(`icons/${asset}` as PublicPath);
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
    this.tabs.set('voices', new VoicesTab(document.querySelector('#tab-voices')!));
    this.tabs.set('about', new AboutTab(document.querySelector('#tab-about')!));

    // Determine which tab to show initially: a one-shot deep link (set by
    // openSettings(tab) from a content script, e.g. the voice menus' "More
    // voices…" row) wins over the last-viewed tab. A "tab/detail" value also
    // scopes the tab — "voices/pi" opens the Voices studio on Pi.
    let initialTab = localStorage.getItem('saypi.settings.selectedTab') || 'general';
    try {
      const stored = await chrome.storage.local.get(SETTINGS_DEEP_LINK_KEY);
      const link = parseSettingsDeepLink(stored?.[SETTINGS_DEEP_LINK_KEY]);
      if (link && this.tabs.has(link.tab)) {
        initialTab = link.tab;
        if (link.tab === 'voices' && link.detail) {
          setInitialVoicesHost(link.detail);
        }
      }
      if (stored?.[SETTINGS_DEEP_LINK_KEY] !== undefined) {
        await chrome.storage.local.remove(SETTINGS_DEEP_LINK_KEY);
      }
    } catch (e) {
      // Deep link is best-effort; fall back to the last-viewed tab
    }

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
    void this.ensureRoomFor(tabId);
    await this.loadTab(tabId);
  }

  /**
   * Adaptive window sizing (macOS System Settings pattern): the compact popup
   * grows — never shrinks — when a roomy pane (the Voices studio) is shown.
   * Only applies to the popup window the extension created; when settings
   * lives in a normal browser tab, the tab manages itself.
   */
  private async ensureRoomFor(tabId: string): Promise<void> {
    try {
      const win = await browser.windows.getCurrent();
      if (win.type !== 'popup' || win.id === undefined) return;
      const growth = settingsWindowGrowthFor(
        tabId,
        { width: win.width ?? 0, height: win.height ?? 0 },
        {
          availWidth: window.screen.availWidth,
          availHeight: window.screen.availHeight,
        }
      );
      if (growth) await browser.windows.update(win.id, growth);
    } catch (e) {
      // Sizing is a nicety — never let it break the settings page.
    }
  }
}

// Bootstrap
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new SettingsApp().init());
} else {
  new SettingsApp().init();
}
