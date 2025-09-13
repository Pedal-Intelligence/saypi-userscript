import { Chatbot } from "../chatbots/Chatbot";
import { UserPreferenceModule } from "../prefs/PreferenceModule";
import StateMachineService from "../StateMachineService";
import EventBus from "../events/EventBus";
import AnimationModule from "../AnimationModule";
import { GlowColorUpdater } from "./GlowColorUpdater";
import { addChild, createSVGElement } from "../dom/DOMModule"; // Assuming createSVGElement is okay for full SVGs now, or stick to createElementNS
import getMessage from "../i18n";
import callIconSVG from "../icons/call.svg";
import callStartingIconSVG from "../icons/call-starting.svg";
import hangupIconSVG from "../icons/hangup.svg";
import interruptIconSVG from "../icons/interrupt.svg";
import { State } from 'xstate'; // Import State type
import { logger } from "../LoggingModule";
// import hangupMincedIconSVG from "../icons/hangup-minced.svg"; // Not used anymore

interface Segment {
    seqNum: number;
    status: 'capturing' | 'processing' | 'completed-success' | 'completed-error';
    startTime: number;
    endTime?: number;
    errorType?: string;
}

class CallButton {
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
       this.sayPiActor.subscribe((state: State<any, any, any, any, any>) => {
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
        const originalBackground = svg.querySelector('path#background') || svg.querySelector('path:first-of-type');

        if (!segmentsGroup) {
            segmentsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            segmentsGroup.setAttribute('id', 'saypi-segments-group');
            svg.insertBefore(segmentsGroup, svg.firstChild);
        }

        // Clear existing drawn segments from the segmentsGroup first
        while (segmentsGroup.firstChild) {
            segmentsGroup.removeChild(segmentsGroup.firstChild);
        }

        const statusColors = {
          capturing: '#808080',
          processing: '#42a5f5',
          'completed-success': '#66bb6a',
          'completed-error': '#ef5350',
        };

        const allSegmentsData = [...this.segments];
        if (this.currentSegment) {
            allSegmentsData.push(this.currentSegment);
        }

        const totalSegments = allSegmentsData.length;

        if (totalSegments === 0) {
            // No segments to draw, ensure original background is visible
            if (originalBackground) {
                originalBackground.setAttribute('fill-opacity', '1');
                // Or use originalBackground.style.display = 'block'; if it was hidden by display:none
            }
            return; // Exit early
        }

        // If we have segments, hide the original background
        if (originalBackground) {
            originalBackground.setAttribute('fill-opacity', '0');
            // Or use originalBackground.style.display = 'none';
        }

        const viewBox = svg.getAttribute('viewBox')?.split(' ').map(Number);
        const svgWidth = viewBox ? viewBox[2] : 80; // Default guess
        const svgHeight = viewBox ? viewBox[3] : 80; // Default guess
        const center = svgWidth / 2; // Use width for center X assuming square/circular
        const radius = Math.min(svgWidth, svgHeight) / 2 * 0.9; // Outer radius factor for the pie wedges
        const segmentRadius = radius; // For filled wedges, use the full radius

        const gap = 1.5; // Gap between segments in degrees

        let anglePerSegment = 0;
        if (totalSegments > 0) {
            if (totalSegments === 1) {
                anglePerSegment = 360; // Single segment covers the whole circle
            } else {
                const totalGap = totalSegments * gap;
                if (totalGap < 360) {
                    anglePerSegment = (360 - totalGap) / totalSegments;
                } else {
                    anglePerSegment = 0;
                    console.warn("Too many segments for the given gap size.");
                }
            }
        }
        if (anglePerSegment <= 0 && totalSegments > 1) { // Allow anglePerSegment to be 0 if totalSegments is 1 and it becomes 360, then gets reset by gap logic for >1 scenario
            console.warn("Angle per segment is zero or negative with multiple segments.");
            return;
        }
        if (totalSegments === 1 && anglePerSegment !== 360) {
            // This case should ideally not be hit if logic above is correct for totalSegments = 1
            // but as a fallback, ensure a single segment is 360 if it wasn't set already.
            anglePerSegment = 360;
        }

        let startAngle = -90; // Start from the top

        allSegmentsData.forEach((segmentData, index) => {
            const endAngle = startAngle + anglePerSegment;
            const color = statusColors[segmentData.status] || '#cccccc';

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const wedgePath = this.describeWedge(center, center, segmentRadius, startAngle, endAngle);

            path.setAttribute('d', wedgePath);
            path.setAttribute('fill', color);
            segmentsGroup!.appendChild(path);

            startAngle = endAngle + gap;
        });
    }

    private describeWedge(x: number, y: number, radius: number, startAngle: number, endAngle: number): string {
        // Handle full circle case by slightly adjusting endAngle to ensure the arc is drawn
        // For a wedge, if it's a full circle, it's just a circle path, but our segment logic shouldn't produce this for a wedge.
        if (endAngle - startAngle >= 359.99) {
            endAngle = startAngle + 359.99; // Prevent full overlap that might cause rendering issues for an arc
        }

        const startRad = ((startAngle - 90) * Math.PI) / 180; // -90 to make 0 degrees at the top
        const endRad = ((endAngle - 90) * Math.PI) / 180;   // -90 to make 0 degrees at the top

        const arcStartX = x + radius * Math.cos(startRad);
        const arcStartY = y + radius * Math.sin(startRad);
        const arcEndX = x + radius * Math.cos(endRad);
        const arcEndY = y + radius * Math.sin(endRad);

        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

        const d = [
            "M", x.toFixed(3), y.toFixed(3), // Move to Center
            "L", arcStartX.toFixed(3), arcStartY.toFixed(3), // Line to Arc Start
            "A", radius.toFixed(3), radius.toFixed(3), 0, largeArcFlag, 1, arcEndX.toFixed(3), arcEndY.toFixed(3), // Arc
            "Z" // Close Path (line back to center)
        ].join(" ");

        return d;
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

        // ChatGPT uses overflow-clip on composer, so pseudo-element tooltips get clipped.
        // For buttons marked with 'chatgpt-call-button', attach a portal-style tooltip to <body>.
        if (button.classList.contains('chatgpt-call-button')) {
            this.attachPortalTooltip(button);
        }

        // Ensure segments drawn *after* initial SVG is added by callActive/callInactive
        this.updateButtonSegments();

        if (this.callIsActive) {
            AnimationModule.startAnimation("glow");
        }
        return button;
    }

    // --- ChatGPT tooltip portal (avoids overflow clipping) ---
    private tooltipEl: HTMLDivElement | null = null;
    private hideTooltipBound: any;
    private repositionTooltipBound: any;

    private attachPortalTooltip(button: HTMLButtonElement) {
        const show = () => {
            const label = button.getAttribute('aria-label') || '';
            if (!label) return;
            if (!this.tooltipEl) {
                this.tooltipEl = document.createElement('div');
                this.tooltipEl.className = 'saypi-tooltip';
                document.body.appendChild(this.tooltipEl);
            }
            this.tooltipEl.textContent = label;
            this.tooltipEl.style.visibility = 'hidden';
            this.tooltipEl.style.opacity = '0';
            this.positionTooltip(button);
            this.tooltipEl.style.visibility = 'visible';
            this.tooltipEl.style.opacity = '1';
        };

        const hide = () => {
            if (this.tooltipEl) {
                this.tooltipEl.style.opacity = '0';
                // remove after fade
                const el = this.tooltipEl;
                setTimeout(() => { if (el && el.parentElement) el.parentElement.removeChild(el); }, 120);
                this.tooltipEl = null;
            }
            window.removeEventListener('scroll', this.repositionTooltipBound, true);
            window.removeEventListener('resize', this.repositionTooltipBound, true);
        };

        this.hideTooltipBound = hide;
        this.repositionTooltipBound = () => this.positionTooltip(button);

        button.addEventListener('mouseenter', () => {
            show();
            window.addEventListener('scroll', this.repositionTooltipBound, true);
            window.addEventListener('resize', this.repositionTooltipBound, true);
        });
        button.addEventListener('mouseleave', hide);
        button.addEventListener('blur', hide);
    }

    private positionTooltip(button: HTMLButtonElement) {
        if (!this.tooltipEl) return;
        const rect = button.getBoundingClientRect();
        const tooltip = this.tooltipEl;
        tooltip.style.position = 'fixed';
        tooltip.style.zIndex = '1000';
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        // place above with small gap
        const gap = 10;
        tooltip.style.top = `${Math.max(0, rect.top - gap)}px`;
        tooltip.style.transform = 'translate(-50%, -100%)';
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

        // Only apply theming to the call.svg (inactive/idle) icon
        // Check for the specific structure of call.svg: path.circle with #418a2f and path.phone-receiver with #ffffff
        const circlePath = svgElement.querySelector('path.circle[fill="#418a2f"]');
        const phoneReceiverPath = svgElement.querySelector('path.phone-receiver[fill="#ffffff"]');
        
        if (!circlePath || !phoneReceiverPath) {
            // This is not the call.svg icon, return early (no-op)
            return;
        }

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

        // Add CSS classes for theming - only for call.svg structure
        circlePath.classList.add('saypi-call-bg');
        phoneReceiverPath.classList.add('saypi-call-icon');

        // Clear any previous state classes since this is the inactive state
        button.classList.remove('call-starting', 'call-hangup');
    }

    private updateCallButton(button: HTMLButtonElement | null, svgIconString: string, label: string, onClick: (() => void) | null, isActiveState: boolean) {
        const callButton = button || this.element;
        if (!callButton) return;

        // 1. Clear ALL previous children from the button.
        while (callButton.firstChild) {
            callButton.removeChild(callButton.firstChild);
        }

        // 2. Create the new SVG element from the icon string.
        const newSvgElement = createSVGElement(svgIconString);
        if (!newSvgElement || !(newSvgElement instanceof SVGElement)) {
            console.error("Failed to create SVG element from string or invalid type:", svgIconString);
            callButton.textContent = label; // Fallback: just show the label as text
            return;
        }

        // ChatGPT theming is now applied only for the inactive call state in callInactive()

        // 3. Original background is NOT removed here anymore. It will be handled by updateButtonSegments.

        // 4. Create the segments group that will live inside the new SVG element.
        const segmentsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        segmentsGroup.setAttribute('id', 'saypi-segments-group');

        // 5. Insert segmentsGroup as the first child of the new SVG element.
        newSvgElement.insertBefore(segmentsGroup, newSvgElement.firstChild);

        // 6. Append the complete new SVG element directly to the button.
        callButton.appendChild(newSvgElement);

        // 7. Set attributes and event listeners on the button itself.
        const finalLabel = this.overrideLabelForHost(label, isActiveState, callButton);
        callButton.setAttribute("aria-label", finalLabel);
        if (onClick) {
            callButton.onclick = onClick;
        } else {
            callButton.onclick = null;
        }
        callButton.classList.toggle("active", isActiveState);

        // 8. Update internal state.
        this.callIsActive = isActiveState;

        // 9. Now that the SVG structure is in the DOM, draw/update the segments into the segmentsGroup.
        this.updateButtonSegments();

        // 10. Handle glow animation (primarily managed by state machine subscription).
        if (!this.callIsActive) {
            AnimationModule.stopAnimation("glow");
            this.glowColorUpdater.updateGlowColor(0);
        }
    }

    callStarting(button: HTMLButtonElement | null = this.element) {
        const label = getMessage("callStarting");
        this.updateCallButton(button, callStartingIconSVG, label, () =>
            this.sayPiActor.send({ type: "saypi:hangup" }), // Use object syntax
            false // Not fully active yet
        );
        // Glow might start here or wait for listening state?
    }

    callActive(button: HTMLButtonElement | null = this.element) {
        const label = getMessage("callInProgress");
        this.updateCallButton(button, hangupIconSVG, label, () =>
             this.sayPiActor.send({ type: "saypi:hangup" }),
             true
        );
         // AnimationModule.startAnimation("glow"); // Ensure glow is on -- Handled by subscription
    }

    callInterruptible(button: HTMLButtonElement | null = this.element) {
        const handsFreeInterruptEnabled = this.userPreferences.getCachedAllowInterruptions();
        // Only show interrupt icon if preference is disabled (user must tap)
        if (!handsFreeInterruptEnabled) {
            const label = getMessage("callInterruptible");
            this.updateCallButton(button, interruptIconSVG, label, () => {
                 this.sayPiActor.send({ type: "saypi:interrupt" });
            }, true); // Active state
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
                false
        );
        
        // Apply ChatGPT theming specifically for the inactive call.svg icon
        const callButton = button || this.element;
        if (callButton) {
            const svgElement = callButton.querySelector('svg');
            if (svgElement) {
                this.applyChatGPTTheming(svgElement, callButton);
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
