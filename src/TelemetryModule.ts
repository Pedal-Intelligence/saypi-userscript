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
  
  // Absolute timestamps for key events (in milliseconds since epoch)
  timestamps?: {
    speechStart?: number;
    speechEnd?: number;
    transcriptionStart?: number;
    transcriptionEnd?: number;
    promptSubmission?: number;
    completionStart?: number;
    completionEnd?: number;
    audioPlaybackStart?: number;
  };
}

/**
 * Module for collecting and storing performance telemetry data
 * Simplified to only track one message at a time (the current/most recent one)
 */
export class TelemetryModule {
  private static instance: TelemetryModule;
  
  // Single telemetry record for the current message
  private currentTelemetry: TelemetryData = {
    timestamps: {}
  };
  
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
  
  // The reference start time (earliest event in the current session)
  private sessionStartTime: number = 0;

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
      this.sessionStartTime = this.speechStartTime; // Set initial reference time
      this.currentTelemetry.timestamps = { speechStart: this.speechStartTime };
      this.emitUpdate();
    });

    EventBus.on("saypi:userStoppedSpeaking", () => {
      this.speechEndTime = Date.now();
      console.debug("User stopped speaking at", this.speechEndTime);
      if (!this.currentTelemetry.timestamps) this.currentTelemetry.timestamps = {};
      this.currentTelemetry.timestamps.speechEnd = this.speechEndTime;
      this.emitUpdate();
    });

    // Listen for transcription events
    EventBus.on("saypi:transcribing", (event: any) => {
      this.currentSequence = event.sequenceNumber;
      this.transcriptionStartTime = event.timestamp || Date.now();
      
      // Update session start time if this is earlier
      if (this.sessionStartTime === 0 || this.transcriptionStartTime < this.sessionStartTime) {
        this.sessionStartTime = this.transcriptionStartTime;
      }
      
      if (!this.currentTelemetry.timestamps) this.currentTelemetry.timestamps = {};
      this.currentTelemetry.timestamps.transcriptionStart = this.transcriptionStartTime;
    });
    
    // Handle specific transcription events from TranscriptionModule
    EventBus.on("saypi:transcription:received", (event: any) => {
      if (event.sequenceNumber === this.currentSequence && event.timestamp) {
        if (!this.currentTelemetry.timestamps) this.currentTelemetry.timestamps = {};
        this.currentTelemetry.timestamps.transcriptionEnd = event.timestamp;
        // Save the last transcription time for grace period calculation
        this.lastTranscriptionTime = event.timestamp;
        this.transcriptionEndTime = event.timestamp;
        console.debug(`Transcription received and lastTranscriptionTime updated: ${this.lastTranscriptionTime}`);
        this.emitUpdate();
      }
    });

    // Listen for chat completion events
    EventBus.on("session:message-sent", () => {
      this.promptSubmissionTime = Date.now();
      
      if (!this.currentTelemetry.timestamps) this.currentTelemetry.timestamps = {};
      this.currentTelemetry.timestamps.promptSubmission = this.promptSubmissionTime;
      
      // Calculate transcription delay (grace period)
      if (this.lastTranscriptionTime > 0) {
        this.currentTelemetry.transcriptionDelay = this.promptSubmissionTime - this.lastTranscriptionTime;
        console.debug(`Calculated transcriptionDelay (grace period): ${this.currentTelemetry.transcriptionDelay}ms`);
        this.emitUpdate();
      } else if (this.currentTelemetry.timestamps.transcriptionEnd) {
        // Alternative calculation if lastTranscriptionTime is not set but we have the timestamp
        this.currentTelemetry.transcriptionDelay = this.promptSubmissionTime - this.currentTelemetry.timestamps.transcriptionEnd;
        console.debug(`Calculated transcriptionDelay (grace period) from timestamps: ${this.currentTelemetry.transcriptionDelay}ms`);
        this.emitUpdate();
      } else {
        console.warn("Cannot calculate grace period - no transcription end time available");
      }
    });

    EventBus.on("saypi:llm:first-token", () => {
      this.completionStartTime = Date.now();
      
      if (!this.currentTelemetry.timestamps) this.currentTelemetry.timestamps = {};
      this.currentTelemetry.timestamps.completionStart = this.completionStartTime;
      
      // Calculate completion response time
      if (this.promptSubmissionTime > 0) {
        this.currentTelemetry.completionResponse = this.completionStartTime - this.promptSubmissionTime;
        this.emitUpdate();
      }
    });

    EventBus.on("saypi:piStoppedWriting", () => {
      this.completionEndTime = Date.now();
      
      if (!this.currentTelemetry.timestamps) this.currentTelemetry.timestamps = {};
      this.currentTelemetry.timestamps.completionEnd = this.completionEndTime;
      
      // Calculate streaming duration
      if (this.completionStartTime > 0) {
        this.currentTelemetry.streamingDuration = this.completionEndTime - this.completionStartTime;
        this.emitUpdate();
      }
    });

    // Listen for audio playback events
    EventBus.on("saypi:piSpeaking", () => {
      this.audioPlaybackStartTime = Date.now();
      console.debug("Pi started speaking at", this.audioPlaybackStartTime);
      if (!this.currentTelemetry.timestamps) this.currentTelemetry.timestamps = {};
      this.currentTelemetry.timestamps.audioPlaybackStart = this.audioPlaybackStartTime;
      
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
    this.currentTelemetry = {
      timestamps: {}
    };
    this.speechStartTime = 0;
    this.speechEndTime = 0;
    this.transcriptionStartTime = 0;
    this.transcriptionEndTime = 0;
    this.promptSubmissionTime = 0;
    this.completionStartTime = 0;
    this.completionEndTime = 0;
    this.audioPlaybackStartTime = 0;
    this.currentSequence = 0;
    this.sessionStartTime = 0;
    
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
   * Get the session start time (earliest event in the current session)
   */
  public getSessionStartTime(): number {
    return this.sessionStartTime;
  }

  /**
   * Update telemetry data manually
   */
  public updateTelemetryData(data: Partial<TelemetryData>): void {
    this.currentTelemetry = { ...this.currentTelemetry, ...data };
    
    // Make sure timestamps object exists
    if (!this.currentTelemetry.timestamps) {
      this.currentTelemetry.timestamps = {};
    }
    
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