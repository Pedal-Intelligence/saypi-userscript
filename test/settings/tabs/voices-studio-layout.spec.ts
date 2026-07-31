import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * CSS contract guards for the settings Voices studio.
 *
 * A JSDOM test can render the studio's DOM but never lays it out, so the three
 * layout defects these guard cannot be caught by asserting geometry. They are
 * caught here instead, by reading the shipped stylesheet back and asserting the
 * declarations the fixes consist of. The matching DOM-side class contract (that
 * the elements these rules target actually exist, on every card) lives in
 * voices-controller.spec.tsx.
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

/** The declarations of a single (flat, un-nested) rule, by exact selector. */
function ruleBody(selector: string): string {
  const at = css.indexOf(`${selector} {`);
  expect(at, `voices.css should declare ${selector}`).toBeGreaterThan(-1);
  const open = css.indexOf("{", at);
  const close = css.indexOf("}", open);
  return css.slice(open + 1, close);
}

const fontSizePx = (body: string): number => {
  const m = /font-size:\s*([\d.]+)px/.exec(body);
  expect(m, "rule should declare a px font-size").toBeTruthy();
  return Number(m![1]);
};

/** The `color:` literal of a rule (not `background-color:` etc.). */
function colorOf(body: string): string {
  const m = /(?:^|[^-])color:\s*(#[0-9a-f]{6})/i.exec(body);
  expect(m, "rule should declare a hex color").toBeTruthy();
  return m![1];
}

/** Relative brightness of a #rrggbb literal — lower is darker (leads). */
function luminance(body: string): number {
  const hex = colorOf(body);
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2.x relative luminance (gamma-corrected), unlike the raw brightness above. */
function wcagLuminance(hex: string): number {
  const [r, g, b] = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two #rrggbb literals. */
function contrast(fg: string, bg: string): number {
  const [hi, lo] = [wcagLuminance(fg), wcagLuminance(bg)].sort((a, b) => b - a);
  return (hi + 0.05) / (lo + 0.05);
}

describe("Defect 1 — voice cards must not go ragged", () => {
  // A voice whose subtitle falls back to a long server `description` (the
  // second Paola) stretches its grid row; because grid rows stretch, every
  // sibling card grows too while their Use buttons stay stranded mid-card.
  const tagline = () => ruleBody(".voice-card-tagline");
  const actions = () => ruleBody(".voice-card-actions");

  it("clamps the card tagline to two lines", () => {
    const body = tagline();
    expect(body).toMatch(/display:\s*-webkit-box/);
    expect(body).toMatch(/-webkit-box-orient:\s*vertical/);
    expect(body).toMatch(/-webkit-line-clamp:\s*2/);
    // The standard property alongside the prefixed one, so the clamp survives
    // an engine that drops the -webkit- alias.
    expect(body).toMatch(/[^-]line-clamp:\s*2/);
    expect(body).toMatch(/overflow:\s*hidden/);
  });

  it("still reserves the tagline's space so short taglines don't shrink a card", () => {
    expect(tagline()).toMatch(/min-height:/);
  });

  it("bottoms out the actions row so every Use button shares a baseline", () => {
    expect(actions()).toMatch(/margin-top:\s*auto/);
  });
});

describe("Defect 2 — the empty stage is a hero, not an error state", () => {
  const emptyStage = () => ruleBody(".voice-stage.voice-stage-empty");

  it("drops the dashed outline and the grey fill that read as 'disabled'", () => {
    const body = emptyStage();
    expect(body).not.toMatch(/dashed/);
    expect(body).not.toMatch(/background:\s*#f4f4f2/i);
  });

  it("keeps a stage-shaped gradient rather than a flat box", () => {
    expect(emptyStage()).toMatch(/background:\s*linear-gradient/);
  });

  it("holds the same room as a real stage, so switching hosts doesn't jump", () => {
    expect(ruleBody(".voice-stage")).toMatch(/min-height:/);
  });

  it("sets the headline at name size and the note at tagline size", () => {
    expect(fontSizePx(ruleBody(".voice-stage-empty-title"))).toBe(
      fontSizePx(ruleBody(".voice-stage-name"))
    );
    expect(fontSizePx(ruleBody(".voice-stage-empty-note"))).toBe(
      fontSizePx(ruleBody(".voice-stage-tagline"))
    );
  });
});

describe("Defect 3 — the shelf heading leads, the blurb recedes", () => {
  it("does not let the blurb out-size the heading", () => {
    expect(fontSizePx(ruleBody(".voice-shelf-title"))).toBeGreaterThan(
      fontSizePx(ruleBody(".voice-shelf-blurb"))
    );
  });

  it("keeps the heading darker than the blurb", () => {
    expect(luminance(ruleBody(".voice-shelf-title"))).toBeLessThan(
      luminance(ruleBody(".voice-shelf-blurb"))
    );
  });

  // "Recedes" is a hierarchy instruction, not a licence to go unreadable: the
  // blurb is the ONLY place the studio states what HD costs, and it sits on the
  // white .user-preference-item card (src/popup/tabs.css). At 11px it is normal
  // text for WCAG, so AA is 4.5:1 — the hierarchy has to come from the heading
  // getting darker, not the blurb getting paler.
  it("keeps the blurb readable (WCAG AA) on the card it sits on", () => {
    expect(
      contrast(colorOf(ruleBody(".voice-shelf-blurb")), "#ffffff")
    ).toBeGreaterThanOrEqual(4.5);
  });

  it("keeps the heading on one line so it can lead", () => {
    // The head is a flex row; without this the TITLE is what gives when the
    // pair overflows, stacking "EVERYDAY / VOICES" beside a two-line blurb.
    expect(ruleBody(".voice-shelf-title")).toMatch(/flex-shrink:\s*0/);
  });
});

describe("Defect 4 — the studio gets the column it is sized for", () => {
  // The settings tab gives this pane a wide content column, and
  // #voice-studio asks for up to 900px of it —
  // but its parent .user-preference-item carries the form-tab 504px cap from
  // src/popup/tabs.css, so the studio never got past ~472px. #tab-voices was
  // already uncapped one level up; this is the level that was missed.
  it("uncaps the Voices preference card, not just the tab panel", () => {
    expect(ruleBody("#tab-voices.tab-panel")).toMatch(/max-width:\s*none/);
    expect(ruleBody("#voices-preference.user-preference-item")).toMatch(
      /max-width:\s*none/
    );
  });
});
