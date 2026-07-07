/**
 * Voices-tab panel (Preact).
 *
 * Static skeleton only — VoicesController renders the host-scoped "studio"
 * (host switcher → stage → menu slots → explore shelves) into #voice-studio
 * after mount, so that id is load-bearing (the 2026-07-07 Host Studio
 * redesign — doc/plans/2026-07-07-voices-host-studio-design.md).
 *
 * This tab sits alongside Dictation deliberately: Dictation is voice-in,
 * Voices is voice-out (#471). It is also the destination of the in-page voice
 * menus' "More voices…" doors (openSettings("voices/<host>")), which scope
 * the studio to the host the user came from.
 */
export function VoicesPanel() {
  return (
    <>
      <h2 class="panel-heading" data-i18n="voicesSectionTitle">
        Voices
      </h2>

      <div class="user-preference-item w-full" id="voices-preference">
        <div class="description" data-i18n="voicesSectionDescription">
          Choose the voice that reads replies aloud on each site.
        </div>
        <div id="voice-studio" aria-live="polite"></div>
      </div>
    </>
  );
}
