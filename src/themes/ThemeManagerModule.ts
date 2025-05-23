import { addChild } from "../dom/DOMModule";
import EventBus from "../events/EventBus";
import getMessage from "../i18n";
import { IconModule } from "../icons/IconModule";

export class ThemeManager {
  private icons;

  // singleton
  private static instance: ThemeManager;
  static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager();
    }
    return ThemeManager.instance;
  }

  constructor() {
    this.icons = new IconModule();
  }

  private toggleTheme() {
    EventBus.emit("saypi:theme:toggle");
  }

  /**
   * Applies the theme to the button icons
   * @param {string} theme: "dark" | "light"
   */
  private applyTheme(theme: "dark" | "light") {
    const button = document.getElementById("saypi-themeToggleButton");
    if (button) {
      button.replaceChildren(theme === "dark" ? IconModule.darkMode : IconModule.lightMode);
      const labelName = theme === "dark" ? "toggleThemeToLightMode" : "toggleThemeToDarkMode";
      button.setAttribute("aria-label", getMessage(labelName));
    }
    const iconContainer = document.querySelector(".saypi-icon");
    if (iconContainer) {
      iconContainer.replaceChildren(this.icons.rectangles(theme));
    }
  }

  createThemeToggleButton(
    container: HTMLElement,
    position = 0
  ): HTMLButtonElement {
    const label = getMessage("toggleThemeToDarkMode");
    const button = document.createElement("button");
    button.id = "saypi-themeToggleButton";
    button.type = "button";
    button.className =
      "theme-toggle-button saypi-control-button rounded-full bg-cream-550 enabled:hover:bg-cream-650 tooltip";
    button.setAttribute("aria-label", label);
    button.replaceChildren(IconModule.lightMode);
    if (container) {
      addChild(container, button, position);
      button.onclick = () => {
        this.toggleTheme();
      };
    }
    return button;
  }

  applyDarkMode() {
    document.body.classList.add("dark");
    this.applyTheme("dark");
  }

  applyNormalMode() {
    document.body.classList.remove("dark");
    this.applyTheme("light");
  }
}
