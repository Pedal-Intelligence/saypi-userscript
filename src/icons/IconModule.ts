import darkModeIconSVG from "./mode-night.svg";
import lightModeIconSVG from "./mode-day.svg";
import rectanglesSVG from "./rectangles.svg";
import rectanglesDarkModeSVG from "./rectangles-moonlight.svg";
import stopwatchSVG from "./stopwatch.svg";
import brainSVG from "./brain.svg";
import steerSVG from "./steer.svg";
// Lucide originals for consistency with rest of UI
import lucideBrainSVG from "./lucide-brain.svg";
import lucideShipWheelSVG from "./lucide-ship-wheel.svg";
import lucideBotSVG from "./lucide-bot.svg";
import lucideInfoSVG from "./lucide-info.svg";
import bubbleBwSVG from "./bubble-bw.svg";
import { createSVGElement } from "../dom/DOMModule";

export class IconModule {
  // Lazily loaded SVG elements
  private static _darkMode: SVGElement | null = null;
  private static _lightMode: SVGElement | null = null;
  private static _stopwatch: SVGElement | null = null;
  private static _brain: SVGElement | null = null;
  private static _steer: SVGElement | null = null;
  private static _bot: SVGElement | null = null;
  private static _info: SVGElement | null = null;
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
        // Prefer Lucide original
        this._brain = createSVGElement(lucideBrainSVG);
      } catch (e) {
        try { this._brain = createSVGElement(brainSVG); }
        catch (e2) { console.warn('Failed to load brain icon', e, e2); this._brain = this.createEmptySVG(); }
      }
    }
    return this._brain;
  }
  
  static get steer(): SVGElement {
    if (!this._steer) {
      try {
        this._steer = createSVGElement(lucideShipWheelSVG);
      } catch (e) {
        try { this._steer = createSVGElement(steerSVG); }
        catch (e2) { console.warn('Failed to load steer icon', e, e2); this._steer = this.createEmptySVG(); }
      }
    }
    return this._steer;
  }
  
  static get bot(): SVGElement {
    if (!this._bot) {
      try {
        this._bot = createSVGElement(lucideBotSVG);
      } catch (e) {
        console.warn('Failed to load bot icon', e);
        this._bot = this.createEmptySVG();
      }
    }
    return this._bot;
  }

  static get info(): SVGElement {
    if (!this._info) {
      try {
        this._info = createSVGElement(lucideInfoSVG);
      } catch (e) {
        console.warn('Failed to load info icon', e);
        this._info = this.createEmptySVG();
      }
    }
    return this._info;
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

  static isReplaceableColor(color: string | null): boolean {
    if (!color) {
      return false;
    }
    color = color.toLowerCase();
    return color !== 'none' && color !== 'transparent' && color !== 'currentColor' && color !== 'white' && color !== '#ffffff' && color !== '#fff';
  }

  static bubble(color: string): SVGElement {
    const svg = this.bubbleBw.cloneNode(true) as SVGElement;
    const paths = svg.querySelectorAll('path');
    if (paths) {
      paths.forEach(path => {
        // if fill is black, set it to color
        if (this.isReplaceableColor(path.getAttribute('fill'))) {
          path.setAttribute('fill', color);
        }
      });
    }
    return svg;
  }

  static get bubbleGreen(): SVGElement {
    return this.bubble('#4CAF50');
  }

  static get bubbleRed(): SVGElement {
    return this.bubble('#FF0000');
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
