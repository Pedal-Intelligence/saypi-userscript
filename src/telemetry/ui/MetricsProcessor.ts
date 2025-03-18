import { TelemetryData } from "../../TelemetryModule";
import { MetricDefinition, MetricsResult } from "./types";

/**
 * Processes telemetry data into metrics
 */
export class MetricsProcessor {
  /**
   * Process telemetry data into metrics for visualization
   */
  public static processMetrics(telemetryData: TelemetryData): MetricsResult {
    console.debug("Processing raw telemetry data:", JSON.stringify(telemetryData, null, 2));
    
    const metrics: MetricDefinition[] = [];
    
    // Get timestamps for additional calculations
    const timestamps = telemetryData.timestamps || {};
    
    // Map telemetry data to display metrics
    if (telemetryData.transcriptionDelay) {
      console.debug("Mapped transcriptionDelay", telemetryData.transcriptionDelay + "ms", "to voiceActivityDetection");
      metrics.push({
        key: 'voiceActivityDetection',
        label: 'Grace Period',
        value: telemetryData.transcriptionDelay,
        color: '#4285F4', // Blue
        explanation: 'Time between final transcription and submitting prompt to LLM'
      });
    } else {
      console.warn("No transcriptionDelay found in telemetry data:", telemetryData);
    }
    
    // Check for transcription data, either in the direct property or calculate from timestamps
    if (telemetryData.transcriptionTime) {
      console.debug("Mapped transcriptionTime", telemetryData.transcriptionTime + "ms", "to transcriptionDuration");
      metrics.push({
        key: 'transcriptionDuration',
        label: 'Transcription',
        value: telemetryData.transcriptionTime,
        color: '#DB4437', // Red
        explanation: 'Time taken to transcribe speech to text'
      });
    } else if (timestamps.transcriptionStart && timestamps.transcriptionEnd) {
      // Calculate transcription time from timestamps
      const calculatedTranscriptionTime = timestamps.transcriptionEnd - timestamps.transcriptionStart;
      console.debug("Calculated transcriptionTime from timestamps:", calculatedTranscriptionTime + "ms");
      metrics.push({
        key: 'transcriptionDuration',
        label: 'Transcription',
        value: calculatedTranscriptionTime,
        color: '#DB4437', // Red
        explanation: 'Time taken to transcribe speech to text (calculated from timestamps)'
      });
    }
    
    if (telemetryData.streamingDuration) {
      console.debug("Mapped streamingDuration", telemetryData.streamingDuration + "ms");
      metrics.push({
        key: 'streamingDuration',
        label: 'Pi writes',
        value: telemetryData.streamingDuration,
        color: '#F4B400', // Yellow/Gold
        explanation: 'Time taken to stream the text response'
      });
    }
    
    // Add a new metric for speech playback
    if (timestamps.audioPlaybackStart) {
      console.debug("Added Pi's speech playback marker");
      metrics.push({
        key: 'speechPlayback',
        label: 'Pi Speaks: 5+s',
        value: 5000, // Just a small duration to make it visible - this is just a marker
        color: '#0F9D58', // Green
        explanation: 'Point when Pi begins speaking the response (continues beyond timeline)'
      });
    }
    
    if (telemetryData.completionResponse) {
      console.debug("Mapped completionResponse", telemetryData.completionResponse + "ms");
      metrics.push({
        key: 'completionResponse',
        label: 'LLM Wait Time',
        value: telemetryData.completionResponse,
        color: '#673AB7', // Purple
        explanation: 'Time waiting for Pi to formulate a response'
      });
    }
    
    if (telemetryData.timeToTalk) {
      console.debug("Mapped timeToTalk", telemetryData.timeToTalk + "ms");
      metrics.push({
        key: 'timeToTalk',
        label: 'Time to Talk',
        value: telemetryData.timeToTalk,
        color: '#3F51B5', // Indigo
        explanation: 'Time from start of response to start of audio playback'
      });
    }
    
    // Calculate total end-to-end time
    let totalTime = 0;
    
    // If we have timestamps, calculate from speechEnd to audioPlaybackStart
    if (telemetryData.timestamps?.speechEnd && telemetryData.timestamps?.audioPlaybackStart) {
      totalTime = telemetryData.timestamps.audioPlaybackStart - telemetryData.timestamps.speechEnd;
    } else {
      // Otherwise sum up the component times
      totalTime = (telemetryData.transcriptionTime || 0) + 
                 (telemetryData.transcriptionDelay || 0) + 
                 (telemetryData.completionResponse || 0);
    }
    
    console.debug("Calculated totalTime:", totalTime + "ms");
    
    metrics.push({
      key: 'totalTime',
      label: 'Speech to Speech',
      value: totalTime,
      color: '#9E9E9E', // Gray
      explanation: 'Total time from end of user speech to beginning of Pi\'s audio response'
    });
    
    console.debug("Mapped telemetry metrics:", metrics.map(m => m.key).join(", "));
    
    return { metrics, totalTime };
  }
} 