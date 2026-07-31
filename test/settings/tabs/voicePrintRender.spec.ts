import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  createPrintSvg,
  paintPrintTrace,
  PRINT_AXIS_HI_HZ,
  PRINT_AXIS_LO_HZ,
  PRINT_BAR_W,
  PRINT_FRAME_PITCH,
  PRINT_HEIGHT,
  PRINT_MAX_FRAMES,
  PRINT_MAX_SPAN_S,
  PRINT_MIN_FRAMES,
  PRINT_REF_Y,
  PRINT_WIDTHS,
  PRINT_Y_MAX,
  PRINT_Y_MIN,
  printBars,
  printY,
  renderVoicePrint,
  traceFrameCount,
  traceWidth,
} from "../../../entrypoints/settings/tabs/voices/voicePrintRender";
import {
  extractVoicePrint,
  PRINT_SAMPLE_RATE,
  VoicePrint,
} from "../../../src/tts/voicePrint";

const FIXTURES = fileURLToPath(
  new URL("../../fixtures/voiceprints/", import.meta.url)
);

function fixturePrint(name: string): VoicePrint {
  const bytes = readFileSync(`${FIXTURES}${name}-8k-mono.pcm`);
  const pcm = new Float32Array(bytes.length / 2);
  for (let i = 0; i < pcm.length; i++) pcm[i] = bytes.readInt16LE(i * 2) / 32768;
  return extractVoicePrint(pcm, PRINT_SAMPLE_RATE);
}

const mkPrint = (over: Partial<VoicePrint> = {}): VoicePrint => ({
  f0: [],
  amp: [],
  span: 1,
  medF0: 155,
  voicedRmsDb: -15,
  ...over,
});

describe("the frequency axis", () => {
  it("puts 155 Hz exactly on the shared reference line", () => {
    // The whole design move: one line through every print at one y, so a
    // vertical position means the same thing on every voice.
    expect(printY(155)).toBeCloseTo(PRINT_REF_Y, 1);
  });

  it("spans the band 80–288 Hz and clamps outside it", () => {
    expect(printY(PRINT_AXIS_LO_HZ)).toBeCloseTo(PRINT_Y_MAX, 5);
    expect(printY(PRINT_AXIS_HI_HZ)).toBeCloseTo(PRINT_Y_MIN, 5);
    expect(printY(40)).toBe(PRINT_Y_MAX);
    expect(printY(600)).toBe(PRINT_Y_MIN);
    expect(printY(0)).toBe(PRINT_REF_Y);
    expect(printY(NaN)).toBe(PRINT_REF_Y);
  });

  it("is logarithmic — an octave is an octave anywhere on it", () => {
    // 96→192 Hz and 120→240 Hz must travel the same distance, or two voices a
    // fifth apart look further apart down at the bottom than up at the top.
    expect(printY(96) - printY(192)).toBeCloseTo(printY(120) - printY(240), 6);
  });
});

describe("trace width — length is clip length", () => {
  it("scales against a FIXED 2.2 s full span, not the catalog's longest", () => {
    // A fixed constant is the point: adding one long-winded voice must not
    // silently rescale every other print on the page.
    expect(traceWidth(PRINT_MAX_SPAN_S, 300)).toBe(300);
    expect(traceWidth(1.1, 300)).toBe(150);
    expect(traceWidth(1.16, PRINT_WIDTHS.md)).toBeCloseTo(62.2, 1);
  });

  it("caps a longer-than-full-scale clip instead of overflowing", () => {
    expect(traceWidth(9, 118)).toBe(118);
  });

  it("clamps the frame count so a print is never dots or mud", () => {
    expect(traceFrameCount(0.05, 118)).toBe(PRINT_MIN_FRAMES);
    expect(traceFrameCount(PRINT_MAX_SPAN_S, 300)).toBe(PRINT_MAX_FRAMES);
    expect(traceFrameCount(1.16, PRINT_WIDTHS.md)).toBe(24);
  });
});

describe("printBars", () => {
  it("draws a bar per voiced frame, at the frame pitch, sized by loudness", () => {
    const print = mkPrint({
      f0: Array.from({ length: 60 }, () => 155),
      amp: Array.from({ length: 60 }, (_, i) => (i === 0 ? 0.5 : 1)),
      span: 1.32,
    });
    const bars = printBars(print, PRINT_WIDTHS.md);
    expect(bars).toHaveLength(traceFrameCount(1.32, PRINT_WIDTHS.md));
    expect(bars[0].x).toBe(0);
    expect(bars[1].x).toBeCloseTo(PRINT_FRAME_PITCH, 6);
    expect(bars[0].width).toBe(PRINT_BAR_W);
    // h = 2 + 6 × loudNorm
    expect(bars[0].height).toBeCloseTo(5, 6);
    expect(bars[1].height).toBeCloseTo(8, 6);
    // Centred on the pitch, so the rect straddles the reference line at 155 Hz.
    expect(bars[1].y).toBeCloseTo(printY(155) - 4, 6);
  });

  it("emits NOTHING for unvoiced frames — the gaps are the consonants", () => {
    const print = mkPrint({
      f0: Array.from({ length: 40 }, (_, i) => (i < 20 ? 120 : 0)),
      amp: Array.from({ length: 40 }, (_, i) => (i < 20 ? 1 : 0)),
      span: 0.4,
    });
    const bars = printBars(print, PRINT_WIDTHS.md);
    expect(bars.length).toBeGreaterThan(0);
    expect(bars.length).toBeLessThan(traceFrameCount(0.4, PRINT_WIDTHS.md));
    // …and the silence is at the END, where the source had it.
    expect(Math.max(...bars.map((b) => b.x))).toBeLessThan(
      traceWidth(0.4, PRINT_WIDTHS.md) / 2 + PRINT_FRAME_PITCH
    );
  });

  it("falls back to the amplitude envelope when there is no usable pitch", () => {
    // Fallback ladder, rung two: still shows rhythm and phrasing, drawn
    // symmetrically about the reference line rather than at a made-up pitch.
    const print = mkPrint({
      f0: Array.from({ length: 40 }, () => 0),
      amp: Array.from({ length: 40 }, () => 0.5),
      span: 0.4,
      medF0: 0,
    });
    const bars = printBars(print, PRINT_WIDTHS.md);
    expect(bars.length).toBeGreaterThan(0);
    bars.forEach((bar) => {
      expect(bar.y + bar.height / 2).toBeCloseTo(PRINT_REF_Y, 6);
    });
  });

  it("draws nothing at all for a print with no span", () => {
    expect(printBars(mkPrint({ f0: [], amp: [], span: 0 }), 118)).toEqual([]);
  });
});

describe("the print as a chart — real clips, one axis", () => {
  const onyx = fixturePrint("onyx");
  const addison = fixturePrint("addison");

  it("draws the deepest voice low and the brightest voice high", () => {
    // This is the claim the shared reference line makes: vertical position
    // means the same thing on every row, so a list of prints reads as one
    // continuous descent from deep to bright.
    const low = printBars(onyx, PRINT_WIDTHS.md);
    const high = printBars(addison, PRINT_WIDTHS.md);
    const mean = (bars: { y: number; height: number }[]) =>
      bars.reduce((sum, b) => sum + b.y + b.height / 2, 0) / bars.length;
    expect(mean(low)).toBeGreaterThan(PRINT_REF_Y);
    expect(mean(high)).toBeLessThan(PRINT_REF_Y);
    // SVG y grows downward: Onyx sits below the line, Addison above it.
    expect(mean(low) - mean(high)).toBeGreaterThan(8);
  });

  it("draws the longer clip wider", () => {
    expect(onyx.span).toBeGreaterThan(addison.span);
    const widest = (bars: { x: number }[]) => Math.max(...bars.map((b) => b.x));
    expect(widest(printBars(onyx, PRINT_WIDTHS.md))).toBeGreaterThan(
      widest(printBars(addison, PRINT_WIDTHS.md))
    );
  });

  it("stays inside its band at every drawn width", () => {
    for (const width of Object.values(PRINT_WIDTHS)) {
      for (const bar of [...printBars(onyx, width), ...printBars(addison, width)]) {
        expect(bar.y).toBeGreaterThan(-3);
        expect(bar.y + bar.height).toBeLessThan(PRINT_HEIGHT + 3);
        expect(bar.x + bar.width).toBeLessThanOrEqual(width);
      }
    }
  });
});

describe("the svg", () => {
  it("is a reference line and nothing else until the measurement lands", () => {
    // The ghost print IS the loading state — there is no skeleton shimmer to
    // build, and the row never reflows when the trace arrives.
    const svg = createPrintSvg(PRINT_WIDTHS.md);
    expect(svg.namespaceURI).toBe("http://www.w3.org/2000/svg");
    expect(svg.getAttribute("viewBox")).toBe(`0 0 118 ${PRINT_HEIGHT}`);
    expect(svg.getAttribute("aria-hidden")).toBe("true");
    expect(svg.querySelector(".voice-print-ref")).toBeTruthy();
    expect(svg.querySelectorAll(".voice-print-trace rect")).toHaveLength(0);
  });

  it("paints, and repaints, the trace in place", () => {
    const svg = createPrintSvg(PRINT_WIDTHS.md);
    const print = fixturePrint("addison");
    paintPrintTrace(svg, print, PRINT_WIDTHS.md);
    const first = svg.querySelectorAll(".voice-print-trace rect").length;
    expect(first).toBeGreaterThan(4);
    paintPrintTrace(svg, print, PRINT_WIDTHS.md);
    expect(svg.querySelectorAll(".voice-print-trace rect")).toHaveLength(first);
    // Repainting with nothing clears the trace but keeps the chart.
    paintPrintTrace(svg, null, PRINT_WIDTHS.md);
    expect(svg.querySelectorAll(".voice-print-trace rect")).toHaveLength(0);
    expect(svg.querySelector(".voice-print-ref")).toBeTruthy();
  });

  it("takes its ink from currentColor, so state is one class on the container", () => {
    const svg = renderVoicePrint(fixturePrint("onyx"), PRINT_WIDTHS.lg);
    const rect = svg.querySelector(".voice-print-trace rect")!;
    // No per-voice colour anywhere: no fill, no stroke, no gradient.
    expect(rect.getAttribute("fill")).toBeNull();
    expect(svg.innerHTML).not.toMatch(/gradient|hsl\(|#[0-9a-f]{6}/i);
  });
});
