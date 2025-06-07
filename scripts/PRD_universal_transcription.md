# Say, Pi v1.8.0 - Transcription Everywhere PRD

## Overview

Say, Pi v1.8.0 extends our proven speech recognition technology to work anywhere on the web. Users can dictate text into any input field using the same high-quality Whisper-powered transcription that powers our AI chat features.

**Problem**: Existing voice typing solutions suffer from poor accuracy (Voice In) or high latency (Voicy), forcing users to choose between speed and quality.

**Solution**: Real-time streaming transcription with Whisper-level accuracy at competitive pricing.

**Target Users**: Knowledge workers, accessibility users, and anyone who prefers speaking to typing.

## Core Features

### Universal Voice Input
- **What**: Voice-to-text in any text field or textarea on any website
- **Why**: Users want Say, Pi's transcription quality everywhere, not just in AI chats
- **How**: Inject transcription capability via content scripts, activated through context menu, keyboard shortcut, or floating icon

### Real-time Streaming
- **What**: Text appears as you speak with low latency
- **Why**: Batch processing (like Voicy) can create unnecessary 5-10 second waits on long speech, and lack realtime feedback
- **How**: Leverage existing Say, Pi streaming architecture

### Intelligent Auto-punctuation
- **What**: Automatic insertion of periods, commas, and capitalization
- **Why**: Speaking punctuation (like VoiceIn) breaks natural flow and sounds awkward
- **How**: Existing Say, Pi punctuation model (Whisper and LLM enrichement)

### Multi-language Support
- **What**: 30+ languages with auto-detection option
- **Why**: Say, Pi users are global and multilingual
- **How**: Existing language capabilities from chat feature

## User Experience

### User Personas
1. **Professional Writer**: Composes emails, documents, and messages faster
2. **Accessibility User**: Physical limitations make typing difficult or painful
3. **Multitasker**: Needs hands-free input while referencing other materials

### Key User Flows
1. **Context Menu Flow**:
   - User right-clicks in text field
   - Selects "Dicate"
   - Speaks naturally
   - Text appears in real-time
   - Intelligent endpointing ends dictation

2. **Keyboard Shortcut Flow**:
   - User presses Cmd/Ctrl+Space in text field
   - Microphone icon indicates recording
   - Speaks and sees real-time transcription
   - Press shortcut again or pause to end

3. **Floating Icon Flow**:
  - Say, Pi Icon (Post-MVP)
  - Appears on field focus
  - Right-aligned within input field
  - Single click to activate
  - Consistent with existing Say, Pi design language

### UI/UX Considerations
- Zero visual footprint until activated
- Familiar right-click menu integration
- Consistent with existing Say, Pi design language
- Clear visual feedback during recording
- Graceful degradation on unsupported sites

## Technical Architecture

### System Components
- **Content Script**: Injected into all frames, handles DOM manipulation
- **Background Service**: Manages communication between content script, offscreen document processors, and settings page
- **Existing Transcription Engine**: Reuse current transcription API. Create a new "dicatation machine" FSM as a simplified version of full-fat "conversation machine" FSM (SayPiMachine.ts) to manage dictation state. Similar to conversation machine and reuses many sub-parts, but doesn't have to manage turn-taking or assistant state.
- **Settings Storage**: New voice input preferences tab in settings popup

### Data Flow
1. User activates transcription
2. Audio captured via existing VAD
3. Streamed to transcription service
4. Results injected into active field
5. Proper input events fired for compatibility

### Field Support (MVP)
- Standard `<input type="text">` elements
- `<textarea>` elements
- Basic contenteditable (no rich text)

### Browser APIs
- Chrome extension APIs for content script injection
- Standard DOM manipulation for text insertion

## Development Roadmap

### Phase 1: MVP (v1.8.0)
**Scope**: Basic transcription in standard text fields
- Context menu integration ("Start dictation with Say, Pi")
- Support for input and textarea elements
- Real-time streaming with auto-punctuation
- Settings UI for shortcut configuration
- Usage analytics

### Phase 2: Enhanced Compatibility
**Scope**: Broader website support
- Say, Pi icon in focused fields
- Keyboard shortcut (Cmd/Ctrl+Space, configurable)
- Rich text editor support (Gmail, Google Docs)
- Contenteditable improvements
- Framework-specific handling (React, Vue)

## Risks and Mitigations

### Technical Risks
- **Cross-origin restrictions**: Some sites block content scripts
  - *Mitigation*: Offscreen processing where supported, Graceful degradation where not, clear user messaging
  
- **DOM complexity**: React/Vue virtual DOMs may conflict
  - *Mitigation*: Start with standard fields, iterate based on usage

- **Performance impact**: Content scripts on every page
  - *Mitigation*: Lazy initialization, only activate when needed, lightweight bootstrap/entrypoint scripts only loading full-fat chatbot content scripts when needed

### Product Risks
- **Feature discovery**: Users may not know it exists
  - *Mitigation*: Onboarding tooltip on first install
  
- **Accuracy expectations**: Users expect perfection
  - *Mitigation*: Match current Say, Pi quality standards

### Business Risks
- **Support burden**: New feature = new issues
  - *Mitigation*: Comprehensive FAQ, start with simple MVP

## Appendix

### Market Reality Check
- Voice In: ~600k installs, likely 1-2% paying = ~10k subscribers
- Voicy: Smaller user base, ~$8/month
- Say, Pi advantage: Better accuracy + lower latency + existing user base

### Competitive Pricing
- Say, Pi Plus: $5/month (vs Voicy $8/month)
- Say, Pi Pro: $10/month (vs Dragon $25-200/month)

### Technical Notes
- Reuse existing Whisper integration
- Adapt conversation FSM for simpler transcription FSM
- Leverage existing language detection and punctuation models