# Manual Test for Empty Transcription Bug Fix

This document describes how to manually test the fix for issue #174.

## Problem Statement
When dictating text, if speech is transcribed as an empty string (filtered response), the dictation machine remains in the transcribing state and the icon stays blue indefinitely.

## Root Cause
TranscriptionModule was not emitting `saypi:transcribedEmpty` to EventBus, so UniversalDictationModule never received the event.

## Fix
Added `EventBus.emit("saypi:transcribedEmpty")` in TranscriptionModule.ts line 380.

## Manual Testing Steps

### Setup
1. Build and install the browser extension
2. Navigate to a site with text inputs (any website with forms)
3. Click on a text input field
4. The Say Pi dictation button should appear

### Test Scenario 1: Normal Transcription (Control Test)
1. Click the dictation button → Icon should be green (listening)
2. Say "Hello world" → Icon should turn blue briefly (transcribing), then green (ready)
3. Text should appear in the input field
4. **Expected**: Icon returns to green, ready for more input

### Test Scenario 2: Empty Transcription (Bug Test)
1. Click the dictation button → Icon should be green (listening)  
2. Say something that typically gets filtered by transcription API, such as:
   - "Like and subscribe for more"
   - "Thanks for watching"
   - Background noise or unclear speech
3. **Before Fix**: Icon would stay blue indefinitely
4. **After Fix**: Icon should return to green, allowing user to continue dictating

### Test Scenario 3: Multiple Empty Transcriptions
1. Click the dictation button
2. Make several attempts that result in empty transcriptions
3. **Expected**: Each attempt should return icon to green state
4. Eventually say something clear like "Hello world"
5. **Expected**: Normal transcription should work and text should appear

### Visual States Reference
- **Black & White Icon**: Dictation is off/idle
- **Green Icon**: Listening for speech or ready to listen
- **Blue Icon**: Transcribing speech to text
- **Red Icon**: Error state

### API Response Patterns
Empty transcriptions occur when the STT API filters out responses it considers likely hallucinations:
- API returns `{"text": "", "sequenceNumber": X}` 
- Common with background noise, music, or phrases like "Thanks for watching!"

### Debugging
If the bug still occurs:
1. Open browser dev tools
2. Check for `[UniversalDictationModule] Forwarding empty transcription to dictation machine` logs
3. If this log doesn't appear, the EventBus emit is not working
4. If it does appear but icon stays blue, check DictationMachine state transitions

### Success Criteria
✅ Icon never gets stuck in blue state  
✅ User can continue dictating after empty transcriptions  
✅ Normal transcriptions still work correctly  
✅ Multiple empty transcriptions don't break the flow