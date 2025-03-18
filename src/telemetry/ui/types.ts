import { TelemetryData } from "../../TelemetryModule";

/**
 * Definition of a metric displayed in the telemetry visualization
 */
export interface MetricDefinition {
  key: string;
  label: string;
  color: string;
  value: number;
  actualValue?: number; // Actual value before any display adjustments
  explanation: string;
}

/**
 * A segment in the timeline visualization
 */
export interface TimelineSegment {
  metricKey: string;
  label: string;
  start: number;
  end: number;
  duration: number;
  color: string;
  explanation?: string;
  row?: number;
}

/**
 * The result of metric calculations
 */
export interface MetricsResult {
  metrics: MetricDefinition[];
  totalTime: number;
}

/**
 * The result of timeline calculations
 */
export interface TimelineResult {
  segments: TimelineSegment[];
  timelineEnd: number;
} 