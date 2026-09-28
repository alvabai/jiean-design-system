# Data visualization

## Purpose

Charts and KPI summaries on ArcoBlue screens. The language is deliberately
restrained here: most "charts" in this system are actually **numbers with a small
graphical frame**, and the palette gives the charts only one accent to work with.

Reference implementation: [`../examples/dashboard.html`](../examples/dashboard.html).

## Structure and values

| Element | Value |
|---|---|
| KPI disc | 54px circle, `canvas` fill, 12px right margin to the text |
| KPI label | 12px caption, `text-secondary` |
| KPI value | 22px / 600 / 1.5, `text-primary`, tabular figures, 33px line box |
| KPI unit | 12px / 400, `text-tertiary`, 8px left of the value |
| KPI separators | 1px `border-subtle`, 60px vertical rule between items |
| KPI row | inside the first card; **not** separate cards |
| Chart container | flush card region, 20px from the card title |
| Chart height | 200–320px; the area chart's plot is ≈ 202px |
| Axis labels | 12px caption, `text-tertiary` |
| Grid lines | 1px `border-subtle`, horizontal only |
| Chart title | 16px / 500 (the card title) |
| Legend | 12px caption, 16px gap, dot swatch 8px |

## Colour

There is exactly one accent in this language, so a chart cannot rely on a
categorical palette. The rules that follow from that constraint:

- **One series**: `primary` at full strength.
- **Two series**: `primary` plus `text-tertiary` `#86909C`. The second series is
  visually lighter, which also encodes that it is secondary.
- **Three or more series**: use `primary` and a single-value ramp of the same hue
  (`primary` `#165DFF`, `primary-hover` `#4080FF`, `primary-disabled` `#94BFFF`),
  always paired with a legend and direct labels. If a chart needs four
  distinguishable hues, it is not a chart this language supports — split it into
  two charts or into a small table.
- **Semantic series** (success/warning/error) may use those three hues, because
  they carry the same meaning they carry everywhere else. Do not use them
  decoratively to get more colours.
- **Area fills** use `primary-subtle` `#E8F3FF`, never a translucent accent.

## Composition

- Every chart is preceded by its numbers. A reader should be able to get the
  point from the KPI row without reading the chart; the chart shows shape, not
  values.
- A chart card has one title, one chart, and optionally one 12px subtitle line.
  No dual axes, no inset panels, no second chart in the corner.
- Axis lines are horizontal only, and there is no chart border and no plot
  background.
- The y-axis starts at zero for bars and areas. A truncated axis on a bar or area
  chart is not permitted; a line chart that must truncate states its range
  explicitly.
- Direct labels are preferred over a legend when there are two series or fewer.

## States

| State | Behaviour |
|---|---|
| Loading | A skeleton block at the chart's real height; the axes are not drawn first |
| Empty | The chart frame is kept with a centred message in `text-tertiary`; the axes stay so the region does not collapse |
| Partial data | The chart draws what it has, and a 12px note in `text-tertiary` states the coverage gap |
| Error | An `error-subtle` banner replaces the plot; the KPI row above stays |
| No permission | The card explains the restriction; it does not render an empty chart |

## Density

Charts get more air than tables because they are read for shape rather than
looked up. The 20px card padding still applies; internal chart padding is at the
implementer's discretion within 8–24px, with 12px caption labels. What is fixed:
the KPI row's 54px disc and 22px value, and the fact that the KPI row lives
inside a card rather than in a row of its own cards.

## Empty, long and contradictory data

- **Empty**: keep the frame and the axes. A collapsed chart region makes a
  dashboard look broken, and destroys the comparison the user was making.
- **Long labels**: category labels truncate with an ellipsis and expose the full
  text in a tooltip. They never rotate to 45° and never shrink below 12px.
- **Long numbers**: use thousand separators and a 万/亿 suffix where appropriate;
  the axis label must fit its gutter. Never abbreviate into ambiguity (`1.2M`
  without a unit is not acceptable in this product).
- **Many categories**: cap at 12 categories; beyond that, group the tail into
  "其他", which is a real category and is labelled as such.
- **Missing data**: gaps are drawn as gaps, not as zero. A zero would be a false
  claim about the data.
- **Contradictory data**: if a series and its KPI total disagree, both are shown
  as given and a `warning` note is added to the chart card stating that the series
  and the summary disagree. The chart never rescales to hide the discrepancy.

## Contrast and accessibility

- KPI value `text-primary` on `surface` ≈ 16.13:1; KPI label `text-secondary` on
  `surface` ≈ 7.10:1; axis labels `text-tertiary` on `surface` ≈ 3.24:1. The axis
  labels are supplementary by design and may sit at that level; every value a
  user must read is in the KPI row or the table, at AA or better.
- A single `primary` series on `surface` is ≈ 5.19:1 — comfortably above the 3:1
  WCAG 1.4.11 threshold for graphical objects.
- The two-series pairing (`primary` + `#86909C`) is separable in greyscale as well
  as by hue, which is what makes a colour-blind-safe default possible with only
  two tones.
- Semantic series colours are never used as the sole encoding: a `warning` series
  is also labelled, and a status is also written in text elsewhere in the card.
- Every chart carries an accessible text equivalent — either a captioned table or
  a concise `aria-label` summary of the trend and its range. A `<canvas>` or
  `<svg>` with no text alternative is not acceptable.

## Do's and Don'ts

- **Do** put the KPI row inside the first card as a row with 54px discs.
- **Do** lead with numbers and let the chart show shape.
- **Do** draw only horizontal grid lines, at 1px `border-subtle`.
- **Don't** invent categorical colours, gradients, glow effects, or 3D.
- **Don't** wrap each KPI in its own bordered card.
- **Don't** truncate a bar or area axis away from zero, or draw missing data
  as zero.
