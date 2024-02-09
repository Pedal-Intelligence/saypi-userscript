import { buttonModule } from "./ButtonModule.js";
import { addChild } from "./DOMModule.ts";
import { enterFullscreen, exitFullscreen } from "./FullscreenModule.ts";
import { UserPreferenceModule } from "./prefs/PreferenceModule.ts";

export function isMobileDevice() {
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.matchMedia("(max-width: 1024px)").matches // fallback for devices that don't have a recognisable mobile user agent, like iPad Pro
  );
}

// this function determines whether the immersive view is currently active
export function isViewImmersive() {
  const element = document.documentElement;
  return element.classList.contains("immersive-view");
}

export function exitImmersiveMode() {
  localStorage.setItem("userViewPreference", "desktop"); // Save preference

  const element = document.documentElement;
  element.classList.remove("immersive-view");
  element.classList.add("desktop-view");

  attachCallButton();
  exitFullscreen();
}

export function enterImmersiveMode() {
  localStorage.setItem("userViewPreference", "immersive"); // Save preference

  const element = document.documentElement;
  element.classList.remove("desktop-view");
  element.classList.add("immersive-view");

  detachCallButton();

  if (isMobileDevice()) {
    enterFullscreen();
  }
  UserPreferenceModule.getTheme().then((theme) => {
    buttonModule.applyTheme(theme);
  });
}

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

export function addUserAgentFlags() {
  const isFirefoxAndroid =
    /Firefox/.test(navigator.userAgent) && /Android/.test(navigator.userAgent);
  const element = document.documentElement;

  if (isFirefoxAndroid) {
    element.classList.add("firefox-android");
  }

  addDeviceFlags(element);
  //addViewFlags(element); // redundant, as this is called in initMode
}

export function addDeviceFlags(element) {
  if (isMobileDevice()) {
    element.classList.add("mobile-device");
  }
}

function addViewFlags(element) {
  UserPreferenceModule.getPrefersImmersiveView().then((immersive) => {
    if (immersive) {
      element.classList.remove("desktop-view");
      element.classList.add("immersive-view");
    } else {
      element.classList.remove("immersive-view");
      element.classList.add("desktop-view");
    }
  });
}

/**
 * Perform initial setup of the UI based on the view preferences
 */
export function initMode() {
  UserPreferenceModule.getPrefersImmersiveView().then((immersive) => {
    if (immersive) {
      enterImmersiveMode();
    } else {
      exitImmersiveMode();
    }
  });
}
