# Search and filter

## Purpose

The search area is the top band of a list card. It has one job: let a user narrow
a table without leaving it. In `brandcolor` it is a compact inline form with
left-aligned labels, not a vertical form and not a set of floating chips.

Reference implementation: [`../examples/list-page.html`](../examples/list-page.html).

## Structure and values

| Element | Value |
|---|---|
| Search area position | top of the list card, under the card title |
| Field grid | two columns, 24px column gutter, 20px row gap |
| Label | left of the control, 14px `text-secondary` |
| Label width | ≈ 84px (`span 5` of an 8-span column in the upstream 24-column grid) |
| Label → control gap | 16px |
| Controls | 32px tall, `canvas` fill, 2px radius (same as any input) |
| Button column | separate column, 160px, left border 1px `border`, buttons stacked and full-width |
| Divider below | 1px `border-subtle` `#F2F3F5` |
| Space below divider | 20px before the toolbar |
| Toolbar | title-left/actions-right, 24px below the search area |

The button column is separated by a **1px left border** at `border` `#E5E6EB`,
and the whole search area is closed by a **1px bottom border** at `border-subtle`
`#F2F3F5`. Those two rules are what make the band read as a distinct region; both
are hairline and neither is a background tint.

## Composition

- **Query** is the primary button (top of the stacked pair); **Reset** is the
  secondary button beneath it. In a wider layout the pair becomes horizontal and
  keeps the search button first.
- Two to six fields. More than six fields means the search area needs a
  "展开/收起" affordance that reveals the remainder, not a taller always-open band.
- The most frequently used filters come first, in the reading order of the table's
  columns.
- A field that filters a date range is a single 32px range control, not two
  separate controls with a separator drawn between them.
- The toolbar below holds create/import on the left and export on the right; the
  search never holds a create action.

## States

| State | Behaviour |
|---|---|
| Rest | Placeholders state what to enter; selects show 全部 |
| Field focused | Standard input focus: white fill + 1px `primary` border |
| Applied | Applied filters are visible in the fields themselves; no separate chip row is added |
| Applied + collapsed | When the area is collapsed, the applied count is stated in the collapsed summary, never only implied by the table |
| Loading | The query button takes its disabled fill; the table shows skeleton rows |
| No results | The table's filtered-empty state names the filter and offers Reset |
| Invalid | The field shows a 1px `error` border and a message; the table is not cleared |

## Density

24px between columns and 20px between rows is the search-area contract
(`search-gutter` and the field rhythm). This gutter is deliberately narrower than
a grouped form's 80px: a search field's label is inline, so the eye follows a row
rather than a column, and 80px would waste a third of the band.

## Empty, long and contradictory data

- **Empty area**: a list with no filters at all still renders the toolbar and the
  table; the search area is removed entirely rather than shown empty.
- **Long labels**: search labels do not wrap. If a label does not fit 84px, the
  filter is renamed or the search area is given an explicit wider label column —
  a wrapped label breaks the row rhythm of every other field.
- **Long values**: an input scrolls horizontally; a select's chosen value
  truncates inside the 32px control.
- **Contradictory filters**: a start date after an end date is shown as entered
  and marked with an `error` border on the range control. The query is not run
  with a silently swapped range.
- **Zero-width results**: a filter combination that can never match still runs and
  reports "没有符合条件的记录"; the search area does not pre-emptively disable
  filters.

## Contrast and accessibility

- Label `text-secondary` on `surface` ≈ 7.10:1 — passes AA.
- Control value `text-primary` on `canvas` ≈ 14.53:1 — passes AA. Placeholder
  `text-tertiary` on `canvas` ≈ 2.92:1 fails AA; this is the preserved upstream
  exception documented in [`accessibility.md`](accessibility.md) and is
  permitted here only because every field also has a visible label.
- The two hairline rules that bound the search band are structural, not control
  boundaries.
- The search form is a real `<form>` with a submit control, so Enter submits from
  any field; labels are programmatically associated; the button column's stacked
  buttons are in the tab order after the last field.

## Do's and Don'ts

- **Do** keep labels inline and left-aligned in the search band.
- **Do** keep the query button first and Reset second, in a bounded action column.
- **Don't** turn the search area into a vertical grouped form; that layout belongs
  to [`forms.md`](forms.md).
- **Don't** render applied filters as removable chips — the fields already show
  the state, and chips duplicate it.
- **Don't** auto-search on every keystroke against a slow backend; the explicit
  query button is the contract, and debounced live search is an opt-in the pattern
  does not describe.
