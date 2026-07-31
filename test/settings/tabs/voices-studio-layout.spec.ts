import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

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

const INK = hexRgb("#15171a");
const GROUND = hexRgb("#fbfaf7");
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
      /border-bottom:\s*1px solid #e6e3da/
    );
    expect(ruleBody(".voice-rail-divider")).toMatch(
      /border-top:\s*1px solid #e6e3da/
    );
  });

  it("gives 42px rows a 26px print band, on the 8px grid", () => {
    expect(pxOf(ruleBody(".voice-row"), "height")).toBe(42);
    const print = ruleBody(".voice-row-print");
    expect(pxOf(print, "width")).toBe(300);
    expect(pxOf(print, "height")).toBe(26);
  });

  it("carries no per-voice colour anywhere — no gradient, no hue-coded state", () => {
    expect(declarations).not.toMatch(/linear-gradient|radial-gradient|hsl\(/);
    // ONE green, and only the one green. Everything else on the page is ink,
    // ground, rule, row-focus or white — the five tokens of design §11.
    expect((declarations.match(/#2c5a42/gi) ?? []).length).toBeGreaterThan(0);
    const allowed = new Set([
      "#2c5a42", // accent — now
      "#15171a", // ink
      "#fbfaf7", // ground
      "#e6e3da", // rule
      "#f1efe9", // row focus
      "#ffffff",
    ]);
    for (const hex of declarations.match(/#[0-9a-f]{6}/gi) ?? []) {
      expect(allowed.has(hex.toLowerCase()), `${hex} is not a design token`).toBe(
        true
      );
    }
  });
});

describe("ink is one variable in three steps", () => {
  // Playing is FULL ink and nothing else is — that is what carries "now"
  // alongside the playhead, and it is colourblind-safe in a way a hue is not.
  it("keeps 'playing' the darkest thing on the page, ahead of hover and focus", () => {
    const resting = inkDensity(ruleBody(".voice-row"));
    const hover = inkDensity(ruleBody(".voice-row:hover"));
    const focused = inkDensity(ruleBody(".voice-row.focused"));
    const playing = inkDensity(ruleBody(".voice-row.playing"));
    expect(hover).toBeGreaterThan(resting);
    expect(focused).toBe(hover);
    expect(playing).toBeGreaterThan(hover);
    expect(playing).toBe(1);
  });

  it("declares .playing after :hover, because they tie on specificity", () => {
    expect(css.indexOf("\n.voice-row.playing {")).toBeGreaterThan(
      css.indexOf("\n.voice-row:hover {")
    );
  });

  it("leaves the reference line out of the playing state — it is the chart, not the voice", () => {
    expect(ruleBody(".voice-print-ref")).toMatch(/stroke:\s*#e6e3da/);
    expect(ruleBody(".voice-print-trace")).toMatch(/fill:\s*currentColor/);
  });
});

describe("the control bar pins, and the rows scroll under it", () => {
  it("is sticky and OPAQUE", () => {
    const bar = ruleBody(".voice-rail-controls");
    expect(bar).toMatch(/position:\s*sticky/);
    expect(bar).toMatch(/top:\s*0/);
    // Translucent would let 42px rows smear through it as they scroll past.
    expect(bar).toMatch(/background:\s*#fbfaf7/);
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
    // Both custom properties are published by paintPrintTrace from the
    // measurement, so an unmeasured print never gets a head that pretends.
    const sweep = css.slice(css.indexOf("@keyframes voice-print-sweep"));
    expect(sweep).toMatch(/translateX\(var\(--print-trace-w/);
    expect(declarations).toMatch(/animation:\s*voice-print-sweep var\(--print-span/);
    expect(declarations).toMatch(/voice-print-sweep var\(--print-span[^;]*linear/);
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

  it("keeps the row description readable on the warm ground (WCAG AA)", () => {
    // "Recedes" is a hierarchy instruction, not a licence to go unreadable.
    const alpha = inkDensity(ruleBody(".voice-row-desc"));
    expect(contrast(over(INK, alpha, GROUND), GROUND)).toBeGreaterThanOrEqual(
      4.5
    );
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
