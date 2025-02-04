import getMessage from "../i18n.ts";
import StateMachineService from "../StateMachineService.js";
import { createSVGElement } from "../dom/DOMModule.ts";

class ButtonUpdater{

    constructor() {
        this.longPressMilliseconds = 500;
        this.clickStartTime = 0;
        this.isLongClickEngaged = false;      
        this.isMouseDown = false;

        this.sayPiActor = StateMachineService.actor;

        // track whether a call is active, so that new button instances can be initialized correctly
        this.callIsActive = false;

        this.clickEventName = "";
        this.longDownEventName = "";
        this.longUpEventName = "";

        this.isMouseOutHandled = false;
        this.areButtonClicksConfigured = false;

        this.iconSvgCache = new Array();
        this.areListenersEnabled = true;
    }

    removeChildrenFrom(button) {
        while (button.firstChild) {
            button.removeChild(button.firstChild);
        }
    }
  
    setAriaLabelOf(button, labelName, labelArg) {
        const label = labelArg? getMessage(labelName, labelArg) : getMessage(labelName);
        button.setAttribute("aria-label", label);
    }
    
    toggleActiveState(callButton, isActive) {
        callButton.classList.toggle("active", isActive);
    }

    isShortClick() {
        const clickDuration =  (Date.now() - this.clickStartTime);
        return this.clickStartTime == 0 || clickDuration < this.longPressMilliseconds;
    }

    sendEvent(eventName) {
        if (eventName) {
            this.sayPiActor.send(eventName);
        }
    }

    sendClickEvent() {
        this.sendEvent(this.clickEventName);
    }

    sendLongDownEvent() {
        this.sendEvent(this.longDownEventName);
    }

    sendLongUpEvent() {
        this.sendEvent(this.longUpEventName);
    }

    onDown() {
        if (!this.areListenersEnabled) {
            return;
        }
        this.isMouseDown = true;
        this.clickStartTime = Date.now();
        window.setTimeout( () => {
            if (this.isMouseDown === true) {
                this.sendLongDownEvent();
                this.isLongClickEngaged = true;
            }
        }, this.longPressMilliseconds);
    }

    onUp() {
        if (!this.areListenersEnabled) {
            return;
        }
        this.isMouseDown = false;
        if (this.isShortClick()) {
            this.sendClickEvent();
        } else if (this.isLongClickEngaged) {
            this.sendLongUpEvent();
            this.isLongClickEngaged = false;
        }
    }

    onMouseMovedOut() {
        if (this.isMouseOutHandled && this.isLongClickEngaged && this.areListenersEnabled) {
            this.sendLongUpEvent();
            this.isLongClickEngaged = false;
        }
    }

    isUsingTouchEvents() {
        return typeof(window.ontouchstart) != 'undefined';
    }

    setupButtonListeners(button) {
        if (this.isUsingTouchEvents()) {
            button.addEventListener('touchstart',() => {
                this.onDown();
            });
            button.addEventListener('touchend', ev => {
                ev.preventDefault();
                this.onUp();
            });
            button.addEventListener('touchcancel', () => {
                this.onUp();
            });
        } else {
            button.onmousedown = () => this.onDown() ;
            button.onmouseup = () => this.onUp();
            button.addEventListener("mouseout", () => this.onMouseMovedOut());
        }
    }

    updateButtonRoles(options) {
        let { button, clickEventName = "", longDownEventName = "", longUpEventName = "", isMouseOutHandled = false } = options;
                  
        if (!this.areButtonClicksConfigured) {
            this.setupButtonListeners(button);
            this.areButtonClicksConfigured = true;
        }
        this.clickEventName = clickEventName
        this.longDownEventName = longDownEventName
        this.longUpEventName = longUpEventName;
        this.isMouseOutHandled = isMouseOutHandled;
    }

    isCallActive() {
        return this.callIsActive;
    }
  
    getSvgElement(icon, key) {
        if (!this.iconSvgCache.includes(key)) {
            this.iconSvgCache[key] =  createSVGElement(icon);
        }
        return this.iconSvgCache[key];
    }

    changeIcon(button, icon, iconKey, isSvgOverwritten) {
        const svgElement = this.getSvgElement(icon, iconKey);
        if (!isSvgOverwritten || !this.isUsingTouchEvents()) {
            this.removeChildrenFrom(button);
            button.appendChild(svgElement);
        } else if (button.firstChild) {
            button.firstChild.appendChild(svgElement);
        } else {
            button.appendChild(svgElement);
        }
    }

    updateCallButton(options) {
        let {button, icon, label, labelArgument, clickEventName, longPressEventName, longReleaseEventName, isCallActive = false} = options;
        if (!button) {
            button = document.getElementById("saypi-callButton");
        }
        if (button) {
            this.areListenersEnabled = false;
            const iconKey = label;
            const isSvgOverwritten = longReleaseEventName? true : false;
            const isMouseOutProcessed = isSvgOverwritten;

            this.changeIcon(button, icon, iconKey, isSvgOverwritten);
            this.setAriaLabelOf(button, label, labelArgument);
            this.toggleActiveState(button, isCallActive);
            this.callIsActive = isCallActive;
            this.updateButtonRoles({
                button: button,
                clickEventName: clickEventName,
                longDownEventName: longPressEventName,
                longUpEventName: longReleaseEventName,
                isMouseOutHandled: isMouseOutProcessed,
            });
            this.areListenersEnabled = true;
        }
    }
}

class ButtonHelper {
    constructor() {
        this.buttonUpdater = new ButtonUpdater();
    }

    updateCallButton(options) {
        this.buttonUpdater.updateCallButton(options);
    }

    isCallActive() {
        return this.buttonUpdater.isCallActive();
    }
}

export { ButtonHelper }