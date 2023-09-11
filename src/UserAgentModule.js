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

// this function determines whether to show the mobile view or not
export function isMobileView() {
  let userViewPreference = null;

  try {
    userViewPreference = localStorage.getItem("userViewPreference");
  } catch (e) {
    console.warn("Could not access localStorage: ", e);
  }

  let prefersMobile = false;
  if (userViewPreference) {
    prefersMobile = userViewPreference === "mobile";
  }

  // Make sure isMobileDevice is defined or imported
  return isMobileDevice() && prefersMobile;
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
    element.classList.remove("desktop-view");
    element.classList.add("mobile-view");
  } else {
    element.classList.remove("mobile-view");
    element.classList.add("desktop-view");
  }
}
