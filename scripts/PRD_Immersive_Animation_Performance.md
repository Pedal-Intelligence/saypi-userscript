# PRD: Immersive Animation Rendering Performance and Engine Evaluation

## Overview
This PRD addresses performance, extensibility, and maintainability concerns for the immersive, pulsing green animation shown in interactive mode. The current implementation uses imported SVG assets animated via CSS, with JavaScript toggling state classes.

Reference: Issue [#73](https://github.com/Pedal-Intelligence/saypi-userscript/issues/73) — Evaluate replacing the SVG/CSS animation with HTML Canvas (Paper.js) or other engines (e.g., three.js), and identify the best path forward without sacrificing maintainability.

## Problem Statement
- On some low-end devices, the immersive animation can stutter or consume excess CPU/GPU resources.
- The baseline idle animation pulses continuously even when no user/assistant activity is present.
- The team wants to know if switching to a Canvas or WebGL-based engine would yield material performance improvements while preserving ease of iteration and maintainability.

## Current Implementation
- The concentric rectangles are provided by SVG assets (light/dark).

```72:76:src/ButtonModule.js
updateIconContent(iconContainer) {
  if (ImmersionStateChecker.isViewImmersive()) {
    iconContainer.appendChild(this.icons.rectangles());
  }
}
```

- The SVG selection is handled by the `IconModule` and toggled via CSS classes that drive animations.

```132:139:src/icons/IconModule.ts
rectangles(theme = "light"): SVGElement {
  try {
    if (theme === "dark") {
      return createSVGElement(rectanglesDarkModeSVG);
    } else {
      return createSVGElement(rectanglesSVG);
    }
  } catch (e) {
    console.warn(`Failed to load rectangles icon (${theme})`, e);
    return IconModule.createEmptySVG();
  }
}
```

- Animation state is managed by adding/removing classes on the SVG paths.

```5:19:src/AnimationModule.js
static talkButtonAnimations = [
  "piThinking",
  "piSpeaking",
  "userSpeaking",
  "transcribing",
];
// ...
let rectangles = document.querySelectorAll(this.rectanglesSelector);
rectangles.forEach((rect) => rect.classList.add(animation));
```

- Baseline pulsing animations (idle) are always active when immersive view is present.

```9:12:src/styles/rectangles.css
.outermost {
  animation: pulse_outermost 5s infinite;
  transform-origin: center;
}
```

- Immersive view toggling is managed centrally and applies full-screen plus theming.

```94:103:src/ImmersionService.js
const element = document.documentElement;
element.classList.remove("desktop-view");
element.classList.add("immersive-view");
// ... fullscreen + theme apply
```

## Goals
- Improve smoothness on low/mid-tier devices (reduce jank, dropped frames) without a visual redesign.
- Reduce CPU/GPU utilization when idle by eliminating unnecessary continuous animation.
- Preserve maintainability and ease of iteration on animation states (thinking, transcribing, speaking, error).
- Provide a migration path to a Canvas/WebGL engine if needed, gated by a feature flag.

## Non-Goals
- Visual rebrand/redesign of the immersive animation.
- Refactoring unrelated UI components.

## Success Metrics (Target)
- Idle immersive view CPU usage reduced by ≥30% on low-end devices (2 cores and/or ≤2GB device memory).
- Animation frame time p95 ≤ 16.7 ms on mid-tier devices; ≤ 33 ms on low-end devices.
- No regression in functional tests or state-machine-driven UI states.

## Target Platforms
- Chromium-based browsers (Chrome, Edge, Arc, Kiwi)
- Firefox (Desktop, Android)

## Approaches Considered

1) Optimize existing SVG + CSS (Recommended now)
- Add `prefers-reduced-motion` support to disable baseline idle animations.
- Add a heuristic `low-motion` runtime class (based on `navigator.deviceMemory` / `hardwareConcurrency`) to disable idle animation on low-end devices.
- Keep event-driven animations (userSpeaking, piSpeaking, transcribing) intact to preserve UX.

Pros: Minimal churn; small, reversible change; high maintainability.
Cons: May not fully resolve performance on the very lowest-end devices.

2) HTML5 Canvas (Paper.js)
- Render concentric rings and animate via Canvas (Paper.js vector engine) tied to app state.

Pros: Lower DOM overhead, fine-grained control of frame rendering, potential performance gains.
Cons: New dependency, larger bundle, more custom code; theming/accessibility integration effort; reimplementation cost.

3) WebGL (three.js) or 2D via WebGL

Pros: Highest potential performance and visual effects.
Cons: Overkill for 2D concentric animations; larger deps; higher complexity; GPU availability variance.

4) Lottie/Bodymovin

Pros: Designer-friendly; pre-rendered animations; easy iteration.
Cons: Less dynamic control for state-driven, audio-reactive behaviors.

## Recommendation
- Implement Approach (1) immediately to reduce idle costs and respect user/system motion preferences.
- Reevaluate after telemetry/feedback. If performance remains an issue on a meaningful user segment, prototype Paper.js behind a feature flag and run an A/B performance test.

## Implementation Plan (Phase 1)
- CSS: Add `@media (prefers-reduced-motion: reduce)` overrides to disable all baseline and state animations if user prefers reduced motion.
- CSS: Add `html.low-motion` overrides to disable baseline idle pulsing on low-end devices.
- Runtime: Add a small utility in the main entry (`saypi.index.js`) to set `html.low-motion` based on `deviceMemory ≤ 2` or `hardwareConcurrency ≤ 2`, and listen for changes to `prefers-reduced-motion`.
- No visual redesign; event animations remain unchanged.

## Rollout Plan
- Ship to all users (no gating) since this respects user/system motion preferences and only disables idle pulsing on low-end devices.
- Add a feature flag later if we pursue a Paper.js prototype (Phase 2).

## Risks & Mitigations
- Risk: Over-disabling animation may reduce perceived liveliness.
  - Mitigation: Only idle pulsing is disabled by heuristic; state-driven animations remain.
- Risk: Inconsistent support for `navigator.deviceMemory`.
  - Mitigation: Use best-effort detection; absence of the API falls back to normal behavior.

## Testing Strategy
- Automated tests: Ensure no changes to state-machine events or DOM class toggling behavior.
- Manual: Compare CPU usage (Task Manager/Activity Monitor) in immersive idle before/after on low-end devices. Verify animations remain for speaking/transcribing.
- Accessibility: Verify `prefers-reduced-motion` disables all animations.

## Acceptance Criteria
- When `prefers-reduced-motion: reduce` is enabled, immersive animation performs no motion.
- On devices with `hardwareConcurrency ≤ 2` or `deviceMemory ≤ 2`, the baseline idle pulse animation is disabled while event-driven animations still run.
- No test regressions; immersive mode behavior unchanged otherwise.