# Workflow
> **Scope and provenance.** This is JIEAN's own implementation guide for the
> `JIEAN Red` package: it states what this package requires. It is not a
> translation or a restatement of Arco's documentation, and it is not an Arco
> publication. Where a value is labelled *measured* or *Arco*, that is evidence
> about the research baseline recorded in [`../DESIGN.md`](../DESIGN.md)
> (Reference Sources) — not a claim that Arco defines this system.

## Purpose

Workflow covers the patterns for a process: step flows, approvals, batch
operations with a progress trail, and the confirmation of an irreversible action.
It is the intersection of [`navigation.md`](navigation.md) (steps),
[`feedback.md`](feedback.md) (messaging) and
[`permission.md`](permission.md) (who may do what).

Reference implementation: the step flow in
[`../examples/detail-page.html`](../examples/detail-page.html).

## Structure and values

| Element | Value |
|---|---|
| Step circle | 28px, radius full, 16px title |
| Step title | 16px / 500 for the active step, 16px / 400 otherwise |
| Step description | 12px caption |
| Connector | 1px `border` rule between steps |
| Centred detail flow | `max-width: 548px`, 8px above, 30px below |
| Approval action bar | 36px buttons, 19px horizontal padding, fixed, `padding: 12px 40px`, `0 -3px 12px rgba(0,0,0,0.1)` |
| Progress trail (batch) | rows at 41px, same density as [`tables.md`](tables.md) |
| Confirmation modal | 520px, no shadow, mask `rgba(29,33,41,0.6)` |

## Composition

- **Step flow** appears once, at the top of the process's detail card, centred,
  lineless. It states where the record is; it is not a navigation control and is
  not clickable — except that a completed step may link to that step's record.
- **Approval** is a form-like card: the fields to be approved are shown read-only,
  the decision controls are in the fixed bottom bar, and the reject action sits
  left of the approve action. An approval screen is not a form the user edits.
- **Batch operations** show a progress trail with one row per item: identifier,
  current state, and the outcome. The trail uses the table density so a 40-item
  batch stays scannable.
- **Long-running work** reports progress as a count and a state, not as a
  percentage bar with no item context. A user must be able to find the items that
  failed.
- **Confirmation** of an irreversible action is a 520px modal naming the object,
  stating the consequence, and placing the destructive action on the right with an
  `error` fill. The confirm button restates the action verb ("删除记录"), never
  "确定".

## States

| State | Value of the active step |
|---|---|
| Pending | `border` circle, `text-secondary` text |
| In progress | solid `primary` circle, white index, 500-weight title |
| Done | `primary-subtle` circle with a tick in `primary` |
| Rejected | done-styled circle, but the description text is `error` and states why |
| Skipped | `canvas` circle with `text-tertiary` dash, description names the skip |
| Cancelled | all circles `text-disabled`, description text states who cancelled |

For a batch trail:

| Item state | Rendering |
|---|---|
| Queued | `text-tertiary`, waiting label |
| Running | `primary` dot, running label |
| Succeeded | `success` dot, succeeded label |
| Failed | `error` dot, succeeded label plus the reason inline |
| Skipped | `text-tertiary` dot, skipped label |

## Density

Workflow screens keep the table/form density rather than introducing larger
"process" chrome. The one place a workflow is allowed to be visually larger is
the centred step flow's 16px titles — the process is the page's subject, and the
548px centring is what marks it as such.

## Empty, long and contradictory data

- **Empty process**: no steps defined means the flow region is omitted and the
  card states that no workflow is configured. An empty step strip is never shown.
- **Long step titles**: the flow scrolls horizontally at a fixed 548px; titles do
  not wrap to a second line, because a wrapped step breaks the connector rhythm.
- **Long item lists in a batch**: paginate the trail at the table's page size; the
  summary line always states the total and the failure count.
- **Contradictory state**: if a record's stored step and its activity log
  disagree, the flow renders the stored step and adds a `warning` note naming the
  discrepancy. The workflow never advances itself to match the log.
- **Failure with no reason**: the trail shows the failure state and the request
  identifier, and states that the reason is unavailable. It never fabricates an
  explanation.

## Contrast and accessibility

- Active step: white index on `primary` ≈ 5.19:1 — passes AA for the 14px index.
- Done step: `primary` on `primary-subtle` ≈ 4.62:1 — passes AA.
- Pending step: `text-secondary` on `border` `#E5E6EB` ≈ 5.70:1 — passes AA.
- The rejected step's description uses `error` on `surface` (3.71:1), which is the
  preserved exception E3; it is always accompanied by the rejection reason in the
  step's own text, so the state is not carried by colour alone.
- A destructive confirm button is white on an `error` fill (3.71:1) — exception
  E3. The mitigation is that the dialog's body text states the consequence in
  normal contrast, and the button label contains the verb.
- The current step is signalled by fill plus weight, not by colour alone, and the
  flow is an ordered list so the sequence is exposed without the connector rules.
- A batch trail's status is a dot plus a text label, never colour alone.
- A confirmation modal traps focus, is labelled by its header, and returns focus
  to the triggering control; the destructive action is not the default focus
  target.

## Do's and Don'ts

- **Do** keep the step flow to one per page and never make it a navigation
  control.
- **Do** name the object and the consequence in a confirmation, and label the
  button with the verb.
- **Do** give a batch a per-item trail with a failure count.
- **Don't** use a percentage progress bar as the only progress signal for a
  multi-item job.
- **Don't** make an approval screen editable, and don't hide the fields being
  approved.
- **Don't** use "确定 / OK" as a destructive action's label.
