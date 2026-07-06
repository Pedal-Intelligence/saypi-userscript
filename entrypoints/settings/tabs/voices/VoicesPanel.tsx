/**
 * Voices-tab panel (Preact).
 *
 * Static skeleton only — VoicesController renders ONE unified cross-host
 * catalog into #voice-catalog after mount, so that id is load-bearing. There
 * are no per-host pills any more: the catalog is a single list and each row
 * carries its own per-host pin toggles + Use action (the 2026-07-05 shortlist
 * redesign — doc/plans/2026-07-05-voice-shortlist-pins-design.md).
 *
 * This tab sits alongside Dictation deliberately: Dictation is voice-in,
 * Voices is voice-out (#471). It is also the destination of the in-page voice
 * menus' "More voices…" door (openSettings("voices")).
 */
export function VoicesPanel() {
  return (
    <>
      <h2 class="panel-heading" data-i18n="voicesSectionTitle">
        Voices
      </h2>

      <div class="user-preference-item w-full max-w-lg" id="voices-preference">
        <div class="description" data-i18n="voicesSectionDescription">
          Choose the voice that reads replies aloud on each site.
        </div>
        {/* What the per-host pin toggles on each row do — the catalog is one
            unified list; pinning curates each site's short in-app menu. */}
        <div class="description voices-pin-explainer" data-i18n="voicesPinExplainer">
          Pin your favourite voices to keep each site's in-app menu short.
          Pinned voices show in the menu; the full catalogue stays here.
        </div>
        <div id="voice-catalog" aria-live="polite"></div>
      </div>
    </>
  );
}
