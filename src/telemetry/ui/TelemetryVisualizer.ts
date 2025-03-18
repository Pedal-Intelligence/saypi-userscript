/**
 * Interface for a metric definition
 */
interface MetricDefinition {
  key: string;
  label: string;
  color: string;
  value: number;
  actualValue?: number; // Actual value before any display adjustments
  explanation: string;
}

/**
 * Visualizes telemetry data in a timeline format
 */
export class TelemetryVisualizer {
  /**
   * Creates a visualization of the telemetry data
   * @param container The container element to append the visualization to
   * @param metrics The metrics to visualize
   */
  public createVisualization(container: HTMLElement, metrics: MetricDefinition[]): void {
    if (!metrics.length) {
      console.warn("No metrics to display");
      return;
    }

    // Clear container
    container.innerHTML = '';

    // Add title
    const title = document.createElement("h3");
    title.textContent = "Performance Metrics";
    title.style.margin = "0 0 10px 0";
    title.style.fontSize = "18px";
    title.style.fontWeight = "bold";
    title.style.color = "#333";
    container.appendChild(title);

    // Create the timeline chart
    this.createTimelineChart(container, metrics);

    // Add explanatory text
    this.addExplanatoryText(container);
  }

  /**
   * Create a timeline chart visualization (Gantt chart)
   * @param container The container element
   * @param metrics The metrics to visualize
   */
  private createTimelineChart(container: HTMLElement, metrics: MetricDefinition[]): void {
    // Calculate timeline segments
    const { segments, timelineEnd } = this.calculateTimelineSegments(metrics);
    
    // Find the total time metric
    const totalSegment = segments.find(s => s.metricKey === 'totalTime');
    if (!totalSegment) {
      console.warn("No total time metric found");
      return;
    }
    
    // Create timeline container
    const timelineContainer = document.createElement("div");
    timelineContainer.className = "saypi-timeline-container";
    timelineContainer.style.position = "relative";
    timelineContainer.style.marginTop = "20px";
    timelineContainer.style.width = "100%";
    timelineContainer.style.backgroundColor = "#fff";
    timelineContainer.style.padding = "15px";
    timelineContainer.style.borderRadius = "4px";
    timelineContainer.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
    
    // Add the total time display at the top
    const totalLabel = document.createElement("div");
    totalLabel.style.margin = "0 0 20px 0";
    totalLabel.style.textAlign = "center";
    totalLabel.style.fontSize = "16px";
    totalLabel.style.fontWeight = "bold";
    totalLabel.style.color = "#333";
    totalLabel.textContent = `Speech to Speech: ${(totalSegment.duration / 1000).toFixed(2)}s`;
    timelineContainer.appendChild(totalLabel);
    
    // Create rows for the main and parallel processes
    const mainRow = this.createTimelineRow("Main", timelineEnd);
    const parallelRow = this.createTimelineRow("Parallel", timelineEnd);
    
    // Process each segment and add to appropriate row
    segments.forEach(segment => {
      if (segment.metricKey === 'totalTime') return; // Skip the total time segment
      
      // Create segment bar
      const bar = this.createSegmentBar(segment, timelineEnd);
      
      // Add to appropriate row based on type
      if (segment.metricKey === 'timeToTalk') {
        parallelRow.barContainer.appendChild(bar);
      } else {
        mainRow.barContainer.appendChild(bar);
      }
    });
    
    // Add rows to timeline container
    timelineContainer.appendChild(mainRow.container);
    timelineContainer.appendChild(parallelRow.container);
    
    // Add axis with tick marks
    const axisContainer = document.createElement("div");
    axisContainer.style.marginTop = "10px";
    axisContainer.style.position = "relative";
    axisContainer.style.height = "20px";
    axisContainer.style.borderTop = "1px solid #ddd";
    
    // Create tick marks
    const numTicks = Math.min(Math.ceil(timelineEnd / 1000), 10); // One tick per second, max 10
    for (let i = 0; i <= numTicks; i++) {
      const position = (i / numTicks) * 100;
      
      const tick = document.createElement("div");
      tick.style.position = "absolute";
      tick.style.top = "0";
      tick.style.left = `${position}%`;
      tick.style.width = "1px";
      tick.style.height = "5px";
      tick.style.backgroundColor = "#999";
      axisContainer.appendChild(tick);
      
      const label = document.createElement("div");
      label.style.position = "absolute";
      label.style.top = "6px";
      label.style.left = `${position}%`;
      label.style.transform = "translateX(-50%)";
      label.style.fontSize = "10px";
      label.style.color = "#666";
      label.textContent = `${i}s`;
      axisContainer.appendChild(label);
    }
    
    timelineContainer.appendChild(axisContainer);
    
    // Create legend at the bottom
    const legendContainer = document.createElement("div");
    legendContainer.style.display = "flex";
    legendContainer.style.flexWrap = "wrap";
    legendContainer.style.marginTop = "20px";
    legendContainer.style.gap = "15px";
    
    // Add each segment to the legend
    const legendSegments = segments.filter(s => s.metricKey !== 'totalTime');
    legendSegments.forEach(segment => {
      const legendItem = document.createElement("div");
      legendItem.style.display = "flex";
      legendItem.style.alignItems = "center";
      
      const colorBox = document.createElement("div");
      colorBox.style.width = "12px";
      colorBox.style.height = "12px";
      colorBox.style.backgroundColor = segment.color;
      colorBox.style.marginRight = "5px";
      colorBox.style.borderRadius = "2px";
      
      const label = document.createElement("span");
      label.style.fontSize = "12px";
      label.style.color = "#333";
      label.textContent = `${segment.label}: ${(segment.duration / 1000).toFixed(2)}s`;
      
      legendItem.appendChild(colorBox);
      legendItem.appendChild(label);
      legendContainer.appendChild(legendItem);
    });
    
    timelineContainer.appendChild(legendContainer);
    
    // Add the timeline container to the main container
    container.appendChild(timelineContainer);
  }
  
  /**
   * Create a timeline row for the Gantt chart
   * @param label The row label
   * @param timelineEnd The end time of the timeline
   * @returns The row elements
   */
  private createTimelineRow(label: string, timelineEnd: number): { container: HTMLElement, barContainer: HTMLElement } {
    const rowContainer = document.createElement("div");
    rowContainer.style.display = "flex";
    rowContainer.style.marginBottom = "10px";
    rowContainer.style.height = "30px";
    
    // Create label
    const labelElement = document.createElement("div");
    labelElement.style.width = "80px";
    labelElement.style.flexShrink = "0";
    labelElement.style.display = "flex";
    labelElement.style.alignItems = "center";
    labelElement.style.justifyContent = "flex-end";
    labelElement.style.paddingRight = "10px";
    labelElement.style.fontSize = "12px";
    labelElement.style.fontWeight = "bold";
    labelElement.style.color = "#555";
    labelElement.textContent = label;
    
    // Create bar container (timeline)
    const barContainer = document.createElement("div");
    barContainer.style.flex = "1";
    barContainer.style.position = "relative";
    barContainer.style.height = "100%";
    barContainer.style.backgroundColor = "#f5f5f5";
    barContainer.style.borderRadius = "3px";
    
    rowContainer.appendChild(labelElement);
    rowContainer.appendChild(barContainer);
    
    return { container: rowContainer, barContainer };
  }
  
  /**
   * Create a segment bar for the timeline
   * @param segment The segment data
   * @param timelineEnd The end time of the timeline
   * @returns The segment bar element
   */
  private createSegmentBar(segment: TimelineSegment, timelineEnd: number): HTMLElement {
    const bar = document.createElement("div");
    bar.style.position = "absolute";
    bar.style.top = "0";
    bar.style.height = "100%";
    bar.style.backgroundColor = segment.color;
    bar.style.borderRadius = "3px";
    bar.style.boxShadow = "0 1px 3px rgba(0,0,0,0.2)";
    
    // Position the bar based on its start and duration
    const startPercent = (segment.start / timelineEnd) * 100;
    const widthPercent = ((segment.end - segment.start) / timelineEnd) * 100;
    bar.style.left = `${startPercent}%`;
    bar.style.width = `${widthPercent}%`;
    
    // Add label inside the bar if there's enough space
    if (widthPercent > 10) {
      const label = document.createElement("div");
      label.style.position = "absolute";
      label.style.top = "50%";
      label.style.left = "50%";
      label.style.transform = "translate(-50%, -50%)";
      label.style.color = "#fff";
      label.style.fontSize = "11px";
      label.style.fontWeight = "500";
      label.style.whiteSpace = "nowrap";
      label.style.textShadow = "0 1px 1px rgba(0,0,0,0.5)";
      label.textContent = `${segment.label} (${(segment.duration / 1000).toFixed(1)}s)`;
      bar.appendChild(label);
    }
    
    // Add tooltip
    bar.title = `${segment.label}: ${(segment.duration / 1000).toFixed(2)}s\n${segment.explanation || ''}`;
    
    // Add hover effect
    bar.addEventListener('mouseover', () => {
      bar.style.boxShadow = "0 2px 5px rgba(0,0,0,0.3)";
      bar.style.transform = "translateY(-1px)";
      bar.style.transition = "all 0.2s ease";
    });
    
    bar.addEventListener('mouseout', () => {
      bar.style.boxShadow = "0 1px 3px rgba(0,0,0,0.2)";
      bar.style.transform = "translateY(0)";
    });
    
    return bar;
  }
  
  /**
   * Add explanatory text to the visualization
   * @param container The container element
   */
  private addExplanatoryText(container: HTMLElement): void {
    const textContainer = document.createElement("div");
    textContainer.style.marginTop = "20px";
    textContainer.style.color = "#555";
    textContainer.style.fontSize = "12px";
    textContainer.style.lineHeight = "1.5";
    
    const lines = [
      "This Gantt chart shows when each process starts and ends, and how they overlap in time.",
      "Gaps between processes represent waiting periods.",
      "Hover over segments for additional details."
    ];
    
    lines.forEach(line => {
      const paragraph = document.createElement("p");
      paragraph.style.margin = "5px 0";
      paragraph.textContent = line;
      textContainer.appendChild(paragraph);
    });
    
    container.appendChild(textContainer);
  }

  /**
   * Calculate timeline segments from metrics
   * @param metrics The metrics to calculate segments from
   * @returns The timeline segments and end time
   */
  private calculateTimelineSegments(metrics: MetricDefinition[]): { segments: TimelineSegment[], timelineEnd: number } {
    // Log available metrics for debugging
    console.debug("Available metrics for timeline calculation:", metrics.map(m => m.key));
    
    // Find the end-to-end time
    const totalTimeMetric = metrics.find(m => m.key === 'totalTime');
    if (!totalTimeMetric) {
      console.warn("No total time metric found");
      return { segments: [], timelineEnd: 0 };
    }
    
    const timelineEnd = totalTimeMetric.value + 200; // Add padding for visual aesthetics
    
    // Create segments
    const segments: TimelineSegment[] = [];
    let currentPosition = 0;
    
    // Add transcription segment
    const transcriptionMetric = metrics.find(m => m.key === 'transcriptionDuration');
    if (transcriptionMetric) {
      const duration = Math.max(transcriptionMetric.value, 300); // Ensure minimum visible width
      segments.push({
        metricKey: 'transcriptionDuration',
        label: 'Transcription',
        start: currentPosition,
        end: currentPosition + duration,
        duration,
        color: '#c0392b', // Red
        explanation: 'Time taken to transcribe user speech'
      });
      currentPosition += duration;
    }
    
    // Add grace period segment
    const graceMetric = metrics.find(m => m.key === 'voiceActivityDetection');
    if (graceMetric && graceMetric.value > 0) {
      const duration = Math.max(graceMetric.value, 200); // Ensure minimum visible width
      segments.push({
        metricKey: 'voiceActivityDetection',
        label: 'Grace Period',
        start: currentPosition,
        end: currentPosition + duration,
        duration,
        color: '#3498db', // Blue
        explanation: 'Waiting period after speech detection'
      });
      currentPosition += duration;
    }
    
    // Add LLM wait time segment
    const completionMetric = metrics.find(m => m.key === 'completionResponse');
    if (completionMetric) {
      segments.push({
        metricKey: 'completionResponse',
        label: 'LLM Wait Time',
        start: currentPosition,
        end: currentPosition + completionMetric.value,
        duration: completionMetric.value,
        color: '#5f27cd', // Purple
        explanation: 'Time waiting for LLM to generate a response'
      });
      currentPosition += completionMetric.value;
    }
    
    // Add streaming duration segment
    const streamingMetric = metrics.find(m => m.key === 'streamingDuration');
    if (streamingMetric && streamingMetric.value > 0) {
      segments.push({
        metricKey: 'streamingDuration',
        label: 'Pi writes',
        start: currentPosition,
        end: currentPosition + streamingMetric.value,
        duration: streamingMetric.value,
        color: '#f39c12', // Orange/Yellow
        explanation: 'Time for Pi to stream the text response'
      });
      currentPosition += streamingMetric.value;
    }
    
    // Add time to talk segment
    const timeToTalkMetric = metrics.find(m => m.key === 'timeToTalk');
    if (timeToTalkMetric) {
      // Position time to talk from the start up to the audio playback
      segments.push({
        metricKey: 'timeToTalk',
        label: 'Time to Talk',
        start: 0,
        end: currentPosition, // Up to current position
        duration: currentPosition,
        color: '#ddd', // Light Gray
        explanation: 'Total time from user speech to Pi response'
      });
    }
    
    // Add speech playback marker at the end
    segments.push({
      metricKey: 'speechPlayback',
      label: 'Pi Speaks',
      start: currentPosition - 100, // Place just before the end
      end: currentPosition + 100,
      duration: 200,
      color: '#27ae60', // Green
      explanation: 'Pi begins speaking the response'
    });
    
    // Add total time segment spanning the entire timeline
    segments.push({
      metricKey: 'totalTime',
      label: 'Speech to Speech',
      start: 0,
      end: timelineEnd - 200, // Account for the padding
      duration: totalTimeMetric.value,
      color: '#7f8c8d', // Gray
      explanation: 'Total time from user speech to Pi speech response'
    });
    
    return { segments, timelineEnd };
  }
}

/**
 * Represents a segment in the timeline visualization
 */
interface TimelineSegment {
  metricKey: string;
  label: string;
  start: number;
  end: number;
  duration: number;
  color: string;
  explanation?: string;
} 