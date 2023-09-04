import { exitMobileMode, isMobileView } from "./UserAgentModule";
import EventBus from "./EventBus";
import EventModule from "./EventModule.js";
import StateMachineService from "./StateMachineService.js";
import exitIconSVG from "./exit.svg";
import rectanglesSVG from "./rectangles.svg";
import talkIconSVG from "./waveform.svg";
export default class ButtonModule {
  constructor() {
    this.playButton = null;
    this.actor = StateMachineService.actor;
    // Binding methods to the current instance
    this.handlePlayButtonClick = this.handlePlayButtonClick.bind(this);
    this.registerOtherEvents();
  }

  registerOtherEvents() {
    EventBus.on("saypi:autoSubmit", ButtonModule.handleAutoSubmit);
  }

  // Function to create a new button
  createButton(label, callback) {
    const button = document.createElement("button");
    button.textContent = label;
    button.onclick = callback;
    return button;
  }

  // Function to style a given button
  styleButton(button, styles) {
    for (let key in styles) {
      if (styles.hasOwnProperty(key)) {
        button.style[key] = styles[key];
      }
    }
  }

  addTalkIcon(button) {
    this.updateIconContent(button);

    window.matchMedia("(max-width: 768px)").addListener(() => {
      this.updateIconContent(button);
    });
    this.setupClassObserver(button);
  }

  updateIconContent(iconContainer) {
    if (isMobileView()) {
      iconContainer.innerHTML = rectanglesSVG;
    } else {
      iconContainer.innerHTML = talkIconSVG;
    }
  }

  setupClassObserver(button) {
    const targetNode = document.documentElement; // The <html> element

    const config = { attributes: true, attributeFilter: ["class"] };

    const callback = (mutationsList, observer) => {
      for (let mutation of mutationsList) {
        if (mutation.type === "attributes") {
          if (mutation.attributeName === "class") {
            if (document.documentElement.classList.contains("mobile-view")) {
              // 'mobile-view' class was added
              this.updateIconContent(button);
            } else {
              // 'mobile-view' class was removed
              this.updateIconContent(button);
            }
          }
        }
      }
    };

    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);

    // Later, you can stop observing by calling:
    // observer.disconnect();
  }

  // Simulate an "Enter" keypress event on a form
  static simulateFormSubmit() {
    const textarea = document.getElementById("saypi-prompt");

    const enterEvent = new KeyboardEvent("keydown", {
      bubbles: true,
      key: "Enter",
      keyCode: 13,
      which: 13,
    });

    textarea.dispatchEvent(enterEvent);
  }

  // Function to handle auto-submit based on the button's data attribute
  static handleAutoSubmit() {
    const talkButton = document.getElementById("saypi-talkButton");

    if (talkButton.dataset.autosubmit === "false") {
      console.log("Autosubmit is disabled");
    } else {
      ButtonModule.simulateFormSubmit();
    }
  }

  createExitButton() {
    const label = "Exit Voice-Controlled Mobile Mode";
    const button = this.createButton("", () => {
      exitMobileMode();
    });
    button.id = "saypi-exitButton";
    button.type = "button";
    button.className =
      "exit-button fixed rounded-full bg-cream-550 enabled:hover:bg-cream-650";
    button.setAttribute("aria-label", label);
    button.setAttribute("title", label);
    button.innerHTML = exitIconSVG;
    document.body.appendChild(button);
    return button;
  }

  createPlayButton() {
    const label = "Hear Pi's response";
    this.playButton = this.createButton("", () => {});
    this.playButton.id = "saypi-playButton";
    this.playButton.type = "button";
    this.playButton.className = "hidden play-button";
    this.playButton.setAttribute("aria-label", label);
    this.playButton.setAttribute("title", label);
    this.playButton.addEventListener("click", this.handlePlayButtonClick);
    document.body.appendChild(this.playButton);
    return this.playButton;
  }

  showPlayButton() {
    if (!this.playButton) {
      this.createPlayButton();
    }
    this.playButton.classList.remove("hidden");
  }

  hidePlayButton() {
    if (this.playButton) {
      this.playButton.classList.add("hidden");
    }
  }

  handlePlayButtonClick() {
    this.actor.send("saypi:play");
    EventBus.emit("audio:reload");
  }
}

// Singleton
export const buttonModule = new ButtonModule();