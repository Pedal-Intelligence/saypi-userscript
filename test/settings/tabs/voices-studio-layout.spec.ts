import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  PRINT_GROUND,
  PRINT_GROUND_FOCUS,
  PRINT_HEAD_W,
  PRINT_WIDTHS,
  printInk,
} from "../../../entrypoints/settings/tabs/voices/voicePrintRender";

/**
 * CSS contract guards for the settings Voices rail.
 *
 * A JSDOM test can render the rail's DOM but never lays it out, so the design
 * decisions that live entirely in the stylesheet cannot be caught by asserting
 * geometry. They are caught here instead, by reading the shipped stylesheet
 * back and asserting the declarations the design consists of. The matching
 * DOM-side class contract (that the elements these rules target actually
 * exist) lives in voices-controller.spec.tsx.
 *
 * What this proves: the rules are present with the right values.
 * What it does NOT prove: that the rendered result looks right. Real-browser
 * confirmation is a Layer-4 settings-page check.
 */
const root = resolve(__dirname, "../../..");
const css = readFileSync(
  resolve(root, "entrypoints/settings/tabs/voices/voices.css"),
  "utf8"
);
/** The whole sheet with its (long, rationale-carrying) comments removed. */
const declarations = css.replace(/\/\*[\s\S]*?\*\//g, "");

/**
 * The declarations of a single (flat, un-nested) rule, by exact selector.
 *
 * Anchored to the start of a line, or `.voice-row:hover` would happily resolve
 * to `.voice-rail:focus-visible .voice-row:hover` — a substring match that
 * turns "this rule is missing" into a silent pass on a DIFFERENT rule.
 * Comments are stripped too: this file's rules carry long rationales, and a
 * value quoted in prose must never satisfy an assertion about a declaration.
 */
function ruleBody(selector: string): string {
  const at = css.indexOf(`\n${selector} {`);
  expect(at, `voices.css should declare ${selector}`).toBeGreaterThan(-1);
  const open = css.indexOf("{", at);
  const close = css.indexOf("}", open);
  return css.slice(open + 1, close).replace(/\/\*[\s\S]*?\*\//g, "");
}

/** The ink a rule paints at: an alpha, with an opaque hex reading as 1. */
function inkDensity(body: string): number {
  const rgba = /(?:^|[^-])color:\s*rgba\([^)]*?,\s*([\d.]+)\s*\)/.exec(body);
  if (rgba) return Number(rgba[1]);
  expect(
    /(?:^|[^-])color:\s*#[0-9a-f]{3,8}/i.test(body),
    "rule should declare a color"
  ).toBe(true);
  return 1;
}

/** The custom property a rule paints the print in, and its fallback. */
function inkVar(body: string): { name: string; fallback: string } {
  const m = /(?:^|[^-])color:\s*var\((--[\w-]+),\s*(#[0-9a-f]{6})\)/i.exec(body);
  expect(m, "rule should paint the print from a --print-ink-* custom property").toBeTruthy();
  return { name: m![1], fallback: m![2].toLowerCase() };
}

const fontSizePx = (body: string): number => {
  const m = /font-size:\s*([\d.]+)px/.exec(body);
  expect(m, "rule should declare a px font-size").toBeTruthy();
  return Number(m![1]);
};

const pxOf = (body: string, property: string): number => {
  const m = new RegExp(`(?:^|[^-])${property}:\\s*([\\d.]+)px`).exec(body);
  expect(m, `rule should declare a px ${property}`).toBeTruthy();
  return Number(m![1]);
};

/** A rule's `flex: <grow> <shrink> <basis>px` shorthand, parsed. */
function flexOf(body: string): {
  grow: number;
  shrink: number;
  basis: number;
} {
  const m = /(?:^|[^-])flex:\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:px)?/.exec(body);
  expect(m, "rule should declare a three-value flex shorthand").toBeTruthy();
  return { grow: Number(m![1]), shrink: Number(m![2]), basis: Number(m![3]) };
}

/** WCAG 2.x relative luminance of an r,g,b triple in 0–255. */
function wcagLuminance([r, g, b]: number[]): number {
  const [lr, lg, lb] = [r, g, b]
    .map((c) => c / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

const hexRgb = (hex: string): number[] =>
  [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

/** Composite a translucent ink over an opaque ground. */
const over = (ink: number[], alpha: number, ground: number[]): number[] =>
  ink.map((c, i) => alpha * c + (1 - alpha) * ground[i]);

function contrast(fg: number[], bg: number[]): number {
  const [hi, lo] = [wcagLuminance(fg), wcagLuminance(bg)].sort((a, b) => b - a);
  return (hi + 0.05) / (lo + 0.05);
}

/** Warm near-black, warm paper. The rail is a warm island on the cool shell. */
const INK = hexRgb("#241d14");
const GROUND = hexRgb(PRINT_GROUND);
/** The warmer tile a hovered/focused row takes — the DARKER of the two. */
const FOCUS_GROUND = hexRgb(PRINT_GROUND_FOCUS);
const RULE = "#eadfcc";
const ACCENT = "#2c5a42";

describe("the page is a chart, not a directory", () => {
  it("puts no rule between rows — separation is the 42px rhythm", () => {
    const row = ruleBody(".voice-row");
    expect(row).not.toMatch(/border-bottom/);
    expect(row).not.toMatch(/border-top/);
    // The only border a row carries is the focus/accent rule on its left edge.
    expect(row).toMatch(/border-left:\s*3px solid transparent/);
  });

  it("has exactly two horizontal rules: under the control bar, above the tail", () => {
    const separators = declarations.match(/border-(?:top|bottom):/g) ?? [];
    expect(separators.length).toBe(2);
    expect(ruleBody(".voice-rail-controls")).toMatch(
      new RegExp(`border-bottom:\\s*1px solid ${RULE}`)
    );
    expect(ruleBody(".voice-rail-divider")).toMatch(
      new RegExp(`border-top:\\s*1px solid ${RULE}`)
    );
  });

  it("gives 42px rows a 26px print band, on the 8px grid", () => {
    expect(pxOf(ruleBody(".voice-row"), "height")).toBe(42);
    const print = ruleBody(".voice-row-print");
    expect(flexOf(print).basis).toBe(PRINT_WIDTHS.lg);
    expect(pxOf(print, "height")).toBe(26);
  });

  it("carries no per-voice colour anywhere — no gradient, no hue-coded state", () => {
    expect(declarations).not.toMatch(/linear-gradient|radial-gradient|hsl\(/);
    // ONE green, and only the one green. Everything else in the STYLESHEET is
    // ink, ground, rule, row-focus, white, or one of the three neutral ramp
    // fallbacks — design §11's five tokens, warmed. The pitch ramp itself is
    // not here at all: it arrives as custom properties from printInk(), which
    // is what keeps colour a measured function of pitch rather than a set of
    // swatches somebody could quietly add a 23rd to.
    expect((declarations.match(/#2c5a42/gi) ?? []).length).toBeGreaterThan(0);
    const neutral = printInk(155);
    const allowed = new Set([
      "#2c5a42", // accent — now
      "#241d14", // ink (warm near-black)
      "#fbf7f0", // ground (cream)
      RULE, // rule
      "#f3eada", // row focus
      "#ffffff",
      neutral.rest,
      neutral.heard,
      neutral.playing,
    ]);
    for (const hex of declarations.match(/#[0-9a-f]{6}/gi) ?? []) {
      expect(allowed.has(hex.toLowerCase()), `${hex} is not a design token`).toBe(
        true
      );
    }
  });

  it("puts the warm ground on the CARD, not on an inner panel", () => {
    // A cream box inside the shell's white card would read as a box in a box.
    // The shell's page is a cool #f8fafc, so this is one warm sheet of paper on
    // a cool desk — the relationship the white card already had.
    expect(ruleBody("#voices-preference.user-preference-item")).toMatch(
      /background:\s*#fbf7f0/
    );
    expect(ruleBody("#voice-studio")).not.toMatch(/background/);
  });
});

/**
 * The row's width budget, against the column the settings shell actually gives
 * this pane.
 *
 * The rail was designed and tuned inside a 1120 × 900 settings *window*. #584
 * moved settings into a browser TAB and #587 deleted the window-sizing
 * machinery, so the pane is now a **fixed 756 px content column** — measured
 * identical in the built extension at viewports 1100, 1280, 1600 and 1920 —
 * which leaves the rail 692 px. At the shipped 300 px print that left the
 * description 95 px and ellipsised 13 of the live catalog's 15 taglines,
 * including both twin-Paola disambiguators ("Speaks 33 l…" / "Speaks 75 l…"),
 * which is the one truncation that makes two rows indistinguishable at rest.
 *
 * Widening the column for this tab is NOT the fix — that is the #582/#583
 * regression class and the sheet carries its own warning about it. The row has
 * to live inside 692 px, so the budget below is an arithmetic contract on the
 * declared column widths. The string widths are measured, in the built
 * extension, at the sheet's own 12 px / 400 description face.
 */
describe("the row fits the column the settings tab actually gives it", () => {
  /** Measured: `.voice-rail` is 692 px at every viewport ≥ 1100. */
  const RAIL_WIDTH = 692;
  /** Measured widths of the live Pi catalog's descriptions, in px. */
  const TWIN_DISAMBIGUATOR = 121; // "Speaks 33 languages" — the load-bearing one
  const LONGEST_TAGLINE = 171; // "Easy, conversational American" (Joey, an HD row)
  const HD_BADGE = 17.16;

  /** What the description column is actually left with, from the sheet. */
  function descriptionBudget(badge: number): number {
    const row = ruleBody(".voice-row");
    // `padding: 0 20px 0 14px` plus the 3 px focus rule on the left edge.
    const inner =
      RAIL_WIDTH -
      pxOf(row, "border-left") -
      14 -
      20;
    const print = ruleBody(".voice-row-print");
    const name = ruleBody(".voice-row-name");
    const actions = ruleBody(".voice-row-actions");
    return (
      inner -
      (flexOf(print).basis + pxOf(print, "margin-right")) -
      (flexOf(name).basis + pxOf(name, "margin-right")) -
      (flexOf(actions).basis + pxOf(actions, "margin-left")) -
      pxOf(ruleBody(".voice-row-badges"), "margin-left") -
      badge
    );
  }

  it("leaves a duplicate-named voice's differentiator fully legible", () => {
    // #585 gave the two Paolas a subtitle that never hides, because it is the
    // only thing telling the rows apart. A truncated differentiator does not
    // differentiate: two rows go back to being one row read twice. Both twins
    // are HD, so they pay for the badge as well.
    expect(descriptionBudget(HD_BADGE)).toBeGreaterThan(TWIN_DISAMBIGUATOR);
    // …and with room for a longer locale, since these strings are translated.
    expect(descriptionBudget(HD_BADGE)).toBeGreaterThan(
      TWIN_DISAMBIGUATOR * 1.3
    );
  });

  it("leaves the catalog's taglines whole, badge or no badge", () => {
    expect(descriptionBudget(HD_BADGE)).toBeGreaterThanOrEqual(
      LONGEST_TAGLINE
    );
    expect(descriptionBudget(0)).toBeGreaterThanOrEqual(LONGEST_TAGLINE);
  });
});

describe("the row gives up space in a fixed order", () => {
  // Print first, then the name, and the description LAST — it is the only
  // thing on the row whose meaning is destroyed by losing width. The print is
  // the most elastic element on the page: its bars are computed against a
  // width and the svg carries a viewBox, so a narrower box says exactly what
  // the wide one said, only smaller.
  const print = () => ruleBody(".voice-row-print");
  const name = () => ruleBody(".voice-row-name");
  const desc = () => ruleBody(".voice-row-desc");

  it("steps the print down with the PAGE, never with the row", () => {
    // A flex-shrink here would make the print's width a per-row negotiation,
    // and the rows are not identical: a badge costs its row 29px, so under any
    // pressure the HD rows would draw their traces ~15 % shorter than the rows
    // beside them (measured: 143.9px against 169.8px at a 592px rail). Trace
    // length IS clip length, so that is not a smaller chart, it is a chart
    // that lies about half its rows.
    expect(flexOf(print()).shrink).toBe(0);
    const steps = [
      ...css.matchAll(
        /@container \(max-width:\s*(\d+)px\)\s*\{\s*\.voice-row-print\s*\{[^}]*flex-basis:\s*(\d+)px/g
      ),
    ].map((m) => [Number(m[1]), Number(m[2])]);
    expect(steps.length, "the print should step with the container").toBeGreaterThan(0);
    // Monotonic, and every step below the width it draws at.
    let width = flexOf(print()).basis;
    let at = Infinity;
    for (const [breakpoint, basis] of steps) {
      expect(breakpoint).toBeLessThan(at);
      expect(basis).toBeLessThan(width);
      [at, width] = [breakpoint, basis];
    }
    // The rail has to BE a query container, or none of the above ever applies.
    expect(ruleBody(".voice-rail")).toMatch(/container-type:\s*inline-size/);
  });

  it("lets the name shrink after it, never before", () => {
    expect(flexOf(name()).shrink).toBeGreaterThan(0);
    expect(pxOf(name(), "min-width")).toBeGreaterThan(0);
    expect(pxOf(name(), "min-width")).toBeLessThan(flexOf(name()).basis);
  });

  it("gives the description a floor, so it is the last to yield", () => {
    // A floor above the widest differentiator: even in a window narrow enough
    // to squeeze the print, the two Paolas stay tellable apart.
    expect(pxOf(desc(), "min-width")).toBeGreaterThanOrEqual(152);
  });

  it("bases the description at 0, so a long one never squeezes the print", () => {
    // THE load-bearing one. `flex-basis: auto` makes the description's base
    // size its own text, so one 40-character tagline puts the whole row into
    // deficit and steals from the print — on that row only. Every print would
    // then be a different width, and the shared reference line only fuses N
    // traces into one chart because they are all drawn at the SAME width.
    // Basing at 0 makes the sum of base sizes identical on every row, so the
    // print's width is a page-level decision and the description simply grows
    // into whatever is left.
    expect(flexOf(desc()).basis).toBe(0);
    expect(flexOf(desc()).grow).toBeGreaterThan(0);
  });
});

describe("ink is one ramp in three steps", () => {
  // The three steps are the HEARD STATE (design §8) and nothing else: never
  // heard → heard → playing. They used to be three ALPHAS of one near-black
  // ink; they are now three measured COLOURS from printInk(), because the ink
  // is the pitch ramp and a ramp does not survive alpha-scaling (full amber is
  // 4.2:1 against this ground where full green is 7.6:1, so one alpha scale
  // would make a deep unheard voice fainter than a bright unheard one).
  // The RATIOS themselves are asserted in voicePrintRender.spec.ts, where the
  // ramp now lives; this file's job is that the stylesheet actually spends
  // them, in the right order, on the right classes.
  it("paints each state from its own ramp property, never a fourth colour", () => {
    const unheard = inkVar(ruleBody(".voice-row"));
    const heard = inkVar(ruleBody(".voice-row.heard"));
    const playing = inkVar(ruleBody(".voice-row.playing"));
    expect(unheard.name).toBe("--print-ink-rest");
    expect(heard.name).toBe("--print-ink-heard");
    expect(playing.name).toBe("--print-ink-play");
    // The fallbacks are the NEUTRAL rung — 155 Hz, the reference line, which is
    // where an unmeasured voice is placed. Pinned to printInk() so the sheet
    // cannot drift from the ramp it is quoting.
    const neutral = printInk(155);
    expect(unheard.fallback).toBe(neutral.rest);
    expect(heard.fallback).toBe(neutral.heard);
    expect(playing.fallback).toBe(neutral.playing);
  });

  it("spends most of the scale on the step that DEVELOPS the page", () => {
    // Design §8's rule, unchanged: a develop step more than twice the playing
    // step, because "play one voice and its print inks in" is the whole of
    // heard state on the rail, while what marks the playing row is the green
    // playhead crossing its trace. Measured here on the fallbacks the SHEET
    // declares, in CIE L* — the honest metric now that the three states are
    // three colours rather than three alphas of one ink.
    const lstar = (hex: string): number => {
      const y = wcagLuminance(hexRgb(hex));
      return y > 0.008856 ? 116 * Math.cbrt(y) - 16 : 903.3 * y;
    };
    const unheard = lstar(inkVar(ruleBody(".voice-row")).fallback);
    const heard = lstar(inkVar(ruleBody(".voice-row.heard")).fallback);
    const playing = lstar(inkVar(ruleBody(".voice-row.playing")).fallback);
    expect(unheard).toBeGreaterThan(heard);
    expect(heard).toBeGreaterThan(playing);
    expect(unheard - heard).toBeGreaterThan((heard - playing) * 2);
  });

  it("leaves hover and focus out of the ink entirely", () => {
    // A fourth weight would either sit below `heard` — dimming a print the
    // moment you point at it — or above it, at which point pointing at a voice
    // looks like playing it. Standing on a row is its ground, its tagline and
    // its actions; the print keeps saying what it always said.
    expect(ruleBody(".voice-row:hover")).not.toMatch(/(?:^|[^-])color:/);
    expect(ruleBody(".voice-row.focused")).not.toMatch(/(?:^|[^-])color:/);
    // …but they DO give the row a ground, and that ground is the one the ramp's
    // contrast floor is solved against. Pinned to PRINT_GROUND_FOCUS so the
    // sheet cannot quietly darken the tile out from under the ink.
    for (const selector of [".voice-row:hover", ".voice-row.focused"]) {
      expect(ruleBody(selector)).toMatch(
        new RegExp(`background:\\s*${PRINT_GROUND_FOCUS}`)
      );
    }
  });

  it("rounds the row it grounds, so standing on one is a tile not a scanline", () => {
    // The 42px band was full-bleed and square-cornered: correct for a waveform
    // editor, cold for a page about voices. The radius is invisible until the
    // row has a ground, and the card's 16px padding is what it breathes into.
    expect(pxOf(ruleBody(".voice-row"), "border-radius")).toBe(12);
    // …and the focus ring follows it, or it cuts across the corner.
    expect(
      pxOf(ruleBody(".voice-rail:focus-visible .voice-row.focused"), "border-radius")
    ).toBe(12);
  });

  it("keeps the soundprint legible at rest, on EITHER ground it is drawn on", () => {
    // The trace is the page's ONLY data and it fills from the row's
    // currentColor, so the never-heard ink is what a first-time reader sees on
    // every row of the page. WCAG 1.4.11 asks 3:1 of a graphic you need in
    // order to understand the content; below that the traces read as dust and
    // the reference line becomes the most legible mark on the row — a chart
    // whose gridlines outrank its data. The 3.2:1 floor was settled by eye
    // against the live catalog and survives the warmth pass unchanged.
    //
    // The FOCUS ground is the one that matters and the one this used to miss.
    // A row always carries `.focused` (the controller applies it at first
    // paint), and that tile is 1.12× darker than the card, so an ink measured
    // only against the card sat at 2.85:1 exactly where the reader was looking.
    // The alpha ink it replaced never had the bug — rgba() composites against
    // what it is painted over — so this is a floor the ramp has to hold
    // explicitly. The ratios themselves live in voicePrintRender.spec.ts.
    const resting = hexRgb(inkVar(ruleBody(".voice-row")).fallback);
    expect(contrast(resting, GROUND)).toBeGreaterThanOrEqual(3);
    expect(contrast(resting, FOCUS_GROUND)).toBeGreaterThanOrEqual(3);
    // …and it must still out-contrast the chart it hangs on.
    expect(contrast(resting, hexRgb(RULE))).toBeGreaterThan(2);
  });

  it("declares .playing after .heard, because they tie on specificity", () => {
    // Both are (0,2,0), so source order is the whole cascade here: declared
    // the other way round, the voice that is sounding would paint at the heard
    // weight the instant its first qualifying play landed — mid-clip.
    expect(css.indexOf("\n.voice-row.playing {")).toBeGreaterThan(
      css.indexOf("\n.voice-row.heard {")
    );
  });

  it("leaves the reference line out of the playing state — it is the chart, not the voice", () => {
    expect(ruleBody(".voice-print-ref")).toMatch(
      new RegExp(`stroke:\\s*${RULE}`)
    );
    expect(ruleBody(".voice-print-trace")).toMatch(/fill:\s*currentColor/);
  });
});

describe("the control bar pins, and the rows scroll under it", () => {
  it("is sticky and OPAQUE", () => {
    const bar = ruleBody(".voice-rail-controls");
    expect(bar).toMatch(/position:\s*sticky/);
    expect(bar).toMatch(/top:\s*0/);
    // Translucent would let 42px rows smear through it as they scroll past.
    expect(bar).toMatch(/background:\s*#fbf7f0/);
  });

  it("sets every count in tabular numerals, so nothing jitters as it ticks", () => {
    expect(ruleBody(".voice-rail-controls")).toMatch(
      /font-variant-numeric:\s*tabular-nums/
    );
  });
});

describe("the focused row is the whole affordance", () => {
  it("shows the description and the actions only where you are looking", () => {
    expect(ruleBody(".voice-row-desc")).toMatch(/opacity:\s*0/);
    // visibility, not display: the row must not reflow as focus moves.
    expect(ruleBody(".voice-row-actions")).toMatch(/visibility:\s*hidden/);
    expect(declarations).toMatch(
      /\.voice-row\.focused \.voice-row-desc[\s\S]*?opacity:\s*1/
    );
    expect(declarations).toMatch(
      /\.voice-row\.focused \.voice-row-actions[\s\S]*?visibility:\s*visible/
    );
  });

  it("moves in 120ms ease-out and nothing else animates", () => {
    // Exactly two motions on the page, both informational: the playhead, and
    // focus moving rows.
    expect(ruleBody(".voice-row")).toMatch(/transition:[^;]*0\.12s ease-out/);
    expect(ruleBody(".voice-row-desc")).toMatch(
      /transition:\s*opacity 0\.12s ease-out/
    );
    expect(declarations).not.toMatch(/translateY|box-shadow:\s*0 \d/);
  });

  it("rings the ACTIVE ROW, because the listbox is the one thing holding focus", () => {
    expect(ruleBody(".voice-rail:focus-visible .voice-row.focused")).toMatch(
      new RegExp(`outline:\\s*2px solid ${ACCENT}`)
    );
  });
});

describe("one green, one meaning: now", () => {
  it("gives the current voice an accent left rule in its own pitch position", () => {
    expect(ruleBody(".voice-row-current")).toMatch(
      new RegExp(`border-left-color:\\s*${ACCENT}`)
    );
  });

  it("spends the accent on the IN USE marker, the Use button, and the playhead", () => {
    expect(ruleBody(".voice-row-inuse")).toMatch(new RegExp(`color:\\s*${ACCENT}`));
    expect(ruleBody(".voice-use")).toMatch(new RegExp(`color:\\s*${ACCENT}`));
    expect(ruleBody(".voice-print-head")).toMatch(new RegExp(`fill:\\s*${ACCENT}`));
  });

  it("keylines the playhead in paper, because the ramp arrives at the same green", () => {
    // The one place "one green means now" broke: the ramp's bright anchor IS
    // the accent, so on the brightest voices the head was green crossing green
    // (ΔE 3.4 in Oklab — one colour to the eye). A stroke in the ground colour
    // is invisible on paper and separates the head from the trace wherever it
    // crosses one, at every pitch rather than only at the amber end. Stroke is
    // centred on the edge, so the rect has to be 1px wider on each side than
    // the 1.5px green core the head has always been.
    const head = ruleBody(".voice-print-head");
    expect(head).toMatch(new RegExp(`stroke:\\s*${PRINT_GROUND}`));
    const strokeW = Number(/stroke-width:\s*([\d.]+)/.exec(head)![1]);
    expect(PRINT_HEAD_W - strokeW).toBe(1.5);
  });

  it("sets the badges at 10px/700 uppercase, HD in ink and IN USE in accent", () => {
    const inUse = ruleBody(".voice-row-inuse");
    expect(fontSizePx(inUse)).toBe(10);
    expect(inUse).toMatch(/text-transform:\s*uppercase/);
    expect(inkDensity(ruleBody(".voice-tier-chip"))).toBeLessThan(
      inkDensity(ruleBody(".voice-row-desc"))
    );
  });
});

describe("the playhead is a clock, and reduced motion slows it rather than killing it", () => {
  it("travels the DRAWN trace over the clip's own measured span", () => {
    // All three custom properties are published by paintPrintTrace from the
    // measurement, so an unmeasured print never gets a head that pretends.
    const sweep = css.slice(css.indexOf("@keyframes voice-print-sweep"));
    expect(sweep).toMatch(/translateX\(var\(--print-trace-w/);
    const head = ruleBody(".voice-row.playing .voice-print-head");
    expect(head).toMatch(/animation-name:\s*voice-print-sweep/);
    expect(head).toMatch(/animation-duration:\s*var\(--print-span/);
    expect(head).toMatch(/animation-timing-function:\s*linear/);
  });

  it("waits out the clip's leading silence before it starts", () => {
    // The trace was trimmed to the speech span, so x=0 is the first VOICED
    // frame — 0.76s into Onyx's 2.71s file, and 0.07s into Addison's. The
    // animation begins when `.playing` lands, which is clip t=0, so the delay
    // is the only thing registering the clock against the audio. Longhands,
    // never the shorthand: two var()-valued <time>s in one `animation:` are
    // positional, and swapping them silently swaps duration for delay.
    const head = ruleBody(".voice-row.playing .voice-print-head");
    expect(head).toMatch(/animation-delay:\s*var\(--print-lead/);
    expect(head).not.toMatch(/(?:^|[^-])animation:/);
  });

  it("hides the head everywhere except the playing row", () => {
    expect(ruleBody(".voice-print-head")).toMatch(/opacity:\s*0/);
    expect(declarations).toMatch(
      /\.voice-row\.playing \.voice-print-head[\s\S]*?opacity:\s*1/
    );
  });

  it("steps the head in 8 instead of removing it", () => {
    // The shipped page killed its equalizer outright under reduced motion,
    // leaving a near-invisible 3-bar glyph in a 30px orb. The playhead carries
    // information, so it is slowed, not deleted.
    const reduced = css.slice(
      css.indexOf("@media (prefers-reduced-motion: reduce)")
    );
    expect(reduced).toMatch(/animation-timing-function:\s*steps\(8/);
    expect(reduced).not.toMatch(/animation:\s*none/);
  });

  it("pulses the print of a clip that has not buffered yet, on the print itself", () => {
    // The beat is deadline-scheduled, so an unbuffered clip stretches the gap.
    // Drawing the wait ON the late voice's print is what makes it a wait
    // rather than a page that has stopped working — and says WHICH voice.
    const waiting = ruleBody(".voice-row.loading .voice-print-trace");
    expect(waiting).toMatch(/animation-name:\s*voice-print-pulse/);
    expect(waiting).toMatch(/animation-iteration-count:\s*infinite/);
    const pulse = css.slice(css.indexOf("@keyframes voice-print-pulse"));
    expect(pulse.slice(0, pulse.indexOf("}\n}"))).toMatch(/opacity:\s*0\.4/);
  });

  it("keeps the waiting state under reduced motion, and only drops the motion", () => {
    const reduced = css.slice(
      css.indexOf("@media (prefers-reduced-motion: reduce)")
    );
    // animation-NAME: none, never the `animation:` shorthand — the shorthand
    // in this block would also erase the playhead's longhands above it.
    expect(reduced).toMatch(/animation-name:\s*none/);
    expect(reduced).toMatch(/opacity:\s*0\.4/);
  });
});

describe("the sweep, its readout, and the Show: filter", () => {
  it("gives Stop the one green, because a sweep in progress is the page's 'now'", () => {
    expect(ruleBody(".voice-play-all.sweeping")).toMatch(
      new RegExp(`color:\\s*${ACCENT}`)
    );
    // …and only then. At rest it is the same quiet ink as the rest of the bar.
    expect(inkDensity(ruleBody(".voice-play-all"))).toBeLessThan(1);
  });

  it("adds no third horizontal rule — the page still has exactly two", () => {
    // Both new controls are outlined with the `border:` shorthand, which is
    // an outline rather than a rule. The count assertion lives above; this
    // pins WHY it still holds.
    expect(ruleBody(".voice-play-all")).toMatch(
      new RegExp(`border:\\s*1px solid ${RULE}`)
    );
    expect(ruleBody(".voice-filter-select")).toMatch(
      new RegExp(`border:\\s*1px solid ${RULE}`)
    );
  });

  it("sets the allowance note quieter than the hint it sits under", () => {
    // A caveat about the filter, not a warning about the page.
    expect(inkDensity(ruleBody(".voice-filter-note"))).toBeLessThan(
      inkDensity(ruleBody(".voice-rail-controls"))
    );
  });

  it("gives the bar's one message slot full ink when it has something to say", () => {
    // Blocked playback, a failed clip and a refused sweep all land in the hint
    // line. Unlike the hint, they are things you have to read.
    expect(inkDensity(ruleBody(".voice-rail-hint-alert"))).toBe(1);
  });

  it("pushes the filter to the far end of the bar, opposite the sweep", () => {
    // On the SLOT, not the control: the option set changes without a repaint
    // (`Not yet heard` appears the moment anything has been heard), so the
    // control is replaced in place — and an empty slot must collapse against
    // the right edge rather than leave the auto margin behind mid-bar.
    expect(ruleBody(".voice-filter-slot")).toMatch(/margin-left:\s*auto/);
    expect(ruleBody(".voice-filter")).not.toMatch(/margin-left:\s*auto/);
  });

  it("sets the heard counter in tabular figures, and hides it when it is empty", () => {
    // It ticks up while the reader is looking at it; proportional digits would
    // shuffle the words beside it on every voice.
    const counter = ruleBody(".voice-heard-count");
    expect(counter).toMatch(/font-variant-numeric:\s*tabular-nums/);
    expect(ruleBody(".voice-heard-count:empty")).toMatch(/display:\s*none/);
  });
});

describe("type", () => {
  it("names voices at 15px/600 and describes them at 12px", () => {
    const name = ruleBody(".voice-row-name");
    expect(fontSizePx(name)).toBe(15);
    expect(name).toMatch(/font-weight:\s*600/);
    expect(name).toMatch(/letter-spacing:\s*-0\.012em/);
    expect(fontSizePx(ruleBody(".voice-row-desc"))).toBe(12);
  });

  it("uses no serif anywhere — one family, the shell's", () => {
    expect(declarations).not.toMatch(/font-family/);
  });

  it("keeps the row description readable on the ground it is ACTUALLY read on", () => {
    // "Recedes" is a hierarchy instruction, not a licence to go unreadable.
    //
    // The tagline is `opacity: 0` at rest and revealed only by hover/focus, so
    // the FOCUS ground is the only ground it is ever read against — measuring
    // it against the card was measuring a state that never renders. It is 12px
    // at 400, which is normal text under WCAG 1.4.3, so the floor is 4.5:1; on
    // the darker tile the page-wide 62 % ink lands at 4.41, which is why this
    // one string takes 66 instead.
    const desc = ruleBody(".voice-row-desc");
    expect(desc).toMatch(/opacity:\s*0/);
    const alpha = inkDensity(desc);
    expect(
      contrast(over(INK, alpha, FOCUS_GROUND), FOCUS_GROUND)
    ).toBeGreaterThanOrEqual(4.5);
    // The twin-name disambiguator (#474) is the same string on the same ground
    // once you are standing on the row, so it takes the same ink.
    const dup = /\.voice-row\.focused \.voice-row-desc-dup\s*\{([^}]*)\}/.exec(
      declarations
    );
    expect(dup, "focused .voice-row-desc-dup should declare a colour").toBeTruthy();
    expect(inkDensity(dup![1])).toBe(alpha);
  });
});

describe("the skeleton the rail is painted into", () => {
  // The settings tab gives this pane a wide content column, and #voice-studio
  // asks for up to 900px of it — but its parent .user-preference-item carries
  // the form-tab 504px cap from src/popup/tabs.css. Both levels have to be
  // uncapped.
  it("uncaps the Voices preference card, not just the tab panel", () => {
    expect(ruleBody("#tab-voices.tab-panel")).toMatch(/max-width:\s*none/);
    expect(ruleBody("#voices-preference.user-preference-item")).toMatch(
      /max-width:\s*none/
    );
  });

  it("caps the rail itself rather than the content column (#582/#583)", () => {
    // A Voices-only width rule on the column is what caused the tab-switch
    // sidebar shunt; the studio's own max-width is what bounds it.
    expect(ruleBody("#voice-studio")).toMatch(/max-width:\s*900px/);
    expect(declarations).not.toMatch(/\.content\s*\{/);
  });

  it("hides the live region visually WITHOUT display:none, which mutes it", () => {
    const hidden = ruleBody(".voice-visually-hidden");
    expect(hidden).not.toMatch(/display:\s*none/);
    expect(hidden).toMatch(/position:\s*absolute/);
    expect(hidden).toMatch(/clip-path:\s*inset\(50%\)/);
  });

  it("styles the subtitle itself, because .description is display:none in the shell", () => {
    // preferences.css sets `.description { display: none }` inside a
    // .user-preference-item, so the rail's subtitle needs its own class.
    expect(ruleBody(".voice-rail-subtitle")).toMatch(/font-size:/);
  });
});
