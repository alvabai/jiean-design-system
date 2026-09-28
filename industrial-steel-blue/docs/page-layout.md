# Page layout
> **Scope and provenance.** This is JIEAN's own implementation guide for the
> `IndustrialSteelBlue` package: it states what this package requires. It is not a
> translation or a restatement of Arco's documentation, and it is not an Arco
> publication. Where a value is labelled *measured* or *Arco*, that is evidence
> about the research baseline recorded in [`../DESIGN.md`](../DESIGN.md)
> (Reference Sources) — not a claim that Arco defines this system.

## Purpose

This document covers what goes *inside* the content field: the breadcrumb, the
card stack, the page-level grid, and the four page archetypes — dashboard,
list, form, detail. The shell itself is in
[`application-shell.md`](application-shell.md).

Reference implementations: [`../examples/dashboard.html`](../examples/dashboard.html),
[`../examples/list-page.html`](../examples/list-page.html),
[`../examples/form-page.html`](../examples/form-page.html),
[`../examples/detail-page.html`](../examples/detail-page.html).

## Structure and values

| Element | Value |
|---|---|
| Content padding | 16px top, 20px left/right, 0 bottom |
| Breadcrumb height | 24px |
| Space under breadcrumb | 16px |
| Card gap | 16px |
| Card padding | 20px |
| Card radius | 4px |
| Card border / shadow | none / none |
| Card title | 16px / 500 / 24px, 16px below |
| Page grid | 24 columns; page gutter 16px |
| Dashboard rail | 280px, 16px gap, workspace takes the rest |

## The four archetypes

### Dashboard

A workspace plus a 280px rail, side by side. The workspace holds, in order: the
20px welcome/page line, a full-width 1px divider, the KPI row, another divider,
and the chart or table card. The rail holds 2–4 small cards (shortcuts,
announcement, documents). Rail cards use the same 20px padding as workspace
cards; they are not "compact" variants.

The KPI row is **not** a set of cards. It is one row inside the first card, with
54px `canvas` discs, a 12px caption, a 22px/600 value, and 1px `border-subtle`
vertical dividers 60px tall between items. Wrapping KPIs in their own bordered
cards is the single most common dashboard mistake in this language — it turns a
summary row into four competing panels.

### List

**One card.** The card contains, in this order: the 16px card title, the search
area, 1px `border-subtle` rule, the toolbar, the table, and the pagination. This
is deliberate: the title, the filters, the actions and the rows are one task, and
splitting them across cards makes the filter feel detached from what it filters.

### Form

A stack of section cards, each opening with a 16px card title, then a field grid.
The page ends with a **fixed** action bar: `padding: 12px 40px`, white, a
`0 -3px 12px rgba(0,0,0,0.1)` shadow, primary action rightmost. The content
container reserves 90px at the bottom so the bar never covers the last section.

### Detail

A stack of cards with one optional interaction region on top: title plus
right-aligned actions on the first line, then a centred `lineless` step flow
(max-width 548px, 8px above, 30px below). Subsequent cards are metadata
descriptions and related-record tables. A detail page does **not** use the rail
column; metadata sits in a three-column description grid inside a normal card.

## Composition rules

- The breadcrumb is the only element above the first card, and there is exactly
  one breadcrumb per page.
- Cards are separated by 16px, never by dividers and never by margins on inner
  elements.
- A card's first child is its title. If a card has no title, it is a
  *flush* card (a table or chart that owns its own padding) and must be
  documented as such.
- Page-level actions that affect the whole page (submit, back, cancel) live in
  the page's own action position — the fixed bar for forms, the card head for
  details, the toolbar for lists. Do not scatter them.

## States

| State | Behaviour |
|---|---|
| Loading | Skeleton blocks in the shape of the real content, inside the same cards. The shell and card frames are already visible. |
| Empty | The card renders with its title and an explicit empty message in `text-tertiary`, plus the primary action that would create the first record. |
| Error | An `error-subtle` banner at the top of the affected card; the rest of the page stays usable if it can. |
| No permission | The card renders with an explanation, not with fields disabled one by one. |
| Partial failure | The failing region shows its own error state; sibling cards are unaffected. |

## Density

Page layout adds no spacing of its own beyond the numbers above. If a screen
needs more room, it is almost always because a card was given padding it does not
need (a flush table card with 20px of padding loses 40px of width) or because two
cards were used where one would do.

## Empty, long and contradictory data

- **Empty**: keep the frame. The breadcrumb, the card and the title remain; only
  the data region states emptiness. A whole-page empty state may only replace the
  card stack when the screen has no filters, no actions and no other content.
- **Long**: names, descriptions and identifiers wrap inside cells; rows grow. A
  page never introduces horizontal text truncation as a first resort, and never
  shrinks type to fit. Truncation with a tooltip is acceptable for identifiers in
  a *table column*, and only there.
- **Very long pages**: the content field is the scroll container. Never introduce
  a second scroll region inside a card to keep the page short — choose
  pagination or virtualisation instead.
- **Contradictory**: if a record's status and its dates disagree (finished but no
  end date), both are shown and the inconsistency is marked on the field that is
  suspect. The layout does not hide or normalise it.

## Contrast and accessibility

- Card content on `surface`: `text-primary` ≈ 16.13:1, `text-secondary` ≈ 7.10:1.
  Both pass AA for any size.
- The breadcrumb's `text-secondary` on `canvas` ≈ 6.40:1 passes AA; the trailing
  segment's `text-primary` on `canvas` ≈ 14.53:1 passes AAA.
- Page structure is expressed with real heading elements (`h1` for the page-level
  title, `h2` for card titles) so assistive technology can navigate the card
  stack. The reference pages do this.
- The fixed action bar must not trap keyboard focus. It is a normal region at the
  end of the form; it is fixed visually, not in the tab order.

## Do's and Don'ts

- **Do** keep the four archetypes distinct; a mixed page is worse than two pages.
- **Do** put a list page in one card, and a dashboard's KPIs in one row.
- **Don't** add a hero heading, a page banner, or a coloured header strip to give
  a page "presence".
- **Don't** split a form into cards per field, or a detail page into a rail.
- **Don't** let a card's inner content add its own top margin; the card's padding
  is the only inset.
