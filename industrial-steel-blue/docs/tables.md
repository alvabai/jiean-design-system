# Tables
> **Scope and provenance.** This is JIEAN's own implementation guide for the
> `IndustrialSteelBlue` package: it states what this package requires. It is not a
> translation or a restatement of Arco's documentation, and it is not an Arco
> publication. Where a value is labelled *measured* or *Arco*, that is evidence
> about the research baseline recorded in [`../DESIGN.md`](../DESIGN.md)
> (Reference Sources) — not a claim that Arco defines this system.

## Purpose

The table is the primary data surface of IndustrialSteelBlue. Its defining quality is
density: 9px of vertical cell padding, 16px horizontal, 14px text, and a single
grey header band.

Reference implementation: [`../examples/list-page.html`](../examples/list-page.html)
(the table in its full list-page context) and the "表格密度" section of
[`../examples/list-page.html`](../examples/list-page.html) (the table in
isolation).

## Structure and values

| Element | Value |
|---|---|
| Header background | `canvas` `#F2F3F5` |
| Header text | 14px / 500, `text-primary` |
| Header bottom rule | 1px `border` `#E5E6EB` |
| Cell background | `surface` `#FFFFFF` |
| Cell text | 14px / 400, `text-primary` |
| Cell padding | 9px vertical, 16px horizontal |
| Single-line row height | ≈ 41px |
| Two-line row height | ≈ 63px |
| Row hover | `surface-hover` `#F7F8FA` |
| Bottom rule | 1px `border`, including on the last row |
| Container radius | 4px top corners only |

Measured upstream: a single-line body row is 41px and a two-line row is 63px,
with a cell line-height of 22px (the computed value of Arco's 1.5715 multiplier at 14px).

## Composition

- **Header row** is the only row at weight 500. It is never tinted per column and
  never carries a coloured underline.
- **Numeric columns** are right-aligned and use tabular figures (`tnum`) so digits
  line up down the column. Text columns are left-aligned. Nothing is centred.
- **Identifiers** (record numbers, codes) are left-aligned and use the body role,
  not a monospace font.
- **Status columns** render a 6px dot plus a 12px text label. They are never
  rendered as a coloured pill, and never as colour alone.
- **Action columns** are last, right-aligned where the design calls for it, and
  use a 28px text button per row. At most two actions are shown inline; the rest
  go into an overflow menu.
- **Sortable headers** show a 12px sort affordance in `text-tertiary`, and the
  sorted column keeps it visible in `text-secondary`.
- **Selection** uses a 16px checkbox in the first column with a header
  select-all. A selection, once made, shows a count and the batch actions in the
  toolbar — the table does not grow a second toolbar.

## States

| State | Appearance |
|---|---|
| Loading | Skeleton rows at the real row height inside the existing header; header stays visible |
| Empty | The header stays; the body shows a centred message in `text-tertiary`, plus the primary action that would create the first record |
| Filtered-empty | The empty message names the filter ("没有符合条件的记录") and offers a reset, not a create action |
| Error | The body is replaced by an `error-subtle` banner; the header and the toolbar stay usable |
| Partial page | Rows render normally; a footer note states that data is incomplete |
| Selected row | `primary-subtle` fill; hover on a selected row keeps the selection fill |
| Disabled row | `text-disabled` text; the row stays in place and is not removed |
| Expanding row | A detail panel opens directly beneath, spanning the full width, with 20px padding; the row itself is unchanged |

## Density

Density is fixed at 9px/16px. There is no "comfortable" variant, and a screen may
not raise the padding to look airy — the whole language is calibrated so that a
content field shows the maximum number of usable rows.

When a table needs more horizontal room, the **table scrolls horizontally** and
the content minimum width of 1100px is respected. It never drops columns, and it
never shrinks the type to fit.

Columns may be reordered and resized by the user; widths are per-instance state
and are not part of this specification.

## Empty, long and contradictory data

- **Empty**: keep the header. An empty table with a visible header tells the user
  that the list exists and is simply empty; a table replaced by a bare message
  loses the column context that explains what would appear.
- **Long text**: cells wrap and rows grow. The one exception is an **identifier
  column**, which may truncate with an ellipsis and expose the full value in a
  tooltip — identifiers are unreadable mid-word anyway. Never truncate a name,
  a status, or a number.
- **Long numbers**: numbers wrap at separators, never mid-digit; the column grows
  to fit the widest cell before wrapping is considered.
- **Many columns**: horizontal scroll inside the table container. The first
  column (the identifier) may be pinned, and if it is, it keeps a 1px right rule
  so the pinning is visible.
- **Contradictory rows**: if a row's status disagrees with its data (状态 = 已完成
  but 完成度 = 54%), the row renders both values unchanged and the cell that is
  suspect carries a `warning` marker. The table never suppresses or reconciles
  the conflict.
- **Duplicate identifiers**: shown as-is, with a `warning` dot on the identifier
  cell. Deduplication is a data-layer concern.

## Contrast and accessibility

- Header `text-primary` on `canvas` ≈ 14.53:1; body `text-primary` on `surface`
  ≈ 16.13:1; hover row `text-primary` on `surface-hover` ≈ 15.15:1. All pass AA.
- The row bottom rule is a non-text boundary and may sit below 3:1; it is a
  grouping aid, not a control boundary.
- Status is never colour-only: the dot is always paired with a text label, which
  is what carries the meaning for a user who cannot distinguish the hues.
- Sortable headers are real buttons with `aria-sort` on the column header, and
  the sort direction is exposed textually, not only by an arrow.
- Table markup uses `<table>`, `<thead>`, `<th scope="col">` and `<tbody>` so
  header association works without ARIA shims.

## Do's and Don'ts

- **Do** keep the header band `canvas` and the only 500-weight row.
- **Do** right-align and tabular-align numeric columns.
- **Do** keep the header visible in every state, including empty and loading.
- **Don't** raise the cell padding for comfort, add zebra striping, or put the
  table inside a bordered panel.
- **Don't** render status as a coloured pill, or use colour as the only signal.
- **Don't** centre-align data cells, and don't use a monospace face for
  identifiers.
