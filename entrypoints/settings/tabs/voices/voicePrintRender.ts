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
/** Frame-to-frame spacing and bar width, in print units (= px at 1:1). */
export const PRINT_FRAME_PITCH = 2.6;
export const PRINT_BAR_W = 1.4;
export const PRINT_BAR_MIN_H = 2;
export const PRINT_BAR_LOUD_H = 6;
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
 * Also publishes the two numbers the playhead needs — how far it travels
 * (`--print-trace-w`, the drawn trace's width) and how long that takes
 * (`--print-span`, the clip's own measured speech span). Both come from the
 * measurement, so the head is a clock for the drawing rather than a fixed
 * animation pretending to be one; an unmeasured print publishes neither and
 * gets no head.
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
    return;
  }
  svg.style.setProperty(
    "--print-trace-w",
    `${traceWidth(print.span, width).toFixed(1)}px`
  );
  svg.style.setProperty("--print-span", `${print.span.toFixed(2)}s`);
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
