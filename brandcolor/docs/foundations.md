# Foundations

## Purpose

This document explains *why* `brandcolor` looks the way it does, and how to decide
when a screen is following it. It is the reasoning layer under
[`../DESIGN.md`](../DESIGN.md); the numbers live there, the judgement lives here.

Read this before adding a new pattern. If a decision you are about to make is
covered by a numbered principle below, follow it; if it is not covered, the
decision is a candidate for the specification rather than a local exception.

## The eight principles

**1. The shell is fixed; the content moves.** The 60px header and the
220px/48px sidebar never scroll, never resize and never reflow. Only the content
field scrolls. A screen may not add a second fixed frame, and may not make the
header sticky-by-scroll-behaviour — it is already fixed.

**2. One accent does all the work.** `#D7000F` — 捷安红 — is action, selection and focus.
It is not a category colour, not a chart series colour chosen for variety, and
not decoration. When a screen seems to need a second accent, the real problem is
usually that several things are competing for "primary action" and only one of
them should be.

**3. Contrast is spent on text, elevation on structure.** The palette keeps its
contrast budget for the four-step grey text ramp. Depth is therefore not
communicated by shadows on content: cards are flat, and the only shadows in the
product are the sidebar, the fixed form action bar, and non-modal popups.

**4. Density is a feature, measured in exact numbers.** Table cells use 9px of
vertical padding; form fields use 20px of vertical rhythm; content uses 20px of
horizontal padding; grouped forms use an 80px column gutter. These are not
approximations to be rounded for comfort. A screen that "breathes more" is a
screen that shows less data per viewport, which is a regression here.

**5. Hierarchy stops at 20px.** The largest type on a list, form or detail page
is a 16px card title; the largest on a dashboard is a 20px welcome line. Weight
carries emphasis instead: 500 for titles, 600 for KPI numbers, 400 for
everything else.

**6. Filled fields, not outlined fields.** Inputs rest at `canvas` `#F2F3F5`,
press darker on hover, and turn white with a 1px `primary` border on focus. This
inversion is the language's most recognisable detail.

**7. Boundaries are hairlines.** Every separation — header rule, sidebar edge,
card section, table row, divider — is 1px at `border` `#E5E6EB` or the lighter
`border-subtle` `#F2F3F5`. There are no thick rules, no double rules and no
dashed rules.

**8. The card is the unit of composition.** A screen is a stack of white cards
with 4px corners and 20px padding, separated by 16px, on a `#F2F3F5` field.
Exception: a *list* screen is one card containing the title, the search area, the
toolbar and the table, because those four things are one task.

## Two trees, and why mixing them is the usual failure

Every screen is either a **workspace** (table, form, chart — wide, dense,
scanned) or a **rail** (summary cards, shortcuts, notes — fixed-width, few
items). A dashboard has both, side by side: a workspace at the remaining width
plus a 280px rail with a 16px gap.

The failure mode is mixing them *inside* one card — a KPI strip above a record
table, or a summary rail column inside a search-list card. Each of those looks
locally reasonable and makes the screen read as two competing tasks. If a screen
genuinely needs both, split it into two cards or two regions, not one card with
two idioms.

## What "brandcolor" means when it is unclear

When a review argument stalls, ask these in order:

1. **Is the shell intact?** 60 / 220 / 48 / 1100 / `#F2F3F5`. If not, stop.
2. **Is the palette intact?** One accent, four greys, hairlines, no gradients,
   no new hues, no opacity-based disabled states. If not, stop.
3. **Is the density intact?** 9px table cells, 20px card padding, 16px card gap,
   14px body. If not, stop.
4. **Is the tree decision made?** Workspace or rail — and only one per card.
5. **Is the elevation rule respected?** Only the sidebar, the form action bar
   and non-modal popups carry shadows.

Those five questions cover most disagreements, and they are deliberately ordered
from structural to cosmetic.

## Empty, long and contradictory data

Foundations-level rules that every pattern doc then applies:

- **Empty is a state, not a gap.** An empty region keeps its frame and its
  heading, and says so in `text-tertiary`. It never collapses to nothing — a
  vanished card makes the page look broken rather than empty.
- **Long data wraps; it does not shrink.** Type sizes are fixed, so long values
  wrap and rows grow. The alternative (shrinking type) breaks the density
  contract and the tabular alignment.
- **Contradictory data is shown, not resolved.** If two fields disagree, the
  screen shows both and marks the disagreement; it never silently picks one.
  A design language is not the right layer to hide a data problem.

## Contrast and accessibility

The contract's colour pairs are checked by the linter at load time, and the full
contrast audit — including the pairs the linter cannot compute, such as
composited alpha text on a dark surface — is in
[`accessibility.md`](accessibility.md).

Two foundations-level consequences:

- Because `canvas` `#F2F3F5` is a *fill* used behind 14px `text-primary`, every
  control that uses it has a comfortable margin (≈ 14.53:1). Do not replace it
  with a lighter tint "for softness" — the margin is what makes small text on a
  grey fill safe.
- Because `text-tertiary` `#86909C` sits at 2.92:1 on `canvas`, it is a
  non-essential-information colour only: helper text, captions, placeholders,
  empty-state text. Never use it for a value a user must read to act.

## Do's and Don'ts

- **Do** fix the shell, spend the accent on action, and keep density exact.
- **Do** re-read the five questions above before proposing a local exception.
- **Don't** add a shadow, a second accent, a rounded "modern" surface, or a
  larger heading to make a screen feel more finished. Those four moves are what
  make an `brandcolor` screen stop being `brandcolor`.
- **Don't** treat this document as a style opinion. Everything above traces to a
  measured value in the contract or in the upstream sources recorded in
  [`../reports/source-audit.md`](../reports/source-audit.md).
