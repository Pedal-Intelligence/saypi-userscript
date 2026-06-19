import { describe, it, expect } from "vitest";
import { readableSegmentLabel } from "../../src/dom/colorUtils";

/**
 * Guards telemetry segment-label legibility: the muted palette has light members
 * (sage, gold) where the old hardcoded white labels read poorly. The helper must
 * pick white vs near-black by WCAG contrast.
 */
describe("readableSegmentLabel", () => {
  it("uses white (with halo) on dark backgrounds", () => {
    expect(readableSegmentLabel("#000000").color).toBe("#fff");
    expect(readableSegmentLabel("#000000").textShadow).not.toBe("none");
  });

  it("uses dark text (no halo) on light backgrounds", () => {
    const r = readableSegmentLabel("#ffffff");
    expect(r.color).toBe("#222");
    expect(r.textShadow).toBe("none");
  });

  it("uses dark text on the lighter palette members (sage, gold)", () => {
    expect(readableSegmentLabel("#83996a").color).toBe("#222"); // sage
    expect(readableSegmentLabel("#c2a14d").color).toBe("#222"); // gold
  });

  it("falls back to white for malformed input", () => {
    expect(readableSegmentLabel("not-a-color").color).toBe("#fff");
  });
});
