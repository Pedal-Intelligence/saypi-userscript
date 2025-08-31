/**
 * Assistant message content selectors observed across ChatGPT variants.
 * We keep this centralized and testable.
 */

export function getAssistantContentSelector(): string {
  // Union of common content containers
  return [
    '.markdown',
    '.prose',
    '[data-message-id]'
  ].join(', ');
}

export function getAssistantResponseSelectorScopedToThread(): string {
  // Prefer scoping to #thread to avoid accidental matches, but also expose global forms
  const base = getAssistantContentSelector();
  return ['#thread ' + base, base].join(', ');
}

export function findAssistantContent(root: ParentNode | Document = document): NodeListOf<HTMLElement> {
  const selector = getAssistantContentSelector();
  return root.querySelectorAll(selector) as NodeListOf<HTMLElement>;
}

