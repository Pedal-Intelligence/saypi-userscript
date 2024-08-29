/**
 * Append a child node to a parent node, either at a specific position or as the last child.
 * @param parent The parent node to add the child to.
 * @param child The node to add.
 * @param position If positive, indexed from the start of the parent's children. If negative, indexed from the end of the parent's children.
 */
export function addChild(
  parent: Element,
  child: Node,
  position: number = 0
): void {
  // Check if a container is provided.
  if (parent) {
    // If position is 0, simply append the button as the last child.
    if (position === 0) {
      parent.appendChild(child);
    } else {
      // Calculate the index of the reference node for insertBefore().
      const referenceIndex =
        position > 0 ? position : parent.children.length + position;
      const referenceNode = parent.children[referenceIndex];

      // If a reference node exists, insert the button before it.
      if (referenceNode) {
        parent.insertBefore(child, referenceNode);
      } else {
        // If not, append the button as the last child.
        parent.appendChild(child);
      }
    }
  } else {
    // If no container is provided, append the button to the body.
    document.body.appendChild(child);
  }
}

/**
 * Finds the root ancestor of an element.
 * @param element - The starting element.
 * @returns The root ancestor element or document.
 */
export function findRootAncestor(element: Element): Element {
  if (!element.parentElement || element.parentNode instanceof Document) {
    return element;
  }
  return findRootAncestor(element.parentElement);
}
