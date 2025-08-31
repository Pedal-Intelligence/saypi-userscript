/**
 * Lightweight, testable helpers for locating ChatGPT's unified composer parts.
 * These avoid importing heavy chatbot classes to keep tests simple and prevent cycles.
 */

export function findComposerForm(searchRoot: Element | Document): HTMLFormElement | null {
  const root = (searchRoot as Document) || (searchRoot.ownerDocument as Document) || document;
  return (
    (searchRoot instanceof Element && (searchRoot.closest('form[data-type="unified-composer"]') as HTMLFormElement)) ||
    (searchRoot.querySelector?.('form[data-type="unified-composer"]') as HTMLFormElement) ||
    (root.querySelector('form[data-type="unified-composer"]') as HTMLFormElement)
  );
}

export function findPromptInputInComposer(searchRoot: Element | Document): HTMLElement | null {
  const composerForm = findComposerForm(searchRoot);
  const scopedRoot: Element | Document = (composerForm as Element) || searchRoot || document;

  let prompt = scopedRoot.querySelector?.(
    '#prompt-textarea.ProseMirror[contenteditable="true"]'
  ) as HTMLElement | null;
  if (!prompt) {
    prompt = scopedRoot.querySelector?.('.ProseMirror[contenteditable="true"]') as HTMLElement | null;
  }
  if (!prompt) {
    prompt = document.querySelector(
      '#prompt-textarea.ProseMirror[contenteditable="true"], form[data-type="unified-composer"] .ProseMirror[contenteditable="true"]'
    ) as HTMLElement | null;
  }
  return prompt;
}

export function findControlsContainerInComposer(searchRoot: Element | Document): HTMLElement | null {
  const composerForm = findComposerForm(searchRoot);
  const scopedRoot: Element | Document = (composerForm as Element) || searchRoot || document;
  const controls =
    (scopedRoot.querySelector?.('[grid-area="trailing"] .ms-auto') as HTMLElement | null) ||
    (scopedRoot.querySelector?.('[grid-area="trailing"]') as HTMLElement | null) ||
    (scopedRoot.querySelector?.('.ms-auto') as HTMLElement | null);

  if (controls) return controls;

  const anyButton = scopedRoot.querySelector?.('button') as HTMLElement | null;
  return anyButton?.parentElement || null;
}

export function getScopedSubmitSelector(): string {
  return [
    'form[data-type="unified-composer"] button[type="submit"]',
    'form[data-type="unified-composer"] [data-testid="send-button"]',
    'form[data-type="unified-composer"] button[aria-label*="Send" i]',
    'form[data-type="unified-composer"] button[title*="Send" i]'
  ].join(', ');
}
