/**
 * Voices-tab panel (Preact).
 *
 * Static skeleton only — VoicesController renders the per-host catalog into
 * #voice-catalog after mount and wires the host pills by id, so the ids and
 * classes here (`#voices-preference`, `#voice-host-pills`, `#voice-host-pi`,
 * `#voice-host-claude`, `.voice-host-pill`, `#voice-catalog`) are load-bearing.
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
        <div id="voice-host-pills" role="tablist">
          <button
            type="button"
            id="voice-host-pi"
            class="voice-host-pill"
            role="tab"
          >
            Pi
          </button>
          <button
            type="button"
            id="voice-host-claude"
            class="voice-host-pill"
            role="tab"
          >
            Claude
          </button>
        </div>
        <div id="voice-catalog" aria-live="polite"></div>
      </div>
    </>
  );
}
