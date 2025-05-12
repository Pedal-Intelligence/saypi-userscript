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
    private sayPiActor: typeof StateMachineService.actor;
    private glowColorUpdater: GlowColorUpdater;

    private callIsActive: boolean = false;
    private segments: Segment[] = [];
    private currentSeqNum: number = 0;
    private currentSegment: Segment | null = null;
    private element: HTMLButtonElement | null = null; // Keep track of the button element

    constructor(chatbot: Chatbot) {
        this.chatbot = chatbot;
        this.userPreferences = UserPreferenceModule.getInstance();
        this.sayPiActor = StateMachineService.actor;
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
        EventBus.on("saypi:userStoppedSpeaking", (data: any) => this.handleUserStoppedSpeaking(data)); // Type data appropriately
        EventBus.on("audio:dataavailable", (data: any) => this.handleAudioDataAvailable(data));
        EventBus.on("session:transcribing", (data: any) => this.handleSessionTranscribing(data));
        EventBus.on("saypi:transcribed", (data: any) => this.handleTranscriptionReceived(data));
        EventBus.on("saypi:transcribeFailed", (data: any) => this.handleTranscriptionFailed(data));
        EventBus.on("saypi:transcribedEmpty", (data: any) => this.handleTranscriptionEmpty(data));
        EventBus.on("session:started", () => this.resetSegments());
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
        this.currentSeqNum = 0;
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
           console.debug(`Segment ${this.currentSeqNum}: Started capturing`);
           this.updateButtonSegments();
        } else if (this.currentSegment.status !== 'capturing') {
            this.currentSegment.status = 'capturing';
            this.updateButtonSegments();
        }
    }

    handleUserStoppedSpeaking(data: { duration: number; blob?: Blob }) {
       if (!this.callIsActive || !this.currentSegment) return;
       if (this.currentSegment.status === 'capturing') {
          console.debug(`Segment ${this.currentSegment.seqNum}: VAD stopped`);
          // Wait for audio:dataavailable to finalize
       }
    }

    handleAudioDataAvailable(data: { sequenceNumber: number, blob: Blob, duration: number }) {
        if (!this.callIsActive) return;
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

    handleSessionTranscribing(data: { sequenceNumber: number }) {
         if (!this.callIsActive) return;
        const segment = this.segments.find(s => s.seqNum === data.sequenceNumber);
        if (segment && segment.status !== 'processing') {
            segment.status = 'processing';
            console.debug(`Segment ${data.sequenceNumber}: Confirmed processing`);
            this.updateButtonSegments();
        }
    }

    handleTranscriptionReceived(data: { sequenceNumber: number, text: string }) {
        if (!this.callIsActive) return;
        const segment = this.segments.find(s => s.seqNum === data.sequenceNumber);
        if (segment) {
            segment.status = 'completed-success';
            console.debug(`Segment ${data.sequenceNumber}: Completed-Success`);
            this.updateButtonSegments();
        } else {
            console.warn("Transcription received for unknown sequence number:", data.sequenceNumber);
        }
    }

     handleTranscriptionFailed(data: { sequenceNumber: number }) {
         if (!this.callIsActive) return;
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

     handleTranscriptionEmpty(data: { sequenceNumber: number }) {
         if (!this.callIsActive) return;
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

        if (!segmentsGroup) {
            segmentsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            segmentsGroup.setAttribute('id', 'saypi-segments-group');
            svg.insertBefore(segmentsGroup, svg.firstChild);
        }

        // Clear existing segments
        while (segmentsGroup.firstChild) {
            segmentsGroup.removeChild(segmentsGroup.firstChild);
        }

        const statusColors = {
          capturing: '#808080',
          processing: '#3498db',
          'completed-success': '#2ecc71',
          'completed-error': '#e74c3c',
        };

        const allSegmentsData = [...this.segments];
        if (this.currentSegment) {
            allSegmentsData.push(this.currentSegment);
        }

        const totalSegments = allSegmentsData.length;
        if (totalSegments === 0) return;

        const viewBox = svg.getAttribute('viewBox')?.split(' ').map(Number);
        const svgWidth = viewBox ? viewBox[2] : 80; // Default guess
        const svgHeight = viewBox ? viewBox[3] : 80; // Default guess
        const center = svgWidth / 2; // Use width for center X assuming square/circular
        const radius = Math.min(svgWidth, svgHeight) / 2 * 0.9; // Outer radius factor
        const strokeWidth = radius * 0.12; // Stroke width factor
        const segmentRadius = radius - strokeWidth / 2; // Radius for the center of the stroke

        const gap = 1.5; // Gap between segments in degrees

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

        let startAngle = -90; // Start from the top

        allSegmentsData.forEach((segmentData, index) => {
            const endAngle = startAngle + anglePerSegment;
            const color = statusColors[segmentData.status] || '#cccccc';

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const arcPath = this.describeArc(center, center, segmentRadius, startAngle, endAngle);

            path.setAttribute('d', arcPath);
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke', color);
            path.setAttribute('stroke-width', strokeWidth.toString());
            path.setAttribute('stroke-linecap', 'butt');
            segmentsGroup!.appendChild(path);

            startAngle = endAngle + gap;
        });
    }

    private describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number): string {
        // Ensure angles are within 0-360 range if needed, though differences matter more
        // Handle full circle case by slightly adjusting endAngle
        if (endAngle - startAngle >= 359.99) {
            endAngle = startAngle + 359.99;
        }

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

        const d = [
            "M", start.x.toFixed(3), start.y.toFixed(3),
            "A", radius.toFixed(3), radius.toFixed(3), 0, largeArcFlag, 1, end.x.toFixed(3), end.y.toFixed(3)
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

        // Ensure segments drawn *after* initial SVG is added by callActive/callInactive
        this.updateButtonSegments();

        if (this.callIsActive) {
            AnimationModule.startAnimation("glow");
        }
        return button;
    }

    private updateCallButton(button: HTMLButtonElement | null, svgIconString: string, label: string, onClick: (() => void) | null, isActiveState: boolean) {
        const callButton = button || this.element;
        if (!callButton) return;

        // 1. Clear ALL previous children from the button.
        while (callButton.firstChild) {
            callButton.removeChild(callButton.firstChild);
        }

        // 2. Create the new SVG element from the icon string.
        const newSvgElement = createSVGElement(svgIconString); // This should be the <svg> element
        if (!newSvgElement || !(newSvgElement instanceof SVGElement)) { // Type check
            console.error("Failed to create SVG element from string or invalid type:", svgIconString);
            callButton.textContent = label; // Fallback: just show the label as text
            return;
        }

        // 3. Create the segments group that will live inside the new SVG element.
        const segmentsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        segmentsGroup.setAttribute('id', 'saypi-segments-group');

        // 4. Insert segmentsGroup as the first child of the new SVG element.
        // This ensures other parts of the icon (like the phone receiver path) draw on top of the segments.
        newSvgElement.insertBefore(segmentsGroup, newSvgElement.firstChild);

        // 5. Append the complete new SVG element (which now contains the empty segments group and the icon paths)
        // directly to the button.
        callButton.appendChild(newSvgElement);

        // 6. Set attributes and event listeners on the button itself.
        callButton.setAttribute("aria-label", label);
        if (onClick) {
            callButton.onclick = onClick;
        } else {
            callButton.onclick = null;
        }
        callButton.classList.toggle("active", isActiveState);

        // 7. Update internal state.
        this.callIsActive = isActiveState;

        // 8. Now that the SVG structure is in the DOM, draw/update the segments into the segmentsGroup.
        this.updateButtonSegments();

        // 9. Handle glow animation (primarily managed by state machine subscription).
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
            this.callActive(button);
            this.callInactive(button);
        }
    }

    async callInactive(button: HTMLButtonElement | null = this.element) { // Make async
        const nickname = await this.chatbot.getNickname(); // Await nickname
        const label = getMessage("callNotStarted", nickname);
        this.updateCallButton(button, callIconSVG, label, () =>
                this.sayPiActor.send({ type: "saypi:call" }),
                false
        );
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