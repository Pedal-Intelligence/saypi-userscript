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
    buttons.forEach(btn => {
      // Add icon if not present
      if (!btn.querySelector('.icon-circle')) {
        this.addIconToButton(btn);
      }
      
      btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        if (tabId) this.selectTab(tabId);
      });
    });
    
    // Don't auto-select here - let the app handle initial tab loading
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

