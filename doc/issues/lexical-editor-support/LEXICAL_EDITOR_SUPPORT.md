# Lexical Editor Support for Universal Dictation

This document describes the support for Lexical-based rich text editors in the Say, Pi Universal Dictation feature.

## Problem

The original Universal Dictation feature was incompatible with rich text editors built on the Lexical framework (e.g., Perplexity AI). Lexical editors maintain their own internal state model and don't support direct DOM manipulation that bypasses this state.

## Solution

We implemented a strategy pattern that detects different types of text input elements and uses appropriate text insertion methods:

### Detection

Lexical editors are detected by the presence of the `data-lexical-editor="true"` attribute combined with `contentEditable="true"`.

# Lexical Editor Support for Universal Dictation

This document describes the support for Lexical-based rich text editors in the Say, Pi Universal Dictation feature.

## Problem

The original Universal Dictation feature was incompatible with rich text editors built on the Lexical framework (e.g., Perplexity AI). Lexical editors maintain their own internal state model and don't support direct DOM manipulation that bypasses this state. When Lexical's reconciliation process runs (triggered by various events), it reverts any DOM changes that aren't reflected in its internal state model.

## Solution

We implemented a strategy pattern that detects different types of text input elements and uses appropriate text insertion methods. For Lexical editors, we use **keyboard event simulation** to work with Lexical's input handling mechanisms rather than bypassing them.

### Detection

Lexical editors are detected by the presence of the `data-lexical-editor="true"` attribute combined with `contentEditable="true"`.

### Text Insertion Strategy

For Lexical editors, the system now uses keyboard event simulation that integrates with Lexical's input handling:

**Primary Approach - Input Events:**
1. Focus the Lexical editor to ensure it's active
2. For replacement: Simulate Ctrl+A (select all) followed by Delete
3. Dispatch `beforeinput` event with `inputType: 'insertText'` and the target text
4. Follow with `input` event to complete the insertion process

**Fallback Approach - DOM Manipulation:**
If input event simulation fails, falls back to the previous DOM structure approach:

**Empty state:**
```html
<p><br></p>
```

**With text:**
```html
<p dir="ltr"><span data-lexical-text="true">Hello, world</span></p>
```

### Key Advantages

1. **State Compatibility**: Input events are processed by Lexical's internal state management
2. **Reconciliation Safe**: Changes made through input events are reflected in Lexical's internal state
3. **Event-driven**: Works with Lexical's existing event handling mechanisms
4. **Robust Fallback**: Falls back to DOM manipulation if input events are blocked

### Implementation Details

- **File:** `src/state-machines/DictationMachine.ts`
- **Functions:**
  - `isLexicalEditor()` - Detects Lexical editors
  - `setTextInLexicalEditor()` - Handles Lexical-specific text insertion with input events
  - `insertTextViaInputEvents()` - Simulates keyboard input for Lexical
  - `fallbackSetTextInLexicalEditor()` - DOM manipulation fallback
  - `setTextInTarget()` - Updated with strategy pattern

### Error Handling

The implementation includes robust error handling:
- Try-catch blocks around DOM manipulation
- Fallback to simple text content setting if Lexical structure creation fails
- Graceful cursor positioning failure handling

### Extensibility

The solution is designed to be extensible for other rich text editors:
- Strategy pattern allows easy addition of new editor types
- Clean separation between detection and insertion logic
- Minimal changes to existing functionality

## Testing

Comprehensive test suite covers:
- Basic Lexical editor detection and text insertion
- Text replacement scenarios
- Edge cases (malformed structure, special characters, long text, Unicode/emoji)
- Fallback behavior for standard contenteditable elements
- Error recovery scenarios

## Browser Compatibility

Works with all modern browsers that support:
- Lexical framework
- contentEditable
- DOM manipulation APIs

## Sites Supported

- Perplexity AI (`perplexity.ai`)
- Any other site using Lexical editors with `data-lexical-editor="true"` attribute