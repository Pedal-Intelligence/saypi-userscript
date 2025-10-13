export interface TabNavigatorOptions {
  onTabChange?: (tabId: string) => void;
}

export class TabNavigator {
  private currentTab: string = 'general';
  
  constructor(private options: TabNavigatorOptions = {}) {
    this.init();
  }
  
  private init(): void {
    const buttons = document.querySelectorAll<HTMLButtonElement>('.tab-button');
    console.info(`[TabNavigator] Found ${buttons.length} tab buttons`);
    
    buttons.forEach((btn, i) => {
      // Add icon if not present
      if (!btn.querySelector('.icon-circle')) {
        console.info(`[TabNavigator] Adding icon to button ${i + 1} (${btn.dataset.tab})`);
        this.addIconToButton(btn);
      } else {
        console.info(`[TabNavigator] Button ${i + 1} already has icon`);
      }
      
      btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        if (tabId) this.selectTab(tabId);
      });
    });
    
    // Count icons after adding to buttons
    const iconsAfter = document.querySelectorAll('[data-lucide]');
    console.info(`[TabNavigator] Total [data-lucide] elements after init: ${iconsAfter.length}`);
  }
  
  private addIconToButton(btn: HTMLButtonElement): void {
    const iconMap: Record<string, string> = {
      chat: 'bot-message-square',
      general: 'settings',
      dictation: 'mic',
      about: 'info'
    };
    
    const tabId = btn.dataset.tab || '';
    const iconName = iconMap[tabId] || 'info';
    const labelText = btn.textContent?.trim() || '';
    
    console.info(`[TabNavigator] Creating icon for ${tabId}: ${iconName}`);
    
    const wrap = document.createElement('span');
    wrap.className = 'icon-circle';
    
    const icon = document.createElement('i');
    icon.setAttribute('data-lucide', iconName);
    wrap.appendChild(icon);
    
    btn.textContent = '';
    btn.appendChild(wrap);
    
    if (labelText) {
      const label = document.createElement('span');
      label.className = 'tab-label';
      label.textContent = labelText;
      btn.appendChild(label);
    }
    
    console.info(`[TabNavigator] Icon added to ${tabId} button`);
  }
  
  selectTab(tabId: string): void {
    this.currentTab = tabId;
    
    // Update button states
    document.querySelectorAll('.tab-button').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
    });
    
    // Update panel visibility
    document.querySelectorAll('.tab-panel').forEach(panel => {
      panel.classList.toggle('hidden', panel.id !== `tab-${tabId}`);
    });
    
    // Save selection
    try {
      localStorage.setItem('saypi.settings.selectedTab', tabId);
    } catch (e) {
      console.warn('Failed to save tab selection:', e);
    }
    
    // Notify callback
    if (this.options.onTabChange) {
      this.options.onTabChange(tabId);
    }
  }
}

