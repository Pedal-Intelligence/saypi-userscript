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

  document.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('saypi.settings.selectedTab') || 'general';
    selectTab(saved);
    document.querySelectorAll('.tab-button').forEach((btn) => {
      // add colored icon container + Lucide SVG icon
      if (!btn.querySelector('.icon-circle')) {
        const wrap = document.createElement('span');
        wrap.className = 'icon-circle';
        const iconName = btn.dataset.tab;
        const lucideName = iconName === 'chat' ? 'bot-message-square' : iconName === 'general' ? 'settings' : iconName === 'dictation' ? 'mic' : 'info';
        renderLucideIconInto(wrap, lucideName);
        btn.prepend(wrap);
      }
      btn.addEventListener('click', () => selectTab(btn.dataset.tab));
    });
    // After icons are in DOM, ask Lucide to replace data-lucide elements
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons({ nameAttr: 'data-lucide' });
    }
  });
})();


