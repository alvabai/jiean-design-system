# Feedback

## Purpose

How the system tells a user that something happened, is happening, or went
wrong. `brandcolor` separates four channels and keeps them separate: **inline**
(inside the affected region), **status** (a persistent attribute of a record),
**transient** (a message that disappears), and **blocking** (a decision the user
must make).

Choosing the wrong channel is the usual defect. The table below is the decision
rule.

| Situation | Channel |
|---|---|
| A record has a state (已完成 / 进行中 / 已驳回) | inline status: 6px dot + 12px text |
| A value failed validation | inline field error |
| A region failed to load | inline error banner (`error-subtle`) |
| "Saved" / "Copied" after an action | transient message, top-centre |
| An action needs confirmation | blocking modal |
| Something needs a user decision but not a interruption | drawer or a non-modal popup |
| A page-load failure the user must understand | page-level result state (Result pattern) |

## Structure and values

| Component | Value |
|---|---|
| Status dot | 6px, `success` / `warning` / `error`, radius full |
| Status text | 12px caption, `text-primary` |
| Tag | 24px tall, 8px inset, 2px radius, `canvas` fill, 12px text, `text-primary` |
| Alert | 8px vertical / 12px horizontal inset, 2px radius, `-subtle` fill, 14px text |
| Banner text colour | `text-primary` on its `-subtle` fill |
| Tooltip | `tooltip` `#353535` fill, white text, 2px radius, 8px inset |
| Modal | 520px, 48px header at 20px inset, 24px body vertical inset, 16px footer, `rounded.md`, **no shadow**, `mask` behind |
| Modal mask | `rgba(53, 53, 53, 0.6)` |
| Drawer | header 48px at 16px inset, 12px body inset, no radius on the pinned edge |
| Message (transient) | top-centre, 10px / 16px inset, 2px radius, 40px from the top |
| Non-modal popup | `surface`, `rounded.md`, `0 4px 10px rgba(0,0,0,0.1)` — the only content shadow |

## Composition rules

- **Status** is a property of the row or the record, and stays visible. It is
  never conveyed by colour alone: the dot is always accompanied by text.
- **Alerts** use the semantic `-subtle` tints with `text-primary` text; the fill
  carries the category and the text stays high-contrast. Informational alerts use
  `primary-subtle` — there is no fifth hue.
- **Tags** are neutral by default (`canvas`). A tinted tag is used only when the
  tint is itself the information (a category), never for emphasis.
- **Modals** are for decisions. They are 520px, have no shadow, and rely on the
  mask for depth. A modal always has a dismiss path (a secondary Cancel), and
  destructive actions are placed on the right with `error` fill.
- **Drawers** are for a side task that is related to but not a decision about the
  current record (editing a field, viewing history).
- **Tooltips** explain an icon or a truncated value. They never contain content
  the user must read to act — that content is a helper text or a popover.
- **Transient messages** confirm; they do not inform. Anything the user must
  retain is inline or persistent.

## States

| Feedback | Loading | Success | Failure |
|---|---|---|---|
| Inline region | skeleton at real size | content | `error-subtle` banner with a retry action |
| Action button | disabled fill, label unchanged | transient message | inline banner or field error |
| Page | Result/loading state | content | Result pattern with the reason and a way back |
| Modal | confirm button disabled while applying | modal closes | error inside the modal; the modal stays open and keeps the user's input |

A modal never closes on a failed submit and never discards entered data.

## Density

Feedback is deliberately small. Status text is 12px, tags are 24px, alerts are
8px/12px inset. A larger feedback element (a big coloured banner, a full-width
success hero) competes with the data it is reporting on and is not part of this
language.

## Empty, long and contradictory data

- **Empty**: an empty state is a *state*, shown in `text-tertiary` at caption size
  inside the region's frame, with the action that would create the first item.
- **Long messages**: alerts and banners wrap; they do not truncate and never
  scroll internally. A message that will not fit is a poorly written message.
- **Many simultaneous messages**: transient messages stack, maximum three; beyond
  that they collapse into one "3 条提示" message. Inline banners are limited to
  one per region, with the remaining problems listed inside it.
- **Contradictory feedback**: if two regions report different outcomes for the
  same action, both are shown and a `warning` marker is added to the conflicting
  message. The system does not pick a winner and does not silently suppress the
  second message.
- **Unknown failure reason**: show the generic message plus the request
  identifier. Never show an empty banner, and never fabricate a reason.

## Contrast and accessibility

- Alert text `text-primary` on any `-subtle` fill: `#E8FFEA` ≈ 11.64:1,
  `#FFF7E8` ≈ 11.52:1, `#FFECE8` ≈ 10.76:1, `#FFEEEF` ≈ 10.94:1. All pass AA.
- Status text `text-primary` on `surface` ≈ 12.27:1 — passes. Status is never
  colour-only, which is what makes it usable without hue perception.
- Tooltip white on `#353535` ≈ 12.27:1 — passes AAA.
- `primary` `#D7000F` (5.39:1 on `surface`) and `error` `#F53F3F` (3.71:1) are both
  red, and they do not trade places: a destructive action uses the `error` fill, a
  confirming or progressing one uses `primary`. Substituting one for the other
  because "it is the same colour" is what makes the distinction unreadable.
- Modal content on `surface` passes as any card does. The mask is not text and is
  exempt.
- Transient messages are `role="status"`; alerts are `role="alert"`; modals trap
  focus, are labelled by their header, and return focus to the trigger on close.
  None of this is optional.
- `error` text on `surface` ≈ 3.71:1 is marginally below AA for small text; it is
  the inherited Arco value and is documented as a preserved exception in
  [`accessibility.md`](accessibility.md). The mitigation is structural: error text
  always appears together with a border change and an explicit message, never as
  a colour-only cue.

## Do's and Don'ts

- **Do** use a 6px dot plus text for any record status.
- **Do** use `-subtle` fills for banners and `primary-subtle` for informational
  ones.
- **Do** keep modals at 520px with no shadow, relying on the mask.
- **Don't** use a coloured pill for status, or a filled `primary` block for a
  neutral tag.
- **Don't** use a modal for information, or a toast for something the user must
  act on.
- **Don't** close a modal on a failed submission, or clear a form after an error.
