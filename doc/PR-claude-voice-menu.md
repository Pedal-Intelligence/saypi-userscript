# claude: richer Voice menu (accent flags, gender icons, inline chips, subtle separators)

## Summary

Enhances Claude’s voice picker to help users compare and choose from a longer list of TTS voices without clutter:

- Accent flag chip (based on BCP‑47 `accent` with region) when accents vary
- Gender chip using Lucide icons (`mars`/`venus`) when genders vary
- Price chip (compact `$0.3/1k`) only when prices vary
- Chips are inline with the voice name (same row) to reduce vertical height
- Subtle divider between items for easier visual scanning
- Correct SVG handling so Lucide stroke icons render crisply (no accidental fill)

## User impact

- Faster scanning and easier differentiation between voices
- No new actions or settings; purely presentational improvements

## Implementation details

- Heuristics computed once per menu build to avoid noise:
  - Show accent only if more than one accent is present
  - Show gender only if more than one gender is present
  - Show price only if prices differ
- Accent expects a BCP‑47 tag in the `accent` field (e.g., `en-US`). We use the region subtag to display a flag from `src/icons/flags`.
- Gender icons are inline SVG (Lucide) to inherit `currentColor` and match other icons.
- Subtle 1px dividers are appended to each menu item except the last.

## Files changed

- `src/chatbots/ClaudeVoiceMenu.ts` — UI: chips inline with name, subtle dividers, flag lookup, heuristics
- `src/tts/VoiceMenu.ts` — fix `addSvgToButton` to preserve Lucide SVG attributes (stroke/fill/viewBox)
- `src/tts/SpeechModel.ts` — extend voice type with optional `gender?`, `accent?`, `description?`
- `src/icons/lucide-globe.svg` — Lucide globe asset
- `src/icons/lucide-mars.svg` — Lucide mars icon
- `src/icons/lucide-venus.svg` — Lucide venus icon

## Notes for server API

- Return `accent` as BCP‑47 (e.g., `en-US`, `en-GB`). We do not use a separate `locale` field.
- Suggested description length: ≤ ~60 chars, front‑load tone/feel.

## How to test

1. Build the extension (`npm run build`) and load the unpacked build.
2. Open Claude and the voice menu.
3. Verify:
   - Flags render for accents with region; no globe shown when accent missing/invalid.
   - Gender icons (♂/♀ via Lucide) appear only when genders vary across the list.
   - Price chip appears only if prices differ.
   - Chips render inline right of the name, above the description.
   - Subtle dividers appear between items (not after the last item).

## Screenshots

See issue/PR attachments.

## Risks / compatibility

- No breaking changes in UI events or APIs.
- Flags resolve from `src/icons/flags` via `chrome.runtime.getURL` (already web‑accessible in the manifest; no duplication in `public/`).

## Follow‑ups

- Dark theme and theme switching polish (divider tone, secondary text contrast)
- Optional: per‑voice preview button

## Commit message suggestion

```
claude: richer Voice menu (accent flags, gender icons, inline chips, subtle separators)

- Show accent flag (BCP‑47/region), gender (Lucide), and price only when they vary
- Move chips inline to the name row; keep description below
- Add subtle item dividers for easier scanning
- Fix Lucide SVG rendering (preserve stroke/fill/viewBox)
```

## Branch & push (example)

```
git checkout -b feat/claude-voice-menu-rich-metadata
git add src/chatbots/ClaudeVoiceMenu.ts src/tts/VoiceMenu.ts src/tts/SpeechModel.ts src/icons/lucide-*.svg doc/PR-claude-voice-menu.md
git commit -m "claude: richer Voice menu (accent flags, gender icons, inline chips, subtle separators)"
git push -u origin feat/claude-voice-menu-rich-metadata
```

