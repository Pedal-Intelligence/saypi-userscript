export function isSafari(): boolean {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

export function isFirefox(): boolean {
  return /Firefox/.test(navigator.userAgent);
}

export function isMobileDevice(): boolean {
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) ||
    (typeof window.matchMedia === "function" &&
      window.matchMedia("(max-width: 820px)").matches)
  );
}

export function addUserAgentFlags(): void {
  const isFirefoxAndroid: boolean =
    /Firefox/.test(navigator.userAgent) && /Android/.test(navigator.userAgent);
  const element: HTMLElement = document.documentElement;

  if (isFirefoxAndroid) {
    element.classList.add("firefox-android");
  }

  addDeviceFlags(element);
  //addViewFlags(element); // redundant, as this is called in initMode
}

export function addDeviceFlags(element: HTMLElement): void {
  if (isMobileDevice()) {
    element.classList.add("mobile-device");
  }
}
