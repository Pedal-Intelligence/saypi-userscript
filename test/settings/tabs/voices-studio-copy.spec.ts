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

  it("states the keyboard as a SENTENCE, not as a cheat sheet", () => {
    // This line is the first thing the eye lands on, and it shipped as
    // `Space to play · ↑↓ to walk · ⇧Space to switch back` — three tokens
    // separated by middots, which is the register of a terminal, and the
    // founder read the page as "cold and intimidating". Same keys, same
    // length, plain verbs, one sentence: second person, warm, calm.
    expect(en.voicesKeyboardHint?.message).toBe(
      "Press Space to listen, ↑↓ to move between voices, ⇧Space to switch back."
    );
    // No jargon: "walk" was a word about the implementation, not about you.
    expect(en.voicesKeyboardHint.message).not.toMatch(/walk|·/);
    // Sentence case — no Title Case, no shouted keys beyond the key names.
    expect(en.voicesKeyboardHint.message).toMatch(/^Press /);
  });

  it("labels the arming toggle in the second person, not as a mode", () => {
    // `Arrow keys play` names the mechanism; `Play as you move` names what
    // happens to YOU, and it reads straight into the hint line beneath it.
    expect(en.voicesArrowAudition?.message).toBe("Play as you move");
    expect(en.voicesArrowAudition.message).not.toMatch(/key|mode|auto/i);
  });
});

describe("every substituted string declares its placeholders", () => {
  const substituted = [
    ["voicesYourVoice", 1],
    ["voicesSwitchBackTo", 1],
    ["voicesNoSampleGroup", 1],
    ["voicesNowPlaying", 1],
    ["voicesMenuSummary", 3],
    ["voicesPlayAllN", 1],
    ["voicesPlayNewN", 1],
    ["voicesHeardCount", 2],
    ["voicesSweepPosition", 2],
    ["voicesSampleFailed", 1],
    ["voicesTooManyToPlay", 2],
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

  it("keeps the sweep's own counts on bare numbers", () => {
    expect(en.voicesPlayAllN?.message).toBe("Play all ($count$)");
    expect(en.voicesPlayNewN?.message).toBe("Play new ($count$)");
    expect(en.voicesSweepPosition?.message).toBe("$index$ of $total$");
  });

  it("phrases the heard counter as a ratio, which reads at every value", () => {
    // "1 of 22 heard" and "22 of 22 heard" are both correct English with no
    // singular twin — which is the whole rule, Chrome i18n having no plurals.
    expect(en.voicesHeardCount?.message).toBe("$heard$ of $total$ heard");
    expect(en.voicesHeardCount.message).not.toMatch(/voices?/i);
  });

  it("abbreviates the refusal's minutes, because 1 is its COMMON case", () => {
    // The refusal only fires above 25 voices, and 26 voices is about one
    // minute — so "$minutes$ minutes" would read wrong far more often than it
    // read right. "min" reads at every value, which is the whole rule.
    expect(en.voicesTooManyToPlay?.message).toBe(
      "That's $count$ voices — about $minutes$ min. Narrow the list first."
    );
    expect(en.voicesTooManyToPlay.message).not.toMatch(/minutes\./);
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

  it("re-homes the note as the HD FILTER's helper line", () => {
    // Same sentence, different job. On the retired shelves it sat above a
    // heading nobody asked for; here it exists only while HD is what you chose
    // to look at, directly under the control that undoes the choice. It takes
    // no substitution, so it keeps its data-i18n and stays translated.
    expect(controllerSrc).toMatch(/"data-i18n",\s*"hdVoicesAllowanceNote"/);
  });
});

describe("the sweep and the filter say what they do", () => {
  it("names the sweep by its outcome, and its stop by the plainest word", () => {
    expect(en.voicesStopPlayback?.message).toBe("Stop");
  });

  it("labels the filter as a verb the list obeys", () => {
    expect(en.voicesShowLabel?.message).toBe("Show");
    expect(en.voicesShowAll?.message).toBe("All voices");
    expect(en.voicesShowUnheard?.message).toBe("Not yet heard");
    expect(en.voicesShowHd?.message).toBe("HD only");
    expect(en.voicesShowEveryday?.message).toBe("Everyday only");
  });

  it("names the heard state by the ear, never by a checkmark", () => {
    // Ink density is the expression (design §8). No string on this page says
    // "played", "listened", "done" or "✓" — the print says it.
    for (const key of ["voicesShowUnheard", "voicesHeardCount"]) {
      expect(en[key].message).not.toMatch(/✓|check|done|complete/i);
    }
    expect(controllerSrc).toMatch(/"voicesShowUnheard"/);
    expect(controllerSrc).toMatch(/"voicesHeardCount"/);
    expect(controllerSrc).toMatch(/"voicesPlayNewN"/);
  });

  it("tells a blocked page what to DO, not what went wrong", () => {
    // Chrome gates media on sticky document activation, so the only useful
    // sentence is the one naming the gesture that lifts the gate.
    expect(en.voicesPlaybackBlocked?.message).toBe(
      "Click any voice to enable sound."
    );
    expect(en.voicesPlaybackBlocked.message).not.toMatch(/error|failed/i);
  });

  it("blames the clip, not the reader, when one sample will not play", () => {
    expect(en.voicesSampleFailed?.message).toBe(
      "Couldn't play $name$'s sample."
    );
  });

  it("keeps every one of the new substituted strings off data-i18n", () => {
    for (const key of [
      "voicesPlayAllN",
      "voicesSweepPosition",
      "voicesSampleFailed",
      "voicesTooManyToPlay",
    ]) {
      expect(controllerSrc).not.toMatch(new RegExp(`"data-i18n",\\s*"${key}"`));
    }
    // …and the ones that take no substitution KEEP theirs, or they would stop
    // being translated the moment the tab is loaded a second time. (The hint
    // line carries its key through `hintLine()`'s `i18nKey`, which is why
    // voicesPlaybackBlocked is asserted on the DOM in voices-controller.spec
    // rather than on the source text here.)
    expect(controllerSrc).toMatch(/"data-i18n",\s*"voicesStopPlayback"/);
    expect(controllerSrc).toMatch(/i18nKey:\s*"voicesPlaybackBlocked"/);
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

describe("the two things the ink cannot say out loud", () => {
  it("names the heard state in the page's own word, not a checkmark", () => {
    // The rail's visual expression of "you have heard this" is ink density,
    // which a screen reader cannot see. The accessible name has to say it, and
    // the word is the one the filter already uses ("Not yet heard") — not
    // "played", not "done", and never a ✓.
    expect(en.voicesHeardMark?.message).toBe("Heard");
    expect(en.voicesHeardMark.message).not.toMatch(/✓|check|done|complete/i);
    expect(controllerSrc).toMatch(/"voicesHeardMark"/);
  });

  it("confirms the arrows going live in one short sentence, with its way out", () => {
    // Echoes the chip's own label ("Play as you move") so the confirmation and
    // the control that undoes it use the same words, and names Esc, because a
    // rail that has just become audible needs an exit more than an explanation.
    expect(en.voicesArrowsLive?.message).toBe(
      "Arrows now play as you move. Esc stops."
    );
    expect(en.voicesArrowsLive.message).not.toMatch(/\$.+\$/);
    expect(controllerSrc).toMatch(/"voicesArrowsLive"/);
  });

  it("puts HD's cost where the choice is made, not only where HD is filtered", () => {
    // Same sentence as the HD filter's helper line and Claude's in-chat chip
    // tooltip. It reaches assistive tech as a DESCRIPTION — spoken after the
    // name, which is what makes it secondary rather than a headline.
    expect(controllerSrc).toMatch(/voice-hd-note/);
    expect(controllerSrc).toMatch(/aria-describedby/);
  });
});
