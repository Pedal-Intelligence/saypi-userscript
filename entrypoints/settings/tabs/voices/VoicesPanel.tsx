/**
 * Voices-tab panel (Preact).
 *
 * Static skeleton only — VoicesController renders "the rail" (2026-07-31
 * audition-room design) imperatively into the two ids below, so both are
 * load-bearing:
 *  - `#voice-host-switcher` — the two host pills, top-right of the heading row.
 *    A slot rather than a controller-owned row, so the switcher can sit beside
 *    the heading without the controller reaching outside its own container.
 *  - `#voice-studio` — the control bar, the rail itself, and the tail.
 *
 * `#voice-status` is the page's live region. It used to be `aria-live` on
 * `#voice-studio`, which was right for a static catalog and wrong the moment a
 * player runs: every repaint of a 22-row rail would be announced in full. A
 * visually-hidden span announces the one thing worth saying — which voice
 * started playing.
 *
 * The subtitle carries its own class rather than `.description`, which
 * `preferences.css` sets to `display: none` inside a `.user-preference-item`.
 *
 * This tab sits alongside Dictation deliberately: Dictation is voice-in,
 * Voices is voice-out (#471). It is also the destination of the in-page voice
 * menus' "More voices…" doors (openSettings("voices/<host>")), which scope
 * the rail to the host the user came from.
 */
export function VoicesPanel() {
  return (
    <>
      <div class="voice-rail-head">
        <div class="voice-rail-headings">
          <h2 class="panel-heading" data-i18n="voicesSectionTitle">
            Voices
          </h2>
          <p
            class="voice-rail-subtitle"
            data-i18n="voicesSectionDescriptionListen"
          >
            Every voice, deepest to brightest. Listen, then choose.
          </p>
        </div>
        <div id="voice-host-switcher"></div>
      </div>

      <div class="user-preference-item w-full" id="voices-preference">
        <div id="voice-studio"></div>
        <span
          id="voice-status"
          class="voice-visually-hidden"
          role="status"
          aria-live="polite"
        ></span>
      </div>
    </>
  );
}
