export function isMobileView() {
  return window.matchMedia("(max-width: 768px)").matches;
}
// TODO: dedupe this function from transcriber.js
export function isSafari() {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}
