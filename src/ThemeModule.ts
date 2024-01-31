import { buttonModule } from "./ButtonModule";
export function setDarkMode() {
  console.log("setDarkMode function");
  document.body.classList.add("dark");
  buttonModule.applyTheme("dark");
}

export function setNormalMode() {
  document.body.classList.remove("dark");
  buttonModule.applyTheme("light");
}
