import { createIcons, icons } from "lucide";
import "../../src/popup/toggle.css";
import "../../src/popup/language-picker.css";
import "../../src/popup/status.css";
import "../../src/popup/consent.css";
import "../../src/popup/preferences.css";
import "../../src/popup/usage.css";
import "../../src/popup/beta.css";
import "../../src/popup/tabs.css";

(window as typeof window & { lucide?: { createIcons: typeof createIcons; icons: typeof icons } }).lucide = {
  createIcons,
  icons,
};

const setStaticIcons = () => {
  if (!chrome.runtime?.getURL) {
    return;
  }

  document.querySelectorAll<HTMLImageElement>("[data-icon]").forEach((img) => {
    const asset = img.dataset.icon;
    if (!asset) return;
    img.src = chrome.runtime.getURL(`src/icons/${asset}`);
  });
};

const bootstrap = async () => {
  setStaticIcons();

  const sequentialImports: Array<() => Promise<unknown>> = [
    () => import("../../src/popup/tabs.js"),
    () => import("../../src/popup/mode-selector.js"),
    () => import("../../src/popup/popup-config.js"),
    () => import("../../src/popup/simple-user-agent.js"),
    () => import("../../src/popup/language-picker.js"),
    () => import("../../src/popup/auth-shared.js"),
    () => import("../../src/popup/auth.js"),
    () => import("../../src/popup/popup.js"),
    () => import("../../src/popup/status.js"),
    () => import("../../src/popup/status-subscription.js"),
  ];

  for (const loader of sequentialImports) {
    try {
      await loader();
    } catch (error) {
      console.error("[Popup] Failed to load module", error);
    }
  }
};

bootstrap().catch((error) => {
  console.error("[Popup] Bootstrap failure", error);
});
