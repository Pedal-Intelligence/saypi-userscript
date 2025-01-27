import getMessage from "../i18n.ts";
import StateMachineService from "../StateMachineService.js";
import { createSVGElement } from "../dom/DOMModule.ts";

class ButtonUpdater{

    constructor() {
        this.clickStartTime = 0;
        this.isLongClickEngaged = false;      
        this.isMouseDown = false;

        this.sayPiActor = StateMachineService.actor;

        // track whether a call is active, so that new button instances can be initialized correctly
        this.callIsActive = false;
    }

    removeChildrenFrom(callButton) {
        while (callButton.firstChild) {
            callButton.removeChild(callButton.firstChild);
        }
    }
    
    addIconTo(callButton, svgIcon) {
        const svgElement = createSVGElement(svgIcon);
        callButton.appendChild(svgElement);
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

    isShortClick(clickStartTime, limit) {
        const clickDuration =  (Date.now() - clickStartTime);
        return clickStartTime == 0 || clickDuration < limit;
    }

    createEvent(eventName) {
      return eventName ? () => { 
        this.sayPiActor.send(eventName); 
      } : null;
    }

    resetListenersOf(button) {
        button.onclick = () => {};
        button.addEventListener("mouseout", () => {});
    }

    handleButtonClicks(options) {
        let { button, onClick, onLongPressDown, onLongPressUp, isMouseOutHandled = false } = options;
        const longPressMinimumMilliseconds = 500;
            
        onClick = this.setEmptyDefault(onClick);
        onLongPressDown = this.setEmptyDefault(onLongPressDown);
        onLongPressUp = this.setEmptyDefault(onLongPressUp);

        button.onmousedown = () => {
            this.isMouseDown = true;
            this.clickStartTime = Date.now();
            window.setTimeout( () => {
            if (this.isMouseDown === true) {
                onLongPressDown();
                this.isLongClickEngaged = true;
            }
            }, longPressMinimumMilliseconds);
        }

        button.onmouseup = () => { 
            this.isMouseDown = false;
            if (this.isShortClick(this.clickStartTime, longPressMinimumMilliseconds)) {
                onClick();
            } else if (this.isLongClickEngaged) {
                onLongPressUp();
                this.isLongClickEngaged = false;
            }
        }

        if (isMouseOutHandled) {
            button.addEventListener("mouseout", () => {
            if (this.isLongClickEngaged) {
                onLongPressUp();
                this.isLongClickEngaged = false;
            }
            });
        }
    }

    isCallActive() {
        return this.callIsActive;
    }

    updateCallButton(options) {
        let {button, icon, label, labelArgument, clickEventName, longPressEventName, longReleaseEventName, isCallActive = false, isMouseOutProcessed = false} = options;
        if (!button) {
            button = document.getElementById("saypi-callButton");
        }
        if (button) {
            this.removeChildrenFrom(button);
            this.addIconTo(button, icon);
            this.resetListenersOf(button);
            this.setAriaLabelOf(button, label, labelArgument);
            this.handleButtonClicks({
                button: button,
                onClick: this.createEvent(clickEventName),
                onLongPressDown: this.createEvent(longPressEventName),
                onLongPressUp: this.createEvent(longReleaseEventName),
                isMouseOutHandled: isMouseOutProcessed,
            });
            this.toggleActiveState(button, isCallActive);
            this.callIsActive = isCallActive;
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