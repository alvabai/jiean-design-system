# Navigation
> **Scope and provenance.** This is JIEAN's own implementation guide for the
> `IndustrialSteelBlue` package: it states what this package requires. It is not a
> translation or a restatement of Arco's documentation, and it is not an Arco
> publication. Where a value is labelled *measured* or *Arco*, that is evidence
> about the research baseline recorded in [`../DESIGN.md`](../DESIGN.md)
> (Reference Sources) — not a claim that Arco defines this system.

## Purpose

How a user knows where they are and how they move between places: the sidebar
menu, the breadcrumb, pagination, tabs, and step flows. Each answers a different
question, and using one where another is meant is the usual defect.

| Question | Component |
|---|---|
| Where can I go? | sidebar menu |
| Where am I? | breadcrumb |
| Which page of this list? | pagination |
| Which view of this record? | tabs |
| How far through this process? | steps |

## Sidebar menu

40px rows, 12px inset, 2px radius, 4px between rows, 14px text, and a 40px line box
so the label sits on the row's own baseline grid. A group label is a 40px row too,
inset 12px on the left and 28px on the right — the wider right inset is where a
group's trailing affordance lives. It is set in 12px `text-tertiary`, which is this
system's choice: the reference sets its group header in 14px weight 500 `primary`,
and reading a group label as a menu item is exactly what that makes people do.

- **Selected leaf**: `canvas` fill, `primary` text, weight 500, `primary` icon.
- **Unselected**: transparent fill, `text-primary` text, `text-tertiary` icon.
- **Hover**: `canvas` fill (same as selected fill), text unchanged. Hover and
  selection are deliberately distinguished by text colour and weight, not by two
  different backgrounds — at this density two greys are indistinguishable.
- **Groups**: an expandable group keeps its label row at 40px and indents its
  children by 20px. Only one group is expanded at a time in the default
  configuration.

Selecting a route is the only navigation state the menu owns. It never shows
loading, never shows counts, and never shows a coloured badge on an item — if a
count matters, it belongs in a card on the dashboard.

## Breadcrumb

24px tall, `text-secondary`, final segment `text-primary` at weight 500, segments
separated by `/` in `text-tertiary`, 4px of horizontal padding per segment.

- The trail starts at the route root, not at the shell home, when the shell home
  is not an ancestor. The reference pages start with a home icon because their
  root *is* the shell.
- The last segment is never a link.
- Maximum five segments. Deeper hierarchies collapse their middle into one
  ellipsis segment that itself is not a link.

## Pagination

32px square items, 2px radius, 12px text, right-aligned under a table.

- **Active item**: `primary-subtle` fill with `primary` text. This is a tint, not
  a solid blue block, and not an outline.
- **Hover**: `surface-hover` fill.
- **Disabled/edges**: `text-disabled`.
- The current page is exposed as `aria-current="page"`; edge arrows carry
  `aria-disabled` rather than being removed, so the control does not reflow.

## Tabs

Line-style tabs, 40px header, 2px `primary` ink under the active tab, 14px text,
20px of horizontal padding per tab title, 16px of content padding.

Tabs switch **views of the same object** (a record's detail, parameters, logs).
They do not switch between objects and they are never used for top-level
navigation. Tab content keeps the card's own padding; the tab strip is not a
card header.

## Steps

A step flow describes a process with a known end: 28px index circles, 16px
titles, 12px descriptions, current step bold at weight 500.

- **Done**: `primary-subtle` circle with `primary` text or a tick.
- **Active**: solid `primary` circle with white text.
- **Upcoming**: `border` `#E5E6EB` circle with `text-secondary` text.
- **Connector**: 1px `border` rule between steps; never a coloured progress bar.
- In a detail card the flow is centred with `max-width: 548px`, 8px above and
  30px below, and is *lineless* — no surrounding box.

## States

| Pattern | Loading | Empty | Error |
|---|---|---|---|
| Menu | Menu renders immediately from config; no skeleton | n/a | A failed permission load shows entries in a disabled state, not a blank menu |
| Breadcrumb | Never a skeleton; render from the route | n/a | n/a |
| Pagination | Keeps its size; items disabled while loading | Hidden when there is one page or no results | Shows the previous page's numbers; the error is reported in the table area |
| Tabs | Keeps the strip; content area shows a skeleton | Content area shows the empty message | Content area shows an error banner; the strip stays usable |
| Steps | Renders from the workflow definition | n/a | No error state; a rejected step is a *done* step styled with `error` text on its description |

## Density

Navigation is fixed-density: 40px menu rows, 24px breadcrumb, 32px pagination
items, 40px tab header. None of these compress. The only place a smaller size is
allowed is a step flow inside a card, where the 28px circle is the smallest
element and the title itself stays 16px.

## Empty, long and contradictory data

- **Empty menu section**: the group label is omitted entirely rather than shown
  above nothing.
- **Long menu labels**: single line with an ellipsis, full text in a `title`
  attribute. A menu row never grows to two lines.
- **Long breadcrumb segment**: the segment truncates with an ellipsis at a fixed
  maximum width; the middle segments collapse first.
- **Long tab titles**: the strip scrolls horizontally rather than wrapping to a
  second line.
- **Contradictory state**: if the route matches no menu item, no item is
  selected — the breadcrumb still states the location. If the route matches two
  items (a duplicate path), the first match wins and the duplicate is a data bug
  to fix upstream, not a navigation state to render.

## Contrast and accessibility

- Selected menu item: `primary` on `canvas` ≈ 4.68:1 — passes AA for 14px text.
- Active pagination item: `primary` on `primary-subtle` ≈ 4.62:1 — passes AA.
- Breadcrumb `text-secondary` on `canvas` ≈ 6.40:1 — passes AA.
- The current page/step is not communicated by colour alone: pagination uses
  `aria-current`, the active step uses a filled circle plus weight 500, and the
  current breadcrumb segment uses weight 500 in addition to `text-primary`.
- The step flow is an ordered list in the markup so its sequence is exposed
  without relying on the connector lines.

## Do's and Don'ts

- **Do** use exactly one navigation pattern per question in the table above.
- **Do** keep the sidebar the only place a user changes location between modules.
- **Don't** use tabs for module-level navigation, or a step flow for a process
  whose steps are not known in advance.
- **Don't** put counts, badges or status colours on sidebar items.
- **Don't** make the active pagination item a solid `primary` block; that
  over-weights a secondary control.
