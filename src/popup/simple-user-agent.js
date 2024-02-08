/**
 * This module is a simplified version of the user agent module. It only checks if the user is on a mobile device or not.
 * Media queries do not work reliably on the action button popup, so we need to use JavaScript to check if the user is on a mobile device.
 */

/**
 * Basic check to see if the user is on a mobile device
 * Does not reliably check for tablets, only for phones
 * @returns {boolean} true if the user is on a mobile device, false otherwise

 */
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}
function addDeviceFlags(element) {
  if (isMobileDevice()) {
    element.classList.add("mobile-device");
  }
}
addDeviceFlags(document.documentElement);
