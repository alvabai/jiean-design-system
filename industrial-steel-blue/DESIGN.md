---
version: alpha
name: JIEAN Design System / IndustrialSteelBlue (工业钢蓝)
description: IndustrialSteelBlue (工业钢蓝) — the industrial style package of the JIEAN Design System, independently produced by JIEAN from publicly available official Arco Design and Arco Design Pro material, with a documented adaptation of the interactive colour to a cool, deep, restrained steel blue.
colors:
  primary: "#3E6489"
  primary-hover: "#4C7BA9"
  primary-active: "#324C65"
  primary-disabled: "#A8C0D8"
  primary-subtle: "#EDF2F7"
  primary-on-dark: "#628DB8"
  canvas: "#F2F3F5"
  surface: "#FFFFFF"
  surface-hover: "#F7F8FA"
  surface-pressed: "#E5E6EB"
  text-primary: "#1D2129"
  text-secondary: "#4E5969"
  text-tertiary: "#86909C"
  text-disabled: "#C9CDD4"
  border: "#E5E6EB"
  border-subtle: "#F2F3F5"
  border-strong: "#C9CDD4"
  success: "#00B42A"
  success-subtle: "#E8FFEA"
  warning: "#FF7D00"
  warning-subtle: "#FFF7E8"
  error: "#F53F3F"
  error-strong: "#CB272D"
  error-strong-hover: "#A1151E"
  error-strong-active: "#770813"
  error-subtle: "#FFECE8"
  mask: "rgba(29, 33, 41, 0.6)"
  tooltip: "#1D2129"
  dark-canvas: "#17171A"
  dark-surface: "#232324"
  dark-elevated: "#373739"
  dark-text: "rgba(255, 255, 255, 0.9)"
  dark-text-secondary: "rgba(255, 255, 255, 0.7)"
  dark-border: "#484849"
typography:
  page-title:
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "noto sans", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif'
    fontSize: 20px
    fontWeight: 500
    lineHeight: 28px
  section-title:
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "noto sans", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif'
    fontSize: 16px
    fontWeight: 500
    lineHeight: 24px
  card-title:
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "noto sans", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif'
    fontSize: 16px
    fontWeight: 500
    lineHeight: 24px
  body:
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "noto sans", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif'
    fontSize: 14px
    fontWeight: 400
    lineHeight: 22px
  secondary-body:
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "noto sans", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif'
    fontSize: 13px
    fontWeight: 400
    lineHeight: 20px
  label:
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "noto sans", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif'
    fontSize: 14px
    fontWeight: 400
    lineHeight: 22px
  caption:
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "noto sans", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif'
    fontSize: 12px
    fontWeight: 400
    lineHeight: 18px
  table:
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "noto sans", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif'
    fontSize: 14px
    fontWeight: 400
    lineHeight: 22px
    fontFeature: "tnum"
  button:
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "noto sans", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif'
    fontSize: 14px
    fontWeight: 400
    lineHeight: 22px
  statistic:
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "noto sans", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif'
    fontSize: 22px
    fontWeight: 600
    lineHeight: 33px
    fontFeature: "tnum"
  code:
    fontFamily: 'Consolas, Menlo, monospace'
    fontSize: 13px
    fontWeight: 400
    lineHeight: 20px
spacing:
  micro: 2px
  xs: 4px
  sm: 8px
  control-inset: 12px
  md: 16px
  page-x: 20px
  card: 20px
  lg: 24px
  xl: 32px
  table-x: 16px
  table-y: 9px
  form-gutter: 80px
  search-gutter: 24px
rounded:
  none: 0px
  sm: 2px
  md: 4px
  lg: 8px
  full: 9999px
components:
  shell-header:
    height: 60px
    backgroundColor: "{colors.surface}"
  shell-sidebar:
    width: 220px
    backgroundColor: "{colors.surface}"
  shell-sidebar-collapsed:
    width: 48px
  shell-content:
    width: 1100px
    backgroundColor: "{colors.canvas}"
  dashboard-rail:
    width: 280px
  page-title:
    typography: "{typography.page-title}"
    textColor: "{colors.text-primary}"
  section-title:
    typography: "{typography.section-title}"
    textColor: "{colors.text-primary}"
  button-primary:
    height: 32px
    padding: 15px
    rounded: "{rounded.sm}"
    typography: "{typography.button}"
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-primary-active:
    backgroundColor: "{colors.primary-active}"
  button-primary-disabled:
    backgroundColor: "{colors.primary-disabled}"
  button-outline:
    height: 32px
    padding: 15px
    rounded: "{rounded.sm}"
    typography: "{typography.button}"
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
  button-text:
    height: 32px
    padding: 15px
    rounded: "{rounded.sm}"
    typography: "{typography.button}"
    textColor: "{colors.primary}"
  button-danger:
    height: 32px
    padding: 15px
    rounded: "{rounded.sm}"
    typography: "{typography.button}"
    backgroundColor: "{colors.error-strong}"
    textColor: "{colors.surface}"
  button-danger-hover:
    backgroundColor: "{colors.error-strong-hover}"
  button-danger-active:
    backgroundColor: "{colors.error-strong-active}"
  button-secondary:
    height: 32px
    padding: 15px
    rounded: "{rounded.sm}"
    typography: "{typography.button}"
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.text-primary}"
  button-secondary-hover:
    backgroundColor: "{colors.surface-pressed}"
  link:
    typography: "{typography.body}"
    textColor: "{colors.primary}"
  input:
    height: 32px
    padding: "{spacing.control-inset}"
    rounded: "{rounded.sm}"
    typography: "{typography.body}"
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.text-primary}"
  input-hover:
    backgroundColor: "{colors.surface-pressed}"
  input-focus:
    backgroundColor: "{colors.surface}"
  control-disabled-text:
    textColor: "{colors.text-disabled}"
  placeholder-text:
    textColor: "{colors.text-tertiary}"
  form-label:
    typography: "{typography.label}"
    textColor: "{colors.text-secondary}"
  card:
    rounded: "{rounded.md}"
    padding: "{spacing.card}"
    backgroundColor: "{colors.surface}"
  card-title:
    typography: "{typography.card-title}"
    textColor: "{colors.text-primary}"
  card-body:
    typography: "{typography.body}"
    textColor: "{colors.text-secondary}"
  input-disabled:
    backgroundColor: "{colors.canvas}"
  input-error:
    textColor: "{colors.error}"
  input-readonly:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.text-secondary}"
  menu-item-hover:
    backgroundColor: "{colors.surface-hover}"
  table-row-selected:
    backgroundColor: "{colors.primary-subtle}"
  table-empty:
    textColor: "{colors.text-tertiary}"
    typography: "{typography.secondary-body}"
  table-loading:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-secondary}"
  table-header:
    height: 41px
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.text-primary}"
    typography: "{typography.table}"
  table-cell:
    height: 41px
    padding: "{spacing.table-y}"
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    typography: "{typography.table}"
  table-row-hover:
    backgroundColor: "{colors.surface-hover}"
  divider-horizontal:
    height: 1px
    backgroundColor: "{colors.border}"
  divider-subtle:
    height: 1px
    backgroundColor: "{colors.border-subtle}"
  divider-strong:
    height: 1px
    backgroundColor: "{colors.border-strong}"
  menu-item:
    height: 40px
    padding: "{spacing.control-inset}"
    rounded: "{rounded.sm}"
    typography: "{typography.body}"
  menu-item-selected:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.primary}"
  breadcrumb-item:
    height: 24px
    typography: "{typography.body}"
    textColor: "{colors.text-secondary}"
  breadcrumb-item-active:
    textColor: "{colors.text-primary}"
  tag:
    height: 24px
    padding: "{spacing.sm}"
    rounded: "{rounded.sm}"
    typography: "{typography.caption}"
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.text-primary}"
  avatar:
    size: 32px
    rounded: "{rounded.full}"
  pagination-item:
    size: 32px
    rounded: "{rounded.sm}"
    typography: "{typography.caption}"
  pagination-item-active:
    backgroundColor: "{colors.primary-subtle}"
    textColor: "{colors.primary}"
  statistic-title:
    typography: "{typography.caption}"
    textColor: "{colors.text-primary}"
  statistic-value:
    typography: "{typography.statistic}"
    textColor: "{colors.text-primary}"
  statistic-unit:
    typography: "{typography.caption}"
    textColor: "{colors.text-secondary}"
  kpi-icon:
    size: 54px
    rounded: "{rounded.full}"
    backgroundColor: "{colors.canvas}"
  modal:
    width: 520px
    rounded: "{rounded.md}"
    backgroundColor: "{colors.surface}"
  modal-header:
    height: 48px
    padding: "{spacing.card}"
  modal-mask:
    backgroundColor: "{colors.mask}"
  drawer:
    rounded: "{rounded.none}"
    backgroundColor: "{colors.surface}"
  drawer-header:
    height: 48px
    padding: "{spacing.md}"
  popup:
    rounded: "{rounded.md}"
    backgroundColor: "{colors.surface}"
  tooltip:
    padding: "{spacing.sm}"
    rounded: "{rounded.sm}"
    backgroundColor: "{colors.tooltip}"
    textColor: "{colors.surface}"
  alert-success:
    backgroundColor: "{colors.success-subtle}"
  alert-warning:
    backgroundColor: "{colors.warning-subtle}"
  alert-error:
    backgroundColor: "{colors.error-subtle}"
  alert-info:
    backgroundColor: "{colors.primary-subtle}"
  status-dot-success:
    backgroundColor: "{colors.success}"
  status-dot-warning:
    backgroundColor: "{colors.warning}"
  status-dot-error:
    backgroundColor: "{colors.error}"
  dark-link:
    typography: "{typography.body}"
    textColor: "{colors.primary-on-dark}"
  dark-button-primary:
    height: 32px
    padding: 15px
    rounded: "{rounded.sm}"
    typography: "{typography.button}"
    backgroundColor: "{colors.primary-on-dark}"
    textColor: "{colors.dark-canvas}"
  dark-shell-content:
    backgroundColor: "{colors.dark-canvas}"
  dark-card:
    backgroundColor: "{colors.dark-surface}"
  dark-popup:
    backgroundColor: "{colors.dark-elevated}"
  dark-text-primary:
    textColor: "{colors.dark-text}"
  dark-text-secondary:
    textColor: "{colors.dark-text-secondary}"
  dark-divider:
    height: 1px
    backgroundColor: "{colors.dark-border}"
---

# JIEAN Design System / IndustrialSteelBlue

## Overview

IndustrialSteelBlue (工业钢蓝) is the industrial style package of the JIEAN Design System. It
describes the 捷安高科 (JIEAN) product family: industrial simulation, training simulation, vocational
education, railway and maritime operations, emergency management, and the dense back-office consoles,
admin shells, data workspaces, approval flows and record management screens around them. It is an
enterprise language before it is a brand: these are screens that are operated all day, often on a
training bench or a shop floor, by people whose job is the data rather than the interface.

**IndustrialSteelBlue is independently produced by JIEAN based on analysis of publicly available
official Arco Design and Arco Design Pro material. It is not an official Arco Design publication,
theme, package, specification or endorsed distribution, and nothing in it implies official
endorsement.** What it is instead: a JIEAN design-system analysis whose measured baselines are Arco
Design 2.66.16 and Arco Design Pro (`arco-design-pro-next` with `@arco-themes/react-arco-pro`), whose
application patterns are read from the running reference application at
`https://react-pro.arco.design/`, and whose colour identity is the deliberate, re-derivable
adaptation documented under [Colors](#colors).

IndustrialSteelBlue is a *style package*, not a component library. It does not ship React components and it is
not a reskin of one. It ships a machine-readable token contract, a written specification of the
enterprise patterns, a small set of framework-independent reference pages that demonstrate those
patterns in plain HTML and CSS, and the reports that show what was inherited, what was derived, what
was observed at runtime, and what JIEAN changed.

Style package names are package names, not commands. IndustrialSteelBlue is never a CLI invocation and never
appears in a shell prompt in this repository. Files under `examples/` are opened from the filesystem
or served by a static server; nothing in this package is installed as a command.

### Two layers, one language

IndustrialSteelBlue is deliberately split into two layers, and every rule in this document belongs to exactly
one of them.

- **Layer A — Arco component-level language.** Colours, the type scale, the radius vocabulary, the
  control geometry, and the tokens of individual components (button, input, card, table, menu,
  modal, drawer, tooltip, tag, pagination, alert). Layer A is *this specification*. It is
  framework-independent: it can be implemented in plain CSS, in React, in Vue, or by hand in a
  design tool, and it will look the same.
- **Layer B — Arco Pro application-shell and business patterns.** The fixed shell (60px top bar,
  220px / 48px collapsible sidebar, `#F2F3F5` content field, 1100px minimum layout width), the
  page shell (20px content padding, breadcrumb, card stack), and the recurring business pages
  (dashboard, search-list, grouped form, record detail) with their composition rules. Layer B is
  *this package's* contribution. It is expressed as patterns over Layer A tokens, not as new tokens
  where Layer A already has the value.

Nothing in this package comes from a stock Arco starter. Arco's own application shell is
deliberately generic; Arco Pro is the shell-and-patterns layer, and that is what is documented here.

### What the name commits us to

工业钢蓝 — "industrial steel blue" — is not a mood board; it is a set of implementation rules that a
screen can fail:

- **Cooler and deeper than a technology blue.** The interactive family sits at hue 210° with 38% of
  the baseline's saturation and, at its core, 78% of the baseline's luminance. A screen that reaches
  for a brighter, more saturated blue has left this language, however good that blue looks alone.
- **Restrained primary use.** `primary` is for primary actions, selected states and high-priority
  interactive emphasis. Large content surfaces stay neutral.
- **Neutral large areas, drawn structure.** Area is carried by `canvas` and `surface`; structure is
  drawn with the three border steps rather than suggested with shadows.
- **Controlled elevation.** Depth is a border or one of the documented shadows. It is never
  decoration.
- **Professional density.** The measured control heights, paddings, row heights and type sizes of the
  baseline are kept. This palette makes a screen calmer, not roomier.

### Arco's design values, operationally

The published Arco design values are **Clear**, **Consistent**, **Rhythmic** and **Open**. Here they
are tests rather than adjectives:

- **Clear** — a screen states what it is in one page title and one primary action, and a dense table
  stays legible because the neutral ramp does the separating, not colour.
- **Consistent** — one radius vocabulary, one control height, one status-colour set, and no per-page
  exceptions: the same component means the same thing on every screen.
- **Rhythmic** — spacing comes from the documented scale, so gutters, card padding and section gaps
  repeat instead of being re-decided per page.
- **Open** — information that belongs together stays visible together: filters above their results,
  actions above the data they act on, no hidden state that silently changes what a control does.

### Two trees, one decision

Enterprise screens in this language are two panes with different jobs:

- **The workspace** — the table, the form, the chart, the record. Wide, horizontally scrollable,
  dense, and built to be scanned and operated rather than read.
- **The rail** — summary cards, shortcuts, notes, activity, metadata. Fixed-width, few items,
  deliberately lower density than the workspace it sits beside.

A screen must decide which tree it is. A record list is a workspace. A record detail is a
workspace with a description block, not a rail. A dashboard is a workspace plus a rail. A form is a
workspace, full width, with a fixed action bar. Mixed trees inside one card are the most common way
an IndustrialSteelBlue screen stops looking like IndustrialSteelBlue.

## Colors

The palette is neutral infrastructure plus one cool, deep, restrained blue for action, and it is
deliberately narrow. Backgrounds are `#FFFFFF` and `#F2F3F5`; text is a four-step grey ramp; borders
are drawn from the same neutral ramp rather than from an unrelated grey; and one blue carries every
primary action, link, selection and focus ring in the product.

### Where the blue comes from

IndustrialSteelBlue does not rename Arco Blue; it adapts it. The adaptation is a documented transform
rather than a choice of taste, so a maintainer can re-derive every value and see which decision moved
it.

The baseline is the `arcoblue` family of Arco Design 2.66.16 — `#165DFF` at step 6, with steps 1-10
and the dark-theme re-mapping as published in the resolved variables of
`@arco-design/web-react@2.66.16/dist/css/arco.css` and defined in
`components/style/theme/color/colors.less` with Arco's own palette generator. Each step then moves by
three rules, and only three:

| Rule | Arco baseline | IndustrialSteelBlue | Why |
|---|---|---|---|
| Hue | 211.3° at step 1, drifting to 229.9° at step 10 | **210°** at every step | cooler than a technology blue, toward treated steel, and never warmer than the baseline |
| Saturation | 100% at the pale end, 88% at the dark end | **38% of that step** | "slightly grey rather than highly saturated": still a blue, no longer glowing |
| Luminance | each step's own WCAG relative luminance | **78% of it at steps 5, 6 and 7**, unchanged at the other seven | deeper and darker where the colour is a brand surface — the interactive core. The pale tints and the deep shades hold their luminance, so their contrast relationships transfer untouched |

| Step | Arco 2.66.16 | IndustrialSteelBlue | Bound role |
|---|---|---|
| 1 | `#E8F3FF` | `#EDF2F7` | `primary-subtle` |
| 2 | `#BEDAFF` | `#CBD9E8` | none — the family is complete so a future role has a step |
| 3 | `#94BFFF` | `#A8C0D8` | `primary-disabled` |
| 4 | `#6AA1FF` | `#83A5C7` | none |
| 5 | `#4080FF` | `#4C7BA9` | `primary-hover` |
| 6 | `#165DFF` | **`#3E6489`** | `primary` |
| 7 | `#0E42D2` | `#324C65` | `primary-active` |
| 8 | `#072CA6` | `#293E54` | none |
| 9 | `#031A79` | `#1B2A39` | none |
| 10 | `#000D4D` | `#0E1720` | none |

The transform is executable rather than descriptive: `node scripts/derive-steel-ramp.mjs` re-derives
the family and the token values, `npm run 9:steel-ramp` fails the build if this document and the
derivation disagree, and the same script writes
[`reports/evidence/palette-derivation.json`](reports/evidence/palette-derivation.json) with the
baseline, the transform and each step's resulting hue, saturation and luminance.

Two consequences are worth stating, because they are what "industrial" means numerically:

- **The blue became easier to read, not harder.** White on a `primary` fill is **6.20:1** where the
  Arco baseline reaches 5.15:1; `primary` as text on `surface` is the same 6.20:1, and on `canvas`
  5.58:1. Darkening the interactive core was necessary precisely because a desaturated blue carries
  more luminance at the same lightness than a saturated one, so the baseline had to move down to keep
  Arco's contrast and then to beat it.
- **Restraint is enforced by the ramp, not by good intentions.** No step of this family is bright
  enough to use as a large decorative surface, which is the point: the family cannot be misused as a
  background wash without a visible accident.

Arco publishes a ten-step neutral ramp and aliases it into role names — the same neutral step is
`--color-border-2` in one place and `--color-fill-3` in another. This document keeps the role names
because they are what a person implementing a screen actually needs, but it is honest about the
aliasing: `border` and `surface-pressed` are the same measured `#E5E6EB`, and `border-subtle` and
`canvas` are the same measured `#F2F3F5`. They are separate tokens because they are separate jobs.

- **Primary** (`#3E6489`) is action and selection only. `primary-hover` (`#4C7BA9`) lightens,
  `primary-active` (`#324C65`) darkens, `primary-disabled` (`#A8C0D8`) is the disabled fill, and
  `primary-subtle` (`#EDF2F7`) is the pale steel tint that carries an active pagination item, an
  informational notice, and a selected tag. Nothing else is blue.
- **Neutral** is a four-step text ramp — `text-primary` `#1D2129`, `text-secondary` `#4E5969`,
  `text-tertiary` `#86909C`, `text-disabled` `#C9CDD4` — over `canvas` `#F2F3F5`, `surface`
  `#FFFFFF`, `surface-hover` `#F7F8FA` and `surface-pressed` `#E5E6EB`.
- **Border** is `border` `#E5E6EB` for structural rules, `border-subtle` `#F2F3F5` for the
  hairline that separates a search area from its results, and `border-strong` `#C9CDD4` for a
  boundary that must survive a low-contrast display.
- **Semantic** colours are inherited from Arco unchanged, and deliberately so: `success` `#00B42A`,
  `warning` `#FF7D00`, `error` `#F53F3F`, each with a `-subtle` tint (`#E8FFEA`, `#FFF7E8`,
  `#FFECE8`) for banner fills. `error` itself is a status colour — a dot, a message, a border — and it
  is not used as a fill behind white text: Arco's red-6 reaches only 3.71:1 against white. Where a
  destructive action needs a solid fill, the ladder continues into the steps of the same red family
  that do reach AA — `error-strong` `#CB272D` (Arco red-7, 5.41:1 with white),
  `error-strong-hover` `#A1151E` (red-8, 7.98:1) and `error-strong-active` `#770813` (red-9, 11.5:1) —
  and that ladder darkens on hover where every other filled control in this language lightens. That is
  the one deliberate exception to the interaction rule, and [Known Gaps](#known-gaps) explains why.
  Status is not brand — a warning that reads as brand emphasis is a
  hazard — so this palette does not pull the status colours toward the blue, and the informational
  notice reuses `primary-subtle` rather than inventing a fifth hue.
- **Interaction states** are fills, not new hues. Hover darkens a filled control one neutral step
  (`surface-pressed`), hover on an unfilled surface lightens one step (`surface-hover`), focus turns
  a filled field white and adds a 1px `primary` border, and disabled uses
  `text-disabled` or `primary-disabled`. There is no opacity-based disabled state and no shadow-based
  elevation on interaction.
- **Overlay** is `mask` `rgba(29, 33, 41, 0.6)` behind a modal and `tooltip` `#1D2129` on the
  tooltip surface itself, which inverts to white text.
- **Dark** anchors (`dark-canvas` `#17171A`, `dark-surface` `#232324`, `dark-elevated` `#373739`,
  `dark-text` `rgba(255,255,255,0.9)`, `dark-text-secondary` `rgba(255,255,255,0.7)`,
  `dark-border` `#484849`) exist so a dark surface is not improvised, and `primary-on-dark`
  (`#628DB8`) is the interactive colour for them. Arco does not invert its ramp in dark mode; it
  re-maps it, and its dark step 6 is lighter than its light step 6. `primary-on-dark` follows that
  behaviour — the same hue and saturation treatment as the light family — and then holds at least
  Arco's dark-theme luminance, raised as far as needed to reach 4.5:1 on `dark-surface`. Measured:
  5.13:1 on `dark-canvas`, 4.50:1 on `dark-surface`, and **3.41:1 on `dark-elevated`**, so a link or
  a button is never drawn on the elevated anchor at body size. These are
  surface anchors and one interactive colour, not a validated dark theme: a screen that renders in
  dark mode must re-check every contrast pair it uses.

## Typography

One Latin-first UI stack with a Simplified-Chinese fallback, and a five-step working scale. The
family is declared once and repeated on every role so a role is usable on its own:

`Inter, -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "noto sans", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif`

The scale is 12 / 13 / 14 / 16 / 20 / 22, and the roles are these:

| Role | Size | Weight | Line height | Used for |
|---|---|---|---|---|
| `page-title` | 20px | 500 | 28px | the one heading that names the screen, inside the first card |
| `section-title` | 16px | 500 | 24px | a group heading such as a card title or a form section name |
| `card-title` | 16px | 500 | 24px | the same measured role, named for card headers |
| `body` | 14px | 400 | 22px | default UI text, table values, descriptions |
| `secondary-body` | 13px | 400 | 20px | rare dense supporting text; part of the Arco scale but uncommon in Pro pages |
| `label` | 14px | 400 | 22px | form labels, in `text-secondary` |
| `caption` | 12px | 400 | 18px | helper text, KPI captions, chart subtitles, badge counters |
| `table` | 14px | 400 | 22px | table headers and cells, with `tnum` |
| `button` | 14px | 400 | 22px | controls |
| `statistic` | 22px | 600 | 33px | KPI numbers, with `tnum` |
| `code` | 13px | 400 | 20px | identifiers, equipment codes and serial numbers, in `Consolas, Menlo, monospace` |

Line heights are px dimensions rather than ratios because they are measured values: the computed
line-height of 14px text is 22.001px (Arco's `@line-height-base: 1.5715`), the 20px welcome title
measures 28px, a 16px card title 24px, the 22px KPI number 33px and 12px captions 18px.
`secondary-body` at 13px has no direct measurement; it follows the same rule rounded to a whole
pixel (13 x 1.5715 -> 20px).

> **Toolchain requirement.** `lineHeight` must be written as a dimension (`22px`), never as a
> unitless multiplier (`1.5715`). Verified against `@google/design.md` 0.4.0: the resolver accepts a
> unitless value with no lint finding and then silently drops it, so the value reaches no export. The
> requirement is re-checked on every run by `npm run 3:verify-generated`.

Three things are load-bearing and easy to get wrong.

1. **Headings stop at 20px.** There is no 28px or 32px page heading anywhere in this language. On a
   list, form or detail screen the largest text on the page is a 16px card title; on a dashboard it
   is the 20px welcome title. Hierarchy above that is carried by the shell — the breadcrumb, the
   sidebar selection — not by type size. A screen that introduces a large hero heading is no longer
   IndustrialSteelBlue.
2. **Weight, not size, does emphasis.** 500 for titles, 600 for KPI numbers, 400 for everything
   else. The only bold text in a table is the header row.
3. **Latin-first fallback order.** The stack resolves to Inter or the platform UI font before
   PingFang SC, so Latin text keeps its designed metrics and Chinese text keeps its native shapes.
   Never reorder this stack, and never substitute a display or serif face for a title.

Numbers that align in columns — table cells, KPI values, totals — set tabular figures (`tnum`).
Prose, labels and headings use proportional figures.

`code` is the one role this package adds to the baseline's scale, and it earns its place because an
industrial record carries identifiers that must not be read as prose: a device number, a tolerance, a
course code. Its family is Arco's own code stack (`@code-family: Consolas, Menlo`) with the generic
`monospace` fallback added so a machine without either face still renders it as code, and its size is
the 13px step that already exists in the scale rather than a new one.

## Layout

The shell is fixed, the content is a scrolling field, and the numbers are exact.

- **Header** — a fixed 60px bar across the full width, `surface` background, a 1px `border` bottom
  rule, and a minimum width of 1100px. It contains the brand block on the left and tools on the
  right. It never scrolls away and never contains a page title.
- **Sidebar** — fixed, full height, `surface` background, 220px expanded and 48px collapsed. It is
  offset by the 60px header so the brand block may sit above it. Two things distinguish it, and both
  are `border`-coloured: a 1px right rule and Arco's light-sider shadow
  `0 2px 5px rgba(0, 0, 0, 0.08)`. The rule is drawn as an absolutely positioned `::after` at
  `right: -1px`, so it lands on x=220 — one pixel *outside* the sidebar's 220px box — and the menu
  column keeps its full 204px. Written as a border on the sidebar itself it would take a pixel off
  every menu item, which is the defect this note exists to prevent. The shadow belongs to the
  sidebar and to nothing else in the shell.
- **Content field** — everything to the right of the sidebar, offset by 60px from the top and 220px
  (or 48px) from the left, filled with `canvas` `#F2F3F5`, and never narrower than 1100px. Below
  1100px the layout scrolls horizontally instead of compressing.
- **Content padding** — `16px 20px 0`: 16px below the header, 20px on both sides, nothing at the
  bottom, because the last card's own margin provides the tail.
- **Breadcrumb** — the first element in the content field, 24px tall, 16px of space beneath it, then
  the first card. It carries the current location: `text-secondary` for the trail, `text-primary` at
  weight 500 for the final segment.
- **Card stack** — sibling cards are separated by 16px. A card is `rounded.md`, `surface`, with 20px
  padding and no border. A dashboard puts a 280px rail beside its workspace with a 16px gap; the
  workspace takes the remaining width.
- **Grid** — a 24-column grid. Page-level gutters are 16px, search forms use 24px, and grouped forms
  use 80px. Gutters come from the grid, never from ad-hoc margins on the controls.

`shell-content` records 1100px under a `width` key because the specification's component vocabulary
has no `minWidth`. It is a **minimum**, never a maximum: content is not centred into it, and a 1440px
window still shows a 1440px-wide content field.

Spacing is a 4px-based scale with three named exceptions: `table-y: 9px` (the table cell's vertical
padding), `form-gutter: 80px` (the grouped-form column gutter), and `search-gutter: 24px` (the search
form gutter). The scale also carries role aliases that resolve to the same numeric step as a
neighbouring token — `table-x` and `md` are both 16px, `card` and `page-x` are both 20px,
`search-gutter` and `lg` are both 24px. That repetition is intentional: it lets a screen say "table
cell padding" or "card padding" and get the measured value without re-deriving it.

## Elevation & Depth

IndustrialSteelBlue is a flat language that uses three depths, and the cheapest one that works.

1. **Flat (default).** Cards, panels, table surfaces, toolbars and statics sit at zero elevation:
   `surface` on `canvas`, or `surface` on `surface` separated by a 1px `border` rule. Static content
   never carries a shadow. If a card needs a shadow to be legible, the boundary underneath it is
   wrong.
2. **Shell (one shadow).** Exactly two shell elements are allowed to cast a shadow: the light
   sidebar (`0 2px 5px rgba(0, 0, 0, 0.08)`), which must read as a plane above the content field,
   and the fixed form action bar (`0 -3px 12px rgba(0, 0, 0, 0.1)`), which must read as a plane
   above the form it covers. These are the only two shadow values in the language.
3. **Overlay (a mask, not a shadow).** A modal uses `modal-mask` `rgba(29, 33, 41, 0.6)` and, in
   Arco Pro, no shadow at all — the dimmed page behind it is the depth cue. A drawer uses the same
   mask. Popups that are not modal (select menus, dropdown menus, date panels) are `surface` at
   `rounded.md` with the small Arco popup shadow `0 4px 10px rgba(0, 0, 0, 0.1)`; they are the only
   non-shell shadows in the product.

The rule follows from the palette: because the language spends contrast on text and a single action
blue, elevation is spent on structure instead. A shadow that is not one of the four values above is
an invention.

## Shapes

The radius vocabulary is five values, and the working vocabulary inside a screen is really two.

| Token | Value | Where it is legitimate |
|---|---|---|
| `none` | 0px | drawers pinned to a viewport edge; full-bleed regions |
| `sm` | 2px | **the default control radius** — buttons, inputs, selects, tags, menu items, pagination items, tooltips, table container corners |
| `md` | 4px | **the default surface radius** — cards, modals, popups, the table container itself |
| `lg` | 8px | present in the Arco scale, used by no IndustrialSteelBlue surface; listed so it is recognised rather than reintroduced |
| `full` | 9999px | a genuinely round object — the avatar and the KPI icon disc |

Two shapes are not radii and must not be confused with them. A **1px hairline** is how the language
draws every boundary: borders, dividers, table rules, the sidebar edge, the header rule. A
**32px-tall pill** is the single large-radius exception in the product: the header search field is a
32px-tall control whose corner radius is half its height. It is legitimate because it is
geometrically a circle-cap on a control, scoped to one element, and it is the only such shape in the
shell. It is not a licence to round buttons, cards or panels.

Rounding is never used to signal state, importance, or clickability, and radii are never mixed inside
one group of sibling controls.

## Components

The per-component values are in the front matter and are authoritative; this section records what
each component is for and which choices are deliberate.

- **Shell (`shell-header`, `shell-sidebar`, `shell-sidebar-collapsed`, `shell-content`,
  `dashboard-rail`).** The fixed frame described in Layout. 60px, 220px, 48px, 1100px minimum,
  280px rail. No component inside the shell may change these.
- **Buttons (`button-primary`, `button-secondary`, `button-outline`, `button-text`,
  `button-danger`).** 32px tall, 15px of horizontal padding, 2px radius, 14px text at weight 400, and
  a hairline border that is transparent on the primary variant. Hover and active variants change
  **only the fill** (`primary-hover`, `primary-active`); they do not change text colour, radius or
  size, and they do not move. Secondary is a `canvas` fill on a white surface — the language's
  "quiet" button. Outline is a transparent fill with a 1px `primary` border and `primary` text, for
  tinted or dark bands; text is the same box with no fill, for row actions and for the third action in
  a toolbar. Danger carries a destructive action: `error` fill with white text, `error-hover` and
  `error-active` on interaction, and never as the default action of a screen. The variant-by-state
  matrix is under [State coverage](#state-coverage).
- **Inputs (`input`, `input-hover`, `input-focus`).** 32px tall, 2px radius, and a **filled** rest
  state: `canvas` `#F2F3F5`, not white and not outlined. Hover presses the fill one step darker
  (`surface-pressed`); focus turns the fill white and adds a 1px `primary` border. This inversion is
  the most characteristic single detail of the language, and swapping it for a white outlined input
  is a visible regression. Placeholder text is `text-tertiary`; disabled text is `text-disabled`. Four
  further states are tokenised so a form does not improvise them: `input-disabled` (the fill does not
  change, the text drops to `control-disabled-text` and hover stops responding), `input-error` (the
  border and the message take `error` while the field keeps its fill), `input-readonly` (the fill plus
  `text-secondary` text say selectable, not editable) and `input-focus`. Select and the pickers reuse
  this whole set; the state matrix is under [State coverage](#state-coverage).
- **Forms (`form-label`, plus the pattern in `docs/forms.md`).** Vertical layout by default: label
  above field, 14px label in `text-secondary`, 8px between label and control, 20px between fields.
  Grouped forms use three 24-column-grid columns with an 80px gutter; search forms use a
  left-aligned label column inside a 24px gutter.
- **Cards (`card`, `card-title`, `card-body`).** The primary container: `surface`, 4px radius, 20px
  padding, no border and no shadow. The title is 16px at weight 500 with 16px beneath it, and there
  is **no divider under a card header** — Arco Pro's card header rule is 0px, and the whitespace is
  the separator.
- **Tables (`table-header`, `table-cell`, `table-row-hover`).** The header is a `canvas` band,
  14px text at weight 500 — the only bold text in the table — with a 1px `border` rule beneath. Cells
  are white, 14px at weight 400, with 9px of vertical and 16px of horizontal padding, so a
  single-line row measures about 41px and wraps to 63px at two lines. Rows hover to `surface-hover`
  and a selected row takes `primary-subtle` — a tint, never a solid blue band; `table-empty` carries
  the empty state in `text-tertiary`, and `table-loading` holds the surface and blocks the row while
  the spinner runs. An expanded parent row takes `canvas` and its children keep white cells, and a
  summary row repeats the header values with a top rule. Density is deliberate: nine pixels, not
  twelve.
- **Menus (`menu-item`, `menu-item-hover`, `menu-item-selected`).** 40px rows, 12px inset, 2px
  radius, 4px between rows, 14px text. Hover is `surface-hover`; a disabled item keeps its box, takes
  `text-disabled` and stops responding to hover. A selected leaf is a `canvas` fill with `primary` text at weight 500; the
  selection is never a blue fill, a left bar, or an outline.
- **Navigation (`breadcrumb-item`, `breadcrumb-item-active`, `pagination-item`,
  `pagination-item-active`).** Breadcrumb segments are 24px, `text-secondary`, with the final
  segment `text-primary` at weight 500. Pagination items are 32px squares at 2px radius with 12px
  text; the active item is `primary-subtle` with `primary` text — a tint, not a solid blue block.
- **Feedback (`alert-*`, `status-dot-*`, `tag`, `modal`, `drawer`, `popup`, `tooltip`).** Status is
  a 6px coloured dot plus a text label, not a coloured pill; `tag` is a neutral `canvas` chip unless
  a semantic tint is genuinely being communicated. Alerts use the `-subtle` tints with `text-primary`
  text. Modals are 520px wide with a 48px header at 20px inset. Tooltips are `tooltip` with a 2px
  radius and 8px of padding, and are the one inverted surface in the language.
- **Data display (`statistic-title`, `statistic-value`, `statistic-unit`, `kpi-icon`).** A KPI is a
  54px `canvas` disc, 12px from a stack of a 12px caption and a 22px/600 value with a 12px unit
  suffix. KPIs are separated by 1px `border-subtle` dividers, not by cards.
- **`dark-*` components.** Surface anchors for a dark rendering plus the two controls a dark surface
  needs — `dark-link` and `dark-button-primary`, both on `primary-on-dark` — described in Colors.
  They are not a validated theme.

### Component coverage

Every component the specification names, and how this package covers it. "Token" means the contract
carries its values; "pattern" means the rules live in `docs/` and the component reuses tokens that
already exist. Coverage is a statement about this specification, not a claim that a component library
ships with it — this package ships no components.

| Category | Component | Coverage | Tokens, or the pattern that carries it |
|---|---|---|---|
| Actions | Button | token + pattern | `button-primary` (+`-hover`, `-active`, `-disabled`), `button-secondary` (+`-hover`), `button-outline`, `button-text`, `button-danger` (+`-hover`, `-active`) |
| Actions | Link | token | `link` |
| Actions | Dropdown action | pattern | a `button-secondary` in a group with `popup`; `docs/search-filter.md` |
| Inputs | Input | token + pattern | `input`, `input-hover`, `input-focus`, `input-disabled`, `input-error`, `input-readonly`, `placeholder-text`, `control-disabled-text`; `docs/forms.md` |
| Inputs | Textarea | pattern | the `input` state tokens; multi-line height and resize rules are prose |
| Inputs | Select | token + pattern | the `input` state tokens; its panel is the slide motion in [Motion](#motion) |
| Inputs | Cascader | pattern | the `input` state tokens; each panel level reuses `popup` |
| Inputs | Date picker | pattern | the `input` state tokens plus `popup` and the slide motion |
| Inputs | Time picker | pattern | the `input` state tokens plus `popup` and the slide motion |
| Inputs | Checkbox | pattern | `primary` for the checked fill, `border` for the box, `primary-disabled` when disabled |
| Inputs | Radio | pattern | the Checkbox treatment; the mark is a 6px dot rather than a check |
| Inputs | Switch | pattern | `primary` on, `surface-pressed` off, no text inside the track |
| Inputs | Form | token + pattern | `form-label`, `spacing.form-gutter`, `spacing.control-inset`; `docs/forms.md` |
| Data display | Tag | token | `tag` |
| Data display | Card | token + pattern | `card`, `card-title`, `card-body`; `docs/cards.md` |
| Data display | Table | token + pattern | `table-header`, `table-cell`, `table-row-hover`, `table-row-selected`, `table-empty`, `table-loading`; `docs/tables.md` |
| Data display | List | pattern | the table's typography and dividers without the header band; `docs/tables.md` |
| Data display | Badge | pattern | `error` fill with `caption` typography; never a floating decoration |
| Data display | Statistic | token | `statistic-title`, `statistic-value`, `statistic-unit`, `kpi-icon`; `docs/data-visualization.md` |
| Data display | Descriptions | pattern | label/value pairs on `text-secondary` and `text-primary`; `docs/cards.md` |
| Navigation | Tabs | pattern | the selected tab reuses the `menu-item-selected` treatment; a tab is never a pill |
| Navigation | Pagination | token | `pagination-item`, `pagination-item-active` |
| Navigation | Menu | token | `menu-item`, `menu-item-hover`, `menu-item-selected` |
| Navigation | Sidebar | token | `shell-sidebar`, `shell-sidebar-collapsed`; `docs/application-shell.md` |
| Navigation | Breadcrumb | token | `breadcrumb-item`, `breadcrumb-item-active` |
| Navigation | Page header | token + pattern | `page-title` typography with `breadcrumb-item*`; `docs/application-shell.md` |
| Navigation | Steps | pattern | `primary` for the current step, `primary-subtle` for a completed one, `border` for the rail |
| Feedback | Message | token + pattern | the `popup` surface with an `alert-*` tint; `docs/feedback.md` |
| Feedback | Notification | token + pattern | the Message treatment plus `card-title` type; `docs/feedback.md` |
| Feedback | Alert | token | `alert-success`, `alert-warning`, `alert-error`, `alert-info` |
| Feedback | Tooltip | token | `tooltip` |
| Feedback | Popover | token | `popup` |
| Feedback | Modal | token | `modal`, `modal-header`, `modal-mask` |
| Feedback | Drawer | token | `drawer`, `drawer-header` |
| Feedback | Progress | pattern | `primary` fill over a `border-subtle` track |
| Feedback | Spin | pattern | `primary` fill, one 1s rotation, see [Motion](#motion) |
| Feedback | Skeleton | pattern | `surface-hover` blocks, no motion, replaced by content in one step |
| Feedback | Empty | token | `table-empty` |

### State coverage

Button, per variant. "Token" means the contract carries the state; "rule" means the state is a
documented reuse of a token that already exists.

| Variant | Default | Hover | Active | Disabled | Focus | Loading |
|---|---|---|---|---|---|---|
| Primary | `button-primary` | `button-primary-hover` | `button-primary-active` | `button-primary-disabled` | rule: a 1px `primary` ring at 2px offset | rule: fill kept, spinner, `pointer-events: none` |
| Secondary | `button-secondary` | `button-secondary-hover` | rule: fill `surface-pressed`, border `primary` | rule: `text-disabled` text, border `border` | rule: as Primary | rule: as Primary |
| Outline | `button-outline` | rule: fill `primary-subtle` | rule: border `primary-disabled` | rule: `text-disabled` text, border `border` | rule: as Primary | rule: as Primary |
| Text | `button-text` | rule: text `primary-hover` | rule: text `primary-active` | rule: text `text-disabled` | rule: as Primary | rule: as Primary |
| Danger | `button-danger` | `button-danger-hover` | `button-danger-active` | rule: fill `error-subtle`, text `text-disabled` | rule: as Primary, ring in `error` | rule: as Primary |

Input and Select share one state set, because a Select is an Input with a panel:

| State | Token | What it means |
|---|---|---|
| Default | `input` | `canvas` fill, `text-primary` text, no border |
| Hover | `input-hover` | fill moves one neutral step to `surface-pressed` |
| Focus | `input-focus` | fill turns white, a 1px `primary` border appears |
| Error | `input-error` | border and message take `error`; the fill does not change |
| Disabled | `input-disabled` | fill unchanged, text `control-disabled-text`, hover stops responding |
| Read-only | `input-readonly` | fill unchanged, `text-secondary` text: selectable, not editable |

Table states, which are what makes the surface usable rather than merely present:

| State | Token, or the rule that carries it |
|---|---|
| Header | `table-header` |
| Body | `table-cell` |
| Hover | `table-row-hover` |
| Selected | `table-row-selected` |
| Expanded | rule: parent row `canvas`, children keep `surface` cells |
| Summary | rule: the `table-header` values with a top `border` rule |
| Empty | `table-empty` |
| Loading | `table-loading` |

## Do's and Don'ts

### Do

- **Do** put every screen inside the fixed shell, with the breadcrumb immediately above the first
  card and the first card beginning 16px below it.
- **Do** build a list or detail screen as a single white card containing the title, the search area,
  the toolbar and the table, exactly as Arco Pro composes it.
- **Do** keep a form a stack of section cards that end with a fixed action bar carrying the submit
  action on the right.
- **Do** give inputs the filled `canvas` rest state and let focus turn them white.
- **Do** express status as a coloured dot plus text, and use the `-subtle` tints for banners.
- **Do** keep 16px between sibling cards, 20px inside a card, 9px/16px inside a table cell, and 80px
  between grouped-form columns.
- **Do** use a 2px radius for controls and a 4px radius for surfaces, and keep a 1px hairline for
  every boundary.
- **Do** keep the page's largest type at 16px on a list, form or detail screen and 20px on a
  dashboard.
- **Do** use `primary` for primary actions, selected navigation states and high-priority interactive
  emphasis, and `primary-on-dark` when the surface is one of the `dark-*` anchors.
- **Do** take a new blue from the documented family — `node scripts/derive-steel-ramp.mjs` — rather
  than from a colour picker; the family is complete from `#EDF2F7` to `#0E1720`.
- **Do** carry status with the status colours and the neutral ramp, and keep `primary` for
  interaction.

### Don't

- **Don't** invent a value a token already holds. If a screen needs 20px of card padding, it needs
  `spacing.card`, not a fresh literal.
- **Don't** add shadows to cards, panels, tables or toolbars. The only shadows in the language are
  the sidebar, the fixed form action bar, and non-modal popups.
- **Don't** mix trees inside one card — no KPI strip above a record table, no rail column inside a
  search-list card.
- **Don't** use the 8px large radius, and don't round anything into a pill except the 32px header
  search field.
- **Don't** replace the filled input with a white outlined input, and don't replace the tinted
  active pagination item with a solid blue block.
- **Don't** introduce a second accent hue, a gradient, a glass effect, or a large soft-radius
  "modern SaaS" surface treatment.
- **Don't** express density through 12px body text or 16px table padding to look airy; the language's
  density is 14px and 9px.
- **Don't** let a disabled control carry a distinct text colour beyond `text-disabled`, and don't
  fake disabled states with opacity.
- **Don't** treat the `dark-*` anchors as a finished dark theme.
- **Don't** replace `primary` with the brighter, more saturated blue a UI framework or component
  library ships by default.
- **Don't** reach for neon, glow, gradient or "high-tech" background treatments to make an industrial
  product look advanced.
- **Don't** fill a table, panel or page background with `primary`. It is a violation of this
  language, not strong emphasis.
- **Don't** pull `success`, `warning` or `error` toward the brand blue, and don't add a second accent
  hue for decoration.

## Motion

Motion in this language is short, and it is always a change of state rather than an introduction. The
values are Arco Design 2.66.16's own (`components/style/theme/default.less` and
`components/style/animation/`), kept unchanged: this package has no motion identity of its own to
express, and inventing one would make a dense operations screen feel less certain than the baseline it
is measured against.

| Duration | Value | Where it is used |
|---|---|---|
| `transition-duration-1` | 0.1s | control hover, focus and press; the loading indicator's opacity |
| `transition-duration-2` | 0.2s | dropdown, select and collapse expansion; panel height; arrow rotation |
| `transition-duration-3` | 0.3s | fade, slide and zoom enter/exit of non-modal popups |
| `transition-duration-4` | 0.4s | modal opacity and transform |
| `transition-duration-5` | 0.5s | present in the baseline; unbound in this package |
| `transition-duration-loading` | 1s | the spinner's rotation period |

| Easing | Value | Where it is used |
|---|---|---|
| `linear` | `cubic-bezier(0, 0, 1, 1)` | hover, focus, and colour or border-colour changes |
| `standard` | `cubic-bezier(0.34, 0.69, 0.1, 1)` | enters: popups, collapse, panel height |
| `overshoot` | `cubic-bezier(0.3, 1.3, 0.3, 1)` | zoom and modal exits, where an element leaves with momentum |
| `decelerate` | `cubic-bezier(0.4, 0.8, 0.74, 1)` | present in the baseline; unbound in this package |
| `accelerate` | `cubic-bezier(0.26, 0, 0.6, 0.2)` | present in the baseline; unbound in this package |

Component mapping, read from the baseline's own component styles:

| Element | Transition | Source |
|---|---|---|
| Button | `all 0.1s linear` | `components/Button/style/index.less` |
| Input, Select, focus rings | `color`, `border-color`, `background-color` at `0.1s linear` | `components/Input/style/index.less` |
| Dropdown, Select panel | `scaleY(0.9) -> scaleY(1)` with opacity, `0.2s standard` | `components/style/animation/slide.less` |
| Popup, tooltip, fade | `opacity` at `0.3s standard` | `components/style/animation/fade.less` |
| Zoom enter / exit | `scale(0.5) -> scale(1)` at `0.3s standard` entering, `0.3s overshoot` leaving | `components/style/animation/zoom.less` |
| Collapse, expand a region | `height` and arrow `transform` at `0.2s standard` | `components/Collapse/style/index.less` |
| Modal | `opacity` and `transform` at `0.4s overshoot` | `components/Modal/style/index.less` |

Rules a screen can be checked against:

- **Hover and focus are 0.1s linear, on the properties that change** — background, border, text. A
  control that animates its size or position on hover has left the language.
- **A popup or panel enters in 0.2-0.3s and a modal in 0.4s.** Nothing in this language takes longer
  than 0.4s to appear, and nothing loops except the loading indicator.
- **Exit motions may overshoot; enters may not.** Arriving should be immediate and certain.
- **A collapsing region animates its height**, so the layout does not jump when it expands.
- **Respect `prefers-reduced-motion`.** The baseline has no such branch; this package adds one as a
  JIEAN accessibility rule — motion is removed, not merely slowed, and the loading indicator keeps a
  static non-motion affordance.

## Responsive Behavior

This is a desktop admin language, and the baseline says so: the reference application declares a
1100px minimum content width and collapses its sidebar rather than dropping it. Responsiveness is
therefore documented as behaviour per range, not as a set of breakpoints to decorate.

Arco's grid breakpoints (`components/Grid/interface.ts`) are the vocabulary:

| Range | Breakpoint | Sidebar | Page padding | Columns |
|---|---|---|---|---|
| Desktop | >= 1200px | expanded, 220px | 20px | grouped forms keep two or three columns; a KPI rail keeps its grid |
| Small desktop | >= 992px | expanded, 220px | 20px | grouped forms fall to two columns; a KPI rail to two |
| Tablet | >= 768px | collapsed, 48px | 16px | one column per form group; a KPI rail to two |
| Mobile | < 768px | overlay, opened from the header | 12px | everything stacks; a table becomes a horizontally scrollable region with its key column pinned |

The desktop and small-desktop rows are the baseline's measured behaviour. The tablet and mobile rows
are this package's extension for JIEAN field and training contexts — the baseline application does not
render below 1100px at all — and they are marked `INFERRED` in
[`reports/source-audit.md`](reports/source-audit.md).

Behaviour that matters more than the numbers:

- **Sidebar** — expanded, then collapsed, then an overlay. It never becomes a bottom bar, and it never
  pushes the content sideways: an overlay sidebar sits above the content with `mask`.
- **Tables** — horizontal scroll first, then pinning the key column, then hiding low-priority columns,
  then stacking. A record is never replaced by a card at a narrow width unless it has fewer than four
  fields, and a pinned column carries the row's identity, never its status.
- **Toolbars** — wrap before they collapse, and a toolbar that hides secondary actions behind an
  overflow menu keeps the primary action visible.
- **Forms** — horizontal labels hold until 992px; below that labels move above their fields and the
  action bar becomes full width.
- **What does not change** — control heights, the 14px body size, the radius vocabulary and the table
  row height are density, not responsiveness. A narrower viewport is not a licence for a looser
  screen.

## Iteration Guide

How to change this package without breaking it.

**The order is fixed: contract first, artifacts second.**

1. Edit `industrial-steel-blue/DESIGN.md`. It is the only source of truth; `tokens/`, `dist/`,
   `examples/*.png` and every report are derived and must never be hand-edited.
2. `npm run 1:validate` — runs the official DESIGN.md linter *and* the JIEAN structural checks
   (required sections and their order, reference resolution, colour syntax, component and state
   coverage, foreign-design-system contamination, legacy naming) for every package, and writes
   `industrial-steel-blue/reports/machine-validation.json`.
3. `npm run 2:export` — regenerates `tokens/tokens.json`, `dist/tokens.css`,
   `dist/tailwind.theme.json`, `dist/tokens.full.css` and `dist/tokens.full.json`.
4. `npm run 3:verify-generated` — checks that every generated artifact exists, is registered and is
   plausible, and runs the contrast audit.
5. `npm run 7:jiean-red-ramp` and `npm run 9:steel-ramp` — fail if the palettes and DESIGN.md have
   drifted apart.
6. `npm run 8:package-diff` — compares this package with its baseline and fails on an undocumented
   difference.
7. `npm run 6:hygiene` — markers, placeholders, link resolution, required files, legacy naming.
8. `npm run check` — steps 2 to 7 in order. This is the gate.
9. `npm run check:visual` — reference captures, metric comparison, and `npm run 10:screenshots` to
   re-render `examples/*.png`. Needs a browser; it is not part of `check`.
10. Update `CHANGELOG.md` and the contract's `version`, then commit.

**Versioning.** `version: alpha` in the frontmatter is the DESIGN.md format's maturity marker, not
the package's release number; the package's release number is `version` in `package.json`, following
SemVer:

| Change | Bump |
|---|---|
| A token value corrected, a doc typo, a broken link | patch |
| A new token, a new documented pattern, a new section | minor |
| A token renamed, removed, or a value changed in a way that alters a rendered screen | major |

**Rules of the loop.**

- Widen a pattern or add a token only with evidence, and record where the evidence came from in
  `reports/source-audit.md` using the classifications `SOURCE_EXACT`, `RUNTIME_OBSERVED`,
  `INFERRED`, `JIEAN_ADAPTED`, `CONFLICTING_SOURCE`, `UNVERIFIED`, `GAP`.
- Never let a generated file become an input. If a value is wrong, fix the contract.
- Never widen this package's scope by editing a pattern document: the pattern documents describe how
  to apply the tokens, not what the tokens are.
- When a JIEAN decision is deliberate rather than inherited — the palette, the dark-theme interactive
  colour, `prefers-reduced-motion`, the mobile rows — say so in the contract and in the audit instead
  of presenting it as Arco's own.

## Known Gaps

Honest boundaries of this package, all of them also listed in
[`reports/source-audit.md`](reports/source-audit.md).

- **Five of the ten family steps are unbound.** Steps 2, 4, 8, 9 and 10 exist so the family is
  complete and so a future role has a step, but no token of this contract uses them. They are
  `INFERRED`, not observed in the baseline as generic-purpose values.
- **Data visualisation keeps the baseline's chart colours.** Charts use Arco's `--blue` family and the
  `arcoblue` steps of the baseline, not this package's industrial family, because a chart series must
  stay distinguishable both from the brand colour and from its neighbours. Whether JIEAN's own
  dashboards need a different series palette is `UNVERIFIED`: no JIEAN chart inventory was audited.
- **The dark surface family is not a dark theme.** `dark-*` anchors plus `primary-on-dark` cover the
  surfaces this contract names; a full dark theme (dark tables, dark cards, dark status colours) is
  not validated here, and a screen that renders in dark mode must re-check every pair it uses.
- **Motion has no token representation.** The DESIGN.md format has no motion token type, so the
  durations and easings in the Motion section exist only as documentation. `dist/tokens.full.json`
  carries them nowhere; a consumer must read the Motion section or
  `reports/evidence/palette-derivation.json`'s sibling documents. The same applies to the z-index
  ladder and to `fontFeature`, which the typography model cannot express and which therefore lives
  inline in the component tokens.
- **Letter spacing is deliberately absent.** The baseline defines no meaningful custom letter spacing
  for these roles, so this package defines none rather than inventing a value to look complete.
- **`prefers-reduced-motion` is a JIEAN addition.** The baseline has no such branch; the rule is
  marked `INFERRED` in the audit.
- **The mobile and tablet responsive rows are extensions.** The baseline application does not render
  below 1100px, so those rows are JIEAN decisions rather than measurements.
- **Example previews are desktop-only.** `examples/*.png` are single 1270x848 renders; they do not
  document narrow, dark or zoomed rendering.
- **The app-shell measurements come from a running application.** The 60px header, 220px/48px
  sidebar, 20px page padding, 16px card gap and 9px/16px table cell padding are read from computed
  styles at 1440x900 in a desktop browser (`RUNTIME_OBSERVED`), not from a published specification,
  and they can move when the reference application is updated.
- **`primary-on-dark` does not reach AA on `dark-elevated` (3.41:1).** The token was solved against
  `dark-surface`, the anchor a text-bearing dark control is drawn on (4.50:1), and it passes on
  `dark-canvas` (5.13:1). The third anchor, `dark-elevated`, is lighter than both and no value in
  this hue reaches 4.5:1 on it while staying recognisably the same blue, so the rule is a
  placement rule rather than a colour: controls that carry text go on `dark-surface`, and
  `dark-elevated` carries text in `dark-text`. Solved properly, that means a second interactive
  colour for elevated dark surfaces — a real gap, not a rounding error.
- **The danger button darkens on hover, unlike every other filled control.** The rule elsewhere in
  this language is "hover lightens one step, active darkens one step", because that is what the
  baseline's own buttons do. It cannot hold for a destructive action: white text on Arco's red-6 is
  3.71:1, and the next step *lighter* than it in the same family is farther from AA, not closer. So
  `button-danger` starts at the darkest step that is still comfortable (`error-strong`, 5.41:1) and
  its hover and active states move further down the ladder (7.98:1, 11.5:1). The deviation is
  deliberate and on the safe side of every contrast pair; a designer who "fixes" it by lightening the
  hover reintroduces the failure.
- **Status tints are the baseline's first steps.** `success-subtle`, `warning-subtle` and
  `error-subtle` are Arco's `-1` steps, kept as they are; they are not derived from this package's
  family and they were not re-tuned for it.

## Reference Sources

Research date: **2026-09-28**. Everything below was read on that date; where a version is pinned, the
pin is the version that was read.

**Primary implementation sources (Arco Design, baseline values)**

| Source | Version / pin | Path or URL |
|---|---|---|
| Arco Design repository | tag `2.66.16`, commit `fbf2ec0a8cc28a5d20f1f82de6c2c4196ef66950` | `https://github.com/arco-design/arco-design` |
| Theme variables (colour, typography, motion, z-index) | as above | `components/style/theme/default.less`, `components/style/theme/color/colors.less` |
| Animation definitions | as above | `components/style/animation/fade.less`, `slide.less`, `zoom.less` |
| Component styles (transition, geometry) | as above | `components/{Button,Input,Select,Modal,Collapse,Drawer,Tooltip,Grid}/style/index.less` |
| Published theme CSS (resolved variables, light and dark) | `@arco-design/web-react@2.66.16` | `https://unpkg.com/@arco-design/web-react@2.66.16/dist/css/arco.css` |
| Grid breakpoints | as above | `components/Grid/interface.ts` |
| Arco Design values (Clear, Consistent, Rhythmic, Open) | tag `2.66.16` | `site/docs_spec/values-of-arcodesign.zh-CN.md` and `.en-US.md` |

**Reference application (patterns and runtime values)**

| Source | Version / pin | Path or URL |
|---|---|---|
| Arco Design Pro repository | no release; `main` at `bb6aebcceca6` (2024-04-26, commit message `2.8.1`) | `https://github.com/arco-design/arco-design-pro` |
| Running reference application | read 2026-09-28 | `https://react-pro.arco.design/` (`/dashboard/workplace`, `/list/search-table`, `/form/group`, `/profile/basic`) |
| Theme package used by the reference application | as available at that date | `@arco-themes/react-arco-pro` |

**Design-system format and tooling**

| Source | Version / pin | Path or URL |
|---|---|---|
| DESIGN.md specification and CLI | release `0.4.0`, `main` at `9bf8eae67128` (2026-07-27) | `https://github.com/google-labs-code/design.md` |
| Local CLI, pinned in this repository | `@google/design.md@0.4.0` | `package.json` devDependencies |

**This package's own derived artifacts**

| Artifact | What it is |
|---|---|
| [`reports/source-audit.md`](reports/source-audit.md) | every token's origin and evidence classification, including the `INFERRED` and `GAP` items above |
| [`reports/machine-validation.json`](reports/machine-validation.json) | machine-readable structural validation of this contract |
| [`reports/designmd-validation.md`](reports/designmd-validation.md) | what the official DESIGN.md linter and exporters do and do not carry |
| [`reports/visual-validation.md`](reports/visual-validation.md) | how the example pages were rendered and measured |
| [`reports/evidence/palette-derivation.json`](reports/evidence/palette-derivation.json) | the baseline, the transform and the derived family |

**Independence.** Arco Design and Arco Design Pro are the work of their own authors and are used here
as a research baseline and as an attribution source. IndustrialSteelBlue is an independent JIEAN
publication: it is not an official Arco Design publication, theme, package, specification or endorsed
distribution, no Arco author reviewed it, and nothing in it implies official endorsement. Names and
trademarks belong to their owners.
