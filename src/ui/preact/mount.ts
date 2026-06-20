import { render, type ComponentChild } from "preact";

/**
 * Light-DOM Preact mount registry.
 *
 * Tracks every container we render a Preact tree into so that unmount is
 * idempotent and a whole subtree can be torn down at once (unmountAllUnder),
 * running each component's effect cleanup instead of orphaning its listeners.
 * Preact 10 unmounts and runs hook cleanup when you render `null` into a
 * container, so we do not need preact/compat's unmountComponentAtNode.
 *
 * NOTE: unmountAllUnder is *intended* for the bootstrap find/decorate lifecycle
 * to call on host-driven DOM removals, but that wiring is NOT in place yet
 * (deferred). Until it is, anything mounted into a node the host SPA can remove
 * must unmount itself — see doc/preact-component-conventions.md.
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
 * Unmount every tracked container that is `node` or a descendant of it.
 * Intended to be called from the bootstrap removed-nodes path so host-driven
 * DOM removals trigger Preact cleanup — but that wiring is not in place yet, so
 * for now call this directly when you remove a host node you mounted into.
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
