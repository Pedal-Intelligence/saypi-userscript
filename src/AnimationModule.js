export default class AnimationModule {
  static rectanglesSelector =
    ".outermost, .second, .third, .fourth, .fifth, .innermost";
  static callButtonSelector = ".call-button";
  static talkButtonAnimations = [
    "piThinking",
    "piSpeaking",
    "userSpeaking",
    "transcribing",
  ];
  static callButtonAnimations = ["glow", "glow-fade-out"];

  static startAnimation(animation) {
    this.stopOtherAnimations(animation);

    if (this.talkButtonAnimations.includes(animation)) {
      let rectangles = document.querySelectorAll(this.rectanglesSelector);
      rectangles.forEach((rect) => rect.classList.add(animation));
    }
    if (this.callButtonAnimations.includes(animation)) {
      let callButtons = document.querySelectorAll(this.callButtonSelector);
      callButtons.forEach((button) => button.classList.add(animation));
    }
  }

  static stopAnimation(animation) {
    let rectangles = document.querySelectorAll(this.rectanglesSelector);
    rectangles.forEach((rect) => rect.classList.remove(animation));
    let callButtons = document.querySelectorAll(this.callButtonSelector);
    callButtons.forEach((button) => button.classList.remove(animation));
  }

  static stopAllAnimations() {
    this.talkButtonAnimations.forEach((animation) =>
      this.stopAnimation(animation)
    );
    this.callButtonAnimations.forEach((animation) =>
      this.stopAnimation(animation)
    );
  }

  static stopOtherAnimations(keepAnimation) {
    if (this.talkButtonAnimations.includes(keepAnimation)) {
      this.stopOtherAnimationsByCollection(
        keepAnimation,
        this.talkButtonAnimations
      );
    } else if (this.callButtonAnimations.includes(keepAnimation)) {
      this.stopOtherAnimationsByCollection(
        keepAnimation,
        this.callButtonAnimations
      );
    }
  }

  static stopOtherAnimationsByCollection(keepAnimation, animationsCollection) {
    animationsCollection.forEach((animation) => {
      if (animation !== keepAnimation) {
        this.stopAnimation(animation);
      }
    });
  }
}
