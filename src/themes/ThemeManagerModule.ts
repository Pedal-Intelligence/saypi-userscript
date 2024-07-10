import { addChild } from "../dom/DOMModule";
import getMessage from "../i18n";
import { IconModule } from "../icons/IconModule";
import StateMachineService from "../StateMachineService";

export class ThemeManager {
  private themeToggleActor;
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
    this.themeToggleActor = StateMachineService.themeToggleActor;
    this.icons = new IconModule();
  }

  private toggleTheme() {
    this.themeToggleActor.send("toggle");
  }

  /**
   * Applies the theme to the button icons
   * @param {string} theme: "dark" | "light"
   */
  private applyTheme(theme: "dark" | "light") {
    const button = document.getElementById("saypi-themeToggleButton");
    if (button) {
      if (theme === "dark") {
        button.innerHTML = IconModule.darkMode;
        const label = getMessage("toggleThemeToLightMode");
        button.setAttribute("aria-label", label);
      } else if (theme === "light") {
        button.innerHTML = IconModule.lightMode;
        const label = getMessage("toggleThemeToDarkMode");
        button.setAttribute("aria-label", label);
      }
    }
    const iconContainer = document.querySelector(".saypi-icon");
    if (iconContainer) {
      iconContainer.innerHTML = this.icons.rectangles(theme);
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
    button.innerHTML = IconModule.lightMode;
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
