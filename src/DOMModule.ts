export function appendChild(
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
      const referenceIndex = parent.children.length + position;
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
