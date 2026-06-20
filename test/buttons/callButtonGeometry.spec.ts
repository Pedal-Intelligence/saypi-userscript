import { describe, it, expect } from "vitest";
import {
  describeWedge,
  computeGeometry,
  computeSegmentPaths,
  type SegmentStatus,
} from "../../src/buttons/callButtonGeometry";

describe("describeWedge", () => {
  it("emits an M/L/A/Z path with toFixed(3) coordinates", () => {
    const d = describeWedge(40, 40, 36, -90, 0);
    expect(d).toMatch(
      /^M 40\.000 40\.000 L -?\d+\.\d{3} -?\d+\.\d{3} A 36\.000 36\.000 0 [01] 1 -?\d+\.\d{3} -?\d+\.\d{3} Z$/,
    );
  });

  it("starts the line-to at the top of the circle for a wedge beginning at -90deg", () => {
    // startAngle -90 + the internal -90 => -180 => cos=-1.. wait: ((-90-90)*PI/180) = -PI.
    // arcStartX = 40 + 36*cos(-PI) = 40 - 36 = 4.000 ; arcStartY = 40 + 36*sin(-PI) ~= 40.000
    const d = describeWedge(40, 40, 36, -90, 0);
    expect(d).toContain("L 4.000 40.000");
  });

  it("uses largeArcFlag 0 for spans <= 180deg and 1 for spans > 180deg", () => {
    expect(describeWedge(40, 40, 36, -90, 90)).toContain(" 0 1 "); // 180deg span -> flag 0
    expect(describeWedge(40, 40, 36, -90, 180)).toContain(" 1 1 "); // 270deg span -> flag 1
  });

  it("clamps a full circle to 359.99deg (never a degenerate full-overlap arc)", () => {
    const full = describeWedge(40, 40, 36, -90, 270); // 360deg span -> clamped
    const clamped = describeWedge(40, 40, 36, -90, -90 + 359.99);
    expect(full).toBe(clamped);
  });
});

describe("computeGeometry", () => {
  it("centers on width/2 and sets radius to 90% of half the smaller dimension", () => {
    expect(computeGeometry(80, 80)).toEqual({ center: 40, radius: 36 });
    expect(computeGeometry(80, 40)).toEqual({ center: 40, radius: 18 });
  });
});

describe("computeSegmentPaths", () => {
  const geom = { center: 40, radius: 36 };

  it("returns no specs for zero segments", () => {
    expect(computeSegmentPaths([], geom)).toEqual([]);
  });

  it("draws a single full-circle wedge for one segment, colored by status", () => {
    const specs = computeSegmentPaths(["processing"], geom);
    expect(specs).toHaveLength(1);
    expect(specs[0].fill).toBe("#42a5f5"); // processing
    expect(specs[0].d.startsWith("M 40.000 40.000")).toBe(true);
  });

  it("maps each status to its colour, in draw order", () => {
    const statuses: SegmentStatus[] = [
      "capturing",
      "processing",
      "completed-success",
      "completed-error",
    ];
    const specs = computeSegmentPaths(statuses, geom);
    expect(specs.map((s) => s.fill)).toEqual([
      "#808080",
      "#42a5f5",
      "#66bb6a",
      "#ef5350",
    ]);
  });

  it("falls back to #cccccc for an unknown status", () => {
    const specs = computeSegmentPaths(["mystery" as SegmentStatus], geom);
    expect(specs[0].fill).toBe("#cccccc");
  });

  it("returns no specs when there are too many segments for the gap (degenerate)", () => {
    // 240 segments * 1.5deg gap = 360deg of gap => anglePerSegment <= 0.
    const many = Array.from({ length: 240 }, () => "processing" as SegmentStatus);
    expect(computeSegmentPaths(many, geom)).toEqual([]);
  });
});
