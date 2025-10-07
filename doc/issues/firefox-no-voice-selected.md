## Firefox: Claude Voice Off Triggers "No voice selected" Error

- **Environment:** Firefox (desktop), `chatbots/Claude.ts` host targeting claude.ai.
- **Summary:** When the Claude Voice Menu is set to "Voice off", calls produce a console error (`Error: No voice selected`). Voice-off sessions sometimes fail to submit the user's prompt to Claude after they finish speaking.

### Steps to Reproduce
1. Open claude.ai in Firefox.
2. In the Claude voice menu (`ClaudeVoiceMenu.ts`), select **Voice off**.
3. Start a call and speak to Claude.

### Expected Behaviour
After the user finishes speaking, their prompt should be submitted to Claude. Claude should respond with the usual streamed text output, and no audio should be played while voice is off.

### Actual Behaviour
- Console logs `Error: No voice selected`.
- The user's prompt intermittently fails to submit to Claude; sometimes it submits, other times it does not.

### Notes
- Error surfaces before any investigation into the root cause.
- Potential interference with turn-taking behaviour when TTS is disabled.
