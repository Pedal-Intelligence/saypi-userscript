import { enterFullscreen, exitFullscreen } from "./FullscreenModule.ts";
import { UserPreferenceModule } from "./prefs/PreferenceModule.ts";
import { addChild, createSVGElement } from "./dom/DOMModule.ts";
import { ThemeManager } from "./themes/ThemeManagerModule.ts";
import { ImmersionStateChecker } from "./ImmersionServiceLite.ts";
import getMessage from "./i18n.ts";
import exitIconSVG from "./icons/exit.svg?raw";

function attachCallButton() {
  // move the call button back into the text prompt container for desktop view
  const container = document.getElementById("saypi-prompt-controls-container");
  const callButton = document.getElementById("saypi-callButton");
  if (container && callButton) {
    addChild(container, callButton, -1);
  }
}

function detachCallButton() {
  // remove the call button from the text prompt container while in mobile view
  const callButton = document.getElementById("saypi-callButton");
  if (callButton) {
    addChild(document.body, callButton);
  }
}

const ESCAPE_RESET_DELAY_MS = 1000;
let emergencyExitListener = null;
let lastEscapeTimestamp = 0;
let emergencyExitButton = null;
let emergencyExitButtonOwned = false;

function getHostname() {
  const override = globalThis?.__SAYPI_HOST_OVERRIDE__;
  if (typeof override === "string" && override.length > 0) {
    return override;
  }
  return window.location.hostname ?? "";
}

function isChatGPTHost() {
  const hostname = getHostname();
  return (
    hostname.includes("chatgpt.com") ||
    hostname.includes("chat.openai.com") ||
    hostname.includes("chat.com")
  );
}

function ensureEmergencyExitButton() {
  if (!isChatGPTHost()) {
    return null;
  }
  if (emergencyExitButton && emergencyExitButton.isConnected) {
    return emergencyExitButton;
  }
  const existingButton = document.getElementById("saypi-exit-button");
  if (existingButton) {
    emergencyExitButton = existingButton;
    emergencyExitButtonOwned = false;
    return emergencyExitButton;
  }
  if (!document.body) {
    return null;
  }

  const button = document.createElement("button");
  button.id = "saypi-exit-button";
  button.type = "button";
  button.className =
    "saypi-control-button rounded-full bg-cream-550 enabled:hover:bg-cream-650 tooltip mini saypi-exit-button";
  const label = getMessage("exitImmersiveModeLong");
  button.setAttribute("aria-label", label);
  button.title = label;
  button.style.display = "none";

  try {
    const icon = createSVGElement(exitIconSVG);
    button.appendChild(icon);
  } catch (error) {
    console.warn("Failed to render emergency exit icon", error);
  }

  button.addEventListener("click", () => ImmersionService.exitImmersiveMode());
  document.body.appendChild(button);
  emergencyExitButton = button;
  emergencyExitButtonOwned = true;
  return emergencyExitButton;
}

function removeEmergencyExitButton() {
  if (emergencyExitButtonOwned && emergencyExitButton && emergencyExitButton.isConnected) {
    emergencyExitButton.remove();
  }
  emergencyExitButton = null;
  emergencyExitButtonOwned = false;
}

function activateEmergencyEscape() {
  ensureEmergencyExitButton();
  if (emergencyExitListener) {
    return;
  }
  emergencyExitListener = (event) => {
    if (event.key !== "Escape") {
      return;
    }

    if (document.fullscreenElement) {
      exitFullscreen();
    }

    const now = Date.now();
    if (!lastEscapeTimestamp || now - lastEscapeTimestamp > ESCAPE_RESET_DELAY_MS) {
      lastEscapeTimestamp = now;
      return;
    }

    lastEscapeTimestamp = 0;
    ImmersionService.exitImmersiveMode();
  };
  document.addEventListener("keydown", emergencyExitListener, true);
}

function deactivateEmergencyEscape() {
  if (emergencyExitListener) {
    document.removeEventListener("keydown", emergencyExitListener, true);
    emergencyExitListener = null;
  }
  lastEscapeTimestamp = 0;
  removeEmergencyExitButton();
}

export class ImmersionService {
  /**
   * A service that manages the immersive view mode
   * Uses dependency injection to access the chatbot
   * @param {Chatbot} chatbot
   */
  constructor(chatbot) {
    this.chatbot = chatbot;
    this.userPreferences = UserPreferenceModule.getInstance();
    this.themeManager = ThemeManager.getInstance();
  }

  /**
   * Perform initial setup of the UI based on the view preferences
   */
  initMode() {
    return this.userPreferences.getPrefersImmersiveView().then((immersive) => {
      if (isChatGPTHost()) {
        if (immersive) {
          ImmersionService.exitImmersiveMode();
          if (typeof this.userPreferences.setPrefersImmersiveView === "function") {
            this.userPreferences.setPrefersImmersiveView(false);
          }
          return;
        }
        if (ImmersionStateChecker.isViewImmersive()) {
          ImmersionService.exitImmersiveMode();
        }
      }

      if (immersive) {
        this.enterImmersiveMode();
      } else {
        ImmersionService.exitImmersiveMode();
      }
    });
  }

  // this function determines whether the immersive view is currently active
  //@deprecated use ImmersionStateChecker.isViewImmersive() instead
  static isViewImmersive() {
    return ImmersionStateChecker.isViewImmersive();
  }

  static exitImmersiveMode() {
    try {
      localStorage.setItem("userViewPreference", "standard");
    } catch (error) {
      console.warn("Unable to persist immersive preference", error);
    }

    const element = document.documentElement;
    element.classList.remove("immersive-view");
    element.classList.add("desktop-view");

    if (document.body) {
      document.body.classList.remove("focus");
    }

    deactivateEmergencyEscape();

    attachCallButton();
    exitFullscreen();
  }

  enterImmersiveMode() {
    localStorage.setItem("userViewPreference", "immersive"); // Save preference

    // if not already on the talk page, navigate to it
    // this is to ensure the user is not stuck in the immersive view on a non-chat page
    const currentPath = window.location.pathname;
    if (!this.chatbot.isChatablePath(currentPath)) {
      const path = this.chatbot.getChatPath();
      if (window.location.pathname !== path) {
        // Get the current redirect count
        let redirectCount = localStorage.getItem("redirectCount");
        if (!redirectCount) {
          redirectCount = 0;
        }

        // If the redirect count is less than the limit, attempt a redirect
        if (redirectCount < 3) {
          localStorage.setItem("redirectCount", ++redirectCount);
          window.location = path;
        } else {
          // Reset the redirect count
          localStorage.removeItem("redirectCount");
          console.warn(
            "Redirect limit reached. Unable to redirect to chat page."
          );
        }
      }
    }

    const element = document.documentElement;
    element.classList.remove("desktop-view");
    element.classList.add("immersive-view");

    detachCallButton();
    activateEmergencyEscape();
    enterFullscreen();
    this.userPreferences.getTheme().then((theme) => {
      this.themeManager.applyTheme(theme);
    });
  }
}
