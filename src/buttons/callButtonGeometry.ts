/**
 * Pure geometry for the call button's transcription-segment pie overlay.
 *
 * Extracted from `CallButton.updateButtonSegments` so the angle/arc math is
 * unit-testable without JSDOM (the widget keeps the DOM application — locating/
 * creating the `<g>`, appending `<path>`s, and the `#progress-ring`/background
 * preservation). The math is byte-faithful to the original: `toFixed(3)`, the
 * compounded −90° offset (caller starts at −90, `describeWedge` subtracts
 * another 90), the 359.99° full-circle clamp, and the `<=180` largeArcFlag.
 */
export type SegmentStatus =
  | "capturing"
  | "processing"
  | "completed-success"
  | "completed-error";

export interface SegmentGeometry {
  /** Center x/y — the call-button SVG is square, so one value serves both. */
  center: number;
  /** Outer radius of the pie wedges. */
  radius: number;
}

export interface PathSpec {
  /** SVG path `d` attribute for the wedge. */
  d: string;
  /** Fill colour. */
  fill: string;
}

const STATUS_COLORS: Record<SegmentStatus, string> = {
  capturing: "#808080",
  processing: "#42a5f5",
  "completed-success": "#66bb6a",
  "completed-error": "#ef5350",
};

/** Gap between segments, in degrees. */
const GAP_DEGREES = 1.5;

/** SVG path `d` for a single pie wedge. Byte-faithful to the original. */
export function describeWedge(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number,
): string {
  // Prevent a full-overlap arc that renders incorrectly.
  if (endAngle - startAngle >= 359.99) {
    endAngle = startAngle + 359.99;
  }

  const startRad = ((startAngle - 90) * Math.PI) / 180; // −90 puts 0° at the top
  const endRad = ((endAngle - 90) * Math.PI) / 180;

  const arcStartX = x + radius * Math.cos(startRad);
  const arcStartY = y + radius * Math.sin(startRad);
  const arcEndX = x + radius * Math.cos(endRad);
  const arcEndY = y + radius * Math.sin(endRad);

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M", x.toFixed(3), y.toFixed(3),
    "L", arcStartX.toFixed(3), arcStartY.toFixed(3),
    "A", radius.toFixed(3), radius.toFixed(3), 0, largeArcFlag, 1, arcEndX.toFixed(3), arcEndY.toFixed(3),
    "Z",
  ].join(" ");
}

/** Derive the wedge geometry from the SVG viewBox dimensions. */
export function computeGeometry(
  viewBoxWidth: number,
  viewBoxHeight: number,
): SegmentGeometry {
  return {
    center: viewBoxWidth / 2,
    radius: (Math.min(viewBoxWidth, viewBoxHeight) / 2) * 0.9,
  };
}

/**
 * Per-segment wedge specs in draw order. Returns `[]` for no segments or a
 * degenerate layout (too many segments for the gap) — mirroring the widget's
 * original early-return behaviour (where the background is left hidden and no
 * wedges are drawn).
 */
export function computeSegmentPaths(
  statuses: SegmentStatus[],
  geom: SegmentGeometry,
): PathSpec[] {
  const totalSegments = statuses.length;
  if (totalSegments === 0) return [];

  let anglePerSegment = 0;
  if (totalSegments === 1) {
    anglePerSegment = 360; // single segment covers the whole circle
  } else {
    const totalGap = totalSegments * GAP_DEGREES;
    anglePerSegment = totalGap < 360 ? (360 - totalGap) / totalSegments : 0;
  }
  if (anglePerSegment <= 0 && totalSegments > 1) return [];
  if (totalSegments === 1 && anglePerSegment !== 360) anglePerSegment = 360;

  const specs: PathSpec[] = [];
  let startAngle = -90; // start from the top
  for (const status of statuses) {
    const endAngle = startAngle + anglePerSegment;
    specs.push({
      d: describeWedge(geom.center, geom.center, geom.radius, startAngle, endAngle),
      fill: STATUS_COLORS[status] || "#cccccc",
    });
    startAngle = endAngle + GAP_DEGREES;
  }
  return specs;
}
