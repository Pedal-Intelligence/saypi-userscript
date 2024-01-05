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
import hangupMincedIconSVG from "./icons/hangup-minced.svg";
import lockIconSVG from "./icons/lock.svg";
import unlockIconSVG from "./icons/unlock.svg";
import getMessage from "./i18n.ts";
import { UserPreferenceModule } from "./prefs/PreferenceModule.ts";
import { update } from "lodash";
export default class ButtonModule {
  constructor() {
    this.sayPiActor = StateMachineService.actor; // the Say, Pi state machine
    this.screenLockActor = StateMachineService.screenLockActor;
    // Binding methods to the current instance
    this.registerOtherEvents();

    // track the frequency of bug #26
    this.submissionsWithoutAnError = 0;
  }

  registerOtherEvents() {
    EventBus.on("saypi:autoSubmit", () => {
      this.handleAutoSubmit();
    });
    EventBus.on("audio:frame", (probabilities) => {
      this.handleAudioFrame(probabilities);
    });
  }

  // Function to create a new button
  createButton(textLabel, onClickCallback) {
    const button = document.createElement("button");
    if (textLabel) {
      button.textContent = textLabel;
    }
    if (onClickCallback) {
      button.onclick = onClickCallback;
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

  // Function to handle auto-submit based on the user preference
  async handleAutoSubmit() {
    const autoSubmitEnabled = await UserPreferenceModule.getAutoSubmit();
    if (autoSubmitEnabled) {
      this.simulateFormSubmit();
      EventBus.emit("saypi:piThinking"); // Pi is responding
    } else {
      console.log("Autosubmit is off");
    }
  }

  createExitButton() {
    const label = getMessage("exitMobileMode");
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
    const label = getMessage("enterMobileMode");
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
      "call-button fixed rounded-full bg-cream-550 enabled:hover:bg-cream-650 m-2";
    this.callInactive(button); // mic is off by default

    appendChild(container, button, position);
    return button;
  }

  updateCallButtonColor(color) {
    const callButton = document.getElementById("saypi-callButton");
    // find first path element descendant of the call button's svg element child
    const path = callButton?.querySelector("svg path");
    if (path) {
      // set the fill color of the path element
      path.style.fill = color;
    }
  }

  updateCallButtonGlowColor(color) {
    // set the `--glow-color` CSS variable on the call button
    const callButton = document.getElementById("saypi-callButton");
    if (callButton) {
      callButton.style.setProperty("--glow-color", color);
    }
  }
  /**
   * Interpolates between a base colour and a peak colour based on intensity.
   *
   * @param {string} baseColor - The base colour in hexadecimal format.
   * @param {string} peakColor - The peak colour in hexadecimal format.
   * @param {number} intensity - The intensity factor (0.0 to 1.0).
   * @returns {string} The interpolated colour in hexadecimal format.
   */
  interpolateColor(baseColor, peakColor, intensity) {
    // Ensure intensity is within the range of 0.0 to 1.0
    intensity = Math.max(0, Math.min(1, intensity));

    // Convert the base and peak colours from hexadecimal to RGB
    let baseRed = parseInt(baseColor.substring(1, 3), 16);
    let baseGreen = parseInt(baseColor.substring(3, 5), 16);
    let baseBlue = parseInt(baseColor.substring(5, 7), 16);
    let peakRed = parseInt(peakColor.substring(1, 3), 16);
    let peakGreen = parseInt(peakColor.substring(3, 5), 16);
    let peakBlue = parseInt(peakColor.substring(5, 7), 16);

    // Interpolate each colour component
    let newRed = Math.round(baseRed + (peakRed - baseRed) * intensity);
    let newGreen = Math.round(baseGreen + (peakGreen - baseGreen) * intensity);
    let newBlue = Math.round(baseBlue + (peakBlue - baseBlue) * intensity);

    // Convert the interpolated RGB back to hexadecimal
    return `#${newRed.toString(16).padStart(2, "0")}${newGreen
      .toString(16)
      .padStart(2, "0")}${newBlue.toString(16).padStart(2, "0")}`;
  }

  /**
   *
   * @param { isSpeech: number; notSpeech: number } probabilities
   */
  handleAudioFrame(probabilities) {
    var baseColor = "#ffd1dc"; // sunset-peach
    const peakColor = "#FF7F50"; // coral
    const updatedColor = this.interpolateColor(
      baseColor,
      peakColor,
      probabilities.isSpeech
    );
    this.updateCallButtonGlowColor(updatedColor);
  }

  callStarting(callButton) {
    if (!callButton) {
      callButton = document.getElementById("saypi-callButton");
    }
    if (callButton) {
      callButton.innerHTML = callStartingIconSVG;
      const label = getMessage("callStarting");
      callButton.setAttribute("aria-label", label);
      callButton.setAttribute("title", label);
      callButton.onclick = () => {
        this.sayPiActor.send("saypi:hangup");
      };
    }
  }

  callActive(callButton) {
    if (!callButton) {
      callButton = document.getElementById("saypi-callButton");
    }
    if (callButton) {
      const label = getMessage("callInProgress");
      callButton.innerHTML = hangupIconSVG;
      callButton.setAttribute("aria-label", label);
      callButton.setAttribute("title", label);
      callButton.onclick = () => {
        this.sayPiActor.send("saypi:hangup");
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
      const label = getMessage("callNotStarted");
      callButton.setAttribute("aria-label", label);
      callButton.setAttribute("title", label);
      callButton.onclick = () => {
        this.sayPiActor.send("saypi:call");
      };
      callButton.classList.remove("active");
    }
  }

  callError(callButton) {
    if (!callButton) {
      callButton = document.getElementById("saypi-callButton");
    }
    if (callButton) {
      const label = getMessage("callError");
      callButton.innerHTML = hangupMincedIconSVG;
      callButton.setAttribute("aria-label", label);
      callButton.setAttribute("title", label);
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

  createLockButton(container) {
    const label = getMessage("lockButton");
    const button = document.createElement("button");
    button.id = "saypi-lockButton";
    button.type = "button";
    button.className =
      "lock-button fixed rounded-full bg-cream-550 enabled:hover:bg-cream-650";
    button.setAttribute("aria-label", label);
    button.setAttribute("title", label);
    button.innerHTML = lockIconSVG;
    if (container) {
      container.appendChild(button);
      button.onclick = () => {
        this.screenLockActor.send("lock");
      };
    }
    return button;
  }

  createUnlockButton(container) {
    const label = getMessage("unlockButton");
    const button = document.createElement("button");
    button.id = "saypi-unlockButton";
    button.type = "button";
    button.className =
      "lock-button fixed rounded-full bg-cream-550 enabled:hover:bg-cream-650";
    button.setAttribute("aria-label", label);
    button.setAttribute("title", label);
    button.innerHTML = unlockIconSVG;
    if (container) {
      container.appendChild(button);
      let pressTimer;
      const originalMessage = getMessage("unlockInstruction");
      const continueUnlockingMessage = getMessage("continueUnlocking");

      button.onmousedown = button.ontouchstart = () => {
        console.log("unlock button pressed");
        const instruction = document.getElementById("saypi-unlock-instruction");
        if (instruction) {
          instruction.textContent = continueUnlockingMessage;
        }
        pressTimer = setTimeout(() => {
          this.screenLockActor.send("unlock");
        }, 1500); // Adjust the duration (in milliseconds) for a long-press
      };

      button.onmouseup = button.ontouchend = () => {
        console.log("unlock button released");
        // reset the message
        const instruction = document.getElementById("saypi-unlock-instruction");
        if (instruction) {
          instruction.textContent = originalMessage;
        }
        clearTimeout(pressTimer);
      };
    }
    return button;
  }
}

// Singleton
export const buttonModule = new ButtonModule();
