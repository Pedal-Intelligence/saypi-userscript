import { TelemetryData } from "../../TelemetryModule";
import { MetricsProcessor } from "./MetricsProcessor";
import { TimelineCalculator } from "./TimelineCalculator";
import { MetricDefinition, TimelineSegment } from "./types";

/**
 * Renders telemetry visualizations
 */
export class TelemetryVisualizer {
  private telemetryContainer: HTMLElement | null = null;
  private isVisible: boolean = false;

  /**
   * Creates a new TelemetryVisualizer
   * @param parentElement The element to attach the visualization to
   */
  constructor(private parentElement: HTMLElement) {}

  /**
   * Create and display the telemetry visualization
   * @param telemetryData The telemetry data to visualize
   */
  public visualize(telemetryData: TelemetryData): void {
    // Remove any existing visualization
    if (this.telemetryContainer) {
      this.telemetryContainer.remove();
      this.telemetryContainer = null;
    }

    // Process the telemetry data into metrics
    const { metrics, totalTime } = MetricsProcessor.processMetrics(telemetryData);
    if (!metrics.length) {
      console.warn("No metrics to display");
      return;
    }

    // Create the visualization container
    this.createVisualization(metrics);
    this.isVisible = true;
  }

  /**
   * Check if the visualization is currently visible
   */
  public isVisualizationVisible(): boolean {
    return this.isVisible;
  }

  /**
   * Toggle the visibility of the telemetry visualization
   * @returns The new visibility state
   */
  public toggleVisibility(): boolean {
    console.debug("TelemetryVisualizer.toggleVisibility called, current state:", this.isVisible);

    // If no container exists yet, create one with current telemetry data
    if (!this.telemetryContainer) {
      console.debug("No telemetry container exists yet, creating one");
      const telemetryData = require('../../telemetry').telemetryModule.getCurrentTelemetry();
      this.visualize(telemetryData);
      
      // Container should now be visible since visualize() sets isVisible = true
      return this.isVisible;
    }

    // Toggle visibility of existing container
    if (this.isVisible) {
      console.debug("Hiding telemetry visualization");
      this.telemetryContainer.style.display = "none";
      this.isVisible = false;
    } else {
      console.debug("Showing telemetry visualization");
      this.telemetryContainer.style.display = "block";
      this.isVisible = true;
    }

    return this.isVisible;
  }

  /**
   * Create the telemetry visualization
   * @param metrics The metrics to visualize
   */
  private createVisualization(metrics: MetricDefinition[]): void {
    // Create container for telemetry data
    const container = document.createElement("div");
    container.className = "saypi-telemetry-container";
    
    // Add title
    const title = document.createElement("h4");
    title.textContent = "Performance Metrics";
    title.style.margin = "0 0 10px 0";
    title.style.fontSize = "14px";
    title.style.fontWeight = "bold";
    container.appendChild(title);

    // Create chart container
    const chartContainer = document.createElement("div");
    chartContainer.style.padding = "10px 0";
    container.appendChild(chartContainer);

    // Create the timeline chart
    this.createTimelineChart(chartContainer, metrics);

    // Insert the telemetry visualization into the DOM
    this.parentElement.appendChild(container);
    this.telemetryContainer = container;
  }

  /**
   * Create a timeline chart visualization
   * @param container The container element
   * @param metrics The metrics to visualize
   */
  private createTimelineChart(container: HTMLElement, metrics: MetricDefinition[]): void {
    // Calculate timeline segments
    const { segments, timelineEnd } = TimelineCalculator.calculateTimelineSegments(metrics);
    
    // Create timeline container
    const timelineContainer = document.createElement("div");
    timelineContainer.className = "saypi-timeline-container";
    timelineContainer.style.position = "relative";
    timelineContainer.style.height = "140px"; // Increased height for multiple rows
    timelineContainer.style.marginTop = "20px";
    timelineContainer.style.width = "100%";
    timelineContainer.style.overflowX = "hidden";
    
    // Add timeline axis
    const axisContainer = document.createElement("div");
    axisContainer.style.position = "absolute";
    axisContainer.style.bottom = "20px";
    axisContainer.style.left = "0";
    axisContainer.style.width = "100%";
    axisContainer.style.height = "1px";
    axisContainer.style.backgroundColor = "#ccc";
    
    // Add timeline axis labels
    const axisStart = document.createElement("div");
    axisStart.style.position = "absolute";
    axisStart.style.bottom = "5px";
    axisStart.style.left = "0";
    axisStart.style.fontSize = "10px";
    axisStart.style.color = "#999";
    axisStart.textContent = "0s";
    
    const axisEnd = document.createElement("div");
    axisEnd.style.position = "absolute";
    axisEnd.style.bottom = "5px";
    axisEnd.style.right = "0";
    axisEnd.style.fontSize = "10px";
    axisEnd.style.color = "#999";
    axisEnd.textContent = (timelineEnd / 1000).toFixed(1) + "s";
    
    // Add timeline segments
    segments.forEach(segment => {
      // Skip the total segment for bar display (it's shown separately)
      if (segment.metricKey === 'totalTime') return;
      
      // Calculate position and size as percentage of timeline
      const startPercent = (segment.start / timelineEnd) * 100;
      const widthPercent = ((segment.end - segment.start) / timelineEnd) * 100;
      
      // Create segment bar
      const segmentBar = document.createElement("div");
      segmentBar.className = "saypi-timeline-segment";
      segmentBar.style.position = "absolute";
      segmentBar.style.left = startPercent + "%";
      segmentBar.style.width = widthPercent + "%";
      segmentBar.style.height = "20px";
      segmentBar.style.backgroundColor = segment.color;
      segmentBar.style.borderRadius = "3px";
      
      // Adjust vertical position based on row
      const row = segment.row || 0;
      segmentBar.style.top = (row * 30) + 40 + "px"; // 40px from top for first row
      
      // Add title for tooltip
      segmentBar.title = `${segment.label}: ${(segment.duration / 1000).toFixed(2)}s\n${segment.explanation}`;
      
      // Add segment label if there's enough space
      if (widthPercent > 15) { // Only add label if segment is wide enough
        const segmentLabel = document.createElement("div");
        segmentLabel.className = "saypi-timeline-segment-label";
        segmentLabel.style.position = "absolute";
        segmentLabel.style.left = "5px";
        segmentLabel.style.top = "3px";
        segmentLabel.style.fontSize = "10px";
        segmentLabel.style.color = "#fff";
        segmentLabel.style.whiteSpace = "nowrap";
        segmentLabel.style.overflow = "hidden";
        segmentLabel.style.textOverflow = "ellipsis";
        segmentLabel.style.width = "calc(100% - 10px)";
        segmentLabel.textContent = `${segment.label} (${(segment.duration / 1000).toFixed(1)}s)`;
        segmentBar.appendChild(segmentLabel);
      } else if (widthPercent > 5) {
        // For smaller segments, just show time
        const segmentLabel = document.createElement("div");
        segmentLabel.className = "saypi-timeline-segment-label";
        segmentLabel.style.position = "absolute";
        segmentLabel.style.left = "2px";
        segmentLabel.style.top = "3px";
        segmentLabel.style.fontSize = "10px";
        segmentLabel.style.color = "#fff";
        segmentLabel.style.whiteSpace = "nowrap";
        segmentLabel.textContent = `${(segment.duration / 1000).toFixed(1)}s`;
        segmentBar.appendChild(segmentLabel);
      }
      
      timelineContainer.appendChild(segmentBar);
    });
    
    // Add the total time label at the top
    const totalSegment = segments.find(s => s.metricKey === 'totalTime');
    if (totalSegment) {
      const totalLabel = document.createElement("div");
      totalLabel.style.position = "absolute";
      totalLabel.style.top = "10px";
      totalLabel.style.left = "0";
      totalLabel.style.right = "0";
      totalLabel.style.textAlign = "center";
      totalLabel.style.fontSize = "12px";
      totalLabel.style.fontWeight = "bold";
      totalLabel.style.color = "#333";
      totalLabel.textContent = `${totalSegment.label}: ${(totalSegment.duration / 1000).toFixed(2)}s`;
      totalLabel.title = totalSegment.explanation || 'Total time from end of speech to beginning of audio response';
      timelineContainer.appendChild(totalLabel);
    }
    
    // Assemble the timeline
    timelineContainer.appendChild(axisContainer);
    timelineContainer.appendChild(axisStart);
    timelineContainer.appendChild(axisEnd);
    
    // Add the timeline to the container
    container.appendChild(timelineContainer);
  }
} 