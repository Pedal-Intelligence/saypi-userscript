import EventBus from "./events/EventBus";

/**
 * Telemetry data for a single speech/chat message
 */
export interface TelemetryData {
  // When the user stopped speaking and when transcription request sent
  gracePeriod?: number;
  
  // Time from transcription request sent to response received
  transcriptionTime?: number;
  
  // Delay waiting for slower out-of-order transcription requests
  transcriptionDelay?: number;
  
  // Time from final transcription to prompt submission
  promptSubmission?: number;
  
  // Time from chat completion request to start of response
  completionResponse?: number;
  
  // Time from start to end of chat completion response (if streaming)
  streamingDuration?: number;
  
  // Time from start of chat completion to start of audio playback
  timeToTalk?: number;
}

/**
 * Module for collecting and storing performance telemetry data
 * Simplified to only track one message at a time (the current/most recent one)
 */
export class TelemetryModule {
  private static instance: TelemetryModule;
  
  // Single telemetry record for the current message
  private currentTelemetry: TelemetryData = {};
  
  // Timing variables for the current message
  private speechStartTime: number = 0;
  private speechEndTime: number = 0;
  private transcriptionStartTime: number = 0;
  private transcriptionEndTime: number = 0;
  private lastTranscriptionTime: number = 0;
  private promptSubmissionTime: number = 0;
  private completionStartTime: number = 0;
  private completionEndTime: number = 0;
  private audioPlaybackStartTime: number = 0;
  
  // Current sequence number for transcription
  private currentSequence: number = 0;

  private constructor() {
    this.setupEventListeners();
  }

  public static getInstance(): TelemetryModule {
    if (!TelemetryModule.instance) {
      TelemetryModule.instance = new TelemetryModule();
    }
    return TelemetryModule.instance;
  }

  /**
   * Set up event listeners to capture timing data
   */
  private setupEventListeners(): void {
    // Reset telemetry when user starts speaking a new message
    EventBus.on("saypi:userSpeaking", () => {
      this.resetTelemetry();
      this.speechStartTime = Date.now();
    });

    EventBus.on("saypi:userStoppedSpeaking", () => {
      this.speechEndTime = Date.now();
    });

    // Listen for transcription events
    EventBus.on("saypi:transcribing", (event: any) => {
      this.currentSequence = event.sequenceNumber;
      this.transcriptionStartTime = event.timestamp || Date.now();
      
      // Record grace period (time between user stopped speaking and transcription request)
      if (this.speechEndTime > 0) {
        const gracePeriod = this.transcriptionStartTime - this.speechEndTime;
        console.debug(`Grace period: ${gracePeriod}ms`);
        this.currentTelemetry.gracePeriod = gracePeriod;
        this.emitUpdate();
      }
    });

    EventBus.on("saypi:transcribed", () => {
      this.transcriptionEndTime = Date.now();
      this.lastTranscriptionTime = Date.now();
      
      // Update transcription time
      if (this.transcriptionStartTime > 0) {
        this.currentTelemetry.transcriptionTime = this.transcriptionEndTime - this.transcriptionStartTime;
        this.emitUpdate();
      }
    });
    
    // Handle specific transcription events from TranscriptionModule
    EventBus.on("saypi:transcription:received", (event: any) => {
      if (event.sequenceNumber === this.currentSequence && event.duration) {
        this.currentTelemetry.transcriptionTime = event.duration;
        this.emitUpdate();
      }
    });

    // Listen for chat completion events
    EventBus.on("session:message-sent", () => {
      this.promptSubmissionTime = Date.now();
      
      // Calculate transcription delay
      if (this.lastTranscriptionTime > 0) {
        this.currentTelemetry.transcriptionDelay = this.promptSubmissionTime - this.lastTranscriptionTime;
        this.emitUpdate();
      }
    });

    EventBus.on("saypi:piWriting", () => {
      this.completionStartTime = Date.now();
      
      // Calculate completion response time
      if (this.promptSubmissionTime > 0) {
        this.currentTelemetry.completionResponse = this.completionStartTime - this.promptSubmissionTime;
        this.emitUpdate();
      }
    });

    EventBus.on("saypi:piStoppedWriting", () => {
      this.completionEndTime = Date.now();
      
      // Calculate streaming duration
      if (this.completionStartTime > 0) {
        this.currentTelemetry.streamingDuration = this.completionEndTime - this.completionStartTime;
        this.emitUpdate();
      }
    });

    // Listen for audio playback events
    EventBus.on("saypi:piSpeaking", () => {
      this.audioPlaybackStartTime = Date.now();
      
      // Calculate time to talk
      if (this.completionStartTime > 0) {
        this.currentTelemetry.timeToTalk = this.audioPlaybackStartTime - this.completionStartTime;
        this.emitUpdate();
      }
    });
  }

  /**
   * Reset all telemetry data for a new message
   */
  public resetTelemetry(): void {
    this.currentTelemetry = {};
    this.speechStartTime = 0;
    this.speechEndTime = 0;
    this.transcriptionStartTime = 0;
    this.transcriptionEndTime = 0;
    this.promptSubmissionTime = 0;
    this.completionStartTime = 0;
    this.completionEndTime = 0;
    this.audioPlaybackStartTime = 0;
    this.currentSequence = 0;
    
    // Emit an empty update to clear any visualizations
    this.emitUpdate();
  }

  /**
   * Get the current telemetry data
   */
  public getCurrentTelemetry(): TelemetryData {
    return { ...this.currentTelemetry };
  }

  /**
   * Update telemetry data manually
   */
  public updateTelemetryData(data: Partial<TelemetryData>): void {
    this.currentTelemetry = { ...this.currentTelemetry, ...data };
    this.emitUpdate();
  }
  
  /**
   * Emit an update event with the current telemetry data
   */
  private emitUpdate(): void {
    EventBus.emit("telemetry:updated", { data: this.currentTelemetry });
  }
}

export default TelemetryModule.getInstance(); 