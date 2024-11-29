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

export function createElement(
  tag: string,
  attributes: Record<string, any> = {}
): HTMLElement {
  const element = document.createElement(tag);
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === "className") {
      element.className = value;
    } else if (key === "textContent") {
      element.textContent = value;
    } else if (key.startsWith("on")) {
      element.addEventListener(key.slice(2).toLowerCase(), value);
    } else {
      element.setAttribute(key, value);
    }
  });
  return element;
}

export function createSVGElement(svgString: string): SVGElement {
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
  const svgElement = svgDoc.documentElement;

  // Check if it's an SVG element by tag name, not just instance type
  if (svgElement.tagName.toLowerCase() === "svg") {
    return svgElement as unknown as SVGElement;
  }
  throw new Error(
    "Failed to create SVGElement. Invalid SVG string: " +
      svgString.slice(0, 100)
  );
}
