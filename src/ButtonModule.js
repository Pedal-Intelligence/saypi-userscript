import {
  enterMobileMode,
  exitMobileMode,
  isMobileView,
} from "./UserAgentModule";
import { appendChild } from "./DOMModule";
import EventBus from "./EventBus";
import StateMachineService from "./StateMachineService.js";
import exitIconSVG from "./icons/exit.svg";
import maximizeIconSVG from "./icons/maximize.svg";
import rectanglesSVG from "./icons/rectangles.svg";
import talkIconSVG from "./icons/waveform.svg";
import mutedMicIconSVG from "./icons/muted_microphone.svg";
import playIconSVG from "./icons/play.svg";
import callIconSVG from "./icons/call.svg";
import hangupIconSVG from "./icons/hangup.svg";
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
    const submitButton = document.getElementById("saypi-submitButton");
    if (submitButton) {
      submitButton.click();
    } else {
      /* hit enter key in the prompt textarea, might not work as expected on "new ui layout" */
      const textarea = document.getElementById("saypi-prompt");

      const enterEvent = new KeyboardEvent("keydown", {
        bubbles: true,
        key: "Enter",
        keyCode: 13,
        which: 13,
      });

      textarea.dispatchEvent(enterEvent);
    }
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

  createEnterButton() {
    const label = "Enter Voice-Controlled Mobile Mode";
    const button = this.createButton("", () => {
      enterMobileMode();
    });
    button.id = "saypi-enterButton";
    button.type = "button";
    button.className =
      "enter-button fixed rounded-full bg-cream-550 enabled:hover:bg-cream-650";
    button.setAttribute("aria-label", label);
    button.setAttribute("title", label);
    button.innerHTML = maximizeIconSVG;
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
    this.playButton.innerHTML = playIconSVG;
    document.body.appendChild(this.playButton);
    console.log("Play button created, and added to the DOM.");
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
    this.actor.send("saypi:unblock");
    EventBus.emit("audio:reload");
  }

  showNotification(details) {
    const icon = details.icon;
    let iconSVG;
    if (icon === "muted-microphone") {
      iconSVG = mutedMicIconSVG;
    }

    const notification = document.getElementById("saypi-notification");
    if (notification) {
      notification.classList.remove("hidden");
      notification.innerHTML = iconSVG;
    } else {
      const notification = document.createElement("div");
      notification.id = "saypi-notification";
      notification.className = "notification";
      notification.innerHTML = iconSVG;
      document.body.appendChild(notification);
    }
  }

  dismissNotification() {
    const notification = document.getElementById("saypi-notification");
    if (notification) {
      notification.classList.add("hidden");
    }
  }

  createCallButton(container, position = 0) {
    const label = "Active continuous listening";
    const button = this.createButton("", () => {
      this.actor.send("saypi:call");
    });
    button.id = "saypi-callButton";
    button.type = "button";
    button.className =
      "call-button fixed rounded-full bg-cream-550 enabled:hover:bg-cream-650";
    button.setAttribute("aria-label", label);
    button.setAttribute("title", label);
    button.innerHTML = callIconSVG;

    appendChild(container, button, position);
    return button;
  }

  callActive() {
    const callButton = document.getElementById("saypi-callButton");
    if (callButton) {
      callButton.innerHTML = hangupIconSVG;
      callButton.setAttribute(
        "aria-label",
        "Active continuous listening. Click to stop."
      );
      callButton.setAttribute("title", "Active continuous listening");
      callButton.onclick = () => {
        this.actor.send("saypi:hangup");
      };
    }
  }

  callInactive() {
    const callButton = document.getElementById("saypi-callButton");
    if (callButton) {
      callButton.innerHTML = callIconSVG;
      callButton.setAttribute(
        "aria-label",
        "Click to start continuous listening."
      );
      callButton.setAttribute("title", "Not listening. Click to start.");
      callButton.onclick = () => {
        this.actor.send("saypi:call");
      };
    }
  }
}

// Singleton
export const buttonModule = new ButtonModule();
