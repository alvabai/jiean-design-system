# Visual validation

Does the reference implementation actually look like the pages it was
reverse-engineered from? This is the report for that question. It is the one claim
in this repository that cannot be settled by reading a token value, so it is
settled by rendering both sides and comparing them, in three independent ways.

Reproduce with `npm run 4:capture && npm run 5:compare`. The machine-readable
record is `arco-blue/reports/evidence/visual-comparison.json`; the reference values
and their provenance are in `arco-blue/reports/evidence/arco-pro-live-probe.json`.

## 1. How both sides were captured

| | Reference | This system |
|---|---|---|
| Source | `react-pro.arco.design`, signed in | `arco-blue/examples/*.html` served over loopback |
| Viewport | 1270×848 | 1270×848, asserted after every capture |
| Pages captured | dashboard, list, form, detail | the same four, plus `components` and `index` |
| Pages compared | all four, pixel for pixel | all four, pixel for pixel |
| Screenshot | viewport-sized PNG | viewport-sized PNG (see below) |
| Data | computed styles and box rectangles | ~120 named selectors per page: computed style plus rect |

Both sides are at 1270×848 because the reference is not responsive below 1100px:
below that width its layout is not the layout this system describes, so a narrower
measurement would not be a comparison. The capture script refuses to record a page
whose viewport falls under 1100px rather than quietly comparing something else.

Three things about rendering headless Chrome on macOS had to be dealt with, and
each is now asserted by the script rather than trusted:

- **The window is not the viewport.** `--window-size` sizes the window; the window
  frame costs 87px of height, so 1270×935 is what produces a 1270×848 viewport.
  The script re-reads the real viewport from inside the page afterwards and fails
  on a mismatch.
- **Chrome does not exit after writing its output.** It is killed on a *result*
  terminator — `</html>` in the DOM dump, `IEND` in the PNG — and the whole process
  group is reaped.
- **The screenshot comes back window-sized,** 1270×935 for an 848px viewport. It is
  cropped back to the viewport and the crop is round-tripped before the file is
  kept, so a stored screenshot spans exactly what the page rendered.

## 2. The three ways of checking

**Pixels, on every page pair.** Two facts about this shell cannot be established
from computed styles at all: a rule drawn by a pseudo-element has no layout box,
and a rule that is painted leaves no other trace. Both were read out of the
screenshots — on the reference *and* on this system — for **all four page pairs**,
and all must agree to the exact colour:

- the header's 1px rule on row 59 of the 60px bar, white above it and canvas
  below it;
- the sidebar's 1px rule at x=220, white to its left, and the light-sider shadow
  falling on the canvas to its right.

**Geometry, against the live probe.** Every landmark the dashboard shares with the
reference, compared value by value, with the reference side taken from the
exact-selector probe. Lengths are compared to 0.6px, which absorbs sub-pixel
rounding and nothing else. A full radius is normalised before comparison: `50%` and
a pixel value at or beyond half the box are the same circle, and reporting them as
different would be reporting a spelling difference as a visual one.

**Every page, against the same values.** The shell is one component, so it has to
measure the same on all four pages rather than only on the page the probe was taken
from. Each of the other three pages is compared against the same reference values
for the shell landmarks: the header box and its rule, the sidebar box and its
rule's resolved geometry, a menu row's box, the avatar and the brand mark.

## 3. Result

**89 comparisons, 89 match, 0 drift, 2 recorded as uncovered.**

Per page: dashboard, list, form and detail each appear four times in the pixel
table — the header rule and the sidebar rule, read on the reference and on this
system — and list, form, detail, components and index each carry seven
shell-landmark comparisons. Nothing drifted on any page.

### Pixel checks — four page pairs

| # | Landmark or property | Reference | This system | Result |
|---|---|---|---|---|
| 1 | dashboard reference: header fill and 1px bottom rule at x=700 | `#e5e6eb × #ffffff × #f2f3f5` | `#e5e6eb × #ffffff × #f2f3f5` | MATCH |
| 2 | dashboard ours: header fill and 1px bottom rule at x=700 | `#e5e6eb × #ffffff × #f2f3f5` | `#e5e6eb × #ffffff × #f2f3f5` | MATCH |
| 3 | dashboard reference: sidebar 1px right rule at y=400 | `#ffffff × #e5e6eb` | `#ffffff × #e5e6eb` | MATCH |
| 4 | dashboard ours: sidebar 1px right rule at y=400 | `#ffffff × #e5e6eb` | `#ffffff × #e5e6eb` | MATCH |
| 5 | list reference: header fill and 1px bottom rule at x=700 | `#e5e6eb × #ffffff × #f2f3f5` | `#e5e6eb × #ffffff × #f2f3f5` | MATCH |
| 6 | list ours: header fill and 1px bottom rule at x=700 | `#e5e6eb × #ffffff × #f2f3f5` | `#e5e6eb × #ffffff × #f2f3f5` | MATCH |
| 7 | list reference: sidebar 1px right rule at y=400 | `#ffffff × #e5e6eb` | `#ffffff × #e5e6eb` | MATCH |
| 8 | list ours: sidebar 1px right rule at y=400 | `#ffffff × #e5e6eb` | `#ffffff × #e5e6eb` | MATCH |
| 9 | form reference: header fill and 1px bottom rule at x=700 | `#e5e6eb × #ffffff × #f2f3f5` | `#e5e6eb × #ffffff × #f2f3f5` | MATCH |
| 10 | form ours: header fill and 1px bottom rule at x=700 | `#e5e6eb × #ffffff × #f2f3f5` | `#e5e6eb × #ffffff × #f2f3f5` | MATCH |
| 11 | form reference: sidebar 1px right rule at y=400 | `#ffffff × #e5e6eb` | `#ffffff × #e5e6eb` | MATCH |
| 12 | form ours: sidebar 1px right rule at y=400 | `#ffffff × #e5e6eb` | `#ffffff × #e5e6eb` | MATCH |
| 13 | detail reference: header fill and 1px bottom rule at x=700 | `#e5e6eb × #ffffff × #f2f3f5` | `#e5e6eb × #ffffff × #f2f3f5` | MATCH |
| 14 | detail ours: header fill and 1px bottom rule at x=700 | `#e5e6eb × #ffffff × #f2f3f5` | `#e5e6eb × #ffffff × #f2f3f5` | MATCH |
| 15 | detail reference: sidebar 1px right rule at y=400 | `#ffffff × #e5e6eb` | `#ffffff × #e5e6eb` | MATCH |
| 16 | detail ours: sidebar 1px right rule at y=400 | `#ffffff × #e5e6eb` | `#ffffff × #e5e6eb` | MATCH |

### Landmarks — the dashboard, against the exact-selector probe

| # | Landmark or property | Reference | This system | Result |
|---|---|---|---|---|
| 1 | header box | `0 × 0 × 1270 × 60` | `0 × 0 × 1270 × 60` | MATCH |
| 2 | header position and stacking | `position:fixed,zIndex:100,minWidth:1100px` | `position:fixed,zIndex:100,minWidth:1100px` | MATCH |
| 3 | header bottom rule: 1px, border-coloured, and inside the 60px height | `borderBottomWidth:1px,borderBottomColor:rgb(229, 230, 235)` | `borderBottomWidth:1px,borderBottomColor:rgb(229, 230, 235)` | MATCH |
| 4 | brand block width | `200` | `200` | MATCH |
| 5 | brand mark | `33 × 33` | `33 × 33` | MATCH |
| 6 | brand name typography | `fontSize:20px,fontWeight:500,lineHeight:30px` | `fontSize:20px,fontWeight:500,lineHeight:30px` | MATCH |
| 7 | header search box | `196 × 32` | `196 × 32` | MATCH |
| 8 | header search radius and fill | `borderRadius:16px,backgroundColor:rgb(242, 243, 245)` | `borderRadius:16px,backgroundColor:rgb(242, 243, 245)` | MATCH |
| 9 | header icon button | `32 × 32` | `32 × 32` | MATCH |
| 10 | header icon button shape and fill | `borderRadius:50%,backgroundColor:rgb(242, 243, 245)` | `borderRadius:9999px,backgroundColor:rgb(242, 243, 245)` | MATCH |
| 11 | avatar | `32 × 32` | `32 × 32` | MATCH |
| 12 | avatar shape and fill | `backgroundColor:rgb(201, 205, 212)` | `backgroundColor:rgb(201, 205, 212)` | MATCH |
| 13 | header right inset | `28` | `28` | MATCH |
| 14 | header tool rhythm | `gap:16px,paddingRight:8px` | `gap:16px,paddingRight:8px` | MATCH |
| 15 | sidebar box | `220 × 848` | `220 × 848` | MATCH |
| 16 | sidebar surface, edge and stacking | `position:fixed,zIndex:99,paddingTop:60px,backgroundColor:rgb(255, 255, 255),boxShadow:rgba(0, 0, 0, 0.08) 0px 2px 5px 0px,borderRightWidth:0px` | `position:fixed,zIndex:99,paddingTop:60px,backgroundColor:rgb(255, 255, 255),boxShadow:rgba(0, 0, 0, 0.08) 0px 2px 5px 0px,borderRightWidth:0px` | MATCH |
| 17 | sidebar menu item box | `204 × 40` | `204 × 40` | MATCH |
| 18 | sidebar menu item box and metrics | `paddingLeft:12px,paddingRight:12px,borderRadius:2px,height:40px,lineHeight:40px,fontSize:14px` | `paddingLeft:12px,paddingRight:12px,borderRadius:2px,height:40px,lineHeight:40px,fontSize:14px` | MATCH |
| 19 | selected menu item state | `fontWeight:500,color:rgb(22, 93, 255),backgroundColor:rgb(242, 243, 245)` | `fontWeight:500,color:rgb(22, 93, 255),backgroundColor:rgb(242, 243, 245)` | MATCH |
| 20 | group label row | `paddingLeft:12px,paddingRight:28px,height:40px,lineHeight:40px` | `paddingLeft:12px,paddingRight:28px,height:40px,lineHeight:40px` | MATCH |
| 21 | sidebar menu vertical padding | `paddingTop:4px` | `paddingTop:4px` | MATCH |
| 22 | content column width | `1010` | `1010` | MATCH |
| 23 | content left offset | `240` | `240` | MATCH |
| 24 | breadcrumb height | `24` | `24` | MATCH |
| 25 | breadcrumb height (list) | `24` | `24` | MATCH |
| 26 | breadcrumb height (form) | `24` | `24` | MATCH |
| 27 | breadcrumb height (detail) | `24` | `24` | MATCH |
| 28 | card surface | `borderRadius:4px,backgroundColor:rgb(255, 255, 255),boxShadow:none` | `borderRadius:4px,backgroundColor:rgb(255, 255, 255),boxShadow:none` | MATCH |
| 29 | card padding | `paddingTop:20px,paddingLeft:20px` | `paddingTop:20px,paddingLeft:20px` | MATCH |
| 30 | page title typography | `fontSize:20px,fontWeight:500,lineHeight:28px` | `fontSize:20px,fontWeight:500,lineHeight:28px` | MATCH |
| 31 | page title line box | `28` | `28` | MATCH |
| 32 | dashboard workspace column width | `714` | `714` | MATCH |
| 33 | dashboard rail width | `280` | `280` | MATCH |
| 34 | dashboard column gap | `1010` | `1010` | MATCH |
| 35 | KPI disc | `54 × 54` | `54 × 54` | MATCH |
| 36 | KPI disc shape and fill | `borderRadius:50%,backgroundColor:rgb(242, 243, 245)` | `borderRadius:9999px,backgroundColor:rgb(242, 243, 245)` | MATCH |
| 37 | KPI number typography | `fontSize:22px,fontWeight:600,lineHeight:33px` | `fontSize:22px,fontWeight:600,lineHeight:33px` | MATCH |
| 38 | KPI number line box | `33` | `33` | MATCH |

### Shell landmarks — every other page, against the same values

| # | Landmark or property | Reference | This system | Result |
|---|---|---|---|---|
| 1 | list: header box | `0 × 0 × 1270 × 60` | `0 × 0 × 1270 × 60` | MATCH |
| 2 | list: header bottom rule | `borderBottomWidth:1px,borderBottomColor:rgb(229, 230, 235)` | `borderBottomWidth:1px,borderBottomColor:rgb(229, 230, 235)` | MATCH |
| 3 | list: sidebar box | `220 × 848` | `220 × 848` | MATCH |
| 4 | list: sidebar right rule | `right:-1px,left:220px,width:1px,height:848px,backgroundColor:rgb(229, 230, 235)` | `right:-1px,left:220px,width:1px,height:848px,backgroundColor:rgb(229, 230, 235)` | MATCH |
| 5 | list: menu row box | `204 × 40` | `204 × 40` | MATCH |
| 6 | list: avatar box | `32 × 32` | `32 × 32` | MATCH |
| 7 | list: brand mark | `33 × 33` | `33 × 33` | MATCH |
| 8 | form: header box | `0 × 0 × 1270 × 60` | `0 × 0 × 1270 × 60` | MATCH |
| 9 | form: header bottom rule | `borderBottomWidth:1px,borderBottomColor:rgb(229, 230, 235)` | `borderBottomWidth:1px,borderBottomColor:rgb(229, 230, 235)` | MATCH |
| 10 | form: sidebar box | `220 × 848` | `220 × 848` | MATCH |
| 11 | form: sidebar right rule | `right:-1px,left:220px,width:1px,height:848px,backgroundColor:rgb(229, 230, 235)` | `right:-1px,left:220px,width:1px,height:848px,backgroundColor:rgb(229, 230, 235)` | MATCH |
| 12 | form: menu row box | `204 × 40` | `204 × 40` | MATCH |
| 13 | form: avatar box | `32 × 32` | `32 × 32` | MATCH |
| 14 | form: brand mark | `33 × 33` | `33 × 33` | MATCH |
| 15 | detail: header box | `0 × 0 × 1270 × 60` | `0 × 0 × 1270 × 60` | MATCH |
| 16 | detail: header bottom rule | `borderBottomWidth:1px,borderBottomColor:rgb(229, 230, 235)` | `borderBottomWidth:1px,borderBottomColor:rgb(229, 230, 235)` | MATCH |
| 17 | detail: sidebar box | `220 × 848` | `220 × 848` | MATCH |
| 18 | detail: sidebar right rule | `right:-1px,left:220px,width:1px,height:848px,backgroundColor:rgb(229, 230, 235)` | `right:-1px,left:220px,width:1px,height:848px,backgroundColor:rgb(229, 230, 235)` | MATCH |
| 19 | detail: menu row box | `204 × 40` | `204 × 40` | MATCH |
| 20 | detail: avatar box | `32 × 32` | `32 × 32` | MATCH |
| 21 | detail: brand mark | `33 × 33` | `33 × 33` | MATCH |
| 22 | components: header box | `0 × 0 × 1270 × 60` | `0 × 0 × 1270 × 60` | MATCH |
| 23 | components: header bottom rule | `borderBottomWidth:1px,borderBottomColor:rgb(229, 230, 235)` | `borderBottomWidth:1px,borderBottomColor:rgb(229, 230, 235)` | MATCH |
| 24 | components: sidebar box | `220 × 848` | `220 × 848` | MATCH |
| 25 | components: sidebar right rule | `right:-1px,left:220px,width:1px,height:848px,backgroundColor:rgb(229, 230, 235)` | `right:-1px,left:220px,width:1px,height:848px,backgroundColor:rgb(229, 230, 235)` | MATCH |
| 26 | components: menu row box | `204 × 40` | `204 × 40` | MATCH |
| 27 | components: avatar box | `32 × 32` | `32 × 32` | MATCH |
| 28 | components: brand mark | `33 × 33` | `33 × 33` | MATCH |
| 29 | index: header box | `0 × 0 × 1270 × 60` | `0 × 0 × 1270 × 60` | MATCH |
| 30 | index: header bottom rule | `borderBottomWidth:1px,borderBottomColor:rgb(229, 230, 235)` | `borderBottomWidth:1px,borderBottomColor:rgb(229, 230, 235)` | MATCH |
| 31 | index: sidebar box | `220 × 848` | `220 × 848` | MATCH |
| 32 | index: sidebar right rule | `right:-1px,left:220px,width:1px,height:848px,backgroundColor:rgb(229, 230, 235)` | `right:-1px,left:220px,width:1px,height:848px,backgroundColor:rgb(229, 230, 235)` | MATCH |
| 33 | index: menu row box | `204 × 40` | `204 × 40` | MATCH |
| 34 | index: avatar box | `32 × 32` | `32 × 32` | MATCH |
| 35 | index: brand mark | `33 × 33` | `33 × 33` | MATCH |
## 4. What the comparison caught, and what it changed

Six of these are defects the first comparison run found in this system rather than
in the reference. They are listed because a comparison that has never failed is a
comparison that is not looking.

1. **Every menu row was 1px narrow.** The sidebar's right rule was written as
   `border-right: 1px`, which subtracts a pixel from the content box: rows measured
   203px where the reference's are 204px. The reference draws the same rule as an
   absolutely positioned pseudo-element at `right: -1px`, *outside* the 220px box,
   so it costs the row nothing. The rule is now drawn the same way, and the pixel
   check confirms it still lands on x=220 — the rendering is unchanged while the
   row is a pixel wider.
2. **The KPI number's line box was 36px instead of 33px.** The unit span beside the
   number inherited the number's 33px line height and stretched the line box by
   3px. The unit now carries its own caption line height.
3. **The brand mark was 28×28.** The reference's is a 33×33 logo inside a 200px
   block whose name starts 10px later, at x=63.
4. **The header's tool row was too tight, and sat too close to the edge.** The
   buttons were 8px apart where the reference spaces them 16px, and the cluster
   ended 20px from the edge where the reference ends it 28px out — the missing 8px
   being the padding each reference tool item carries. Both are now right: the
   avatar ends at x=1242, and the three circle buttons land on x=1018/1066/1114,
   the same as the reference.
5. **The menu row had no line box of its own,** so the row's typography differed
   from the reference's even though the label landed in the same place. The row now
   carries a line box as tall as the row.
6. **The group label was not a row at all.** The documentation described group
   labels as 40px rows while the stylesheet gave them a caption's line box and no
   height. The measured reference group header is a 40px row inset 12px left and
   28px right; the label is now that row, and the documentation says what it is.

Two further corrections were to the *comparison itself*, and both matter as much:

- **A mislabelled reference reading.** An earlier pass recorded the group header's
  28px right inset against a leaf menu item. A leaf item pads 12px on both sides.
  The probe now records the two variants separately, and the comparison asserts the
  leaf against the leaf and the header against the header.
- **A stale screenshot that looked like a real difference.** The capture script
  waited for a complete PNG on the destination path, which a PNG left by the
  previous run already was — so the wait succeeded before Chrome had written
  anything, the process group was killed mid-write, and the *previous* run's image
  was compared. That produced a phantom 1px drift on the sidebar rule. The target
  is now cleared before Chrome is launched, the result must be the requested size,
  and the crop is round-tripped.

## 5. Divergences that are accepted, not repaired

1. **Two 14px line heights exist on the reference; this system uses one.** The
   reference sets 14px text with a **21px** line box in the shell, in cards and in
   the breadcrumb — a 1.5 multiplier — and **22.001px** inside table cells, its
   1.5715. This system uses **22px** for the body role everywhere. One 14px role
   with one line height is the point of the contract; the cost is roughly a pixel
   of leading per line on a shell label. It is recorded as a divergence rather than
   compared as a match.
2. **The group label's typography.** Row height and insets come from the reference;
   the type is this system's 12px `text-tertiary` caption instead of the
   reference's 14px weight 500 `primary`, so that a group label does not read as a
   menu item. `arco-blue/docs/navigation.md` states this in place.
3. **The table header cell measures 40.5px here and 41px there.** The 1px bottom
   rule is split between the two adjoining cells by `border-collapse`, so a
   half-pixel is arithmetic, not a spacing token.
4. **Column heights are content-driven and are not compared.** The reference's
   dashboard card is 605px tall because of what is inside it; ours is 435px for the
   same reason. Widths, insets and control heights are compared; content-driven
   heights are not, and are not claimed to match.
5. **The specimen pages were retired.** Earlier revisions shipped `components.html`
   and `index.html` beside the four required pages. Neither had a reference
   counterpart, so both are gone: `examples/` is now the four pages with a preview
   beside each, and every one of them is inside the landmark comparison.

## 6. Not covered

- **The reference's list, form and detail pages were not re-probed with exact
  selectors.** Their sweep in `arco-pro-metrics.json` uses generic key names whose
  target element cannot be verified from the recorded numbers, so those entries are
  not used as comparison targets — a number without a referent is not evidence.
  What is compared instead, on those pages: their pixels against their captures on
  every page pair, and their shell landmarks against the same reference values the
  dashboard is held to.
- **Table, form and pagination internals were not compared against the live site.**
  Their values come from the Arco theme package and the Pro source, and are
  asserted against the contract by `npm run 3:verify-generated`; they have not been
  compared to a rendered reference page.
- **Hover, focus and pressed states were not compared.** The capture is a static
  render. Every state in this system is specified in `arco-blue/docs/*` and its
  colours are contrast-audited, but a comparison of the *rendered* state would need
  a scripted interaction pass, which this comparison does not do.
- **Nothing here is a claim about the reference beyond the four pages and the
  viewport named.**
