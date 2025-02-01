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

    isShortClick() {
        const clickDuration =  (Date.now() - this.clickStartTime);
        return this.clickStartTime == 0 || clickDuration < this.longPressMilliseconds;
    }

    createEvent(eventName) {
      return eventName 
        ? () => { this.sayPiActor.send(eventName); }
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
            this.currentOnLongClick();
            this.isLongClickEngaged = true;
        }
        }, this.longPressMilliseconds);
    }

    onUp() {
        this.isMouseDown = false;
        if (this.isShortClick()) {
            this.currentOnClick();
        } else if (this.isLongClickEngaged) {
            this.currentOnLongRelease();
            this.isLongClickEngaged = false;
        }
    }

    onOut() {
        if(this.isMouseOutHandled && this.isLongClickEngaged){
            this.currentOnLongRelease();
            this.isLongClickEngaged = false;
        }
    }

    setupButtonListeners(button) {
        if(typeof(window.ontouchstart) != 'undefined'){
            this.log("setupButtonListeners, onTouchStart is not null, defining touchstart and touchend event listeners");
            button.addEventListener('touchstart',() => {
                this.log("ontouchstart!");
                this.onDown();
            });
            button.addEventListener('touchend', () => {
                this.log("ontouchend!");
                this.onUp();
            });
            button.addEventListener('touchcancel', () => {
                this.log("ontouchcancel!!!");
                this.onUp();
            });
        } else {
            this.log("ontouchstart could not be found, so defining onmousedown and onmouseup");
            button.onmousedown = () => this.onDown();
            button.onmouseup = () => this.onUp();
            button.addEventListener("mouseout", () => this.onOut());
        }
    }

    updateButtonRoles(options) {
        let { button, clickEventName, longDownEventName, longUpEventName, isMouseOutHandled = false } = options;
                  
        if(this.areButtonClicksConfigured === false){
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

    updateCallButton(options) {
        let {button, icon, label, labelArgument, clickEventName, longPressEventName, longReleaseEventName, isCallActive = false, isMouseOutProcessed = false} = options;
        if (!button) {
            button = document.getElementById("saypi-callButton");
        }
        if (button) {
            this.removeChildrenFrom(button);
            this.addIconTo(button, icon);
           // this.resetListenersOf(button);
            this.setAriaLabelOf(button, label, labelArgument);
            this.updateButtonRoles({
                button: button,
                clickEventName: clickEventName,
                longDownEventName: longPressEventName,
                longUpEventName: longReleaseEventName,
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