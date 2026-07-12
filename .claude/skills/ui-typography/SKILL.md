---
name: ui-typography
description: >
  Professional typography rules for UI design, web applications, software interfaces, and all screen-based
  text. Enforces timeless typographic correctness: proper quote marks, dashes, spacing, hierarchy, layout.
  ENFORCEMENT MODE: When generating ANY HTML, CSS, React, JSX, or UI code containing visible text, auto-apply
  every rule in this skill silently. AUDIT MODE: When reviewing existing code, flag violations and provide fixes.
---

# UI Typography Skill

## PROJECT CONFIGURATION

This skill **LEADS** on the following design decisions for this project:

- **Typography**: All typographic rules below are enforced automatically.
- **Line Length**: 45-90 characters per line (CSS: `max-width: 65ch` on text containers).
- **Line Spacing**: 120-145% of point size (`line-height: 1.2` to `1.45`).
- **Quotes**: Always curly. Never straight quotes. Use proper HTML entities.
- **Dashes**: Three distinct characters: hyphen (compound words), en dash (ranges), em dash (sentence breaks).

## Characters

### Quotes and Apostrophes — Always Curly

Use `&ldquo;` `&rdquo;` for double, `&lsquo;` `&rsquo;` for single. Apostrophes always point down — identical to `&rsquo;`.

### Dashes and Hyphens — Three Distinct Characters

| Character | HTML | Use |
|-----------|------|-----|
| - (hyphen) | `-` | Compound words, line breaks |
| - (en dash) | `&ndash;` | Ranges (1-10), connections |
| --- (em dash) | `&mdash;` | Sentence breaks—like this |

Never approximate with `--` or `---`.

### Ellipses — One Character

Use `&hellip;` (...), not three periods.

### Other Punctuation

- **Semicolons** join independent clauses. **Colons** introduce completion.
- **Exclamation points**: budget ONE per long document. Never multiple in a row.
- **Ampersands**: correct in proper names only. Write "and" in body text.

## Spacing

### One Space After Punctuation — Always

Exactly one space after any punctuation. Never two. Not debatable.

### Nonbreaking Spaces

`&nbsp;` prevents line break. Use before numeric refs, after copyright symbols, after honorifics.

## Text Formatting

### Bold and Italic

Bold OR italic. Mutually exclusive. Never combine. Use as little as possible.

### Underlining — Never

Never underline in a document or UI. For links, use subtle styling.

### All Caps — Less Than One Line, Always Letterspaced

Always add 5-12% letterspacing. `letter-spacing: 0.06em` in CSS. Never capitalize whole paragraphs.

### Kerning — Always On

`font-feature-settings: "kern" 1; text-rendering: optimizeLegibility;`

### Ligatures

Mandatory when fi/fl visually collide. `font-feature-settings: "liga" 1`.

### Font Selection

1. No goofy/novelty fonts in professional work
2. No monospaced for body text
3. Web body: serif or sans both fine on modern screens
4. Max 2 fonts. Each gets a consistent role.

## Page Layout

### Body Text First

Set body text BEFORE anything else: font, point size, line spacing, line length.

### Line Length — 45-90 Characters

CSS: `max-width: 65ch` on text containers.

### Line Spacing — 120-145% of Point Size

`line-height: 1.2` to `1.45`.

### Paragraph Separation — Indent OR Space, Never Both

- First-line indent: `text-indent: 1.5em`
- Space between: `margin-bottom: 0.75em`
- Never double `<br>` tags

### Headings — Max 3 Levels

1. Don't all-caps headings (unless very short + letterspaced)
2. Emphasize with space above and below
3. Space above > space below

### Tables — Remove Borders, Add Padding

Data creates an implied grid. Keep only thin rule under header row. `padding: 0.5em 1em`.

## Responsive Web Typography

- Scale `font-size` and container `width` together
- Always `max-width` on text containers — never edge-to-edge text
- `clamp()` for fluid scaling: `font-size: clamp(16px, 2.5vw, 20px)`
- Mobile minimum: `padding: 0 1rem` on text containers
