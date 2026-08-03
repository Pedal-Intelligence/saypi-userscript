/**
 * Removal-detection logic for AudioModule's audio-element MutationObserver.
 *
 * Extracted from AudioModule.js because that module can't be imported by a test
 * (its constructor drags in the whole content-script bootstrap), and this
 * callback is exactly where two defects lived: it crashed on non-element
 * removed nodes (#589) and never matched the audio element itself (#590).
 */

/**
 * Whether `removedNode` is, or contains, the tracked audio element.
 *
 * `Node.contains()` is self-inclusive, so this covers both the direct-removal
 * case the observer is scoped to report (`subtree: false` → `removedNodes`
 * holds direct children of the observed parent) and the ancestor-container
 * case. It is defined on every Node, so text and comment nodes answer `false`
 * rather than throwing.
 */
export function removesAudioElement(
  removedNode: Node | null | undefined,
  audioElement: Node | null | undefined
): boolean {
  if (!removedNode || !audioElement) {
    return false;
  }
  return (
    typeof removedNode.contains === "function" &&
    removedNode.contains(audioElement)
  );
}

/**
 * Builds the MutationObserver callback that watches for the tracked audio
 * element being removed from its parent.
 *
 * @param getAudioElement reads the element currently tracked by AudioModule —
 *   a getter, not a value, because AudioModule reassigns `this.audioElement`.
 * @param onRemoved invoked once per batch when that element was removed.
 */
export function createAudioRemovalObserverCallback(
  getAudioElement: () => Node | null | undefined,
  onRemoved: () => void
): MutationCallback {
  return (mutations: MutationRecord[]) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      const audioElement = getAudioElement();
      for (const removedNode of mutation.removedNodes) {
        if (removesAudioElement(removedNode, audioElement)) {
          onRemoved();
          return;
        }
      }
    }
  };
}
