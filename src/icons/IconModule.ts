import darkModeIconSVG from "./mode-night.svg";
import lightModeIconSVG from "./mode-day.svg";
import rectanglesSVG from "./rectangles.svg";
import rectanglesDarkModeSVG from "./rectangles-moonlight.svg";
import stopwatchSVG from "./stopwatch.svg";
import brainSVG from "./brain.svg";
import steerSVG from "./steer.svg";
import { createSVGElement } from "../dom/DOMModule";

export class IconModule {
  // Lazily loaded SVG elements
  private static _darkMode: SVGElement | null = null;
  private static _lightMode: SVGElement | null = null;
  private static _stopwatch: SVGElement | null = null;
  private static _brain: SVGElement | null = null;
  private static _steer: SVGElement | null = null;
  
  // Getters for lazily loaded SVG elements
  static get darkMode(): SVGElement | null {
    if (!this._darkMode) {
      this._darkMode = createSVGElement(darkModeIconSVG);
    }
    return this._darkMode;
  }
  
  static get lightMode(): SVGElement | null {
    if (!this._lightMode) {
      this._lightMode = createSVGElement(lightModeIconSVG);
    }
    return this._lightMode;
  }
  
  static get stopwatch(): SVGElement | null {
    if (!this._stopwatch) {
      this._stopwatch = createSVGElement(stopwatchSVG);
    }
    return this._stopwatch;
  }
  
  static get brain(): SVGElement | null {
    if (!this._brain) {
      this._brain = createSVGElement(brainSVG);
    }
    return this._brain;
  }
  
  static get steer(): SVGElement | null {
    if (!this._steer) {
      this._steer = createSVGElement(steerSVG);
    }
    return this._steer;
  }

  rectangles(theme = "light") {
    if (theme === "dark") {
      return createSVGElement(rectanglesDarkModeSVG);
    } else {
      return createSVGElement(rectanglesSVG);
    }
  }
}
