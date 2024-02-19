import { buttonModule } from "./ButtonModule";
export function applyDarkMode() {
  document.body.classList.add("dark");
  buttonModule.applyTheme("dark");
}

export function applyNormalMode() {
  document.body.classList.remove("dark");
  buttonModule.applyTheme("light");
}
