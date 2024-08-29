import { enterFullscreen, exitFullscreen } from "./FullscreenModule.ts";
import { UserPreferenceModule } from "./prefs/PreferenceModule.ts";
import { addChild } from "./dom/DOMModule.ts";
import { ThemeManager } from "./themes/ThemeManagerModule.ts";
import { ImmersionStateChecker } from "./ImmersionServiceLite.ts";

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
    this.userPreferences.getPrefersImmersiveView().then((immersive) => {
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
    localStorage.setItem("userViewPreference", "desktop"); // Save preference

    const element = document.documentElement;
    element.classList.remove("immersive-view");
    element.classList.add("desktop-view");

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
    enterFullscreen();
    this.userPreferences.getTheme().then((theme) => {
      this.themeManager.applyTheme(theme);
    });
  }
}
