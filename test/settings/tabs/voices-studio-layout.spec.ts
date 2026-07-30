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

/** Relative brightness of a #rrggbb literal — lower is darker (leads). */
function luminance(body: string): number {
  const m = /(?:^|[^-])color:\s*(#[0-9a-f]{6})/i.exec(body);
  expect(m, "rule should declare a hex color").toBeTruthy();
  const hex = m![1];
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
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
});
