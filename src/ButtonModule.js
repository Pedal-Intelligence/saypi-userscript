import { ImmersionService } from "./ImmersionService.js";
import { addChild, createElement, createSVGElement } from "./dom/DOMModule.ts";
import EventBus from "./events/EventBus.js";
import StateMachineService from "./StateMachineService.js";
import { submitErrorHandler } from "./SubmitErrorHandler.ts";
import exitIconSVG from "./icons/exit.svg";
import maximizeIconSVG from "./icons/maximize.svg";
import immersiveIconSVG from "./icons/immersive.svg";
import settingsIconSVG from "./icons/settings.svg";
import callIconSVG from "./icons/call.svg";
import callStartingIconSVG from "./icons/call-starting.svg";
import hangupIconSVG from "./icons/hangup.svg";
import interruptIconSVG from "./icons/interrupt.svg";
import hangupMincedIconSVG from "./icons/hangup-minced.svg";
import lockIconSVG from "./icons/lock.svg";
import unlockIconSVG from "./icons/unlock.svg";
import getMessage from "./i18n.ts";
import { UserPreferenceModule } from "./prefs/PreferenceModule.ts";
import AnimationModule from "./AnimationModule.js";
import { Chatbot } from "./chatbots/Chatbot.ts";
import { ChatbotService } from "./chatbots/ChatbotService.ts";
import { IconModule } from "./icons/IconModule.ts";
import { ImmersionStateChecker } from "./ImmersionServiceLite.ts";
import { GlowColorUpdater } from "./buttons/GlowColorUpdater.js";
import { openSettings } from "./popup/popupopener.ts";

class ButtonModule {
  /**
   * Initializes the button module with dependencies
   * @param {Chatbot} chatbot - The chatbot instance (dependency injection)
   */
  constructor(chatbot) {
    this.icons = new IconModule();
    this.userPreferences = UserPreferenceModule.getInstance();
    this.chatbot = chatbot;
    this.immersionService = new ImmersionService(chatbot);
    this.glowColorUpdater = new GlowColorUpdater();
    this.sayPiActor = StateMachineService.actor; // the Say, Pi state machine
    this.screenLockActor = StateMachineService.screenLockActor;
    // Binding methods to the current instance
    this.registerOtherEvents();

    // track the frequency of bug #26
    this.submissionsWithoutAnError = 0;

    // track whether a call is active, so that new button instances can be initialized correctly
    this.callIsActive = false;
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

  addTalkIcon(container) {
    this.updateIconContent(container);

    window.matchMedia("(max-width: 768px)").addListener(() => {
      this.updateIconContent(container);
    });
    this.setupViewObserver(container);
  }

  updateIconContent(iconContainer) {
    if (ImmersionStateChecker.isViewImmersive()) {
      iconContainer.appendChild(this.icons.rectangles());
    }
    iconContainer.classList.add("saypi-icon");
  }

  /**
   * Monitors an element for changes in the view class
   * i.e. when the view mode is toggled between 'immersive' and 'desktop'
   * and updates the icon content accordingly (why?)
   * @param {*} container - The HTML element to hold the icon
   */
  setupViewObserver(container) {
    const targetNode = document.documentElement; // The <html> element

    const config = { attributes: true, attributeFilter: ["class"] };

    const callback = (mutationsList, observer) => {
      for (let mutation of mutationsList) {
        if (mutation.type === "attributes") {
          if (mutation.attributeName === "class") {
            if (document.documentElement.classList.contains("immersive-view")) {
              // view mode changed to 'immersive'
              console.log("immersive view");
              this.updateIconContent(container);
            } else {
              // view mode changed to 'desktop'
              console.log("desktop view");
              this.updateIconContent(container);
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
    const autoSubmitEnabled = await this.userPreferences.getAutoSubmit();
    const isImmersive = ImmersionStateChecker.isViewImmersive(); // must auto-submit in immersive mode
    if (autoSubmitEnabled || isImmersive) {
      this.simulateFormSubmit();
    } else {
      console.log("Autosubmit is off");
    }
  }

  createExitButton(container, position = 0) {
    const label = getMessage("exitImmersiveModeLong");
    const button = this.createButton("", () => {
      ImmersionService.exitImmersiveMode();
    });
    button.type = "button";
    button.className =
      "saypi-exit-button saypi-control-button rounded-full bg-cream-550 enabled:hover:bg-cream-650 tooltip";
    button.setAttribute("aria-label", label);

    const svgElement = createSVGElement(exitIconSVG);
    button.appendChild(svgElement);

    addChild(container, button, position);
    return button;
  }

  createEnterButton(container, position = 0) {
    const label = getMessage("enterImmersiveModeLong");
    const button = this.createButton("", () => {
      this.immersionService.enterImmersiveMode();
    });
    button.type = "button";
    button.className =
      "saypi-enter-button saypi-control-button rounded-full bg-cream-550 enabled:hover:bg-cream-650 tooltip";
    button.setAttribute("aria-label", label);

    const svgElement = createSVGElement(maximizeIconSVG);
    button.appendChild(svgElement);

    addChild(container, button, position);
    return button;
  }

  createControlButton(options) {
    const { shortLabel, longLabel = shortLabel, icon, onClick, className = '' } = options;
    const button = createElement("a", {
      className: `${className} saypi-control-button tooltip flex h-16 w-16 flex-col items-center justify-center rounded-xl text-neutral-900 hover:bg-neutral-50-hover hover:text-neutral-900-hover active:bg-neutral-50-tap active:text-neutral-900-tap gap-0.5`,
      ariaLabel: longLabel,
      onclick: onClick,
    });

    const svgElement = createSVGElement(icon);
    button.appendChild(svgElement);

    const labelDiv = createElement("div", {
      className: "t-label",
      textContent: shortLabel,
    }, );
    button.appendChild(labelDiv);

    return button;
  }

  createImmersiveModeButton(container, position = 0) {
    const button = this.createControlButton({
      shortLabel: getMessage("enterImmersiveModeShort"),
      longLabel: getMessage("enterImmersiveModeLong"),
      icon: immersiveIconSVG,
      onClick: () => this.immersionService.enterImmersiveMode(),
      className: 'immersive-mode-button'
    });

    addChild(container, button, position);
    return button;
  }

  createSettingsButton(container, position = 0) {
    const label = getMessage("extensionSettings");
    const button = this.createControlButton({
      shortLabel: label,
      icon: settingsIconSVG,
      onClick: () => openSettings(),
      className: 'settings-button'
    });

    addChild(container, button, position);
    return button;
  }

  createMiniSettingsButton(container, position = 0 ) {
    const label = getMessage("extensionSettings");
    const button = document.createElement("button");
    button.id = "saypi-settingsButton";
    button.type = "button";
    button.className =
    "saypi-settings-button saypi-control-button rounded-full bg-cream-550 enabled:hover:bg-cream-650 tooltip";
    button.setAttribute("aria-label", label);
    const svgElement = createSVGElement(settingsIconSVG);
    button.replaceChildren(svgElement);
    if (container) {
      addChild(container, button, position);
      button.onclick = () => {
        openSettings();
      };
    }
    return button;
  }

  createCallButton(container, position = 0) {
    const button = this.createButton();
    button.id = "saypi-callButton";
    button.type = "button";
    button.classList.add("call-button", "saypi-button", "tooltip");
    button.classList.add(...this.chatbot.getExtraCallButtonClasses());
    if (this.callIsActive) {
      this.callActive(button);
    } else {
      this.callInactive(button);
    }

    addChild(container, button, position);
    if (this.callIsActive) {
      // if the call is active, start the glow animation once added to the DOM
      AnimationModule.startAnimation("glow");
    }
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

  /**
   *
   * @param { isSpeech: number; notSpeech: number } probabilities
   */
  handleAudioFrame(probabilities) {
    this.glowColorUpdater.updateGlowColor(probabilities.isSpeech);
  }

  updateCallButton(callButton, svgIcon, label, onClick, isActive = false) {
    if (!callButton) {
      callButton = document.getElementById("saypi-callButton");
    }
    if (callButton) {
      // Remove all existing child nodes
      while (callButton.firstChild) {
        callButton.removeChild(callButton.firstChild);
      }

      const svgElement = createSVGElement(svgIcon);
      callButton.appendChild(svgElement);

      callButton.setAttribute("aria-label", label);
      callButton.onclick = onClick;
      callButton.classList.toggle("active", isActive);
    }
    this.callIsActive = isActive;
  }

  callStarting(callButton) {
    const label = getMessage("callStarting");
    this.updateCallButton(callButton, callStartingIconSVG, label, () =>
      this.sayPiActor.send("saypi:hangup")
    );
  }

  callActive(callButton) {
    const label = getMessage("callInProgress");
    this.updateCallButton(
      callButton,
      hangupIconSVG,
      label,
      () => this.sayPiActor.send("saypi:hangup"),
      true
    );
  }

  callInterruptible(callButton) {
    const handsFreeInterruptEnabled =
      this.userPreferences.getCachedAllowInterruptions();
    if (!handsFreeInterruptEnabled) {
      const label = getMessage("callInterruptible");
      this.updateCallButton(
        callButton,
        interruptIconSVG,
        label,
        () => {
          this.sayPiActor.send("saypi:interrupt");
        },
        true
      );
    }
  }

  callInactive(callButton) {
    const label = getMessage("callNotStarted", this.chatbot.getName());
    this.updateCallButton(callButton, callIconSVG, label, () =>
      this.sayPiActor.send("saypi:call")
    );
  }

  callError(callButton) {
    const label = getMessage("callError");
    this.updateCallButton(callButton, hangupMincedIconSVG, label, null);
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
    const button = createElement("button", {
      id: "saypi-lockButton",
      type: "button",
      className:
        "lock-button saypi-control-button rounded-full bg-cream-550 enabled:hover:bg-cream-650 tooltip",
      ariaLabel: label,
      onclick: () => this.screenLockActor.send("lock"),
    });

    const svgElement = createSVGElement(lockIconSVG);
    button.appendChild(svgElement);

    if (container) {
      container.appendChild(button);
    }
    return button;
  }

  createUnlockButton(container) {
    const label = getMessage("unlockButton");
    const button = document.createElement("button");
    button.id = "saypi-unlockButton";
    button.type = "button";
    button.className =
      "lock-button saypi-control-button rounded-full bg-cream-550 enabled:hover:bg-cream-650 tooltip";
    button.setAttribute("aria-label", label);
    button.appendChild(createSVGElement(unlockIconSVG));
    if (container) {
      container.appendChild(button);
      let pressTimer;
      const originalMessage = getMessage("unlockInstruction");
      const continueUnlockingMessage = getMessage("continueUnlocking");

      button.onmousedown = button.ontouchstart = () => {
        const instruction = document.getElementById("saypi-unlock-instruction");
        if (instruction) {
          instruction.textContent = continueUnlockingMessage;
        }
        pressTimer = setTimeout(() => {
          this.screenLockActor.send("unlock");
        }, 1500); // Adjust the duration (in milliseconds) for a long-press
      };

      button.onmouseup = button.ontouchend = () => {
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
const chatbot = ChatbotService.getChatbot();
export const buttonModule = new ButtonModule(chatbot);
