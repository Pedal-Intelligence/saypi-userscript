/**
 * Apply the non-standard `slider-value` attribute to a settings mode-selector
 * icon via a Preact `ref` — Preact's JSX types don't cover arbitrary
 * attributes, so this is the type-clean way to keep the markup byte-faithful.
 * Shared by the Chat and Dictation mode selectors. `slider-value` is rendered
 * for fidelity; production code reads `icon.id` and the range `.value`.
 */
export function setSliderValue(value: string) {
  return (el: HTMLElement | null) => {
    if (el) el.setAttribute("slider-value", value);
  };
}
