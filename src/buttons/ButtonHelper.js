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

        this.currentOnClick = () => {};
        this.currentOnLongClick = () => {};
        this.currentOnLongRelease = () => {};

        this.isMouseOutHandled = false;
        this.areButtonClicksConfigured = false;

        this.iconSvgCache = new Array();
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

    setEmptyDefault(runnable) {
        return runnable ? runnable : () => {};
    }

    isShortClick() {
        const clickDuration =  (Date.now() - this.clickStartTime);
        return this.clickStartTime == 0 || clickDuration < this.longPressMilliseconds;
    }

    createEvent(eventName) {
      return eventName 
        ? () => { this.log("createEvent() sending event: " + eventName); this.sayPiActor.send(eventName); }
        : () => {};
    }

    resetListenersOf(button) {
        button.onclick = () => {};
        button.addEventListener("mouseout", () => {});
        button.addEventListener("touchstart", ()=> {});
        button.addEventListener("touchend", ()=> {});
        button.addEventListener("touchcancel", ()=> {});
    }

    onDown() {
        this.isMouseDown = true;
        this.clickStartTime = Date.now();
        window.setTimeout( () => {
            if (this.isMouseDown === true) {
                this.log("onDown() about to currentOnLongClick()");
                this.currentOnLongClick();
                this.isLongClickEngaged = true;
            }
        }, this.longPressMilliseconds);
    }

    onUp() {
        this.isMouseDown = false;
        if (this.isShortClick()) {
            this.log("onUp() about to currentOnClick()");
            this.currentOnClick();
        } else if (this.isLongClickEngaged) {
            this.log("onUp() about to currentOnLongRelease()");
            this.currentOnLongRelease();
            this.isLongClickEngaged = false;
        }
    }

    onOut() {
        if (this.isMouseOutHandled && this.isLongClickEngaged) {
            this.currentOnLongRelease();
            this.isLongClickEngaged = false;
        }
    }

    setupButtonListeners(button) {
        if (typeof(window.ontouchstart) != 'undefined') {
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
            button.onmousedown = () => {
                this.log("onmousedown");
                this.onDown();
            }
            button.onmouseup = () => {
                this.log("onmouseup");
                this.onUp();
            }
            button.addEventListener("mouseout", () => this.onOut());
        }
    }

    updateButtonRoles(options) {
        let { button, clickEventName, longDownEventName, longUpEventName, isMouseOutHandled = false } = options;
                  
        if (this.areButtonClicksConfigured === false) {
            this.setupButtonListeners(button);
            this.areButtonClicksConfigured = true;
        }

        this.currentOnClick = this.createEvent(clickEventName);
        this.currentOnLongClick = this.createEvent(longDownEventName);
        this.currentOnLongRelease = this.createEvent(longUpEventName);
        this.isMouseOutHandled = isMouseOutHandled;
    }

    log(msg) {
        console.log("^^^ ButtonHelper: " + msg);
    }

    isCallActive() {
        return this.callIsActive;
    }
  
    getSvgElement(icon, key) {
        if (!this.iconSvgCache.includes(key)) {
            this.log("getSvgElement() creating the icon for: " + key);
            this.iconSvgCache[key] =  createSVGElement(icon);
        } 
        this.log("getting cached icon for: " + key);
        return this.iconSvgCache[key];
    }

    changeIcon(button, icon, iconKey, isSvgOverwritten) {
        const svgElement = this.getSvgElement(icon, iconKey);
        if (!isSvgOverwritten) {
            this.log("svgIs not to be overwritten, about to remove children from button");
            this.removeChildrenFrom(button);
            this.log("svgIs not to be overwritten, about to append svg child to button");
            button.appendChild(svgElement);
        } else if (button.firstChild) {
            this.log("button has a first child, appending svg to it");
            button.firstChild.appendChild(svgElement);
        } else {
            this.log("button has no children, creating an svg child for it");
            button.appendChild(svgElement);
        }
        this.log("end of changeIcon()");
    }

    updateCallButton(options) {
        let {button, icon, label, labelArgument, clickEventName, longPressEventName, longReleaseEventName, isCallActive = false, isMouseOutProcessed = false, overwriteSvg = false} = options;
        if (!button) {
            button = document.getElementById("saypi-callButton");
        }
        if (button) {
            const iconKey = label;
            this.changeIcon(button, icon, iconKey, overwriteSvg);
            this.log("about to setAriaLabelOf button");
            this.setAriaLabelOf(button, label, labelArgument);
            this.log("about to update button roles");
            this.updateButtonRoles({
                button: button,
                clickEventName: clickEventName,
                longDownEventName: longPressEventName,
                longUpEventName: longReleaseEventName,
                isMouseOutHandled: isMouseOutProcessed,
            });
            this.log("about to toggleActiveState of button");
            this.toggleActiveState(button, isCallActive);
            this.log("setting call active");
            this.callIsActive = isCallActive;
            this.log("exiting updateCallButton");
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