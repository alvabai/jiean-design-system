---
version: alpha
name: JIEAN Design System / brandcolor
description: Enterprise application shell and data-workspace design language in the JIEAN brand colours. The arcopro package with its colour layer replaced by 捷安红 #D7000F and 深灰 #353535; typography, spacing, radii and component geometry are unchanged.
colors:
  primary: "#D7000F"
  primary-hover: "#FF303F"
  primary-active: "#A80B16"
  primary-disabled: "#FFA4AA"
  primary-subtle: "#FFEEEF"
  canvas: "#F2F3F5"
  surface: "#FFFFFF"
  surface-hover: "#F7F8FA"
  surface-pressed: "#E5E6EB"
  text-primary: "#353535"
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
  error-subtle: "#FFECE8"
  mask: "rgba(53, 53, 53, 0.6)"
  tooltip: "#353535"
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

# JIEAN Design System / brandcolor

## Overview

`brandcolor` is the enterprise application language of the JIEAN design system expressed in the
JIEAN brand colours. It is the sibling package `arcopro` with exactly one layer replaced — the
colour tokens — so a screen built from this document is the same screen, in 捷安红 and 深灰.

The colour layer was derived from two brand values and nothing else: 捷安红 `#D7000F` and
深灰 `#353535`. How the four remaining primary steps were derived, and which roles the brand grey
takes, is stated in Colors; `npm run 7:brand-ramp` re-derives them and fails if the contract drifts.

It covers 捷安高科 (JIEAN) internal software: dense back-office consoles, admin shells, data
workspaces, approval flows and record management screens. Its geometry, type scale and pattern
documents are `arcopro`'s, which was reverse engineered from **Arco Design Pro**
(`@arco-design/arco-design-pro`, the `arco-design-pro-next` application, plus the
`@arco-themes/react-arco-pro` theme package and the Arco Design token layer it builds on) and keeps
Arco's measured values rather than replacing them with generic taste. Its colour layer is the JIEAN
brand palette described in Colors.

`brandcolor` is a *style package*, not a component library. It does not ship React components and it is
not a reskin of one. It ships a machine-readable token contract, a written specification of the
enterprise patterns, a small set of framework-independent reference pages that demonstrate those
patterns in plain HTML and CSS, and the reports that show what was inherited, what was inferred and
what was changed.

Style package names are package names, not commands. `brandcolor` is never a CLI invocation and never
appears in a shell prompt in this repository. Files under `examples/` are opened from the filesystem
or served by a static server; nothing in this package is installed as a command.

### Two layers, one language

`brandcolor` is deliberately split into two layers, and every rule in this document belongs to exactly
one of them.

- **Layer A — Arco component-level language, in the JIEAN palette.** Colours (the brand palette
  described in Colors), the type scale, the radius vocabulary, the
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

### Two trees, one decision

Enterprise screens in this language are two panes with different jobs:

- **The workspace** — the table, the form, the chart, the record. Wide, horizontally scrollable,
  dense, and built to be scanned and operated rather than read.
- **The rail** — summary cards, shortcuts, notes, activity, metadata. Fixed-width, few items,
  deliberately lower density than the workspace it sits beside.

A screen must decide which tree it is. A record list is a workspace. A record detail is a
workspace with a description block, not a rail. A dashboard is a workspace plus a rail. A form is a
workspace, full width, with a fixed action bar. Mixed trees inside one card are the most common way
a `brandcolor` screen stops looking like `brandcolor`.

## Colors

`brandcolor` is the `arcopro` language in the JIEAN brand palette. Typography, spacing, the radius
vocabulary, the component geometry and every pattern document are identical to `arcopro`; only the
eight colour roles below differ, and this section states exactly how they were derived.

The palette is warm-neutral infrastructure plus a single saturated brand red for action, and it is
deliberately narrow. Backgrounds are `#FFFFFF` and `#F2F3F5`; text is a four-step grey ramp whose
darkest step is the brand grey; borders are drawn from the same neutral ramp rather than from an
unrelated grey; and one red carries every primary action, link, selection and focus ring in the
product.

### How the colour layer was derived

Two brand values were given. Nothing else was invented.

| Brand role | Value | Roles it takes |
|---|---|---|
| 捷安红 — JIEAN red (primary) | `#D7000F` | `primary`, plus the four ramp steps derived from it |
| 深灰 — dark grey (secondary) | `#353535` | `text-primary`, `tooltip`, `mask` |

The four derived steps each keep their `arcopro` counterpart's **WCAG relative luminance** and move
the hue to the brand red (`355.8°`) at the counterpart's saturation. Luminance is what every contrast
pair is computed from, so holding it is what lets the accessibility audit keep its conclusions
instead of being re-argued colour by colour.

| Token | arcopro | brandcolor | arcopro luminance | brandcolor luminance |
|---|---|---|---|---|
| `primary` | `#165DFF` | `#D7000F` | 0.1522 | 0.1448 |
| `primary-hover` | `#4080FF` | `#FF303F` | 0.2375 | 0.2373 |
| `primary-active` | `#0E42D2` | `#A80B16` | 0.0864 | 0.0862 |
| `primary-disabled` | `#94BFFF` | `#FFA4AA` | 0.5078 | 0.5071 |
| `primary-subtle` | `#E8F3FF` | `#FFEEEF` | 0.8848 | 0.8864 |

`primary` is the one step that is not luminance-matched, because the brand supplies it as a literal:
its luminance is lower than the blue it replaces, which moves the tightest pairs in the safe
direction — `primary on primary-subtle` from 4.62:1 to 4.81:1, `primary on canvas` from 4.68:1 to
4.86:1, `white on primary fill` from 5.19:1 to 5.39:1 — and leaves the documented exceptions E1–E5
attached to the same pair labels. `npm run 7:brand-ramp` re-derives the four steps and fails if this
table and the frontmatter above disagree.

Arco publishes a ten-step neutral ramp and aliases it into role names — the same neutral step is
`--color-border-2` in one place and `--color-fill-3` in another. This document keeps the role names
because they are what a person implementing a screen actually needs, but it is honest about the
aliasing: `border` and `surface-pressed` are the same measured `#E5E6EB`, and `border-subtle` and
`canvas` are the same measured `#F2F3F5`. They are separate tokens because they are separate jobs.

- **Primary** (`#D7000F`) is action and selection only. `primary-hover` (`#FF303F`) lightens,
  `primary-active` (`#A80B16`) darkens, `primary-disabled` (`#FFA4AA`) is the disabled fill, and
  `primary-subtle` (`#FFEEEF`) is the pale red that carries an active pagination item, an
  informational notice, and a selected tag. Nothing else is red.
- **Neutral** is a four-step text ramp — `text-primary` `#353535`, the brand grey and the darkest
  step in the ramp, then `text-secondary` `#4E5969`, `text-tertiary` `#86909C` and `text-disabled`
  `#C9CDD4` — over `canvas` `#F2F3F5`, `surface` `#FFFFFF`, `surface-hover` `#F7F8FA` and
  `surface-pressed` `#E5E6EB`.
- **Border** is `border` `#E5E6EB` for structural rules, `border-subtle` `#F2F3F5` for the
  hairline that separates a search area from its results, and `border-strong` `#C9CDD4` for a
  boundary that must survive a low-contrast display.
- **Semantic** colours are the Arco set: `success` `#00B42A`, `warning` `#FF7D00`, `error`
  `#F53F3F`, each with a `-subtle` tint (`#E8FFEA`, `#FFF7E8`, `#FFECE8`) for banner fills.
  Informational notices reuse `primary-subtle` rather than inventing a fifth hue — Arco's own
  informational alert resolves to the primary tint.
- **Brand red and status red are different jobs.** `primary` `#D7000F` and `error` `#F53F3F` are
  both red, and this is the one place the palette is easy to misread:
  - `primary` is *identity and action* — a filled button, a link, a selected item, a focus ring.
  - `error` is *status* — a validation message, a destructive action, a failure banner.
  - Their tints are close: `primary-subtle` `#FFEEEF` against `error-subtle` `#FFECE8`, a largest
    channel difference of 7 of 255. A tint is therefore never the only carrier of meaning: an error
    banner carries its text and its icon, and a selected row carries its text weight.
- **Interaction states** are fills, not new hues. Hover darkens a filled control one neutral step
  (`surface-pressed`), hover on an unfilled surface lightens one step (`surface-hover`), focus turns
  a filled field white and adds a 1px `primary` border, and disabled uses
  `text-disabled` or `primary-disabled`. There is no opacity-based disabled state and no shadow-based
  elevation on interaction.
- **Overlay** is `mask` `rgba(53, 53, 53, 0.6)` behind a modal and `tooltip` `#353535` on the
  tooltip surface itself, which inverts to white text.
- **Dark** anchors (`dark-canvas` `#17171A`, `dark-surface` `#232324`, `dark-elevated` `#373739`,
  `dark-text` `rgba(255,255,255,0.9)`, `dark-text-secondary` `rgba(255,255,255,0.7)`,
  `dark-border` `#484849`) are unchanged from `arcopro`: the brand grey takes the light theme's dark
  anchors, not the dark surface ramp. They are surface anchors only: this package does not validate a
  full dark theme, and a screen that renders in dark mode must re-check every contrast pair it uses.

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
   `brandcolor`.
2. **Weight, not size, does emphasis.** 500 for titles, 600 for KPI numbers, 400 for everything
   else. The only bold text in a table is the header row.
3. **Latin-first fallback order.** The stack resolves to Inter or the platform UI font before
   PingFang SC, so Latin text keeps its designed metrics and Chinese text keeps its native shapes.
   Never reorder this stack, and never substitute a display or serif face for a title.

Numbers that align in columns — table cells, KPI values, totals — set tabular figures (`tnum`).
Prose, labels and headings use proportional figures.

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

`brandcolor` is a flat language that uses three depths, and the cheapest one that works.

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
red, elevation is spent on structure instead. A shadow that is not one of the four values above is
an invention.

## Shapes

The radius vocabulary is five values, and the working vocabulary inside a screen is really two.

| Token | Value | Where it is legitimate |
|---|---|---|
| `none` | 0px | drawers pinned to a viewport edge; full-bleed regions |
| `sm` | 2px | **the default control radius** — buttons, inputs, selects, tags, menu items, pagination items, tooltips, table container corners |
| `md` | 4px | **the default surface radius** — cards, modals, popups, the table container itself |
| `lg` | 8px | present in the Arco scale, used by no `brandcolor` surface; listed so it is recognised rather than reintroduced |
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
- **Buttons (`button-primary`, `button-secondary`).** 32px tall, 15px of horizontal padding, 2px
  radius, 14px text at weight 400, and a hairline border that is transparent on the primary variant.
  Hover and active variants change **only the fill** (`primary-hover`, `primary-active`); they do not
  change text colour, radius or size, and they do not move. Secondary is a `canvas` fill on a white
  surface — the language's "quiet" button. A text button (used for row actions) keeps the same box
  and drops the fill entirely.
- **Inputs (`input`, `input-hover`, `input-focus`).** 32px tall, 2px radius, and a **filled** rest
  state: `canvas` `#F2F3F5`, not white and not outlined. Hover presses the fill one step darker
  (`surface-pressed`); focus turns the fill white and adds a 1px `primary` border. This inversion is
  the most characteristic single detail of the language, and swapping it for a white outlined input
  is a visible regression. Placeholder text is `text-tertiary`; disabled text is `text-disabled`.
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
  single-line row measures about 41px and wraps to 63px at two lines. Rows hover to `surface-hover`;
  the last row keeps its bottom rule. Density is deliberate: nine pixels, not twelve.
- **Menus (`menu-item`, `menu-item-selected`).** 40px rows, 12px inset, 2px radius, 4px between
  rows, 14px text. A selected leaf is a `canvas` fill with `primary` text at weight 500; the
  selection is never a solid red fill, a left bar, or an outline.
- **Navigation (`breadcrumb-item`, `breadcrumb-item-active`, `pagination-item`,
  `pagination-item-active`).** Breadcrumb segments are 24px, `text-secondary`, with the final
  segment `text-primary` at weight 500. Pagination items are 32px squares at 2px radius with 12px
  text; the active item is `primary-subtle` with `primary` text — a tint, not a solid red block.
- **Feedback (`alert-*`, `status-dot-*`, `tag`, `modal`, `drawer`, `popup`, `tooltip`).** Status is
  a 6px coloured dot plus a text label, not a coloured pill; `tag` is a neutral `canvas` chip unless
  a semantic tint is genuinely being communicated. Alerts use the `-subtle` tints with `text-primary`
  text. Modals are 520px wide with a 48px header at 20px inset. Tooltips are `tooltip` with a 2px
  radius and 8px of padding, and are the one inverted surface in the language.
- **Data display (`statistic-title`, `statistic-value`, `statistic-unit`, `kpi-icon`).** A KPI is a
  54px `canvas` disc, 12px from a stack of a 12px caption and a 22px/600 value with a 12px unit
  suffix. KPIs are separated by 1px `border-subtle` dividers, not by cards.
- **`dark-*` components.** Surface anchors for a dark rendering, described in Colors. They are not a
  validated theme.

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
  active pagination item with a solid red block.
- **Don't** introduce a second accent hue, a gradient, a glass effect, or a large soft-radius
  "modern SaaS" surface treatment.
- **Don't** express density through 12px body text or 16px table padding to look airy; the language's
  density is 14px and 9px.
- **Don't** let a disabled control carry a distinct text colour beyond `text-disabled`, and don't
  fake disabled states with opacity.
- **Don't** treat the `dark-*` anchors as a finished dark theme.
