# Voices "Host Studio" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the settings Voices tab as the host-scoped "Host Studio" (design: `doc/plans/2026-07-07-voices-host-studio-design.md`): switcher → gradient stage → menu slots → explore shelves, powered by a new voice identity system.

**Architecture:** `VoicesPanel.tsx` stays a render-once skeleton; a rewritten imperative `VoicesController` renders one host's studio at a time from cached per-host fetches, reusing `curateShortlist`/`visibleCatalog`/`VoicePins` unchanged. New pure module `src/tts/VoiceIdentity.ts` supplies gradients + tagline i18n keys. `VoiceCatalogUnify` is deleted.

**Tech Stack:** TypeScript, Preact (skeleton only), Vitest + @testing-library/preact (JSDOM), plain CSS, chrome.storage deep link.

---

### Task 1: VoiceIdentity module

**Files:**
- Create: `src/tts/VoiceIdentity.ts`
- Test: `test/tts/VoiceIdentity.spec.ts`

- [ ] **Step 1: Failing tests** — curated hit by id (`marin`), curated hit by name when id is opaque (ElevenLabs UUID + name "Paola"), deterministic fallback (same unknown id → same gradient; different ids → different hues), fallback has no `taglineKey`, tagline key shape `voiceTagline_<key>`.
- [ ] **Step 2: Implement**

```ts
export interface VoiceVisualIdentity {
  gradient: [string, string];   // CSS colors, from → to
  taglineKey?: string;          // i18n key; absent for uncurated voices
}
export function getVoiceIdentity(
  voice: Pick<SpeechSynthesisVoiceRemote, "id" | "name">
): VoiceVisualIdentity
```

Curated map keyed by lowercase id first, then lowercase name (twin "Paola"s share one persona identity by design; metadata subtitles differentiate them). 24 curated entries (12 everyday: alloy/ash/ballad/cedar/coral/echo/fable/marin/nova/onyx/sage/shimmer; 12 HD: paola/joey/jarnathan/jeff/mark/jamahal/finn/juniper/cassidy/addison/jessica/lucy) with the gradient values from the approved mockup. Fallback: djb2 hash of id → `hsl(h,62%,52%)` → `hsl(h+40,68%,34%)`.

- [ ] **Step 3: Green + commit** `feat(voices): voice identity map (gradients + tagline keys)`

### Task 2: Deep-link host scoping

**Files:**
- Modify: `src/popup/popupopener.ts` (add pure `parseSettingsDeepLink`)
- Modify: `entrypoints/settings/index.ts:79-91` (use parser; forward detail)
- Modify: `entrypoints/settings/tabs/voices/index.ts` (one-shot `setInitialHost`)
- Modify: `src/chatbots/PiVoiceMenu.ts:45` → `openSettings("voices/pi")`; `src/chatbots/ClaudeVoiceMenu.ts:873` → `openSettings("voices/claude")`
- Test: `test/popup/popupopener.spec.ts` (new); update `test/chatbots/PiVoiceMenu-more-voices-door.spec.ts` + Claude door spec expectations

- [ ] **Step 1: Failing tests** for `parseSettingsDeepLink("voices/pi") → {tab:"voices", detail:"pi"}`, `("voices") → {tab:"voices"}`, garbage-safe; door specs expect the host-suffixed argument.
- [ ] **Step 2: Implement**

```ts
export function parseSettingsDeepLink(value: unknown): { tab: string; detail?: string } | null {
  if (typeof value !== "string" || !value) return null;
  const [tab, detail] = value.split("/", 2);
  return tab ? { tab, ...(detail ? { detail } : {}) } : null;
}
```

Settings bootstrap: `const link = parseSettingsDeepLink(deepLink); if (link && this.tabs.has(link.tab)) { initialTab = link.tab; if (link.tab === "voices" && link.detail) setInitialHost(link.detail); }`. `setInitialHost` stores a module-level one-shot consumed by the controller at init.

- [ ] **Step 3: Green + commit** `feat(voices): host-scoped settings deep link from the in-host doors`

### Task 3: i18n strings

**Files:**
- Modify: `_locales/en/messages.json` (+ every other locale for removals; run the repo's translate tooling for additions if available, else rely on default-locale fallback — check `package.json` scripts first)

- [ ] Remove dead keys everywhere: `voicesPinExplainer`, `voicesPinToHost` (replaced by add/remove aria pair).
- [ ] Add: `voicesSpeaksWith` ("$HOST$ speaks with", placeholder), `voicesSpeakingNow`, `voicesInHostMenu` ("In $HOST$'s menu"), `voicesMenuHint` ("What you'll see in chat"), `voicesAddToMenuShort` ("+ Menu"), `voicesInMenuShort` ("✓ In menu"), `voicesAddVoiceToMenu`/`voicesRemoveVoiceFromMenu` (aria, $VOICE$/$HOST$), `voicesMenuFull`, `voicesMenuOverflow` ("$N$ more pinned…$CAP$ slots"), `voicesLoadError`, `voicesNoStageVoice`, `voicesBuiltinsNote`, `voicesStagePlay` ("Hear a sample"), and 24 `voiceTagline_*` entries (copy in design/mockup).
- [ ] Run `npm run validate:env`-adjacent i18n validation (`i18n-validate` per repo docs) and commit `feat(voices): host-studio i18n strings`.

### Task 4: Panel skeleton

**Files:**
- Modify: `entrypoints/settings/tabs/voices/VoicesPanel.tsx`
- Test: `test/settings/tabs/VoicesPanel.spec.tsx`

- [ ] Skeleton becomes: `h2[data-i18n=voicesSectionTitle]`, description line, `<div id="voice-studio" aria-live="polite">`. Update spec (asserts ids/data-i18n present, no pin explainer). Commit with Task 5 or alone: `feat(voices): studio panel skeleton`.

### Task 5: VoicesController rewrite (the studio)

**Files:**
- Rewrite: `entrypoints/settings/tabs/voices/voices-controller.ts`
- Rewrite test: `test/settings/tabs/voices-controller.spec.tsx`

Deps interface (breaking, test-injected):

```ts
export interface VoiceStudioDeps {
  getVoices(host: VoiceHostId): Promise<SpeechSynthesisVoiceRemote[]>;
  getVoice(host: VoiceHostId): Promise<SpeechSynthesisVoiceRemote | null>;
  setVoice(voice: SpeechSynthesisVoiceRemote, host: VoiceHostId): Promise<void>;
  isAuthenticated(): boolean;
  /** Play the voice's sample; report playback state so orbs can animate. */
  playPreview(voice: SpeechSynthesisVoiceRemote, onState: (playing: boolean) => void): void;
  loadPins(host: VoiceHostId): Promise<HostPinOverlay | null>;
  setPinned(host: VoiceHostId, voiceId: string, featuredIds: string[], pin: boolean): Promise<void>;
}
```

`VOICE_HOSTS` entries gain `menuCap` (`PI_MENU_CAP` / `CLAUDE_MENU_CAP`). Controller state: `activeHost` (one-shot deep link > `localStorage["saypi.settings.voicesHost"]` > first host), per-host cache `{voices, current, overlay, failed}`, render token.

Render pipeline per host: `visibleCatalog(voices, currentId)` → split `default:true` out (host-built-ins note when any existed) → `resolvePinnedIds(serverFeaturedIds(catalog), overlay)` (null overlay ⇒ pass `undefined` to keep server-featured membership) → `curateShortlist(catalog, currentId, cap, pins)` → paint switcher, stage (identity gradient via `--stage-from/--stage-to` inline vars), slots (shortlist truth; current slot non-removable "Speaking now"), overflow note (`resolved pins ∖ seated`, >0 only), shelves by `getVoiceTier` (wrapping grids; HD first with `hdVoicesAllowanceNote`).

In-place semantics: pin toggle → optimistic `togglePin` on cached overlay, repaint slots + patch every card's pin button (pressed/label/disabled-at-cap) without rebuilding shelves; revert on rejected `setPinned`. `Use` → `setVoice`, update cache, full studio repaint. Orb click → `playPreview(voice, cb)`; cb toggles `.playing` on all `[data-orb-voice="<id>"]`.

- [ ] **Step 1: Rewrite the spec first** (red): port/adapt all 19 existing behaviours + new ones. Test list:
  1. renders switcher from VOICE_HOSTS; default scope = first host; only that host fetched
  2. deep-link one-shot host wins; invalid host detail falls back
  3. last-viewed host persisted + restored (localStorage)
  4. stage shows current voice name, tagline element, gradient vars set
  5. stage empty-state when host has no current voice
  6. slots = curateShortlist output order (current first, pins in catalog order, cap enforced)
  7. current slot marked + has no remove button (incl. deprecated current — grandfathering)
  8. slot remove button unpins (setPinned called with pin=false + host's featuredIds)
  9. card "+ Menu" pins; label/aria-pressed flip in place; slots row updates
  10. cap-full ⇒ unpinned cards' pin buttons disabled with voicesMenuFull title
  11. legacy overflow (pins beyond cap) ⇒ voicesMenuOverflow note; none otherwise
  12. Use calls setVoice(voice, activeHost) and repaints (badge moves to stage/slot)
  13. host switch fetches on demand, caches, repaints; pins/Use target the in-scope host only
  14. one host's fetch failure ⇒ error state for that host, other host fine (switch works)
  15. unauthenticated + empty ⇒ signInForTTS; authenticated + empty ⇒ voicesNoneAvailable
  16. default:true voices excluded from slots/shelves; built-ins note shown; still stage-shown when current
  17. orb click calls playPreview; `.playing` toggles on state true/false across duplicates
  18. voices without sample_url render no play affordance
  19. HD/Everyday shelf split via getVoiceTier; single-tier catalog ⇒ flat grid, no shelf chrome
  20. tagline falls back to server description, then languages subtitle (#474 twins stay distinguishable)
  21. stale render guard: slow older render never clobbers newer (token)
  22. pin failure reverts optimistic state
- [ ] **Step 2: Implement controller until green.**
- [ ] **Step 3: Commit** `feat(voices): host-studio controller`

### Task 6: Studio CSS

**Files:**
- Rewrite: `entrypoints/settings/tabs/voices/voices.css`

- [ ] Implement the approved mockup's Direction-B visual system with `voice-`-prefixed classes: segmented switcher; stage panel (`color-mix` of identity vars toward near-black keeps white text readable on any voice color); orb (3 sizes) with play triangle / equalizer bars + `@keyframes`; `prefers-reduced-motion` kill-switch; slots row; card grid `repeat(auto-fill,minmax(150px,1fr))`; tier chip (gold-on-graphite "HD"); pin toggle states; focus-visible outlines. Commit `feat(voices): host-studio styling`.

### Task 7: Delete VoiceCatalogUnify

**Files:**
- Delete: `src/tts/VoiceCatalogUnify.ts`, `test/tts/VoiceCatalogUnify.spec.ts`

- [ ] `grep -rn VoiceCatalogUnify src entrypoints test e2e` → only the two files; delete; commit `refactor(voices): drop VoiceCatalogUnify (2c-only, superseded by host studio)`.

### Task 8: Full gate + PR

- [ ] `npx tsc --noEmit` in worktree (needs `.wxt/` — run `npx wxt prepare` if missing)
- [ ] `npm run test:vitest` and `npm run test:jest`
- [ ] i18n validation (script per repo)
- [ ] PR with design narrative + mockup link; auto-merge on green (squash, delete branch). Post-merge Layer-4 verify (best-effort): `node scripts/layer4cdp.mjs verify <host>` + pin→menu spot check.

## Self-review

Spec coverage: switcher/stage/slots/shelves (T5), identity (T1), deep link + doors (T2), cap/overflow/grandfather (T5 tests 6-11), states (T5 tests 14-15), a11y (T5 9/17 + T6 focus/reduced-motion), unify deletion (T7), i18n (T3), gate + L4 (T8). Types consistent: `VoiceStudioDeps.playPreview(voice, onState)` used in T5 test 17; `VoiceVisualIdentity` in T1/T5. No placeholders beyond deliberate "check tooling first" branches (translate pipeline availability is an execution-time fact).
