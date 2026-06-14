import { describe, it, expect } from "vitest";
import { computeTooltipPosition } from "../../src/ui/Tooltip";

const rect = (left: number, top: number, width: number, height: number) => ({
  left,
  top,
  width,
  height,
  right: left + width,
  bottom: top + height,
});

describe("computeTooltipPosition", () => {
  const viewport = { width: 1000, height: 800 };

  it("centres above the button when there is room", () => {
    const r = computeTooltipPosition(rect(400, 300, 40, 40), { width: 120, height: 30 }, viewport);
    expect(r.placement).toBe("above");
    expect(r.left).toBe(420); // 400 + 40/2
    expect(r.top).toBe(262); // top - gap(8) - height(30)
  });

  it("flips below when there is no room above (button near the top)", () => {
    const r = computeTooltipPosition(rect(400, 4, 40, 40), { width: 120, height: 30 }, viewport);
    expect(r.placement).toBe("below");
    expect(r.top).toBe(52); // bottom(44) + gap(8)
  });

  it("clamps the centre so a wide tooltip near the left edge stays on-screen", () => {
    const r = computeTooltipPosition(rect(10, 300, 40, 40), { width: 200, height: 30 }, viewport);
    expect(r.left).toBe(108); // margin(8) + half(100)
  });

  it("clamps the centre so a wide tooltip near the right edge stays on-screen", () => {
    const r = computeTooltipPosition(rect(960, 300, 40, 40), { width: 200, height: 30 }, viewport);
    expect(r.left).toBe(892); // viewport(1000) - margin(8) - half(100)
  });
});
