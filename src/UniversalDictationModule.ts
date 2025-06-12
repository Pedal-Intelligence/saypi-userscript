import { Observation } from "./dom/Observation";
import { addChild } from "./dom/DOMModule";
import { createDictationMachine } from "./state-machines/DictationMachine";
import { interpret } from "xstate";
import EventBus from "./events/EventBus.js";
import { IconModule } from "./icons/IconModule";
import { logger, serializeStateValue } from "./LoggingModule.js";
import getMessage from "./i18n";

interface DictationTarget {
  element: HTMLElement;
  button: HTMLElement | null;
  decorated: boolean;
  machine?: any;
  originalPlaceholder?: string; // Store original placeholder text
}

export class UniversalDictationModule {
  private static instance: UniversalDictationModule;
  private observer: MutationObserver | null = null;
  private decoratedElements = new Map<HTMLElement, DictationTarget>();
  private currentActiveTarget: DictationTarget | null = null;
  private mousedownHandler: ((event: Event) => void) | null = null;
  private focusinHandler: ((event: Event) => void) | null = null;
  private messageListener: ((message: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => void) | null = null;

  private constructor() {
    this.setupEventListeners();
  }

  public static getInstance(): UniversalDictationModule {
    if (!UniversalDictationModule.instance) {
      UniversalDictationModule.instance = new UniversalDictationModule();
    }
    return UniversalDictationModule.instance;
  }

  public initialize(): void {
    console.log("Initializing Universal Dictation Module");
    this.startObserving();
    this.decorateExistingElements();
    
    // Emit event to signal that dictation capabilities are needed
    // This will trigger audio module startup for non-chatbot pages
    EventBus.emit("saypi:dictation:initialized");
  }

  public destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    
    // Remove global event listeners
    if (this.mousedownHandler) {
      document.removeEventListener("mousedown", this.mousedownHandler, true);
      this.mousedownHandler = null;
    }
    
    if (this.focusinHandler) {
      document.removeEventListener("focusin", this.focusinHandler, true);
      this.focusinHandler = null;
    }
    
    // Remove message listener
    if (this.messageListener) {
      chrome.runtime.onMessage.removeListener(this.messageListener);
      this.messageListener = null;
    }
    
    this.cleanupAllElements();
  }

  private startObserving(): void {
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        [...mutation.addedNodes]
          .filter((node) => node instanceof HTMLElement)
          .forEach((node) => {
            const addedElement = node as HTMLElement;
            this.findAndDecorateInputs(addedElement);
          });

        [...mutation.removedNodes]
          .filter((node) => node instanceof HTMLElement)
          .forEach((node) => {
            const removedElement = node as HTMLElement;
            this.cleanupRemovedElements(removedElement);
          });
      });
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  private decorateExistingElements(): void {
    this.findAndDecorateInputs(document.body);
  }

  private findAndDecorateInputs(searchRoot: Element): void {
    // Skip if we're on pi.ai or claude.ai (they have their own dictation)
    if (this.isExcludedSite()) {
      return;
    }

    // Find input elements
    const inputSelectors = [
      'input[type="text"]',
      'input[type="email"]',
      'input[type="search"]',
      'input[type="url"]',
      'input[type="tel"]',
      'textarea',
      '[contenteditable="true"]',
    ];

    const inputs = searchRoot.querySelectorAll(inputSelectors.join(", "));

    inputs.forEach((input) => {
      if (input instanceof HTMLElement && !this.decoratedElements.has(input)) {
        this.decorateInput(input);
      }
    });
  }

  private isExcludedSite(): boolean {
    const hostname = window.location.hostname;
    return hostname.includes("pi.ai") || hostname.includes("claude.ai");
  }

  private decorateInput(inputElement: HTMLElement): void {
    try {
      const dictationButton = this.createDictationButton(inputElement);
      const target: DictationTarget = {
        element: inputElement,
        button: dictationButton,
        decorated: true,
      };

      this.decoratedElements.set(inputElement, target);
      this.positionButton(inputElement, dictationButton);
      this.setupInputEventListeners(target);

      console.debug("Decorated input element with dictation button:", inputElement);
    } catch (error) {
      console.warn("Failed to decorate input element:", error);
    }
  }

  private createDictationButton(inputElement: HTMLElement): HTMLElement {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "saypi-dictation-button";
    button.setAttribute("aria-label", "Start dictation");
    button.setAttribute("title", "Start dictation with Say, Pi");
    button.style.cssText = `
      position: absolute;
      z-index: 9999;
      width: 28px;
      height: 28px;
      border: none;
      border-radius: 6px;
      background: transparent;
      cursor: pointer;
      display: none;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      padding: 0;
    `;

    // Add bubble icon - sized to fill button (idle state: black & white)
    const bubbleIcon = IconModule.bubbleBw.cloneNode(true) as SVGElement;
    bubbleIcon.setAttribute("width", "28");
    bubbleIcon.setAttribute("height", "28");
    bubbleIcon.style.cssText = `
      transition: all 0.2s ease;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
    `;
    button.appendChild(bubbleIcon);

    // Add hover effects for idle state
    button.addEventListener("mouseenter", () => {
      bubbleIcon.style.transform = "scale(1.1)";
    });

    button.addEventListener("mouseleave", () => {
      bubbleIcon.style.transform = "scale(1)";
    });

    // Add to document body for absolute positioning
    document.body.appendChild(button);

    return button;
  }

  private positionButton(inputElement: HTMLElement, button: HTMLElement): void {
    const updatePosition = () => {
      const rect = inputElement.getBoundingClientRect();
      const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const adjustX = -5;
      const adjustY = -10; // fine-tune this value to position the button correctly

      button.style.left = `${rect.right - 35 + scrollX + adjustX}px`;
      button.style.top = `${rect.top + (rect.height - 28) / 2 + scrollY + adjustY}px`;
    };

    // Initial positioning
    updatePosition();

    // Update position on scroll/resize
    const resizeObserver = new ResizeObserver(updatePosition);
    resizeObserver.observe(inputElement);

    window.addEventListener("scroll", updatePosition, { passive: true });
    window.addEventListener("resize", updatePosition, { passive: true });

    // Store cleanup functions
    (button as any).__positionCleanup = () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }

  private setupInputEventListeners(target: DictationTarget): void {
    const { element, button } = target;

    if (!button) return;

    // Show/hide button on focus/blur with dictation switching support
    const showButton = () => {
      if (button) button.style.display = "flex";
      
      // If dictation is active on another field, switch to this field
      if (this.currentActiveTarget && this.currentActiveTarget !== target) {
        this.switchDictationTarget(target);
      }
    };

    const hideButton = () => {
      // Use setTimeout to delay hiding so click event can fire first
      setTimeout(() => {
        if (button && !this.currentActiveTarget) {
          button.style.display = "none";
        }
      }, 150);
    };

    element.addEventListener("focus", showButton);
    element.addEventListener("blur", hideButton);

    // Button click handler - use mousedown for faster response
    const buttonClickHandler = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
      this.toggleDictation(target);
    };

    button.addEventListener("mousedown", buttonClickHandler);

    // Store cleanup function
    (element as any).__dictationCleanup = () => {
      element.removeEventListener("focus", showButton);
      element.removeEventListener("blur", hideButton);
      button.removeEventListener("mousedown", buttonClickHandler);
      
      if ((button as any).__positionCleanup) {
        (button as any).__positionCleanup();
      }
    };
  }

  private toggleDictation(target: DictationTarget): void {
    if (this.currentActiveTarget === target) {
      // Stop current dictation
      this.stopDictation();
    } else {
      // Start new dictation (stop current if any)
      if (this.currentActiveTarget) {
        this.stopDictation();
      }
      this.startDictation(target);
    }
  }

  private startDictation(target: DictationTarget): void {
    const { element, button } = target;

    if (!button) return;

    console.log("Starting dictation for element:", element);

    // Create and start state machine
    const machine = createDictationMachine(element);
    const service = interpret(machine).onTransition((state) => {
      if (state.changed) {
        const fromState = state.history
          ? serializeStateValue(state.history.value)
          : "N/A";
        const toState = serializeStateValue(state.value);
        logger.debug(
          `Dictation Machine [${element.tagName}] transitioned from ${fromState} to ${toState} with ${state.event.type}`
        );
        
        // Update button appearance and placeholder text based on state machine state
        this.updateButtonForState(target, state);
        this.updatePlaceholderForState(target, state);
      }
    });
    
    target.machine = service;
    this.currentActiveTarget = target;

    // Register dictation events with the machine
    this.registerDictationEvents(service);

    // Start the machine
    service.start();
    service.send({ type: "saypi:startDictation", targetElement: element });

    // Notify background script that dictation started
    this.notifyDictationStateChanged(true);

    console.log("Dictation started for:", element);
  }

  private switchDictationTarget(newTarget: DictationTarget): void {
    if (!this.currentActiveTarget) return;

    const previousTarget = this.currentActiveTarget;
    const { machine } = previousTarget;

    if (!machine) return;

    console.log("Switching dictation target from", previousTarget.element, "to", newTarget.element);

    // Get current machine state to preserve it
    const currentState = machine.getSnapshot();
    
    // Update the target element in the machine - need to update the module-level variable
    // Since the machine uses a module-level targetInputElement, we need to update that
    // by sending an event that updates the target
    machine.send({ 
      type: "saypi:switchTarget", 
      targetElement: newTarget.element 
    });

    // Transfer the machine to the new target
    newTarget.machine = machine;
    this.currentActiveTarget = newTarget;

    // Remove machine from previous target
    previousTarget.machine = null;

    // Update button appearances - hide all buttons except the new target
    this.decoratedElements.forEach((target) => {
      if (target.button) {
        if (target === newTarget) {
          // Show and update the new target button with current state
          target.button.style.display = "flex";
          this.updateButtonForState(target, currentState);
          this.updatePlaceholderForState(target, currentState);
        } else {
          // Hide all other buttons and set them to idle state
          target.button.style.display = "none";
          this.updateButtonForIdleState(target);
          this.restoreOriginalPlaceholder(target);
        }
      }
    });

    console.log("Dictation target switched successfully");
  }

  private stopDictation(): void {
    if (!this.currentActiveTarget) return;

    const currentTarget = this.currentActiveTarget;
    const { machine } = currentTarget;

    if (machine) {
      machine.send({ type: "saypi:stopDictation" });
      // machine.stop(); // virtual stop only
    }

    // Restore original placeholder text
    this.restoreOriginalPlaceholder(currentTarget);

    // Explicitly update button to idle state to ensure it's updated properly
    // even when machine transitions don't trigger the normal state update
    this.updateButtonForIdleState(currentTarget);

    // Clear the active target immediately to prevent double-calling
    this.currentActiveTarget = null;
    
    // Notify background script that dictation stopped
    this.notifyDictationStateChanged(false);
    
    console.log("Dictation stopped");
  }

  private cleanupRemovedElements(removedElement: HTMLElement): void {
    // Check if any of our decorated elements were removed
    this.decoratedElements.forEach((_, element) => {
      if (!document.contains(element) || removedElement.contains(element)) {
        this.cleanupElement(element);
      }
    });
  }

  private cleanupElement(element: HTMLElement): void {
    const target = this.decoratedElements.get(element);
    if (!target) return;

    // Stop dictation if this is the current active target
    if (this.currentActiveTarget === target) {
      this.stopDictation();
    }

    // Cleanup event listeners
    if ((element as any).__dictationCleanup) {
      (element as any).__dictationCleanup();
    }

    // Restore original placeholder text
    this.restoreOriginalPlaceholder(target);

    // Remove button
    if (target.button && target.button.parentNode) {
      target.button.parentNode.removeChild(target.button);
    }

    // Stop machine if running
    if (target.machine) {
      target.machine.stop();
    }

    this.decoratedElements.delete(element);
    console.debug("Cleaned up dictation for element:", element);
  }

  private cleanupAllElements(): void {
    this.decoratedElements.forEach((_, element) => {
      this.cleanupElement(element);
    });
  }

  private updateButtonForState(target: DictationTarget, state: any): void {
    const { button } = target;
    if (!button) return;

    // Extract the current state value for color mapping
    const stateValue = state.value;
    let color = '#bdbdbd'; // Default grey
    let ariaLabel = 'Dictation';
    let title = 'Dictation';

    // Map state machine states to colors (following VADStatusIndicator pattern)
    if (typeof stateValue === 'string') {
      switch (stateValue) {
        case 'idle':
          color = '#bdbdbd'; // Grey - no fill, natural b&w icon
          ariaLabel = 'Start dictation';
          title = 'Start dictation with Say, Pi';
          break;
        case 'starting':
          color = '#ffa726'; // Orange - initializing/connecting
          ariaLabel = 'Starting dictation...';
          title = 'Initializing voice input';
          break;
        case 'listening':
          color = '#66bb6a'; // Green - ready/listening
          ariaLabel = 'Stop dictation';
          title = 'Stop dictation';
          break;
        case 'errors':
          color = '#ef5350'; // Red - error
          ariaLabel = 'Dictation error';
          title = 'Dictation error - click to retry';
          break;
      }
    } else if (typeof stateValue === 'object' && stateValue.listening) {
      // Handle nested listening states
      const listeningState = stateValue.listening;
      
      if (listeningState.recording) {
        if (listeningState.recording === 'userSpeaking') {
          color = '#66bb6a'; // Green - user speaking
          ariaLabel = 'Speaking detected - Stop dictation';
          title = 'Speaking detected - Stop dictation';
        } else {
          color = '#66bb6a'; // Green - listening but not speaking
          ariaLabel = 'Listening - Stop dictation';
          title = 'Listening for speech - Stop dictation';
        }
      }
      
      if (listeningState.converting) {
        if (listeningState.converting === 'transcribing') {
          color = '#42a5f5'; // Blue - processing/transcribing
          ariaLabel = 'Transcribing speech...';
          title = 'Transcribing speech to text';
        } else if (listeningState.converting === 'accumulating') {
          color = '#66bb6a'; // Green - accumulating transcriptions
          ariaLabel = 'Processing text...';
          title = 'Processing transcribed text';
        }
      }
    }

    // Update button icon and color using IconModule.bubble()
    button.innerHTML = "";
    
    let icon: SVGElement;
    if (color === '#bdbdbd') {
      // For idle state, use natural b&w icon (no color applied)
      icon = IconModule.bubbleBw.cloneNode(true) as SVGElement;
    } else {
      // For active states, use IconModule.bubble() to apply the color
      icon = IconModule.bubble(color);
    }
    
    icon.setAttribute("width", "28");
    icon.setAttribute("height", "28");
    icon.style.cssText = `
      transition: all 0.2s ease;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
    `;
    
    button.appendChild(icon);

    // Update hover effects
    button.onmouseenter = () => {
      icon.style.transform = "scale(1.1)";
    };
    button.onmouseleave = () => {
      icon.style.transform = "scale(1)";
    };

    // Update accessibility attributes
    button.setAttribute("aria-label", ariaLabel);
    button.setAttribute("title", title);
  }

  private updateButtonForIdleState(target: DictationTarget): void {
    const { button } = target;
    if (!button) return;

    // Set button to idle state (grey/black & white)
    button.innerHTML = "";
    
    const icon = IconModule.bubbleBw.cloneNode(true) as SVGElement;
    icon.setAttribute("width", "28");
    icon.setAttribute("height", "28");
    icon.style.cssText = `
      transition: all 0.2s ease;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
    `;
    
    button.appendChild(icon);

    // Update hover effects
    button.onmouseenter = () => {
      icon.style.transform = "scale(1.1)";
    };
    button.onmouseleave = () => {
      icon.style.transform = "scale(1)";
    };

    // Update accessibility attributes for idle state
    button.setAttribute("aria-label", "Start dictation");
    button.setAttribute("title", "Start dictation with Say, Pi");
  }

  private updatePlaceholderForState(target: DictationTarget, state: any): void {
    const { element } = target;
    if (!this.supportsPlaceholder(element)) return;

    // Store original placeholder if not already stored
    if (target.originalPlaceholder === undefined) {
      target.originalPlaceholder = this.getPlaceholder(element) || "";
    }

    // Extract the current state value for placeholder mapping
    const stateValue = state.value;
    let placeholder = target.originalPlaceholder; // Default to original

    // Map state machine states to placeholder texts
    if (typeof stateValue === 'string') {
      switch (stateValue) {
        case 'idle':
          placeholder = target.originalPlaceholder;
          break;
        case 'starting':
          placeholder = getMessage("dictationPlaceholderStarting");
          break;
        case 'listening':
          placeholder = getMessage("dictationPlaceholderListening");
          break;
        case 'errors':
          placeholder = getMessage("dictationPlaceholderError");
          break;
      }
    } else if (typeof stateValue === 'object' && stateValue.listening) {
      // Handle nested listening states
      const listeningState = stateValue.listening;
      
      if (listeningState.recording) {
        if (listeningState.recording === 'userSpeaking') {
          placeholder = getMessage("dictationPlaceholderRecording");
        } else {
          placeholder = getMessage("dictationPlaceholderListening");
        }
      }
      
      if (listeningState.converting) {
        if (listeningState.converting === 'transcribing') {
          placeholder = getMessage("dictationPlaceholderTranscribing");
        } else if (listeningState.converting === 'accumulating') {
          placeholder = getMessage("dictationPlaceholderProcessing");
        }
      }
    }

    // Update the placeholder
    this.setPlaceholder(element, placeholder);
  }

  private supportsPlaceholder(element: HTMLElement): boolean {
    return element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement;
  }

  private getPlaceholder(element: HTMLElement): string | null {
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      return element.placeholder;
    }
    return null;
  }

  private setPlaceholder(element: HTMLElement, placeholder: string): void {
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      element.placeholder = placeholder;
    }
  }

  private restoreOriginalPlaceholder(target: DictationTarget): void {
    if (target.originalPlaceholder !== undefined) {
      this.setPlaceholder(target.element, target.originalPlaceholder);
    }
  }

  private setupEventListeners(): void {
    // Listen for page visibility changes
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && this.currentActiveTarget) {
        // Stop dictation when page loses focus
        this.stopDictation();
      }
    });

    // Listen for beforeunload
    window.addEventListener("beforeunload", () => {
      this.destroy();
    });

    // Stop dictation when user clicks outside of form inputs
    this.mousedownHandler = (event: Event) => {
      this.handleInteractionOutsideInputs(event);
    };
    document.addEventListener("mousedown", this.mousedownHandler, true);

    // Stop dictation when user focuses elements outside of form inputs
    this.focusinHandler = (event: Event) => {
      this.handleInteractionOutsideInputs(event);
    };
    document.addEventListener("focusin", this.focusinHandler, true);

    // Listen for messages from background script (context menu)
    this.messageListener = (message, _, sendResponse) => {
      if (message.type === "start-dictation-from-context-menu") {
        this.handleContextMenuDictation();
        sendResponse({ success: true });
      } else if (message.type === "stop-dictation-from-context-menu") {
        this.handleContextMenuStop();
        sendResponse({ success: true });
      }
    };
    chrome.runtime.onMessage.addListener(this.messageListener);
  }

  private handleContextMenuDictation(): void {
    // Find the currently focused element
    const activeElement = document.activeElement as HTMLElement;
    
    if (!activeElement) {
      console.log("No active element found for context menu dictation");
      return;
    }

    // Check if the active element is a valid input element
    if (!this.isInputElement(activeElement)) {
      console.log("Active element is not a valid input for dictation");
      return;
    }

    // Skip if we're on excluded sites
    if (this.isExcludedSite()) {
      console.log("Context menu dictation not available on excluded sites");
      return;
    }

    // Find or create the dictation target for this element
    let target = this.decoratedElements.get(activeElement);
    
    if (!target) {
      // Element hasn't been decorated yet, decorate it now
      this.decorateInput(activeElement);
      target = this.decoratedElements.get(activeElement);
    }

    if (!target) {
      console.error("Failed to create dictation target for context menu");
      return;
    }

    // Start dictation on this element
    console.log("Starting dictation from context menu for element:", activeElement);
    
    if (this.currentActiveTarget === target) {
      // Already active on this target, stop it
      this.stopDictation();
    } else {
      // Start dictation on this target
      if (this.currentActiveTarget) {
        // Stop current dictation first
        this.stopDictation();
      }
      this.startDictation(target);
    }
  }

  private handleContextMenuStop(): void {
    // Simply stop dictation if it's active
    if (this.currentActiveTarget) {
      console.log("Stopping dictation from context menu");
      this.stopDictation();
    } else {
      console.log("No active dictation to stop from context menu");
    }
  }

  private notifyDictationStateChanged(isActive: boolean): void {
    // Notify background script of dictation state change
    chrome.runtime.sendMessage({
      type: "DICTATION_STATE_CHANGED",
      isDictationActive: isActive
    }).catch((error) => {
      console.debug("Failed to notify background script of dictation state change:", error);
    });
  }

  private handleInteractionOutsideInputs(event: Event): void {
    // Only check if dictation is currently active
    if (!this.currentActiveTarget) return;

    const target = event.target as HTMLElement;
    if (!target) return;

    // Check if the interaction is with a form input element
    const isInputElement = this.isInputElement(target);
    
    // Check if the interaction is with our dictation button
    const isDictationButton = target.closest('.saypi-dictation-button');
    
    // If the user interacted with an input element or dictation button, don't stop
    if (isInputElement || isDictationButton) {
      return;
    }

    // If we reach here, the user interacted with something outside of form inputs
    // Stop dictation to prevent "hot mic" situation
    console.log("User interacted outside of form inputs, stopping dictation");
    this.stopDictation();
  }

  private isInputElement(element: HTMLElement): boolean {
    // Check if element matches our input selectors
    const inputSelectors = [
      'input[type="text"]',
      'input[type="email"]',
      'input[type="search"]',
      'input[type="url"]',
      'input[type="tel"]',
      'textarea',
      '[contenteditable="true"]',
    ];

    return inputSelectors.some(selector => {
      try {
        return element.matches(selector);
      } catch (e) {
        return false;
      }
    });
  }

  private registerDictationEvents(dictationService: any): void {
    // Register EventBus listeners that forward events to the dictation machine
    // This mirrors the functionality in EventModule.js for conversation events

    const CALL_READY = "saypi:callReady";
    const USER_SPEAKING = "saypi:userSpeaking";
    const USER_STOPPED_SPEAKING = "saypi:userStoppedSpeaking";
    const USER_FINISHED_SPEAKING = "saypi:userFinishedSpeaking";
    const AUDIO_DEVICE_CONNECTED = "saypi:audio:connected";
    const SESSION_ASSIGNED = "saypi:session:assigned";

    // Simple events (no additional data)
    [CALL_READY, USER_SPEAKING, USER_FINISHED_SPEAKING].forEach((eventName) => {
      EventBus.on(eventName, () => {
        logger.debug(`[UniversalDictationModule] Forwarding ${eventName} to dictation machine`);
        dictationService.send(eventName);
      });
    });

    // Events with additional data
    [USER_STOPPED_SPEAKING, AUDIO_DEVICE_CONNECTED, SESSION_ASSIGNED].forEach((eventName) => {
      EventBus.on(eventName, (detail) => {
        if (detail) {
          logger.debug(`[UniversalDictationModule] Forwarding ${eventName} with data to dictation machine`, detail);
          dictationService.send({ type: eventName, ...detail });
        } else {
          logger.warn(`[UniversalDictationModule] Received ${eventName} without details.`);
        }
      });
    });

    // Listen for transcription events
    EventBus.on("saypi:transcription:completed", (detail) => {
      logger.debug(`[UniversalDictationModule] Forwarding transcription to dictation machine`, detail);
      dictationService.send({ type: "saypi:transcribed", ...detail });
    });

    EventBus.on("saypi:transcribeFailed", () => {
      logger.debug(`[UniversalDictationModule] Forwarding transcription failure to dictation machine`);
      dictationService.send("saypi:transcribeFailed");
    });

    EventBus.on("saypi:transcribedEmpty", () => {
      logger.debug(`[UniversalDictationModule] Forwarding empty transcription to dictation machine`);
      dictationService.send("saypi:transcribedEmpty");
    });

    // Handle call failures
    EventBus.on("saypi:callFailed", () => {
      logger.debug(`[UniversalDictationModule] Forwarding call failure to dictation machine`);
      dictationService.send("saypi:callFailed");
    });
  }

  // Public API for other modules
  public isDictationActive(): boolean {
    return this.currentActiveTarget !== null;
  }

  public getCurrentTarget(): HTMLElement | null {
    return this.currentActiveTarget?.element || null;
  }
}