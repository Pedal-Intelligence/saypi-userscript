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
  PRINT_GROUND,
  PRINT_INK_CONTRAST,
  PRINT_RAMP_BRIGHT,
  PRINT_RAMP_DEEP,
  PRINT_REF_Y,
  PRINT_WIDTHS,
  PRINT_Y_MAX,
  PRINT_Y_MIN,
  printBars,
  printInk,
  printPitchT,
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
  lead: 0,
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
    // h = 2.5 + 7.5 × loudNorm
    expect(bars[0].height).toBeCloseTo(6.25, 6);
    expect(bars[1].height).toBeCloseTo(10, 6);
    // Centred on the pitch, so the rect straddles the reference line at 155 Hz.
    expect(bars[1].y).toBeCloseTo(printY(155) - 5, 6);
  });

  it("draws a RIBBON, not a seismograph — neighbours nearly touch", () => {
    // The duty cycle is the whole lever. It shipped at 1.4/2.6 = 54 %, which is
    // the visual language of an audio editor: hairlines with air between them.
    // At 81 % the bars very nearly touch and the trace resolves into one soft
    // band. The PITCH must not move with it: widening the spacing to get the
    // same ratio would drop a full-width trace from 115 frames to 71, and a
    // thinner trace reads DOTTIER, which is the opposite of softer.
    const duty = PRINT_BAR_W / PRINT_FRAME_PITCH;
    expect(duty).toBeGreaterThan(0.75);
    expect(duty).toBeLessThan(1); // touching outright would erase the rhythm
    expect(PRINT_FRAME_PITCH).toBe(2.6);
    expect(traceFrameCount(PRINT_MAX_SPAN_S, PRINT_WIDTHS.lg)).toBe(
      PRINT_MAX_FRAMES
    );
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

  it("stays inside its ROW at every drawn width", () => {
    // ±5 rather than the old ±3: widening the ribbon scaled the amplitude 1.25×
    // with it, so a full-loudness bar is 10px and one centred at the very top
    // or bottom of the 80–288 Hz band overhangs the 26px print by up to 3px.
    // The svg is `overflow: visible` and the print band sits inside a 42px row,
    // which has 8px of slack either side — so the guard that means anything is
    // the ROW, not the band. Anything past this would collide with a neighbour.
    const slack = (42 - PRINT_HEIGHT) / 2;
    for (const width of Object.values(PRINT_WIDTHS)) {
      for (const bar of [...printBars(onyx, width), ...printBars(addison, width)]) {
        expect(bar.y).toBeGreaterThan(-slack);
        expect(bar.y + bar.height).toBeLessThan(PRINT_HEIGHT + slack);
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

  it("publishes the three numbers the playhead is a clock for", () => {
    // The head is CSS, but its geometry is measured: how far it travels, how
    // long that takes, and — the one that registers it against the audio —
    // when it starts. `.playing` lands at clip t=0 while trace x=0 is the
    // first VOICED frame, 0.76 s later on Onyx, so without the lead the head
    // is two thirds across the trace before the voice is audible.
    const svg = createPrintSvg(PRINT_WIDTHS.lg);
    const onyx = fixturePrint("onyx");
    paintPrintTrace(svg, onyx, PRINT_WIDTHS.lg);
    expect(svg.style.getPropertyValue("--print-span")).toBe(
      `${onyx.span.toFixed(2)}s`
    );
    expect(svg.style.getPropertyValue("--print-lead")).toBe("0.76s");
    expect(svg.style.getPropertyValue("--print-trace-w")).toMatch(/^\d+\.\dpx$/);
    // An unmeasured print publishes none of them, so it never gets a head that
    // would be pretending.
    paintPrintTrace(svg, null, PRINT_WIDTHS.lg);
    expect(svg.style.getPropertyValue("--print-lead")).toBe("");
    expect(svg.style.getPropertyValue("--print-span")).toBe("");
    expect(svg.style.getPropertyValue("--print-trace-w")).toBe("");
  });

  it("takes its ink from currentColor, so state is one class on the container", () => {
    const svg = renderVoicePrint(fixturePrint("onyx"), PRINT_WIDTHS.lg);
    const rect = svg.querySelector(".voice-print-trace rect")!;
    // The pitch ramp lives on the ROW, as three custom properties, so the svg
    // itself still carries no colour at all: no fill, no stroke, no gradient.
    // That is what keeps the whole heard state one class on the container —
    // recolouring 115 rects on every play would be the alternative.
    expect(rect.getAttribute("fill")).toBeNull();
    expect(svg.innerHTML).not.toMatch(/gradient|hsl\(|#[0-9a-f]{6}/i);
  });
});

/* --- the pitch ramp -------------------------------------------------------- */

/** WCAG 2.x relative luminance, written out independently of the module. */
function wcagLuminance(hex: string): number {
  const [r, g, b] = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a: string, b: string): number {
  const [hi, lo] = [wcagLuminance(a), wcagLuminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
/** CIE lightness — the honest metric for "which step reads bigger". */
function lstar(hex: string): number {
  const y = wcagLuminance(hex);
  return y > 0.008856 ? 116 * Math.cbrt(y) - 16 : 903.3 * y;
}
const hue = (hex: string): number[] =>
  [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
/** How warm a colour is: red minus blue, normalised. Amber ≫ 0, green ≈ 0. */
const warmth = (hex: string): number => {
  const [r, , b] = hue(hex);
  return (r - b) / 255;
};

describe("colour is one ordered ramp keyed to pitch", () => {
  // NOT per-voice identity colour, which this page deleted for good reason: the
  // 22 gradient orbs were djb2 HASHES of the voice id and encoded nothing. A
  // monotonic function of measured pitch encodes exactly what the row order
  // already encodes, so it reads as one gradient down the page rather than as
  // confetti — and it gives the ordering a redundant non-positional encoding.

  it("keys off the SAME 80–288 Hz axis the height uses, not the catalog", () => {
    // One axis, two encodings: a bar drawn at the top of the band is, by
    // construction, at the top of the ramp. Keyed to the catalog's own min/max
    // instead, adding one deeper voice would re-colour every existing row —
    // the same reason PRINT_MAX_SPAN_S is a fixed constant.
    expect(printPitchT(PRINT_AXIS_LO_HZ)).toBeCloseTo(0, 6);
    expect(printPitchT(PRINT_AXIS_HI_HZ)).toBeCloseTo(1, 6);
    expect(printPitchT(40)).toBe(0);
    expect(printPitchT(600)).toBe(1);
    // 155 Hz — the reference line, and where an unmeasured voice is placed —
    // lands mid-ramp: neutral, neither deep nor bright.
    expect(printPitchT(155)).toBeCloseTo(0.516, 3);
    // and it is derived from printY, so the two cannot drift apart
    expect(printPitchT(155)).toBeCloseTo(
      (PRINT_Y_MAX - printY(155)) / (PRINT_Y_MAX - PRINT_Y_MIN),
      9
    );
  });

  it("runs warm amber at the deep end to the shell's green at the bright end", () => {
    const deep = printInk(PRINT_AXIS_LO_HZ);
    const bright = printInk(PRINT_AXIS_HI_HZ);
    expect(warmth(deep.rest)).toBeGreaterThan(0.3);
    expect(warmth(bright.rest)).toBeLessThan(0.25);
    // …and monotonically between them, so the page is a gradient, never a
    // scatter. Sampled at every 40 Hz across the audible band.
    const walk = Array.from({ length: 22 }, (_, i) => printInk(80 + i * 10).rest);
    for (let i = 1; i < walk.length; i++) {
      expect(warmth(walk[i])).toBeLessThanOrEqual(warmth(walk[i - 1]) + 1e-9);
    }
  });

  it("clears WCAG 1.4.11's 3:1 at BOTH ends and the middle, in all three states", () => {
    // The trace is the page's only data, so the never-heard ink is what a
    // first-time reader sees on every row. Below 3:1 the traces read as dust
    // and the reference line becomes the most legible mark on the row — a
    // chart whose gridlines outrank its data. The ends are what a naive tint
    // would break: full-strength amber is only 4.2:1 against this ground.
    for (const hz of [PRINT_AXIS_LO_HZ, 155, PRINT_AXIS_HI_HZ]) {
      const ink = printInk(hz);
      for (const [state, hex] of Object.entries(ink)) {
        expect(contrast(hex, PRINT_GROUND), `${state} at ${hz}Hz`).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it("holds each state at ONE contrast the whole way along the ramp", () => {
    // The load-bearing property. Hue carries pitch; weight carries memory. If
    // weight moved with pitch too, a deep unheard voice would read fainter
    // than a bright unheard voice and the ramp would corrupt the heard state
    // it sits beside.
    for (const [state, target] of Object.entries(PRINT_INK_CONTRAST)) {
      for (const hz of [80, 110, 155, 200, 288]) {
        const hex = printInk(hz)[state as keyof typeof PRINT_INK_CONTRAST];
        expect(contrast(hex, PRINT_GROUND), `${state} at ${hz}Hz`).toBeCloseTo(
          target,
          1
        );
      }
    }
  });

  it("spends most of the scale on the step that DEVELOPS the page", () => {
    // Design §8's rule, carried over intact: never-heard → heard must be the
    // bigger jump, because "play one voice and its print inks in" is the whole
    // of heard state on the rail, while what marks the playing row is the
    // green playhead crossing its trace. Measured in CIE L*, which is the
    // honest metric now that the three states are three colours rather than
    // three alphas of one ink — and it holds in raw contrast ratio too.
    for (const hz of [PRINT_AXIS_LO_HZ, 155, PRINT_AXIS_HI_HZ]) {
      const { rest, heard, playing } = printInk(hz);
      const develop = lstar(rest) - lstar(heard);
      const play = lstar(heard) - lstar(playing);
      expect(develop, `develop step at ${hz}Hz`).toBeGreaterThan(play * 2);
      expect(
        contrast(heard, PRINT_GROUND) - contrast(rest, PRINT_GROUND)
      ).toBeGreaterThan(
        contrast(playing, PRINT_GROUND) - contrast(heard, PRINT_GROUND)
      );
    }
  });

  it("never clips a channel, so no two pitches collapse onto one colour", () => {
    // The state colours are the ramp re-exposed in linear light, which
    // preserves chromaticity exactly — but only while nothing saturates.
    const seen = new Set<string>();
    for (let hz = 80; hz <= 288; hz += 2) {
      const ink = printInk(hz);
      for (const hex of Object.values(ink)) {
        expect(hex).toMatch(/^#[0-9a-f]{6}$/);
        expect(hex).not.toMatch(/^#ff|ff$/); // a saturated channel
      }
      seen.add(ink.rest);
    }
    expect(seen.size).toBeGreaterThan(60);
  });

  it("anchors on the shell's own green, so the accent is not a second one", () => {
    expect(PRINT_RAMP_BRIGHT).toBe("#2c5a42");
    expect(PRINT_RAMP_DEEP).toBe("#a66a2b");
  });
});
