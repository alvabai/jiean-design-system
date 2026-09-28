# Cards and surfaces

## Purpose

The card is the unit of composition in ArcoBlue. Everything visible in the
content field that is not shell chrome is a card, a card stack, or a flush
region inside a card. This document defines the surface itself; what goes inside
is covered by the pattern docs.

Reference implementation: every page in [`../examples/`](../examples/).

## Structure and values

| Property | Value |
|---|---|
| Background | `surface` `#FFFFFF` |
| Radius | 4px (`rounded.md`) |
| Padding | 20px |
| Border | none |
| Shadow | none |
| Gap between sibling cards | 16px |
| Card title | 16px / 500 / 24px, `text-primary`, 16px below |
| Card body text | 14px, `text-secondary` |
| Header rule under title | **none** (upstream `border-bottom: 0`) |

The absence of a header rule is a deliberate upstream trait worth stating
explicitly: Arco Pro's card header separator is 0px. A card separates its title
from its body with whitespace, not with a line. Adding a rule under a card title
is a common "improvement" that makes the card look like a different design
system.

## Variants

| Variant | Rules |
|---|---|
| **Content card** (default) | 20px padding all round; title first; free content |
| **Flush card** | 20px padding on the head, 0 on a region that owns its own padding (a table, a chart, an embedded list) |
| **List card** | one card holding title + search area + toolbar + table + pagination; see [`page-layout.md`](page-layout.md) |
| **Rail card** | same 20px padding as any card, in the 280px dashboard column; there is no "compact card" |
| **Nested region** | a card may contain a region separated by a 1px `border-subtle` divider and 20px of space; it may not contain another card |

Nested cards are forbidden. A card inside a card squares the padding budget and
produces 40px of dead space between the two surfaces' corners. If content needs
its own surface, it needs its own top-level card.

## Composition

- A card's first child is its title, unless it is a flush card.
- Actions that belong to the card sit at the card's top right, on the same line
  as the title, separated by 16px.
- A card never has its own scroll region on a page-level scroll page. Choose
  pagination or virtualisation instead.
- A card never carries a coloured left border, a status strip, or a corner badge.
  Status belongs in the content.

## States

| State | Behaviour |
|---|---|
| Rest | Flat: `surface` on `canvas`, no border, no shadow |
| Hover | Cards are not interactive containers; a card gets no hover state of its own |
| Clickable/selected | A card that is itself selectable uses a 1px `primary` border — the only state change a card surface is allowed |
| Loading | The card renders immediately with a skeleton in the body; the card frame never appears after the data |
| Empty | The card renders with its title and an explicit message; it is never removed |
| Error | An `error-subtle` banner inside the card, above the body |
| Disabled | Not a card state. A card is either present or not |

## Density

20px of padding and 16px of gap are fixed. Two consequences worth stating:

1. A flush list card must actually be flush. A table with 20px of card padding
   on top of its own 16px cell padding loses 40px of usable width and gains
   nothing.
2. A card stack of five cards carries 4 × 16px = 64px of vertical gap plus
   2 × 20px × 5 = 200px of padding. That budget is why a list page is one card
   rather than three.

## Empty, long and contradictory data

- **Empty card**: keep the frame and the title. A disappearing card makes the page
  look broken and destroys the user's spatial memory of where the content was.
- **Long title**: wraps to a second line; the card grows. A card title is never
  truncated.
- **Long body text**: wraps. Prose inside a card is limited to a comfortable
  measure by the card's own width; if a card is in a 280px rail, keep prose to
  short paragraphs.
- **Tall content**: the card grows and the page scrolls. A card does not grow an
  internal scrollbar.
- **Contradictory content**: if a card's title and its body disagree (a title
  naming one record, a table listing another), both render as given and the
  discrepancy is a data-layer bug to fix upstream — the design language does not
  mask it.

## Contrast and accessibility

- `text-primary` on `surface` ≈ 16.13:1, `text-secondary` on `surface` ≈ 7.10:1.
  Both pass AA; `text-primary` passes AAA.
- Because cards are white and shadows are absent, the card boundary is conveyed
  by the `canvas` fill behind them — a difference of ≈ 1.11:1 between `#F2F3F5`
  and `#FFFFFF`. That is intentionally subliminal and is **not** a boundary a
  user must perceive to use the page; the content inside the card is what carries
  meaning. This is the reason cards must not rely on their edge as a control
  boundary.
- A selectable card must add a 1px `primary` border (≈ 5.19:1 against `surface`)
  rather than only a fill change, so its selected state is perceivable.
- Card titles are real headings (`h2`, or `h1` for the page-level title inside the
  first card) so the card stack is navigable.

## Do's and Don'ts

- **Do** use 4px radius, 20px padding, 16px gaps, and no border or shadow.
- **Do** let whitespace separate a card title from its body.
- **Don't** add a header rule, a shadow, or an 8px radius to a card.
- **Don't** nest cards, or place a card inside a card's flush region.
- **Don't** add a coloured left strip, a tinted header, or a corner badge to
  signal status.
