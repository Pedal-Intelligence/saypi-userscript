/**
 * Body-portal tooltips for SayPi buttons.
 *
 * SayPi buttons live inside host containers that clip overflow (Pi's rounded
 * prompt box, ChatGPT's composer) and sit beneath high z-index chrome (Pi's
 * `z-[999]` sidebar). A CSS `::after` tooltip cannot escape an `overflow:hidden`
 * ancestor, and z-index doesn't help with clipping — so tooltips were getting cut
 * off (e.g. the call-button tooltip clipped by the prompt box). Instead we render
 * a single tooltip element on `<body>`, positioned with JS relative to the hovered
 * button, which escapes every clipping/stacking context.
 *
 * One delegated set of listeners covers every `.tooltip[aria-label]` button,
 * current or future. Per-host colour comes from CSS (`.saypi-tooltip`, scoped by
 * the host `body` class), so each host keeps its native look.
 */

export interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}
export interface Size {
  width: number;
  height: number;
}
export interface Viewport {
  width: number;
  height: number;
}
export type Placement = "above" | "below";

/**
 * Compute where to place the tooltip. Returns the tooltip's horizontal CENTRE
 * (`left`; the element is centred with `transform: translateX(-50%)`) and its
 * `top`. Prefers placing the tooltip above the button and flips below when there
 * isn't room; clamps the centre so the tooltip stays within the viewport.
 */
export function computeTooltipPosition(
  anchor: Rect,
  tooltip: Size,
  viewport: Viewport,
  gap = 8,
  margin = 8
): { left: number; top: number; placement: Placement } {
  const half = tooltip.width / 2;
  const centreX = anchor.left + anchor.width / 2;
  const minX = margin + half;
  const maxX = Math.max(minX, viewport.width - margin - half);
  const left = Math.min(Math.max(centreX, minX), maxX);

  let placement: Placement = "above";
  let top = anchor.top - gap - tooltip.height;
  if (top < margin) {
    placement = "below";
    top = anchor.bottom + gap;
  }
  return { left, top, placement };
}

const TOOLTIP_SELECTOR = ".tooltip[aria-label]";

let tooltipEl: HTMLDivElement | null = null;
let currentTarget: HTMLElement | null = null;
let initialized = false;

function getEl(): HTMLDivElement {
  if (!tooltipEl || !tooltipEl.isConnected) {
    tooltipEl = document.createElement("div");
    tooltipEl.className = "saypi-tooltip";
    tooltipEl.setAttribute("role", "tooltip");
    document.body.appendChild(tooltipEl);
  }
  return tooltipEl;
}

function reposition(): void {
  if (!currentTarget || !tooltipEl) return;
  const r = currentTarget.getBoundingClientRect();
  const { left, top, placement } = computeTooltipPosition(
    r,
    { width: tooltipEl.offsetWidth, height: tooltipEl.offsetHeight },
    { width: window.innerWidth, height: window.innerHeight }
  );
  tooltipEl.style.left = `${Math.round(left)}px`;
  tooltipEl.style.top = `${Math.round(top)}px`;
  tooltipEl.dataset.placement = placement;
}

function showFor(target: HTMLElement): void {
  const label = target.getAttribute("aria-label");
  if (!label) return;
  currentTarget = target;
  const el = getEl();
  el.textContent = label;
  el.classList.remove("visible");
  // Measure (offsetWidth/Height) and position on the next frame, once laid out.
  requestAnimationFrame(() => {
    if (currentTarget !== target) return;
    reposition();
    el.classList.add("visible");
  });
}

function hide(): void {
  currentTarget = null;
  if (tooltipEl) tooltipEl.classList.remove("visible");
}

/**
 * Install the delegated tooltip listeners once. Safe to call multiple times.
 */
export function initTooltip(): void {
  if (initialized || typeof document === "undefined") return;
  initialized = true;

  document.addEventListener("pointerover", (e) => {
    const target = (e.target as HTMLElement | null)?.closest?.(
      TOOLTIP_SELECTOR
    ) as HTMLElement | null;
    if (target && target !== currentTarget) showFor(target);
  });

  document.addEventListener("pointerout", (e) => {
    if (!currentTarget) return;
    const related = e.relatedTarget as Node | null;
    // Only hide when the pointer actually leaves the current button (not when it
    // moves onto a child element of the button).
    if (!related || !currentTarget.contains(related)) hide();
  });

  // Keep the tooltip aligned while the page scrolls or resizes.
  window.addEventListener("scroll", reposition, true);
  window.addEventListener("resize", reposition, true);
  // Hide on focus changes (e.g. tabbing away).
  document.addEventListener("focusout", hide, true);
}

/** Test-only reset of module state. */
export function __resetTooltipForTests(): void {
  if (tooltipEl?.parentElement) tooltipEl.parentElement.removeChild(tooltipEl);
  tooltipEl = null;
  currentTarget = null;
  initialized = false;
}
