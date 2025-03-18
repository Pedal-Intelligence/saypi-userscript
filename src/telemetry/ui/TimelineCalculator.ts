import { MetricDefinition, TimelineResult, TimelineSegment } from "./types";

/**
 * Handles timeline segment calculation for the telemetry visualization
 */
export class TimelineCalculator {
  /**
   * Calculate timeline segments from metrics
   */
  public static calculateTimelineSegments(metrics: MetricDefinition[]): TimelineResult {
    // Sort metrics by key based on a predefined order for consistency
    const orderArray = ['transcriptionDuration', 'voiceActivityDetection', 'completionResponse', 'streamingDuration', 'speechPlayback', 'timeToTalk', 'totalTime'];
    metrics.sort((a, b) => {
      return orderArray.indexOf(a.key) - orderArray.indexOf(b.key);
    });

    // Debug: log available metrics
    console.debug("Available metrics for timeline:", metrics.map(m => `${m.key}: ${m.value}ms`).join(", "));

    // Get segments with correct positioning
    return this.calculateTimelinePositions(metrics);
  }

  /**
   * Calculate timeline positions for metrics
   */
  private static calculateTimelinePositions(metrics: MetricDefinition[]): TimelineResult {
    const segments: TimelineSegment[] = [];
    let timelineEnd = 0;
    
    // Find the total time metric for reference
    const totalTimeMetric = metrics.find(m => m.key === 'totalTime');
    if (!totalTimeMetric) {
      console.warn("Total time metric not found, timeline may be incorrect");
      return { segments, timelineEnd: 0 };
    }
    
    // The total time is our reference for the end of the timeline
    timelineEnd = totalTimeMetric.value;
    
    // Starting point is relative to the end of speech (time zero)
    let currentPosition = 0;
    
    // Create segments with proper positioning based on the sequence of events
    // Transcription happens first
    const transcriptionMetric = metrics.find(m => m.key === 'transcriptionDuration');
    if (transcriptionMetric) {
      segments.push({
        metricKey: transcriptionMetric.key,
        label: transcriptionMetric.label,
        start: currentPosition,
        end: currentPosition + transcriptionMetric.value,
        duration: transcriptionMetric.value,
        color: transcriptionMetric.color,
        explanation: transcriptionMetric.explanation,
        row: 0
      });
      currentPosition += transcriptionMetric.value;
    }
    
    // Grace period (activity detection delay) is next
    const gracePeriodMetric = metrics.find(m => m.key === 'voiceActivityDetection');
    if (gracePeriodMetric) {
      segments.push({
        metricKey: gracePeriodMetric.key,
        label: gracePeriodMetric.label,
        start: currentPosition,
        end: currentPosition + gracePeriodMetric.value,
        duration: gracePeriodMetric.value,
        color: gracePeriodMetric.color,
        explanation: gracePeriodMetric.explanation,
        row: 0
      });
      currentPosition += gracePeriodMetric.value;
    }
    
    // LLM Wait Time is next
    const completionMetric = metrics.find(m => m.key === 'completionResponse');
    if (completionMetric) {
      segments.push({
        metricKey: completionMetric.key,
        label: completionMetric.label,
        start: currentPosition,
        end: currentPosition + completionMetric.value,
        duration: completionMetric.value,
        color: completionMetric.color,
        explanation: completionMetric.explanation,
        row: 0
      });
      currentPosition += completionMetric.value;
    }
    
    // Streaming duration (Pi's writing) is next
    const streamingMetric = metrics.find(m => m.key === 'streamingDuration');
    if (streamingMetric) {
      segments.push({
        metricKey: streamingMetric.key,
        label: streamingMetric.label,
        start: currentPosition,
        end: currentPosition + streamingMetric.value,
        duration: streamingMetric.value,
        color: streamingMetric.color,
        explanation: streamingMetric.explanation,
        row: 0
      });
      currentPosition += streamingMetric.value;
    }
    
    // Time to Talk is parallel to other metrics and shows the path to audio playback
    const timeToTalkMetric = metrics.find(m => m.key === 'timeToTalk');
    if (timeToTalkMetric && completionMetric) {
      // Time to Talk starts from the beginning of the completion
      const ttStart = segments.find(s => s.metricKey === 'completionResponse')?.start || 0;
      segments.push({
        metricKey: timeToTalkMetric.key,
        label: timeToTalkMetric.label,
        start: ttStart,
        end: ttStart + timeToTalkMetric.value,
        duration: timeToTalkMetric.value,
        color: timeToTalkMetric.color,
        explanation: timeToTalkMetric.explanation,
        row: 1 // Different row to show parallel process
      });
    }
    
    // Pi's speech playback is the final marker
    const speechPlaybackMetric = metrics.find(m => m.key === 'speechPlayback');
    if (speechPlaybackMetric) {
      // Speech playback starts at the end of Time to Talk or at end of timeline
      const spStart = segments.find(s => s.metricKey === 'timeToTalk')?.end || timelineEnd;
      segments.push({
        metricKey: speechPlaybackMetric.key,
        label: speechPlaybackMetric.label,
        start: spStart, 
        end: timelineEnd, // Extend to the end of the timeline
        duration: speechPlaybackMetric.value,
        color: speechPlaybackMetric.color,
        explanation: speechPlaybackMetric.explanation,
        row: 0
      });
    }
    
    // Add the total time segment spanning the entire timeline, for display purposes
    const totalTime = metrics.find(m => m.key === 'totalTime');
    if (totalTime) {
      segments.push({
        metricKey: totalTime.key,
        label: totalTime.label,
        start: 0,
        end: timelineEnd,
        duration: totalTime.value,
        color: totalTime.color,
        explanation: totalTime.explanation,
        row: 2 // Put this at the bottom
      });
    }
    
    // Debug: log all segments
    console.debug("Timeline segments:", segments.map(s => 
      `${s.metricKey}: start=${(s.start/1000).toFixed(2)}s, end=${(s.end/1000).toFixed(2)}s, duration=${(s.duration/1000).toFixed(2)}s`
    ).join("\n"));
    
    return { segments, timelineEnd };
  }
} 