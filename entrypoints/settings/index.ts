import { createIcons, icons } from "lucide";
import "../../src/popup/tailwind.min.css";
import "../../src/popup/toggle.css";
import "../../src/popup/language-picker.css";
import "../../src/popup/status.css";
import "../../src/popup/consent.css";
import "../../src/popup/preferences.css";
import "../../src/popup/usage.css";
import "../../src/popup/beta.css";
import "../../src/popup/tabs.css";

console.info("[Popup] entrypoints/popup/index.ts executing");

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
    img.src = chrome.runtime.getURL(`icons/${asset}`);
  });
};

const bootstrap = async () => {
  console.info("[Popup] Bootstrap starting");
  setStaticIcons();

  try {
    // Load independent modules in parallel first
    await Promise.all([
      import("../../src/popup/tabs.js"),
      import("../../src/popup/mode-selector.js"),
      import("../../src/popup/popup-config.js"),
      import("../../src/popup/simple-user-agent.js"),
      import("../../src/popup/language-picker.js"),
    ]);

    // Load auth modules sequentially (auth-shared must come before auth.js)
    await import("../../src/popup/auth-shared.js");
    await import("../../src/popup/auth.js");

    // Load main popup and status modules in parallel
    await Promise.all([
      import("../../src/popup/popup.js"),
      import("../../src/popup/status.js"),
    ]);

    // Load status-subscription last as it may depend on popup.js
    await import("../../src/popup/status-subscription.js");

    console.info("[Popup] Bootstrap finished");
  } catch (error) {
    console.error("[Popup] Failed to load module", error);
  }
};

bootstrap().catch((error) => {
  console.error("[Popup] Bootstrap failure", error);
});
