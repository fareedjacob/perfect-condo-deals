# Design Tokens — Spacing, Radius, Opacity & Border

Use these values consistently across all components. They come directly from the Figma design system variables.

---

## Corner Radius

| Token | Value | CSS |
|---|---|---|
| `rounded-none` | 0px | `border-radius: 0px` |
| `rounded-xs` | 2px | `border-radius: 2px` |
| `rounded-sm` | 4px | `border-radius: 4px` |
| `rounded-lg` | 8px | `border-radius: 8px` |
| `rounded-xl` | 12px | `border-radius: 12px` |
| `rounded-2xl` | 16px | `border-radius: 16px` |
| `rounded-3xl` | 24px | `border-radius: 24px` |
| `rounded-3-5-xl` | 28px | `border-radius: 28px` |
| `rounded-4xl` | 32px | `border-radius: 32px` |
| `rounded-5xl` | 48px | `border-radius: 48px` |
| `rounded-full` | 120px | `border-radius: 9999px` |

**Usage guide:**
- Inputs, tags, small chips → `rounded-lg` (8px)
- Cards, modals, panels → `rounded-2xl` (16px) or `rounded-3xl` (24px)
- Buttons → `rounded-xl` (12px) or `rounded-2xl` (16px)
- Pills, badges, avatars → `rounded-full`

---

## Spacing

| Token | Value | CSS Variable |
|---|---|---|
| `Spacing-0` | 0px | `--spacing-0: 0px` |
| `Spacing-25` | 2px | `--spacing-25: 2px` |
| `Spacing-50` | 4px | `--spacing-50: 4px` |
| `Spacing-75` | 8px | `--spacing-75: 8px` |
| `Spacing-100` | 12px | `--spacing-100: 12px` |
| `Spacing-200` | 16px | `--spacing-200: 16px` |
| `Spacing-300` | 24px | `--spacing-300: 24px` |
| `Spacing-400` | 32px | `--spacing-400: 32px` |
| `Spacing-500` | 40px | `--spacing-500: 40px` |
| `Spacing-600` | 48px | `--spacing-600: 48px` |
| `Spacing-700` | 64px | `--spacing-700: 64px` |
| `Spacing-800` | 80px | `--spacing-800: 80px` |
| `Spacing-900` | 96px | `--spacing-900: 96px` |

**Usage guide:**
- Icon padding, tight gaps → `Spacing-25` to `Spacing-75` (2–8px)
- Component internal padding → `Spacing-100` to `Spacing-200` (12–16px)
- Section gaps, card padding → `Spacing-300` to `Spacing-400` (24–32px)
- Page sections, hero spacing → `Spacing-600` to `Spacing-900` (48–96px)

---

## Opacity

These are percentage values (0–100).

| Token | Value |
|---|---|
| `Opacity-0` | 0% |
| `Opacity-50` | 16% |
| `Opacity-100` | 24% |
| `Opacity-200` | 32% |
| `Opacity-300` | 40% |
| `Opacity-400` | 48% |
| `Opacity-500` | 64% |
| `Opacity-600` | 72% |
| `Opacity-700` | 80% |
| `Opacity-800` | 88% |
| `Opacity-900` | 100% |

**Usage guide:**
- Disabled states → `Opacity-300` to `Opacity-400` (40–48%)
- Subtle overlays, ghost elements → `Opacity-50` to `Opacity-100` (16–24%)
- Hover/active states → `Opacity-700` to `Opacity-800` (80–88%)
- Full visibility → `Opacity-900` (100%)

---

## Border Size

| Token | Value | CSS |
|---|---|---|
| `BorderSize-0` | 0px | `border-width: 0px` |
| `BorderSize-100` | 0.5px | `border-width: 0.5px` |
| `BorderSize-200` | 0.75px | `border-width: 0.75px` |
| `BorderSize-300` | 1px | `border-width: 1px` |
| `BorderSize-400` | 1.25px | `border-width: 1.25px` |
| `BorderSize-500` | 1.5px | `border-width: 1.5px` |
| `BorderSize-600` | 1.75px | `border-width: 1.75px` |
| `BorderSize-700` | 2px | `border-width: 2px` |
| `BorderSize-800` | 2.5px | `border-width: 2.5px` |
| `BorderSize-900` | 3px | `border-width: 3px` |

**Usage guide:**
- Default UI borders (inputs, cards, dividers) → `BorderSize-300` (1px)
- Subtle hairline separators → `BorderSize-100` to `BorderSize-200` (0.5–0.75px)
- Focused/active borders → `BorderSize-500` to `BorderSize-700` (1.5–2px)
- Strong emphasis borders → `BorderSize-800` to `BorderSize-900` (2.5–3px)

---

## How to use this file with Claude Code

Paste this file into your Claude Code context or reference it in your prompt like:

> "Follow the spacing and radius values in `design-tokens.md` when building this component."

Claude Code will apply the correct token values instead of guessing arbitrary numbers.
