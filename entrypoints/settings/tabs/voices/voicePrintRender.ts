/**
 * The soundprint, drawn (design §6.1).
 *
 * A pitch trace on a **shared logarithmic frequency axis**, with one faint
 * horizontal reference line running through every print at the same y. That
 * line is the whole design move: it registers N independent traces into a
 * single chart, so vertical position means the same thing on every voice and
 * the catalog reads as one continuous descent from deep to bright.
 *
 * Every constant below is fixed rather than derived from the catalog. The axis
 * is 80–288 Hz for every voice, forever, and `MAX_SPAN` is a constant, not
 * max-of-catalog — otherwise adding one long-winded voice silently rescales
 * every other print, and a mark that changes when its neighbours change is not
 * a mark.
 *
 * Pure geometry (`printBars`) is separated from DOM (`createPrintSvg` /
 * `paintPrintTrace`) so the numbers are provable without a browser. Nothing
 * here uses `innerHTML` — dropping the orb's `innerHTML` glyph removed the
 * last such sink from a privileged extension page, and this must not add one
 * back.
 */

import type { VoicePrint } from "../../../../src/tts/voicePrint";
import { MIN_VOICED_FRAMES } from "../../../../src/tts/voicePrint";

const SVG_NS = "http://www.w3.org/2000/svg";

/** The print band. 26 px is one row's worth of ink. */
export const PRINT_HEIGHT = 26;
/** y of the shared reference line — 155 Hz on the axis below. */
export const PRINT_REF_Y = 12.6;
/** The fixed frequency axis. Deep male speech to bright female speech, no more. */
export const PRINT_AXIS_LO_HZ = 80;
export const PRINT_AXIS_HI_HZ = 288;
/** The tallest usable band inside the 26 px. */
export const PRINT_Y_MIN = 2;
export const PRINT_Y_MAX = 24;
/** Clip length that fills the full width. A FIXED constant (see the header). */
export const PRINT_MAX_SPAN_S = 2.2;
/**
 * Frame-to-frame spacing and bar width, in print units (= px at 1:1).
 *
 * The **duty cycle** — bar width over frame pitch — is what decides whether
 * the mark reads as a seismograph or as a ribbon. It shipped at 1.4/2.6 = 54 %,
 * which is the visual language of an audio editor: high-density hairlines with
 * air between them, legible but cold. At 2.1/2.6 = 81 % neighbouring bars very
 * nearly touch and the trace resolves into one soft continuous band, while the
 * per-frame heights still read as rhythm.
 *
 * The PITCH is deliberately unchanged. Widening the spacing instead would have
 * dropped the drawn frame count by a third (300 px / 4.2 = 71 frames against
 * 115), and a thinner trace reads DOTTIER, which is the opposite of softer.
 * Every frame the resampler produces still gets a bar; they are simply fatter.
 */
export const PRINT_FRAME_PITCH = 2.6;
export const PRINT_BAR_W = 2.1;
/**
 * Amplitude, scaled 1.25× with the widening so the ribbon keeps its aspect —
 * a 2.1 px bar 2 px tall is a dot, not a stroke. A full-loudness bar is now
 * 10 px in a 26 px band, so a bar centred at the very top or bottom of the
 * axis overhangs the band by up to 3 px; the svg is `overflow: visible` inside
 * a 42 px row, which has 8 px of slack either side of the print.
 */
export const PRINT_BAR_MIN_H = 2.5;
export const PRINT_BAR_LOUD_H = 7.5;
/** Resampled frame count is clamped: fewer reads as dots, more reads as mud. */
export const PRINT_MIN_FRAMES = 12;
export const PRINT_MAX_FRAMES = 115;

/**
 * The widths the studio draws at. The rail draws every row at `lg` — one
 * width for the whole page is what lets the shared reference line register
 * twenty-two traces into a single chart. `md` survives as the functions'
 * default and as the width the geometry is pinned at in tests. (A third,
 * 72 px size existed for the menu-slot pills, which the rail retired.)
 */
export const PRINT_WIDTHS = { md: 118, lg: 300 } as const;

/** The playhead's width, in print units. A hairline: it is a clock, not a bar. */
export const PRINT_HEAD_W = 1.5;

const LOG_LO = Math.log2(PRINT_AXIS_LO_HZ);
const LOG_SPAN = Math.log2(PRINT_AXIS_HI_HZ) - LOG_LO;

/**
 * Pitch → y. `y(f) = 24 − 22 × (log2 f − log2 80) / (log2 288 − log2 80)`,
 * clamped to the band. 155 Hz lands on 12.6, which is where the reference line
 * sits, so a voice at the middle of the axis draws straight through it.
 */
export function printY(hz: number): number {
  if (!Number.isFinite(hz) || hz <= 0) return PRINT_REF_Y;
  const t = (Math.log2(hz) - LOG_LO) / LOG_SPAN;
  return Math.min(PRINT_Y_MAX, Math.max(PRINT_Y_MIN, PRINT_Y_MAX - 22 * t));
}

/* --- the pitch ramp --------------------------------------------------------
   ONE ordered ramp — warm amber for the deep voices, the shell's green for the
   bright ones — keyed to the SAME fixed 80–288 Hz axis that decides vertical
   position. Colour and height therefore agree by construction: one axis, two
   encodings.

   This is not the per-voice colour the design bans, and the distinction is the
   whole argument. The 22 gradient orbs this page deleted were `djb2` HASHES of
   the voice id: they looked like they encoded something and encoded nothing.
   A monotonic function of measured pitch encodes exactly what the row ORDER
   already encodes, so the rail reads as one gradient down the page rather than
   as confetti — and it gives the ordering a redundant, non-positional encoding,
   which is an accessibility gain rather than decoration.

   Keyed to the FIXED axis, never to the catalog's own min/max, for the same
   reason PRINT_MAX_SPAN_S is a constant: a ramp normalised over the catalog
   would re-colour every existing voice the day the server adds a deeper one. */

/** The ramp's anchors. Amber at 80 Hz, the shell's one green at 288 Hz. */
export const PRINT_RAMP_DEEP = "#a66a2b";
export const PRINT_RAMP_BRIGHT = "#2c5a42";
/** The warm ground the studio is painted on, and what the ink is measured against. */
export const PRINT_GROUND = "#fbf7f0";

/**
 * The three heard states (§8), expressed as CONTRAST RATIOS against the ground
 * rather than as opacities of one ink.
 *
 * With a single near-black ink, three alphas were three legible weights. With a
 * ramp they are not: full-strength amber measures 4.2:1 against this ground and
 * full-strength green 7.6:1, so one alpha scale would make a deep unheard voice
 * fainter than a bright unheard one — the colour would corrupt the heard-state
 * reading it sits beside. Fixing the CONTRAST per state instead, and letting the
 * ramp choose the hue, keeps every row at equal presence in equal state, so hue
 * carries pitch and weight carries memory, cleanly separated.
 *
 * `rest` keeps the 3.2:1 floor the monochrome rail settled on by eye (WCAG
 * 1.4.11 asks 3:1 of a graphic you need in order to read the content). The
 * other two are chosen so the DEVELOP step is far the larger of the two — 19
 * points of CIE L* against 8, matching design §8's "more than twice" — because
 * "play one voice and its print inks in" is the whole of heard state on the
 * rail, while what marks the playing row is the green playhead crossing it.
 */
export const PRINT_INK_CONTRAST = {
  rest: 3.2,
  heard: 6.4,
  playing: 8.6,
} as const;

export type PrintInkState = keyof typeof PRINT_INK_CONTRAST;
export type PrintInk = Record<PrintInkState, string>;

const hexToRgb = (hex: string): number[] =>
  [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const toLinear = (c: number): number =>
  c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
const toSrgb = (v: number): number =>
  v <= 0.00304 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
const linearOf = (hex: string): number[] =>
  hexToRgb(hex).map((c) => toLinear(c / 255));
const luminance = ([r, g, b]: number[]): number =>
  0.2126 * r + 0.7152 * g + 0.0722 * b;
const hexOf = (linear: number[]): string =>
  "#" +
  linear
    .map((v) => Math.round(Math.min(1, Math.max(0, toSrgb(v))) * 255))
    .map((c) => c.toString(16).padStart(2, "0"))
    .join("");

const RAMP_DEEP_RGB = hexToRgb(PRINT_RAMP_DEEP);
const RAMP_BRIGHT_RGB = hexToRgb(PRINT_RAMP_BRIGHT);
const GROUND_Y = luminance(linearOf(PRINT_GROUND));

/**
 * Where a pitch sits on the ramp, 0 (deepest) to 1 (brightest).
 *
 * Derived from `printY` rather than from its own copy of the log axis, so the
 * colour and the height cannot drift apart: a voice drawn at the top of the
 * band is, by construction, at the top of the ramp. An unmeasured voice reports
 * 155 Hz — the reference line — and lands mid-ramp, which is neutral rather
 * than deep or bright.
 */
export function printPitchT(hz: number): number {
  return (PRINT_Y_MAX - printY(hz)) / (PRINT_Y_MAX - PRINT_Y_MIN);
}

/**
 * The ramp colour at `t`, re-exposed to hit an exact contrast ratio.
 *
 * The hue comes from a straight sRGB mix of the two anchors — what the approved
 * render used. The WEIGHT comes from scaling that colour in LINEAR light, which
 * preserves its chromaticity exactly (it is the same colour at a different
 * exposure) while moving its luminance to wherever the target ratio wants it.
 * That makes the state colours a closed form rather than three hand-picked
 * swatches per hue, so the ramp stays correct if an anchor is ever retuned.
 */
function rampInk(t: number, target: number): string {
  const clamped = Math.min(1, Math.max(0, t));
  const base = RAMP_DEEP_RGB.map((v, i) =>
    toLinear((v + (RAMP_BRIGHT_RGB[i] - v) * clamped) / 255)
  );
  const want = (GROUND_Y + 0.05) / target - 0.05;
  const exposure = want / luminance(base);
  return hexOf(base.map((v) => v * exposure));
}

/** The three inks a voice's print is drawn in, from its pitch. */
export function printInk(hz: number): PrintInk {
  const t = printPitchT(hz);
  return {
    rest: rampInk(t, PRINT_INK_CONTRAST.rest),
    heard: rampInk(t, PRINT_INK_CONTRAST.heard),
    playing: rampInk(t, PRINT_INK_CONTRAST.playing),
  };
}

/** Drawn width of the trace: clip length, against a fixed 2.2 s full scale. */
export function traceWidth(span: number, width: number): number {
  const usable = Math.max(0, Math.min(span, PRINT_MAX_SPAN_S));
  return (width * usable) / PRINT_MAX_SPAN_S;
}

/** How many frames survive to the drawing, at this width. */
export function traceFrameCount(span: number, width: number): number {
  const count = Math.round(traceWidth(span, width) / PRINT_FRAME_PITCH);
  return Math.min(PRINT_MAX_FRAMES, Math.max(PRINT_MIN_FRAMES, count));
}

export interface PrintBar {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * The bars of one print, in a `width × 26` space.
 *
 * **Unvoiced frames emit nothing.** The gaps are the consonants and the
 * breath, and they are half the character of a print — filling them in would
 * turn twenty-two distinguishable marks into twenty-two rectangles.
 *
 * Fallback ladder (§6.2): with too little usable pitch the bars fall back to
 * the amplitude envelope alone, drawn symmetrically about the reference line,
 * which still carries rhythm and phrasing. With no span at all, nothing is
 * drawn — never a placeholder shape pretending to be data.
 */
export function printBars(print: VoicePrint, width: number): PrintBar[] {
  const frames = print.f0.length;
  if (frames === 0 || print.span <= 0) return [];

  const voiced = print.f0.filter((hz) => hz > 0).length;
  const pitched = voiced >= MIN_VOICED_FRAMES;
  const count = Math.min(traceFrameCount(print.span, width), frames);
  const bars: PrintBar[] = [];

  for (let i = 0; i < count; i++) {
    // Nearest-neighbour: a print is a sampling of the voice, not a smoothing
    // of it, and interpolating pitch across an unvoiced gap would invent a
    // slide the speaker never made.
    const source =
      count === 1 ? 0 : Math.round((i * (frames - 1)) / (count - 1));
    const hz = print.f0[source];
    const loud = Math.min(1, Math.max(0, print.amp[source] ?? 0));
    if (pitched ? hz <= 0 : loud <= 0) continue;
    const height = PRINT_BAR_MIN_H + PRINT_BAR_LOUD_H * loud;
    const centre = pitched ? printY(hz) : PRINT_REF_Y;
    bars.push({
      x: i * PRINT_FRAME_PITCH,
      y: centre - height / 2,
      width: PRINT_BAR_W,
      height,
    });
  }
  return bars;
}

/**
 * The empty print: the reference line and nothing else.
 *
 * This is BOTH the loading state and the no-measurement-yet state, on purpose
 * — the ghost print is the placeholder, so there is no skeleton shimmer to
 * build and no second visual to explain. Ink comes from `currentColor`, so the
 * whole state of a print is one class on its container.
 */
export function createPrintSvg(width: number = PRINT_WIDTHS.md): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.classList.add("voice-print");
  svg.setAttribute("width", String(width));
  svg.setAttribute("height", String(PRINT_HEIGHT));
  svg.setAttribute("viewBox", `0 0 ${width} ${PRINT_HEIGHT}`);
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");

  const ref = document.createElementNS(SVG_NS, "line");
  ref.classList.add("voice-print-ref");
  ref.setAttribute("x1", "0");
  ref.setAttribute("y1", String(PRINT_REF_Y));
  ref.setAttribute("x2", String(width));
  ref.setAttribute("y2", String(PRINT_REF_Y));
  svg.appendChild(ref);

  const trace = document.createElementNS(SVG_NS, "g");
  trace.classList.add("voice-print-trace");
  svg.appendChild(trace);

  // The playhead. Present on every print and only *visible* on the playing
  // row, so nothing is created or destroyed when a clip starts — it is the
  // one thing on the page that has to be smooth.
  const head = document.createElementNS(SVG_NS, "rect");
  head.classList.add("voice-print-head");
  head.setAttribute("x", "0");
  head.setAttribute("y", "0");
  head.setAttribute("width", String(PRINT_HEAD_W));
  head.setAttribute("height", String(PRINT_HEIGHT));
  svg.appendChild(head);
  return svg;
}

/**
 * Draw (or redraw) a measured print into an existing svg.
 *
 * Also publishes the three numbers the playhead needs — how far it travels
 * (`--print-trace-w`, the drawn trace's width), how long that takes
 * (`--print-span`, the clip's own measured speech span) and **when it starts**
 * (`--print-lead`, the leading silence the trace was trimmed of). All three
 * come from the measurement, so the head is a clock for the drawing rather
 * than a fixed animation pretending to be one; an unmeasured print publishes
 * none of them and gets no head.
 *
 * The lead is what registers the clock against the audio. `.playing` lands at
 * clip t=0, but trace x=0 is the first VOICED frame — 0.76 s later on Onyx.
 * Without the delay the head is already two thirds across the trace at the
 * instant the voice becomes audible.
 */
export function paintPrintTrace(
  svg: SVGSVGElement,
  print: VoicePrint | null,
  width: number = PRINT_WIDTHS.md
): void {
  const trace = svg.querySelector(".voice-print-trace");
  if (!trace) return;
  while (trace.firstChild) trace.removeChild(trace.firstChild);
  if (!print) {
    svg.style.removeProperty("--print-trace-w");
    svg.style.removeProperty("--print-span");
    svg.style.removeProperty("--print-lead");
    return;
  }
  svg.style.setProperty(
    "--print-trace-w",
    `${traceWidth(print.span, width).toFixed(1)}px`
  );
  svg.style.setProperty("--print-span", `${print.span.toFixed(2)}s`);
  svg.style.setProperty("--print-lead", `${print.lead.toFixed(2)}s`);
  for (const bar of printBars(print, width)) {
    const rect = document.createElementNS(SVG_NS, "rect");
    rect.setAttribute("x", bar.x.toFixed(2));
    rect.setAttribute("y", bar.y.toFixed(2));
    rect.setAttribute("width", String(bar.width));
    rect.setAttribute("height", bar.height.toFixed(2));
    rect.setAttribute("rx", String(bar.width / 2));
    trace.appendChild(rect);
  }
}

/** Convenience: a complete print in one call. */
export function renderVoicePrint(
  print: VoicePrint | null,
  width: number = PRINT_WIDTHS.md
): SVGSVGElement {
  const svg = createPrintSvg(width);
  paintPrintTrace(svg, print, width);
  return svg;
}
