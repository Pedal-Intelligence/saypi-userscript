// ModeSelector component for the Dictation preset selector
// Provides: stacked layout behaviors, tooltips, active icon state, lucide rendering, persistence

(function () {
	class ModeSelector {
		constructor(options) {
			this.containerId = options.containerId;
			this.sliderId = options.sliderId;
			this.labelId = options.labelId;
			this.storageKey = options.storageKey;
			this.values = options.values; // [{ id, i18nLabelKey, i18nDescriptionKey, lucide }]
		}

		init() {
			this.container = document.getElementById(this.containerId);
			this.slider = document.getElementById(this.sliderId);
			this.label = document.getElementById(this.labelId);
			if (!this.container || !this.slider || !this.label) return;

			// tooltips on icon chips (using title attribute)
			this.values.forEach((v) => {
				const iconEl = document.getElementById(v.id);
				if (iconEl) {
					iconEl.setAttribute('title', chrome.i18n.getMessage(v.i18nLabelKey));
				}
			});

			// Initial state from storage
			this.getStoredValue(this.storageKey, this.values[1].id).then((current) => {
				const index = Math.max(0, this.values.findIndex((v) => v.id === current));
				this.setIndex(index);
			});

			// Bind slider change
			this.slider.addEventListener('input', () => {
				const index = Number(this.slider.value);
				this.setIndex(index);
				this.save(this.storageKey, this.values[index].id);
			});

			// Icon clicks
			this.values.forEach((v, idx) => {
				const iconEl = document.getElementById(v.id);
				if (iconEl) {
					iconEl.addEventListener('click', () => {
						this.setIndex(idx);
						this.save(this.storageKey, v.id);
					});
				}
			});
		}

		setIndex(index) {
			this.slider.value = String(index);
			const v = this.values[index];
			if (!v) return;
			// label
			this.label.textContent = chrome.i18n.getMessage(v.i18nLabelKey);
			// description visibility
			const descriptions = this.container.querySelectorAll('.description');
			descriptions.forEach((d) => {
				d.classList.toggle('selected', d.getAttribute('data-i18n') === v.i18nDescriptionKey);
			});
			// active icon state
			this.values.forEach((vv) => {
				const iconEl = document.getElementById(vv.id);
				if (iconEl) iconEl.classList.toggle('active', vv.id === v.id);
			});
			// lucide refresh
			if (window.lucide && typeof window.lucide.createIcons === 'function') {
				window.lucide.createIcons({ nameAttr: 'data-lucide' });
			}
		}

		getStoredValue(key, defaultValue) {
			return new Promise((resolve) => {
				if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) {
					resolve(defaultValue);
					return;
				}
				chrome.storage.local.get([key], (result) => {
					if (chrome.runtime && chrome.runtime.lastError) {
						resolve(defaultValue);
					} else if (result && result[key] !== undefined) {
						resolve(result[key]);
					} else {
						resolve(defaultValue);
					}
				});
			});
		}

		save(key, value) {
			chrome.storage.local.set({ [key]: value }, function () {
				console.log(`Preference saved: ${key} ${value}`);
			});
		}
	}

	window.ModeSelector = ModeSelector;
})();
