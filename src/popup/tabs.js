(function () {
  function renderLucideIconInto(container, name) {
    const i = document.createElement('i');
    i.setAttribute('data-lucide', name);
    container.appendChild(i);
  }
  function selectTab(tab) {
    document.querySelectorAll('.tab-button').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    document.querySelectorAll('.tab-panel').forEach((panel) => {
      panel.classList.toggle('hidden', panel.id !== `tab-${tab}`);
    });
    try {
      localStorage.setItem('saypi.settings.selectedTab', tab);
    } catch (e) {}
  }

  function initializeTabs() {
    const saved = localStorage.getItem('saypi.settings.selectedTab') || 'general';
    selectTab(saved);
    document.querySelectorAll('.tab-button').forEach((btn) => {
      // add colored icon container + Lucide SVG icon
      if (!btn.querySelector('.icon-circle')) {
        const wrap = document.createElement('span');
        wrap.className = 'icon-circle';
        const iconName = btn.dataset.tab;
        const TAB_ICON_MAP = {
          chat: 'bot-message-square',
          general: 'settings',
          dictation: 'mic'
        };
        const lucideName = TAB_ICON_MAP[iconName] || 'info';
        renderLucideIconInto(wrap, lucideName);

        // Capture existing text as the label and rebuild content structure
        const labelText = (btn.textContent || '').trim();
        btn.textContent = '';
        btn.appendChild(wrap);
        if (labelText) {
          const label = document.createElement('span');
          label.className = 'tab-label';
          label.textContent = labelText;
          btn.appendChild(label);
        }
      }
      btn.addEventListener('click', () => selectTab(btn.dataset.tab));
    });
    // Icons will be initialized centrally by index.ts after all modules load
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTabs, { once: true });
  } else {
    initializeTabs();
  }
})();

export {};
