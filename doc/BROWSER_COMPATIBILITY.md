# Browser Compatibility Matrix

This document provides a comprehensive overview of Say, Pi extension compatibility across different browsers and AI chatbot sites.

## Executive Summary

### ✅ Fully Supported
- **Chrome Desktop** (v116+) - All features on all sites
- **Edge Desktop** (v116+) - All features on all sites

### ⚠️ Partially Supported
- **Firefox Desktop/Mobile** - VAD/STT works, TTS blocked on Claude.ai & ChatGPT
- **Safari Desktop/Mobile** - VAD/STT works, TTS blocked on Claude.ai & ChatGPT
- **Mobile Chromium (Kiwi, etc.)** - Limited support, site-dependent issues

### ❌ Known Issues
- **Kiwi Browser + Claude.ai** - Both VAD and TTS unavailable

---

## Detailed Compatibility Matrix

| Browser | Pi.ai TTS | Claude.ai TTS | ChatGPT TTS | Pi.ai VAD | Claude.ai VAD | ChatGPT VAD | Notes |
|---------|-----------|---------------|-------------|-----------|---------------|-------------|-------|
| **Chrome Desktop** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Full support via offscreen |
| **Edge Desktop** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Full support via offscreen |
| **Firefox Desktop** | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ | No offscreen API, CSP blocks TTS |
| **Firefox Mobile** | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ | No offscreen API, CSP blocks TTS |
| **Safari Desktop** | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ | No offscreen API, CSP blocks TTS |
| **Safari Mobile** | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ | No offscreen API, CSP blocks TTS |
| **Mobile Chrome** | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ | No offscreen on mobile |
| **Kiwi Browser** | ✅ | ❌ | ❌ | ✅ | ❌ | ❓ | WASM issues + no offscreen |

**Legend:**
- ✅ Works fully
- ❌ Known to fail
- ❓ Untested/Unknown

---

## Technical Explanation

### Why TTS Fails on Some Browser/Site Combinations

#### The Offscreen Documents API

Text-to-speech (TTS) playback on CSP-restrictive sites requires the [Chrome Offscreen Documents API](https://developer.chrome.com/docs/extensions/reference/offscreen/):

- **Available on**: Chrome Desktop (v116+), Edge Desktop (v116+)
- **Not available on**: Firefox, Safari, Mobile browsers

**How it works:**
1. Extension creates an offscreen document (separate context from host page)
2. Offscreen document has permissive CSP (extension's own policy)
3. `<audio>` element in offscreen plays TTS from api.saypi.ai
4. Events proxied back to content script via message passing

**Code references:**
- Detection: [`UserAgentModule.ts:69-82`](../src/UserAgentModule.ts#L69-L82) (`likelySupportsOffscreen()`)
- Bridge: [`OffscreenAudioBridge.js:49-82`](../src/audio/OffscreenAudioBridge.js#L49-L82)
- Offscreen handler: [`audio_handler.ts:127-191`](../src/offscreen/audio_handler.ts#L127-L191)

#### Content Security Policy (CSP) Restrictions

Some sites enforce strict `media-src` CSP that blocks audio from external origins:

**Pi.ai** (Permissive):
```
media-src 'self' blob: data: https:
```
→ Allows api.saypi.ai ✅

**Claude.ai** (Restrictive):
```
media-src 'self' blob: data: https://cdn.jsdelivr.net
```
→ Blocks api.saypi.ai ❌

**ChatGPT** (Restrictive):
```
media-src 'self' blob: data:
```
→ Blocks api.saypi.ai ❌

**Fallback Strategy:**
- Browsers without offscreen fall back to in-page `<audio>` element
- In-page audio subject to host page's CSP
- CSP blocks media from api.saypi.ai → TTS fails

**Console error** (Firefox/Safari on Claude.ai):
```
Content-Security-Policy: The page's settings blocked the loading of a resource
(media-src) at https://api.saypi.ai/speak/.../stream?voice_id=...
```

**Code references:**
- Fallback logic: [`AudioModule.js:166-193`](../src/audio/AudioModule.js#L166-L193)
- In-page audio: [`AudioModule.js:200-226`](../src/audio/AudioModule.js#L200-L226)

### Why VAD/STT Generally Works

Voice Activity Detection (VAD) and Speech-to-Text work across more browsers because:

1. **Dual Strategy**:
   - Offscreen VAD when available (Chrome/Edge desktop)
   - Onscreen VAD fallback (Firefox, Safari, mobile)

2. **No CSP Conflicts**:
   - Microphone access via `getUserMedia()` not subject to CSP
   - WASM/ONNX models loaded from extension resources
   - No external media loading required

3. **Progressive Enhancement**:
   - Gracefully degrades to browser capabilities
   - Works in most modern browsers

**Known VAD Issues:**
- **Kiwi Browser + Claude.ai**: "no available backend found" error
  - WASM/ONNX Runtime compatibility issue
  - See [`OnscreenVADClient.ts:40-60`](../src/vad/OnscreenVADClient.ts#L40-L60)

**Code references:**
- Offscreen VAD: [`vad_handler.ts`](../src/offscreen/vad_handler.ts)
- Onscreen fallback: [`OnscreenVADClient.ts`](../src/vad/OnscreenVADClient.ts)
- Detection: [`OffscreenVADClient.ts`](../src/vad/OffscreenVADClient.ts)

---

## User Notification Flow

### When and How Compatibility Notifications Appear

The TTS unavailability notification is shown **once per page load** when specific conditions are met:

**Trigger Conditions:**
1. ✅ User visits a **CSP-restrictive site** (Claude.ai or ChatGPT)
2. ✅ Using a **browser without offscreen support** (Firefox, Safari, or mobile browsers)

**Timing:** The notification appears **immediately** during extension initialization:
```
Page Load → Extension Init → AudioModule.start() → showTTSUnavailableNotification()
                                    ↓
                            (≈50-100ms after page load)
```

**Visual Appearance:**
- **Icon**: ℹ️ "info" icon
- **Duration**: 30 seconds auto-dismiss
- **Dismissal**: Click anywhere on notification to dismiss immediately
- **Position**: Standard notification area (top-right or as defined by CSS)

**Example Message** (Firefox Mobile + Claude.ai):
```
┌─────────────────────────────────────────────────────┐
│ ℹ️  Heads up! Speech playback isn't available on   │
│    Firefox Mobile with Claude yet. The good news?  │
│    Voice input works great! For TTS, try Chrome    │
│    or Edge on desktop.                              │
└─────────────────────────────────────────────────────┘
    (Click to dismiss or auto-dismiss in 30s)
```

**Code Flow:**
1. **[saypi.index.js:42-45](../src/saypi.index.js#L42-L45)** - Initialize CompatibilityNotificationUI early
2. **[AudioModule.js:132-136](../src/audio/AudioModule.js#L132-L136)** - Check TTS compatibility during `start()`
3. **[BrowserCompatibilityModule.ts:50-81](../src/compat/BrowserCompatibilityModule.ts#L50-L81)** - Detect issues, emit events
4. **[CompatibilityNotificationUI.ts:43-51](../src/compat/CompatibilityNotificationUI.ts#L43-L51)** - Listen for events, show notifications
5. **[UserAgentModule.ts:89-115](../src/UserAgentModule.ts#L89-115)** - Browser/site compatibility check logic

**Architecture:**
```
┌─────────────────────────────────────────┐
│   BrowserCompatibilityModule            │
│   - Centralized compatibility checks     │
│   - Emits compatibility:issue events     │
│   - No UI concerns                       │
└─────────────────────────────────────────┘
                    │
                    │ emits events
                    ↓
┌─────────────────────────────────────────┐
│   CompatibilityNotificationUI            │
│   - Listens for compatibility events     │
│   - Shows user-friendly notifications    │
│   - Manages notification lifecycle       │
└─────────────────────────────────────────┘
```

**Key Design Decisions:**
1. **Separation of Concerns**: Compatibility detection (BrowserCompatibilityModule) is decoupled from UI (CompatibilityNotificationUI)
2. **Event-Driven**: Modules communicate via EventBus for loose coupling
3. **Early Initialization**: CompatibilityNotificationUI initialized before AudioModule to avoid race conditions
4. **Single Responsibility**: AudioModule focuses on audio, not browser detection or UI notifications

---

## User Recommendations by Scenario

### Scenario 1: Firefox/Safari User on Claude.ai or ChatGPT
**Symptoms:** Voice input works, but no speech playback

**Recommendation:**
> "Heads up! Speech playback isn't available on [Browser] with [Chatbot] yet. The good news? Voice input works great! For TTS, try Chrome or Edge on desktop."

**Why:** Browser lacks offscreen API, host page CSP blocks in-page audio from api.saypi.ai

**Workaround:** Use Chrome or Edge on desktop for full features

### Scenario 2: Mobile User (Any Browser) on Claude.ai or ChatGPT
**Symptoms:** Voice input works, but no speech playback

**Recommendation:**
> "Speech playback isn't supported on mobile browsers with [Chatbot] yet. Voice input works! For TTS, try Chrome or Edge on desktop."

**Why:** Mobile browsers don't support offscreen API, CSP blocks fallback

**Workaround:** Use desktop Chrome/Edge for full features

### Scenario 3: Kiwi Browser User on Claude.ai
**Symptoms:** Neither voice input nor speech playback work

**Recommendation:**
> "We're sorry, but Kiwi Browser doesn't fully support voice features with Claude. Please try using a desktop browser like Chrome or Edge."

**Why:** WASM backend issues block VAD, no offscreen blocks TTS

**Workaround:** Use Chrome/Edge on desktop or different mobile browser

### Scenario 4: Any Browser on Pi.ai
**Symptoms:** Should work fully

**Status:** ✅ Pi.ai has permissive CSP allowing TTS on all browsers

**Note:** If issues occur, check browser console for errors

---

## Testing & Validation

### How to Test Compatibility

1. **TTS Test:**
   - Start voice chat
   - Wait for AI response
   - Check if audio plays
   - Check browser console for CSP errors

2. **VAD Test:**
   - Click microphone/call button
   - Speak into microphone
   - Check if VAD detects speech (visual indicator)
   - Check if transcription appears

3. **Browser Console Checks:**
   - CSP violations: Look for `Content-Security-Policy` errors
   - Offscreen support: Check `[OffscreenAudioBridge]` log messages
   - VAD issues: Look for `no available backend found`

### Debug Logging

Enable debug logging by opening browser console and checking for:

```
[AudioModule] Using offscreen audio: false
[OffscreenAudioBridge] Firefox detected - offscreen documents not supported
[SayPi Audio Handler] Audio playback started successfully
```

**Key indicators:**
- `Using offscreen audio: false` → TTS may fail on CSP-restrictive sites
- `Firefox/Safari detected` → Browser lacks offscreen support
- CSP error → Site blocks api.saypi.ai media

---

## Progressive Enhancement Strategy

The extension follows a **progressive enhancement** philosophy:

### Core Principles

1. **Feature Detection Over Browser Detection**
   - Check for `chrome.offscreen` API availability
   - Gracefully degrade when unavailable

2. **Fallback Chains**
   - TTS: Offscreen → In-page → Fail gracefully with notification
   - VAD: Offscreen → Onscreen → Fail gracefully with error message

3. **User Communication**
   - Clear, friendly notices when features unavailable
   - Explain what works vs. what doesn't
   - Provide actionable recommendations

4. **No Silent Failures**
   - Always inform user of compatibility issues
   - Log detailed debug info for troubleshooting

**Code examples:**
- Offscreen detection: [`UserAgentModule.ts:69-82`](../src/UserAgentModule.ts#L69-L82)
- TTS fallback: [`AudioModule.js:124-194`](../src/audio/AudioModule.js#L124-L194)
- User notifications: [`NotificationsModule.ts`](../src/NotificationsModule.ts)

---

## Future Compatibility Improvements

### Potential Solutions for TTS on Non-Chromium Browsers

1. **Background Service Worker Audio Proxy** (Firefox/Safari)
   - Fetch audio in background worker
   - Convert to blob/data URL
   - Pass to content script
   - Status: Under investigation

2. **API Request Routing** (Implemented for non-media requests)
   - Route API calls through background to bypass CSP
   - Currently used for transcription/auth
   - See: [`CSP_BYPASS_IMPLEMENTATION.md`](CSP_BYPASS_IMPLEMENTATION.md)
   - Media streaming requires different approach

3. **Site-Specific Permissions Request**
   - Request `media-src https://api.saypi.ai` permission
   - Browser APIs may not support this
   - Status: Researching feasibility

4. **Alternative TTS Providers**
   - Use browser's native Web Speech API as fallback
   - Quality/voice consistency concerns
   - Limited voice options

### ChatGPT Compatibility Status

**Current:** Untested, likely same CSP restrictions as Claude.ai

**To verify:**
1. Test Chrome desktop (should work with offscreen)
2. Test Firefox/Safari desktop (likely CSP blocked)
3. Document ChatGPT's CSP policy
4. Update compatibility matrix

---

## Related Documentation

- [CSP Bypass Implementation](CSP_BYPASS_IMPLEMENTATION.md) - API request routing
- [Media CSP Resolution PRD](../scripts/PRD_Media_CSP_Resolution.md) - Original TTS CSP solution
- [VAD CSP Resolution PRD](../scripts/PRD_VAD_CSP_Resolution.md) - VAD offscreen solution
- [Architecture Overview](../CLAUDE.md#architecture-overview) - System design

---

## Changelog

### 2025-01-05
- Initial compatibility matrix created
- Documented offscreen API requirements
- Explained CSP restrictions for Claude.ai, ChatGPT
- Added user recommendations per scenario
- Documented progressive enhancement strategy

---

**Maintained by:** Say, Pi Team
**Last Updated:** 2025-01-05
**Version:** 1.0.0
