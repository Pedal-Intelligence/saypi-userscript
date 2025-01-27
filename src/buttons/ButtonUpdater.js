import getMessage from "../i18n.ts";
import StateMachineService from "../StateMachineService.js";
import { createSVGElement } from "../dom/DOMModule.ts";

class ClickHandler{

    constructor(){
        console.log("^^^ entered ClickHandler constructor, setting initializing clickStartTime to 0");
        this.clickStartTime = 0;
        this.isLongClickEngaged = false;      
        this.isMouseDown = false;
        this.sayPiActor = StateMachineService.actor;
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
            console.log("^^^ on mouse down, click start time is: " + this.clickStartTime);
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
                console.log("^^^ shortClick onClick() clickStartTime: " + this.clickStartTime);
                onClick();
            } else if (this.isLongClickEngaged) {
                console.log("^^^ about to run onLongPressUp()");
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

    updateCallButton(options) {
        let {callButton, icon, label, clickEventName, longPressEventName, longReleaseEventName, labelArgument = null, isCallActive = false, isMouseOutProcessed = false} = options;
        if (!callButton) {
            callButton = document.getElementById("saypi-callButton");
        }
        if (callButton) {
            this.removeChildrenFrom(callButton);
            this.addIconTo(callButton, icon);
            this.resetListenersOf(callButton);
            this.setAriaLabelOf(callButton, label, labelArgument);
        
            this.handleButtonClicks({
                button: callButton,
                onClick: this.createEvent(clickEventName),
                onLongPressDown: this.createEvent(longPressEventName),
                onLongPressUp: this.createEvent(longReleaseEventName),
                isMouseOutHandled: isMouseOutProcessed,
            });
            this.toggleActiveState(callButton, isCallActive);
        }
    }
}

class ButtonUpdater {
    constructor() {
        this.clickHandler = new ClickHandler();
    }

    updateCallButton(options) {
        this.clickHandler.updateCallButton(options);
    }
}



export { ButtonUpdater }