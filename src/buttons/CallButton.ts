import { Chatbot } from "../chatbots/Chatbot";
import { UserPreferenceModule } from "../prefs/PreferenceModule";
import StateMachineService from "../StateMachineService";
import EventBus from "../events/EventBus";
import AnimationModule from "../AnimationModule";
import { GlowColorUpdater } from "./GlowColorUpdater";
import { addChild, createSVGElement } from "../dom/DOMModule"; // Assuming createSVGElement is okay for full SVGs now, or stick to createElementNS
import getMessage from "../i18n";
import { computeGeometry, computeSegmentPaths, type SegmentStatus } from "./callButtonGeometry";
import callIconSVG from "../icons/call.svg?raw";
import callStartingIconSVG from "../icons/call-starting.svg?raw";
import hangupIconSVG from "../icons/hangup.svg?raw";
import interruptIconSVG from "../icons/interrupt.svg?raw";
import { logger } from "../LoggingModule";
// import hangupMincedIconSVG from "../icons/hangup-minced.svg"; // Not used anymore

interface Segment {
    seqNum: number;
    status: SegmentStatus;
    startTime: number;
    endTime?: number;
    errorType?: string;
}

export class CallButton {
    private chatbot: Chatbot;
    private userPreferences: UserPreferenceModule;
    private sayPiActor: typeof StateMachineService.conversationActor;
    private glowColorUpdater: GlowColorUpdater;

    private callIsActive: boolean = false;
    private segments: Segment[] = [];
    private currentSeqNum: number = 0;
    private currentSegment: Segment | null = null;
    private element: HTMLButtonElement | null = null; // Keep track of the button element

    constructor(chatbot: Chatbot) {
        this.chatbot = chatbot;
        this.userPreferences = UserPreferenceModule.getInstance();
        this.sayPiActor = StateMachineService.conversationActor;
        this.glowColorUpdater = new GlowColorUpdater();

        this.registerTranscriptionEvents();
        this.registerOtherEvents();
    }

    registerOtherEvents() {
      // Listen for audio frames to update glow
      EventBus.on("audio:frame", (probabilities: { isSpeech: number; notSpeech: number }) => {
        this.handleAudioFrame(probabilities);
      });
       // Listen for state machine changes that affect the button visually
       this.sayPiActor.subscribe((state: any) => {
        if (!this.element) return;

        // Glow management based on state
        if (state.matches('listening') || (state.matches('responding.piSpeaking') && this.userPreferences.getCachedAllowInterruptions() && state.context.lastState === 'listening') || state.matches('responding.userInterrupting')) {
            AnimationModule.startAnimation("glow");
        } else {
            AnimationModule.stopAnimation("glow");
            if (!this.callIsActive) { // Ensure glow color is reset if call becomes fully inactive
                 this.glowColorUpdater.updateGlowColor(0);
            }
        }

        if (state.matches('inactive')) {
          this.callInactive(this.element);
          this.enableCallButton(); // Ensure enabled when inactive
        } else if (state.matches('callStarting')) {
          this.callStarting(this.element);
           this.disableCallButton(); // Disable during starting phase
        } else if (state.matches('listening')) {
           if (!state.matches('listening.recording.userSpeaking') && !state.matches('listening.converting.transcribing')) {
              this.callActive(this.element); // Default active state when listening but not speaking/transcribing
           }
           this.enableCallButton(); // Generally enabled when listening
        } else if (state.matches('responding')) {
           this.disableCallButton(); // Disable while Pi is responding
           if (state.matches('responding.piSpeaking')) {
              // Determine if interruptible based on preferences
              const allowInterrupt = this.userPreferences.getCachedAllowInterruptions();
              const wasListening = state.context.lastState === 'listening'; // Access context if needed
              if (allowInterrupt && wasListening) {
                 this.callInterruptible(this.element);
                 this.enableCallButton(); // Enable for interrupt
              } else if (wasListening) {
                 // Still show active hangup if not interruptible but was listening
                 this.callActive(this.element);
                 // Keep button disabled to prevent accidental hangup? Or enable hangup?
                 // Let's enable hangup, but not interrupt icon
                 this.enableCallButton();
              } else {
                 // If responding but wasn't a call (e.g., page load), button might be inactive or disabled
                 // Handled by disableCallButton entry action in state machine?
              }
           } else if (state.matches('responding.userInterrupting')) {
              // Show active state during interruption
              this.callActive(this.element);
              this.enableCallButton(); // Allow hangup during interrupt
           }
        }
        // Add handling for error states if needed, though transcription errors are segment-based
      });
    }

    registerTranscriptionEvents() {
        EventBus.on("saypi:userSpeaking", () => this.handleUserSpeaking());
        EventBus.on("saypi:userStoppedSpeaking", (data: { duration: number; blob?: Blob }) => this.handleUserStoppedSpeaking(data));
        EventBus.on("session:transcribing", (data: { sequenceNumber: number }) => this.handleSessionTranscribing(data));
        EventBus.on("saypi:transcription:received", (data: { sequenceNumber: number, text: string }) => this.handleTranscriptionReceived(data));
        EventBus.on("saypi:transcription:failed", (data: { sequenceNumber: number }) => this.handleTranscriptionFailed(data));
        EventBus.on("saypi:transcription:empty", (data: { sequenceNumber: number }) => this.handleTranscriptionEmpty(data));
        EventBus.on("session:started", () => this.resetSegments());
        EventBus.on("session:message-sent", () => this.resetSegments());
        EventBus.on("session:ended", () => {
            this.resetSegments();
            this.callIsActive = false; // Ensure flag is reset
            if (this.element) {
                this.callInactive(this.element); // Update visual state
                this.enableCallButton();
            }
        });
    }

    // --- Segment Handling Methods ---
    resetSegments() {
        this.segments = [];
        // don't reset currentSeqNum, as it's used to track the current transcription sequence number and continues to increment in TranscriptionModule.js
        this.currentSegment = null;
        this.updateButtonSegments();
        
        // Extra safeguard: ensure background is restored when segments are reset
        if (this.element) {
            const svgElement = this.element.querySelector('svg');
            if (svgElement) {
                const originalBackground = svgElement.querySelector('path.background');
                this.ensureBackgroundVisible(originalBackground);
            }
        }
    }

    handleUserSpeaking() {
        if (!this.callIsActive) return; // Only handle if call is active
        if (!this.currentSegment) {
           this.currentSegment = {
             seqNum: this.currentSeqNum,
             status: 'capturing',
             startTime: Date.now(),
           };
           logger.debug(`Segment ${this.currentSeqNum}: Started capturing`);
           this.updateButtonSegments();
        } else if (this.currentSegment.status !== 'capturing') {
            this.currentSegment.status = 'capturing';
            this.updateButtonSegments();
        }
    }

    handleUserStoppedSpeaking(data: { duration: number; blob?: Blob }) {
       if (!this.callIsActive || !this.currentSegment) return;
       if (this.currentSegment.status === 'capturing') {
          logger.debug(`Segment ${this.currentSegment.seqNum}: VAD stopped (raw userStoppedSpeaking event)`);
          // Actual finalization logic based on blob/duration:
          if (data.blob && data.blob.size > 0 && data.duration > 0) {
            this.currentSegment.endTime = Date.now();
            this.currentSegment.status = 'processing'; // Optimistically mark as processing
            this.segments.push({...this.currentSegment});
            logger.debug(`Segment ${this.currentSegment.seqNum}: Finalized as processing, duration: ${data.duration}ms`);
            this.currentSeqNum++; // Prepare for the next segment
            this.currentSegment = null; // Current capture is done
          } else {
            logger.debug(`Segment ${this.currentSegment.seqNum}: No audio data, cancelling capture.`);
            this.currentSegment = null; // Cancel this empty/false-positive segment
          }
          this.updateButtonSegments();
       }
    }

    handleSessionTranscribing(data: { sequenceNumber: number }) {
         if (!this.callIsActive) return;
        const segment = this.segments.find(s => s.seqNum === data.sequenceNumber);
        if (segment && segment.status !== 'processing') {
            segment.status = 'processing';
            logger.debug(`Segment ${data.sequenceNumber}: Confirmed processing`);
            this.updateButtonSegments();
        }
    }

    handleTranscriptionReceived(data: { sequenceNumber: number, text: string }) {
        if (!this.callIsActive) return;
        const targetSeqNum = data.sequenceNumber - 1;
        const segment = this.segments.find(s => s.seqNum === targetSeqNum);
        if (segment) {
            segment.status = 'completed-success';
            this.updateButtonSegments();
        } else {
            // console.warn("[CallButton] Transcription received, but no matching segment found for internal seqNum:", targetSeqNum, "Available internal seqNums:", this.segments.map(s=>s.seqNum));
        }
    }

     handleTranscriptionFailed(data: { sequenceNumber: number }) {
         if (!this.callIsActive) return;
        const targetSeqNum = data.sequenceNumber - 1;
        const segment = this.segments.find(s => s.seqNum === targetSeqNum);
        if (segment) {
            segment.status = 'completed-error';
            segment.errorType = 'transcription-api-error';
            this.updateButtonSegments();
        } else {
            // console.warn("[CallButton] Transcription failed, but no matching segment found for internal seqNum:", targetSeqNum, "Available internal seqNums:", this.segments.map(s=>s.seqNum));
        }
     }

     handleTranscriptionEmpty(data: { sequenceNumber: number }) {
         if (!this.callIsActive) return;
         const targetSeqNum = data.sequenceNumber - 1;
         const segment = this.segments.find(s => s.seqNum === targetSeqNum);
         if (segment) {
             segment.status = 'completed-error';
             segment.errorType = 'no-speech-detected';
             this.updateButtonSegments();
         } else {
            // console.warn("[CallButton] Transcription empty, but no matching segment found for internal seqNum:", targetSeqNum, "Available internal seqNums:", this.segments.map(s=>s.seqNum));
         }
     }

    // --- Helper Methods ---
    private ensureBackgroundVisible(originalBackground: Element | null): void {
        if (!originalBackground) return;
        
        // Aggressively restore background visibility as the default state
        // Remove any inline style overrides that might hide the background
        (originalBackground as SVGElement).style.removeProperty('fill-opacity');
        (originalBackground as SVGElement).style.removeProperty('fill');
        
        // Ensure the attribute is set to full opacity
        originalBackground.setAttribute('fill-opacity', '1');
        
        // Remove any hidden attributes that might interfere
        originalBackground.removeAttribute('style');
    }

    // --- SVG Drawing ---
     updateButtonSegments() {
        if (!this.element) return;
        const callButton = this.element;

        let segmentsGroup = callButton.querySelector("#saypi-segments-group") as SVGGElement | null;
        const svg = callButton.querySelector("svg");

        if (!svg) {
            console.error("SVG element not found within the call button.");
            return;
        }

        // Get the original background element
        const originalBackground = svg.querySelector('path.background') || svg.querySelector('path:first-of-type');

        if (!segmentsGroup) {
            segmentsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            segmentsGroup.setAttribute('id', 'saypi-segments-group');
            svg.insertBefore(segmentsGroup, svg.firstChild);
        }

        // Clear existing drawn segments from the segmentsGroup first
        while (segmentsGroup.firstChild) {
            segmentsGroup.removeChild(segmentsGroup.firstChild);
        }

        const allSegmentsData = [...this.segments];
        if (this.currentSegment) {
            allSegmentsData.push(this.currentSegment);
        }

        const totalSegments = allSegmentsData.length;

        // Always ensure background is visible by default, then hide only if needed
        this.ensureBackgroundVisible(originalBackground);

        if (totalSegments === 0) {
            // No segments to draw, background should already be visible
            return; // Exit early
        }

        // If we have segments, hide the original background
        // Use fill-opacity to hide while preserving the fill color
        if (originalBackground) {
            (originalBackground as SVGElement).style.fillOpacity = '0';
        }

        const viewBox = svg.getAttribute('viewBox')?.split(' ').map(Number);
        const svgWidth = viewBox ? viewBox[2] : 80; // Default guess
        const svgHeight = viewBox ? viewBox[3] : 80; // Default guess

        // Pure angle/arc geometry lives in callButtonGeometry; this method keeps
        // the DOM application + the #progress-ring/background preservation above.
        const geometry = computeGeometry(svgWidth, svgHeight);
        const segmentPaths = computeSegmentPaths(
            allSegmentsData.map((segmentData) => segmentData.status),
            geometry,
        );

        segmentPaths.forEach((spec) => {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', spec.d);
            path.setAttribute('fill', spec.fill);
            segmentsGroup!.appendChild(path);
        });
    }

     // --- Glow Handling ---
    handleAudioFrame(probabilities: { isSpeech: number; notSpeech: number }) {
       if (this.callIsActive) { // Only glow if call is active
           this.glowColorUpdater.updateGlowColor(probabilities.isSpeech);
       } else {
           this.glowColorUpdater.updateGlowColor(0); // Ensure glow stops when inactive
       }
    }

    // --- Button Creation and State Updates ---
    public async createButton(container: HTMLElement, position: number = 0): Promise<HTMLButtonElement> {
        const button = document.createElement("button");
        button.id = "saypi-callButton";
        button.type = "button";
        button.classList.add("call-button", "saypi-button", "tooltip", "rounded-full");
        button.classList.add(...this.chatbot.getExtraCallButtonClasses());
        this.element = button; // Store reference

        // Set initial state based on flag (could be true if module re-initializes during call)
        if (this.callIsActive) {
            this.callActive(button);
        } else {
            await this.callInactive(button); // Await callInactive
        }

        addChild(container, button, position);

        // Tooltips (incl. this button's, which carries the `tooltip` class) are
        // handled globally by the body-level portal in src/ui/Tooltip.ts.

        // Ensure segments drawn *after* initial SVG is added by callActive/callInactive
        this.updateButtonSegments();

        if (this.callIsActive) {
            AnimationModule.startAnimation("glow");
        }
        return button;
    }

    private overrideLabelForHost(baseLabel: string, isActiveState: boolean, button: HTMLButtonElement): string {
        // Polymorphic host-specific labeling via class attached by chatbot
        if (button.classList.contains('chatgpt-call-button')) {
            // ChatGPT-style wording (i18n)
            if (isActiveState) {
                return getMessage('chatgpt_call_active_label');
            }
            // Starting/inactive -> invite to use SVM with attribution for clarity
            return getMessage('chatgpt_call_inactive_label');
        }
        return baseLabel;
    }

    private applyChatGPTTheming(svgElement: SVGElement, button: HTMLButtonElement): void {
        // Only apply ChatGPT theming if this button has the chatgpt class
        if (!button.classList.contains('chatgpt-call-button')) {
            return;
        }

        // Both call.svg and hangup.svg now use standardized class names
        const backgroundPath = svgElement.querySelector('path.background');
        const phoneReceiverPath = svgElement.querySelector('path.phone-receiver');
        
        if (!backgroundPath || !phoneReceiverPath) {
            // This SVG doesn't have the expected phone icon structure, return early (no-op)
            return;
        }

        // Determine which icon this is based on the fill color
        const backgroundFill = backgroundPath.getAttribute('fill');
        const isHangupIcon = backgroundFill === '#776d6d';

        // Remove inline fill attributes to allow CSS control
        const paths = svgElement.querySelectorAll('path');
        paths.forEach(path => {
            // Store original fill as a data attribute for reference
            const originalFill = path.getAttribute('fill');
            if (originalFill) {
                path.setAttribute('data-original-fill', originalFill);
                path.removeAttribute('fill');
            }
        });

        // Add CSS classes for theming
        backgroundPath.classList.add('saypi-call-bg');
        phoneReceiverPath.classList.add('saypi-call-icon');

        // Clear previous state classes and set appropriate class
        button.classList.remove('call-starting', 'call-hangup');
        if (isHangupIcon) {
            button.classList.add('call-hangup');
        }
    }

    private updateCallButton(button: HTMLButtonElement | null, svgIconString: string, label: string, onClick: (() => void) | null, isActiveState: boolean, stateKey: string) {
        const callButton = button || this.element;
        if (!callButton) return;

        // Only rebuild the SVG when the rendered icon/state actually changes. The call
        // button's state subscription re-invokes these renderers many times during a
        // call (listening substates oscillate as the user speaks/pauses/transcribes),
        // and a full teardown+rebuild destroys and recreates the SVG — including
        // #progress-ring — wiping the countdown-arc animation before it can render
        // (#203). Skipping redundant same-state rebuilds lets the ring (and its
        // .active countdown) persist; genuine icon changes still rebuild.
        const alreadyRendered =
            !!callButton.querySelector("svg") && callButton.dataset.callState === stateKey;

        if (!alreadyRendered) {
            // 1. Clear ALL previous children from the button.
            while (callButton.firstChild) {
                callButton.removeChild(callButton.firstChild);
            }

            // 2. Create the new SVG element from the icon string.
            const newSvgElement = createSVGElement(svgIconString);
            if (!newSvgElement || !(newSvgElement instanceof SVGElement)) {
                console.error("Failed to create SVG element from string or invalid type:", svgIconString);
                callButton.textContent = label; // Fallback: just show the label as text
                delete callButton.dataset.callState;
                return;
            }

            // 3. Create the segments group (first child) that segments draw into.
            //    Original background is left in place; updateButtonSegments manages it.
            const segmentsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            segmentsGroup.setAttribute('id', 'saypi-segments-group');
            newSvgElement.insertBefore(segmentsGroup, newSvgElement.firstChild);

            // 4. Append the complete new SVG element directly to the button.
            callButton.appendChild(newSvgElement);
            callButton.dataset.callState = stateKey;
        }

        // 5. Set attributes and event listeners on the button itself. Idempotent, so
        //    run on every call to keep the label/handler/active-state current even
        //    when the SVG rebuild was skipped.
        const finalLabel = this.overrideLabelForHost(label, isActiveState, callButton);
        callButton.setAttribute("aria-label", finalLabel);
        callButton.onclick = onClick || null;
        callButton.classList.toggle("active", isActiveState);

        // 6. Update internal state.
        this.callIsActive = isActiveState;

        // 7. Draw/update the segments into the segmentsGroup (reuses the existing group).
        this.updateButtonSegments();

        // 8. Handle glow animation (primarily managed by state machine subscription).
        if (!this.callIsActive) {
            AnimationModule.stopAnimation("glow");
            this.glowColorUpdater.updateGlowColor(0);
        }
    }

    callStarting(button: HTMLButtonElement | null = this.element) {
        const label = getMessage("callStarting");
        this.updateCallButton(button, callStartingIconSVG, label, () =>
            this.sayPiActor.send({ type: "saypi:hangup" }), // Use object syntax
            false, // Not fully active yet
            "starting"
        );
        // Glow might start here or wait for listening state?
    }

    callActive(button: HTMLButtonElement | null = this.element) {
        const label = getMessage("callInProgress");
        this.updateCallButton(button, hangupIconSVG, label, () =>
             this.sayPiActor.send({ type: "saypi:hangup" }),
             true,
             "active"
        );
        
        // Apply ChatGPT theming specifically for the active hangup.svg icon
        const callButton = button || this.element;
        if (callButton) {
            const svgElement = callButton.querySelector('svg');
            if (svgElement) {
                this.applyChatGPTTheming(svgElement, callButton);
                // Ensure background is visible after theming
                const originalBackground = svgElement.querySelector('path.background');
                this.ensureBackgroundVisible(originalBackground);
            }
        }
        
         // AnimationModule.startAnimation("glow"); // Ensure glow is on -- Handled by subscription
    }

    callInterruptible(button: HTMLButtonElement | null = this.element) {
        const handsFreeInterruptEnabled = this.userPreferences.getCachedAllowInterruptions();
        // Only show interrupt icon if preference is disabled (user must tap)
        if (!handsFreeInterruptEnabled) {
            const label = getMessage("callInterruptible");
            this.updateCallButton(button, interruptIconSVG, label, () => {
                 this.sayPiActor.send({ type: "saypi:interrupt" });
            }, true, "interruptible"); // Active state
             // AnimationModule.startAnimation("glow"); // Ensure glow is on -- Handled by subscription
        } else {
            // If hands-free interrupt is ON, just show the regular hangup icon
            if (this.callIsActive) {
                this.callActive(button);
            } else {
                this.callInactive(button);
            }
        }
    }

    async callInactive(button: HTMLButtonElement | null = this.element) { // Make async
        const nickname = await this.chatbot.getNickname(); // Await nickname
        const label = getMessage("callNotStarted", nickname);
        this.updateCallButton(button, callIconSVG, label, () =>
                this.sayPiActor.send({ type: "saypi:call" }),
                false,
                "inactive"
        );
        
        // Apply ChatGPT theming specifically for the inactive call.svg icon
        const callButton = button || this.element;
        if (callButton) {
            const svgElement = callButton.querySelector('svg');
            if (svgElement) {
                this.applyChatGPTTheming(svgElement, callButton);
                // Ensure background is visible after theming
                const originalBackground = svgElement.querySelector('path.background');
                this.ensureBackgroundVisible(originalBackground);
            }
        }
        
        // Glow animation logic is now primarily handled by the state machine subscription
    }

    disableCallButton(button: HTMLButtonElement | null = this.element) {
        const targetButton = button || this.element;
        if (targetButton) {
            targetButton.classList.add("disabled");
            // Always allow hangup, disable only the 'call' action
            if (!targetButton.classList.contains("active")) {
                targetButton.disabled = true;
            } else {
                 // Ensure hangup is possible even if button visually looks disabled
                 targetButton.disabled = false;
            }
        }
    }

    enableCallButton(button: HTMLButtonElement | null = this.element) {
         const targetButton = button || this.element;
        if (targetButton) {
            targetButton.classList.remove("disabled");
            targetButton.disabled = false;
        }
    }
}

// --- Singleton Initialization ---
let instance: CallButton | null = null;

export async function initializeCallButton(chatbot: Chatbot): Promise<CallButton> {
    if (!instance) {
        instance = new CallButton(chatbot);
    }
    return instance;
}

export function getCallButtonInstance(): CallButton | null {
    return instance;
} 
