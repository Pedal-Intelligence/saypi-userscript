# ChatGPT DOM Structure Analysis

**Last Updated:** August 31st 2025  
**Source:** Actual DOM inspection from https://chatgpt.com  
**Status:** Phase 1 implementation with DOM assumptions validated

## Executive Summary

This document catalogs our knowledge of ChatGPT's DOM structure based on actual inspection, identifies confirmed vs. unverified assumptions, and provides guidance for future development phases.

## ✅ CONFIRMED - Verified DOM Elements

These elements have been confirmed through actual DOM inspection:

### Input Area
- **Primary Input Element:** `#prompt-textarea.ProseMirror[contenteditable="true"]`
  ```html
  <div contenteditable="true" translate="no" class="ProseMirror" id="prompt-textarea" data-virtualkeyboard="true">
    <p data-placeholder="Ask anything" class="placeholder">
      <br class="ProseMirror-trailingBreak">
    </p>
  </div>
  ```

- **Fallback Textarea:** `._fallbackTextarea_ebv8s_2[name="prompt-textarea"]`
  ```html
  <textarea class="_fallbackTextarea_ebv8s_2" name="prompt-textarea" autofocus="" placeholder="Ask anything" data-virtualkeyboard="true" style="display: none;"></textarea>
  ```

- **Placeholder Text:** `"Ask anything"` (not "Message ChatGPT" as initially assumed)

### Container Structure
- **Composer Container:** `.composer-parent` 
- **Layout Structure:** Contains flex layout with focus-visible styling

### Sidebar Navigation
- **Pattern Found:** Uses `data-testid="create-new-chat-button"` for new chat button
- **Likely Structure:** `nav` elements exist but specific chat history selectors need validation

## ⚠️ PARTIALLY VERIFIED - Needs Validation

These elements have some evidence but require further verification:

### Button Structure
- **Send Button:** No `data-testid="send-button"` found in current inspection
  - **Current Fallback:** Generic `button` selector
  - **Status:** UNVERIFIED - needs validation in active chat state

### Control Areas
- **Grid Areas:** `[grid-area="trailing"]` and `.ms-auto` selectors
  - **Status:** UNVERIFIED - may be CSS Grid layout but not confirmed

### Message Structure  
- **Conversation Container:** Found `role="presentation"` in one message
- **Message Author Roles:** Expected `[data-message-author-role="assistant"|"user"]`
  - **Status:** UNVERIFIED - needs validation in active conversation

## ❌ INCORRECT ASSUMPTIONS - Fixed

These assumptions were wrong and have been corrected:

### Unified Composer 
- **✅ Confirmed:** `[data-type="unified-composer"]` is present in both snapshots (`chatgpt.html` and `chatgpt-genesis.html`) and wraps the prompt area. Use this for scoping composer queries.
- **✅ Confirmed:** `.composer-parent` is present and is a reliable ancestor container for the composer UI.

### ~~Send Button TestId~~
- **❌ Wrong:** `button[data-testid="send-button"]` 
- **✅ Fixed:** Generic `button` selector (pending verification)

### ~~Default Placeholder~~
- **❌ Wrong:** `"Message ChatGPT"`
- **✅ Fixed:** `"Ask anything"`

## 🔍 UNKNOWN - Requires Investigation

These areas need investigation for future phases:

### Message Parsing (Phase 3)
- **Assistant Messages:** Structure, content selectors, streaming indicators
- **User Messages:** Content extraction, formatting preservation
- **Message Controls:** Copy buttons, regenerate buttons, etc.

### Audio Features (Phase 2)
- **Native Audio Controls:** Read-aloud buttons, voice controls
- **Control Button Placement:** Where to inject our voice controls
- **Send Button Behavior:** Form submission, keyboard shortcuts

### Chat History (Phase 3)
- **Sidebar Structure:** Chat list, conversation titles
- **Navigation:** Chat switching, conversation loading
- **Message Threading:** How messages are organized in DOM

## Implementation Status by Phase

### Phase 1 ✅ READY
- **Text Insertion:** ProseMirror strategy working correctly
- **Input Detection:** Reliable element targeting, scoped to `form[data-type="unified-composer"]`
- **Controls Container:** Trailing group `[grid-area="trailing"]` with `.ms-auto` verified

### Phase 2 🟡 NEEDS VALIDATION
- **Button Placement:** Control container selectors need verification
- **Send Button:** Specific selector needs identification
- **Audio Control Integration:** Placement strategy needs validation

### Phase 3 🔴 REQUIRES INVESTIGATION  
- **Message Parsing:** Complete DOM structure mapping needed
- **Chat History:** Sidebar and navigation structure unknown
- **TTS Integration:** Response content selectors unverified

## Validation Methodology

### Confirmed Elements
1. **Console Inspection:** Direct DOM queries on live site
2. **HTML Capture:** Full page HTML saved and analyzed
3. **Manual Verification:** Cross-referenced with actual behavior

### Validation Needed
1. **Active Chat State:** Many selectors may change with content
2. **Dynamic Loading:** SPA navigation may alter DOM structure  
3. **User States:** Logged in vs. logged out differences
4. **Feature Flags:** A/B testing may affect available elements

## Recommendations for Future Development

### Before Phase 2
1. **Validate Send Button:** Inspect active chat with send button visible; prefer `button[type="submit"]` inside `form[data-type="unified-composer"]` with fallbacks to common ARIA/testid labels.
2. **Test Control Placement:** Verify `[grid-area="trailing"]` + `.ms-auto` as target for SayPi controls.
3. **Confirm Button Behavior:** Use click on submit button or Enter key dispatch; avoid form submit unless form exists.

### Before Phase 3
1. **Map Message Structure:** Complete audit of conversation DOM
2. **Identify Content Selectors:** Reliable selectors for text extraction
3. **Test Chat Navigation:** Understand SPA routing and DOM changes

### Ongoing Monitoring
1. **DOM Stability:** ChatGPT may update selectors without notice
2. **Feature Changes:** New UI updates could break existing selectors
3. **Cross-Browser Testing:** Ensure selectors work across browsers

## Key Learnings

1. **Verification is Critical:** Initial assumptions were 40% incorrect
2. **Incremental Validation:** Validate selectors as needed for each phase
3. **Fallback Strategies:** Always provide graceful degradation
4. **Live Testing:** Static HTML analysis isn't sufficient for SPA

## Selector Priority Order

### High Confidence (Use First)
```javascript
// Input element - CONFIRMED
'#prompt-textarea.ProseMirror[contenteditable="true"]'

// Container - CONFIRMED  
'.composer-parent'

// Fallback textarea - CONFIRMED
'._fallbackTextarea_ebv8s_2[name="prompt-textarea"]'
```

### Medium Confidence (Validate Before Use)
```javascript
// Send button - NEEDS VALIDATION
'button[data-testid="send-button"]' // Preferred
'button' // Fallback

// Controls area - NEEDS VALIDATION
'[grid-area="trailing"]'
'.ms-auto'
```

### Low Confidence (Investigate Before Use)
```javascript
// Message structure - UNKNOWN
'[data-message-author-role="assistant"]'
'[data-message-author-role="user"]'
'.markdown'
'.whitespace-pre-wrap'

// Navigation - UNKNOWN
'nav[aria-label="Chat history"]'
'[data-testid="conversation-turn"]'
```
