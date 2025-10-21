import { ImmersionService } from "./ImmersionService.js";
import { addChild, createElement, createSVGElement } from "./dom/DOMModule.ts";
import EventBus from "./events/EventBus.js";
import { submitErrorHandler } from "./SubmitErrorHandler.ts";
import exitIconSVG from "./icons/exit.svg?raw";
import maximizeIconSVG from "./icons/focus.svg?raw";
import immersiveIconSVG from "./icons/focus.svg?raw";
import settingsIconSVG from "./icons/settings.svg?raw";
import lockIconSVG from "./icons/lock.svg?raw";
import unlockIconSVG from "./icons/unlock.svg?raw";
import getMessage from "./i18n.ts";
import { UserPreferenceModule } from "./prefs/PreferenceModule.ts";
import { ChatbotService } from "./chatbots/ChatbotService.ts";
import { IconModule } from "./icons/IconModule.ts";
import { ImmersionStateChecker } from "./ImmersionServiceLite.ts";
import { openSettings } from "./popup/popupopener.ts";
import { initializeCallButton, getCallButtonInstance } from "./buttons/CallButton.ts";
import StateMachineService from "./StateMachineService.js";

class ButtonModule {
  /**
   * Initializes the button module with dependencies
   * @param {import("./chatbots/Chatbot.ts").Chatbot} chatbot - The chatbot instance (dependency injection)
   */
  constructor(chatbot) {
    this.icons = new IconModule();
    this.userPreferences = UserPreferenceModule.getInstance();
    this.chatbot = chatbot;
    this.immersionService = new ImmersionService(chatbot);
    this.screenLockActor = StateMachineService.screenLockActor;
    this.submissionsWithoutAnError = 0;
    initializeCallButton(chatbot);
    this.registerSubmissionEvent();
  }

  registerSubmissionEvent() {
    // handle a request to automatically submit the user's prompt
    EventBus.on("saypi:autoSubmit", () => {
      this.handleAutoSubmit();
    });
  }

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

  setupViewObserver(container) {
    const targetNode = document.documentElement;

    const config = { attributes: true, attributeFilter: ["class"] };

    const callback = (mutationsList, observer) => {
      for (let mutation of mutationsList) {
        if (mutation.type === "attributes") {
          if (mutation.attributeName === "class") {
            if (document.documentElement.classList.contains("immersive-view")) {
              this.updateIconContent(container);
            } else {
              this.updateIconContent(container);
            }
          }
        }
      }
    };

    const observer = new MutationObserver(callback);

    observer.observe(targetNode, config);
  }

  simulateFormSubmit() {
    // First try the standard SayPi submit button (for Pi.ai and other chatbots)
    const submitButton = document.getElementById("saypi-submitButton");

    if (submitButton) {
      if (submitErrorHandler.detectSubmitError()) {
        console.error(
          `Autosubmit failed after ${this.submissionsWithoutAnError} turns.`
        );
        this.submissionsWithoutAnError = 0;
        submitErrorHandler.handleSubmitError();
      } else {
        this.submissionsWithoutAnError++;
        submitButton.click();
      }
      console.debug("Sending message via SayPi button at", Date.now());
      return;
    }

    // Use chatbot-specific submit logic
    if (this.chatbot && this.chatbot.simulateFormSubmit()) {
      this.submissionsWithoutAnError++;
      return;
    }

    console.error("Cannot simulate submit: No submit method available.");
  }

  async handleAutoSubmit() {
    const autoSubmitEnabled = await this.userPreferences.getAutoSubmit();
    const isImmersive = ImmersionStateChecker.isViewImmersive();
    if (autoSubmitEnabled || isImmersive) {
      this.simulateFormSubmit();
    } else {
      console.debug("Autosubmit is off");
    }
  }

  createIconButton(options) {
    const { id, label, icon, onClick, className = '' } = options;
    const button = document.createElement("button");
    button.id = id;
    button.type = "button";
    button.className = `saypi-control-button rounded-full bg-cream-550 enabled:hover:bg-cream-650 tooltip mini ${className}`;
    button.setAttribute("aria-label", label);

    const svgElement = createSVGElement(icon);
    if (svgElement) {
      button.appendChild(svgElement);
    } else {
      console.error("Failed to create SVG for icon button:", icon);
    }

    if (onClick) {
      button.onclick = onClick;
    }

    return button;
  }

  createExitButton(container, position = 0) {
    const button = this.createIconButton({
      id: 'saypi-exit-button',
      label: getMessage("exitImmersiveModeLong"),
      icon: exitIconSVG,
      onClick: () => ImmersionService.exitImmersiveMode(),
      className: 'saypi-exit-button'
    });

    addChild(container, button, position);
    return button;
  }

  createEnterButton(container, position = 0) {
    const button = this.createIconButton({
      id: 'saypi-enter-button', 
      label: getMessage("enterImmersiveModeLong"),
      icon: maximizeIconSVG,
      onClick: () => this.immersionService.enterImmersiveMode(),
      className: 'saypi-enter-button rounded-full bg-neutral-300 h-9 w-9 items-center justify-center flex p-1.5'
    });

    addChild(container, button, position);
    return button;
  }

  createControlButton(options) {
    const { shortLabel, longLabel = shortLabel, icon, onClick, className = '' } = options;
    const button = createElement("a", {
      className: `${className} maxi saypi-control-button tooltip flex h-16 w-16 flex-col items-center justify-center rounded-xl text-neutral-900 hover:bg-neutral-50-hover hover:text-neutral-900-hover active:bg-neutral-50-tap active:text-neutral-900-tap gap-0.5`,
      ariaLabel: longLabel,
      onclick: onClick,
    });

    const svgElement = createSVGElement(icon);
    if (svgElement) {
      button.appendChild(svgElement);
    } else {
      console.error("Failed to create SVG for control button:", icon);
    }

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

  createMiniSettingsButton(container, position = 0) {
    const button = this.createIconButton({
      id: 'saypi-settingsButton',
      label: getMessage("extensionSettings"),
      icon: settingsIconSVG,
      onClick: () => openSettings(),
      className: 'settings-button'
    });

    addChild(container, button, position);
    return button;
  }

  createCallButton(container, position = 0) {
    const callButtonInstance = getCallButtonInstance();
    if (callButtonInstance) {
      return callButtonInstance.createButton(container, position);
    } else {
      console.error("CallButton instance not initialized.");
      return document.createElement("button");
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
      onclick: () => this.screenLockActor.send({ type: "lock" }),
    });

    const svgElement = createSVGElement(lockIconSVG);
    if (svgElement) {
      button.appendChild(svgElement);
    } else {
      console.error("Failed to create SVG for lock button:", lockIconSVG);
    }

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

    const unlockSvgElement = createSVGElement(unlockIconSVG);
    if (unlockSvgElement) {
      button.appendChild(unlockSvgElement);
    } else {
      console.error("Failed to create SVG for unlock button:", unlockIconSVG);
    }

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
          this.screenLockActor.send({ type: "unlock" });
        }, 1500);
      };

      button.onmouseup = button.ontouchend = () => {
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

const instance = new ButtonModule(ChatbotService.getChatbotSync());

export const buttonModule = instance;
