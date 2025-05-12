import { ImmersionService } from "./ImmersionService.js";
import { addChild, createElement, createSVGElement } from "./dom/DOMModule.ts";
import EventBus from "./events/EventBus.js";
import { submitErrorHandler } from "./SubmitErrorHandler.ts";
import exitIconSVG from "./icons/exit.svg";
import maximizeIconSVG from "./icons/maximize.svg";
import immersiveIconSVG from "./icons/immersive.svg";
import settingsIconSVG from "./icons/settings.svg";
import lockIconSVG from "./icons/lock.svg";
import unlockIconSVG from "./icons/unlock.svg";
import getMessage from "./i18n.ts";
import { UserPreferenceModule } from "./prefs/PreferenceModule.ts";
import { Chatbot } from "./chatbots/Chatbot.ts";
import { ChatbotService } from "./chatbots/ChatbotService.ts";
import { IconModule } from "./icons/IconModule.ts";
import { ImmersionStateChecker } from "./ImmersionServiceLite.ts";
import { GlowColorUpdater } from "./buttons/GlowColorUpdater.js";
import { openSettings } from "./popup/popupopener.ts";
import { initializeCallButton, getCallButtonInstance } from "./buttons/CallButton.ts";
import StateMachineService from "./StateMachineService.js";

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
    this.sayPiActor = StateMachineService.actor;
    this.screenLockActor = StateMachineService.screenLockActor;
    this.submissionsWithoutAnError = 0;
    this.callIsActive = false;
    this.segments = [];
    this.currentSeqNum = 0;
    this.currentSegment = null;
    this.registerTranscriptionEvents();
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
      console.debug("Sending message to Pi at", Date.now());
    } else {
      const textarea = document.getElementById("saypi-prompt");
      if (textarea) {
        const enterEvent = new KeyboardEvent("keydown", {
          bubbles: true,
          key: "Enter",
          keyCode: 13,
          which: 13,
        });
        textarea.dispatchEvent(enterEvent);
      } else {
        console.error("Cannot simulate submit: Textarea not found.");
      }
    }
  }

  async handleAutoSubmit() {
    const autoSubmitEnabled = await this.userPreferences.getAutoSubmit();
    const isImmersive = ImmersionStateChecker.isViewImmersive();
    if (autoSubmitEnabled || isImmersive) {
      this.simulateFormSubmit();
    } else {
      console.log("Autosubmit is off");
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
      className: 'saypi-enter-button'
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

  registerTranscriptionEvents() {
    EventBus.on("saypi:userSpeaking", () => this.handleUserSpeaking());
    EventBus.on("saypi:userStoppedSpeaking", (data) => this.handleUserStoppedSpeaking(data));
    EventBus.on("audio:dataavailable", (data) => this.handleAudioDataAvailable(data));
    EventBus.on("session:transcribing", (data) => this.handleSessionTranscribing(data));
    EventBus.on("saypi:transcribed", (data) => this.handleTranscriptionReceived(data));
    EventBus.on("saypi:transcribeFailed", (data) => this.handleTranscriptionFailed(data));
    EventBus.on("saypi:transcribedEmpty", (data) => this.handleTranscriptionEmpty(data));
    EventBus.on("session:started", () => this.resetSegments());
    EventBus.on("session:ended", () => this.resetSegments());
  }

  resetSegments() {
    this.segments = [];
    this.currentSeqNum = 0;
    this.currentSegment = null;
    this.updateButtonSegments();
  }

  handleUserSpeaking() {
    if (!this.currentSegment) {
       this.currentSegment = {
         seqNum: this.currentSeqNum,
         status: 'capturing',
         startTime: Date.now(),
       };
       console.debug(`Segment ${this.currentSeqNum}: Started capturing`);
       this.updateButtonSegments();
    } else if (this.currentSegment.status !== 'capturing') {
        this.currentSegment.status = 'capturing';
        this.updateButtonSegments();
    }
  }

  handleUserStoppedSpeaking(data) {
    if (this.currentSegment && this.currentSegment.status === 'capturing') {
        console.debug(`Segment ${this.currentSegment.seqNum}: VAD stopped`);
     }
  }

   handleAudioDataAvailable(data) {
     const seqNum = data.sequenceNumber;
     if (this.currentSegment && this.currentSegment.seqNum === seqNum) {
       this.currentSegment.endTime = Date.now();
       this.currentSegment.status = 'processing';
       this.segments.push({...this.currentSegment});
       console.debug(`Segment ${seqNum}: Audio data available, marked processing`);
       this.currentSeqNum++;
       this.currentSegment = null;
       this.updateButtonSegments();
     } else {
        console.warn("Audio data available for unexpected sequence number:", seqNum, "Current:", this.currentSegment);
     }
   }

   handleSessionTranscribing(data) {
     const segment = this.segments.find(s => s.seqNum === data.sequenceNumber);
     if (segment && segment.status !== 'processing') {
       segment.status = 'processing';
       console.debug(`Segment ${data.sequenceNumber}: Confirmed processing`);
       this.updateButtonSegments();
     }
   }

   handleTranscriptionReceived(data) {
     const segment = this.segments.find(s => s.seqNum === data.sequenceNumber);
     if (segment) {
       segment.status = 'completed-success';
       console.debug(`Segment ${data.sequenceNumber}: Completed-Success`);
       this.updateButtonSegments();
     } else {
       console.warn("Transcription received for unknown sequence number:", data.sequenceNumber);
     }
   }

   handleTranscriptionFailed(data) {
      const segment = this.segments.find(s => s.seqNum === data.sequenceNumber);
      if (segment) {
        segment.status = 'completed-error';
        segment.errorType = 'transcription-api-error';
        console.debug(`Segment ${data.sequenceNumber}: Completed-Error (API)`);
        this.updateButtonSegments();
      } else {
         console.warn("Transcription failed for unknown sequence number:", data.sequenceNumber);
      }
   }

    handleTranscriptionEmpty(data) {
        const segment = this.segments.find(s => s.seqNum === data.sequenceNumber);
        if (segment) {
            segment.status = 'completed-error';
            segment.errorType = 'no-speech-detected';
            console.debug(`Segment ${data.sequenceNumber}: Completed-Error (Empty)`);
            this.updateButtonSegments();
        } else {
            console.warn("Transcription empty for unknown sequence number:", data.sequenceNumber);
        }
    }

  updateButtonSegments() {
    const callButton = document.getElementById("saypi-callButton");
    if (!callButton) return;

    let segmentsGroup = callButton.querySelector("#saypi-segments-group");
    if (!segmentsGroup) {
      const svg = callButton.querySelector("svg");
      if (!svg) return;
      segmentsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      segmentsGroup.setAttribute('id', 'saypi-segments-group');
      svg.insertBefore(segmentsGroup, svg.firstChild);
    }

    while (segmentsGroup.firstChild) {
      segmentsGroup.removeChild(segmentsGroup.firstChild);
    }

    const statusColors = {
      capturing: '#808080',
      processing: '#3498db',
      'completed-success': '#2ecc71',
      'completed-error': '#e74c3c',
    };

    const totalSegments = this.segments.length + (this.currentSegment ? 1 : 0);
    if (totalSegments === 0) return;

    const svg = callButton.querySelector("svg");
    const viewBox = svg ? svg.getAttribute('viewBox')?.split(' ').map(Number) : null;
    const svgWidth = viewBox ? viewBox[2] : 80;
    const svgHeight = viewBox ? viewBox[3] : 80;
    const center = svgWidth / 2;
    const radius = Math.min(svgWidth, svgHeight) / 2 * 0.85;
    const strokeWidth = radius * 0.15;

    const gap = 1;

    let anglePerSegment = 0;
    if (totalSegments > 0) {
        const totalGap = totalSegments * gap;
        if (totalGap < 360) {
            anglePerSegment = (360 - totalGap) / totalSegments;
        } else {
             anglePerSegment = 0;
             console.warn("Too many segments for the given gap size.");
        }
    }
    if (anglePerSegment <= 0) return;


    let startAngle = -90;

    const describeArc = (x, y, radius, startAngle, endAngle) => {
        const startRad = ((startAngle - 90) * Math.PI) / 180;
        const endRad = ((endAngle - 90) * Math.PI) / 180;

        const start = {
            x: x + radius * Math.cos(startRad),
            y: y + radius * Math.sin(startRad)
        };
        const end = {
            x: x + radius * Math.cos(endRad),
            y: y + radius * Math.sin(endRad)
        };

        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

        if (Math.abs(endAngle - startAngle) >= 359.99) {
             const endRadAdjusted = ((endAngle - 0.01 - 90) * Math.PI) / 180;
             end.x = x + radius * Math.cos(endRadAdjusted);
             end.y = y + radius * Math.sin(endRadAdjusted);
        }

        const d = [
            "M", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 1, end.x, end.y
        ].join(" ");

        return d;
    }


    const drawSegment = (segmentData, index) => {
        const endAngle = startAngle + anglePerSegment;
        const color = statusColors[segmentData.status] || '#cccccc';

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const arcPath = describeArc(center, center, radius - strokeWidth / 2, startAngle, endAngle);

        path.setAttribute('d', arcPath);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', color);
        path.setAttribute('stroke-width', strokeWidth.toString());
        path.setAttribute('stroke-linecap', 'butt');

        if (segmentsGroup) {
            segmentsGroup.appendChild(path);
        } else {
            callButton.appendChild(svgElement);
            const newSegmentsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            newSegmentsGroup.setAttribute('id', 'saypi-segments-group');
            svgElement.insertBefore(newSegmentsGroup, svgElement.firstChild);
        }

        startAngle = endAngle + gap;
    };

    this.segments.forEach((seg, index) => drawSegment(seg, index));

    if (this.currentSegment) {
        drawSegment(this.currentSegment, this.segments.length);
    }
  }
}

let instance = null;

async function initializeModule() {
  if (!instance) {
    const chatbot = await ChatbotService.getChatbot();
    instance = new ButtonModule(chatbot);
  }
  return instance;
}

export const buttonModule = await initializeModule();
