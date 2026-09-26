# Responsive behaviour

## Purpose

This document is deliberately short, because the honest answer is short:
**Arco Design Pro is a desktop admin system with one hard layout constraint and no
responsive breakpoints.** Every route was measured at 1270 × 848 with a
`min-width: 1100px` on the content region, and above that width the layout does
not reflow — it grows. Below it, it scrolls.

Stating this precisely matters more than inventing a breakpoint scale. A team
that assumes "responsive" behaviour exists will build a tablet view that was never
specified, and it will look wrong in ways nobody can point to a rule for.

## The measured behaviour

| Condition | Behaviour | Verified |
|---|---|---|
| Viewport ≥ 1100px | Layout grows; the sidebar stays 220px, the header stays 60px, cards stretch | measured at 1270px |
| Viewport < 1100px | The content region holds 1100px and the page scrolls horizontally | measured: the site is unusable below 1100px |
| Content width | `min-width: 1100px` on the content wrapper | contract token `component.shell-content.width` |
| Sidebar | Never collapses automatically; collapse is a user action | `settings.json` + header control |
| Header tools | Never wrap, never hide | measured: fixed 196px search + two 32px buttons + 32px avatar |
| Table | Scrolls horizontally inside its container | pattern rule, [`tables.md`](tables.md) |
| Form grid | Stays at its column count; the page scrolls | pattern rule, [`forms.md`](forms.md) |
| Dashboard rail | Stays 280px; the workspace takes `calc(100% - 296px)` | measured |
| Modal | Fixed 520px, centred | measured |
| Popup / drawer | Widths fixed by the pattern, not by viewport | pattern rules |

There is no `sm`/`md`/`lg`/`xl` scale in the contract, and none is invented here.
The 1100px value is a **minimum**, not a breakpoint: above it nothing changes
qualitatively.

## Why the shell does not reflow

Three reasons, in order of weight:

1. **The density contract assumes width.** A grouped form is three columns on an
   80px gutter; a 9-column table cannot compress. Reflowing to one column would
   either break the gutter or produce a page three times as long, which is a worse
   experience for the data-entry work this product exists for.
2. **The rail is fixed-width, the workspace is fluid.** A dashboard's structure
   (`calc(100% - 296px)` beside 280px) has no second arrangement that preserves
   the reading order of "numbers first, chart second, side content third".
3. **Nothing measured supports another arrangement.** Inventing one would be an
   extrapolation presented as a spec, which this system does not do.

## If a responsive extension is required

An extension is legitimate — it just must be labelled as one. The rules for
adding it:

- Do it in a **layer**, not in the contract. Keep `brandcolor/DESIGN.md` as the
  reverse-engineered desktop truth, and document the extension separately with its
  own breakpoints, so a reader can always tell which rules are measured and which
  are new.
- Preserve the invariants: the shell stays fixed, the sidebar stays 220px or 48px
  (never a third width), density stays at the contract's numbers, and the accent
  budget does not change.
- The first thing to give up is **columns**, in this order: table columns
  (behind horizontal scroll), then form columns (3 → 2 → 1), then the dashboard
  rail (moves below the workspace at full width). The header and sidebar are the
  last things to change, and the sidebar's answer is "collapsed to 48px", never
  "hidden behind a hamburger" — hidden navigation changes the information
  architecture, not just the layout.
- Any extension must re-run the contrast audit for surfaces it introduces, and
  must state its own minimum supported width.

## Empty, long and contradictory data

- **Long values at narrow widths** do not get a special rule: type sizes are
  fixed, so cells wrap and rows grow at every width. Responsive behaviour never
  changes type size.
- **Empty** states are width-independent: the frame is kept and the message is
  centred in whatever width the region has.
- **Contradictory** states are likewise width-independent; a narrow viewport is
  never a reason to hide a conflict.
- **A viewport narrower than the supported minimum** is the one case where the
  system is allowed to do something a wider viewport does not: it scrolls. It must
  not compress, and it must not silently switch to a different layout.

## Contrast and accessibility

- Breakpoint-independent. Contrast does not change with viewport width, and this
  document introduces no new colour pairs.
- **Horizontal scrolling must not remove the keyboard path.** At any width, the
  fixed header and sidebar must remain reachable, and a horizontally scrolling
  content region must be scrollable by keyboard, not only by trackpad.
- **Zoom must not break the layout.** At 200% browser zoom on a 1100px-wide
  window the effective viewport is 550px, so the page scrolls horizontally — that
  is the specified outcome, and it is acceptable because nothing is clipped or
  overlapped. Reflow at 320px CSS width, the strict reading of WCAG 1.4.10, is
  **not** supported by this system; that limitation is stated here rather than
  hidden.
- Touch targets: the smallest control is 24px (the sidebar collapse button), and
  the standard control is 32px. This system assumes a mouse. If a touch surface is
  required, that is part of the responsive extension above.

## Do's and Don'ts

- **Do** treat 1100px as a minimum and scroll below it.
- **Do** keep the sidebar's collapsed width at 48px if you support collapse.
- **Do** label any responsive scale as an extension with its own documentation.
- **Don't** invent breakpoints and present them as the reverse-engineered
  contract.
- **Don't** compress type, drop table columns, or hide navigation to make a narrow
  viewport fit.
- **Don't** assume the layout is fluid at small widths. It is fixed above 1100px
  and scrolling below it.
