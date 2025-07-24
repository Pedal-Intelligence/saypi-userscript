# Lexical Editor Support for Universal Dictation

This document describes the support for Lexical-based rich text editors in the Say, Pi Universal Dictation feature.

## Problem

The original Universal Dictation feature was incompatible with rich text editors built on the Lexical framework (e.g., Perplexity AI). Lexical editors maintain their own internal state model and don't support direct DOM manipulation that bypasses this state.

## Solution

We implemented a strategy pattern that detects different types of text input elements and uses appropriate text insertion methods:

### Detection

Lexical editors are detected by the presence of the `data-lexical-editor="true"` attribute combined with `contentEditable="true"`.

### Text Insertion Strategy

For Lexical editors, the system creates the specific DOM structure that Lexical expects and **crucially avoids firing input events** that would trigger Lexical's reconciliation:

**Empty state:**
```html
<p><br></p>
```

**With text:**
```html
<p dir="ltr"><span data-lexical-text="true">Hello, world</span></p>
```

**Key Point:** Input events are NOT dispatched for Lexical editors because they cause Lexical to reconcile its internal state with the DOM, which would revert programmatic changes that aren't reflected in Lexical's internal state model.

### Implementation Details

- **File:** `src/state-machines/DictationMachine.ts`
- **Functions:**
  - `isLexicalEditor()` - Detects Lexical editors
  - `setTextInLexicalEditor()` - Handles Lexical-specific text insertion
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