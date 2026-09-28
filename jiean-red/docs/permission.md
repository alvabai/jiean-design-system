# Permission
> **Scope and provenance.** This is JIEAN's own implementation guide for the
> `JIEAN Red` package: it states what this package requires. It is not a
> translation or a restatement of Arco's documentation, and it is not an Arco
> publication. Where a value is labelled *measured* or *Arco*, that is evidence
> about the research baseline recorded in [`../DESIGN.md`](../DESIGN.md)
> (Reference Sources) — not a claim that Arco defines this system.

## Purpose

How an `jiean-red` screen behaves when a user may not see or may not change
something. Permission is a *presentation* problem here: the same record looks
different to two roles, and the difference must be legible rather than mysterious.

## The four levels

Every restricted element resolves to exactly one of these, and the choice must be
deliberate:

| Level | Use when | Rendering |
|---|---|---|
| **Hidden** | The user has no relationship to the object at all | The element is absent. Menu entries the user cannot reach are omitted |
| **Disabled** | The user can see the surface but cannot act now | Control disabled (`text-disabled`), with the reason on hover or beside it |
| **Read-only** | The user may see the value and must not change it | Normal value colour (`text-primary`), no hover change, no focus ring; a 12px note states who may change it |
| **Masked** | The field exists but its value is not theirs to see | `••••` in `text-tertiary`, with a note naming what is required |

Rules that fall out of the table:

- **Hidden is for structure, disabled is for a decision, read-only is for a
  value.** Using disabled where read-only is meant makes an unchanged value look
  broken; using read-only where disabled is meant lets a user believe an action
  will work.
- **Missing menu entries are hidden, not disabled.** A greyed-out menu entry tells
  the user about a feature they cannot have; that is not this language's default.
  The exception is a paid or to-be-enabled capability, where the disabled entry
  plus a reason is intentional.
- **A page the user cannot enter renders an explanation card**, not a redirect
  and not an empty shell. It names what role would grant access and who to ask.
- **Nothing is masked that the user must understand to act.** A masked value may
  be supplemented by the values derived from it that the user does need (a total
  without its components, for instance).

## Structure and values

| Element | Value |
|---|---|
| Explanation card | standard content card, 20px padding, `text-secondary` body |
| Restriction note | 12px caption, `text-tertiary`, 8px below the control |
| Disabled control | `canvas` fill, `text-disabled` value, no hover |
| Masked value | 14px `text-tertiary`, `••••` |
| Restricted menu entry | hidden by default; when shown as a teaser, `text-disabled` with a lock icon |
| Role hint in a table | last column, 12px `text-tertiary`, states the required role |

## Composition

- A page-level restriction is a single card containing the reason, the required
  role, and the escalation contact. It appears in the normal content position
  under the breadcrumb.
- A field-level restriction is inline: the control plus a caption note. It does
  not open a modal.
- A row-level restriction (a record the user may see but not open) renders the
  row with its identifier as plain text instead of a link, and a note in the
  actions column.
- Batch actions are hidden when the user cannot perform them on **any** selected
  row, and appear disabled with a count when they can be performed on some.

## States

| State | Behaviour |
|---|---|
| Loading | The page renders its shell, breadcrumb and card frames; restricted regions resolve after the role is known |
| Not permitted (page) | Explanation card, no data requested |
| Not permitted (field) | Read-only or masked, per the four levels |
| Partially permitted | Allowed regions render normally; restricted regions carry notes. The page is not blocked as a whole |
| Permission changed mid-session | The next action reports the new refusal inline; the page does not silently reload or blank out |
| Session expired | A single modal stating re-authentication is needed; the underlying form's data is preserved |

## Density

Permission treatments add no new spacing: a note is 8px under its control and is
the same 12px caption used everywhere. A restricted page uses the same 20px card
padding as any other page. Restrictions must not make the interface look denser or
sparser than the unrestricted version — only partially different.

## Empty, long and contradictory data

- **Empty**: if no role is configured for a route, the page states that access is
  unconfigured and names the owner. It never falls back to allowing access, and
  never to a blank page.
- **Long role names**: wrap in the note; they are never abbreviated into ambiguity.
- **Long lists of restrictions**: when a page has more than three restricted
  fields, the restrictions are summarised once at the top of the card instead of
  repeated on every field, and each masked field keeps only its own marker.
- **Contradictory permission**: if the server allows an action the UI has hidden,
  or refuses an action the UI has enabled, the refusal is reported inline on that
  action and a `warning` note states that the permissions shown were out of date.
  The UI never silently re-lays-out the page to hide the mismatch — the user needs
  to know why their action failed.

## Contrast and accessibility

- Disabled content is exempt from WCAG contrast minimums and is intentionally
  low-contrast (`text-disabled` `#C9CDD4`). Because it is exempt *and* hard to
  read, a disabled control must always carry a visible reason in normal-contrast
  text nearby. A disabled control with no stated reason is a defect.
- Read-only values keep `text-primary` (≈ 16.13:1) precisely so that they do not
  look disabled. The distinction is carried by interaction behaviour (no hover, no
  focus ring) plus a caption, not by colour alone.
- Masked values use `text-tertiary` (≈ 3.24:1 on `surface`) and always appear with a
  caption naming the requirement; the mask characters are not the message.
- Restriction state is exposed to assistive technology as text: disabled controls
  keep `disabled`/`aria-disabled` **and** an accessible description with the
  reason; masked fields carry an `aria-label` naming what is masked and why.

## Do's and Don'ts

- **Do** resolve every restriction to one of hidden / disabled / read-only /
  masked, and say why.
- **Do** keep read-only values at normal contrast.
- **Do** give a disabled control a visible reason.
- **Don't** hide a whole page behind an empty shell; explain it.
- **Don't** grey out a value the user is allowed to read.
- **Don't** rely on the server to catch a permission problem the interface already
  knows about; and when it does catch one, report it rather than retrying
  silently.
