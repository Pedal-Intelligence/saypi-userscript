import { SpeechSynthesisVoiceRemote } from "./SpeechModel";
import { getVoiceTier, visibleCatalog, VoiceTier } from "./VoiceCuration";
import {
  HostPinOverlay,
  resolvePinnedIds,
  serverFeaturedIds,
} from "./VoicePins";

/**
 * Collapse the per-host voice catalogs into ONE cross-host catalog for the
 * settings Voices tab (doc/plans/2026-07-05-voice-shortlist-pins-design.md).
 *
 * Every SayPi-served voice works on any host, so the catalog is host-generic;
 * host-specificity survives only as per-voice state (serveable / pinned /
 * current) so the UI can show per-host pin toggles + a per-host Use action on
 * one row. Host-serveability is DERIVED from catalog membership — no new server
 * field — and Pi's native voices (`default: true`, host-owned) are excluded:
 * they are always shown in Pi's own menu and are not part of any shortlist,
 * matching the in-host menu, which curates only non-default voices.
 */

export interface HostCatalog {
  hostId: string;
  voices: SpeechSynthesisVoiceRemote[];
  currentId: string | null;
  overlay: HostPinOverlay | null;
}

export interface HostVoiceState {
  hostId: string;
  /** The voice is in this host's (non-deprecated, non-default) catalog. */
  serveable: boolean;
  /** Resolved pin state for this host (only ever true when serveable). */
  pinned: boolean;
  /** This voice is this host's current selection. */
  isCurrent: boolean;
}

export interface UnifiedVoiceRow {
  voice: SpeechSynthesisVoiceRemote;
  tier: VoiceTier;
  /** One entry per input host, in input order. */
  hosts: HostVoiceState[];
}

interface HostView {
  hostId: string;
  currentId: string | null;
  byId: Map<string, SpeechSynthesisVoiceRemote>;
  order: SpeechSynthesisVoiceRemote[];
  pinned: Set<string>;
}

function deriveHostView(catalog: HostCatalog): HostView {
  // Deprecated voices drop out (except the current one — grandfathering); Pi's
  // native default voices are host-owned and never pinnable.
  const visible = visibleCatalog(catalog.voices, catalog.currentId).filter(
    (voice) => !voice.default
  );
  return {
    hostId: catalog.hostId,
    currentId: catalog.currentId,
    byId: new Map(visible.map((voice) => [voice.id, voice])),
    order: visible,
    // Featured ids come from the full catalog; featured voices are non-default,
    // so this matches the visible set. resolvePinnedIds treats a null overlay as
    // the identity (just the server defaults).
    pinned: resolvePinnedIds(serverFeaturedIds(catalog.voices), catalog.overlay),
  };
}

export function unifyHostCatalogs(catalogs: HostCatalog[]): UnifiedVoiceRow[] {
  const views = catalogs.map(deriveHostView);

  // Union the voices in a stable order: first host's catalog order, then each
  // later host's not-yet-seen voices appended.
  const seen = new Set<string>();
  const ordered: SpeechSynthesisVoiceRemote[] = [];
  for (const view of views) {
    for (const voice of view.order) {
      if (!seen.has(voice.id)) {
        seen.add(voice.id);
        ordered.push(voice);
      }
    }
  }

  return ordered.map((voice) => ({
    voice,
    tier: getVoiceTier(voice),
    hosts: views.map((view) => {
      const serveable = view.byId.has(voice.id);
      return {
        hostId: view.hostId,
        serveable,
        pinned: serveable && view.pinned.has(voice.id),
        isCurrent: view.currentId === voice.id,
      };
    }),
  }));
}
