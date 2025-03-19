# AI Assistant Nickname Personalisation Feature Plan

## Overview

Users often refer to their AI assistant by a personal nickname (e.g., "Jen" or "Terry") instead of the default name (e.g., "Pi"). This feature will allow the transcription API to receive and process the nickname so that the agentic listening functionality can distinguish between the default name and the user's chosen nickname.

## Goals

- Allow users to set a personal nickname for their AI assistant in the extension's settings.
- Pass the nickname as an optional parameter to the transcription API (in the form data) so that the backend can use it for agentic listening.
- Fall back to the default name (e.g., "Pi") if no personal nickname is provided.

## Components to Modify

1. **User Preferences**
   - Update the `UserPreferenceModule` (if necessary) to store and retrieve the nickname.
   - Implement a `getNickname()` method which returns the nickname if set, otherwise the default name (possibly retrieved via `Chatbot.getName()`).

2. **Chatbot Interface** (src/chatbots/Chatbot.ts)
   - Add a new method `getNickname()` so that other modules can retrieve the user-defined nickname.
   - The implementation might simply call `userPreferences.getNickname()` or fallback to `this.getName()` if no nickname is set.

3. **Transcription Module** (src/TranscriptionModule.ts)
   - Modify the `constructTranscriptionFormData` function to accept an additional optional parameter (e.g., `nickname?: string`).
   - Before appending transcript-related parameters, read the nickname using the new `Chatbot.getNickname()` or directly from user preferences.
   - If a nickname is provided and it differs from the default name, append it as a new field (e.g., `formData.append("nickname", nickname)`).

4. **Settings UI** (popup.html)
   - Add a new section below the agentic listening section in the extension's settings.
   - Include a text input for the nickname.
   - The text input should have a default placeholder text of "Pi".
   - Update any associated JavaScript (e.g., popup.js) to save this preference via the `UserPreferenceModule`.

5. **Backend (Transcription API)**
   - Verify if the transcription API can handle an additional `nickname` parameter. If not, update its implementation to optionally consume this parameter for improved agentic listening.
   
6. **Testing and Documentation**
   - Write unit and integration tests to ensure that the feature works as intended.
   - Update project documentation and user guides to reflect the new personalization feature.

## Development Steps

1. **Backend & API Changes**
   - Confirm API capability for an optional `nickname` field. [DONE]

2. **Update User Preferences**
   - Implement and test the `getNickname()` method in the preferences module. [DONE]

3. **Update Chatbot Interface**
   - Add `getNickname()` to the interface in Chatbot.ts. [DONE]

4. **Transcription Module Changes**
   - Modify `constructTranscriptionFormData` to include the nickname if provided. [DONE]
   - Test that the nickname is correctly appended to the form data. [DONE]

5. **UI Enhancements**
   - Update popup.html to include a new input field for the nickname below the agentic listening section. [DONE]
   - Ensure the default placeholder displays "Pi". [DONE]
   - Update the related JavaScript to save and retrieve this preference. [DONE]

6. **Testing & QA**
   - Run local tests to ensure the nickname is passed correctly from the UI, stored in preferences, and sent with transcription requests.
   - Validate that fallback behavior works when no nickname is provided.

7. **Documentation & Release**
   - Update all relevant documentation with this new feature.
   - Communicate the changes to the team and prepare for a release.

## Potential Challenges

- Ensuring backward compatibility if users have not set a nickname.
- Coordination with backend to correctly handle the new `nickname` parameter.
- UI consistency in different extension views and browsers.

## Conclusion

This personalization feature will enhance user engagement by allowing a level of customization. It also supports improved agentic listening by enabling the system to recognize personalized nicknames, thereby making interactions feel more natural. 