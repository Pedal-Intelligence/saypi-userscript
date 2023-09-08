export function isSafari() {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}
export function isMobileDevice() {
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.matchMedia("(max-width: 768px)").matches
  );
}

// Use localStorage to persist user preference
export function isMobileView() {
  const userViewPreference = localStorage.getItem("userViewPreference");

  if (userViewPreference) {
    return userViewPreference === "mobile";
  }

  return isMobileDevice();
}

export function exitMobileMode() {
  localStorage.setItem("userViewPreference", "desktop"); // Save preference

  const element = document.documentElement;
  element.classList.remove("mobile-view");
  element.classList.add("desktop-view");
}

export function enterMobileMode() {
  localStorage.setItem("userViewPreference", "mobile"); // Save preference

  const element = document.documentElement;
  element.classList.remove("desktop-view");
  element.classList.add("mobile-view");
}

export function addUserAgentFlags() {
  const isFirefoxAndroid =
    /Firefox/.test(navigator.userAgent) && /Android/.test(navigator.userAgent);
  const element = document.documentElement;

  if (isFirefoxAndroid) {
    element.classList.add("firefox-android");
  }

  addDeviceFlags(element);
  addViewFlags(element);
}

export function addDeviceFlags(element) {
  if (isMobileDevice()) {
    element.classList.add("mobile-device");
  }
}

export function addViewFlags(element) {
  if (isMobileView()) {
    element.classList.add("mobile-view");
  } else {
    element.classList.remove("mobile-view");
    element.classList.add("desktop-view");
  }
}
