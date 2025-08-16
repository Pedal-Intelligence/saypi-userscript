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

/**
 * Compute caret-relative context around the current cursor for the target element.
 * Produces text immediately before and after the caret (clipped), plus the absolute
 * cursor position within the element's plain text content.
 */
export function getCaretContext(
  target: HTMLElement,
  clipChars: number = 800
): { fieldTextBefore?: string; fieldTextAfter?: string; cursorPosition?: number } {
  const fullText = getElementText(target);

  // Helper to slice with bounds checking
  const sliceAround = (text: string, pos: number) => {
    const start = Math.max(0, pos - clipChars);
    const end = Math.min(text.length, pos + clipChars);
    return {
      before: text.slice(start, pos),
      after: text.slice(pos, end),
    };
  };

  // Inputs and textareas have reliable selection APIs
  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
    const value = (target as HTMLInputElement | HTMLTextAreaElement).value || "";
    const caret = typeof target.selectionStart === "number" && target.selectionStart !== null
      ? target.selectionStart
      : value.length;
    const { before, after } = sliceAround(value, caret);
    return { fieldTextBefore: before, fieldTextAfter: after, cursorPosition: caret };
  }

  // Contenteditable: approximate using DOM Range up to caret
  if (target.contentEditable === "true") {
    try {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        // Ensure the caret is inside the target element
        if (target.contains(range.endContainer)) {
          const preRange = range.cloneRange();
          preRange.selectNodeContents(target);
          preRange.setEnd(range.endContainer, range.endOffset);
          const caretPos = preRange.toString().length;
          const { before, after } = sliceAround(fullText, caretPos);
          return { fieldTextBefore: before, fieldTextAfter: after, cursorPosition: caretPos };
        }
      }
    } catch (_) {
      // fall through to default below
    }
    // Fallback: assume caret at end
    const caretPos = fullText.length;
    const { before, after } = sliceAround(fullText, caretPos);
    return { fieldTextBefore: before, fieldTextAfter: after, cursorPosition: caretPos };
  }

  // Unknown element type: provide no context
  return {};
}

/**
 * Normalises textual content of inputs, textareas, and contenteditable elements.
 */
function getElementText(targetElement?: HTMLElement): string {
  if (!targetElement) return "";

  if (
    targetElement instanceof HTMLInputElement ||
    targetElement instanceof HTMLTextAreaElement
  ) {
    return targetElement.value || "";
  }

  if (targetElement.contentEditable === "true") {
    const innerHTML = targetElement.innerHTML || '';
    let normalizedHTML = innerHTML
      .replace(/<br\s*\/?>(\s*)<br\s*\/?>(?![^]*<br\s*\/?)/gi, '\n');
    let contentWithNewlines = normalizedHTML
      .replace(/<br\s*\/?/gi, '\n')
      .replace(/<div>/gi, '\n')
      .replace(/<\/div>/gi, '')
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&');
    return contentWithNewlines;
  }

  return "";
}
