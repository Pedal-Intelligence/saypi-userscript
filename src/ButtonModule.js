import {
  enterMobileMode,
  exitMobileMode,
  isMobileView,
} from "./UserAgentModule.js";
import { appendChild } from "./DOMModule.ts";
import EventBus from "./EventBus.js";
import StateMachineService from "./StateMachineService.js";
import { submitErrorHandler } from "./SubmitErrorHandler.ts";
import exitIconSVG from "./icons/exit.svg";
import maximizeIconSVG from "./icons/maximize.svg";
import rectanglesSVG from "./icons/rectangles.svg";
import talkIconSVG from "./icons/waveform.svg";
import mutedMicIconSVG from "./icons/muted_microphone.svg";
import callIconSVG from "./icons/call.svg";
import callStartingIconSVG from "./icons/call-starting.svg";
import hangupIconSVG from "./icons/hangup.svg";
export default class ButtonModule {
  constructor() {
    this.actor = StateMachineService.actor;
    // Binding methods to the current instance
    this.registerOtherEvents();

    // track the frequency of bug #26
    this.submissionsWithoutAnError = 0;
  }

  registerOtherEvents() {
    EventBus.on("saypi:autoSubmit", () => {
      this.handleAutoSubmit();
    });
  }

  // Function to create a new button
  createButton(label, callback) {
    const button = document.createElement("button");
    if (label) {
      button.textContent = label;
    }
    if (callback) {
      button.onclick = callback;
    }
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
  simulateFormSubmit() {
    const submitButton = document.getElementById("saypi-submitButton");

    if (submitButton) {
      if (submitErrorHandler.detectSubmitError()) {
        // track how often this happens
        console.error(
          `Autosubmit failed after ${this.submissionsWithoutAnError} turns.`
        );
        this.submissionsWithoutAnError = 0;
        submitErrorHandler.handleSubmitError();
      } else {
        this.submissionsWithoutAnError++;
        submitButton.click();
      }
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
  handleAutoSubmit() {
    const talkButton = document.getElementById("saypi-talkButton");

    if (talkButton.dataset.autosubmit === "false") {
      console.log("Autosubmit is off");
    } else {
      this.simulateFormSubmit();
      EventBus.emit("saypi:piThinking"); // Pi is responding
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
    const button = this.createButton();
    button.id = "saypi-callButton";
    button.type = "button";
    button.className =
      "call-button fixed rounded-full bg-cream-550 enabled:hover:bg-cream-650";
    this.callInactive(button); // mic is off by default

    appendChild(container, button, position);
    return button;
  }

  callStarting(callButton) {
    if (!callButton) {
      callButton = document.getElementById("saypi-callButton");
    }
    if (callButton) {
      callButton.innerHTML = callStartingIconSVG;
      callButton.setAttribute("aria-label", "Starting continuous listening.");
      callButton.setAttribute("title", "Starting continuous listening.");
      callButton.onclick = () => {
        this.actor.send("saypi:hangup");
      };
    }
  }

  callActive(callButton) {
    if (!callButton) {
      callButton = document.getElementById("saypi-callButton");
    }
    if (callButton) {
      const label = "Active continuous listening. Click to stop.";
      callButton.innerHTML = hangupIconSVG;
      callButton.setAttribute("aria-label", label);
      callButton.setAttribute("title", label);
      callButton.onclick = () => {
        this.actor.send("saypi:hangup");
      };
      callButton.classList.add("active");
    }
  }

  callInactive(callButton) {
    if (!callButton) {
      callButton = document.getElementById("saypi-callButton");
    }
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
      callButton.classList.remove("active");
    }
  }

  disableCallButton() {
    const callButton = document.getElementById("saypi-callButton");
    if (callButton) {
      callButton.classList.add("disabled");
      // disable the call action, but always allow hangup
      if (!callButton.classList.contains("active")) {
        callButton.disabled = true;
      }
    }
  }

  enableCallButton() {
    const callButton = document.getElementById("saypi-callButton");
    if (callButton) {
      callButton.classList.remove("disabled");
      callButton.disabled = false;
    }
  }
}

// Singleton
export const buttonModule = new ButtonModule();
