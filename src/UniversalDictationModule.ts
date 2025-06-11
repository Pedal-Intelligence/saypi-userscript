import { Observation } from "./dom/Observation";
import { addChild } from "./dom/DOMModule";
import { createDictationMachine } from "./state-machines/DictationMachine";
import { interpret } from "xstate";
import EventBus from "./events/EventBus.js";
import { IconModule } from "./icons/IconModule";
import { logger, serializeStateValue } from "./LoggingModule.js";

interface DictationTarget {
  element: HTMLElement;
  button: HTMLElement | null;
  decorated: boolean;
  machine?: any;
}

export class UniversalDictationModule {
  private static instance: UniversalDictationModule;
  private observer: MutationObserver | null = null;
  private decoratedElements = new Map<HTMLElement, DictationTarget>();
  private currentActiveTarget: DictationTarget | null = null;

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

    // Add bubble icon - sized to fill button
    const bubbleIcon = IconModule.bubbleBw.cloneNode(true) as SVGElement;
    bubbleIcon.setAttribute("width", "28");
    bubbleIcon.setAttribute("height", "28");
    bubbleIcon.style.cssText = `
      fill: #4CAF50;
      transition: all 0.2s ease;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
    `;
    button.appendChild(bubbleIcon);

    // Add hover effects
    button.addEventListener("mouseenter", () => {
      bubbleIcon.style.fill = "#45a049";
      bubbleIcon.style.transform = "scale(1.1)";
    });

    button.addEventListener("mouseleave", () => {
      bubbleIcon.style.fill = "#4CAF50";
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

    // Show/hide button on focus/blur
    const showButton = () => {
      if (button) button.style.display = "flex";
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
      }
    });
    
    target.machine = service;
    this.currentActiveTarget = target;

    // Update button appearance for recording
    button.innerHTML = "";
    const stopIcon = IconModule.bubbleRed.cloneNode(true) as SVGElement;
    button.appendChild(stopIcon);
    
    // Update hover effects for recording state
    button.onmouseenter = () => {
      stopIcon.style.fill = "#d32f2f";
      stopIcon.style.transform = "scale(1.1)";
    };
    button.onmouseleave = () => {
      stopIcon.style.fill = "#f44336";
      stopIcon.style.transform = "scale(1)";
    };
    button.setAttribute("aria-label", "Stop dictation");
    button.setAttribute("title", "Stop dictation");

    // Start the machine
    service.start();
    service.send({ type: "saypi:startDictation", targetElement: element });

    // Listen for completion
    service.onTransition((state) => {
      if (state.matches("idle")) {
        this.stopDictation();
      }
    });

    console.log("Dictation started for:", element);
  }

  private stopDictation(): void {
    if (!this.currentActiveTarget) return;

    const { button, machine } = this.currentActiveTarget;

    if (machine) {
      machine.send({ type: "saypi:stopDictation" });
      machine.stop();
    }

    if (button) {
      // Reset button appearance to idle state
      button.innerHTML = "";
      const bubbleIcon = IconModule.bubbleGreen.cloneNode(true) as SVGElement;
      bubbleIcon.setAttribute("width", "28");
      bubbleIcon.setAttribute("height", "28");
      bubbleIcon.style.cssText = `
        fill: #4CAF50;
        transition: all 0.2s ease;
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
      `;
      button.appendChild(bubbleIcon);
      
      // Restore original hover effects
      button.onmouseenter = () => {
        bubbleIcon.style.fill = "#45a049";
        bubbleIcon.style.transform = "scale(1.1)";
      };
      button.onmouseleave = () => {
        bubbleIcon.style.fill = "#4CAF50";
        bubbleIcon.style.transform = "scale(1)";
      };
      button.setAttribute("aria-label", "Start dictation");
      button.setAttribute("title", "Start dictation with Say, Pi");
      button.style.display = "none"; // Hide after stopping
    }

    this.currentActiveTarget = null;
    console.log("Dictation stopped");
  }

  private cleanupRemovedElements(removedElement: HTMLElement): void {
    // Check if any of our decorated elements were removed
    this.decoratedElements.forEach((target, element) => {
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
    this.decoratedElements.forEach((target, element) => {
      this.cleanupElement(element);
    });
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
  }

  // Public API for other modules
  public isDictationActive(): boolean {
    return this.currentActiveTarget !== null;
  }

  public getCurrentTarget(): HTMLElement | null {
    return this.currentActiveTarget?.element || null;
  }
}