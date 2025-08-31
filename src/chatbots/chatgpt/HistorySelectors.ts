/**
 * Chat history helpers for ChatGPT.
 */

export function findThreadRoot(searchRoot: Element | Document = document): HTMLElement | null {
  const doc = (searchRoot instanceof Document ? searchRoot : searchRoot.ownerDocument) || document;
  const direct = (searchRoot as ParentNode).querySelector?.('#thread') as HTMLElement | null;
  if (direct) return direct;
  const global = doc.querySelector('#thread') as HTMLElement | null;
  if (global) return global;
  // Fallback: return a plausible ancestor around the composer form
  const composerForm = doc.querySelector('form[data-type="unified-composer"]');
  if (composerForm) {
    return (composerForm.parentElement?.parentElement || composerForm.parentElement) as HTMLElement;
  }
  return null;
}

