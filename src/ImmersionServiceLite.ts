/**
 * This class is a simplified version of the Immersion Service class,
 * with fewer dependencies and a more focused purpose,
 * for client who only need to check the state of the immersive view.
 */
export class ImmersionStateChecker {
  // this function determines whether the immersive view is currently active
  static isViewImmersive() {
    const element = document.documentElement;
    return element.classList.contains("immersive-view");
  }
}
