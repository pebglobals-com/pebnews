---
name: transitions-dev
description: Production-ready CSS transitions for web apps. 21 drop-in transitions: notification badges, dropdowns, modals, panel reveals, page transitions, card resizes, number pop-ins, text swaps, icon swaps, success checks, avatar group hovers, error state shakes, input clears, skeleton loaders, shimmer text, sliding tabs, tooltips, staggered text reveals, card hover tilt, plus-to-menu morph, accordions.
---

# Transitions.dev

Twenty-one portable CSS transitions, each namespaced under `t-*` selectors with semantic CSS custom properties. Drop-in: paste the snippet, wire the documented HTML hooks, done. No framework dependencies, and every snippet ships a `prefers-reduced-motion` guard.

## Quick Reference

| Transition | Use When |
| --- | --- |
| **Card resize** | Tween a container's width/height when its layout state changes |
| **Number pop-in** | Re-enter each digit with a blurred slide when a number updates |
| **Notification badge** | Slide a small badge onto a trigger and pop the dot |
| **Text states swap** | Swap text in place with a blurred up-and-down transition |
| **Menu dropdown** | Open an origin-aware dropdown that grows from its trigger |
| **Modal open/close** | Scale-up modal dialog with softer scale-down on close |
| **Panel reveal** | Slide a panel into a region with a cross-blur |
| **Page side-by-side** | Slide between two side-by-side pages (list <-> detail) |
| **Icon swap** | Cross-fade two icons in the same slot with blur and scale |
| **Success check** | Fade + rotate + Y-bob + SVG path draw to celebrate completion |
| **Avatar group hover** | Distance-falloff lift on a row of items with bouncy spring return |
| **Error state shake** | Per-segment cubic-bezier shake with auto-reverting border |
| **Input clear dissolve** | Fly-out + per-word streak when a text field is cleared |
| **Skeleton loader** | Pulse a placeholder, then cross-fade to loaded content |
| **Shimmer text** | Sweep a highlight band across muted text (pure CSS) |
| **Tabs sliding** | Slide the active pill between tabs in a segmented control |
| **Tooltip open/close** | Delayed fade+scale in, instant out (pure CSS) |
| **Texts reveal** | Staggered blurred rise for stacked text lines |
| **Card hover tilt** | Tilt a card in 3D toward the pointer with cursor-tracked glare |
| **Plus to menu morph** | Morph a circular trigger into the menu/panel it opens |
| **Accordion expand** | Grow/shrink a panel via grid-rows with chevron flip |

## Motion Tokens

Import `_root.css` into your project to use the shared motion token system:

**Durations:** stagger 40ms, micro 80ms, quick 150ms, fast 250ms, medium 350ms, slow 400ms, very-slow 500ms  
**Easings:** smooth-out `cubic-bezier(0.22, 1, 0.36, 1)`, in-out, out, linear, bounce, bounce-strong  
**Distances:** micro 4px, small 6px, base 8px, medium 12px, large 30px  
**Scales:** large 0.96, medium 0.97, small 0.98, tiny 0.99  
**Blur:** small 2px, medium 3px, large 8px

## Commands

- `transitions reveal` — list all 21 transitions
- `transitions review` — audit the project for places transitions.dev would help
- `transitions apply` — install the best-fit transition at cursor location
- `transitions refine` — replace ad-hoc motion values with motion tokens

## Output Format

1. Install variables from `_root.css` into global stylesheet (only if not already present)
2. Paste the transition CSS verbatim from the reference file
3. Wire the documented HTML hooks (class names + state attributes)
4. Preserve the `@media (prefers-reduced-motion: reduce)` block
5. Copy JS orchestration snippet where needed

## Common Mistakes to Avoid

- Stripping close-state class cleanup on dropdowns/modals
- Forgetting the reflow (`void el.offsetWidth`) for replayable animations
- Replacing `transition: ...` with `transition: all`
- Setting transition-timing-function in CSS for avatar group hover (must be inline JS)
- Removing the reduced-motion guard
