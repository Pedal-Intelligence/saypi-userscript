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
  if (!svgString) {
    throw new Error("Failed to create SVGElement. SVG string is empty.");
  }

  let source = svgString.trim();

  if (source.startsWith("data:image/svg+xml")) {
    const commaIndex = source.indexOf(",");
    if (commaIndex === -1) {
      throw new Error(
        "Failed to create SVGElement. Invalid SVG data URI format: " +
          source.slice(0, 100)
      );
    }

    const metadata = source.slice(0, commaIndex);
    const payload = source.slice(commaIndex + 1);
    if (metadata.includes(";base64")) {
      try {
        if (typeof atob === "function") {
          source = atob(payload);
        } else {
          source = Buffer.from(payload, "base64").toString("utf8");
        }
      } catch (error) {
        throw new Error(
          "Failed to create SVGElement. Could not decode base64 payload: " +
            (error instanceof Error ? error.message : String(error))
        );
      }
    } else {
      source = decodeURIComponent(payload);
    }
  }

  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(source, "image/svg+xml");
  const svgElement = svgDoc.documentElement;

  if (svgElement.tagName.toLowerCase() === "parsererror") {
    throw new Error(
      "Failed to create SVGElement. The provided SVG markup could not be parsed."
    );
  }

  if (svgElement.tagName.toLowerCase() === "svg") {
    const currentDocument = typeof document !== "undefined" ? document : null;
    if (currentDocument?.importNode) {
      return currentDocument.importNode(svgElement, true) as SVGElement;
    }
    return svgElement as unknown as SVGElement;
  }

  throw new Error(
    "Failed to create SVGElement. Invalid SVG string: " +
      source.slice(0, 100)
  );
}
