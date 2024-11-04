import darkModeIconSVG from "./mode-night.svg";
import lightModeIconSVG from "./mode-day.svg";
import rectanglesSVG from "./rectangles.svg";
import rectanglesDarkModeSVG from "./rectangles-moonlight.svg";
import { createSVGElement } from "../dom/DOMModule";

export class IconModule {
  
  static darkMode = createSVGElement(darkModeIconSVG);
  static lightMode = createSVGElement(lightModeIconSVG);

  rectangles(theme = "light") {
    if (theme === "dark") {
      return createSVGElement(rectanglesDarkModeSVG);
    } else {
      return createSVGElement(rectanglesSVG);
    }
  }
}
