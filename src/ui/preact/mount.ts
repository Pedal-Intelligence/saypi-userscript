import { render, type ComponentChild } from "preact";

/**
 * Light-DOM Preact mount registry.
 *
 * Tracks every container we render a Preact tree into so that unmount is
 * idempotent and the bootstrap find/decorate lifecycle can tear down any tree
 * under a host node the SPA removed (unmountAllUnder), running each component's
 * effect cleanup instead of orphaning its listeners. Preact 10 unmounts and
 * runs hook cleanup when you render `null` into a container, so we do not need
 * preact/compat's unmountComponentAtNode.
 *
 * No Shadow DOM: injected widgets render into the host's light DOM so they
 * inherit host CSS (see doc/preact-component-conventions.md).
 */
const mountedContainers = new Set<Element>();

/** Render `vnode` into `container`; remember the container for cleanup. */
export function mountInto(container: Element, vnode: ComponentChild): void {
  render(vnode, container);
  mountedContainers.add(container);
}

/** Unmount any Preact tree previously mounted into `container`. Idempotent. */
export function unmountFrom(container: Element): void {
  if (!mountedContainers.has(container)) return;
  render(null, container);
  mountedContainers.delete(container);
}

/**
 * Unmount every tracked container that is `node` or a descendant of it. Call
 * from the bootstrap removed-nodes path so host-driven DOM removals trigger
 * Preact cleanup.
 */
export function unmountAllUnder(node: Node): void {
  for (const container of [...mountedContainers]) {
    if (node === container || node.contains(container)) {
      unmountFrom(container);
    }
  }
}

/** Number of currently mounted containers (diagnostics + tests). */
export function mountedCount(): number {
  return mountedContainers.size;
}
