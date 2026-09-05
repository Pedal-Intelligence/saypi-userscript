import { test, expect } from "../fixtures/extension";
import {
  EXPECTED_RAIL_ORDER,
  MOCK_VOICE_IDS,
} from "../support/voice-catalog";
import {
  AUDITIONABLE_COUNT,
  INFLATION_MARK,
  RAIL_ROW_COUNT,
  cursorVoiceId,
  firstVoicesToSound,
  inflateVoicesCopy,
  openVoicesRail,
  railHasDomFocus,
  railOrder,
  recordPlayback,
  seedConsentDecision,
  widenGlyphs,
} from "../support/voices";

/**
 * Settings → Voices: the audition room, end to end.
 *
 * Why here and not at Layer 1/2. The rail already has ~2650 unit and contract
 * tests, and every one of them stops at the browser's edge. What this page IS —
 * a chart you listen to — lives entirely on the far side of that edge: real
 * DOM focus moving between a sidebar button and a listbox, `decodeAudioData`
 * over a real MP3 deciding what order the rows go in, an `<audio>` element
 * getting far enough through a clip to count as heard, and laid-out geometry
 * agreeing across seven rows. jsdom has no layout, no audio and no media
 * element; it can prove the arithmetic and not one of the claims above.
 *
 * The specs are chosen by the same test: would deleting the code each one
 * guards turn it red? The arming rule, the focus claim, the shared reference
 * line and the heard counter's denominator are all things a well-meaning
 * refactor can quietly break while every unit test stays green, which is
 * exactly the gap this file exists to close.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHAT THIS FILE CANNOT PROVE: STICKY AUTOPLAY ACTIVATION.
 *
 * `e2e/fixtures/launch-args.ts` hands every Layer-3 Chrome
 * `--autoplay-policy=no-user-gesture-required`. So programmatic `play()` is
 * licensed here no matter what gesture did or did not precede it, and any
 * assertion of the form "chained playback works, therefore the page satisfies
 * the autoplay policy" is a guaranteed false pass. `Play all` and the armed
 * arrow walk are tested below for what they DO — which voices sound, and in
 * what order — never for being permitted to. Whether a real browser licenses
 * them remains a real-browser gap (design doc §8, "designed around, not
 * verified"). Do not add an assertion here that claims otherwise.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Determinism rules for anything added here: prints resolve behind an
 * IntersectionObserver and a re-sort on a macrotask, so wait on stated
 * conditions (`openVoicesRail`, the play log, a counter's text) and never on a
 * duration. A fixed sleep in this file is a flake with a delay fuse.
 */

const ROW = (voiceId: string) => `#tab-voices .voice-row[data-voice-id="${voiceId}"]`;

test.describe("settings → voices: the audition room", () => {
  /**
   * The design's headline claim, which is also the one that was wrong for a
   * while and looked right the whole time.
   *
   * The rail draws everything that LOOKS like focus from its first paint — a
   * roving `aria-activedescendant`, a `.focused` row, `tabIndex = 0` — while
   * real DOM focus sits on the sidebar button that opened the tab, because an
   * inactive panel is `display: none` and a class-toggling tab switcher moves
   * focus nowhere. `Space` then activates the button and nothing sounds. Only
   * a real browser can tell those two states apart.
   *
   * So the assertion is deliberately not a class: it is the heard counter. The
   * sequencer only marks a voice heard once playback passes a real threshold
   * (`ended`, or 0.65 × duration capped at 1.4 s), so `0 of 6` → `1 of 6` is
   * the page's own testimony that audio actually sounded — not that a click
   * handler ran.
   */
  test("arriving on the tab hands the rail the keyboard, and Space alone sounds a voice", async ({
    context,
    extensionId,
    serviceWorker,
  }) => {
    await seedConsentDecision(serviceWorker);
    const page = await context.newPage();
    await openVoicesRail(page, extensionId);

    expect(
      await railHasDomFocus(page),
      "the rail should hold DOM focus on arrival — if the sidebar button kept it, Space activates the button and the page's headline gesture is a no-op",
    ).toBe(true);
    const landedOn = await cursorVoiceId(page);
    expect(landedOn).not.toBeNull();

    const counter = page.locator(".voice-heard-count");
    await expect(counter).toHaveText(`0 of ${AUDITIONABLE_COUNT} heard`);

    // The whole gesture: one key, no click, no focusing, no scrolling.
    await page.keyboard.press("Space");

    await expect(
      counter,
      "Space on arrival must play the row the cursor is on, for long enough to count as heard",
    ).toHaveText(`1 of ${AUDITIONABLE_COUNT} heard`, { timeout: 20_000 });
    // …and it must be the voice under the cursor, not merely some voice.
    await expect(page.locator(`${ROW(landedOn!)}.heard`)).toHaveCount(1);

    await page.close();
  });

  /**
   * The arming rule, both halves — the single rule that keeps this page from
   * making noise at people.
   *
   * Arrow keys move focus silently until the reader has explicitly played
   * something; after that they audition as they go. Half of that is a negative,
   * and a negative about sound is untestable by inspection: a clip that never
   * started and a clip that finished leave the same DOM. So playback is
   * RECORDED, the arrows are walked, and then an explicit `Space` gives the log
   * its first entry — which pins the negative to a real event instead of to a
   * timeout. If arming broke, the walk's own auditions would already be sitting
   * in front of it.
   *
   * Easy to break while "improving" focus handling, and silent when broken in
   * the direction that matters: a rail that armed itself on arrival would sound
   * fine to whoever changed it and ambush everyone else.
   */
  test("arrows are silent until you have played something, and audible after", async ({
    context,
    extensionId,
    serviceWorker,
  }) => {
    await seedConsentDecision(serviceWorker);
    const page = await context.newPage();
    await openVoicesRail(page, extensionId);
    await recordPlayback(page);

    const start = await cursorVoiceId(page);
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");

    // The arrows genuinely moved — otherwise "silent" would be trivially true.
    const walkedTo = await cursorVoiceId(page);
    expect(walkedTo).not.toBe(start);
    await expect(page.locator(".voice-heard-count")).toHaveText(
      `0 of ${AUDITIONABLE_COUNT} heard`,
    );

    await page.keyboard.press("Space");
    await expect
      .poll(() => firstVoicesToSound(page, 1), {
        message:
          "the FIRST thing ever to sound must be the voice the reader pressed Space on — anything before it is the walk auditioning unbidden",
        timeout: 15_000,
      })
      .toEqual([walkedTo]);

    // Second half: the same key, now armed, must audition.
    const order = await railOrder(page);
    const next = order[order.indexOf(walkedTo!) + 1];
    await page.keyboard.press("ArrowDown");
    await expect
      .poll(() => firstVoicesToSound(page, 2), {
        message: "once armed, walking the rail must play what it lands on",
        timeout: 15_000,
      })
      .toEqual([walkedTo, next]);

    await page.close();
  });

  /**
   * The chart, which is the page's one non-negotiable premise.
   *
   * Two facts have to hold together. The rows ascend deepest to brightest by
   * MEASURED pitch — the catalog is served deliberately unsorted, and two of
   * the six voices carry ids the build-time pitch seed has never seen, so
   * nothing but a real decode in a real `OfflineAudioContext` can place them.
   * And every print draws its reference line at the same height in its row, so
   * the six traces register into one picture instead of six unrelated ones.
   *
   * Neither is worth much alone. A shared line across six identical prints
   * proves nothing, and an order assertion alone can be satisfied by a lookup
   * table. Together — the line pinned, the traces spread, the spread ordered —
   * they are the chart. If it drifts, the design fails silently and the page
   * merely looks untidy, which is exactly the kind of regression nobody files.
   */
  test("the rail is one chart: rows ordered by measured pitch, all on a shared reference line", async ({
    context,
    extensionId,
    serviceWorker,
  }) => {
    await seedConsentDecision(serviceWorker);
    const page = await context.newPage();
    await openVoicesRail(page, extensionId);

    expect(await railOrder(page)).toEqual(EXPECTED_RAIL_ORDER);

    // Geometry is read from laid-out boxes, not attributes: an attribute says
    // what was asked for, a box says what the browser actually drew.
    const prints = await page.evaluate(() =>
      [
        ...document.querySelectorAll<HTMLElement>(
          "#tab-voices .voice-row[data-print-voice]",
        ),
      ].map((row) => {
        const rowTop = row.getBoundingClientRect().top;
        const centreY = (el: Element) => {
          const box = el.getBoundingClientRect();
          return box.top + box.height / 2 - rowTop;
        };
        const bars = [...row.querySelectorAll(".voice-print-trace > *")];
        return {
          voiceId: row.dataset.voiceId ?? "",
          referenceY: centreY(row.querySelector(".voice-print-ref")!),
          // Where the trace sits on the shared frequency axis: the whole point
          // of the axis is that this number means the same thing on every row.
          traceY: bars.reduce((sum, bar) => sum + centreY(bar), 0) / bars.length,
        };
      }),
    );
    expect(prints).toHaveLength(AUDITIONABLE_COUNT);

    const referenceYs = prints.map((p) => p.referenceY);
    for (const print of prints) {
      expect(
        print.referenceY,
        `${print.voiceId} draws the reference line at a different height from the rest — the traces no longer register into one chart`,
      ).toBeCloseTo(referenceYs[0], 1);
    }

    // The traces, by contrast, must NOT agree — and must disagree in rail
    // order, brighter voices sitting higher (smaller y). Ties are expected and
    // correct: three clips across six voices, each shared by a seeded voice and
    // an unseeded one that had to be measured into place beside it.
    const traceYs = prints.map((p) => p.traceY);
    for (let i = 1; i < traceYs.length; i++) {
      expect(
        traceYs[i],
        `${prints[i].voiceId} draws lower than ${prints[i - 1].voiceId}, which is above it on a rail sorted deepest to brightest`,
      ).toBeLessThanOrEqual(traceYs[i - 1] + 0.5);
    }
    expect(
      Math.max(...traceYs) - Math.min(...traceYs),
      "every trace at the same height means the shared reference line is shared trivially — the chart has no pitch spread to register",
    ).toBeGreaterThan(4);

    await page.close();
  });

  /**
   * What the rail says when nobody is touching it.
   *
   * Two rows are both called Paola and differ only in how many languages they
   * speak — the case that has regressed twice (#474) — and a disambiguator that
   * hides does not disambiguate. Every other row's description is revealed on
   * focus and hidden at rest, so the twins' being visible is only meaningful
   * against that: the assertion checks both sides of the exception.
   *
   * And nothing may be cut off. The description column is the rail's elastic
   * middle, so anything added to the right of it (the IN USE badge did exactly
   * this once) steals from the descriptions and ellipsises them, which is a
   * regression you can only see by rendering. Measured headroom on the shipped
   * layout is 70–92 px on a 198–227 px column, so this has room for a wider
   * font on a CI runner without room for a narrower column.
   */
  test("at rest the twins stay apart and no description is cut off", async ({
    context,
    extensionId,
    serviceWorker,
  }) => {
    await seedConsentDecision(serviceWorker);
    const page = await context.newPage();
    const pageErrors: Error[] = [];
    page.on("pageerror", (error) => pageErrors.push(error));
    await openVoicesRail(page, extensionId);

    const descriptions = await page.evaluate(() =>
      [
        ...document.querySelectorAll<HTMLElement>("#tab-voices .voice-row"),
      ].map((row) => {
        const desc = row.querySelector<HTMLElement>(".voice-row-desc")!;
        return {
          voiceId: row.dataset.voiceId ?? "",
          name: row.querySelector(".voice-row-name")?.textContent ?? "",
          text: desc.textContent ?? "",
          // Not `.focused`, not hovered: the resting state, which is what the
          // twins' exception is an exception TO.
          visible: getComputedStyle(desc).opacity === "1",
          atRest: !row.classList.contains("focused"),
          truncated: desc.scrollWidth > desc.clientWidth,
        };
      }),
    );

    const twins = descriptions.filter((d) => d.name === "Paola");
    expect(twins).toHaveLength(2);
    for (const twin of twins) {
      expect(twin.atRest).toBe(true);
      expect(
        twin.visible,
        `the Paola rows are indistinguishable unless their subtitles show at rest (${twin.voiceId})`,
      ).toBe(true);
      expect(twin.text).not.toBe("");
    }
    expect(
      twins[0].text,
      "both twins say the same thing, so the rail no longer tells them apart",
    ).not.toBe(twins[1].text);

    // The other half of the rule: everyone else stays quiet until focused.
    const quiet = descriptions.filter((d) => d.name !== "Paola" && d.atRest);
    expect(quiet.length).toBeGreaterThan(0);
    for (const row of quiet) {
      expect(
        row.visible,
        `${row.name}'s description is showing at rest — the calm resting state is the reason the twins' exception means anything`,
      ).toBe(false);
    }

    const truncated = descriptions.filter((d) => d.truncated);
    expect(
      truncated.map((d) => `${d.name}: ${d.text}`),
      "a description is ellipsised — something to the right of it has taken the column's slack",
    ).toEqual([]);
    for (const row of descriptions) {
      expect(row.text, `${row.name} has no description at all`).not.toBe("");
    }

    expect(
      pageErrors.map((error) => error.message),
      "uncaught errors while the rail resolved",
    ).toEqual([]);

    await page.close();
  });

  /**
   * The same page on a 390px phone, where it has to say all of that in half
   * the width.
   *
   * `settings-layout.e2e.ts` guards the arithmetic — nothing overflows — and
   * arithmetic alone can be satisfied by a layout that has stopped meaning
   * anything: descriptions clipped to a floor, or every print shrunk by a
   * different amount because each row negotiated its own. Both were true here
   * before the row learned to take a second line, and both are invisible to an
   * overflow assertion.
   *
   * So this asserts what the narrow rail still SAYS. The twins are the point —
   * two rows both reading `Paola`, told apart by a subtitle that must be whole
   * and on screen at rest, which is the regression this page has had twice
   * (#474) and the reason the description is the one column that never yields.
   * The shared reference line is the other point: one width for every print and
   * one y for every line, or the traces stop registering into a single chart
   * and the rail is 22 unrelated pictures.
   */
  for (const face of ["system", "wide"] as const) {
    test(`at 390px the twins are still legible and the chart is still one chart (${face} face)`, async ({
      context,
      extensionId,
      serviceWorker,
    }) => {
      await seedConsentDecision(serviceWorker);
      const page = await context.newPage();
      await openVoicesRail(page, extensionId);
      await page.setViewportSize({ width: 390, height: 844 });
      // A wider installed face reproduces CI glyph metrics on the author’s Mac.
      // Keep the ordinary face too: both must preserve every description.
      if (face === "wide") await widenGlyphs(page);

      const rail = await page.evaluate(() =>
        [
          ...document.querySelectorAll<HTMLElement>(
            "#tab-voices .voice-row[data-print-voice]",
          ),
        ].map((row) => {
          const desc = row.querySelector<HTMLElement>(".voice-row-desc")!;
          const print = row.querySelector<HTMLElement>(".voice-print")!;
          const ref = row.querySelector<HTMLElement>(".voice-print-ref")!;
          return {
            name: row.querySelector(".voice-row-name")?.textContent ?? "",
            text: desc.textContent ?? "",
            shownAtRest:
              getComputedStyle(desc).opacity === "1" &&
              !row.classList.contains("focused"),
            clipped: desc.scrollWidth > desc.clientWidth,
            clippedVertically:
              desc.scrollHeight > desc.clientHeight ||
              desc.getBoundingClientRect().bottom > row.getBoundingClientRect().bottom,
            descriptionWidth: desc.clientWidth,
            textWidth: desc.scrollWidth,
            font: getComputedStyle(desc).font,
            whiteSpace: getComputedStyle(desc).whiteSpace,
            printWidth: Math.round(print.getBoundingClientRect().width),
            referenceY: +(
              ref.getBoundingClientRect().top - row.getBoundingClientRect().top
            ).toFixed(1),
          };
        }),
      );
      await test.info().attach(`390px-${face}-geometry`, {
        body: JSON.stringify(rail, null, 2),
        contentType: "application/json",
      });
      expect(rail.length).toBe(AUDITIONABLE_COUNT);

      const twins = rail.filter((row) => row.name === "Paola");
      expect(twins).toHaveLength(2);
      for (const twin of twins) {
        expect(
          twin.shownAtRest,
          `the narrow rail hides ${twin.name}'s disambiguator until focus — two rows now read the same`,
        ).toBe(true);
        expect(
          twin.clipped,
          `"${twin.text}" is ellipsised at 390px, which is the twins told apart by an ellipsis`,
        ).toBe(false);
      }
      expect(twins[0].text).not.toBe(twins[1].text);
      // Not just the twins: at this width no tagline should have to give.
      expect(
        rail.filter((row) => row.clipped).map((row) => row.text),
        "a description is ellipsised at 390px — the description is the column that must not yield",
      ).toEqual([]);

      expect(
        rail.filter((row) => row.clippedVertically).map((row) => row.text),
        "a wrapped description is cut off below the row at 390px",
      ).toEqual([]);

      expect(
        [...new Set(rail.map((row) => row.printWidth))],
        "the prints are not all one width, so trace length no longer means clip length",
      ).toHaveLength(1);
      expect(
        [...new Set(rail.map((row) => row.referenceY))],
        "the reference line sits at a different height on different rows — the traces no longer register into one chart",
      ).toHaveLength(1);

      const rowan = page.locator(ROW(MOCK_VOICE_IDS.rowan));
      await rowan.hover();
      await expect(rowan.locator(".voice-row-desc")).toHaveCSS("opacity", "1");
      const screenshot = test.info().outputPath(`voices-390-${face}.png`);
      await page.screenshot({ path: screenshot, fullPage: true });
      await test.info().attach(`390px-${face}-readable-description`, {
        path: screenshot,
        contentType: "image/png",
      });
      await page.close();
    });
  }

  /**
   * 320px — the narrowest width anything ships at — where the twins were still
   * being cut.
   *
   * The spec above proves the narrow layout at 390px, which is where the design
   * was drawn and where the description comfortably clears its text. 320px is
   * 70px narrower and the arithmetic runs out: line two is the description
   * beside a 108px reservation for the actions, so a 249px rail leaves the
   * description 104px, and `Speaks 33 languages` wants 121 of them. Measured on
   * the author's own machine, in English, in SF Pro — 17px short. On a runner's
   * wider face, or in any of the ~30 locales this string is about to be
   * translated into, further short.
   *
   * A tagline losing its last word there is the yield order working as
   * designed. The twins' disambiguator is the one line that may not, because it
   * is the ENTIRE difference between two rows that otherwise both read `Paola`
   * (#474) — an ellipsis there is the same broken page as no subtitle at all.
   *
   * So the twins wrap rather than ellipsise, and this asserts the property
   * rather than the pixel count: wrapped text has no truncation to measure at
   * any width, in any face, in any locale, which is what makes this the last
   * time this regression can happen. It is checked in BOTH directions —
   * scrollWidth for a horizontal cut, scrollHeight for a wrapped line clipped
   * off the bottom — because a wrap that overflows a fixed row height is the
   * same information lost by a different mechanism.
   */
  test("at 320px the twins wrap rather than lose a word", async ({
    context,
    extensionId,
    serviceWorker,
  }) => {
    await seedConsentDecision(serviceWorker);
    const page = await context.newPage();
    await openVoicesRail(page, extensionId);
    await page.setViewportSize({ width: 320, height: 844 });

    const rows = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>("#tab-voices .voice-row")].map(
        (row) => {
          const desc = row.querySelector<HTMLElement>(".voice-row-desc")!;
          return {
            name: row.querySelector(".voice-row-name")?.textContent ?? "",
            twin: desc.classList.contains("voice-row-desc-dup"),
            text: desc.textContent ?? "",
            shownAtRest:
              getComputedStyle(desc).opacity === "1" &&
              !row.classList.contains("focused"),
            cutSideways: desc.scrollWidth - desc.clientWidth,
            cutOffBottom: desc.scrollHeight - desc.clientHeight,
          };
        },
      ),
    );

    const twins = rows.filter((row) => row.twin);
    expect(twins).toHaveLength(2);
    expect(twins.map((twin) => twin.name)).toEqual(["Paola", "Paola"]);
    for (const twin of twins) {
      expect(
        twin.shownAtRest,
        `${twin.text} is hidden at rest at 320px — two rows now both read Paola`,
      ).toBe(true);
      expect(
        twin.cutSideways,
        `"${twin.text}" is ellipsised by ${twin.cutSideways}px at 320px — the twins told apart by an ellipsis`,
      ).toBeLessThanOrEqual(0);
      expect(
        twin.cutOffBottom,
        `"${twin.text}" wraps to a line that is clipped off the bottom of the row at 320px`,
      ).toBeLessThanOrEqual(0);
    }
    expect(twins[0].text).not.toBe(twins[1].text);

    await page.close();
  });

  /**
   * The same page in a language it has not been translated into yet, drawn in
   * a face its author does not have.
   *
   * `settings-layout.e2e.ts` asks whether the page fits today, in English, in
   * whatever font this machine happens to resolve `system-ui` to. That is a
   * measurement of one build on one box, and it went red exactly that way: 27px
   * of horizontal scroll on the Linux CI runner, 0px on the author's Mac, off
   * the same commit — the keyboard hint was a single `white-space: nowrap`
   * line, and the runner's system font draws it wider. Shaving 27px off the
   * layout would have bought a fix good until the next runner image, and none
   * at all for the ~30 locales this copy is about to be translated into, some
   * of them 40% longer than English.
   *
   * So this asks the structural question instead: with every string in the pane
   * 40% longer and every glyph wider, does the page still refuse to scroll
   * sideways — at seventeen widths from a desktop window down to a small
   * phone? It can only answer yes if nothing outside the rail exports an
   * intrinsic width, which is a property of the stylesheet rather than of these
   * particular strings, so it holds for strings nobody has written yet.
   *
   * Why the page and not the pane is measured: the settings shell hands the
   * pane's demand straight to the document. `.content` is `flex: 1` with
   * `width: 504px`, so its automatic minimum size is `min(504px, its contents'
   * min-content)` — one unbreakable line in here becomes the column's floor,
   * and the column plus the sidebar becomes wider than the window. The final
   * assertion names that mechanism directly, so a future failure says *which*
   * of the two is wrong.
   */
  test("no locale can push the rail off the page: 40 %-longer copy in a wider face", async ({
    context,
    extensionId,
    serviceWorker,
  }) => {
    await seedConsentDecision(serviceWorker);
    const page = await context.newPage();
    await inflateVoicesCopy(page);
    await openVoicesRail(page, extensionId);
    await widenGlyphs(page);

    // Commit a voice first, and an HD one, so the widest row the rail can draw
    // is on screen: print, name, `HD` chip AND the `In use` badge, all of it in
    // the longer locale. That badge is not a hypothetical — adding it is what
    // stole the description's column once already.
    const current = page.locator(ROW(MOCK_VOICE_IDS.addison));
    await current.hover();
    await current.locator(".voice-use").click();
    await expect(page.locator(".voice-row-inuse")).toHaveCount(1);
    // Off the rail again: "at rest" has to mean at rest for the twins below.
    await page.mouse.move(0, 0);

    // Guard the guard: if the i18n stub ever stops landing (a bundler change,
    // a getMessage wrapper, a renamed key prefix), every assertion below passes
    // for the wrong reason and this file quietly stops testing anything.
    const hint = await page.locator(".voice-rail-hint").innerText();
    expect(
      hint,
      "the inflated locale never reached the page — this test would pass on plain English",
    ).toContain(INFLATION_MARK.slice(0, 6));

    // Both layouts (desktop ≥736px, mobile ≤735px), both container steps the
    // row takes (648, 608, 404), and the boundaries between them.
    //
    // 665–730 is in here for a reason that cost a re-run to find: it is the
    // band where the mobile shell gives the rail 609–649px, which is the ONE
    // line-layout width that has to draw a full set of badges without the extra
    // print step (648) and without the second line (608). Sampling only round
    // numbers walked straight over it — 700px was green while 680px and 720px
    // were drawing the `Use` button 20px outside the card.
    const WIDTHS = [
      1280, 1100, 1000, 900, 800, 760, 736, 735, 730, 720, 705, 700, 690, 680,
      670, 665, 660, 640, 608, 500, 440, 390, 360, 320,
    ];
    for (const width of WIDTHS) {
      await page.setViewportSize({ width, height: 844 });
      const geometry = await page.evaluate(() => {
        const rail = document
          .querySelector(".voice-rail")!
          .getBoundingClientRect();
        return {
          overflow:
            document.body.scrollWidth - document.documentElement.clientWidth,
          // The rail is a query container, so a row that outgrows it may not
          // show up in the page's scroll width at all — it would just paint
          // over the card's edge. Ask the rows directly.
          spilling: [
            ...new Set(
              [...document.querySelectorAll("#tab-voices .voice-row *")]
                .filter((el) => el.getBoundingClientRect().right > rail.right + 0.5)
                .map((el) => (el.className || "").toString().split(" ")[0]),
            ),
          ],
          // The twins, at EVERY width rather than only at the last one. Their
          // disambiguator wraps instead of ellipsising, and a wrap has its own
          // way of losing a word: a second line that does not fit the row it is
          // in. Both directions, on both layouts — the narrow row grows to fit
          // its lines, the one-line row does not and has 42px to spend.
          twinsCut: [
            ...document.querySelectorAll<HTMLElement>("#tab-voices .voice-row"),
          ]
            .map((row) => row.querySelector<HTMLElement>(".voice-row-desc")!)
            .filter((desc) => desc.classList.contains("voice-row-desc-dup"))
            .map((desc) => ({
              text: desc.textContent ?? "",
              sideways: desc.scrollWidth - desc.clientWidth,
              bottom: desc.scrollHeight - desc.clientHeight,
              // Wrapping inside a row whose height is FIXED is how a twin
              // could stay un-truncated by its own measurements and still be
              // drawn over its neighbour.
              escapesRow: +(
                desc.getBoundingClientRect().bottom -
                desc.closest(".voice-row")!.getBoundingClientRect().bottom
              ).toFixed(1),
            })),
        };
      });
      expect(
        geometry.overflow,
        `${geometry.overflow}px of horizontal scroll at ${width}px — a string in the Voices pane is wider than it can shrink`,
      ).toBeLessThanOrEqual(0);
      expect(
        geometry.spilling,
        `at ${width}px these are drawn past the rail's right edge`,
      ).toEqual([]);
      expect(geometry.twinsCut).toHaveLength(2);
      for (const twin of geometry.twinsCut) {
        expect(
          Math.max(twin.sideways, twin.bottom, twin.escapesRow),
          `at ${width}px the twins' disambiguator "${twin.text}" is not drawn whole inside its row: ${JSON.stringify(twin)}`,
        ).toBeLessThanOrEqual(0);
      }
    }

    // The twins are the one thing that must not be what yields (#474), and
    // "must not" here is unconditional: at the narrowest width, in the longest
    // locale, in the widest face. A tagline losing its last word is the yield
    // order working; a disambiguator losing its last word is two rows that both
    // read `Paola`, which is not a narrower page but a broken one. They are the
    // one line on the rail that wraps rather than ellipsises, so there is no
    // width at which this can come down to a pixel count.
    const twins = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>("#tab-voices .voice-row")]
        .filter(
          (row) => row.querySelector(".voice-row-name")?.textContent === "Paola",
        )
        .map((row) => {
          const desc = row.querySelector<HTMLElement>(".voice-row-desc")!;
          return {
            text: desc.textContent ?? "",
            shownAtRest:
              getComputedStyle(desc).opacity === "1" &&
              !row.classList.contains("focused"),
            width: Math.round(desc.getBoundingClientRect().width),
            cutSideways: desc.scrollWidth - desc.clientWidth,
            cutOffBottom: desc.scrollHeight - desc.clientHeight,
          };
        }),
    );
    expect(twins).toHaveLength(2);
    for (const twin of twins) {
      expect(
        twin.shownAtRest,
        "a longer locale hid the twins' disambiguator — two rows now both read Paola",
      ).toBe(true);
      expect(twin.width).toBeGreaterThan(0);
      expect(
        twin.cutSideways,
        `"${twin.text}" is ellipsised by ${twin.cutSideways}px at 320px in a 40 %-longer locale — the twins told apart by an ellipsis`,
      ).toBeLessThanOrEqual(0);
      expect(
        twin.cutOffBottom,
        `"${twin.text}" wraps to a line clipped off the bottom of its row at 320px in a 40 %-longer locale`,
      ).toBeLessThanOrEqual(0);
    }
    expect(twins[0].text).not.toBe(twins[1].text);

    // …and the mechanism, stated as an invariant rather than as an outcome:
    // whatever this pane's strings are, its min-content width fits the column
    // it was given. Measured at the narrowest viewport, where the column is
    // smallest and the demand is therefore hardest to meet.
    const intrinsic = await page.evaluate(() => {
      const pane = document.querySelector("#tab-voices") as HTMLElement;
      const column = pane.getBoundingClientRect().width;
      const declared = pane.style.width;
      pane.style.width = "min-content";
      const minContent = pane.getBoundingClientRect().width;
      pane.style.width = declared;
      return { column: Math.round(column), minContent: Math.round(minContent) };
    });
    expect(
      intrinsic.minContent,
      `the Voices pane demands ${intrinsic.minContent}px of the ${intrinsic.column}px column it has — it is exporting an intrinsic width, which the settings shell turns into page-wide horizontal scroll`,
    ).toBeLessThanOrEqual(intrinsic.column);

    await page.close();
  });

  /**
   * The voice with no clip.
   *
   * It is a real voice you can still choose, so it renders — below the rule, in
   * its own group, with no print and no play affordance. What matters is that
   * it is invisible to arithmetic: seven rows, six of them auditionable, and
   * every counter on the bar reads six. Fold it in and `N of M heard` becomes
   * unreachable at the top end and the page quietly lies about your progress.
   */
  test("a voice with no clip is listed, but never counted", async ({
    context,
    extensionId,
    serviceWorker,
  }) => {
    await seedConsentDecision(serviceWorker);
    const page = await context.newPage();
    await openVoicesRail(page, extensionId);

    const clipless = page.locator(ROW(MOCK_VOICE_IDS.nimbus));
    await expect(clipless).toBeVisible();
    await expect(page.locator("#tab-voices .voice-row")).toHaveCount(
      RAIL_ROW_COUNT,
    );
    await expect(page.locator(".voice-rail-group-label")).toHaveText(
      "No sample yet (1)",
    );
    // No print, and nothing that reads as "this row plays".
    expect(
      await clipless.evaluate((row) => ({
        printable: row.hasAttribute("data-print-voice"),
        bars: row.querySelectorAll(".voice-print-trace > *").length,
        belowTheRule: !!row.previousElementSibling?.classList.contains(
          "voice-rail-divider",
        ),
      })),
    ).toEqual({ printable: false, bars: 0, belowTheRule: true });

    // The arithmetic, which is the part that can lie.
    await expect(page.locator(".voice-heard-count")).toHaveText(
      `0 of ${AUDITIONABLE_COUNT} heard`,
    );
    await expect(page.locator(".voice-play-label")).toHaveText(
      `Play all (${AUDITIONABLE_COUNT})`,
    );

    await page.close();
  });

  /**
   * `Play all` walks the rail — more than one voice, in rail order, with the
   * position readout keeping up.
   *
   * One voice playing would also be "a button that works"; the feature is the
   * queue. Two distinct voices plus a position readout past 1 is the smallest
   * evidence that a sequence is actually advancing rather than a single clip
   * having started. It is stopped as soon as that is proven — the point is the
   * walk, not sitting through six clips.
   *
   * (Read the autoplay note at the top of this file before adding anything
   * here. That chained playback is PERMITTED in this harness is a launch flag,
   * not a finding.)
   */
  test("Play all walks more than one voice", async ({
    context,
    extensionId,
    serviceWorker,
  }) => {
    await seedConsentDecision(serviceWorker);
    const page = await context.newPage();
    await openVoicesRail(page, extensionId);
    await recordPlayback(page);

    const order = await railOrder(page);
    await page.locator(".voice-play-all").click();

    await expect
      .poll(() => firstVoicesToSound(page, 2), {
        message:
          "Play all must walk the rail from its deepest voice, in the order the rail is drawn — one voice sounding is a button that works, not a queue that advances",
        timeout: 15_000,
      })
      .toEqual([order[0], order[1]]);

    const position = await page
      .locator(".voice-sweep-position")
      .textContent();
    const [index, total] = (position ?? "").match(/\d+/g)?.map(Number) ?? [];
    expect(total).toBe(AUDITIONABLE_COUNT);
    expect(
      index,
      "the position readout has not moved off the first voice while a second one is sounding",
    ).toBeGreaterThanOrEqual(2);

    // Esc is the design's stop-from-anywhere; leaving a queue running into a
    // closing page is exactly the unattended audio the page rules out.
    await page.keyboard.press("Escape");
    await expect(page.locator(".voice-play-label")).toHaveText(
      /Play (all|new)/,
    );

    await page.close();
  });
});
