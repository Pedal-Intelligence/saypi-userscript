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
        {/* Each pill wears its assistant's logo and brand color (#473) so
            users orient at a glance — matching the platform cards on
            saypi.ai/features/sites-supported. Logos are decorative (the pill
            text is the accessible label), hence alt="" + aria-hidden; the
            active state is also carried by aria-selected and font weight, so
            color is never the only signal. Assets live in public/icons/logos/,
            served from the extension root. */}
        <div id="voice-host-pills" role="tablist">
          <button
            type="button"
            id="voice-host-pi"
            class="voice-host-pill"
            role="tab"
          >
            <img
              class="voice-host-logo"
              src="/icons/logos/pi.png"
              alt=""
              aria-hidden="true"
            />
            Pi
          </button>
          <button
            type="button"
            id="voice-host-claude"
            class="voice-host-pill"
            role="tab"
          >
            <img
              class="voice-host-logo"
              src="/icons/logos/claude.png"
              alt=""
              aria-hidden="true"
            />
            Claude
          </button>
        </div>
        <div id="voice-catalog" aria-live="polite"></div>
      </div>
    </>
  );
}
