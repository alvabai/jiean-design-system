# Accessibility
> **Scope and provenance.** This is JIEAN's own implementation guide for the
> `ArcoBlue` package: it states what this package requires. It is not a
> translation or a restatement of Arco's documentation, and it is not an Arco
> publication. Where a value is labelled *measured* or *Arco*, that is evidence
> about the research baseline recorded in [`../DESIGN.md`](../DESIGN.md)
> (Reference Sources) — not a claim that Arco defines this system.

## Purpose

ArcoBlue inherits Arco Design Pro's palette, and that palette has contrast
weaknesses. This document is the authoritative statement of **which weaknesses
are preserved, why, and what rule makes each one safe** — and which are not
permitted at all.

It does not restate WCAG. It covers the pairs and patterns this system ships.

Every ratio below is computed from the resolved values in
[`../dist/tokens.full.json`](../dist/tokens.full.json) with the WCAG 2.x
relative-luminance formula; alpha values are composited over their backdrop
first. The computation is reproducible and is run by
`npm run 3:verify-generated` (see
[`../reports/designmd-validation.md`](../reports/designmd-validation.md)).

Colour names in this document are the contract's token names, not Arco's; the
Arco ramp values in the "AA-compliant alternative" column come from
`@arco-themes/react-arco-pro/tokens.less` and were read directly, not recalled.

## Contrast audit — text on light surfaces

| Pair | Ratio | AA 4.5:1 |
|---|---|---|
| `text-primary` `#1D2129` on `surface` `#FFFFFF` | 16.13 | pass |
| `text-primary` on `canvas` `#F2F3F5` | 14.53 | pass |
| `text-primary` on `surface-hover` `#F7F8FA` | 15.18 | pass |
| `text-primary` on `primary-subtle` `#E8F3FF` | 14.36 | pass |
| `text-primary` on `success-subtle` `#E8FFEA` | 15.30 | pass |
| `text-primary` on `warning-subtle` `#FFF7E8` | 15.15 | pass |
| `text-primary` on `error-subtle` `#FFECE8` | 14.15 | pass |
| `text-secondary` `#4E5969` on `surface` | 7.10 | pass |
| `text-secondary` on `canvas` | 6.40 | pass |
| `text-secondary` on `surface-pressed` `#E5E6EB` | 5.70 | pass |
| `text-secondary` on `primary-subtle` | 6.32 | pass |
| `text-tertiary` `#86909C` on `surface` | 3.24 | **fail** — E1 |
| `text-tertiary` on `canvas` | 2.92 | **fail** — E1 |
| `text-tertiary` on `surface-hover` | 3.05 | **fail** — E1 |
| `text-disabled` `#C9CDD4` on `surface` | 1.59 | **fail** — E2 |

## Contrast audit — accent and semantic

| Pair | Ratio | AA 4.5:1 | Verdict |
|---|---|---|---|
| `primary` `#165DFF` on `surface` | 5.19 | pass | ok |
| `primary` on `canvas` | 4.68 | pass | ok |
| `primary` on `primary-subtle` | 4.62 | pass | ok |
| white on a `primary` fill | 5.19 | pass | ok |
| `error` `#F53F3F` on `surface` | 3.71 | **fail** | E3 |
| white on an `error` fill | 3.71 | **fail** | E3 |
| `error` on `error-subtle` | 3.25 | **fail** | E3 |
| `warning` `#FF7D00` on `surface` | 2.57 | **fail** | E4 |
| `warning` on `warning-subtle` | 2.41 | **fail** | E4 |
| `success` `#00B42A` on `surface` | 2.78 | **fail** | E4 |
| `success` on `success-subtle` | 2.63 | **fail** | E4 |

## Contrast audit — dark anchors

| Pair | Ratio | AA 4.5:1 |
|---|---|---|
| `dark-text` `#FFFFFFE6` on `dark-canvas` `#17171A` | 14.61 | pass |
| `dark-text` on `dark-surface` `#232324` | 12.94 | pass |
| `dark-text` on `dark-elevated` `#373739` | 9.97 | pass |
| `dark-text` on `dark-border` `#484849` | 7.80 | pass |
| `dark-text-secondary` `#FFFFFFB3` on `dark-canvas` | 9.22 | pass |
| `dark-text-secondary` on `dark-surface` | 8.36 | pass |
| `dark-text-secondary` on `dark-elevated` | 6.74 | pass |
| `primary` on `dark-canvas` | 3.44 | **fail** — E5 |
| `primary` on `dark-surface` | 3.02 | **fail** — E5 |
| `primary` on `dark-elevated` | 2.29 | **fail** — E5 |

## Contrast audit — structure and non-text

| Pair | Ratio | Note |
|---|---|---|
| `tooltip` `#1D2129` with white text | 16.13 | pass |
| `primary` focus ring on `surface` | 5.19 | pass (3:1 target) |
| `primary` on `canvas` | 4.68 | pass (3:1 target) |
| `border` `#E5E6EB` on `surface` | 1.25 | structural hairline, not a control boundary |
| `border-strong` `#C9CDD4` on `surface` | 1.59 | structural; used as an input's hover fill, not its only boundary |
| `surface` on `canvas` (card edge) | 1.11 | subliminal, see [`cards.md`](cards.md) |

## The preserved exceptions

Each of these is inherited from Arco and kept, because changing it would change
the identity that was reverse-engineered. Each carries a rule that makes it safe
in practice.

**E1 — `text-tertiary` on light fills (2.92–3.24:1).**
Permitted only for non-essential text: helper text, captions, chart axis labels,
empty-state messages, masked values, and the placeholder of an input **that also
has a visible label**. Not permitted for a value a user must read to act, a
status, an error, or a required instruction.

**E2 — `text-disabled` (1.59:1).**
Permitted only for controls in a genuinely disabled state and for a disabled step.
Disabled and inactive UI components are exempt under WCAG 1.4.3. Mitigation is a
rule, not a colour: **every disabled control states its reason in normal-contrast
text nearby** — see [`permission.md`](permission.md). A disabled control with no
stated reason is a defect.

**E3 — `error` `#F53F3F` as text or as a button fill (3.25–3.71:1).**
This is the most consequential exception in the system: Arco's error red does not
reach AA on white for 14px text, and white text on an `error` fill has the same
ratio. Preserved for fidelity with two rules:

- Error **text** is never the only cue. The field's border also changes to
  `error`, and the message replaces the helper text in a fixed position, so the
  failure is perceivable without colour.
- A destructive **button** carries a verb label ("删除记录"), never "确定", and the
  consequence is restated in normal-contrast body text in the same dialog.
- AA-compliant alternatives exist in the same upstream ramp and are the
  recommended override when a team must meet AA on error text or a destructive
  fill: `#CB272D` (Arco `red-7`, 5.43:1) or `#A1151E` (Arco `red-8`, 7.95:1).
  Using them is a deliberate deviation from the measured design and must be
  recorded as such.

**E4 — `warning` `#FF7D00` (2.41–2.57:1) and `success` `#00B42A` (2.63–2.78:1)
as text.**
Neither hue is **permitted as text on a light surface**. They are permitted as:

- the 6px dot of a status, always accompanied by a text label in `text-primary`;
- a tag fill, with `text-primary` on top (≥ 14.15:1);
- a 1px border or an `-subtle` fill.

`primary`, `error`, `text-primary` and `text-secondary` are the only permitted
text colours on light surfaces. AA alternatives when semantic text colour is
unavoidable: `#A64500` (Arco `orange-8`, 6.05:1) for warning, `#008026` (Arco
`green-8`, 5.10:1) for success.

**E5 — `primary` on dark surfaces (2.29–3.44:1).**
Dark surfaces are **anchors, not a theme**: the contract defines six dark values
so an implementer does not invent them. The four example pages render the light
theme only, so they do not demonstrate them. `primary-on-dark` is the role
intended for interactive use on those surfaces, and it clears AA on all three
(4.61–6.95:1); `primary` itself does not, and must not be used for text on a dark
fill — use `dark-text` or `dark-text-secondary`, both of which pass on all three
dark surfaces.

## Non-colour requirements

These are part of the specification, not recommendations.

- **Status is always dot + text.** Never colour alone. Applies to tables, tags,
  step flows and batch trails. This is what makes E4 safe.
- **Selection is always fill + weight, or `aria-current`.** The selected sidebar
  item, the current breadcrumb segment, the active pagination item and the active
  step each carry a second cue beyond colour.
- **Focus is always a 1px `primary` border on a `surface` fill.** Inputs must not
  remove their focus indicator, and must not invent a second focus style. The
  filled→white inversion plus the border is visible on every background in use.
- **Every icon-only control has an accessible name.** The reference pages put
  `aria-label` on each.
- **Page structure uses real headings and landmarks** — `h1` for the page-level
  title, `h2` for card titles, and `header` / `aside` / `main` / `nav`.
- **Tables use `<th scope="col">`** and expose `aria-sort` when sortable.
- **A modal traps focus, is labelled by its header, and returns focus on close.**
- **A step flow is an ordered list** so the sequence survives without the
  connector rules.
- **A chart carries a text equivalent.**

## Verification

Because these ratios are derived rather than asserted, a change to any colour in
[`../DESIGN.md`](../DESIGN.md) invalidates them. Re-run the verification instead
of editing a number here; the audit is computed, and the report records the
command and the contract's `sha256`.

## Do's and Don'ts

- **Do** state an exception together with its mitigation, as this document does.
- **Do** pair every status colour with text, and every disabled control with a
  reason.
- **Don't** use `warning`, `success` or `primary` as text on a light surface.
- **Don't** use `text-tertiary` for anything a user must read to act.
- **Don't** remove a focus indicator.
- **Don't** ship a dark surface without re-auditing it against these numbers.
- **Don't** quote a contrast ratio from memory. Compute it from the contract.
