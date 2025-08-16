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

/**
 * Check if the browser is a mobile Chromium browser that may lack full offscreen support
 * This includes browsers like Kiwi Browser on Android
 */
export function isMobileChromium(): boolean {
  const userAgent = navigator.userAgent;
  return (
    /Android/.test(userAgent) && 
    /Chrome/.test(userAgent) && 
    !isFirefox() && 
    !isSafari()
  );
}

/**
 * Get detailed browser information for debugging and compatibility checks
 */
export function getBrowserInfo(): {
  name: string;
  isMobile: boolean;
  supportsOffscreen: boolean;
  userAgent: string;
} {
  const userAgent = navigator.userAgent;
  let name = 'Unknown';
  
  if (isFirefox()) {
    name = 'Firefox';
  } else if (isSafari()) {
    name = 'Safari';
  } else if (isMobileChromium()) {
    name = 'Mobile Chromium';
  } else if (/Chrome/.test(userAgent)) {
    name = 'Chrome';
  } else if (/Edge/.test(userAgent)) {
    name = 'Edge';
  }
  
  return {
    name,
    isMobile: isMobileDevice(),
    supportsOffscreen: likelySupportsOffscreen(),
    userAgent
  };
}

/**
 * Check if the browser likely supports offscreen documents
 * This is a heuristic check based on known browser capabilities
 */
export function likelySupportsOffscreen(): boolean {
  // Quick fail for known unsupported browsers
  if (isFirefox() || isSafari()) {
    return false;
  }
  
  // Mobile Chromium browsers may have limited or no offscreen support
  if (isMobileChromium()) {
    return false;
  }
  
  // Desktop Chrome/Edge should support offscreen (Chrome 116+)
  return true;
}

function applyMotionPreferences(): void {
  try {
    const prefersReduced = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowDeviceMemory = typeof (navigator as any).deviceMemory === "number" && (navigator as any).deviceMemory <= 2;
    const lowCores = typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 2;
    const root = document.documentElement;

    if (prefersReduced || lowDeviceMemory || lowCores) {
      root.classList.add("low-motion");
    } else {
      root.classList.remove("low-motion");
    }

    if (typeof window.matchMedia === "function") {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (typeof (mq as any).addEventListener === "function") {
        (mq as any).addEventListener("change", (e: MediaQueryListEvent) => {
          if (e.matches) root.classList.add("low-motion");
          else root.classList.remove("low-motion");
        });
      } else if (typeof (mq as any).addListener === "function") {
        // Fallback for older browsers
        (mq as any).addListener((e: MediaQueryListEvent) => {
          if (e.matches) root.classList.add("low-motion");
          else root.classList.remove("low-motion");
        });
      }
    }
  } catch (_e) {
    // no-op
  }
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

  // Apply motion preferences (reduced-motion and low-motion heuristic)
  applyMotionPreferences();
}

export function addDeviceFlags(element: HTMLElement): void {
  if (isMobileDevice()) {
    element.classList.add("mobile-device");
  }
}
