# Forms
> **Scope and provenance.** This is JIEAN's own implementation guide for the
> `ArcoBlue` package: it states what this package requires. It is not a
> translation or a restatement of Arco's documentation, and it is not an Arco
> publication. Where a value is labelled *measured* or *Arco*, that is evidence
> about the research baseline recorded in [`../DESIGN.md`](../DESIGN.md)
> (Reference Sources) — not a claim that Arco defines this system.

## Purpose

Forms are the language's densest surface: a grouped form is three columns of
labelled fields on an 80px gutter, ending in a fixed action bar. The layout is
optimised for a person entering structured data from a document or a system, not
for a marketing signup.

Reference implementation: [`../examples/form-page.html`](../examples/form-page.html).

## Structure and values

| Element | Value |
|---|---|
| Field layout | vertical (label above control) |
| Label | 14px, `text-secondary` |
| Label → control gap | 8px |
| Field → field gap | 20px |
| Grouped-form gutter | 80px, three columns on the 24-column grid |
| Search-form gutter | 24px (see [`search-filter.md`](search-filter.md)) |
| Control height | 32px default (28px small, 36px large) |
| Control radius | 2px |
| Control rest fill | `canvas` `#F2F3F5` |
| Control hover fill | `surface-pressed` `#E5E6EB` |
| Control focus | `surface` fill + 1px `primary` border |
| Section card | 20px padding, 16px between sections |
| Action bar | fixed, `padding: 12px 40px`, white, `0 -3px 12px rgba(0,0,0,0.1)` |
| Action bar reserve | 90px of bottom padding on the content container |

## Composition

- A form page is a stack of **section cards**. Each card starts with a 16px card
  title naming the group ("基础信息", "执行参数"), then the field grid.
- The primary action is rightmost in the fixed bar, with the secondary action to
  its left. The bar is the only fixed element on a form page.
- Required fields are marked on the label. Constraints with a range are written
  into the label itself ("批次大小（1–500）") rather than shown only after a
  failed submit.
- Helper text sits **below** the control in the 12px caption role and
  `text-tertiary`; it is never placed to the right of a field, where it breaks
  the column rhythm.
- Inline validation messages replace the helper text in the same position, in
  `error`, and add a 1px `error` border to the control. The layout does not grow.

## States

| State | Appearance |
|---|---|
| Rest | `canvas` fill, transparent border, `text-primary` value, `text-tertiary` placeholder |
| Hover | `surface-pressed` fill |
| Focus | `surface` fill + 1px `primary` border |
| Filled | identical to rest; a filled field is not tinted differently |
| Disabled | `canvas` fill, `text-disabled` value, no hover change |
| Read-only | `text-primary` value, no fill change, no focus ring |
| Error | 1px `error` border, `error` message replacing helper text |
| Warning | 1px `warning` border, `warning` message; the value is still submittable |
| Submitting | The primary button goes to its disabled fill; the bar stays in place and does not show a spinner that shifts layout |

Note the distinction between **disabled** and **read-only**: disabled is
unavailable in this context; read-only is a value the user may copy but not
change. They must not look identical, and read-only must not use `text-disabled`.

## Density

20px between fields and 80px between columns are the contract. Three columns in
an 1100px content field gives each field ≈ 300px, which is the width the upstream
design targets for a labelled control. Two-column and four-column variants exist
(`.form-grid--two`, `.form-grid--four`) and are appropriate when field content is
narrow (numbers, dates) or wide (addresses, notes) respectively.

A form is never made "easier" by reducing to one column per screen — that
triples the page length and separates fields that belong to the same group.

## Empty, long and contradictory data

- **Empty optional field**: the placeholder states what is expected; the field is
  never pre-filled with a plausible-looking default. A default that looks like
  data is worse than an empty field.
- **Long labels**: labels wrap to a second line; the field grows. They are never
  truncated, because a truncated label is an unusable label.
- **Long values**: text inputs scroll horizontally while focused and keep a fixed
  32px height. A textarea grows; it never scrolls internally at a fixed 80px.
- **Long option lists**: a select keeps its 32px closed height and scrolls in its
  popup. Do not replace it with a multi-line listbox inside the form.
- **Contradictory input**: if a value fails a stated constraint, the constraint
  message is shown on that field and submission is blocked. The form does not
  silently coerce the value.
- **Partially valid submit**: fields are validated independently; only failing
  fields are marked, and focus moves to the first failing field.

## Contrast and accessibility

- Label `text-secondary` on `surface` ≈ 7.10:1; value `text-primary` on `canvas`
  ≈ 14.53:1. Both pass AA.
- Placeholder `text-tertiary` on `canvas` ≈ 2.92:1 **fails AA**. This is an
  inherited upstream behaviour and is documented as a preserved exception in
  [`accessibility.md`](accessibility.md). The consequence is a rule, not a
  licence: a placeholder may only be a hint, never the only statement of a
  requirement. Anything a user must read is a label, a helper text, or a
  constraint in the label — all of which pass.
- Error text uses `error` on `surface` (3.71:1) and warning text uses `warning` on
  `surface` (2.57:1). Both are preserved upstream values that fall short of AA and
  are documented as exceptions E3 and E4 in
  [`accessibility.md`](accessibility.md). The mitigation is structural: an error
  message always appears together with the field's border change and replaces the
  helper text in a fixed position, and a `warning` message is supplementary — it
  is never the only indication of a problem. Warning is not permitted as a text
  colour anywhere else.
- Disabled state is exempt from WCAG 1.4.3 and is intentionally low-contrast; it
  is the one place `text-disabled` `#C9CDD4` is legitimate.
- Every control has a programmatic label (`for` / `id` in the reference pages),
  and the fixed action bar is at the end of the form in the tab order, not
  inserted before it.

## Do's and Don'ts

- **Do** group fields into named section cards, three columns, 80px gutter.
- **Do** keep the submit action in the fixed bottom bar.
- **Do** state constraints in the label and expected input in the placeholder.
- **Don't** replace the filled control with a white outlined control.
- **Don't** use an inline/left-aligned label layout for a grouped form — that
  layout belongs to the search area only.
- **Don't** disable the submit button as the *only* validation feedback; a
  disabled button with no explanation leaves the user stuck.
- **Don't** add a stepper, a breadcrumb or a progress bar to a form page; the
  step flow belongs to a workflow ([`workflow.md`](workflow.md)).
