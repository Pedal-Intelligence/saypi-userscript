# [BUG] Universal Dictation Incompatible with Lexical Rich Text Editors (e.g., Perplexity AI)

## Description

The Universal Dictation feature is incompatible with rich text editors built on the Lexical framework, a prime example being the prompt editor on `perplexity.ai`. Lexical-based editors rely on an internal state model and do not support the direct DOM manipulation our dictation feature currently uses.

### The Problem

The core issue lies within the `setTextInTarget()` function in `src/state-machines/DictationMachine.ts`. The current strategy of directly setting `target.textContent` and then dispatching an `input` event is fundamentally incompatible with how the Lexical framework operates.

Lexical editors maintain their own internal state model (an "Editor State"). Our current implementation bypasses this model by manipulating the DOM directly. When the `input` event is subsequently dispatched, Lexical's internal reconciler detects a discrepancy between its state and the actual DOM. It then reverts the DOM to match its authoritative internal state, causing the dictated text to be erased.

## Steps to Reproduce

1.  Navigate to `https://www.perplexity.ai/`.
2.  Focus the main prompt input field ("Ask anything or @mention a Space").
3.  Activate Universal Dictation using the Say, Pi button or the context menu.
4.  Begin speaking a phrase, for example, "Hello, world".
5.  Observe the input field.

## Expected Behavior

The transcribed text "Hello, world" should appear and persist in the Perplexity prompt editor, as if it were typed manually by the user.

## Actual Behavior

The text "Hello, world" appears briefly in the input field and then is immediately cleared, leaving the field empty again.

## Technical Context

The `setTextInTarget` function in `src/state-machines/DictationMachine.ts` is the primary location for this logic.

The Perplexity prompt editor is built on the Lexical framework, as indicated by the `data-lexical-editor="true"` attribute in its HTML. It is not a simple `contenteditable` div and requires a specific interaction pattern that respects its internal state model.

**Editor HTML (Empty):**
```html
<div class="..." contenteditable="true" id="ask-input" data-lexical-editor="true" ...>
  <p><br></p>
</div>
```

**Editor HTML (With Text "Hello, world"):**
```html
<div class="..." contenteditable="true" id="ask-input" data-lexical-editor="true" ...>
  <p dir="ltr"><span data-lexical-text="true">Hello, world</span></p>
</div>
```

Directly setting `textContent` bypasses the editor's required structure, leading to the state reconciliation issue.

## Acceptance Criteria

-   **Primary Goal:** Universal Dictation must successfully and persistently insert text into the `perplexity.ai` prompt editor.
-   **Secondary Goal:** The solution must be designed in a scalable and extensible manner. It should be possible to add support for other websites with different rich text editors (particularly other Lexical-based ones) in the future without a complete refactor. The implementation should anticipate that different sites may require unique strategies for text insertion. 


# Background

**Lexical** is an extensible JavaScript framework for building web-based text editors. It was developed by Meta (formerly Facebook) and is used across their products like Facebook, Instagram, and WhatsApp.

Here are its key characteristics:

*   **It's a Framework, Not a Ready-Made Editor:** Lexical provides the core engine and tools to build a text editor, but it doesn't come with a pre-built user interface (like toolbars with bold or italic buttons). This gives developers complete control over the editor's appearance and functionality.

*   **Reliability and Performance:** It's designed to be lightweight and fast. The core package is small, and features can be added as plugins, so you only pay the performance cost for the features you actually use.

*   **Accessibility:** It is built with accessibility in mind, adhering to WCAG standards to work well with screen readers and other assistive technologies.

*   **State Management, Not Direct DOM Manipulation:** The most important concept, and the one relevant to the issue we documented, is that Lexical manages the editor's content through an internal **Editor State**. The DOM (what the user sees) is a reflection of this state.
    *   Instead of directly changing the HTML inside the `contenteditable` element, developers use Lexical's API to update the internal state.
    *   Lexical then uses its own "DOM reconciler" (similar to a virtual DOM in React) to efficiently update only the parts of the visible DOM that have changed.

Attempting to directly set `textContent` or manipulate the DOM may fail on Lexical editors. Manipulating the DOM directly conflicts with the state managed by the Lexical framework, causing it to reject our changes. To properly interact with a Lexical-based editor, one should use its specific update functions and APIs.