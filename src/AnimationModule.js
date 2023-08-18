export default class AnimationModule {
  static rectanglesSelector =
    ".outermost, .second, .third, .fourth, .fifth, .innermost";
  static talkButtonAnimations = ["readyToRespond"];

  static animate(animation) {
    this.stopOtherAnimations(animation);

    let rectangles = document.querySelectorAll(this.rectanglesSelector);
    rectangles.forEach((rect) => rect.classList.add(animation));
  }

  static inanimate(animation) {
    let rectangles = document.querySelectorAll(this.rectanglesSelector);
    rectangles.forEach((rect) => rect.classList.remove(animation));
  }

  static stopAllAnimations() {
    this.talkButtonAnimations.forEach((animation) => this.inanimate(animation));
  }

  static stopOtherAnimations(keepAnimation) {
    this.talkButtonAnimations.forEach((animation) => {
      if (animation !== keepAnimation) {
        this.inanimate(animation);
      }
    });
  }
}
