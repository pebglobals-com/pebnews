# PEB News — Project CLAUDE.md

Based on Anthropic's Claude Fable 5 system prompt framework.

## Tone & Formatting

Be concise, direct, and to the point. Use minimum formatting needed for clarity. Avoid over-formatting with bold, headers, lists, and bullet points. Use lists only when content is multifaceted enough to warrant them.

Write in a natural tone. For simple questions, respond in prose without lists or bullets. For reports and technical documentation, write prose without bullets or numbered lists unless asked.

Never use emojis in code or documentation unless explicitly requested.

## Behavior Framework

Own mistakes and fix them — take accountability without excessive apology. Maintain steady, honest helpfulness.

When making mistakes, acknowledge what went wrong, stay on the problem, and maintain professional self-respect.

## Evenhandedness

When presenting alternatives, give a fair overview of options. Present trade-offs without pushing personal preference. Let the user decide.

## Code Quality

- Follow existing code conventions in the project
- Use the project's component library (shadcn/ui) and styling system (Tailwind)
- Apply typography rules automatically (curly quotes, proper dashes, correct spacing)
- Respect the design system tokens defined in this project
- Always check the installed skills in `.claude/skills/` before starting work

## Project Design Decisions

These are pre-resolved. Do not re-negotiate them:

| Decision | Source Skill | Choice |
|----------|-------------|--------|
| Spacing system | UI/UX Pro Max | 4pt/8dp incremental (Material Design), 4px base scale |
| Animation | UI/UX Pro Max | 150-300ms micro, <=400ms complex, transform/opacity only |
| Icon library | UI/UX Pro Max | Heroicons or Lucide, SVG only, no emojis |
| Component framework | Bencium Impact Designer | shadcn/ui v4 + Tailwind + phosphor-icons |
| Typography rules | Bencium Typography | Curly quotes, en/em dashes, proper ellipsis, kerning on |
| Line length | Bencium Typography | 45-90 chars, max-width: 65ch on text containers |
| Color palette | UI/UX Pro Max | Semantic tokens, industry-matched, 4.5:1 contrast minimum |
| Motion tokens | Transitions.dev | Use `_root.css` tokens for all animation durations/easings |

## Skills Installed

- `.claude/skills/ui-ux-pro-max/` — Visual design, spacing, color, icons
- `.claude/skills/bencium-impact-designer/` — Component patterns, shadcn/ui usage
- `.claude/skills/ui-typography/` — Typographic correctness
- `.claude/skills/transitions-dev/` — Animation/motion library
- `.claude/skills/vercel-web-design/` — Web interface guideline auditing

## What Not To Do

- Never install software, global CLIs, or npm packages without asking first
- Never generate URLs or guess them
- Never commit changes unless explicitly asked
- Never add explanatory comments to code unless the logic is genuinely unclear
