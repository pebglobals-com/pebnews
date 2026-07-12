---
name: ui-ux-pro-max
description: "UI/UX design intelligence for web and mobile. Searchable local database with 50+ styles, 161 color palettes, 57 font pairings, 161 product types, 99 UX guidelines, and 25 chart types across 10 stacks (React, Next.js, Vue, Svelte, SwiftUI, React Native, Flutter, Tailwind, shadcn/ui, and HTML/CSS). Use when designing, building, or reviewing UI: pages, components, color schemes, typography, layout, accessibility, animation, or data visualization."
---

# UI/UX Pro Max - Design Intelligence

Comprehensive design guide for web and mobile applications. Contains 50+ styles, 161 color palettes, 57 font pairings, 161 product types with reasoning rules, 99 UX guidelines, and 25 chart types across 10 technology stacks. Searchable database with priority-based recommendations.

## When to Apply

This Skill should be used when the task involves **UI structure, visual design decisions, interaction patterns, or user experience quality control**.

### Primary Use Cases

- Designing new pages (Landing Page, Dashboard, Admin, SaaS, Mobile App)
- Creating or refactoring UI components (buttons, modals, forms, tables, charts, etc.)
- Choosing color schemes, typography systems, spacing standards, or layout systems
- Reviewing UI code for user experience, accessibility, or visual consistency
- Implementing navigation structures, animations, or responsive behavior
- Making product-level design decisions (style, information hierarchy, brand expression)
- Improving perceived quality, clarity, or usability of interfaces

## Design Decisions (PROJECT CONFIGURATION)

This skill **LEADS** on the following design decisions for the PEB News project:

- **Spacing**: 4pt/8dp incremental spacing system (Material Design). Use 4px base scale.
- **Animation**: 150-300ms micro-interactions; complex transitions <=400ms. Use transform/opacity only.
- **Icon Library**: Heroicons (heroicons.com) or Lucide (lucide.dev) — SVG icons only. Never emojis as icons.
- **Color**: Semantic color tokens (primary, secondary, error, surface, on-surface). No raw hex in components. Minimum 4.5:1 contrast ratio. Industry-appropriate palettes via searchable database.

## Rule Categories by Priority

| Priority | Category | Impact | Domain | Key Checks (Must Have) | Anti-Patterns (Avoid) |
|----------|----------|--------|--------|------------------------|------------------------|
| 1 | Accessibility | CRITICAL | `ux` | Contrast 4.5:1, Alt text, Keyboard nav, Aria-labels | Removing focus rings, Icon-only buttons without labels |
| 2 | Touch & Interaction | CRITICAL | `ux` | Min size 44x44px, 8px+ spacing, Loading feedback | Reliance on hover only, Instant state changes (0ms) |
| 3 | Performance | HIGH | `ux` | WebP/AVIF, Lazy loading, Reserve space (CLS < 0.1) | Layout thrashing, Cumulative Layout Shift |
| 4 | Style Selection | HIGH | `style`, `product` | Match product type, Consistency, SVG icons (no emoji) | Mixing flat & skeuomorphic randomly, Emoji as icons |
| 5 | Layout & Responsive | HIGH | `ux` | Mobile-first breakpoints, Viewport meta, No horizontal scroll | Horizontal scroll, Fixed px container widths, Disable zoom |
| 6 | Typography & Color | MEDIUM | `typography`, `color` | Base 16px, Line-height 1.5, Semantic color tokens | Text < 12px body, Gray-on-gray, Raw hex in components |
| 7 | Animation | MEDIUM | `ux` | Duration 150-300ms, Motion conveys meaning, Spatial continuity | Decorative-only animation, Animating width/height, No reduced-motion |
| 8 | Forms & Feedback | MEDIUM | `ux` | Visible labels, Error near field, Helper text, Progressive disclosure | Placeholder-only label, Errors only at top, Overwhelm upfront |
| 9 | Navigation Patterns | HIGH | `ux` | Predictable back, Bottom nav <=5, Deep linking | Overloaded nav, Broken back behavior, No deep links |
| 10 | Charts & Data | LOW | `chart` | Legends, Tooltips, Accessible colors | Relying on color alone to convey meaning |

## Quick Reference

### 1. Accessibility (CRITICAL)

- `color-contrast` - Minimum 4.5:1 ratio for normal text (large text 3:1)
- `focus-states` - Visible focus rings on interactive elements (2-4px)
- `alt-text` - Descriptive alt text for meaningful images
- `aria-labels` - aria-label for icon-only buttons
- `keyboard-nav` - Tab order matches visual order; full keyboard support
- `heading-hierarchy` - Sequential h1->h6, no level skip
- `color-not-only` - Don't convey info by color alone (add icon/text)
- `reduced-motion` - Respect prefers-reduced-motion
- `escape-routes` - Provide cancel/back in modals and multi-step flows

### 2. Touch & Interaction (CRITICAL)

- `touch-target-size` - Min 44x44pt / 48x48dp
- `touch-spacing` - Minimum 8px/8dp gap between touch targets
- `loading-buttons` - Disable button during async operations; show spinner
- `error-feedback` - Clear error messages near problem
- `cursor-pointer` - Add cursor-pointer to clickable elements
- `press-feedback` - Visual feedback on press (ripple/highlight)

### 3. Performance (HIGH)

- `image-optimization` - Use WebP/AVIF, responsive images, lazy load
- `image-dimension` - Declare width/height to prevent layout shift
- `font-loading` - Use font-display: swap/optional
- `lazy-loading` - Lazy load non-hero components
- `virtualize-lists` - Virtualize lists with 50+ items

### 4. Style Selection (HIGH)

- `style-match` - Match style to product type
- `consistency` - Use same style across all pages
- `no-emoji-icons` - Use SVG icons (Heroicons, Lucide), not emojis
- `icon-style-consistent` - Use one icon set across the product
- `primary-action` - Each screen should have only one primary CTA

### 5. Layout & Responsive (HIGH)

- `mobile-first` - Design mobile-first, then scale up
- `breakpoint-consistency` - Use systematic breakpoints (375 / 768 / 1024 / 1440)
- `readable-font-size` - Minimum 16px body text on mobile
- `line-length-control` - Mobile 35-60 chars per line; desktop 60-75 chars
- `spacing-scale` - Use 4pt/8dp incremental spacing system
- `container-width` - Consistent max-width on desktop
- `z-index-management` - Define layered z-index scale
- `visual-hierarchy` - Establish hierarchy via size, spacing, contrast

### 6. Typography & Color (MEDIUM)

- `line-height` - Use 1.5-1.75 for body text
- `line-length` - Limit to 65-75 characters per line
- `font-pairing` - Match heading/body font personalities
- `font-scale` - Consistent type scale (12 14 16 18 24 32)
- `color-semantic` - Define semantic color tokens
- `color-dark-mode` - Dark mode uses desaturated/lighter tonal variants
- `color-accessible-pairs` - Foreground/background pairs must meet 4.5:1

### 7. Animation (MEDIUM)

- `duration-timing` - Use 150-300ms for micro-interactions; complex transitions <=400ms
- `transform-performance` - Use transform/opacity only; avoid animating width/height/top/left
- `easing` - Use ease-out for entering, ease-in for exiting
- `spring-physics` - Prefer spring/physics-based curves
- `exit-faster-than-enter` - Exit animations shorter than enter (~60-70%)
- `stagger-sequence` - Stagger list/grid item entrance by 30-50ms per item
- `reduced-motion` - Respect prefers-reduced-motion

### 8. Forms & Feedback (MEDIUM)

- `input-labels` - Visible label per input (not placeholder-only)
- `error-placement` - Show error below the related field
- `submit-feedback` - Loading then success/error state on submit
- `inline-validation` - Validate on blur (not keystroke)
- `password-toggle` - Provide show/hide toggle for password fields

### 9. Navigation Patterns (HIGH)

- `bottom-nav-limit` - Bottom navigation max 5 items
- `back-behavior` - Back navigation must be predictable and consistent
- `deep-linking` - All key screens must be reachable via deep link
- `nav-state-active` - Current location must be visually highlighted
- `breadcrumb-web` - Web: use breadcrumbs for 3+ level deep hierarchies

### 10. Charts & Data (LOW)

- `chart-type` - Match chart type to data type
- `legend-visible` - Always show legend
- `responsive-chart` - Charts must reflow or simplify on small screens
- `number-formatting` - Use locale-aware formatting

## Pre-Delivery Checklist

- [ ] No emojis as icons (use SVG: Heroicons/Lucide)
- [ ] cursor-pointer on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard nav
- [ ] prefers-reduced-motion respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] Touch targets >=44x44px
- [ ] Semantic color tokens used consistently
- [ ] Consistent spacing rhythm (4px/8dp scale)
