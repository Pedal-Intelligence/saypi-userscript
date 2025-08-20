(function () {
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
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '16');
        svg.setAttribute('height', '16');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('stroke-width', '2');
        svg.setAttribute('stroke-linecap', 'round');
        svg.setAttribute('stroke-linejoin', 'round');

        const iconName = btn.dataset.tab;
        const add = (tag, attrs) => {
          const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
          Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
          svg.appendChild(el);
        };
        switch (iconName) {
          case 'general': // settings
            add('path', { d: 'M12 1v2' });
            add('path', { d: 'M12 21v2' });
            add('path', { d: 'M4.22 4.22l1.42 1.42' });
            add('path', { d: 'M18.36 18.36l1.42 1.42' });
            add('path', { d: 'M1 12h2' });
            add('path', { d: 'M21 12h2' });
            add('path', { d: 'M4.22 19.78l1.42-1.42' });
            add('path', { d: 'M18.36 5.64l1.42-1.42' });
            add('circle', { cx: '12', cy: '12', r: '3' });
            break;
          case 'chat': // message-circle
            add('path', { d: 'M21 11.5a8.38 8.38 0 1 1-3.3-6.7L22 3l-1.5 4.3A8.2 8.2 0 0 1 21 11.5z' });
            break;
          case 'dictation': // mic
            add('path', { d: 'M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z' });
            add('path', { d: 'M19 10v2a7 7 0 0 1-14 0v-2' });
            add('line', { x1: '12', y1: '19', x2: '12', y2: '22' });
            break;
          default: // about -> info
            add('circle', { cx: '12', cy: '12', r: '10' });
            add('line', { x1: '12', y1: '16', x2: '12', y2: '12' });
            add('line', { x1: '12', y1: '8', x2: '12.01', y2: '8' });
        }
        wrap.appendChild(svg);
        btn.prepend(wrap);
      }
      btn.addEventListener('click', () => selectTab(btn.dataset.tab));
    });
  });
})();


