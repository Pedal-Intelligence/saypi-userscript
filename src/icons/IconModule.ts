import darkModeIconSVG from "./mode-night.svg";
import lightModeIconSVG from "./mode-day.svg";
import rectanglesSVG from "./rectangles.svg";
import rectanglesDarkModeSVG from "./rectangles-moonlight.svg";

export class IconModule {
  static darkMode = darkModeIconSVG;
  static lightMode = lightModeIconSVG;

  rectangles(theme = "light") {
    if (theme === "dark") {
      return rectanglesDarkModeSVG;
    } else {
      return rectanglesSVG;
    }
  }
}
