let userPreference; // transient variable to store user preference until refresh

export function isMobileView() {
  if (userPreference) {
    return userPreference === "mobile";
  }

  return window.matchMedia("(max-width: 768px)").matches;
}

// TODO: dedupe this function from transcriber.js
export function isSafari() {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}
export function exitMobileMode() {
  userPreference = "desktop"; // or 'mobile'

  const element = document.documentElement;
  element.classList.remove("mobile-view");
}
export function addUserAgentFlags() {
  var isFirefoxAndroid =
    /Firefox/.test(navigator.userAgent) && /Android/.test(navigator.userAgent);
  const element = document.documentElement;
  if (isFirefoxAndroid) {
    // hack for Firefox on Android, which doesn't support :active correctly
    element.classList.add("firefox-android");
  }

  if (isMobileView()) {
    element.classList.add("mobile-view");
  } else {
    element.classList.remove("mobile-view");
  }
}
