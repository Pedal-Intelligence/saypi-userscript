# Sidebar Integration Standardization Across Chat Hosts

## Background

PR #251 implemented sidebar integration for Pi.ai, establishing patterns that should be standardized across Claude (GH-250) and ChatGPT (GH-249).

Analysis of the three chat host UIs reveals a surprising degree of commonality in sidebar structure that we can leverage for consistent SayPi integration.

## Common Sidebar Structure

All three chat hosts (Pi, Claude, ChatGPT) share this general structure:

```
Collapsible Sidebar
├── Header Section
│   └── Menu Section (primary navigation buttons)
│       ├── New chat
│       ├── Discover (Pi) / Library (Claude) / Search (ChatGPT)
│       ├── [Other host-specific buttons...]
│       └── Settings (host settings, not SayPi)
├── Thread List / Content
└── Footer (user account, etc.)
```

**Key insight:** The header menu section is the ideal location for SayPi's sidebar buttons, as it groups primary navigation actions and is consistently accessible across all three platforms.

See GH-243's description for detailed DOM analysis of Pi's sidebar structure.

## Current Implementation Status

### Pi.ai (✅ Implemented in PR #251)
- ✅ `getSidePanelSelector()` returns sidebar root selector
- ✅ `getSidebarConfig()` returns `SidebarConfig` with:
  - `buttonContainer`: header menu element
  - `buttonStyle: 'menu'` (compact menu buttons)
  - `insertPosition: 2` (after "Discover")
- ✅ Creates Focus and Settings buttons via `ButtonModule`:
  - `createImmersiveModeMenuButton()`
  - `createSettingsMenuButton()`

### Claude.ai (🚧 Partially Implemented)
- ❌ `getSidePanelSelector()` returns `""` (disabled, see GH-250)
- ❌ `getSidebarConfig()` returns `null` (not implemented)
- ⚠️ **Custom workaround:** `insertSettingsMenuItem()` adds button to **tools menu** (not sidebar)
  - Uses `IconModule.bubbleBw` icon
  - Uses `getMessage("voiceSettings")` label
  - Different DOM insertion approach than Pi

**Note:** Claude's custom implementation demonstrates the desired visual style (bubble icon + "Voice settings" label) but in the wrong location (tools menu vs sidebar).

### ChatGPT (❌ Not Implemented)
- ❌ `getSidePanelSelector()` returns `""` (disabled, see GH-249)
- ❌ `getSidebarConfig()` returns `null` (not implemented)
- ❌ `CHATGPT_FEATURES.enableControlPanel = false`

## Standardization Requirements

When implementing GH-249 (ChatGPT) and GH-250 (Claude), apply these standards:

### 1. Terminology: Rename "side-panel" → "sidebar"

**Rationale:** "Sidebar" is more accurate and matches industry terminology. "Side-panel" is a legacy artifact.

**Scope:**
- Method names: `getSidePanelSelector()` → keep method name for backward compatibility, but document as deprecated
- Variable names: `sidePanel` → `sidebar` in new code
- CSS classes/IDs: `saypi-side-panel` → `saypi-sidebar` (add both for transition period)
- Comments and documentation: Update all references

**Migration approach:**
- Keep `getSidePanelSelector()` method name (interface requirement)
- Add `getSidebarSelector()` as alias (mark old method deprecated in comments)
- Update internal implementation to use "sidebar" terminology

### 2. Button Placement: Add to Sidebar Header Menu

**Target location:** Sidebar header's primary navigation menu (same level as "New chat", "Discover", etc.)

**Implementation pattern:**
```typescript
getSidebarConfig(sidebar: HTMLElement): SidebarConfig | null {
  // 1. Find header element (first child with specific classes/structure)
  const header = sidebar.querySelector('[header-selector]');
  if (!header) {
    console.warn('[Chatbot] sidebar: Could not find header element');
    return null;
  }

  // 2. Find menu container within header
  const menu = header.querySelector('[menu-selector]');
  if (!menu) {
    console.warn('[Chatbot] sidebar: Could not find menu container');
    return null;
  }

  // 3. Mark sidebar for styling (optional, for chatbot-specific CSS)
  sidebar.id = "saypi-sidebar";
  sidebar.classList.add("saypi-control-panel");

  return {
    buttonContainer: menu as HTMLElement,
    buttonStyle: 'menu',
    insertPosition: N  // Position after Nth nav button (chatbot-specific)
  };
}
```

**Reference implementation:** See `Pi.ts` lines 208-239 for the pattern.

### 3. Button Types: Focus + Settings

**Always add:**
- ✅ **Settings button** (opens SayPi settings popup)

**Conditionally add:**
- ✅ **Focus button** (enters immersive/focus mode) - only if chatbot supports focus mode
  - Pi: ✅ Has focus mode
  - Claude: ❓ TBD (check if focus mode is implemented)
  - ChatGPT: ❓ TBD (check if focus mode is implemented)

**Implementation:**
```typescript
// In bootstrap.ts decorateSidePanel()
if (buttonStyle === 'menu') {
  // Add focus button only if chatbot supports it
  if (this.chatbot.supportsFocusMode?.()) {
    buttonModule.createImmersiveModeMenuButton(buttonContainer, insertPosition);
    buttonModule.createSettingsMenuButton(buttonContainer, insertPosition + 1);
  } else {
    buttonModule.createSettingsMenuButton(buttonContainer, insertPosition);
  }
}
```

**Note:** May need to add `supportsFocusMode(): boolean` method to `Chatbot` interface.

### 4. Icon: Replace settings.svg with bubble-bw.svg

**Current state:**
- Pi's `createSettingsMenuButton()` uses `settingsIconSVG` (gear icon)
- Claude's `insertSettingsMenuItem()` uses `IconModule.bubbleBw` (speech bubble icon)

**Target state:**
- All chatbots should use `IconModule.bubbleBw` for voice settings button

**Required changes:**

#### A. Update ButtonModule.js
```javascript
// OLD (line ~312):
createSettingsMenuButton(container, position = 0) {
  const button = this.createMenuButton({
    label: getMessage("extensionSettings"),
    icon: settingsIconSVG,  // ❌ Remove
    onClick: () => openSettings(),
    className: 'settings-button'
  });
  // ...
}

// NEW:
import { IconModule } from "../icons/IconModule";

createSettingsMenuButton(container, position = 0) {
  // Clone the bubble icon from IconModule
  const bubbleIcon = IconModule.bubbleBw.cloneNode(true);
  
  const button = this.createMenuButton({
    label: getMessage("voiceSettings"),  // Changed label (see #5)
    icon: bubbleIcon,  // ✅ Use bubble icon
    onClick: () => openSettings(),
    className: 'settings-button'
  });
  // ...
}
```

**Icon details:**
- Source: `src/icons/bubble-bw.svg`
- Loaded via: `IconModule.bubbleBw` (singleton, already loaded)
- Size: 18x18px (as used in Claude's implementation)
- Color: Should adapt to host theme (see Claude's implementation lines 374-378 for dynamic color adjustment)

#### B. Remove unused settings.svg references
- Check if `settingsIconSVG` is used elsewhere before removing
- Update imports in ButtonModule.js

### 5. Label: Replace "Settings" with "Voice settings"

**Current state:**
- Pi's `createSettingsMenuButton()` uses `getMessage("extensionSettings")` = "Settings"
- Claude's `insertSettingsMenuItem()` uses `getMessage("voiceSettings")` = "Voice settings"

**Target state:**
- All chatbots should use `getMessage("voiceSettings")` = "Voice settings"

**Rationale:**
- More descriptive and specific to SayPi's voice functionality
- Distinguishes from host platform's general settings
- Clearer to users what the button controls

**Required changes:**
```javascript
// In ButtonModule.js createSettingsMenuButton()
label: getMessage("voiceSettings"),  // Changed from "extensionSettings"
```

**i18n availability:**
- ✅ `voiceSettings` key already exists in `_locales/en/messages.json` (line 30)
- ✅ Likely translated in all locale files (verify before implementing)

### 6. Consistent Error Handling

All `getSidebarConfig()` implementations should:
- Return `null` if sidebar/header/menu elements not found
- Log descriptive warnings with chatbot name prefix
- Handle graceful degradation (extension works without sidebar integration)

**Pattern:**
```typescript
if (!element) {
  console.warn('[ChatbotName] sidebar: Could not find [element] element');
  return null;
}
```

## Implementation Checklist

### For GH-250 (Claude Sidebar Integration)

- [ ] Update `getSidePanelSelector()` to return Claude's sidebar root selector
  - Research Claude's sidebar DOM structure
  - Find stable selector (similar to Pi's approach)
- [ ] Implement `getSidebarConfig()` following Pi's pattern
  - Find header element in sidebar
  - Find menu container in header
  - Determine appropriate `insertPosition` (after which button?)
  - Return `SidebarConfig` with `buttonStyle: 'menu'`
- [ ] Remove/migrate custom `insertSettingsMenuItem()` workaround
  - Delete the method and MutationObserver setup (lines 302-347)
  - Remove references to tools menu decoration
  - Rely on standard sidebar integration instead
- [ ] Verify focus mode support for Claude
  - Check if `enterImmersiveMode()` works on Claude
  - Add focus button if supported, otherwise only settings button
- [ ] Test across different Claude UI states
  - Collapsed vs expanded sidebar
  - Different viewport sizes (mobile, tablet, desktop)
  - Light/dark themes

### For GH-249 (ChatGPT Sidebar Integration)

- [ ] Research ChatGPT's sidebar DOM structure
  - Note: `nav[aria-label="Chat history"]` exists but may not be the sidebar root
  - Document findings similar to GH-243 for Pi
- [ ] Update `getSidePanelSelector()` to return ChatGPT's sidebar root selector
- [ ] Implement `getSidebarConfig()` following Pi's pattern
  - Find header element in sidebar
  - Find menu container in header
  - Determine appropriate `insertPosition`
  - Return `SidebarConfig` with `buttonStyle: 'menu'`
- [ ] Verify focus mode support for ChatGPT
  - Check if `enterImmersiveMode()` works on ChatGPT
  - Add focus button if supported, otherwise only settings button
- [ ] Consider `CHATGPT_FEATURES.enableControlPanel` relationship
  - Evaluate if sidebar integration should affect this flag
  - Document any dependencies
- [ ] Test across different ChatGPT UI states
  - Collapsed vs expanded sidebar
  - Different chat types (regular, GPT, shared)
  - Different viewport sizes

### For ButtonModule.js (All Chatbots)

- [ ] Update `createSettingsMenuButton()` to use bubble icon
  - Import `IconModule`
  - Clone `IconModule.bubbleBw`
  - Remove `settingsIconSVG` import if unused elsewhere
- [ ] Update `createSettingsMenuButton()` label
  - Change `getMessage("extensionSettings")` → `getMessage("voiceSettings")`
- [ ] Verify icon styling
  - Test icon appearance in light/dark themes
  - Verify 18x18px size works across all chatbots
  - Check hover states and color transitions
- [ ] Consider dynamic color adjustment
  - See Claude's implementation (lines 374-378) for theme-aware icon colors
  - May need to adapt for Pi/ChatGPT themes

### For Chatbot.ts Interface (Optional)

- [ ] Add `supportsFocusMode(): boolean` method
  - Default implementation in `AbstractChatbot`: return `false`
  - Override in chatbots that support it (e.g., Pi returns `true`)
- [ ] Add `getSidebarSelector()` as alias
  - Deprecate `getSidePanelSelector()` in comments
  - Update documentation to prefer new name

### Documentation & Testing

- [ ] Update CLAUDE.md and AGENTS.md with new sidebar patterns
- [ ] Document chatbot-specific sidebar structures (like GH-243 for Pi)
- [ ] Add tests for `getSidebarConfig()` implementations
- [ ] Manual testing checklist for each chatbot:
  - [ ] Sidebar buttons appear in correct location
  - [ ] Focus button works (if supported)
  - [ ] Settings button opens popup
  - [ ] Icons display correctly (size, color, theme)
  - [ ] Labels are translated correctly
  - [ ] Buttons work in collapsed/expanded sidebar states
  - [ ] No console errors or warnings

### Code Cleanup (Post-Implementation)

- [ ] Rename variables/comments: "side-panel" → "sidebar"
- [ ] Remove unused `settingsIconSVG` references
- [ ] Update CSS classes: `saypi-side-panel` → `saypi-sidebar` (support both for transition)
- [ ] Verify all three chatbots use consistent patterns
- [ ] Remove any temporary/workaround code (e.g., Claude's tools menu approach)

## Visual Reference

### Pi.ai Sidebar (Implemented)
See attached screenshots in PR #251 and GH-243.

### Claude.ai Sidebar (To Implement)
See attached screenshots at the top of this issue showing Claude's sidebar structure:
- "New chat" button with pencil icon
- "Search chats" button with search icon
- "Library" button with books icon
- "Codex" button with clock icon

**Target:** Add Focus + Settings buttons to this menu section.

### ChatGPT Sidebar (To Implement)
See attached screenshots at the top of this issue showing ChatGPT's sidebar structure:
- "New chat" button
- "Search" button (magnifying glass icon)
- Expandable sections (Today, Yesterday, etc.)

**Target:** Add Focus + Settings buttons to the header menu section.

## Related Issues

- GH-243: Pi sidebar integration (original implementation)
- GH-249: ChatGPT sidebar decoration (planned)
- GH-250: Claude sidebar decoration (planned)
- PR #251: Pi sidebar integration (merged)

## Relevant Modules

- `src/chatbots/Chatbot.ts` - `SidebarConfig` interface
- `src/chatbots/AbstractChatbots.ts` - Abstract `getSidebarConfig()` method
- `src/chatbots/Pi.ts` - Reference implementation (lines 208-239)
- `src/chatbots/Claude.ts` - Current tools menu workaround (lines 302-410)
- `src/chatbots/ChatGPT.ts` - To be implemented
- `src/chatbots/bootstrap.ts` - `decorateSidePanel()` (lines 311-331)
- `src/ButtonModule.js` - Button creation methods (lines 297-319)
- `src/icons/IconModule.ts` - Icon management
- `src/icons/bubble-bw.svg` - Target icon for settings button
- `_locales/en/messages.json` - i18n strings (line 30: `voiceSettings`)

## Notes

- The sidebar integration approach is non-breaking: if `getSidebarConfig()` returns `null`, the extension continues to work normally without sidebar buttons
- This standardization makes the codebase more maintainable and consistent across chatbots
- The bubble icon better represents SayPi's voice-centric functionality than a generic settings gear
- "Voice settings" is more descriptive than generic "Settings" and avoids confusion with host platform settings

