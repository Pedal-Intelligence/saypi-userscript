import { TelemetryData } from "../TelemetryModule";
import { TelemetryVisualizer } from "./ui/TelemetryVisualizer";
import EventBus from "../events/EventBus";

/**
 * Module for managing telemetry visualizations
 */
export class TelemetryUIModule {
  private static instance: TelemetryUIModule;
  private visualizers: Map<HTMLElement, TelemetryVisualizer> = new Map();
  private currentData: TelemetryData | null = null;

  private constructor() {
    // Listen for telemetry updates
    EventBus.on("telemetry:updated", this.handleTelemetryUpdate);
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): TelemetryUIModule {
    if (!TelemetryUIModule.instance) {
      TelemetryUIModule.instance = new TelemetryUIModule();
    }
    return TelemetryUIModule.instance;
  }

  /**
   * Create or get a visualizer for a parent element
   * @param parentElement The element to attach the visualization to
   */
  public getVisualizer(parentElement: HTMLElement): TelemetryVisualizer {
    if (!this.visualizers.has(parentElement)) {
      this.visualizers.set(parentElement, new TelemetryVisualizer(parentElement));
    }
    return this.visualizers.get(parentElement)!;
  }

  /**
   * Update visualizations with new telemetry data
   * @param data The telemetry data
   */
  public updateVisualizations(data: TelemetryData): void {
    this.currentData = data;
    // Update all visualizers that are currently visible
    this.visualizers.forEach((visualizer, element) => {
      if (visualizer.isVisualizationVisible()) {
        visualizer.visualize(data);
      }
    });
  }

  /**
   * Handle telemetry updates from the EventBus
   */
  private handleTelemetryUpdate = (event: { data: TelemetryData }): void => {
    this.updateVisualizations(event.data);
  }
}

export default TelemetryUIModule.getInstance(); 