# ChatGPT DOM Reference Files

This directory contains example HTML snippets extracted from chatgpt.com, used as reference samples when writing algorithms that interact with the ChatGPT user interface.

## Purpose

These HTML files serve as:
- **Reference documentation** for ChatGPT's DOM structure
- **Test fixtures** for developing UI interaction algorithms
- **Historical snapshots** of ChatGPT's interface evolution
- **Development aids** for writing robust selectors and interaction code

## File Descriptions

- `action-bar-with-more-actions.html` - Action bar with ellipsis menu containing additional actions
- `agent-turn-article.html` - Complete assistant message turn container
- `assistant-turn-article-maintenance-message.html` - Assistant turn with maintenance/system message
- `assistant-turn-article.html` - Standard assistant message turn
- `chatgpt-dom-analysis.md` - Analysis and documentation of ChatGPT's DOM patterns
- `chatgpt-genesis.html` - Initial/empty ChatGPT conversation state
- `chatgpt-with-messages.html` - Full conversation with multiple messages
- `chatgpt.html` - Main ChatGPT page structure
- `more-actions-menu-radix-popper.html` - Dropdown menu structure (Radix UI)
- `more-actions.html` - More actions menu content
- `read-aloud-button.html` - Native read-aloud button element
- `user-message-bubble.html` - User message container structure

## Usage

When developing ChatGPT integration features:

1. **Selector Development**: Use these files to test CSS selectors locally
2. **DOM Navigation**: Reference the structure when writing traversal algorithms  
3. **Regression Testing**: Compare current live DOM against these snapshots
4. **Feature Planning**: Understand available UI elements and their relationships

## Validity

These HTML samples are valid as of **September 17, 2025**. 

ChatGPT's interface evolves regularly, so these files should be updated periodically to maintain accuracy. When updating, preserve the existing files with date suffixes (e.g., `assistant-turn-article-2025-09-17.html`) to maintain historical reference.

## Related Code

The primary ChatGPT integration logic can be found in:
- `src/chatbots/ChatGPT.ts` - Main ChatGPT chatbot implementation
- `src/chatbots/chatgpt/` - ChatGPT-specific selector and utility modules
- `test/chatbots/ChatGPT.spec.ts` - Unit tests that may reference these files

## Maintenance

When ChatGPT's UI changes significantly:
1. Extract new HTML samples using browser developer tools
2. Update the corresponding files in this directory
3. Update the validity date in this README
4. Test and update related selector logic in the codebase
5. Consider archiving old versions with date suffixes if breaking changes occur
