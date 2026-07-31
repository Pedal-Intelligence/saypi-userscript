import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Copy contract for the settings Voices rail, asserted against the REAL en
 * locale (the source locale) rather than the test mock, so a re-texted or
 * orphaned key is caught here rather than on a user's screen.
 *
 * Three things this file is really guarding:
 *  - every substituted string the rail renders exists with its `placeholders`
 *    DECLARED (i18n-validate.cjs enforces the declaration; this pins the
 *    substitution itself, which is what replaceI18n() would otherwise erase)
 *    and is phrased to read correctly at 1, because Chrome i18n has no plurals;
 *  - `hdVoicesAllowanceNote` keeps its text and its in-chat callers — the rail
 *    dropped the tier shelves, but that key is ALSO the HD chip tooltip and
 *    Claude's in-chat menu footnote;
 *  - the keys the rail retired are genuinely unreferenced by the controller.
 *    They stay in `messages.json` (31 locales already carry them, and they cost
 *    nothing) but nothing may render them.
 */
const root = resolve(__dirname, "../../..");
const en = JSON.parse(
  readFileSync(resolve(root, "_locales/en/messages.json"), "utf8")
);
const controllerSrc = readFileSync(
  resolve(root, "entrypoints/settings/tabs/voices/voices-controller.ts"),
  "utf8"
);
const panelSrc = readFileSync(
  resolve(root, "entrypoints/settings/tabs/voices/VoicesPanel.tsx"),
  "utf8"
);
const claudeMenuSrc = readFileSync(
  resolve(root, "src/chatbots/ClaudeVoiceMenu.ts"),
  "utf8"
);

/** Every $placeholder$ a message declares, in declared order. */
const placeholderSlots = (key: string): number[] =>
  Object.values(en[key]?.placeholders ?? {}).map((p: any) =>
    Number(String(p.content).slice(1))
  );

describe("the rail says what it is", () => {
  it("invites listening, not browsing", () => {
    expect(en.voicesSectionDescriptionListen?.message).toBe(
      "Every voice, deepest to brightest. Listen, then choose."
    );
    expect(panelSrc).toMatch(/voicesSectionDescriptionListen/);
    // The old catalog subtitle is no longer rendered anywhere on this tab.
    expect(panelSrc).not.toMatch(/"voicesSectionDescription"/);
  });

  it("names the list by the axis it is ordered on", () => {
    expect(en.voicesRailLabel?.message).toBe(
      "Voices, ordered from deepest to brightest"
    );
    expect(en.voicesRailLabel.message).not.toMatch(/\$.+\$/);
  });

  it("states the keyboard in one line, in the order you would learn it", () => {
    expect(en.voicesKeyboardHint?.message).toBe(
      "Space to play · ↑↓ to walk · ⇧Space to switch back"
    );
  });

  it("labels the arming toggle as what it does, not as a mode", () => {
    expect(en.voicesArrowAudition?.message).toBe("Arrow keys play");
  });
});

describe("every substituted string declares its placeholders", () => {
  const substituted = [
    ["voicesYourVoice", 1],
    ["voicesSwitchBackTo", 1],
    ["voicesNoSampleGroup", 1],
    ["voicesNowPlaying", 1],
    ["voicesMenuSummary", 3],
  ] as const;

  it.each(substituted)("%s declares %i placeholder(s), numbered $1..$n", (key, n) => {
    const slots = placeholderSlots(key);
    expect(slots.length, `${key} should declare ${n} placeholders`).toBe(n);
    expect([...slots].sort((a, b) => a - b)).toEqual(
      Array.from({ length: n }, (_, i) => i + 1)
    );
  });

  it("keeps every one of them off a data-i18n element in the controller", () => {
    // replaceI18n() rewrites [data-i18n] textContent from the bare key, which
    // erases substitutions on every subsequent tab load. The controller must
    // therefore never pair a substituted getMessage with setAttribute("data-i18n").
    for (const [key] of substituted) {
      expect(
        controllerSrc,
        `${key} must not be declared as a data-i18n key`
      ).not.toMatch(new RegExp(`"data-i18n",\\s*"${key}"`));
    }
  });
});

describe("counts read correctly at 1 — Chrome i18n has no plural forms", () => {
  it("phrases the no-sample group so one voice is not 'voices'", () => {
    expect(en.voicesNoSampleGroup?.message).toBe("No sample yet ($count$)");
  });

  it("phrases the menu summary around a bare number, not a pluralised noun", () => {
    // "3 of 4 seats" reads at every value, including "1 of 4 seats".
    expect(en.voicesMenuSummary?.message).toBe(
      "$host$'s menu: $used$ of $cap$ seats"
    );
  });
});

describe("the tier shelves are gone, but the allowance note is not", () => {
  it("no longer renders either shelf blurb", () => {
    // Price is the vendor's axis; the rail sorts on the listener's. The keys
    // stay in messages.json (31 locales carry them) but nothing renders them.
    expect(controllerSrc).not.toMatch(/"voicesShelfHdBlurb"/);
    expect(controllerSrc).not.toMatch(/"voicesShelfEverydayBlurb"/);
    expect(controllerSrc).not.toMatch(/"voicesShelfHd"/);
    expect(controllerSrc).not.toMatch(/"voicesShelfEveryday"/);
  });

  it("leaves hdVoicesAllowanceNote and its in-chat callers untouched", () => {
    expect(en.hdVoicesAllowanceNote?.message).toBe(
      "HD voices use your monthly allowance about 20× faster."
    );
    const callers = claudeMenuSrc.match(/hdVoicesAllowanceNote/g) ?? [];
    expect(callers.length).toBe(2); // HD chip tooltip + menu footnote
  });
});

describe("the stage and the slots section are retired", () => {
  const retired = [
    "voicesStagePlay",
    "voicesSpeaksWith",
    "voicesStageEmptyTitle",
    "voicesStageEmptyNoteReplace",
    "voicesStageEmptyNoteSilent",
    "voicesInHostMenu",
    "voicesMenuHint",
  ];

  it.each(retired)("%s is no longer rendered by the controller", (key) => {
    expect(controllerSrc).not.toMatch(new RegExp(`"${key}"`));
  });

  it("keeps the retired keys in the locale — 31 translations, zero cost", () => {
    for (const key of retired) {
      expect(en[key], `${key} should stay in messages.json`).toBeTruthy();
    }
  });

  it("retires voicesNoStageVoice — key deleted and nothing references it", () => {
    expect(en.voicesNoStageVoice).toBeUndefined();
    expect(controllerSrc).not.toMatch(/voicesNoStageVoice/);
  });
});

describe("the strings the rail still reuses, unchanged in 31 locales", () => {
  const reused = [
    "voicesSectionTitle",
    "voicesUseShort",
    "voicesUseOnHost",
    "voicesAddToMenuShort",
    "voicesInMenuShort",
    "voicesAddVoiceToMenu",
    "voicesRemoveVoiceFromMenu",
    "voicesMenuFull",
    "voicesLoadError",
    "voicesNoneAvailable",
    "signInForTTS",
    "voicesBuiltinsNote",
    "voiceSpeaksNLanguages",
  ];

  it.each(reused)("%s is still rendered and still exists", (key) => {
    expect(en[key], `${key} should exist in en`).toBeTruthy();
    expect(
      controllerSrc.includes(`"${key}"`) || panelSrc.includes(`"${key}"`),
      `${key} should still be rendered`
    ).toBe(true);
  });

});

describe("the badge on the current voice says IN USE, not 'Speaking now'", () => {
  it("gets its own key, because the rail's rows literally speak", () => {
    // Design §1 and §11 both draw this badge as `IN USE`. Reusing the shipped
    // `voicesSpeakingNow` was tempting — 31 locales already carry it — but it
    // was written for `.voice-card-state` on a page with no per-row playing
    // state to collide with. On the rail, pressing Space on Onyx would leave
    // the Marin row announcing itself as "Marin — Speaking now" in the accent
    // that means *now*, while `#voice-status` says "Playing Onyx": two rows
    // claiming to speak, one of them silent. At rest — nearly all the time —
    // it would claim speech with nothing playing at all.
    expect(en.voicesInUse?.message).toBe("In use");
    expect(en.voicesInUse.message).not.toMatch(/\$.+\$/);
    expect(controllerSrc).toMatch(/"voicesInUse"/);
    expect(controllerSrc).not.toMatch(/"voicesSpeakingNow"/);
    // The key itself stays in the locale — it costs nothing and 31 locales
    // carry it — it just is not this badge.
    expect(en.voicesSpeakingNow?.message).toBe("Speaking now");
  });
});

describe("a menu-less host gets a note about its own built-ins that is true", () => {
  it("does not promise Pi a menu it retired in 2026 (#573)", () => {
    // The shipped note ends "…always appear in its menu too", written to
    // follow a list of menu slots. Pi has no in-chat voice menu, which is why
    // `vm.menu` is null there and why the same paint renders no pin toggles at
    // all — so the sentence promised a surface that does not exist, and its
    // trailing "too" dangled with nothing above it.
    expect(en.voicesBuiltinsNote?.message).toBe(
      "$host$'s own built-in voices always appear in its menu too."
    );
    expect(en.voicesBuiltinsNoteNoMenu?.message).toBe(
      "$host$ also has its own built-in voices, which aren't listed here."
    );
    expect(en.voicesBuiltinsNoteNoMenu.message).not.toMatch(/menu/i);
    expect(placeholderSlots("voicesBuiltinsNoteNoMenu")).toEqual([1]);
    expect(controllerSrc).not.toMatch(
      /"data-i18n",\s*"voicesBuiltinsNoteNoMenu"/
    );
  });
});

describe("the overflow note comes back, because a pin can outrun its seat", () => {
  it("is rendered again, and is what makes '✓ In menu' honest", () => {
    // A row's pin button is labelled from the PIN, which it has to be — it is
    // the control that flips the pin. But pins can outnumber seats with no
    // user action at all (four server-featured voices plus a current voice
    // that takes the first seat), and then a row reads "✓ In menu" while the
    // summary beneath it lists four other names. This sentence is what closes
    // that gap; it was retired with the slots SECTION, not with its job.
    expect(en.voicesMenuOverflowOne?.message).toBe(
      "1 more pinned voice is waiting beyond the menu's $cap$ slots."
    );
    expect(placeholderSlots("voicesMenuOverflowOne")).toEqual([1]);
    expect(placeholderSlots("voicesMenuOverflow")).toEqual([1, 2]);
    expect(controllerSrc).toMatch(/"voicesMenuOverflowOne"/);
    for (const key of ["voicesMenuOverflow", "voicesMenuOverflowOne"]) {
      expect(controllerSrc).not.toMatch(new RegExp(`"data-i18n",\\s*"${key}"`));
    }
  });
});
