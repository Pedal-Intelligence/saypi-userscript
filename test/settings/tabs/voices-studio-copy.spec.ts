import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Copy contract for the settings Voices studio, asserted against the REAL en
 * locale (the source locale) rather than the test mock, so a re-texted or
 * orphaned key is caught here rather than on a user's screen.
 *
 * Two things this file is really guarding:
 *  - the studio's shelf blurbs are studio-only strings. `hdVoicesAllowanceNote`
 *    is ALSO the HD chip tooltip and Claude's in-chat menu footnote, where no
 *    Everyday shelf sits beside it to carry the ratio — it must keep its text
 *    and its in-chat callers.
 *  - every substituted stage string must exist with a declared `$host$`
 *    placeholder (i18n-validate.cjs enforces the declaration; this pins the
 *    substitution itself, which is what replaceI18n() would otherwise erase).
 */
const root = resolve(__dirname, "../../..");
const en = JSON.parse(
  readFileSync(resolve(root, "_locales/en/messages.json"), "utf8")
);
const controllerSrc = readFileSync(
  resolve(root, "entrypoints/settings/tabs/voices/voices-controller.ts"),
  "utf8"
);
const claudeMenuSrc = readFileSync(
  resolve(root, "src/chatbots/ClaudeVoiceMenu.ts"),
  "utf8"
);

describe("Defect 2 — the empty stage recruits", () => {
  it("has a host-generic imperative headline", () => {
    expect(en.voicesStageEmptyTitle?.message).toBe("Choose how $host$ sounds");
    expect(en.voicesStageEmptyTitle.placeholders?.host?.content).toBe("$1");
  });

  it("has a supporting line for hosts that serve their own audio", () => {
    expect(en.voicesStageEmptyNoteReplace?.message).toBe(
      "$host$ uses its own voice until you pick one below."
    );
    expect(en.voicesStageEmptyNoteReplace.placeholders?.host?.content).toBe("$1");
  });

  it("has a supporting line for hosts with no voice of their own", () => {
    expect(en.voicesStageEmptyNoteSilent?.message).toBe(
      "$host$ won't read replies aloud until you pick one below."
    );
    expect(en.voicesStageEmptyNoteSilent.placeholders?.host?.content).toBe("$1");
  });

  it("ends both supporting lines on the same clause, so the hosts read as one product", () => {
    const tail = "until you pick one below.";
    expect(en.voicesStageEmptyNoteReplace.message.endsWith(tail)).toBe(true);
    expect(en.voicesStageEmptyNoteSilent.message.endsWith(tail)).toBe(true);
  });

  it("retires voicesNoStageVoice — key deleted and nothing references it", () => {
    expect(en.voicesNoStageVoice).toBeUndefined();
    expect(controllerSrc).not.toMatch(/voicesNoStageVoice/);
  });
});

describe("Defect 3 — tier copy: the heading names the tier, the blurb names the benefit", () => {
  it("names the HD tier without an em-dash descriptor", () => {
    expect(en.voicesShelfHd?.message).toBe("HD voices");
  });

  it("leads the HD blurb with sound, never with cost", () => {
    expect(en.voicesShelfHdBlurb?.message).toBe(
      "Our richest, most expressive sound."
    );
    expect(en.voicesShelfHdBlurb.message).not.toMatch(
      /allowance|credit|faster|cost|price/i
    );
    // Substitution-free → data-i18n is safe, so it must declare no placeholder.
    expect(en.voicesShelfHdBlurb.message).not.toMatch(/\$.+\$/);
  });

  it("names the Everyday tier in parallel with HD", () => {
    expect(en.voicesShelfEveryday?.message).toBe("Everyday voices");
  });

  it("states the ratio exactly once, on the side where it is a gain", () => {
    expect(en.voicesShelfEverydayBlurb?.message).toBe(
      "Natural and clear — you can listen about 20× longer than with HD."
    );
    // "Allowance" is the vendor's ledger, not something a listener can picture.
    expect(en.voicesShelfEverydayBlurb.message).not.toMatch(
      /allowance|credit/i
    );
    // The referent stays explicit: a locale reflow (or a single-tier catalog,
    // which collapses the shelves into a flat grid) removes the adjacent shelf.
    expect(en.voicesShelfEverydayBlurb.message).toMatch(/than with HD/);
  });

  it("passes the studio-only blurb keys, not the in-chat allowance footnote", () => {
    // The quoted form is the key being PASSED to renderShelf; the studio may
    // still mention the other key in a comment saying why it isn't reused.
    expect(controllerSrc).toMatch(/"voicesShelfHdBlurb"/);
    expect(controllerSrc).not.toMatch(/"hdVoicesAllowanceNote"/);
  });

  it("leaves hdVoicesAllowanceNote and its in-chat callers untouched", () => {
    expect(en.hdVoicesAllowanceNote?.message).toBe(
      "HD voices use your monthly allowance about 20× faster."
    );
    const callers = claudeMenuSrc.match(/hdVoicesAllowanceNote/g) ?? [];
    expect(callers.length).toBe(2); // HD chip tooltip + menu footnote
  });
});
