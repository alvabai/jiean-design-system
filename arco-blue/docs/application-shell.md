# Application shell
> **Scope and provenance.** This is JIEAN's own implementation guide for the
> `ArcoBlue` package: it states what this package requires. It is not a
> translation or a restatement of Arco's documentation, and it is not an Arco
> publication. Where a value is labelled *measured* or *Arco*, that is evidence
> about the research baseline recorded in [`../DESIGN.md`](../DESIGN.md)
> (Reference Sources) — not a claim that Arco defines this system.

## Purpose

The shell is the fixed frame every screen lives inside: a 60px top bar, a
220px/48px sidebar, and a scrolling content field filled with `#F2F3F5`. It is
the part of ArcoBlue that is most often rebuilt badly, because a stock
component-library layout is *nearly* right.

Reference implementation: any page in [`../examples/`](../examples/) — the shell
markup is repeated verbatim in each so it can be read in place.

## Structure and values

| Region | Value | Source |
|---|---|---|
| Header height | 60px, including its bottom rule | measured `.arco-layout-header` box, `box-sizing: border-box` |
| Header bottom rule | 1px `border` `#E5E6EB`, painted on row 59 | `NavBar` `border-bottom`; confirmed by decoding reference-dashboard.png at x=700 |
| Header background | `surface` `#FFFFFF` | `--color-bg-2`; confirmed by the same pixel row |
| Sidebar width | 220px expanded, 48px collapsed | Arco Pro `settings.json` `menuWidth` |
| Sidebar background | `surface` `#FFFFFF` | `--color-menu-light-bg` |
| Sidebar right rule | 1px `border` `#E5E6EB`, drawn as a `::after` at `right: -1px` (so it sits at x=220, outside the 220px box) | `@pro-layout` `::after`, measured `rgb(229, 230, 235)` |
| Sidebar shadow | `0 2px 5px rgba(0,0,0,0.08)` | `.arco-layout-sider-light` |
| Content background | `canvas` `#F2F3F5` | `--color-fill-2` |
| Content minimum width | 1100px | Arco Pro `@layout-max-width` |
| Header/sidebar z-index | 100 header, 99 sidebar | upstream |

The header and the sidebar overlap intentionally: the sidebar is offset by the
60px header so the brand block sits in the header row above the menu column. The
brand block is 200px wide with 20px of left padding, which is narrower than the
220px sidebar — that difference is upstream behaviour, not a bug.

## Composition

- **Header left**: brand mark plus product name (20px / 500). Nothing else. The
  header never carries a page title.
- **Header right**: search field, then icon buttons, then the avatar, from left
  to right, with 8px between items. The search field is 196px wide, 32px tall,
  radius 16px — the one pill in the language.
- **Sidebar**: a single scroll container with 8px of padding, so a menu item is
  204px wide inside a 220px sidebar. Menu items are 40px tall, 12px inset, 2px
  radius, 4px apart. A selected leaf is a `canvas` fill with `primary` text at
  weight 500 — never a blue fill, never a left indicator bar.
- **Content**: `padding: 16px 20px 0`. Nothing at the bottom, because the last
  card's own margin supplies the tail.

## States

The shell has almost no states, and that is the point.

| State | Behaviour |
|---|---|
| Sidebar expanded | 220px; the content field is offset 220px |
| Sidebar collapsed | 48px; the content field is offset 48px; menu items show icons only |
| Scrolled content | Header and sidebar do not move; only the content field scrolls |
| Narrow viewport | The layout scrolls horizontally; it does not compress below 1100px |
| Long menu | The sidebar menu column scrolls; the header does not |

There is deliberately no "transparent header on scroll", no collapsing brand, no
auto-hiding sidebar, and no hover-expansion of a collapsed sidebar. Adding any of
those introduces a state the layout contract does not describe.

## Density

The shell contributes three densities, and they are fixed: 60px of vertical
chrome, 220px of horizontal chrome, and a 1100px content minimum. A screen may
not shrink the header to gain vertical space, and may not narrow the sidebar to
gain horizontal space. If a table needs more room, the table scrolls.

## Empty, long and contradictory data

- **Empty content field**: still renders the shell, the breadcrumb, and the first
  card with an explicit empty state. An empty route never renders a bare grey
  field.
- **Long product name**: the 200px brand block truncates with an ellipsis; it
  never pushes the tools out or wraps to a second line.
- **Long user name / avatar fallback**: the header keeps its 32px avatar circle
  and does not grow. An over-long display name belongs in a tooltip or in the
  account menu, not in the header row.
- **Contradictory navigation state**: if the route and the selected menu item
  disagree, the route wins and the menu is re-selected. The shell never shows two
  selected items, and never shows none while a route is active.

## Contrast and accessibility

- The header rule at 1px `border` on `surface` is a non-text boundary; it is a
  structural cue and is permitted to sit below 3:1. It must never be the *only*
  cue for a control's boundary — controls also change fill on hover and focus.
- Menu items reach their contrast through `text-primary` on `surface`
  (≈ 16.13:1) and `primary` on `canvas` when selected (≈ 4.68:1). Both pass AA.
- Sidebar and header text is at least 14px. The 12px caption role is not used in
  the shell except for a menu group label, which is supplementary.
- The collapse control is a real button with an accessible name; icon-only
  header buttons each carry an `aria-label` (see the reference pages).

## Do's and Don'ts

- **Do** keep the shell markup identical across screens. It is chrome, not page
  content.
- **Do** put the breadcrumb as the first content element, 16px above the first
  card.
- **Don't** implement the shell with a second nested fixed layout, or with
  `position: sticky` in place of `fixed`.
- **Don't** add a page title to the header, or drop the header rule to make the
  page look cleaner.
- **Don't** let a collapsed sidebar reveal content behind it; the content offset
  must change with it.
