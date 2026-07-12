---
name: bencium-impact-designer
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, or applications. Generates creative, polished code that avoids generic AI aesthetics.
version: 1.2.0
---

# Innovative Designer for impact

Create distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Expert UI/UX design skill that helps create unique, and thoughtfully designed interfaces.

## PROJECT CONFIGURATION

This skill **LEADS** on the following design decisions for this project:

- **Component Framework**: shadcn/ui components (v4, pre-installed in `@/components/ui`). Import individually from `@/components/ui/`.
- **Styling Engine**: Tailwind utility classes exclusively. CSS custom properties mapped via `@theme` in `tailwind.config.js`.
- **Icons**: `@phosphor-icons/react` for buttons and inputs.
- **Notifications**: `sonner` for toasts.
- **Loading States**: Always add loading states, spinners, placeholder animations.
- **Responsiveness**: Fluid layouts with relative units. Mobile-first responsive design.

## Core Philosophy

### Questions to Ask First
1. **Purpose**: What problem does this interface solve? Who uses it?
2. **Tone**: What aesthetic extreme fits?
3. **Constraints**: Technical requirements (framework, performance, accessibility)?
4. **Differentiation**: What makes this UNFORGETTABLE?

### Tone Options (Pick an Extreme)
- **Brutally minimal** - stripped to essence, bold typography, vast whitespace
- **Retro-futuristic** - vintage meets sci-fi, nostalgic tech aesthetics
- **Organic/natural** - soft edges, earthy colors, nature-inspired textures
- **Editorial/magazine** - strong typography hierarchy, asymmetric layouts
- **Brutalist/raw** - exposed structure, harsh contrasts, intentionally rough
- **Art deco/geometric** - bold patterns, metallic accents, symmetric elegance
- **Soft/pastel** - gentle gradients, muted tones, calming atmosphere
- **Industrial/utilitarian** - functional, no-nonsense, mechanical precision

### NEVER Use These AI-Generated Aesthetics:
- **Fonts**: Inter, Roboto, Arial, system fonts as primary choice, Space Grotesk (overused by AI)
- **Colors**: Generic SaaS blue (#3B82F6), purple gradients on white backgrounds
- **Effects**: Glass morphism, Apple design mimicry, liquid/blob backgrounds
- **Patterns**: Cookie-cutter layouts, predictable component arrangements

## Component Library & Tools

- Strongly prefer shadcn components (v4, imported from `@/components/ui`)
- Use Tailwind utility classes exclusively
- Icons from `@phosphor-icons/react`
- Toasts via `sonner`
- Always add loading states (skeletons, spinners)

## Visual Design Standards

### Color System Architecture

Two color roles:
1. **Base/Neutral Palette (4-5 colors):** Backgrounds, surfaces, borders, text
2. **Accent Palette (1-3 colors):** Primary action, status indicators, focus states

### Typography Excellence

- **Headlines/Display**: Prioritize emotion, personality, attention
- **Body Text**: Prioritize legibility, reading comfort
- **Font Selection**: 2-3 typefaces maximum, characterful and distinctive
- **Type Scale**: Major third (1.25x) or Perfect fourth (1.333x)
- **Base size**: 16px body text
- **Line height**: 1.5x for body text
- **Line length**: 45-75 characters optimal

### Motion

- Scroll-triggered animations via Intersection Observer
- Staggered reveals with 50-150ms delay per item
- Background ambient motion: 8-20s duration, subtle 5-20px movement
- Hover: translateY(-4px), scale(1.02-1.05), glow via box-shadow
- CSS-only preferred; Motion library for React when available
- Respect prefers-reduced-motion

### Layout & Spacing

- Generous negative space
- Mathematical 4px base scale (8/16/24/32/48px)
- Mobile-first responsive with relative units
- Navigation: breadcrumbs for 3+ level deep hierarchies

## Accessibility Standards

- WCAG 2.1 AA: 4.5:1 normal text, 3:1 large text
- Min touch target 44x44px
- Keyboard navigability for all interactive elements
- Semantic HTML for screen reader compatibility

## When to Break the Rules

Guidelines exist to prevent mediocrity, not to limit excellence. Break them when context demands it, you have a stronger idea, or the unexpected is the point. If you can articulate WHY, break the rule confidently.
