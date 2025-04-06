import darkModeIconSVG from "./mode-night.svg";
import lightModeIconSVG from "./mode-day.svg";
import rectanglesSVG from "./rectangles.svg";
import rectanglesDarkModeSVG from "./rectangles-moonlight.svg";
import stopwatchSVG from "./stopwatch.svg";
import brainSVG from "./brain.svg";
import steerSVG from "./steer.svg";
import bubbleBwSVG from "./bubble-bw.svg";
import { createSVGElement } from "../dom/DOMModule";

export class IconModule {
  // Lazily loaded SVG elements
  private static _darkMode: SVGElement | null = null;
  private static _lightMode: SVGElement | null = null;
  private static _stopwatch: SVGElement | null = null;
  private static _brain: SVGElement | null = null;
  private static _steer: SVGElement | null = null;
  private static _bubbleBw: SVGElement | null = null;
  
  // Create an empty SVG element to use as fallback
  private static createEmptySVG(): SVGElement {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '24');
    svg.setAttribute('height', '24');
    svg.setAttribute('viewBox', '0 0 24 24');
    return svg;
  }
  
  // Getters for lazily loaded SVG elements
  static get darkMode(): SVGElement {
    if (!this._darkMode) {
      try {
        this._darkMode = createSVGElement(darkModeIconSVG);
      } catch (e) {
        console.warn('Failed to load dark mode icon', e);
        this._darkMode = this.createEmptySVG();
      }
    }
    return this._darkMode;
  }
  
  static get lightMode(): SVGElement {
    if (!this._lightMode) {
      try {
        this._lightMode = createSVGElement(lightModeIconSVG);
      } catch (e) {
        console.warn('Failed to load light mode icon', e);
        this._lightMode = this.createEmptySVG();
      }
    }
    return this._lightMode;
  }
  
  static get stopwatch(): SVGElement {
    if (!this._stopwatch) {
      try {
        this._stopwatch = createSVGElement(stopwatchSVG);
      } catch (e) {
        console.warn('Failed to load stopwatch icon', e);
        this._stopwatch = this.createEmptySVG();
      }
    }
    return this._stopwatch;
  }
  
  static get brain(): SVGElement {
    if (!this._brain) {
      try {
        this._brain = createSVGElement(brainSVG);
      } catch (e) {
        console.warn('Failed to load brain icon', e);
        this._brain = this.createEmptySVG();
      }
    }
    return this._brain;
  }
  
  static get steer(): SVGElement {
    if (!this._steer) {
      try {
        this._steer = createSVGElement(steerSVG);
      } catch (e) {
        console.warn('Failed to load steer icon', e);
        this._steer = this.createEmptySVG();
      }
    }
    return this._steer;
  }
  
  static get bubbleBw(): SVGElement {
    if (!this._bubbleBw) {
      try {
        this._bubbleBw = createSVGElement(bubbleBwSVG);
      } catch (e) {
        console.warn('Failed to load bubble-bw icon', e);
        this._bubbleBw = this.createEmptySVG();
      }
    }
    return this._bubbleBw;
  }

  rectangles(theme = "light"): SVGElement {
    try {
      if (theme === "dark") {
        return createSVGElement(rectanglesDarkModeSVG);
      } else {
        return createSVGElement(rectanglesSVG);
      }
    } catch (e) {
      console.warn(`Failed to load rectangles icon (${theme})`, e);
      return IconModule.createEmptySVG();
    }
  }
}
