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
    container.style.padding = "15px";
    container.style.backgroundColor = "#f8f8f8";
    container.style.border = "1px solid #e0e0e0";
    container.style.borderRadius = "8px";
    
    // Add title
    const title = document.createElement("h4");
    title.textContent = "Performance Metrics";
    title.style.margin = "0 0 15px 0";
    title.style.fontSize = "16px";
    title.style.fontWeight = "bold";
    title.style.color = "#333";
    container.appendChild(title);

    // Create chart container
    const chartContainer = document.createElement("div");
    chartContainer.style.padding = "10px 0 20px 0";
    container.appendChild(chartContainer);

    // Create the timeline chart
    this.createTimelineChart(chartContainer, metrics);
    
    // Add explanatory text
    this.addExplanatoryText(container);

    // Insert the telemetry visualization into the DOM
    this.parentElement.appendChild(container);
    this.telemetryContainer = container;
  }
  
  /**
   * Add explanatory text to the visualization
   */
  private addExplanatoryText(container: HTMLElement): void {
    const explanationContainer = document.createElement("div");
    explanationContainer.style.marginTop = "20px";
    explanationContainer.style.fontSize = "12px";
    explanationContainer.style.color = "#666";
    explanationContainer.style.lineHeight = "1.5";
    
    const explanations = [
      "This Gantt chart shows when each process starts and ends, and how they overlap in time.",
      "Gaps between processes represent waiting periods.",
      "Hover over segments for additional details."
    ];
    
    explanations.forEach(text => {
      const paragraph = document.createElement("p");
      paragraph.textContent = text;
      paragraph.style.margin = "5px 0";
      explanationContainer.appendChild(paragraph);
    });
    
    container.appendChild(explanationContainer);
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
    timelineContainer.style.height = "160px"; // Increased height for multiple rows
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
    
    // Add timeline axis labels and tick marks
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
    
    // Add intermediate tick marks
    const tickInterval = Math.ceil(timelineEnd / 5000) * 1000; // Round to nearest second with about 5 ticks
    for (let i = tickInterval; i < timelineEnd; i += tickInterval) {
      const tickPercent = (i / timelineEnd) * 100;
      
      const tick = document.createElement("div");
      tick.style.position = "absolute";
      tick.style.bottom = "20px";
      tick.style.left = tickPercent + "%";
      tick.style.width = "1px";
      tick.style.height = "5px";
      tick.style.backgroundColor = "#ccc";
      
      const tickLabel = document.createElement("div");
      tickLabel.style.position = "absolute";
      tickLabel.style.bottom = "5px";
      tickLabel.style.left = tickPercent + "%";
      tickLabel.style.transform = "translateX(-50%)";
      tickLabel.style.fontSize = "10px";
      tickLabel.style.color = "#999";
      tickLabel.textContent = (i / 1000).toFixed(1) + "s";
      
      timelineContainer.appendChild(tick);
      timelineContainer.appendChild(tickLabel);
    }
    
    // Add row labels for clarity
    const row0Label = document.createElement("div");
    row0Label.style.position = "absolute";
    row0Label.style.left = "0";
    row0Label.style.top = "35px";
    row0Label.style.fontSize = "10px";
    row0Label.style.color = "#666";
    row0Label.style.fontWeight = "500";
    row0Label.textContent = "Main";
    
    const row1Label = document.createElement("div");
    row1Label.style.position = "absolute";
    row1Label.style.left = "0";
    row1Label.style.top = "65px";
    row1Label.style.fontSize = "10px";
    row1Label.style.color = "#666";
    row1Label.style.fontWeight = "500";
    row1Label.textContent = "Parallel";
    
    timelineContainer.appendChild(row0Label);
    timelineContainer.appendChild(row1Label);
    
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
      segmentBar.style.height = "24px"; // Increased height
      segmentBar.style.backgroundColor = segment.color;
      segmentBar.style.borderRadius = "3px";
      segmentBar.style.boxShadow = "0 1px 3px rgba(0,0,0,0.2)"; // Add shadow for depth
      
      // Adjust vertical position based on row
      const row = segment.row || 0;
      segmentBar.style.top = (row * 30) + 40 + "px"; // 40px from top for first row
      
      // Add tooltip popup with detailed information
      segmentBar.title = `${segment.label}: ${(segment.duration / 1000).toFixed(2)}s\n${segment.explanation || ''}`;
      
      // Enhanced tooltip effect on hover
      segmentBar.addEventListener('mouseover', () => {
        segmentBar.style.boxShadow = "0 3px 6px rgba(0,0,0,0.3)";
        segmentBar.style.transform = "translateY(-1px)";
        segmentBar.style.transition = "all 0.2s ease";
      });
      
      segmentBar.addEventListener('mouseout', () => {
        segmentBar.style.boxShadow = "0 1px 3px rgba(0,0,0,0.2)";
        segmentBar.style.transform = "translateY(0)";
      });
      
      // Add segment label if there's enough space
      if (widthPercent > 15) { // Only add label if segment is wide enough
        const segmentLabel = document.createElement("div");
        segmentLabel.className = "saypi-timeline-segment-label";
        segmentLabel.style.position = "absolute";
        segmentLabel.style.left = "5px";
        segmentLabel.style.top = "4px";
        segmentLabel.style.fontSize = "11px"; // Slightly larger text
        segmentLabel.style.fontWeight = "500"; // Semi-bold 
        segmentLabel.style.color = "#fff";
        segmentLabel.style.whiteSpace = "nowrap";
        segmentLabel.style.overflow = "hidden";
        segmentLabel.style.textOverflow = "ellipsis";
        segmentLabel.style.width = "calc(100% - 10px)";
        segmentLabel.style.textShadow = "0 1px 1px rgba(0,0,0,0.3)"; // Add text shadow for better visibility
        segmentLabel.textContent = `${segment.label} (${(segment.duration / 1000).toFixed(1)}s)`;
        segmentBar.appendChild(segmentLabel);
      } else if (widthPercent > 5) {
        // For smaller segments, just show time
        const segmentLabel = document.createElement("div");
        segmentLabel.className = "saypi-timeline-segment-label";
        segmentLabel.style.position = "absolute";
        segmentLabel.style.left = "2px";
        segmentLabel.style.top = "4px";
        segmentLabel.style.fontSize = "11px";
        segmentLabel.style.fontWeight = "500";
        segmentLabel.style.color = "#fff";
        segmentLabel.style.whiteSpace = "nowrap";
        segmentLabel.style.textShadow = "0 1px 1px rgba(0,0,0,0.3)";
        segmentLabel.textContent = `${(segment.duration / 1000).toFixed(1)}s`;
        segmentBar.appendChild(segmentLabel);
      }
      
      // Draw connection lines between related segments if needed
      if (segment.metricKey === 'timeToTalk') {
        // Create a connector line from completionResponse to audio playback
        const connectorLine = document.createElement("div");
        connectorLine.style.position = "absolute";
        connectorLine.style.left = (startPercent + widthPercent) + "%";
        connectorLine.style.top = (row * 30) + 52 + "px"; // Connect to middle of segment
        connectorLine.style.width = "1px";
        connectorLine.style.height = "30px";
        connectorLine.style.backgroundColor = "#aaa";
        connectorLine.style.zIndex = "1";
        timelineContainer.appendChild(connectorLine);
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
      totalLabel.style.fontSize = "13px"; // Larger text
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
    
    // Add a legend for the segments
    this.addTimelineLegend(container, segments);
  }
  
  /**
   * Add a legend for the timeline segments
   */
  private addTimelineLegend(container: HTMLElement, segments: TimelineSegment[]): void {
    // Skip if no segments
    if (segments.length === 0) return;
    
    // Create legend container
    const legendContainer = document.createElement("div");
    legendContainer.style.display = "flex";
    legendContainer.style.flexWrap = "wrap";
    legendContainer.style.gap = "10px";
    legendContainer.style.marginTop = "10px";
    legendContainer.style.padding = "10px";
    
    // Process segments for legend (exclude total time which is shown separately)
    const legendItems = segments
      .filter(segment => segment.metricKey !== 'totalTime')
      .map(segment => {
        return {
          color: segment.color,
          label: `${segment.label}: ${(segment.duration / 1000).toFixed(2)}s`
        };
      });
    
    // Create legend items
    legendItems.forEach(item => {
      const legendItem = document.createElement("div");
      legendItem.style.display = "flex";
      legendItem.style.alignItems = "center";
      legendItem.style.marginRight = "15px";
      
      const colorBox = document.createElement("div");
      colorBox.style.width = "12px";
      colorBox.style.height = "12px";
      colorBox.style.backgroundColor = item.color;
      colorBox.style.marginRight = "5px";
      colorBox.style.borderRadius = "2px";
      
      const label = document.createElement("span");
      label.style.fontSize = "11px";
      label.style.color = "#666";
      label.textContent = item.label;
      
      legendItem.appendChild(colorBox);
      legendItem.appendChild(label);
      legendContainer.appendChild(legendItem);
    });
    
    container.appendChild(legendContainer);
  }
} 